import { describe, expect, it } from 'vitest';

import type { KeyValueStore, StoragePort } from '../types';
import { probeKeyValueRoundtrip, probeStorageHead } from './health-probes';

type KeyValueProbePort = Pick<KeyValueStore, 'delete' | 'get' | 'set'>;
type StorageProbePort = Pick<StoragePort, 'head'>;

function nonceSequence(...values: readonly string[]): () => string {
  let index = 0;
  return () => values[index++] ?? 'unexpected-nonce';
}

describe('probeKeyValueRoundtrip', () => {
  it('writes, reads and removes one unique ephemeral value', async () => {
    const stored = new Map<string, string>();
    const deleted: string[] = [];
    const kv: KeyValueProbePort = {
      async set(key, value, options) {
        expect(options).toEqual({ ifAbsent: true, ttlSeconds: 5 });
        if (stored.has(key)) return false;
        stored.set(key, value);
        return true;
      },
      async get(key) {
        return stored.get(key) ?? null;
      },
      async delete(key) {
        deleted.push(key);
        stored.delete(key);
      },
    };

    await probeKeyValueRoundtrip(kv, nonceSequence('probe-id', 'probe-value'));

    expect(stored.size).toBe(0);
    expect(deleted).toEqual(['health:probe:probe-id']);
  });

  it('fails and still removes the probe when the value does not round trip', async () => {
    const deleted: string[] = [];
    const kv: KeyValueProbePort = {
      async set() {
        return true;
      },
      async get() {
        return 'different-value';
      },
      async delete(key) {
        deleted.push(key);
      },
    };

    await expect(
      probeKeyValueRoundtrip(kv, nonceSequence('probe-id', 'probe-value')),
    ).rejects.toMatchObject({ name: 'KeyValueRoundtripMismatch' });
    expect(deleted).toEqual(['health:probe:probe-id']);
  });

  it('does not delete a key it failed to create', async () => {
    let deleted = false;
    const kv: KeyValueProbePort = {
      async set() {
        return false;
      },
      async get() {
        return null;
      },
      async delete() {
        deleted = true;
      },
    };

    await expect(
      probeKeyValueRoundtrip(kv, nonceSequence('collision', 'probe-value')),
    ).rejects.toMatchObject({ name: 'KeyValueWriteRejected' });
    expect(deleted).toBe(false);
  });
});

describe('probeStorageHead', () => {
  it('passes only when the configured bucket returns the release sentinel', async () => {
    const storage: StorageProbePort = {
      async head(key) {
        return {
          key,
          byteSize: 1,
          contentType: 'application/octet-stream',
          checksumSha256: '00'.repeat(32),
        };
      },
    };

    await expect(probeStorageHead(storage)).resolves.toBeUndefined();
  });

  it('fails when the sentinel, bucket or readable metadata is unavailable', async () => {
    const storage: StorageProbePort = {
      async head() {
        return null;
      },
    };

    await expect(probeStorageHead(storage)).rejects.toMatchObject({
      name: 'StorageProbeMissing',
    });
  });
});
