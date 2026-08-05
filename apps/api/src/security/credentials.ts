import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * Bearer credential formats and their verification.
 *
 * Relay prefixes (`docs/planning/04-auth-oauth-and-security.md`, section 7.6):
 *
 * | Prefix    | Credential                          |
 * | --------- | ----------------------------------- |
 * | `rly_pk_` | developer OAuth public client id    |
 * | `rly_cs_` | developer OAuth client secret       |
 * | `rly_at_` | access token (opaque reference)     |
 * | `rly_rt_` | refresh token (opaque, rotating)    |
 * | `rly_ak_` | workspace API key                   |
 * | `rly_ac_` | authorization code                  |
 *
 * ## Why keyed SHA-256 and not Argon2id
 *
 * The security plan writes `argon2id(secret)` for API keys and client secrets.
 * A password hash exists to make an offline dictionary attack expensive against
 * a *low entropy* secret a human chose. Every secret in this file is 256 bits
 * from `crypto.randomBytes`, so there is no dictionary and nothing to slow
 * down. What matters instead is that a database read alone must not yield a
 * usable credential, and that verification is fast enough to sit on the hot
 * path of every authenticated request.
 *
 * So these are stored as HMAC-SHA256 under a server-held pepper that lives in
 * KMS or the environment, never in the database. An attacker with a full
 * database dump still cannot verify a guess. A memory-hard function on this
 * path would add latency to every request and buy nothing.
 *
 * User passwords are not in this file. They are Supabase Auth's job, and
 * Supabase does use a password hash. See `modules/auth`.
 */

export const CREDENTIAL_PREFIXES = {
  publicClientId: 'rly_pk_',
  clientSecret: 'rly_cs_',
  accessToken: 'rly_at_',
  refreshToken: 'rly_rt_',
  apiKey: 'rly_ak_',
  authorizationCode: 'rly_ac_',
} as const;

export type CredentialPrefix = (typeof CREDENTIAL_PREFIXES)[keyof typeof CREDENTIAL_PREFIXES];

/** Secret entropy, in bytes. 256 bits everywhere. */
export const SECRET_BYTES = 32;
/** Public, non-secret identifier used for lookup and log correlation. */
export const PUBLIC_PREFIX_LENGTH = 8;

const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/** URL-safe, case-sensitive, no padding, no ambiguous separator characters. */
export function randomBase62(byteLength: number): string {
  const bytes = randomBytes(byteLength);
  let value = 0n;
  for (const byte of bytes) {
    value = (value << 8n) | BigInt(byte);
  }
  let encoded = '';
  while (value > 0n) {
    const index = Number(value % 62n);
    const character = BASE62[index];
    if (character === undefined) {
      throw new RangeError('BASE62_ENCODING_OUT_OF_RANGE');
    }
    encoded = character + encoded;
    value /= 62n;
  }
  // A leading zero byte would shorten the string; pad so the length is stable.
  const minimumLength = Math.ceil((byteLength * 8) / Math.log2(62));
  return encoded.padStart(minimumLength, '0');
}

export interface IssuedCredential {
  /** The full string shown to the caller exactly once. Never stored. */
  readonly plaintext: string;
  /** Stored in the clear, for display and log correlation. Not a secret. */
  readonly publicPrefix: string;
  /** Stored. Verification recomputes this and compares in constant time. */
  readonly secretHash: string;
}

/**
 * Mint a credential of the given kind.
 *
 * Layout: `<prefix><8 char public id>_<secret>`. The public id is what a log
 * line, a rate limiter and a "which key was this" screen may show. The secret
 * after it is shown once and never again.
 */
export function issueCredential(prefix: CredentialPrefix, pepper: string): IssuedCredential {
  const publicPrefix = randomBase62(6)
    .slice(0, PUBLIC_PREFIX_LENGTH)
    .padEnd(PUBLIC_PREFIX_LENGTH, '0');
  const secret = randomBase62(SECRET_BYTES);
  return {
    plaintext: `${prefix}${publicPrefix}_${secret}`,
    publicPrefix,
    secretHash: hashSecret(secret, pepper),
  };
}

export interface ParsedCredential {
  readonly prefix: CredentialPrefix;
  readonly publicPrefix: string;
  readonly secret: string;
}

const PARSE_PATTERN = /^(rly_(?:pk|cs|at|rt|ak|ac)_)([0-9A-Za-z]{8})_([0-9A-Za-z]{20,64})$/;

/** Parse a presented credential. Returns null for anything malformed. */
export function parseCredential(value: string): ParsedCredential | null {
  const match = value.trim().match(PARSE_PATTERN);
  if (match === null) {
    return null;
  }
  const [, prefix, publicPrefix, secret] = match;
  if (prefix === undefined || publicPrefix === undefined || secret === undefined) {
    return null;
  }
  return { prefix: prefix as CredentialPrefix, publicPrefix, secret };
}

/** Keyed digest of a secret. The pepper never leaves the server. */
export function hashSecret(secret: string, pepper: string): string {
  return createHmac('sha256', pepper).update(secret, 'utf8').digest('hex');
}

/** Constant-time comparison of a presented secret against a stored digest. */
export function secretMatches(presented: string, stored: string, pepper: string): boolean {
  const computed = Buffer.from(hashSecret(presented, pepper), 'hex');
  const expected = Buffer.from(stored, 'hex');
  if (expected.length !== computed.length || expected.length === 0) {
    return false;
  }
  return timingSafeEqual(computed, expected);
}

/**
 * Constant-time equality for two opaque strings of any length. Both sides are
 * digested first so neither the content nor the length is observable in timing.
 */
export function constantTimeEquals(left: string, right: string): boolean {
  const leftDigest = createHmac('sha256', 'relay.compare').update(left, 'utf8').digest();
  const rightDigest = createHmac('sha256', 'relay.compare').update(right, 'utf8').digest();
  return timingSafeEqual(leftDigest, rightDigest);
}

/** An opaque, single-use token such as an authorization code or a session id. */
export function randomToken(byteLength: number = SECRET_BYTES): string {
  return randomBytes(byteLength).toString('base64url');
}
