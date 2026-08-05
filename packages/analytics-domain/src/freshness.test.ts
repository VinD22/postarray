import { describe, expect, it } from 'vitest';

import { computeCoverage, computeFreshness, markStaleMetrics } from './freshness';
import { normalizeMetrics } from './normalize';
import { HASH, makeObservation } from './test-support';

const NOW = new Date('2026-08-04T12:00:00Z');

function metricsFor(raw: Record<string, unknown>, observedAt = '2026-08-04T09:00:00Z') {
  return normalizeMetrics({
    provider: 'linkedin',
    scope: 'post',
    raw,
    observedAt,
    rawProviderPayloadHash: HASH,
    metrics: ['impressions'],
  });
}

describe('computeFreshness', () => {
  it('reports the age of the freshest reading', () => {
    const report = computeFreshness({
      observations: [
        makeObservation({ observedAt: '2026-08-04T09:00:00Z' }),
        makeObservation({ observedAt: '2026-08-04T11:00:00Z' }),
      ],
      now: NOW,
    });

    expect(report.label).toBe('fresh');
    expect(report.lastObservedAt).toBe('2026-08-04T11:00:00Z');
    expect(report.ageSeconds).toBe(3600);
    expect(report.messageKey).toBe('analytics.freshness.synced');
  });

  it('labels an old reading stale rather than hiding it', () => {
    const report = computeFreshness({
      observations: [makeObservation({ observedAt: '2026-08-03T09:00:00Z' })],
      now: NOW,
    });

    expect(report.label).toBe('stale');
    expect(report.messageKey).toBe('analytics.freshness.stale');
  });

  it('says never synced when there is nothing at all', () => {
    const report = computeFreshness({ observations: [], now: NOW });
    expect(report.label).toBe('never_synced');
    expect(report.ageSeconds).toBeNull();
    expect(report.lastObservedAt).toBeNull();
  });
});

describe('computeCoverage', () => {
  it('counts how many posts in the range have a usable reading', () => {
    const report = computeCoverage({
      metric: 'impressions',
      perPost: [
        { receiptId: 'receipt_1', metrics: metricsFor({ impressionCount: 100 }) },
        { receiptId: 'receipt_2', metrics: metricsFor({ impressionCount: 200 }) },
        { receiptId: 'receipt_3', metrics: metricsFor({}) },
      ],
    });

    expect(report.total).toBe(3);
    expect(report.covered).toBe(2);
    expect(report.ratio).toBeCloseTo(2 / 3);
    expect(report.missingByReason.unavailable_pending).toEqual(['receipt_3']);
    expect(report.messageKey).toBe('analytics.freshness.coverage');
  });

  it('returns a null ratio for an empty range rather than a misleading one', () => {
    const report = computeCoverage({ metric: 'impressions', perPost: [] });
    expect(report.ratio).toBeNull();
    expect(report.covered).toBe(0);
  });

  it('counts a real zero as covered', () => {
    const report = computeCoverage({
      metric: 'impressions',
      perPost: [{ receiptId: 'receipt_1', metrics: metricsFor({ impressionCount: 0 }) }],
    });

    expect(report.covered).toBe(1);
    expect(report.ratio).toBe(1);
  });
});

describe('markStaleMetrics', () => {
  it('drops the value and keeps the row so the UI can explain it', () => {
    const stale = markStaleMetrics(
      metricsFor({ impressionCount: 100 }, '2026-08-01T09:00:00Z'),
      NOW,
    );

    expect(stale[0]?.observation.availability).toBe('unavailable_stale');
    expect(stale[0]?.observation.value).toBeNull();
    expect(stale[0]?.reasonKey).toBe('analytics.value.unavailableReason.syncFailed');
    expect(stale[0]?.observation.normalizedName).toBe('impressions');
  });

  it('leaves a fresh reading alone', () => {
    const fresh = markStaleMetrics(metricsFor({ impressionCount: 100 }), NOW);
    expect(fresh[0]?.observation.availability).toBe('available');
    expect(fresh[0]?.observation.value).toBe(100);
  });

  it('never turns a stale reading into zero', () => {
    const stale = markStaleMetrics(
      metricsFor({ impressionCount: 100 }, '2026-08-01T09:00:00Z'),
      NOW,
    );
    expect(stale[0]?.observation.value).not.toBe(0);
  });
});
