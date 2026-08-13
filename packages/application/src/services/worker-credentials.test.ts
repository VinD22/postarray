import { describe, expect, it, vi } from 'vitest';

import { ERROR_CODES } from '@relay/contracts';

import type { CredentialStorePort, StoredCredentialRecord } from '../ports/credentials';
import type { ServiceDeps, WorkerActivityContext } from '../types';

let activeDb: Record<string, unknown>;
vi.mock('../internal/runtime', () => ({
  runInWorkspace: async (
    _deps: unknown,
    _ctx: unknown,
    handler: (db: unknown) => Promise<unknown>,
  ) => handler(activeDb),
}));

import { createWorkerCredentialService } from './worker-credentials';

const ctx: WorkerActivityContext = {
  workspaceId: 'ws_1',
  correlationId: 'corr_1',
  actorId: 'worker',
  actorType: 'system',
  surface: 'automation_rule',
  approvalLevel: 'level_3_confirm',
  locale: 'en',
};

const accessSecret = 'access-secret-must-never-be-serialized';

/** An envelope stands in for the ciphertext columns. No plaintext is stored. */
function envelope() {
  return {
    ciphertext: new Uint8Array([1, 2, 3]),
    nonce: new Uint8Array([4, 5, 6]),
    authTag: new Uint8Array([7, 8, 9]),
    algorithm: 'aes-256-gcm',
    keyVersion: 'v1',
    wrappedDataKey: new Uint8Array([10]),
    aadContext: accessSecret,
    envelopeVersion: 1,
  } as unknown as StoredCredentialRecord['accessToken'];
}

function record(overrides: Partial<StoredCredentialRecord> = {}): StoredCredentialRecord {
  return {
    id: 'cred_1',
    workspaceId: 'ws_1',
    connectionId: 'conn_1',
    provider: 'bluesky',
    accessToken: envelope(),
    refreshToken: envelope(),
    accessTokenExpiresAt: '2026-08-07T13:00:00.000Z',
    refreshTokenExpiresAt: null,
    lastRefreshedAt: '2026-08-07T11:00:00.000Z',
    lastRefreshError: null,
    rotatedAt: null,
    ...overrides,
  };
}

function service(found: StoredCredentialRecord | null) {
  const store: CredentialStorePort = {
    find: vi.fn(async () => found),
    upsert: vi.fn(async () => record()),
    remove: vi.fn(async () => undefined),
  };
  return createWorkerCredentialService({
    clock: { now: () => new Date('2026-08-07T12:00:00.000Z') },
    credentialStore: store,
  } as unknown as ServiceDeps);
}

describe('worker credential health', () => {
  it('describes a credential with metadata only and no secret material', async () => {
    activeDb = {
      socialConnection: {
        findFirst: vi
          .fn()
          .mockResolvedValue({ id: 'conn_1', provider: 'bluesky', status: 'active' }),
      },
    };

    const described = await service(record()).describeCredential({ ctx, connectionId: 'conn_1' });

    expect(described).toEqual({
      expiresAt: '2026-08-07T13:00:00.000Z',
      refreshable: true,
      revoked: false,
      lifetimeSeconds: 7200,
    });
    expect(JSON.stringify(described)).not.toContain(accessSecret);
    expect(Object.keys(described)).toEqual([
      'expiresAt',
      'refreshable',
      'revoked',
      'lifetimeSeconds',
    ]);
  });

  it('treats a missing credential as revoked rather than as never expiring', async () => {
    activeDb = {
      socialConnection: {
        findFirst: vi
          .fn()
          .mockResolvedValue({ id: 'conn_1', provider: 'bluesky', status: 'active' }),
      },
    };

    await expect(
      service(null).describeCredential({ ctx, connectionId: 'conn_1' }),
    ).resolves.toEqual({
      expiresAt: null,
      refreshable: false,
      revoked: true,
      lifetimeSeconds: null,
    });
  });

  it('raises one incident per connection and remediation, however often it is called', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'incident_1' });
    const updateMany = vi.fn().mockResolvedValue({ count: 1 });
    let open: { id: string } | null = null;
    activeDb = {
      socialConnection: {
        findFirst: vi.fn().mockResolvedValue({ id: 'conn_1', status: 'active' }),
        updateMany,
      },
      connectionIncident: {
        findFirst: vi.fn(async () => open),
        create: vi.fn(async (args: { data: unknown }) => {
          open = { id: 'incident_1' };
          return create(args);
        }),
      },
    };
    const subject = service(record());
    const input = {
      ctx,
      connectionId: 'conn_1',
      messageKey: 'connection.token_refresh_failed',
      errorCode: ERROR_CODES.CONNECTION_ACTION_REQUIRED,
    };

    await subject.raiseConnectionIncident(input);
    await subject.raiseConnectionIncident(input);

    expect(create).toHaveBeenCalledTimes(1);
    expect(create.mock.calls[0]?.[0].data).toMatchObject({ kind: 'refresh_failed', state: 'open' });
    // The Action Center finds the broken connection through its status.
    expect(updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: 'action_required' } }),
    );
  });
});
