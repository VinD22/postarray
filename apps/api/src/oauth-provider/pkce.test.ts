import { randomBytes } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import {
  deriveChallenge,
  isValidCodeChallenge,
  isValidCodeVerifier,
  redirectUriMatches,
  resolveRedirectUri,
  verifyCodeVerifier,
} from './pkce.js';

describe('code verifier and challenge', () => {
  it('round trips a valid verifier', () => {
    const verifier = randomBytes(48).toString('base64url');
    expect(isValidCodeVerifier(verifier)).toBe(true);
    const challenge = deriveChallenge(verifier);
    expect(isValidCodeChallenge(challenge)).toBe(true);
    expect(verifyCodeVerifier(verifier, challenge)).toBe(true);
  });

  it('rejects a verifier that is not the one the challenge was derived from', () => {
    const challenge = deriveChallenge(randomBytes(48).toString('base64url'));
    expect(verifyCodeVerifier(randomBytes(48).toString('base64url'), challenge)).toBe(false);
  });

  it('rejects verifiers outside the specified length range', () => {
    expect(isValidCodeVerifier('a'.repeat(42))).toBe(false);
    expect(isValidCodeVerifier('a'.repeat(43))).toBe(true);
    expect(isValidCodeVerifier('a'.repeat(128))).toBe(true);
    expect(isValidCodeVerifier('a'.repeat(129))).toBe(false);
  });

  it('rejects a verifier containing characters outside the unreserved set', () => {
    expect(isValidCodeVerifier(`${'a'.repeat(42)}+`)).toBe(false);
    expect(isValidCodeVerifier(`${'a'.repeat(42)}/`)).toBe(false);
  });

  it('rejects a challenge that is not a base64url SHA-256 digest', () => {
    expect(isValidCodeChallenge('too-short')).toBe(false);
    expect(isValidCodeChallenge('a'.repeat(44))).toBe(false);
    expect(isValidCodeChallenge('a'.repeat(43))).toBe(true);
  });
});

describe('redirect URI matching', () => {
  const registered = 'https://partner.example/callback';

  it('accepts only the exact registered value', () => {
    expect(redirectUriMatches(registered, registered)).toBe(true);
  });

  it('rejects every near miss', () => {
    for (const candidate of [
      'https://partner.example/callback/',
      'https://partner.example/callback?next=1',
      'https://partner.example/Callback',
      'https://partner.example.evil/callback',
      'https://evil.partner.example/callback',
      'http://partner.example/callback',
      'https://partner.example/callback#fragment',
    ]) {
      expect(redirectUriMatches(candidate, registered)).toBe(false);
    }
  });

  it('ignores the port for a loopback literal, as native clients require', () => {
    expect(
      redirectUriMatches('http://127.0.0.1:54321/callback', 'http://127.0.0.1:1/callback'),
    ).toBe(true);
    // The hostname form is not accepted: name resolution is attacker-influenced.
    expect(
      redirectUriMatches('http://localhost:54321/callback', 'http://127.0.0.1:1/callback'),
    ).toBe(false);
  });

  it('resolves against a list and returns null when nothing matches', () => {
    expect(resolveRedirectUri(registered, ['https://other.example/cb', registered])).toBe(
      registered,
    );
    expect(resolveRedirectUri('https://nope.example/cb', [registered])).toBeNull();
  });
});
