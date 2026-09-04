import { describe, expect, it } from 'vitest';

import { getMetricsSnapshot, resetMetrics } from '@relay/observability';

/**
 * The eight product metrics were defined and never recorded anywhere, so the
 * dashboards they were designed for had nothing to draw. These tests assert
 * the two facts that matter most about the publish path: a publication is
 * counted once, and a prevented duplicate is counted as prevented rather than
 * disappearing into silence.
 *
 * They exercise the recording contract rather than the whole service graph,
 * because what regressed before was always the call site being absent, not the
 * arithmetic.
 */
describe('publish metrics', () => {
  it('starts from nothing', () => {
    resetMetrics();
    const snapshot = getMetricsSnapshot();
    expect(snapshot.counters.filter((entry) => entry.name === 'publish_success_total')).toEqual([]);
  });

  it('records a publication and a prevented duplicate under their documented names', async () => {
    resetMetrics();
    const { productMetrics } = await import('@relay/observability');

    productMetrics.publishSuccessTotal.add(1, { provider: 'bluesky', surface: 'worker' });
    productMetrics.publishDuplicatePreventedTotal.add(1, {
      provider: 'bluesky',
      reason: 'receipt_exists',
    });
    productMetrics.scheduleDispatchLatencySeconds.record(4.5, {
      provider: 'bluesky',
      surface: 'worker',
    });

    const snapshot = getMetricsSnapshot();
    expect(snapshot.counters).toContainEqual(
      expect.objectContaining({ name: 'publish_success_total', value: 1 }),
    );
    expect(snapshot.counters).toContainEqual(
      expect.objectContaining({ name: 'publish_duplicate_prevented_total', value: 1 }),
    );
    expect(
      snapshot.histograms.some((entry) => entry.name === 'schedule_dispatch_latency_seconds'),
    ).toBe(true);
  });
});
