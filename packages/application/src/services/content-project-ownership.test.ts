import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ActorContext, ServiceDeps } from '../types';

/**
 * Tenancy for content, at the layer above row level security.
 *
 * A draft is filed under a project, and the project id arrives from the
 * caller. RLS makes another tenant's project unreadable, which stops the leak
 * but not the confusion: without an ownership check, an id that is not the
 * caller's reads as "no content yet" on the way in and is written straight
 * into `content_items.project_id` on the way out. The project is resolved first,
 * and an id this workspace does not own is refused before anything is filed.
 */

const projects: Record<string, unknown>[] = [];
const touched: string[] = [];

const activeActor = {
  ctx: undefined as unknown,
  userId: 'user_1',
  workspace: { id: 'ws_1', defaultTimeZone: 'UTC', defaultLocale: 'en' },
  restrictions: {},
};

vi.mock('../internal/runtime', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  authorized: async (
    _deps: unknown,
    _ctx: unknown,
    _permission: string,
    _resource: unknown,
    handler: (db: unknown, actor: unknown) => Promise<unknown>,
  ) => handler(fakeDb, activeActor),
  guard: () => undefined,
}));

vi.mock('../internal/audit', () => ({
  recordAudit: async () => undefined,
}));

function trap(model: string): Record<string, unknown> {
  const fail = (operation: string) => () => {
    touched.push(`${model}.${operation}`);
    throw new Error(`A refused call reached ${model}.${operation}`);
  };
  return {
    findFirst: fail('findFirst'),
    findMany: fail('findMany'),
    create: fail('create'),
    update: fail('update'),
  };
}

const fakeDb = {
  project: {
    findFirst: async ({ where }: { where: Record<string, unknown> }) =>
      projects.find((row) => Object.entries(where).every(([key, value]) => row[key] === value)) ??
      null,
  },
  contentItem: trap('contentItem'),
  contentVersion: trap('contentVersion'),
  postVariant: trap('postVariant'),
  socialConnection: trap('socialConnection'),
};

import { FixedClock } from '../ports/clock';
import { MemoryKeyValueStore } from '../ports/key-value';
import { createContentService } from './content';

const OWN_PROJECT = 'project_own';
const OTHER_WORKSPACE_PROJECT = 'project_other_workspace';

const ctx: ActorContext = {
  actorType: 'user',
  actorId: 'user_1',
  workspaceId: 'ws_1',
  scopes: [],
  surface: 'web',
  correlationId: 'corr_content_ownership',
  approvalLevel: 'level_2_scheduled',
  locale: 'en',
};

let deps: ServiceDeps;

function service() {
  return createContentService(deps);
}

beforeEach(() => {
  touched.length = 0;
  projects.length = 0;
  projects.push(
    { id: OWN_PROJECT, workspaceId: 'ws_1', archivedAt: null, rememberTargetsEnabled: false },
    {
      id: OTHER_WORKSPACE_PROJECT,
      workspaceId: 'ws_2',
      archivedAt: null,
      rememberTargetsEnabled: false,
    },
  );
  deps = {
    kv: new MemoryKeyValueStore(),
    clock: new FixedClock(new Date('2026-06-05T10:00:00.000Z')),
  } as unknown as ServiceDeps;
});

describe('a project id from another workspace', () => {
  it('is refused before a draft is created under it', async () => {
    await expect(
      service().createDraft(ctx, {
        projectId: OTHER_WORKSPACE_PROJECT,
        body: 'Ready to ship on Tuesday.',
      }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND', messageKey: 'errors.not_found.project' });
    expect(touched).toEqual([]);
  });

  it('is refused as a list filter rather than answered with an empty page', async () => {
    await expect(service().list(ctx, { projectId: OTHER_WORKSPACE_PROJECT })).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
    expect(touched).toEqual([]);
  });

  it('reports not found, never forbidden, so an id cannot be confirmed by probing', async () => {
    const unknown = await service()
      .list(ctx, { projectId: 'project_does_not_exist' })
      .catch((error: unknown) => error);
    const foreign = await service()
      .list(ctx, { projectId: OTHER_WORKSPACE_PROJECT })
      .catch((error: unknown) => error);
    expect(unknown).toMatchObject({ code: 'NOT_FOUND' });
    expect(foreign).toMatchObject({ code: 'NOT_FOUND' });
  });

  it('accepts the project this workspace owns and goes on to the write', async () => {
    await expect(
      service().createDraft(ctx, { projectId: OWN_PROJECT, body: 'Ready to ship on Tuesday.' }),
    ).rejects.toThrow(/A refused call reached contentItem.create/);
    expect(touched).toEqual(['contentItem.create']);
  });
});
