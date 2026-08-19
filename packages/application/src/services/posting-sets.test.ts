import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ActorContext, ServiceDeps } from '../types';

/**
 * Posting Set management.
 *
 * The centrepiece is the last suite: editing a Set must not reach into work
 * that was already created from it. That is asserted structurally rather than
 * by inspecting outcomes, because the failure mode we are guarding against is
 * somebody adding a well-meaning cascade later. Every content-shaped delegate
 * on the fake database throws, so a single stray write turns the test red and
 * names itself in the message.
 */

const sets: Record<string, unknown>[] = [];
const projects: Record<string, unknown>[] = [];
const audits: Record<string, unknown>[] = [];
const permissions: string[] = [];
const forbiddenWrites: string[] = [];
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
}));

vi.mock('../internal/audit', () => ({
  recordAudit: async (_db: unknown, _actor: unknown, input: Record<string, unknown>) => {
    audits.push(input);
  },
}));

/** Any delegate a Set edit must never touch. Touching one fails loudly. */
function forbidden(model: string): Record<string, unknown> {
  const trap = (operation: string) => () => {
    forbiddenWrites.push(`${model}.${operation}`);
    throw new Error(`A posting set edit touched ${model}.${operation}`);
  };
  return {
    findFirst: trap('findFirst'),
    findMany: trap('findMany'),
    create: trap('create'),
    update: trap('update'),
    updateMany: trap('updateMany'),
    delete: trap('delete'),
    deleteMany: trap('deleteMany'),
  };
}

const fakeDb = {
  // Ownership is resolved against this table before a project id is used, so
  // the fake honours the workspace in the `where` clause rather than matching
  // on id alone. A project row that exists but belongs to another workspace is
  // exactly the case the security tests below turn on.
  project: {
    findFirst: async ({ where }: { where: Record<string, unknown> }) =>
      projects.find((row) => matches(row, where)) ?? null,
  },
  postingSet: {
    findMany: async () => sets,
    findFirst: async ({ where }: { where: Record<string, unknown> }) =>
      sets.find((row) => matches(row, where)) ?? null,
    create: async ({ data }: { data: Record<string, unknown> }) => {
      const row = {
        id: `set_${sets.length + 1}`,
        archivedAt: null,
        createdAt: new Date('2026-06-01T00:00:00.000Z'),
        updatedAt: new Date('2026-06-01T00:00:00.000Z'),
        ...data,
      };
      sets.push(row);
      return row;
    },
    update: async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
      const row = sets.find((entry) => entry['id'] === where.id);
      if (row === undefined) throw new Error('missing set');
      Object.assign(row, data);
      return row;
    },
  },
  contentItem: forbidden('contentItem'),
  contentVersion: forbidden('contentVersion'),
  postVariant: forbidden('postVariant'),
  publishJob: forbidden('publishJob'),
  approvalRequest: forbidden('approvalRequest'),
};

function matches(row: Record<string, unknown>, where: Record<string, unknown>): boolean {
  return Object.entries(where).every(([key, value]) => {
    if (value === null || typeof value !== 'object') {
      return row[key] === value;
    }
    return true;
  });
}

import { newIdFor } from '@relay/contracts';

import { FixedClock } from '../ports/clock';
import { MemoryKeyValueStore } from '../ports/key-value';
import { createPostingSetService } from './posting-sets';

const clock = new FixedClock(new Date('2026-06-05T10:00:00.000Z'));
let deps: ServiceDeps;

const ctx: ActorContext = {
  actorType: 'user',
  actorId: 'user_1',
  workspaceId: 'ws_1',
  scopes: [],
  surface: 'web',
  correlationId: 'corr_sets',
  approvalLevel: 'level_2_scheduled',
  locale: 'en',
};

const PROJECT_ID = newIdFor('project');
const OTHER_WORKSPACE_PROJECT_ID = newIdFor('project');
const CONNECTION_A = newIdFor('connection');
const CONNECTION_B = newIdFor('connection');
const CONNECTION_C = newIdFor('connection');
const CONNECTION_D = newIdFor('connection');

