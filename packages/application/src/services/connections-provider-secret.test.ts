import { SecretValue, type CredentialResult, type ExternalAccount } from '@relay/connectors';
import { newIdFor } from '@relay/contracts';
import { describe, expect, it, vi } from 'vitest';

import { FixedClock } from '../ports/clock';
import type { ActorContext, ServiceDeps } from '../types';
import { createConnectionService } from './connections';

/**
 * Connecting Bluesky with an app password.
 *
 * The point of this path is that it reaches the *same* machinery the OAuth
 * callback reaches, so nothing downstream forks. These tests assert that: one
 * transaction row, one encrypted pending grant, a state hash shared by both,
 * and an app password that appears in no persisted argument.
 *
 * There is no live Bluesky account here, so discovery is doubled at the
 * connector-registry port. What the provider itself returns is covered by
 * `packages/connectors/src/providers/bluesky/app-password.test.ts`.
 */

const APP_PASSWORD = 'fake-app-password-not-a-real-credential';
const workspaceId = newIdFor('workspace');
const userId = newIdFor('user');

const ctx: ActorContext = {
  actorType: 'user',
  actorId: userId,
  workspaceId,
  scopes: ['connections:admin'],
  surface: 'web',
  correlationId: 'corr_provider_secret_test',
  approvalLevel: 'level_3_confirm',
  locale: 'en',
};

function discovery(): { credential: CredentialResult; accounts: readonly ExternalAccount[] } {
  return {
    credential: {
      accessToken: new SecretValue('fake.access.jwt', 'access_token'),
      refreshToken: new SecretValue('fake.refresh.jwt', 'refresh_token'),
      tokenType: 'bearer',
      expiresAt: null,
      grantedScopes: ['atproto:repo.write'],
      refreshTokenRotated: true,
      obtainedAt: '2026-08-12T00:00:00.000Z',
    },
    accounts: [
      {
        externalAccountId: 'did:plc:fakedidfakedidfake01',
        accountType: 'personal_profile',
        displayName: 'sample-studio.fake.invalid',
        handle: 'sample-studio.fake.invalid',
        avatarUrl: null,
        profileUrl: 'https://bsky.app/profile/sample-studio.fake.invalid',
        parentExternalId: null,
        grantedScopes: ['atproto:repo.write'],
        eligible: true,
        ineligibleReasonKey: null,
        accountAccessToken: null,
        metadata: { handle: 'sample-studio.fake.invalid' },
      },
    ],
  };
}

interface Harness {
  readonly deps: ServiceDeps;
  readonly created: { transaction: unknown[]; pending: unknown[]; audit: unknown[] };
  readonly completeProviderSecretAuth: ReturnType<typeof vi.fn>;
  readonly encrypt: ReturnType<typeof vi.fn>;
}

/**
 * The narrowest database double that `authorized` and this use case actually
 * touch. Anything reached that is not listed here would be a widening of the
 * query surface, and shows up as an undefined-model TypeError rather than
 * passing silently.
 */
function harness(
  overrides: { completeProviderSecretAuth?: ReturnType<typeof vi.fn> } = {},
): Harness {
  const created = {
    transaction: [] as unknown[],
    pending: [] as unknown[],
    audit: [] as unknown[],
  };
  const transactionId = newIdFor('oauthTransaction');

  const db = {
    workspace: {
      findUnique: async () => ({
        id: workspaceId,
        name: 'Test workspace',
        status: 'active',
        defaultLocale: 'en',
        defaultTimeZone: 'UTC',
        killSwitchAt: null,
        deletedAt: null,
      }),
    },
    membership: {
      findFirst: async () => ({ role: 'owner', state: 'active', brandScope: [] }),
    },
    rolePermission: { findMany: async () => [] },
    socialConnection: { count: async () => 0 },
    oAuthTransaction: {
      create: async (args: { data: unknown }) => {
        created.transaction.push(args.data);
        return { id: transactionId };
      },
    },
    auditEvent: {
      create: async (args: { data: unknown }) => {
        created.audit.push(args.data);
        return { id: newIdFor('auditEvent'), createdAt: new Date() };
      },
    },
    $executeRaw: async () => 0,
  };

  const prisma = {
    ...db,
    $transaction: async <T>(handler: (tx: typeof db) => Promise<T>): Promise<T> =>
      await handler(db),
  };

  const completeProviderSecretAuth =
    overrides.completeProviderSecretAuth ?? vi.fn(async () => discovery());
  const encrypt = vi.fn(async () => ({
    ciphertext: 'ZmFrZQ==',
    iv: 'ZmFrZQ==',
    authTag: 'ZmFrZQ==',
    wrappedKey: 'ZmFrZQ==',
    keyVersion: 1,
    algorithm: 'aes-256-gcm',
  }));
  const pendingCreate = vi.fn(async (record: unknown) => {
    created.pending.push(record);
  });

  const deps = {
    prisma,
    clock: new FixedClock(new Date('2026-08-12T00:00:00.000Z')),
    config: { core: { apiUrl: 'https://api.example.test' } },
    connectors: {
      has: () => true,
      capabilitiesFor: async () => {
        throw new Error('not used');
      },
      ...(overrides.completeProviderSecretAuth === null ? {} : { completeProviderSecretAuth }),
    },
    credentialVault: { encrypt },
    oauthPending: { create: pendingCreate, find: async () => null },
  } as unknown as ServiceDeps;

  return { deps, created, completeProviderSecretAuth, encrypt };
}

