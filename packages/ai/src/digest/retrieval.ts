import { RelayError, ERROR_CODES } from '@relay/contracts';

import type { AiVariables } from '../types';
import type {
  BaselineResultLike,
  DigestMetricInput,
  DigestMetricLine,
  DigestProviderSummary,
  DigestReceipt,
  DigestUnavailableLine,
  FreshnessReportLike,
} from './types';

/**
 * Retrieval for the weekly digest. Deterministic, no model involved.
 *
 * This is the half of the design that makes the other half safe. Everything the
 * model is allowed to say something about is assembled here, from first-party
 * rows only, and the set of numbers that exist in the world is computed here
 * too. The model receives prose-shaped lines built from those rows and can
 * therefore only restate them; anything else is caught by the number audit.
 */

export interface DigestRetrievalInput {
  readonly workspaceId: string;
  /** `YYYY-MM-DD`, inclusive. */
  readonly windowStart: string;
  /** `YYYY-MM-DD`, inclusive. Seven days after `windowStart` for a weekly run. */
  readonly windowEnd: string;
  readonly receipts: readonly DigestReceipt[];
  /** Already normalized by `@relay/analytics-domain`. May legitimately be empty. */
  readonly metrics: readonly DigestMetricInput[];
  /** Trailing-median comparisons, one per metric the account can actually read. */
  readonly baselines: readonly BaselineResultLike[];
  readonly freshness: FreshnessReportLike;
}

