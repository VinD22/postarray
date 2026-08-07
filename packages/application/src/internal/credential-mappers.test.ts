import { VAULT_ALGORITHM, type EncryptedCredential } from '@relay/connectors';
import { RelayError } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import {
  fromSocialCredentialStorageRow,
  toSocialCredentialStorageWrite,
  type SocialCredentialStorageRow,
} from './credential-mappers';

const context = {
  workspaceId: 'ws_test',
  connectionId: 'conn_test',
  provider: 'linkedin' as const,
};
const bytes = (size: number, value: number): Buffer => Buffer.alloc(size, value);

function encrypted(kind: 'access_token' | 'refresh_token', keyVersion = 7): EncryptedCredential {
  return {
    ciphertext: Buffer.from(`${kind}-ciphertext`, 'utf8').toString('base64'),
    nonce: bytes(12, 1).toString('base64'),
    authTag: bytes(16, 2).toString('base64'),
    wrappedDek: bytes(32, 3).toString('base64'),
    keyVersion,
    algorithm: VAULT_ALGORITHM,
    aadContext: { ...context, credentialKind: kind },
    createdAt: '2026-08-07T00:00:00.000Z',
  };
}

function row(overrides: Partial<SocialCredentialStorageRow> = {}): SocialCredentialStorageRow {
  const access = encrypted('access_token');
  const refresh = encrypted('refresh_token');
  return {
    id: 'cred_test',
    ...context,
    accessTokenCiphertext: Buffer.from(access.ciphertext, 'base64'),
    accessTokenNonce: Buffer.from(access.nonce, 'base64'),
    accessTokenAuthTag: Buffer.from(access.authTag, 'base64'),
    refreshTokenCiphertext: Buffer.from(refresh.ciphertext, 'base64'),
    refreshTokenNonce: Buffer.from(refresh.nonce, 'base64'),
    refreshTokenAuthTag: Buffer.from(refresh.authTag, 'base64'),
    algorithm: VAULT_ALGORITHM,
    keyVersion: String(access.keyVersion),
    accessTokenWrappedDataKey: Buffer.from(access.wrappedDek, 'base64'),
    refreshTokenWrappedDataKey: Buffer.from(refresh.wrappedDek, 'base64'),
    accessTokenAadContext: access.aadContext,
    refreshTokenAadContext: refresh.aadContext,
    envelopeVersion: 1,
    accessTokenExpiresAt: new Date('2026-08-08T00:00:00.000Z'),
    refreshTokenExpiresAt: null,
    lastRefreshedAt: null,
    lastRefreshError: null,
    rotatedAt: null,
    createdAt: new Date('2026-08-07T00:00:00.000Z'),
    ...overrides,
  };
}

describe('credential storage mappers', () => {
  it('maps both authenticated token envelopes without exposing plaintext', () => {
    const result = fromSocialCredentialStorageRow(row());

    expect(result.provider).toBe('linkedin');
    expect(result.accessToken.keyVersion).toBe(7);
    expect(result.refreshToken?.aadContext.credentialKind).toBe('refresh_token');
    expect(JSON.stringify(result)).not.toContain('access_token-ciphertext');
    expect(JSON.stringify(result)).not.toContain('refresh_token-ciphertext');
  });

  it('rejects legacy rows instead of treating ciphertext as usable', () => {
    expect(() => fromSocialCredentialStorageRow(row({ envelopeVersion: 0 }))).toThrow(RelayError);
    expect(() => fromSocialCredentialStorageRow(row({ envelopeVersion: 0 }))).toThrow('INTERNAL');
  });

  it('rejects a copied or stale AAD context', () => {
    expect(() =>
      fromSocialCredentialStorageRow(
        row({
          accessTokenAadContext: {
            ...context,
            workspaceId: 'ws_other',
            credentialKind: 'access_token',
          },
        }),
      ),
    ).toThrow('INTERNAL');
  });

  it('rejects partial refresh envelopes', () => {
    expect(() => fromSocialCredentialStorageRow(row({ refreshTokenAuthTag: null }))).toThrow(
      'INTERNAL',
    );
  });

  it('maps vault envelopes to secure Prisma columns', () => {
    const input = {
      workspaceId: context.workspaceId,
      connectionId: context.connectionId,
      provider: context.provider,
      accessToken: encrypted('access_token'),
      refreshToken: encrypted('refresh_token'),
      accessTokenExpiresAt: '2026-08-08T00:00:00.000Z',
      refreshTokenExpiresAt: null,
      lastRefreshedAt: null,
      rotatedAt: null,
    };
    const result = toSocialCredentialStorageWrite(input);

    expect(result.envelopeVersion).toBe(1);
    expect(result.keyVersion).toBe('7');
    expect(result.accessTokenAuthTag.byteLength).toBe(16);
    expect(result.refreshTokenWrappedDataKey?.byteLength).toBe(32);
    expect(result.accessTokenAadContext.credentialKind).toBe('access_token');
  });

  it('rejects envelopes from different vault key versions', () => {
    expect(() =>
      toSocialCredentialStorageWrite({
        workspaceId: context.workspaceId,
        connectionId: context.connectionId,
        provider: context.provider,
        accessToken: encrypted('access_token', 7),
        refreshToken: encrypted('refresh_token', 8),
        accessTokenExpiresAt: null,
        refreshTokenExpiresAt: null,
        lastRefreshedAt: null,
        rotatedAt: null,
      }),
    ).toThrow('INTERNAL');
  });
});
