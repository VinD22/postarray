/**
 * The single place in this package that touches the ambient clock. Everything
 * else takes an explicit `now`, so tests can freeze time and a report is
 * reproducible.
 */

export interface Clock {
  now(): Date;
}

/* eslint-disable no-restricted-globals -- the only sanctioned use of the ambient clock. */
export const systemClock: Clock = {
  now: () => new Date(),
};

/** Epoch milliseconds for an ISO instant, or `null` when it is not parseable. */
export function parseInstant(value: string): number | null {
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : null;
}

export function fixedClock(instant: string): Clock {
  const frozen = new Date(instant);
  return { now: () => new Date(frozen.getTime()) };
}
/* eslint-enable no-restricted-globals */

/** Whole seconds between two instants, floored at zero. */
export function secondsBetween(earlierMs: number, laterMs: number): number {
  return Math.max(0, Math.floor((laterMs - earlierMs) / 1000));
}
