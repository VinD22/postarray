import type { NormalizedMetricName } from '@relay/contracts';

import type { BaselineResult } from './baseline.js';
import { SMALL_SAMPLE_THRESHOLD } from './baseline.js';
import { definitionsDiffer, mappingForMetric } from './registry.js';
import type { MetricDefinition, NormalizedMetric, ProviderId } from './types.js';

/**
 * Observation sentences with evidence and calibrated language.
 *
 * Nothing in here renders English. Each observation is a message key plus
 * parameters plus the evidence ids it rests on, and the i18n catalog owns the
 * wording. That is also what makes "the sample is small" and "this does not
 * prove causation" first class outputs rather than footnotes someone forgot.
 *
 * There is no universal engagement score and no cross platform leaderboard. A
 * comparison across platforms is only produced when the caller names one
 * normalized metric with a definition both platforms agree on.
 */

export const INSIGHT_KINDS = ['observation', 'caveat', 'next_test', 'not_supported'] as const;
export type InsightKind = (typeof INSIGHT_KINDS)[number];

export const CONFIDENCES = ['low', 'medium', 'high'] as const;
export type InsightConfidence = (typeof CONFIDENCES)[number];

export type InsightParam = string | number | boolean | null;

export interface Insight {
  readonly kind: InsightKind;
  /** Stable machine code, useful for suppressing a repeated observation. */
  readonly code: string;
  readonly messageKey: string;
  readonly params: Readonly<Record<string, InsightParam>>;
  /** Receipt ids, metric names or experiment ids the statement rests on. */
  readonly evidenceIds: readonly string[];
  readonly confidence: InsightConfidence;
}

function insight(
  kind: InsightKind,
  code: string,
  messageKey: string,
  options: {
    readonly params?: Readonly<Record<string, InsightParam>>;
    readonly evidenceIds?: readonly string[];
    readonly confidence?: InsightConfidence;
  } = {},
): Insight {
  return {
    kind,
    code,
    messageKey,
    params: { ...(options.params ?? {}) },
    evidenceIds: [...(options.evidenceIds ?? [])],
    confidence: options.confidence ?? 'low',
  };
}

function percentString(effectSize: number): string {
  return `${Math.round(Math.abs(effectSize) * 100)}%`;
}

/**
 * Turn a baseline comparison into observations.
 *
 * A comparison that was refused produces the reason, never a number. A small
 * sample always produces the hedge, and every set ends with what the data does
 * not show.
 */
export function buildBaselineInsights(result: BaselineResult): Insight[] {
  const insights: Insight[] = [];
  const evidenceIds = result.comparedReceiptIds;

  if (result.outcome === 'subject_unavailable') {
    return [
      insight('not_supported', 'SUBJECT_METRIC_UNAVAILABLE', 'analytics.value.unavailable', {
        params: { metric: result.metric },
      }),
    ];
  }

  if (result.outcome === 'refused_incompatible_kinds') {
    return [
      insight(
        'not_supported',
        'INCOMPATIBLE_CONTENT_KINDS',
        'analytics.feedback.notComparableFormats',
        { params: { metric: result.metric } },
      ),
    ];
  }

  if (result.outcome === 'insufficient_history') {
    insights.push(
      insight('caveat', 'SMALL_SAMPLE', 'analytics.feedback.smallSample', {
        params: { count: result.sampleSize },
        evidenceIds,
      }),
    );
    insights.push(
      insight('not_supported', 'NO_BASELINE_YET', 'analytics.baseline.trailingMedian', {
        params: { count: result.sampleSize },
      }),
    );
    return insights;
  }

  const confidence: InsightConfidence = result.smallSample
    ? 'low'
    : result.sampleSize >= SMALL_SAMPLE_THRESHOLD * 2
      ? 'high'
      : 'medium';

  if (result.direction === 'similar' || result.effectSize === null) {
    insights.push(
      insight('observation', 'NO_REAL_DIFFERENCE', 'analytics.baseline.trailingMedian', {
        params: { count: result.sampleSize, metric: result.metric },
        evidenceIds,
        confidence,
      }),
    );
  } else {
    insights.push(
      insight(
        'observation',
        result.direction === 'above' ? 'ABOVE_BASELINE' : 'BELOW_BASELINE',
        result.direction === 'above'
          ? 'analytics.feedback.aboveBaseline'
          : 'analytics.feedback.belowBaseline',
        {
          params: {
            percent: percentString(result.effectSize),
            metric: result.metric,
            baseline: result.sampleSize,
          },
          evidenceIds,
          confidence,
        },
      ),
    );
  }

  if (result.smallSample) {
    insights.push(
      insight('caveat', 'SMALL_SAMPLE', 'analytics.feedback.smallSample', {
        params: { count: result.sampleSize },
        evidenceIds,
      }),
    );
  }

  for (const entry of result.confounders) {
    if (entry.code === 'SMALL_SAMPLE') {
      continue;
    }
    insights.push(
      insight('caveat', entry.code, entry.messageKey, {
        params: entry.params,
        evidenceIds,
      }),
    );
  }

  // Always present. An association is never allowed to read as a cause.
  insights.push(
    insight('caveat', 'NO_CAUSATION', 'analytics.feedback.doNotInfer', {
      evidenceIds,
      confidence,
    }),
  );

  return insights;
}

