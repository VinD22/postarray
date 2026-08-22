import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ActorContext, ServiceDeps } from '../types';
import type { PublishState } from '@relay/contracts';

/**
 * Pause and resume.
 *
 * The policy seam and the audit append are faked, the way the queue rule suite
 * fakes them, so a failure here is unambiguously a scheduling bug rather than
 * an authorization or audit one. What is real: the state matrix, the
 * interaction with a billing hold, the refusal to resume onto an instant that
 * has already passed, the daylight saving confirmation, and the outbox row.
 */

interface JobRow {
  id: string;
  workspaceId: string;
  contentItemId: string;
  contentVersionId: string;
  postVariantId: string | null;
  connectionId: string;
  state: string;
  scheduledFor: Date;
  scheduledTimeZone: string;
  idempotencyKey: string;
  temporalWorkflowId: string | null;
  approvalPolicy: string;
  attemptCount: number;
  lastErrorCode: string | null;
  surface: string;
  createdAt: Date;
  updatedAt: Date;
  canceledAt: Date | null;
  pausedAt: Date | null;
  pausedReason: string | null;
  pausedByUserId: string | null;
  connection: { provider: string };
  approvalRequest: { state: string } | null;
}

const jobs: JobRow[] = [];
const outbox: Record<string, unknown>[] = [];
const audits: Record<string, unknown>[] = [];
const permissions: string[] = [];
let denyPermission: string | null = null;

const activeActor = {
  ctx: undefined as unknown,
  userId: 'user_1' as string | null,
  workspace: { id: 'ws_1', defaultTimeZone: 'Europe/London' },
};

vi.mock('../internal/runtime', () => ({
  authorized: async (
    _deps: unknown,
    _ctx: unknown,
    permission: string,
    _resource: unknown,
    handler: (db: unknown, actor: unknown) => Promise<unknown>,
  ) => {
    permissions.push(permission);
    if (denyPermission === permission) {
      throw new Error(`FORBIDDEN:${permission}`);
    }
    return handler(fakeDb, activeActor);
  },
  guard: () => undefined,
}));

vi.mock('../internal/audit', () => ({
  recordAudit: async (_db: unknown, _actor: unknown, input: Record<string, unknown>) => {
    audits.push(input);
  },
}));

const fakeDb = {
  publishJob: {
    findFirst: async ({ where }: { where: { id: string } }) =>
      jobs.find((row) => row.id === where.id) ?? null,
    update: async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
      const row = jobs.find((entry) => entry.id === where.id);
      if (row === undefined) throw new Error('missing job');
      Object.assign(row, data);
      return row;
    },
  },
  outboxEvent: {
    create: async ({ data }: { data: Record<string, unknown> }) => {
      outbox.push(data);
      return data;
    },
  },
};

import { FixedClock } from '../ports/clock';
import { MemoryKeyValueStore } from '../ports/key-value';
import { createSchedulingPause } from './scheduling-pause';

const NOW = new Date('2026-06-05T10:00:00.000Z');
const clock = new FixedClock(NOW);
let deps: ServiceDeps;

const ctx: ActorContext = {
  actorType: 'user',
  actorId: 'user_1',
  workspaceId: 'ws_1',
  scopes: [],
  surface: 'web',
  correlationId: 'corr_pause',
  approvalLevel: 'level_2_scheduled',
  locale: 'en',
};

function seedJob(overrides: Partial<JobRow> = {}): JobRow {
  const row: JobRow = {
    id: 'job_1',
    workspaceId: 'ws_1',
    contentItemId: 'content_1',
    contentVersionId: 'cver_1',
    postVariantId: 'pv_1',
    connectionId: 'conn_1',
    state: 'scheduled',
    // Two hours after `NOW`, so the default job is resumable without a new time.
    scheduledFor: new Date('2026-06-05T12:00:00.000Z'),
    scheduledTimeZone: 'Europe/London',
    idempotencyKey: 'idem_1',
    temporalWorkflowId: 'publish:ws_1:job_1',
    approvalPolicy: 'none',
    attemptCount: 0,
    lastErrorCode: null,
    surface: 'web',
    createdAt: NOW,
    updatedAt: NOW,
    canceledAt: null,
    pausedAt: null,
    pausedReason: null,
    pausedByUserId: null,
    connection: { provider: 'mastodon' },
    approvalRequest: null,
    ...overrides,
  };
  jobs.push(row);
  return row;
}

function service() {
  return createSchedulingPause(deps);
}

/**
 * A refusal is asserted on its message key, not on the thrown `Error.message`,
 * which carries the stable error code. The key is the sentence the person
 * eventually reads, so it is the part worth pinning.
 */
