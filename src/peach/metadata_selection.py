"""所选缺失字段决定查询范围，顺带补空不增加查询目标。"""
from __future__ import annotations

DEFAULT_FIELDS = ('title', 'performers', 'studio', 'release_date', 'tags')


def parse_fields(raw):
    if raw is None:
        return None
    if (not isinstance(raw, (list, tuple)) or not raw
            or any(not isinstance(field, str) or field not in DEFAULT_FIELDS for field in raw)
            or len(set(raw)) != len(raw)):
        raise ValueError('请至少选择一种资料字段，每种一次')
    return tuple(raw)


def missing_fields(row, local_fields=(), fields=None):
    return [field for field in fields or DEFAULT_FIELDS
            if field not in local_fields and not row.get('catalog_title' if field == 'title' else field)]


def request_options(body, previous=None):
    previous = previous or {}
    raw = body.get('metadata_fields', previous.get('metadata_fields'))
    if 'metadata_fields' in body and raw is None:
        raise ValueError('请至少选择一种资料字段，每种一次')
    fields = parse_fields(raw)
    other = body.get('fill_other_metadata', previous.get('fill_other_metadata', True))
    if type(other) is not bool:
        raise ValueError('顺便补齐其他缺失资料选项无效')
    if fields is None and 'fill_other_metadata' in body:
        fields = DEFAULT_FIELDS
    return {} if fields is None else {'metadata_fields': list(fields), 'fill_other_metadata': other}


def eligible_rows(rows, fields):
    return [row for row in rows if fields is None or missing_fields(row, fields=fields)]


def candidate_fields(fields, fill_other):
    return None if fields is None or fill_other else set(fields)


class MetadataSelection:
    """查询目标与候选补空范围分开，未指定时保留现有任务契约。"""

    def __init__(self, fields=None, fill_other=True):
        self.fields = parse_fields(fields)
        if type(fill_other) is not bool:
            raise ValueError('顺便补齐其他缺失资料选项无效')
        self.fill_other = fill_other
        self.allowed = candidate_fields(self.fields, fill_other)
        self.asset_ids = None

    @property
    def options(self):
        return {} if self.fields is None else {
            'metadata_fields': list(self.fields), 'fill_other_metadata': self.fill_other}

    @property
    def apply_options(self):
        return {} if self.fields is None else {'fill_only': True, 'fields': self.allowed}

    def rows(self, rows, state, pending=None):
        if self.fields is None:
            return rows
        selected = eligible_rows(rows, self.fields)
        self.asset_ids = [row['id'] for row in selected]
        state.update(metadata_inspected=len(rows), metadata_skipped_complete=len(rows) - len(selected),
                     metadata_eligible=len(selected))
        if pending is not None:
            pending.update(local=len(selected), metadata=len(selected))
            state['estimate_pending'] = dict(pending)
        return selected

    def scope(self, original):
        return original if self.fields is None else self.asset_ids or []

    def verify(self, existing):
        return existing if self.fields is None else False

    def wanted(self, row, local_fields, verify_existing=False, *, database=None, code=''):
        if self.fields is None and verify_existing:
            return list(DEFAULT_FIELDS)
        if self.fields is None:
            return missing_fields(row, local_fields)
        # 本地候选尚未采用不代表字段已补齐；按账本现值决定是否仍需联网。
        if database is not None:
            from .library_processing import _candidate_baseline
            row = _candidate_baseline(database, row, code, True)
        return missing_fields(row, fields=self.fields)

    def collect(self, remote, row, code, wanted, cover_root, **options):
        if self.fields is not None:
            if not wanted:
                return [], 0
            options['include_covers'] = False
        return remote.collect(row, code, wanted, cover_root, **options)

    def answered(self, groups, target_key, fields, verify_existing=False):
        """所选缺口仍需查询；快照与来源缺失记忆负责避免重复联网。"""
        if self.fields is not None or verify_existing:
            return ()
        from .library_processing import _answered_sources
        return _answered_sources(groups, target_key, fields)

    def groups(self, groups):
        return {key: group for key, group in groups.items()
                if self.allowed is None or group.get('field') in self.allowed}

    def finish_options(self, groups):
        return {} if self.fields is None else {'candidate_rows': list(groups.values()), **self.apply_options}
