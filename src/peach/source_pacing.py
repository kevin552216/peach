"""同一安装内跨任务、跨进程共享的来源节奏与脱敏计数。"""
import json
import math
import time
from pathlib import Path

from filelock import FileLock

from .fsutil import atomic_write_text


def rate_state(root: Path, source: str) -> dict:
    try:
        raw = json.loads((root / f'source-rate-{source}.json').read_text(encoding='utf-8'))
    except (OSError, ValueError):
        raw = {}
    if not isinstance(raw, dict):
        raw = {}
    defaults = dict(requests=0, successes=0, failures=0, http_404=0, rate_limited=0,
                    blocked=0, consecutive_success=0, consecutive_failure=0,
                    interval=2.0, next_at=0.0, last_status=0)
    return {key: raw[key] if isinstance(raw.get(key), (int, float))
            and not isinstance(raw[key], bool) and math.isfinite(raw[key]) and raw[key] >= 0
            else value for key, value in defaults.items()}


class SourcePacer:
    """只在预约和记账时持文件锁，网络和等待不阻塞其他来源。"""

    def __init__(self, root, *, clock=time.time, sleeper=time.sleep):
        self.root = Path(root)
        self.clock, self.sleep = clock, sleeper

    def _paths(self, source):
        self.root.mkdir(parents=True, exist_ok=True)
        path = self.root / f'source-rate-{source}.json'
        return path, FileLock(str(path) + '.lock', timeout=5)

    def wait(self, source, timeout):
        from .jav_cover_fetch import DeadlineExceeded
        path, lock = self._paths(source)
        deadline = self.clock() + timeout
        while True:
            with lock:
                state = rate_state(self.root, source)
                now = self.clock()
                delay = max(0.0, state['next_at'] - now)
                if delay >= deadline - now:
                    raise DeadlineExceeded('等待来源请求间隔时动作预算已用尽')
                if not delay:
                    state['next_at'] = now + min(10.0, max(2.0, state['interval']))
                    atomic_write_text(path, json.dumps(state), mode=0o600)
                    return max(0.001, deadline - self.clock())
            self.sleep(delay)

    def record(self, source, status):
        path, lock = self._paths(source)
        with lock:
            state = rate_state(self.root, source)
            state['requests'] += 1
            state['last_status'] = status
            if 200 <= status < 400:
                state['successes'] += 1
                state['consecutive_success'] += 1
                state['consecutive_failure'] = 0
                if state['consecutive_success'] >= 5:
                    state['interval'] = 5.0 if state['interval'] > 5 else 2.0
                    state['consecutive_success'] = 0
            else:
                state['failures'] += 1
                state['consecutive_failure'] += 1
                state['consecutive_success'] = 0
                state['interval'] = 5.0 if state['interval'] < 5 else 10.0
                for code, key in ((404, 'http_404'), (429, 'rate_limited'), (403, 'blocked')):
                    if status == code:
                        state[key] += 1
            state['next_at'] = max(state['next_at'], self.clock() + state['interval'])
            atomic_write_text(path, json.dumps(state), mode=0o600)
