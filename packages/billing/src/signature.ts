/**
 * Standard Webhooks signing, which is the scheme Polar uses.
 *
 * The signed content is `{id}.{timestamp}.{payload}` where `payload` is the
 * exact raw body bytes as received. Nothing is parsed before the signature has
 * been checked: an unverified body is inert data, stored for forensics and
 * never acted upon.
 */

export const WEBHOOK_HEADER_ID = 'webhook-id';
export const WEBHOOK_HEADER_TIMESTAMP = 'webhook-timestamp';
export const WEBHOOK_HEADER_SIGNATURE = 'webhook-signature';

/** Replay window. A timestamp outside it is rejected even if the MAC matches. */
export const DEFAULT_TOLERANCE_SECONDS = 300;

const SECRET_PREFIX = 'whsec_';
const SIGNATURE_VERSION = 'v1';

const encoder = new TextEncoder();

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return globalThis.btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = globalThis.atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

/**
 * Polar secrets are `whsec_` plus base64. A secret without the prefix is used
 * as raw UTF-8 bytes, which is what the Standard Webhooks reference does.
 */
export function decodeSigningSecret(secret: string): Uint8Array {
  if (!secret.startsWith(SECRET_PREFIX)) {
    return encoder.encode(secret);
  }
  const encoded = secret.slice(SECRET_PREFIX.length);
  try {
    return base64ToBytes(encoded);
  } catch {
    return encoder.encode(encoded);
  }
}

async function hmacSha256(keyBytes: Uint8Array, message: string): Promise<Uint8Array> {
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    keyBytes as unknown as ArrayBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await globalThis.crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return new Uint8Array(signature);
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
  readonly rawBody: string;
}

/** Produce the `webhook-signature` header value, `v1,<base64 mac>`. */
export async function signWebhook(input: SignWebhookInput): Promise<string> {
  const mac = await hmacSha256(
    decodeSigningSecret(input.secret),
    `${input.webhookId}.${input.timestampSeconds}.${input.rawBody}`,
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
  'no_matching_signature',
] as const;
export type SignatureFailure = (typeof SIGNATURE_FAILURES)[number];

export type SignatureVerification =
  | { readonly state: 'verified'; readonly webhookId: string; readonly timestampSeconds: number }
  | {
      readonly state: 'rejected';
      readonly reason: SignatureFailure;
      readonly webhookId: string | null;
    };

export interface VerifyWebhookInput {
  readonly secret: string | undefined;
  readonly rawBody: string;
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly nowSeconds: number;
  readonly toleranceSeconds?: number;
}

function headerValue(
  headers: Readonly<Record<string, string | undefined>>,
  name: string,
): string | undefined {
  const direct = headers[name];
  if (direct !== undefined) {
    return direct;
  }
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === name) {
      return value;
    }
  }
  return undefined;
}

/**
 * Verify a delivery. The result is data, not an exception, because a rejected
 * body still has to be written to the inbox with `signature_state = rejected`.
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

  const timestampSeconds = Number.parseInt(timestampRaw, 10);
  if (!Number.isFinite(timestampSeconds)) {
    return { state: 'rejected', reason: 'timestamp_invalid', webhookId };
  }
  const tolerance = input.toleranceSeconds ?? DEFAULT_TOLERANCE_SECONDS;
  if (Math.abs(input.nowSeconds - timestampSeconds) > tolerance) {
    return { state: 'rejected', reason: 'timestamp_outside_tolerance', webhookId };
  }

  const expected = await signWebhook({
    secret: input.secret,
    webhookId,
    timestampSeconds,
    rawBody: input.rawBody,
  });
  const expectedMac = expected.slice(SIGNATURE_VERSION.length + 1);

  // The header may carry several space-separated signatures during rotation.
  for (const candidate of signatureHeader.split(' ')) {
    const separator = candidate.indexOf(',');
    if (separator <= 0) {
      continue;
    }
    if (candidate.slice(0, separator) !== SIGNATURE_VERSION) {
      continue;
    }
    if (constantTimeEquals(candidate.slice(separator + 1), expectedMac)) {
      return { state: 'verified', webhookId, timestampSeconds };
    }
  }
  return { state: 'rejected', reason: 'no_matching_signature', webhookId };
}
