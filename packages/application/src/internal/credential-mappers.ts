import {
  credentialAadSchema,
  encryptedCredentialSchema,
  VAULT_ALGORITHM,
  type CredentialAad,
  type EncryptedCredential,
} from '@relay/connectors';
import { providerIdSchema, RelayError, type ProviderId } from '@relay/contracts';

import type { CredentialStoreWrite, StoredCredentialRecord } from '../ports/credentials';

/** The non-secret columns selected by a workspace-scoped credential query. */
export interface SocialCredentialStorageRow {
  readonly id: string;
  readonly workspaceId: string;
  readonly connectionId: string;
  /** Selected from the related app.social_connections row. */
  readonly provider: string;
  readonly accessTokenCiphertext: Uint8Array;
  readonly accessTokenNonce: Uint8Array;
  readonly accessTokenAuthTag: Uint8Array | null;
  readonly refreshTokenCiphertext: Uint8Array | null;
  readonly refreshTokenNonce: Uint8Array | null;
  readonly refreshTokenAuthTag: Uint8Array | null;
  readonly algorithm: string;
  /** Stored as text for compatibility with the pre-envelope schema. */
  readonly keyVersion: string;
  readonly accessTokenWrappedDataKey: Uint8Array | null;
  readonly refreshTokenWrappedDataKey: Uint8Array | null;
  readonly accessTokenAadContext: unknown;
  readonly refreshTokenAadContext: unknown;
  readonly envelopeVersion: number;
  readonly accessTokenExpiresAt: Date | null;
  readonly refreshTokenExpiresAt: Date | null;
  readonly lastRefreshedAt: Date | null;
  readonly lastRefreshError: string | null;
  readonly rotatedAt: Date | null;
  readonly createdAt: Date;
}

/** The Prisma-shaped data returned by `toSocialCredentialStorageWrite`. */
export interface SocialCredentialStorageWrite {
  readonly workspaceId: string;
  readonly connectionId: string;
  readonly accessTokenCiphertext: Buffer;
  readonly accessTokenNonce: Buffer;
  readonly accessTokenAuthTag: Buffer;
  readonly refreshTokenCiphertext: Buffer | null;
  readonly refreshTokenNonce: Buffer | null;
  readonly refreshTokenAuthTag: Buffer | null;
  readonly algorithm: typeof VAULT_ALGORITHM;
  readonly keyVersion: string;
  readonly accessTokenWrappedDataKey: Buffer;
  readonly refreshTokenWrappedDataKey: Buffer | null;
  readonly accessTokenAadContext: CredentialAad;
  readonly refreshTokenAadContext: CredentialAad | null;
  readonly envelopeVersion: 1;
  readonly accessTokenExpiresAt: Date | null;
  readonly refreshTokenExpiresAt: Date | null;
  readonly lastRefreshedAt: Date | null;
  readonly lastRefreshError: string | null;
  readonly rotatedAt: Date | null;
}

function invalidCredential(reason: string, details: Record<string, unknown> = {}): never {
  throw new RelayError('INTERNAL', {
    messageKey: 'error.internal.message',
    details: { reason, ...details },
  });
}

function requiredBytes(value: Uint8Array | null, field: string): Uint8Array {
  if (value === null || value.byteLength === 0) {
    return invalidCredential('CREDENTIAL_ENVELOPE_FIELD_MISSING', { field });
  }
  return value;
}

function toDate(value: string | null, field: string): Date | null {
  if (value === null) return null;
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) {
    return invalidCredential('CREDENTIAL_TIMESTAMP_INVALID', { field });
  }
  return date;
}

function toIso(value: Date | null): string | null {
  if (value === null) return null;
  if (!Number.isFinite(value.getTime())) {
    return invalidCredential('CREDENTIAL_TIMESTAMP_INVALID');
  }
  return value.toISOString();
}

function providerOf(value: string): ProviderId {
  const parsed = providerIdSchema.safeParse(value);
  if (!parsed.success) {
    return invalidCredential('CREDENTIAL_PROVIDER_INVALID');
  }
  return parsed.data;
}

function keyVersionOf(value: string): number {
  if (!/^[1-9][0-9]*$/u.test(value)) {
    return invalidCredential('CREDENTIAL_KEY_VERSION_INVALID');
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    return invalidCredential('CREDENTIAL_KEY_VERSION_INVALID');
  }
  return parsed;
}

