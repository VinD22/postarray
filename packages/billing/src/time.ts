/**
 * Time helpers for the billing package.
 *
 * Documented boundary: this is the only module allowed to reach the `Date`
 * constructor, and it does so through `globalThis` so the workspace lint rule
 * that bans the bare `Date` global stays meaningful everywhere else. Every
 * other module takes a `Clock` and calls these helpers, so every billing date
 * in a test is deterministic.
 */

const DateCtor = globalThis.Date;

/** The clock shape the application layer injects. `{ now(): Date }`. */
export interface Clock {
  now(): Date;
}

/** A clock that reads the host wall clock. Never used inside a test. */
export const systemClock: Clock = {
  now(): Date {
    return new DateCtor();
  },
};

/** A clock frozen at a fixed instant, useful for pure derivations. */
export function fixedClock(instant: string): Clock {
  const frozen = parseInstant(instant);
  return {
    now(): Date {
      return new DateCtor(frozen.getTime());
    },
  };
}

export const MILLISECONDS_PER_SECOND = 1000;
export const SECONDS_PER_DAY = 60 * 60 * 24;
export const MILLISECONDS_PER_DAY = SECONDS_PER_DAY * MILLISECONDS_PER_SECOND;

/** Parse an ISO instant, throwing a `RangeError` on anything unparseable. */
export function parseInstant(value: string): Date {
  const parsed = new DateCtor(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new RangeError('INVALID_INSTANT');
  }
  return parsed;
}

/** Render a `Date` as an ISO 8601 instant with an explicit `Z` offset. */
export function toIsoInstant(value: Date): string {
  return value.toISOString();
}

/** Round trip through `Date` so every stored instant has the same shape. */
export function normalizeInstant(value: string): string {
  return toIsoInstant(parseInstant(value));
}

export function instantFromEpochMs(epochMs: number): Date {
  return new DateCtor(epochMs);
}

export function addMilliseconds(instant: string, milliseconds: number): string {
  return toIsoInstant(new DateCtor(parseInstant(instant).getTime() + milliseconds));
}

export function addSeconds(instant: string, seconds: number): string {
  return addMilliseconds(instant, seconds * MILLISECONDS_PER_SECOND);
}

export function addDays(instant: string, days: number): string {
  return addMilliseconds(instant, days * MILLISECONDS_PER_DAY);
}

/** Add whole calendar months, clamping the day of month (31 Jan + 1m = 28 Feb). */
export function addMonths(instant: string, months: number): string {
  const start = parseInstant(instant);
  const day = start.getUTCDate();
  const shifted = new DateCtor(start.getTime());
  shifted.setUTCDate(1);
  shifted.setUTCMonth(shifted.getUTCMonth() + months);
  const lastDay = new DateCtor(
    DateCtor.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth() + 1, 0),
  ).getUTCDate();
  shifted.setUTCDate(Math.min(day, lastDay));
  return toIsoInstant(shifted);
}

export function addYears(instant: string, years: number): string {
  return addMonths(instant, years * 12);
}

/** Signed difference in whole milliseconds, `later` minus `earlier`. */
export function differenceMs(later: string, earlier: string): number {
  return parseInstant(later).getTime() - parseInstant(earlier).getTime();
}

/** Whole days between two instants, rounded towards zero. */
export function differenceDays(later: string, earlier: string): number {
  return Math.trunc(differenceMs(later, earlier) / MILLISECONDS_PER_DAY);
}

/**
 * Whole days remaining, rounded up, floored at zero. "2.1 days left" is shown
 * to a customer as 3 days remaining, never as 2, because rounding a trial down
 * would make the banner contradict the charge date.
 */
export function daysUntil(target: string, now: string): number {
  const remaining = differenceMs(target, now);
  if (remaining <= 0) {
    return 0;
  }
  return Math.ceil(remaining / MILLISECONDS_PER_DAY);
}

export function isBefore(left: string, right: string): boolean {
  return differenceMs(right, left) > 0;
}

export function isAfter(left: string, right: string): boolean {
  return differenceMs(left, right) > 0;
}

export function isAtOrAfter(left: string, right: string): boolean {
  return differenceMs(left, right) >= 0;
}

/** The later of two instants. */
export function maxInstant(left: string, right: string): string {
  return isAfter(left, right) ? left : right;
}

/** The calendar date part of an instant, in UTC. */
export function isoDateOf(instant: string): string {
  return toIsoInstant(parseInstant(instant)).slice(0, 10);
}

/** Now, as an ISO instant, from an injected clock. */
export function nowIso(clock: Clock): string {
  return toIsoInstant(clock.now());
}

/**
 * A clock the caller drives. The local simulator and the deterministic tests
 * both use it, which is how a seven day trial is exercised in a millisecond.
 */
export class MutableClock implements Clock {
  private current: number;

  constructor(start: string | Date) {
    this.current = typeof start === 'string' ? parseInstant(start).getTime() : start.getTime();
  }

  now(): Date {
    return new DateCtor(this.current);
  }

  iso(): string {
    return toIsoInstant(this.now());
  }

  set(instant: string): void {
    this.current = parseInstant(instant).getTime();
  }

  advanceMs(milliseconds: number): void {
    this.current += milliseconds;
  }

  advanceSeconds(seconds: number): void {
    this.advanceMs(seconds * MILLISECONDS_PER_SECOND);
  }

  advanceDays(days: number): void {
    this.advanceMs(days * MILLISECONDS_PER_DAY);
  }
}
