'use client';

/**
 * The day and week grid.
 *
 * Hour bands rather than absolute positioning. Every entry sits in normal
 * document flow inside the band it belongs to, which is what makes the grid
 * survive 200 percent zoom, a 30 to 50 percent longer translation and a
 * screen reader reading it top to bottom. An absolutely positioned overlay
 * looks more like a desktop calendar and breaks all three.
 *
 * The band range is computed from the content: it always covers 08:00 to
 * 20:00 so the shape is familiar, and it extends to cover a 05:00 or a 23:00
 * post rather than hiding it.
 */

import { useMemo, type ReactNode } from 'react';
import { cn } from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import { EntryChip } from './entry-chip';
import { useCalendarFormat } from './format';
import { entryKey, sortEntries } from './filters';
import { fromWallClock, toWallClock } from './date-range';
import type { CalendarEntry, CalendarRange } from './types';

const DEFAULT_FIRST_HOUR = 8;
const DEFAULT_LAST_HOUR = 20;

export interface CalendarGridProps {
  range: CalendarRange;
  entries: readonly CalendarEntry[];
  timeZone: string;
  hrefForEntry: (entry: CalendarEntry) => string;
  grabbedKey: string | null;
  onPickUp: (entry: CalendarEntry) => void;
  /** Accessible name for the grid region. */
  label: string;
}

interface Band {
  readonly hour: number;
  readonly cells: readonly (readonly CalendarEntry[])[];
}

export function CalendarGrid({
  range,
  entries,
  timeZone,
  hrefForEntry,
  grabbedKey,
  onPickUp,
  label,
}: CalendarGridProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();
  const days = range.days;

  const bands = useMemo<readonly Band[]>(() => {
    const byDayHour = new Map<string, CalendarEntry[]>();
    let earliest = DEFAULT_FIRST_HOUR;
    let latest = DEFAULT_LAST_HOUR;

    for (const entry of sortEntries(entries)) {
      const wall = toWallClock(new Date(entry.scheduledAt), timeZone);
      earliest = Math.min(earliest, wall.hour);
      latest = Math.max(latest, wall.hour + 1);
      const key = `${wall.year}-${wall.month}-${wall.day}-${wall.hour}`;
      const bucket = byDayHour.get(key);
      if (bucket) bucket.push(entry);
      else byDayHour.set(key, [entry]);
    }

    const result: Band[] = [];
    for (let hour = earliest; hour < Math.min(latest, 24); hour += 1) {
      result.push({
        hour,
        cells: days.map((day) => {
          const wall = toWallClock(day, timeZone);
          return byDayHour.get(`${wall.year}-${wall.month}-${wall.day}-${hour}`) ?? [];
        }),
      });
    }
    return result;
  }, [entries, days, timeZone]);

  const columnTemplate = {
    gridTemplateColumns: `minmax(3.5rem, auto) repeat(${days.length}, minmax(0, 1fr))`,
  };

  return (
    <section aria-label={label} className="relay-scrollbar overflow-x-auto">
      <div className="min-w-[44rem]">
        {/* Day headings. A sticky row so the columns stay identifiable. */}
        <div
          style={columnTemplate}
          className={cn(
            'sticky top-0 z-(--z-index-sticky) grid gap-px',
            'border-b border-border-default bg-surface-canvas',
          )}
        >
          <span aria-hidden="true" />
          {days.map((day) => (
            <DayHeading key={day.toISOString()} day={day} timeZone={timeZone} />
          ))}
        </div>

        <div className="bg-border-subtle">
          {bands.map((band) => (
            <div
              key={band.hour}
              style={columnTemplate}
              className="grid gap-px border-b border-border-subtle last:border-b-0"
            >
              <div className="bg-surface-canvas px-2 py-2 text-end">
                <span className="text-label tabular-nums text-text-tertiary">
                  {format.time(hourInstant(days[0] ?? range.start, band.hour, timeZone))}
                </span>
              </div>

              {band.cells.map((cell, index) => {
                const day = days[index] ?? range.start;
                return (
                  <div
                    key={`${band.hour}-${day.toISOString()}`}
                    className="flex min-h-14 flex-col gap-1 bg-surface-canvas p-1"
                  >
                    {cell.length === 0 ? (
                      <span className="sr-only">
                        {t('web.calendar.grid.emptySlot', {
                          time: format.time(hourInstant(day, band.hour, timeZone)),
                          date: format.date(day, 'medium'),
                        })}
                      </span>
                    ) : (
                      cell.map((entry) => (
                        <EntryChip
                          key={entryKey(entry)}
                          entry={entry}
                          href={hrefForEntry(entry)}
                          grabbed={grabbedKey === entryKey(entry)}
                          onPickUp={onPickUp}
                        />
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DayHeading({ day, timeZone }: { day: Date; timeZone: string }): ReactNode {
  const format = useCalendarFormat();
  const today = isToday(day, timeZone);
  return (
    <h3
      className={cn(
        'flex items-baseline gap-1.5 px-2 py-2',
        today ? 'text-text-primary' : 'text-text-secondary',
      )}
    >
      <span className="text-label">{format.weekdayShort(day)}</span>
      <span
        className={cn(
          'text-body-md tabular-nums',
          today && 'rounded-sm bg-accent-subtle px-1.5 font-semibold text-text-accent',
        )}
      >
        {format.dayNumber(day)}
      </span>
    </h3>
  );
}

/** The instant at which a given wall clock hour occurs on that day, in the zone. */
function hourInstant(day: Date, hour: number, timeZone: string): Date {
  const wall = toWallClock(day, timeZone);
  return fromWallClock({ ...wall, hour, minute: 0 }, timeZone);
}

function isToday(day: Date, timeZone: string): boolean {
  const left = toWallClock(day, timeZone);
  const right = toWallClock(new Date(), timeZone);
  return left.year === right.year && left.month === right.month && left.day === right.day;
}
