"""单档重新取证、逐字段采用与同步保护，复用馆藏来源和人工复核写入。"""
from __future__ import annotations

import json
import time
from uuid import uuid4

from filelock import FileLock

from . import library_processing as engine, metadata_routes, settings_file
from .field_owners import check_revision, parse_owners, review_owner
from .fsutil import atomic_write_text
from .genre_decisions import load_genre_decisions
from .metadata_auto_apply import METADATA_FIELD_COLUMNS, _decision_note
from .metadata_selection import MetadataSelection, request_options
from .web_review import _approve_metadata_with_receipt


def _asset(contract, value):
    if isinstance(value, bool) or not str(value or '').isdigit() or int(value) <= 0:
        raise ValueError('请选择有效的影片')
    with contract.read_connection() as connection:
        row = connection.execute("SELECT * FROM asset WHERE id=? AND medium='video' AND disposal IS NULL",
                                 (int(value),)).fetchone()
        if row is None:
            raise ValueError('影片已不在媒体库中')
        result = dict(row)
        if not result.get('path') or result.get('location') == 'online':
            raise ValueError('请在有文件记录的馆藏影片上查询资料')
        result['performers'] = '、'.join(item[0] for item in connection.execute(
            "SELECT DISTINCT e.canonical_name FROM asset_entity ae JOIN entity e ON e.id=ae.entity_id "
            "WHERE ae.asset_id=? AND ae.role='performer'", (result['id'],)))
        result['tags'] = '、'.join(item[0] for item in connection.execute(
            "SELECT tag FROM asset_tag WHERE asset_id=? AND tag NOT LIKE '演员:%'", (result['id'],)))
    code = engine._provider_code(result.get('code'))
    if not code or not engine._scrapes_as_jav(result, code):
        raise ValueError('这部影片没有可供当前资料来源查询的发行番号')
    return result, code


def _path(asset_id):
    return settings_file.active().directory('state') / 'item-metadata' / f'{asset_id}.json'


def _saved(asset_id):
    try:
        return json.loads(_path(asset_id).read_text(encoding='utf-8'))
    except (OSError, ValueError):
        return {}


def _sources(row, code):
    from .custom_metadata import load, source_key
    from .metadata_preferences import load as preferences
    kind = metadata_routes.classify(code, *engine._studio_evidence(row))
    sources = [(name, engine.SOURCE_LABELS.get(name, name)) for name in
               metadata_routes.route_for_code(code, *engine._studio_evidence(row),
                   overrides=preferences(settings_file.active().directory('secrets'))['routes'])]
    if kind == 'fc2' and 'fc2club' not in {name for name, _ in sources}:
        sources.append(('fc2club', engine.SOURCE_LABELS['fc2club']))
    sources += [(source_key(entry), entry['name']) for entry in load(settings_file.active().directory('secrets'))
                if entry['enabled'] and kind in entry['content_types']]
    return sources


def _protections(connection, asset_id):
    result = []
    for row in connection.execute(
            "SELECT item_key,note FROM review_decision WHERE category='metadata_fields' AND status='approved' "
            "AND item_key LIKE ?", (f'asset:{asset_id}:%',)):
        note = _decision_note(dict(row))
        if note.get('user_locked'):
            field = row['item_key'].rsplit(':', 1)[-1]
            result.append({'field': field, 'label': engine.LABELS.get(field, field),
                           'source': note.get('source', '')})
    return result


def q_item_metadata(contract, args):
    row, code = _asset(contract, args.get('id'))
    # 先读任务状态：完成状态必须对应已经发布的候选，避免轮询提前停止。
    job = contract.item_metadata_job.snapshot() or {'status': 'idle'}
    saved = _saved(row['id'])
    # 文件路径与番号共同钉住取证范围，改过身份的旧结果不能用于当前影片。
    if saved.get('code') != code or saved.get('asset_path') != row['path']:
        saved = {}
    groups = []
    for group in saved.get('groups', []):
        groups.append({'field': group['field'], 'label': group['field_label'],
                       'current': row.get(engine.COLUMN_OF.get(group['field'], group['field'])) or '',
                       'candidates': [{key: choice.get(key) for key in
                                       ('candidate_key', 'source', 'display_value', 'warnings', 'source_url')}
                                      for choice in json.loads(group['candidates_json'])]})
    with contract.read_connection() as connection:
        protected = _protections(connection, row['id'])
    return {'id': row['id'], 'code': code, 'sources': [{'id': key, 'label': label} for key, label in _sources(row, code)],
            'snapshot_id': saved.get('snapshot_id', ''), 'fetched_at': saved.get('fetched_at'),
            'revision': row['mutation_revision'], 'groups': groups, 'protected': protected,
            'issues': saved.get('issues', []), 'source_results': saved.get('source_results', []),
            'job': job if job.get('asset_id') == row['id'] else {'status': 'idle'},
            'busy': job.get('status') == 'running'}


