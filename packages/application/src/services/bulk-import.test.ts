import { beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  ActorContext,
  ContentService,
  MediaService,
  SchedulingService,
  ServiceDeps,
} from '../types';

/**
 * Bulk import service behaviour.
 *
 * Three properties are asserted here because they are the ones a person is
 * trusting when they upload a spreadsheet of real posts: the same file twice is
 * one job, applying twice is one draft per line, and one broken line does not
 * take the line after it down with it.
 *
 * The policy seam is faked, as it is in the queue tests, so a failure here is
 * unambiguously an import bug rather than an authorization one.
 */

interface Row extends Record<string, unknown> {
  id: string;
  bulkImportJobId: string;
  externalRowKey: string;
  lineNumber: number;
  state: string;
  payload: unknown;
  validation: unknown;
  issues: unknown;
  contentItemId: string | null;
  publishJobId: string | null;
  appliedAt: Date | null;
}

const jobs: Record<string, unknown>[] = [];
const rows: Row[] = [];
const audits: Record<string, unknown>[] = [];
const permissions: string[] = [];

const activeActor = {
  userId: 'user_1',
  workspace: { id: 'ws_1', defaultTimeZone: 'Europe/London', defaultLocale: 'en' },
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
    return handler(fakeDb, activeActor);
  },
  runInWorkspace: async (
    _deps: unknown,
    _ctx: unknown,
    handler: (db: unknown, actor: unknown) => Promise<unknown>,
  ) => handler(fakeDb, activeActor),
}));

vi.mock('../internal/audit', () => ({
  recordAudit: async (_db: unknown, _actor: unknown, input: Record<string, unknown>) => {
    audits.push(input);
  },
}));

function matches(row: Record<string, unknown>, where: Record<string, unknown>): boolean {
  return Object.entries(where).every(([key, value]) => {
    if (value !== null && typeof value === 'object' && 'in' in (value as object)) {
      return (value as { in: unknown[] }).in.includes(row[key]);
    }
    return row[key] === value;
  });
}

const fakeDb = {
  project: {
    findFirst: async () => ({ id: 'project_1', defaultTimeZone: 'Europe/London' }),
  },
  mediaAsset: {
    findFirst: async ({ where }: { where: Record<string, unknown> }) =>
      where['id'] === MEDIA || where['checksumSha256'] === 'a'.repeat(64) ? { id: MEDIA } : null,
  },
  bulkImportJob: {
    findFirst: async ({ where }: { where: Record<string, unknown> }) =>
      jobs.find((row) => matches(row, where)) ?? null,
    findMany: async () => jobs,
    create: async ({ data }: { data: Record<string, unknown> }) => {
      const row = {
        id: `import_${jobs.length + 1}`,
        storageKey: null,
        applyMode: null,
        appliedAt: null,
        errorReportStorageKey: null,
        createdAt: new Date('2026-08-10T09:00:00.000Z'),
        ...data,
      };
      jobs.push(row);
      return row;
    },
    update: async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
      const row = jobs.find((entry) => entry['id'] === where.id);
      if (row === undefined) throw new Error('missing job');
      Object.assign(row, data);
      return row;
    },
  },
  bulkImportRow: {
    findMany: async ({ where }: { where: Record<string, unknown> }) =>
      rows.filter((row) => matches(row, where)),
    create: async ({ data }: { data: Record<string, unknown> }) => {
      const row = {
        id: `importrow_${rows.length + 1}`,
        contentItemId: null,
        publishJobId: null,
        appliedAt: null,
        ...data,
      } as Row;
      rows.push(row);
      return row;
    },
    update: async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
      const row = rows.find((entry) => entry.id === where.id);
      if (row === undefined) throw new Error('missing row');
      Object.assign(row, data);
      return row;
    },
    groupBy: async () => {
      const counts = new Map<string, number>();
      for (const row of rows) counts.set(row.state, (counts.get(row.state) ?? 0) + 1);
      return [...counts.entries()].map(([state, total]) => ({
        state,
        _count: { _all: total },
      }));
    },
  },
};

const MEDIA = 'media_00000000000000000000000001';
const CONNECTION_OK = 'conn_00000000000000000000000001';
const CONNECTION_BAD = 'conn_00000000000000000000000002';

