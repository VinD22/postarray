import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Inbound and outbound webhook signatures.
 *
 * The order of operations is a security control, not a style preference:
 * verify the signature over the **raw bytes**, then parse. A JSON parse is a
 * side effect on attacker-controlled input, and a handler that parses first has
 * already acted on an unverified message
 * (`04-auth-oauth-and-security.md`, section 14.4).
 *
 * Signature base string: `"<timestamp>.<raw body>"`, HMAC-SHA256, hex encoded.
 * The timestamp is signed, so a captured request cannot be replayed with a
 * fresh timestamp, and it is checked against a five minute window in either
 * direction so clock skew does not become an outage.
 */

/** Accepted clock skew in either direction, in seconds. */
export const SIGNATURE_TOLERANCE_SECONDS = 300;

export interface SignatureVerification {
  readonly valid: boolean;
  readonly reason?: 'missing' | 'malformed' | 'stale' | 'mismatch';
}

/** The canonical string that gets signed. */
export function signatureBase(timestamp: string, rawBody: Buffer | string): string {
  const body = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
  return `${timestamp}.${body}`;
}

/** Produce the hex signature for a payload. Used for outbound deliveries. */
export function signPayload(secret: string, timestamp: string, rawBody: Buffer | string): string {
  return createHmac('sha256', secret).update(signatureBase(timestamp, rawBody), 'utf8').digest('hex');
}

export interface VerifyInput {
  readonly secrets: readonly string[];
  readonly signatureHeader: string | undefined;
  readonly timestampHeader: string | undefined;
  readonly rawBody: Buffer | undefined;
  /** Epoch seconds, from the injected clock. Never from the wall clock here. */
  readonly nowEpochSeconds: number;
  readonly toleranceSeconds?: number;
}

/**
 * Verify an inbound signature.
 *
 * `secrets` is a list so a signing secret can be rotated with a 24 hour overlap:
 * we accept either the current or the previous key, and a receiver never sees
 * a failed delivery because of a rotation.
 *
 * A header may carry several comma-separated candidate signatures (some
 * providers send one per active key). Every candidate is compared in constant
 * time and the loop does not short-circuit, so timing reveals nothing.
 */
export function verifySignature(input: VerifyInput): SignatureVerification {
  if (
    input.signatureHeader === undefined ||
    input.timestampHeader === undefined ||
    input.rawBody === undefined
  ) {
    return { valid: false, reason: 'missing' };
  }

  const timestamp = Number.parseInt(input.timestampHeader, 10);
  if (!Number.isFinite(timestamp)) {
    return { valid: false, reason: 'malformed' };
  }

  const tolerance = input.toleranceSeconds ?? SIGNATURE_TOLERANCE_SECONDS;
  if (Math.abs(input.nowEpochSeconds - timestamp) > tolerance) {
    return { valid: false, reason: 'stale' };
  }

  const candidates = input.signatureHeader
    .split(',')
    .map((part) => part.trim().replace(/^v1=/, ''))
    .filter((part) => /^[0-9a-f]{64}$/.test(part));
  if (candidates.length === 0) {
    return { valid: false, reason: 'malformed' };
  }

  let matched = false;
  for (const secret of input.secrets) {
    const expected = Buffer.from(
      signPayload(secret, input.timestampHeader, input.rawBody),
      'hex',
    );
    for (const candidate of candidates) {
      const presented = Buffer.from(candidate, 'hex');
      if (presented.length === expected.length && timingSafeEqual(presented, expected)) {
        matched = true;
      }
    }
  }
  return matched ? { valid: true } : { valid: false, reason: 'mismatch' };
}

/** Stable hash of a raw body, stored in the inbox for replay forensics. */
export function bodyHash(rawBody: Buffer | string): string {
  return createHash('sha256').update(rawBody).digest('hex');
}
