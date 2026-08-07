import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';

import { RelayError, isoInstantSchema } from '@relay/contracts';
import { z } from 'zod';

import { type Clock, type ConnectorLogger, instantOf, noopLogger, systemClock } from './ports';

/**
 * The credential vault.
 *
 * Envelope encryption: a fresh 256 bit data encryption key per write, used once
 * with AES-256-GCM, then wrapped by a master key (KMS in production, a local
 * key from `TOKEN_ENCRYPTION_LOCAL_KEY` in development). Ciphertext, nonce,
 * authentication tag, wrapped key, algorithm and key version are stored in
 * separate fields, never concatenated into one opaque blob, so an algorithm or
 * key migration is possible without re-parsing history.
 *
 * Additional authenticated data binds a ciphertext to its row:
 * `workspace_id | connection_id | provider | credential_kind`. A ciphertext
 * copied to another connection row fails to decrypt, which turns a database
 * write vulnerability into a decryption failure rather than a cross tenant
 * credential swap.
 *
 * `decryptForRequest()` is the ONLY way to obtain plaintext. It returns a
 * short lived handle that reveals the secret inside a callback and is unusable
 * after its TTL or after `release()`. Tokens never enter logs, traces, Temporal
 * history or client payloads: `SecretValue` and `SecretHandle` both serialize
 * to `[redacted]` under `JSON.stringify`, string coercion and `console.dir`.
 */

export const VAULT_ALGORITHM = 'AES-256-GCM';
export const DEK_BYTES = 32;
export const NONCE_BYTES = 12;
export const AUTH_TAG_BYTES = 16;

/** Default life of a decrypted handle. Long enough for one provider call. */
export const DEFAULT_HANDLE_TTL_MS = 60_000;

/** In process unwrapped-DEK cache ceiling, per `04-auth-oauth-and-security` 11.2. */
export const MAX_DEK_CACHE_TTL_MS = 5 * 60_000;

export const REDACTED = '[redacted]';

export const CREDENTIAL_KINDS = [
  'access_token',
  'refresh_token',
  'app_password',
  'client_secret',
  'api_key',
  'provider_secret',
] as const;
export const credentialKindSchema = z.enum(CREDENTIAL_KINDS);
export type CredentialKind = z.infer<typeof credentialKindSchema>;

/**
 * A plaintext secret that cannot be logged by accident.
 *
 * `reveal()` is deliberately ugly to read in a diff. Every call site should be
 * a provider request being built, and nothing else.
 */
export class SecretValue {
  readonly #value: string;
  readonly #label: string;

  constructor(value: string, label = 'secret') {
    this.#value = value;
    this.#label = label;
  }

  get label(): string {
    return this.#label;
  }

  get length(): number {
    return this.#value.length;
  }

