import { describe, expect, it, vi } from 'vitest';

import type { ServiceDeps, WorkerActivityContext } from '../types';

let activeDb: Record<string, unknown>;
vi.mock('../internal/runtime', () => ({
  runInWorkspace: async (
    _deps: unknown,
    _ctx: unknown,
    handler: (db: unknown) => Promise<unknown>,
  ) => handler(activeDb),
}));

import { createWorkerPublishingService } from './worker-publishing';

const ctx: WorkerActivityContext = {
  workspaceId: 'ws_1',
  correlationId: 'corr_1',
  actorId: 'worker',
  actorType: 'system',
  surface: 'automation_rule',
  approvalLevel: 'level_3_confirm',
  locale: 'en',
};

function service() {
  return createWorkerPublishingService({
    clock: { now: () => new Date('2026-08-07T10:00:00.000Z') },
  } as ServiceDeps);
}

describe('worker publishing persistence', () => {
  it('deduplicates a receipt by publishJobId', async () => {
    const create = vi.fn();
    activeDb = {
      publicationReceipt: {
        findFirst: vi.fn().mockResolvedValue({ id: 'receipt_existing' }),
        create,
      },
      publishJob: { findFirst: vi.fn() },
    };
    const result = await service().writeReceipt({
      ctx,
      publishJobId: 'job_1',
      targetId: 'pv_1',
      connectionId: 'conn_1',
      provider: 'linkedin',
      attemptId: 'att_1',
      contentVersionId: 'cver_1',
      contentVersionChecksum: 'a'.repeat(64),
      capabilityVersion: 'cap_1',
      scheduledInstant: '2026-08-07T10:00:00.000Z',
      scheduledLocalTime: '2026-08-07T15:30:00',
      ianaTimeZone: 'Asia/Kolkata',
      dispatchedAt: '2026-08-07T10:00:00.000Z',
      publication: {
        externalPostId: 'external_1',
        permalink: null,
        publishedAt: '2026-08-07T10:00:01.000Z',
        externalAccountId: 'account_1',
      },
      items: [],
    });
    expect(result).toEqual({ receiptId: 'receipt_existing', created: false });
    expect(create).not.toHaveBeenCalled();
  });

  it('returns an existing publication when beginning a retry', async () => {
    activeDb = {
      publishJob: {
        findFirst: vi.fn().mockResolvedValue({ contentVersionId: 'cver_1' }),
        updateMany: vi.fn().mockResolvedValue({ count: 0 }),
      },
      publicationReceipt: {
        findFirst: vi.fn().mockResolvedValue({
          externalPostId: 'external_1',
          permalink: 'https://example.test/post/1',
          publishedAt: new Date('2026-08-07T09:59:00.000Z'),
          connection: { externalAccountId: 'account_1' },
        }),
      },
      publishAttempt: { upsert: vi.fn().mockResolvedValue({ id: 'att_2', attemptNumber: 2 }) },
    };
    const result = await service().beginPublishAttempt({
      ctx,
      publishJobId: 'job_1',
      targetId: 'pv_1',
      connectionId: 'conn_1',
      attemptNumber: 2,
      idempotencyKey: 'publish:job_1',
    });
    expect(result.alreadyPublished).toEqual({
      externalPostId: 'external_1',
      permalink: 'https://example.test/post/1',
      publishedAt: '2026-08-07T09:59:00.000Z',
      externalAccountId: 'account_1',
    });
  });
});
