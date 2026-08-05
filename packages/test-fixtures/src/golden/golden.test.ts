import { describe, expect, it } from 'vitest';

import {
  capabilitySnapshotSchema,
  checksumPayload,
  computeChecksum,
  contentVersionSchema,
  growthPlanSchema,
  masterDraftSchema,
  metricObservationSchema,
  publicationReceiptSchema,
  publishJobSchema,
} from '@relay/contracts';

import {
  GOLDEN_ACCOUNT_METRICS,
  GOLDEN_CAPABILITY_SNAPSHOTS,
  GOLDEN_DRAFTS,
  GOLDEN_EXAMPLES,
  GOLDEN_GROWTH_PLAN,
  GOLDEN_PARTIAL_RECEIPT,
  GOLDEN_POST_METRICS,
  GOLDEN_RECEIPT,
  GOLDEN_SCHEDULED_JOB,
  GOLDEN_TEXT_DRAFT,
  GOLDEN_THREAD_RECEIPT,
  goldenContentVersion,
} from './index.js';

describe('golden examples', () => {
  it('every draft parses', () => {
    for (const [name, draft] of Object.entries(GOLDEN_DRAFTS)) {
      expect(() => masterDraftSchema.parse(draft), name).not.toThrow();
    }
  });

  it('every capability snapshot parses', () => {
    for (const [provider, snapshot] of Object.entries(GOLDEN_CAPABILITY_SNAPSHOTS)) {
      expect(() => capabilitySnapshotSchema.parse(snapshot), provider).not.toThrow();
    }
  });

  it('every receipt parses and carries external evidence', () => {
    for (const receipt of [GOLDEN_RECEIPT, GOLDEN_PARTIAL_RECEIPT, GOLDEN_THREAD_RECEIPT]) {
      expect(() => publicationReceiptSchema.parse(receipt)).not.toThrow();
      expect(receipt.externalPostId.length).toBeGreaterThan(0);
    }
  });

  it('the scheduled job parses and is not yet dispatched', () => {
    expect(() => publishJobSchema.parse(GOLDEN_SCHEDULED_JOB)).not.toThrow();
    expect(GOLDEN_SCHEDULED_JOB.state).toBe('scheduled');
    expect(GOLDEN_SCHEDULED_JOB.attemptCount).toBe(0);
  });

  it('every metric observation parses', () => {
    for (const observation of [...GOLDEN_POST_METRICS, ...GOLDEN_ACCOUNT_METRICS]) {
      expect(() => metricObservationSchema.parse(observation)).not.toThrow();
    }
  });

  it('the growth plan parses and has all nine sections', () => {
    expect(() => growthPlanSchema.parse(GOLDEN_GROWTH_PLAN)).not.toThrow();
    for (const section of [
      'business_snapshot',
      'goals_and_metrics',
      'audiences_and_channels',
      'content_system',
      'ugc_plan',
      'opportunities',
      'tool_recommendations',
      'calendar_proposal',
      'risks_and_unknowns',
    ] as const) {
      expect(GOLDEN_GROWTH_PLAN[section], section).toBeDefined();
    }
  });

  it('the content version checksum covers the master and the variants', async () => {
    const version = await goldenContentVersion();
    expect(() => contentVersionSchema.parse(version)).not.toThrow();
    expect(version.checksum).toBe(
      await computeChecksum(checksumPayload(version.master, version.variants)),
    );
    expect(version.master.id).toBe(GOLDEN_TEXT_DRAFT.id);
  });

  it('is deterministic across builds', async () => {
    const first = await goldenContentVersion();
    const second = await goldenContentVersion();
    expect(first.checksum).toBe(second.checksum);
    expect(first.id).toBe(second.id);
  });

  it('is frozen, so a test cannot mutate a shared example', () => {
    expect(Object.isFrozen(GOLDEN_TEXT_DRAFT)).toBe(true);
    expect(Object.isFrozen(GOLDEN_EXAMPLES)).toBe(true);
    expect(Object.isFrozen(GOLDEN_POST_METRICS)).toBe(true);
    expect(() => {
      // A frozen object silently ignores writes outside strict mode; module
      // code is strict, so this throws, which is the behaviour we want.
      Object.assign(GOLDEN_TEXT_DRAFT, { body: 'mutated' });
    }).toThrow();
  });
});
