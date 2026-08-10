import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ActorContext, ServiceDeps } from '../types';

const rules: Record<string, unknown>[] = [];
const reservations: Record<string, unknown>[] = [];
const audits: Record<string, unknown>[] = [];
const permissions: unknown[] = [];
let denyPermission: string | null = null;

const activeActor = {
  ctx: undefined as unknown,
  userId: 'user_1',
  workspace: { id: 'ws_1', defaultTimeZone: 'Europe/London' },
};

/**
 * The policy seam is faked so a failure here is unambiguously a queue bug.
 * Whether `rule.write` is the right permission is asserted below; whether that
 * permission is correctly evaluated is authz's own test suite.
 */
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

const fakeDb = {
  brand: {
    findFirst: async () => ({ defaultTimeZone: 'Europe/London' }),
  },
  queueRule: {
    findMany: async () => rules,
    findFirst: async ({ where }: { where: Record<string, unknown> }) =>
      rules.find((row) => matches(row, where)) ?? null,
    create: async ({ data }: { data: Record<string, unknown> }) => {
      const row = { id: `qrule_${rules.length + 1}`, ...timestamps(), archivedAt: null, ...data };
      rules.push(row);
      return row;
    },
    update: async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
      const row = rules.find((entry) => entry['id'] === where.id);
      if (row === undefined) throw new Error('missing rule');
      Object.assign(row, data);
      return row;
    },
  },
  publishJob: { findMany: async () => [] },
  queueSlotReservation: {
    findMany: async () => reservations,
    findFirst: async ({ where }: { where: Record<string, unknown> }) =>
      reservations.find((row) => matches(row, where)) ?? null,
    create: async ({ data }: { data: Record<string, unknown> }) => {
      const row = {
        id: `qslot_${reservations.length + 1}`,
        ...timestamps(),
        publishJobId: null,
        contentItemId: null,
        ...data,
      };
      reservations.push(row);
      return row;
    },
    update: async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
      const row = reservations.find((entry) => entry['id'] === where.id);
      if (row === undefined) throw new Error('missing reservation');
      Object.assign(row, data);
      return row;
    },
  },
};

function timestamps() {
  return {
    createdByUserId: 'user_1',
    createdAt: new Date('2026-06-01T00:00:00.000Z'),
    updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  };
}

function matches(row: Record<string, unknown>, where: Record<string, unknown>): boolean {
  return Object.entries(where).every(([key, value]) => {
    if (value === null || typeof value !== 'object') {
      return row[key] === value;
    }
    return true;
  });
}

import { FixedClock } from '../ports/clock';
import { MemoryKeyValueStore } from '../ports/key-value';
import { createQueueRuleService } from './queue-rules';

const clock = new FixedClock(new Date('2026-06-05T10:00:00.000Z'));
let kv: MemoryKeyValueStore;
let deps: ServiceDeps;

const ctx: ActorContext = {
  actorType: 'user',
  actorId: 'user_1',
  workspaceId: 'ws_1',
  scopes: [],
  surface: 'web',
  correlationId: 'corr_queue',
  approvalLevel: 'level_2_scheduled',
  locale: 'en',
};

const MONDAY_NINE_TO_FIVE = [{ weekday: 1, startMinute: 9 * 60, endMinute: 17 * 60 }];

function service() {
  return createQueueRuleService(deps);
}

beforeEach(() => {
  rules.length = 0;
  reservations.length = 0;
  audits.length = 0;
  permissions.length = 0;
  denyPermission = null;
  activeActor.userId = 'user_1';
  kv = new MemoryKeyValueStore();
  deps = { kv, clock } as unknown as ServiceDeps;
});

