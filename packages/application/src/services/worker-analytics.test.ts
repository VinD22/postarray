import { describe, expect, it, vi } from 'vitest';

import type { MetricObservation } from '@relay/contracts';

import type { ServiceDeps, WorkerActivityContext } from '../types';

let activeDb: Record<string, unknown>;
vi.mock('../internal/runtime', () => ({
  runInWorkspace: async (
    _deps: unknown,
    _ctx: unknown,
    handler: (db: unknown) => Promise<unknown>,
  ) => handler(activeDb),
}));

import { createWorkerAnalyticsService } from './worker-analytics';

const ctx: WorkerActivityContext = {
  workspaceId: 'ws_1',
  correlationId: 'corr_1',
  actorId: 'worker',
  actorType: 'system',
  surface: 'automation_rule',
  approvalLevel: 'level_3_confirm',
  locale: 'en',
};

const now = new Date('2026-08-07T12:00:00.000Z');

function service() {
  return createWorkerAnalyticsService({ clock: { now: () => now } } as ServiceDeps);
}

function observation(overrides: Partial<MetricObservation> = {}): MetricObservation {
  return {
    normalizedName: 'likes',
    provider: 'bluesky',
    providerField: 'likeCount',
    scope: 'post',
    value: 9,
    unit: 'count',
    denominator: 'none',
    availability: 'available',
    observedAt: '2026-08-07T11:00:00.000Z',
    freshnessSeconds: 0,
    rawProviderPayloadHash: 'a'.repeat(64),
    ...overrides,
  } as MetricObservation;
}

describe('worker analytics persistence', () => {
  it('writes an unavailable reading as null with a reason, never as zero', async () => {
    const upsert = vi.fn().mockResolvedValue({ id: 'obs_1' });
    activeDb = {
      socialConnection: {
        findFirst: vi.fn().mockResolvedValue({ id: 'conn_1', provider: 'bluesky' }),
      },
      publicationReceipt: {
        findFirst: vi.fn().mockResolvedValue({ id: 'receipt_1', externalPostId: 'at://post/1' }),
      },
      metricDefinition: { upsert: vi.fn().mockResolvedValue({ id: 'metric_1' }) },
      metricObservation: { upsert, create: vi.fn() },
    };

    const result = await service().writeObservations({
      ctx,
      connectionId: 'conn_1',
      receiptId: 'receipt_1',
      scope: 'post',
      observations: [
        observation(),
        observation({
          normalizedName: 'impressions',
          providerField: 'impressions',
          value: null,
          availability: 'unavailable_provider',
        }),
      ],
    });

    expect(result).toEqual({ observedCount: 1, unavailableCount: 1 });
    const written = upsert.mock.calls.map((call) => call[0].create);
    expect(written[0]).toMatchObject({
      normalizedValue: 9,
      availability: 'available',
      unavailableReason: null,
    });
    expect(written[1]).toMatchObject({
      rawValue: null,
      normalizedValue: null,
      availability: 'unsupported',
      unavailableReason: 'unavailable_provider',
    });
    expect(written.some((row) => row.normalizedValue === 0)).toBe(false);
  });

  it('records the run and stamps the freshness the readings actually carry', async () => {
    const createRun = vi.fn().mockResolvedValue({ id: 'sync_1' });
    const updateMany = vi.fn().mockResolvedValue({ count: 1 });
    activeDb = {
      socialConnection: {
        findFirst: vi.fn().mockResolvedValue({ id: 'conn_1', provider: 'bluesky' }),
      },
      analyticsSyncRun: { create: createRun },
      metricObservation: {
        findMany: vi.fn().mockResolvedValue([
          {
            receiptId: 'receipt_1',
            observedAt: new Date('2026-08-07T11:30:00.000Z'),
            availability: 'available',
            provider: 'bluesky',
            normalizedValue: null,
            rawValue: null,
            metricDefinition: {
              normalizedName: 'likes',
              providerFieldName: 'likeCount',
              unit: 'count',
              appliesToPost: true,
            },
          },
        ]),
      },
      publicationReceipt: { updateMany },
    };

    await service().recordAnalyticsRun({
      ctx,
      connectionId: 'conn_1',
      startedAt: '2026-08-07T11:00:00.000Z',
      finishedAt: '2026-08-07T11:45:00.000Z',
      observedCount: 4,
      unavailableCount: 1,
      errorCode: null,
    });

    expect(createRun).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ state: 'succeeded', observationsWritten: 4 }),
      }),
    );
    expect(updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { lastAnalyticsSyncAt: new Date('2026-08-07T11:30:00.000Z') },
      }),
    );
  });

  it('leaves freshness untouched when the run read nothing', async () => {
    const updateMany = vi.fn();
    activeDb = {
      socialConnection: {
        findFirst: vi.fn().mockResolvedValue({ id: 'conn_1', provider: 'bluesky' }),
      },
      analyticsSyncRun: { create: vi.fn().mockResolvedValue({ id: 'sync_1' }) },
      metricObservation: { findMany: vi.fn().mockResolvedValue([]) },
      publicationReceipt: { updateMany },
    };

    await service().recordAnalyticsRun({
      ctx,
      connectionId: 'conn_1',
      startedAt: '2026-08-07T11:00:00.000Z',
      finishedAt: '2026-08-07T11:45:00.000Z',
      observedCount: 0,
      unavailableCount: 6,
      errorCode: null,
    });

    expect(updateMany).not.toHaveBeenCalled();
  });
});
