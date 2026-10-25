"""资料来源顺序、请求身分与本机设置保存。"""
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from peach import metadata_preferences as preferences, metadata_routes, scraping_access
from peach.library_processing import _MissCache, _RemoteSession
from peach.settings_file import PeachConfig
from peach.user_agent import USER_AGENT


class MetadataPreferencesTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()
        self.config = PeachConfig(data_root=self.root, path=self.root / 'config.toml')
        setting = patch.object(preferences.settings_file, 'active', return_value=self.config)
        setting.start()
        self.addCleanup(setting.stop)

    def test_default_agent_is_chrome_and_invalid_headers_are_rejected(self):
        self.assertEqual(preferences.load(self.root)['user_agent'], USER_AGENT)
        for value in ('safe\r\nCookie: leak', 'x' * 513, '非 ASCII'):
            with self.subTest(value=value), self.assertRaises(ValueError):
                preferences.clean({'user_agent': value})

    def test_saved_order_is_used_by_the_next_metadata_session(self):
        order = list(metadata_routes.ROUTES['fc2'])
        order.remove('fc2cmadb')
        order.insert(0, 'fc2cmadb')
        result = preferences.w_metadata_preferences(None, {'routes': {'fc2': order}, 'user_agent': 'Test Browser/1'})
        self.assertEqual(result['routes']['fc2'], order)
        remote = _RemoteSession(self.config, None, _MissCache(self.root / 'misses.json'), retrying=False)
        self.assertEqual(remote._chain('FC2-PPV-1234567')[0], 'fc2cmadb')
        explicit = _RemoteSession(self.config, None, _MissCache(self.root / 'other-misses.json'), retrying=False,
                                  routes={'fc2': ('fc2ppvdb',)})
        self.assertEqual(explicit._chain('FC2-PPV-1234567'), ('fc2ppvdb',))

    def test_native_source_client_uses_saved_agent_and_preserves_other_settings_on_error(self):
        root = self.config.directory('secrets')
        preferences.w_metadata_preferences(None, {'user_agent': 'Test Browser/1'})
        with scraping_access.client_for(root, 'fc2cmadb') as client:
            self.assertEqual(client.headers['User-Agent'], 'Test Browser/1')
        for routes in ({'fc2': ['unknown']}, {'fc2': ['fc2cmadb']}, {'bad': []}):
            with self.subTest(routes=routes), self.assertRaises(ValueError):
                preferences.w_metadata_preferences(None, {'routes': routes})
        self.assertEqual(preferences.load(root)['user_agent'], 'Test Browser/1')

    def test_custom_json_sources_use_the_same_saved_agent(self):
        from peach import custom_metadata
        root = self.config.directory('secrets')
        preferences.w_metadata_preferences(None, {'user_agent': 'Test Browser/1'})
        definition = {'name': '测试来源', 'endpoint': 'https://metadata.example.com/{code}',
                      'fields': {'code': 'id', 'title': 'title'}, 'content_types': ['censored'], 'enabled': True}
        with patch.object(custom_metadata, 'fetch_json', return_value={'id': 'ABW-001', 'title': '来源标题'}) as fetch:
            custom_metadata.query(definition, 'ABW-001', secrets_root=root)
        self.assertEqual(fetch.call_args.kwargs['user_agent'], 'Test Browser/1')
