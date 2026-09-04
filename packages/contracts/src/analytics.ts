import { z } from 'zod';

import { contentKindSchema, metricAvailabilitySchema, providerIdSchema } from './enums';
import type { MetricAvailability } from './enums';
import { checksumSchema, isoInstantSchema } from './primitives';

/**
 * Normalized analytics. The provider's own field name and definition are kept
 * next to the normalized value so a number is never shown without its meaning.
 * A metric we cannot read is `unavailable_*`. It is never reported as `0`.
 */

export const NORMALIZED_METRIC_NAMES = [
  'impressions',
  'reach',
  'views',
  'likes',
  'comments',
  'shares',
  'saves',
  'link_clicks',
  'watch_time',
  'avg_view_duration',
  'follower_delta',
  'profile_views',
  'published_count',
] as const;
export const normalizedMetricNameSchema = z.enum(NORMALIZED_METRIC_NAMES);
export type NormalizedMetricName = z.infer<typeof normalizedMetricNameSchema>;

export const METRIC_UNITS = ['count', 'seconds', 'percent', 'ratio', 'currency_minor'] as const;
export const metricUnitSchema = z.enum(METRIC_UNITS);
export type MetricUnit = z.infer<typeof metricUnitSchema>;

/**
 * The denominator an engagement rate is computed against. Providers disagree,
 * so the denominator travels with the metric instead of being assumed.
 */
export const METRIC_DENOMINATORS = [
  'none',
  'impressions',
  'reach',
  'views',
  'followers',
  'sessions',
] as const;
export const metricDenominatorSchema = z.enum(METRIC_DENOMINATORS);
export type MetricDenominator = z.infer<typeof metricDenominatorSchema>;

export const METRIC_AGGREGATIONS = ['sum', 'average', 'median', 'last', 'delta', 'none'] as const;
export const metricAggregationSchema = z.enum(METRIC_AGGREGATIONS);
export type MetricAggregation = z.infer<typeof metricAggregationSchema>;

export const METRIC_SCOPES = ['post', 'account'] as const;
export const metricScopeSchema = z.enum(METRIC_SCOPES);
export type MetricScope = z.infer<typeof metricScopeSchema>;

/**
 * `definition` holds the provider's own wording, retrieved from its docs. It is
 * catalog data rather than product copy, so it does not live in the i18n bundle.
 */
export const metricDefinitionSchema = z
  .object({
    provider: providerIdSchema,
    scope: metricScopeSchema,
    providerField: z.string().min(1),
    normalizedName: normalizedMetricNameSchema,
    definition: z.string().min(1),
    definitionSourceUrl: z.string().optional(),
    unit: metricUnitSchema,
    denominator: metricDenominatorSchema,
    availability: metricAvailabilitySchema,
    aggregation: metricAggregationSchema,
    historyWindowDays: z.number().int().positive().nullable(),
    // Null when nobody has checked this definition against the provider's
    // documentation. It must stay nullable: substituting an epoch here renders
    // as a real date and claims a verification that never happened.
    lastVerifiedAt: isoInstantSchema.nullable(),
  })
  .strict();
export type MetricDefinition = z.infer<typeof metricDefinitionSchema>;

/**
 * A single reading. `value` is non-null only when `availability` is `available`,
 * which is enforced here so a missing metric can never be rendered as zero.
 */
export const metricObservationSchema = z
  .object({
    normalizedName: normalizedMetricNameSchema,
    provider: providerIdSchema,
    providerField: z.string().min(1),
    scope: metricScopeSchema,
    value: z.number().nullable(),
    unit: metricUnitSchema,
    denominator: metricDenominatorSchema,
    availability: metricAvailabilitySchema,
    observedAt: isoInstantSchema,
    freshnessSeconds: z.number().int().nonnegative(),
    rawProviderPayloadHash: checksumSchema,
  })
  .strict()
  .superRefine((observation, ctx) => {
    if (observation.availability === 'available' && observation.value === null) {
      ctx.addIssue({ code: 'custom', path: ['value'], message: 'MISSING_AVAILABLE_VALUE' });
    }
    if (observation.availability !== 'available' && observation.value !== null) {
      ctx.addIssue({ code: 'custom', path: ['value'], message: 'UNAVAILABLE_MUST_BE_NULL' });
    }
  });
