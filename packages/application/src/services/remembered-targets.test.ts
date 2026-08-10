import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ActorContext, ServiceDeps } from '../types';

/**
 * Remembered targets.
 *
 * Two things are being protected here. The first is a privacy promise: while
 * the project has not opted in, nothing at all is written, and turning the
 * project off deletes what was there. The second is a safety promise: a
 * remembered channel is re-checked against live health and the acting person's
 * own authorization before it is offered, so a revoked account is never quietly
 * reselected in a composer somebody is about to publish from.
 */

interface BrandRow {
  id: string;
  rememberTargetsEnabled: boolean;
}

interface MemoryRow {
  id: string;
  workspaceId: string;
  brandId: string;
  userId: string;
  connectionIds: string[];
  updatedAt: Date;
}

interface ChannelRow {
  id: string;
  brandId: string;
  status: string;
}

const brands: BrandRow[] = [];
const memories: MemoryRow[] = [];
const channels: ChannelRow[] = [];
const audits: Record<string, unknown>[] = [];
const permissions: string[] = [];
let denyPermission: string | null = null;

const activeActor = {
  ctx: undefined as unknown,
  userId: 'user_1' as string | null,
  workspace: { id: 'ws_1', defaultTimeZone: 'Europe/London' },
  restrictions: {} as { connectionIds?: readonly string[] },
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

const fakeDb = {
  brand: {
    findFirst: async ({ where }: { where: { id: string } }) =>
      brands.find((row) => row.id === where.id) ?? null,
    update: async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
      const row = brands.find((entry) => entry.id === where.id);
      if (row === undefined) throw new Error('missing brand');
      Object.assign(row, data);
      return row;
    },
  },
  socialConnection: {
    findMany: async ({ where }: { where: { brandId: string } }) =>
      channels.filter((row) => row.brandId === where.brandId),
  },
  rememberedTarget: {
    findFirst: async ({ where }: { where: { brandId: string; userId: string } }) =>
      memories.find((row) => row.brandId === where.brandId && row.userId === where.userId) ?? null,
    create: async ({ data }: { data: Omit<MemoryRow, 'id' | 'updatedAt'> }) => {
      const row: MemoryRow = {
        id: `remtgt_${memories.length + 1}`,
        updatedAt: new Date('2026-06-05T10:00:00.000Z'),
        ...data,
      };
      memories.push(row);
      return row;
    },
    update: async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
      const row = memories.find((entry) => entry.id === where.id);
      if (row === undefined) throw new Error('missing memory');
      Object.assign(row, data);
      return row;
    },
    deleteMany: async ({ where }: { where: { brandId: string; userId?: string } }) => {
      const before = memories.length;
      for (let index = memories.length - 1; index >= 0; index -= 1) {
        const row = memories[index];
        if (row === undefined) continue;
        if (row.brandId !== where.brandId) continue;
        if (where.userId !== undefined && row.userId !== where.userId) continue;
        memories.splice(index, 1);
      }
      return { count: before - memories.length };
    },
  },
};

import { FixedClock } from '../ports/clock';
import { MemoryKeyValueStore } from '../ports/key-value';
import { createRememberedTargetService } from './remembered-targets';

const NOW = new Date('2026-06-05T10:00:00.000Z');
const clock = new FixedClock(NOW);
let deps: ServiceDeps;

const BRAND = 'brand_1';

const ctx: ActorContext = {
  actorType: 'user',
  actorId: 'user_1',
  workspaceId: 'ws_1',
  scopes: [],
  surface: 'web',
  correlationId: 'corr_memory',
  approvalLevel: 'level_2_scheduled',
  locale: 'en',
};

/**
 * Flip the project opt in on the seeded brand.
 *
 * A helper rather than an index-and-assert, so the suite reads as "this project
 * opted out" instead of reaching into a fixture array.
 */
function disableProject(): void {
  const brand = brands[0];
  if (brand === undefined) throw new Error('brand fixture missing');
  brand.rememberTargetsEnabled = false;
}

function seedChannels(entries: readonly (readonly [string, string])[]): void {
  for (const [id, status] of entries) {
    channels.push({ id, brandId: BRAND, status });
  }
}

function service() {
  return createRememberedTargetService(deps);
}

beforeEach(() => {
  brands.length = 0;
  memories.length = 0;
  channels.length = 0;
  audits.length = 0;
  permissions.length = 0;
  denyPermission = null;
  activeActor.userId = 'user_1';
  activeActor.restrictions = {};
  brands.push({ id: BRAND, rememberTargetsEnabled: true });
  deps = { kv: new MemoryKeyValueStore(), clock } as unknown as ServiceDeps;
});

