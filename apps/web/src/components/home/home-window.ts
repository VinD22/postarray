/**
 * The one calendar window Home reads.
 *
 * Home used to issue three calendar reads with three millisecond-precise
 * ranges (the header count, the tiles and the queue), so none of them ever
 * shared a cache entry and every refresh refetched all three. Now the window
 * starts on the hour and spans seven days: every section asks for the same
 * key, the read happens once, the server can prefetch the same key, and the
 * 24-hour view is derived from it instead of fetched.
 */
export const HOUR_MS = 3_600_000;
export const DAY_MS = 24 * HOUR_MS;
export const WEEK_MS = 7 * DAY_MS;

/** The start of the hour containing `now`, in UTC milliseconds. */
export function hourFloor(now: number): number {
  return Math.floor(now / HOUR_MS) * HOUR_MS;
}

/** The fetched range: from the top of the hour to seven days later. */
export function homeWindowRange(now: number): { readonly from: string; readonly to: string } {
  const start = hourFloor(now);
  // One extra hour at the end so the derived week still covers `now + 7d`.
  return {
    from: new Date(start).toISOString(),
    to: new Date(start + WEEK_MS + HOUR_MS).toISOString(),
  };
}

/**
 * Entries whose instant falls in `[now, now + span)`. An instant that does not
 * parse is dropped rather than counted.
 */
export function entriesWithin<T extends { readonly scheduledAt: string }>(
  entries: readonly T[],
  now: number,
  span: number,
): T[] {
  return entries.filter((entry) => {
    const at = Date.parse(entry.scheduledAt);
    return !Number.isNaN(at) && at >= now && at < now + span;
  });
}
