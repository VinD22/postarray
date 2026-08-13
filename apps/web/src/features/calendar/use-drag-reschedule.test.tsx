/**
 * The drag state machine, exercised against the month grid it drops onto.
 *
 * The harness below is a deliberately literal copy of the wiring in
 * `calendar-screen`: the same pick up, the same proposal state, the same
 * Escape handler. If the two ever drift, these tests stop describing the
 * product, so they assert the properties that matter rather than the wiring:
 * a drop writes nothing, a cancel leaves the post where it was, and the click
 * that opens the keyboard route still works.
 */

import { useEffect, useState, type ReactNode } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { en } from '@relay/i18n';
import { I18nProvider } from '@relay/i18n/react';

import { CalendarMonth } from './calendar-month';
import { computeRange } from './date-range';
import { entryKey } from './filters';
import { buildProposal, keyboardStep } from './reschedule';
import { SETTLE_HOLD_MS, useDragReschedule } from './use-drag-reschedule';
import type { CalendarEntry, RescheduleProposal } from './types';

const BERLIN = 'Europe/Berlin';
/** Thursday 6 August 2026, 09:30 in Berlin. */
const SCHEDULED_AT = '2026-08-06T07:30:00.000Z';
const TITLE = 'Scheduled first comments are live';

function entry(overrides: Partial<CalendarEntry> = {}): CalendarEntry {
  return {
    publishJobId: 'job_01j000000000000000000001',
    contentItemId: 'post_01j000000000000000000001',
    title: TITLE,
    scheduledAt: SCHEDULED_AT,
    timeZone: BERLIN,
    state: 'scheduled',
    approvalState: 'approved',
    provider: 'x',
    accountLabel: '@acme',
    targetCount: 1,
    mediaKind: 'image',
    ...overrides,
  };
}

const range = computeRange('month', new Date(SCHEDULED_AT), BERLIN, 1);

/**
 * jsdom ships neither `PointerEvent` nor `elementFromPoint`, so the pointer is
 * simulated with a mouse event carrying the two pointer fields the hook reads.
 */
function pointer(
  type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel',
  init: { x: number; y: number; pointerId?: number; pointerType?: string },
): Event {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: init.x,
    clientY: init.y,
    button: 0,
  });
  Object.defineProperty(event, 'pointerId', { value: init.pointerId ?? 1 });
  Object.defineProperty(event, 'pointerType', { value: init.pointerType ?? 'mouse' });
  return event;
}

/** Point `elementFromPoint` at one drop cell, or at nothing at all. */
function hover(cell: Element | null): void {
  Object.defineProperty(document, 'elementFromPoint', {
    configurable: true,
    writable: true,
    value: () => cell,
  });
}

afterEach(() => {
  vi.useRealTimers();
  Reflect.deleteProperty(document, 'elementFromPoint');
});

interface HarnessProps {
  readonly entries: readonly CalendarEntry[];
}

