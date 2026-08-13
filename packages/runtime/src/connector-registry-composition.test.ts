import type { CredentialStorePort, StoredCredentialRecord } from '@relay/application';
import { detectCapabilities, loadConfigFor } from '@relay/config';
import {
  FakeConnector,
  createConnectorRegistry,
  createCredentialVault,
  type ConnectionRef,
  type ProviderIdentity,
} from '@relay/connectors';
import type { RelayPrismaClient } from '@relay/database';
import { createLogger } from '@relay/observability';
import { describe, expect, it, vi } from 'vitest';

import { createComposedConnectorRegistry } from './connector-registry-composition';
import { VerifiedConnectorRegistry } from './verified-connectors';

/**
 * The composed registry is the seam that turned `capabilitiesFor` from a
 * permanent throw into a real provider call, so the tests here are about the
 * two things that seam owns: it loads the connection the application only named
 * by id, and it hands every other method straight to the object that already
 * has tests.
 */

const clock = { now: () => new Date('2026-08-12T00:00:00.000Z') };
const workspaceId = 'ws_00000000000000000000000001';
const connectionId = 'conn_00000000000000000000000001';
const logger = createLogger({ service: 'composition-test' }, { level: 'silent' });

function config() {
  return loadConfigFor('api', {
    NODE_ENV: 'development',
    APP_URL: 'https://app.example.test',
    API_URL: 'https://api.example.test',
    DATABASE_URL: 'postgresql://relay:relay@localhost:5432/relay',
    TOKEN_ENCRYPTION_LOCAL_KEY: Buffer.alloc(32, 7).toString('base64'),
  });
}

/** A registry with bluesky forced live, so the execution gate lets a call through. */
function verifiedBlueskyRegistry(): VerifiedConnectorRegistry {
  class BlueskyShapedFake extends FakeConnector {
    override identity(): ProviderIdentity {
      return { ...super.identity(), provider: 'bluesky' };
    }

    override async getCapabilities(connection: ConnectionRef) {
      const snapshot = await super.getCapabilities(connection);
      return { ...snapshot, provider: 'bluesky' as const };
    }
  }

  const detected = detectCapabilities(config());
  return new VerifiedConnectorRegistry(
    createConnectorRegistry([new BlueskyShapedFake({ clock, instant: true })], { clock }),
    { ...detected, connectors: { ...detected.connectors, bluesky: 'live' as const } },
    config(),
  );
}

async function credentialsFor(): Promise<{
  readonly store: CredentialStorePort;
  readonly vault: ReturnType<typeof createCredentialVault>;
}> {
  const vault = createCredentialVault({
    localKeyBase64: Buffer.alloc(32, 7).toString('base64'),
    clock,
  });
  const aad = { workspaceId, connectionId, provider: 'bluesky' as const };
  const record: StoredCredentialRecord = {
    id: 'cred_00000000000000000000000001',
    workspaceId,
    connectionId,
    provider: 'bluesky',
    accessToken: await vault.encrypt({
      secret: 'access-secret',
      aad: { ...aad, credentialKind: 'access_token' },
    }),
    refreshToken: null,
    accessTokenExpiresAt: null,
    refreshTokenExpiresAt: null,
    lastRefreshedAt: null,
    lastRefreshError: null,
    rotatedAt: null,
  };
  return {
    vault,
    store: {
      find: vi.fn(async () => record),
      upsert: vi.fn(async () => record),
      remove: vi.fn(async () => undefined),
    },
  };
}

function prismaWith(row: unknown): {
  prisma: RelayPrismaClient;
  findFirst: ReturnType<typeof vi.fn>;
} {
  const findFirst = vi.fn(async () => row);
  // Only `socialConnection.findFirst` is reachable from the composed registry.
  // Anything else appearing here would be a widening of that seam.
  return { prisma: { socialConnection: { findFirst } } as unknown as RelayPrismaClient, findFirst };
}

function composed(row: unknown, base = verifiedBlueskyRegistry()) {
  const { prisma, findFirst } = prismaWith(row);
  return credentialsFor().then(({ store, vault }) => ({
    findFirst,
    base,
    registry: createComposedConnectorRegistry({
      base,
      prisma,
      credentialStore: store,
      credentialVault: vault,
      config: config(),
      logger,
      clock,
    }),
  }));
}

const connectionRow = {
  workspaceId,
  provider: 'bluesky',
  externalAccountId: 'did:plc:example',
  displayName: 'Example',
  accountType: 'personal_profile',
  grantedScopes: ['atproto:repo.write'],
};

describe('composed connector registry', () => {
  it('loads the connection the application only named, and returns a real snapshot', async () => {
    const { registry, findFirst } = await composed(connectionRow);

    const snapshot = await registry.capabilitiesFor({
      provider: 'bluesky',
      connectionId,
      accountType: 'personal_profile',
    });

    expect(snapshot.provider).toBe('bluesky');
    expect(snapshot.connectionId).toBe(connectionId);
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: connectionId } }),
    );
  });

  it('maps the storage account type onto the contract vocabulary', async () => {
    const { registry } = await composed({ ...connectionRow, accountType: 'creator_account' });

    // The snapshot must describe the account type the contract knows, not the
    // column value, or the capability binding check downstream rejects it.
    await expect(
      registry.capabilitiesFor({
        provider: 'bluesky',
        connectionId,
        accountType: 'creator_profile',
      }),
    ).resolves.toMatchObject({ accountType: 'creator_profile' });
  });

  it('reports a missing connection as not found rather than an empty capability set', async () => {
    const { registry } = await composed(null);

    await expect(
      registry.capabilitiesFor({
        provider: 'bluesky',
        connectionId,
        accountType: 'personal_profile',
      }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('refuses to answer for a connection belonging to a different provider', async () => {
    const { registry } = await composed({ ...connectionRow, provider: 'x' });

    await expect(
      registry.capabilitiesFor({
        provider: 'bluesky',
        connectionId,
        accountType: 'personal_profile',
      }),
    ).rejects.toMatchObject({ code: 'INTERNAL' });
  });

  it('delegates has and beginOAuth to the base registry instead of reimplementing them', async () => {
    const base = verifiedBlueskyRegistry();
    const has = vi.spyOn(base, 'has');
    const beginOAuth = vi
      .spyOn(base, 'beginOAuth')
      .mockResolvedValue({ authorizationUrl: 'https://example.test/a', requestedScopes: [] });
    const { registry } = await composed(connectionRow, base);

    expect(registry.has('bluesky')).toBe(true);
    expect(has).toHaveBeenCalledWith('bluesky');

    await registry.beginOAuth?.({
      provider: 'bluesky',
      state: 's'.repeat(43),
      codeChallenge: 'c'.repeat(43),
      codeChallengeMethod: 'S256',
      redirectUri: 'https://api.example.test/v1/connections/callback/bluesky',
    });
    expect(beginOAuth).toHaveBeenCalledOnce();
  });

  it('refuses provider-secret auth for every provider except bluesky', async () => {
    const { registry } = await composed(connectionRow);

    await expect(
      registry.completeProviderSecretAuth?.({
        provider: 'x',
        workspaceId,
        identifier: 'someone',
        secret: new (await import('@relay/connectors')).SecretValue('never-used'),
      }),
    ).rejects.toMatchObject({ code: 'CAPABILITY_NOT_IMPLEMENTED' });
  });
});
