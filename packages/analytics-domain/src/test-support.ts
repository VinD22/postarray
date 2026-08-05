import { metricObservationSchema } from '@relay/contracts';
import type { MetricObservation, NormalizedMetricName } from '@relay/contracts';

import type { ComparablePost, ObservedPost } from './types.js';

/** Deterministic builders for the colocated tests. Not product surface. */

export const HASH = 'a'.repeat(64);

export function makeObservation(overrides: Partial<MetricObservation> = {}): MetricObservation {
  return metricObservationSchema.parse({
    normalizedName: 'impressions',
    provider: 'linkedin',
    providerField: 'impressionCount',
    scope: 'post',
    value: 1000,
    unit: 'count',
    denominator: 'none',
    availability: 'available',
    observedAt: '2026-08-04T09:00:00Z',
    freshnessSeconds: 60,
    rawProviderPayloadHash: HASH,
    ...overrides,
  });
}

export function makePost(overrides: Partial<ComparablePost> = {}): ComparablePost {
  return {
    receiptId: 'receipt_1',
    provider: 'linkedin',
    contentKind: 'text',
    connectionId: 'conn_1',
    publishedAt: '2026-08-04T09:00:00Z',
    hasMedia: false,
    hasLink: false,
    ...overrides,
  };
}

export function makeObserved(
  value: number | null,
  postOverrides: Partial<ComparablePost> = {},
  observationOverrides: Partial<MetricObservation> = {},
): ObservedPost {
  const availability = value === null ? 'unavailable_pending' : 'available';
  return {
    post: makePost(postOverrides),
    observation: makeObservation({ value, availability, ...observationOverrides }),
  };
}

/** A run of comparable posts with the given values, one per hour. */
export function makeHistory(
  values: readonly (number | null)[],
  metric: NormalizedMetricName = 'impressions',
  postOverrides: Partial<ComparablePost> = {},
): ObservedPost[] {
  return values.map((value, index) =>
    makeObserved(
      value,
      {
        receiptId: `receipt_h${index}`,
        publishedAt: `2026-08-0${(index % 3) + 1}T09:00:00Z`,
        ...postOverrides,
      },
      { normalizedName: metric },
    ),
  );
}
