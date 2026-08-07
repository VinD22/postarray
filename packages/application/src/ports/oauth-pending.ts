import type { AccountType, ProviderId } from '@relay/contracts';
import type { EncryptedCredential } from '@relay/connectors';

export interface OAuthPendingAccount {
  readonly externalAccountId: string;
  readonly accountType: AccountType;
  readonly displayName: string;
  readonly handle: string | null;
  readonly avatarUrl: string | null;
  readonly profileUrl: string | null;
  readonly parentExternalId: string | null;
  readonly grantedScopes: readonly string[];
  readonly eligible: boolean;
  readonly ineligibleReasonKey: string | null;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface OAuthPendingDiscoveryRecord {
  readonly transactionId: string;
  readonly workspaceId: string;
  readonly brandId: string | null;
  readonly provider: ProviderId;
  readonly stateHash: string;
  readonly accounts: readonly OAuthPendingAccount[];
  readonly grant: EncryptedCredential;
  readonly expiresAt: string;
  readonly consumedAt: string | null;
}

export interface OAuthPendingDiscoveryPort {
  create(input: OAuthPendingDiscoveryRecord): Promise<void>;
  find(input: { readonly workspaceId: string; readonly transactionId: string }): Promise<OAuthPendingDiscoveryRecord | null>;
}

export interface OAuthAccountSelectionView {
  readonly transactionId: string;
  readonly provider: ProviderId;
  readonly expiresAt: string;
  readonly accounts: readonly OAuthPendingAccount[];
}
