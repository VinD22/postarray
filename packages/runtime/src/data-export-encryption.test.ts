import { createDecipheriv } from 'node:crypto';

import type { RelayError } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { LocalDataExportEncryption } from './data-export-encryption';

const key = Buffer.alloc(32, 9);

describe('LocalDataExportEncryption', () => {
  it('encrypts an export envelope that can be authenticated with workspace-bound AAD', async () => {
    const encryption = new LocalDataExportEncryption(key.toString('base64'), 'test-v1');
    const plaintext = Buffer.from('{"workspace":"ws_123","body":"keep this private"}', 'utf8');
    const first = await encryption.encrypt({
      workspaceId: 'ws_123',
      exportId: 'export_123',
      plaintext,
    });
    const second = await encryption.encrypt({
      workspaceId: 'ws_123',
      exportId: 'export_123',
      plaintext,
    });

    expect(Buffer.from(first.bytes).equals(Buffer.from(second.bytes))).toBe(false);
    const envelope = JSON.parse(Buffer.from(first.bytes).toString('utf8')) as {
      format: string;
      algorithm: string;
      keyVersion: string;
      nonce: string;
      authTag: string;
      ciphertext: string;
    };
    expect(envelope).toMatchObject({
      format: 'relay-export-encrypted-v1',
      algorithm: 'aes-256-gcm',
      keyVersion: 'test-v1',
    });
    expect(Buffer.from(first.bytes).toString('utf8')).not.toContain(plaintext.toString('utf8'));

    const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(envelope.nonce, 'base64'));
    decipher.setAAD(Buffer.from('ws_123|export_123', 'utf8'));
    decipher.setAuthTag(Buffer.from(envelope.authTag, 'base64'));
    const recovered = Buffer.concat([
      decipher.update(Buffer.from(envelope.ciphertext, 'base64')),
      decipher.final(),
    ]);
    expect(recovered.equals(plaintext)).toBe(true);
  });

  it('rejects keys that cannot provide AES-256 encryption', () => {
    expect(() => new LocalDataExportEncryption(Buffer.alloc(16).toString('base64'))).toThrowError(
      expect.objectContaining<Partial<RelayError>>({ code: 'INTERNAL' }),
    );
  });
});