export interface DigestRetrieval {
  readonly workspaceId: string;
  readonly windowStart: string;
  readonly windowEnd: string;
  readonly perProvider: readonly DigestProviderSummary[];
  readonly totals: {
    readonly published: number;
    readonly partial: number;
    readonly failed: number;
  };
  readonly metricLines: readonly DigestMetricLine[];
  readonly unavailable: readonly DigestUnavailableLine[];
  readonly baselines: readonly BaselineResultLike[];
  readonly freshness: FreshnessReportLike;
  /** Receipt ids and metric names the model may cite. Nothing else is valid. */
  readonly allowedEvidenceIds: ReadonlySet<string>;
  /** Every number that exists in the supplied data. The audit's allow-list. */
  readonly allowedNumbers: ReadonlySet<number>;
  /** True when there is not one usable reading in the whole window. */
  readonly hasNoMetrics: boolean;
  /** The prompt variables, built from the rows above and nothing else. */
  readonly variables: AiVariables;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function assertDate(field: string, value: string): void {
  if (!DATE_PATTERN.test(value)) {
    throw new RelayError(ERROR_CODES.VALIDATION_FAILED, {
      messageKey: 'error.validation_failed.message',
      details: { field },
    });
  }
}

function summarizeReceipts(receipts: readonly DigestReceipt[]): DigestProviderSummary[] {
  const byProvider = new Map<
    string,
    { published: number; partial: number; failed: number; ids: string[] }
  >();
  for (const receipt of receipts) {
    const entry = byProvider.get(receipt.provider) ?? {
      published: 0,
      partial: 0,
      failed: 0,
      ids: [],
    };
    entry[receipt.outcome] += 1;
    entry.ids.push(receipt.receiptId);
    byProvider.set(receipt.provider, entry);
  }
  return [...byProvider.entries()]
    .sort(([left], [right]) => (left < right ? -1 : 1))
    .map(([provider, entry]) => ({
      provider,
      published: entry.published,
      partial: entry.partial,
      failed: entry.failed,
      receiptIds: [...entry.ids].sort(),
    }));
}

/** `provider=x published=1 partial=0 failed=2 receipts=a|b`. */
function providerLine(summary: DigestProviderSummary): string {
  return [
    `provider=${summary.provider}`,
    `published=${summary.published}`,
    `partial=${summary.partial}`,
    `failed=${summary.failed}`,
    `receipts=${summary.receiptIds.join('|')}`,
  ].join(' ');
}

function metricLineText(line: DigestMetricLine): string {
  return `receipt=${line.receiptId} provider=${line.provider} metric=${line.metric} value=${line.value} unit=${line.unit}`;
}

function unavailableLineText(line: DigestUnavailableLine): string {
  return `metric=${line.metric} provider=${line.provider} reason=${line.reason} receipts=${line.receiptIds.join('|')}`;
}

/**
 * A baseline comparison as one line.
 *
 * The percentage is precomputed here, so a model that wants to write "23%" can
 * only do so because 23 was already in the data. It has no arithmetic to do and
 * no licence to do any.
 */
function baselineLineText(result: BaselineResultLike): string {
  const percent =
    result.effectSize === null ? 'unknown' : `${Math.round(Math.abs(result.effectSize) * 100)}`;
  return [
    `metric=${result.metric}`,
    `outcome=${result.outcome}`,
    `direction=${result.direction ?? 'none'}`,
    `subjectValue=${result.subjectValue ?? 'unavailable'}`,
    `medianValue=${result.medianValue ?? 'unavailable'}`,
    `differencePercent=${percent}`,
    `sampleSize=${result.sampleSize}`,
    `smallSample=${result.smallSample}`,
    `comparedReceipts=${result.comparedReceiptIds.join('|')}`,
  ].join(' ');
}

function freshnessLineText(report: FreshnessReportLike): string {
  return [
    `label=${report.label}`,
    `lastObservedAt=${report.lastObservedAt ?? 'never'}`,
    `ageSeconds=${report.ageSeconds ?? 'unknown'}`,
  ].join(' ');
}

const NUMERAL_PATTERN = /-?\d+(?:\.\d+)?/g;

/** Every numeral appearing anywhere in the supplied lines, as numbers. */
export function numbersIn(values: readonly string[]): Set<number> {
  const found = new Set<number>();
  for (const value of values) {
    for (const match of value.matchAll(NUMERAL_PATTERN)) {
      const parsed = Number(match[0]);
      if (Number.isFinite(parsed)) {
        found.add(parsed);
      }
    }
  }
  return found;
}

/**
 * Build the digest context.
 *
 * Receipts-only and no-metrics-at-all are normal, expected states, not errors:
 * they are what a workspace looks like in its first week, and the digest must
 * be excellent there. The only hard failure is a malformed window.
 */
export function buildDigestRetrieval(input: DigestRetrievalInput): DigestRetrieval {
  assertDate('windowStart', input.windowStart);
  assertDate('windowEnd', input.windowEnd);

  const perProvider = summarizeReceipts(input.receipts);
  const totals = perProvider.reduce(
    (accumulator, entry) => ({
      published: accumulator.published + entry.published,
      partial: accumulator.partial + entry.partial,
      failed: accumulator.failed + entry.failed,
    }),
    { published: 0, partial: 0, failed: 0 },
  );

  const metricLines: DigestMetricLine[] = [];
  const unavailableByKey = new Map<string, DigestUnavailableLine>();

  for (const entry of input.metrics) {
    const observation = entry.metric.observation;
    if (observation.availability === 'available' && observation.value !== null) {
      metricLines.push({
        receiptId: entry.receiptId,
        metric: observation.normalizedName,
        provider: observation.provider,
        value: observation.value,
        unit: observation.unit,
      });
      continue;
    }
    // Unavailable means unknown. It is never collapsed into a zero row.
    const reason = entry.metric.reason ?? observation.availability;
    const key = `${observation.provider}:${observation.normalizedName}:${reason}`;
    const existing = unavailableByKey.get(key);
    unavailableByKey.set(key, {
      metric: observation.normalizedName,
      provider: observation.provider,
      reason,
      reasonKey: entry.metric.reasonKey ?? 'analytics.value.unavailable',
      receiptIds: [...(existing?.receiptIds ?? []), entry.receiptId],
    });
  }

  const unavailable = [...unavailableByKey.values()].sort((left, right) =>
    `${left.provider}${left.metric}` < `${right.provider}${right.metric}` ? -1 : 1,
  );

  const receiptSummary = perProvider.map(providerLine);
  const metricRows = metricLines.map(metricLineText);
  const baselineOutcomes = input.baselines.map(baselineLineText);
  const unavailableMetrics = unavailable.map(unavailableLineText);
  const freshnessReport = freshnessLineText(input.freshness);

  const allowedEvidenceIds = new Set<string>([
    ...input.receipts.map((receipt) => receipt.receiptId),
    ...metricLines.map((line) => line.metric),
    ...unavailable.map((line) => line.metric),
    ...input.baselines.map((result) => result.metric),
    ...input.baselines.flatMap((result) => [...result.comparedReceiptIds]),
  ]);

  const allowedNumbers = numbersIn([
    ...receiptSummary,
    ...metricRows,
    ...baselineOutcomes,
    ...unavailableMetrics,
    freshnessReport,
    input.windowStart,
    input.windowEnd,
  ]);

  const variables: AiVariables = {
    receiptSummary,
    metricRows,
    baselineOutcomes,
    freshnessReport,
    unavailableMetrics,
    windowStart: input.windowStart,
    windowEnd: input.windowEnd,
  };

  return {
    workspaceId: input.workspaceId,
    windowStart: input.windowStart,
    windowEnd: input.windowEnd,
    perProvider,
    totals,
    metricLines,
    unavailable,
    baselines: input.baselines,
    freshness: input.freshness,
    allowedEvidenceIds,
    allowedNumbers,
    hasNoMetrics: metricLines.length === 0,
    variables,
  };
}
