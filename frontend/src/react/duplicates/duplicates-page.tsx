/* 完整文件校验与同番号版本比较，回收由用户逐项勾选。 */
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { confirmModal, MEDIA_SOURCE_ICONS } from '@peach/legacy/ui';
import { fmtDur, fmtSize, LOC } from '@peach/legacy/core';
import { Button } from '@/components/base/buttons/button';
import { Checkbox } from '@/components/base/checkbox/checkbox';
import { apiSend, errorMessage } from '../../api';
import { EXACT_COPY, EXACT_TITLE, SELECT_COPY } from '../../duplicates-copy';
import type { DuplicatesProps } from '../bundle';
import { cardClass } from '../components/card';
import { CollectionSummary } from '../components/collection-summary';
import { EmptyState } from '../components/empty-state';
import { FilterGlass, GlassPill } from '../components/filter-glass';
import { Note } from '../components/note';
import { spriteGlyph } from '../components/sprite-glyph';
import { TRASH_KEY } from '../data-cleanup/data-cleanup';
import { queryClient } from '../query';
import { SourceMark } from '../settings/section';
import { busyProps } from '../settings/use-action';
import { batchOperate, DUPLICATES_KEY, fetchDuplicates, victimBytes,
  type DuplicateFile, type DuplicateMode } from './duplicates';

const PLAY = spriteGlyph('play');
const STACK = spriteGlyph('file-stack');
const GROUP = cardClass({ padding: 'none', radius: 'surface', className: 'mb-6 overflow-hidden dark:bg-background-primary-default' });
const MONO = 'font-mono text-caption-1-regular leading-5 text-text-secondary';
const refresh = () => {
  void queryClient.invalidateQueries({ queryKey: DUPLICATES_KEY });
  void queryClient.invalidateQueries({ queryKey: TRASH_KEY, exact: true });
};

function FileRow({ file, selected, toggle, openItem }: {
  file: DuplicateFile; selected: boolean; toggle(checked: boolean): void; openItem(id: number): void;
}) {
  const open = () => openItem(file.id);
  return <div className="duplicate-row items-center gap-3 border-t border-separator-border px-5 py-4 max-compact:p-4">
    <button type="button" onClick={open} aria-label={`预览 ${file.name}`}
      className="relative row-span-2 inline-grid aspect-16/10 w-full cursor-pointer place-items-center overflow-hidden rounded-2lg bg-background-tertiary-default text-text-secondary">
      <PLAY aria-hidden className="size-6" />
      <img src={`/thumb?id=${file.id}&c=4`} alt="" loading="lazy" onError={event => event.currentTarget.remove()}
        className="absolute inset-0 size-full object-contain" />
    </button>
    <div className="flex min-w-0 flex-wrap items-center gap-3 max-duplicate-narrow:col-start-2 max-duplicate-narrow:-col-end-1">
      <Checkbox aria-label={`回收 ${file.name}`} isSelected={selected} onChange={toggle}>移入回收站</Checkbox>
      <button type="button" onClick={open} title={file.name}
        className="min-w-0 cursor-pointer text-left wrap-anywhere text-body-regular hover:text-text-secondary">{file.name}</button>
    </div>
    <span className={`${MONO} flex min-w-0 items-center gap-1.5`}>
      <SourceMark mark={MEDIA_SOURCE_ICONS[file.location] || 'database'} />
      <span className="min-w-0 truncate">{LOC[file.location] || file.location || file.drive}</span>
    </span>
    <span className={MONO}>{fmtSize(file.size || 0)}</span>
    <span className={MONO}>{fmtDur(file.duration)}</span>
    <span className={`${MONO} col-start-2 -col-end-1 min-w-0 pt-0.5 wrap-anywhere max-duplicate-narrow:col-span-full`}>{file.path ?? ''}</span>
  </div>;
}