describe('the project opt in', () => {
  it('is what read reports, and an off project offers nothing', async () => {
    disableProject();
    const view = await service().read(ctx, { brandId: BRAND });
    expect(view).toEqual({
      brandId: BRAND,
      enabled: false,
      connectionIds: [],
      droppedConnectionIds: [],
      updatedAt: null,
    });
  });

  it('persists nothing at all while the project has opted out', async () => {
    disableProject();
    seedChannels([['conn_a', 'active']]);
    const view = await service().remember(ctx, { brandId: BRAND, connectionIds: ['conn_a'] });
    expect(view.enabled).toBe(false);
    expect(view.connectionIds).toEqual([]);
    // The important assertion: no row exists to be leaked, exported or forgotten.
    expect(memories).toHaveLength(0);
  });

  it('deletes every memory in the project when the opt in is switched off', async () => {
    seedChannels([['conn_a', 'active']]);
    await service().remember(ctx, { brandId: BRAND, connectionIds: ['conn_a'] });
    memories.push({
      id: 'remtgt_other',
      workspaceId: 'ws_1',
      brandId: BRAND,
      userId: 'user_2',
      connectionIds: ['conn_a'],
      updatedAt: NOW,
    });

    await service().setEnabled(ctx, { brandId: BRAND, enabled: false });

    expect(brands[0]?.rememberTargetsEnabled).toBe(false);
    expect(memories).toHaveLength(0);
    expect(audits[0]?.['action']).toBe('brand.target_memory_changed');
    expect(audits[0]?.['metadata']).toMatchObject({ clearedMemories: 2 });
  });

  it('asks for brand.write to change the project setting', async () => {
    await service().setEnabled(ctx, { brandId: BRAND, enabled: false });
    expect(permissions).toEqual(['brand.write']);
  });
});

describe('what is stored', () => {
  it('stores channel identifiers, deduplicated, in the selected order', async () => {
    seedChannels([
      ['conn_b', 'active'],
      ['conn_a', 'active'],
    ]);
    await service().remember(ctx, {
      brandId: BRAND,
      connectionIds: ['conn_b', 'conn_a', 'conn_b'],
    });
    expect(memories[0]?.connectionIds).toEqual(['conn_b', 'conn_a']);
    // Nothing else made it into the row.
    expect(Object.keys(memories[0] ?? {}).sort()).toEqual([
      'brandId',
      'connectionIds',
      'id',
      'updatedAt',
      'userId',
      'workspaceId',
    ]);
  });

  it('replaces the previous selection rather than accumulating one', async () => {
    seedChannels([
      ['conn_a', 'active'],
      ['conn_b', 'active'],
    ]);
    await service().remember(ctx, { brandId: BRAND, connectionIds: ['conn_a'] });
    await service().remember(ctx, { brandId: BRAND, connectionIds: ['conn_b'] });
    expect(memories).toHaveLength(1);
    expect(memories[0]?.connectionIds).toEqual(['conn_b']);
  });

  it('refuses to remember anything under a machine identity', async () => {
    activeActor.userId = null;
    await expect(
      service().remember(ctx, { brandId: BRAND, connectionIds: ['conn_a'] }),
    ).rejects.toMatchObject({ messageKey: 'errors.target_memory_requires_person' });
  });

  it('lets a person forget, even after the project was switched off', async () => {
    seedChannels([['conn_a', 'active']]);
    await service().remember(ctx, { brandId: BRAND, connectionIds: ['conn_a'] });
    disableProject();
    await service().forget(ctx, { brandId: BRAND });
    expect(memories).toHaveLength(0);
  });
});

describe('what is offered back', () => {
  it('drops revoked, paused, expired and disconnected channels', async () => {
    seedChannels([
      ['conn_ok', 'active'],
      ['conn_revoked', 'revoked'],
      ['conn_paused', 'paused'],
      ['conn_expired', 'expired'],
      ['conn_gone', 'disconnected'],
    ]);
    memories.push({
      id: 'remtgt_1',
      workspaceId: 'ws_1',
      brandId: BRAND,
      userId: 'user_1',
      connectionIds: ['conn_ok', 'conn_revoked', 'conn_paused', 'conn_expired', 'conn_gone'],
      updatedAt: NOW,
    });

    const view = await service().read(ctx, { brandId: BRAND });
    expect(view.connectionIds).toEqual(['conn_ok']);
    expect(view.droppedConnectionIds).toEqual([
      'conn_revoked',
      'conn_paused',
      'conn_expired',
      'conn_gone',
    ]);
  });

  it('drops a channel this identity is not authorized to publish through', async () => {
    seedChannels([
      ['conn_a', 'active'],
      ['conn_b', 'active'],
    ]);
    activeActor.restrictions = { connectionIds: ['conn_a'] };
    memories.push({
      id: 'remtgt_1',
      workspaceId: 'ws_1',
      brandId: BRAND,
      userId: 'user_1',
      connectionIds: ['conn_a', 'conn_b'],
      updatedAt: NOW,
    });

    const view = await service().read(ctx, { brandId: BRAND });
    expect(view.connectionIds).toEqual(['conn_a']);
    expect(view.droppedConnectionIds).toEqual(['conn_b']);
  });

  it('drops a channel that has left the project entirely', async () => {
    seedChannels([['conn_a', 'active']]);
    memories.push({
      id: 'remtgt_1',
      workspaceId: 'ws_1',
      brandId: BRAND,
      userId: 'user_1',
      connectionIds: ['conn_a', 'conn_moved'],
      updatedAt: NOW,
    });

    const view = await service().read(ctx, { brandId: BRAND });
    expect(view.connectionIds).toEqual(['conn_a']);
    expect(view.droppedConnectionIds).toEqual(['conn_moved']);
  });

  it('reads only this person memory', async () => {
    seedChannels([
      ['conn_a', 'active'],
      ['conn_b', 'active'],
    ]);
    memories.push({
      id: 'remtgt_other',
      workspaceId: 'ws_1',
      brandId: BRAND,
      userId: 'user_2',
      connectionIds: ['conn_b'],
      updatedAt: NOW,
    });

    const view = await service().read(ctx, { brandId: BRAND });
    expect(view.connectionIds).toEqual([]);
    expect(view.updatedAt).toBeNull();
  });
});
