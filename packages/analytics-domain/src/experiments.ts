import { z } from 'zod';

import { normalizedMetricNameSchema } from '@relay/contracts';
import type { NormalizedMetricName } from '@relay/contracts';

import { compareToTrailingMedian, median, SMALL_SAMPLE_THRESHOLD } from './baseline.js';
import type { Insight } from './insights.js';
import { parseInstant } from './time.js';
import type { ObservedPost } from './types.js';

/**
 * Experiments.
 *
 * Tagging happens before publication. That is the whole point: an analysis
 * assembled after the fact can always find a difference somewhere, so the
 * hypothesis, the variants, the success metric and the window are fixed while
 * the result is still unknown.
 *
 * A summary always carries its caveats, and an experiment that did not collect
 * its minimum sample says so instead of declaring a winner.
 */

export const EXPERIMENT_STATES = ['draft', 'running', 'complete', 'abandoned'] as const;
export const experimentStateSchema = z.enum(EXPERIMENT_STATES);
export type ExperimentState = z.infer<typeof experimentStateSchema>;

export const experimentVariantSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    /** Receipts assigned to this variant. Assigned before publication only. */
    receiptIds: z.array(z.string().min(1)),
  })
  .strict();
export type ExperimentVariant = z.infer<typeof experimentVariantSchema>;

export const experimentSchema = z
  .object({
    id: z.string().min(1),
    workspaceId: z.string().min(1),
    hypothesis: z.string().min(1),
    successMetric: normalizedMetricNameSchema,
    variants: z.array(experimentVariantSchema).min(2).max(4),
    windowStart: z.string().min(1),
    windowEnd: z.string().min(1),
    minimumSamplePerVariant: z.number().int().positive(),
    state: experimentStateSchema,
    /** Known limitations recorded when the experiment was defined. */
    caveats: z.array(z.string().min(1)),
  })
  .strict();
export type Experiment = z.infer<typeof experimentSchema>;

export const TAGGING_ERRORS = [
  'ALREADY_PUBLISHED',
  'EXPERIMENT_NOT_RUNNING',
  'UNKNOWN_VARIANT',
  'RECEIPT_ALREADY_TAGGED',
] as const;
export type TaggingError = (typeof TAGGING_ERRORS)[number];

export interface TagInput {
  readonly experiment: Experiment;
  readonly variantId: string;
  /** The content item being tagged. It must not be published yet. */
  readonly contentItemId: string;
  readonly alreadyPublished: boolean;
}

export interface TagResult {
  readonly ok: boolean;
  readonly error: TaggingError | null;
  readonly experiment: Experiment;
}

/**
 * Attach a draft to a variant. Refuses once the post exists externally, which
 * is what keeps the analysis from being assembled after the fact.
 */
export function tagBeforePublication(input: TagInput): TagResult {
  if (input.alreadyPublished) {
    return { ok: false, error: 'ALREADY_PUBLISHED', experiment: input.experiment };
  }
  if (input.experiment.state !== 'running' && input.experiment.state !== 'draft') {
    return { ok: false, error: 'EXPERIMENT_NOT_RUNNING', experiment: input.experiment };
  }
  const variant = input.experiment.variants.find((entry) => entry.id === input.variantId);
  if (variant === undefined) {
    return { ok: false, error: 'UNKNOWN_VARIANT', experiment: input.experiment };
  }
  const taggedElsewhere = input.experiment.variants.some((entry) =>
    entry.receiptIds.includes(input.contentItemId),
  );
  if (taggedElsewhere) {
    return { ok: false, error: 'RECEIPT_ALREADY_TAGGED', experiment: input.experiment };
  }

  return {
    ok: true,
    error: null,
    experiment: {
      ...input.experiment,
      variants: input.experiment.variants.map((entry) =>
        entry.id === variant.id
          ? { ...entry, receiptIds: [...entry.receiptIds, input.contentItemId] }
          : entry,
      ),
    },
  };
}

export interface CompletionCheck {
  readonly complete: boolean;
  readonly windowClosed: boolean;
  readonly sampleReached: boolean;
  readonly shortfallByVariant: Readonly<Record<string, number>>;
}

/**
 * An experiment is complete when its window has closed. Whether it collected
 * enough data is reported separately, because those are different questions and
 * merging them is how a thin result gets presented as a finding.
 */
