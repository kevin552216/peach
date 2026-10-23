import { checkboxHtml, formModal, iconSwitchHtml } from '@peach/legacy/ui';
import type { LibraryProcessingCommand, ProcessingSpeed, ProcessingTask } from './library-processing';

export const TASK_LABELS: Record<ProcessingTask, string> = {
  scan: '更新文件清单', probe: '读取媒体属性', metadata: '补齐影片资料',
  covers: '补齐封面', previews: '生成视频预览',
};

function selectedTasks(command: LibraryProcessingCommand, scan: boolean): ProcessingTask[] {
  if (command.tasks) return command.tasks;
  switch (command.stage) {
    case 'scan': return ['scan', 'probe'];
    case 'probe': return ['probe'];
    case 'metadata': return ['metadata'];
    case 'covers': return ['covers'];
    case 'previews': return ['previews'];
    default: return scan && command.stage !== 'collect' ? ['scan', 'probe', 'metadata'] : ['probe', 'metadata'];
  }
}

/** 每次新任务独立选择工作；只补缺失结果由服务端执行。 */
export function processingTaskDialog(command: LibraryProcessingCommand, {
  scan, metadataOnly, speedMode, onRun,
}: {
  scan: boolean; metadataOnly: boolean; speedMode: ProcessingSpeed;
  onRun(command: LibraryProcessingCommand): void | Promise<unknown>;
}) {
  const chosen = selectedTasks(command, scan).filter(task => !(metadataOnly && task === 'previews'));
  const rows = (Object.keys(TASK_LABELS) as ProcessingTask[]).filter(task => scan || task !== 'scan');
  const options = rows.map(task => `<label class="pickrow">${checkboxHtml(
    `name="processing-task" value="${task}" ${chosen.includes(task) ? 'checked' : ''} ${metadataOnly && task === 'previews' ? 'disabled' : ''}`
  )}<span class="pickrowtext"><b>${TASK_LABELS[task]}</b></span></label>`).join('');
  const initialSpeed = command.stage === 'previews' ? 'low' : speedMode;
  const description = '只补缺失项目，已有结果保留。预览可稍后另派低占用任务；同时处理可能让电脑变慢。';
  const readyDescription = '只补缺失项目，已有结果保留。更新清单后，逐档衔接属性与预览、资料与封面，不必等待整批前置工作。';
  const dialog = formModal({
    title: '新任务', confirmLabel: '开始任务',
    description,
    body: `<div class="modalfield"><span>本次处理项目</span>${options}</div>`
      + (metadataOnly ? '<p>视频预览生成已在媒体库设置中关闭。</p>' : '')
      + iconSwitchHtml('processing-execution', '执行方式', [['sequential', '依序处理'], ['parallel', '并行处理'], ['pipeline', '就绪即处理']], 'sequential', { text: true })
      + `<div data-defer-previews hidden><label class="pickrow">${checkboxHtml('name="processing-defer" checked')}`
      + '<span class="pickrowtext"><b>暂缓疑似重复项的预览</b></span></label></div>'
      + iconSwitchHtml('processing-speed', '处理模式', [['low', '低占用'], ['standard', '标准'], ['high', '全速']], initialSpeed, { text: true }),
    onConfirm: async () => {
      const tasks = [...dialog.dialog.querySelectorAll<HTMLInputElement>('input[name="processing-task"]:checked')]
        .map(input => input.value as ProcessingTask);
      if (!tasks.length) throw new Error('请至少选择一项工作');
      const value = (name: string) => dialog.dialog.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value;
      const execution = value('processing-execution');
      const execution_mode = execution === 'pipeline' ? 'pipeline' : execution === 'parallel' ? 'parallel' : 'sequential';
      const speed = value('processing-speed');
      await onRun({ ...command, tasks, execution_mode,
        defer_suspected_duplicates: execution_mode !== 'sequential' && tasks.includes('previews')
          && !!dialog.dialog.querySelector<HTMLInputElement>('input[name="processing-defer"]')?.checked,
        speed_mode: speed === 'low' ? 'low' : speed === 'high' ? 'high' : 'standard' });
    },
  });
  dialog.dialog.addEventListener('change', () => {
    const execution = dialog.dialog.querySelector<HTMLInputElement>('input[name="processing-execution"]:checked')?.value;
    const parallel = execution === 'parallel' || execution === 'pipeline';
    const previews = !!dialog.dialog.querySelector<HTMLInputElement>('input[name="processing-task"][value="previews"]')?.checked;
    dialog.dialog.querySelector<HTMLElement>('[data-defer-previews]')!.hidden = !parallel || !previews;
    dialog.dialog.querySelector<HTMLElement>('.ui-geist-modal-body > p')!.textContent = execution === 'pipeline' ? readyDescription : description;
  });
  return dialog;
}
