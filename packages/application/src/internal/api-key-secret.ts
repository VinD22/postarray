import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * Minting and hashing the one secret this package ever produces.
 *
 * Both workspace API keys and service-account credentials use it, so the rule
 * lives in one file: the plaintext exists only inside the call that created it,
 * and only `salt$digest` is ever written down. A credential the server can read
 * back is a credential the server can leak.
 *
 * The stored form records its own algorithm alongside it (`hashAlgorithm` on
 * the row) so moving to Argon2id later is a mechanical migration rather than an
 * archaeological one.
 */

export const API_KEY_PREFIX = 'rly_ak';
export const HASH_ALGORITHM = 'sha256-salted';

export interface MintedSecret {
  /** The public, greppable fragment. Safe to store and to show. */
  readonly prefix: string;
  /** `salt$digest`. The only form that is written down. */
  readonly storedHash: string;
  /** The full credential. Returned to the caller exactly once, never stored. */
  readonly plaintext: string;
}

/**
 * Deterministic hash of the secret with a per-credential salt.
 *
 * Hex stays inside the public credential grammar used by every edge; base64url
 * may contain `-` or `_`, which makes separator parsing ambiguous.
 */
export function hashSecret(secret: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${secret}`).digest('hex');
}

export function mintApiKeySecret(): MintedSecret {
  const prefix = `${API_KEY_PREFIX}_${randomBytes(6).toString('hex').slice(0, 8)}`;
  const secret = randomBytes(32).toString('hex');
  const salt = randomBytes(16).toString('base64url');
  return {
    prefix,
    storedHash: `${salt}$${hashSecret(secret, salt)}`,
    plaintext: `${prefix}_${secret}`,
  };
}

/** Constant time comparison, so a verification loop leaks no timing signal. */
export function secretMatches(candidateHash: string, storedHash: string): boolean {
  const left = Buffer.from(candidateHash, 'utf8');
  const right = Buffer.from(storedHash, 'utf8');
  return left.length === right.length && timingSafeEqual(left, right);
}
