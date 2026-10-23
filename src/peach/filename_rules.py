"""本机自定义文件名规则；预览与入库使用同一份解析器。"""
from __future__ import annotations

import json
import hashlib
from pathlib import Path, PureWindowsPath
import re
import regex

from .catalog_rules import release_code_from_filename, release_code_from_text
from .fsutil import atomic_write_text

FILENAME = 'filename-rules.json'


class Engine:
    def __init__(self, items):
        if not isinstance(items, list) or len(items) > 32:
            raise ValueError('文件名规则须为列表，最多 32 条')
        self.items = []
        self.compiled = []
        for index, item in enumerate(items, 1):
            if not isinstance(item, dict):
                raise ValueError(f'规则 {index} 的格式无效')
            row = {}
            for key, limit in (('name', 64), ('pattern', 1024), ('replacement', 256)):
                value = item.get(key)
                if not isinstance(value, str) or not value.strip() or len(value) > limit:
                    raise ValueError(f'规则 {index} 的 {key} 为空或过长')
                row[key] = value
            row['enabled'] = item.get('enabled', True)
            if not isinstance(row['enabled'], bool):
                raise ValueError(f'规则 {index} 的启用状态无效')
            try:
                re.compile(row['pattern']).sub(row['replacement'], '')
                pattern = regex.compile(row['pattern'], regex.VERSION0)
            except (re.error, regex.error, IndexError) as error:
                raise ValueError(f'规则 {index}：{error}') from error
            self.items.append(row)
            if row['enabled']:
                self.compiled.append((row, pattern))
        self.fingerprint = hashlib.sha256(json.dumps(self.items, sort_keys=True).encode()).hexdigest()

    def recognize(self, filename: str | None) -> dict:
        name = PureWindowsPath(str(filename or '')).name
        if len(name) > 4096:
            raise ValueError('测试文件名过长')
        for row, pattern in self.compiled:
            try:
                match = pattern.search(name, timeout=0.05)
            except TimeoutError as error:
                raise ValueError(f"规则「{row['name']}」匹配超时，请简化表达式") from error
            if match:
                code = release_code_from_text(match.expand(row['replacement']))
                if code:
                    return dict(code=code, source='custom', rule=row['name'])
        code = release_code_from_filename(name)
        return dict(code=code, source='builtin' if code else 'none', rule=None)

    def code(self, filename: str | None) -> str | None:
        return self.recognize(filename)['code']


def load(state_root: Path) -> list[dict]:
    try:
        payload = json.loads((Path(state_root) / FILENAME).read_text(encoding='utf-8'))
    except FileNotFoundError:
        return []
    if not isinstance(payload, dict):
        raise ValueError('文件名规则设置格式无效')
    return Engine(payload.get('items')).items


def save(state_root: Path, items) -> list[dict]:
    rows = Engine(items).items
    atomic_write_text(Path(state_root) / FILENAME,
                      json.dumps({'items': rows}, ensure_ascii=False) + '\n')
    return rows
