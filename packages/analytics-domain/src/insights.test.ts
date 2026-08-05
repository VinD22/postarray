import { describe, expect, it } from 'vitest';

import { compareToTrailingMedian } from './baseline';
import {
  buildBaselineInsights,
  buildNextTestInsight,
  buildUnavailabilityInsights,
  compareAcrossPlatforms,
} from './insights';
import { normalizeMetrics } from './normalize';
import { HASH, makeHistory, makeObserved } from './test-support';

function codes(insights: readonly { code: string }[]): string[] {
  return insights.map((entry) => entry.code);
}

describe('buildBaselineInsights', () => {
  it('states the direction with evidence and always adds the causation caveat', () => {
    const result = compareToTrailingMedian({
      metric: 'impressions',
      subject: makeObserved(2000),
      history: makeHistory(Array.from({ length: 10 }, () => 1000)),
    });
    const insights = buildBaselineInsights(result);

    expect(codes(insights)).toContain('ABOVE_BASELINE');
    expect(codes(insights)).toContain('NO_CAUSATION');
    const observation = insights.find((entry) => entry.code === 'ABOVE_BASELINE');
    expect(observation?.messageKey).toBe('analytics.feedback.aboveBaseline');
    expect(observation?.params['percent']).toBe('100%');
    expect(observation?.evidenceIds.length).toBe(10);
    expect(observation?.confidence).toBe('medium');
  });

  it('hedges when the sample is small', () => {
    const result = compareToTrailingMedian({
      metric: 'impressions',
      subject: makeObserved(2000),
      history: makeHistory([1000, 1000, 1000, 1000, 1000]),
    });
    const insights = buildBaselineInsights(result);

    expect(codes(insights)).toContain('SMALL_SAMPLE');
    const observation = insights.find((entry) => entry.code === 'ABOVE_BASELINE');
    expect(observation?.confidence).toBe('low');
    const hedge = insights.find((entry) => entry.code === 'SMALL_SAMPLE');
    expect(hedge?.messageKey).toBe('analytics.feedback.smallSample');
  });

  it('says formats are not comparable rather than producing a number', () => {
    const result = compareToTrailingMedian({
      metric: 'impressions',
      subject: makeObserved(2000, { contentKind: 'video' }),
      history: makeHistory([1000, 1000, 1000, 1000, 1000], 'impressions', {
        contentKind: 'image',
      }),
    });
    const insights = buildBaselineInsights(result);

    expect(insights).toHaveLength(1);
    expect(insights[0]?.messageKey).toBe('analytics.feedback.notComparableFormats');
    expect(codes(insights)).not.toContain('ABOVE_BASELINE');
  });

  it('says the metric is unavailable rather than reporting a change', () => {
    const result = compareToTrailingMedian({
      metric: 'impressions',
      subject: makeObserved(null),
      history: makeHistory([1000, 1000, 1000, 1000, 1000]),
    });
    const insights = buildBaselineInsights(result);

    expect(insights[0]?.messageKey).toBe('analytics.value.unavailable');
  });

  it('never emits an English literal, only message keys', () => {
    const result = compareToTrailingMedian({
      metric: 'impressions',
      subject: makeObserved(2000),
      history: makeHistory(Array.from({ length: 10 }, () => 1000)),
    });

    for (const entry of buildBaselineInsights(result)) {
      expect(entry.messageKey).toMatch(/^analytics\./);
      expect(entry.messageKey).not.toContain(' ');
    }
  });
});

describe('buildUnavailabilityInsights', () => {
  it('explains each missing metric with its own reason key', () => {
    const metrics = normalizeMetrics({
      provider: 'instagram',
      scope: 'post',
      raw: {},
      observedAt: '2026-08-04T09:00:00Z',
      rawProviderPayloadHash: HASH,
      grantedPermissions: [],
      metrics: ['reach', 'likes'],
    });

    const insights = buildUnavailabilityInsights(metrics);
    const keys = insights.map((entry) => entry.messageKey);
    expect(keys).toContain('analytics.value.unavailableReason.permission');
    expect(keys).toContain('analytics.value.unavailableReason.tooEarly');
  });
});

describe('compareAcrossPlatforms', () => {
  it('requires one named metric and always carries the no score caveat', () => {
    const comparison = compareAcrossPlatforms({
      metric: 'likes',
      entries: [
        { provider: 'linkedin', connectionId: 'conn_1', value: 10 },
        { provider: 'x', connectionId: 'conn_2', value: 25 },
      ],
    });

    expect(comparison.rows).toHaveLength(2);
    expect(codes(comparison.caveats)).toContain('NO_UNIVERSAL_SCORE');
  });

  it('reports a platform that does not offer the metric as unavailable, not zero', () => {
    const comparison = compareAcrossPlatforms({
      metric: 'saves',
      entries: [
        { provider: 'instagram', connectionId: 'conn_1', value: 12 },
        { provider: 'youtube', connectionId: 'conn_2', value: 99 },
      ],
    });

    const youtube = comparison.rows.find((row) => row.provider === 'youtube');
    expect(youtube?.value).toBeNull();
    expect(codes(comparison.caveats)).toContain('METRIC_NOT_REPORTED');
  });

  it('labels a row whose provider defines the metric differently', () => {
    const comparison = compareAcrossPlatforms({
      metric: 'link_clicks',
      entries: [
        { provider: 'x', connectionId: 'conn_1', value: 10 },
        { provider: 'linkedin', connectionId: 'conn_2', value: 20 },
      ],
    });

    expect(comparison.rows.some((row) => row.definitionDiffers)).toBe(true);
    expect(codes(comparison.caveats)).toContain('DEFINITION_DIFFERS');
  });
});

describe('buildNextTestInsight', () => {
  it('proposes one controlled next step', () => {
    const insight = buildNextTestInsight('impressions', ['receipt_1']);
    expect(insight.kind).toBe('next_test');
    expect(insight.messageKey).toBe('analytics.feedback.nextTest');
    expect(insight.evidenceIds).toEqual(['receipt_1']);
  });
});
