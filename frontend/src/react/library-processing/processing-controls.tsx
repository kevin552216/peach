import { Button } from '@/components/base/buttons/button';
import { RiPauseLine, RiPlayLine } from '@remixicon/react';
import { confirmModal } from '@peach/legacy/ui';

import { apiSend } from '../../api';
import { ProcessingMode } from './processing-effort';
import { queryClient } from '../query';
import { busyProps, useAction } from '../settings/use-action';
import {
  LIBRARY_PROCESSING_KEY, LIBRARY_PROCESSING_URL, processingActive,
  type LibraryProcessingData, type ProcessingControlCommand,
} from './library-processing';

/** 控制只作用于快照里的任务号；状态由服务端确认后交给所有入口。 */
export function ProcessingControls({ state, disabled = false }: {
  state: LibraryProcessingData; disabled?: boolean;
}) {
  const action = useAction();
  const active = processingActive(state);
  const stopping = state.status === 'stopping';
  const stop = async () => {
    if (disabled || action.busy || stopping || !state.job_id) return;
    await confirmModal({
      title: '停止扫描与采集', confirmLabel: '停止任务',
      body: '当前任务将在安全停点结束，已处理结果保留。待处理项目将取消，重启后也不会自动续跑。',
      onConfirm: async () => {
        const next = await apiSend<LibraryProcessingData>(LIBRARY_PROCESSING_URL, { action: 'stop', job_id: state.job_id }, 'POST');
        queryClient.setQueryData(LIBRARY_PROCESSING_KEY, next);
        void queryClient.invalidateQueries({ queryKey: LIBRARY_PROCESSING_KEY });
      },
    });
  };
  const controlLabel = state.status === 'paused' ? '继续' : state.status === 'pausing' ? '正在暂停' : '暂停';
  const change = (command: ProcessingControlCommand) => {
    if (disabled || action.busy) return;
    void action.run(command.action, signal =>
      apiSend<LibraryProcessingData>(LIBRARY_PROCESSING_URL, command, 'POST', signal), next => {
        queryClient.setQueryData(LIBRARY_PROCESSING_KEY, next);
        void queryClient.invalidateQueries({ queryKey: LIBRARY_PROCESSING_KEY });
      });
  };
  return <div className="flex min-w-0 flex-col gap-2" data-processing-controls="">
    <div className="flex flex-wrap items-center gap-2">
      <ProcessingMode value={state.speed_mode || 'standard'} busy={disabled || !!action.busy || stopping}
        animate={state.status !== 'paused' && state.status !== 'pausing' && !stopping}
        onChange={speed_mode => change({ action: 'set_speed', speed_mode, ...(active ? { job_id: state.job_id } : {}) })} />
      {active ? <Button size="small" variant="secondary" iconOnly
        leadingIcon={state.status === 'paused' ? RiPlayLine : RiPauseLine}
        aria-label={controlLabel} title={controlLabel}
        disabled={disabled || !state.job_id || state.status === 'pausing' || stopping}
        {...busyProps(action.busy === 'pause' || action.busy === 'resume')}
        onClick={() => {
          if (state.job_id) change({ action: state.status === 'paused' ? 'resume' : 'pause', job_id: state.job_id });
        }} /> : null}
      {active ? <Button size="small" variant="secondary" disabled={disabled || !state.job_id || stopping}
        onClick={() => { void stop() }}>{stopping ? '正在停止' : '停止任务'}</Button> : null}
    </div>
    {action.error ? <p role="alert" className="text-caption-1-regular text-text-error-primary">{action.error}</p> : null}
  </div>;
}
