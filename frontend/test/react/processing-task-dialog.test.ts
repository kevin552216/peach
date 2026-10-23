import { expect, it, vi } from 'vitest';
import { processingTaskDialog } from '../../src/react/library-processing/processing-task-dialog';
import { click, submit } from './render';

const chosen = (dialog: HTMLDialogElement) => [...dialog.querySelectorAll<HTMLInputElement>('input[name="processing-task"]:checked')].map(input => input.value);
const options = (onRun = vi.fn()) => ({ scan: true, metadataOnly: false, speedMode: 'standard' as const, onRun });

it('新任务默认建立资料，图片工作可另选', async () => {
  const onRun = vi.fn();
  const form = processingTaskDialog({}, options(onRun));
  expect(chosen(form.dialog)).toEqual(['scan', 'probe', 'metadata']);
  expect(form.dialog.textContent).toContain('只补缺失项目');
  await click(form.dialog.querySelector('input[value="parallel"]'));
  await click(form.dialog.querySelector('input[value="scan"]'));
  await click(form.dialog.querySelector('input[value="metadata"]'));
  await submit(form.dialog.querySelector('form'));
  expect(onRun).toHaveBeenCalledWith({ tasks: ['probe'], speed_mode: 'standard', execution_mode: 'parallel', defer_suspected_duplicates: false });
});

it('独立预览默认低占用，并行时可以选择暂缓疑似重复预览', async () => {
  const onRun = vi.fn();
  const form = processingTaskDialog({ stage: 'previews' }, options(onRun));
  expect(chosen(form.dialog)).toEqual(['previews']);
  expect(form.dialog.querySelector<HTMLInputElement>('input[name="processing-speed"]:checked')?.value).toBe('low');
  expect(form.dialog.querySelector<HTMLElement>('[data-defer-previews]')?.hidden).toBe(true);
  await click(form.dialog.querySelector('input[value="parallel"]'));
  expect(form.dialog.querySelector<HTMLElement>('[data-defer-previews]')?.hidden).toBe(false);
  await submit(form.dialog.querySelector('form'));
  expect(onRun).toHaveBeenCalledWith({ stage: 'previews', tasks: ['previews'], speed_mode: 'low', execution_mode: 'parallel', defer_suspected_duplicates: true });
});

it('不同新任务的表单各有自己的选择', async () => {
  const first = processingTaskDialog({ stage: 'metadata' }, options());
  await click(first.dialog.querySelector('input[value="covers"]'));
  first.close();
  const next = processingTaskDialog({ stage: 'probe' }, options());
  expect(chosen(next.dialog)).toEqual(['probe']);
});

it('未选工作时留在表单，选择一项后可提交', async () => {
  const onRun = vi.fn();
  const form = processingTaskDialog({ stage: 'probe' }, options(onRun));
  await click(form.dialog.querySelector('input[value="probe"]'));
  await submit(form.dialog.querySelector('form'));
  expect(onRun).not.toHaveBeenCalled();
  expect(form.dialog.textContent).toContain('请至少选择一项工作');
  await click(form.dialog.querySelector('input[value="probe"]'));
  await submit(form.dialog.querySelector('form'));
  expect(onRun).toHaveBeenCalledTimes(1);
});

it('所选影片不能更新整库清单，关闭预览时不包含抽帧任务', () => {
  const form = processingTaskDialog({ stage: 'collect', tasks: ['metadata', 'covers', 'previews'] },
    { ...options(), scan: false, metadataOnly: true });
  expect(form.dialog.querySelector('input[value="scan"]')).toBeNull();
  expect(form.dialog.querySelector<HTMLInputElement>('input[value="previews"]')?.disabled).toBe(true);
  expect(chosen(form.dialog)).toEqual(['metadata', 'covers']);
});

it('请求失败保留勾选与速度，再次提交使用原选择', async () => {
  const onRun = vi.fn().mockRejectedValueOnce(new Error('目录暂时不可访问')).mockResolvedValueOnce({});
  const form = processingTaskDialog({ stage: 'probe' }, options(onRun));
  await click(form.dialog.querySelector('input[name="processing-speed"][value="low"]'));
  await submit(form.dialog.querySelector('form'));
  expect(form.dialog.textContent).toContain('目录暂时不可访问');
  expect(chosen(form.dialog)).toEqual(['probe']);
  await submit(form.dialog.querySelector('form'));
  expect(onRun.mock.calls.map(call => call[0].speed_mode)).toEqual(['low', 'low']);
});
