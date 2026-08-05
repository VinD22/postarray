/**
 * The single construction site for wall-clock time in this service.
 *
 * Everything else takes a `Clock`, so the dedupe window, the expiry check and
 * the coarse click timestamp are all deterministic in tests.
 */

export interface Clock {
  /** Epoch milliseconds. */
  now(): number;
}

// eslint-disable-next-line no-restricted-globals -- the one place a real clock is read.
export const systemClock: Clock = { now: () => Date.now() };

/** A clock a test can advance by hand. */
export function fixedClock(startMs: number): Clock & { advance(ms: number): void } {
  let current = startMs;
  return {
    now: () => current,
    advance: (ms: number) => {
      current += ms;
    },
  };
}

/** ISO instant for an epoch millisecond value. */
export function toIsoInstant(epochMs: number): string {
  // eslint-disable-next-line no-restricted-globals -- formatting only, no ambient time read.
  return new Date(epochMs).toISOString();
}

/** Epoch milliseconds for an ISO instant, or null when it is unparseable. */
export function parseInstantMs(value: string): number | null {
  // eslint-disable-next-line no-restricted-globals -- parsing only, no ambient time read.
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Truncate an instant to the top of its hour. Click times are never precise. */
export function truncateToHour(epochMs: number): number {
  const hourMs = 60 * 60 * 1000;
  return Math.floor(epochMs / hourMs) * hourMs;
}
