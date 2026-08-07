import {
  fromSocialCredentialStorageRow,
  toSocialCredentialStorageWrite,
  type CredentialStorePort,
  type CredentialStoreWrite,
  type SocialCredentialStorageRow,
  type StoredCredentialRecord,
} from '@relay/application';
import {
  ERROR_CODES,
  RelayError,
  type ProviderId,
} from '@relay/contracts';
import {
  Prisma,
  withWorkspaceContext,
  type RelayPrismaClient,
  type WorkspaceScopedClient,
} from '@relay/database';

/**
 * The credential adapter deliberately selects only envelope columns. A
 * plaintext token is never a Prisma field and therefore cannot cross this
 * boundary by accident.
 */
const credentialSelect = {
  id: true,
  workspaceId: true,
  connectionId: true,
  accessTokenCiphertext: true,
  accessTokenNonce: true,
  accessTokenAuthTag: true,
  refreshTokenCiphertext: true,
  refreshTokenNonce: true,
  refreshTokenAuthTag: true,
  algorithm: true,
  keyVersion: true,
  accessTokenWrappedDataKey: true,
  refreshTokenWrappedDataKey: true,
  accessTokenAadContext: true,
  refreshTokenAadContext: true,
  envelopeVersion: true,
  accessTokenExpiresAt: true,
  refreshTokenExpiresAt: true,
  lastRefreshedAt: true,
  lastRefreshError: true,
  rotatedAt: true,
  createdAt: true,
  connection: { select: { provider: true } },
} satisfies Prisma.SocialCredentialSelect;

type CredentialQueryRow = Prisma.SocialCredentialGetPayload<{
  select: typeof credentialSelect;
}>;

function toStorageRow(row: CredentialQueryRow): SocialCredentialStorageRow {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    connectionId: row.connectionId,
    provider: row.connection.provider,
    accessTokenCiphertext: row.accessTokenCiphertext,
    accessTokenNonce: row.accessTokenNonce,
    accessTokenAuthTag: row.accessTokenAuthTag,
    refreshTokenCiphertext: row.refreshTokenCiphertext,
    refreshTokenNonce: row.refreshTokenNonce,
    refreshTokenAuthTag: row.refreshTokenAuthTag,
    algorithm: row.algorithm,
    keyVersion: row.keyVersion,
    accessTokenWrappedDataKey: row.accessTokenWrappedDataKey,
    refreshTokenWrappedDataKey: row.refreshTokenWrappedDataKey,
    accessTokenAadContext: row.accessTokenAadContext,
    refreshTokenAadContext: row.refreshTokenAadContext,
    envelopeVersion: row.envelopeVersion,
    accessTokenExpiresAt: row.accessTokenExpiresAt,
    refreshTokenExpiresAt: row.refreshTokenExpiresAt,
    lastRefreshedAt: row.lastRefreshedAt,
    lastRefreshError: row.lastRefreshError,
    rotatedAt: row.rotatedAt,
    createdAt: row.createdAt,
  };
}

function connectionNotFound(connectionId: string): RelayError {
  return new RelayError(ERROR_CODES.NOT_FOUND, {
    messageKey: 'errors.not_found.connection',
    details: { resource: 'connection', connectionId },
  });
}

function providerMismatch(expected: ProviderId, actual: string): RelayError {
  return new RelayError(ERROR_CODES.VALIDATION_FAILED, {
    messageKey: 'error.request_invalid.message',
    details: { reason: 'credential_provider_mismatch', expected, actual },
  });
}

/** Prisma 6's Bytes type is backed by an ArrayBuffer, not SharedArrayBuffer. */
function prismaBytes(value: Uint8Array): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(new ArrayBuffer(value.byteLength));
  bytes.set(value);
  return bytes;
}

