import type { AnalyticsRange } from './types';

/**
 * The period immediately before this one, the same length.
 *
 * "Compare with the previous period" has exactly one honest reading: the same
 * number of days, ending where this window starts. Not the same calendar month
 * (February against January compares 28 days with 31), and not a fixed 30 days
 * regardless of what the reader chose (which would compare a week against a
 * month and call the difference growth).
 *
 * The arithmetic is on instants, in UTC, so it cannot gain or lose an hour at
 * a daylight-saving transition. A comparison window that is 23 hours long in
 * March is a comparison that reports a fall nobody experienced.
 *
 * The preset comes back as `custom`, because it no longer is one of the
 * presets: it is whatever window sat before the one the reader picked.
 */
export function previousPeriod(range: AnalyticsRange): AnalyticsRange {
  const start = Date.parse(range.start);
  const end = Date.parse(range.end);

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    // Nothing sensible to shift. Returning the range unchanged would compare
    // the period against itself and report a flat zero difference, which is a
    // claim; returning it as-is with a custom preset at least does not.
    return { ...range, preset: 'custom' };
  }

  const length = end - start;
  return {
    preset: 'custom',
    start: new Date(start - length).toISOString(),
    end: new Date(start).toISOString(),
  };
}