const BASE = {
  projectId: PROJECT_ID,
  name: 'Launch day',
  description: null,
  connectionIds: [CONNECTION_A, CONNECTION_B],
  targetDefaults: [
    {
      provider: 'mastodon' as const,
      privacyValue: null,
      bodyPrefix: null,
      bodySuffix: null,
      requireAltText: false,
    },
  ],
  signatureId: null,
  approvalPolicy: 'single_approver' as const,
  slotBehavior: 'next_free_slot' as const,
};

function service() {
  return createPostingSetService(deps);
}

beforeEach(() => {
  sets.length = 0;
  projects.length = 0;
  projects.push(
    { id: PROJECT_ID, workspaceId: 'ws_1', archivedAt: null, rememberTargetsEnabled: false },
    // Same database, different tenant. Row level security would hide it; the
    // service must refuse it even when a fake, or a future unscoped client,
    // does not.
    {
      id: OTHER_WORKSPACE_PROJECT_ID,
      workspaceId: 'ws_2',
      archivedAt: null,
      rememberTargetsEnabled: false,
    },
  );
  audits.length = 0;
  permissions.length = 0;
  forbiddenWrites.length = 0;
  denyPermission = null;
  activeActor.userId = 'user_1';
  deps = { kv: new MemoryKeyValueStore(), clock } as unknown as ServiceDeps;
});

describe('posting set authorization', () => {
  it('reads with content.read and writes with content.write', async () => {
    await service().list(ctx, {});
    await service().create(ctx, BASE);
    expect(permissions).toEqual(['content.read', 'content.write']);
  });

  it('refuses to create when the policy denies content.write', async () => {
    denyPermission = 'content.write';
    await expect(service().create(ctx, BASE)).rejects.toThrow('FORBIDDEN:content.write');
  });

  it('refuses to create a Set under a machine identity', async () => {
    activeActor.userId = null;
    await expect(service().create(ctx, BASE)).rejects.toMatchObject({
      messageKey: 'errors.posting_set_requires_person',
    });
  });
});

describe('create, update and archive', () => {
  it('stores what was asked for and reads it back unchanged', async () => {
    const created = await service().create(ctx, BASE);
    expect(created.name).toBe('Launch day');
    expect(created.connectionIds).toEqual([CONNECTION_A, CONNECTION_B]);
    expect(created.approvalPolicy).toBe('single_approver');
    expect(created.slotBehavior).toBe('next_free_slot');
    expect(created.targetDefaults[0]?.provider).toBe('mastodon');
    expect(audits[0]?.['action']).toBe('posting_set.created');
  });

  it('refuses a second live Set with the same name in one project', async () => {
    await service().create(ctx, BASE);
    await expect(service().create({ ...ctx, correlationId: 'c2' }, BASE)).rejects.toMatchObject({
      messageKey: 'errors.posting_set_name_taken',
    });
  });

  it('treats an absent patch field as leave alone', async () => {
    const created = await service().create(ctx, BASE);
    const updated = await service().update({ ...ctx, correlationId: 'c2' }, created.id, {
      name: 'Launch week',
    });
    expect(updated.name).toBe('Launch week');
    expect(updated.connectionIds).toEqual([CONNECTION_A, CONNECTION_B]);
    expect(updated.approvalPolicy).toBe('single_approver');
  });

  it('archives, and archiving twice is the same request', async () => {
    const created = await service().create(ctx, BASE);
    const archived = await service().archive(ctx, created.id);
    expect(archived.archivedAt).not.toBeNull();
    const again = await service().archive(ctx, created.id);
    expect(again.archivedAt).toBe(archived.archivedAt);
    expect(audits.filter((entry) => entry['action'] === 'posting_set.archived')).toHaveLength(1);
  });

  it('refuses to edit an archived Set', async () => {
    const created = await service().create(ctx, BASE);
    await service().archive(ctx, created.id);
    await expect(
      service().update({ ...ctx, correlationId: 'c3' }, created.id, { name: 'Revived' }),
    ).rejects.toMatchObject({ messageKey: 'errors.posting_set_archived' });
  });

  it('reports a Set that does not exist rather than inventing one', async () => {
    await expect(service().get(ctx, 'set_missing')).rejects.toMatchObject({
      messageKey: 'errors.not_found.posting_set',
    });
  });
});

/**
 * The invariant.
 *
 * A Set is read once, at apply time. A draft or a scheduled campaign created
 * from it last week is not a live view of it. If this ever stops being true,
 * every approval in the product becomes provisional: a colleague approves a
 * campaign going to three accounts, somebody edits the Set, and it goes to five.
 */
