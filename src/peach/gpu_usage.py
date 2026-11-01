"""Windows GPU 引擎计数器；没有可读取计数器的平台不报告零占用。"""
from __future__ import annotations

import ctypes
import math
import os
import re
import sys
from ctypes import wintypes


class GpuCounters:
    def __init__(self):
        self.dll = None
        self.query = ctypes.c_void_p()
        self.counter = ctypes.c_void_p()
        self.collected = False
        self.error = '当前平台未提供逐进程 GPU 计数器'
        if sys.platform == 'darwin':
            self.error = '当前版本尚未接入 macOS 的逐进程 GPU 计数；不能使用整机占用代替任务占用'
        if os.name != 'nt':
            return
        try:
            self.dll = ctypes.WinDLL('pdh')
        except OSError:
            self.error = 'Windows GPU 计数器组件未取得'
            return
        self.dll.PdhOpenQueryW.argtypes = (wintypes.LPCWSTR, ctypes.c_size_t, ctypes.POINTER(ctypes.c_void_p))
        self.dll.PdhAddEnglishCounterW.argtypes = (ctypes.c_void_p, wintypes.LPCWSTR, ctypes.c_size_t,
                                                  ctypes.POINTER(ctypes.c_void_p))
        self.dll.PdhCollectQueryData.argtypes = (ctypes.c_void_p,)
        self.dll.PdhGetFormattedCounterArrayW.argtypes = (
            ctypes.c_void_p, wintypes.DWORD, ctypes.POINTER(wintypes.DWORD),
            ctypes.POINTER(wintypes.DWORD), ctypes.c_void_p)
        self.dll.PdhCloseQuery.argtypes = (ctypes.c_void_p,)
        for name in ('PdhOpenQueryW', 'PdhAddEnglishCounterW', 'PdhCollectQueryData',
                     'PdhGetFormattedCounterArrayW', 'PdhCloseQuery'):
            getattr(self.dll, name).restype = wintypes.DWORD
        code = self.dll.PdhOpenQueryW(None, 0, ctypes.byref(self.query))
        if not code:
            code = self.dll.PdhAddEnglishCounterW(
                self.query, r'\GPU Engine(*)\Utilization Percentage', 0, ctypes.byref(self.counter))
        self.error = f'GPU 计数器未取得（0x{code:08x}）' if code else ''
        if code:
            self.close()

    def sample(self):
        if self.error:
            return None, 'unavailable', self.error
        code = self.dll.PdhCollectQueryData(self.query)
        if code:
            return None, 'unavailable', f'GPU 计数器读取失败（0x{code:08x}）'
        if not self.collected:
            self.collected = True
            return None, 'sampling', '等待下一次 GPU 采样'
        size, count = wintypes.DWORD(), wintypes.DWORD()
        code = self.dll.PdhGetFormattedCounterArrayW(
            self.counter, 0x200, ctypes.byref(size), ctypes.byref(count), None)
        if code != 0x800007D2:
            return None, 'unavailable', f'GPU 计数器明细未取得（0x{code:08x}）'
        buffer = ctypes.create_string_buffer(size.value)
        code = self.dll.PdhGetFormattedCounterArrayW(
            self.counter, 0x200, ctypes.byref(size), ctypes.byref(count), buffer)
        if code:
            return None, 'unavailable', f'GPU 计数器明细读取失败（0x{code:08x}）'

        class Value(ctypes.Union):
            _fields_ = [('number', ctypes.c_double), ('large', ctypes.c_longlong)]
        class Formatted(ctypes.Structure):
            _fields_ = [('status', wintypes.DWORD), ('value', Value)]
        class Item(ctypes.Structure):
            _fields_ = [('name', wintypes.LPWSTR), ('formatted', Formatted)]

        items = ctypes.cast(buffer, ctypes.POINTER(Item))
        result = {}
        for index in range(count.value):
            item = items[index]
            if item.formatted.status not in (0, 1):
                continue
            match = re.match(r'pid_(\d+)_(.*)', item.name or '')
            if match and math.isfinite(item.formatted.value.number):
                result.setdefault(int(match[1]), {})[match[2]] = max(0.0, item.formatted.value.number)
        return result, 'ready', ''

    def close(self):
        if self.dll is not None and self.query.value:
            self.dll.PdhCloseQuery(self.query)
            self.query = ctypes.c_void_p()