export type MetricObservation = z.infer<typeof metricObservationSchema>;

export const metricSeriesPointSchema = z
  .object({
    bucketStart: isoInstantSchema,
    bucketSeconds: z.number().int().positive(),
    value: z.number().nullable(),
    availability: metricAvailabilitySchema,
  })
  .strict();
export type MetricSeriesPoint = z.infer<typeof metricSeriesPointSchema>;

export const metricSeriesSchema = z
  .object({
    normalizedName: normalizedMetricNameSchema,
    unit: metricUnitSchema,
    aggregation: metricAggregationSchema,
    points: z.array(metricSeriesPointSchema),
  })
  .strict();
export type MetricSeries = z.infer<typeof metricSeriesSchema>;

export const analyticsSyncRunSchema = z
  .object({
    id: z.string().min(1),
    workspaceId: z.string().min(1),
    connectionId: z.string().min(1),
    provider: providerIdSchema,
    startedAt: isoInstantSchema,
    finishedAt: isoInstantSchema.nullable(),
    cursor: z.string().nullable(),
    observedCount: z.number().int().nonnegative(),
    unavailableCount: z.number().int().nonnegative(),
    providerCostMinor: z.number().int().nonnegative().nullable(),
    errorCode: z.string().nullable(),
  })
  .strict();
export type AnalyticsSyncRun = z.infer<typeof analyticsSyncRunSchema>;

/** True only when the reading carries a real provider-supplied number. */
export function isMetricPresent(observation: MetricObservation): boolean {
  return observation.availability === 'available' && observation.value !== null;
}

export interface UnavailableObservationInput {
  readonly normalizedName: NormalizedMetricName;
  readonly provider: MetricObservation['provider'];
  readonly providerField: string;
  readonly scope: MetricScope;
  readonly availability: Exclude<MetricAvailability, 'available'>;
  readonly observedAt: string;
  readonly rawProviderPayloadHash: string;
  readonly unit?: MetricUnit;
  readonly denominator?: MetricDenominator;
  readonly freshnessSeconds?: number;
}

/** Build a reading for a metric the provider did not return. */
export function unavailableObservation(input: UnavailableObservationInput): MetricObservation {
  return metricObservationSchema.parse({
    normalizedName: input.normalizedName,
    provider: input.provider,
    providerField: input.providerField,
    scope: input.scope,
    value: null,
    unit: input.unit ?? 'count',
    denominator: input.denominator ?? 'none',
    availability: input.availability,
    observedAt: input.observedAt,
    freshnessSeconds: input.freshnessSeconds ?? 0,
    rawProviderPayloadHash: input.rawProviderPayloadHash,
  });
}

/** Index a list of readings by normalized name, keeping the freshest per name. */
export function indexObservations(
  observations: readonly MetricObservation[],
): Map<NormalizedMetricName, MetricObservation> {
  const index = new Map<NormalizedMetricName, MetricObservation>();
  for (const observation of observations) {
    const existing = index.get(observation.normalizedName);
    if (existing === undefined || observation.observedAt > existing.observedAt) {
      index.set(observation.normalizedName, observation);
    }
  }
  return index;
}

/**
 * Mark readings older than `maxAgeSeconds` as stale rather than dropping them,
 * so the UI can say why a number is not being trusted.
 */
export function markStale(
  observations: readonly MetricObservation[],
  maxAgeSeconds: number,
): MetricObservation[] {
  return observations.map((observation) =>
    observation.availability === 'available' && observation.freshnessSeconds > maxAgeSeconds
      ? { ...observation, value: null, availability: 'unavailable_stale' as const }
      : observation,
  );
}

