'use client';

/**
 * Dragging a post to a new slot.
 *
 * The drag is an input method, not a second scheduling engine. Everything it
 * can do the Move control and the arrow keys already do, it writes nothing on
 * drop, and the value it produces is the same `RescheduleProposal` the keyboard
 * path produces, handed to the same confirmation dialog. A mis-drop therefore
 * costs one Escape, never a post published at the wrong hour.
 *
 * Native pointer events, no library. The drag starts on the Move handle rather
 * than on the chip body, because the chip is a link and a link that sometimes
 * navigates and sometimes picks something up is a trap. Touch pointers are left
 * alone entirely: a page that swallows a touch drag cannot be scrolled, and a
 * touch user already has the same handle as a button.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { entryKey } from './filters';
import { buildDropProposal, canReschedule, type DropTarget } from './reschedule';
import type { CalendarEntry, RescheduleProposal } from './types';

/** How far the pointer travels before a press on the handle becomes a drag. */
export const DRAG_THRESHOLD_PX = 6;

/** Marks an element as a drop cell. The value is an ISO instant. */
export const DROP_INSTANT_ATTRIBUTE = 'data-drop-instant';

/** `day` keeps the wall clock time, `slot` moves it to the cell's hour. */
export const DROP_GRANULARITY_ATTRIBUTE = 'data-drop-granularity';

export interface DropCellHit {
  /** Stable identity of the cell, so a proposal is rebuilt only on a change. */
  readonly key: string;
  readonly target: DropTarget;
}

/**
 * The drop cell under a point, read from the document rather than from a
 * registry. Cells come and go as the range changes and the grid scrolls, and a
 * registry would have to be kept in step with both.
 */
export function dropCellAt(clientX: number, clientY: number): DropCellHit | null {
  if (typeof document === 'undefined' || typeof document.elementFromPoint !== 'function') {
    return null;
  }
  const element = document.elementFromPoint(clientX, clientY);
  const cell = element?.closest?.(`[${DROP_INSTANT_ATTRIBUTE}]`) ?? null;
  if (!(cell instanceof HTMLElement)) return null;

  const iso = cell.getAttribute(DROP_INSTANT_ATTRIBUTE);
  if (!iso) return null;
  const instant = new Date(iso);
  if (Number.isNaN(instant.getTime())) return null;

  const granularity = cell.getAttribute(DROP_GRANULARITY_ATTRIBUTE) === 'slot' ? 'slot' : 'day';
  return { key: `${granularity}:${iso}`, target: { instant, granularity } };
}

export interface DragRescheduleOptions {
  readonly timeZone: string;
  /** False while a dialog owns the screen, so a drag cannot start under it. */
  readonly enabled: boolean;
  /** Called once, when the press becomes a drag. Same effect as the M key. */
  readonly onPickUp: (entry: CalendarEntry) => void;
  /** Called whenever the pointer enters a different drop cell. */
  readonly onPropose: (proposal: RescheduleProposal) => void;
  /** Called on a drop over a cell. The screen opens the confirmation. */
  readonly onDrop: (proposal: RescheduleProposal) => void;
  /** Released over nothing, or the pointer was taken away. Put the post back. */
  readonly onCancel: () => void;
}

/**
 * How the pointer let go, for the one frame of motion that follows.
 *
 * `drop` settles onto the new slot with an overshoot; `cancel` snaps back
 * with none, because a snap back is a correction and a correction that
 * bounces reads like it landed somewhere. Both are decorative: the state
 * that matters (the proposal, the dialog) is already set by the time either
 * plays, and reduced motion skips them entirely.
 */
export type DragSettleKind = 'drop' | 'cancel';

export interface DragSettle {
  /** The entry key that was released. */
  readonly key: string;
  readonly kind: DragSettleKind;
  /** Distinct per release, so two drops in a row both play. */
  readonly id: number;
}

/** How long a released chip keeps its settle marker. Cleared after this. */
export const SETTLE_HOLD_MS = 240;

export interface DragReschedule {
  /** The entry key currently being dragged, for the chip's lifted state. */
  readonly draggingKey: string | null;
  /**
   * The chip released on the last pointer-up, and how. Null while a drag is
   * in progress and again once the settle has played.
   */
  readonly settle: DragSettle | null;
  /** Attach to the Move handle's `onPointerDown`. */
  readonly startDrag: (entry: CalendarEntry, event: ReactPointerEvent<Element>) => void;
  /** Drop the session without confirming. Safe to call when idle. */
  readonly endDrag: () => void;
}

interface DragSession {
  readonly entry: CalendarEntry;
  readonly pointerId: number;
  readonly originX: number;
  readonly originY: number;
  moved: boolean;
  targetKey: string | null;
  proposal: RescheduleProposal | null;
}