/** The observations that explain why a metric is missing, one per reason. */
export function buildUnavailabilityInsights(
  metrics: readonly NormalizedMetric[],
): Insight[] {
  const seen = new Set<string>();
  const insights: Insight[] = [];
  for (const metric of metrics) {
    if (metric.reason === null || metric.reasonKey === null) {
      continue;
    }
    const key = `${metric.reason}:${metric.observation.normalizedName}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    insights.push(
      insight('not_supported', metric.reason.toUpperCase(), metric.reasonKey, {
        params: {
          metric: metric.observation.normalizedName,
          provider: metric.observation.provider,
        },
        evidenceIds: [metric.observation.normalizedName],
      }),
    );
  }
  return insights;
}

export interface CrossPlatformRequest {
  /** The caller must name one metric. There is no aggregate score to fall back on. */
  readonly metric: NormalizedMetricName;
  readonly entries: readonly {
    readonly provider: ProviderId;
    readonly connectionId: string;
    readonly value: number | null;
  }[];
}

export interface CrossPlatformRow {
  readonly provider: ProviderId;
  readonly connectionId: string;
  readonly value: number | null;
  readonly definition: MetricDefinition | null;
  /** True when this platform defines the metric differently from the first row. */
  readonly definitionDiffers: boolean;
}

export interface CrossPlatformComparison {
  readonly metric: NormalizedMetricName;
  readonly rows: readonly CrossPlatformRow[];
  readonly caveats: readonly Insight[];
}

/**
 * A side by side view of one clearly defined metric.
 *
 * It is not a ranking and it is not a score. Rows whose provider defines the
 * metric differently are labelled, and a platform that does not report the
 * metric shows as unavailable rather than dropping out of the table.
 */
export function compareAcrossPlatforms(
  request: CrossPlatformRequest,
): CrossPlatformComparison {
  const definitions = request.entries.map((entry) => ({
    entry,
    definition: mappingForMetric(entry.provider, 'post', request.metric)?.definition ?? null,
  }));
  const reference = definitions.find((row) => row.definition !== null)?.definition ?? null;

  const rows: CrossPlatformRow[] = definitions.map((row) => ({
    provider: row.entry.provider,
    connectionId: row.entry.connectionId,
    value: row.definition === null ? null : row.entry.value,
    definition: row.definition,
    definitionDiffers:
      reference !== null && row.definition !== null && definitionsDiffer(reference, row.definition),
  }));

  const caveats: Insight[] = [
    insight('caveat', 'NO_UNIVERSAL_SCORE', 'analytics.feedback.noScore', {
      params: { metric: request.metric },
    }),
  ];
  for (const row of rows) {
    if (row.definitionDiffers && reference !== null) {
      caveats.push(
        insight('caveat', 'DEFINITION_DIFFERS', 'analytics.definition.notComparable', {
          params: { provider: row.provider, otherProvider: reference.provider },
        }),
      );
    }
    if (row.definition === null) {
      caveats.push(
        insight(
          'not_supported',
          'METRIC_NOT_REPORTED',
          'analytics.value.unavailableReason.unsupported',
          { params: { provider: row.provider, metric: request.metric } },
        ),
      );
    }
  }

  return { metric: request.metric, rows, caveats };
}

/** One controlled next step. Never more than one variable at a time. */
export function buildNextTestInsight(
  metric: NormalizedMetricName,
  evidenceIds: readonly string[],
): Insight {
  return insight('next_test', 'SINGLE_VARIABLE_TEST', 'analytics.feedback.nextTest', {
    params: { metric },
    evidenceIds,
  });
}