describe('a Set is read only at apply time', () => {
  it('touches no content item, variant, version or publish job when edited', async () => {
    const created = await service().create(ctx, BASE);
    await service().update({ ...ctx, correlationId: 'c2' }, created.id, {
      connectionIds: [CONNECTION_A, CONNECTION_B, CONNECTION_C],
      approvalPolicy: 'none',
      signatureId: null,
      targetDefaults: [
        {
          provider: 'linkedin' as const,
          privacyValue: null,
          bodyPrefix: null,
          bodySuffix: null,
          requireAltText: true,
        },
      ],
    });
    expect(forbiddenWrites).toEqual([]);
  });

  it('touches nothing downstream when archived either', async () => {
    const created = await service().create(ctx, BASE);
    await service().archive(ctx, created.id);
    expect(forbiddenWrites).toEqual([]);
  });

  it('says on the audit event that the edit applies to the next apply only', async () => {
    const created = await service().create(ctx, BASE);
    await service().update({ ...ctx, correlationId: 'c2' }, created.id, { name: 'Renamed' });
    const updateEvent = audits.find((entry) => entry['action'] === 'posting_set.updated');
    expect(updateEvent?.['metadata']).toMatchObject({ appliesFrom: 'next_apply_only' });
  });

  it('leaves the campaign that was applied from it exactly as it was', async () => {
    // A campaign, as it existed the moment somebody approved it. The Set edit
    // below runs against a database whose content delegates all throw, so this
    // snapshot cannot be mutated by the code under test even accidentally.
    const approvedCampaign = {
      contentItemId: 'content_1',
      postingSetId: 'set_1',
      connectionIds: [CONNECTION_A, CONNECTION_B],
      approvalPolicy: 'single_approver',
    };
    const snapshot = structuredClone(approvedCampaign);

    const created = await service().create(ctx, BASE);
    await service().update({ ...ctx, correlationId: 'c2' }, created.id, {
      connectionIds: [CONNECTION_A, CONNECTION_B, CONNECTION_C, CONNECTION_D],
      approvalPolicy: 'none',
    });

    expect(approvedCampaign).toEqual(snapshot);
    expect(forbiddenWrites).toEqual([]);
    // The Set itself did change, which is the other half of the contract.
    const reread = await service().get(ctx, created.id);
    expect(reread.connectionIds).toHaveLength(4);
    expect(reread.approvalPolicy).toBe('none');
  });
});

/**
 * Tenancy, at the layer above row level security.
 *
 * RLS makes a wrong-workspace project read back as nothing, which is why the
 * fake above filters on `workspaceId` too. What it cannot do is tell the
 * difference between "this project is not mine" and "this project is empty",
 * so the service has to resolve the project first and refuse an id it does not
 * own, before that id reaches a `where` clause or a `data` payload.
 */
describe('a project id from another workspace', () => {
  it('is refused on create rather than filed under the caller workspace', async () => {
    await expect(
      service().create(ctx, { ...BASE, projectId: OTHER_WORKSPACE_PROJECT_ID }),
    ).rejects.toMatchObject({
      code: 'NOT_FOUND',
      messageKey: 'errors.not_found.project',
    });
    expect(sets).toHaveLength(0);
    expect(audits).toHaveLength(0);
  });

  it('is refused as a list filter rather than answered with an empty page', async () => {
    await expect(service().list(ctx, { projectId: OTHER_WORKSPACE_PROJECT_ID })).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
  });

  it('says not found, never forbidden, so an id cannot be confirmed by probing', async () => {
    const unknown = await service()
      .list(ctx, { projectId: newIdFor('project') })
      .catch((error: unknown) => error);
    const foreign = await service()
      .list(ctx, { projectId: OTHER_WORKSPACE_PROJECT_ID })
      .catch((error: unknown) => error);
    expect(unknown).toMatchObject({ code: 'NOT_FOUND' });
    expect(foreign).toMatchObject({ code: 'NOT_FOUND' });
  });

  it('still allows the project this workspace owns', async () => {
    const created = await service().create(ctx, BASE);
    expect(created.projectId).toBe(PROJECT_ID);
    const listed = await service().list(ctx, { projectId: PROJECT_ID });
    expect(listed.data).toHaveLength(1);
  });
});
