import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * PKCE (RFC 7636), mandatory for every client type.
 *
 * `S256` only. `plain` is rejected, because a `plain` challenge is the verifier
 * in clear text and offers no protection against an attacker who can read the
 * authorization request. Public and confidential clients are treated
 * identically here: a client secret proves which application is talking to us,
 * and PKCE proves that the party redeeming the code is the party that started
 * the flow. Those are different claims, and both are required.
 */

export const CODE_CHALLENGE_METHOD = 'S256' as const;

/** A verifier is 43 to 128 characters from the unreserved URI set. */
const VERIFIER_PATTERN = /^[A-Za-z0-9\-._~]{43,128}$/;
/** A base64url-encoded SHA-256 digest is exactly 43 characters, unpadded. */
const CHALLENGE_PATTERN = /^[A-Za-z0-9\-_]{43}$/;

export function isValidCodeVerifier(value: string): boolean {
  return VERIFIER_PATTERN.test(value);
}

export function isValidCodeChallenge(value: string): boolean {
  return CHALLENGE_PATTERN.test(value);
}

/** `BASE64URL(SHA256(ASCII(verifier)))`. */
export function deriveChallenge(verifier: string): string {
  return createHash('sha256').update(verifier, 'ascii').digest('base64url');
}

/** Constant-time comparison of a presented verifier against a stored challenge. */
export function verifyCodeVerifier(verifier: string, storedChallenge: string): boolean {
  if (!isValidCodeVerifier(verifier) || !isValidCodeChallenge(storedChallenge)) {
    return false;
  }
  const derived = Buffer.from(deriveChallenge(verifier), 'utf8');
  const expected = Buffer.from(storedChallenge, 'utf8');
  if (derived.length !== expected.length) {
    return false;
  }
  return timingSafeEqual(derived, expected);
}

/**
 * Exact redirect URI matching.
 *
 * Byte-for-byte equality after WHATWG URL normalization, with one carve-out
 * from the native app BCP: for a loopback address the port is ignored, because
 * a native client binds an ephemeral port it cannot know at registration time.
 * Everything else is exact. No prefix match, no wildcard, no subdomain
 * wildcard, no trailing-slash tolerance: every one of those has been a real
 * account takeover in a real product.
 */
export function redirectUriMatches(presented: string, registered: string): boolean {
  let left: URL;
  let right: URL;
  try {
    left = new URL(presented);
    right = new URL(registered);
  } catch {
    return false;
  }
  if (left.hash.length > 0 || right.hash.length > 0) {
    return false;
  }
  if (left.protocol !== right.protocol) {
    return false;
  }
  if (left.hostname !== right.hostname) {
    return false;
  }
  if (left.pathname !== right.pathname || left.search !== right.search) {
    return false;
  }
  const loopback =
    left.hostname === '127.0.0.1' || left.hostname === '[::1]' || left.hostname === '::1';
  return loopback || left.port === right.port;
}

/** The first registered URI matching the presented one, or null. */
export function resolveRedirectUri(
  presented: string,
  registered: readonly string[],
): string | null {
  return registered.find((candidate) => redirectUriMatches(presented, candidate)) ?? null;
}
