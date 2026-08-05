import { z } from 'zod';

import { metricAvailabilitySchema, providerIdSchema } from './enums';
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
    lastVerifiedAt: isoInstantSchema,
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
