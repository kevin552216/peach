"""用户命名规则的预览、持久化与入库识别。"""
from pathlib import Path
import tempfile
import unittest
from types import SimpleNamespace

from peach import filename_rules
from peach.web_filename_rules import q_filename_rules, w_filename_rules


FC2 = dict(name='FC2', pattern=r'自訂_(?P<id>\d{5,})', replacement=r'FC2-PPV-\g<id>', enabled=True)


class FilenameRuleTests(unittest.TestCase):
    def test_capture_normalizes_the_identifier_and_disabled_rules_fall_back(self):
        self.assertEqual(filename_rules.Engine([FC2]).recognize('自訂_1234567 片名.mp4')['code'],
                         'FC2-PPV-1234567')
        engine = filename_rules.Engine([{**FC2, 'enabled': False}])
        self.assertIsNone(engine.recognize('自訂_1234567.mp4')['code'])
        self.assertEqual(engine.recognize('ABW-358.mp4')['code'], 'ABW-358')

    def test_first_valid_rule_wins_and_invalid_outputs_use_builtin_recognition(self):
        first = {**FC2, 'pattern': r'(?P<id>\d{5,})'}
        second = {**first, 'replacement': r'FC2-PPV-9999999'}
        self.assertEqual(filename_rules.Engine([first, second]).recognize('自訂_1234567.mp4')['code'],
                         'FC2-PPV-1234567')
        invalid = {**first, 'replacement': 'not-a-code'}
        self.assertEqual(filename_rules.Engine([invalid]).recognize('FC2-PPV-1234567.mp4')['source'], 'builtin')

    def test_invalid_patterns_and_capture_references_are_rejected(self):
        for patch in ({'pattern': '['}, {'replacement': r'FC2-PPV-\g<missing>'}, {'enabled': 'yes'}):
            with self.subTest(patch=patch), self.assertRaises(ValueError):
                filename_rules.Engine([{**FC2, **patch}])

    def test_expensive_matching_has_a_deadline(self):
        rule = {**FC2, 'pattern': r'(a+)+$', 'replacement': 'FC2-PPV-1234567'}
        with self.assertRaisesRegex(ValueError, '超时'):
            filename_rules.Engine([rule]).recognize('a' * 4000 + '!')

    def test_sidecar_pairing_uses_the_same_custom_identifier(self):
        from peach.library_nfo import SidecarIndex
        root = Path(tempfile.gettempdir()).resolve()
        video = root / '自訂_1234567 片名.mp4'
        nfo = root / 'FC2-PPV-1234567.nfo'
        listing = SidecarIndex({path.name.casefold(): path for path in (video, nfo)},
                               filename_rules.Engine([FC2]).code)
        self.assertEqual(listing.for_video(video)[0], nfo)

    def test_preview_never_saves_and_invalid_save_preserves_rules(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory).resolve()
            contract = SimpleNamespace(follow_state_root=root)
            self.assertEqual(q_filename_rules(contract, {})['items'], [])
            body = dict(action='preview', items=[FC2], filename='自訂_1234567.mp4')
            self.assertEqual(w_filename_rules(contract, body)['code'], 'FC2-PPV-1234567')
            self.assertFalse((root / filename_rules.FILENAME).exists())
            w_filename_rules(contract, {'items': [FC2]})
            with self.assertRaises(ValueError):
                w_filename_rules(contract, {'items': [{**FC2, 'pattern': '['}]})
            self.assertEqual(q_filename_rules(contract, {})['items'], [FC2])

    def test_clearing_rules_restores_the_builtin_behavior(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory).resolve()
            filename_rules.save(root, [FC2])
            self.assertEqual(filename_rules.Engine(filename_rules.load(root)).recognize('自訂_1234567.mp4')['source'],
                             'custom')
            filename_rules.save(root, [])
            self.assertIsNone(filename_rules.Engine(filename_rules.load(root)).recognize('自訂_1234567.mp4')['code'])
