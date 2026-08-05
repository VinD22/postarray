/**
 * The single place in this package that touches the ambient clock.
 *
 * Every other module takes a `Clock`, which is the same shape the shared
 * `ServiceDeps` passes around, so tests can freeze time and evaluations are
 * reproducible.
 */

export interface Clock {
  now(): Date;
}

export const systemClock: Clock = {
  now: () => new Date(),
};

/** Epoch milliseconds for an ISO instant, or `null` when it is not parseable. */
export function parseInstant(value: string): number | null {
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : null;
}

/** Build a fixed clock. Used by tests, evaluations and deterministic exports. */
export function fixedClock(instant: string): Clock {
  const frozen = new Date(instant);
  return { now: () => new Date(frozen.getTime()) };
}

/** Construct an instant from epoch milliseconds. */
export function fromEpochMs(milliseconds: number): Date {
  return new Date(milliseconds);
}

/** ISO instant with an explicit offset, which is what every contract expects. */
export function nowIso(clock: Clock): string {
  return clock.now().toISOString();
}

/** Calendar date (`YYYY-MM-DD`) in UTC for the given instant. */
export function isoDateOf(instant: Date): string {
  return instant.toISOString().slice(0, 10);
}

/** Whole days between two instants, positive when `later` is after `earlier`. */
export function daysBetween(earlier: Date, later: Date): number {
  return Math.floor((later.getTime() - earlier.getTime()) / 86_400_000);
}

/** Shift an instant by whole days without touching the ambient clock. */
export function addDays(instant: Date, days: number): Date {
  return fromEpochMs(instant.getTime() + days * 86_400_000);
}
