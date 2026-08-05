import { z } from 'zod';

/**
 * The narrow view model this service works with.
 *
 * `apps/links` deliberately does not import `@relay/application`. It reads a
 * frozen destination and appends a privacy-minimizing click event. Nothing on
 * the hot path needs a tenant credential, a session or a connector.
 */

export const SHORT_LINK_STATES = ['active', 'disabled', 'expired', 'blocked'] as const;
export const shortLinkStateSchema = z.enum(SHORT_LINK_STATES);
export type ShortLinkState = z.infer<typeof shortLinkStateSchema>;

export const SAFETY_VERDICTS = ['safe', 'blocked', 'unscanned'] as const;
export const safetyVerdictSchema = z.enum(SAFETY_VERDICTS);
export type SafetyVerdict = z.infer<typeof safetyVerdictSchema>;

/** Slugs are opaque, non-sequential and never carry personal data. */
export const SLUG_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{3,63}$/;
export const slugSchema = z.string().regex(SLUG_PATTERN, { error: 'INVALID_SLUG' });

/** What the store returns for one slug on one host. */
export const shortLinkRecordSchema = z
  .object({
    linkId: z.string().min(1),
    workspaceId: z.string().min(1),
    /** Null means the default isolated redirect domain. */
    domain: z.string().min(1).nullable(),
    slug: slugSchema,
    destinationUrl: z.string().min(1),
    state: shortLinkStateSchema,
    /** ISO instant, or null when the link does not expire. */
    expiresAt: z.string().min(1).nullable(),
    safetyVerdict: safetyVerdictSchema,
  })
  .strict();
export type ShortLinkRecord = z.infer<typeof shortLinkRecordSchema>;

export interface ShortLinkLookup {
  /** Lower-cased request host with any port removed. */
  readonly host: string;
  readonly slug: string;
}

/**
 * A read-only lookup. The service caches both hits and misses, so an
 * implementation should be a plain indexed read and nothing more.
 */
export interface ShortLinkStore {
  resolve(lookup: ShortLinkLookup): Promise<ShortLinkRecord | null>;
}

export const BOT_CLASSES = ['human', 'suspected_bot', 'known_bot'] as const;
export type BotClass = (typeof BOT_CLASSES)[number];

export const DEVICE_CLASSES = ['mobile', 'tablet', 'desktop', 'bot', 'unknown'] as const;
export type DeviceClass = (typeof DEVICE_CLASSES)[number];

export const REFERRER_CLASSES = ['direct', 'search', 'social', 'email', 'other'] as const;
export type ReferrerClass = (typeof REFERRER_CLASSES)[number];

/**
 * One recorded redirect.
 *
 * There is no IP field and no user agent field, by construction. The raw
 * address only ever exists inside `buildDedupeKey`, where it is HMAC'd with a
 * server key and thrown away. `dedupeExpiresAt` bounds even that.
 */
export interface ClickEvent {
  readonly linkId: string;
  readonly workspaceId: string;
  /** Truncated to the hour. */
  readonly occurredAt: string;
  readonly countryCode: string | null;
  readonly deviceClass: DeviceClass;
  readonly referrerClass: ReferrerClass;
  readonly botClass: BotClass;
  readonly dedupeKey: string;
  readonly dedupeExpiresAt: string;
}

/** Where click events go. Never awaited on the redirect path. */
export interface ClickSink {
  record(event: ClickEvent): void;
  flush(): Promise<void>;
  close(): Promise<void>;
}

/** Batched writer behind the buffer. Runs off the hot path. */
export type ClickWriter = (events: readonly ClickEvent[]) => Promise<void>;

/** Operator kill switches, effective within one request. */
export interface KillSwitch {
  /** Everything off. Used when the redirect domain itself is in trouble. */
  isGloballyDisabled(): boolean;
  isWorkspaceDisabled(workspaceId: string): boolean;
  isLinkDisabled(linkId: string): boolean;
}

export const abuseReportSchema = z
  .object({
    slug: z.string().min(1).max(128),
    /** Stable machine reason. Free text is capped and never rendered back. */
    reason: z.enum(['phishing', 'malware', 'spam', 'copyright', 'other']),
    detail: z.string().max(2000).optional(),
    reporterContact: z.string().max(320).optional(),
  })
  .strict();
export type AbuseReport = z.infer<typeof abuseReportSchema>;

/** Where abuse reports are handed off. Kept out of the redirect hot path. */
export interface AbuseReportSink {
  submit(
    report: AbuseReport & { readonly receivedAt: string; readonly reference: string },
  ): Promise<void>;
}
