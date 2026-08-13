import { buildDigestRetrieval } from './retrieval';
import type { DigestRetrieval, DigestRetrievalInput } from './retrieval';
import type { DigestMetricInput, DigestReceipt, FreshnessReportLike } from './types';

/**
 * Test scaffolding for the digest. Colocated with the tests, not exported from
 * the package entry point.
 */

export const TEST_WORKSPACE_ID = 'ws_00000000000000000000000001';
export const TEST_WINDOW_START = '2026-08-03';
export const TEST_WINDOW_END = '2026-08-10';

export const NEVER_SYNCED: FreshnessReportLike = {
  label: 'never_synced',
  messageKey: 'analytics.value.unavailable',
  lastObservedAt: null,
  ageSeconds: null,
};

export function makeReceipt(overrides: Partial<DigestReceipt> = {}): DigestReceipt {
  return {
    receiptId: 'receipt_a',
    provider: 'mastodon',
    outcome: 'published',
    publishedAt: '2026-08-05T09:00:00Z',
    ...overrides,
  };
}

export function makeMetric(
  overrides: {
    readonly receiptId?: string;
    readonly normalizedName?: string;
    readonly value?: number | null;
    readonly availability?: string;
    readonly reason?: string | null;
    readonly reasonKey?: string | null;
  } = {},
): DigestMetricInput {
  return {
    receiptId: overrides.receiptId ?? 'receipt_a',
    metric: {
      observation: {
        normalizedName: overrides.normalizedName ?? 'impressions',
        provider: 'mastodon',
        value: overrides.value ?? null,
        unit: 'count',
        availability: overrides.availability ?? 'available',
        observedAt: '2026-08-06T09:00:00Z',
      },
      reason: overrides.reason ?? null,
      reasonKey: overrides.reasonKey ?? null,
    },
  };
}

/** The week-one shape: publications happened, nothing has been measured. */
export function makeReceiptsOnlyRetrieval(
  overrides: Partial<DigestRetrievalInput> = {},
): DigestRetrieval {
  return buildDigestRetrieval({
    workspaceId: TEST_WORKSPACE_ID,
    windowStart: TEST_WINDOW_START,
    windowEnd: TEST_WINDOW_END,
    receipts: [
      makeReceipt({ receiptId: 'receipt_a' }),
      makeReceipt({ receiptId: 'receipt_b', outcome: 'partial' }),
      makeReceipt({ receiptId: 'receipt_c', outcome: 'failed', provider: 'bluesky' }),
    ],
    metrics: [],
    baselines: [],
    freshness: NEVER_SYNCED,
    ...overrides,
  });
}
