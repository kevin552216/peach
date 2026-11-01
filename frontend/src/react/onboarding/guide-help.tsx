import { Button } from '@/components/base/buttons/button';
import { GUIDE_CHAPTERS, sectionGuide } from '../../onboarding/guide-catalog';
import { openGuide } from '../../onboarding/guide-state';
import { Disclosure } from '../settings/section';

export function GuideFieldDetails({ details }: { details?: readonly [string, string][] }) {
  return details?.length ? <dl className="flex flex-col gap-3">{details.map(([title, body]) => <div key={title} className="flex flex-col gap-1"><dt className="text-body-2-medium text-text-primary">{title}</dt><dd className="text-body-2-regular text-text-secondary">{body}</dd></div>)}</dl> : null;
}

/** 设置说明与导览共用内容，不接管设置的保存行为。 */
export function GuideHelp({ chapter, section }: { chapter?: string; section?: string }) {
  const item = section ? sectionGuide(section) : undefined;
  const group = GUIDE_CHAPTERS.find(row => row.id === chapter);
  if (!item && !group) return null;
  return <div data-guide-help="" className="text-body-2-regular text-text-secondary">
    <Disclosure summary={section ? '设置说明' : '了解这些设置'}>
      {item ? <><p>{item.body}</p><GuideFieldDetails details={item.details} /><p>{item.scope}</p></> : <>
        <p>{group!.summary}</p>
        <div><Button variant="secondary" size="small" onClick={() => openGuide({ chapter })}>逐步了解这个分区</Button></div>
      </>}
    </Disclosure>
  </div>;
}
