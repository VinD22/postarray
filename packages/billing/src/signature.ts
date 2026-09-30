/**
 * Polar webhook signatures, which follow Standard Webhooks
 * (https://www.standardwebhooks.com/).
 *
 * Three headers: `webhook-id`, `webhook-timestamp` (integer seconds) and
 * `webhook-signature`, a space-separated list of `v1,<base64 HMAC-SHA256>`
 * entries. The signed content is `{id}.{timestamp}.{payload}` where `payload`
 * is the exact raw body bytes as received. Nothing is parsed before the
 * signature has been checked: an unverified body is inert data, stored for
 * forensics and never acted upon.
 *
 * Polar has two HMAC keys for the same `whsec_…` secret string
 * (https://polar.sh/docs/integrate/webhooks/delivery, "Custom validation"):
 *
 * - `polar_legacy`: secrets generated before 2026-09-08 00:00 UTC. The key is
 *   the UTF-8 bytes of the full secret string, prefix included. This is what
 *   `validateEvent` in `@polar-sh/sdk` does when it base64-encodes the secret
 *   before handing it to the `standardwebhooks` library.
 * - `standard_webhooks`: secrets generated on or after that instant. The key is
 *   the base64 decoding of everything after `whsec_`, as the specification says.
 *
 * The dashboard shows both as `whsec_…`, so an operator cannot tell which one
 * they pasted. Polar's own SDKs try both keys, and so does this module.
 */

import { ERROR_CODES, RelayError } from '@relay/contracts';

export const WEBHOOK_HEADER_ID = 'webhook-id';
export const WEBHOOK_HEADER_TIMESTAMP = 'webhook-timestamp';
export const WEBHOOK_HEADER_SIGNATURE = 'webhook-signature';

/** Replay window. A timestamp outside it is rejected even if the MAC matches. */
export const DEFAULT_TOLERANCE_SECONDS = 300;

const SECRET_PREFIX = 'whsec_';
const SIGNATURE_VERSION = 'v1';
const BASE64_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/;
/** Integer seconds. Twelve digits covers every plausible instant and bounds the parse. */
const TIMESTAMP_PATTERN = /^\d{1,12}$/;

const encoder = new TextEncoder();

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return globalThis.btoa(binary);
}

function base64ToBytes(value: string): Uint8Array<ArrayBuffer> {
  const binary = globalThis.atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

/** Which of Polar's two key derivations produced a signature. */
export type SigningKeyDerivation = 'polar_legacy' | 'standard_webhooks';

export interface SigningKey {
  readonly derivation: SigningKeyDerivation;
  readonly bytes: Uint8Array<ArrayBuffer>;
}

/** The spec's key: the base64 remainder after `whsec_`, or nothing if there is none. */
function standardWebhooksKey(secret: string): Uint8Array<ArrayBuffer> | null {
  // Only a prefixed secret gets a second key, so an unprefixed legacy secret
  // that happens to be valid base64 does not quietly acquire one.
  if (!secret.startsWith(SECRET_PREFIX)) {
    return null;
  }
  const encoded = secret.slice(SECRET_PREFIX.length);
  if (!BASE64_PATTERN.test(encoded)) {
    return null;
  }
  try {
    const bytes = base64ToBytes(encoded);
    return bytes.byteLength === 0 ? null : bytes;
  } catch {
    return null;
  }
}

/**
 * Every HMAC key a Polar secret may be signing with, legacy first. The legacy
 * key always exists; the Standard Webhooks key exists only for a `whsec_`
 * secret whose remainder is valid base64.
 */
export function signingKeysFor(secret: string): readonly SigningKey[] {
  const keys: SigningKey[] = [{ derivation: 'polar_legacy', bytes: encoder.encode(secret) }];
  const standard = standardWebhooksKey(secret);
  if (standard !== null) {
    keys.push({ derivation: 'standard_webhooks', bytes: standard });
  }
  return keys;
}

async function hmacSha256(
  keyBytes: Uint8Array<ArrayBuffer>,
  message: Uint8Array<ArrayBuffer>,
): Promise<Uint8Array> {
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return new Uint8Array(await globalThis.crypto.subtle.sign('HMAC', key, message));
}

/** `{id}.{timestamp}.` followed by the body bytes exactly as they arrived. */
function signedContent(
  webhookId: string,
  timestampSeconds: number,
  rawBody: string | Uint8Array,
): Uint8Array<ArrayBuffer> {
  const prefix = encoder.encode(`${webhookId}.${timestampSeconds}.`);
  const body = typeof rawBody === 'string' ? encoder.encode(rawBody) : rawBody;
  const content = new Uint8Array(prefix.byteLength + body.byteLength);
  content.set(prefix, 0);
  content.set(body, prefix.byteLength);
  return content;
}

/** sha256 of the raw body, hex. Stored on every inbox row. */
export async function hashBody(rawBody: string): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', encoder.encode(rawBody));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export interface SignWebhookInput {
  readonly secret: string;
  readonly webhookId: string;
  readonly timestampSeconds: number;
  readonly rawBody: string | Uint8Array;
  /**
   * Which key to sign with. Defaults to the Standard Webhooks key when the
   * secret has one, and the legacy key otherwise.
   */
  readonly keyDerivation?: SigningKeyDerivation;
}