  /** Scope plaintext access to one callback so callers do not retain it accidentally. */
  use<T>(callback: (value: string) => T): T {
    return callback(this.#value);
  }

  /** The only accessor. Never assign the result to a logged field. */
  reveal(): string {
    return this.#value;
  }

  /** Constant time comparison, for rotation and replay checks. */
  equals(other: SecretValue | string): boolean {
    const right = typeof other === 'string' ? other : other.reveal();
    const left = Buffer.from(this.#value, 'utf8');
    const rightBuffer = Buffer.from(right, 'utf8');
    if (left.length !== rightBuffer.length) {
      return false;
    }
    return timingSafeEqual(left, rightBuffer);
  }

  /** Stable, non reversible fingerprint for audit trails and dedupe. */
  fingerprint(): string {
    return createHash('sha256').update(this.#value, 'utf8').digest('hex').slice(0, 16);
  }

  toString(): string {
    return REDACTED;
  }

  toJSON(): string {
    return REDACTED;
  }

  [Symbol.for('nodejs.util.inspect.custom')](): string {
    return REDACTED;
  }
}

export function isSecretValue(value: unknown): value is SecretValue {
  return value instanceof SecretValue;
}

/**
 * A time limited capability to read one decrypted credential.
 *
 * The handle is what travels into a connector method. It is not serializable,
 * so a handle placed on a Temporal activity input by mistake fails loudly
 * instead of persisting a token into workflow history.
 */
export interface SecretHandle {
  readonly credentialKind: CredentialKind;
  readonly keyVersion: number;
  readonly purpose: string;
  readonly issuedAt: string;
  readonly expiresAt: string;
  readonly fingerprint: string;
  isUsable(): boolean;
  /** Reveal inside the callback. Throws once expired or released. */
  use<T>(fn: (plaintext: string) => T | Promise<T>): Promise<T>;
  /** Zero the reference. Idempotent. Always call it in a `finally`. */
  release(): void;
  toJSON(): string;
}

class LeasedSecret implements SecretHandle {
  readonly credentialKind: CredentialKind;
  readonly keyVersion: number;
  readonly purpose: string;
  readonly issuedAt: string;
  readonly expiresAt: string;
  readonly fingerprint: string;

  #secret: SecretValue | null;
  readonly #clock: Clock;
  readonly #expiresAtMs: number;

  constructor(input: {
    secret: SecretValue;
    credentialKind: CredentialKind;
    keyVersion: number;
    purpose: string;
    clock: Clock;
    ttlMs: number;
  }) {
    this.#secret = input.secret;
    this.#clock = input.clock;
    this.credentialKind = input.credentialKind;
    this.keyVersion = input.keyVersion;
    this.purpose = input.purpose;
    this.fingerprint = input.secret.fingerprint();
    const issued = input.clock.now();
    this.#expiresAtMs = issued.getTime() + input.ttlMs;
    this.issuedAt = issued.toISOString();
    this.expiresAt = instantOf(this.#expiresAtMs);
  }

  isUsable(): boolean {
    return this.#secret !== null && this.#clock.now().getTime() < this.#expiresAtMs;
  }

  async use<T>(fn: (plaintext: string) => T | Promise<T>): Promise<T> {
    const secret = this.#secret;
    if (secret === null) {
      throw new RelayError('INTERNAL', {
        messageKey: 'error.internal.message',
        details: { reason: 'CREDENTIAL_HANDLE_RELEASED', credentialKind: this.credentialKind },
      });
    }
    if (this.#clock.now().getTime() >= this.#expiresAtMs) {
      this.release();
      throw new RelayError('INTERNAL', {
        messageKey: 'error.internal.message',
        details: { reason: 'CREDENTIAL_HANDLE_EXPIRED', credentialKind: this.credentialKind },
      });
    }
    return await fn(secret.reveal());
  }

  release(): void {
    this.#secret = null;
  }

  toString(): string {
    return REDACTED;
  }

  toJSON(): string {
    return REDACTED;
  }

  [Symbol.for('nodejs.util.inspect.custom')](): string {
    return REDACTED;
  }
}

/** Build a handle around an already plaintext secret. Fake provider and tests. */
export function leaseSecret(input: {
  secret: SecretValue | string;
  credentialKind: CredentialKind;
  purpose: string;
  clock?: Clock;
  ttlMs?: number;
  keyVersion?: number;
}): SecretHandle {
  const secret = typeof input.secret === 'string' ? new SecretValue(input.secret) : input.secret;
  return new LeasedSecret({
    secret,
    credentialKind: input.credentialKind,
    keyVersion: input.keyVersion ?? 0,
    purpose: input.purpose,
    clock: input.clock ?? systemClock,
    ttlMs: input.ttlMs ?? DEFAULT_HANDLE_TTL_MS,
  });
}

export const credentialAadSchema = z
  .object({
    workspaceId: z.string().min(1),
    connectionId: z.string().min(1),
    provider: z.string().min(1),
    credentialKind: credentialKindSchema,
  })
  .strict();
export type CredentialAad = z.infer<typeof credentialAadSchema>;

const base64Schema = z.string().regex(/^[A-Za-z0-9+/]+={0,2}$/, { error: 'INVALID_BASE64' });

export const encryptedCredentialSchema = z
  .object({
    ciphertext: base64Schema,
    nonce: base64Schema,
    authTag: base64Schema,
    wrappedDek: base64Schema,
    keyVersion: z.number().int().nonnegative(),
    algorithm: z.literal(VAULT_ALGORITHM),
    aadContext: credentialAadSchema,
    createdAt: isoInstantSchema,
  })
  .strict();
export type EncryptedCredential = z.infer<typeof encryptedCredentialSchema>;

/** Canonical additional authenticated data. Order is part of the format. */
export function aadBytes(aad: CredentialAad): Buffer {
  return Buffer.from(
    `${aad.workspaceId}|${aad.connectionId}|${aad.provider}|${aad.credentialKind}`,
    'utf8',
  );
}

function sameAad(left: CredentialAad, right: CredentialAad): boolean {
  return aadBytes(left).equals(aadBytes(right));
}

/**
 * Wraps and unwraps data encryption keys. One implementation talks to KMS, one
 * uses a local key. Both are versioned so a rotation can read old rows.
 */
export interface MasterKeyProvider {
  readonly keyVersion: number;
  wrap(dek: Buffer): Promise<string>;
  unwrap(wrapped: string): Promise<Buffer>;
}

/**
 * Local development master key: 32 raw bytes, base64 encoded, from
 * `TOKEN_ENCRYPTION_LOCAL_KEY`. Never used when `TOKEN_ENCRYPTION_KMS_KEY_ID`
 * is set, and `@relay/config` reports this configuration as degraded in
 * production so an operator cannot ship it by accident.
 */
export class LocalMasterKeyProvider implements MasterKeyProvider {
  readonly keyVersion: number;
  readonly #key: Buffer;

  constructor(base64Key: string, keyVersion = 1) {
    const key = Buffer.from(base64Key, 'base64');
    if (key.length !== DEK_BYTES) {
      throw new RelayError('INTERNAL', {
        messageKey: 'error.internal.message',
        details: { reason: 'MASTER_KEY_LENGTH', expectedBytes: DEK_BYTES, actualBytes: key.length },
      });
    }
    this.#key = key;
    this.keyVersion = keyVersion;
  }

  async wrap(dek: Buffer): Promise<string> {
    const nonce = randomBytes(NONCE_BYTES);
    const cipher = createCipheriv('aes-256-gcm', this.#key, nonce);
    const body = Buffer.concat([cipher.update(dek), cipher.final()]);
    return Buffer.concat([nonce, cipher.getAuthTag(), body]).toString('base64');
  }

  async unwrap(wrapped: string): Promise<Buffer> {
    const raw = Buffer.from(wrapped, 'base64');
    if (raw.length <= NONCE_BYTES + AUTH_TAG_BYTES) {
      throw new RelayError('INTERNAL', {
        messageKey: 'error.internal.message',
        details: { reason: 'WRAPPED_DEK_MALFORMED' },
      });
    }
    const nonce = raw.subarray(0, NONCE_BYTES);
    const tag = raw.subarray(NONCE_BYTES, NONCE_BYTES + AUTH_TAG_BYTES);
    const body = raw.subarray(NONCE_BYTES + AUTH_TAG_BYTES);
    const decipher = createDecipheriv('aes-256-gcm', this.#key, nonce);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(body), decipher.final()]);
  }
}

/**
 * The narrow slice of a KMS we use. Implemented in the infrastructure layer so
 * this package stays free of a cloud SDK.
 */
export interface KmsClient {
  encrypt(input: { keyId: string; plaintext: Buffer }): Promise<Buffer>;
  decrypt(input: { keyId: string; ciphertext: Buffer }): Promise<Buffer>;
}

export class KmsMasterKeyProvider implements MasterKeyProvider {
  readonly keyVersion: number;
  readonly #client: KmsClient;
  readonly #keyId: string;

  constructor(input: { client: KmsClient; keyId: string; keyVersion: number }) {
    this.#client = input.client;
    this.#keyId = input.keyId;
    this.keyVersion = input.keyVersion;
  }

  async wrap(dek: Buffer): Promise<string> {
    const wrapped = await this.#client.encrypt({ keyId: this.#keyId, plaintext: dek });
    return wrapped.toString('base64');
  }

  async unwrap(wrapped: string): Promise<Buffer> {
    const dek = await this.#client.decrypt({
      keyId: this.#keyId,
      ciphertext: Buffer.from(wrapped, 'base64'),
    });
    return dek;
  }
}

export interface VaultAuditEvent {
  readonly action: 'encrypt' | 'decrypt' | 'rotate';
  readonly purpose: string;
  readonly workspaceId: string;
  readonly connectionId: string;
  readonly provider: string;
  readonly credentialKind: CredentialKind;
  readonly keyVersion: number;
  readonly at: string;
}

export interface CredentialVaultOptions {
  /** Highest key version first is not required; the vault picks the maximum. */
  readonly keyProviders: readonly MasterKeyProvider[];
  readonly clock?: Clock;
  readonly logger?: ConnectorLogger;
  /** Default life of a handle from `decryptForRequest`. */
  readonly handleTtlMs?: number;
  /** In process unwrapped-DEK cache. Capped at five minutes. 0 disables it. */
  readonly dekCacheTtlMs?: number;
  /** Every decrypt must be auditable. See `04-auth-oauth-and-security` 11.3. */
  readonly onAudit?: (event: VaultAuditEvent) => void;
}

interface CachedDek {
  readonly dek: Buffer;
  readonly expiresAtMs: number;
}

export class CredentialVault {
  readonly #providers: Map<number, MasterKeyProvider>;
  readonly #current: MasterKeyProvider;
  readonly #clock: Clock;
  readonly #logger: ConnectorLogger;
  readonly #handleTtlMs: number;
  readonly #dekCacheTtlMs: number;
  readonly #dekCache = new Map<string, CachedDek>();
  readonly #onAudit: ((event: VaultAuditEvent) => void) | undefined;

  constructor(options: CredentialVaultOptions) {
    if (options.keyProviders.length === 0) {
      throw new RelayError('INTERNAL', {
        messageKey: 'error.internal.message',
        details: { reason: 'VAULT_NO_KEY_PROVIDER' },
      });
    }
    this.#providers = new Map(
      options.keyProviders.map((provider) => [provider.keyVersion, provider]),
    );
    const highest = [...this.#providers.values()].reduce((best, candidate) =>
      candidate.keyVersion > best.keyVersion ? candidate : best,
    );
    this.#current = highest;
    this.#clock = options.clock ?? systemClock;
    this.#logger = options.logger ?? noopLogger;
    this.#handleTtlMs = options.handleTtlMs ?? DEFAULT_HANDLE_TTL_MS;
    this.#dekCacheTtlMs = Math.min(options.dekCacheTtlMs ?? 0, MAX_DEK_CACHE_TTL_MS);
    this.#onAudit = options.onAudit;
  }

  get currentKeyVersion(): number {
    return this.#current.keyVersion;
  }

  #audit(event: VaultAuditEvent): void {
    this.#onAudit?.(event);
    this.#logger.debug(
      {
        action: event.action,
        purpose: event.purpose,
        workspaceId: event.workspaceId,
        connectionId: event.connectionId,
        provider: event.provider,
        credentialKind: event.credentialKind,
        keyVersion: event.keyVersion,
      },
      'vault.access',
    );
  }

  async encrypt(input: {
    secret: SecretValue | string;
    aad: CredentialAad;
    purpose?: string;
  }): Promise<EncryptedCredential> {
    const aad = credentialAadSchema.parse(input.aad);
    const secret = typeof input.secret === 'string' ? new SecretValue(input.secret) : input.secret;
    const dek = randomBytes(DEK_BYTES);
    const nonce = randomBytes(NONCE_BYTES);
    const cipher = createCipheriv('aes-256-gcm', dek, nonce);
    cipher.setAAD(aadBytes(aad));
    const ciphertext = Buffer.concat([
      cipher.update(Buffer.from(secret.reveal(), 'utf8')),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();
    const wrappedDek = await this.#current.wrap(dek);
    dek.fill(0);

    const record: EncryptedCredential = {
      ciphertext: ciphertext.toString('base64'),
      nonce: nonce.toString('base64'),
      authTag: authTag.toString('base64'),
      wrappedDek,
      keyVersion: this.#current.keyVersion,
      algorithm: VAULT_ALGORITHM,
      aadContext: aad,
      createdAt: this.#clock.now().toISOString(),
    };
    this.#audit({
      action: 'encrypt',
      purpose: input.purpose ?? 'store',
      workspaceId: aad.workspaceId,
      connectionId: aad.connectionId,
      provider: aad.provider,
      credentialKind: aad.credentialKind,
      keyVersion: record.keyVersion,
      at: record.createdAt,
    });
    return encryptedCredentialSchema.parse(record);
  }

  async #unwrapDek(record: EncryptedCredential): Promise<Buffer> {
    const provider = this.#providers.get(record.keyVersion);
    if (provider === undefined) {
      throw new RelayError('INTERNAL', {
        messageKey: 'error.internal.message',
        details: { reason: 'VAULT_KEY_VERSION_UNAVAILABLE', keyVersion: record.keyVersion },
      });
    }
    if (this.#dekCacheTtlMs <= 0) {
      return await provider.unwrap(record.wrappedDek);
    }
    const cacheKey = createHash('sha256').update(record.wrappedDek).digest('hex');
    const nowMs = this.#clock.now().getTime();
    const cached = this.#dekCache.get(cacheKey);
    if (cached !== undefined && cached.expiresAtMs > nowMs) {
      return cached.dek;
    }
    const dek = await provider.unwrap(record.wrappedDek);
    this.#dekCache.set(cacheKey, { dek, expiresAtMs: nowMs + this.#dekCacheTtlMs });
    return dek;
  }

