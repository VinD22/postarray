import { describe, expect, it } from 'vitest';

import { DAY_MS, entriesWithin, homeWindowRange, hourFloor } from './home-window';

describe('home window', () => {
  it('floors to the hour so every read in the hour shares one key', () => {
    const a = homeWindowRange(Date.parse('2026-03-08T10:05:00Z'));
    const b = homeWindowRange(Date.parse('2026-03-08T10:59:59Z'));
    expect(a).toEqual(b);
    expect(a.from).toBe('2026-03-08T10:00:00.000Z');
    expect(hourFloor(Date.parse('2026-03-08T11:00:00Z'))).toBe(Date.parse('2026-03-08T11:00:00Z'));
  });

  it('derives the next 24 hours from the week', () => {
    const now = Date.parse('2026-03-08T10:30:00Z');
    const entries = [
      { scheduledAt: '2026-03-08T10:10:00Z' },
      { scheduledAt: '2026-03-08T12:00:00Z' },
      { scheduledAt: '2026-03-09T10:29:00Z' },
      { scheduledAt: '2026-03-10T09:00:00Z' },
      { scheduledAt: 'not a date' },
    ];
    expect(entriesWithin(entries, now, DAY_MS).map((e) => e.scheduledAt)).toEqual([
      '2026-03-08T12:00:00Z',
      '2026-03-09T10:29:00Z',
    ]);
  });
});
