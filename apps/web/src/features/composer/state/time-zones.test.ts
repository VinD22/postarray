import { describe, expect, it } from 'vitest';

import { reZoneInstant, timeZoneOptions } from './time-zones';

describe('timeZoneOptions', () => {
  it('lists the full IANA set with UTC and pinned zones, without duplicates', () => {
    const zones = timeZoneOptions(['Europe/Berlin', 'Europe/Berlin']);
    expect(zones.length).toBeGreaterThan(100);
    expect(zones).toContain('UTC');
    expect(zones).toContain('America/New_York');
    expect(zones.filter((zone) => zone === 'Europe/Berlin')).toHaveLength(1);
  });
});

describe('reZoneInstant', () => {
  it('keeps the wall-clock time when the zone changes', () => {
    // 09:00 in Berlin (CEST, +02:00) moved to New York (EDT, -04:00).
    expect(reZoneInstant('2026-06-01T07:00:00.000Z', 'Europe/Berlin', 'America/New_York')).toBe(
      '2026-06-01T13:00:00.000Z',
    );
  });
});
