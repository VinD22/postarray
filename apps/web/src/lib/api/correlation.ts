/**
 * Correlation and idempotency identifiers.
 *
 * Every request carries a correlation id so a support conversation can name one
 * reference instead of a screenshot. Every request that creates, schedules,
 * publishes or cancels carries an idempotency key generated once per user
 * intent, so a retry of the same intent can never produce a second external
 * post.
 */

function randomHex(bytes: number): string {
  const buffer = new Uint8Array(bytes);
  globalThis.crypto.getRandomValues(buffer);
  return Array.from(buffer, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/** A short, sortable, non-guessable request reference. */
export function newCorrelationId(): string {
  const stamp = Date.now().toString(36);
  return `web_${stamp}_${randomHex(8)}`;
}

/**
 * A key for one user intent.
 *
 * Call this once when the user commits to the action, not once per network
 * attempt. Retrying with the same key is the whole point.
 */
export function newIdempotencyKey(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${randomHex(12)}`;
}
