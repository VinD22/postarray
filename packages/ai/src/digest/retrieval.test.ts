import { describe, expect, it } from 'vitest';

import { buildDigestRetrieval } from './retrieval';
import {
  NEVER_SYNCED,
  TEST_WINDOW_END,
  TEST_WINDOW_START,
  TEST_WORKSPACE_ID,
  makeMetric,
  makeReceipt,
  makeReceiptsOnlyRetrieval,
} from './testing';

describe('buildDigestRetrieval', () => {
  it('keeps partial publications as their own outcome', () => {
    const retrieval = makeReceiptsOnlyRetrieval();

    expect(retrieval.totals).toEqual({ published: 1, partial: 1, failed: 1 });
    const mastodon = retrieval.perProvider.find((entry) => entry.provider === 'mastodon');
    expect(mastodon).toMatchObject({ published: 1, partial: 1, failed: 0 });
  });

  it('reports the receipts-only week without inventing a metric', () => {
    const retrieval = makeReceiptsOnlyRetrieval();

    expect(retrieval.hasNoMetrics).toBe(true);
    expect(retrieval.metricLines).toEqual([]);
    expect(retrieval.variables.metricRows).toEqual([]);
  });

  it('keeps an unavailable metric distinguishable from a present one', () => {
    const retrieval = buildDigestRetrieval({
      workspaceId: TEST_WORKSPACE_ID,
      windowStart: TEST_WINDOW_START,
      windowEnd: TEST_WINDOW_END,
      receipts: [makeReceipt()],
      metrics: [
        makeMetric({ value: 1200 }),
        makeMetric({
          receiptId: 'receipt_b',
          normalizedName: 'saves',
          availability: 'unavailable_permission',
          reason: 'unavailable_permission',
          reasonKey: 'analytics.value.unavailableReason.permission',
        }),
      ],
      baselines: [],
      freshness: NEVER_SYNCED,
    });

    expect(retrieval.metricLines).toHaveLength(1);
    expect(retrieval.unavailable).toEqual([
      {
        metric: 'saves',
        provider: 'mastodon',
        reason: 'unavailable_permission',
        reasonKey: 'analytics.value.unavailableReason.permission',
        receiptIds: ['receipt_b'],
      },
    ]);
    // Unavailable never becomes a zero row the model could restate as a fact.
    expect(retrieval.allowedNumbers.has(1200)).toBe(true);
  });

  it('rejects a malformed window rather than guessing one', () => {
    expect(() =>
      buildDigestRetrieval({
        workspaceId: TEST_WORKSPACE_ID,
        windowStart: 'last week',
        windowEnd: TEST_WINDOW_END,
        receipts: [],
        metrics: [],
        baselines: [],
        freshness: NEVER_SYNCED,
      }),
    ).toThrowError();
  });
});
