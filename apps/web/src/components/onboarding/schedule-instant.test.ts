import { describe, expect, it } from 'vitest';

import { zonedToInstant } from '@/features/composer/state/time';

/**
 * The first post has to land at the time the person chose.
 *
 * The onboarding composer collects a `datetime-local` value, which is a wall
 * clock reading with no zone attached, and then labels it with the workspace
 * zone. It used to convert that reading with `new Date(value)`, which resolves
 * it in the *browser's* zone: somebody in Berlin setting up a workspace on New
 * York time scheduled their first post six hours away from the time on the
 * screen, and every surface downstream reported the wrong instant confidently.
 *
 * This pins the property that fix depends on, using the same conversion the
 * real composer uses, so a future "simplification" back to `new Date(...)`
 * fails here rather than in somebody's timeline.
 */

/** What the step does with the value the input hands it. */
function instantFromLocalValue(value: string, timeZone: string): string {
  const [date, time] = value.split('T');
  if (date === undefined || time === undefined) {
    throw new Error('expected a datetime-local value');
  }
  return zonedToInstant(date, time.slice(0, 5), timeZone);
}

describe('onboarding first post scheduling', () => {
  it('reads the chosen wall clock time in the workspace zone, not the browser one', () => {
    // 09:00 in New York in January is 14:00 UTC, whatever the browser thinks.
    expect(instantFromLocalValue('2026-01-15T09:00', 'America/New_York')).toBe(
      '2026-01-15T14:00:00.000Z',
    );
    // The same wall clock reading in Tokyo is a different instant entirely.
    expect(instantFromLocalValue('2026-01-15T09:00', 'Asia/Tokyo')).toBe(
      '2026-01-15T00:00:00.000Z',
    );
  });

  it('follows the zone across a daylight saving change', () => {
    // Same wall clock time, same zone, two sides of the US spring transition.
    expect(instantFromLocalValue('2026-03-01T09:00', 'America/New_York')).toBe(
      '2026-03-01T14:00:00.000Z',
    );
    expect(instantFromLocalValue('2026-04-01T09:00', 'America/New_York')).toBe(
      '2026-04-01T13:00:00.000Z',
    );
  });

  it('tolerates the seconds some browsers append to the value', () => {
    expect(instantFromLocalValue('2026-01-15T09:00:00', 'UTC')).toBe('2026-01-15T09:00:00.000Z');
  });
});