describe('connectWithProviderSecret', () => {
  it('exchanges the app password once and stores one pending grant against one transaction', async () => {
    const test = harness();
    const service = createConnectionService(test.deps);

    const result = await service.connectWithProviderSecret(ctx, {
      provider: 'bluesky',
      identifier: 'sample-studio.fake.invalid',
      appPassword: APP_PASSWORD,
    });

    expect(test.completeProviderSecretAuth).toHaveBeenCalledOnce();
    expect(test.created.transaction).toHaveLength(1);
    expect(test.created.pending).toHaveLength(1);

    const transaction = test.created.transaction[0] as Record<string, unknown>;
    const pending = test.created.pending[0] as Record<string, unknown>;
    expect(result.transactionId).toBe(pending['transactionId']);
    expect(transaction['purpose']).toBe('connect_social_account');
    expect(transaction['provider']).toBe('bluesky');
    // The claim path compares these two, so a mismatch would make every
    // connect attempt fail at the last step.
    expect(pending['stateHash']).toBe(transaction['stateHash']);
    expect(transaction['redirectUri']).toBe(
      'https://api.example.test/v1/connections/callback/bluesky',
    );
  });

  it('never hands the app password to the vault or to the pending store', async () => {
    const test = harness();
    const service = createConnectionService(test.deps);

    await service.connectWithProviderSecret(ctx, {
      provider: 'bluesky',
      identifier: 'sample-studio.fake.invalid',
      appPassword: APP_PASSWORD,
    });

    // Only the session tokens the provider issued in return are encrypted.
    const encrypted = test.encrypt.mock.calls[0]?.[0] as { secret: string };
    expect(encrypted.secret).toContain('fake.access.jwt');
    expect(encrypted.secret).not.toContain(APP_PASSWORD);
    expect(JSON.stringify(test.created.pending)).not.toContain(APP_PASSWORD);
    expect(JSON.stringify(test.created.transaction)).not.toContain(APP_PASSWORD);
    expect(JSON.stringify(test.created.audit)).not.toContain(APP_PASSWORD);
  });

  it('records the connect attempt against the transaction, not the account', async () => {
    const test = harness();
    const service = createConnectionService(test.deps);

    await service.connectWithProviderSecret(ctx, {
      provider: 'bluesky',
      identifier: 'sample-studio.fake.invalid',
      appPassword: APP_PASSWORD,
    });

    expect(test.created.audit).toHaveLength(1);
    expect(test.created.audit[0]).toMatchObject({
      action: 'connection.connected',
      targetType: 'oauth_transaction',
    });
  });

  it('writes nothing when the provider rejects the app password', async () => {
    const test = harness({
      completeProviderSecretAuth: vi.fn(async () => {
        throw new Error('provider rejected the credential');
      }),
    });
    const service = createConnectionService(test.deps);

    await expect(
      service.connectWithProviderSecret(ctx, {
        provider: 'bluesky',
        identifier: 'sample-studio.fake.invalid',
        appPassword: APP_PASSWORD,
      }),
    ).rejects.toThrow();

    // A failed exchange must not leave a transaction row a person could see.
    expect(test.created.transaction).toHaveLength(0);
    expect(test.created.pending).toHaveLength(0);
  });

  it('refuses when no runtime supplied a provider-secret exchange', async () => {
    const test = harness();
    const deps = {
      ...test.deps,
      connectors: { has: () => true, capabilitiesFor: test.deps.connectors.capabilitiesFor },
    } as unknown as ServiceDeps;
    const service = createConnectionService(deps);

    await expect(
      service.connectWithProviderSecret(ctx, {
        provider: 'bluesky',
        identifier: 'sample-studio.fake.invalid',
        appPassword: APP_PASSWORD,
      }),
    ).rejects.toMatchObject({ code: 'CAPABILITY_NOT_IMPLEMENTED' });
  });
});
