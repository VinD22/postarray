import { describe, expect, it } from 'vitest';

import { DATABASE_ERROR_CODES, DatabaseError } from '../errors.js';
import type { RelayPrismaClient } from '../client.js';

import { assertWorkspaceScoped, withWorkspace } from './workspace-scope.js';

/**
 * These exercise the proxy without a database. The proxy is a lint, not the
 * security boundary, so what matters here is that it injects the filter it
 * claims to and refuses the shapes it claims to refuse. Whether the database
 * would have stopped the query anyway is `rls.test.ts`.
 */

const WORKSPACE = '11111111-1111-4111-8111-111111111111';
const OTHER_WORKSPACE = '22222222-2222-4222-8222-222222222222';

interface RecordedCall {
  model: string;
  operation: string;
  args: unknown;
}

function createFakeClient(): { client: RelayPrismaClient; calls: RecordedCall[] } {
  const calls: RecordedCall[] = [];

  const makeDelegate = (model: string): Record<string, unknown> => {
    const record = (operation: string) => (args?: unknown) => {
      calls.push({ model, operation, args });
      return Promise.resolve(null);
    };
    return {
      findMany: record('findMany'),
      findUnique: record('findUnique'),
      findFirst: record('findFirst'),
      count: record('count'),
      create: record('create'),
      createMany: record('createMany'),
      update: record('update'),
      updateMany: record('updateMany'),
      upsert: record('upsert'),
      delete: record('delete'),
      deleteMany: record('deleteMany'),
    };
  };

  const client = {
    contentItem: makeDelegate('contentItem'),
    publishJob: makeDelegate('publishJob'),
    toolCatalogEntry: makeDelegate('toolCatalogEntry'),
    $transaction: (arg: unknown): unknown =>
      typeof arg === 'function' ? (arg as (tx: unknown) => unknown)(client) : arg,
    $queryRaw: () => Promise.resolve([]),
    $executeRaw: () => Promise.resolve(0),
  };

  return { client: client as unknown as RelayPrismaClient, calls };
}

