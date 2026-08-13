import { z } from 'zod';

/**
 * Shared types for the weekly digest.
 *
 * The digest reads three first-party sources and nothing else: publication
 * receipts, metric observations that have already been through
 * `@relay/analytics-domain` normalization, and the trailing-median baseline
 * those observations support. A raw provider payload never reaches this module,
 * let alone the model.
 *
 * The structural mirrors below (`NormalizedMetricLike`, `BaselineResultLike`,
 * `FreshnessReportLike`, `InsightLike`) are the exact shapes
 * `@relay/analytics-domain` produces, restated as the narrow slice this package
 * consumes. They are declared here rather than imported so `@relay/ai` keeps
 * pointing only inward at `@relay/contracts`: the caller does the normalizing,
 * the baselining and the insight building with the real analytics-domain
 * functions, and hands the results across this boundary unchanged.
 */

/**
 * What happened to one publication attempt.
 *
 * `partial` is a first-class outcome. A post that reached two of three accounts
 * is neither a success nor a failure, and folding it into either neighbour is
 * exactly the lie this feature exists to avoid.
 */
export const DIGEST_RECEIPT_OUTCOMES = ['published', 'partial', 'failed'] as const;
export const digestReceiptOutcomeSchema = z.enum(DIGEST_RECEIPT_OUTCOMES);
export type DigestReceiptOutcome = z.infer<typeof digestReceiptOutcomeSchema>;

/** One publication attempt inside the window, reduced to what a digest needs. */
export interface DigestReceipt {
  readonly receiptId: string;
  readonly provider: string;
  readonly outcome: DigestReceiptOutcome;
  /** ISO instant. Used for ordering only; the digest never re-derives a date. */
  readonly publishedAt: string;
}

/** Counts per provider. Every outcome is always present, including zero. */
export interface DigestProviderSummary {
  readonly provider: string;
  readonly published: number;
  readonly partial: number;
  readonly failed: number;
  readonly receiptIds: readonly string[];
}

/** The narrow slice of `NormalizedMetric` the digest consumes. */
export interface NormalizedMetricLike {
  readonly observation: {
    readonly normalizedName: string;
    readonly provider: string;
    readonly value: number | null;
    readonly unit: string;
    readonly availability: string;
    readonly observedAt: string;
  };
  readonly reason: string | null;
  readonly reasonKey: string | null;
}

/** A normalized reading, tied back to the receipt it belongs to. */
export interface DigestMetricInput {
  readonly receiptId: string;
  readonly metric: NormalizedMetricLike;
}

/** The narrow slice of `BaselineResult` the digest consumes. */
export interface BaselineResultLike {
  readonly outcome: string;
  readonly metric: string;
  readonly subjectValue: number | null;
  readonly medianValue: number | null;
  readonly effectSize: number | null;
  readonly direction: string | null;
  readonly sampleSize: number;
  readonly smallSample: boolean;
  readonly comparedReceiptIds: readonly string[];
}

/** The narrow slice of `FreshnessReport` the digest consumes. */
export interface FreshnessReportLike {
  readonly label: string;
  readonly messageKey: string;
  readonly lastObservedAt: string | null;
  readonly ageSeconds: number | null;
}

/** The narrow slice of `Insight` the digest consumes. */
export interface InsightLike {
  readonly kind: string;
  readonly code: string;
  readonly messageKey: string;
  readonly params: Readonly<Record<string, string | number | boolean | null>>;
  readonly evidenceIds: readonly string[];
  readonly confidence: string;
}

/** A metric reading, flattened into one model-visible line. */
export interface DigestMetricLine {
  readonly receiptId: string;
  readonly metric: string;
  readonly provider: string;
  readonly value: number;
  readonly unit: string;
}

/** A metric we could not read, with the reason kept attached. */
export interface DigestUnavailableLine {
  readonly metric: string;
  readonly provider: string;
  readonly reason: string;
  readonly reasonKey: string;
  readonly receiptIds: readonly string[];
}

/** Kinds of stored insight row. `post_feedback` is the pre-existing behaviour. */
export const INSIGHT_KINDS_STORED = ['digest', 'post_feedback'] as const;
export const storedInsightKindSchema = z.enum(INSIGHT_KINDS_STORED);
export type StoredInsightKind = z.infer<typeof storedInsightKindSchema>;

/**
 * One row as it is stored in `app.insights`.
 *
 * `isNarrative` marks a row whose text was written by the model. The weekly
 * email renders only non-narrative rows, so the email can never say something
 * the deterministic product would not say on its own.
 */
export interface DigestInsightRow {
  readonly kind: StoredInsightKind;
  readonly messageKey: string;
  readonly messageArgs: Readonly<Record<string, string | number | boolean | null>>;
  readonly evidenceIds: readonly string[];
  readonly confidence: string;
  readonly sampleSize: number | null;
  readonly windowStart: string;
  readonly windowEnd: string;
  readonly isNarrative: boolean;
}
