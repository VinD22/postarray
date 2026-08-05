import { createHmac } from 'node:crypto';

import { constantTimeEquals, randomToken } from './credentials.js';

/**
 * CSRF protection for cookie-authenticated routes.
 *
 * Two independent controls, both required, because `SameSite` alone has known
 * gaps (`04-auth-oauth-and-security.md`, section 14.2):
 *
 * 1. A **signed double-submit token**. The value is
 *    `<nonce>.<HMAC(session secret, nonce)>`. A plain double-submit cookie is
 *    forgeable by anything that can write a cookie on a sibling subdomain; the
 *    signature binds the token to this exact session, so a cookie an attacker
 *    plants does not verify.
 * 2. An **exact `Origin` allowlist**. A state-changing request with a missing
 *    or unlisted `Origin` is rejected. Not a prefix match, not a suffix match:
 *    `https://relay.app.evil.com` must not pass a check for `https://relay.app`.
 *
 * Bearer-authenticated requests carry no ambient credential and are therefore
 * not CSRF-exposed. They skip both controls. A request carrying *both* a cookie
 * and a bearer token is rejected outright, because that combination almost
 * always means a confused client, and guessing which credential was intended is
 * how privilege confusion bugs start.
 */

export const CSRF_HEADER = 'x-relay-csrf-token';

/** Methods that may change state and therefore need the token. */
export const STATE_CHANGING_METHODS: ReadonlySet<string> = new Set([
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
]);

export interface CsrfToken {
  /** Sent to the client in a readable cookie and echoed in a header. */
  readonly token: string;
  /** Kept in the server-side session record. Never leaves the server. */
  readonly secret: string;
}

/** Mint a fresh CSRF secret and its first token. */
export function issueCsrfToken(): CsrfToken {
  const secret = randomToken(32);
  return { token: signCsrfNonce(randomToken(16), secret), secret };
}

/** Re-derive a token for an existing session secret. */
export function csrfTokenFor(secret: string): string {
  return signCsrfNonce(randomToken(16), secret);
}

function signCsrfNonce(nonce: string, secret: string): string {
  const signature = createHmac('sha256', secret).update(nonce, 'utf8').digest('base64url');
  return `${nonce}.${signature}`;
}

/** Verify the presented token against the session secret, in constant time. */
export function verifyCsrfToken(presented: string | undefined, secret: string): boolean {
  if (presented === undefined) {
    return false;
  }
  const separator = presented.indexOf('.');
  if (separator <= 0 || separator === presented.length - 1) {
    return false;
  }
  const nonce = presented.slice(0, separator);
  return constantTimeEquals(presented, signCsrfNonce(nonce, secret));
}

/**
 * Exact origin matching.
 *
 * The comparison is on the serialized origin (`scheme://host[:port]`), which is
 * what a browser sends, so there is no room for a path or a trailing slash to
 * change the answer.
 */
export function isAllowedOrigin(origin: string | undefined, allowlist: readonly string[]): boolean {
  if (origin === undefined || origin.length === 0) {
    return false;
  }
  let normalized: string;
  try {
    normalized = new URL(origin).origin;
  } catch {
    return false;
  }
  return allowlist.some((allowed) => {
    try {
      return new URL(allowed).origin === normalized;
    } catch {
      return false;
    }
  });
}

/**
 * A coarse client fingerprint used to bind a refresh token to the device that
 * obtained it. Deliberately coarse: IP pinning breaks mobile networks and
 * corporate proxies, while the user agent family plus an accept-language bucket
 * is stable across a session and still catches a token replayed from elsewhere.
 * A mismatch forces reauthentication; it never silently fails.
 */
export function clientFingerprint(
  userAgent: string | undefined,
  acceptLanguage: string | undefined,
): string {
  const family = (userAgent ?? 'unknown')
    .toLowerCase()
    .replace(/[0-9.]+/g, '')
    .slice(0, 120);
  const language = (acceptLanguage ?? 'unknown').split(',')[0]?.trim().toLowerCase() ?? 'unknown';
  return createHmac('sha256', 'relay.fingerprint')
    .update(`${family}|${language}`, 'utf8')
    .digest('hex')
    .slice(0, 32);
}
