import type { RelayPrismaClient } from '@relay/database';
import type { ConnectorExecutionGateway } from '@relay/runtime';
import { describe, expect, it, vi } from 'vitest';

import { newIdFor } from '@relay/contracts';

import type { ActivityContext } from './activities/types';
import {
  createConnectorExecutionActivities,
  type WorkerAnalyticsSink,
} from './connector-execution-activities';

// A real identifier, not a label. The activities now open a workspace-scoped
// RLS context, and the claim is validated as a Post Array id, which is the
// point: a fixture that could not be a real workspace should not be able to
// stand in for one.
const WORKSPACE_ID = newIdFor('workspace');

const ctx: ActivityContext = {
  workspaceId: WORKSPACE_ID,
  correlationId: 'corr_1',
  actorId: 'worker',
  actorType: 'system',
  surface: 'automation_rule',
  approvalLevel: 'level_3_confirm',
  locale: 'en',
};

const observation = {
  normalizedName: 'likes',
  provider: 'bluesky',
  providerField: 'likeCount',
  scope: 'post',
  value: 4,
  unit: 'count',
  denominator: 'none',
  availability: 'available',
  observedAt: '2026-08-07T11:00:00.000Z',
  freshnessSeconds: 0,
  rawProviderPayloadHash: 'a'.repeat(64),
} as const;

/**
 * The activities open a workspace-scoped RLS context, which runs its body
 * inside a transaction and sets the claims on it. The double therefore has to
 * answer `$transaction` and `$executeRaw`, and it hands the same object back as
 * the transaction client so the model stubs below are what the body sees.
 */
function prismaDouble(overrides: Record<string, unknown> = {}): RelayPrismaClient {
  const client: Record<string, unknown> = {
    socialConnection: {
      findFirst: vi.fn().mockResolvedValue({
        id: 'conn_1',
        workspaceId: WORKSPACE_ID,
        provider: 'bluesky',
        accountType: 'personal_profile',
        externalAccountId: 'did:plc:example',
        displayName: 'Test',
        grantedScopes: [],
      }),
    },
    publicationReceipt: {
      findFirst: vi.fn().mockResolvedValue({ externalPostId: 'at://post/1' }),
    },
    ...overrides,
  };
  // Bound after the overrides are merged so the transaction body sees the
  // finished double, not the base one.
  client['$executeRaw'] = vi.fn().mockResolvedValue(0);
  client['$transaction'] = vi.fn(async (handler: (tx: unknown) => Promise<unknown>) =>
    handler(client),
  );
  return client as unknown as RelayPrismaClient;
}

describe('connector metrics activities', () => {
  it('fetches post metrics, persists them, and reports the counts that were written', async () => {
    const fetchMetrics = vi.fn().mockResolvedValue({
      observations: [observation],
      observedCount: 1,
      unavailableCount: 3,
    });
    const writeObservations = vi.fn().mockResolvedValue({ observedCount: 1, unavailableCount: 3 });
    const activities = createConnectorExecutionActivities({
      prisma: prismaDouble(),
      gateway: { fetchMetrics } as unknown as ConnectorExecutionGateway,
      analytics: { writeObservations } as WorkerAnalyticsSink,
    });

    const result = await activities.fetchPostMetrics({
      ctx,
      connectionId: 'conn_1',
      receiptId: 'receipt_1',
      cursor: null,
      windowStart: '2026-08-07T10:00:00.000Z',
      windowEnd: '2026-08-07T11:00:00.000Z',
    });

    expect(fetchMetrics).toHaveBeenCalledWith(
      expect.objectContaining({ scope: 'post', externalPostId: 'at://post/1' }),
    );
    expect(writeObservations).toHaveBeenCalledWith(
      expect.objectContaining({ receiptId: 'receipt_1', scope: 'post' }),
    );
    // Counts describe rows a person can go and look at, not what the provider
    // happened to answer with.
    expect(result).toEqual({
      observedCount: 1,
      unavailableCount: 3,
      nextCursor: null,
      providerCostMinor: null,
    });
  });

  it('reads account metrics without a receipt or an external post id', async () => {
    const fetchMetrics = vi
      .fn()
      .mockResolvedValue({ observations: [], observedCount: 0, unavailableCount: 0 });
    const activities = createConnectorExecutionActivities({
      prisma: prismaDouble(),
      gateway: { fetchMetrics } as unknown as ConnectorExecutionGateway,
      analytics: {
        writeObservations: vi.fn().mockResolvedValue({ observedCount: 0, unavailableCount: 0 }),
      } as WorkerAnalyticsSink,
    });

    await activities.fetchAccountMetrics({
      ctx,
      connectionId: 'conn_1',
      receiptId: null,
      cursor: null,
      windowStart: '2026-08-07T10:00:00.000Z',
      windowEnd: '2026-08-07T11:00:00.000Z',
    });

    expect(fetchMetrics).toHaveBeenCalledWith(
      expect.objectContaining({ scope: 'account', externalPostId: null }),
    );
  });

  it('fails closed when nothing can persist the readings', async () => {
    const fetchMetrics = vi.fn();
    const activities = createConnectorExecutionActivities({
      prisma: prismaDouble(),
      gateway: { fetchMetrics } as unknown as ConnectorExecutionGateway,
      analytics: null,
    });

    await expect(
      activities.fetchAccountMetrics({
        ctx,
        connectionId: 'conn_1',
        receiptId: null,
        cursor: null,
        windowStart: '2026-08-07T10:00:00.000Z',
        windowEnd: '2026-08-07T11:00:00.000Z',
      }),
    ).rejects.toMatchObject({ code: 'CAPABILITY_NOT_IMPLEMENTED' });
    expect(fetchMetrics).not.toHaveBeenCalled();
  });
});

