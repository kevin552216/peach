"""来源预约跨会话共享，异常退避与成功恢复均不访问真实网站。"""
import json
from pathlib import Path
import tempfile
import unittest

from peach.http import HttpRequest, HttpResponse
from peach.jav_cover_fetch import DeadlineExceeded, Unavailable
from peach.scraping_access import SourceTransport
from peach.source_pacing import SourcePacer, rate_state


class SourcePacingTests(unittest.TestCase):
    def setUp(self):
        folder = tempfile.TemporaryDirectory()
        self.addCleanup(folder.cleanup)
        self.root = Path(folder.name)
        self.now = 100.0
        self.waits = []

    def sleep(self, delay):
        self.waits.append(delay)
        self.now += delay

    def pacer(self):
        return SourcePacer(self.root, clock=lambda: self.now, sleeper=self.sleep)

    def test_sessions_share_slots_and_sources_have_independent_slots(self):
        self.pacer().wait('fc2cmadb', 20)
        self.pacer().wait('avbase', 20)
        self.assertEqual(self.waits, [])
        self.pacer().wait('fc2cmadb', 20)
        self.assertEqual(self.waits, [2.0])

    def test_failure_counters_slow_one_source_and_stable_success_recovers(self):
        pacer = self.pacer()
        pacer.record('fc2cmadb', 404)
        self.assertEqual(rate_state(self.root, 'fc2cmadb')['interval'], 5)
        pacer.record('fc2cmadb', 429)
        self.assertEqual(rate_state(self.root, 'fc2cmadb')['interval'], 10)
        for _ in range(5):
            pacer.record('fc2cmadb', 200)
        self.assertEqual(rate_state(self.root, 'fc2cmadb')['interval'], 5)
        for _ in range(5):
            pacer.record('fc2cmadb', 200)
        state = rate_state(self.root, 'fc2cmadb')
        self.assertEqual((state['interval'], state['requests'], state['http_404'], state['rate_limited']), (2, 12, 1, 1))
        self.assertEqual(rate_state(self.root, 'avbase')['requests'], 0)

    def test_waiting_respects_remaining_budget_without_reserving_another_slot(self):
        pacer = self.pacer()
        pacer.wait('fc2cmadb', 10)
        before = rate_state(self.root, 'fc2cmadb')
        with self.assertRaises(DeadlineExceeded):
            pacer.wait('fc2cmadb', 1)
        self.assertEqual(rate_state(self.root, 'fc2cmadb'), before)
        self.assertEqual(self.waits, [])

    def test_malformed_state_has_safe_finite_defaults(self):
        (self.root / 'source-rate-fc2cmadb.json').write_text(json.dumps({'interval': float('nan'), 'requests': True}))
        state = rate_state(self.root, 'fc2cmadb')
        self.assertEqual((state['interval'], state['requests']), (2, 0))
        (self.root / 'source-rate-fc2cmadb.json').write_text('[]')
        self.assertEqual(rate_state(self.root, 'fc2cmadb')['requests'], 0)

    def test_processes_share_failure_counters(self):
        import subprocess
        import sys
        code = ('from pathlib import Path; import sys; from peach.source_pacing import SourcePacer; '
                'p=SourcePacer(Path(sys.argv[1])); [p.record("fc2cmadb",404) for _ in range(5)]')
        workers = [subprocess.Popen([sys.executable, '-X', 'utf8', '-c', code, str(self.root)]) for _ in range(2)]
        try:
            for worker in workers:
                self.assertEqual(worker.wait(timeout=20), 0)
        finally:
            for worker in workers:
                if worker.poll() is None:
                    worker.kill()
                    worker.wait()
        self.assertEqual(rate_state(self.root, 'fc2cmadb')['requests'], 10)

    def test_legacy_unverified_miss_is_rechecked_without_discarding_other_sources(self):
        from peach.library_processing import _MissCache, MISS_FORMAT
        path = self.root / 'misses.json'
        path.write_text(json.dumps({'format': MISS_FORMAT, 'sites': ['fc2cmadb', 'fc2'],
            'misses': {'fc2cmadb': {'FC2-PPV-1234567': 99}, 'fc2': {'FC2-PPV-1234567': 99}}}))
        cache = _MissCache(path, now=lambda: 100)
        self.assertFalse(cache.fresh('fc2cmadb', 'FC2-PPV-1234567'))
        self.assertTrue(cache.fresh('fc2', 'FC2-PPV-1234567'))
        cache.record('fc2cmadb', 'FC2-PPV-7654321')
        cache = _MissCache(path, now=lambda: 100)
        self.assertTrue(cache.fresh('fc2cmadb', 'FC2-PPV-7654321'))

    def test_issue_identity_is_separate_from_the_display_title(self):
        from peach.library_processing import _processing_issue_record
        row = _processing_issue_record({'id': 12, 'code': 'ABW-123', 'catalog_title': '测试标题'},
                                       '来源尚未取得', 'querying_metadata', True, False)
        self.assertEqual((row['asset_id'], row['code'], row['title']), (12, 'ABW-123', '测试标题'))

    def transport(self, responses):
        transport = SourceTransport(self.root)
        transport.pacer = self.pacer()
        transport.transports['fc2cmadb'] = lambda *_: next(responses)
        return transport

    def test_article_404_is_rechecked_slowly_and_success_is_returned(self):
        transport = self.transport(iter([HttpResponse(404, {}, b'error'), HttpResponse(200, {}, b'article')]))
        response = transport(HttpRequest('GET', 'https://fc2cmadb.com/articles/1234567', {}), 20, 1000)
        self.assertEqual(response.body, b'article')
        self.assertEqual(self.waits, [5.0])
        self.assertEqual(rate_state(self.root, 'fc2cmadb')['requests'], 2)

    def test_repeated_article_404_is_retryable_and_does_not_assert_absence(self):
        transport = self.transport(iter([HttpResponse(404, {}, b'error'), HttpResponse(404, {}, b'error')]))
        with self.assertRaises(Unavailable):
            transport(HttpRequest('GET', 'https://fc2cmadb.com/articles/1234567', {}), 20, 1000)
        self.assertEqual(self.waits, [5.0])
        self.assertEqual(rate_state(self.root, 'fc2cmadb')['http_404'], 2)

    def test_rate_limit_keeps_server_cooldown_instead_of_retrying(self):
        from peach.scraping_access import SourcePaused
        transport = self.transport(iter([HttpResponse(429, {'retry-after': '30'}, b'')]))
        with self.assertRaises(SourcePaused):
            transport(HttpRequest('GET', 'https://fc2cmadb.com/articles/1234567', {}), 20, 1000)
        self.assertEqual(rate_state(self.root, 'fc2cmadb')['requests'], 1)
        self.assertEqual(self.waits, [])
