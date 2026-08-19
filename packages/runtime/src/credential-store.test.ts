import {
  toSocialCredentialStorageWrite,
  type CredentialStoreWrite,
} from '@relay/application';
import {
  createCredentialVault,
  type CredentialAad,
  type EncryptedCredential,
} from '@relay/connectors';
import { ID_PREFIXES, newId, RelayError } from '@relay/contracts';
import type { RelayPrismaClient } from '@relay/database';
import { describe, expect, it, vi } from 'vitest';

import { createCredentialStore } from './credential-store';

const WORKSPACE_ID = newId(ID_PREFIXES.workspace);
const CONNECTION_ID = newId(ID_PREFIXES.connection);
const CREDENTIAL_ID = newId(ID_PREFIXES.credential);
const LOCAL_KEY = Buffer.alloc(32, 29).toString('base64');
const CLOCK_NOW = new Date('2026-08-07T00:00:00.000Z');

const accessAad: CredentialAad = {
  workspaceId: WORKSPACE_ID,
  connectionId: CONNECTION_ID,
  provider: 'x',
  credentialKind: 'access_token',
};
const refreshAad: CredentialAad = { ...accessAad, credentialKind: 'refresh_token' };

interface FakeDatabase {
  readonly tx: {
    readonly $executeRaw: ReturnType<typeof vi.fn>;
    readonly socialConnection: { readonly findFirst: ReturnType<typeof vi.fn> };
    readonly socialCredential: {
      readonly findFirst: ReturnType<typeof vi.fn>;
      readonly upsert: ReturnType<typeof vi.fn>;
      readonly deleteMany: ReturnType<typeof vi.fn>;
    };
  };
  readonly prisma: RelayPrismaClient;
}

