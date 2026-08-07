import { createCipheriv, randomBytes } from 'node:crypto';

import type { DataExportEncryptionPort } from '@relay/application';
import { RelayError } from '@relay/contracts';

const KEY_BYTES = 32;
const NONCE_BYTES = 12;

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
}
