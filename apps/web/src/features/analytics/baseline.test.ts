import { describe, expect, it } from 'vitest';

import {
  LEVEL_BAND,
  MINIMUM_BASELINE_SAMPLE,
  RELIABLE_BASELINE_SAMPLE,
  buildBaseline,
  byBaselineMovement,
  median,
} from './baseline';
import type { BaselinePost } from './types';

function posts(values: readonly number[]): BaselinePost[] {
  return values.map((value, index) => ({
    contentItemId: `post_${index}`,
    title: `Post ${index}`,
    publishedAt: `2026-07-${String(index + 1).padStart(2, '0')}T09:00:00Z`,
    value,
  }));
}

describe('median', () => {
  it('has no median for an empty sample', () => {
    expect(median([])).toBeNull();
  });

  it('takes the middle value of an odd sample', () => {
    expect(median([9, 1, 5])).toBe(5);
  });

  it('averages the two middle values of an even sample', () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });

  it('is not dragged by a single outlier the way a mean is', () => {
    const values = [100, 110, 120, 130, 100_000];
    expect(median(values)).toBe(120);
  });
});

describe('buildBaseline', () => {
  const base = {
    metric: 'impressions',
    format: 'text',
    excludedCount: 0,
    confounders: [],
  } as const;

  it('refuses to compare when the metric is unavailable', () => {
    expect(
      buildBaseline({ ...base, value: null, comparablePosts: posts([1, 2, 3, 4, 5, 6]) }),
    ).toBeNull();
  });

  it('refuses to compare below the minimum sample', () => {
    const tooFew = posts(Array.from({ length: MINIMUM_BASELINE_SAMPLE - 1 }, () => 100));
    expect(buildBaseline({ ...base, value: 200, comparablePosts: tooFew })).toBeNull();
  });

  it('refuses to compare against a zero median rather than dividing by it', () => {
    expect(
      buildBaseline({ ...base, value: 40, comparablePosts: posts([0, 0, 0, 0, 0, 0]) }),
    ).toBeNull();
  });

  it('reports the ratio against the median, not against the mean', () => {
    const comparison = buildBaseline({
      ...base,
      value: 1580,
      comparablePosts: posts([900, 950, 1000, 1050, 1100, 40_000]),
    });
    expect(comparison?.median).toBe(1025);
    expect(comparison?.direction).toBe('above');
    expect(comparison?.deltaRatio).toBeCloseTo(0.541, 3);
  });

  it('calls a difference inside the level band level', () => {
    const comparison = buildBaseline({
      ...base,
      value: 102,
      comparablePosts: posts([100, 100, 100, 100, 100, 100]),
    });
    expect(Math.abs(comparison?.deltaRatio ?? 1)).toBeLessThan(LEVEL_BAND);
    expect(comparison?.direction).toBe('level');
  });

  it('flags a small sample below the reliable threshold', () => {
    const small = buildBaseline({
      ...base,
      value: 200,
      comparablePosts: posts(Array.from({ length: MINIMUM_BASELINE_SAMPLE }, () => 100)),
    });
    const reliable = buildBaseline({
      ...base,
      value: 200,
      comparablePosts: posts(Array.from({ length: RELIABLE_BASELINE_SAMPLE }, () => 100)),
    });
    expect(small?.smallSample).toBe(true);
    expect(reliable?.smallSample).toBe(false);
  });

  it('keeps the excluded count and adds a confounder for it', () => {
    const comparison = buildBaseline({
      ...base,
      value: 200,
      excludedCount: 3,
      comparablePosts: posts([100, 100, 100, 100, 100, 100]),
    });
    expect(comparison?.excludedCount).toBe(3);
    expect(comparison?.confounders).toContain('provider_definition_change');
  });

  it('orders the cited posts newest first so the evidence reads chronologically', () => {
    const comparison = buildBaseline({
      ...base,
      value: 200,
      comparablePosts: posts([100, 110, 120, 130, 140, 150]),
    });
    const dates = comparison?.comparablePosts.map((post) => post.publishedAt) ?? [];
    expect(dates).toEqual([...dates].sort().reverse());
  });
});

describe('byBaselineMovement', () => {
  it('puts the largest movement first and rows without a comparison last', () => {
    const rows = [
      { id: 'level', baseline: null },
      {
        id: 'small',
        baseline: buildBaseline({
          metric: 'impressions',
          format: 'text',
          value: 110,
          excludedCount: 0,
          confounders: [],
          comparablePosts: posts([100, 100, 100, 100, 100, 100]),
        }),
      },
      {
        id: 'large',
        baseline: buildBaseline({
          metric: 'impressions',
          format: 'text',
          value: 400,
          excludedCount: 0,
          confounders: [],
          comparablePosts: posts([100, 100, 100, 100, 100, 100]),
        }),
      },
    ];
    expect([...rows].sort(byBaselineMovement).map((row) => row.id)).toEqual([
      'large',
      'small',
      'level',
    ]);
  });
});
