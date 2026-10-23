/* 完整文件重复与同番号版本使用同一份文件清单契约。 */
import { apiGet, apiSend } from '../../api';
import { queryClient } from '../query';

export const DUPLICATES_URL = '/api/duplicates?limit=120';
export const DUPLICATES_KEY = ['duplicates'] as const;
export const BATCH_URL = '/api/batch';
export const BATCH_LIMIT = 200;

export interface DuplicateFile {
  id: number; name: string; path: string | null; location: string; drive: string;
  size: number | null; duration: number | null; is_largest: boolean; is_longest: boolean;
}
export interface DuplicateGroup {
  key: string; code: string; kept: boolean; files: DuplicateFile[]; count: number;
  identical: boolean; evidence?: string; drives: string[]; cross_drive: boolean; reclaimable: number;
}
export interface DuplicatesData {
  total: number; files: number; reclaimable: number; groups: DuplicateGroup[]; has_more?: boolean;
  kept_total?: number; pending_files?: number; pending_bytes?: number;
  job?: { status: string; checked?: number; total?: number; failed?: number; read_bytes?: number; error?: string };
}
export type DuplicateMode = 'exact' | 'versions';
export const fetchDuplicates = (signal?: AbortSignal, mode: DuplicateMode = 'exact', kept = false) =>
  apiGet<DuplicatesData>(`${DUPLICATES_URL}${mode === 'versions' ? '&mode=versions' : ''}${kept ? '&kept=true' : ''}`, signal);

export async function prefetchDuplicates(signal: AbortSignal): Promise<void> {
  await queryClient.fetchQuery({ queryKey: DUPLICATES_KEY, queryFn: () => fetchDuplicates(signal) });
}

export function victimBytes(groups: readonly DuplicateGroup[], ids: readonly number[]): number {
  const victims = new Set(ids);
  return groups.reduce((total, group) => total + group.files.reduce(
    (sum, file) => sum + (victims.has(file.id) ? file.size || 0 : 0), 0), 0);
}

export async function batchOperate(ids: readonly number[], operation: 'dispose' | 'restore', reason: 'duplicate' | 'manual' = 'duplicate'): Promise<void> {
  for (let offset = 0; offset < ids.length; offset += BATCH_LIMIT) {
    await apiSend(BATCH_URL, { ids: ids.slice(offset, offset + BATCH_LIMIT), operation,
      ...(operation === 'dispose' ? { disposal_reason: reason } : {}) });
  }
}

export const duplicatesLede = (data: DuplicatesData, formatSize: (bytes: number) => string) =>
  `${data.total} 组 · ${data.files} 个文件 · 可回收 ${formatSize(data.reclaimable)}`;
