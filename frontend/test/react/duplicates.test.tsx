/* 逐项选择、保留决定与完整校验的真实组件交互。 */
import { notifyManager, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, expect, it, vi } from 'vitest';
import * as legacyUi from '@peach/legacy/ui';
import { DuplicatesPage } from '../../src/react/duplicates/duplicates-page';
import { batchOperate, DUPLICATES_KEY, type DuplicatesData } from '../../src/react/duplicates/duplicates';
import { queryClient } from '../../src/react/query';
import { buttonNamed, click, mount, sentBody, settle } from './render';

afterEach(() => queryClient.clear());
notifyManager.setScheduler(notify => notify());
const data: DuplicatesData = { total: 1, files: 2, reclaimable: 1024, pending_files: 2, pending_bytes: 2048, kept_total: 0,
  groups: [{ key: 'test-key', code: 'FC2-PPV-1234567', kept: false, identical: true, count: 2, drives: ['Y:'], cross_drive: false, reclaimable: 1024,
    files: [1, 2].map(id => ({ id, name: `FC2-PPV-1234567_${id}.mp4`, path: `Y:\\media\\${id}.mp4`,
      location: 'local', drive: 'Y:', size: 1024, duration: 300, is_largest: id === 1, is_longest: id === 1 })) }],
};
type Confirmation = Parameters<typeof legacyUi.confirmModal>[0];
function confirmations(confirm = true) {
  const seen: Confirmation[] = [];
  vi.spyOn(legacyUi, 'confirmModal').mockImplementation((async (options: Confirmation) => {
    seen.push(options); if (confirm) await options.onConfirm?.(); return { confirmed: confirm };
  }) as typeof legacyUi.confirmModal);
  return seen;
}
async function open() {
  const fetcher = vi.fn(async (url: string) => ({ ok: true, status: 200, json: async () => url.startsWith('/api/duplicates?') ? data : { ok: true } }));
  vi.stubGlobal('fetch', fetcher);
  queryClient.setQueryData(DUPLICATES_KEY, data);
  const props = { openItem: vi.fn(), toast: vi.fn(), failure: vi.fn() };
  const host = await mount(<QueryClientProvider client={queryClient}><DuplicatesPage {...props} /></QueryClientProvider>);
  return { host, fetcher, ...props };
}
const checkbox = (host: ParentNode, id: number) => host.querySelector<HTMLInputElement>(`input[aria-label="回收 FC2-PPV-1234567_${id}.mp4"]`)!;

it('每份文件默认不勾选，完整文件名与时间容量供比较', async () => {
  const { host } = await open();
  expect([...host.querySelectorAll('input[type="checkbox"]')].every(input => !(input as HTMLInputElement).checked)).toBe(true);
  expect(buttonNamed('将选中的 0 项移入回收站', host)?.disabled).toBe(true);
  expect(host.textContent).toContain('FC2-PPV-1234567_1.mp4');
  expect(host.textContent).toContain('SHA256 一致');
  expect(buttonNamed('整组回收', host)).toBeNull();
});

it('只回收勾选文件，确认点名数量与保留数量，撤销恢复同一项', async () => {
  const seen = confirmations();
  const { host, fetcher, toast } = await open();
  await click(checkbox(host, 2));
  await click(buttonNamed('将选中的 1 项移入回收站', host));
  await settle();
  expect(seen[0]?.body).toContain('其余 1 个文件保留');
  const batch = fetcher.mock.calls.findIndex(call => call[0] === '/api/batch');
  expect(sentBody(fetcher, batch)).toEqual({ ids: [2], operation: 'dispose', disposal_reason: 'duplicate' });
  const receipt = toast.mock.calls[0]?.[1] as { undo(): Promise<void> };
  await receipt.undo();
  const last = fetcher.mock.calls.map(call => call[0]).lastIndexOf('/api/batch');
  expect(sentBody(fetcher, last)).toEqual({ ids: [2], operation: 'restore' });
});

