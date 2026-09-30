import { createHash } from 'node:crypto';

/**
 * Inbound webhook helpers.
 *
 * Signature verification for Polar lives in `@relay/billing`
 * (`verifyWebhookSignature`), which implements Standard Webhooks as Polar
 * sends it. Outbound signatures for our own customers' endpoints live in
 * `@relay/application`. What remains here is provider-neutral.
 */

/** Stable hash of a raw body, stored in the inbox for replay forensics. */
export function bodyHash(rawBody: Buffer | string): string {
  return createHash('sha256').update(rawBody).digest('hex');
}
