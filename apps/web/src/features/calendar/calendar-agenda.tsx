'use client';

/**
 * The agenda list, and the default below 768px.
 *
 * Mobile does not get a squeezed week grid. It gets the same information as a
 * sequence of days, each a heading followed by its posts, which is how the
 * schedule is actually read on a phone: what is next, then what is after that.
 * Every entry keeps the full state pill, language and media type, because a
 * mobile approver needs exactly the same facts as a desktop one.
 */

import { useMemo, type ReactNode } from 'react';
import { cn } from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import { EntryChip } from './entry-chip';
import { useCalendarFormat } from './format';
import { entryKey, sortEntries } from './filters';
import { isSameDay, toWallClock } from './date-range';
import type { CalendarEntry, CalendarRange, RescheduleProposal } from './types';

export interface CalendarAgendaProps {
  range: CalendarRange;
  entries: readonly CalendarEntry[];
  timeZone: string;
  hrefForEntry: (entry: CalendarEntry) => string;
  grabbedKey: string | null;
  onPickUp: (entry: CalendarEntry) => void;
  /** The in-progress keyboard move, when one is active. See `CalendarGrid`. */
  proposal?: RescheduleProposal | null;
  label: string;
  /** Days with nothing on them are dropped once the list gets long. */
  hideEmptyDays?: boolean;
}

export function CalendarAgenda({
  range,
  entries,
  timeZone,
  hrefForEntry,
  grabbedKey,
  onPickUp,
  proposal = null,
  label,
  hideEmptyDays = false,
}: CalendarAgendaProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();
  const targetInstant = proposal ? new Date(proposal.toInstant) : null;

  const grouped = useMemo(() => {
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

  const days = range.days.filter((day) => {
    if (!hideEmptyDays) return true;
    const wall = toWallClock(day, timeZone);
    return (grouped.get(`${wall.year}-${wall.month}-${wall.day}`)?.length ?? 0) > 0;
  });

  return (
    <section aria-label={label} className="flex flex-col">
      {days.map((day) => {
        const wall = toWallClock(day, timeZone);
        const dayEntries = grouped.get(`${wall.year}-${wall.month}-${wall.day}`) ?? [];
        const isTarget = targetInstant !== null && isSameDay(day, targetInstant, timeZone);
        return (
          <div
            key={day.toISOString()}
            className={cn(
              'border-border-subtle border-b last:border-b-0',
              isTarget && 'outline-accent outline-2 outline-offset-[-2px] outline-dashed',
            )}
          >
            <h3 className="flex items-baseline gap-2 px-4 py-2 md:px-6">
              <span className="text-title-sm text-text-primary">{format.date(day, 'medium')}</span>
              <span className="text-body-sm text-text-tertiary">
                {t('calendar.slotCount', { count: dayEntries.length })}
              </span>
            </h3>

            {dayEntries.length === 0 ? null : (
              <ul className="flex flex-col gap-2 px-4 pb-3 md:px-6">
                {dayEntries.map((entry) => (
                  <li key={entryKey(entry)}>
                    <EntryChip
                      entry={entry}
                      href={hrefForEntry(entry)}
                      grabbed={grabbedKey === entryKey(entry)}
                      onPickUp={onPickUp}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </section>
  );
}
