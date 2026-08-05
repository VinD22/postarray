import { NORMALIZED_METRIC_NAMES } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import {
  AGING_AFTER_SECONDS,
  OUTCOME_GROUPS,
  RANKABLE_METRICS,
  STALE_AFTER_SECONDS,
  freshnessStateOf,
  hasValue,
  metricLabelKey,
  outcomeGroupOf,
  toDesignSystemAvailability,
  unavailableReasonKey,
  valueShapeOf,
} from './metrics';
import type { MetricReading } from './types';

function reading(overrides: Partial<MetricReading> = {}): MetricReading {
  return {
    normalizedName: 'impressions',
    provider: 'x',
    availability: 'available',
    value: 1204,
    observedAt: '2026-08-04T10:30:00Z',
    freshnessSeconds: 60,
    definition: {
      normalizedName: 'impressions',
      provider: 'x',
      providerField: 'impression_count',
      definition: 'Number of times the post was seen.',
      unit: 'count',
      denominator: 'none',
      aggregation: 'sum',
      historyWindowDays: 30,
      lastVerifiedAt: '2026-08-04T00:00:00Z',
    },
    ...overrides,
  };
}

describe('outcome grouping', () => {
  it('classifies every normalized metric exactly once', () => {
    for (const metric of NORMALIZED_METRIC_NAMES) {
      expect(OUTCOME_GROUPS).toContain(outcomeGroupOf(metric));
    }
  });

  it('keeps link clicks in conversion and impressions in awareness', () => {
    expect(outcomeGroupOf('link_clicks')).toBe('conversion');
    expect(outcomeGroupOf('impressions')).toBe('awareness');
  });

  it('has a label key for every normalized metric', () => {
    for (const metric of NORMALIZED_METRIC_NAMES) {
      expect(metricLabelKey(metric)).toMatch(/^analytics\.metric\./);
    }
  });

  it('only offers rankable metrics that exist in the contract', () => {
    for (const metric of RANKABLE_METRICS) {
      expect(NORMALIZED_METRIC_NAMES).toContain(metric);
    }
  });
});

describe('availability mapping', () => {
  it('keeps "provider does not support" and "not built yet" separate', () => {
    expect(toDesignSystemAvailability('unavailable_provider')).toBe('unsupported');
    expect(toDesignSystemAvailability('unavailable_not_implemented')).toBe(
      'not_implemented',
    );
  });

  it('gives every unavailable state a reason key', () => {
    const codes = [
      'unavailable_provider',
      'unavailable_permission',
      'unavailable_pending',
      'unavailable_stale',
      'unavailable_not_implemented',
    ] as const;
    for (const code of codes) {
      expect(unavailableReasonKey(code)).not.toBe('');
    }
  });

  it('has no reason key for an available metric', () => {
    expect(unavailableReasonKey('available')).toBe('');
  });
});

describe('hasValue', () => {
  it('is false when the metric is unavailable even if a value slipped through', () => {
    expect(hasValue(reading({ availability: 'unavailable_stale', value: 900 }))).toBe(
      false,
    );
  });

  it('is false for an available metric with a null value', () => {
    expect(hasValue(reading({ value: null }))).toBe(false);
  });

  it('is true only for a real measurement', () => {
    expect(hasValue(reading())).toBe(true);
  });
});

describe('freshness', () => {
  it('reports never when nothing has been observed', () => {
    expect(freshnessStateOf(null)).toBe('never');
  });

  it('reports syncing while a sync is in flight', () => {
    expect(freshnessStateOf(10, { syncing: true })).toBe('syncing');
  });

  it('crosses from fresh to aging to stale at the documented thresholds', () => {
    expect(freshnessStateOf(AGING_AFTER_SECONDS - 1)).toBe('fresh');
    expect(freshnessStateOf(AGING_AFTER_SECONDS)).toBe('aging');
    expect(freshnessStateOf(STALE_AFTER_SECONDS)).toBe('stale');
  });
});

describe('valueShapeOf', () => {
  it('formats seconds as a duration and ratios as a rate', () => {
    expect(valueShapeOf('seconds')).toBe('duration');
    expect(valueShapeOf('ratio')).toBe('ratio');
    expect(valueShapeOf('count')).toBe('count');
  });
});
