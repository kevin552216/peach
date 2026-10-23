"""完整文件 SHA256 校验与人工保留决定；证据留在本机状态目录。"""
from collections import defaultdict
import hashlib
import json
import os
from pathlib import Path
import time

from filelock import FileLock

from .catalog_rules import is_jav_code, normalise_code_key
from .fsutil import atomic_write_text
from .platform import location_mounts, location_roots, translate_ledger_path, within_root


def _path(contract):
    return Path(contract.follow_state_root) / 'duplicate-files.json'


def _load(contract):
    try:
        return json.loads(_path(contract).read_text(encoding='utf-8'))
    except FileNotFoundError:
        return {'hashes': {}, 'kept': []}


def _change(contract, change):
    path = _path(contract)
    path.parent.mkdir(parents=True, exist_ok=True)
    with FileLock(str(path) + '.lock'):
        state = _load(contract)
        change(state)
        atomic_write_text(path, json.dumps(state, ensure_ascii=False))


def _identity(row):
    return [row['location'], row['path'], row['size'], row['mtime']]


def _stamp(stat):
    return [stat.st_dev, stat.st_ino, stat.st_size, stat.st_mtime_ns, stat.st_ctime_ns]


def _source(row):
    source = translate_ledger_path(row['path']).resolve()
    roots = location_mounts().get(row['location'], ())
    if os.name == 'nt' and not roots:
        roots = tuple(translate_ledger_path(root) for root in location_roots().get(row['location'], ()))
    if not any(within_root(source, root.resolve()) for root in roots):
        raise ValueError('文件不在已配置的媒体目录内')
    return source


def _digest(row, state):
    saved = state['hashes'].get(str(row['id']))
    if saved is None or saved['identity'] != _identity(row):
        return None
    try:
        if saved['stamp'] == _stamp(_source(row).stat()):
            return saved['sha256']
    except (OSError, ValueError):
        pass
    return None


def _rows(contract):
    with contract.read_connection() as connection:
        return [dict(row) for row in connection.execute(
            "SELECT id,code,location,path,name,size,mtime,duration FROM asset "
            "WHERE medium='video' AND disposal IS NULL AND path IS NOT NULL "
            "AND size>0 AND lower(path) NOT LIKE '%.strm' ORDER BY id")]


def _candidates(rows):
    by_size = defaultdict(list)
    for row in rows:
        by_size[row['size']].append(row)
    return [row for members in by_size.values() if len(members) > 1 for row in members]


def _key(rows, evidence):
    material = [evidence, [[row['id'], *_identity(row)] for row in rows]]
    return hashlib.sha256(json.dumps(material, sort_keys=True).encode()).hexdigest()


def _groups(rows, state, mode):
    grouped = defaultdict(list)
    for row in rows:
        if mode == 'exact':
            digest = _digest(row, state)
            if digest:
                grouped[(row['size'], digest)].append(row)
        elif row['code'] and is_jav_code(row['code']):
            grouped[normalise_code_key(row['code'])].append(row)
    groups = []
    for evidence, members in grouped.items():
        paths = set()
        distinct = []
        for row in members:
            path = os.path.normcase(row['path'])
            if path not in paths:
                paths.add(path)
                distinct.append(row)
        members = distinct
        if len(members) < 2:
            continue
        largest = max(members, key=lambda row: row['size'])['id']
        longest = max(members, key=lambda row: row['duration'] or 0)['id']
        key = _key(members, evidence)
        codes = list(dict.fromkeys(row['code'] for row in members if row['code']))
        files = [{**row, 'drive': row['path'][:2].upper(),
                  'is_largest': row['id'] == largest, 'is_longest': row['id'] == longest}
                 for row in members]
        drives = sorted({row['drive'] for row in files})
        groups.append(dict(key=key, code=' / '.join(codes) or '未识别番号', files=files,
                           count=len(files), identical=mode == 'exact',
                           evidence='sha256' if mode == 'exact' else 'same_code',
                           drives=drives, cross_drive=len(drives) > 1,
                           kept=key in state['kept'],
                           reclaimable=sum(row['size'] for row in members) - max(
                               row['size'] for row in members) if mode == 'exact' else 0))
    return sorted(groups, key=lambda group: (-group['reclaimable'], group['code'], group['key']))


