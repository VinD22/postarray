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

import { createWorkerInsightService } from './worker-insights';

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
  return createWorkerInsightService({
    clock: { now: () => new Date('2026-08-13T00:00:00.000Z') },
  } as ServiceDeps);
}

function receipt(publishedAt: string, id = 'receipt_1') {
  return {
    id,
    connectionId: 'conn_1',
    provider: 'bluesky',
    publishedAt: new Date(publishedAt),
    contentVersionId: 'cver_1',
    publishJob: { contentItemId: 'content_1' },
  };
}

function observation(value: number | null, availability = 'available') {
  return {
    receiptId: 'receipt_1',
    observedAt: new Date('2026-08-13T00:00:00.000Z'),
    availability,
    provider: 'bluesky',
    normalizedValue: value,
    rawValue: value,
    metricDefinition: { normalizedName: 'impressions' },
  };
}

const version = {
  payload: {
    contentItemId: 'content_1',
    workspaceId: 'ws_1',
    brandId: 'brand_1',
    campaignId: null,
    title: null,
    body: 'hello',
    contentKind: 'text',
    locale: 'en',
    mediaIds: [],
    links: [],
    signature: null,
    threadItems: [],
    schedule: null,
    disclosure: { paidPartnership: false, aiAssisted: false, affiliate: false },
    createdVia: 'web',
    revision: 1,
  },
};

describe('per post feedback', () => {
  it('says nothing about a post that is still too young', async () => {
    const create = vi.fn();
    activeDb = {
      publicationReceipt: {
        findFirst: vi.fn().mockResolvedValue(receipt('2026-08-12T18:00:00.000Z')),
      },
      insight: { findMany: vi.fn(), create },
    };

    const result = await service().generatePostFeedback({
      ctx,
      receiptId: 'receipt_1',
      observedAt: '2026-08-13T00:00:00.000Z',
    });

    expect(result).toMatchObject({
      created: false,
      window: null,
      verdict: 'insufficient_data',
      reasonKey: 'insight.post_feedback.too_early',
    });
    expect(create).not.toHaveBeenCalled();
  });

  it('writes one honest row per window, with a null model when no model wrote it', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'insight_1' });
    activeDb = {
      publicationReceipt: {
        findFirst: vi.fn().mockResolvedValue(receipt('2026-08-11T00:00:00.000Z')),
        findMany: vi.fn().mockResolvedValue([]),
      },
      insight: { findMany: vi.fn().mockResolvedValue([]), create },
      metricObservation: { findMany: vi.fn().mockResolvedValue([observation(1200)]) },
      contentVersion: { findFirst: vi.fn().mockResolvedValue(version) },
    };

    const result = await service().generatePostFeedback({
      ctx,
      receiptId: 'receipt_1',
      observedAt: '2026-08-13T00:00:00.000Z',
    });

    expect(result).toMatchObject({ created: true, window: 'twenty_four_hours' });
    const data = create.mock.calls[0]?.[0]?.data as Record<string, unknown>;
    // No history, so there is no baseline and therefore no verdict to give.
    expect(data['messageKey']).toBe('insight.post_feedback.insufficient_data');
    expect(data['aiModel']).toBeNull();
    expect(data['aiPromptVersion']).toBeNull();
    expect(data['sampleSize']).toBe(0);
  });

  it('refreshes at the seven day checkpoint without rewriting the first row', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'insight_2' });
    activeDb = {
      publicationReceipt: {
        findFirst: vi.fn().mockResolvedValue(receipt('2026-08-01T00:00:00.000Z')),
        findMany: vi.fn().mockResolvedValue([]),
      },
      insight: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'insight_1',
            messageKey: 'insight.post_feedback.above',
            messageArgs: { window: 'twenty_four_hours', verdict: 'above' },
          },
        ]),
        create,
      },
      metricObservation: { findMany: vi.fn().mockResolvedValue([observation(1200)]) },
      contentVersion: { findFirst: vi.fn().mockResolvedValue(version) },
    };

    const result = await service().generatePostFeedback({
      ctx,
      receiptId: 'receipt_1',
      observedAt: '2026-08-13T00:00:00.000Z',
    });

    expect(result).toMatchObject({ created: true, window: 'seven_days' });
    expect(create).toHaveBeenCalledTimes(1);
  });

  it('replays the row it already wrote for this window', async () => {
    const create = vi.fn();
    activeDb = {
      publicationReceipt: {
        findFirst: vi.fn().mockResolvedValue(receipt('2026-08-11T00:00:00.000Z')),
        findMany: vi.fn().mockResolvedValue([]),
      },
      insight: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'insight_1',
            messageKey: 'insight.post_feedback.above',
            messageArgs: { window: 'twenty_four_hours', verdict: 'above' },
          },
        ]),
        create,
      },
      metricObservation: { findMany: vi.fn() },
      contentVersion: { findFirst: vi.fn() },
    };

    const result = await service().generatePostFeedback({
      ctx,
      receiptId: 'receipt_1',
      observedAt: '2026-08-13T00:00:00.000Z',
    });

    expect(create).not.toHaveBeenCalled();
    expect(result).toEqual({
      insightId: 'insight_1',
      created: false,
      window: 'twenty_four_hours',
      verdict: 'above',
      reasonKey: null,
    });
  });

  it('never compares an unavailable reading against a zero it invented', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'insight_3' });
    activeDb = {
      publicationReceipt: {
        findFirst: vi.fn().mockResolvedValue(receipt('2026-08-11T00:00:00.000Z')),
        findMany: vi.fn().mockResolvedValue([receipt('2026-08-09T00:00:00.000Z', 'receipt_0')]),
      },
      insight: { findMany: vi.fn().mockResolvedValue([]), create },
      metricObservation: {
        findMany: vi.fn().mockResolvedValue([observation(null, 'requires_permission')]),
      },
      contentVersion: { findFirst: vi.fn().mockResolvedValue(version) },
    };

    const result = await service().generatePostFeedback({
      ctx,
      receiptId: 'receipt_1',
      observedAt: '2026-08-13T00:00:00.000Z',
    });

    expect(result.verdict).toBe('insufficient_data');
    const data = create.mock.calls[0]?.[0]?.data as Record<string, unknown>;
    const args = data['messageArgs'] as Record<string, unknown>;
    expect(args['subjectValue']).toBeNull();
    expect(args['medianValue']).toBeNull();
  });
});
