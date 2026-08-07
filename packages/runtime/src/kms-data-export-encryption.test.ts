import { describe, expect, it, vi } from 'vitest';

import type { DataExportKmsClient } from './kms-data-export-encryption';
import { KmsDataExportEncryption } from './kms-data-export-encryption';

class FakeKmsClient implements DataExportKmsClient {
  readonly generatedContexts: Readonly<Record<string, string>>[] = [];
  readonly decryptContexts: Readonly<Record<string, string>>[] = [];
  readonly #dataKey = Buffer.alloc(32, 4);

  async generateDataKey(input: {
    readonly keyId: string;
    readonly encryptionContext: Readonly<Record<string, string>>;
  }): Promise<{ plaintext: Uint8Array; ciphertext: Uint8Array; keyId: string | null }> {
    expect(input.keyId).toBe('alias/relay-exports');
    this.generatedContexts.push(input.encryptionContext);
    return {
      plaintext: Buffer.from(this.#dataKey),
      ciphertext: Buffer.from('wrapped-data-key', 'utf8'),
      keyId: 'arn:aws:kms:us-east-2:123:key/test',
    };
  }

  async decrypt(input: {
    readonly ciphertext: Uint8Array;
    readonly encryptionContext: Readonly<Record<string, string>>;
  }): Promise<Uint8Array> {
    expect(Buffer.from(input.ciphertext).toString('utf8')).toBe('wrapped-data-key');
    this.decryptContexts.push(input.encryptionContext);
    return Buffer.from(this.#dataKey);
  }
}

describe('KmsDataExportEncryption', () => {
  it('uses a fresh envelope and binds encryption to workspace and export ids', async () => {
    const client = new FakeKmsClient();
    const encryption = new KmsDataExportEncryption({
      keyId: 'alias/relay-exports',
      client,
    });
    const plaintext = Buffer.from('{"workspace":"private"}', 'utf8');

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

    expect(first.keyVersion).toContain('arn:aws:kms');
    expect(Buffer.from(first.bytes).equals(Buffer.from(second.bytes))).toBe(false);
    expect(Buffer.from(first.bytes).toString('utf8')).not.toContain(plaintext.toString('utf8'));
    expect(client.generatedContexts).toEqual([
      { relay_workspace_id: 'ws_123', relay_export_id: 'export_123' },
      { relay_workspace_id: 'ws_123', relay_export_id: 'export_123' },
    ]);

    await expect(
      encryption.decrypt({ workspaceId: 'ws_123', exportId: 'export_123', bytes: first.bytes }),
    ).resolves.toEqual(plaintext);
    await expect(
      encryption.decrypt({ workspaceId: 'ws_other', exportId: 'export_123', bytes: first.bytes }),
    ).rejects.toMatchObject({ code: 'INTERNAL' });
    expect(client.decryptContexts.at(-1)).toEqual({
      relay_workspace_id: 'ws_other',
      relay_export_id: 'export_123',
    });
  });

  it('sanitizes failures from the KMS port', async () => {
    const client: DataExportKmsClient = {
      generateDataKey: vi.fn().mockRejectedValue(new Error('provider secret')),
      decrypt: vi.fn(),
    };
    const encryption = new KmsDataExportEncryption({ keyId: 'alias/relay-exports', client });

    await expect(
      encryption.encrypt({
        workspaceId: 'ws_123',
        exportId: 'export_123',
        plaintext: Buffer.from('x'),
      }),
    ).rejects.toMatchObject({
      code: 'PROVIDER_UNAVAILABLE',
      details: { subsystem: 'kms', operation: 'generate_data_key' },
    });
  });
});