function aadFor(
  row: Pick<SocialCredentialStorageRow, 'workspaceId' | 'connectionId'>,
  provider: ProviderId,
  credentialKind: CredentialAad['credentialKind'],
): CredentialAad {
  return credentialAadSchema.parse({
    workspaceId: row.workspaceId,
    connectionId: row.connectionId,
    provider,
    credentialKind,
  });
}

function sameAad(left: CredentialAad, right: CredentialAad): boolean {
  return (
    left.workspaceId === right.workspaceId &&
    left.connectionId === right.connectionId &&
    left.provider === right.provider &&
    left.credentialKind === right.credentialKind
  );
}

function persistedAad(value: unknown, expected: CredentialAad): CredentialAad {
  const parsed = credentialAadSchema.safeParse(value);
  if (!parsed.success || !sameAad(parsed.data, expected)) {
    return invalidCredential('CREDENTIAL_AAD_MISMATCH');
  }
  return parsed.data;
}

function encryptedFromRow(input: {
  readonly row: SocialCredentialStorageRow;
  readonly provider: ProviderId;
  readonly credentialKind: CredentialAad['credentialKind'];
  readonly ciphertext: Uint8Array | null;
  readonly nonce: Uint8Array | null;
  readonly authTag: Uint8Array | null;
  readonly wrappedDataKey: Uint8Array | null;
  readonly aadContext: unknown;
}): EncryptedCredential {
  const { row } = input;
  if (row.envelopeVersion !== 1) {
    return invalidCredential('CREDENTIAL_ENVELOPE_LEGACY', {
      envelopeVersion: row.envelopeVersion,
    });
  }
  if (row.algorithm !== VAULT_ALGORITHM) {
    return invalidCredential('CREDENTIAL_ALGORITHM_UNSUPPORTED');
  }
  const expectedAad = aadFor(row, input.provider, input.credentialKind);
  const aad = persistedAad(input.aadContext, expectedAad);
  const record = {
    ciphertext: Buffer.from(
      requiredBytes(input.ciphertext, `${input.credentialKind}.ciphertext`),
    ).toString('base64'),
    nonce: Buffer.from(requiredBytes(input.nonce, `${input.credentialKind}.nonce`)).toString(
      'base64',
    ),
    authTag: Buffer.from(requiredBytes(input.authTag, `${input.credentialKind}.authTag`)).toString(
      'base64',
    ),
    wrappedDek: Buffer.from(
      requiredBytes(input.wrappedDataKey, `${input.credentialKind}.wrappedDataKey`),
    ).toString('base64'),
    keyVersion: keyVersionOf(row.keyVersion),
    algorithm: VAULT_ALGORITHM,
    aadContext: aad,
    createdAt: row.createdAt.toISOString(),
  };
  const parsed = encryptedCredentialSchema.safeParse(record);
  if (!parsed.success) {
    return invalidCredential('CREDENTIAL_ENVELOPE_INVALID');
  }
  return parsed.data;
}

function hasAnyRefreshMaterial(row: SocialCredentialStorageRow): boolean {
  return (
    row.refreshTokenCiphertext !== null ||
    row.refreshTokenNonce !== null ||
    row.refreshTokenAuthTag !== null ||
    row.refreshTokenWrappedDataKey !== null ||
    row.refreshTokenAadContext !== null
  );
}

/** Map a private database row to a safe application record. */
export function fromSocialCredentialStorageRow(
  row: SocialCredentialStorageRow,
): StoredCredentialRecord {
  const provider = providerOf(row.provider);
  const accessToken = encryptedFromRow({
    row,
    provider,
    credentialKind: 'access_token',
    ciphertext: row.accessTokenCiphertext,
    nonce: row.accessTokenNonce,
    authTag: row.accessTokenAuthTag,
    wrappedDataKey: row.accessTokenWrappedDataKey,
    aadContext: row.accessTokenAadContext,
  });

  let refreshToken: EncryptedCredential | null = null;
  if (hasAnyRefreshMaterial(row)) {
    refreshToken = encryptedFromRow({
      row,
      provider,
      credentialKind: 'refresh_token',
      ciphertext: row.refreshTokenCiphertext,
      nonce: row.refreshTokenNonce,
      authTag: row.refreshTokenAuthTag,
      wrappedDataKey: row.refreshTokenWrappedDataKey,
      aadContext: row.refreshTokenAadContext,
    });
  }

  return {
    id: row.id,
    workspaceId: row.workspaceId,
    connectionId: row.connectionId,
    provider,
    accessToken,
    refreshToken,
    accessTokenExpiresAt: toIso(row.accessTokenExpiresAt),
    refreshTokenExpiresAt: toIso(row.refreshTokenExpiresAt),
    lastRefreshedAt: toIso(row.lastRefreshedAt),
    lastRefreshError: row.lastRefreshError,
    rotatedAt: toIso(row.rotatedAt),
  };
}

