'use client';

/**
 * "When your posts on this account did best", in a channel tab.
 *
 * Built from this account's own readings only, with the sample size stated.
 * Below the minimum sample it says so, with the count, rather than showing a
 * generic best-time chart. It is a hint: it never sets the schedule.
 */

import type { ReactNode } from 'react';
import { Clock } from 'lucide-react';
import { useTranslations } from '@relay/i18n/react';

import { useBestTime } from './suggest-data';

const FOUND_KEY: Readonly<Record<string, string>> = {
  impressions: 'web.suggest.bestTime.found.impressions',
  reach: 'web.suggest.bestTime.found.reach',
  views: 'web.suggest.bestTime.found.views',
};

/** A local wall-clock hour, formatted for the reader's locale. */
function hourLabel(locale: string, hour: number): string {
  // A fixed UTC date formatted in UTC: the hour is already local to the account.
  return new Intl.DateTimeFormat(locale, { hour: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(2026, 0, 1, hour % 24)),
  );
}

export interface SuggestBestTimeProps {
  readonly connectionId: string;
}

export function SuggestBestTime({ connectionId }: SuggestBestTimeProps): ReactNode {
  const t = useTranslations();
  const query = useBestTime(connectionId);

  if (query.isPending) {
    return null;
  }

  let sentence: string;
  let basis: string | null = null;
  const data = query.data;
  if (query.error || data === undefined) {
    sentence = t.full('web.suggest.bestTime.unavailable');
  } else if (data.status === 'unavailable') {
    sentence =
      data.reasonKey === 'web.suggest.bestTime.smallSample'
        ? t.full('web.suggest.bestTime.smallSample', {
            count: data.totalSampleSize,
            minimum: data.minimumSample,
          })
        : t(data.reasonKey);
  } else {
    const key = FOUND_KEY[data.metric] ?? 'web.suggest.bestTime.found.impressions';
    sentence = t(key, {
      start: hourLabel(t.locale, data.startHour),
      end: hourLabel(t.locale, data.endHour),
      ratio: data.ratio,
      count: data.bandSampleSize,
    });
    basis = t.full('web.suggest.bestTime.basis', {
      total: data.totalSampleSize,
      timeZone: data.timeZone,
    });
  }

  return (
    <section
      aria-labelledby={`suggest-best-time-${connectionId}`}
      className="border-border-subtle flex items-start gap-2 rounded-lg border p-3"
    >
      <Clock aria-hidden className="text-text-tertiary mt-0.5 size-4 shrink-0" />
      <div className="flex flex-col gap-0.5">
        <h3
          id={`suggest-best-time-${connectionId}`}
          className="text-body-sm text-text-primary font-semibold"
        >
          {t.full('web.suggest.bestTime.title')}
        </h3>
        <p className="text-body-sm text-text-secondary">{sentence}</p>
        {basis === null ? null : <p className="text-label text-text-tertiary">{basis}</p>}
      </div>
    </section>
  );
}