export function detectCompletion(
  experiment: Experiment,
  now: Date,
  observedByVariant: Readonly<Record<string, number>>,
): CompletionCheck {
  const end = parseInstant(experiment.windowEnd);
  const windowClosed = end !== null && now.getTime() >= end;
  const shortfall: Record<string, number> = {};
  let sampleReached = true;
  for (const variant of experiment.variants) {
    const observed = observedByVariant[variant.id] ?? 0;
    const missing = Math.max(0, experiment.minimumSamplePerVariant - observed);
    shortfall[variant.id] = missing;
    if (missing > 0) {
      sampleReached = false;
    }
  }
  return { complete: windowClosed, windowClosed, sampleReached, shortfallByVariant: shortfall };
}

export interface VariantSummary {
  readonly variantId: string;
  readonly label: string;
  readonly sampleSize: number;
  readonly medianValue: number | null;
  readonly unavailableCount: number;
}

export interface ExperimentSummary {
  readonly experimentId: string;
  readonly metric: NormalizedMetricName;
  readonly variants: readonly VariantSummary[];
  /** Null whenever the result is not strong enough to name one. */
  readonly leadingVariantId: string | null;
  readonly relativeDifference: number | null;
  readonly conclusive: boolean;
  readonly caveats: readonly Insight[];
}

function caveat(code: string, messageKey: string, params: Record<string, string | number>): Insight {
  return {
    kind: 'caveat',
    code,
    messageKey,
    params,
    evidenceIds: [],
    confidence: 'low',
  };
}

/**
 * Summarize an experiment.
 *
 * `conclusive` is false unless every variant met its minimum sample and the
 * difference is outside the noise band. Nothing here claims causation.
 */
export function summarizeExperiment(
  experiment: Experiment,
  observations: readonly ObservedPost[],
): ExperimentSummary {
  const byReceipt = new Map(observations.map((entry) => [entry.post.receiptId, entry]));
  const caveats: Insight[] = [];

  const variants: VariantSummary[] = experiment.variants.map((variant) => {
    const entries = variant.receiptIds
      .map((receiptId) => byReceipt.get(receiptId))
      .filter((entry): entry is ObservedPost => entry !== undefined);
    const values = entries
      .filter((entry) => entry.observation.availability === 'available')
      .map((entry) => entry.observation.value)
      .filter((value): value is number => value !== null);
    return {
      variantId: variant.id,
      label: variant.label,
      sampleSize: values.length,
      medianValue: median(values),
      unavailableCount: entries.length - values.length,
    };
  });

  const shortfall = variants.filter(
    (variant) => variant.sampleSize < experiment.minimumSamplePerVariant,
  );
  if (shortfall.length > 0) {
    caveats.push(
      caveat('SAMPLE_NOT_REACHED', 'analytics.feedback.smallSample', {
        count: Math.min(...variants.map((variant) => variant.sampleSize)),
      }),
    );
  }
  if (variants.some((variant) => variant.unavailableCount > 0)) {
    caveats.push(
      caveat('SOME_READINGS_UNAVAILABLE', 'analytics.value.unavailable', {
        metric: experiment.successMetric,
      }),
    );
  }
  caveats.push(caveat('NO_CAUSATION', 'analytics.feedback.doNotInfer', {}));

  const ranked = [...variants]
    .filter((variant) => variant.medianValue !== null)
    .sort((left, right) => (right.medianValue ?? 0) - (left.medianValue ?? 0));
  const best = ranked[0];
  const runnerUp = ranked[1];

  if (
    best === undefined ||
    runnerUp === undefined ||
    best.medianValue === null ||
    runnerUp.medianValue === null ||
    runnerUp.medianValue === 0
  ) {
    return {
      experimentId: experiment.id,
      metric: experiment.successMetric,
      variants,
      leadingVariantId: null,
      relativeDifference: null,
      conclusive: false,
      caveats,
    };
  }

  const relativeDifference = (best.medianValue - runnerUp.medianValue) / runnerUp.medianValue;
  const conclusive =
    shortfall.length === 0 &&
    Math.abs(relativeDifference) >= 0.1 &&
    variants.every((variant) => variant.sampleSize >= SMALL_SAMPLE_THRESHOLD);

  return {
    experimentId: experiment.id,
    metric: experiment.successMetric,
    variants,
    leadingVariantId: conclusive ? best.variantId : null,
    relativeDifference,
    conclusive,
    caveats,
  };
}

/**
 * Compare one variant against the account baseline rather than the other
 * variant, which is the honest reading when only one variant collected data.
 */
export function variantAgainstBaseline(
  metric: NormalizedMetricName,
  subject: ObservedPost,
  history: readonly ObservedPost[],
): ReturnType<typeof compareToTrailingMedian> {
  return compareToTrailingMedian({ metric, subject, history });
}
