'use client';

import { useMemo } from 'react';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatList,
  formatNumber,
  formatRelativeTime,
} from '@relay/i18n';
import { useI18n } from '@relay/i18n/react';

import type { MoneyView } from './view-models.js';

export interface Formatters {
  readonly locale: string;
  readonly timeZone: string;
  /** Medium date in the workspace zone. */
  date: (iso: string) => string;
  /** Long date, used where a legal date must be unambiguous. */
  exactDate: (iso: string) => string;
  dateTime: (iso: string) => string;
  relative: (iso: string) => string;
  number: (value: number) => string;
  money: (value: MoneyView) => string;
  list: (values: readonly string[]) => string;
}

/**
 * Locale and zone aware formatters bound to the workspace.
 *
 * Everything on these screens renders in the workspace time zone, never the
 * browser's, because a conversion date and a quiet hours window mean nothing
 * without the zone they were configured in.
 */
export function useFormatters(): Formatters {
  const { locale, timeZone } = useI18n();

  return useMemo<Formatters>(
    () => ({
      locale,
      timeZone,
      date: (iso) => formatDate(locale, iso, { timeZone }),
      exactDate: (iso) => formatDate(locale, iso, { timeZone, dateStyle: 'long' }),
      dateTime: (iso) => formatDateTime(locale, iso, { timeZone }),
      relative: (iso) => formatRelativeTime(locale, iso, { timeZone }),
      number: (value) => formatNumber(locale, value),
      money: (value) => formatCurrency(locale, value.amountMinor, value.currency),
      list: (values) => formatList(locale, values),
    }),
    [locale, timeZone],
  );
}