class _SelectedSource(engine._RemoteSession):
    """指定一家时只问这一家；自动选择沿用按内容类型裁剪的来源链。"""

    def __init__(self, config, source):
        super().__init__(config, None, engine._MissCache(engine.misses_path(config)), retrying=True)
        self.selected_source = source

    def _ask(self, source, code, members, cached, **options):
        if self.selected_source:
            kind = metadata_routes.classify(code, *options['evidence'])
            self._routes = {**(self._routes or {}), kind: (self.selected_source,)}
        return super()._ask(source, code, members, cached, **options)

    def _chain(self, code, *evidence):
        return (self.selected_source,) if self.selected_source else super()._chain(code, *evidence)


def _fetch(contract, job_id, row, code, sources, metadata_fields=None, fill_other_metadata=True):
    config = settings_file.active()
    selection = MetadataSelection(metadata_fields, fill_other_metadata)
    issues, groups = [], {}
    outcomes, answered = [], set()
    snapshot_id = uuid4().hex
    with contract.read_connection() as connection:
        genres = load_genre_decisions(connection)
    def received(entries):
        for name, payload, _ in entries:
            answered.add(name)
            path = config.directory('sources') / 'item-metadata' / snapshot_id / f'{name}.json'
            atomic_write_text(path, json.dumps(payload, ensure_ascii=False))
            # 每个字段都可供明确采用，包括与当前值相同而需要加上保护的值。
            baseline = {**row, **{engine.COLUMN_OF.get(field, field): '' for field in engine.LABELS}}
            engine._merge_candidates(groups, baseline, code, name, payload, path, genres,
                                     only_fields=selection.allowed)
    for source in sources or ('',):
        remote = _SelectedSource(config, source)
        before = len(issues)
        try:
            remote.collect(row, code, list(selection.fields or engine.COLLECTED_FIELDS), contract.cover_root,
                include_covers=False, received=received,
                update=lambda **state: contract.item_metadata_job.update(job_id, **state),
                issue=lambda _row, message, **_details: issues.append(str(message)))
        finally:
            remote.close()
        if source:
            outcomes.append({'source': source, 'status': 'received' if source in answered else 'unavailable',
                             'issues': issues[before:]})
    result = {'snapshot_id': snapshot_id, 'code': code, 'asset_path': row['path'],
              'fetched_at': time.time(), 'groups': list(groups.values()), 'issues': issues,
              'source_results': outcomes, **selection.options}
    path = _path(row['id'])
    path.parent.mkdir(parents=True, exist_ok=True)
    with FileLock(str(path) + '.lock'):
        atomic_write_text(path, json.dumps(result, ensure_ascii=False))
    contract.item_metadata_job.update(job_id, status='complete', stage='等待选择采用的资料')


def _requested_sources(body, available):
    sources = body.get('sources', [body['source']] if body.get('source') else [])
    if (not isinstance(sources, list) or len(sources) > len(available)
            or any(not isinstance(source, str) or source not in available for source in sources)
            or len(set(sources)) != len(sources)):
        raise ValueError('请选择适用于该影片的来源，每家一次')
    return sources


