import type { EncryptedCredential } from '@relay/connectors';

export interface WebhookSigningSecretRowEnvelope {
  readonly secretCiphertext: Buffer;
  readonly secretNonce: Buffer;
  readonly secretAuthTag: Buffer;
  readonly secretWrappedDataKey: Buffer;
  readonly keyVersion: string;
  readonly secretAadContext: Record<string, string>;
  readonly secretEnvelopeVersion: number;
  readonly algorithm: string;
}

/** Map a vault envelope into webhook endpoint byte columns. */
export function webhookSigningSecretEnvelopeToRow(
  envelope: EncryptedCredential,
): WebhookSigningSecretRowEnvelope {
  return {
    secretCiphertext: Buffer.from(envelope.ciphertext, 'base64'),
    secretNonce: Buffer.from(envelope.nonce, 'base64'),
    secretAuthTag: Buffer.from(envelope.authTag, 'base64'),
    secretWrappedDataKey: Buffer.from(envelope.wrappedDek, 'base64'),
    keyVersion: String(envelope.keyVersion),
    secretAadContext: {
      workspaceId: envelope.aadContext.workspaceId,
      connectionId: envelope.aadContext.connectionId,
      provider: envelope.aadContext.provider,
      credentialKind: envelope.aadContext.credentialKind,
    },
    secretEnvelopeVersion: 1,
    algorithm: envelope.algorithm,
  };
}

export function webhookSigningSecretEnvelopeFromRow(row: {
  readonly secretCiphertext: Uint8Array;
  readonly secretNonce: Uint8Array;
  readonly secretAuthTag: Uint8Array | null;
  readonly secretWrappedDataKey: Uint8Array | null;
  readonly keyVersion: string;
  readonly secretAadContext: unknown;
  readonly secretEnvelopeVersion: number;
  readonly algorithm: string;
  readonly createdAt: Date;
}): EncryptedCredential {
  if (row.secretEnvelopeVersion !== 1) {
    throw new Error('webhook_signing_secret_envelope_legacy');
  }
  if (row.secretAuthTag === null || row.secretWrappedDataKey === null) {
    throw new Error('webhook_signing_secret_envelope_incomplete');
  }
  const aad = row.secretAadContext;
  if (typeof aad !== 'object' || aad === null) {
    throw new Error('webhook_signing_secret_aad_invalid');
  }
  const context = aad as Record<string, string>;
  return {
    ciphertext: Buffer.from(row.secretCiphertext).toString('base64'),
    nonce: Buffer.from(row.secretNonce).toString('base64'),
    authTag: Buffer.from(row.secretAuthTag).toString('base64'),
    wrappedDek: Buffer.from(row.secretWrappedDataKey).toString('base64'),
    keyVersion: Number(row.keyVersion),
    algorithm: 'AES-256-GCM',
    aadContext: {
      workspaceId: context['workspaceId'] ?? '',
      connectionId: context['connectionId'] ?? '',
      provider: context['provider'] ?? '',
      credentialKind: (context['credentialKind'] ??
        'provider_secret') as EncryptedCredential['aadContext']['credentialKind'],
    },
    createdAt: row.createdAt.toISOString(),
  };
}

export function webhookPreviousSigningSecretEnvelopeFromRow(row: {
  readonly previousSecretCiphertext: Uint8Array | null;
  readonly previousSecretNonce: Uint8Array | null;
  readonly previousSecretAuthTag: Uint8Array | null;
  readonly previousSecretWrappedDataKey: Uint8Array | null;
  readonly previousSecretKeyVersion: string | null;
  readonly previousSecretAadContext: unknown;
  readonly previousSecretEnvelopeVersion: number | null;
  readonly createdAt: Date;
}): EncryptedCredential | null {
  if (row.previousSecretEnvelopeVersion !== 1) {
    return null;
  }
  if (
    row.previousSecretCiphertext === null ||
    row.previousSecretNonce === null ||
    row.previousSecretAuthTag === null ||
    row.previousSecretWrappedDataKey === null ||
    row.previousSecretKeyVersion === null
  ) {
    return null;
  }
  const aad = row.previousSecretAadContext;
  if (typeof aad !== 'object' || aad === null) {
    throw new Error('webhook_signing_secret_previous_aad_invalid');
  }
  const context = aad as Record<string, string>;
  return {
    ciphertext: Buffer.from(row.previousSecretCiphertext).toString('base64'),
    nonce: Buffer.from(row.previousSecretNonce).toString('base64'),
    authTag: Buffer.from(row.previousSecretAuthTag).toString('base64'),
    wrappedDek: Buffer.from(row.previousSecretWrappedDataKey).toString('base64'),
    keyVersion: Number(row.previousSecretKeyVersion),
    algorithm: 'AES-256-GCM',
    aadContext: {
      workspaceId: context['workspaceId'] ?? '',
      connectionId: context['connectionId'] ?? '',
      provider: context['provider'] ?? '',
      credentialKind: (context['credentialKind'] ??
        'provider_secret') as EncryptedCredential['aadContext']['credentialKind'],
    },
    createdAt: row.createdAt.toISOString(),
  };
}
