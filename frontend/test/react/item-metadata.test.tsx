import { notifyManager, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { queryClient } from '../../src/react/query';
import { ItemMetadata, type ItemMetadataData } from '../../src/react/item-detail/item-metadata';
import { buttonNamed, click, mount, settle } from './render';

notifyManager.setScheduler(callback => callback());
beforeEach(() => {
  const matches = Element.prototype.matches;
  vi.spyOn(Element.prototype, 'matches').mockImplementation(function (this: Element, selector: string) {
    return selector === ':popover-open' ? this.hasAttribute('data-test-popover-open') : matches.call(this, selector);
  });
  const prototype = HTMLElement.prototype as HTMLElement & Record<string, unknown>;
  prototype.showPopover = function (this: HTMLElement) { this.setAttribute('data-test-popover-open', '') };
  prototype.hidePopover = function (this: HTMLElement) { this.removeAttribute('data-test-popover-open') };
});
afterEach(() => {
  queryClient.clear();
  const prototype = HTMLElement.prototype as unknown as Record<string, unknown>;
  delete prototype.showPopover;
  delete prototype.hidePopover;
});

const state: ItemMetadataData = { id: 1, code: 'FC2-PPV-1234567', snapshot_id: 'snapshot', revision: 2,
  busy: false, sources: [{ id: 'fc2cmadb', label: 'FC2CMADB' }, { id: 'fc2ppvdb', label: 'FC2PPV-DB' },
    { id: 'javdb', label: 'javdb' }], issues: [], protected: [], job: { status: 'idle' },
  groups: [{ field: 'performers', label: '出演者', current: '', candidates: [
    { candidate_key: 'cast', source: 'fc2cmadb', display_value: '来源艺名', source_url: 'https://example.test/article' },
    { candidate_key: 'other-cast', source: 'fc2ppvdb', display_value: '另一来源艺名' },
  ] }] };

it('打开详情不联网取证，可勾选多家来源并从候选中逐字段采用保护', async () => {
  queryClient.clear();
  const receipt = vi.fn();
  const fetcher = vi.fn(async (_url: string, options?: RequestInit) => ({ ok: true,
    json: async () => options?.method === 'POST' && JSON.parse(String(options.body)).action === 'apply'
      ? { ...state, protected: [{ field: 'performers', label: '出演者', source: 'fc2cmadb' }] } : state }));
  vi.stubGlobal('fetch', fetcher);
  const host = await mount(<QueryClientProvider client={queryClient}><ItemMetadata id={1} onReceipt={receipt} /></QueryClientProvider>);
  expect(fetcher).not.toHaveBeenCalled();
  await click(buttonNamed('重新抓取资料', host));
  await settle();
  expect(fetcher.mock.calls).toHaveLength(1);
  for (const name of ['FC2CMADB', 'FC2PPV-DB']) {
    await click([...host.querySelectorAll('label')].find(label => label.textContent?.trim() === name));
  }
  await settle();
  await click(buttonNamed('查询最新资料', host));
  const fetchBody = JSON.parse(String(fetcher.mock.calls.find(([, options]) => options?.method === 'POST')?.[1]?.body));
  expect(fetchBody).toMatchObject({ id: 1, action: 'fetch', sources: ['fc2cmadb', 'fc2ppvdb'],
    metadata_fields: ['title', 'performers', 'studio', 'release_date', 'tags'], fill_other_metadata: true });
  expect(host.textContent).toContain('所选的 2 家来源');
  await click(host.querySelector('#metadata-1-performers [data-select-trigger]'));
  await click(host.querySelector('#metadata-1-performers [data-select-option="cast"]'));
  await settle();
  await click(buttonNamed('采用所选资料并保护', host));
  await settle();
  expect(JSON.parse(String(fetcher.mock.calls.at(-1)?.[1]?.body))).toMatchObject({
    id: 1, action: 'apply', snapshot_id: 'snapshot', expected_revision: 2, choices: { performers: 'cast' },
  });
  expect(host.textContent).toContain('出演者已保护');
  expect(receipt).toHaveBeenCalledWith('已采用并保护影片资料');
});

it('未指定来源使用自动顺序，勾选可取消并回到自动顺序', async () => {
  const fetcher = vi.fn(async (_url: string, _options?: RequestInit) => ({ ok: true, json: async () => state }));
  vi.stubGlobal('fetch', fetcher);
  const host = await mount(<QueryClientProvider client={queryClient}><ItemMetadata id={1} onReceipt={vi.fn()} /></QueryClientProvider>);
  await click(buttonNamed('重新抓取资料', host));
  await settle();
  expect(host.textContent).toContain('未指定来源时按默认顺序查询');
  await click([...host.querySelectorAll('label')].find(label => label.textContent?.trim() === 'FC2PPV-DB'));
  expect(host.textContent).toContain('所选的 1 家来源');
  await click(buttonNamed('使用默认来源顺序', host));
  expect(host.textContent).toContain('未指定来源时按默认顺序查询');
  expect([...host.querySelector('fieldset')!.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')].every(input => !input.checked)).toBe(true);
  for (const name of ['标题', '发行日期', '标签', '顺便取得其他资料候选']) {
    await click([...host.querySelectorAll('label')].find(label => label.textContent?.trim() === name));
  }
  await click(buttonNamed('查询最新资料', host));
  expect(JSON.parse(String(fetcher.mock.calls.at(-1)?.[1]?.body))).toMatchObject({
    metadata_fields: ['performers', 'studio'], fill_other_metadata: false,
  });
});

it('网站限流原因保留在原位置，重新打开时能读取已保护字段', async () => {
  queryClient.clear();
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ ...state, groups: [],
    issues: ['来源请求过多，请稍后重试'], protected: [{ field: 'performers', label: '出演者', source: 'fc2cmadb' }] }) })));
  const host = await mount(<QueryClientProvider client={queryClient}><ItemMetadata id={1} onReceipt={vi.fn()} /></QueryClientProvider>);
  await click(buttonNamed('重新抓取资料', host));
  await settle();
  expect(host.textContent).toContain('来源请求过多，请稍后重试');
  expect(host.textContent).toContain('出演者已保护 · FC2CMADB');
  expect(buttonNamed('解除保护', host)).not.toBeNull();
});
