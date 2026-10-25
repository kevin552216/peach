import { apiGet } from '../../api';
import type { LibraryProcessingData, LibraryProcessingIssue } from './library-processing';

const ISSUES_URL = '/api/library-processing/issues';
interface IssuePage { job_id: string; total: number; rows: LibraryProcessingIssue[] }

/** 按任务号分页读取完整清单，任务已变化时由服务端拒绝，避免混合两趟结果。 */
export async function exportProcessingIssues(state: LibraryProcessingData, signal: AbortSignal): Promise<string> {
  if (!state.job_id) throw new Error('请先选择有问题记录的任务');
  const rows: LibraryProcessingIssue[] = [];
  let total = 1;
  for (let offset = 0; offset < total; offset += 200) {
    const page: IssuePage = await apiGet<IssuePage>(
      `${ISSUES_URL}?job_id=${encodeURIComponent(state.job_id)}&offset=${offset}&limit=200`, signal);
    if (offset === 0) total = page.total;
    if (page.job_id !== state.job_id) throw new Error('任务已变化，请重新导出');
    rows.push(...page.rows);
  }
  return JSON.stringify({ job_id: state.job_id, exported_at: new Date().toISOString(), total: rows.length, rows }, null, 2);
}

export function downloadIssueList(jobId: string, contents: string): void {
  const url = URL.createObjectURL(new Blob([contents], { type: 'application/json;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `peach-issues-${jobId}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
