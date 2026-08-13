import type { CredentialStorePort, StoredCredentialRecord } from '@relay/application';
import { loadConfigFor } from '@relay/config';
import {
  FakeConnector,
  createCredentialVault,
  createConnectorRegistry,
  fakeConnectionRef,
  fakeDraft,
  fakePublishRequest,
  type ConnectionRef,
  type ProviderIdentity,
} from '@relay/connectors';
import { detectCapabilities } from '@relay/config';
import { describe, expect, it, vi } from 'vitest';

import {
  ConnectorExecutionGateway,
  createWorkspaceCredentialResolver,
  type ConnectionDetails,
} from './connector-execution';
import { VerifiedConnectorRegistry } from './verified-connectors';

const clock = { now: () => new Date('2026-08-07T00:00:00.000Z') };
const workspaceId = 'ws_00000000000000000000000001';
const connectionId = 'conn_00000000000000000000000001';
const accessSecret = 'access-secret-must-never-be-serialized';
const refreshSecret = 'refresh-secret-must-never-be-serialized';

function config() {
  return loadConfigFor('api', {
    NODE_ENV: 'development',
    APP_URL: 'https://app.example.test',
    API_URL: 'https://api.example.test',
    DATABASE_URL: 'postgresql://relay:relay@localhost:5432/relay',
    TOKEN_ENCRYPTION_LOCAL_KEY: Buffer.alloc(32, 11).toString('base64'),
  });
}

function details(provider: ConnectionDetails['provider'] = 'bluesky'): ConnectionDetails {
  const ref = fakeConnectionRef({
    workspaceId,
    connectionId,
    provider,
    externalAccountId: 'external-account-1',
  });
  const { accessToken: _accessToken, ...withoutAccessToken } = ref;
  return withoutAccessToken;
}

async function encryptedRecord(
  connection: ConnectionDetails,
  vault = createCredentialVault({
    localKeyBase64: Buffer.alloc(32, 11).toString('base64'),
    clock,
  }),
): Promise<{
  readonly record: StoredCredentialRecord;
  readonly vault: ReturnType<typeof createCredentialVault>;
}> {
  const accessToken = await vault.encrypt({
    secret: accessSecret,
    aad: {
      workspaceId: connection.workspaceId,
      connectionId: connection.connectionId,
      provider: connection.provider,
      credentialKind: 'access_token',
    },
  });
  const refreshToken = await vault.encrypt({
    secret: refreshSecret,
    aad: {
      workspaceId: connection.workspaceId,
      connectionId: connection.connectionId,
      provider: connection.provider,
      credentialKind: 'refresh_token',
    },
  });
  return {
    vault,
    record: {
      id: 'cred_00000000000000000000000001',
      workspaceId: connection.workspaceId,
      connectionId: connection.connectionId,
      provider: connection.provider,
      accessToken,
      refreshToken,
      accessTokenExpiresAt: '2026-08-08T00:00:00.000Z',
      refreshTokenExpiresAt: null,
      lastRefreshedAt: null,
      lastRefreshError: null,
      rotatedAt: null,
    },
  };
}

function storeFor(record: StoredCredentialRecord): CredentialStorePort {
  return {
    find: vi.fn(async () => record),
    upsert: vi.fn(async () => record),
    remove: vi.fn(async () => undefined),
  };
}

function prelaunchRegistry(): VerifiedConnectorRegistry {
  return new VerifiedConnectorRegistry(
    createConnectorRegistry([], { clock }),
    detectCapabilities(config()),
    config(),
  );
}

describe('workspace credential resolver', () => {
  it('leases a handle, redacts it, and releases it without returning plaintext', async () => {
    const connection = details();
    const encrypted = await encryptedRecord(connection);
    const store = storeFor(encrypted.record);
    const resolver = createWorkspaceCredentialResolver({
      store,
      vault: encrypted.vault,
    });

    const leased = await resolver.lease({
      workspaceId,
      connection,
      purpose: 'test_publish',
    });
    expect(await leased.connection.accessToken.use((value) => value)).toBe(accessSecret);
    expect(JSON.stringify(leased)).not.toContain(accessSecret);
    expect(JSON.stringify(leased)).not.toContain(refreshSecret);

    leased.release();
    await expect(leased.connection.accessToken.use((value) => value)).rejects.toMatchObject({
      code: 'INTERNAL',
    });
  });

  it('rejects a credential row returned for another workspace', async () => {
    const connection = details();
    const encrypted = await encryptedRecord(connection);
    const store = storeFor({ ...encrypted.record, workspaceId: 'ws_other' });
    const resolver = createWorkspaceCredentialResolver({
      store,
      vault: encrypted.vault,
    });

    await expect(
      resolver.lease({ workspaceId, connection, purpose: 'test_publish' }),
    ).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
  });
});

