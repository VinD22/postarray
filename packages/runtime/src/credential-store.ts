import {
  fromSocialCredentialStorageRow,
  toSocialCredentialStorageWrite,
  type CredentialStorePort,
  type CredentialStoreWrite,
  type OAuthConnectionClaimRequest,
  type SocialCredentialStorageRow,
  type StoredCredentialRecord,
} from '@relay/application';
import {
  ERROR_CODES,
  RelayError,
  type AccountType,
  type ProviderId,
} from '@relay/contracts';
import {
  appendAuditEvent,
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

function storedAccountType(accountType: AccountType): string {
  switch (accountType) {
    case 'creator_profile':
      return 'creator_account';
    case 'business_profile':
      return 'business_account';
    case 'board':
      return 'business_account';
    case 'community':
      return 'group';
    case 'publication':
      return 'organization';
    default:
      return accountType;
  }
}

function storedActorType(
  actorType: OAuthConnectionClaimRequest['actor']['actorType'],
): 'user' | 'service_account' | 'oauth_client' | 'system' {
  return actorType === 'oauth_app' ? 'oauth_client' : actorType;
}

function storedSurface(
  surface: OAuthConnectionClaimRequest['actor']['surface'],
): 'web' | 'api' | 'mcp' | 'cli' | 'rss' | 'automation_rule' | 'import' {
  return surface === 'agent' ? 'api' : surface;
}

async function appendClaimAudit(
  db: WorkspaceScopedClient,
  request: OAuthConnectionClaimRequest,
  connectionId: string,
  provider: ProviderId,
): Promise<void> {
  const actor = request.actor;
  await appendAuditEvent(db as never, {
    workspaceId: request.workspaceId,
    actor: {
      type: storedActorType(actor.actorType),
      ...(actor.userId === null ? {} : { id: actor.userId }),
      ...(actor.clientId === undefined ? {} : { clientId: actor.clientId }),
    },
    surface: storedSurface(actor.surface),
    action: 'connection.connected',
    target: { type: 'social_connection', id: connectionId },
    after: { provider, phase: 'claim' },
    metadata: {
      contractSurface: actor.surface,
      approvalLevel: actor.approvalLevel,
      transactionId: request.transactionId,
    },
    ...(actor.ipAddress === undefined ? {} : { ipAddress: actor.ipAddress }),
    ...(actor.userAgent === undefined ? {} : { userAgent: actor.userAgent }),
    correlationId: actor.correlationId,
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

    async claimOAuthConnections(input: OAuthConnectionClaimRequest) {
      return await withWorkspaceContext(
        prisma,
        { workspaceId: input.workspaceId, role: 'service_role' },
        async (db) => {
          const now = new Date(input.claimedAt);
          const transaction = await db.oAuthTransaction.findFirst({
            where: { id: input.transactionId, workspaceId: input.workspaceId },
          });
          if (transaction === null) {
            throw new RelayError(ERROR_CODES.NOT_FOUND, {
              messageKey: 'errors.not_found.oauth_transaction',
              details: { transactionId: input.transactionId },
            });
          }
          const reconnectConnectionId = transaction.reconnectConnectionId;
          if (transaction.consumedAt !== null) {
            throw new RelayError(ERROR_CODES.VALIDATION_FAILED, {
              messageKey: 'errors.oauth_transaction_consumed',
              details: { transactionId: input.transactionId },
            });
          }
          if (transaction.expiresAt.getTime() <= now.getTime()) {
            throw new RelayError(ERROR_CODES.VALIDATION_FAILED, {
              messageKey: 'errors.oauth_transaction_expired',
              details: { transactionId: input.transactionId },
            });
          }
          if (transaction.stateHash !== input.expectedStateHash) {
            throw new RelayError(ERROR_CODES.VALIDATION_FAILED, {
              messageKey: 'errors.oauth_state_mismatch',
              details: {},
            });
          }
          if (transaction.provider !== input.expectedProvider) {
            throw new RelayError(ERROR_CODES.VALIDATION_FAILED, {
              messageKey: 'error.request_invalid.message',
              details: { reason: 'OAUTH_PROVIDER_MISMATCH' },
            });
          }

          const pending = await db.oAuthPendingDiscovery.findFirst({
            where: { transactionId: input.transactionId, workspaceId: input.workspaceId },
          });
          if (pending === null || pending.consumedAt !== null) {
            throw new RelayError(ERROR_CODES.NOT_FOUND, {
              messageKey: 'error.not_found.message',
              details: { resource: 'oauth_pending_discovery' },
            });
          }
          if (pending.expiresAt.getTime() <= now.getTime()) {
            throw new RelayError(ERROR_CODES.VALIDATION_FAILED, {
              messageKey: 'errors.oauth_transaction_expired',
              details: { transactionId: input.transactionId },
            });
          }
          if (pending.stateHash !== input.expectedStateHash) {
            throw new RelayError(ERROR_CODES.VALIDATION_FAILED, {
              messageKey: 'errors.oauth_state_mismatch',
              details: {},
            });
          }

          const consumedTransaction = await db.oAuthTransaction.updateMany({
            where: {
              id: input.transactionId,
              workspaceId: input.workspaceId,
              consumedAt: null,
              expiresAt: { gt: now },
              provider: input.expectedProvider,
              stateHash: input.expectedStateHash,
            },
            data: { consumedAt: now },
          });
          if (consumedTransaction.count !== 1) {
            throw new RelayError(ERROR_CODES.VALIDATION_FAILED, {
              messageKey: 'errors.oauth_transaction_consumed',
              details: { transactionId: input.transactionId },
            });
          }
          const consumedPending = await db.oAuthPendingDiscovery.updateMany({
            where: {
              transactionId: input.transactionId,
              workspaceId: input.workspaceId,
              consumedAt: null,
              expiresAt: { gt: now },
              provider: input.expectedProvider,
              stateHash: input.expectedStateHash,
            },
            data: { consumedAt: now },
          });
          if (consumedPending.count !== 1) {
            throw new RelayError(ERROR_CODES.VALIDATION_FAILED, {
              messageKey: 'errors.oauth_transaction_consumed',
              details: { transactionId: input.transactionId },
            });
          }

          if (input.connections.length === 0) {
            throw new RelayError(ERROR_CODES.VALIDATION_FAILED, {
              messageKey: 'error.request_invalid.message',
              details: { reason: 'OAUTH_ACCOUNT_SELECTION_EMPTY' },
            });
          }

          const connectionIds: string[] = [];
          if (
            reconnectConnectionId !== null &&
            reconnectConnectionId !== undefined &&
            input.connections.length !== 1
          ) {
            throw new RelayError(ERROR_CODES.VALIDATION_FAILED, {
              messageKey: 'error.request_invalid.message',
              details: { reason: 'OAUTH_RECONNECT_SINGLE_ACCOUNT' },
            });
          }
          for (const claim of input.connections) {
            if (claim.credential.workspaceId !== input.workspaceId) {
              throw new RelayError(ERROR_CODES.VALIDATION_FAILED, {
                messageKey: 'error.request_invalid.message',
                details: { reason: 'OAUTH_CLAIM_WORKSPACE_MISMATCH' },
              });
            }
            if (claim.credential.provider !== input.expectedProvider) {
              throw providerMismatch(input.expectedProvider, claim.credential.provider);
            }

            let existing: { id: string; status: string; externalAccountId?: string } | null;
            if (reconnectConnectionId !== null && reconnectConnectionId !== undefined) {
              existing = await db.socialConnection.findFirst({
                where: { id: reconnectConnectionId, workspaceId: input.workspaceId },
                select: { id: true, status: true, externalAccountId: true },
              });
              if (existing === null) {
                throw new RelayError(ERROR_CODES.NOT_FOUND, {
                  messageKey: 'error.not_found.message',
                  details: { resource: 'social_connection', connectionId: reconnectConnectionId },
                });
              }
              if (existing.externalAccountId !== claim.externalAccountId) {
                throw new RelayError(ERROR_CODES.VALIDATION_FAILED, {
                  messageKey: 'error.request_invalid.message',
                  details: { reason: 'OAUTH_RECONNECT_ACCOUNT_MISMATCH' },
                });
              }
              if (claim.connectionId !== reconnectConnectionId) {
                throw new RelayError(ERROR_CODES.VALIDATION_FAILED, {
                  messageKey: 'error.request_invalid.message',
                  details: { reason: 'OAUTH_RECONNECT_CONNECTION_MISMATCH' },
                });
              }
            } else {
              existing = await db.socialConnection.findFirst({
                where: {
                  workspaceId: input.workspaceId,
                  provider: input.expectedProvider,
                  externalAccountId: claim.externalAccountId,
                },
                select: { id: true, status: true },
              });
            }

            const connection =
              existing === null
                ? await db.socialConnection.create({
                    data: {
                      id: claim.connectionId,
                      workspaceId: input.workspaceId,
                      projectId: transaction.projectId,
                      provider: input.expectedProvider,
                      externalAccountId: claim.externalAccountId,
                      accountType: storedAccountType(claim.accountType) as never,
                      displayName: claim.displayName,
                      handle: claim.handle,
                      avatarUrl: claim.avatarUrl,
                      profileUrl: claim.profileUrl,
                      status: 'active',
                      statusReason: null,
                      grantedScopes: [...claim.grantedScopes],
                      capabilities: claim.capabilities as Prisma.InputJsonValue,
                      capabilityVersion: claim.capabilityVersion,
                      capabilitiesRefreshedAt: now,
                      connectedAt: now,
                      ...(transaction.initiatedByUserId === null
                        ? {}
                        : { createdByUserId: transaction.initiatedByUserId }),
                    },
                    select: { id: true },
                  })
                : await db.socialConnection.update({
                    where: { id: existing.id },
                    data: {
                      projectId: transaction.projectId,
                      displayName: claim.displayName,
                      handle: claim.handle,
                      avatarUrl: claim.avatarUrl,
                      profileUrl: claim.profileUrl,
                      status: 'active',
                      statusReason: null,
                      grantedScopes: [...claim.grantedScopes],
                      capabilities: claim.capabilities as Prisma.InputJsonValue,
                      capabilityVersion: claim.capabilityVersion,
                      capabilitiesRefreshedAt: now,
                      disconnectedAt: null,
                    },
                    select: { id: true },
                  });

            const storage = toPrismaWrite(claim.credential);
            await db.socialCredential.upsert({
              where: { connectionId: connection.id },
              create: { ...storage, connectionId: connection.id },
              update: storage,
            });
            await appendClaimAudit(db, input, connection.id, input.expectedProvider);
            connectionIds.push(connection.id);
          }

          return { connectionIds };
        },
      );
    },
  };
}
