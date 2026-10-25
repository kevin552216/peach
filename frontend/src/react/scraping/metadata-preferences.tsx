import { useLayoutEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { wireDragReorder } from '@peach/legacy/ui';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { apiSend, errorMessage } from '../../api';
import { queryClient } from '../query';
import { SelectField } from '../settings-panel/legacy-controls';
import { ErrorText, Footer, Help, Section, Stack } from '../settings/section';
import { busyProps, useAction } from '../settings/use-action';

import { METADATA_PREFERENCES_URL, METADATA_PREFERENCES_KEY as KEY, fetchMetadataPreferences,
  type MetadataPreferencesData as Preferences } from './metadata-preferences-data';
const TYPES: Record<string, string> = { censored: '有码', amateur: '素人', uncensored: '无码',
  fc2: 'FC2', kmib: '韩国 MIB', unsure: '待核番号', unknown: '未知' };

export function MetadataPreferences({ receipt }: { receipt(message: string): void }) {
  const query = useQuery({ queryKey: KEY,
    queryFn: ({ signal }) => fetchMetadataPreferences(signal) });
  return <Section title="资料来源顺序">
    {query.data ? <PreferencesForm key={JSON.stringify(query.data)} data={query.data} receipt={receipt} />
      : <Stack>{query.error ? <ErrorText>{errorMessage(query.error)}</ErrorText>
        : <div data-skeleton="metadata-preferences" role="status" aria-label="正在读取资料来源顺序" className="h-12 skeleton-sheen" />}</Stack>}
  </Section>;
}

export function reorderSource(order: string[], from: string, target: string, after: boolean): string[] {
  if (from === target || !order.includes(from) || !order.includes(target)) return order;
  const next = order.filter(source => source !== from);
  next.splice(next.indexOf(target) + Number(after), 0, from);
  return next;
}

function PreferencesForm({ data, receipt }: { data: Preferences; receipt(message: string): void }) {
  const [agent, setAgent] = useState(data.user_agent);
  const [kind, setKind] = useState(data.types.find(type => type.id === 'fc2')?.id || data.types[0]?.id || '');
  const [routes, setRoutes] = useState(Object.fromEntries(data.types.map(type => [type.id, type.sources.map(source => source.id)])));
  const action = useAction();
  const list = useRef<HTMLOListElement>(null);
  const focusSource = useRef<string | null>(null);
  const order = routes[kind] || [];
  const identity = kind + order.join(',');
  const move = (from: string, target: string, after: boolean) => setRoutes(previous => ({ ...previous,
    [kind]: reorderSource(previous[kind] || [], from, target, after) }));
  useLayoutEffect(() => {
    if (list.current) wireDragReorder(list.current, { selector: '[data-source-order]', attribute: 'data-source-order', onMove: move });
    if (focusSource.current) {
      list.current?.querySelector<HTMLElement>(`[data-source-order="${focusSource.current}"]`)?.focus();
      focusSource.current = null;
    }
  }, [identity]);
  const labels = new Map(data.types.flatMap(type => type.sources.map(source => [source.id, source.label] as const)));
  return <form onSubmit={event => {
    event.preventDefault();
    void action.run('save', signal => apiSend<Preferences>(METADATA_PREFERENCES_URL, { routes, user_agent: agent }, 'POST', signal), result => {
      queryClient.setQueryData(KEY, result);
      receipt('已保存资料来源顺序');
    });
  }}>
    <Stack>
      <SelectField id="metadata-content-type" label="影片类型" value={kind} epoch={0}
        options={data.types.map(type => [type.id, TYPES[type.id] || type.id] as const)} onPick={setKind} />
      <Help>拖动调整查询顺序。键盘聚焦来源后，按 Alt 与上下方向键移动。</Help>
      <ol key={identity} ref={list} aria-label="来源查询顺序" className="flex min-w-0 flex-col gap-2">
        {order.map((source, index) => <li key={source} data-source-order={source} tabIndex={0}
          className="flex min-w-0 items-center gap-2 rounded-sm border border-separator-border p-2 wrap-anywhere"
          onKeyDown={event => {
            if (!event.altKey || !['ArrowUp', 'ArrowDown'].includes(event.key)) return;
            const target = order[index + (event.key === 'ArrowUp' ? -1 : 1)];
            if (target) { event.preventDefault(); focusSource.current = source; move(source, target, event.key === 'ArrowDown') }
          }}>{index + 1}. {labels.get(source) || source}</li>)}
      </ol>
      <Input label="HTTP User-Agent" value={agent} maxLength={512} onChange={setAgent} />
      <Help>用于 HTTP 资料来源；本机浏览器来源沿用浏览器实际身分。留空使用标准桌面 Chrome。</Help>
      {action.error ? <ErrorText>{action.error}</ErrorText> : null}
    </Stack>
    <Footer><Button type="submit" variant="primary" {...busyProps(!!action.busy)}>保存来源设置</Button></Footer>
  </form>;
}