export function DuplicatesPage({ openItem, toast, failure }: DuplicatesProps) {
  const [mode, setMode] = useState<DuplicateMode>('exact');
  const [kept, setKept] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const duplicates = useQuery({
    queryKey: mode === 'exact' && !kept ? DUPLICATES_KEY : [...DUPLICATES_KEY, mode, kept],
    queryFn: ({ signal }) => fetchDuplicates(signal, mode, kept),
    refetchInterval: query => query.state.data?.job?.status === 'running' ? 1500 : false,
  });
  const write = useMutation({ mutationFn: ({ url, body }: { url: string; body: object }) => apiSend(url, body), onSuccess: () => refresh() });
  const dispose = useMutation({
    mutationFn: (ids: readonly number[]) => batchOperate(ids, 'dispose', mode === 'exact' ? 'duplicate' : 'manual'),
    onSuccess: (_result, ids) => {
      setSelected(new Set()); refresh();
      toast(`已把 ${ids.length} 项移入回收站`, { undo: async () => {
        try { await batchOperate(ids, 'restore') } catch (cause) { failure('撤销移入回收站', cause) } finally { refresh() }
      } });
    },
  });
  const data = duplicates.data;
  const switchView = (nextMode: DuplicateMode, nextKept: boolean) => { setSelected(new Set()); setMode(nextMode); setKept(nextKept) };
  const groups = data?.groups ?? [];
  const ids = [...new Set(groups.flatMap(group => group.files.filter(file => selected.has(file.id)).map(file => file.id)))];
  const running = data?.job?.status === 'running';
  const recycle = () => {
    if (!ids.length || dispose.isPending) return;
    void confirmModal({ title: '移入回收站', confirmLabel: '移入回收站',
      body: `将把选中的 ${ids.length} 个文件的馆藏记录移入回收站，共 ${fmtSize(victimBytes(groups, ids))}。`
        + `其余 ${groups.reduce((sum, group) => sum + group.files.length, 0) - ids.length} 个文件保留。`
        + '原始文件保留在磁盘上；清空回收站才会永久删除。记录可从回收站还原。',
      onConfirm: () => dispose.mutateAsync(ids) });
  };
  const scan = () => {
    void confirmModal({ title: '校验完整文件', confirmLabel: '校验完整文件',
      body: `将完整读取 ${data?.pending_files || 0} 个同大小候选文件，约 ${fmtSize(data?.pending_bytes || 0)}。`
        + '挂载网盘会产生下载流量。只计算 SHA256，不移动或删除文件；可停止并继续已完成的结果。',
      onConfirm: () => write.mutateAsync({ url: '/api/duplicates/hash', body: { confirm_full_read: true } }) });
  };
  return <div className="mx-auto w-full max-w-board pb-10.5">
    <CollectionSummary label={mode === 'exact' ? '已确认重复' : '同番号版本'} figure={`${data?.total.toLocaleString() || 0} 组`} pending={!data}
      detail={`${data?.files.toLocaleString() || 0} 个文件${mode === 'exact' ? ` · 可回收 ${fmtSize(data?.reclaimable || 0)}` : ''}`} />
    <FilterGlass title="文件比较">
      <GlassPill selected={mode === 'exact'} onPress={() => switchView('exact', false)}>雜湊确认重复</GlassPill>
      <GlassPill selected={mode === 'versions'} onPress={() => switchView('versions', false)}>同番号版本</GlassPill>
      <GlassPill selected={kept} onPress={() => switchView(mode, !kept)}>{kept ? '返回待处理' : `已整组保留 ${data?.kept_total || 0} 组`}</GlassPill>
    </FilterGlass>
    <div className="mb-5"><Note tone="neutral" title={mode === 'exact' ? EXACT_TITLE : '同番号版本需逐项复核'}>
      {mode === 'exact' ? EXACT_COPY
        : '同番号可能包含分卷、特典、字幕与不同剪辑版本。时长或容量接近也不代表内容相同。'}
      {SELECT_COPY}
    </Note></div>
    {data ? <>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        {running ? <Button variant="secondary" size="small" {...busyProps(write.isPending)}
          onClick={() => write.mutate({ url: '/api/duplicates/hash', body: { stop: true } })}>停止校验</Button>
          : <Button variant="secondary" size="small" disabled={!data.pending_files} onClick={scan}>校验完整文件</Button>}
        <span className="text-caption-1-regular text-text-secondary" role="status">{running
          ? `已校验 ${data.job?.checked || 0}/${data.job?.total || 0} 个 · 已读取 ${fmtSize(data.job?.read_bytes || 0)}`
          : `待校验 ${data.pending_files || 0} 个 · 约 ${fmtSize(data.pending_bytes || 0)}`}</span>
        <Button variant="danger" size="small" disabled={!ids.length} {...busyProps(dispose.isPending)} onClick={recycle}>
          {`将选中的 ${ids.length} 项移入回收站`}</Button>
        {ids.length ? <Button variant="secondary" size="small" onClick={() => setSelected(new Set())}>取消勾选</Button> : null}
      </div>
      {data.job?.failed ? <Note tone="neutral" title="部分文件未完成校验">{`${data.job.failed} 个文件未取得有效雜湊，可以重试完整校验。`}</Note> : null}
      {data.job?.status === 'failed' ? <Note tone="error" title="完整校验失败">{data.job.error}</Note> : null}
      {groups.map(group => <section key={group.key} aria-label={group.code} className={GROUP}>
        <div className="flex flex-wrap items-center gap-3 bg-background-tertiary-default p-5 max-compact:p-4 dark:bg-background-secondary-default">
          <b className="text-title-2-medium text-text-primary">{group.code}</b>
          <span className={MONO}>{`${group.count} 个 · ${group.identical ? 'SHA256 一致' : '内容未确认相同'}`}</span>
          {group.cross_drive ? <span className={MONO}>{`跨盘 ${group.drives.join(' ')}`}</span> : null}
          <Button variant="secondary" size="small" {...busyProps(write.isPending)}
            onClick={() => write.mutate({ url: '/api/duplicates/keep', body: { key: group.key, mode, keep: !kept } }, {
              onSuccess: () => { setSelected(new Set()); toast(kept ? '已取消整组保留' : '已整组保留全部文件') },
            })}>{kept ? '取消整组保留' : '整组保留'}</Button>
        </div>
        {group.files.map(file => <FileRow key={file.id} file={file} selected={selected.has(file.id)} openItem={openItem}
          toggle={checked => setSelected(previous => { const next = new Set(previous); if (checked) next.add(file.id); else next.delete(file.id); return next })} />)}
      </section>)}
      {!groups.length ? <EmptyState icon={STACK} title={kept ? '没有整组保留的文件' : mode === 'exact' ? '没有已确认的重复文件' : '没有同番号版本'}>
        {mode === 'exact' ? '未完成校验不代表没有重复文件。可以校验同大小候选，或查看同番号版本。' : '同番号的各份文件会在这里列出供你比较。'}
      </EmptyState> : null}
      {data.has_more ? <p className="text-caption-1-regular text-text-secondary">{`显示前 ${groups.length} 组，共 ${data.total} 组；处理后会补上其余组。`}</p> : null}
    </> : duplicates.error ? <Note tone="error" title="文件比较读取失败">{errorMessage(duplicates.error)}</Note> : <p role="status">正在读取文件比较…</p>}
    {write.isError || dispose.isError ? <Note tone="error" title="操作失败">{errorMessage(write.error || dispose.error)}</Note> : null}
  </div>;
}
