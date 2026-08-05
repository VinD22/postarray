import { describe, expect, it } from 'vitest';

import { findMetric, normalizeMetrics, presentMetrics, unavailableByReason } from './normalize.js';
import { HASH } from './test-support.js';

const BASE = {
  observedAt: '2026-08-04T09:00:00Z',
  rawProviderPayloadHash: HASH,
} as const;

describe('normalizeMetrics', () => {
  it('preserves the provider field, definition, unit and denominator', () => {
    const metrics = normalizeMetrics({
      ...BASE,
      provider: 'linkedin',
      scope: 'post',
      raw: { impressionCount: 1200, clickCount: 40 },
      metrics: ['impressions', 'link_clicks'],
    });

    const impressions = findMetric(metrics, 'impressions');
    expect(impressions?.providerField).toBe('impressionCount');
    expect(impressions?.observation.value).toBe(1200);
    expect(impressions?.definition.definition.length).toBeGreaterThan(0);
    expect(impressions?.definition.unit).toBe('count');

    const clicks = findMetric(metrics, 'link_clicks');
    expect(clicks?.definition.denominator).toBe('impressions');
  });

  it('keeps the raw provider value alongside the normalized one', () => {
    const metrics = normalizeMetrics({
      ...BASE,
      provider: 'youtube',
      scope: 'post',
      raw: { estimatedMinutesWatched: 10 },
      metrics: ['watch_time'],
      grantedPermissions: ['yt-analytics.readonly'],
    });

    const watchTime = findMetric(metrics, 'watch_time');
    expect(watchTime?.rawValue).toBe(10);
    expect(watchTime?.observation.value).toBe(600);
    expect(watchTime?.observation.unit).toBe('seconds');
  });

  it('reports a missing metric as unavailable_pending with a null value', () => {
    const metrics = normalizeMetrics({
      ...BASE,
      provider: 'linkedin',
      scope: 'post',
      raw: {},
      metrics: ['impressions'],
    });

    const impressions = findMetric(metrics, 'impressions');
    expect(impressions?.observation.availability).toBe('unavailable_pending');
    expect(impressions?.observation.value).toBeNull();
    expect(impressions?.reasonKey).toBe('analytics.value.unavailableReason.tooEarly');
  });

  it('never turns an unavailable metric into zero', () => {
    const metrics = normalizeMetrics({
      ...BASE,
      provider: 'linkedin',
      scope: 'post',
      raw: {},
    });

    for (const metric of metrics) {
      if (metric.observation.availability !== 'available') {
        expect(metric.observation.value).toBeNull();
        expect(metric.observation.value).not.toBe(0);
      }
    }
    expect(presentMetrics(metrics)).toHaveLength(0);
  });

  it('distinguishes a real zero from a missing value', () => {
    const metrics = normalizeMetrics({
      ...BASE,
      provider: 'linkedin',
      scope: 'post',
      raw: { likeCount: 0 },
      metrics: ['likes'],
    });

    const likes = findMetric(metrics, 'likes');
    expect(likes?.observation.availability).toBe('available');
    expect(likes?.observation.value).toBe(0);
  });

  it('reports a metric the provider does not offer as unavailable_provider', () => {
    const metrics = normalizeMetrics({
      ...BASE,
      provider: 'bluesky',
      scope: 'post',
      raw: { impressions: 999 },
      metrics: ['impressions'],
    });

    const impressions = findMetric(metrics, 'impressions');
    expect(impressions?.observation.availability).toBe('unavailable_provider');
    expect(impressions?.observation.value).toBeNull();
    expect(impressions?.reasonKey).toBe('analytics.value.unavailableReason.unsupported');
  });

  it('reports a metric this connection may not read as unavailable_permission', () => {
    const metrics = normalizeMetrics({
      ...BASE,
      provider: 'instagram',
      scope: 'post',
      raw: { reach: 500 },
      metrics: ['reach'],
      grantedPermissions: [],
    });

    const reach = findMetric(metrics, 'reach');
    expect(reach?.observation.availability).toBe('unavailable_permission');
    expect(reach?.observation.value).toBeNull();
    expect(reach?.reasonKey).toBe('analytics.value.unavailableReason.permission');
  });

  it('reads the metric once the permission is granted', () => {
    const metrics = normalizeMetrics({
      ...BASE,
      provider: 'instagram',
      scope: 'post',
      raw: { reach: 500 },
      metrics: ['reach'],
      grantedPermissions: ['instagram_manage_insights'],
    });

    expect(findMetric(metrics, 'reach')?.observation.value).toBe(500);
  });

  it('refuses a value that is not a finite number', () => {
    const metrics = normalizeMetrics({
      ...BASE,
      provider: 'linkedin',
      scope: 'post',
      raw: { impressionCount: 'not a number' },
      metrics: ['impressions'],
    });

    const impressions = findMetric(metrics, 'impressions');
    expect(impressions?.observation.value).toBeNull();
    expect(impressions?.rawValue).toBe('not a number');
  });

  it('accepts a numeric string, which several providers return', () => {
    const metrics = normalizeMetrics({
      ...BASE,
      provider: 'linkedin',
      scope: 'post',
      raw: { impressionCount: '1200' },
      metrics: ['impressions'],
    });

    expect(findMetric(metrics, 'impressions')?.observation.value).toBe(1200);
  });

  it('groups the reasons a reading is missing', () => {
    const metrics = normalizeMetrics({
      ...BASE,
      provider: 'instagram',
      scope: 'post',
      raw: {},
      grantedPermissions: [],
    });

    const grouped = unavailableByReason(metrics);
    expect(grouped.unavailable_permission.length).toBeGreaterThan(0);
    expect(grouped.unavailable_pending.length).toBeGreaterThan(0);
  });

  it('marks every mapping as needing re-verification against provider docs', () => {
    const metrics = normalizeMetrics({
      ...BASE,
      provider: 'x',
      scope: 'post',
      raw: { like_count: 3 },
      metrics: ['likes'],
    });

    expect(findMetric(metrics, 'likes')?.needsReverification).toBe(true);
  });
});
