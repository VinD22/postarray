/**
 * Tracked links.
 *
 * These numbers come from Relay's own redirect service, not from a platform.
 * That distinction is carried in the type names and repeated on screen: a
 * `RedirectMeasurement` is a count of requests our service handled, and it is
 * never interchangeable with a provider's native link click figure. The two
 * count different events and a reader who adds them together is double counting
 * a single visitor.
 */

export type LinkState = 'active' | 'expired' | 'disabled';

export type ReferrerClass = 'direct' | 'social' | 'search' | 'email' | 'other';

export type DeviceClass = 'mobile' | 'desktop' | 'tablet' | 'unknown';

export type DomainVerificationState = 'verified' | 'pending' | 'failed' | 'default';

export interface ShortDomainView {
  readonly id: string;
  readonly host: string;
  readonly state: DomainVerificationState;
  readonly verifiedAt: string | null;
  readonly lastCheckedAt: string | null;
  /** The exact DNS record the user must publish. Never a secret. */
  readonly dnsRecordName: string | null;
  readonly dnsRecordValue: string | null;
}

/**
 * One destination and the window it was live for.
 *
 * A report for a past period keeps the destination that was active then. That
 * is why history is a list rather than a single current value: editing a
 * destination must not silently rewrite what a published post pointed at when
 * the clicks were counted.
 */
export interface DestinationVersion {
  readonly id: string;
  readonly url: string;
  readonly activeFrom: string;
  readonly activeTo: string | null;
  readonly changedByName: string;
}

export interface TrackedLinkView {
  readonly id: string;
  /** The path segment, for example `a7Kq2`. */
  readonly slug: string;
  /** The whole public URL exactly as it publishes. */
  readonly shortUrl: string;
  readonly domain: ShortDomainView;
  readonly destination: string;
  readonly destinationHistory: readonly DestinationVersion[];
  readonly campaign: string | null;
  readonly utm: Readonly<Record<string, string>>;
  readonly state: LinkState;
  readonly createdAt: string;
  readonly createdByName: string;
  readonly expiresAt: string | null;
  readonly disabledAt: string | null;
  readonly disabledByName: string | null;
  readonly disabledReason: string | null;
  readonly usedInPostCount: number;
}

export interface BreakdownEntry {
  readonly key: string;
  readonly clicks: number;
  /** 0 to 1, of deduplicated clicks. */
  readonly share: number;
}

export interface RedirectMeasurement {
  readonly linkId: string;
  readonly periodStart: string;
  readonly periodEnd: string;
  /** Every request the redirect service handled, before any filtering. */
  readonly totalRequests: number;
  /** Requests left after removing repeats and suspected automation. */
  readonly deduplicatedClicks: number;
  /** Requests matching known crawler patterns, excluded rather than deleted. */
  readonly suspectedBots: number;
  readonly lastEventAt: string | null;
  readonly referrers: readonly BreakdownEntry[];
  readonly devices: readonly BreakdownEntry[];
  /** Coarse country only. No city, no raw address. */
  readonly countries: readonly BreakdownEntry[];
  readonly series: readonly {
    readonly bucketStart: string;
    readonly bucketSeconds: number;
    readonly requests: number | null;
    readonly clicks: number | null;
  }[];
}

/**
 * A provider's native link click figure placed beside ours.
 *
 * Both values are always shown together with what each one counts. Neither is
 * ever substituted for the other, and they are never summed.
 */
export interface LinkClickComparison {
  readonly provider: string;
  readonly providerValue: number | null;
  readonly relayValue: number;
}
