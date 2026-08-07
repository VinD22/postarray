import type { CredentialStorePort, StoredCredentialRecord } from '@relay/application';
import { ERROR_CODES, RelayError } from '@relay/contracts';
import { credentialResultSchema, connectionRefSchema } from '@relay/connectors';
import type {
  ConnectionRef,
  CredentialResult,
  CredentialVault,
  SecretHandle,
} from '@relay/connectors';

/** Connection metadata safe to carry through an activity input. */
export type ConnectionDetails = Omit<ConnectionRef, 'accessToken'>;

/** A connection plus short-lived handles, never plaintext token strings. */
export interface LeasedConnection {
  readonly connection: ConnectionRef;
  readonly record: StoredCredentialRecord;
  readonly refreshToken: SecretHandle | null;
  release(): void;
}

export interface WorkspaceCredentialResolver {
  lease(input: {
    readonly workspaceId: string;
    readonly connection: ConnectionDetails;
    readonly purpose: string;
  }): Promise<LeasedConnection>;
  persistRefresh(input: {
    readonly connection: ConnectionDetails;
    readonly previous: StoredCredentialRecord;
    readonly result: CredentialResult;
    readonly refreshedAt: string;
  }): Promise<void>;
}

const connectionDetailsSchema = connectionRefSchema.omit({ accessToken: true });

function executionError(
  code: (typeof ERROR_CODES)[keyof typeof ERROR_CODES],
  reason: string,
  details: Record<string, unknown> = {},
): RelayError {
  return new RelayError(code, {
    messageKey:
      code === ERROR_CODES.NOT_FOUND
        ? 'error.connection_not_found.message'
        : code === ERROR_CODES.CAPABILITY_UNSUPPORTED
          ? 'error.capability_unsupported.message'
          : code === ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED
            ? 'errors.capability_not_implemented'
            : 'error.internal.message',
    details: { reason, ...details },
  });
}

export function assertWorkspaceBinding(
  workspaceId: string,
  connection: ConnectionDetails,
): ConnectionDetails {
  const parsed = connectionDetailsSchema.safeParse(connection);
  if (!parsed.success) {
    throw executionError(ERROR_CODES.VALIDATION_FAILED, 'connection_details_invalid');
  }
  if (parsed.data.workspaceId !== workspaceId) {
    throw executionError(ERROR_CODES.FORBIDDEN, 'connection_workspace_mismatch');
  }
  return parsed.data;
}

function missingCredential(): RelayError {
  return executionError(ERROR_CODES.NOT_FOUND, 'credential_unavailable');
}

export function sameConnection(
  record: StoredCredentialRecord,
  connection: ConnectionDetails,
): boolean {
  return (
    record.workspaceId === connection.workspaceId &&
    record.connectionId === connection.connectionId &&
    record.provider === connection.provider
  );
}

/**
 * Resolve an encrypted record only within the caller's workspace and turn it
 * into handles that expire and redact themselves. The store is expected to be
 * RLS-backed; the explicit returned-row check is the second application-side
 * boundary when a repository or test double is misconfigured.
 */
export function createWorkspaceCredentialResolver(input: {
  readonly store: CredentialStorePort;
  readonly vault: CredentialVault;
}): WorkspaceCredentialResolver {
  return {
    async lease({ workspaceId, connection, purpose }): Promise<LeasedConnection> {
      const bound = assertWorkspaceBinding(workspaceId, connection);
      const record = await input.store.find({
        workspaceId,
        connectionId: bound.connectionId,
        provider: bound.provider,
      });
      if (record === null || !sameConnection(record, bound)) {
        throw missingCredential();
      }

      let accessToken: SecretHandle | null = null;
      let refreshToken: SecretHandle | null = null;
      try {
        accessToken = await input.vault.decryptForRequest({
          record: record.accessToken,
          aad: {
            workspaceId,
            connectionId: bound.connectionId,
            provider: bound.provider,
            credentialKind: 'access_token',
          },
          purpose,
        });
        if (record.refreshToken !== null) {
          refreshToken = await input.vault.decryptForRequest({
            record: record.refreshToken,
            aad: {
              workspaceId,
              connectionId: bound.connectionId,
              provider: bound.provider,
              credentialKind: 'refresh_token',
            },
            purpose,
          });
        }
      } catch (error: unknown) {
        accessToken?.release();
        refreshToken?.release();
        throw error;
      }

      const leasedAccessToken = accessToken;
      if (leasedAccessToken === null) {
        throw executionError(ERROR_CODES.INTERNAL, 'access_token_handle_missing');
      }

      return {
        connection: { ...bound, accessToken: leasedAccessToken },
        record,
        refreshToken,
        release(): void {
          leasedAccessToken.release();
          refreshToken?.release();
        },
      };
    },

    async persistRefresh({ connection, previous, result, refreshedAt }): Promise<void> {
      const bound = connectionDetailsSchema.parse(connection);
      if (!sameConnection(previous, bound)) {
        throw executionError(ERROR_CODES.FORBIDDEN, 'credential_workspace_mismatch');
      }
      const parsed = credentialResultSchema.parse(result);
      const accessToken = await input.vault.encrypt({
        secret: parsed.accessToken,
        aad: {
          workspaceId: bound.workspaceId,
          connectionId: bound.connectionId,
          provider: bound.provider,
          credentialKind: 'access_token',
        },
        purpose: 'refresh_store',
      });

      let refreshToken = previous.refreshToken;
      if (parsed.refreshToken !== null) {
        refreshToken = await input.vault.encrypt({
          secret: parsed.refreshToken,
          aad: {
            workspaceId: bound.workspaceId,
            connectionId: bound.connectionId,
            provider: bound.provider,
            credentialKind: 'refresh_token',
          },
          purpose: 'refresh_store',
        });
      }
      if (parsed.refreshTokenRotated && refreshToken === null) {
        throw executionError(ERROR_CODES.INTERNAL, 'rotated_refresh_token_missing');
      }

      await input.store.upsert({
        workspaceId: bound.workspaceId,
        connectionId: bound.connectionId,
        provider: bound.provider,
        accessToken,
        refreshToken,
        accessTokenExpiresAt: parsed.expiresAt,
        refreshTokenExpiresAt: previous.refreshTokenExpiresAt,
        lastRefreshedAt: refreshedAt,
        rotatedAt: parsed.refreshTokenRotated ? refreshedAt : previous.rotatedAt,
      });
    },
  };
}
