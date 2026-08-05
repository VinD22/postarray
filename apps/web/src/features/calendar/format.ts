'use client';

/**
 * Formatting bound to the workspace zone.
 *
 * Every date on the calendar, the queue and the receipt is rendered in the
 * workspace time zone carried by the i18n context, never in the browser's.
 * Wrapping the formatters here means no component has to remember to pass the
 * zone, and no component can forget.
 */

import { useMemo } from 'react';
import {
  formatDate,
  formatDateTime,
  formatDuration,
  formatRelativeTime,
  formatTime,
  formatTimeZoneLabel,
  formatTimeZoneOffset,
  getLocale,
} from '@relay/i18n';
import { useI18n } from '@relay/i18n/react';

export interface CalendarFormatters {
  readonly locale: string;
  readonly timeZone: string;
  /** 0 for Sunday through 6 for Saturday, taken from the locale descriptor. */
  readonly weekStartsOn: number;
  readonly time: (value: string | Date) => string;
  readonly date: (value: string | Date, style?: 'full' | 'long' | 'medium' | 'short') => string;
  readonly dateTime: (value: string | Date) => string;
  /** The same instant in UTC, shown beside a local time on every confirmation. */
  readonly utc: (value: string | Date) => string;
  readonly relative: (value: string | Date) => string;
  readonly duration: (milliseconds: number) => string;
  readonly zoneLabel: (at?: string | Date) => string;
  readonly zoneOffset: (at?: string | Date) => string;
  readonly weekdayShort: (value: Date) => string;
  readonly dayNumber: (value: Date) => string;
  readonly isoDateTime: (value: string | Date) => string;
}

export function useCalendarFormat(): CalendarFormatters {
  const { locale, timeZone } = useI18n();

  return useMemo<CalendarFormatters>(() => {
    // An unregistered tag still formats correctly through Intl; only the week
    // start needs a descriptor, and Sunday is the safer default because a
    // Sunday-start grid never hides a Sunday post in the previous week.
    const descriptor = getLocale(locale) ?? getLocale(locale.split('-')[0] ?? 'en');
    const weekStartsOn = descriptor?.weekStartsOn ?? 0;
    const weekdayFormat = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone });
    const dayFormat = new Intl.DateTimeFormat(locale, { day: 'numeric', timeZone });

    return {
      locale,
      timeZone,
      weekStartsOn,
      time: (value) => formatTime(locale, value, { timeZone }),
      date: (value, style = 'medium') => formatDate(locale, value, { timeZone, dateStyle: style }),
      dateTime: (value) => formatDateTime(locale, value, { timeZone }),
      utc: (value) =>
        formatDateTime(locale, value, { timeZone: 'UTC', dateStyle: 'short', timeStyle: 'short' }),
      relative: (value) => formatRelativeTime(locale, value, { timeZone }),
      duration: (milliseconds) => formatDuration(locale, milliseconds),
      zoneLabel: (at) => formatTimeZoneLabel(locale, timeZone, at ? { at } : {}),
      zoneOffset: (at) => formatTimeZoneOffset(locale, timeZone, at ?? new Date()),
      weekdayShort: (value) => weekdayFormat.format(value),
      dayNumber: (value) => dayFormat.format(value),
      isoDateTime: (value) => (value instanceof Date ? value : new Date(value)).toISOString(),
    };
  }, [locale, timeZone]);
}
