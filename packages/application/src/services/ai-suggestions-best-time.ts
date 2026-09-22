import { DEFAULT_MINIMUM_SAMPLE, NOISE_BAND, median } from '@relay/analytics-domain';

import { partsOf } from '../internal/zone-time';

/**
 * "When have my posts on this account done best?", from this account's own
 * readings only.
 *
 * There is no global best-time chart and no industry benchmark. Posts are
 * grouped into two hour bands in the account's time zone, each band's median is
 * compared with the account's overall median, and nothing is said unless both
 * the whole history and the winning band clear a minimum sample. Readings that
 * were unavailable are left out, never counted as zero.
 */

/** Below this many readable posts on the account, nothing is suggested. */
export const BEST_TIME_MINIMUM_TOTAL = 12;
/** A band needs at least this many posts before its median means anything. */
export const BEST_TIME_MINIMUM_BAND = DEFAULT_MINIMUM_SAMPLE;
export const BEST_TIME_BAND_HOURS = 2;

export interface BestTimeReading {
  readonly publishedAt: Date;
  /** Null when the reading was unavailable. Never coerced to zero. */
  readonly value: number | null;
}

export type BestTimeResult =
  | {
      readonly outcome: 'found';
      readonly startHour: number;
      readonly endHour: number;
      readonly ratio: number;
      readonly bandSampleSize: number;
      readonly totalSampleSize: number;
    }
  | {
      readonly outcome: 'insufficient_history' | 'no_clear_difference';
      readonly totalSampleSize: number;
    };

export function findBestBand(
  readings: readonly BestTimeReading[],
  timeZone: string,
): BestTimeResult {
  const usable = readings.filter(
    (entry): entry is { publishedAt: Date; value: number } => entry.value !== null,
  );
  const totalSampleSize = usable.length;
  if (totalSampleSize < BEST_TIME_MINIMUM_TOTAL) {
    return { outcome: 'insufficient_history', totalSampleSize };
  }
  const overall = median(usable.map((entry) => entry.value));
  if (overall === null || overall <= 0) {
    return { outcome: 'no_clear_difference', totalSampleSize };
  }

  const bands = new Map<number, number[]>();
  for (const entry of usable) {
    const hour = partsOf(entry.publishedAt, timeZone).hour % 24;
    const start = hour - (hour % BEST_TIME_BAND_HOURS);
    const list = bands.get(start) ?? [];
    list.push(entry.value);
    bands.set(start, list);
  }

  let best: { start: number; ratio: number; size: number } | null = null;
  for (const [start, values] of bands) {
    if (values.length < BEST_TIME_MINIMUM_BAND) {
      continue;
    }
    const bandMedian = median(values);
    if (bandMedian === null) {
      continue;
    }
    const ratio = bandMedian / overall;
    if (best === null || ratio > best.ratio) {
      best = { start, ratio, size: values.length };
    }
  }

  if (best === null) {
    return { outcome: 'insufficient_history', totalSampleSize };
  }
  if (best.ratio < 1 + NOISE_BAND) {
    return { outcome: 'no_clear_difference', totalSampleSize };
  }
  return {
    outcome: 'found',
    startHour: best.start,
    endHour: best.start + BEST_TIME_BAND_HOURS,
    ratio: Math.round(best.ratio * 10) / 10,
    bandSampleSize: best.size,
    totalSampleSize,
  };
}
