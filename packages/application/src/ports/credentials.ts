import type { ProviderId } from '@relay/contracts';
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
}