describe('queue rule authorization', () => {
  it('asks for rule.read before listing and rule.write before creating', async () => {
    await service().list(ctx, {});
    await service().create(ctx, {
      brandId: 'brand_1',
      name: 'Weekdays',
      ianaTimeZone: 'Europe/London',
      windows: MONDAY_NINE_TO_FIVE,
      minimumGapMinutes: 0,
      maximumPerDay: null,
      blackouts: [],
      connectionIds: [],
      priority: 0,
      enabled: true,
    });
    expect(permissions).toEqual(['rule.read', 'rule.write']);
  });

  it('refuses to create when the policy denies rule.write', async () => {
    denyPermission = 'rule.write';
    await expect(
      service().create(ctx, {
        brandId: 'brand_1',
        name: 'Weekdays',
        ianaTimeZone: 'Europe/London',
        windows: MONDAY_NINE_TO_FIVE,
        minimumGapMinutes: 0,
        maximumPerDay: null,
        blackouts: [],
        connectionIds: [],
        priority: 0,
        enabled: true,
      }),
    ).rejects.toThrow('FORBIDDEN:rule.write');
    expect(rules).toHaveLength(0);
  });

  it('asks for post.schedule before reserving a slot, never merely content.read', async () => {
    await service().proposeSlot(ctx, { brandId: 'brand_1' });
    expect(permissions).toEqual(['post.schedule']);
  });

  it('refuses a proposal from an actor with no person behind it', async () => {
    activeActor.userId = null as unknown as string;
    await expect(service().proposeSlot(ctx, { brandId: 'brand_1' })).rejects.toThrow();
  });
});

describe('queue rule idempotency', () => {
  it('replays the same rule for a repeated key instead of creating a second', async () => {
    const keyed: ActorContext = { ...ctx, idempotencyKey: 'a'.repeat(20) };
    const input = {
      brandId: 'brand_1',
      name: 'Weekdays',
      ianaTimeZone: 'Europe/London',
      windows: MONDAY_NINE_TO_FIVE,
      minimumGapMinutes: 0,
      maximumPerDay: null,
      blackouts: [],
      connectionIds: [],
      priority: 0,
      enabled: true,
    };
    const first = await service().create(keyed, input);
    const second = await service().create(keyed, input);
    expect(second.id).toBe(first.id);
    expect(rules).toHaveLength(1);
  });

  it('replays a slot proposal rather than holding two instants for one key', async () => {
    const keyed: ActorContext = { ...ctx, idempotencyKey: 'b'.repeat(20) };
    const first = await service().proposeSlot(keyed, { brandId: 'brand_1' });
    const second = await service().proposeSlot(keyed, { brandId: 'brand_1' });
    expect(second.id).toBe(first.id);
    expect(second.instant).toBe(first.instant);
    expect(reservations).toHaveLength(1);
  });
});

describe('the proposal is never silent automation', () => {
  it('records a proposal with its reasons and leaves it unaccepted', async () => {
    const reservation = await service().proposeSlot(ctx, { brandId: 'brand_1' });
    expect(reservation.state).toBe('proposed');
    expect(reservation.contentItemId).toBeNull();
    expect(reservation.publishJobId).toBeNull();
    expect(reservation.expiresAt).not.toBeNull();
    expect(reservation.ruleSnapshot.reasons.length).toBeGreaterThan(0);
    expect(audits.map((entry) => entry['action'])).toEqual(['queue_slot.proposed']);
  });

  it('takes a human decision to accept, and audits it separately', async () => {
    const reservation = await service().proposeSlot(ctx, { brandId: 'brand_1' });
    const accepted = await service().acceptSlot(ctx, {
      reservationId: reservation.id,
      contentItemId: 'content_1',
    });
    expect(accepted.state).toBe('accepted');
    expect(accepted.contentItemId).toBe('content_1');
    expect(audits.map((entry) => entry['action'])).toEqual([
      'queue_slot.proposed',
      'queue_slot.accepted',
    ]);
  });

  it('refuses to accept the same reservation twice', async () => {
    const reservation = await service().proposeSlot(ctx, { brandId: 'brand_1' });
    await service().acceptSlot(ctx, {
      reservationId: reservation.id,
      contentItemId: 'content_1',
    });
    await expect(
      service().acceptSlot(ctx, { reservationId: reservation.id, contentItemId: 'content_2' }),
    ).rejects.toMatchObject({ messageKey: 'errors.queue_slot_not_open' });
  });
});