  /** Drop every cached data key. Called on rotation and on shutdown. */
  clearDekCache(): void {
    for (const entry of this.#dekCache.values()) {
      entry.dek.fill(0);
    }
    this.#dekCache.clear();
  }

  /**
   * The only path to plaintext.
   *
   * ```ts
   * const handle = await vault.decryptForRequest({ record, aad, purpose: 'publish' });
   * try {
   *   await handle.use((token) => http.post(url, { auth: token }));
   * } finally {
   *   handle.release();
   * }
   * ```
   */
  async decryptForRequest(input: {
    record: EncryptedCredential;
    aad: CredentialAad;
    purpose: string;
    ttlMs?: number;
  }): Promise<SecretHandle> {
    const record = encryptedCredentialSchema.parse(input.record);
    const aad = credentialAadSchema.parse(input.aad);
    if (!sameAad(record.aadContext, aad)) {
      throw new RelayError('INTERNAL', {
        messageKey: 'error.internal.message',
        details: { reason: 'CREDENTIAL_AAD_MISMATCH', credentialKind: aad.credentialKind },
      });
    }
    const dek = await this.#unwrapDek(record);
    let plaintext: Buffer;
    try {
      const decipher = createDecipheriv('aes-256-gcm', dek, Buffer.from(record.nonce, 'base64'));
      decipher.setAAD(aadBytes(aad));
      decipher.setAuthTag(Buffer.from(record.authTag, 'base64'));
      plaintext = Buffer.concat([
        decipher.update(Buffer.from(record.ciphertext, 'base64')),
        decipher.final(),
      ]);
    } catch (cause) {
      throw new RelayError('INTERNAL', {
        messageKey: 'error.internal.message',
        details: { reason: 'CREDENTIAL_DECRYPT_FAILED', credentialKind: aad.credentialKind },
        cause,
      });
    }

    const secret = new SecretValue(plaintext.toString('utf8'), aad.credentialKind);
    plaintext.fill(0);
    this.#audit({
      action: 'decrypt',
      purpose: input.purpose,
      workspaceId: aad.workspaceId,
      connectionId: aad.connectionId,
      provider: aad.provider,
      credentialKind: aad.credentialKind,
      keyVersion: record.keyVersion,
      at: this.#clock.now().toISOString(),
    });
    return new LeasedSecret({
      secret,
      credentialKind: aad.credentialKind,
      keyVersion: record.keyVersion,
      purpose: input.purpose,
      clock: this.#clock,
      ttlMs: input.ttlMs ?? this.#handleTtlMs,
    });
  }

  /** True when the row was written under an older master key version. */
  needsRotation(record: EncryptedCredential): boolean {
    return record.keyVersion < this.#current.keyVersion;
  }

  /**
   * Re-encrypt one row under the current master key with a brand new data key.
   * Data keys are never shared across rows, so a rotation is a full rewrite.
   */
  async rotate(input: {
    record: EncryptedCredential;
    aad: CredentialAad;
  }): Promise<EncryptedCredential> {
    const handle = await this.decryptForRequest({
      record: input.record,
      aad: input.aad,
      purpose: 'key_rotation',
      ttlMs: DEFAULT_HANDLE_TTL_MS,
    });
    try {
      const rotated = await handle.use(
        async (plaintext) =>
          await this.encrypt({
            secret: new SecretValue(plaintext, input.aad.credentialKind),
            aad: input.aad,
            purpose: 'key_rotation',
          }),
      );
      this.#audit({
        action: 'rotate',
        purpose: 'key_rotation',
        workspaceId: input.aad.workspaceId,
        connectionId: input.aad.connectionId,
        provider: input.aad.provider,
        credentialKind: input.aad.credentialKind,
        keyVersion: rotated.keyVersion,
        at: rotated.createdAt,
      });
      return rotated;
    } finally {
      handle.release();
    }
  }

  /**
   * Walk a batch of rows and re-encrypt the stale ones. The caller supplies the
   * page, so the background job controls rate and KMS quota consumption.
   */
  async reencryptBatch(
    rows: readonly { readonly record: EncryptedCredential; readonly aad: CredentialAad }[],
  ): Promise<{ rotated: { record: EncryptedCredential; aad: CredentialAad }[]; skipped: number }> {
    const rotated: { record: EncryptedCredential; aad: CredentialAad }[] = [];
    let skipped = 0;
    for (const row of rows) {
      if (!this.needsRotation(row.record)) {
        skipped += 1;
        continue;
      }
      rotated.push({ record: await this.rotate(row), aad: row.aad });
    }
    return { rotated, skipped };
  }
}

