import {
  DecryptCommand,
  GenerateDataKeyCommand,
  KMSClient,
  type KMSClientConfig,
} from '@aws-sdk/client-kms';
import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';
import type { DataExportEncryptionPort } from '@relay/application';
import { ERROR_CODES, RelayError } from '@relay/contracts';
import { z } from 'zod';

const DATA_KEY_BYTES = 32;
const NONCE_BYTES = 12;
const AUTH_TAG_BYTES = 16;
const base64 = z
  .string()
  .min(1)
  .regex(/^[A-Za-z0-9+/]+={0,2}$/u);

const kmsEnvelopeSchema = z
  .object({
    format: z.literal('relay-export-encrypted-kms-v1'),
    algorithm: z.literal('aes-256-gcm+kms'),
    keyVersion: z.string().min(1),
    encryptedDataKey: base64,
    nonce: base64,
    authTag: base64,
    ciphertext: base64,
  })
  .strict();

type KmsEnvelope = z.infer<typeof kmsEnvelopeSchema>;

export interface DataExportKmsClient {
  generateDataKey(input: {
    readonly keyId: string;
    readonly encryptionContext: Readonly<Record<string, string>>;
  }): Promise<{
    readonly plaintext: Uint8Array;
    readonly ciphertext: Uint8Array;
    readonly keyId: string | null;
  }>;
  decrypt(input: {
    readonly ciphertext: Uint8Array;
    readonly encryptionContext: Readonly<Record<string, string>>;
  }): Promise<Uint8Array>;
  close?(): void;
}

function context(workspaceId: string, exportId: string): Readonly<Record<string, string>> {
  return { relay_workspace_id: workspaceId, relay_export_id: exportId };
}

function kmsError(operation: string, cause?: unknown): RelayError {
  return new RelayError(ERROR_CODES.PROVIDER_UNAVAILABLE, {
    messageKey: 'errors.provider_unavailable',
    details: { subsystem: 'kms', operation },
    ...(cause === undefined ? {} : { cause }),
  });
}

function envelopeError(reason: string, cause?: unknown): RelayError {
  return new RelayError(ERROR_CODES.INTERNAL, {
    messageKey: 'errors.export_unavailable',
    details: { reason },
    ...(cause === undefined ? {} : { cause }),
  });
}

function decode(value: string, minimum: number, reason: string): Buffer {
  const bytes = Buffer.from(value, 'base64');
  if (bytes.length < minimum) throw envelopeError(reason);
  return bytes;
}

function parseEnvelope(bytes: Uint8Array): KmsEnvelope {
  try {
    return kmsEnvelopeSchema.parse(JSON.parse(Buffer.from(bytes).toString('utf8')));
  } catch (cause) {
    throw envelopeError('export_envelope_invalid', cause);
  }
}

function aesAad(workspaceId: string, exportId: string): Buffer {
  return Buffer.from(`${workspaceId}|${exportId}`, 'utf8');
}

function wipe(bytes: Uint8Array): void {
  bytes.fill(0);
}

/** AWS SDK adapter. The SDK response is reduced to the narrow domain port. */
export class AwsDataExportKmsClient implements DataExportKmsClient {
  readonly #client: KMSClient;

  constructor(options: KMSClientConfig = {}) {
    this.#client = new KMSClient(options);
  }

  async generateDataKey(input: {
    readonly keyId: string;
    readonly encryptionContext: Readonly<Record<string, string>>;
  }): Promise<{
    readonly plaintext: Uint8Array;
    readonly ciphertext: Uint8Array;
    readonly keyId: string | null;
  }> {
    try {
      const result = await this.#client.send(
        new GenerateDataKeyCommand({
          KeyId: input.keyId,
          KeySpec: 'AES_256',
          EncryptionContext: input.encryptionContext,
        }),
      );
      if (result.Plaintext === undefined || result.CiphertextBlob === undefined) {
        throw envelopeError('kms_data_key_missing');
      }
      return {
        plaintext: result.Plaintext,
        ciphertext: result.CiphertextBlob,
        keyId: result.KeyId ?? null,
      };
    } catch (cause) {
      if (cause instanceof RelayError) throw cause;
      throw kmsError('generate_data_key', cause);
    }
  }

  async decrypt(input: {
    readonly ciphertext: Uint8Array;
    readonly encryptionContext: Readonly<Record<string, string>>;
  }): Promise<Uint8Array> {
    try {
      const result = await this.#client.send(
        new DecryptCommand({
          CiphertextBlob: input.ciphertext,
          EncryptionContext: input.encryptionContext,
        }),
      );
      if (result.Plaintext === undefined) throw envelopeError('kms_plaintext_missing');
      return result.Plaintext;
    } catch (cause) {
      if (cause instanceof RelayError) throw cause;
      throw kmsError('decrypt_data_key', cause);
    }
  }

  close(): void {
    this.#client.destroy();
  }
}

