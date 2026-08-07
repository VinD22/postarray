import type { EncryptedCredential } from '@relay/connectors';

/** Map a vault envelope into the pending-discovery byte columns. */
export function pendingGrantEnvelopeToRow(envelope: EncryptedCredential): {
  readonly grantCiphertext: Buffer;
  readonly grantNonce: Buffer;
  readonly grantAuthTag: Buffer;
  readonly grantWrappedDataKey: Buffer;
  readonly grantKeyVersion: string;
  readonly grantAadContext: Record<string, string>;
  readonly grantEnvelopeVersion: number;
} {
  return {
    grantCiphertext: Buffer.from(envelope.ciphertext, 'base64'),
    grantNonce: Buffer.from(envelope.nonce, 'base64'),
    grantAuthTag: Buffer.from(envelope.authTag, 'base64'),
    grantWrappedDataKey: Buffer.from(envelope.wrappedDek, 'base64'),
    grantKeyVersion: String(envelope.keyVersion),
    grantAadContext: {
      workspaceId: envelope.aadContext.workspaceId,
      connectionId: envelope.aadContext.connectionId,
      provider: envelope.aadContext.provider,
      credentialKind: envelope.aadContext.credentialKind,
    },
    grantEnvelopeVersion: 1,
  };
}

export function pendingGrantEnvelopeFromRow(row: {
  readonly grantCiphertext: Uint8Array;
  readonly grantNonce: Uint8Array;
  readonly grantAuthTag: Uint8Array;
  readonly grantWrappedDataKey: Uint8Array;
  readonly grantKeyVersion: string;
  readonly grantAadContext: unknown;
  readonly grantEnvelopeVersion: number;
  readonly createdAt: Date;
}): EncryptedCredential {
  const aad = row.grantAadContext;
  if (typeof aad !== 'object' || aad === null) {
    throw new Error('oauth_pending_aad_invalid');
  }
  const context = aad as Record<string, string>;
  return {
    ciphertext: Buffer.from(row.grantCiphertext).toString('base64'),
    nonce: Buffer.from(row.grantNonce).toString('base64'),
    authTag: Buffer.from(row.grantAuthTag).toString('base64'),
    wrappedDek: Buffer.from(row.grantWrappedDataKey).toString('base64'),
    keyVersion: Number(row.grantKeyVersion),
    algorithm: 'AES-256-GCM',
    aadContext: {
      workspaceId: context['workspaceId'] ?? '',
      connectionId: context['connectionId'] ?? '',
      provider: context['provider'] ?? '',
      credentialKind: (context['credentialKind'] ?? 'provider_secret') as EncryptedCredential['aadContext']['credentialKind'],
    },
    createdAt: row.createdAt.toISOString(),
  };
}
