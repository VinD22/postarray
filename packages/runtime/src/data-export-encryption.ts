import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

import type { DataExportEncryptionPort } from '@relay/application';
import { RelayError } from '@relay/contracts';
import { z } from 'zod';

const KEY_BYTES = 32;
const NONCE_BYTES = 12;
const AUTH_TAG_BYTES = 16;

const base64 = z
  .string()
  .min(1)
  .regex(/^[A-Za-z0-9+/]+={0,2}$/u);
const localEnvelopeSchema = z
  .object({
    format: z.literal('relay-export-encrypted-v1'),
    algorithm: z.literal('aes-256-gcm'),
    keyVersion: z.string().min(1),
    nonce: base64,
    authTag: base64,
    ciphertext: base64,
  })
  .strict();

type LocalEnvelope = z.infer<typeof localEnvelopeSchema>;

function invalidEnvelope(cause?: unknown): RelayError {
  return new RelayError('INTERNAL', {
    messageKey: 'errors.export_unavailable',
    details: { reason: 'export_envelope_invalid' },
    ...(cause === undefined ? {} : { cause }),
  });
}

function parseEnvelope(bytes: Uint8Array): LocalEnvelope {
  try {
    return localEnvelopeSchema.parse(JSON.parse(Buffer.from(bytes).toString('utf8')));
  } catch (cause) {
    throw invalidEnvelope(cause);
  }
}

function decodePart(value: string, expectedMinBytes: number, reason: string): Buffer {
  const decoded = Buffer.from(value, 'base64');
  if (decoded.length < expectedMinBytes) {
    throw new RelayError('INTERNAL', {
      messageKey: 'errors.export_unavailable',
      details: { reason },
    });
  }
  return decoded;
}

/** Envelope written to private object storage. Plaintext never leaves memory. */
export class LocalDataExportEncryption implements DataExportEncryptionPort {
  readonly #key: Buffer;
  readonly #keyVersion: string;

  constructor(base64Key: string, keyVersion = 'local-v1') {
    const key = Buffer.from(base64Key, 'base64');
    if (key.length !== KEY_BYTES) {
      throw new RelayError('INTERNAL', {
        details: { reason: 'EXPORT_KEY_LENGTH', expectedBytes: KEY_BYTES, actualBytes: key.length },
      });
    }
    this.#key = key;
    this.#keyVersion = keyVersion;
  }

  async encrypt(input: {
    readonly workspaceId: string;
    readonly exportId: string;
    readonly plaintext: Uint8Array;
  }): Promise<{ readonly bytes: Uint8Array; readonly keyVersion: string }> {
    const nonce = randomBytes(NONCE_BYTES);
    const cipher = createCipheriv('aes-256-gcm', this.#key, nonce);
    cipher.setAAD(Buffer.from(`${input.workspaceId}|${input.exportId}`, 'utf8'));
    const ciphertext = Buffer.concat([cipher.update(input.plaintext), cipher.final()]);
    const envelope = {
      format: 'relay-export-encrypted-v1',
      algorithm: 'aes-256-gcm',
      keyVersion: this.#keyVersion,
      nonce: nonce.toString('base64'),
      authTag: cipher.getAuthTag().toString('base64'),
      ciphertext: ciphertext.toString('base64'),
    };
    return { bytes: Buffer.from(JSON.stringify(envelope), 'utf8'), keyVersion: this.#keyVersion };
  }

  async decrypt(input: {
    readonly workspaceId: string;
    readonly exportId: string;
    readonly bytes: Uint8Array;
  }): Promise<Uint8Array> {
    const envelope = parseEnvelope(input.bytes);
    const nonce = decodePart(envelope.nonce, NONCE_BYTES, 'export_nonce_invalid');
    const authTag = decodePart(envelope.authTag, AUTH_TAG_BYTES, 'export_auth_tag_invalid');
    const ciphertext = decodePart(envelope.ciphertext, 1, 'export_ciphertext_invalid');
    try {
      const decipher = createDecipheriv('aes-256-gcm', this.#key, nonce);
      decipher.setAAD(Buffer.from(`${input.workspaceId}|${input.exportId}`, 'utf8'));
      decipher.setAuthTag(authTag);
      return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    } catch (cause) {
      throw invalidEnvelope(cause);
    }
  }
}
