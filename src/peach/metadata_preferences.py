"""本机资料来源顺序与 HTTP 浏览器身分，沿用既有来源路由与传输。"""
import json
from pathlib import Path

from . import metadata_routes, settings_file
from .fsutil import atomic_write_text
from .user_agent import USER_AGENT


def clean(raw):
    if not isinstance(raw, dict):
        raise ValueError('资料来源设置格式无效')
    agent = raw.get('user_agent') or USER_AGENT
    if not isinstance(agent, str) or len(agent) > 512 or any(ord(char) < 32 or ord(char) > 126 for char in agent):
        raise ValueError('User-Agent 须为 512 字以内的单行文字')
    if not isinstance(raw.get('routes') or {}, dict):
        raise ValueError('来源顺序格式无效')
    routes = metadata_routes.parse_route_overrides(raw.get('routes') or {})
    for kind, sources in routes.items():
        if kind not in metadata_routes.ROUTES or set(sources) != set(metadata_routes.ROUTES[kind]):
            raise ValueError('来源顺序须包含该类型的全部内置来源，每家一次')
        original = raw['routes'][kind]
        if not isinstance(original, list) or len(original) != len(sources):
            raise ValueError('来源顺序格式无效或含重复来源')
    return {'user_agent': agent, 'routes': {kind: list(sources) for kind, sources in routes.items()}}


def load(root: Path):
    try:
        raw = json.loads((root / 'metadata-preferences.json').read_text(encoding='utf-8'))
        return clean(raw)
    except (OSError, ValueError, TypeError, AttributeError):
        return {'user_agent': USER_AGENT, 'routes': {}}


def q_metadata_preferences(_contract, _args):
    from .library_processing import SOURCE_LABELS
    values = load(settings_file.active().directory('secrets'))
    return {**values, 'default_user_agent': USER_AGENT, 'types': [
        {'id': kind, 'sources': [{'id': source, 'label': SOURCE_LABELS.get(source, source)} for source in
                               values['routes'].get(kind, sources)]}
        for kind, sources in metadata_routes.ROUTES.items() if sources]}


def w_metadata_preferences(contract, body):
    values = clean(body or {})
    path = settings_file.active().directory('secrets') / 'metadata-preferences.json'
    atomic_write_text(path, json.dumps(values, ensure_ascii=False))
    return q_metadata_preferences(contract, {})
