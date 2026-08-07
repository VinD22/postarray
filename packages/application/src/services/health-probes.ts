import { randomUUID } from 'node:crypto';

import type { KeyValueStore, StoragePort } from '../types';

type KeyValueProbePort = Pick<KeyValueStore, 'delete' | 'get' | 'set'>;
type StorageProbePort = Pick<StoragePort, 'head'>;

function probeError(name: 'KeyValueRoundtripMismatch' | 'KeyValueWriteRejected'): Error {
  const error = new Error(name);
  error.name = name;
  return error;
}

function missingStorageProbeError(): Error {
  const error = new Error('StorageProbeMissing');
  error.name = 'StorageProbeMissing';
  return error;
}

/** Prove that the coordination store can write, read and delete exact values. */
export async function probeKeyValueRoundtrip(
  kv: KeyValueProbePort,
  nonce: () => string = randomUUID,
): Promise<void> {
  const key = `health:probe:${nonce()}`;
  const expected = nonce();
  let created = false;

  try {
    created = await kv.set(key, expected, { ifAbsent: true, ttlSeconds: 5 });
    if (!created) throw probeError('KeyValueWriteRejected');

    const observed = await kv.get(key);
    if (observed !== expected) throw probeError('KeyValueRoundtripMismatch');
  } finally {
    if (created) await kv.delete(key);
  }
}

/** Prove that the configured private bucket contains the release sentinel. */
export async function probeStorageHead(
  storage: StorageProbePort,
  key = 'health/probe',
): Promise<void> {
  const object = await storage.head(key);
  if (object === null) throw missingStorageProbeError();
}