const written: string[] = [];
const drafted: { body: string; idempotencyKey: string | undefined }[] = [];
const scheduled: string[] = [];

const deps = {
  clock: { now: () => new Date('2026-08-10T09:00:00.000Z') },
  storage: {
    write: async (key: string) => {
      written.push(key);
      return { key, byteSize: 1, checksumSha256: 'x' };
    },
  },
} as unknown as ServiceDeps;

const content = {
  createDraft: async (ctx: ActorContext, input: { body: string; targets?: readonly unknown[] }) => {
    drafted.push({ body: input.body, idempotencyKey: ctx.idempotencyKey });
    const targets = (input.targets ?? []) as { connectionId: string }[];
    if (targets.some((target) => target.connectionId === CONNECTION_BAD)) {
      throw new Error('connection is not usable');
    }
    return {
      id: `content_${drafted.length}`,
      variants: targets.map((target) => ({ connectionId: target.connectionId, provider: 'x' })),
    };
  },
  applySet: async () => ({ id: 'content_1', variants: [] }),
  overrideVariant: async () => ({}),
} as unknown as ContentService;

const scheduling = {
  schedule: async (_ctx: ActorContext, input: { contentItemId: string }) => {
    scheduled.push(input.contentItemId);
    return { id: `job_${scheduled.length}` };
  },
} as unknown as SchedulingService;

const media = { importFromUrl: async () => ({ id: 'op_1' }) } as unknown as MediaService;

const ctx: ActorContext = {
  actorType: 'user',
  actorId: 'user_1',
  workspaceId: 'ws_1',
  scopes: [],
  surface: 'web',
  correlationId: 'corr_1',
  approvalLevel: 'level_3_confirm',
  locale: 'en',
};

const HEADER = 'external_row_id,project,targets,caption,scheduled_local_time,time_zone,media';

function line(key: string, connectionId = CONNECTION_OK, caption = 'Hello'): string {
  return `${key},launch,${connectionId},${caption},2026-09-01T10:00,Europe/Berlin,${MEDIA}`;
}

async function makeService() {
  const { createBulkImportService } = await import('./bulk-import');
  return createBulkImportService(deps, content, scheduling, media);
}

beforeEach(() => {
  jobs.length = 0;
  rows.length = 0;
  audits.length = 0;
  permissions.length = 0;
  written.length = 0;
  drafted.length = 0;
  scheduled.length = 0;
});

describe('bulk import upload', () => {
  it('resolves a second upload of the same file to the first job', async () => {
    const service = await makeService();
    const csv = `${HEADER}\n${line('r1')}\n${line('r2')}\n`;

    const first = await service.upload(ctx, {
      projectId: 'project_1',
      filename: 'posts.csv',
      content: csv,
    });
    const second = await service.upload(ctx, {
      projectId: 'project_1',
      filename: 'posts-again.csv',
      content: csv,
    });

    expect(second.job.id).toBe(first.job.id);
    expect(jobs).toHaveLength(1);
    expect(rows).toHaveLength(2);
    expect(written).toHaveLength(1);
  });

  it('creates no draft and schedules nothing on upload', async () => {
    const service = await makeService();
    await service.upload(ctx, {
      projectId: 'project_1',
      filename: 'posts.csv',
      content: `${HEADER}\n${line('r1')}\n`,
    });

    expect(drafted).toEqual([]);
    expect(scheduled).toEqual([]);
    expect(jobs[0]?.['applyMode']).toBeNull();
    expect(jobs[0]?.['appliedAt']).toBeNull();
  });

  it('reports counts rather than leaving them unknown after a parse', async () => {
    const service = await makeService();
    const report = await service.upload(ctx, {
      projectId: 'project_1',
      filename: 'posts.csv',
      content: `${HEADER}\n${line('r1')}\n${line('r2', CONNECTION_OK, 'Second')}\n`,
    });
    expect(report.job.counts).toMatchObject({ total: 2, valid: 2, invalid: 0 });
  });
});