/* -------------------------------------------------------------------------
   Response schemas for the analytics reads
   -------------------------------------------------------------------------

   The shapes `GET /v1/analytics/*` actually returns, as parsers rather than as
   types. `apps/web` previously narrowed these responses with a bare
   `value as T`, which is not a boundary check at all: it asserted a shape
   nobody had verified and hid two real mismatches that would have thrown the
   moment live data arrived. AGENTS.md is explicit that every external boundary
   parses rather than casts, and an HTTP response read by a browser is an
   external boundary even when the same repository serves it.

   These are deliberately **not** `.strict()`, unlike the write-side schemas
   above. Stripping unknown keys is what lets the API add a field and deploy
   before every client has been rebuilt; rejecting them would turn an additive
   server change into a broken screen. What matters here is that every field
   the client reads is present and the right type.

   The authoritative declarations live in `packages/application/src/views.ts`.
   These mirror them, and `analytics.schemas.test.ts` in the API is where a
   drift between the two should be caught. */

export const analyticsAccountRefSchema = z.object({
  connectionId: z.string().min(1),
  handle: z.string(),
  displayName: z.string(),
  provider: providerIdSchema,
});
export type AnalyticsAccountRefView = z.infer<typeof analyticsAccountRefSchema>;

export const metricDefinitionViewSchema = z.object({
  normalizedName: normalizedMetricNameSchema,
  provider: providerIdSchema,
  providerField: z.string(),
  definition: z.string(),
  definitionSourceUrl: z.string().optional(),
  unit: metricUnitSchema,
  denominator: metricDenominatorSchema,
  aggregation: metricAggregationSchema,
  historyWindowDays: z.number().int().nullable(),
  // Nullable, and it must stay that way. Nobody may have checked this
  // definition against the provider's documentation, and an epoch substituted
  // here renders as a real date and claims a verification that never happened.
  lastVerifiedAt: isoInstantSchema.nullable(),
});
export type MetricDefinitionViewShape = z.infer<typeof metricDefinitionViewSchema>;

export const metricReadingViewSchema = z.object({
  normalizedName: normalizedMetricNameSchema,
  provider: providerIdSchema,
  availability: metricAvailabilitySchema,
  value: z.number().nullable(),
  observedAt: isoInstantSchema,
  freshnessSeconds: z.number(),
  definition: metricDefinitionViewSchema,
});
export type MetricReadingViewShape = z.infer<typeof metricReadingViewSchema>;

export const baselinePostViewSchema = z.object({
  contentItemId: z.string(),
  title: z.string(),
  publishedAt: isoInstantSchema,
  value: z.number(),
});

export const baselineComparisonViewSchema = z.object({
  metric: normalizedMetricNameSchema,
  median: z.number(),
  sampleSize: z.number().int().nonnegative(),
  deltaRatio: z.number(),
  direction: z.enum(['above', 'below', 'level']),
  smallSample: z.boolean(),
  comparablePosts: z.array(baselinePostViewSchema),
  excludedCount: z.number().int().nonnegative(),
  // Strings on the wire, because the server may name a confounder this build
  // of the client has no copy for. The client keeps the ones it can explain
  // and drops the rest; it never renders a raw code at a reader.
  confounders: z.array(z.string()),
  format: contentKindSchema,
});

export const postComparisonRowViewSchema = z.object({
  contentItemId: z.string(),
  title: z.string(),
  account: analyticsAccountRefSchema,
  format: contentKindSchema,
  publishedAt: isoInstantSchema,
  reading: metricReadingViewSchema,
  baseline: baselineComparisonViewSchema.nullable(),
  receiptUrl: z.string().optional(),
});
export type PostComparisonRowViewShape = z.infer<typeof postComparisonRowViewSchema>;

export const accountFreshnessRowViewSchema = z.object({
  account: analyticsAccountRefSchema,
  state: z.enum(['fresh', 'aging', 'stale', 'never', 'syncing']),
  lastSuccessAt: isoInstantSchema.nullable(),
  nextAttemptAt: isoInstantSchema.nullable(),
  providerDelaySeconds: z.number().nullable(),
});

