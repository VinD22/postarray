import type { Clock } from '../types';

/** The real clock. The only place in the product allowed to call `Date.now`. */
export const systemClock: Clock = {
  now(): Date {
    return new Date();
  },
};

/**
 * A clock a test drives by hand. Scheduling, cadence budgets, quiet hours and
 * retry backoff are all time-sensitive, and none of them may be tested by
 * sleeping.
 */
export class FixedClock implements Clock {
  #instant: Date;

  constructor(instant: Date | string = '2026-08-04T09:00:00.000Z') {
    this.#instant = typeof instant === 'string' ? new Date(instant) : new Date(instant.getTime());
  }

  now(): Date {
    return new Date(this.#instant.getTime());
  }

  set(instant: Date | string): void {
    this.#instant = typeof instant === 'string' ? new Date(instant) : new Date(instant.getTime());
  }

  advance(milliseconds: number): void {
    this.#instant = new Date(this.#instant.getTime() + milliseconds);
  }
}
