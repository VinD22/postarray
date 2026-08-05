import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Click deduplication.
 *
 * The raw address exists for exactly as long as this function runs. What is
 * stored is a keyed hash bound to one link and one time window, which is enough
 * to collapse a double tap or a retried request and is useless for anything
 * else. `dedupeExpiresAt` is the retention bound: after it passes the row is
 * scrubbed by the retention job, so even the hash is not kept.
 */

/** How long two identical requests count as one click. */
export const DEFAULT_DEDUPE_WINDOW_SECONDS = 30 * 60;
/** How long the keyed hash may be retained at all. */
export const DEFAULT_DEDUPE_RETENTION_SECONDS = 24 * 60 * 60;

export interface DedupeInput {
  readonly linkId: string;
  /** Remote address as seen by the edge. Hashed here and never returned. */
  readonly remoteAddress: string | undefined;
  readonly userAgent: string | undefined;
  /** Epoch milliseconds. */
  readonly nowMs: number;
  readonly windowSeconds?: number;
  /** Server-side key. Never derived from anything the client controls. */
  readonly hashKey: string;
}

export interface DedupeResult {
  readonly key: string;
  /** Epoch milliseconds when this key may no longer be retained. */
  readonly expiresAtMs: number;
  readonly windowStartMs: number;
}

/**
 * Coarsen an address before hashing so that a rotating last octet or a shifting
 * IPv6 interface identifier still collapses to one visitor. This also removes
 * the ability to confirm a specific address by brute forcing the hash space of
 * a single host.
 */
export function coarsenAddress(remoteAddress: string | undefined): string {
  const value = (remoteAddress ?? '').trim().toLowerCase();
  if (value.length === 0) {
    return 'unknown';
  }
  const withoutZone = value.split('%')[0] ?? value;
  const bare = withoutZone.startsWith('[') ? withoutZone.replace(/^\[|\]$/g, '') : withoutZone;
  if (bare.includes(':')) {
    const groups = bare.split(':').filter((group) => group.length > 0);
    return `v6:${groups.slice(0, 3).join(':')}`;
  }
  const octets = bare.split('.');
  if (octets.length === 4) {
    return `v4:${octets.slice(0, 3).join('.')}`;
  }
  return `raw:${bare.slice(0, 64)}`;
}

/** Bucket the clock so the same visitor inside one window produces one key. */
export function windowStart(nowMs: number, windowSeconds: number): number {
  const windowMs = windowSeconds * 1000;
  return Math.floor(nowMs / windowMs) * windowMs;
}

export function buildDedupeKey(input: DedupeInput): DedupeResult {
  const windowSeconds = input.windowSeconds ?? DEFAULT_DEDUPE_WINDOW_SECONDS;
  const start = windowStart(input.nowMs, windowSeconds);
  const agentFingerprint = (input.userAgent ?? '').slice(0, 200);
  const material = [
    'relay-shortlink-dedupe-v1',
    input.linkId,
    coarsenAddress(input.remoteAddress),
    agentFingerprint,
    String(start),
  ].join('\n');

  const key = createHmac('sha256', input.hashKey).update(material).digest('base64url').slice(0, 32);
  return {
    key,
    windowStartMs: start,
    expiresAtMs: input.nowMs + DEFAULT_DEDUPE_RETENTION_SECONDS * 1000,
  };
}

/** Constant-time comparison, so a key is never a timing oracle. */
export function dedupeKeysMatch(left: string, right: string): boolean {
  const leftBytes = Buffer.from(left, 'utf8');
  const rightBytes = Buffer.from(right, 'utf8');
  if (leftBytes.length !== rightBytes.length) {
    return false;
  }
  return timingSafeEqual(leftBytes, rightBytes);
}
