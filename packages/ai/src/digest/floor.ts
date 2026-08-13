import type { DigestInsightRow, InsightLike } from './types';
import type { DigestRetrieval } from './retrieval';

/**
 * The deterministic floor.
 *
 * This is not a fallback bolted on for outages. It is the digest. The model
 * layer only ever adds prose on top of it, and every row below is produced from
 * receipts and normalized metrics with no model involved at all, so a digest
 * exists and is honest when AI is disabled, when the budget is spent, when the
 * circuit breaker is open, and in week one when there are no metrics to read.
 *
 * `baselineInsights` and `unavailabilityInsights` are the output of
 * `buildBaselineInsights` and `buildUnavailabilityInsights` from
 * `@relay/analytics-domain`. The caller composes them, this function orders them
 * into a week's story and turns them into storable rows.
 */

/** Message keys the digest floor emits. Every one of them lives in the catalog. */
export const DIGEST_FLOOR_KEYS = {
  headlineNothingPublished: 'digest.headline.nothingPublished',
  headlinePublished: 'digest.headline.published',
  outcomePublished: 'digest.outcome.published',
  outcomePartial: 'digest.outcome.partial',
  outcomeFailed: 'digest.outcome.failed',
  noMetricsYet: 'digest.metrics.noneYet',
  freshness: 'digest.freshness.statement',
} as const;

export interface DigestFloorInput {
  readonly retrieval: DigestRetrieval;
  readonly baselineInsights?: readonly InsightLike[];
  readonly unavailabilityInsights?: readonly InsightLike[];
}

export interface DigestFloor {
  /** The headline as a message key plus arguments. Never a sentence. */
  readonly headlineKey: string;
  readonly headlineArgs: Readonly<Record<string, string | number>>;
  readonly rows: readonly DigestInsightRow[];
}

function row(
  retrieval: DigestRetrieval,
  messageKey: string,
  messageArgs: Readonly<Record<string, string | number | boolean | null>>,
  evidenceIds: readonly string[],
  confidence: string,
  sampleSize: number | null,
): DigestInsightRow {
  return {
    kind: 'digest',
    messageKey,
    messageArgs,
    evidenceIds: [...evidenceIds],
    confidence,
    sampleSize,
    windowStart: retrieval.windowStart,
    windowEnd: retrieval.windowEnd,
    isNarrative: false,
  };
}

/**
 * Build the floor.
 *
 * Publishing outcomes come first because they are the only thing every
 * workspace always has. `partial` gets its own row rather than being counted as
 * either a success or a failure.
 */
export function buildDigestFloor(input: DigestFloorInput): DigestFloor {
  const { retrieval } = input;
  const rows: DigestInsightRow[] = [];

  for (const summary of retrieval.perProvider) {
    if (summary.published > 0) {
      rows.push(
        row(
          retrieval,
          DIGEST_FLOOR_KEYS.outcomePublished,
          { provider: summary.provider, count: summary.published },
          summary.receiptIds,
          'high',
          summary.published,
        ),
      );
    }
    if (summary.partial > 0) {
      rows.push(
        row(
          retrieval,
          DIGEST_FLOOR_KEYS.outcomePartial,
          { provider: summary.provider, count: summary.partial },
          summary.receiptIds,
          'high',
          summary.partial,
        ),
      );
    }
    if (summary.failed > 0) {
      rows.push(
        row(
          retrieval,
          DIGEST_FLOOR_KEYS.outcomeFailed,
          { provider: summary.provider, count: summary.failed },
          summary.receiptIds,
          'high',
          summary.failed,
        ),
      );
    }
  }

  for (const insight of input.baselineInsights ?? []) {
    rows.push(
      row(
        retrieval,
        insight.messageKey,
        insight.params,
        insight.evidenceIds,
        insight.confidence,
        null,
      ),
    );
  }

  for (const insight of input.unavailabilityInsights ?? []) {
    rows.push(
      row(
        retrieval,
        insight.messageKey,
        insight.params,
        insight.evidenceIds,
        insight.confidence,
        null,
      ),
    );
  }

  // No reading at all is a statement about our data, not about the account's
  // performance, and it is said out loud rather than shown as an empty panel.
  if (retrieval.hasNoMetrics) {
    rows.push(row(retrieval, DIGEST_FLOOR_KEYS.noMetricsYet, {}, [], 'high', 0));
  }

  rows.push(
    row(
      retrieval,
      DIGEST_FLOOR_KEYS.freshness,
      {
        // The catalog selects the sentence on `label`; `lastObservedAt` is only
        // read by the branches that have one, so a never-synced week says so
        // rather than rendering an empty date.
        label: retrieval.freshness.label,
        lastObservedAt: retrieval.freshness.lastObservedAt ?? '',
      },
      [],
      'high',
      null,
    ),
  );

  const publishedTotal = retrieval.totals.published + retrieval.totals.partial;
  return {
    headlineKey:
      publishedTotal === 0
        ? DIGEST_FLOOR_KEYS.headlineNothingPublished
        : DIGEST_FLOOR_KEYS.headlinePublished,
    headlineArgs: {
      published: retrieval.totals.published,
      partial: retrieval.totals.partial,
      failed: retrieval.totals.failed,
      windowStart: retrieval.windowStart,
      windowEnd: retrieval.windowEnd,
    },
    rows,
  };
}

/**
 * The rows the weekly email is allowed to render.
 *
 * Narrative rows are excluded on purpose: the email renders stored message keys
 * only, so it can never send a sentence the product itself would not show.
 */
export function emailDigestRows(rows: readonly DigestInsightRow[]): readonly DigestInsightRow[] {
  return rows.filter((entry) => !entry.isNarrative);
}
