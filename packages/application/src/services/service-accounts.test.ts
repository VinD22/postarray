import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Role } from '@relay/contracts';

import type { ActorContext, ServiceDeps } from '../types';

/**
 * Service accounts, at the layer above row level security.
 *
 * Four properties are asserted here, and each one is a way the feature could
 * quietly become dangerous rather than a way it could break loudly:
 *
 *  - a list can never carry a credential,
 *  - the plaintext is produced exactly once and is not recoverable,
 *  - a creator cannot mint an identity wider than the creator,
 *  - an id belonging to another workspace is `not_found`, and no write is
 *    attempted before that is established.
 */

const accounts: Record<string, unknown>[] = [];
const apiKeys: Record<string, unknown>[] = [];
const users = [{ id: 'user_1', displayName: 'Ada Lovelace' }];
const audit: Record<string, unknown>[] = [];
const forbidden: string[] = [];

let role: Role = 'owner';

const activeActor = {
  ctx: undefined as unknown,
  userId: 'user_1',
  workspace: { id: 'ws_1', defaultTimeZone: 'Europe/Berlin', defaultLocale: 'en' },
  restrictions: {},
  get policyActor() {
    return { actorType: 'user' as const, role, scopes: [] };
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
  ) => handler(fakeDb, activeActor),
}));