/**
 * Build a vault from configuration. `TOKEN_ENCRYPTION_KMS_KEY_ID` wins; the
 * local key is the development substitute. Older key versions are passed in so
 * a rotation window can still read rows written under the previous version.
 */
export function createCredentialVault(input: {
  kms?: { client: KmsClient; keyId: string; keyVersion: number };
  localKeyBase64?: string;
  localKeyVersion?: number;
  previousProviders?: readonly MasterKeyProvider[];
  clock?: Clock;
  logger?: ConnectorLogger;
  handleTtlMs?: number;
  dekCacheTtlMs?: number;
  onAudit?: (event: VaultAuditEvent) => void;
}): CredentialVault {
  const providers: MasterKeyProvider[] = [...(input.previousProviders ?? [])];
  if (input.kms !== undefined) {
    providers.push(new KmsMasterKeyProvider(input.kms));
  } else if (input.localKeyBase64 !== undefined) {
    providers.push(new LocalMasterKeyProvider(input.localKeyBase64, input.localKeyVersion ?? 1));
  } else {
    throw new RelayError('INTERNAL', {
      messageKey: 'error.internal.message',
      details: {
        reason: 'VAULT_NOT_CONFIGURED',
        requiredEnvVars: ['TOKEN_ENCRYPTION_KMS_KEY_ID', 'TOKEN_ENCRYPTION_LOCAL_KEY'],
      },
    });
  }
  return new CredentialVault({
    keyProviders: providers,
    ...(input.clock === undefined ? {} : { clock: input.clock }),
    ...(input.logger === undefined ? {} : { logger: input.logger }),
    ...(input.handleTtlMs === undefined ? {} : { handleTtlMs: input.handleTtlMs }),
    ...(input.dekCacheTtlMs === undefined ? {} : { dekCacheTtlMs: input.dekCacheTtlMs }),
    ...(input.onAudit === undefined ? {} : { onAudit: input.onAudit }),
  });
}

