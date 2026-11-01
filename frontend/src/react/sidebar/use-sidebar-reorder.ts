import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type RefObject } from 'react';
import { flushSync } from 'react-dom';
import { moveSidebarKey } from './sidebar-order';

interface Picked {
  key: string;
  origin: number;
  slot: number | null;
  top: number;
}
interface Gesture {
  key: string;
  node: HTMLButtonElement;
  pointer: number;
  x: number;
  y: number;
  keys: string[];
  started: boolean;
  minHeight: string;
  cursor: string;
}

/** 导航只在松手时保存顺序；指针移动只更新浮起项和插入位置。 */
export function useSidebarReorder(column: RefObject<HTMLDivElement | null>, order: readonly string[],
  commit: (next: string[]) => void, settled: () => void) {
  const [picked, setPicked] = useState<Picked | null>(null);
  const [announcement, announce] = useState('');
  const gesture = useRef<Gesture | null>(null);
  const before = useRef<Map<HTMLElement, DOMRect> | null>(null);
  const ignoreClick = useRef(false);
  const latest = useRef({ order, commit, settled, picked });
  latest.current = { order, commit, settled, picked };
  const rows = () => [...column.current!.querySelectorAll<HTMLButtonElement>(':scope > button[data-nav]')];
  const capture = () => { before.current = new Map(rows().map(node => [node, node.getBoundingClientRect()])) };

  useLayoutEffect(() => {
    const snapshot = before.current;
    before.current = null;
    if (!snapshot || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const css = getComputedStyle(column.current!);
    for (const node of rows()) {
      if (node.dataset.nav === picked?.key) continue;
      const old = snapshot.get(node);
      if (!old) continue;
      const now = node.getBoundingClientRect(), dx = old.left - now.left, dy = old.top - now.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;
      node.getAnimations().filter(animation => animation.id === 'sidebar-reorder').forEach(animation => animation.cancel());
      node.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'translate(0,0)' }], {
        id: 'sidebar-reorder', duration: parseFloat(css.getPropertyValue('--sidebar-reorder-ms')),
        easing: css.getPropertyValue('--spring-press').trim(),
      });
    }
  });

  const finish = (accept: boolean) => {
    const active = gesture.current;
    if (!active) return;
    gesture.current = null;
    if (!active.started) return;
    const mark = latest.current.picked!;
    const remaining = active.keys.filter(key => key !== active.key);
    const slot = accept ? mark.slot : null;
    const next = slot === null || slot === mark.origin ? null : moveSidebarKey(latest.current.order, active.key,
      remaining[Math.min(slot, remaining.length - 1)]!, slot === remaining.length);
    capture();
    column.current!.style.minHeight = active.minHeight;
    document.body.style.cursor = active.cursor;
    active.node.style.removeProperty('--sidebar-drag-x');
    active.node.style.removeProperty('--sidebar-drag-y');
    ignoreClick.current = true;
    flushSync(() => {
      setPicked(null);
      if (next) latest.current.commit(next);
      announce(next ? `${active.node.ariaLabel}，已移动到第 ${slot! + 1} 项`
        : accept && slot === mark.origin ? '顺序未变' : '已取消排序');
    });
    latest.current.settled();
  };

  useLayoutEffect(() => {
    const cancel = (event: globalThis.KeyboardEvent) => { if (event.key === 'Escape') finish(false) };
    const abort = () => finish(false);
    window.addEventListener('keydown', cancel);
    window.addEventListener('blur', abort);
    return () => {
      window.removeEventListener('keydown', cancel);
      window.removeEventListener('blur', abort);
      const active = gesture.current;
      if (active?.started) {
        document.body.style.cursor = active.cursor;
        if (column.current) column.current.style.minHeight = active.minHeight;
      }
    };
  }, []);

  const pointerDown = (event: PointerEvent<HTMLButtonElement>, key: string) => {
    if (event.button !== 0 || !event.isPrimary) return;
    ignoreClick.current = false;
    const node = event.currentTarget;
    gesture.current = { key, node, pointer: event.pointerId, x: event.clientX, y: event.clientY,
      keys: rows().map(row => row.dataset.nav!), started: false,
      minHeight: column.current!.style.minHeight, cursor: document.body.style.cursor };
    node.setPointerCapture(event.pointerId);
  };
  const pointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const active = gesture.current;
    if (!active || active.pointer !== event.pointerId) return;
    const dx = event.clientX - active.x, dy = event.clientY - active.y;
    if (!active.started) {
      if (Math.hypot(dx, dy) < 6) return;
      active.started = true;
      capture();
      column.current!.style.minHeight = `${column.current!.offsetHeight}px`;
      document.body.style.cursor = 'grabbing';
      const top = active.node.offsetTop, origin = active.keys.indexOf(active.key);
      flushSync(() => setPicked({ key: active.key, top, origin, slot: origin }));
    }
    event.preventDefault();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    active.node.style.setProperty('--sidebar-drag-x', `${reduced ? 0 : dx + 18}px`);
    active.node.style.setProperty('--sidebar-drag-y', `${reduced ? 0 : dy}px`);
    const box = column.current!.getBoundingClientRect();
    const inside = event.clientX >= box.left && event.clientX <= box.right
      && event.clientY >= box.top && event.clientY <= box.bottom;
    let slot: number | null = null;
    if (inside) {
      const remaining = rows().filter(row => row !== active.node);
      const at = remaining.findIndex(row => event.clientY - box.top < row.offsetTop + row.offsetHeight / 2);
      slot = at < 0 ? remaining.length : at;
    }
    if (slot !== latest.current.picked?.slot) flushSync(() => setPicked(mark => mark && { ...mark, slot }));
  };
  const keyboard = (event: KeyboardEvent<HTMLButtonElement>, key: string) => {
    if (!event.altKey || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')) return;
    event.preventDefault();
    const visible = rows().map(row => row.dataset.nav!);
    const at = visible.indexOf(key), down = event.key === 'ArrowDown';
    const target = visible[at + (down ? 1 : -1)];
    if (target === undefined) return;
    const next = moveSidebarKey(order, key, target, down);
    if (!next) return;
    capture();
    flushSync(() => commit(next));
    announce(`${event.currentTarget.ariaLabel}，已移动到第 ${at + (down ? 2 : 0)} 项`);
    settled();
  };

  const remaining = picked ? rows().filter(row => row.dataset.nav !== picked.key) : [];
  const hint = !!picked && picked.slot !== null && picked.slot !== picked.origin;
  const lineTop = hint ? (picked.slot === remaining.length
    ? remaining.at(-1)!.offsetTop + remaining.at(-1)!.offsetHeight + 1.5
    : remaining[picked.slot!]!.offsetTop - 1.5) : 0;
  return {
    picked, announcement, lineTop, hint,
    nudge(key: string) {
      const at = remaining.findIndex(row => row.dataset.nav === key);
      if (!hint || at < 0) return { distance: 0, delay: 0 };
      const above = at < picked!.slot!, n = above ? picked!.slot! - at - 1 : at - picked!.slot!;
      return { distance: (above ? -1 : 1) * 10 * 0.7 ** n, delay: 24 * n };
    },
    bindings(key: string) {
      return { onPointerDown: (event: PointerEvent<HTMLButtonElement>) => pointerDown(event, key),
        onPointerMove: pointerMove,
        onPointerUp: (event: PointerEvent<HTMLButtonElement>) => { if (gesture.current?.pointer === event.pointerId) finish(true) },
        onPointerCancel: () => finish(false),
        onLostPointerCapture: () => finish(false), onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => keyboard(event, key),
        onDragStart: (event: { preventDefault(): void }) => event.preventDefault() };
    },
    clickCapture(event: { preventDefault(): void; stopPropagation(): void }) {
      if (!ignoreClick.current) return;
      ignoreClick.current = false;
      event.preventDefault();event.stopPropagation();
    },
  };
}