vi.mock('../internal/audit', () => ({
  recordAudit: async (_db: unknown, _actor: unknown, event: Record<string, unknown>) => {
    audit.push(event);
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
  serviceAccount: {
    findMany: async ({ where }: { where: Record<string, unknown> }) =>
      accounts.filter((row) => matches(row, where)),
    findFirst: async ({ where }: { where: Record<string, unknown> }) =>
      accounts.find((row) => matches(row, where)) ?? null,
    create: async ({ data }: { data: Record<string, unknown> }) => {
      const row = { id: `svc_${accounts.length + 1}`, createdAt: new Date(0), ...data };
      accounts.push(row);
      return row;
    },
    update: async ({
      where,
      data,
    }: {
      where: Record<string, unknown>;
      data: Record<string, unknown>;
    }) => {
      const row = accounts.find((entry) => entry['id'] === where['id']);
      if (row === undefined) {
        throw new Error('update reached a row that does not exist');
      }
      Object.assign(row, data);
      return row;
    },
  },
  apiKey: {
    findMany: async ({ where, select }: { where: Record<string, unknown>; select: unknown }) => {
      // The credential digest must never be selectable from this path.
      if (Object.keys(select as Record<string, unknown>).includes('secretHash')) {
        forbidden.push('apiKey.findMany selected secretHash');
      }
      return apiKeys.filter((row) => matches(row, where));
    },
    create: async ({ data }: { data: Record<string, unknown> }) => {
      const row = { id: `key_${apiKeys.length + 1}`, revokedAt: null, lastUsedAt: null, ...data };
      apiKeys.push(row);
      return row;
    },
    updateMany: async ({
      where,
      data,
    }: {
      where: Record<string, unknown>;
      data: Record<string, unknown>;
    }) => {
      let count = 0;
      for (const row of apiKeys) {
        if (matches(row, where)) {
          Object.assign(row, data);
          count += 1;
        }
      }
      return { count };
    },
  },
  user: {
    findMany: async ({ where }: { where: Record<string, unknown> }) =>
      users.filter((row) => matches(row as unknown as Record<string, unknown>, where)),
  },
};

import { FixedClock } from '../ports/clock';
import { MemoryKeyValueStore } from '../ports/key-value';
import { createServiceAccountService } from './service-accounts';

const NOW = new Date('2026-06-05T10:00:00.000Z');

const ctx: ActorContext = {
  actorType: 'user',
  actorId: 'user_1',
  workspaceId: 'ws_1',
  scopes: [],
  surface: 'web',
  correlationId: 'corr_service_accounts',
  approvalLevel: 'level_2_scheduled',
  locale: 'en',
};

let deps: ServiceDeps;

function service() {
  return createServiceAccountService(deps);
}

const baseInput = {
  name: 'Weekly digest agent',
  purpose: 'Drafts the Monday digest.',
  scopes: ['drafts:read', 'drafts:write'] as const,
  projectIds: ['project_1'],
  connectionIds: ['conn_1'],
  contentLocales: ['en'],
  allowedDomains: ['example.com'],
  maxPostsPerDay: 6,
  lookAheadDays: 14,
  quietHoursStart: '00:00',
  quietHoursEnd: '00:00',
  approvalLevel: 'level_2_scheduled' as const,
  expiresInDays: 90,
};

beforeEach(() => {
  accounts.length = 0;
  apiKeys.length = 0;
  audit.length = 0;
  forbidden.length = 0;
  role = 'owner';
  deps = {
    kv: new MemoryKeyValueStore(),
    clock: new FixedClock(NOW),
    config: { core: {} },
  } as unknown as ServiceDeps;
});

describe('the credential', () => {
  it('is returned exactly once, at creation, and never again', async () => {
    const issued = await service().create(ctx, { ...baseInput, scopes: [...baseInput.scopes] });

    expect(issued.plaintext).toMatch(/^rly_ak_[0-9a-f]{8}_[0-9a-f]{64}$/);
    expect(issued.expiresAt).toBe(new Date(NOW.getTime() + 90 * 86_400_000).toISOString());

    const listed = await service().list(ctx);
    expect(listed).toHaveLength(1);
    const serialized = JSON.stringify(listed);
    expect(serialized).not.toContain(issued.plaintext);
    // Not the secret, not its digest, and not a field that could hold either.
    expect(serialized).not.toContain('plaintext');
    expect(serialized).not.toContain('secretHash');
    expect(forbidden).toEqual([]);
  });

  it('is stored only as a salted digest, never as the plaintext', async () => {
    const issued = await service().create(ctx, { ...baseInput, scopes: [...baseInput.scopes] });
    const stored = apiKeys[0];
    expect(stored).toBeDefined();
    expect(stored?.['secretHash']).toMatch(/^[A-Za-z0-9_-]+\$[0-9a-f]{64}$/);
    expect(JSON.stringify(stored)).not.toContain(issued.plaintext.split('_').slice(2).join('_'));
    expect(stored?.['hashAlgorithm']).toBe('sha256-salted');
  });

  it('shows only the public prefix on the account itself', async () => {
    const issued = await service().create(ctx, { ...baseInput, scopes: [...baseInput.scopes] });
    const listed = await service().list(ctx);
    expect(listed[0]?.credentialPrefix).toBe(issued.plaintext.split('_').slice(0, 3).join('_'));
    expect(listed[0]?.credentialExpiresAt).toBe(issued.expiresAt);
  });

  it('kills the old credential before minting the replacement on rotation', async () => {
    const first = await service().create(ctx, { ...baseInput, scopes: [...baseInput.scopes] });
    const accountId = accounts[0]?.['id'] as string;

    const second = await service().rotateCredential(ctx, accountId);
    expect(second.plaintext).not.toBe(first.plaintext);

    const live = apiKeys.filter((key) => key['revokedAt'] === null);
    expect(live).toHaveLength(1);
    expect(apiKeys.filter((key) => key['revokedAt'] !== null)).toHaveLength(1);
    expect(audit.map((event) => event['action'])).toContain('service_account.credential_rotated');
  });
});

describe('scope enforcement', () => {
  it('refuses to mint an identity wider than its creator', async () => {
    role = 'editor';
    // An editor holds no billing permission, so the scope is not delegable and
    // must not appear on the created identity.
    const issued = await service().create(ctx, {
      ...baseInput,
      scopes: ['drafts:write', 'billing:read'],
    });
    expect(issued.account.scopes).toEqual(['drafts:write']);
    expect(issued.account.scopes).not.toContain('billing:read');
    expect(apiKeys[0]?.['scopes']).toEqual(['drafts:write']);
    expect(audit[0]?.['metadata']).toEqual({ refusedScopes: ['billing:read'] });
  });

  it('refuses the whole request when nothing survives narrowing', async () => {
    role = 'viewer';
    await expect(
      service().create(ctx, { ...baseInput, scopes: ['posts:publish'] }),
    ).rejects.toMatchObject({ messageKey: 'errors.service_account_scopes_refused' });
    expect(accounts).toHaveLength(0);
    expect(apiKeys).toHaveLength(0);
  });

  it('refuses a quiet-hours window it cannot store and therefore cannot enforce', async () => {
    await expect(
      service().create(ctx, {
        ...baseInput,
        scopes: [...baseInput.scopes],
        quietHoursStart: '22:00',
        quietHoursEnd: '07:00',
      }),
    ).rejects.toMatchObject({
      messageKey: 'errors.service_account_quiet_hours_not_implemented',
    });
    expect(accounts).toHaveLength(0);
  });
});

describe('tenancy', () => {
  beforeEach(() => {
    accounts.push({
      id: 'svc_other',
      workspaceId: 'ws_2',
      name: 'Someone else’s agent',
      description: null,
      scopes: ['drafts:write'],
      projectScope: [],
      connectionScope: [],
      localeScope: [],
      approvedDomains: [],
      maxDailyPublishes: null,
      maxLookAheadDays: null,
      maxApprovalLevel: 2,
      disabledAt: null,
      createdByUserId: 'user_2',
      createdAt: new Date(0),
    });
  });

  it('cannot stop an account belonging to another workspace', async () => {
    await expect(service().setEnabled(ctx, 'svc_other', false)).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
    expect(accounts[0]?.['disabledAt']).toBeNull();
  });

  it('cannot rotate the credential of another workspace’s account', async () => {
    await expect(service().rotateCredential(ctx, 'svc_other')).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
    expect(apiKeys).toHaveLength(0);
  });

  it('cannot rehearse a call as another workspace’s account', async () => {
    await expect(
      service().dryRun(ctx, { serviceAccountId: 'svc_other', tool: 'create_draft', args: {} }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('never lists an account from another workspace', async () => {
    await service().create(ctx, { ...baseInput, scopes: [...baseInput.scopes] });
    const listed = await service().list(ctx);
    expect(listed.map((account) => account.workspaceId)).toEqual(['ws_1']);
  });
});

describe('stopping and resuming', () => {
  it('reports the account as stopped and records the reason in the audit log', async () => {
    await service().create(ctx, { ...baseInput, scopes: [...baseInput.scopes] });
    const accountId = accounts[0]?.['id'] as string;

    const stopped = await service().setEnabled(ctx, accountId, false);
    expect(stopped.state).toBe('stopped');

    const resumed = await service().setEnabled(ctx, accountId, true);
    expect(resumed.state).toBe('active');
    expect(audit.map((event) => event['action'])).toEqual([
      'service_account.created',
      'service_account.stopped',
      'service_account.resumed',
    ]);
  });
});
