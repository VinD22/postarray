import { describe, expect, it } from 'vitest';

import { previousPeriod } from './period';

describe('previousPeriod', () => {
  it('is the same length, ending where this one starts', () => {
    const previous = previousPeriod({
      preset: '7d',
      start: '2026-03-08T00:00:00.000Z',
      end: '2026-03-15T00:00:00.000Z',
    });

    expect(previous.end).toBe('2026-03-08T00:00:00.000Z');
    expect(previous.start).toBe('2026-03-01T00:00:00.000Z');
  });

  it('follows the length the reader chose, not a fixed month', () => {
    // A 90 day window compares against 90 days. Comparing it against 30 would
    // report a threefold fall that never happened.
    const previous = previousPeriod({
      preset: '90d',
      start: '2026-03-01T00:00:00.000Z',
      end: '2026-05-30T00:00:00.000Z',
    });
    expect(Date.parse(previous.end) - Date.parse(previous.start)).toBe(
      Date.parse('2026-05-30T00:00:00.000Z') - Date.parse('2026-03-01T00:00:00.000Z'),
    );
  });

  it('keeps its length across a daylight-saving transition', () => {
    // Late March in Europe. UTC arithmetic means the window is still exactly
    // seven days rather than seven days less an hour.
    const previous = previousPeriod({
      preset: '7d',
      start: '2026-03-29T00:00:00.000Z',
      end: '2026-04-05T00:00:00.000Z',
    });
    expect(Date.parse(previous.end) - Date.parse(previous.start)).toBe(7 * 86_400_000);
  });

  it('stops being a preset, because it no longer is one', () => {
    expect(
      previousPeriod({
        preset: '30d',
        start: '2026-03-01T00:00:00.000Z',
        end: '2026-03-31T00:00:00.000Z',
      }).preset,
    ).toBe('custom');
  });

  it('does not invent a window from an unusable range', () => {
    const same = previousPeriod({ preset: 'custom', start: 'nope', end: 'nope' });
    expect(same.start).toBe('nope');
  });
});