describe('connector execution gateway', () => {
  it('fails closed before credential lookup when no provider is verified', async () => {
    const connection = details('fake');
    const encrypted = await encryptedRecord(connection);
    const store = storeFor(encrypted.record);
    const resolver = createWorkspaceCredentialResolver({
      store,
      vault: encrypted.vault,
    });
    const gateway = new ConnectorExecutionGateway({
      registry: prelaunchRegistry(),
      credentials: resolver,
      clock,
    });
    const ref = fakeConnectionRef({ workspaceId, connectionId, provider: 'fake' }, { clock });
    const draft = fakeDraft({}, { connection: ref, clock });
    const { connection: _connection, ...draftWithoutConnection } = draft;
    const request = fakePublishRequest(draft, {}, { clock });
    const { draft: _draft, ...requestWithoutDraft } = request;

    await expect(
      gateway.publish({
        workspaceId,
        connection,
        request: { ...requestWithoutDraft, draft: draftWithoutConnection },
        attemptNumber: 1,
        dispatchWindowFrom: '2026-08-06T23:00:00.000Z',
        dispatchWindowTo: '2026-08-07T00:00:00.000Z',
        capabilities: draft.capabilities,
      }),
    ).rejects.toMatchObject({ code: 'CAPABILITY_NOT_IMPLEMENTED' });
    expect(store.find).not.toHaveBeenCalled();
  });

  it('probes before a retry and adopts one existing publication', async () => {
    class EnabledFakeConnector extends FakeConnector {
      override identity(): ProviderIdentity {
        return { ...super.identity(), provider: 'bluesky' };
      }

      override async getCapabilities(connection: ConnectionRef) {
        const snapshot = await super.getCapabilities(connection);
        return { ...snapshot, provider: 'bluesky' as const };
      }
    }

    const fake = new EnabledFakeConnector({ clock, instant: true });
    const registry = createConnectorRegistry([fake], { clock });
    const detected = detectCapabilities(config());
    const verifiedCapabilities = {
      ...detected,
      connectors: { ...detected.connectors, bluesky: 'live' as const },
    };
    const verified = new VerifiedConnectorRegistry(registry, verifiedCapabilities, config());
    const connectionRef = fakeConnectionRef(
      {
        workspaceId,
        connectionId,
        provider: 'bluesky',
      },
      { clock },
    );
    const connection = details('bluesky');
    const encrypted = await encryptedRecord(connection);
    const store = storeFor(encrypted.record);
    const resolver = createWorkspaceCredentialResolver({
      store,
      vault: encrypted.vault,
    });
    const gateway = new ConnectorExecutionGateway({
      registry: verified,
      credentials: resolver,
      clock,
    });
    const capabilities = await gateway.capabilitiesFor({ workspaceId, connection });
    const draft = fakeDraft({}, { connection: connectionRef, capabilities, clock });
    const publishRequest = fakePublishRequest(
      draft,
      { idempotencyKey: 'idem_publish_000000000001' },
      { clock },
    );
    const { connection: _connection, ...draftWithoutConnection } = draft;
    const { draft: _draft, ...requestWithoutDraft } = publishRequest;
    const input = {
      workspaceId,
      connection,
      request: { ...requestWithoutDraft, draft: draftWithoutConnection },
      dispatchWindowFrom: '2026-08-06T23:00:00.000Z',
      dispatchWindowTo: '2026-08-07T00:00:00.000Z',
      capabilities,
    } as const;

    await expect(gateway.publish({ ...input, attemptNumber: 1 })).resolves.toMatchObject({
      status: 'executed',
    });
    await expect(gateway.publish({ ...input, attemptNumber: 2 })).resolves.toMatchObject({
      status: 'adopted',
    });
    expect(fake.state.posts).toHaveLength(1);
  });
});

describe('connector execution gateway status polling', () => {
  /**
   * A connector that is registered but has no verified status read. Polling
   * must refuse before it touches a credential, because the caller's only other
   * move would be a second create.
   */
  it('fails closed, before any credential lookup, when get_status is not verified', async () => {
    const connection = details('fake');
    const encrypted = await encryptedRecord(connection);
    const store = storeFor(encrypted.record);
    const gateway = new ConnectorExecutionGateway({
      registry: prelaunchRegistry(),
      credentials: createWorkspaceCredentialResolver({ store, vault: encrypted.vault }),
      clock,
    });

    await expect(
      gateway.pollStatus({
        workspaceId,
        connection,
        providerJobId: 'container_1',
        externalPostId: null,
        idempotencyKey: 'idem_publish_000000000001',
        contentFingerprint: 'a'.repeat(64),
        dispatchWindowFrom: '2026-08-06T23:00:00.000Z',
        dispatchWindowTo: '2026-08-07T00:00:00.000Z',
      }),
    ).rejects.toMatchObject({ code: 'CAPABILITY_NOT_IMPLEMENTED' });
    expect(store.find).not.toHaveBeenCalled();
  });

  it('reports the provider verdict and never creates anything', async () => {
    class EnabledFakeConnector extends FakeConnector {
      override identity(): ProviderIdentity {
        return { ...super.identity(), provider: 'bluesky' };
      }

      override async getCapabilities(connection: ConnectionRef) {
        const snapshot = await super.getCapabilities(connection);
        return { ...snapshot, provider: 'bluesky' as const };
      }
    }

    const fake = new EnabledFakeConnector({ clock, instant: true });
    const detected = detectCapabilities(config());
    const verified = new VerifiedConnectorRegistry(
      createConnectorRegistry([fake], { clock }),
      { ...detected, connectors: { ...detected.connectors, bluesky: 'live' as const } },
      config(),
    );
    const connection = details('bluesky');
    const encrypted = await encryptedRecord(connection);
    const gateway = new ConnectorExecutionGateway({
      registry: verified,
      credentials: createWorkspaceCredentialResolver({
        store: storeFor(encrypted.record),
        vault: encrypted.vault,
      }),
      clock,
    });

    const status = await gateway.pollStatus({
      workspaceId,
      connection,
      providerJobId: null,
      externalPostId: null,
      idempotencyKey: 'idem_publish_000000000001',
      contentFingerprint: 'a'.repeat(64),
      dispatchWindowFrom: '2026-08-06T23:00:00.000Z',
      dispatchWindowTo: '2026-08-07T00:00:00.000Z',
    });

    // Nothing was published, so nothing is claimed, and the poll itself created
    // no post: the whole point of this seam is that it cannot.
    expect(status.state).not.toBe('published');
    expect(fake.state.posts).toHaveLength(0);
  });
});
