"""单档取证与人工采用的隔离回归，不访问真实网站或馆藏。"""
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from peach import web_contract, web_item_metadata as metadata
from peach.metadata_auto_apply import (auto_apply_metadata, metadata_decision_is_stale,
                                      _apply_metadata_candidate, _extend_approved_tags)
from peach.field_owners import auto_owner, review_owner
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
            metadata._fetch(self.contract, 'fetch', row, code, ['fc2cmadb'])
        return self.read()

    def apply(self, state, fields):
        choices = {group['field']: group['candidates'][0]['candidate_key']
                   for group in state['groups'] if group['field'] in fields}
        return metadata.w_item_metadata(self.contract, {'id': 1, 'action': 'apply', 'choices': choices,
            'snapshot_id': state['snapshot_id'], 'expected_revision': state['revision']})

    def test_query_is_read_only_and_sources_match_the_release_system(self):
        result = self.read()
        self.assertIn('fc2cmadb', [source['id'] for source in result['sources']])
        self.assertIn('fc2ppvdb', [source['id'] for source in result['sources']])
        self.assertIn('javdb', [source['id'] for source in result['sources']])
        self.assertIn('fc2club', [source['id'] for source in result['sources']])
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

    def test_native_selected_source_session_does_not_request_covers(self):
        row, code = metadata._asset(self.contract, 1)
        remote = metadata._SelectedSource(self.config, 'fc2cmadb')
        with patch.object(remote, '_metadata', return_value=[]) as query, patch.object(remote, '_cover') as cover:
            remote.collect(row, code, ['performers'], self.root / 'covers', include_covers=False,
                           update=lambda **_state: None, issue=lambda *_args, **_options: None)
        query.assert_called_once()
        cover.assert_not_called()

    def test_completion_during_read_does_not_stop_polling_with_old_candidates(self):
        completed = self.prepare()
        self.contract.item_metadata_job.state = {'job_id': 'fetch', 'status': 'running', 'asset_id': 1}
        saved = metadata._saved

        def finishing(asset_id):
            self.contract.item_metadata_job.state['status'] = 'complete'
            return {}

        with patch.object(metadata, '_saved', side_effect=finishing):
            crossing = self.read()
        self.assertTrue(crossing['busy'])
        self.assertEqual(crossing['job']['status'], 'running')
        self.assertEqual(crossing['groups'], [])
        with patch.object(metadata, '_saved', wraps=saved):
            after = self.read()
        self.assertFalse(after['busy'])
        self.assertEqual(after['snapshot_id'], completed['snapshot_id'])
        self.assertTrue(after['groups'])

    def test_requested_sources_reject_inapplicable_duplicate_and_malformed_choices(self):
        available = {'fc2cmadb', 'fc2ppvdb'}
        self.assertEqual(metadata._requested_sources({'sources': ['fc2ppvdb', 'fc2cmadb']}, available),
                         ['fc2ppvdb', 'fc2cmadb'])
        self.assertEqual(metadata._requested_sources({'sources': []}, available), [])
        for sources in ('fc2cmadb', ['fc2cmadb', 'fc2cmadb'], ['dmm'], [True], [{}]):
            with self.subTest(sources=sources), self.assertRaises(ValueError):
                metadata._requested_sources({'sources': sources}, available)

    def test_metadata_options_preserve_conditions_and_reject_empty_or_ambiguous_scope(self):
        self.assertEqual(metadata.request_options({}), {})
        expected = {'metadata_fields': ['performers', 'studio'], 'fill_other_metadata': False}
        self.assertEqual(metadata.request_options({}, expected), expected)
        default = metadata.request_options({'fill_other_metadata': False})
        self.assertEqual(default['metadata_fields'], list(metadata.engine.COLLECTED_FIELDS))
        self.assertFalse(default['fill_other_metadata'])
        for body in ({'metadata_fields': None}, {'metadata_fields': []}, {'metadata_fields': ['unknown']},
                     {'metadata_fields': ['performers', 'performers']}, {'fill_other_metadata': 'false'}):
            with self.subTest(body=body), self.assertRaises(ValueError):
                metadata.request_options(body)

    def test_all_selected_sources_are_queried_and_candidates_keep_their_source(self):
        row, code = metadata._asset(self.contract, 1)
        queried = []

        class Remote:
            def __init__(_self, _config, source):
                _self.source = source
            def collect(_self, _row, _code, missing, _cover, *, received, issue, **options):
                queried.append(_self.source)
                self.assertFalse(options['include_covers'])
                if _self.source == 'javdb':
                    issue(_row, 'JavDB：HTTP 429，请稍后重试')
                    return
                payload = {'id': code, 'title': '来源标题', 'maker': '来源厂牌', 'release_date': '2024-01-01',
                           'actresses': [{'japanese_name': _self.source + '艺名'}], 'genres': ['素人']}
                received([(_self.source, payload, self.root / 'unused')])
            def close(_self):
                pass

        selected = ['fc2cmadb', 'fc2ppvdb', 'javdb']
        self.contract.item_metadata_job.state = {'job_id': 'multi', 'status': 'running', 'asset_id': 1}
        with patch.object(metadata, '_SelectedSource', Remote):
            metadata._fetch(self.contract, 'multi', row, code, selected)
        after = self.read()
        self.assertEqual(queried, selected)
        cast = next(group for group in after['groups'] if group['field'] == 'performers')
        self.assertEqual({choice['source'] for choice in cast['candidates']}, {'fc2cmadb', 'fc2ppvdb'})
        self.assertEqual([(result['source'], result['status']) for result in after['source_results']],
                         [('fc2cmadb', 'received'), ('fc2ppvdb', 'received'), ('javdb', 'unavailable')])
        self.assertIn('429', after['issues'][0])
        self.assertEqual(after['protected'], [])

    def test_non_fc2_video_exposes_its_own_sources(self):
        with self.contract.write_transaction() as connection:
            connection.execute("UPDATE asset SET code='ABP-123' WHERE id=1")
        sources = {source['id'] for source in self.read()['sources']}
        self.assertTrue({'javdb', 'javbus', 'r18dev', 'dmm'}.issubset(sources))
        self.assertNotIn('fc2cmadb', sources)

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

    def test_actor_only_adoption_invalidates_a_stale_page(self):
        state = self.prepare()
        result = self.apply(state, ['performers'])
        self.assertGreater(result['revision'], state['revision'])
        with self.assertRaises(ValueError):
            self.apply(state, ['performers'])
        with self.assertRaises(ValueError):
            metadata.w_item_metadata(self.contract, {'id': 1, 'action': 'unlock', 'field': 'performers',
                'expected_revision': state['revision']})

    def test_legacy_code_group_cannot_overwrite_a_protected_file(self):
        self.apply(self.prepare(), ['performers'])
        group = next(group for group in metadata._saved(1)['groups'] if group['field'] == 'performers')
        candidate = json.loads(group['candidates_json'])[0]
        candidate.update(value=[{'name': '相沢みなみ'}], candidate_key='new-source-value')
        legacy = {**group, 'item_key': 'FC2-PPV-1234567:performers'}
        legacy.pop('asset_id')
        legacy.pop('asset_path')
        with self.assertRaises(ValueError):
            with self.contract.write_transaction() as connection:
                _apply_metadata_candidate(connection, legacy, candidate, 'now', auto_owner('fc2cmadb'))

    def test_legacy_tag_union_respects_protection_but_explicit_review_can_replace(self):
        self.prepare()
        group = next(group for group in metadata._saved(1)['groups'] if group['field'] == 'title')
        candidate = json.loads(group['candidates_json'])[0]
        candidate.update(value=['巨乳'], candidate_key='tags')
        group.update(field='tags', item_key='asset:1:tags')
        with self.contract.write_transaction() as connection:
            _apply_metadata_candidate(connection, group, candidate, 'now', review_owner('fc2cmadb'))
            connection.execute("INSERT INTO review_decision(category,item_key,status,note,updated_at) "
                               "VALUES('metadata_fields','asset:1:tags','approved',?,'now')",
                               (json.dumps({'user_locked': True, 'source': 'fc2cmadb'}),))
            legacy = {key: value for key, value in group.items() if key not in ('asset_id', 'asset_path')}
            legacy['item_key'] = 'FC2-PPV-1234567:tags'
            candidate.update(value=['巨乳', '口交'], candidate_key='new-tags')
            self.assertIsNone(_extend_approved_tags(connection, legacy, candidate, 'union-test', 'now'))
            self.assertEqual(_apply_metadata_candidate(connection, group, candidate, 'now', review_owner('fc2cmadb')), 1)

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
