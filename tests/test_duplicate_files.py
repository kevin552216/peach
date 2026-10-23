"""完整文件证据、变体保护与可撤回的保留决定。"""
import hashlib
from contextlib import closing
from pathlib import Path
import sqlite3
import tempfile
import unittest
from types import SimpleNamespace
from unittest.mock import patch

from peach import duplicate_files as duplicates
from peach.web_state import WebContract
from support.ledger import fresh_ledger


class DuplicateFilesTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name).resolve()
        self.db = fresh_ledger(self.root)
        self.contract = WebContract(self.db, follow_state_root=self.root / 'state')
        self.addCleanup(self.contract.stop_background_jobs)
        self.next_id = 0
        self.mounts = patch.object(duplicates, 'location_mounts', return_value={'local': (self.root,)})
        self.mounts.start()
        self.addCleanup(self.mounts.stop)

    def add(self, content=b'video', code='FC2-PPV-1234567', duration=300, name=None):
        self.next_id += 1
        source = self.root / (name or f'FC2-PPV-1234567_{self.next_id}.mp4')
        source.write_bytes(content)
        with closing(sqlite3.connect(self.db)) as connection, connection:
            connection.execute(
                "INSERT INTO asset(id,location,path,name,medium,code,size,mtime,duration,first_seen) "
                "VALUES(?,'local',?,?,'video',?,?,?,?, '2026-10-23')",
                (self.next_id, str(source), source.name, code, len(content), source.stat().st_mtime, duration))
        return source

    def scan(self):
        result = duplicates.w_duplicate_hash(self.contract, {'confirm_full_read': True})
        self.contract.duplicate_hash_job.thread.join(timeout=10)
        state = self.contract.duplicate_hash_job.snapshot()
        self.assertEqual(state['status'], 'complete', state)
        return result

    def query(self, **args):
        return duplicates.q_duplicates(self.contract, args)

    def evidence(self):
        state = duplicates._load(self.contract)
        return (self.contract.duplicate_hash_job.snapshot(), [(row['id'], duplicates._identity(row), state['hashes'].get(str(row['id'])),
                 duplicates._stamp(duplicates._source(row).stat())) for row in duplicates._rows(self.contract)])

    def test_matching_full_bytes_are_confirmed_independent_of_name_and_code(self):
        first = self.add(b'content' * 100, duration=None, name='FC2-PPV-1234567_1.mp4')
        self.add(first.read_bytes(), code=None, duration=999, name='different-title_2.mp4')
        self.assertEqual(self.query()['total'], 0)
        self.scan()
        result = self.query()
        self.assertEqual((result['total'], result['files'], result['pending_files']), (1, 2, 0), self.evidence())
        self.assertTrue(result['groups'][0]['identical'])
        self.assertEqual(result['groups'][0]['evidence'], 'sha256')
        state = duplicates._load(self.contract)
        self.assertEqual(state['hashes']['1']['sha256'], hashlib.sha256(first.read_bytes()).hexdigest())

    def test_same_duration_and_size_with_different_bytes_are_independent(self):
        for index in range(1, 6):
            self.add(bytes([index]) * 64, name=f'FC2-PPV-1234567_{index}.mp4')
        self.scan()
        self.assertEqual(self.query()['total'], 0)
        versions = self.query(mode='versions')
        self.assertEqual(versions['groups'][0]['count'], 5)
        self.assertFalse(versions['groups'][0]['identical'])
        self.assertEqual(versions['reclaimable'], 0)

    def test_short_extra_and_subtitle_encodes_have_no_exact_group(self):
        self.add(b'full' * 100, duration=7200)
        self.add(b'extra', duration=90)
        self.add(b'subtitled' * 20, duration=7200)
        self.assertEqual(self.query()['pending_files'], 0)
        self.scan()
        self.assertEqual(self.query()['total'], 0)
        self.assertEqual(self.query(mode='versions')['files'], 3)

    def test_only_equal_size_files_are_read_and_success_is_reused(self):
        self.add(b'matching'); self.add(b'matching'); self.add(b'unique size')
        self.scan()
        with patch.object(duplicates, '_hash_file', side_effect=AssertionError('不应重复读取')):
            self.scan()
        self.assertEqual(self.query()['total'], 1)

    def test_replacing_same_size_content_invalidates_cached_evidence(self):
        source = self.add(b'matching'); self.add(b'matching')
        self.scan()
        source.write_bytes(b'differnt')
        self.assertEqual(self.query()['total'], 0)
        self.assertEqual(self.query()['pending_files'], 1)
        self.scan()
        self.assertEqual(self.query()['total'], 0)

    def test_retention_is_persistent_reversible_and_does_not_dispose(self):
        self.add(); self.add(); self.scan()
        key = self.query()['groups'][0]['key']
        duplicates.w_duplicate_keep(self.contract, {'key': key, 'keep': True})
        self.assertEqual(self.query()['total'], 0)
        kept = self.query(kept='true')
        self.assertEqual((kept['total'], kept['kept_total']), (1, 1))
        duplicates.w_duplicate_keep(self.contract, {'key': key, 'keep': False})
        self.assertEqual(self.query()['total'], 1)
        with closing(sqlite3.connect(self.db)) as connection, connection:
            self.assertEqual(connection.execute('SELECT count(*) FROM asset WHERE disposal IS NOT NULL').fetchone()[0], 0)

    def test_new_member_requires_a_fresh_retention_decision(self):
        self.add(); self.add()
        key = self.query(mode='versions')['groups'][0]['key']
        duplicates.w_duplicate_keep(self.contract, {'mode': 'versions', 'key': key, 'keep': True})
        self.add()
        self.assertEqual(self.query(mode='versions')['total'], 1)
        with self.assertRaisesRegex(ValueError, '已变化'):
            duplicates.w_duplicate_keep(self.contract, {'mode': 'versions', 'key': key, 'keep': True})

    def test_read_failure_is_not_confirmed_and_can_be_retried(self):
        source = self.add(); self.add(); source.unlink()
        self.scan()
        self.assertEqual(self.contract.duplicate_hash_job.snapshot()['failed'], 1)
        self.assertEqual(self.query()['total'], 0)
        source.write_bytes(b'video')
        self.scan()
        self.assertEqual(self.query()['total'], 1)

    def test_recycle_bin_items_are_excluded(self):
        self.add(); self.add(); self.scan()
        with closing(sqlite3.connect(self.db)) as connection, connection:
            connection.execute("UPDATE asset SET disposal='trash' WHERE id=1")
        self.assertEqual(self.query()['total'], 0)

    def test_one_path_registered_twice_is_not_two_copies(self):
        self.add()
        with closing(sqlite3.connect(self.db)) as connection, connection:
            connection.execute("INSERT INTO asset(location,path,name,medium,code,size,mtime,first_seen) "
                               "SELECT '115',path,name,medium,code,size,mtime,first_seen FROM asset WHERE id=1")
        self.assertEqual(self.query(mode='versions')['total'], 0)

    def test_full_read_requires_confirmation_and_authorized_roots(self):
        self.add(); self.add()
        with self.assertRaises(ValueError):
            duplicates.w_duplicate_hash(self.contract, {})
        with patch.object(duplicates, 'location_mounts', return_value={}), patch.object(duplicates, 'location_roots', return_value={}):
            self.scan()
        self.assertEqual(self.contract.duplicate_hash_job.snapshot()['failed'], 2)
        self.assertEqual(self.query()['total'], 0)

    def test_cancellation_does_not_return_partial_digest(self):
        source = self.add(b'a' * 2_000_000)
        with self.assertRaises(InterruptedError):
            duplicates._hash_file(source, lambda: False, lambda _: None)

    def test_handle_and_path_ctime_are_each_compared_with_the_same_api(self):
        source = self.add(b'video' * 200)
        stat = source.stat()
        handle_stat = SimpleNamespace(**{key: getattr(stat, key) for key in
            ('st_dev', 'st_ino', 'st_size', 'st_mtime_ns')}, st_ctime_ns=stat.st_ctime_ns + 1000)
        with patch.object(duplicates.os, 'fstat', return_value=handle_stat):
            digest, stamp = duplicates._hash_file(source, lambda: True, lambda _: None)
        self.assertEqual(digest, hashlib.sha256(source.read_bytes()).hexdigest())
        self.assertEqual(stamp, duplicates._stamp(stat))

    def test_mutation_during_full_read_has_no_digest(self):
        source = self.add(b'a' * 2_000_000)
        changed = False
        def mutate(_):
            nonlocal changed
            if not changed:
                changed = True
                with source.open('ab') as stream:
                    stream.write(b'x')
        with self.assertRaisesRegex(ValueError, '发生变化'):
            duplicates._hash_file(source, lambda: True, mutate)
