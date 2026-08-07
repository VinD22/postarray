import { externalAccountSchema, type ExternalAccount } from '@relay/connectors';
import { ID_PREFIXES, newId, type ProviderId } from '@relay/contracts';
import { z } from 'zod';

import type { OAuthConnectionClaim } from '../ports/credentials';
import type { OAuthPendingAccount } from '../ports/oauth-pending';
import type { CredentialVaultPort } from '../types';

import { decryptPendingOAuthGrant } from './oauth-grant';
import type { EncryptedCredential } from '@relay/connectors';

/** Accounts safe to show in the browser and persist before claim. */
export const sanitizedExternalAccountSchema = externalAccountSchema
  .omit({ accountAccessToken: true })
  .extend({
    metadata: z.record(z.string(), z.unknown()).default({}),
  })
  .strict();

export type SanitizedExternalAccount = z.infer<typeof sanitizedExternalAccountSchema>;

export function sanitizeDiscoveredAccounts(
  accounts: readonly ExternalAccount[],
): readonly SanitizedExternalAccount[] {
  return accounts.map((account) => sanitizedExternalAccountSchema.parse(account));
}

export function parseSanitizedAccounts(value: unknown): readonly SanitizedExternalAccount[] {
  return z.array(sanitizedExternalAccountSchema).parse(value);
}

export function toExternalAccountForClaim(
  account: SanitizedExternalAccount | OAuthPendingAccount,
): ExternalAccount {
  return externalAccountSchema.parse({
    ...account,
    metadata: 'metadata' in account && account.metadata !== undefined ? account.metadata : {},
    accountAccessToken: null,
  });
}

async function encryptToken(
  vault: CredentialVaultPort,
  input: {
    readonly workspaceId: string;
    readonly connectionId: string;
    readonly provider: ProviderId;
    readonly credentialKind: 'access_token' | 'refresh_token';
    readonly secret: string;
  },
) {
  return await vault.encrypt({
    secret: input.secret,
    aad: {
      workspaceId: input.workspaceId,
      connectionId: input.connectionId,
      provider: input.provider,
      credentialKind: input.credentialKind,
    },
    purpose: 'oauth_connection_claim',
  });
}

export async function buildOAuthConnectionClaims(input: {
  readonly vault: CredentialVaultPort;
  readonly workspaceId: string;
  readonly transactionId: string;
  readonly provider: ProviderId;
  readonly grantEnvelope: EncryptedCredential;
  readonly accounts: readonly ExternalAccount[];
  readonly existingConnectionIds?: ReadonlyMap<string, string>;
}): Promise<readonly OAuthConnectionClaim[]> {
  const grant = await decryptPendingOAuthGrant(input.vault, {
    workspaceId: input.workspaceId,
    transactionId: input.transactionId,
    provider: input.provider,
    envelope: input.grantEnvelope,
  });
  const claims: OAuthConnectionClaim[] = [];

  for (const account of input.accounts) {
    const connectionId =
      input.existingConnectionIds?.get(account.externalAccountId) ??
      newId(ID_PREFIXES.connection);
    const accessPlaintext =
      account.accountAccessToken === null
        ? grant.accessToken
        : account.accountAccessToken.use((value) => value);
    const accessToken = await encryptToken(input.vault, {
      workspaceId: input.workspaceId,
      connectionId,
      provider: input.provider,
      credentialKind: 'access_token',
      secret: accessPlaintext,
    });
    const refreshToken =
      grant.refreshToken === null
        ? null
        : await encryptToken(input.vault, {
            workspaceId: input.workspaceId,
            connectionId,
            provider: input.provider,
            credentialKind: 'refresh_token',
            secret: grant.refreshToken,
          });

    claims.push({
      connectionId,
      externalAccountId: account.externalAccountId,
      accountType: account.accountType,
      displayName: account.displayName,
      handle: account.handle,
      avatarUrl: account.avatarUrl,
      profileUrl: account.profileUrl,
      grantedScopes: [...account.grantedScopes],
      capabilities: {},
      capabilityVersion: null,
      credential: {
        workspaceId: input.workspaceId,
        connectionId,
        provider: input.provider,
        accessToken,
        refreshToken,
        accessTokenExpiresAt: grant.expiresAt,
        refreshTokenExpiresAt: null,
        lastRefreshedAt: grant.obtainedAt,
        rotatedAt: grant.refreshTokenRotated ? grant.obtainedAt : null,
      },
    });
  }

  return claims;
}
