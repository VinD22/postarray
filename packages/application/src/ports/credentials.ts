import type { AccountType, ApprovalLevel, CreationSurface, ProviderId } from '@relay/contracts';
import type { EncryptedCredential } from '@relay/connectors';

/**
 * The application-facing credential record.
 *
 * This port deliberately carries encrypted envelopes only. A worker may hand
 * an envelope to the connector vault, but no application service, transport
 * or workflow is allowed to receive a plaintext token from this boundary.
 */
export interface StoredCredentialRecord {
  readonly id: string;
  readonly workspaceId: string;
  readonly connectionId: string;
  readonly provider: ProviderId;
  readonly accessToken: EncryptedCredential;
  readonly refreshToken: EncryptedCredential | null;
  readonly accessTokenExpiresAt: string | null;
  readonly refreshTokenExpiresAt: string | null;
  readonly lastRefreshedAt: string | null;
  readonly lastRefreshError: string | null;
  readonly rotatedAt: string | null;
}

export interface CredentialStoreWrite {
  readonly workspaceId: string;
  readonly connectionId: string;
  readonly provider: ProviderId;
  readonly accessToken: EncryptedCredential;
  readonly refreshToken: EncryptedCredential | null;
  readonly accessTokenExpiresAt: string | null;
  readonly refreshTokenExpiresAt: string | null;
  readonly lastRefreshedAt: string | null;
  readonly rotatedAt: string | null;
}

/**
 * Public provider data that may be persisted beside an encrypted credential.
 * Provider-specific metadata is deliberately excluded: an OAuth response must
 * not become an unreviewed JSON storage boundary.
 */
export interface OAuthConnectionClaim {
  readonly connectionId: string;
  readonly externalAccountId: string;
  readonly accountType: AccountType;
  readonly displayName: string;
  readonly handle: string | null;
  readonly avatarUrl: string | null;
  readonly profileUrl: string | null;
  readonly grantedScopes: readonly string[];
  readonly credential: CredentialStoreWrite;
}

/**
 * Context required to append the connection audit events in the same database
 * transaction as the OAuth claim. Raw state, codes, verifiers and tokens are
 * intentionally absent.
 */
export interface OAuthConnectionClaimActor {
  readonly actorType: 'user' | 'service_account' | 'oauth_app' | 'system';
  readonly actorId: string;
  readonly userId: string | null;
  readonly surface: CreationSurface;
  readonly correlationId: string;
  readonly approvalLevel: ApprovalLevel;
  readonly clientId?: string;
  readonly ipAddress?: string;
  readonly userAgent?: string;
}

export interface OAuthConnectionClaimRequest {
  readonly workspaceId: string;
  readonly transactionId: string;
  readonly expectedProvider: ProviderId;
  readonly expectedStateHash: string;
  readonly claimedAt: string;
  readonly actor: OAuthConnectionClaimActor;
  readonly connections: readonly OAuthConnectionClaim[];
}

/**
 * Workspace-scoped persistence for envelope-encrypted provider credentials.
 * Implementations must use a workspace-scoped repository and an atomic
 * upsert. `connectionId` is not a sufficient tenant boundary by itself.
 */
export interface CredentialStorePort {
  find(input: {
    readonly workspaceId: string;
    readonly connectionId: string;
    readonly provider: ProviderId;
  }): Promise<StoredCredentialRecord | null>;
  upsert(input: CredentialStoreWrite): Promise<StoredCredentialRecord>;
  remove(input: { readonly workspaceId: string; readonly connectionId: string }): Promise<void>;
  /**
   * Atomically consume one still-live OAuth transaction, create or reconnect
   * every selected tenant connection, write its authenticated envelopes and
   * append its audit event. Implementations must reject a consumed, expired,
   * wrong-provider or wrong-state transaction without writing any row.
   *
   * This is optional so deployments without the transactional adapter fail
   * closed. Calling `upsert` after separately creating a connection is not an
   * acceptable fallback because it can leave a credentialless active row.
   */
  claimOAuthConnections?(
    input: OAuthConnectionClaimRequest,
  ): Promise<{ readonly connectionIds: readonly string[] }>;
}
