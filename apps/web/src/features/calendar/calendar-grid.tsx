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
import { fromWallClock, isSameDay, toWallClock } from './date-range';
import type { CalendarEntry, CalendarRange, RescheduleProposal } from './types';

const DEFAULT_FIRST_HOUR = 8;
const DEFAULT_LAST_HOUR = 20;

export interface CalendarGridProps {
  range: CalendarRange;
  entries: readonly CalendarEntry[];
  timeZone: string;
  hrefForEntry: (entry: CalendarEntry) => string;
  grabbedKey: string | null;
  onPickUp: (entry: CalendarEntry) => void;
  /**
   * The in-progress keyboard move, when one is active. Its `toInstant` draws
   * a dashed outline on the one cell the post would land in, so a step is
   * visible without moving or animating the chip itself.
   */
  proposal?: RescheduleProposal | null;
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
  proposal = null,
  label,
}: CalendarGridProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();
  const days = range.days;

  // The proposed landing slot for an active keyboard move, if any. Computed
  // once per render rather than per cell.
  const targetInstant = proposal ? new Date(proposal.toInstant) : null;
  const targetHour = targetInstant ? toWallClock(targetInstant, timeZone).hour : null;

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
            'border-border-default bg-surface-canvas border-b',
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
              className="border-border-subtle grid gap-px border-b last:border-b-0"
            >
              <div className="bg-surface-canvas px-2 py-2 text-end">
                <span className="text-label text-text-tertiary tabular-nums">
                  {format.time(hourInstant(days[0] ?? range.start, band.hour, timeZone))}
                </span>
              </div>

              {band.cells.map((cell, index) => {
                const day = days[index] ?? range.start;
                const isTarget =
                  targetInstant !== null &&
                  band.hour === targetHour &&
                  isSameDay(day, targetInstant, timeZone);
                return (
                  <div
                    key={`${band.hour}-${day.toISOString()}`}
                    className={cn(
                      'bg-surface-canvas flex min-h-14 flex-col gap-1 p-1',
                      // No transition here on purpose: the outline is the
                      // only thing that should change as the arrow keys step
                      // through slots, and it should snap, not animate.
                      isTarget && 'outline-accent outline-2 outline-offset-[-2px] outline-dashed',
                    )}
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
  const today = isSameDay(day, new Date(), timeZone);
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
          today && 'bg-accent-subtle text-text-accent rounded-sm px-1.5 font-semibold',
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