export function useDragReschedule(options: DragRescheduleOptions): DragReschedule {
  const [draggingKey, setDraggingKey] = useState<string | null>(null);
  const [settle, setSettle] = useState<DragSettle | null>(null);
  const session = useRef<DragSession | null>(null);
  const latest = useRef(options);
  const settleCounter = useRef(0);
  const settleTimer = useRef(0);

  // Written after render so the window listeners below, which are registered
  // once, always read the current callbacks without being torn down per render.
  useEffect(() => {
    latest.current = options;
  });

  const endDrag = useCallback(() => {
    session.current = null;
    setDraggingKey(null);
  }, []);

  /**
   * Mark a released chip so it can play one settle, then clear the mark.
   *
   * The marker is cleared on a timer rather than left in place because it is
   * a one-shot event, not a state: leaving it set would make an unrelated
   * re-render replay the settle. `id` rises on every release so two drops onto
   * the same slot are still two distinct events.
   */
  const markSettle = useCallback((key: string, kind: DragSettleKind) => {
    settleCounter.current += 1;
    setSettle({ key, kind, id: settleCounter.current });
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      setSettle(null);
      settleTimer.current = 0;
    }, SETTLE_HOLD_MS);
  }, []);

  useEffect(
    () => () => {
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
    },
    [],
  );

  const startDrag = useCallback((entry: CalendarEntry, event: ReactPointerEvent<Element>) => {
    if (!latest.current.enabled) return;
    if (!canReschedule(entry.state)) return;
    // A touch press stays a press: it still opens the keyboard move on click.
    if (event.pointerType === 'touch') return;
    if (event.button > 0) return;
    session.current = {
      entry,
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      moved: false,
      targetKey: null,
      proposal: null,
    };
  }, []);

  useEffect(() => {
    /*
     * A pointer release on a button is followed by a click. After a drag that
     * click would re-enter the handle and reset the proposal to the post's
     * original time, so it is caught once, at the capture phase, and dropped.
     * The guard lives inside the effect so an unmounted calendar can never
     * leave a global listener behind holding onto a stale click.
     */
    let pendingClick: ((event: MouseEvent) => void) | null = null;
    let pendingTimer = 0;

    const clearPendingClick = (): void => {
      if (pendingClick) window.removeEventListener('click', pendingClick, { capture: true });
      if (pendingTimer) window.clearTimeout(pendingTimer);
      pendingClick = null;
      pendingTimer = 0;
    };

    const swallowNextClick = (): void => {
      clearPendingClick();
      const handler = (event: MouseEvent): void => {
        event.preventDefault();
        event.stopPropagation();
        clearPendingClick();
      };
      pendingClick = handler;
      window.addEventListener('click', handler, { capture: true });
      // If no click follows the release, stop waiting for one.
      pendingTimer = window.setTimeout(clearPendingClick, 0);
    };

    const onPointerMove = (event: PointerEvent): void => {
      const current = session.current;
      if (!current || event.pointerId !== current.pointerId) return;

      if (!current.moved) {
        const dx = event.clientX - current.originX;
        const dy = event.clientY - current.originY;
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
        current.moved = true;
        setDraggingKey(entryKey(current.entry));
        latest.current.onPickUp(current.entry);
      }

      const hit = dropCellAt(event.clientX, event.clientY);
      if (!hit) {
        current.targetKey = null;
        current.proposal = null;
        return;
      }
      if (hit.key === current.targetKey) return;

      current.targetKey = hit.key;
      const proposal = buildDropProposal({
        entry: current.entry,
        target: hit.target,
        timeZone: latest.current.timeZone,
      });
      current.proposal = proposal;
      latest.current.onPropose(proposal);
    };

    const onPointerUp = (event: PointerEvent): void => {
      const current = session.current;
      if (!current || event.pointerId !== current.pointerId) return;
      const { entry, moved, proposal } = current;
      endDrag();
      // A press that never moved is a plain click on the handle. Let it be one.
      if (!moved) return;
      swallowNextClick();
      markSettle(entryKey(entry), proposal ? 'drop' : 'cancel');
      if (proposal) latest.current.onDrop(proposal);
      else latest.current.onCancel();
    };

    const onPointerCancel = (event: PointerEvent): void => {
      const current = session.current;
      if (!current || event.pointerId !== current.pointerId) return;
      const { entry, moved } = current;
      endDrag();
      if (!moved) return;
      markSettle(entryKey(entry), 'cancel');
      latest.current.onCancel();
    };

    // Escape only releases this session. The screen's own Escape handler owns
    // putting the post back and announcing it, for the keyboard and the drag
    // alike, so there is exactly one place that sentence is written.
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && session.current) endDrag();
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      clearPendingClick();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [endDrag, markSettle]);

  return { draggingKey, settle, startDrag, endDrag };
}
