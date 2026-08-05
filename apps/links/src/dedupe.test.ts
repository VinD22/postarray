import { describe, expect, it } from 'vitest';

import {
  DEFAULT_DEDUPE_RETENTION_SECONDS,
  buildDedupeKey,
  coarsenAddress,
  dedupeKeysMatch,
  windowStart,
} from './dedupe.js';

const HASH_KEY = 'test-hash-key-not-a-secret';
const BASE = Date.parse('2026-08-04T12:34:56.000Z');

function key(overrides: Partial<Parameters<typeof buildDedupeKey>[0]> = {}): string {
  return buildDedupeKey({
    linkId: 'lnk_1',
    remoteAddress: '203.0.113.9',
    userAgent: 'Mozilla/5.0 (Macintosh)',
    nowMs: BASE,
    hashKey: HASH_KEY,
    ...overrides,
  }).key;
}

describe('coarsenAddress', () => {
  it('drops the final ipv4 octet', () => {
    expect(coarsenAddress('203.0.113.9')).toBe('v4:203.0.113');
    expect(coarsenAddress('203.0.113.250')).toBe('v4:203.0.113');
  });

  it('keeps only the first three ipv6 groups', () => {
    expect(coarsenAddress('2001:db8:abcd:1234::1')).toBe('v6:2001:db8:abcd');
    expect(coarsenAddress('[2001:db8:abcd:9999::7]%eth0')).toBe('v6:2001:db8:abcd');
  });

  it('has a stable answer when the edge gives us nothing', () => {
    expect(coarsenAddress(undefined)).toBe('unknown');
    expect(coarsenAddress('   ')).toBe('unknown');
  });
});

describe('windowStart', () => {
  it('buckets the clock', () => {
    expect(windowStart(BASE, 1800)).toBe(windowStart(BASE + 60_000, 1800));
    expect(windowStart(BASE, 1800)).not.toBe(windowStart(BASE + 1800_000, 1800));
  });
});

describe('buildDedupeKey', () => {
  it('collapses a repeat inside the window', () => {
    expect(key()).toBe(key({ nowMs: BASE + 60_000 }));
  });

  it('produces a new key in the next window', () => {
    expect(key()).not.toBe(key({ nowMs: BASE + 31 * 60_000 }));
  });

  it('separates links, visitors and agents', () => {
    expect(key()).not.toBe(key({ linkId: 'lnk_2' }));
    expect(key()).not.toBe(key({ remoteAddress: '198.51.100.4' }));
    expect(key()).not.toBe(key({ userAgent: 'Mozilla/5.0 (X11; Linux)' }));
  });

  it('collapses a rotating last octet from the same visitor', () => {
    expect(key({ remoteAddress: '203.0.113.9' })).toBe(key({ remoteAddress: '203.0.113.44' }));
  });

  it('never leaks the address into the key material', () => {
    const result = buildDedupeKey({
      linkId: 'lnk_1',
      remoteAddress: '203.0.113.9',
      userAgent: 'Mozilla/5.0',
      nowMs: BASE,
      hashKey: HASH_KEY,
    });
    expect(result.key).not.toContain('203');
    expect(result.key).toMatch(/^[A-Za-z0-9_-]{32}$/);
  });

  it('bounds retention of the key itself', () => {
    const result = buildDedupeKey({
      linkId: 'lnk_1',
      remoteAddress: '203.0.113.9',
      userAgent: 'Mozilla/5.0',
      nowMs: BASE,
      hashKey: HASH_KEY,
    });
    expect(result.expiresAtMs).toBe(BASE + DEFAULT_DEDUPE_RETENTION_SECONDS * 1000);
  });

  it('changes completely when the server key rotates', () => {
    expect(key()).not.toBe(key({ hashKey: 'a-different-key' }));
  });
});

describe('dedupeKeysMatch', () => {
  it('compares equal and unequal keys', () => {
    expect(dedupeKeysMatch('abc', 'abc')).toBe(true);
    expect(dedupeKeysMatch('abc', 'abd')).toBe(false);
    expect(dedupeKeysMatch('abc', 'abcd')).toBe(false);
  });
});
