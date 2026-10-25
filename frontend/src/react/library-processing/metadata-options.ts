import { checkboxHtml } from '@peach/legacy/ui';

export const METADATA_FIELDS = [
  ['title', '标题'], ['performers', '演员'], ['studio', '厂牌'], ['release_date', '发行日期'], ['tags', '标签'],
] as const;
export type MetadataField = typeof METADATA_FIELDS[number][0];
export const ALL_METADATA_FIELDS: MetadataField[] = METADATA_FIELDS.map(([field]) => field);

export const metadataFieldLabels = (fields: readonly string[]) =>
  METADATA_FIELDS.filter(([field]) => fields.includes(field)).map(([, label]) => label).join('、');

/** 缺失条件决定哪些影片需要查询，其它空字段可在同一次答复中补齐。 */
export function metadataOptionsHtml(selected: readonly string[] = ALL_METADATA_FIELDS, fillOther = true) {
  const fields = METADATA_FIELDS.map(([field, label]) => `<label class="pickrow">${checkboxHtml(
    `name="metadata-field" value="${field}" ${selected.includes(field) ? 'checked' : ''}`,
  )}<span class="pickrowtext"><b>${label}</b></span></label>`).join('');
  return '<div class="modalfield" data-metadata-options><span>需要补齐的资料</span>'
    + '<p>所选资料缺少任一项才查询，全部已有的影片直接跳过。</p>' + fields
    + `<label class="pickrow">${checkboxHtml(`name="metadata-fill-other" ${fillOther ? 'checked' : ''}`)}`
    + '<span class="pickrowtext"><b>顺便补齐其他缺失资料</b></span></label>'
    + '<p>顺带补空不增加查询目标，已有内容和受保护字段保留。</p></div>';
}

export function readMetadataOptions(root: ParentNode) {
  const fields = [...root.querySelectorAll<HTMLInputElement>('input[name="metadata-field"]:checked')]
    .map(input => input.value as MetadataField);
  if (!fields.length) throw new Error('请至少选择一种资料字段');
  return { metadata_fields: fields,
    fill_other_metadata: !!root.querySelector<HTMLInputElement>('input[name="metadata-fill-other"]')?.checked };
}
