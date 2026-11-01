"""教程邀请与阅读进度随本机账本保存，各设备按动作更新同一份状态。"""
from __future__ import annotations

import json
import re
import time

from .profiles import DEFAULT_PROFILE_ID, read_settings

# 只有明确需要重新介绍新教程的版本才修改；不跟随应用版本号递增。
CAMPAIGN = 'tutorial-center-1'
KEY = 'tutorial_progress'


def _snapshot(settings):
    stored = settings.get(KEY, {})
    return {'version': 1, 'campaign': CAMPAIGN,
            'invited': stored.get('invited_campaign') == CAMPAIGN,
            'completed': stored.get('completed_campaign') == CAMPAIGN,
            'chapters': stored.get('chapters', {})}


def q_tutorial_progress(contract, _args=None):
    with contract.read_connection() as connection:
        return _snapshot(read_settings(connection))


def _identifier(body, key):
    value = body.get(key)
    if not isinstance(value, str) or not re.fullmatch(r'[a-zA-Z0-9_-]{1,80}', value):
        raise ValueError('教程章节或步骤标识无效')
    return value


def w_tutorial_progress(contract, body):
    if body.get('campaign') != CAMPAIGN:
        raise ValueError('教程已更新，请刷新后继续')
    action = body.get('action')
    if action not in {'dismiss', 'reopen', 'complete', 'position', 'step'}:
        raise ValueError('不支持的教程操作')
    if action in {'position', 'step'}:
        chapter = _identifier(body, 'chapter')
        position = body.get('next')
        if type(position) is not int or not 0 <= position <= 200:
            raise ValueError('教程位置无效')
        if action == 'step':
            step = _identifier(body, 'step')
            if type(body.get('skipped')) is not bool:
                raise ValueError('教程跳过状态无效')
    with contract.write_transaction() as connection:
        settings = read_settings(connection)
        stored = settings.setdefault(KEY, {})
        if action == 'dismiss':
            stored['invited_campaign'] = CAMPAIGN
        elif action == 'reopen':
            stored.update(invited_campaign=CAMPAIGN, completed_campaign=None)
        elif action == 'complete':
            stored.update(invited_campaign=CAMPAIGN, completed_campaign=CAMPAIGN)
        else:
            chapters = stored.setdefault('chapters', {})
            if chapter not in chapters and len(chapters) >= 100:
                raise ValueError('教程章节数量超出范围')
            row = chapters.setdefault(chapter, {'next': 0, 'read': [], 'skipped': []})
            row['next'] = position
            if action == 'step':
                if step not in row['read'] + row['skipped'] and len(row['read']) + len(row['skipped']) >= 200:
                    raise ValueError('教程步骤数量超出范围')
                row['read'] = [value for value in row['read'] if value != step]
                row['skipped'] = [value for value in row['skipped'] if value != step]
                row['skipped' if body['skipped'] else 'read'].append(step)
        updated = connection.execute(
            'UPDATE profile SET settings_json=?,updated_at=? WHERE id=?',
            (json.dumps(settings, ensure_ascii=False), time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
             DEFAULT_PROFILE_ID)).rowcount
        if not updated:
            raise ValueError('当前用户设置不存在')
        return _snapshot(settings)
