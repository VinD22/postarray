'use client';

import { useMemo } from 'react';

import {
  formatBytes,
  formatCompactNumber,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatDuration,
  formatList,
  formatNumber,
  formatPercent,
  formatRelativeTime,
  formatTime,
  formatTimeZoneLabel,
  type DateInput,
  type DateStyle,
  type TimeStyle,
} from '@relay/i18n';
import { useI18n } from '@relay/i18n/react';

import type { Money } from '@/lib/api/types';

/**
 * Formatters already bound to the active locale and the workspace time zone.
 *
 * Nothing in the product formats a date without a zone. The workspace zone is
 * the default here so a screen cannot accidentally render a schedule in the
 * viewer's zone, which is how a post goes out at the wrong hour.
 */
export interface Formatters {
  readonly locale: string;
  readonly timeZone: string;
  readonly date: (value: DateInput, style?: DateStyle) => string;
  readonly time: (value: DateInput, style?: TimeStyle) => string;
  readonly dateTime: (value: DateInput) => string;
  readonly relative: (value: DateInput) => string;
  readonly number: (value: number) => string;
  readonly compactNumber: (value: number) => string;
  readonly percent: (value: number) => string;
  readonly money: (value: Money) => string;
  readonly bytes: (value: number) => string;
  readonly duration: (milliseconds: number) => string;
  readonly list: (values: readonly string[]) => string;
  readonly timeZoneLabel: (timeZone?: string) => string;
}

export function useFormatters(): Formatters {
  const { locale, timeZone } = useI18n();

  return useMemo<Formatters>(
    () => ({
      locale,
      timeZone,
      date: (value, style = 'medium') => formatDate(locale, value, { timeZone, dateStyle: style }),
      time: (value, style = 'short') => formatTime(locale, value, { timeZone, timeStyle: style }),
      dateTime: (value) => formatDateTime(locale, value, { timeZone }),
      relative: (value) => formatRelativeTime(locale, value, { timeZone }),
      number: (value) => formatNumber(locale, value),
      compactNumber: (value) => formatCompactNumber(locale, value),
      percent: (value) => formatPercent(locale, value),
      money: (value) => formatCurrency(locale, value.amountMinor, value.currency),
      bytes: (value) => formatBytes(locale, value),
      duration: (milliseconds) => formatDuration(locale, milliseconds),
      list: (values) => formatList(locale, values),
      timeZoneLabel: (zone) => formatTimeZoneLabel(locale, zone ?? timeZone),
    }),
    [locale, timeZone],
  );
}