function fakeDatabase(row: Record<string, unknown>, provider = 'x'): FakeDatabase {
  const tx = {
    $executeRaw: vi.fn().mockResolvedValue(0),
    socialConnection: {
      findFirst: vi.fn().mockResolvedValue({ provider }),
    },
    socialCredential: {
      findFirst: vi.fn().mockResolvedValue(row),
      upsert: vi.fn().mockResolvedValue(row),
      deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
  };
  const prisma = {
    $transaction: vi.fn(async (callback: (value: typeof tx) => Promise<unknown>) =>
      await callback(tx),
    ),
  } as unknown as RelayPrismaClient;
  return { tx, prisma };
}

async function credentialWrite(): Promise<{
  readonly input: CredentialStoreWrite;
  readonly accessToken: EncryptedCredential;
  readonly refreshToken: EncryptedCredential;
}> {
  const vault = createCredentialVault({ localKeyBase64: LOCAL_KEY });
  const accessToken = await vault.encrypt({ secret: 'access-token-plaintext', aad: accessAad });
  const refreshToken = await vault.encrypt({ secret: 'refresh-token-plaintext', aad: refreshAad });
  return {
    input: {
      workspaceId: WORKSPACE_ID,
      connectionId: CONNECTION_ID,
      provider: 'x',
      accessToken,
      refreshToken,
      accessTokenExpiresAt: '2026-09-07T00:00:00.000Z',
      refreshTokenExpiresAt: '2026-10-07T00:00:00.000Z',
      lastRefreshedAt: CLOCK_NOW.toISOString(),
      rotatedAt: null,
    },
    accessToken,
    refreshToken,
  };
}

function rowFor(input: CredentialStoreWrite): Record<string, unknown> {
  const storage = toSocialCredentialStorageWrite(input);
  return {
    id: CREDENTIAL_ID,
    ...storage,
    lastRefreshError: null,
    createdAt: CLOCK_NOW,
    connection: { provider: input.provider },
  };
}

describe('createCredentialStore', () => {
  it('claims connections, credentials, pending discovery, transaction and audit atomically', async () => {
    const { input: credential } = await credentialWrite();
    const transactionId = newId(ID_PREFIXES.oauthTransaction);
    const tx = {
      $executeRaw: vi.fn().mockResolvedValue(0),
      oAuthTransaction: {
        findFirst: vi.fn().mockResolvedValue({
          id: transactionId, workspaceId: WORKSPACE_ID, projectId: null, provider: 'x',
          stateHash: 'state-hash', consumedAt: null,
          expiresAt: new Date('2026-08-08T00:00:00.000Z'), initiatedByUserId: null,
        }),
        update: vi.fn().mockResolvedValue({}),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
      oAuthPendingDiscovery: {
        findFirst: vi.fn().mockResolvedValue({ consumedAt: null, stateHash: 'state-hash', expiresAt: new Date('2026-08-08T00:00:00.000Z') }),
        update: vi.fn().mockResolvedValue({}),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
      socialConnection: {
        findFirst: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({ id: CONNECTION_ID }),
        update: vi.fn(),
      },
      socialCredential: { upsert: vi.fn().mockResolvedValue({}) },
      auditEvent: { create: vi.fn().mockResolvedValue({}) },
    };
    const prisma = { $transaction: vi.fn(async (callback: (value: typeof tx) => Promise<unknown>) => await callback(tx)) } as unknown as RelayPrismaClient;
    const result = await createCredentialStore(prisma).claimOAuthConnections?.({
      workspaceId: WORKSPACE_ID, transactionId, expectedProvider: 'x', expectedStateHash: 'state-hash',
      claimedAt: CLOCK_NOW.toISOString(),
      actor: { actorType: 'user', actorId: 'user_actor', userId: 'user_actor', surface: 'web', correlationId: 'corr_test', approvalLevel: 'level_3_confirm' },
      connections: [{
        connectionId: CONNECTION_ID, externalAccountId: 'external-1', accountType: 'personal_profile',
        displayName: 'Account', handle: null, avatarUrl: null, profileUrl: null,
        grantedScopes: ['post'], capabilities: {}, capabilityVersion: 'v1', credential,
      }],
    });
    expect(result?.connectionIds).toEqual([CONNECTION_ID]);
    expect(tx.socialConnection.create).toHaveBeenCalledOnce();
    expect(tx.socialCredential.upsert).toHaveBeenCalledOnce();
    expect(tx.auditEvent.create).toHaveBeenCalledOnce();
    expect(tx.oAuthPendingDiscovery.updateMany).toHaveBeenCalledOnce();
    expect(tx.oAuthTransaction.updateMany).toHaveBeenCalledOnce();
    expect(prisma.$transaction).toHaveBeenCalledOnce();
  });

  it('reads only authenticated envelope columns through a workspace scope', async () => {
    const { input } = await credentialWrite();
    const database = fakeDatabase(rowFor(input));
    const store = createCredentialStore(database.prisma);

    const result = await store.find({
      workspaceId: WORKSPACE_ID,
      connectionId: CONNECTION_ID,
      provider: 'x',
    });

    expect(result?.workspaceId).toBe(WORKSPACE_ID);
    expect(result?.accessToken.aadContext).toEqual(accessAad);
    expect(result?.refreshToken?.aadContext).toEqual(refreshAad);
    expect(database.tx.socialCredential.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          connectionId: CONNECTION_ID,
          connection: { is: { provider: 'x' } },
          workspaceId: WORKSPACE_ID,
        },
      }),
    );
  });

  it('upserts envelope bytes and scopes create and update to the workspace', async () => {
    const { input } = await credentialWrite();
    const database = fakeDatabase(rowFor(input));
    const store = createCredentialStore(database.prisma);

    const result = await store.upsert(input);
    const call = database.tx.socialCredential.upsert.mock.calls[0]?.[0] as {
      readonly create: Record<string, unknown>;
      readonly update: Record<string, unknown>;
      readonly where: Record<string, unknown>;
    };

    expect(result.id).toBe(CREDENTIAL_ID);
    expect(call.where).toEqual({ connectionId: CONNECTION_ID, workspaceId: WORKSPACE_ID });
    expect(call.create['workspaceId']).toBe(WORKSPACE_ID);
    expect(call.update['workspaceId']).toBe(WORKSPACE_ID);
    expect(JSON.stringify(call)).not.toContain('access-token-plaintext');
    expect(JSON.stringify(call)).not.toContain('refresh-token-plaintext');
    expect(call.create['accessTokenCiphertext']).toBeInstanceOf(Uint8Array);
  });

  it('rejects a provider mismatch before writing an envelope', async () => {
    const { input } = await credentialWrite();
    const database = fakeDatabase(rowFor(input), 'linkedin');
    const store = createCredentialStore(database.prisma);

    await expect(store.upsert(input)).rejects.toMatchObject({
      code: 'VALIDATION_FAILED',
    });
    expect(database.tx.socialCredential.upsert).not.toHaveBeenCalled();
  });

  it('removes only credentials in the active workspace', async () => {
    const { input } = await credentialWrite();
    const database = fakeDatabase(rowFor(input));
    const store = createCredentialStore(database.prisma);

    await store.remove({ workspaceId: WORKSPACE_ID, connectionId: CONNECTION_ID });
    expect(database.tx.socialCredential.deleteMany).toHaveBeenCalledWith({
      where: { connectionId: CONNECTION_ID, workspaceId: WORKSPACE_ID },
    });
  });

  it('returns not found when the connection is not visible in the workspace', async () => {
    const { input } = await credentialWrite();
    const database = fakeDatabase(rowFor(input));
    database.tx.socialConnection.findFirst.mockResolvedValue(null);
    const store = createCredentialStore(database.prisma);

    const error = await store.upsert(input).catch((cause: unknown) => cause);
    expect(error).toBeInstanceOf(RelayError);
    expect((error as RelayError).code).toBe('NOT_FOUND');
    expect(database.tx.socialCredential.upsert).not.toHaveBeenCalled();
  });
});