describe('a rule change never moves a slot that was already reserved', () => {
  it('keeps the instant, the zone and the frozen copy after the rule is rewritten', async () => {
    const created = await service().create(ctx, {
      brandId: 'brand_1',
      name: 'Weekdays',
      ianaTimeZone: 'Europe/London',
      windows: MONDAY_NINE_TO_FIVE,
      minimumGapMinutes: 0,
      maximumPerDay: null,
      blackouts: [],
      connectionIds: [],
      priority: 0,
      enabled: true,
    });

    const reservation = await service().proposeSlot(ctx, { brandId: 'brand_1' });
    expect(reservation.ruleSnapshot.queueRuleId).toBe(created.id);
    expect(reservation.ruleSnapshot.windows).toEqual(MONDAY_NINE_TO_FIVE);
    expect(reservation.ruleSnapshot.ianaTimeZone).toBe('Europe/London');

    // Rewrite the live rule into something that would have chosen a completely
    // different instant, in a different zone, on a different day.
    await service().update(ctx, created.id, {
      ianaTimeZone: 'Australia/Sydney',
      windows: [{ weekday: 6, startMinute: 3 * 60, endMinute: 4 * 60 }],
      minimumGapMinutes: 600,
      maximumPerDay: 1,
    });

    const [stored] = await service()
      .listReservations(ctx, { brandId: 'brand_1' })
      .then((page) => page.data);
    expect(stored?.instant).toBe(reservation.instant);
    expect(stored?.ianaTimeZone).toBe(reservation.ianaTimeZone);
    expect(stored?.localDateTime).toBe(reservation.localDateTime);
    expect(stored?.ruleSnapshot.windows).toEqual(MONDAY_NINE_TO_FIVE);
    expect(stored?.ruleSnapshot.ianaTimeZone).toBe('Europe/London');
    expect(stored?.ruleSnapshot.minimumGapMinutes).toBe(0);
    expect(stored?.ruleSnapshot.maximumPerDay).toBeNull();
  });

  it('keeps the reservation explainable after the rule is archived', async () => {
    const created = await service().create(ctx, {
      brandId: 'brand_1',
      name: 'Weekdays',
      ianaTimeZone: 'Europe/London',
      windows: MONDAY_NINE_TO_FIVE,
      minimumGapMinutes: 0,
      maximumPerDay: null,
      blackouts: [],
      connectionIds: [],
      priority: 0,
      enabled: true,
    });
    const reservation = await service().proposeSlot(ctx, { brandId: 'brand_1' });
    await service().archive(ctx, created.id);

    const [stored] = await service()
      .listReservations(ctx, { brandId: 'brand_1' })
      .then((page) => page.data);
    expect(stored?.instant).toBe(reservation.instant);
    expect(stored?.ruleSnapshot.name).toBe('Weekdays');
    expect(stored?.ruleSnapshot.reasons.map((entry) => entry.key)).toEqual(
      reservation.ruleSnapshot.reasons.map((entry) => entry.key),
    );
  });
});

describe('maximum per day never treats zero as unlimited', () => {
  it('stores zero as zero on create and on update', async () => {
    const created = await service().create(ctx, {
      brandId: 'brand_1',
      name: 'Paused',
      ianaTimeZone: 'Europe/London',
      windows: MONDAY_NINE_TO_FIVE,
      minimumGapMinutes: 0,
      maximumPerDay: 0,
      blackouts: [],
      connectionIds: [],
      priority: 0,
      enabled: true,
    });
    expect(created.maximumPerDay).toBe(0);

    const updated = await service().update(ctx, created.id, { maximumPerDay: null });
    expect(updated.maximumPerDay).toBeNull();

    const back = await service().update(ctx, created.id, { maximumPerDay: 0 });
    expect(back.maximumPerDay).toBe(0);
  });
});
