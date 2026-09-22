'use client';

import type { ReactNode, PointerEvent as ReactPointerEvent } from 'react';
import { ArrowUpRight, MoveRight, Plus } from 'lucide-react';
import { Button, StatusPill } from '@relay/design-system';
import { useI18n, useTranslations } from '@relay/i18n/react';
import { Link } from '@/components/link';
import { ProviderMark, useProviderName } from '@/features/connections/provider';
import { isSameDay } from './date-range';

import { entryKey, sortEntries } from './filters';
import { canReschedule } from './reschedule';
import type { CalendarEntry, CalendarRange } from './types';

interface ScheduleBoardProps {
  readonly range: CalendarRange;
  readonly entries: readonly CalendarEntry[];
  readonly timeZone: string;
  readonly onMove: (entry: CalendarEntry) => void;
  readonly hrefForEntry?: (entry: CalendarEntry) => string;
  readonly composeHref?: string;
  readonly sample?: boolean;
  readonly grabbedKey?: string | null;
  readonly targetInstant?: string | null;
  readonly onPickUp?: (entry: CalendarEntry) => void;
  readonly onDragStart?: (entry: CalendarEntry, event: ReactPointerEvent<Element>) => void;
}

/** A post-first week. Empty hours never push the actual work below the fold. */
export function ScheduleBoard({
  range,
  entries,
  timeZone,
  onMove,
  hrefForEntry,
  composeHref,
  sample = false,
  grabbedKey = null,
  targetInstant = null,
  onPickUp,
  onDragStart,
}: ScheduleBoardProps): ReactNode {
  const t = useTranslations();
  const providerName = useProviderName();
  const { locale } = useI18n();
  const format = {
    date: (date: Date) =>
      new Intl.DateTimeFormat(locale, {
        timeZone,
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }).format(date),
    time: (instant: string) =>
      new Intl.DateTimeFormat(locale, { timeZone, hour: 'numeric', minute: '2-digit' }).format(
        new Date(instant),
      ),
  };
  return (
    <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-4">
      {range.days.map((day) => {
        const posts = sortEntries(
          entries.filter((entry) => isSameDay(day, new Date(entry.scheduledAt), timeZone)),
        );
        return (
          <section
            key={day.toISOString()}
            data-drop-instant={day.toISOString()}
            data-drop-granularity="day"
            className={
              targetInstant && isSameDay(day, new Date(targetInstant), timeZone)
                ? 'outline-accent min-w-0 rounded-xl outline-2 outline-offset-4'
                : 'min-w-0'
            }
          >
            <div className="border-border-default mb-4 flex items-center justify-between gap-3 border-b pb-3">
              <h2 className="text-title-sm text-text-primary font-semibold">{format.date(day)}</h2>
              <span className="text-body-sm text-text-secondary">
                {t('scheduler.daySummary', { count: posts.length })}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {posts.map((entry) => (
                <article
                  key={entryKey(entry)}
                  data-entry-key={entryKey(entry)}
                  data-grabbed={grabbedKey === entryKey(entry) || undefined}
                  className="border-border-default bg-surface-raised data-[grabbed]:outline-accent overflow-hidden rounded-xl border data-[grabbed]:outline-2"
                >
                  <div className="bg-surface-sunken border-border-subtle flex min-h-16 items-center justify-between gap-3 border-b p-5">
                    <span className="text-body-sm flex items-center gap-2">
                      <ProviderMark provider={entry.provider} />
                      {providerName(entry.provider)}
                    </span>
                    <span className="text-title-md text-text-primary font-semibold tabular-nums">
                      {format.time(entry.scheduledAt)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-4 p-5">
                    <div>
                      {entry.projectName ? (
                        <p className="text-label text-text-accent mb-2 font-semibold">
                          {entry.projectName}
                        </p>
                      ) : null}
                      <h3 className="text-title-sm text-text-primary leading-snug font-semibold">
                        {entry.title || t('web.calendar.entry.untitled')}
                      </h3>
                      <p className="text-body-sm text-text-secondary mt-2">{entry.accountLabel}</p>
                    </div>
                    <StatusPill
                      state={entry.state}
                      className="w-fit"
                      label={t(`state.${entry.state}.label`)}
                      size="sm"
                    />
                    <div className="flex flex-wrap gap-2">
                      {canReschedule(entry.state) && entry.state !== 'published' ? (
                        <Button
                          data-move-handle={onPickUp ? '' : undefined}
                          variant="secondary"
                          size="sm"
                          onPointerDown={
                            onDragStart ? (event) => onDragStart(entry, event) : undefined
                          }
                          onClick={() => (onPickUp ? onPickUp(entry) : onMove(entry))}
                          iconEnd={<MoveRight aria-hidden="true" className="size-4" />}
                        >
                          {t(sample ? 'scheduler.move' : 'web.calendar.keyboard.pickUp')}
                        </Button>
                      ) : null}
                      {hrefForEntry ? (
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            href={hrefForEntry(entry)}
                            aria-label={t('web.calendar.entry.openDetail', { title: entry.title })}
                          >
                            <ArrowUpRight aria-hidden="true" className="size-4" />
                            {t('action.open')}
                          </Link>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
              {posts.length === 0 ? (
                <div className="border-border-subtle text-text-tertiary flex min-h-36 flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-5 text-center">
                  <Plus aria-hidden="true" className="size-6" />
                  <p className="text-body-sm">{t('scheduler.emptyDay')}</p>
                  {composeHref ? (
                    <Link
                      href={composeHref}
                      className="text-text-accent text-body-sm underline underline-offset-4"
                    >
                      {t('empty.calendar.action')}
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </div>
          </section>
        );
      })}
    </div>
  );
}
