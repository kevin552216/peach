"""按本次选择执行馆藏工作，网络与媒体各使用一条有界工作通道。"""
from __future__ import annotations

import copy
import threading
from threading import local
import time
import uuid
from concurrent.futures import ThreadPoolExecutor
from contextvars import copy_context
from pathlib import Path

from filelock import FileLock

from . import library_processing as engine
from .jobs import DiskGuard, JobPaused
from .media_processing_policy import metadata_only
from .processing_control import (ProcessingStopped, bind_control, checkpoint, initial_estimate,
                                 resume_fields, task_control)
from .review_csv import read_rows, write_rows
from .update_tasks import activity

TASKS = ('scan', 'probe', 'metadata', 'covers', 'previews')
LABELS = dict(scan='扫描文件', probe='读取媒体属性', metadata='采集缺失资料', covers='补全封面', previews='生成视频预览')
DEFAULTS = dict(all=TASKS, collect=TASKS[1:], scan=('scan', 'probe'),
                metadata=('metadata', 'covers'), previews=('previews',), probe=('probe',), covers=('covers',))


def selection_for(config, stage, tasks, asset_ids, execution_mode='sequential', defer_suspected_duplicates=False):
    """校验本次工作范围；未指定工作项的既有入口继续使用阶段契约。"""
    if stage not in DEFAULTS:
        raise ValueError('处理阶段无效')
    if execution_mode not in ('sequential', 'parallel'):
        raise ValueError('执行方式无效')
    if type(defer_suspected_duplicates) is not bool:
        raise ValueError('暂缓疑似重复项目选项无效')
    legacy_policy = tasks is None
    chosen = DEFAULTS[stage] if tasks is None else tasks
    if not isinstance(chosen, (list, tuple)) or not chosen or any(type(task) is not str or task not in TASKS for task in chosen):
        raise ValueError('请选择有效的处理项目')
    chosen = [task for task in TASKS if task in chosen]
    if asset_ids is not None and 'scan' in chosen:
        if not legacy_policy:
            raise ValueError('所选影片的任务不能扫描新增文件')
        chosen.remove('scan')
    if 'previews' in chosen and metadata_only(config.directory('state')):
        if not legacy_policy or stage == 'previews':
            raise ValueError('视频预览生成已关闭，请先在媒体库设置中开启')
        chosen.remove('previews')
    return dict(tasks=chosen, execution_mode=execution_mode, defer_suspected_duplicates=defer_suspected_duplicates,
                legacy_policy=legacy_policy)


def process_selected(config, db_path, candidate_root, cover_root, *, selection, **options):
    runner = SelectedProcessing(config, Path(db_path), Path(candidate_root), Path(cover_root), selection, options)
    return runner.run()