async function expectRefusal(work: Promise<unknown>, messageKey: string): Promise<void> {
  await expect(work).rejects.toMatchObject({ messageKey });
}

beforeEach(() => {
  jobs.length = 0;
  outbox.length = 0;
  audits.length = 0;
  permissions.length = 0;
  denyPermission = null;
  activeActor.userId = 'user_1';
  deps = { kv: new MemoryKeyValueStore(), clock } as unknown as ServiceDeps;
});

describe('pause authorization', () => {
  it('asks for post.reschedule before holding or releasing a job', async () => {
    seedJob();
    await service().pause(ctx, { jobId: 'job_1' });
    await service().resume(ctx, { jobId: 'job_1' });
    expect(permissions).toEqual(['post.reschedule', 'post.reschedule']);
  });

  it('refuses when the policy denies the permission', async () => {
    seedJob();
    denyPermission = 'post.reschedule';
    await expect(service().pause(ctx, { jobId: 'job_1' })).rejects.toThrow(
      'FORBIDDEN:post.reschedule',
    );
  });

  it('refuses to hold anything under a machine identity', async () => {
    seedJob();
    activeActor.userId = null;
    await expectRefusal(service().pause(ctx, { jobId: 'job_1' }), 'errors.pause_requires_person');
  });
});

describe('the pause state matrix', () => {
  const pausable: readonly PublishState[] = [
    'validation_needed',
    'approval_requested',
    'approved',
    'scheduled',
    'action_required',
    'retry_scheduled',
  ];

  it.each(pausable)('holds a %s job', async (state) => {
    seedJob({ state });
    const view = await service().pause(ctx, { jobId: 'job_1' });
    expect(view.hold).toEqual({
      reason: 'user',
      since: NOW.toISOString(),
      byUserId: 'user_1',
    });
    // The hold does not move the job through the state machine. It is still
    // whatever it was; what changed is that the clock stopped.
    expect(view.state).toBe(state);
  });

  it.each(['published', 'partially_published', 'deleted_externally'] as const)(
    'refuses to hold a %s job, because a pause retracts nothing',
    async (state) => {
      seedJob({ state });
      await expectRefusal(service().pause(ctx, { jobId: 'job_1' }), 'errors.job_already_published');
      expect(outbox).toHaveLength(0);
    },
  );

  it.each(['preparing_media', 'dispatching', 'provider_processing'] as const)(
    'refuses to hold a %s job, because the side effect is in flight',
    async (state) => {
      seedJob({ state });
      await expectRefusal(
        service().pause(ctx, { jobId: 'job_1' }),
        'errors.job_already_dispatching',
      );
    },
  );

  it.each(['canceled', 'failed_permanently'] as const)(
    'refuses to hold a %s job, which is already finished',
    async (state) => {
      seedJob({ state });
      await expectRefusal(service().pause(ctx, { jobId: 'job_1' }), 'errors.job_not_pausable');
    },
  );

  it('is idempotent: pausing a job it already holds changes nothing', async () => {
    seedJob();
    await service().pause(ctx, { jobId: 'job_1' });
    const again = await service().pause({ ...ctx, correlationId: 'corr_2' }, { jobId: 'job_1' });
    expect(again.hold?.reason).toBe('user');
    expect(outbox).toHaveLength(1);
    expect(audits).toHaveLength(1);
  });

  it('writes one pause outbox row and one audit event', async () => {
    seedJob();
    await service().pause(ctx, { jobId: 'job_1', note: 'holding for legal' });
    expect(outbox).toHaveLength(1);
    expect(outbox[0]?.['kind']).toBe('pause_publish');
    expect(audits[0]?.['action']).toBe('post.paused');
    expect(audits[0]?.['metadata']).toMatchObject({ note: 'holding for legal' });
  });
});

describe('a billing hold and a person hold stay apart', () => {
  it('refuses to overwrite a billing hold with a person hold', async () => {
    seedJob({ pausedAt: NOW, pausedReason: 'billing', pausedByUserId: null });
    await expectRefusal(service().pause(ctx, { jobId: 'job_1' }), 'errors.job_paused_by_billing');
    expect(jobs[0]?.pausedReason).toBe('billing');
  });

  it('refuses to resume a billing hold, because clicking Resume does not pay', async () => {
    seedJob({ pausedAt: NOW, pausedReason: 'billing', pausedByUserId: null });
    await expectRefusal(service().resume(ctx, { jobId: 'job_1' }), 'errors.job_paused_by_billing');
    expect(jobs[0]?.pausedAt).not.toBeNull();
    expect(outbox).toHaveLength(0);
  });

  it('reports a billing hold on the view so the interface can explain it', async () => {
    seedJob({ pausedAt: NOW, pausedReason: 'billing', pausedByUserId: null });
    await expectRefusal(service().pause(ctx, { jobId: 'job_1' }), 'errors.job_paused_by_billing');
    // The reason survives the refusal untouched, which is the whole point of
    // keeping the two vocabularies separate.
    expect(jobs[0]?.pausedByUserId).toBeNull();
  });
});

