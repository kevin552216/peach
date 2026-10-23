import { act } from 'react';
import { QueryClientProvider, notifyManager } from '@tanstack/react-query';
import { afterEach, expect, it, vi } from 'vitest';

import { queryClient } from '../../src/react/query';
import { FilenameRulesSettings } from '../../src/react/settings/filename-rules-settings';
import { buttonNamed, click, mount, pending, settle, submit, type } from './render';

notifyManager.setScheduler(notify => notify());
afterEach(() => queryClient.clear());

it('新增规则后可预览，保存完成才发出回执', async () => {
  const saving = pending<{ items: unknown[] }>();
  const receipt = vi.fn();
  const requests: Record<string, unknown>[] = [];
  vi.stubGlobal('fetch', vi.fn(async (_url, init?: RequestInit) => {
    if (init?.method !== 'POST') return { ok: true, json: async () => ({ items: [] }) };
    const body = JSON.parse(String(init.body)); requests.push(body);
    return { ok: true, json: () => body.action === 'preview'
      ? Promise.resolve({ code: 'FC2-PPV-1234567', source: 'custom', rule: 'FC2 番号' }) : saving.answer };
  }));
  const host = await mount(<QueryClientProvider client={queryClient}><FilenameRulesSettings receipt={receipt} /></QueryClientProvider>);
  await settle();
  await click(buttonNamed('新增规则', host));
  const sample = host.querySelector<HTMLInputElement>('[name="filename-sample"]')!;
  await act(async () => { sample.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })) });
  await settle();
  expect(requests[0]?.action).toBe('preview');
  expect(host.textContent).toContain('匹配规则：FC2 番号');
  expect(receipt).not.toHaveBeenCalled();
  await type(sample, '另一个文件.mp4');
  expect(host.textContent).not.toContain('匹配规则：');
  await submit(host.querySelector('form'));
  expect(receipt).not.toHaveBeenCalled();
  const items = requests[1]?.items as unknown[];
  expect(items).toHaveLength(1);
  await saving.release({ items });
  await settle();
  expect(receipt).toHaveBeenCalledWith('已保存文件名辨识规则');
});

it('保存错误保留用户编辑，移除全部规则可恢复内置辨识', async () => {
  const items = [{ name: '我的规则', pattern: '(id)', replacement: '\\1', enabled: true }];
  let body: { items?: unknown[] } = {};
  vi.stubGlobal('fetch', vi.fn(async (_url, init?: RequestInit) => {
    if (init?.method !== 'POST') return { ok: true, json: async () => ({ items }) };
    body = JSON.parse(String(init.body));
    return { ok: false, status: 400, json: async () => ({ error: '表达式无效' }) };
  }));
  const host = await mount(<QueryClientProvider client={queryClient}><FilenameRulesSettings receipt={vi.fn()} /></QueryClientProvider>);
  await settle();
  await type(host.querySelector<HTMLInputElement>('[name="rule-pattern-0"]'), '[');
  await submit(host.querySelector('form'));
  await settle();
  expect(host.textContent).toContain('表达式无效');
  expect(host.querySelector<HTMLInputElement>('[name="rule-pattern-0"]')?.value).toBe('[');
  await click(buttonNamed('移除规则 1', host));
  await submit(host.querySelector('form'));
  await settle();
  expect(body.items).toEqual([]);
});
