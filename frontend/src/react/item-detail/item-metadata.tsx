import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/base/buttons/button';
import { Checkbox } from '@/components/base/checkbox/checkbox';
import { apiGet, apiSend } from '../../api';
import { LoadingDots } from '../components/loading-dots';
import { Note } from '../components/note';
import { queryClient } from '../query';
import { SelectField } from '../settings-panel/legacy-controls';
import { busyProps, useAction } from '../settings/use-action';
import { itemKey } from './item-detail';
import { MetadataFields } from './metadata-fields';
import { ALL_METADATA_FIELDS, type MetadataField } from '../library-processing/metadata-options';

export const ITEM_METADATA_URL = '/api/item-metadata';
export interface ItemMetadataData {
  id: number; code: string; snapshot_id: string; revision: number; busy: boolean;
  sources: { id: string; label: string }[];
  groups: { field: string; label: string; current: string; candidates: {
    candidate_key: string; source: string; display_value: string; warnings?: string[]; source_url?: string;
  }[] }[];
  protected: { field: string; label: string; source: string }[];
  issues: string[];
  source_results?: { source: string; status: string; issues: string[] }[];
  job: { status: string; stage?: string; error?: string };
}

/** 单档查询先展示来源候选，用户采用的字段才写入并加上同步保护。 */
export function ItemMetadata({ id, onReceipt }: { id: number; onReceipt(message: string): void }) {
  const [open, setOpen] = useState(false);
  return <section aria-label="影片资料" className="flex min-w-0 flex-col gap-3 wrap-anywhere">
    <Button variant="secondary" aria-expanded={open} aria-controls={`item-metadata-${id}`}
      onClick={() => setOpen(!open)}>重新抓取资料</Button>
    {open ? <MetadataPanel key={id} id={id} onReceipt={onReceipt} /> : null}
  </section>;
}

