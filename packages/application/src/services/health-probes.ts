import { randomUUID } from 'node:crypto';

import type { KeyValueStore } from '../types';

type KeyValueProbePort = Pick<KeyValueStore, 'delete' | 'get' | 'set'>;

function probeError(name: 'KeyValueRoundtripMismatch' | 'KeyValueWriteRejected'): Error {
  const error = new Error(name);
  error.name = name;
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