describe('resume', () => {
  it('refuses a job nobody is holding', async () => {
    seedJob();
    await expectRefusal(service().resume(ctx, { jobId: 'job_1' }), 'errors.job_not_paused');
  });

  it('releases a hold whose instant is still ahead, keeping the original time', async () => {
    const job = seedJob();
    await service().pause(ctx, { jobId: 'job_1' });
    const view = await service().resume({ ...ctx, correlationId: 'c2' }, { jobId: 'job_1' });
    expect(view.hold).toBeNull();
    expect(view.state).toBe('scheduled');
    expect(view.scheduledInstant).toBe(job.scheduledFor.toISOString());
    const resume = outbox.find((row) => row['kind'] === 'resume_publish');
    expect(resume).toBeDefined();
    expect(resume?.['payload']).not.toHaveProperty('executeAt');
  });

  it('refuses to resume onto an instant that has already passed', async () => {
    seedJob({
      scheduledFor: new Date('2026-06-05T09:00:00.000Z'),
      pausedAt: new Date('2026-06-05T08:00:00.000Z'),
      pausedReason: 'user',
      pausedByUserId: 'user_1',
    });
    await expectRefusal(
      service().resume(ctx, { jobId: 'job_1' }),
      'errors.resume_requires_new_time',
    );
    // Nothing was released and nothing was signalled, so nothing publishes.
    expect(jobs[0]?.pausedAt).not.toBeNull();
    expect(outbox).toHaveLength(0);
  });

  it('accepts an explicit new time for a missed instant', async () => {
    seedJob({
      scheduledFor: new Date('2026-06-05T09:00:00.000Z'),
      pausedAt: new Date('2026-06-05T08:00:00.000Z'),
      pausedReason: 'user',
      pausedByUserId: 'user_1',
    });
    const view = await service().resume(ctx, {
      jobId: 'job_1',
      scheduleSpec: {
        instant: '2026-06-06T09:00:00.000Z',
        ianaTimeZone: 'Europe/London',
        repeat: null,
      },
    });
    expect(view.hold).toBeNull();
    expect(view.scheduledInstant).toBe('2026-06-06T09:00:00.000Z');
    const resume = outbox.find((row) => row['kind'] === 'resume_publish');
    expect(resume?.['payload']).toMatchObject({
      executeAt: '2026-06-06T09:00:00.000Z',
      ianaTimeZone: 'Europe/London',
    });
  });

  it('refuses a new time that is itself in the past', async () => {
    seedJob({ pausedAt: NOW, pausedReason: 'user', pausedByUserId: 'user_1' });
    await expectRefusal(
      service().resume(ctx, {
        jobId: 'job_1',
        scheduleSpec: {
          instant: '2026-06-04T09:00:00.000Z',
          ianaTimeZone: 'Europe/London',
          repeat: null,
        },
      }),
      'errors.schedule_in_past',
    );
  });

  it('asks for daylight saving confirmation when the clocks change in between', async () => {
    // Held in British Summer Time, resumed after the October transition.
    seedJob({
      scheduledFor: new Date('2026-10-20T12:00:00.000Z'),
      pausedAt: NOW,
      pausedReason: 'user',
      pausedByUserId: 'user_1',
    });
    await expectRefusal(
      service().resume(ctx, {
        jobId: 'job_1',
        scheduleSpec: {
          instant: '2026-11-10T12:00:00.000Z',
          ianaTimeZone: 'Europe/London',
          repeat: null,
        },
      }),
      'errors.schedule_crosses_dst',
    );

    const confirmed = await service().resume(
      { ...ctx, correlationId: 'c3' },
      {
        jobId: 'job_1',
        scheduleSpec: {
          instant: '2026-11-10T12:00:00.000Z',
          ianaTimeZone: 'Europe/London',
          repeat: null,
        },
        confirmDst: true,
      },
    );
    expect(confirmed.scheduledInstant).toBe('2026-11-10T12:00:00.000Z');
  });

  it('records the release, and says whether the time moved', async () => {
    seedJob({ pausedAt: NOW, pausedReason: 'user', pausedByUserId: 'user_1' });
    await service().resume(ctx, { jobId: 'job_1' });
    expect(audits[0]?.['action']).toBe('post.resumed');
    expect(audits[0]?.['metadata']).toMatchObject({ timeChanged: false });
  });
});
