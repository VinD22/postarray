import { describe, expect, it } from 'vitest';

import {
  NORMALIZED_METRIC_NAMES,
  indexObservations,
  isMetricPresent,
  markStale,
  metricDefinitionSchema,
  metricObservationSchema,
  unavailableObservation,
} from './analytics';
import type { MetricObservation } from './analytics';

const HASH = 'c'.repeat(64);

function observation(overrides: Partial<MetricObservation> = {}): MetricObservation {
  return {
    normalizedName: 'impressions',
    provider: 'linkedin',
    providerField: 'impressionCount',
    scope: 'post',
    value: 1240,
    unit: 'count',
    denominator: 'none',
    availability: 'available',
    observedAt: '2026-08-04T10:00:00.000Z',
    freshnessSeconds: 120,
    rawProviderPayloadHash: HASH,
    ...overrides,
  };
}

describe('metric registry', () => {
  it('exposes the normalized names the product reports on', () => {
    expect(NORMALIZED_METRIC_NAMES).toContain('impressions');
    expect(NORMALIZED_METRIC_NAMES).toContain('watch_time');
    expect(NORMALIZED_METRIC_NAMES).toContain('published_count');
    expect(new Set(NORMALIZED_METRIC_NAMES).size).toBe(NORMALIZED_METRIC_NAMES.length);
  });

  it('keeps the provider field and definition next to the normalized name', () => {
    const definition = {
      provider: 'youtube' as const,
      scope: 'post' as const,
      providerField: 'estimatedMinutesWatched',
      normalizedName: 'watch_time' as const,
      definition: 'Estimated minutes viewers watched the video.',
      unit: 'seconds' as const,
      denominator: 'none' as const,
      availability: 'available' as const,
      aggregation: 'sum' as const,
      historyWindowDays: 90,
      lastVerifiedAt: '2026-08-04T00:00:00.000Z',
    };
    expect(metricDefinitionSchema.parse(definition)).toEqual(definition);
  });
});

describe('missing data is never zero', () => {
  it('rejects a value on an unavailable reading', () => {
    expect(
      metricObservationSchema.safeParse(
        observation({ availability: 'unavailable_permission', value: 0 }),
      ).success,
    ).toBe(false);
  });

  it('rejects a null value on an available reading', () => {
    expect(metricObservationSchema.safeParse(observation({ value: null })).success).toBe(false);
  });

  it('builds a null valued unavailable reading', () => {
    const missing = unavailableObservation({
      normalizedName: 'saves',
      provider: 'x',
      providerField: 'bookmark_count',
      scope: 'post',
      availability: 'unavailable_provider',
      observedAt: '2026-08-04T10:00:00.000Z',
      rawProviderPayloadHash: HASH,
    });
    expect(missing.value).toBeNull();
    expect(isMetricPresent(missing)).toBe(false);
    expect(isMetricPresent(observation())).toBe(true);
  });
});

describe('freshness', () => {
  it('demotes a stale reading instead of showing a stale number', () => {
    const [demoted] = markStale([observation({ freshnessSeconds: 90_000 })], 3_600);
    expect(demoted?.availability).toBe('unavailable_stale');
    expect(demoted?.value).toBeNull();
  });

  it('leaves a fresh reading untouched', () => {
    const [kept] = markStale([observation()], 3_600);
    expect(kept?.availability).toBe('available');
    expect(kept?.value).toBe(1240);
  });

  it('indexes on the freshest observation per name', () => {
    const older = observation({ observedAt: '2026-08-04T09:00:00.000Z', value: 10 });
    const newer = observation({ observedAt: '2026-08-04T11:00:00.000Z', value: 20 });
    const index = indexObservations([newer, older]);
    expect(index.get('impressions')?.value).toBe(20);
    expect(index.size).toBe(1);
  });
});
