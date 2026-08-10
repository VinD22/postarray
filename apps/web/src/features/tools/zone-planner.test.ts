import { describe, expect, it } from 'vitest';

import { PLANNER_ZONES, planZones, wallTimeToInstant } from './zone-planner';

describe('wall time to instant', () => {
  it('resolves a winter reading in a zone that observes daylight saving', () => {
    const instant = wallTimeToInstant('2026-01-15', '09:00', 'Europe/Berlin');
    expect(instant?.toISOString()).toBe('2026-01-15T08:00:00.000Z');
  });

  it('resolves a summer reading in the same zone one hour differently', () => {
    const instant = wallTimeToInstant('2026-07-15', '09:00', 'Europe/Berlin');
    expect(instant?.toISOString()).toBe('2026-07-15T07:00:00.000Z');
  });

  it('resolves a reading in a zone with a half hour offset', () => {
    const instant = wallTimeToInstant('2026-03-01', '18:30', 'Asia/Kolkata');
    expect(instant?.toISOString()).toBe('2026-03-01T13:00:00.000Z');
  });

  it('treats UTC as itself', () => {
    expect(wallTimeToInstant('2026-03-01', '00:00', 'UTC')?.toISOString()).toBe(
      '2026-03-01T00:00:00.000Z',
    );
  });

  it('returns null rather than a wrong answer for an incomplete form', () => {
    expect(wallTimeToInstant('', '09:00', 'UTC')).toBeNull();
    expect(wallTimeToInstant('2026-03-01', '', 'UTC')).toBeNull();
    expect(wallTimeToInstant('01/03/2026', '09:00', 'UTC')).toBeNull();
    expect(wallTimeToInstant('2026-03-01', '9:00', 'UTC')).toBeNull();
  });
});

describe('planning across zones', () => {
  it('describes one instant, not one wall time, in every row', () => {
    const instant = wallTimeToInstant('2026-01-15', '09:00', 'Europe/Berlin');
    const rows = planZones(instant ?? new Date(0), ['Europe/Berlin', 'Asia/Tokyo']);
    expect(new Set(rows.map((row) => row.instant.getTime())).size).toBe(1);
  });

  it('flags a zone whose offset changes within the next four weeks', () => {
    // Europe changes on the last Sunday in March, so mid March is inside the
    // window and the local hour of a weekly slot moves.
    const instant = wallTimeToInstant('2026-03-15', '09:00', 'Europe/London');
    const [row] = planZones(instant ?? new Date(0), ['Europe/London']);
    expect(row?.shifts).toBe(true);
  });

  it('leaves a zone with no transition in the window unflagged', () => {
    const instant = wallTimeToInstant('2026-03-15', '09:00', 'Europe/London');
    const [row] = planZones(instant ?? new Date(0), ['Asia/Tokyo']);
    expect(row?.shifts).toBe(false);
  });

  it('offers only zone identifiers the runtime accepts', () => {
    for (const zone of PLANNER_ZONES) {
      expect(() => new Intl.DateTimeFormat('en', { timeZone: zone }), zone).not.toThrow();
    }
  });
});