def q_duplicates(contract, args):
    mode = args.get('mode', 'exact')
    if mode not in ('exact', 'versions'):
        raise ValueError('重复文件视图无效')
    state, rows = _load(contract), _rows(contract)
    groups = _groups(rows, state, mode)
    kept = args.get('kept') == 'true'
    shown = [group for group in groups if group['kept'] == kept]
    pending = [row for row in _candidates(rows) if not _digest(row, state)]
    limit = min(max(int(args.get('limit', '60')), 1), 300)
    offset = max(int(args.get('offset', '0')), 0)
    return dict(total=len(shown), files=sum(group['count'] for group in shown),
                reclaimable=sum(group['reclaimable'] for group in shown),
                groups=shown[offset:offset + limit], has_more=offset + limit < len(shown),
                kept_total=sum(group['kept'] for group in groups),
                pending_files=len(pending), pending_bytes=sum(row['size'] for row in pending),
                job=contract.duplicate_hash_job.snapshot() or {'status': 'idle'})


def w_duplicate_keep(contract, body):
    mode, key = body.get('mode', 'exact'), body.get('key')
    if mode not in ('exact', 'versions') or not isinstance(body.get('keep'), bool):
        raise ValueError('保留决定无效')
    groups = _groups(_rows(contract), _load(contract), mode)
    if not any(group['key'] == key for group in groups):
        raise ValueError('这组文件已变化，请刷新后重新选择')
    def change(state):
        kept = set(state['kept'])
        kept.add(key) if body['keep'] else kept.discard(key)
        state['kept'] = sorted(kept)
    _change(contract, change)
    return {'ok': True}


def _hash_file(source, active, advance):
    """串行读取整个文件，分块响应停止并核对读前读后的文件身份。"""
    digest = hashlib.sha256()
    path_before = _stamp(source.stat())
    with source.open('rb') as stream:
        before = _stamp(os.fstat(stream.fileno()))
        if before[:4] != path_before[:4]:
            raise ValueError('校验期间文件发生变化')
        while chunk := stream.read(1024 * 1024):
            if not active():
                raise InterruptedError('文件校验已停止')
            digest.update(chunk)
            advance(len(chunk))
        if before != _stamp(os.fstat(stream.fileno())) or path_before != _stamp(source.stat()):
            raise ValueError('校验期间文件发生变化')
    return digest.hexdigest(), path_before


def _run_hash(contract, job_id):
    job = contract.duplicate_hash_job
    rows = _candidates(_rows(contract))
    state = _load(contract)
    pending = [row for row in rows if not _digest(row, state)]
    read_bytes, last_update = 0, 0
    job.update(job_id, total=len(pending), checked=0, failed=0, read_bytes=0,
               total_bytes=sum(row['size'] for row in pending))
    def active():
        current = job.snapshot()
        return current is not None and current['job_id'] == job_id
    def advance(count):
        nonlocal read_bytes, last_update
        read_bytes += count
        if time.monotonic() - last_update >= 1:
            job.update(job_id, read_bytes=read_bytes)
            last_update = time.monotonic()
    failed = 0
    for index, row in enumerate(pending):
        if not active():
            return
        try:
            source = _source(row)
            if source.stat().st_size != row['size']:
                raise ValueError('文件大小与馆藏记录不符，请先扫描媒体库')
            digest, stamp = _hash_file(source, active, advance)
            record = dict(identity=_identity(row), stamp=stamp, sha256=digest)
            _change(contract, lambda data, asset_id=row['id'], saved=record:
                    data['hashes'].update({str(asset_id): saved}))
        except InterruptedError:
            return
        except (OSError, ValueError) as error:
            failed += 1
            job.update(job_id, message=f"{row['name']}：{error}")
        if not job.checkpoint(job_id, checked=index + 1, failed=failed, read_bytes=read_bytes):
            return
    job.update(job_id, status='complete', completed_at=time.time())


def w_duplicate_hash(contract, body):
    job = contract.duplicate_hash_job
    if body.get('stop') is True:
        job.stop(resume=False)
        return {'status': 'idle'}
    if body.get('confirm_full_read') is not True:
        raise ValueError('完整校验会读取候选文件的全部内容，请先确认读取量')
    return job.start(lambda job_id: _run_hash(contract, job_id), restart=True,
                     initial={'checked': 0, 'total': 0, 'failed': 0, 'read_bytes': 0},
                     recovery={'confirm_full_read': True})
