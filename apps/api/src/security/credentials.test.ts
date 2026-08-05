import { describe, expect, it } from 'vitest';

import {
  CREDENTIAL_PREFIXES,
  constantTimeEquals,
  hashSecret,
  issueCredential,
  parseCredential,
  randomBase62,
  secretMatches,
} from './credentials.js';

const PEPPER = 'a-server-held-pepper-for-tests';

describe('credential minting', () => {
  it('produces a parseable credential whose secret verifies', () => {
    const issued = issueCredential(CREDENTIAL_PREFIXES.apiKey, PEPPER);
    const parsed = parseCredential(issued.plaintext);

    expect(parsed).not.toBeNull();
    expect(parsed?.prefix).toBe(CREDENTIAL_PREFIXES.apiKey);
    expect(parsed?.publicPrefix).toBe(issued.publicPrefix);
    expect(secretMatches(parsed?.secret ?? '', issued.secretHash, PEPPER)).toBe(true);
  });

  it('never stores anything from which the secret can be recovered', () => {
    const issued = issueCredential(CREDENTIAL_PREFIXES.apiKey, PEPPER);
    const secret = parseCredential(issued.plaintext)?.secret ?? '';

    expect(issued.secretHash).toMatch(/^[0-9a-f]{64}$/);
    expect(issued.secretHash).not.toContain(secret);
    // The public prefix is not a secret and is stored in the clear.
    expect(issued.plaintext).toContain(issued.publicPrefix);
  });

  it('does not verify under a different pepper', () => {
    const issued = issueCredential(CREDENTIAL_PREFIXES.apiKey, PEPPER);
    const secret = parseCredential(issued.plaintext)?.secret ?? '';

    // A database dump alone is not enough to verify a guess.
    expect(secretMatches(secret, issued.secretHash, 'a-different-pepper')).toBe(false);
  });

  it('mints distinct credentials', () => {
    const values = new Set(
      Array.from(
        { length: 200 },
        () => issueCredential(CREDENTIAL_PREFIXES.accessToken, PEPPER).plaintext,
      ),
    );
    expect(values.size).toBe(200);
  });

  it('rejects malformed presentations rather than guessing', () => {
    for (const candidate of [
      '',
      'rly_ak_',
      'rly_ak_short_x',
      'rly_zz_abcdefgh_aaaaaaaaaaaaaaaaaaaaaaaa',
      `rly_ak_abcdefgh_${'!'.repeat(30)}`,
    ]) {
      expect(parseCredential(candidate)).toBeNull();
    }
  });

  it('produces a stable length from base62 encoding', () => {
    const lengths = new Set(Array.from({ length: 100 }, () => randomBase62(32).length));
    expect(lengths.size).toBe(1);
  });
});

describe('constant time comparison', () => {
  it('is true only for identical values', () => {
    expect(constantTimeEquals('abc', 'abc')).toBe(true);
    expect(constantTimeEquals('abc', 'abd')).toBe(false);
    // Different lengths must not short-circuit into an early false.
    expect(constantTimeEquals('abc', 'abcdefghijklmnop')).toBe(false);
    expect(constantTimeEquals('', '')).toBe(true);
  });
});

describe('hashSecret', () => {
  it('is deterministic for the same pepper and different across peppers', () => {
    expect(hashSecret('value', PEPPER)).toBe(hashSecret('value', PEPPER));
    expect(hashSecret('value', PEPPER)).not.toBe(hashSecret('value', 'other'));
  });
});