/** Produce the `webhook-signature` header value, `v1,<base64 mac>`. */
export async function signWebhook(input: SignWebhookInput): Promise<string> {
  const keys = signingKeysFor(input.secret);
  const wanted = input.keyDerivation ?? keys.at(-1)?.derivation ?? 'polar_legacy';
  const key = keys.find((candidate) => candidate.derivation === wanted);
  if (key === undefined) {
    throw new RelayError(ERROR_CODES.INTERNAL, {
      details: { reason: 'webhook_secret_has_no_key', keyDerivation: wanted },
    });
  }
  const mac = await hmacSha256(
    key.bytes,
    signedContent(input.webhookId, input.timestampSeconds, input.rawBody),
  );
  return `${SIGNATURE_VERSION},${bytesToBase64(mac)}`;
}

/** Length-safe, value-independent comparison. */
export function constantTimeEquals(left: string, right: string): boolean {
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  let mismatch = leftBytes.length ^ rightBytes.length;
  const length = Math.max(leftBytes.length, rightBytes.length);
  for (let index = 0; index < length; index += 1) {
    mismatch |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }
  return mismatch === 0;
}

export const SIGNATURE_FAILURES = [
  'missing_headers',
  'missing_secret',
  'timestamp_invalid',
  'timestamp_outside_tolerance',
  'signature_malformed',
  'no_matching_signature',
] as const;
export type SignatureFailure = (typeof SIGNATURE_FAILURES)[number];

export type SignatureVerification =
  | {
      readonly state: 'verified';
      readonly webhookId: string;
      readonly timestampSeconds: number;
      readonly keyDerivation: SigningKeyDerivation;
    }
  | {
      readonly state: 'rejected';
      readonly reason: SignatureFailure;
      readonly webhookId: string | null;
    };

export interface VerifyWebhookInput {
  readonly secret: string | undefined;
  /** The exact bytes received. A string is taken as their UTF-8 decoding. */
  readonly rawBody: string | Uint8Array;
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly nowSeconds: number;
  readonly toleranceSeconds?: number;
}

function headerValue(
  headers: Readonly<Record<string, string | undefined>>,
  name: string,
): string | undefined {
  let value = headers[name];
  if (value === undefined) {
    for (const [key, candidate] of Object.entries(headers)) {
      if (key.toLowerCase() === name) {
        value = candidate;
        break;
      }
    }
  }
  const trimmed = value?.trim();
  return trimmed === undefined || trimmed.length === 0 ? undefined : trimmed;
}

/** The base64 MACs of every well-formed `v1,` entry. Other versions are ignored. */
function presentedSignatures(header: string): string[] {
  const macs: string[] = [];
  for (const entry of header.split(' ')) {
    const separator = entry.indexOf(',');
    if (separator <= 0) {
      continue;
    }
    const mac = entry.slice(separator + 1);
    if (entry.slice(0, separator) === SIGNATURE_VERSION && BASE64_PATTERN.test(mac)) {
      macs.push(mac);
    }
  }
  return macs;
}

/**
 * Verify a delivery. The result is data, not an exception, because a rejected
 * body still has to be written to the inbox with `signature_state = rejected`.
 *
 * Every presented signature is compared against every key, and the loop does
 * not stop at the first match, so timing reveals neither which entry nor which
 * key matched.
 */
export async function verifyWebhookSignature(
  input: VerifyWebhookInput,
): Promise<SignatureVerification> {
  const webhookId = headerValue(input.headers, WEBHOOK_HEADER_ID) ?? null;
  const timestampRaw = headerValue(input.headers, WEBHOOK_HEADER_TIMESTAMP);
  const signatureHeader = headerValue(input.headers, WEBHOOK_HEADER_SIGNATURE);

  if (input.secret === undefined || input.secret.length === 0) {
    return { state: 'rejected', reason: 'missing_secret', webhookId };
  }
  if (webhookId === null || timestampRaw === undefined || signatureHeader === undefined) {
    return { state: 'rejected', reason: 'missing_headers', webhookId };
  }

  if (!TIMESTAMP_PATTERN.test(timestampRaw)) {
    return { state: 'rejected', reason: 'timestamp_invalid', webhookId };
  }
  const timestampSeconds = Number.parseInt(timestampRaw, 10);
  const tolerance = input.toleranceSeconds ?? DEFAULT_TOLERANCE_SECONDS;
  if (Math.abs(input.nowSeconds - timestampSeconds) > tolerance) {
    return { state: 'rejected', reason: 'timestamp_outside_tolerance', webhookId };
  }

  const presented = presentedSignatures(signatureHeader);
  if (presented.length === 0) {
    return { state: 'rejected', reason: 'signature_malformed', webhookId };
  }

  const content = signedContent(webhookId, timestampSeconds, input.rawBody);
  let matched: SigningKeyDerivation | null = null;
  for (const key of signingKeysFor(input.secret)) {
    const expected = bytesToBase64(await hmacSha256(key.bytes, content));
    for (const candidate of presented) {
      if (constantTimeEquals(candidate, expected)) {
        matched ??= key.derivation;
      }
    }
  }
  return matched === null
    ? { state: 'rejected', reason: 'no_matching_signature', webhookId }
    : { state: 'verified', webhookId, timestampSeconds, keyDerivation: matched };
}
