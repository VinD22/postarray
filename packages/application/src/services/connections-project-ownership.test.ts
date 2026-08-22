import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ActorContext, ServiceDeps } from '../types';

/**
 * Tenancy for connections, at the layer above row level security.
 *
 * RLS scopes every statement to the caller's workspace, so a project id from
 * another tenant reads back as nothing and no row can leak. What RLS cannot do
 * is tell the caller apart from the data: an id that is not theirs comes back
 * as an empty list, and an id that is not theirs can still be written into a
 * new OAuth transaction. The service therefore resolves the project first.
 *
 * The fake below honours the workspace in the `where` clause and holds a real
 * project row owned by a different workspace, which is the case this file
 * exists for: the project exists, the caller's own workspace id is correct,
 * and the pairing is still wrong.
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

/** Any delegate a refused call must never reach. Reaching one fails loudly. */
function trap(model: string): Record<string, unknown> {
  const fail = (operation: string) => () => {
    touched.push(`${model}.${operation}`);
    throw new Error(`A refused call reached ${model}.${operation}`);
  };
  return {
    findFirst: fail('findFirst'),
    findMany: fail('findMany'),
    count: fail('count'),
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
  socialConnection: trap('socialConnection'),
  oAuthTransaction: trap('oAuthTransaction'),
};

import { FixedClock } from '../ports/clock';
import { MemoryKeyValueStore } from '../ports/key-value';
import { createConnectionService } from './connections';

const OWN_PROJECT = 'project_own';
const OTHER_WORKSPACE_PROJECT = 'project_other_workspace';

const ctx: ActorContext = {
  actorType: 'user',
  actorId: 'user_1',
  workspaceId: 'ws_1',
  scopes: [],
  surface: 'web',
  correlationId: 'corr_connection_ownership',
  approvalLevel: 'level_2_scheduled',
  locale: 'en',
};

let deps: ServiceDeps;

function service() {
  return createConnectionService(deps);
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
    connectors: {
      has: () => {
        throw new Error('the connector registry was consulted for a refused project');
      },
    },
    config: { core: { apiUrl: 'https://api.example.test' }, neon: {} },
  } as unknown as ServiceDeps;
});

describe('a project id from another workspace', () => {
  it('is refused as a list filter rather than answered with an empty page', async () => {
    await expect(service().list(ctx, { projectId: OTHER_WORKSPACE_PROJECT })).rejects.toMatchObject(
      {
        code: 'NOT_FOUND',
        messageKey: 'errors.not_found.project',
      },
    );
    expect(touched).toEqual([]);
  });

  it('is refused before an authorization is started against it', async () => {
    await expect(
      service().beginOAuth(ctx, {
        provider: 'mastodon',
        projectId: OTHER_WORKSPACE_PROJECT,
        redirectTo: 'https://app.example.test/settings/channels',
      }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
    // Nothing was asked of the provider and no transaction row was opened.
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

  it('leaves a call with no project filter alone', async () => {
    // No project named means no project to own. The listing is scoped by RLS
    // and by the policy decision, exactly as before.
    await expect(service().list(ctx, {})).rejects.toThrow(
      /A refused call reached socialConnection.findMany/,
    );
  });

  it('accepts the project this workspace owns', async () => {
    await expect(service().list(ctx, { projectId: OWN_PROJECT })).rejects.toThrow(
      /A refused call reached socialConnection.findMany/,
    );
    expect(touched).toEqual(['socialConnection.findMany']);
  });
});