describe('withWorkspace', () => {
  it('rejects a workspace id that is not a UUID', () => {
    const { client } = createFakeClient();
    expect(() => withWorkspace(client, 'ws_not_a_uuid')).toThrowError(DatabaseError);
  });

  it('rejects an empty workspace id', () => {
    const { client } = createFakeClient();
    try {
      withWorkspace(client, '');
      expect.unreachable('expected a DatabaseError');
    } catch (error) {
      expect(error).toBeInstanceOf(DatabaseError);
      expect((error as DatabaseError).code).toBe(DATABASE_ERROR_CODES.workspaceScopeMissing);
    }
  });

  it('injects the workspace filter into a read', async () => {
    const { client, calls } = createFakeClient();
    const db = withWorkspace(client, WORKSPACE);

    await db.contentItem.findMany({ where: { state: 'draft' } });

    expect(calls[0]?.args).toEqual({ where: { state: 'draft', workspaceId: WORKSPACE } });
  });

  it('injects the workspace filter when no arguments are given', async () => {
    const { client, calls } = createFakeClient();
    const db = withWorkspace(client, WORKSPACE);

    await db.contentItem.findMany();

    expect(calls[0]?.args).toEqual({ where: { workspaceId: WORKSPACE } });
  });

  it('injects the workspace into a create', async () => {
    const { client, calls } = createFakeClient();
    const db = withWorkspace(client, WORKSPACE);

    await db.contentItem.create({ data: { title: 'draft' } as never });

    expect(calls[0]?.args).toEqual({ data: { title: 'draft', workspaceId: WORKSPACE } });
  });

  it('injects the workspace into every row of a createMany', async () => {
    const { client, calls } = createFakeClient();
    const db = withWorkspace(client, WORKSPACE);

    await db.contentItem.createMany({ data: [{ title: 'a' }, { title: 'b' }] as never });

    expect(calls[0]?.args).toEqual({
      data: [
        { title: 'a', workspaceId: WORKSPACE },
        { title: 'b', workspaceId: WORKSPACE },
      ],
    });
  });

  it('scopes both halves of an upsert', async () => {
    const { client, calls } = createFakeClient();
    const db = withWorkspace(client, WORKSPACE);

    await db.contentItem.upsert({
      where: { id: 'abc' },
      create: { title: 'new' },
      update: { title: 'changed' },
    } as never);

    expect(calls[0]?.args).toEqual({
      where: { id: 'abc', workspaceId: WORKSPACE },
      create: { title: 'new', workspaceId: WORKSPACE },
      update: { title: 'changed', workspaceId: WORKSPACE },
    });
  });

  it('scopes a delete so a known id in another tenant matches nothing', async () => {
    const { client, calls } = createFakeClient();
    const db = withWorkspace(client, WORKSPACE);

    await db.contentItem.delete({ where: { id: 'someone-elses-id' } });

    expect(calls[0]?.args).toEqual({ where: { id: 'someone-elses-id', workspaceId: WORKSPACE } });
  });

  it('refuses a query that names a different workspace', async () => {
    const { client } = createFakeClient();
    const db = withWorkspace(client, WORKSPACE);

    await expect(
      db.contentItem.findMany({ where: { workspaceId: OTHER_WORKSPACE } }),
    ).rejects.toThrowError(DatabaseError);
  });

  it('refuses a create that names a different workspace', async () => {
    const { client } = createFakeClient();
    const db = withWorkspace(client, WORKSPACE);

    await expect(
      db.contentItem.create({ data: { workspaceId: OTHER_WORKSPACE } as never }),
    ).rejects.toThrowError(DatabaseError);
  });

  it('refuses to move a row into another workspace through an update', async () => {
    const { client } = createFakeClient();
    const db = withWorkspace(client, WORKSPACE);

    await expect(
      db.contentItem.update({
        where: { id: 'abc' },
        data: { workspaceId: OTHER_WORKSPACE } as never,
      }),
    ).rejects.toThrowError(DatabaseError);
  });

  it('leaves a global catalog model unfiltered', async () => {
    const { client, calls } = createFakeClient();
    const db = withWorkspace(client, WORKSPACE);

    await db.toolCatalogEntry.findMany({ where: { state: 'active' } });

    expect(calls[0]?.args).toEqual({ where: { state: 'active' } });
  });

  it('refuses raw SQL, which cannot be scoped here', () => {
    const { client } = createFakeClient();
    const db = withWorkspace(client, WORKSPACE) as unknown as Record<string, unknown>;

    expect(() => db['$queryRaw']).toThrowError(DatabaseError);
  });

  it('keeps the scope inside an interactive transaction', async () => {
    const { client, calls } = createFakeClient();
    const db = withWorkspace(client, WORKSPACE);

    await db.$transaction(async (tx) => {
      await tx.publishJob.findMany({ where: { state: 'scheduled' } });
      return null;
    });

    expect(calls[0]).toMatchObject({
      model: 'publishJob',
      args: { where: { state: 'scheduled', workspaceId: WORKSPACE } },
    });
  });
});

describe('assertWorkspaceScoped', () => {
  it('throws for a tenant model with no scope', () => {
    expect(() => assertWorkspaceScoped('publishJob', undefined)).toThrowError(DatabaseError);
  });

  it('throws for a tenant model with an empty scope', () => {
    try {
      assertWorkspaceScoped('contentItem', '');
      expect.unreachable('expected a DatabaseError');
    } catch (error) {
      expect((error as DatabaseError).code).toBe(DATABASE_ERROR_CODES.tenantModelUnscoped);
    }
  });

  it('passes for a global model', () => {
    expect(() => assertWorkspaceScoped('toolCatalogEntry', undefined)).not.toThrow();
  });

  it('passes for a tenant model with a scope', () => {
    expect(() => assertWorkspaceScoped('contentItem', WORKSPACE)).not.toThrow();
  });
});
