import { z } from 'zod';

/** Small shared value types used by every other contract module. */

/** An absolute instant. Always stored with the IANA zone that produced it. */
export const isoInstantSchema = z.iso.datetime({ offset: true });
export type IsoInstant = z.infer<typeof isoInstantSchema>;

/** A calendar date with no time component. */
export const isoDateSchema = z.iso.date();
export type IsoDate = z.infer<typeof isoDateSchema>;

/** A naive wall-clock time, only ever paired with an IANA zone. */
export const localDateTimeSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/, { error: 'INVALID_LOCAL_DATE_TIME' });
export type LocalDateTime = z.infer<typeof localDateTimeSchema>;

function isSupportedTimeZone(value: string): boolean {
  try {
    void new Intl.DateTimeFormat('en-US', { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

/** A tz database zone name such as `Europe/Berlin`. */
export const ianaTimeZoneSchema = z
  .string()
  .min(1)
  .refine(isSupportedTimeZone, { error: 'INVALID_TIME_ZONE' });
export type IanaTimeZone = z.infer<typeof ianaTimeZoneSchema>;

/** BCP 47 language tag, for example `en`, `pt-BR`. */
export const localeSchema = z
  .string()
  .regex(/^[a-z]{2,3}(-[A-Za-z]{4})?(-([A-Z]{2}|\d{3}))?$/, { error: 'INVALID_LOCALE' });
export type Locale = z.infer<typeof localeSchema>;

/** ISO 4217 currency code. */
export const currencyCodeSchema = z.string().regex(/^[A-Z]{3}$/, { error: 'INVALID_CURRENCY' });
export type CurrencyCode = z.infer<typeof currencyCodeSchema>;

/** Money is always an integer amount of minor units plus a currency. */
export const minorUnitsSchema = z.number().int();
export const moneySchema = z
  .object({ currency: currencyCodeSchema, amountMinor: minorUnitsSchema })
  .strict();
export type Money = z.infer<typeof moneySchema>;

/** Lowercase hex SHA-256 digest. */
export const checksumSchema = z.string().regex(/^[0-9a-f]{64}$/, { error: 'INVALID_CHECKSUM' });
export type Checksum = z.infer<typeof checksumSchema>;

function hasScheme(value: string, schemes: readonly string[]): boolean {
  try {
    return schemes.includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

export const httpsUrlSchema: z.ZodType<string> = z
  .string()
  .refine((value) => hasScheme(value, ['https:']), { error: 'INVALID_HTTPS_URL' });

export const webUrlSchema: z.ZodType<string> = z
  .string()
  .refine((value) => hasScheme(value, ['https:', 'http:']), { error: 'INVALID_URL' });

/**
 * Deterministic JSON with object keys sorted at every depth. Two structurally
 * equal values always serialise identically, so a checksum over this output is
 * stable across processes and runtimes.
 */
export function canonicalJson(value: unknown): string {
  if (value === undefined) {
    return 'null';
  }
  if (value === null || typeof value === 'number' || typeof value === 'boolean') {
    return JSON.stringify(value ?? null);
  }
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }
  if (typeof value === 'bigint') {
    return JSON.stringify(value.toString());
  }
  if (value instanceof Date) {
    return JSON.stringify(value.toISOString());
  }
  if (Array.isArray(value)) {
    return `[${value.map((entry) => canonicalJson(entry)).join(',')}]`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, entry]) => entry !== undefined)
      .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
      .map(([key, entry]) => `${JSON.stringify(key)}:${canonicalJson(entry)}`);
    return `{${entries.join(',')}}`;
  }
  return 'null';
}

/** SHA-256 of the canonical JSON form. Used for content version checksums. */
export async function computeChecksum(value: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(canonicalJson(value));
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/** Structural equality over JSON-shaped values. */
export function deepEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) {
    return true;
  }
  return canonicalJson(left) === canonicalJson(right);
}
