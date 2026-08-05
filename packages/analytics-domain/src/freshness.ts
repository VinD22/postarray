import type { MetricObservation, NormalizedMetricName } from '@relay/contracts';

import { parseInstant, secondsBetween } from './time';
import { UNAVAILABLE_REASON_KEYS } from './types';
import type { NormalizedMetric, UnavailableReason } from './types';

/**
 * Freshness and coverage.
 *
 * These feed the labels next to a number: when it was last synced, whether it
 * is old enough to distrust, and how much of the range actually has data. A
 * dashboard that shows a number without saying how old it is has told the user
 * something it does not know.
 */

export const DEFAULT_STALE_AFTER_SECONDS = 6 * 60 * 60;

export const FRESHNESS_LABELS = ['fresh', 'stale', 'never_synced'] as const;
export type FreshnessLabel = (typeof FRESHNESS_LABELS)[number];

export const FRESHNESS_MESSAGE_KEYS: Readonly<Record<FreshnessLabel, string>> = Object.freeze({
  fresh: 'analytics.freshness.synced',
  stale: 'analytics.freshness.stale',
  never_synced: 'analytics.value.unavailable',
});

export interface FreshnessInput {
  readonly observations: readonly MetricObservation[];
  readonly now: Date;
  readonly staleAfterSeconds?: number;
}

export interface FreshnessReport {
  readonly label: FreshnessLabel;
  readonly messageKey: string;
  /** The most recent observation instant, or null when nothing has synced. */
  readonly lastObservedAt: string | null;
  readonly ageSeconds: number | null;
  readonly staleAfterSeconds: number;
}

/** How old the freshest reading is, and whether that is old enough to label. */
export function computeFreshness(input: FreshnessInput): FreshnessReport {
  const staleAfterSeconds = input.staleAfterSeconds ?? DEFAULT_STALE_AFTER_SECONDS;
  let newestMs: number | null = null;
  let newestIso: string | null = null;

  for (const observation of input.observations) {
    const parsed = parseInstant(observation.observedAt);
    if (parsed === null) {
      continue;
    }
    if (newestMs === null || parsed > newestMs) {
      newestMs = parsed;
      newestIso = observation.observedAt;
    }
  }

  if (newestMs === null || newestIso === null) {
    return {
      label: 'never_synced',
      messageKey: FRESHNESS_MESSAGE_KEYS.never_synced,
      lastObservedAt: null,
      ageSeconds: null,
      staleAfterSeconds,
    };
  }

  const ageSeconds = secondsBetween(newestMs, input.now.getTime());
  const label: FreshnessLabel = ageSeconds > staleAfterSeconds ? 'stale' : 'fresh';
  return {
    label,
    messageKey: FRESHNESS_MESSAGE_KEYS[label],
    lastObservedAt: newestIso,
    ageSeconds,
    staleAfterSeconds,
  };
}

export interface CoverageInput {
  /** One entry per post in the selected range. */
  readonly perPost: readonly {
    readonly receiptId: string;
    readonly metrics: readonly NormalizedMetric[];
  }[];
  readonly metric: NormalizedMetricName;
}

export interface CoverageReport {
  readonly metric: NormalizedMetricName;
  readonly total: number;
  readonly covered: number;
  /** 0 to 1. Zero total posts reports a null ratio rather than a misleading 1. */
  readonly ratio: number | null;
  readonly messageKey: string;
  /** Receipt ids with no usable reading, grouped by why. */
  readonly missingByReason: Readonly<Record<UnavailableReason, readonly string[]>>;
  readonly reasonKeys: Readonly<Record<UnavailableReason, string>>;
}

/** How many posts in the range actually have a current reading for one metric. */
export function computeCoverage(input: CoverageInput): CoverageReport {
  const missing: Record<UnavailableReason, string[]> = {
    unavailable_provider: [],
    unavailable_permission: [],
    unavailable_pending: [],
    unavailable_stale: [],
  };
  let covered = 0;

  for (const entry of input.perPost) {
    const metric = entry.metrics.find(
      (candidate) => candidate.observation.normalizedName === input.metric,
    );
    if (metric === undefined) {
      missing.unavailable_pending.push(entry.receiptId);
      continue;
    }
    if (metric.observation.availability === 'available' && metric.observation.value !== null) {
      covered += 1;
      continue;
    }
    const reason: UnavailableReason = metric.reason ?? 'unavailable_pending';
    missing[reason].push(entry.receiptId);
  }

  const total = input.perPost.length;
  return {
    metric: input.metric,
    total,
    covered,
    ratio: total === 0 ? null : covered / total,
    messageKey: 'analytics.freshness.coverage',
    missingByReason: missing,
    reasonKeys: UNAVAILABLE_REASON_KEYS,
  };
}

/**
 * Age readings that are older than the threshold.
 *
 * Stale readings keep their row and lose their value, so the UI can say why a
 * number is not being trusted instead of silently dropping it.
 */
export function markStaleMetrics(
  metrics: readonly NormalizedMetric[],
  now: Date,
  staleAfterSeconds: number = DEFAULT_STALE_AFTER_SECONDS,
): NormalizedMetric[] {
  return metrics.map((metric) => {
    if (metric.observation.availability !== 'available') {
      return metric;
    }
    const parsed = parseInstant(metric.observation.observedAt);
    if (parsed === null) {
      return metric;
    }
    const age = secondsBetween(parsed, now.getTime());
    if (age <= staleAfterSeconds) {
      return metric;
    }
    return {
      ...metric,
      observation: {
        ...metric.observation,
        value: null,
        availability: 'unavailable_stale',
        freshnessSeconds: age,
      },
      reason: 'unavailable_stale',
      reasonKey: UNAVAILABLE_REASON_KEYS.unavailable_stale,
    };
  });
}
