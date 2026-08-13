import { describe, expect, it } from 'vitest';

import { createDisabledProvider } from '../providers/disabled';
import { TEST_CALL_CONTEXT, createTestGateway } from '../test-support';
import { DIGEST_FLOOR_KEYS } from './floor';
import { generateWeeklyDigest } from './pipeline';
import { buildDigestRetrieval } from './retrieval';
import {
  NEVER_SYNCED,
  TEST_WINDOW_END,
  TEST_WINDOW_START,
  TEST_WORKSPACE_ID,
  makeReceipt,
  makeReceiptsOnlyRetrieval,
} from './testing';

/**
 * A retrieval whose receipt ids match the shipped `receipts-only-no-metrics`
 * fixture, so the echo provider's canned answer is one this workspace's data
 * actually supports.
 */
function fixtureShapedRetrieval() {
  return buildDigestRetrieval({
    workspaceId: TEST_WORKSPACE_ID,
    windowStart: TEST_WINDOW_START,
    windowEnd: TEST_WINDOW_END,
    receipts: [
      makeReceipt({ receiptId: 'r1' }),
      makeReceipt({ receiptId: 'r2' }),
      makeReceipt({ receiptId: 'r3', outcome: 'partial' }),
    ],
    metrics: [],
    baselines: [],
    freshness: NEVER_SYNCED,
  });
}

describe('generateWeeklyDigest', () => {
  it('produces a digest with the AI provider disabled', async () => {
    const { gateway } = createTestGateway({ provider: createDisabledProvider() });

    const result = await generateWeeklyDigest({
      gateway,
      callContext: TEST_CALL_CONTEXT,
      retrieval: makeReceiptsOnlyRetrieval(),
    });

    expect(result.source).toBe('deterministic');
    expect(result.fallbackReason).toBe('ai_disabled');
    expect(result.narrative).toBeNull();
    expect(result.rows.length).toBeGreaterThan(0);
    // The week is still described: outcomes, the missing metrics, the freshness.
    const keys = result.rows.map((row) => row.messageKey);
    expect(keys).toContain(DIGEST_FLOOR_KEYS.outcomePublished);
    expect(keys).toContain(DIGEST_FLOOR_KEYS.outcomePartial);
    expect(keys).toContain(DIGEST_FLOOR_KEYS.noMetricsYet);
    expect(keys).toContain(DIGEST_FLOOR_KEYS.freshness);
    expect(result.rows.every((row) => !row.isNarrative)).toBe(true);
  });

  it('keeps the floor underneath an accepted narrative', async () => {
    const { gateway } = createTestGateway();

    const result = await generateWeeklyDigest({
      gateway,
      callContext: TEST_CALL_CONTEXT,
      retrieval: fixtureShapedRetrieval(),
    });

    expect(result.source).toBe('ai');
    expect(result.narrative).not.toBeNull();
    expect(result.promptVersion).toBe('2026-08-12.1');
    expect(result.rows.some((row) => row.isNarrative)).toBe(true);
    expect(result.rows.some((row) => row.messageKey === DIGEST_FLOOR_KEYS.outcomePartial)).toBe(
      true,
    );
  });

  it('falls back to the floor when the audit rejects the generation', async () => {
    const { gateway } = createTestGateway();

    // The canned answer cites r1/r2/r3, which this workspace never published.
    const result = await generateWeeklyDigest({
      gateway,
      callContext: TEST_CALL_CONTEXT,
      retrieval: makeReceiptsOnlyRetrieval(),
    });

    expect(result.source).toBe('deterministic');
    expect(result.fallbackReason).toBe('audit_rejected');
    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.rows.every((row) => !row.isNarrative)).toBe(true);
  });
});
