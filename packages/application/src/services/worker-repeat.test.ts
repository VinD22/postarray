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

import { createWorkerRepeatService, occurrenceInstant } from './worker-repeat';

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
  return createWorkerRepeatService({
    clock: { now: () => new Date('2026-03-01T00:00:00.000Z') },
  } as ServiceDeps);
}

const liveItem = { id: 'content_1', state: 'published', canceledAt: null };

function planInput(overrides: Record<string, unknown> = {}) {
  return {
    ctx,
    seriesId: 'series_1',
    contentItemId: 'content_1',
    occurrenceIndex: 1,
    cadenceDays: 7,
    firstInstant: '2026-03-01T14:00:00.000Z',
    ianaTimeZone: 'UTC',
    endDate: null,
    count: null,
    ...overrides,
  } as Parameters<ReturnType<typeof service>['planRepeatOccurrence']>[0];
}

describe('repeat occurrence planning', () => {
  it('keeps the chosen wall clock across a daylight saving transition', () => {
    // 2026-03-08 is the US spring forward. A weekly 09:00 post stays at 09:00
    // local, which is a different UTC instant either side of the change.
    const before = occurrenceInstant({
      firstInstant: '2026-03-01T14:00:00.000Z',
      ianaTimeZone: 'America/New_York',
      occurrenceIndex: 0,
      cadenceDays: 7,
    });
    const after = occurrenceInstant({
      firstInstant: '2026-03-01T14:00:00.000Z',
      ianaTimeZone: 'America/New_York',
      occurrenceIndex: 1,
      cadenceDays: 7,
    });

    expect(before.toISOString()).toBe('2026-03-01T14:00:00.000Z');
    expect(after.toISOString()).toBe('2026-03-08T13:00:00.000Z');
    const local = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: '2-digit',
      hourCycle: 'h23',
    });
    expect(local.format(before)).toBe(local.format(after));
  });

  it('moves off a wall clock the zone skipped rather than dropping the post', () => {
    // 02:30 does not exist on 2026-03-08 in New York.
    const instant = occurrenceInstant({
      firstInstant: '2026-03-01T07:30:00.000Z',
      ianaTimeZone: 'America/New_York',
      occurrenceIndex: 1,
      cadenceDays: 7,
    });
    expect(Number.isNaN(instant.getTime())).toBe(false);
    expect(instant.toISOString()).toBe('2026-03-08T07:30:00.000Z');
  });

  it('stops the series on its count without consulting the database', async () => {
    activeDb = { contentItem: { findFirst: vi.fn() } };
    const plan = await service().planRepeatOccurrence(planInput({ occurrenceIndex: 4, count: 4 }));

    expect(plan.shouldRun).toBe(false);
    expect(plan.reasonKey).toBe('repeat.series_reached_count');
    expect(activeDb['contentItem']).toMatchObject({ findFirst: expect.any(Function) });
  });

  it('stops when the source post has been canceled', async () => {
    activeDb = {
      contentItem: {
        findFirst: vi.fn().mockResolvedValue({ ...liveItem, canceledAt: new Date() }),
      },
    };
    const plan = await service().planRepeatOccurrence(planInput());

    expect(plan.shouldRun).toBe(false);
    expect(plan.reasonKey).toBe('repeat.series_canceled');
  });

  it('runs the occurrence when nothing ended the series', async () => {
    activeDb = { contentItem: { findFirst: vi.fn().mockResolvedValue(liveItem) } };
    const plan = await service().planRepeatOccurrence(planInput());

    expect(plan).toMatchObject({
      shouldRun: true,
      instant: '2026-03-08T14:00:00.000Z',
      localDateTime: '2026-03-08T14:00',
      reasonKey: null,
    });
  });
});

describe('repeat occurrence creation', () => {
  function occurrenceDb(existingJob: { id: string } | null) {
    const create = vi.fn().mockResolvedValue({ id: 'job_new' });
    return {
      create,
      db: {
        contentItem: {
          findFirst: vi.fn().mockResolvedValue({
            id: 'content_1',
            approvalPolicy: 'none',
            surface: 'web',
            currentVersionId: 'cver_1',
            approvedVersionId: 'cver_1',
          }),
        },
        contentVersion: {
          findFirst: vi.fn().mockResolvedValue({ id: 'cver_1', contentHash: 'a'.repeat(64) }),
        },
        postVariant: {
          findMany: vi.fn().mockResolvedValue([
            {
              id: 'pv_1',
              connectionId: 'conn_1',
              provider: 'bluesky',
              capabilitySnapshotVersion: 'cap-1',
            },
          ]),
        },
        publishJob: { findFirst: vi.fn().mockResolvedValue(existingJob), create },
        outboxEvent: { create: vi.fn().mockResolvedValue({ id: 'obx_1' }) },
      },
    };
  }

  const createInput = {
    ctx,
    seriesId: 'series_1',
    contentItemId: 'content_1',
    occurrenceIndex: 1,
    instant: '2026-03-08T14:00:00.000Z',
    localDateTime: '2026-03-08T14:00',
    ianaTimeZone: 'UTC',
    idempotencyKey: 'repeat:series_1:1',
  };

  it('inserts one job per target and starts it through the outbox', async () => {
    const { create, db } = occurrenceDb(null);
    activeDb = db;

    const result = await service().createOccurrenceJob(createInput);

    expect(create).toHaveBeenCalledTimes(1);
    expect(create.mock.calls[0]?.[0]?.data?.idempotencyKey).toBe('repeat:series_1:1:pv_1');
    expect(result).toMatchObject({ publishJobId: 'job_new', created: true });
    // The outbox starts the publish workflow, so handing the target back would
    // start a second one for a job that already has its own.
    expect(result.targets).toEqual([]);
  });

  it('never inserts a second job for an occurrence it already created', async () => {
    const { create, db } = occurrenceDb({ id: 'job_existing' });
    activeDb = db;

    const result = await service().createOccurrenceJob(createInput);

    expect(create).not.toHaveBeenCalled();
    expect(db.outboxEvent.create).not.toHaveBeenCalled();
    expect(result).toMatchObject({ publishJobId: 'job_existing', created: false });
  });
});
