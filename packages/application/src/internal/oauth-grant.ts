import {
  credentialResultSchema,
  SecretValue,
  type CredentialResult,
  type EncryptedCredential,
} from '@relay/connectors';
import { RelayError, type ProviderId } from '@relay/contracts';
import { z } from 'zod';

import type { CredentialVaultPort } from '../types';
const pendingOAuthGrantSchema = z
  .object({
    accessToken: z.string().min(1),
    refreshToken: z.string().nullable(),
    tokenType: z.string().min(1),
    expiresAt: z.string().nullable(),
    grantedScopes: z.array(z.string().min(1)),
    refreshTokenRotated: z.boolean(),
    obtainedAt: z.string().min(1),
  })
  .strict();

export type PendingOAuthGrant = z.infer<typeof pendingOAuthGrantSchema>;

export function serializeCredentialResult(credential: CredentialResult): PendingOAuthGrant {
  const accessToken = credential.accessToken.use((value) => value);
  const refreshToken =
    credential.refreshToken === null ? null : credential.refreshToken.use((value) => value);
  return pendingOAuthGrantSchema.parse({
    accessToken,
    refreshToken,
    tokenType: credential.tokenType,
    expiresAt: credential.expiresAt,
    grantedScopes: [...credential.grantedScopes],
    refreshTokenRotated: credential.refreshTokenRotated,
    obtainedAt: credential.obtainedAt,
  });
}

export function pendingGrantAad(input: {
  readonly workspaceId: string;
  readonly transactionId: string;
  readonly provider: ProviderId;
}): {
  workspaceId: string;
  connectionId: string;
  provider: ProviderId;
  credentialKind: 'provider_secret';
} {
  return {
    workspaceId: input.workspaceId,
    connectionId: input.transactionId,
    provider: input.provider,
    credentialKind: 'provider_secret',
  };
}

export async function encryptPendingOAuthGrant(
  vault: CredentialVaultPort,
  input: {
    readonly workspaceId: string;
    readonly transactionId: string;
    readonly provider: ProviderId;
    readonly grant: PendingOAuthGrant;
  },
): Promise<EncryptedCredential> {
  return await vault.encrypt({
    secret: JSON.stringify(input.grant),
    aad: pendingGrantAad(input),
    purpose: 'oauth_pending_grant',
  });
}

export async function decryptPendingOAuthGrant(
  vault: CredentialVaultPort,
  input: {
    readonly workspaceId: string;
    readonly transactionId: string;
    readonly provider: ProviderId;
    readonly envelope: EncryptedCredential;
  },
): Promise<PendingOAuthGrant> {
  if (vault.decrypt === undefined) {
    throw new RelayError('CAPABILITY_NOT_IMPLEMENTED', {
      messageKey: 'errors.capability_not_implemented',
      details: { capability: 'credential_vault_decrypt' },
    });
  }
  const plaintext = await vault.decrypt({
    record: input.envelope,
    aad: pendingGrantAad(input),
    purpose: 'oauth_pending_grant',
  });
  try {
    return pendingOAuthGrantSchema.parse(JSON.parse(plaintext));
  } catch (cause) {
    throw new RelayError('INTERNAL', {
      messageKey: 'error.internal.message',
      details: { reason: 'oauth_pending_grant_invalid' },
      cause,
    });
  }
}

export function credentialResultFromPendingGrant(grant: PendingOAuthGrant): CredentialResult {
  return credentialResultSchema.parse({
    accessToken: new SecretValue(grant.accessToken, 'access_token'),
    refreshToken:
      grant.refreshToken === null ? null : new SecretValue(grant.refreshToken, 'refresh_token'),
    tokenType: grant.tokenType,
    expiresAt: grant.expiresAt,
    grantedScopes: grant.grantedScopes,
    refreshTokenRotated: grant.refreshTokenRotated,
    obtainedAt: grant.obtainedAt,
  });
}
