import { describe, expect, it } from 'vitest';

import { zonedToInstant } from './time.js';

/**
 * A schedule computed in the browser's zone is a publishing incident, so the
 * conversion always goes through the zone the user picked.
 */
describe('zonedToInstant', () => {
  it('converts a summer time local time in Berlin to the right instant', () => {
    expect(zonedToInstant('2026-08-06', '09:30', 'Europe/Berlin')).toBe(
      '2026-08-06T07:30:00.000Z',
    );
  });

  it('converts a winter time local time in Berlin to the right instant', () => {
    expect(zonedToInstant('2026-12-06', '09:30', 'Europe/Berlin')).toBe(
      '2026-12-06T08:30:00.000Z',
    );
  });

  it('keeps the local hour across the October transition', () => {
    expect(zonedToInstant('2026-10-25', '09:30', 'Europe/Berlin')).toBe(
      '2026-10-25T08:30:00.000Z',
    );
  });

  it('treats UTC as a zone like any other', () => {
    expect(zonedToInstant('2026-08-06', '09:30', 'UTC')).toBe('2026-08-06T09:30:00.000Z');
  });
});
