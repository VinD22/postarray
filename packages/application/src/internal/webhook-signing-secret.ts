import type { EncryptedCredential } from '@relay/connectors';
import { RelayError, ERROR_CODES } from '@relay/contracts';

import {
  webhookPreviousSigningSecretEnvelopeFromRow,
  webhookSigningSecretEnvelopeFromRow,
} from '../webhook-signing-secret-envelope';
import type { CredentialVaultPort } from '../types';

const WEBHOOK_SIGNING_PROVIDER = 'webhook';

export function webhookSigningSecretAad(input: {
  readonly workspaceId: string;
  readonly endpointId: string;
}): {
  workspaceId: string;
  connectionId: string;
  provider: string;
  credentialKind: 'provider_secret';
} {
  return {
    workspaceId: input.workspaceId,
    connectionId: input.endpointId,
    provider: WEBHOOK_SIGNING_PROVIDER,
    credentialKind: 'provider_secret',
  };
}

export function requireWebhookSigningVault(
  vault: CredentialVaultPort | undefined,
): CredentialVaultPort {
  if (vault === undefined) {
    throw new RelayError(ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED, {
      messageKey: 'errors.capability_not_implemented',
      details: { reason: 'webhook_signing_vault_unavailable' },
    });
  }
  return vault;
}

export async function encryptWebhookSigningSecret(
  vault: CredentialVaultPort,
  input: {
    readonly workspaceId: string;
    readonly endpointId: string;
    readonly signingSecret: string;
  },
): Promise<EncryptedCredential> {
  return await vault.encrypt({
    secret: input.signingSecret,
    aad: webhookSigningSecretAad(input),
    purpose: 'webhook_signing_secret',
  });
}

export async function decryptWebhookSigningSecret(
  vault: CredentialVaultPort,
  input: {
    readonly workspaceId: string;
    readonly endpointId: string;
    readonly envelope: EncryptedCredential;
  },
): Promise<string> {
  if (vault.decrypt === undefined) {
    throw new RelayError(ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED, {
      messageKey: 'errors.capability_not_implemented',
      details: { reason: 'webhook_signing_vault_decrypt_unavailable' },
    });
  }
  return await vault.decrypt({
    record: input.envelope,
    aad: webhookSigningSecretAad(input),
    purpose: 'webhook_signing_secret',
  });
}

export type WebhookSigningSecretRow = {
  readonly workspaceId: string;
  readonly id: string;
  readonly secretCiphertext: Uint8Array;
  readonly secretNonce: Uint8Array;
  readonly secretAuthTag: Uint8Array | null;
  readonly secretWrappedDataKey: Uint8Array | null;
  readonly keyVersion: string;
  readonly secretAadContext: unknown;
  readonly secretEnvelopeVersion: number;
  readonly algorithm: string;
  readonly previousSecretCiphertext: Uint8Array | null;
  readonly previousSecretNonce: Uint8Array | null;
  readonly previousSecretAuthTag: Uint8Array | null;
  readonly previousSecretWrappedDataKey: Uint8Array | null;
  readonly previousSecretKeyVersion: string | null;
  readonly previousSecretAadContext: unknown;
  readonly previousSecretEnvelopeVersion: number | null;
  readonly previousSecretExpiresAt: Date | null;
  readonly createdAt: Date;
};

/** Active signing secrets for outbound HMAC, newest first. */
export async function listWebhookSigningSecrets(
  vault: CredentialVaultPort,
  row: WebhookSigningSecretRow,
  now: Date,
): Promise<readonly string[]> {
  const secrets: string[] = [];
  const current = webhookSigningSecretEnvelopeFromRow(row);
  secrets.push(
    await decryptWebhookSigningSecret(vault, {
      workspaceId: row.workspaceId,
      endpointId: row.id,
      envelope: current,
    }),
  );
  if (
    row.previousSecretExpiresAt !== null &&
    row.previousSecretExpiresAt.getTime() > now.getTime()
  ) {
    const previous = webhookPreviousSigningSecretEnvelopeFromRow(row);
    if (previous !== null) {
      secrets.push(
        await decryptWebhookSigningSecret(vault, {
          workspaceId: row.workspaceId,
          endpointId: row.id,
          envelope: previous,
        }),
      );
    }
  }
  return secrets;
}