function Harness({ entries }: HarnessProps): ReactNode {
  const [grabbed, setGrabbed] = useState<CalendarEntry | null>(null);
  const [proposal, setProposal] = useState<RescheduleProposal | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const cancelMove = (): void => {
    setGrabbed(null);
    setProposal(null);
  };

  const drag = useDragReschedule({
    timeZone: BERLIN,
    enabled: !dialogOpen,
    onPickUp: (picked) => {
      setGrabbed(picked);
      setProposal(buildProposal({ entry: picked, timeZone: BERLIN }));
    },
    onPropose: setProposal,
    onDrop: (next) => {
      setProposal(next);
      setDialogOpen(true);
    },
    onCancel: cancelMove,
  });

  // The screen's own keyboard route: Escape puts the post back, the arrows
  // step it, Enter confirms. Mirrored here so a drag and a key press can be
  // compared against each other rather than against a remembered constant.
  useEffect(() => {
    if (!grabbed || dialogOpen) return undefined;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        cancelMove();
        return;
      }
      if (event.key === 'Enter') {
        setDialogOpen(true);
        return;
      }
      const step = keyboardStep(event.key, 'month', 'ltr');
      if (!step) return;
      setProposal((current) => {
        const base = current ?? buildProposal({ entry: grabbed, timeZone: BERLIN });
        const next = buildProposal({
          entry: { ...grabbed, scheduledAt: base.toInstant },
          timeZone: BERLIN,
          ...step,
        });
        return {
          entry: grabbed,
          fromInstant: grabbed.scheduledAt,
          toInstant: next.toInstant,
          keepsLocalTime: next.keepsLocalTime,
        };
      });
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [grabbed, dialogOpen]);

  return (
    <I18nProvider locale="en" catalog={en} timeZone={BERLIN}>
      <CalendarMonth
        range={range}
        entries={entries}
        timeZone={BERLIN}
        hrefForEntry={(item) => `/posts/${item.contentItemId}`}
        hrefForDay={() => '/calendar'}
        grabbedKey={grabbed ? entryKey(grabbed) : null}
        onPickUp={(picked) => {
          setGrabbed(picked);
          setProposal(buildProposal({ entry: picked, timeZone: BERLIN }));
        }}
        proposal={grabbed ? proposal : null}
        draggingKey={drag.draggingKey}
        settle={drag.settle}
        onDragStart={drag.startDrag}
        label="August 2026"
      />
      <output data-testid="proposal">{proposal?.toInstant ?? 'none'}</output>
      <output data-testid="settle">{drag.settle ? drag.settle.kind : 'none'}</output>
      <output data-testid="grabbed">{grabbed ? entryKey(grabbed) : 'none'}</output>
      <output data-testid="dialog">{dialogOpen ? 'open' : 'closed'}</output>
    </I18nProvider>
  );
}

function cellFor(container: HTMLElement, day: Date): HTMLElement {
  const cell = container.querySelector<HTMLElement>(`[data-drop-instant="${day.toISOString()}"]`);
  if (!cell) throw new Error(`No drop cell for ${day.toISOString()}`);
  return cell;
}

function dayAfterScheduled(): Date {
  const index = range.days.findIndex((day) => day.getTime() > new Date(SCHEDULED_AT).getTime());
  const next = range.days[index];
  if (!next) throw new Error('The month grid should contain the day after the post');
  return next;
}

function setup() {
  const view = render(<Harness entries={[entry()]} />);
  const handle = view.container.querySelector<HTMLElement>('[data-move-handle]');
  if (!handle) throw new Error('The chip should expose a move handle');
  return { ...view, handle };
}

