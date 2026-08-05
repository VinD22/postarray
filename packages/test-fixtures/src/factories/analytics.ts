import {
  metricDefinitionSchema,
  metricObservationSchema,
  metricSeriesSchema,
  unavailableObservation,
} from '@relay/contracts';
import type {
  MetricAvailability,
  MetricDefinition,
  MetricObservation,
  MetricSeries,
  NormalizedMetricName,
  ProviderId,
} from '@relay/contracts';

import { FIXTURE_NOW, fixtureChecksum } from '../ids.js';

/**
 * Metric payloads.
 *
 * Two rules are baked in. A metric we cannot read is `unavailable_*` and its
 * value is `null`, never `0`. And every reading travels with the provider's own
 * field name and definition, so a number is never rendered without its meaning.
 *
 * The numbers here are small, round and obviously synthetic. They are fixture
 * data, not a performance claim about anything.
 */

const PROVIDER_FIELDS: Readonly<Record<string, string>> = {
  impressions: 'impression_count',
  reach: 'reach',
  views: 'view_count',
  likes: 'like_count',
  comments: 'reply_count',
  shares: 'repost_count',
  saves: 'saved',
  link_clicks: 'url_link_clicks',
  watch_time: 'total_watch_time',
  avg_view_duration: 'average_view_duration',
  follower_delta: 'follower_count_delta',
  profile_views: 'profile_views',
  published_count: 'published_count',
};

export interface MakeMetricObservationInput {
  readonly normalizedName?: NormalizedMetricName;
  readonly provider?: ProviderId;
  readonly value?: number;
  readonly scope?: 'post' | 'account';
  readonly observedAt?: string;
  readonly freshnessSeconds?: number;
}

/** One available reading. */
export function makeMetricObservation(
  input: MakeMetricObservationInput = {},
): MetricObservation {
  const normalizedName = input.normalizedName ?? 'impressions';
  const provider = input.provider ?? 'x';
  return metricObservationSchema.parse({
    normalizedName,
    provider,
    providerField: PROVIDER_FIELDS[normalizedName] ?? normalizedName,
    scope: input.scope ?? 'post',
    value: input.value ?? 120,
    unit: normalizedName === 'watch_time' || normalizedName === 'avg_view_duration' ? 'seconds' : 'count',
    denominator: 'none',
    availability: 'available',
    observedAt: input.observedAt ?? FIXTURE_NOW,
    freshnessSeconds: input.freshnessSeconds ?? 300,
    rawProviderPayloadHash: fixtureChecksum(`${provider}:${normalizedName}`),
  });
}

/** A reading the provider did not return. The value is null, never zero. */
export function makeUnavailableObservation(
  input: {
    normalizedName?: NormalizedMetricName;
    provider?: ProviderId;
    availability?: Exclude<MetricAvailability, 'available'>;
    scope?: 'post' | 'account';
  } = {},
): MetricObservation {
  const normalizedName = input.normalizedName ?? 'saves';
  const provider = input.provider ?? 'x';
  return unavailableObservation({
    normalizedName,
    provider,
    providerField: PROVIDER_FIELDS[normalizedName] ?? normalizedName,
    scope: input.scope ?? 'post',
    availability: input.availability ?? 'unavailable_permission',
    observedAt: FIXTURE_NOW,
    rawProviderPayloadHash: fixtureChecksum(`${provider}:${normalizedName}:unavailable`),
  });
}

/**
 * A realistic post-level payload: several available metrics, one the provider
 * does not expose, and one we lack permission to read.
 */
export function makePostMetrics(provider: ProviderId = 'x'): readonly MetricObservation[] {
  return [
    makeMetricObservation({ provider, normalizedName: 'impressions', value: 1_240 }),
    makeMetricObservation({ provider, normalizedName: 'likes', value: 38 }),
    makeMetricObservation({ provider, normalizedName: 'comments', value: 4 }),
    makeMetricObservation({ provider, normalizedName: 'shares', value: 6 }),
    makeUnavailableObservation({
      provider,
      normalizedName: 'saves',
      availability: 'unavailable_provider',
    }),
    makeUnavailableObservation({
      provider,
      normalizedName: 'link_clicks',
      availability: 'unavailable_permission',
    }),
  ];
}

export function makeAccountMetrics(provider: ProviderId = 'x'): readonly MetricObservation[] {
  return [
    makeMetricObservation({
      provider,
      normalizedName: 'follower_delta',
      scope: 'account',
      value: 12,
    }),
    makeMetricObservation({
      provider,
      normalizedName: 'profile_views',
      scope: 'account',
      value: 64,
    }),
    makeUnavailableObservation({
      provider,
      normalizedName: 'reach',
      scope: 'account',
      availability: 'unavailable_pending',
    }),
  ];
}

export function makeMetricDefinition(
  overrides: Partial<MetricDefinition> = {},
): MetricDefinition {
  const normalizedName = overrides.normalizedName ?? 'impressions';
  return metricDefinitionSchema.parse({
    provider: 'x',
    scope: 'post',
    providerField: PROVIDER_FIELDS[normalizedName] ?? normalizedName,
    normalizedName,
    definition: 'Fixture definition. The real wording is quoted from the provider documentation.',
    unit: 'count',
    denominator: 'none',
    availability: 'available',
    aggregation: 'sum',
    historyWindowDays: 90,
    lastVerifiedAt: FIXTURE_NOW,
    ...overrides,
  });
}

/** A seven point daily series with one gap the provider did not return. */
export function makeMetricSeries(
  normalizedName: NormalizedMetricName = 'impressions',
): MetricSeries {
  const values: readonly (number | null)[] = [110, 130, 96, null, 145, 152, 138];
  return metricSeriesSchema.parse({
    normalizedName,
    unit: 'count',
    aggregation: 'sum',
    points: values.map((value, index) => ({
      bucketStart: `2026-08-0${index + 1}T00:00:00.000Z`,
      bucketSeconds: 86_400,
      value,
      availability: value === null ? 'unavailable_provider' : 'available',
    })),
  });
}
