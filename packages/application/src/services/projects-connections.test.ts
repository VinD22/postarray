import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ActorContext, ServiceDeps } from '../types';

/**
 * `updateConnections` moves accounts between projects. The workspace check is
 * written into every query, not left to row level security, so a connection id
 * from another tenant is refused before anything is written.
 */

type Row = Record<string, unknown>;
const projects: Row[] = [];
const connections: Row[] = [];
const writes: string[] = [];

const actor = {
  userId: 'user_1',
  workspace: { id: 'ws_1', defaultTimeZone: 'UTC', defaultLocale: 'en' },
  restrictions: {},
};

function matches(row: Row, where: Row): boolean {
  return Object.entries(where).every(([key, value]) => {
    if (value !== null && typeof value === 'object' && 'in' in value) {
      return (value as { in: unknown[] }).in.includes(row[key]);
    }
    return row[key] === value;
  });
}

const fakeDb = {
  project: {
    findFirst: async ({ where }: { where: Row }) => {
      const row = projects.find((candidate) => matches(candidate, where));
      if (row === undefined) return null;
      return {
        ...row,
        socialConnections: connections
          .filter((connection) => connection.projectId === row.id)
          .map((connection) => ({ id: connection.id, status: 'active' })),
      };
    },
  },
  socialConnection: {
    findMany: async ({ where }: { where: Row }) =>
      connections.filter((row) => matches(row, where)).map((row) => ({ id: row.id })),
    updateMany: async ({ where, data }: { where: Row; data: Row }) => {
      for (const row of connections.filter((candidate) => matches(candidate, where))) {
        writes.push(`${String(row.id)}->${String(data.projectId)}`);
        Object.assign(row, data);
      }
      return { count: 0 };
    },
  },
};

vi.mock('../internal/runtime', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  authorized: async (
    _deps: unknown,
    _ctx: unknown,
    _permission: string,
    _resource: unknown,
    handler: (db: unknown, actor: unknown) => Promise<unknown>,
  ) => handler(fakeDb, actor),
}));

vi.mock('../internal/audit', () => ({ recordAudit: async () => undefined }));

import { createProjectService } from './projects';

const ctx = { workspaceId: 'ws_1' } as unknown as ActorContext;
const deps = {} as unknown as ServiceDeps;

function project(id: string, workspaceId: string): Row {
  const now = new Date('2026-06-05T10:00:00.000Z');
  return {
    id,
    workspaceId,
    name: id,
    slug: id,
    voice: null,
    audience: null,
    approvedClaims: [],
    blockedTerms: [],
    domains: [],
    defaultTimeZone: 'UTC',
    defaultShortLinkOn: false,
    rememberTargetsEnabled: false,
    archivedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

beforeEach(() => {
  writes.length = 0;
  projects.splice(0, projects.length, project('p_a', 'ws_1'), project('p_b', 'ws_1'));
  connections.splice(
    0,
    connections.length,
    { id: 'conn_1', workspaceId: 'ws_1', projectId: 'p_a' },
    { id: 'conn_foreign', workspaceId: 'ws_2', projectId: 'p_x' },
  );
});

describe('project connection membership', () => {
  it('moves a connection into the project in one call', async () => {
    const view = await createProjectService(deps).updateConnections(ctx, 'p_b', {
      add: ['conn_1'],
      remove: [],
    });
    expect(view.connectionIds).toEqual(['conn_1']);
    expect(writes).toEqual(['conn_1->p_b']);
  });

  it('unassigns only a connection that belongs to this project', async () => {
    await createProjectService(deps).updateConnections(ctx, 'p_b', {
      add: [],
      remove: ['conn_1'],
    });
    expect(writes).toEqual([]);
    await createProjectService(deps).updateConnections(ctx, 'p_a', {
      add: [],
      remove: ['conn_1'],
    });
    expect(writes).toEqual(['conn_1->null']);
  });

  it('refuses a connection from another workspace before writing anything', async () => {
    await expect(
      createProjectService(deps).updateConnections(ctx, 'p_b', {
        add: ['conn_foreign'],
        remove: [],
      }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
    expect(writes).toEqual([]);
  });
});