describe('bulk import apply', () => {
  it('defaults to drafts and does not schedule', async () => {
    const service = await makeService();
    const uploaded = await service.upload(ctx, {
      projectId: 'project_1',
      filename: 'posts.csv',
      content: `${HEADER}\n${line('r1')}\n`,
    });

    const applied = await service.apply(ctx, { importJobId: uploaded.job.id });

    expect(drafted).toHaveLength(1);
    expect(scheduled).toEqual([]);
    expect(applied.job.appliedMode).toBe('drafts');
    expect(applied.job.counts.applied).toBe(1);
  });

  it('schedules only when a person explicitly chose the scheduled mode', async () => {
    const service = await makeService();
    const uploaded = await service.upload(ctx, {
      projectId: 'project_1',
      filename: 'posts.csv',
      content: `${HEADER}\n${line('r1')}\n`,
    });

    await service.apply(ctx, { importJobId: uploaded.job.id, mode: 'scheduled' });

    expect(scheduled).toHaveLength(1);
    expect(permissions).toContain('post.schedule');
  });

  it('applies a second time without creating a second draft', async () => {
    const service = await makeService();
    const uploaded = await service.upload(ctx, {
      projectId: 'project_1',
      filename: 'posts.csv',
      content: `${HEADER}\n${line('r1')}\n${line('r2', CONNECTION_OK, 'Second')}\n`,
    });

    await service.apply(ctx, { importJobId: uploaded.job.id });
    expect(drafted).toHaveLength(2);

    const again = await service.apply(ctx, { importJobId: uploaded.job.id });
    expect(drafted).toHaveLength(2);
    expect(again.job.counts.applied).toBe(2);
    expect(rows.every((row) => row.contentItemId !== null)).toBe(true);
  });

  it('uses a stable per row idempotency key so a retry replays', async () => {
    const service = await makeService();
    const uploaded = await service.upload(ctx, {
      projectId: 'project_1',
      filename: 'posts.csv',
      content: `${HEADER}\n${line('r1')}\n`,
    });
    await service.apply(ctx, { importJobId: uploaded.job.id });

    const key = drafted[0]?.idempotencyKey;
    expect(key).toMatch(/^import\.import_1\.[0-9a-f]{32}$/u);
  });

  it('keeps one failing row from harming the row after it', async () => {
    const service = await makeService();
    const uploaded = await service.upload(ctx, {
      projectId: 'project_1',
      filename: 'posts.csv',
      content: `${HEADER}\n${line('bad', CONNECTION_BAD)}\n${line('good')}\n`,
    });

    const applied = await service.apply(ctx, { importJobId: uploaded.job.id });

    const bad = rows.find((row) => row.externalRowKey === 'bad');
    const good = rows.find((row) => row.externalRowKey === 'good');
    expect(bad?.state).toBe('failed');
    expect(good?.state).toBe('applied');
    expect(good?.contentItemId).not.toBeNull();
    expect(applied.job.counts.applied).toBe(1);
    expect(applied.job.counts.failed).toBe(1);
  });

  it('records a failed row as an ICU key with no message text', async () => {
    const service = await makeService();
    const uploaded = await service.upload(ctx, {
      projectId: 'project_1',
      filename: 'posts.csv',
      content: `${HEADER}\n${line('bad', CONNECTION_BAD)}\n`,
    });
    await service.apply(ctx, { importJobId: uploaded.job.id });

    const issues = rows[0]?.issues as { key: string; values: Record<string, unknown> }[];
    expect(issues[0]?.key).toBe('import.error.applyFailed');
    expect(JSON.stringify(issues)).not.toContain('connection is not usable');
  });
});

describe('bulk import error report', () => {
  it('downloads the failed rows as a CSV of keys, not sentences', async () => {
    const service = await makeService();
    const uploaded = await service.upload(ctx, {
      projectId: 'project_1',
      filename: 'posts.csv',
      content: `${HEADER}\n${line('r1', CONNECTION_OK, 'Fine')}\nr2,launch,not-an-id,Body,2026-09-01T10:00,Europe/Berlin,${MEDIA}\n`,
    });

    const report = await service.errorReport(ctx, uploaded.job.id);
    expect(report.csv).toContain('external_row_id,line,column,error_key,error_values');
    expect(report.csv).toContain('import.error.invalidTargets');
    expect(report.filename).toBe(`import-errors-${uploaded.job.id}.csv`);
  });
});
