'use client';

/**
 * The month grid.
 *
 * A month cell is a date, a count and up to three compact chips. Anything
 * beyond that is a link into the day view rather than a scrollable stack: a
 * cell that scrolls internally hides work, and hidden work is the failure this
 * whole surface exists to prevent.
 *
 * A cell is also a drop target. A month drop changes the date and nothing else:
 * the post keeps the wall clock time it was scheduled for, because that is the
 * only reading of "move this to Thursday" that does not quietly reschedule the
 * hour as well.
 */

import { useMemo, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { cn, focusRingInset } from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import { EntryChip } from './entry-chip';
import { useCalendarFormat } from './format';
import { entryKey, needsAttention, sortEntries } from './filters';
import { isSameDay, toWallClock } from './date-range';
import {
  TODAY_CELL_ATTRIBUTE,
  WEEK_CELL_ATTRIBUTE,
  useTodayPulse,
  useWeekFill,
} from './mount-motion';
import type { DragSettle } from './use-drag-reschedule';
import type { CalendarEntry, CalendarRange, RescheduleProposal } from './types';

const VISIBLE_PER_CELL = 3;

export interface CalendarMonthProps {
  range: CalendarRange;
  entries: readonly CalendarEntry[];
  timeZone: string;
  hrefForEntry: (entry: CalendarEntry) => string;
  hrefForDay: (day: Date) => string;
  /** The entry picked up for a keyboard move, if any. See `CalendarGrid`. */
  grabbedKey?: string | null;
  onPickUp?: (entry: CalendarEntry) => void;
  /** The proposed landing day, drawn as a dashed outline on that one cell. */
  proposal?: RescheduleProposal | null;
  draggingKey?: string | null;
  /** The chip released on the last pointer-up, and how. See `useDragReschedule`. */
  settle?: DragSettle | null;
  onDragStart?: (entry: CalendarEntry, event: ReactPointerEvent<Element>) => void;
  label: string;
}

export function CalendarMonth({
  range,
  entries,
  timeZone,
  hrefForEntry,
  hrefForDay,
  grabbedKey = null,
  onPickUp,
  proposal = null,
  draggingKey = null,
  settle = null,
  onDragStart,
  label,
}: CalendarMonthProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();
  const scope = useRef<HTMLElement>(null);
  const targetInstant = proposal ? new Date(proposal.toInstant) : null;

  useWeekFill(scope);
  useTodayPulse(scope);

  const byDay = useMemo(() => {
    const map = new Map<string, CalendarEntry[]>();
    for (const entry of sortEntries(entries)) {
      const wall = toWallClock(new Date(entry.scheduledAt), timeZone);
      const key = `${wall.year}-${wall.month}-${wall.day}`;
      const bucket = map.get(key);
      if (bucket) bucket.push(entry);
      else map.set(key, [entry]);
    }
    return map;
  }, [entries, timeZone]);

  const weekdayNames = range.days.slice(0, 7);

  return (
    <section ref={scope} aria-label={label} className="relay-scrollbar overflow-x-auto">
      <div className="min-w-[42rem]">
        <div className="border-border-default bg-surface-canvas grid grid-cols-7 gap-px border-b">
          {weekdayNames.map((day) => (
            <h3
              key={day.toISOString()}
              {...{ [WEEK_CELL_ATTRIBUTE]: '' }}
              className="text-label text-text-secondary px-2 py-1.5"
            >
              {format.weekdayShort(day)}
            </h3>
          ))}
        </div>

        <div className="bg-border-subtle grid grid-cols-7 gap-px">
          {range.days.map((day) => {
            const wall = toWallClock(day, timeZone);
            const dayEntries = byDay.get(`${wall.year}-${wall.month}-${wall.day}`) ?? [];
            const visible = dayEntries.slice(0, VISIBLE_PER_CELL);
            const overflow = dayEntries.length - visible.length;
            const attention = dayEntries.some(needsAttention);
            const today = isSameDay(day, new Date(), timeZone);
            const isTarget = targetInstant !== null && isSameDay(day, targetInstant, timeZone);

            return (
              <div
                key={day.toISOString()}
                data-drop-instant={day.toISOString()}
                data-drop-granularity="day"
                className={cn(
                  'bg-surface-canvas flex min-h-28 flex-col gap-1 p-1.5',
                  // Snaps rather than animates: the outline is the only thing
                  // that changes as the pointer or the arrow keys move.
                  isTarget && 'outline-accent outline-2 outline-offset-[-2px] outline-dashed',
                  // A pointer carrying a post also fills the day it is over.
                  // Same drag state, same proposal the keyboard produces.
                  isTarget && draggingKey !== null && 'bg-accent-subtle',
                )}
              >
                <div className="flex items-baseline justify-between gap-1">
                  <a
                    href={hrefForDay(day)}
                    {...(today ? { [TODAY_CELL_ATTRIBUTE]: '' } : {})}
                    aria-label={t('a11y.label.calendarCell', {
                      date: format.date(day, 'full'),
                      count: dayEntries.length,
                    })}
                    className={cn(
                      'text-body-sm inline-block rounded-full px-1.5 tabular-nums no-underline',
                      today
                        ? 'bg-cta text-cta-on border-border-bold border-2 font-semibold'
                        : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
                      focusRingInset,
                    )}
                  >
                    {format.dayNumber(day)}
                  </a>
                  {attention ? (
                    <span className="border-warning-border bg-warning-bg text-label text-warning-fg rounded-sm border px-1">
                      {t('calendar.queue.failed')}
                    </span>
                  ) : null}
                </div>

                {visible.map((entry) => (
                  <EntryChip
                    key={entryKey(entry)}
                    entry={entry}
                    href={hrefForEntry(entry)}
                    density="compact"
                    grabbed={grabbedKey === entryKey(entry)}
                    dragging={draggingKey === entryKey(entry)}
                    settleKind={settle?.key === entryKey(entry) ? settle.kind : null}
                    settleId={settle?.key === entryKey(entry) ? settle.id : null}
                    {...(onPickUp ? { onPickUp } : {})}
                    {...(onDragStart ? { onDragStart } : {})}
                  />
                ))}

                {overflow > 0 ? (
                  <a
                    href={hrefForDay(day)}
                    className={cn(
                      'text-label text-text-accent rounded-sm px-1 py-0.5 no-underline',
                      'hover:bg-accent-subtle',
                      focusRingInset,
                    )}
                  >
                    {t('web.calendar.grid.overflow', { count: overflow })}
                  </a>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
