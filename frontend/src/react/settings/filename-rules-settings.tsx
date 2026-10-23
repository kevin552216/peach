import { useRef, useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { Switch } from '@/components/base/switch/switch';

import { apiGet, apiSend, errorMessage } from '../../api';
import { Note } from '../components/note';
import { queryClient } from '../query';
import { ErrorText, Footer, Help, Section, Stack } from './section';
import { busyProps, useAction } from './use-action';

interface Rule { name: string; pattern: string; replacement: string; enabled: boolean }
interface Rules { items: Rule[] }
interface Preview { code: string | null; source: 'custom' | 'builtin' | 'none'; rule: string | null }
const URL = '/api/filename-rules';
const EXAMPLE: Rule = {
  name: 'FC2 番号', pattern: String.raw`(?i)FC2[-_. ]?(?:PPV[-_. ]?)?(?P<id>[0-9]{5,})`,
  replacement: String.raw`FC2-PPV-\g<id>`, enabled: true,
};

export function FilenameRulesSettings({ receipt }: { receipt(message: string): void }) {
  const query = useQuery({ queryKey: ['filename-rules'], queryFn: ({ signal }) => apiGet<Rules>(URL, signal) });
  if (!query.data) return <Section title="文件名辨识规则"><Stack>
    {query.error ? <ErrorText>{errorMessage(query.error)}</ErrorText> : <Help role="status">正在读取规则…</Help>}
  </Stack></Section>;
  return <RulesForm initial={query.data} receipt={receipt} />;
}

function RulesForm({ initial, receipt }: { initial: Rules; receipt(message: string): void }) {
  const [items, setItems] = useState(initial.items);
  const [sample, setSample] = useState('+++ FC2-PPV-1234567 片名_2.mp4');
  const [preview, setPreview] = useState<Preview | null>(null);
  const revision = useRef(0);
  const action = useAction();
  const changed = () => { revision.current += 1; setPreview(null) };
  const edit = (index: number, patch: Partial<Rule>) => {
    changed();
    setItems(list => list.map((row, at) => at === index ? { ...row, ...patch } : row));
  };
  const save = (event: FormEvent) => {
    event.preventDefault();
    void action.run('save', signal => apiSend<Rules>(URL, { items }, 'POST', signal), saved => {
      setItems(saved.items);
      queryClient.setQueryData(['filename-rules'], saved);
      receipt('已保存文件名辨识规则');
    });
  };
  const test = () => {
    const ticket = revision.current;
    void action.run('preview', signal => apiSend<Preview>(URL,
      { action: 'preview', items, filename: sample }, 'POST', signal), result => {
      if (ticket === revision.current) setPreview(result);
    });
  };
  return <Section title="文件名辨识规则" onSubmit={save}>
    <Stack>
      <Help>自定义规则按顺序匹配，未识别时使用内置规则。保存后重新采集资料即可应用。</Help>
      {items.map((row, index) => <div key={index} className="flex min-w-0 flex-col gap-3 border-b border-separator-border pb-4">
        <div className="flex items-center justify-between gap-3">
          <Switch aria-label={`启用规则 ${index + 1}`} isSelected={row.enabled} isDisabled={!!action.busy}
            onChange={enabled => edit(index, { enabled })} />
          <Button size="small" variant="secondary" type="button" disabled={!!action.busy}
            onClick={() => { changed(); setItems(list => list.filter((_, at) => at !== index)) }}>移除规则 {index + 1}</Button>
        </div>
        <Input label={`规则 ${index + 1} 名称`} name={`rule-name-${index}`} value={row.name}
          onChange={name => edit(index, { name })} isDisabled={!!action.busy} maxLength={64} />
        <Input label={`规则 ${index + 1} 正则表达式`} name={`rule-pattern-${index}`} value={row.pattern}
          onChange={pattern => edit(index, { pattern })} isDisabled={!!action.busy} spellCheck="false" maxLength={1024} />
        <Input label={`规则 ${index + 1} 输出格式`} name={`rule-replacement-${index}`} value={row.replacement}
          hint={String.raw`使用 \g<id> 或 \1 引用捕获群组，例如 FC2-PPV-\g<id>。`}
          onChange={replacement => edit(index, { replacement })} isDisabled={!!action.busy} spellCheck="false" maxLength={256} />
      </div>)}
      <div><Button type="button" size="small" variant="secondary" disabled={!!action.busy || items.length >= 32}
        onClick={() => { changed(); setItems(list => [...list, { ...EXAMPLE }]) }}>新增规则</Button></div>
      <Input label="测试文件名" name="filename-sample" value={sample} isDisabled={!!action.busy}
        spellCheck="false" hint="输入文件名后按 Enter 预览。"
        onChange={value => { changed(); setSample(value) }}
        onKeyDown={event => {
          if (event.key === 'Enter' && !event.nativeEvent.isComposing) { event.preventDefault(); test() }
        }} />
      {action.busy === 'preview' ? <Help role="status">正在测试…</Help> : null}
      {preview ? <Note tone="neutral" title={preview.code || '未识别到番号'}>
        {preview.source === 'custom' ? `匹配规则：${preview.rule}` : preview.source === 'builtin' ? '使用内置规则' : '请调整表达式或输出格式。'}
      </Note> : null}
      {action.error ? <ErrorText>{action.error}</ErrorText> : null}
    </Stack>
    <Footer><Button type="submit" {...busyProps(action.busy === 'save')}>保存配置</Button></Footer>
  </Section>;
}