function MetadataPanel({ id, onReceipt }: { id: number; onReceipt(message: string): void }) {
  const key = ['item-metadata', id];
  const query = useQuery({ queryKey: key,
    queryFn: ({ signal }) => apiGet<ItemMetadataData>(`${ITEM_METADATA_URL}?id=${id}`, signal),
    refetchInterval: result => result.state.data?.busy ? 1500 : false });
  const [sources, setSources] = useState<string[]>([]);
  const [fields, setFields] = useState<MetadataField[]>(ALL_METADATA_FIELDS);
  const [fillOther, setFillOther] = useState(true);
  const [choices, setChoices] = useState<Record<string, string>>({});
  const action = useAction();
  const data = query.data;
  useEffect(() => { setChoices({}) }, [data?.snapshot_id]);
  const submit = (name: string, body: Record<string, unknown>, message?: string) => void action.run(name,
    signal => apiSend<ItemMetadataData>(ITEM_METADATA_URL, { id, ...body }, 'POST', signal), next => {
      queryClient.setQueryData(key, next);
      if (message) {
        onReceipt(message);
        void queryClient.invalidateQueries({ queryKey: itemKey(id) });
        void queryClient.invalidateQueries({ queryKey: ['catalog-grid'] });
        void queryClient.invalidateQueries({ queryKey: ['item-queue'] });
      }
    });
  if (!data) return <div id={`item-metadata-${id}`}>
    {query.error ? <Note tone="warning" action={<Button variant="secondary" onClick={() => void query.refetch()}>重试</Button>}>
      {query.error.message}</Note> : <div data-skeleton="item-metadata" role="status" aria-label="正在读取资料来源" className="h-12 skeleton-sheen" />}
  </div>;
  const running = data.job.status === 'running';
  const busy = !!action.busy || data.busy;
  const labels = new Map(data.sources.map(entry => [entry.id, entry.label]));
  const selected = Object.fromEntries(Object.entries(choices).filter(([, value]) => value));
  const problem = action.error || (data.job.status === 'failed' ? data.job.error : '');
  return <div id={`item-metadata-${id}`} className="flex min-w-0 flex-col gap-3">
    <fieldset className="flex min-w-0 flex-col gap-2">
      <legend className="mb-2">资料来源（可多选）</legend>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {data.sources.map(source => <Checkbox key={source.id} isSelected={sources.includes(source.id)} isDisabled={busy}
          onChange={checked => setSources(previous => checked ? [...previous, source.id] : previous.filter(value => value !== source.id))}>
          {source.label}
        </Checkbox>)}
      </div>
      <span className="text-body-2-regular text-text-secondary">
        {sources.length ? `将逐一查询所选的 ${sources.length} 家来源，再选择要采用的资料。` : '未指定来源时按默认顺序查询，资料足够即停止。'}
      </span>
      {sources.length ? <Button variant="secondary" disabled={busy} onClick={() => setSources([])}>使用默认来源顺序</Button> : null}
    </fieldset>
    <MetadataFields fields={fields} fillOther={fillOther} disabled={busy} onFields={setFields} onFillOther={setFillOther} />
    <Button variant="secondary" disabled={data.busy || !fields.length} {...busyProps(action.busy === 'fetch')}
      onClick={() => submit('fetch', { action: 'fetch', sources, metadata_fields: fields, fill_other_metadata: fillOther })}>查询最新资料</Button>
    {running ? <LoadingDots label={data.job.stage || '正在查询资料来源'} /> : null}
    {data.busy && !running ? <Note tone="neutral">另一项单档资料查询正在进行，请稍后重试。</Note> : null}
    {problem ? <Note tone="warning">{problem}</Note> : null}
    {!running ? data.issues.map((issue, index) => <Note key={index} tone="warning">{issue}</Note>) : null}
    {!running && data.source_results?.length ? <ul aria-label="所选来源查询结果" className="flex flex-col gap-1">
      {data.source_results.map(result => <li key={result.source}>
        {labels.get(result.source) || result.source}：{result.status === 'received' ? '已取得资料' : '未取得资料，请查看原因或稍后重试'}
      </li>)}
    </ul> : null}
    {!running && data.snapshot_id && !data.groups.length && !data.issues.length
      ? <Note tone="neutral">所选来源没有提供可采用的资料，可换一个来源查询。</Note> : null}
    {!running ? data.groups.map(group => <div key={group.field} className="flex min-w-0 flex-col gap-1">
      <b>{group.label}</b><span className="text-body-2-regular text-text-secondary">目前：{group.current || '未填写'}</span>
      <SelectField id={`metadata-${id}-${group.field}`} label={`采用的${group.label}`} value={choices[group.field] || ''}
        disabled={!!action.busy} epoch={0} options={[["", '保留现有资料'], ...group.candidates.map(candidate =>
          [candidate.candidate_key, `${labels.get(candidate.source) || candidate.source}：${candidate.display_value}`] as const)]}
        onPick={value => setChoices(previous => ({ ...previous, [group.field]: value }))} />
      {group.candidates.filter(candidate => candidate.candidate_key === choices[group.field]).map(candidate =>
        <div key={candidate.candidate_key} className="flex min-w-0 flex-col gap-1">
          {candidate.source_url && /^https?:\/\//i.test(candidate.source_url)
            ? <a href={candidate.source_url} target="_blank" rel="noreferrer">查看来源原文</a> : null}
          {candidate.warnings?.map((warning, index) => <Note key={index} tone="warning">{warning}</Note>)}
        </div>)}
    </div>) : null}
    {!running && data.groups.length ? <Button variant="primary" disabled={!Object.keys(selected).length}
      {...busyProps(action.busy === 'apply')} onClick={() => submit('apply', { action: 'apply',
        snapshot_id: data.snapshot_id, choices: selected, expected_revision: data.revision }, '已采用并保护影片资料')}>采用所选资料并保护</Button> : null}
    {data.protected.map(field => <div key={field.field} className="flex flex-wrap items-center justify-between gap-2">
      <span>{field.label}已保护 · {labels.get(field.source) || field.source}</span>
      <Button variant="secondary" {...busyProps(action.busy === `unlock-${field.field}`)}
        onClick={() => submit(`unlock-${field.field}`, { action: 'unlock', field: field.field,
          expected_revision: data.revision }, `已解除${field.label}保护`)}>解除保护</Button>
    </div>)}
    {data.protected.length ? <span className="text-body-2-regular text-text-secondary">同步媒体库时保留已保护字段，可重新选择来源后采用其他资料。</span> : null}
  </div>;
}
