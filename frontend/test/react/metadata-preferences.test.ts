import { expect, it, vi } from 'vitest';
import { reorderSource } from '../../src/react/scraping/metadata-preferences';
import { exportProcessingIssues } from '../../src/react/library-processing/issue-export';

it('拖动来源只调整指定条目的顺序', () => {
  expect(reorderSource(['fc2', 'fc2cmadb', 'javdb'], 'fc2cmadb', 'fc2', false)).toEqual(['fc2cmadb', 'fc2', 'javdb']);
  expect(reorderSource(['fc2', 'fc2cmadb', 'javdb'], 'fc2', 'javdb', true)).toEqual(['fc2cmadb', 'javdb', 'fc2']);
  expect(reorderSource(['fc2'], 'missing', 'fc2', true)).toEqual(['fc2']);
});

it('导出完整失败清单分页取得所有条目并核对任务号', async () => {
  const fetcher = vi.fn(async (url: string) => ({ ok: true, json: async () => ({ job_id: 'job', total: 201,
    rows: url.includes('offset=0&') ? Array.from({ length: 200 }, (_, asset_id) => ({ asset_id, message: '限流' }))
      : [{ asset_id: 201, message: '未找到' }] }) }));
  vi.stubGlobal('fetch', fetcher);
  const result = JSON.parse(await exportProcessingIssues({ status: 'failed', job_id: 'job' }, new AbortController().signal));
  expect(result.total).toBe(201);
  expect(fetcher).toHaveBeenCalledTimes(2);
  vi.unstubAllGlobals();
});

it('任务变化时拒绝混合导出两趟记录', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ job_id: 'different', total: 1, rows: [] }) })));
  await expect(exportProcessingIssues({ status: 'failed', job_id: 'job' }, new AbortController().signal)).rejects.toThrow('任务已变化');
  vi.unstubAllGlobals();
});