describe('drag to reschedule', () => {
  it('offers the move handle as a real button, not a drag-only affordance', () => {
    const { handle } = setup();
    expect(handle.tagName).toBe('BUTTON');
    expect(handle).toHaveAccessibleName('Move this post');
  });

  it('does not offer a handle on a post that cannot be moved', () => {
    const { container } = render(<Harness entries={[entry({ state: 'dispatching' })]} />);
    expect(container.querySelector('[data-move-handle]')).toBeNull();
  });

  it('ignores a press that never travels, so the click still picks the post up', () => {
    const { handle } = setup();

    fireEvent(handle, pointer('pointerdown', { x: 40, y: 40 }));
    fireEvent(window, pointer('pointerup', { x: 41, y: 41 }));

    expect(screen.getByTestId('grabbed')).toHaveTextContent('none');

    fireEvent.click(handle);
    expect(screen.getByTestId('grabbed')).not.toHaveTextContent('none');
    expect(screen.getByTestId('proposal')).toHaveTextContent(SCHEDULED_AT);
    expect(screen.getByTestId('dialog')).toHaveTextContent('closed');
  });

  it('proposes the drop cell without writing anything, then opens the confirmation', () => {
    const { container, handle } = setup();
    const target = dayAfterScheduled();

    fireEvent(handle, pointer('pointerdown', { x: 40, y: 40 }));
    hover(cellFor(container, target));
    fireEvent(window, pointer('pointermove', { x: 200, y: 200 }));

    const expected = buildProposal({ entry: entry(), days: 1, timeZone: BERLIN });
    expect(screen.getByTestId('proposal')).toHaveTextContent(expected.toInstant);
    // Still only a proposal: the dialog has not opened and nothing was written.
    expect(screen.getByTestId('dialog')).toHaveTextContent('closed');

    fireEvent(window, pointer('pointerup', { x: 200, y: 200 }));
    expect(screen.getByTestId('dialog')).toHaveTextContent('open');
    expect(screen.getByTestId('proposal')).toHaveTextContent(expected.toInstant);
  });

  it('keeps the wall clock time when a month cell is the drop target', () => {
    const { container, handle } = setup();
    const target = dayAfterScheduled();

    fireEvent(handle, pointer('pointerdown', { x: 40, y: 40 }));
    hover(cellFor(container, target));
    fireEvent(window, pointer('pointermove', { x: 200, y: 200 }));
    fireEvent(window, pointer('pointerup', { x: 200, y: 200 }));

    const proposed = new Date(screen.getByTestId('proposal').textContent ?? '');
    const formatted = new Intl.DateTimeFormat('en-GB', {
      timeZone: BERLIN,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(proposed);
    expect(formatted).toBe('09:30');
  });

  it('marks the drop cell while the pointer is over it', () => {
    const { container, handle } = setup();
    const target = cellFor(container, dayAfterScheduled());

    fireEvent(handle, pointer('pointerdown', { x: 40, y: 40 }));
    hover(target);
    fireEvent(window, pointer('pointermove', { x: 200, y: 200 }));

    expect(target.className).toContain('outline-dashed');
  });

  it('restores the post to its own cell when the drop lands on nothing', () => {
    const { container, handle } = setup();
    const origin = cellFor(
      container,
      range.days[range.days.indexOf(dayAfterScheduled()) - 1] as Date,
    );

    fireEvent(handle, pointer('pointerdown', { x: 40, y: 40 }));
    hover(cellFor(container, dayAfterScheduled()));
    fireEvent(window, pointer('pointermove', { x: 200, y: 200 }));
    expect(screen.getByTestId('grabbed')).not.toHaveTextContent('none');

    hover(null);
    fireEvent(window, pointer('pointermove', { x: 900, y: 900 }));
    fireEvent(window, pointer('pointerup', { x: 900, y: 900 }));

    expect(screen.getByTestId('dialog')).toHaveTextContent('closed');
    expect(screen.getByTestId('proposal')).toHaveTextContent('none');
    expect(screen.getByTestId('grabbed')).toHaveTextContent('none');
    // The chip never left, because nothing was ever moved optimistically.
    expect(within(origin).getByText(TITLE)).toBeInTheDocument();
  });

  it('puts the post back on Escape, mid drag', () => {
    const { container, handle } = setup();
    const origin = cellFor(
      container,
      range.days[range.days.indexOf(dayAfterScheduled()) - 1] as Date,
    );

    fireEvent(handle, pointer('pointerdown', { x: 40, y: 40 }));
    hover(cellFor(container, dayAfterScheduled()));
    fireEvent(window, pointer('pointermove', { x: 200, y: 200 }));

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.getByTestId('grabbed')).toHaveTextContent('none');
    expect(screen.getByTestId('proposal')).toHaveTextContent('none');
    expect(within(origin).getByText(TITLE)).toBeInTheDocument();

    // The release that follows is inert: the session is already gone.
    fireEvent(window, pointer('pointerup', { x: 200, y: 200 }));
    expect(screen.getByTestId('dialog')).toHaveTextContent('closed');
  });

  it('puts the post back when the pointer is taken away', () => {
    const { container, handle } = setup();

    fireEvent(handle, pointer('pointerdown', { x: 40, y: 40 }));
    hover(cellFor(container, dayAfterScheduled()));
    fireEvent(window, pointer('pointermove', { x: 200, y: 200 }));
    fireEvent(window, pointer('pointercancel', { x: 200, y: 200 }));

    expect(screen.getByTestId('grabbed')).toHaveTextContent('none');
    expect(screen.getByTestId('proposal')).toHaveTextContent('none');
    expect(screen.getByTestId('dialog')).toHaveTextContent('closed');
  });

  it('leaves a touch press alone so the page can still be scrolled', () => {
    const { container, handle } = setup();

    fireEvent(handle, pointer('pointerdown', { x: 40, y: 40, pointerType: 'touch' }));
    hover(cellFor(container, dayAfterScheduled()));
    fireEvent(window, pointer('pointermove', { x: 200, y: 200 }));

    expect(screen.getByTestId('grabbed')).toHaveTextContent('none');
    expect(screen.getByTestId('proposal')).toHaveTextContent('none');
  });

  it('reaches the same confirmation from the keyboard as from a drop', () => {
    const keyboard = render(<Harness entries={[entry()]} />);
    const keyboardHandle = keyboard.container.querySelector<HTMLElement>('[data-move-handle]');
    if (!keyboardHandle) throw new Error('The chip should expose a move handle');

    fireEvent.click(keyboardHandle);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'Enter' });

    const byKeyboard = within(keyboard.container).getByTestId('proposal').textContent;
    expect(within(keyboard.container).getByTestId('dialog')).toHaveTextContent('open');
    keyboard.unmount();

    const { container, handle } = setup();
    fireEvent(handle, pointer('pointerdown', { x: 40, y: 40 }));
    hover(cellFor(container, dayAfterScheduled()));
    fireEvent(window, pointer('pointermove', { x: 200, y: 200 }));
    fireEvent(window, pointer('pointerup', { x: 200, y: 200 }));

    expect(screen.getByTestId('proposal')).toHaveTextContent(String(byKeyboard));
    expect(screen.getByTestId('dialog')).toHaveTextContent('open');
  });

  it('does not let the click after a drag reset the proposal', () => {
    const { container, handle } = setup();

    fireEvent(handle, pointer('pointerdown', { x: 40, y: 40 }));
    hover(cellFor(container, dayAfterScheduled()));
    fireEvent(window, pointer('pointermove', { x: 200, y: 200 }));
    fireEvent(window, pointer('pointerup', { x: 200, y: 200 }));

    const afterDrop = screen.getByTestId('proposal').textContent;
    fireEvent.click(handle);
    expect(screen.getByTestId('proposal')).toHaveTextContent(String(afterDrop));
    expect(afterDrop).not.toBe(SCHEDULED_AT);
  });
});