it('取消确认保留勾选且不回收', async () => {
  confirmations(false);
  const { host, fetcher } = await open();
  await click(checkbox(host, 1)); await click(buttonNamed('将选中的 1 项移入回收站', host));
  expect(fetcher.mock.calls.some(call => call[0] === '/api/batch')).toBe(false);
  expect(checkbox(host, 1).checked).toBe(true);
});

it('清除勾选不写任何记录', async () => {
  const { host, fetcher } = await open();
  await click(checkbox(host, 1)); await click(buttonNamed('取消勾选', host));
  expect(checkbox(host, 1).checked).toBe(false);
  expect(fetcher.mock.calls.some(call => call[0] === '/api/batch')).toBe(false);
});

it('整组保留保存全部文件的决定，已保留视图可取消', async () => {
  const { host, fetcher } = await open();
  await click(buttonNamed('整组保留', host)); await settle();
  let index = fetcher.mock.calls.findIndex(call => call[0] === '/api/duplicates/keep');
  expect(sentBody(fetcher, index)).toEqual({ key: 'test-key', mode: 'exact', keep: true });
  expect(fetcher.mock.calls.some(call => call[0] === '/api/batch')).toBe(false);
  await click(buttonNamed('已整组保留 0 组', host)); await settle();
  await vi.waitFor(() => expect(buttonNamed('取消整组保留', host)).not.toBeNull());
  await click(buttonNamed('取消整组保留', host)); await settle();
  index = fetcher.mock.calls.map(call => call[0]).lastIndexOf('/api/duplicates/keep');
  expect(sentBody(fetcher, index)).toEqual({ key: 'test-key', mode: 'exact', keep: false });
});

it('同番号版本单独读取，切换清除勾选', async () => {
  confirmations();
  const { host, fetcher } = await open();
  await click(checkbox(host, 1)); await click(buttonNamed('同番号版本', host)); await settle();
  expect(fetcher.mock.calls.some(call => call[0].includes('mode=versions'))).toBe(true);
  expect(host.textContent).toContain('时长或容量接近也不代表内容相同');
  await vi.waitFor(() => expect(checkbox(host, 1)).not.toBeNull());
  expect(checkbox(host, 1).checked).toBe(false);
  await click(checkbox(host, 1));
  await click(buttonNamed('将选中的 1 项移入回收站', host));
  const index = fetcher.mock.calls.findIndex(call => call[0] === '/api/batch');
  expect(sentBody(fetcher, index)).toEqual({ ids: [1], operation: 'dispose', disposal_reason: 'manual' });
});

it('完整校验先确认读全文件的容量与网盘流量', async () => {
  const seen = confirmations(); const { host, fetcher } = await open();
  await click(buttonNamed('校验完整文件', host)); await settle();
  expect(seen[0]?.body).toContain('完整读取 2 个');
  expect(seen[0]?.body).toContain('挂载网盘会产生下载流量');
  const index = fetcher.mock.calls.findIndex(call => call[0] === '/api/duplicates/hash');
  expect(sentBody(fetcher, index)).toEqual({ confirm_full_read: true });
});

it('点文件名或预览打开所选文件', async () => {
  const { host, openItem } = await open();
  await click(host.querySelector('button[title="FC2-PPV-1234567_1.mp4"]'));
  await click(host.querySelector('button[aria-label="预览 FC2-PPV-1234567_2.mp4"]'));
  expect(openItem.mock.calls).toEqual([[1], [2]]);
});

it('批量超过 200 条分批串行发送', async () => {
  const { fetcher } = await open();
  await batchOperate(Array.from({ length: 251 }, (_, index) => index + 1), 'dispose');
  const batches = fetcher.mock.calls.flatMap((call, index) => call[0] === '/api/batch' ? [sentBody(fetcher, index)] : []);
  expect(batches.map((body: { ids: number[] }) => body.ids.length)).toEqual([200, 51]);
});
