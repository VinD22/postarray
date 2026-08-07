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
