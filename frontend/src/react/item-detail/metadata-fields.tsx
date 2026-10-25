import { Checkbox } from '@/components/base/checkbox/checkbox';
import { METADATA_FIELDS, type MetadataField } from '../library-processing/metadata-options';

export function MetadataFields({ fields, fillOther, disabled, onFields, onFillOther }: {
  fields: MetadataField[]; fillOther: boolean; disabled: boolean;
  onFields(fields: MetadataField[]): void; onFillOther(value: boolean): void;
}) {
  return <fieldset className="flex min-w-0 flex-col gap-2">
    <legend className="mb-2">优先查询的资料</legend>
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {METADATA_FIELDS.map(([field, label]) => <Checkbox key={field} isSelected={fields.includes(field)} isDisabled={disabled}
        onChange={checked => onFields(checked ? [...fields, field] : fields.filter(value => value !== field))}>{label}</Checkbox>)}
    </div>
    <Checkbox isSelected={fillOther} isDisabled={disabled} onChange={onFillOther}>顺便取得其他资料候选</Checkbox>
    <span className="text-body-2-regular text-text-secondary">只为优先资料查询来源，所有资料均在确认采用后保存。</span>
  </fieldset>;
}