/**
 * The settle marker.
 *
 * It exists only so a released chip can play one frame of motion, so the
 * properties worth pinning are that it names the right release and that it
 * clears itself. A marker that stayed set would make an unrelated re-render
 * replay the settle, which on a calendar that re-renders on every filter
 * change would be constant.
 */
describe('the release settle', () => {
  it('marks a real drop as a drop, and clears itself afterwards', () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { container, handle } = setup();
    const target = cellFor(container, dayAfterScheduled());

    hover(target);
    fireEvent(handle, pointer('pointerdown', { x: 40, y: 40 }));
    fireEvent(window, pointer('pointermove', { x: 200, y: 200 }));
    fireEvent(window, pointer('pointerup', { x: 200, y: 200 }));

    expect(screen.getByTestId('settle')).toHaveTextContent('drop');

    act(() => {
      vi.advanceTimersByTime(SETTLE_HOLD_MS + 1);
    });
    expect(screen.getByTestId('settle')).toHaveTextContent('none');
  });

  it('marks a release over nothing as a cancel', () => {
    const { handle } = setup();

    hover(null);
    fireEvent(handle, pointer('pointerdown', { x: 40, y: 40 }));
    fireEvent(window, pointer('pointermove', { x: 200, y: 200 }));
    fireEvent(window, pointer('pointerup', { x: 200, y: 200 }));

    expect(screen.getByTestId('settle')).toHaveTextContent('cancel');
  });

  it('never marks a press that did not become a drag', () => {
    const { handle } = setup();

    fireEvent(handle, pointer('pointerdown', { x: 40, y: 40 }));
    fireEvent(window, pointer('pointerup', { x: 41, y: 41 }));

    expect(screen.getByTestId('settle')).toHaveTextContent('none');
  });
});
