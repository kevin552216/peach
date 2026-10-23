import { useEffect, useRef, useState } from 'react';
import { RiArrowDownSLine, RiDatabase2Line, RiGlobalLine, RiHardDrive2Line } from '@remixicon/react';
import { Popover } from 'react-aria-components';
import { Button } from '@/components/base/buttons/button';
import { MENU_ITEM, MENU_ITEM_INTERACTIVE, MENU_POPOVER_SURFACE } from '@/components/base/dropdown/menu-styles';
import { cx } from '@/utils/cx';
import { MenuDialog } from '../components/menu-dialog';
import { busyProps } from '../settings/use-action';
import type { LibraryProcessingCommand, ProcessingSpeed, ProcessingTask } from './library-processing';
import { processingTaskDialog } from './processing-task-dialog';

/** 扫描和已有作品补全共用资料流水线，视频预览由媒体库设置决定。 */
export function ProcessingActions({ busy, scan = false, metadataOnly = false, speedMode = 'standard', defaultTasks, onRun }: {
  busy: boolean; scan?: boolean; metadataOnly?: boolean; speedMode?: ProcessingSpeed; defaultTasks?: ProcessingTask[];
  onRun(command: LibraryProcessingCommand): void | Promise<unknown>;
}) {
  const trigger = useRef<HTMLButtonElement>(null);
  const prompt = useRef<ReturnType<typeof processingTaskDialog> | null>(null);
  useEffect(() => () => prompt.current?.close(), []);
  const [open, setOpen] = useState(false);
  const primary: { label: string; icon: typeof RiDatabase2Line; command: LibraryProcessingCommand } = { label: scan ? '同步媒体库' : '同步这些影片', icon: RiDatabase2Line,
    command: scan ? {} : { stage: 'collect' as const, ...(defaultTasks ? { tasks: defaultTasks } : {}) } };
  const options: typeof primary[] = [primary,
    ...(scan ? [{ label: '仅扫描文件', icon: RiHardDrive2Line, command: { stage: 'scan' as const } }] : []),
    ...(scan ? [{ label: '仅同步已入库影片', icon: RiDatabase2Line, command: { stage: 'collect' as const } }] : []),
    { label: '仅读取媒体属性', icon: RiHardDrive2Line, command: { stage: 'probe' as const } },
    { label: '仅补齐封面', icon: RiGlobalLine, command: { stage: 'covers' as const } },
    { label: '仅生成视频预览', icon: RiHardDrive2Line, command: { stage: 'previews' as const } },
    { label: '仅补全资料', icon: RiGlobalLine, command: { stage: 'metadata' as const } },
  ];
  const run = (command: LibraryProcessingCommand) => {
    if (busy) return;
    setOpen(false);
    if (prompt.current) return;
    const dialog = processingTaskDialog(command, { scan, metadataOnly, speedMode, onRun });
    prompt.current = dialog;
    void dialog.done.then(() => { if (prompt.current === dialog) prompt.current = null });
  };
  return <>
    <span data-button-group data-split-button data-variant="primary">
      <Button leadingIcon={primary.icon} {...busyProps(busy)} onClick={() => run(primary.command)}>{primary.label}</Button>
      <Button ref={trigger} iconOnly leadingIcon={RiArrowDownSLine} aria-label="更多同步方式"
        aria-haspopup="dialog" aria-expanded={open} {...busyProps(busy)} onClick={() => { if (!busy) setOpen(!open) }} />
    </span>
    <Popover triggerRef={trigger} isOpen={open} onOpenChange={setOpen} placement="bottom end" offset={4}
      className={MENU_POPOVER_SURFACE}>
      <MenuDialog aria-label="同步方式" className="flex w-56 flex-col gap-1 outline-none">
        {options.map(({ label, icon: Icon, command }) => {
          const blocked = metadataOnly && 'stage' in command && command.stage === 'previews';
          return <button key={label} type="button" disabled={blocked}
            title={blocked ? '请先在媒体库设置中开启视频预览生成' : undefined}
            className={cx(MENU_ITEM, MENU_ITEM_INTERACTIVE, 'text-body-2-medium')}
            onClick={() => run(command)}><Icon aria-hidden className="size-4 shrink-0" />{label}</button>;
        })}
      </MenuDialog>
    </Popover>
  </>;
}
