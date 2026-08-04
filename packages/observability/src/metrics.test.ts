import { beforeEach, describe, expect, it } from 'vitest';

import {
  PRODUCT_METRICS,
  getCounter,
  getHistogram,
  getMetricsSnapshot,
  productMetrics,
  resetMetrics,
  sanitizeAttributes,
  timeIt,
} from './metrics.js';

beforeEach(() => {
  resetMetrics();
});

describe('PRODUCT_METRICS', () => {
  it('names every metric from the observability specification', () => {
    const names = Object.values(PRODUCT_METRICS).map((definition) => definition.name);
    expect(names).toEqual([
      'publish_success_total',
      'publish_duplicate_prevented_total',
      'schedule_dispatch_latency_seconds',
      'token_refresh_failures_total',
      'webhook_delivery_lag_seconds',
      'analytics_freshness_seconds',
      'ai_request_cost_usd',
      'provider_cost_usd',
    ]);
  });
});

describe('counters', () => {
  it('accumulates per attribute set', () => {
    productMetrics.publishSuccessTotal.add(1, { provider: 'x' });
    productMetrics.publishSuccessTotal.add(1, { provider: 'x' });
    productMetrics.publishSuccessTotal.add(1, { provider: 'linkedin' });

    const counters = getMetricsSnapshot().counters;
    expect(counters).toHaveLength(2);
    expect(counters.find((sample) => sample.attributes['provider'] === 'x')?.value).toBe(2);
    expect(counters.find((sample) => sample.attributes['provider'] === 'linkedin')?.value).toBe(1);
  });

  it('defaults to one', () => {
    productMetrics.publishDuplicatePreventedTotal.add();
    expect(getMetricsSnapshot().counters[0]?.value).toBe(1);
  });

  it('ignores a non finite value', () => {
    productMetrics.tokenRefreshFailuresTotal.add(Number.NaN, { provider: 'x' });
    expect(getMetricsSnapshot().counters).toHaveLength(0);
  });

  it('treats attribute order as irrelevant', () => {
    productMetrics.publishSuccessTotal.add(1, { provider: 'x', surface: 'api' });
    productMetrics.publishSuccessTotal.add(1, { surface: 'api', provider: 'x' });
    expect(getMetricsSnapshot().counters).toHaveLength(1);
    expect(getMetricsSnapshot().counters[0]?.value).toBe(2);
  });
});

describe('histograms', () => {
  it('keeps count, sum, min and max', () => {
    productMetrics.scheduleDispatchLatencySeconds.record(2, { provider: 'x' });
    productMetrics.scheduleDispatchLatencySeconds.record(6, { provider: 'x' });
    productMetrics.scheduleDispatchLatencySeconds.record(4, { provider: 'x' });

    const sample = getMetricsSnapshot().histograms[0];
    expect(sample?.count).toBe(3);
    expect(sample?.sum).toBe(12);
    expect(sample?.min).toBe(2);
    expect(sample?.max).toBe(6);
  });

  it('records provider and AI cost separately', () => {
    productMetrics.aiRequestCostUsd.record(0.004, { model: 'deepseek-v4-flash' });
    productMetrics.providerCostUsd.record(0.2, { provider: 'x', operation: 'post_with_url' });

    const names = getMetricsSnapshot().histograms.map((sample) => sample.name);
    expect(names).toContain('ai_request_cost_usd');
    expect(names).toContain('provider_cost_usd');
  });
});

describe('sanitizeAttributes', () => {
  it('drops any attribute whose name looks like a secret', () => {
    expect(sanitizeAttributes({ provider: 'x', accessToken: 'abc', apiKey: 'def' })).toEqual({
      provider: 'x',
    });
  });

  it('keeps numbers and booleans', () => {
    expect(sanitizeAttributes({ attempt: 2, retried: true })).toEqual({
      attempt: 2,
      retried: true,
    });
  });
});

describe('ad hoc instruments', () => {
  it('records under an arbitrary name', () => {
    getCounter('custom_total').add(3);
    getHistogram('custom_seconds', 's').record(1.5);

    const snapshot = getMetricsSnapshot();
    expect(snapshot.counters[0]?.name).toBe('custom_total');
    expect(snapshot.histograms[0]?.name).toBe('custom_seconds');
  });
});

describe('timeIt', () => {
  it('records a duration when the work succeeds', async () => {
    const result = await timeIt(
      productMetrics.scheduleDispatchLatencySeconds,
      { provider: 'fake' },
      () => 'done',
    );
    expect(result).toBe('done');
    expect(getMetricsSnapshot().histograms[0]?.count).toBe(1);
  });

  it('records a duration when the work throws, and rethrows', async () => {
    await expect(
      timeIt(productMetrics.scheduleDispatchLatencySeconds, { provider: 'fake' }, () => {
        throw new Error('boom');
      }),
    ).rejects.toThrow('boom');
    expect(getMetricsSnapshot().histograms[0]?.count).toBe(1);
  });
});

describe('resetMetrics', () => {
  it('empties the snapshot', () => {
    productMetrics.publishSuccessTotal.add(1, { provider: 'x' });
    resetMetrics();
    expect(getMetricsSnapshot()).toEqual({ counters: [], histograms: [] });
  });
});