class SelectedProcessing:
    """同一任务共享回执和停止意图，各工作通道只逐项领取工作。"""

    def __init__(self, config, db_path, candidate_root, cover_root, selection, options):
        self.config, self.db, self.candidate_root, self.cover_root = config, db_path, candidate_root, cover_root
        self.options, self.selection = options, selection
        self.tasks = list(selection['tasks'])
        self.database = options.get('database')
        if self.database is None and selection['legacy_policy'] and options.get('stage') != 'previews':
            self.tasks = [task for task in self.tasks if task != 'previews']
        selected = engine._validate_processing_request(config, db_path, 'all',
            options.get('asset_ids'), options.get('retry_ids'), self.database)
        self.scope = selected if selected is not None else options.get('retry_ids')
        if 'scan' in self.tasks and self.scope is not None:
            if not selection['legacy_policy']:
                raise ValueError('所选影片的任务不能扫描新增文件')
            self.tasks.remove('scan')
        if 'previews' in self.tasks and self.database is None:
            raise ValueError('生成预览图需要共享馆藏写入连接')
        self.identity = options.get('job_id') or uuid.uuid4().hex
        self.path = Path(options['state_file']) if options.get('state_file') else engine.state_path(config)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.report = options.get('report', lambda state: None)
        self.active = options.get('active', lambda: True)
        self.control = task_control(config, options.get('state_file'))
        self.mode = options.get('speed_mode') or (self.control.mode if self.control else 'standard')
        self.lock = threading.RLock()
        self.cancel = threading.Event()
        self.local = local()
        self.errors = []
        self.rows, self.roots = [], []
        self.covered = []
        self.directory_index = engine._DirectoryIndex()
        self.locations = config.locations if options.get('location', 'configured') == 'configured' else {
            options['location']: config.locations[options['location']]}
        self.state = self.initial_state()
        previous = options.get('resume_state') or {}
        engine._restore_processing_counts(self.state, previous)
        self.checkpoints = engine._LibraryCheckpoints(self.state, previous, self.database)
        self.log = engine._processing_issue_log(config, self.path, self.identity,
            options.get('state_file') is not None, resume=bool(previous))
        self.state['issues_log'] = str(self.log)
        self.remote = None
        self.saved_at = 0.0

    def initial_state(self):
        state = dict(job_id=self.identity, status='running', stage='准备处理', error='',
            requested_stage=self.options.get('stage', 'all'), requested_tasks=list(self.tasks), asset_ids=self.scope,
            execution_mode=self.selection['execution_mode'], defer_suspected_duplicates=self.selection['defer_suspected_duplicates'],
            checked=0, total=0, scanned=0, scanned_bytes=0, probed=0, identified=0, candidates=0, covers=0,
            previews=0, auto_applied=0, auto_rejected=0, issue_count=0, paused_count=0, issue_preview=[],
            issues_truncated=False, notes={}, retryable_asset_ids=[], followups=[], deferred_asset_ids=[],
            started_at=time.time(), last_progress_at=time.time(), progress_seq=0,
            current_asset_id=None, current_asset_name='', current_action='', current_started_at=None, current_deadline_at=None)
        state.update(initial_estimate(self.config, self.db, state['requested_stage'], self.scope, self.mode, tasks=self.tasks))
        state['steps'] = engine._processing_steps(state['requested_stage'], self.scope,
            metadata_only_enabled=metadata_only(self.config.directory('state')), tasks=self.tasks)
        state['work_progress'] = {task: dict(status='pending', done=0, total=0, failed=0, deferred=0) for task in self.tasks}
        return state

    def publish(self, **values):
        """仅发布已经保存的进度；持久快照在同一把锁内复制。"""
        with self.lock:
            resume_fields(self.state, values)
            self.state.update(values)
            self.state['speed_mode'] = self.control.mode if self.control else self.mode
            self.state['last_progress_at'] = time.time()
            self.state['progress_seq'] += 1
            task = getattr(self.local, 'task', None)
            if task in self.state['work_progress']:
                progress = self.state['work_progress'][task]
                if 'checked' in values:
                    progress['done'] = values['checked']
                if 'total' in values:
                    progress['total'] = values['total']
            self.estimate_remaining()
            self.flush(force='status' in values)
            self.report(copy.deepcopy(self.state))

    def estimate_remaining(self):
        """按实际工作项的剩余计数提供整趟任务的粗估范围。"""
        rates = dict(scan=0.2, probe=1.0, metadata=8.0, covers=4.0, previews=12.0)
        self.state['estimate_pending'] = {task: 0 if item['status'] == 'complete' else max(0, item['total'] - item['done'])
            for task, item in self.state['work_progress'].items()}
        if self.state['status'] in ('complete', 'failed', 'cancelled'):
            self.state.update(eta_seconds_min=0, eta_seconds_max=0)
            return
        if not self.rows:
            return
        seconds = sum(max(0, item['total'] - item['done']) * rates[task]
            for task, item in self.state['work_progress'].items() if item['status'] != 'complete')
        seconds *= {'low': 1.8, 'standard': 1.0, 'high': 0.75}[self.state['speed_mode']]
        self.state.update(eta_seconds_min=int(seconds * 0.4), eta_seconds_max=int(seconds * 2.5),
            eta_scope='整趟任务', eta_kind='estimating', eta_initial=True, eta_basis='根据各工作项剩余数量粗估')

    def flush(self, force=False):
        with self.lock:
            if force or time.monotonic() - self.saved_at >= engine.STATE_FLUSH_SECONDS:
                engine._save(self.path, self.state)
                self.saved_at = time.monotonic()

    def update(self, **values):
        engine._require_writer(self.config, self.db)
        checkpoint()
        if self.cancel.is_set() or not self.active():
            raise InterruptedError('处理任务已停止')
        self.guard().check()
        self.publish(**values)

    def guard(self):
        if not hasattr(self.local, 'guard'):
            self.local.guard = DiskGuard(self.config.data_root, 1)
        return self.local.guard

    def issue(self, asset, message, *, action='', retryable=False, paused=False, diagnostics=None):
        with self.lock:
            record = engine._processing_issue_record(asset, message, action, retryable, paused)
            engine._record_issue(self.state, self.log, record, diagnostics=diagnostics)
            task = getattr(self.local, 'task', None)
            if task in self.state['work_progress'] and record['severity'] != 'info':
                self.state['work_progress'][task]['failed'] += 1
            self.publish()

    def task_state(self, task, status):
        with self.lock:
            if status == 'complete':
                progress = self.state['work_progress'][task]
                progress['done'] = progress['total']
            self.state['work_progress'][task]['status'] = status
            for step in self.state['steps']:
                if step['id'] == task:
                    step['status'] = 'current' if status == 'running' else status
            self.publish()

    def run_task(self, task):
        self.local.task = task
        try:
            self.task_state(task, 'running')
            self.update(stage=LABELS[task], checked=0, total=len(self.rows))
            getattr(self, 'do_' + task)()
            self.task_state(task, 'complete')
        except Exception as error:
            with self.lock:
                self.errors.append(error)
                stopped = isinstance(error, ProcessingStopped) or self.control is not None and self.control.stopped
                progress = self.state['work_progress'][task]
                progress['status'] = 'cancelled' if stopped else 'failed'
                progress['failed'] += int(not stopped and not isinstance(error, JobPaused))
                self.flush(force=True)
            self.cancel.set()
            raise

    def discover_roots(self):
        chosen = engine._chosen_asset_paths(self.db, self.scope)
        for source, roots in self.locations.items():
            if self.tasks == ['previews'] and source != 'local':
                continue
            for root in roots:
                self.update()
                path = engine._online_source_root(source, root, chosen, retrying=self.scope is not None, issue=self.issue)
                if path is not None:
                    self.roots.append(path)

    def refresh_rows(self):
        self.rows, self.genres = engine._collection_rows(self.db, locations=self.locations, online_roots=self.roots, asset_ids=self.scope)
        self.pending = engine._processing_workload(self.config, self.rows, self.state['requested_stage'],
            self.database, self.checkpoints.completed['completed_previews'], tasks=self.tasks)
        with self.lock:
            for task, total in self.pending.items():
                self.state['work_progress'][task]['total'] = total

    def run(self):
        with (activity(self.db, 'library-processing'),
              FileLock(str(engine.state_path(self.config)) + '.lock', timeout=0),
              bind_control(self.control, self.identity, publish=self.publish,
                           active=lambda: self.active() and not self.cancel.is_set(), db_path=self.db, mode=self.mode)):
            try:
                self.update()
                self.discover_roots()
                if 'scan' in self.tasks:
                    self.run_task('scan')
                self.refresh_rows()
                self.execute_lanes()
                if self.errors:
                    raise self.errors[0]
                self.finish_metadata_policy()
                self.publish(status='failed' if self.state['issue_count'] else 'complete', stage='处理结束',
                    completed_at=time.time(), current_asset_id=None, current_asset_name='', current_action='',
                    error=engine.issue_summary(self.state['issue_count'], self.state['paused_count']))
            except Exception as error:
                self.settle_interruption(error)
            finally:
                if self.remote is not None:
                    self.remote.close()
                self.flush(force=True)
        return copy.deepcopy(self.state)

    def execute_lanes(self):
        if self.selection['execution_mode'] == 'sequential':
            self.lane([task for task in self.tasks if task != 'scan'])
            return
        network = [task for task in ('metadata', 'covers') if task in self.tasks]
        media = [task for task in ('probe', 'previews') if task in self.tasks]
        with ThreadPoolExecutor(max_workers=2, thread_name_prefix='PeachSelectedWork') as executor:
            futures = [executor.submit(copy_context().run, self.lane, lane) for lane in (network, media) if lane]
            for future in futures:
                try:
                    future.result()
                except Exception:
                    self.cancel.set()

    def finish_metadata_policy(self):
        """阶段入口保留既有字段复核和人物后继；显式工作表只执行选中的项目。"""
        if not self.selection['legacy_policy'] or 'metadata' not in self.tasks:
            return
        metadata = getattr(self, 'metadata', None)
        if metadata is None:
            return
        summary = engine._finish_collection(self.config, self.database, self.candidate_root, self.cover_root,
            metadata.groups, self.get_remote(), asset_ids=self.scope, active=self.active,
            update=self.update, issue=self.issue, watermark=self.checkpoints.entity_watermark, covered=self.covered)
        summary['auto_applied'] = summary.get('auto_applied', 0) + self.state['auto_applied']
        summary['auto_rejected'] = summary.get('auto_rejected', 0) + self.state['auto_rejected']
        self.publish(**summary)

    def lane(self, tasks):
        for task in tasks:
            if self.cancel.is_set():
                return
            self.run_task(task)

    def settle_interruption(self, error):
        if isinstance(error, JobPaused):
            self.publish(waiting_for_update=True, stage='等待安装完成后继续')
            raise error
        cancelled = isinstance(error, ProcessingStopped) or self.control is not None and self.control.stopped
        if self.control is not None and self.control.paused and not cancelled:
            with self.lock:
                for progress in self.state['work_progress'].values():
                    if progress['status'] != 'complete':
                        progress['status'] = 'pending'
            self.publish(status='paused', completed_at=None, followups=[], error='')
            return
        status = 'cancelled' if cancelled else 'failed'
        with self.lock:
            for progress in self.state['work_progress'].values():
                if progress['status'] in ('pending', 'running'):
                    progress['status'] = status
        self.publish(status=status, stage='已停止' if cancelled else '处理未完成', followups=[],
                     completed_at=time.time(), error='' if cancelled else f'{type(error).__name__}: {error}')
        if self.selection['legacy_policy'] and not cancelled:
            raise error

    def do_scan(self):
        scanned = engine._scan_sources(self.config, self.db, locations=self.locations, asset_ids=None, stage='all',
            guard=self.guard(), update=self.update, issue=self.issue, scan_checkpoints=self.state['scan_checkpoints'],
            save_checkpoint=lambda: self.flush(force=True))
        self.publish(scanned=scanned.scanned, scanned_bytes=scanned.scanned_bytes)

    def do_probe(self):
        engine._probe_sources(self.config, self.db, self.locations, self.roots, self.scope, self.update,
                              initial_probed=self.state['probed'])

    def get_remote(self):
        if self.remote is None:
            self.remote = engine._RemoteSession(self.config, self.options.get('provider_factory'),
                engine._MissCache(engine.misses_path(self.config)), retrying=self.options.get('retry_ids') is not None,
                routes=engine.metadata_routes.parse_route_overrides(self.options.get('route_overrides')))
        return self.remote

    def do_metadata(self):
        self.metadata = MetadataWork(self)
        self.metadata.run()

    def do_covers(self):
        listing, jobs = self.directory_index, []
        rows = self.current_rows()
        for row in rows:
            self.update(current_asset_id=row['id'], current_asset_name=row['name'])
            code = engine._provider_code(row['code']) or engine.release_code_from_filename(row['name'])
            video = engine.translate_ledger_path(row['path'])
            _, posters = listing.sidecars(video)
            poster_root = self.cover_root if code else self.config.directory('generated') / 'posters'
            engine._queue_local_poster(video, code or f"{row['id']}_4", poster_root,
                posters=posters, enqueue=lambda source, key, target, row=row: jobs.append((row, source, key, target)))
        engine._read_local_posters(jobs, self.state, update=self.update, issue=self.issue)
        for index, row in enumerate(rows):
            self.update(stage='补全封面', checked=index, total=len(rows))
            code = engine._provider_code(row['code']) or engine.release_code_from_filename(row['name'])
            _, covers = self.get_remote().collect(row, code, [], self.cover_root, update=self.update, issue=self.issue)
            self.covered.append((row['id'], covers))
            self.publish(covers=self.state['covers'] + covers, checked=index + 1)

    def current_rows(self):
        rows, _ = engine._collection_rows(self.db, locations=self.locations, online_roots=self.roots, asset_ids=self.scope)
        return rows

    def do_previews(self):
        rows = self.preview_rows(self.current_rows())
        engine._generate_previews(self.config, rows, self.database, update=self.update, issue=self.issue, guard=self.guard(),
            completed=self.checkpoints.completed['completed_previews'], initial_made=self.state['previews'],
            checkpoint=lambda row: self.checkpoints.mark('completed_previews', row, self.flush))

    def preview_rows(self, rows):
        if not self.selection['defer_suspected_duplicates']:
            return rows
        seen, chosen, deferred = set(), [], []
        for row in rows:
            code = engine._provider_code(row['code']) or engine.release_code_from_filename(row['name'])
            duration, size = row.get('duration'), row.get('size')
            key = (code, size, round(duration, 1)) if code and size and duration and duration > 0 else None
            if key is not None and key in seen and not self.has_preview(row):
                deferred.append(dict(asset_id=row['id'], reason='同番号、大小及已知时长相同，内容尚未核验'))
            else:
                chosen.append(row)
            if key is not None:
                seen.add(key)
        with self.lock:
            self.state['deferred_asset_ids'] = deferred
            self.state['work_progress']['previews']['deferred'] = len(deferred)
        self.publish()
        return chosen

    def has_preview(self, row):
        path = row.get('snapshot_path')
        if not path:
            return False
        root = (self.config.directory('generated') / 'snapshots').resolve()
        path = engine.translate_ledger_path(path)
        return path.is_relative_to(root) and engine.measure_image_file(path) is not None


