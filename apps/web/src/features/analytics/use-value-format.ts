'use client';

import { useCallback, useMemo } from 'react';
import {
  formatDate,
  formatDateTime,
  formatDuration,
  formatNumber,
  formatPercent,
  formatRelativeTime,
} from '@relay/i18n';
import { useI18n } from '@relay/i18n/react';

import { valueShapeOf } from './metrics';
import type { MetricReading } from './types';

/**
 * Locale aware formatting for metric values and the instants beside them.
 *
 * Kept in one hook so a number is formatted the same way in the table, in the
 * chart tooltip, in the chart's table alternative and in the evidence panel.
 * Three slightly different renderings of the same figure is how a reader starts
 * to distrust all three.
 *
 * Every method returns `null` rather than a placeholder when there is no value,
 * so a caller has to decide what to say instead. That is deliberate: a shared
 * "0" or a shared dash is exactly the failure this product forbids.
 */
export interface ValueFormatter {
  /** The value of a reading, or null when there is nothing to show. */
  readonly value: (reading: MetricReading) => string | null;
  /** A bare number in the same shape as a reading of this unit. */
  readonly valueOf: (value: number, unit: MetricReading['definition']['unit']) => string;
  /** A signed percentage, for example "+58%". */
  readonly signedPercent: (ratio: number) => string;
  /** An unsigned percentage, for example "58%". */
  readonly percent: (ratio: number, fractionDigits?: number) => string;
  readonly count: (value: number) => string;
  readonly dateTime: (iso: string) => string;
  readonly date: (iso: string) => string;
  readonly relative: (iso: string) => string;
  readonly duration: (seconds: number) => string;
  readonly locale: string;
  readonly timeZone: string;
}

export function useValueFormat(): ValueFormatter {
  const { locale, timeZone } = useI18n();

  const valueOf = useCallback(
    (value: number, unit: MetricReading['definition']['unit']): string => {
      switch (valueShapeOf(unit)) {
        case 'duration':
          return formatDuration(locale, value * 1000, { maxUnits: 2 });
        case 'percent':
          return formatPercent(locale, value / 100, { fractionDigits: 1 });
        case 'ratio':
          return formatPercent(locale, value, { fractionDigits: 1 });
        case 'currency':
          // A currency metric always arrives with its own formatted label from
          // the billing surface; here it is shown as minor units so it is never
          // silently mislabelled with the wrong symbol.
          return formatNumber(locale, value);
        case 'count':
        default:
          return formatNumber(locale, value, { useGrouping: true });
      }
    },
    [locale],
  );

  return useMemo<ValueFormatter>(
    () => ({
      locale,
      timeZone,
      valueOf,
      value: (reading) =>
        reading.availability === 'available' && reading.value !== null
          ? valueOf(reading.value, reading.definition.unit)
          : null,
      signedPercent: (ratio) =>
        formatPercent(locale, ratio, { fractionDigits: 0, signDisplay: 'always' }),
      percent: (ratio, fractionDigits = 0) => formatPercent(locale, ratio, { fractionDigits }),
      count: (value) => formatNumber(locale, value, { useGrouping: true }),
      dateTime: (iso) => formatDateTime(locale, iso, { timeZone }),
      date: (iso) => formatDate(locale, iso, { timeZone }),
      relative: (iso) => formatRelativeTime(locale, iso, { timeZone }),
      duration: (seconds) => formatDuration(locale, seconds * 1000, { maxUnits: 2 }),
    }),
    [locale, timeZone, valueOf],
  );
}