def _apply(contract, row, code, body):
    choices = body.get('choices')
    if not isinstance(choices, dict) or not choices or any(field not in engine.LABELS for field in choices):
        raise ValueError('请选择要采用的资料字段')
    saved = _saved(row['id'])
    if (not body.get('snapshot_id') or body['snapshot_id'] != saved.get('snapshot_id')
            or saved.get('asset_path') != row['path'] or saved.get('code') != code):
        raise ValueError('资料已变化，请重新读取后选择')
    groups = {group['field']: group for group in saved.get('groups', [])}
    now = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    with contract.write_transaction() as connection:
        check_revision(connection, [row['id']], _revision(body))
        for field, key in choices.items():
            group = groups.get(field)
            candidate = next((choice for choice in json.loads(group['candidates_json'])
                              if choice['candidate_key'] == key), None) if group else None
            if candidate is None:
                raise ValueError('所选来源资料已变化，请重新选择')
            connection.execute(
                "INSERT INTO review_decision(category,item_key,status,note,updated_at) VALUES('metadata_fields',?,'approved','',?) "
                "ON CONFLICT(category,item_key) DO UPDATE SET status='approved',updated_at=excluded.updated_at",
                (group['item_key'], now))
            _approve_metadata_with_receipt(connection, group, candidate, now, '', None)
            decision = connection.execute(
                "SELECT note FROM review_decision WHERE category='metadata_fields' AND item_key=?",
                (group['item_key'],)).fetchone()
            note = {**json.loads(decision['note']), 'user_locked': True, 'locked_at': now}
            connection.execute("UPDATE review_decision SET note=? WHERE category='metadata_fields' AND item_key=?",
                               (json.dumps(note, ensure_ascii=False), group['item_key']))
        # 演员与标签是关系记录，保护状态同样需要让旧页面的并发凭据失效。
        connection.execute('UPDATE asset SET mutation_revision=mutation_revision+1 WHERE id=?', (row['id'],))
    contract.cache_bust()


def _revision(body):
    value = body.get('expected_revision')
    if type(value) is not int or value < 0:
        raise ValueError('请重新读取影片资料后操作')
    return value


def _unlock(contract, row, body):
    field = body.get('field')
    if field not in engine.LABELS:
        raise ValueError('资料字段无效')
    key = f"asset:{row['id']}:{field}"
    with contract.write_transaction() as connection:
        check_revision(connection, [row['id']], _revision(body))
        decision = connection.execute(
            "SELECT note FROM review_decision WHERE category='metadata_fields' AND item_key=?", (key,)).fetchone()
        note = json.loads(decision['note']) if decision else {}
        if not note.get('user_locked'):
            raise ValueError('这项资料没有同步保护')
        note.update(user_locked=False, unlocked_at=time.time())
        connection.execute("UPDATE review_decision SET note=? WHERE category='metadata_fields' AND item_key=?",
                           (json.dumps(note, ensure_ascii=False), key))
        current = connection.execute('SELECT field_owners FROM asset WHERE id=?', (row['id'],)).fetchone()
        owners = parse_owners(current['field_owners'])
        column = METADATA_FIELD_COLUMNS.get(field)
        if column and owners.get(column) == review_owner(note['source']):
            owners[column] = 'auto:' + note['source']
        connection.execute('UPDATE asset SET field_owners=?,mutation_revision=mutation_revision+1 WHERE id=?',
                           (json.dumps(owners), row['id']))
    contract.cache_bust()


def w_item_metadata(contract, body):
    body = body or {}
    row, code = _asset(contract, body.get('id'))
    action = body.get('action', 'fetch')
    if action in ('apply', 'unlock'):
        path = _path(row['id'])
        path.parent.mkdir(parents=True, exist_ok=True)
        with FileLock(str(path) + '.lock'):
            (_apply(contract, row, code, body) if action == 'apply' else _unlock(contract, row, body))
    elif action == 'fetch':
        sources = _requested_sources(body, {key for key, _ in _sources(row, code)})
        metadata_options = request_options(body)
        job = contract.item_metadata_job.snapshot() or {}
        if job.get('status') == 'running':
            raise ValueError('另一项单档资料查询正在进行，请稍后重试')
        contract.item_metadata_job.start(lambda job_id: _fetch(contract, job_id, row, code, sources, **metadata_options),
            restart=True, initial={'asset_id': row['id'], 'sources': sources, 'stage': '重新查询资料来源', **metadata_options},
            recovery={'id': row['id'], 'sources': sources, **metadata_options})
    else:
        raise ValueError('资料操作无效')
    return q_item_metadata(contract, {'id': row['id']})
