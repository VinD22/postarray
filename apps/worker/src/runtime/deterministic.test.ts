import { describe, expect, it } from 'vitest';

import {
  backoffMs,
  boundedInt,
  hashString,
  jitterMs,
  stableSort,
  unitInterval,
} from './deterministic.js';

describe('hashString', () => {
  it('is stable for the same input', () => {
    expect(hashString('publish:ws_1:job_1')).toBe(hashString('publish:ws_1:job_1'));
  });

  it('separates similar inputs', () => {
    expect(hashString('job_1')).not.toBe(hashString('job_2'));
  });

  it('returns an unsigned 32 bit integer', () => {
    const hash = hashString('anything at all');
    expect(Number.isInteger(hash)).toBe(true);
    expect(hash).toBeGreaterThanOrEqual(0);
    expect(hash).toBeLessThan(0x1_0000_0000);
  });
});

describe('unitInterval', () => {
  it('stays inside [0, 1)', () => {
    for (const seed of ['a', 'b', 'c', 'conn_1', 'conn_2', 'rss_9']) {
      const value = unitInterval(seed);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe('boundedInt', () => {
  it('stays inside the bound', () => {
    for (let index = 0; index < 50; index += 1) {
      expect(boundedInt(`seed-${String(index)}`, 7)).toBeLessThan(7);
      expect(boundedInt(`seed-${String(index)}`, 7)).toBeGreaterThanOrEqual(0);
    }
  });

  it('returns zero for a non positive bound', () => {
    expect(boundedInt('seed', 0)).toBe(0);
    expect(boundedInt('seed', -3)).toBe(0);
  });
});

describe('jitterMs', () => {
  it('is deterministic', () => {
    const first = jitterMs('conn_1', 60_000, { ratio: 0.2 });
    const second = jitterMs('conn_1', 60_000, { ratio: 0.2 });
    expect(first).toBe(second);
  });

  it('adds at most the configured ratio', () => {
    const value = jitterMs('conn_1', 60_000, { ratio: 0.2 });
    expect(value).toBeGreaterThanOrEqual(60_000);
    expect(value).toBeLessThanOrEqual(72_000);
  });

  it('spreads symmetric jitter around the base', () => {
    const value = jitterMs('conn_7', 60_000, { ratio: 0.2, symmetric: true });
    expect(value).toBeGreaterThanOrEqual(48_000);
    expect(value).toBeLessThanOrEqual(72_000);
  });

  it('never returns a negative delay', () => {
    expect(jitterMs('conn_1', 10, { ratio: 1, symmetric: true })).toBeGreaterThanOrEqual(0);
  });

  it('produces different values for different connections', () => {
    const values = new Set(
      ['conn_a', 'conn_b', 'conn_c', 'conn_d'].map((seed) =>
        jitterMs(seed, 900_000, { ratio: 0.3 }),
      ),
    );
    expect(values.size).toBeGreaterThan(1);
  });
});

describe('backoffMs', () => {
  it('grows exponentially and caps', () => {
    const options = { initialMs: 1_000, factor: 2, maxMs: 8_000 };
    expect(backoffMs('s', 1, options)).toBe(1_000);
    expect(backoffMs('s', 2, options)).toBe(2_000);
    expect(backoffMs('s', 3, options)).toBe(4_000);
    expect(backoffMs('s', 4, options)).toBe(8_000);
    expect(backoffMs('s', 9, options)).toBe(8_000);
  });

  it('treats attempt zero as the first attempt', () => {
    const options = { initialMs: 500, factor: 2, maxMs: 5_000 };
    expect(backoffMs('s', 0, options)).toBe(500);
  });

  it('is deterministic with jitter enabled', () => {
    const options = { initialMs: 1_000, factor: 2, maxMs: 60_000, jitterRatio: 0.5 };
    expect(backoffMs('whd_1', 3, options)).toBe(backoffMs('whd_1', 3, options));
  });
});

describe('stableSort', () => {
  it('orders by the derived key regardless of input order', () => {
    const items = [{ id: 'c' }, { id: 'a' }, { id: 'b' }];
    const sorted = stableSort(items, (item) => item.id).map((item) => item.id);
    expect(sorted).toEqual(['a', 'b', 'c']);
    const reversed = stableSort([...items].reverse(), (item) => item.id).map((item) => item.id);
    expect(reversed).toEqual(['a', 'b', 'c']);
  });

  it('does not mutate the input', () => {
    const items = [{ id: 'c' }, { id: 'a' }];
    stableSort(items, (item) => item.id);
    expect(items[0]?.id).toBe('c');
  });
});