class MetadataWork:
    """先发布本地字段，再逐项补缺失字段；资料来源缓存由网络通道独占。"""

    def __init__(self, runner):
        self.runner = runner
        self.output = runner.candidate_root / 'library-metadata-field-candidates.csv'
        self.groups = {row['item_key']: row for row in read_rows(self.output, missing_ok=True)}
        self.listing = runner.directory_index
        self.evidence = engine._LocalEvidenceCache(runner.config, runner.db, runner.cover_root,
            self.listing, runner.state, runner.path, include_covers=False,
            issue_count=lambda: runner.state['work_progress']['metadata']['failed'])
        self.dirty = False
        self.saved_at = time.monotonic()

    def publish(self, row, code, local_fields, entries, verify_existing=False):
        if not entries:
            return
        eligible = {field for field in engine.LABELS
                    if self.runner.selection['legacy_policy'] or not row.get(engine.COLUMN_OF.get(field, field))}
        row = engine._candidate_baseline(self.runner.database, row, code, verify_existing)
        retained = {f"asset:{row['id']}:{field}": self.groups.get(f"asset:{row['id']}:{field}")
                    for field in engine.LABELS if field not in eligible}
        for source, document, path in entries:
            engine._merge_candidates(self.groups, row, code, source, document, path, self.runner.genres,
                                     local_fields, verify_existing=verify_existing)
        for key, value in retained.items():
            if value is None:
                self.groups.pop(key, None)
            else:
                self.groups[key] = value
        selected = [item for item in self.groups.values() if str(item.get('asset_id')) == str(row['id']) and item['field'] in eligible]
        result = engine._apply_finished_candidates(self.runner.database, self.runner.candidate_root, self.runner.active,
                                                   [row['id']], selected)
        with self.runner.lock:
            self.runner.state['auto_applied'] += result['applied']
            self.runner.state['auto_rejected'] += result['auto_rejected']
        self.dirty = True
        self.flush()

    def flush(self, force=False):
        if self.dirty and (force or time.monotonic() - self.saved_at >= engine.CANDIDATE_FLUSH_SECONDS):
            write_rows(self.output, engine.FIELDS, self.groups.values(), atomic=True)
            self.dirty = False
            self.saved_at = time.monotonic()
        if not self.dirty:
            with self.runner.lock:
                self.runner.checkpoints.commit_metadata(self.runner.flush)

    def local(self, row):
        if not self.runner.selection['legacy_policy'] and not engine._missing_fields(row):
            return None
        failed_before = self.runner.state['work_progress']['metadata']['failed']
        result = self.evidence.read(row, self.runner.update, self.runner.issue, [])
        if result is None:
            return None
        code, verify_existing, payload, entries = result
        verify_existing = verify_existing and self.runner.selection['legacy_policy']
        fields = engine._fields(payload, self.runner.genres) if payload else {}
        self.publish(row, code, fields, entries, verify_existing)
        local_ok = failed_before == self.runner.state['work_progress']['metadata']['failed']
        return row, code, fields, entries, verify_existing, local_ok

    def run(self):
        runner = self.runner
        rows = list(runner.checkpoints.remaining_metadata(runner.current_rows()))
        prepared = []
        try:
            for index, (_, row) in enumerate(rows):
                runner.update(stage='检查配套文件', checked=index, total=len(rows),
                              current_asset_id=row['id'], current_asset_name=row['name'])
                local = self.local(row)
                if local is not None:
                    prepared.append(local)
                runner.publish(checked=index + 1)
            self.flush(force=True)
            for index, (row, code, fields, entries, verify_existing, local_ok) in enumerate(prepared):
                runner.update(stage='采集缺失资料', checked=index, total=len(prepared),
                              current_asset_id=row['id'], current_asset_name=row['name'])
                issues = runner.state['work_progress']['metadata']['failed']
                missing = list(engine.COLLECTED_FIELDS) if verify_existing else engine._missing_fields(row, fields)
                found, _ = runner.get_remote().collect(row, code, missing, runner.cover_root,
                    update=runner.update, issue=runner.issue, include_covers=False,
                    answered=() if verify_existing else engine._answered_sources(self.groups, f"asset:{row['id']}", missing),
                    received=lambda entries, row=row, code=code, fields=fields, verify=verify_existing:
                        self.publish(row, code, fields, entries, verify))
                with runner.lock:
                    runner.checkpoints.queue_metadata(row, entries + found if local_ok else [], issues,
                        issue_count=runner.state['work_progress']['metadata']['failed'])
                self.flush()
                runner.publish(checked=index + 1, candidates=len(engine._candidate_scope(self.groups, runner.scope)))
        finally:
            self.flush(force=True)
