import { describe, expect, it } from 'vitest';

import { compareToTrailingMedian, median } from './baseline.js';
import { makeHistory, makeObserved } from './test-support.js';

describe('median', () => {
  it('returns null for an empty set', () => {
    expect(median([])).toBeNull();
  });

  it('handles odd and even counts', () => {
    expect(median([3, 1, 2])).toBe(2);
    expect(median([4, 1, 3, 2])).toBe(2.5);
  });
});

describe('compareToTrailingMedian', () => {
  it('compares against the account own trailing median', () => {
    const result = compareToTrailingMedian({
      metric: 'impressions',
      subject: makeObserved(2000),
      history: makeHistory([1000, 1000, 1000, 1000, 1000]),
    });

    expect(result.outcome).toBe('compared');
    expect(result.medianValue).toBe(1000);
    expect(result.effectSize).toBe(1);
    expect(result.direction).toBe('above');
    expect(result.sampleSize).toBe(5);
    expect(result.comparedReceiptIds).toHaveLength(5);
  });

  it('reports a difference inside the noise band as similar', () => {
    const result = compareToTrailingMedian({
      metric: 'impressions',
      subject: makeObserved(1030),
      history: makeHistory([1000, 1000, 1000, 1000, 1000]),
    });

    expect(result.direction).toBe('similar');
  });

  it('flags a small sample rather than smoothing it away', () => {
    const result = compareToTrailingMedian({
      metric: 'impressions',
      subject: makeObserved(2000),
      history: makeHistory([1000, 1000, 1000, 1000, 1000]),
    });

    expect(result.smallSample).toBe(true);
    expect(result.confounders.map((entry) => entry.code)).toContain('SMALL_SAMPLE');
  });

  it('stops flagging a small sample once there are enough comparable posts', () => {
    const result = compareToTrailingMedian({
      metric: 'impressions',
      subject: makeObserved(2000),
      history: makeHistory(Array.from({ length: 10 }, () => 1000)),
    });

    expect(result.sampleSize).toBe(10);
    expect(result.smallSample).toBe(false);
    expect(result.confounders.map((entry) => entry.code)).not.toContain('SMALL_SAMPLE');
  });

  it('refuses to compare incompatible content kinds', () => {
    const result = compareToTrailingMedian({
      metric: 'impressions',
      subject: makeObserved(2000, { contentKind: 'video' }),
      history: makeHistory([1000, 1000, 1000, 1000, 1000], 'impressions', {
        contentKind: 'image',
      }),
    });

    expect(result.outcome).toBe('refused_incompatible_kinds');
    expect(result.effectSize).toBeNull();
    expect(result.medianValue).toBeNull();
    expect(result.confounders.map((entry) => entry.code)).toContain(
      'INCOMPATIBLE_CONTENT_KINDS',
    );
  });

  it('compares posts of the same kind on the same platform', () => {
    const result = compareToTrailingMedian({
      metric: 'impressions',
      subject: makeObserved(2000, { contentKind: 'short_video' }),
      history: makeHistory([1000, 1000, 1000, 1000, 1000], 'impressions', {
        contentKind: 'short_video',
      }),
    });

    expect(result.outcome).toBe('compared');
  });

  it('refuses when the subject reading is unavailable rather than reporting zero', () => {
    const result = compareToTrailingMedian({
      metric: 'impressions',
      subject: makeObserved(null),
      history: makeHistory([1000, 1000, 1000, 1000, 1000]),
    });

    expect(result.outcome).toBe('subject_unavailable');
    expect(result.subjectValue).toBeNull();
    expect(result.effectSize).toBeNull();
  });

  it('excludes history entries whose reading is unavailable', () => {
    const result = compareToTrailingMedian({
      metric: 'impressions',
      subject: makeObserved(2000),
      history: makeHistory([1000, null, 1000, null, 1000, 1000, 1000]),
    });

    expect(result.sampleSize).toBe(5);
    expect(result.excludedCount).toBe(2);
  });

  it('reports insufficient history rather than comparing against one post', () => {
    const result = compareToTrailingMedian({
      metric: 'impressions',
      subject: makeObserved(2000),
      history: makeHistory([1000]),
    });

    expect(result.outcome).toBe('insufficient_history');
    expect(result.medianValue).toBeNull();
    expect(result.confounders.map((entry) => entry.code)).toContain('SMALL_SAMPLE');
  });

  it('ignores posts from a different platform', () => {
    const result = compareToTrailingMedian({
      metric: 'impressions',
      subject: makeObserved(2000),
      history: makeHistory([1000, 1000, 1000, 1000, 1000], 'impressions', { provider: 'x' }),
    });

    expect(result.outcome).toBe('insufficient_history');
    expect(result.sampleSize).toBe(0);
  });

  it('notes when media presence differs across the compared posts', () => {
    const result = compareToTrailingMedian({
      metric: 'impressions',
      subject: makeObserved(2000, { hasMedia: true, contentKind: 'text' }),
      history: makeHistory([1000, 1000, 1000, 1000, 1000], 'impressions', { hasMedia: false }),
    });

    expect(result.confounders.map((entry) => entry.code)).toContain('MEDIA_PRESENCE_DIFFERS');
  });
});
