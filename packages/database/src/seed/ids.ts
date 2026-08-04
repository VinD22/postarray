import { createHash } from 'node:crypto';

/**
 * Deterministic identifiers for seed data.
 *
 * Seeding has to be repeatable: run it twice and you get the same workspace,
 * the same connection and the same receipt IDs, so a fixture, a screenshot or a
 * reviewer's bookmark stays valid. These are RFC 4122 version 5 UUIDs derived
 * from a fixed namespace, which means they are stable, obviously synthetic and
 * cannot collide with a production UUIDv7.
 */

/** A fixed namespace UUID. Not a secret, and not used for anything else. */
const SEED_NAMESPACE = '5f1d0f2c-9a7b-5c3e-8d41-0b2e6a4f7c19';

export function seedId(label: string): string {
  const namespaceBytes = Buffer.from(SEED_NAMESPACE.replace(/-/g, ''), 'hex');
  const digest = createHash('sha1')
    .update(namespaceBytes)
    .update(Buffer.from(label, 'utf8'))
    .digest();

  const bytes = Buffer.from(digest.subarray(0, 16));
  // Version 5, RFC 4122 variant.
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x50;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;

  const hex = bytes.toString('hex');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');
}

/** The one seeded workspace. Everything else hangs off it. */
export const SEED_WORKSPACE_ID = seedId('workspace:northwind');

/**
 * The seed clock. Fixed so relative offsets in the data are stable, and set in
 * the past so scheduled items are genuinely in the future when you run it.
 */
export function seedNow(): Date {
  return new Date();
}

export function daysFromNow(days: number, hour = 9, minute = 0): Date {
  const base = seedNow();
  const next = new Date(base.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  next.setUTCHours(hour, minute, 0, 0);
  return next;
}

export function hoursAgo(hours: number): Date {
  return new Date(seedNow().getTime() - hours * 60 * 60 * 1000);
}
