import type {
  ContentKind,
  MetricAggregation,
  MetricAvailability,
  MetricDenominator,
  MetricUnit,
  NormalizedMetricName,
  ProviderId,
} from '@relay/contracts';

/**
 * View models for the analytics screens.
 *
 * These are deliberately separate from the wire schemas in `@relay/contracts`.
 * A component here never sees a provider payload, and the one adapter that
 * turns an API response into these shapes lives in `queries.ts`, so a change in
 * the transport is a change in one file.
 *
 * The invariant every type below preserves: a number and the reason to trust it
 * travel together. There is no shape in this file that can carry a value without
 * its provider, its definition, its unit and when it was observed.
 */

/**
 * `@relay/contracts` has no code for "we have not written this mapping yet",
 * because on the wire that is a capability fact rather than a measurement.
 * On screen the two must read differently, so the view model carries both.
 */
export type MetricAvailabilityCode = MetricAvailability | 'unavailable_not_implemented';

/** Which question a metric answers. These four are never added together. */
export type OutcomeGroup = 'awareness' | 'consumption' | 'interaction' | 'conversion';

export interface AccountRef {
  readonly connectionId: string;
  readonly provider: ProviderId;
  /** The handle as the provider spells it, without a leading sigil. */
  readonly handle: string;
  readonly displayName: string;
}

export interface MetricDefinitionView {
  readonly normalizedName: NormalizedMetricName;
  readonly provider: ProviderId;
  /** The provider's own field name, for example `impression_count`. */
  readonly providerField: string;
  /** The provider's own wording. Catalog data, not translated product copy. */
  readonly definition: string;
  readonly definitionSourceUrl?: string | undefined;
  readonly unit: MetricUnit;
  readonly denominator: MetricDenominator;
  readonly aggregation: MetricAggregation;
  readonly historyWindowDays: number | null;
  /** When a human last checked this definition against provider documentation. */
  readonly lastVerifiedAt: string;
}

/**
 * How a value was arrived at. `measured` is a number the provider returned.
 * `estimated` must name its method, and the UI must show that label next to the
 * value rather than in a tooltip.
 */
export interface EstimateNote {
  readonly method: string;
}

export interface MetricReading {
  readonly normalizedName: NormalizedMetricName;
  readonly provider: ProviderId;
  readonly availability: MetricAvailabilityCode;
  /** Non null only when availability is `available`. Never a substituted zero. */
  readonly value: number | null;
  readonly observedAt: string;
  readonly freshnessSeconds: number;
  readonly definition: MetricDefinitionView;
  readonly estimate?: EstimateNote | undefined;
}

/** Why a comparison might mislead. Each one is stated next to the comparison. */
export type ConfounderCode =
  | 'time_of_day'
  | 'mixed_formats'
  | 'follower_change'
  | 'paid_distribution'
  | 'provider_definition_change';

export interface BaselinePost {
  readonly contentItemId: string;
  readonly title: string;
  readonly publishedAt: string;
  readonly value: number;
}

export interface BaselineComparison {
  readonly metric: NormalizedMetricName;
  /** The median of the comparable posts, in the same unit as the reading. */
  readonly median: number;
  readonly sampleSize: number;
  /** Signed ratio against the median. 0.58 means 58 percent above. */
  readonly deltaRatio: number;
  readonly direction: 'above' | 'below' | 'level';
  /** True when the sample is too small to say anything beyond "test again". */
  readonly smallSample: boolean;
  readonly comparablePosts: readonly BaselinePost[];
  /** Posts left out because the metric was unavailable for them. */
  readonly excludedCount: number;
  readonly confounders: readonly ConfounderCode[];
  /** The format every post in the baseline shares. */
  readonly format: ContentKind;
}

export interface PostComparisonRow {
  readonly contentItemId: string;
  readonly title: string;
  readonly account: AccountRef;
  readonly format: ContentKind;
  readonly publishedAt: string;
  readonly reading: MetricReading;
  /** Null when there are not enough comparable posts to form a baseline. */
  readonly baseline: BaselineComparison | null;
  readonly receiptUrl?: string | undefined;
}

export type FreshnessState = 'fresh' | 'aging' | 'stale' | 'never' | 'syncing';

export interface AccountFreshnessRow {
  readonly account: AccountRef;
  readonly state: FreshnessState;
  readonly lastSuccessAt: string | null;
  readonly nextAttemptAt: string | null;
  readonly providerDelaySeconds: number | null;
}

export type AccountAttentionReason =
  'permission_missing' | 'access_expired' | 'stale' | 'sync_failing' | 'no_posts';

export interface AccountAttentionRow {
  readonly account: AccountRef;
  readonly reason: AccountAttentionReason;
  readonly since: string | null;
  readonly consecutiveFailures: number;
  /** A sanitized reason code. Never a provider payload. */
  readonly failureCode: string | null;
}

/** One sentence describing what the numbers show, with what supports it. */
export interface Observation {
  readonly id: string;
  readonly kind: 'above_baseline' | 'below_baseline' | 'association' | 'coverage_gap';
  /** Already formatted by the component that owns the message key. */
  readonly citedPostIds: readonly string[];
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly confounders: readonly ConfounderCode[];
  readonly sampleSize: number;
  /** Values the message key interpolates. */
  readonly values: Readonly<Record<string, string | number>>;
}

export interface SeriesPoint {
  readonly bucketStart: string;
  readonly bucketSeconds: number;
  /** Null means no observation was collected. It does not mean zero. */
  readonly value: number | null;
}

export interface SeriesAnnotation {
  readonly at: string;
  /** Already translated. A change the reader needs to know about. */
  readonly label: string;
}

export interface MetricSeriesView {
  readonly id: string;
  readonly normalizedName: NormalizedMetricName;
  readonly unit: MetricUnit;
  /** Already translated series name, used by the legend and the table. */
  readonly label: string;
  readonly points: readonly SeriesPoint[];
  readonly annotations?: readonly SeriesAnnotation[];
}

export type ExperimentStatus = 'planned' | 'collecting' | 'complete' | 'inconclusive';

export interface ExperimentVariant {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly postCount: number;
  readonly reading: MetricReading | null;
}

export interface ExperimentView {
  readonly id: string;
  readonly name: string;
  readonly hypothesis: string;
  readonly successMetric: NormalizedMetricName;
  readonly status: ExperimentStatus;
  readonly accounts: readonly AccountRef[];
  readonly variants: readonly ExperimentVariant[];
  readonly measurementWindowDays: number;
  readonly minimumPostsPerVariant: number;
  readonly startedAt: string | null;
  readonly completedAt: string | null;
  /** Posts whose success metric was unavailable, excluded rather than zeroed. */
  readonly excludedPostCount: number;
}

export interface AnalyticsRange {
  readonly start: string;
  readonly end: string;
  readonly preset: '7d' | '30d' | '90d' | 'custom';
}

/**
 * What one screen load returns. `accountsWithoutData` is a first class field
 * rather than an absence, because "four of six accounts answered" is the honest
 * headline and a silently shorter table is not.
 */
export interface AnalyticsOverview {
  readonly range: AnalyticsRange;
  readonly rankMetric: NormalizedMetricName;
  readonly rows: readonly PostComparisonRow[];
  readonly freshness: readonly AccountFreshnessRow[];
  readonly attention: readonly AccountAttentionRow[];
  readonly observations: readonly Observation[];
  readonly accountsRequested: number;
  readonly accountsWithData: number;
  readonly accountsWithoutData: readonly AccountAttentionRow[];
}
