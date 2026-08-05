'use client';

/**
 * The month grid.
 *
 * A month cell is a date, a count and up to three compact chips. Anything
 * beyond that is a link into the day view rather than a scrollable stack: a
 * cell that scrolls internally hides work, and hidden work is the failure this
 * whole surface exists to prevent.
 */

import { useMemo, type ReactNode } from 'react';
import { cn, focusRingInset } from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import { EntryChip } from './entry-chip';
import { useCalendarFormat } from './format';
import { entryKey, needsAttention, sortEntries } from './filters';
import { toWallClock } from './date-range';
import type { CalendarEntry, CalendarRange } from './types';

const VISIBLE_PER_CELL = 3;

export interface CalendarMonthProps {
  range: CalendarRange;
  entries: readonly CalendarEntry[];
  timeZone: string;
  hrefForEntry: (entry: CalendarEntry) => string;
  hrefForDay: (day: Date) => string;
  label: string;
}

export function CalendarMonth({
  range,
  entries,
  timeZone,
  hrefForEntry,
  hrefForDay,
  label,
}: CalendarMonthProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();

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
    <section aria-label={label} className="relay-scrollbar overflow-x-auto">
      <div className="min-w-[42rem]">
        <div className="border-border-default bg-surface-canvas grid grid-cols-7 gap-px border-b">
          {weekdayNames.map((day) => (
            <h3 key={day.toISOString()} className="text-label text-text-secondary px-2 py-1.5">
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

            return (
              <div
                key={day.toISOString()}
                className="bg-surface-canvas flex min-h-28 flex-col gap-1 p-1.5"
              >
                <div className="flex items-baseline justify-between gap-1">
                  <a
                    href={hrefForDay(day)}
                    aria-label={t('a11y.label.calendarCell', {
                      date: format.date(day, 'full'),
                      count: dayEntries.length,
                    })}
                    className={cn(
                      'text-body-sm rounded-sm px-1 tabular-nums no-underline',
                      'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
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