describe('publish status polling', () => {
  function pollPrisma(overrides: Record<string, unknown> = {}): RelayPrismaClient {
    return prismaDouble({
      publishJob: {
        findFirst: vi.fn().mockResolvedValue({
          idempotencyKey: 'idem_publish_000000000001',
          dispatchedAt: new Date('2026-08-07T10:00:00.000Z'),
          scheduledFor: new Date('2026-08-07T10:00:00.000Z'),
          contentVersion: { contentHash: 'a'.repeat(64) },
        }),
      },
      ...overrides,
    });
  }

  const pollInput = {
    ctx,
    publishJobId: 'job_1',
    targetId: 'pv_1',
    connectionId: 'conn_1',
    attemptId: 'att_1',
    providerOperationId: 'container_1',
    providerIdempotencyToken: 'idem_publish_000000000001',
  };

  it('adopts a publication the provider confirms, with its external evidence', async () => {
    const pollStatus = vi.fn().mockResolvedValue({
      state: 'published',
      externalPostId: 'at://post/9',
      permalink: 'https://bsky.app/post/9',
      publishedAt: '2026-08-07T10:05:00.000Z',
      items: [],
      error: null,
      pollAfterSeconds: null,
      sanitizedResponse: {},
    });
    const activities = createConnectorExecutionActivities({
      prisma: pollPrisma(),
      gateway: { pollStatus } as unknown as ConnectorExecutionGateway,
    });

    await expect(activities.pollPublishStatus(pollInput)).resolves.toMatchObject({
      outcome: 'published',
      publication: { externalPostId: 'at://post/9', externalAccountId: 'did:plc:example' },
    });
    expect(pollStatus).toHaveBeenCalledWith(
      expect.objectContaining({ providerJobId: 'container_1', externalPostId: 'at://post/1' }),
    );
  });

  it('reports a provider that will not say as unknown, never as failed', async () => {
    const pollStatus = vi.fn().mockResolvedValue({
      state: 'unknown',
      externalPostId: null,
      permalink: null,
      publishedAt: null,
      items: [],
      error: null,
      pollAfterSeconds: null,
      sanitizedResponse: {},
    });
    const activities = createConnectorExecutionActivities({
      prisma: pollPrisma(),
      gateway: { pollStatus } as unknown as ConnectorExecutionGateway,
    });

    await expect(activities.pollPublishStatus(pollInput)).resolves.toMatchObject({
      outcome: 'unknown',
      publication: null,
      errorCode: 'UNKNOWN',
    });
  });
});

describe('sequence item publication', () => {
  function sequencePrisma(sanitizedResponse: unknown): RelayPrismaClient {
    return prismaDouble({
      publishAttempt: { findFirst: vi.fn().mockResolvedValue({ sanitizedResponse }) },
    });
  }

  const itemInput = {
    ctx,
    publishJobId: 'job_1',
    targetId: 'pv_1',
    connectionId: 'conn_1',
    contentVersionId: 'cver_1',
    threadItemId: 'cmt_1',
    order: 1,
    rootExternalPostId: 'at://post/1',
    parentExternalPostId: 'at://post/1',
    attemptId: 'att_1',
    providerIdempotencyToken: null,
  };

  it('adopts the part the provider already created and records where it landed', async () => {
    const setSequenceItemState = vi.fn().mockResolvedValue(undefined);
    const activities = createConnectorExecutionActivities({
      prisma: sequencePrisma({
        items: [
          {
            threadItemId: 'cmt_1',
            kind: 'thread',
            order: 1,
            externalPostId: 'at://post/2',
            permalink: 'https://bsky.app/post/2',
            publishedAt: '2026-08-07T10:05:00.000Z',
          },
        ],
      }),
      gateway: {} as unknown as ConnectorExecutionGateway,
      sequenceState: { setSequenceItemState },
    });

    await expect(activities.publishSequenceItem(itemInput)).resolves.toMatchObject({
      outcome: 'published',
      publication: { externalPostId: 'at://post/2' },
    });
    expect(setSequenceItemState).toHaveBeenCalledWith(
      expect.objectContaining({ threadItemId: 'cmt_1', state: 'published' }),
    );
  });

  it('never creates a second post for a part the provider did not report', async () => {
    const setSequenceItemState = vi.fn().mockResolvedValue(undefined);
    const publish = vi.fn();
    const activities = createConnectorExecutionActivities({
      prisma: sequencePrisma({ items: [] }),
      gateway: { publish } as unknown as ConnectorExecutionGateway,
      sequenceState: { setSequenceItemState },
    });

    // A duplicate comment under a live post is worse than a missing one, so the
    // honest answer is action_required and no provider call at all.
    await expect(activities.publishSequenceItem(itemInput)).resolves.toMatchObject({
      outcome: 'action_required',
      publication: null,
      errorCode: 'CAPABILITY_NOT_IMPLEMENTED',
    });
    expect(publish).not.toHaveBeenCalled();
    expect(setSequenceItemState).toHaveBeenCalledWith(
      expect.objectContaining({ state: 'action_required', externalPostId: null }),
    );
  });
});