/** Generate a development master key. Never call this in production code. */
export function generateLocalMasterKey(): string {
  return randomBytes(DEK_BYTES).toString('base64');
}

/* --------------------------------------------------- adapter facing helpers */

/**
 * An opaque reference to a stored credential. It is never a token: it is the
 * identifier an activity hands to the vault to obtain a short lived plaintext.
 */
export type CredentialRef = string;

/**
 * The narrow vault view a provider adapter is given.
 *
 * The adapter never sees a ciphertext, a data key or a key version. It asks for
 * the value it needs, immediately before the provider call, and never stores or
 * logs the result. The implementation lives in the application layer, where the
 * `social_credentials` row and its AAD context are known.
 */
export interface ConnectorVault {
  /** Resolve a short lived bearer token for a connection. */
  getAccessToken(ref: CredentialRef): Promise<string>;
  /** Non OAuth secret material, for example an app password. */
  getSecret(ref: CredentialRef, name: string): Promise<string>;
}

/**
 * Build a `ConnectorVault` over a set of already leased handles. Used by the
 * fake provider, seeds and tests, where there is no database row to look up.
 */
export function connectorVaultFromHandles(
  handles: ReadonlyMap<string, SecretHandle>,
): ConnectorVault {
  const read = async (key: string): Promise<string> => {
    const handle = handles.get(key);
    if (handle === undefined) {
      throw new RelayError('NOT_FOUND', {
        messageKey: 'error.connection_not_found.message',
        details: { reason: 'CREDENTIAL_REF_UNKNOWN' },
      });
    }
    return await handle.use((plaintext) => plaintext);
  };
  return {
    getAccessToken: async (ref) => await read(ref),
    getSecret: async (ref, name) => await read(`${ref}:${name}`),
  };
}