function toBytes(value: string, field: string): Buffer {
  const bytes = Buffer.from(value, 'base64');
  if (bytes.byteLength === 0) {
    return invalidCredential('CREDENTIAL_ENVELOPE_FIELD_MISSING', { field });
  }
  return bytes;
}

function assertWriteContext(record: EncryptedCredential, expected: CredentialAad): void {
  if (!sameAad(record.aadContext, expected)) {
    invalidCredential('CREDENTIAL_AAD_MISMATCH');
  }
  if (record.algorithm !== VAULT_ALGORITHM) {
    invalidCredential('CREDENTIAL_ALGORITHM_UNSUPPORTED');
  }
}

function envelopeWrite(input: {
  readonly record: EncryptedCredential;
  readonly expectedAad: CredentialAad;
}): {
  readonly ciphertext: Buffer;
  readonly nonce: Buffer;
  readonly authTag: Buffer;
  readonly wrappedDataKey: Buffer;
  readonly aadContext: CredentialAad;
} {
  assertWriteContext(input.record, input.expectedAad);
  return {
    ciphertext: toBytes(input.record.ciphertext, 'ciphertext'),
    nonce: toBytes(input.record.nonce, 'nonce'),
    authTag: toBytes(input.record.authTag, 'authTag'),
    wrappedDataKey: toBytes(input.record.wrappedDek, 'wrappedDataKey'),
    aadContext: input.record.aadContext,
  };
}

/** Map a vault result into Prisma-shaped encrypted columns. */
export function toSocialCredentialStorageWrite(
  input: CredentialStoreWrite,
): SocialCredentialStorageWrite {
  const accessAad = aadFor(input, input.provider, 'access_token');
  const access = envelopeWrite({ record: input.accessToken, expectedAad: accessAad });
  if (input.accessToken.keyVersion !== input.refreshToken?.keyVersion) {
    if (input.refreshToken !== null) {
      return invalidCredential('CREDENTIAL_KEY_VERSION_MISMATCH');
    }
  }

  const refreshAad = aadFor(input, input.provider, 'refresh_token');
  const refresh =
    input.refreshToken === null
      ? null
      : envelopeWrite({ record: input.refreshToken, expectedAad: refreshAad });

  return {
    workspaceId: input.workspaceId,
    connectionId: input.connectionId,
    accessTokenCiphertext: access.ciphertext,
    accessTokenNonce: access.nonce,
    accessTokenAuthTag: access.authTag,
    refreshTokenCiphertext: refresh?.ciphertext ?? null,
    refreshTokenNonce: refresh?.nonce ?? null,
    refreshTokenAuthTag: refresh?.authTag ?? null,
    algorithm: VAULT_ALGORITHM,
    keyVersion: String(input.accessToken.keyVersion),
    accessTokenWrappedDataKey: access.wrappedDataKey,
    refreshTokenWrappedDataKey: refresh?.wrappedDataKey ?? null,
    accessTokenAadContext: access.aadContext,
    refreshTokenAadContext: refresh?.aadContext ?? null,
    envelopeVersion: 1,
    accessTokenExpiresAt: toDate(input.accessTokenExpiresAt, 'accessTokenExpiresAt'),
    refreshTokenExpiresAt: toDate(input.refreshTokenExpiresAt, 'refreshTokenExpiresAt'),
    lastRefreshedAt: toDate(input.lastRefreshedAt, 'lastRefreshedAt'),
    lastRefreshError: null,
    rotatedAt: toDate(input.rotatedAt, 'rotatedAt'),
  };
}