function toPrismaWrite(input: CredentialStoreWrite): {
  readonly workspaceId: string;
  readonly connectionId: string;
  readonly accessTokenCiphertext: Uint8Array<ArrayBuffer>;
  readonly accessTokenNonce: Uint8Array<ArrayBuffer>;
  readonly accessTokenAuthTag: Uint8Array<ArrayBuffer>;
  readonly refreshTokenCiphertext: Uint8Array<ArrayBuffer> | null;
  readonly refreshTokenNonce: Uint8Array<ArrayBuffer> | null;
  readonly refreshTokenAuthTag: Uint8Array<ArrayBuffer> | null;
  readonly algorithm: string;
  readonly keyVersion: string;
  readonly accessTokenWrappedDataKey: Uint8Array<ArrayBuffer>;
  readonly refreshTokenWrappedDataKey: Uint8Array<ArrayBuffer> | null;
  readonly accessTokenAadContext: Record<string, string>;
  readonly refreshTokenAadContext: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
  readonly envelopeVersion: number;
  readonly accessTokenExpiresAt: Date | null;
  readonly refreshTokenExpiresAt: Date | null;
  readonly lastRefreshedAt: Date | null;
  readonly lastRefreshError: string | null;
  readonly rotatedAt: Date | null;
} {
  const storage = toSocialCredentialStorageWrite(input);
  return {
    workspaceId: storage.workspaceId,
    connectionId: storage.connectionId,
    accessTokenCiphertext: prismaBytes(storage.accessTokenCiphertext),
    accessTokenNonce: prismaBytes(storage.accessTokenNonce),
    accessTokenAuthTag: prismaBytes(storage.accessTokenAuthTag),
    refreshTokenCiphertext:
      storage.refreshTokenCiphertext === null
        ? null
        : prismaBytes(storage.refreshTokenCiphertext),
    refreshTokenNonce:
      storage.refreshTokenNonce === null ? null : prismaBytes(storage.refreshTokenNonce),
    refreshTokenAuthTag:
      storage.refreshTokenAuthTag === null ? null : prismaBytes(storage.refreshTokenAuthTag),
    algorithm: storage.algorithm,
    keyVersion: storage.keyVersion,
    accessTokenWrappedDataKey: prismaBytes(storage.accessTokenWrappedDataKey),
    refreshTokenWrappedDataKey:
      storage.refreshTokenWrappedDataKey === null
        ? null
        : prismaBytes(storage.refreshTokenWrappedDataKey),
    accessTokenAadContext: { ...storage.accessTokenAadContext },
    refreshTokenAadContext:
      storage.refreshTokenAadContext === null
        ? Prisma.DbNull
        : { ...storage.refreshTokenAadContext },
    envelopeVersion: storage.envelopeVersion,
    accessTokenExpiresAt: storage.accessTokenExpiresAt,
    refreshTokenExpiresAt: storage.refreshTokenExpiresAt,
    lastRefreshedAt: storage.lastRefreshedAt,
    lastRefreshError: storage.lastRefreshError,
    rotatedAt: storage.rotatedAt,
  };
}

async function readRow(
  db: WorkspaceScopedClient,
  input: { readonly connectionId: string; readonly provider: ProviderId },
): Promise<CredentialQueryRow | null> {
  return await db.socialCredential.findFirst({
    where: {
      connectionId: input.connectionId,
      connection: { is: { provider: input.provider } },
    },
    select: credentialSelect,
  });
}

/**
 * Build a tenant-scoped credential store over the private Prisma model.
 *
 * Every method opens an RLS transaction and uses the workspace proxy. The
 * application port carries only authenticated envelopes, so this adapter has
 * no operation that accepts or returns a plaintext secret.
 */
export function createCredentialStore(prisma: RelayPrismaClient): CredentialStorePort {
  return {
    async find(input): Promise<StoredCredentialRecord | null> {
      return await withWorkspaceContext(
        prisma,
        { workspaceId: input.workspaceId, role: 'service_role' },
        async (db) => {
          const row = await readRow(db, input);
          return row === null ? null : fromSocialCredentialStorageRow(toStorageRow(row));
        },
      );
    },

    async upsert(input: CredentialStoreWrite) {
      return await withWorkspaceContext(
        prisma,
        { workspaceId: input.workspaceId, role: 'service_role' },
        async (db) => {
          // Check the provider on the tenant-scoped connection before writing.
          // This prevents an envelope authenticated for one provider from being
          // attached to a different connection through a caller bug.
          const connection = await db.socialConnection.findFirst({
            where: { id: input.connectionId },
            select: { provider: true },
          });
          if (connection === null) throw connectionNotFound(input.connectionId);
          if (connection.provider !== input.provider) {
            throw providerMismatch(input.provider, connection.provider);
          }

          const storage = toPrismaWrite(input);
          await db.socialCredential.upsert({
            where: { connectionId: input.connectionId },
            create: storage,
            update: storage,
          });
          const row = await readRow(db, input);
          if (row === null) {
            throw new RelayError(ERROR_CODES.INTERNAL, {
              messageKey: 'error.internal.message',
              details: { reason: 'credential_upsert_not_readable' },
            });
          }
          return fromSocialCredentialStorageRow(toStorageRow(row));
        },
      );
    },

    async remove(input): Promise<void> {
      await withWorkspaceContext(
        prisma,
        { workspaceId: input.workspaceId, role: 'service_role' },
        async (db) => {
          await db.socialCredential.deleteMany({ where: { connectionId: input.connectionId } });
        },
      );
    },
  };
}
