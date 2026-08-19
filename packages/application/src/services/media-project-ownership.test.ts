import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ActorContext, ServiceDeps } from '../types';

/**
 * Tenancy for media, at the layer above row level security.
 *
 * A media asset may legitimately have no project, so the id is optional here.
 * Optional is not the same as unchecked: when a project is named it has to be
 * one this workspace owns, or an upload ticket gets issued against somebody
 * else's project id and a URL import reaches the network before anyone has
 * established that the caller may file the result anywhere.
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
  mediaAsset: trap('mediaAsset'),
};

import { FixedClock } from '../ports/clock';
import { MemoryKeyValueStore } from '../ports/key-value';
import { createMediaService } from './media';

const OWN_PROJECT = 'project_own';
const OTHER_WORKSPACE_PROJECT = 'project_other_workspace';
const DIGEST = 'a'.repeat(64);

const ctx: ActorContext = {
  actorType: 'user',
  actorId: 'user_1',
  workspaceId: 'ws_1',
  scopes: [],
  surface: 'web',
  correlationId: 'corr_media_ownership',
  approvalLevel: 'level_2_scheduled',
  locale: 'en',
};

let deps: ServiceDeps;

function service() {
  return createMediaService(deps);
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
    config: { neon: { storageBucket: 'relay-test' }, core: {} },
    storage: {
      createUploadTicket: () => {
        throw new Error('an upload ticket was issued for a refused project');
      },
    },
    remoteMediaFetch: () => {
      throw new Error('the network was reached for a refused project');
    },
  } as unknown as ServiceDeps;
});

describe('a project id from another workspace', () => {
  it('is refused before an upload ticket is issued', async () => {
    await expect(
      service().createUploadUrl(ctx, {
        filename: 'hero.png',
        mimeType: 'image/png',
        byteSize: 1024,
        sha256: DIGEST,
        projectId: OTHER_WORKSPACE_PROJECT,
      }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND', messageKey: 'errors.not_found.project' });
    expect(touched).toEqual([]);
  });

  it('is refused before a URL import reaches the network', async () => {
    await expect(
      service().importFromUrl(ctx, {
        url: 'https://cdn.example.test/hero.png',
        projectId: OTHER_WORKSPACE_PROJECT,
      }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
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

  it('leaves an asset with no project alone', async () => {
    // An unfiled upload is a real case, not a loophole: nothing is named, so
    // there is nothing to own.
    await expect(service().list(ctx, {})).rejects.toThrow(
      /A refused call reached mediaAsset.findMany/,
    );
  });

  it('accepts the project this workspace owns and goes on to the write', async () => {
    await expect(
      service().createUploadUrl(ctx, {
        filename: 'hero.png',
        mimeType: 'image/png',
        byteSize: 1024,
        sha256: DIGEST,
        projectId: OWN_PROJECT,
      }),
    ).rejects.toThrow(/A refused call reached mediaAsset.findFirst/);
    expect(touched).toEqual(['mediaAsset.findFirst']);
  });
});