/** Envelope encryption for exports, with one fresh KMS data key per archive. */
export class KmsDataExportEncryption implements DataExportEncryptionPort {
  readonly #client: DataExportKmsClient;
  readonly #keyId: string;

  constructor(input: { readonly keyId: string; readonly client: DataExportKmsClient }) {
    if (input.keyId.trim().length === 0) {
      throw new RelayError(ERROR_CODES.INTERNAL, {
        details: { reason: 'KMS_KEY_ID_REQUIRED' },
      });
    }
    this.#client = input.client;
    this.#keyId = input.keyId;
  }

  async encrypt(input: {
    readonly workspaceId: string;
    readonly exportId: string;
    readonly plaintext: Uint8Array;
  }): Promise<{ readonly bytes: Uint8Array; readonly keyVersion: string }> {
    const encryptionContext = context(input.workspaceId, input.exportId);
    let generated: Awaited<ReturnType<DataExportKmsClient['generateDataKey']>>;
    try {
      generated = await this.#client.generateDataKey({
        keyId: this.#keyId,
        encryptionContext,
      });
    } catch (cause) {
      if (cause instanceof RelayError) throw cause;
      throw kmsError('generate_data_key', cause);
    }
    const dataKey = Buffer.from(generated.plaintext);
    wipe(generated.plaintext);
    if (dataKey.length !== DATA_KEY_BYTES || generated.ciphertext.byteLength === 0) {
      dataKey.fill(0);
      throw envelopeError('kms_data_key_invalid');
    }

    try {
      const nonce = randomBytes(NONCE_BYTES);
      const cipher = createCipheriv('aes-256-gcm', dataKey, nonce);
      cipher.setAAD(aesAad(input.workspaceId, input.exportId));
      const ciphertext = Buffer.concat([cipher.update(input.plaintext), cipher.final()]);
      const keyVersion = generated.keyId ?? this.#keyId;
      const envelope = {
        format: 'relay-export-encrypted-kms-v1',
        algorithm: 'aes-256-gcm+kms',
        keyVersion,
        encryptedDataKey: Buffer.from(generated.ciphertext).toString('base64'),
        nonce: nonce.toString('base64'),
        authTag: cipher.getAuthTag().toString('base64'),
        ciphertext: ciphertext.toString('base64'),
      } satisfies KmsEnvelope;
      return { bytes: Buffer.from(JSON.stringify(envelope), 'utf8'), keyVersion };
    } finally {
      dataKey.fill(0);
    }
  }

  async decrypt(input: {
    readonly workspaceId: string;
    readonly exportId: string;
    readonly bytes: Uint8Array;
  }): Promise<Uint8Array> {
    const envelope = parseEnvelope(input.bytes);
    const encryptedDataKey = decode(envelope.encryptedDataKey, 1, 'kms_encrypted_data_key_invalid');
    const nonce = decode(envelope.nonce, NONCE_BYTES, 'export_nonce_invalid');
    const authTag = decode(envelope.authTag, AUTH_TAG_BYTES, 'export_auth_tag_invalid');
    const ciphertext = decode(envelope.ciphertext, 1, 'export_ciphertext_invalid');
    let decryptedDataKey: Uint8Array;
    try {
      decryptedDataKey = await this.#client.decrypt({
        ciphertext: encryptedDataKey,
        encryptionContext: context(input.workspaceId, input.exportId),
      });
    } catch (cause) {
      if (cause instanceof RelayError) throw cause;
      throw kmsError('decrypt_data_key', cause);
    }
    const dataKey = Buffer.from(decryptedDataKey);
    wipe(decryptedDataKey);
    if (dataKey.length !== DATA_KEY_BYTES) {
      dataKey.fill(0);
      throw envelopeError('kms_data_key_invalid');
    }
    try {
      const decipher = createDecipheriv('aes-256-gcm', dataKey, nonce);
      decipher.setAAD(aesAad(input.workspaceId, input.exportId));
      decipher.setAuthTag(authTag);
      return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    } catch (cause) {
      throw envelopeError('export_decrypt_failed', cause);
    } finally {
      dataKey.fill(0);
    }
  }

  close(): void {
    this.#client.close?.();
  }
}
