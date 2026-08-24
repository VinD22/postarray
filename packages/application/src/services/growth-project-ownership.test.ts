import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ActorContext, ContentService, ServiceDeps } from '../types';

/**
 * Tenancy for the Growth Advisor, at the layer above row level security.
 *
 * A business profile is the input every plan is generated from, so writing one
 * under a project id the caller does not own would put a description, a
 * product URL and a competitor list on somebody else's project. RLS stops the
 * cross-tenant read; the ownership check is what stops the write.
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
  businessProfile: trap('businessProfile'),
  growthPlan: trap('growthPlan'),
};

import { FixedClock } from '../ports/clock';
import { MemoryKeyValueStore } from '../ports/key-value';
import { createGrowthService } from './growth';

const OWN_PROJECT = 'project_own';
const OTHER_WORKSPACE_PROJECT = 'project_other_workspace';

const ctx: ActorContext = {
  actorType: 'user',
  actorId: 'user_1',
  workspaceId: 'ws_1',
  scopes: [],
  surface: 'web',
  correlationId: 'corr_growth_ownership',
  approvalLevel: 'level_2_scheduled',
  locale: 'en',
};

const PROFILE = {
  productName: 'Post Array',
  siteUrl: 'https://relay.example',
  description: 'A publishing control plane for small teams.',
  category: 'software',
  objective: 'signups',
};

let deps: ServiceDeps;

function service() {
  const content = {} as ContentService;
  return createGrowthService(deps, content);
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
  it('is refused before a business profile is written under it', async () => {
    await expect(
      service().upsertBusinessProfile(ctx, { ...PROFILE, projectId: OTHER_WORKSPACE_PROJECT }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND', messageKey: 'errors.not_found.project' });
    expect(touched).toEqual([]);
  });

  it('reports not found, never forbidden, so an id cannot be confirmed by probing', async () => {
    const unknown = await service()
      .upsertBusinessProfile(ctx, { ...PROFILE, projectId: 'project_does_not_exist' })
      .catch((error: unknown) => error);
    const foreign = await service()
      .upsertBusinessProfile(ctx, { ...PROFILE, projectId: OTHER_WORKSPACE_PROJECT })
      .catch((error: unknown) => error);
    expect(unknown).toMatchObject({ code: 'NOT_FOUND' });
    expect(foreign).toMatchObject({ code: 'NOT_FOUND' });
  });

  it('accepts the project this workspace owns and goes on to the write', async () => {
    await expect(
      service().upsertBusinessProfile(ctx, { ...PROFILE, projectId: OWN_PROJECT }),
    ).rejects.toThrow(/A refused call reached businessProfile.findFirst/);
    expect(touched).toEqual(['businessProfile.findFirst']);
  });
});
