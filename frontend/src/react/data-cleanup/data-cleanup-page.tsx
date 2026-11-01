/* 数据管理首页保留日常入库、待处理摘要与维护入口，具体表单和清单在二级页展开。 */
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fmtSize } from '@peach/legacy/core';
import { shellNavigate } from '@peach/history';
import { CLEANUP_HASH_REDIRECTS, CLEANUP_TOOLS, type CleanupTool } from '../../cleanup-tools';
import type { DataCleanupProps, DataCleanupSection } from '../bundle';
import { SectionHeading } from '../components/fieldset';
import { Page } from '../components/page';
import { spriteGlyph, type Glyph } from '../components/sprite-glyph';
import { PLAIN_STAT_STRIP, PlainStat, plainStatClass } from '../components/stat-card';
import { DUPLICATES_KEY, fetchDuplicates } from '../duplicates/duplicates';
import { LibraryProcessingCard } from '../library-processing/library-processing-card';
import { fetchQualityGoals, QUALITY_GOALS_KEY } from '../quality-goals/quality-goals';
import { queryClient } from '../query';
import {
  fetchJunkSummary, fetchReviewCounts, fetchTrashSummary, JUNK_KEY, junkBreakdown,
  REVIEW_COUNTS_KEY, reviewSummary, TRASH_KEY,
} from './data-cleanup';
import { CLEANUP_ENTRY_GRID } from './cleanup-entry';
import { CleanupEntryCard } from './cleanup-entry-card';

export { DataCleanupToolPage } from './data-cleanup-tool-page';

interface Reading { figure: string; meta?: string; state?: 'loading' | 'error' }
function reading<T>(query: { data: T | undefined; isError: boolean }, read: (data: T) => Reading): Reading {
  if (query.data !== undefined) return read(query.data);
  return query.isError ? { figure: '读取失败', state: 'error' } : { figure: '正在读取…', state: 'loading' };
}

function EntryCard({ section, label, icon, value, open }: {
  section: DataCleanupSection; label: string; icon: Glyph; value: Reading; open(section: DataCleanupSection): void;
}) {
  return <button type="button" className={plainStatClass({ interactive: true })} data-cleanup-go={section}
    data-entry-state={value.state} aria-busy={value.state === 'loading' || undefined} onClick={() => open(section)}>
    <PlainStat label={label} icon={icon} figure={value.figure} meta={value.meta} />
  </button>;
}

function ToolEntry({ tool, navigate }: { tool: CleanupTool; navigate(path: string): void }) {
  const Icon = spriteGlyph(tool.icon);
  return <CleanupEntryCard label={tool.title} icon={Icon} summary={tool.description}
    attributes={{ 'data-cleanup-tool': tool.key }} onOpen={() => navigate(tool.path + location.search)} />;
}

const REVIEW = spriteGlyph('square-check-big');
const QUALITY = spriteGlyph('sparkles');
const DUPLICATES = spriteGlyph('file-stack');
const JUNK = spriteGlyph('file-archive');
const TRASH = spriteGlyph('trash');
const refreshReadings = () => {
  for (const queryKey of [REVIEW_COUNTS_KEY, QUALITY_GOALS_KEY, DUPLICATES_KEY, JUNK_KEY]) {
    void queryClient.invalidateQueries({ queryKey, exact: true });
  }
};

export function DataCleanupPage({ toast, open, navigate }: DataCleanupProps) {
  const review = useQuery({ queryKey: REVIEW_COUNTS_KEY, queryFn: ({ signal }) => fetchReviewCounts(signal) });
  const quality = useQuery({ queryKey: QUALITY_GOALS_KEY, queryFn: ({ signal }) => fetchQualityGoals(signal) });
  const duplicates = useQuery({ queryKey: DUPLICATES_KEY, queryFn: ({ signal }) => fetchDuplicates(signal) });
  const junk = useQuery({ queryKey: JUNK_KEY, queryFn: ({ signal }) => fetchJunkSummary(signal) });
  const trash = useQuery({ queryKey: TRASH_KEY, queryFn: ({ signal }) => fetchTrashSummary(signal) });
  useEffect(() => {
    const target = CLEANUP_HASH_REDIRECTS[location.hash];
    if (target) shellNavigate(target + location.search, { replace: true });
  }, []);

  return <Page>
    <section aria-labelledby="cleanup-pending" className="flex flex-col gap-4">
      <SectionHeading id="cleanup-pending">待处理事项</SectionHeading>
      <div className={PLAIN_STAT_STRIP}>
        <EntryCard section="review" label="人工复核" icon={REVIEW} open={open} value={reading(review, reviewSummary)} />
        <EntryCard section="duplicates" label="重复文件" icon={DUPLICATES} open={open}
          value={reading(duplicates, data => Number(data.total || 0) ? {
            figure: `${Number(data.total).toLocaleString()} 组 · ${Number(data.files || 0).toLocaleString()} 个文件`,
            meta: `可回收 ${fmtSize(data.reclaimable || 0)}`,
          } : { figure: '没有重复内容' })} />
        <EntryCard section="ads" label="垃圾文件" icon={JUNK} open={open}
          value={reading(junk, data => ({ figure: `${Number(data.pending_total || 0).toLocaleString()} 个待判断`, meta: junkBreakdown(data) }))} />
        <EntryCard section="quality" label="高清版" icon={QUALITY} open={open}
          value={reading(quality, data => ({ figure: `${Number(data.total || 0).toLocaleString()} 个待升级` }))} />
        <EntryCard section="trash" label="回收站" icon={TRASH} open={open}
          value={reading(trash, data => ({ figure: `${Number(data.total || 0).toLocaleString()} 项在回收站`, meta: data.total ? `占用 ${fmtSize(data.bytes || 0)}` : '查看和还原已移入回收站的内容' }))} />
      </div>
    </section>
    <div id="libraryProcessing" className="scroll-mt-20">
      <LibraryProcessingCard toast={message => toast(message)} monitor onComplete={refreshReadings} />
    </div>
    <section aria-labelledby="cleanup-maintenance" className="flex flex-col gap-4">
      <SectionHeading id="cleanup-maintenance">整理与维护</SectionHeading>
      <div className={CLEANUP_ENTRY_GRID}>
        {CLEANUP_TOOLS.filter(tool => tool.key !== 'batch-delete').map(tool => <ToolEntry key={tool.key} tool={tool} navigate={navigate} />)}
      </div>
    </section>
    <section aria-labelledby="cleanup-deletion" className="flex flex-col gap-4">
      <SectionHeading id="cleanup-deletion">清理与删除</SectionHeading>
      <div className={CLEANUP_ENTRY_GRID}>
        {CLEANUP_TOOLS.filter(tool => tool.key === 'batch-delete').map(tool => <ToolEntry key={tool.key} tool={tool} navigate={navigate} />)}
      </div>
    </section>
  </Page>;
}
