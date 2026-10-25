"""单档取证与人工采用的隔离回归，不访问真实网站或馆藏。"""
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from peach import web_contract, web_item_metadata as metadata
from peach.metadata_auto_apply import auto_apply_metadata, metadata_decision_is_stale
from peach.settings_file import PeachConfig
from support.ledger import fresh_ledger


class ItemMetadataTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()
        self.config = PeachConfig(data_root=self.root, path=self.root / 'config.toml')
        self.contract = web_contract.WebContract(fresh_ledger(self.root), candidate_root=self.root / 'review')
        self.addCleanup(self.contract.stop_background_jobs)
        self.patch_config = patch.object(metadata.settings_file, 'active', return_value=self.config)
        self.patch_config.start()
        self.addCleanup(self.patch_config.stop)
        with self.contract.write_transaction() as connection:
            for asset_id in (1, 2):
                connection.execute(
                    "INSERT INTO asset(id,location,path,name,medium,code,catalog_title) "
                    "VALUES(?,'local',?,?,'video','FC2-PPV-1234567','原来的标题')",
                    (asset_id, f'Z:\\Media\\part{asset_id}.mp4', f'part{asset_id}.mp4'))

    def read(self):
        return metadata.q_item_metadata(self.contract, {'id': 1})

    def prepare(self):
        row, code = metadata._asset(self.contract, 1)
        payload = {'id': '1234567', 'title': '来源新标题', 'actresses': [{'japanese_name': '蓮実ちせ'}],
                   'source_url': 'https://fc2cmadb.com/articles/1234567'}
        class Remote:
            def collect(_self, _row, _code, missing, _cover, *, received, **options):
                self.assertFalse(options['include_covers'])
                received([('fc2cmadb', payload, self.root / 'unused')])
            def close(_self):
                pass
        self.contract.item_metadata_job.state = {'job_id': 'fetch', 'status': 'running', 'asset_id': 1}
        with patch.object(metadata, '_SelectedSource', return_value=Remote()):
            metadata._fetch(self.contract, 'fetch', row, code, 'fc2cmadb')
        return self.read()

    def apply(self, state, fields):
        choices = {group['field']: group['candidates'][0]['candidate_key']
                   for group in state['groups'] if group['field'] in fields}
        return metadata.w_item_metadata(self.contract, {'id': 1, 'action': 'apply', 'choices': choices,
            'snapshot_id': state['snapshot_id'], 'expected_revision': state['revision']})

    def test_query_is_read_only_and_sources_match_the_release_system(self):
        result = self.read()
        self.assertIn('fc2cmadb', [source['id'] for source in result['sources']])
        self.assertNotIn('dmm', [source['id'] for source in result['sources']])
        self.assertEqual(result['groups'], [])
        self.assertFalse(metadata._path(1).exists())
        for value in (True, None, -1, '1/../2', 3):
            with self.subTest(value=value), self.assertRaises(ValueError):
                metadata.q_item_metadata(self.contract, {'id': value})

    def test_selected_source_ignores_disk_cache_and_queries_only_that_source(self):
        remote = metadata._SelectedSource(self.config, 'fc2cmadb')
        self.assertEqual(remote._chain('FC2-PPV-1234567'), ('fc2cmadb',))
        self.assertFalse(remote._consult)
        with self.assertRaises(ValueError):
            metadata.w_item_metadata(self.contract, {'id': 1, 'source': 'dmm'})

    def test_fetch_only_prepares_candidates_and_apply_is_scoped_and_protected(self):
        state = self.prepare()
        self.assertTrue(state['groups'])
        self.assertEqual(next(group for group in state['groups'] if group['field'] == 'title')['current'], '原来的标题')
        after = self.apply(state, ['title', 'performers'])
        self.assertEqual({entry['field'] for entry in after['protected']}, {'title', 'performers'})
        with self.contract.read_connection() as connection:
            self.assertEqual(connection.execute('SELECT catalog_title FROM asset WHERE id=1').fetchone()[0], '来源新标题')
            self.assertEqual(connection.execute('SELECT catalog_title FROM asset WHERE id=2').fetchone()[0], '原来的标题')
            owners = json.loads(connection.execute('SELECT field_owners FROM asset WHERE id=1').fetchone()[0])
            self.assertEqual(owners['catalog_title'], 'review:fc2cmadb')

    def test_changed_snapshot_and_stale_revision_are_rejected_without_writes(self):
        state = self.prepare()
        invalid = {**state, 'snapshot_id': 'old'}
        with self.assertRaises(ValueError):
            self.apply(invalid, ['title'])
        self.apply(state, ['title'])
        with self.assertRaises(ValueError):
            self.apply(state, ['title'])

    def test_sync_preserves_locked_fields_even_when_candidates_change(self):
        state = self.prepare()
        self.apply(state, ['title', 'performers'])
        saved = metadata._saved(1)
        rows = saved['groups']
        for group in rows:
            candidates = json.loads(group['candidates_json'])
            for candidate in candidates:
                candidate['candidate_key'] = 'changed'
                candidate['value'] = '另一个标题' if group['field'] == 'title' else [{'name': '其他人'}]
            group['candidates_json'] = json.dumps(candidates)
        result = auto_apply_metadata(self.contract.database, self.contract.candidate_root, candidate_rows=rows)
        self.assertEqual(result['applied'], 0)
        with self.contract.read_connection() as connection:
            self.assertEqual(connection.execute('SELECT catalog_title FROM asset WHERE id=1').fetchone()[0], '来源新标题')
            names = [row[0] for row in connection.execute(
                "SELECT e.canonical_name FROM asset_entity ae JOIN entity e ON e.id=ae.entity_id WHERE ae.asset_id=1 AND ae.role='performer'")]
            self.assertEqual(names, ['蓮実ちせ'])
        self.assertFalse(metadata_decision_is_stale({'status': 'approved', 'note': json.dumps({
            'user_locked': True, 'candidate_key': 'old'})}, [{'candidate_key': 'changed'}]))

    def test_unlock_keeps_value_and_changes_only_the_selected_protection(self):
        state = self.apply(self.prepare(), ['title', 'performers'])
        result = metadata.w_item_metadata(self.contract, {'id': 1, 'action': 'unlock', 'field': 'title',
            'expected_revision': state['revision']})
        self.assertEqual([entry['field'] for entry in result['protected']], ['performers'])
        with self.contract.read_connection() as connection:
            row = connection.execute('SELECT catalog_title,field_owners FROM asset WHERE id=1').fetchone()
            self.assertEqual(row['catalog_title'], '来源新标题')
            self.assertEqual(json.loads(row['field_owners'])['catalog_title'], 'auto:fc2cmadb')

    def test_invalid_choice_rolls_back_the_whole_adoption(self):
        state = self.prepare()
        with self.assertRaises(ValueError):
            metadata.w_item_metadata(self.contract, {'id': 1, 'action': 'apply',
                'snapshot_id': state['snapshot_id'], 'expected_revision': state['revision'],
                'choices': {'title': state['groups'][0]['candidates'][0]['candidate_key'], 'performers': 'missing'}})
        self.assertEqual(self.read()['protected'], [])
