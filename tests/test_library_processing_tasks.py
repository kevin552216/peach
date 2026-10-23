"""本次任务选择、独立图片工作与双通道安全停点的临时账本回归。"""
import copy
import sqlite3
import tempfile
import threading
import time
import unittest
from contextlib import closing
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import Mock, patch

from PIL import Image

from peach import job_recovery
from peach.library_processing import process_library
from peach.library_processing_tasks import selection_for
from peach.processing_control import checkpoint, control_for
from peach.repository import LedgerDatabase
from peach.settings_file import PeachConfig
from support.ledger import fresh_ledger
from test_metadata_library import stub_provider


class SelectedProcessingTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name).resolve()
        self.media = self.root / 'media'
        self.media.mkdir()
        self.config = PeachConfig(self.root, self.root / 'config.toml', present=True,
                                 locations={'local': (str(self.media),)})
        self.config.directory('database').mkdir()
        self.db = fresh_ledger(self.root / 'database')
        self.database = LedgerDatabase(self.db)
        self.provider = stub_provider()
        self.provider.query.return_value = {'id': 'ABW-358', 'title': '来源标题', 'maker': '厂牌',
            'release_date': '2026-01-01', 'actresses': [{'japanese_name': '测试演员'}], 'genres': ['剧情']}
        self.provider.cover.return_value = False

    def seed(self, count=1, duration=None, title=None):
        with closing(sqlite3.connect(self.db)) as connection, connection:
            for index in range(count):
                video = self.media / f'ABW-358_{index + 1}.mp4'
                video.write_bytes(b'video')
                connection.execute("INSERT INTO asset(location,path,name,medium,size,code,duration,catalog_title) VALUES('local',?,?,'video',5,'ABW-358',?,?)",
                                   (str(video), video.name, duration, title))

    def run_selected(self, tasks, **options):
        return process_library(self.config, self.db, self.root / 'generated', self.root / 'covers',
            database=self.database, tasks=tasks, provider_factory=lambda: self.provider, speed_mode='high', **options)

    def rows(self):
        with closing(sqlite3.connect(self.db)) as connection:
            connection.row_factory = sqlite3.Row
            return [dict(row) for row in connection.execute('SELECT * FROM asset ORDER BY id')]

    def test_probe_and_metadata_have_no_image_work_and_preserve_existing_title(self):
        self.seed(title='人工标题')
        measurement = (123.0, 1920, 1080, 'h264', 24.0, 1, '速食', '横屏', '2K', 1)
        with patch('peach.library_processing._ffprobe_path', return_value='ffprobe'), \
                patch('peach.media_probe.measure', return_value=measurement), \
                patch('peach.library_processing._queue_local_poster') as posters, \
                patch('peach.library_processing._generate_previews') as previews, \
                patch('peach.library_processing._enrich_finished_performers') as profiles, \
                patch('peach.sample_followup.plan') as followups:
            result = self.run_selected(['probe', 'metadata'])
        self.assertEqual(result['status'], 'complete', result)
        self.assertEqual(result['requested_tasks'], ['probe', 'metadata'])
        self.assertEqual(self.rows()[0]['duration'], 123)
        self.assertEqual(self.rows()[0]['catalog_title'], '人工标题')
        self.assertEqual(result['followups'], [])
        self.assertEqual(result['previews'], 0)
        posters.assert_not_called()
        previews.assert_not_called()
        profiles.assert_not_called()
        followups.assert_not_called()
        self.provider.cover.assert_not_called()

    def test_probe_only_skips_registration_and_remote_queries_and_new_job_reuses_measurements(self):
        self.seed()
        measure = Mock(return_value=(70.0, 1280, 720, 'h264', 30.0, 1, '速食', '横屏', '1080P', 1))
        with patch('peach.library_processing._ffprobe_path', return_value='ffprobe'), \
                patch('peach.media_probe.measure', measure), patch('peach.library_processing.scan_location') as scan, \
                patch('peach.library_processing._read_local_metadata') as nfo, \
                patch('peach.library_processing._generate_previews') as previews:
            first = self.run_selected(['probe'])
            second = self.run_selected(['probe'])
        self.assertNotEqual(first['job_id'], second['job_id'])
        self.assertEqual((first['status'], second['status']), ('complete', 'complete'))
        self.assertEqual(measure.call_count, 1)
        scan.assert_not_called()
        nfo.assert_not_called()
        previews.assert_not_called()
        self.provider.query.assert_not_called()
        self.provider.cover.assert_not_called()

    def test_selected_metadata_keeps_optional_original_title_and_series_candidates(self):
        self.seed(duration=30, title='人工标题')
        nfo = self.media / 'ABW-358_1.nfo'
        nfo.write_text('<movie><id>ABW-358</id><title>配套标题</title><originaltitle>原始标题</originaltitle>'
                       '<set><name>系列名称</name></set></movie>', encoding='utf-8')
        result = self.run_selected(['metadata'])
        self.assertEqual(result['status'], 'complete', result)
        from peach.review_csv import read_rows
        candidates = read_rows(self.root / 'generated' / 'library-metadata-field-candidates.csv')
        self.assertIn('original_title', {row['field'] for row in candidates})
        self.assertIn('series', {row['field'] for row in candidates})
        self.assertEqual(self.rows()[0]['catalog_title'], '人工标题')
        self.provider.cover.assert_not_called()

    def test_covers_only_avoids_metadata_and_previews(self):
        self.seed(duration=30)
        with patch('peach.library_processing._read_local_metadata') as metadata, \
                patch('peach.library_processing._generate_previews') as previews:
            result = self.run_selected(['covers'])
        self.assertEqual(result['status'], 'complete', result)
        metadata.assert_not_called()
        previews.assert_not_called()
        self.provider.query.assert_not_called()
        self.provider.cover.assert_called_once()

    def test_previews_only_skips_existing_valid_artifact_without_metadata_or_cover_io(self):
        self.seed(duration=30)
        destination = self.config.directory('generated') / 'snapshots' / 'local' / 'existing.jpg'
        destination.parent.mkdir(parents=True)
        Image.new('RGB', (120, 80), 'white').save(destination)
        with closing(sqlite3.connect(self.db)) as connection, connection:
            connection.execute('UPDATE asset SET snapshot_path=?', (str(destination),))
        with patch('peach.frame_capture.capture_with_retry') as capture, \
                patch('peach.library_processing._read_local_metadata') as metadata:
            result = self.run_selected(['previews'])
        self.assertEqual(result['status'], 'complete', result)
        self.assertEqual(result['previews'], 0)
        capture.assert_not_called()
        metadata.assert_not_called()
        self.provider.query.assert_not_called()
        self.provider.cover.assert_not_called()

    def test_parallel_metadata_completes_while_preview_waits(self):
        self.seed(duration=30)
        entered, release, metadata_done = (threading.Event() for _ in range(3))
        self.addCleanup(release.set)
        results = []
        def preview(*args, **kwargs):
            entered.set()
            release.wait(5)
            checkpoint()
            return 0
        def report(state):
            if state['work_progress'].get('metadata', {}).get('status') == 'complete':
                metadata_done.set()
        with patch('peach.library_processing._generate_previews', side_effect=preview):
            thread = threading.Thread(target=lambda: results.append(self.run_selected(
                ['metadata', 'previews'], execution_mode='parallel', report=report)))
            thread.start()
            try:
                self.assertTrue(entered.wait(3))
                self.assertTrue(metadata_done.wait(3))
                self.assertTrue(thread.is_alive())
                self.assertEqual(self.rows()[0]['catalog_title'], '来源标题')
            finally:
                release.set()
                thread.join(5)
        self.assertFalse(thread.is_alive())
        self.assertEqual(results[0]['status'], 'complete', results)
        self.provider.cover.assert_not_called()

    def test_parallel_stop_waits_for_inflight_media_then_allows_new_probe_job(self):
        self.seed(duration=30)
        entered, release = threading.Event(), threading.Event()
        self.addCleanup(release.set)
        results = []
        def preview(*args, **kwargs):
            entered.set()
            release.wait(5)
            checkpoint()
        with patch('peach.library_processing._generate_previews', side_effect=preview):
            thread = threading.Thread(target=lambda: results.append(self.run_selected(
                ['metadata', 'previews'], execution_mode='parallel', job_id='stop-parallel')))
            thread.start()
            try:
                self.assertTrue(entered.wait(3))
                control_for(self.config).request('stop', 'stop-parallel')
                self.assertTrue(thread.is_alive())
            finally:
                release.set()
                thread.join(5)
        self.assertFalse(thread.is_alive())
        self.assertEqual(results[0]['status'], 'cancelled', results)
        with patch('peach.library_processing._ffprobe_path', return_value=None):
            next_job = self.run_selected(['probe'])
        self.assertEqual(next_job['status'], 'complete', next_job)
        self.assertNotEqual(next_job['job_id'], 'stop-parallel')

    def test_deferral_only_filters_preview_and_can_be_disabled_in_new_job(self):
        self.seed(count=3, duration=120)
        received = []
        def preview(_config, rows, *args, **kwargs):
            received.append([row['id'] for row in rows])
        with patch('peach.library_processing._generate_previews', side_effect=preview), \
                patch('peach.library_processing._ffprobe_path', return_value=None):
            deferred = self.run_selected(['probe', 'previews'], execution_mode='parallel', defer_suspected_duplicates=True)
            normal = self.run_selected(['previews'], defer_suspected_duplicates=False)
        self.assertEqual(deferred['status'], 'complete', deferred)
        self.assertEqual(deferred['work_progress']['previews']['deferred'], 2)
        self.assertEqual([row['asset_id'] for row in deferred['deferred_asset_ids']], [2, 3])
        self.assertEqual(received, [[1], [1, 2, 3]])
        self.assertEqual(normal['work_progress']['previews']['deferred'], 0)
        self.assertEqual(len(self.rows()), 3)

    def test_invalid_selection_and_scoped_scan_are_rejected(self):
        self.seed()
        for tasks in ([], ['unknown'], 'probe', [True]):
            with self.subTest(tasks=tasks), self.assertRaises(ValueError):
                self.run_selected(tasks)
        with self.assertRaises(ValueError):
            self.run_selected(['scan'], asset_ids=[1])
        chosen = selection_for(self.config, 'all', ['metadata', 'probe', 'probe'], None)
        self.assertEqual(chosen['tasks'], ['probe', 'metadata'])

    def test_recovery_request_keeps_tasks_speed_execution_mode_and_deferral(self):
        from peach.jobs import BackgroundJob
        from peach.task_runs import TaskRunStore
        from peach.web_library_processing import w_library_processing
        self.seed()
        job = BackgroundJob('library-processing', runs=TaskRunStore(self.database))
        contract = SimpleNamespace(db_path=self.db, library_processing_job=job, database=self.database,
            candidate_root=self.root / 'generated', cover_root=self.root / 'covers', cache_bust=lambda: None)
        entered, release = threading.Event(), threading.Event()
        self.addCleanup(release.set)
        def work(*args, **kwargs):
            entered.set()
            release.wait(5)
            return dict(status='complete')
        request = dict(stage='all', tasks=['probe', 'metadata'], speed_mode='low', execution_mode='pipeline',
                       defer_suspected_duplicates=True)
        with patch('peach.web_library_processing.settings_file.active', return_value=self.config), \
                patch('peach.web_library_processing.process_library', side_effect=work):
            state = w_library_processing(contract, request)
            self.assertTrue(entered.wait(3))
            saved = job_recovery.read(self.db, 'library-processing')['request']
            self.assertEqual(saved, request)
            self.assertEqual(state['requested_tasks'], ['probe', 'metadata'])
            release.set()
            job.thread.join(5)

    def test_tasks_override_stage_and_sequential_order_keeps_images_after_metadata(self):
        self.seed()
        order = []
        def measure(*args):
            order.append('probe')
            return (75.0, 1280, 720, 'h264', 30.0, 1, '速食', '横屏', '1080P', 1)
        def query(*args, **kwargs):
            order.append('metadata')
            return self.provider.query.return_value
        def cover(*args, **kwargs):
            order.append('covers')
            return False
        self.provider.query.side_effect = query
        self.provider.cover.side_effect = cover
        with patch('peach.library_processing._ffprobe_path', return_value='ffprobe'), \
                patch('peach.media_probe.measure', side_effect=measure), \
                patch('peach.library_processing._generate_previews', side_effect=lambda *args, **kwargs: order.append('previews')):
            result = self.run_selected(['probe', 'metadata', 'covers', 'previews'], stage='probe')
        self.assertEqual(result['status'], 'complete', result)
        self.assertLess(order.index('probe'), order.index('metadata'))
        self.assertLess(order.index('metadata'), order.index('covers'))
        self.assertLess(order.index('covers'), order.index('previews'))

    def test_parallel_pause_releases_both_lanes_with_shared_control_context(self):
        from peach.processing_control import CURRENT
        from peach.update_tasks import current_db
        self.seed(duration=30)
        media_entered, network_entered, advance, paused = (threading.Event() for _ in range(4))
        done = []
        results = []
        def lane(entered, name):
            self.assertIs(CURRENT.get(), control_for(self.config))
            self.assertEqual(current_db.get(), self.db)
            entered.set()
            advance.wait(5)
            checkpoint()
            done.append(name)
        def report(state):
            if state['status'] == 'paused':
                paused.set()
        with patch('peach.library_processing_tasks.MetadataWork.run', side_effect=lambda: lane(network_entered, 'network')), \
                patch('peach.library_processing._generate_previews', side_effect=lambda *a, **kw: lane(media_entered, 'media')):
            thread = threading.Thread(target=lambda: results.append(self.run_selected(
                ['metadata', 'previews'], execution_mode='parallel', job_id='pause-two', report=report)))
            thread.start()
            try:
                self.assertTrue(media_entered.wait(3))
                self.assertTrue(network_entered.wait(3))
                control_for(self.config).request('pause', 'pause-two')
                advance.set()
                self.assertTrue(paused.wait(3))
                self.assertEqual(done, [])
            finally:
                control_for(self.config).request('resume', 'pause-two')
                advance.set()
                thread.join(5)
        self.assertEqual(sorted(done), ['media', 'network'])
        self.assertEqual(results[0]['status'], 'complete', results)

    def test_parallel_failure_cancels_other_lane_and_joins_before_return(self):
        self.seed(duration=30)
        entered, failed, release = (threading.Event() for _ in range(3))
        results = []
        def network():
            entered.wait(5)
            failed.set()
            raise RuntimeError('来源处理失败')
        def media(*args, **kwargs):
            entered.set()
            release.wait(5)
            checkpoint()
        with patch('peach.library_processing_tasks.MetadataWork.run', side_effect=network), \
                patch('peach.library_processing._generate_previews', side_effect=media):
            thread = threading.Thread(target=lambda: results.append(self.run_selected(
                ['metadata', 'previews'], execution_mode='parallel')))
            thread.start()
            try:
                self.assertTrue(failed.wait(3))
                self.assertTrue(thread.is_alive())
                self.assertEqual(results, [])
            finally:
                release.set()
                thread.join(5)
        self.assertFalse(thread.is_alive())
        self.assertEqual(results[0]['status'], 'failed', results)
        self.assertIn('来源处理失败', results[0]['error'])
        self.assertEqual(results[0]['followups'], [])

    def test_paused_service_restart_resumes_original_selection_and_speed(self):
        from peach.jobs import BackgroundJob
        from peach.task_runs import TaskRunStore
        from peach.web_library_processing import w_library_processing, q_library_processing
        self.seed(duration=30)
        runs = TaskRunStore(self.database)
        first = BackgroundJob('library-processing', runs=runs)
        contract = SimpleNamespace(db_path=self.db, library_processing_job=first, database=self.database,
            candidate_root=self.root / 'generated', cover_root=self.root / 'covers', cache_bust=lambda: None)
        entered, advance, paused = (threading.Event() for _ in range(3))
        calls = []
        def media(*args, **kwargs):
            calls.append(control_for(self.config).mode)
            if len(calls) == 1:
                entered.set()
                advance.wait(5)
                checkpoint()
        request = dict(stage='previews', tasks=['previews'], speed_mode='low', execution_mode='parallel',
                       defer_suspected_duplicates=True)
        with patch('peach.web_library_processing.settings_file.active', return_value=self.config), \
                patch('peach.library_processing._generate_previews', side_effect=media):
            state = w_library_processing(contract, request)
            self.assertTrue(entered.wait(3))
            w_library_processing(contract, dict(action='pause', job_id=state['job_id']))
            advance.set()
            deadline = time.monotonic() + 3
            while time.monotonic() < deadline:
                if q_library_processing(contract, {})['status'] == 'paused':
                    paused.set()
                    break
                time.sleep(0.01)
            self.assertTrue(paused.is_set())
            first.stop()
            self.assertEqual(job_recovery.read(self.db, 'library-processing')['request'], request)
            self.assertEqual(q_library_processing(contract, {})['status'], 'paused')
            second = BackgroundJob('library-processing', runs=runs)
            contract.library_processing_job = second
            w_library_processing(contract, dict(action='resume', job_id=state['job_id'],
                tasks=['covers'], execution_mode='sequential', speed_mode='high'))
            second.thread.join(5)
            final = second.snapshot()
        self.assertEqual(final['job_id'], state['job_id'])
        self.assertEqual(final['requested_tasks'], ['previews'])
        self.assertEqual(final['execution_mode'], 'parallel')
        self.assertTrue(final['defer_suspected_duplicates'])
        self.assertEqual(final['status'], 'complete', final)
        self.assertEqual(calls, ['low', 'low'])

    def test_media_issue_does_not_invalidate_metadata_checkpoint(self):
        self.seed(duration=30)
        queried, media_done = threading.Event(), threading.Event()
        payload = copy.deepcopy(self.provider.query.return_value)
        def query(*args, **kwargs):
            queried.set()
            self.assertTrue(media_done.wait(3))
            return payload
        def preview(runner):
            self.assertTrue(queried.wait(3))
            runner.issue(runner.rows[0], '生成预览图失败', action='generating_preview', retryable=True)
            media_done.set()
        self.provider.query.side_effect = query
        with patch('peach.library_processing_tasks.SelectedProcessing.do_previews', preview):
            result = self.run_selected(['metadata', 'previews'], execution_mode='parallel')
        self.assertEqual(result['status'], 'failed')
        self.assertEqual(result['work_progress']['metadata']['failed'], 0)
        self.assertEqual(result['work_progress']['previews']['failed'], 1)
        self.assertEqual(len(result['completed_metadata']), 1)

    def test_parallel_submits_two_lanes_for_many_assets(self):
        from concurrent.futures import ThreadPoolExecutor
        self.seed(count=100, duration=30)
        pools = []
        def create_pool(*args, **kwargs):
            pool = ThreadPoolExecutor(*args, **kwargs)
            pool.submit = Mock(wraps=pool.submit)
            pools.append((kwargs['max_workers'], pool))
            return pool
        with patch('peach.library_processing_tasks.ThreadPoolExecutor', side_effect=create_pool), \
                patch('peach.library_processing_tasks.MetadataWork.run'), \
                patch('peach.library_processing._ffprobe_path', return_value=None), \
                patch('peach.library_processing._generate_previews'):
            result = self.run_selected(['probe', 'metadata', 'previews'], execution_mode='parallel')
        self.assertEqual(result['status'], 'complete', result)
        self.assertEqual(len(pools), 1)
        self.assertEqual(pools[0][0], 2)
        self.assertEqual(pools[0][1].submit.call_count, 2)

    def test_parallel_disk_guard_stops_before_expensive_work_and_preserves_ledger(self):
        self.seed(duration=30)
        readings = []
        def free_space():
            readings.append(1)
            return 10 if len(readings) == 1 else 0
        with patch('peach.jobs.DiskGuard.free_gb', side_effect=free_space), \
                patch('peach.library_processing._generate_previews') as previews:
            result = self.run_selected(['metadata', 'previews'], execution_mode='parallel')
        self.assertEqual(result['status'], 'failed')
        self.assertIn('DiskSpaceDenied', result['error'])
        previews.assert_not_called()
        self.provider.query.assert_not_called()
        with closing(sqlite3.connect(self.db)) as connection:
            self.assertEqual(connection.execute('PRAGMA integrity_check').fetchone()[0], 'ok')
        self.assertEqual(len(self.rows()), 1)

    def test_ready_pipeline_previews_each_asset_before_probing_the_next(self):
        self.seed(count=2)
        events, snapshots = [], []
        def probe(_config, db, _locations, _roots, asset_ids, update, **options):
            self.assertEqual(len(asset_ids), 1)
            identity = asset_ids[0]
            events.append(('probe', identity))
            with closing(sqlite3.connect(db)) as connection, connection:
                connection.execute('UPDATE asset SET duration=123 WHERE id=?', [identity])
            update(probed=options['initial_probed'] + 1)
        def preview(_config, rows, *_args, **_options):
            self.assertEqual(rows[0]['duration'], 123)
            events.append(('preview', rows[0]['id']))
        with patch('peach.library_processing._probe_sources', side_effect=probe), \
                patch('peach.library_processing._generate_previews', side_effect=preview):
            result = self.run_selected(['probe', 'previews'], execution_mode='pipeline', report=snapshots.append)
        self.assertEqual(result['status'], 'complete', result)
        self.assertEqual(events, [('probe', 1), ('preview', 1), ('probe', 2), ('preview', 2)])
        self.assertEqual(result['probed'], 2)
        self.assertEqual(result['work_progress']['probe']['done'], 2)
        self.assertTrue(any(state['work_progress']['probe']['done'] == 1
            and state['work_progress']['previews']['done'] == 1 for state in snapshots))

    def test_ready_pipeline_hands_metadata_to_covers_per_asset(self):
        from peach.library_processing_tasks import MetadataWork
        self.seed(count=2, duration=30)
        events = []
        original = MetadataWork.run_ready
        def metadata(work, row):
            events.append(('metadata', row['id']))
            original(work, row)
        def covers(runner, rows):
            self.assertEqual(rows[0]['catalog_title'], '来源标题')
            events.append(('covers', rows[0]['id']))
        with patch.object(MetadataWork, 'run_ready', metadata), \
                patch('peach.library_processing_tasks.SelectedProcessing.do_covers', covers):
            result = self.run_selected(['metadata', 'covers'], execution_mode='pipeline')
        self.assertEqual(result['status'], 'complete', result)
        self.assertEqual(events, [('metadata', 1), ('covers', 1), ('metadata', 2), ('covers', 2)])
        self.assertEqual(len(result['completed_metadata']), 2)

    def test_ready_pipeline_accumulates_suspected_preview_deferrals(self):
        self.seed(count=3, duration=120)
        received = []
        def preview(_config, rows, *_args, **_options):
            received.extend(row['id'] for row in rows)
        with patch('peach.library_processing._generate_previews', side_effect=preview):
            result = self.run_selected(['previews'], execution_mode='pipeline', defer_suspected_duplicates=True)
        self.assertEqual(result['status'], 'complete', result)
        self.assertEqual(received, [1])
        self.assertEqual([item['asset_id'] for item in result['deferred_asset_ids']], [2, 3])
        self.assertEqual(result['work_progress']['previews'],
            dict(status='complete', done=3, total=3, failed=0, deferred=2))

    def test_ready_pipeline_pause_blocks_the_next_asset_then_resumes(self):
        self.seed(count=2, duration=30)
        entered, advance, paused = (threading.Event() for _ in range(3))
        events, results = [], []
        def probe(_runner, rows):
            events.append(('probe', rows[0]['id']))
        def preview(_runner, rows):
            events.append(('preview', rows[0]['id']))
            entered.set()
            self.assertTrue(advance.wait(5))
            checkpoint()
        def report(state):
            if state['status'] == 'paused':
                paused.set()
        with patch('peach.library_processing_tasks.SelectedProcessing.do_probe', probe), \
                patch('peach.library_processing_tasks.SelectedProcessing.do_previews', preview):
            thread = threading.Thread(target=lambda: results.append(self.run_selected(
                ['probe', 'previews'], execution_mode='pipeline', job_id='ready-pause', report=report)))
            thread.start()
            try:
                self.assertTrue(entered.wait(3))
                control_for(self.config).request('pause', 'ready-pause')
                advance.set()
                self.assertTrue(paused.wait(3))
                self.assertEqual(events, [('probe', 1), ('preview', 1)])
                control_for(self.config).request('resume', 'ready-pause')
            finally:
                advance.set()
                control_for(self.config).request('resume', 'ready-pause')
                thread.join(5)
        self.assertFalse(thread.is_alive())
        self.assertEqual(results[0]['status'], 'complete', results)
        self.assertEqual(events[-2:], [('probe', 2), ('preview', 2)])

    def test_ready_pipeline_stop_joins_inflight_work_and_keeps_metadata(self):
        self.seed(count=2, duration=30)
        entered, advance, saved = (threading.Event() for _ in range(3))
        calls, results = [], []
        def preview(_runner, rows):
            calls.append(rows[0]['id'])
            entered.set()
            self.assertTrue(advance.wait(5))
            checkpoint()
        def report(state):
            if state['auto_applied']:
                saved.set()
        with patch('peach.library_processing_tasks.SelectedProcessing.do_previews', preview):
            thread = threading.Thread(target=lambda: results.append(self.run_selected(
                ['metadata', 'previews'], execution_mode='pipeline', job_id='ready-stop', report=report)))
            thread.start()
            try:
                self.assertTrue(entered.wait(3))
                self.assertTrue(saved.wait(3))
                control_for(self.config).request('stop', 'ready-stop')
                self.assertTrue(thread.is_alive())
            finally:
                advance.set()
                thread.join(5)
        self.assertFalse(thread.is_alive())
        self.assertEqual(results[0]['status'], 'cancelled', results)
        self.assertEqual(calls, [1])
        self.assertEqual(self.rows()[0]['catalog_title'], '来源标题')
        following = self.run_selected(['metadata'], execution_mode='pipeline')
        self.assertEqual(following['status'], 'complete', following)

    def test_ready_pipeline_submits_only_two_bounded_lanes(self):
        from concurrent.futures import ThreadPoolExecutor
        self.seed(count=100, duration=30)
        pools = []
        def create_pool(*args, **kwargs):
            pool = ThreadPoolExecutor(*args, **kwargs)
            pool.submit = Mock(wraps=pool.submit)
            pools.append(pool)
            return pool
        with patch('peach.library_processing_tasks.ThreadPoolExecutor', side_effect=create_pool), \
                patch('peach.library_processing_tasks.MetadataWork.run_ready'), \
                patch('peach.library_processing_tasks.SelectedProcessing.do_previews'):
            result = self.run_selected(['metadata', 'previews'], execution_mode='pipeline')
        self.assertEqual(result['status'], 'complete', result)
        self.assertEqual(len(pools), 1)
        self.assertEqual(pools[0].submit.call_count, 2)

    def test_ready_pipeline_row_lookup_failure_is_not_a_successful_job(self):
        self.seed(duration=30)
        with patch('peach.library_processing_tasks.SelectedProcessing.current_rows', side_effect=OSError('无法读取当前资产')):
            result = self.run_selected(['probe'], execution_mode='pipeline')
        self.assertEqual(result['status'], 'failed', result)
        self.assertIn('无法读取当前资产', result['error'])
        self.assertEqual(result['work_progress']['probe']['status'], 'failed')

    def test_ready_pipeline_can_stop_while_skipping_an_unavailable_asset(self):
        self.seed(count=2, duration=30)
        calls = []
        def missing(_runner, asset_ids=None):
            calls.append(asset_ids)
            control_for(self.config).request('stop', 'missing-stop')
            return []
        with patch('peach.library_processing_tasks.SelectedProcessing.current_rows', missing):
            result = self.run_selected(['probe'], execution_mode='pipeline', job_id='missing-stop')
        self.assertEqual(result['status'], 'cancelled', result)
        self.assertEqual(calls, [[1]])
        self.assertEqual(result['work_progress']['probe']['failed'], 0)

    def test_ready_pipeline_lookup_failure_immediately_releases_the_other_lane(self):
        from peach.library_processing_tasks import SelectedProcessing
        self.seed(duration=30)
        entered, released = threading.Event(), threading.Event()
        original = SelectedProcessing.current_rows
        def lookup(runner, asset_ids=None):
            if runner.local.task == 'previews':
                self.assertTrue(entered.wait(3))
                raise OSError('当前资产读取失败')
            return original(runner, asset_ids)
        def metadata(work, row):
            entered.set()
            self.assertTrue(work.runner.cancel.wait(2), '媒体通道失败必须即时通知网络通道')
            released.set()
            work.runner.update()
        with patch.object(SelectedProcessing, 'current_rows', lookup), \
                patch('peach.library_processing_tasks.MetadataWork.run_ready', metadata):
            result = self.run_selected(['metadata', 'previews'], execution_mode='pipeline')
        self.assertEqual(result['status'], 'failed', result)
        self.assertIn('当前资产读取失败', result['error'])
        self.assertTrue(released.is_set())