export const accountAttentionRowViewSchema = z.object({
  account: analyticsAccountRefSchema,
  reason: z.enum(['permission_missing', 'access_expired', 'stale', 'sync_failing', 'no_posts']),
  since: isoInstantSchema.nullable(),
  consecutiveFailures: z.number().int().nonnegative(),
  failureCode: z.string().nullable(),
});

export const analyticsRangeViewSchema = z.object({
  start: isoInstantSchema,
  end: isoInstantSchema,
  preset: z.enum(['7d', '30d', '90d', 'custom']),
});

export const analyticsOverviewViewSchema = z.object({
  range: analyticsRangeViewSchema,
  rankMetric: normalizedMetricNameSchema,
  rows: z.array(postComparisonRowViewSchema),
  freshness: z.array(accountFreshnessRowViewSchema),
  attention: z.array(accountAttentionRowViewSchema),
  // The insight engine is not wired to this read, so the server sends an empty
  // list. Modelled as "whatever arrives, ignored" rather than as a fixed empty
  // tuple, so the client does not break on the day it starts arriving full.
  observations: z.array(z.unknown()).default([]),
  accountsRequested: z.number().int().nonnegative(),
  accountsWithData: z.number().int().nonnegative(),
  accountsWithoutData: z.array(accountAttentionRowViewSchema),
});
export type AnalyticsOverviewViewShape = z.infer<typeof analyticsOverviewViewSchema>;

export const seriesPointViewSchema = z.object({
  bucketStart: isoInstantSchema,
  bucketSeconds: z.number().int().positive(),
  // Null is "no observation was collected". It is not zero, and any consumer
  // that coalesces it to zero is drawing a measurement nobody made.
  value: z.number().nullable(),
});

export const metricSeriesViewSchema = z.object({
  id: z.string(),
  normalizedName: normalizedMetricNameSchema,
  unit: metricUnitSchema,
  /** The provider's field name. The client owns the translated legend label. */
  label: z.string(),
  points: z.array(seriesPointViewSchema),
});
export type MetricSeriesViewShape = z.infer<typeof metricSeriesViewSchema>;

export const metricObservationViewSchema = z.object({
  normalizedName: normalizedMetricNameSchema,
  provider: providerIdSchema,
  providerField: z.string(),
  providerDefinition: z.string(),
  scope: metricScopeSchema,
  value: z.number().nullable(),
  unit: metricUnitSchema,
  availability: metricAvailabilitySchema,
  observedAt: isoInstantSchema,
  freshnessSeconds: z.number(),
  derivationRestricted: z.boolean(),
});
export type MetricObservationViewShape = z.infer<typeof metricObservationViewSchema>;

/**
 * One experiment, exactly as the server sends it.
 *
 * Note what is not here: `variants`. The create endpoint accepts variant
 * definitions, the read model does not return them, and the web app mapped
 * over `experiment.variants` anyway behind an unchecked cast, which throws the
 * first time a real experiment loads. Adding the field to this schema to make
 * that code compile would have been the same lie in a new place, so the schema
 * says what the wire says and the screen was changed to render what it gets.
 *
 * `state` is a free string on the wire and is narrowed by the client, which
 * keeps a value this build has no copy for from being printed at a reader.
 */
export const experimentViewSchema = z.object({
  id: z.string(),
  name: z.string(),
  hypothesis: z.string(),
  successMetric: z.string(),
  state: z.string(),
  windowStart: isoInstantSchema,
  windowEnd: isoInstantSchema,
  caveats: z.string().nullable(),
  conclusion: z.string().nullable(),
});
export type ExperimentViewShape = z.infer<typeof experimentViewSchema>;

/** The `{ data: [...] }` envelope the post and account metric reads return. */
export const metricObservationListSchema = z.object({
  data: z.array(metricObservationViewSchema),
});

/** The `{ data, nextCursor }` envelope every list endpoint returns. */
export function analyticsPageSchema<T extends z.ZodTypeAny>(
  item: T,
): z.ZodObject<{ data: z.ZodArray<T>; nextCursor: z.ZodOptional<z.ZodNullable<z.ZodString>> }> {
  return z.object({
    data: z.array(item),
    nextCursor: z.string().nullable().optional(),
  });
}
