/**
 * A clock the test drives.
 *
 * Documented boundary: this module reaches the `Date` constructor through
 * `globalThis` so every other module can keep taking a `Clock`. Nothing in a
 * test suite should ever read the host wall clock, because a DST test that
 * passes in June and fails in November is worse than no test.
 */

const DateCtor = globalThis.Date;

/** Matches the `Clock` the application services are constructed with. */
export interface Clock {
  now(): Date;
}

export const SECOND_MS = 1_000;
export const MINUTE_MS = 60 * SECOND_MS;
export const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 24 * HOUR_MS;

export type ClockListener = (instant: Date) => void;

/**
 * A deterministic clock. It starts wherever you put it, moves only when you
 * move it, and never goes backwards unless you explicitly set it back.
 */
export class FakeClock implements Clock {
  private currentMs: number;
  private readonly listeners = new Set<ClockListener>();

  constructor(start: string | number | Date = '2026-08-04T12:00:00.000Z') {
    this.currentMs = FakeClock.toMs(start);
  }

  private static toMs(value: string | number | Date): number {
    if (typeof value === 'number') {
      return value;
    }
    const parsed = typeof value === 'string' ? new DateCtor(value) : value;
    const ms = parsed.getTime();
    if (Number.isNaN(ms)) {
      throw new RangeError('FAKE_CLOCK_INVALID_START');
    }
    return ms;
  }

  now(): Date {
    return new DateCtor(this.currentMs);
  }

  /** The current instant as an ISO 8601 string with a `Z` offset. */
  iso(): string {
    return this.now().toISOString();
  }

  epochMs(): number {
    return this.currentMs;
  }

  epochSeconds(): number {
    return Math.floor(this.currentMs / SECOND_MS);
  }

  set(instant: string | number | Date): void {
    this.currentMs = FakeClock.toMs(instant);
    this.notify();
  }

  advance(milliseconds: number): void {
    this.currentMs += milliseconds;
    this.notify();
  }

  advanceSeconds(seconds: number): void {
    this.advance(seconds * SECOND_MS);
  }

  advanceMinutes(minutes: number): void {
    this.advance(minutes * MINUTE_MS);
  }

  advanceHours(hours: number): void {
    this.advance(hours * HOUR_MS);
  }

  advanceDays(days: number): void {
    this.advance(days * DAY_MS);
  }

  /** Move to `instant`, refusing to travel backwards by accident. */
  advanceTo(instant: string | number | Date): void {
    const target = FakeClock.toMs(instant);
    if (target < this.currentMs) {
      throw new RangeError('FAKE_CLOCK_CANNOT_MOVE_BACKWARDS');
    }
    this.currentMs = target;
    this.notify();
  }

  /** Run `listener` whenever the clock moves. Used to drive fake schedulers. */
  onTick(listener: ClockListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const instant = this.now();
    for (const listener of this.listeners) {
      listener(instant);
    }
  }
}

/** A clock that never moves. Useful for pure derivations. */
export function frozenClock(instant: string): Clock {
  const fixed = new DateCtor(instant);
  if (Number.isNaN(fixed.getTime())) {
    throw new RangeError('FAKE_CLOCK_INVALID_START');
  }
  return {
    now(): Date {
      return new DateCtor(fixed.getTime());
    },
  };
}

/**
 * A clock that advances by a fixed step on every read. Handy for asserting
 * that code records a duration without depending on real elapsed time.
 */
export function steppingClock(start: string, stepMs: number): Clock {
  let current = new DateCtor(start).getTime();
  return {
    now(): Date {
      const value = new DateCtor(current);
      current += stepMs;
      return value;
    },
  };
}
