/**
 * The stat row's two decisions.
 *
 * Both are the reason Home was allowed to have counters at all, so both are
 * pure functions with tests rather than ternaries buried in JSX.
 */

import { describe, expect, it } from 'vitest';

import { readingFor, soonestEntry } from './stat-tiles';

describe('readingFor', () => {
  it('is a count when the read succeeded, including when the count is zero', () => {
    expect(readingFor({ isError: false, count: 0 })).toEqual({ kind: 'count', count: 0 });
    expect(readingFor({ isError: false, count: 4 })).toEqual({ kind: 'count', count: 4 });
  });

  it('is unavailable when the read failed, and never zero', () => {
    // The whole house rule in one assertion: a number we cannot read is not
    // the number nought. Nought is a fact about the workspace.
    expect(readingFor({ isError: true, count: 0 })).toEqual({ kind: 'unavailable' });
    expect(readingFor({ isError: true, count: 9 })).toEqual({ kind: 'unavailable' });
  });
});

describe('soonestEntry', () => {
  const at = (iso: string) => ({ scheduledAt: iso });

  it('is null for an empty week', () => {
    expect(soonestEntry([])).toBeNull();
  });

  it('takes the minimum rather than the first element', () => {
    const later = at('2026-08-12T18:00:00.000Z');
    const sooner = at('2026-08-12T09:00:00.000Z');
    expect(soonestEntry([later, sooner])).toBe(sooner);
  });

  it('skips an entry whose instant does not parse instead of letting it win', () => {
    const broken = at('not-an-instant');
    const real = at('2026-08-12T09:00:00.000Z');
    expect(soonestEntry([broken, real])).toBe(real);
    expect(soonestEntry([broken])).toBeNull();
  });
});
