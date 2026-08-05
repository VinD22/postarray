import type { ContentKind, NormalizedMetricName } from '@relay/contracts';

import type { BaselineComparison, BaselinePost, ConfounderCode } from './types';

/**
 * Comparing a post with the author's own recent posts.
 *
 * Everything here is deliberate and everything here is arguable, so it is
 * written down rather than buried in a component:
 *
 * 1. The centre is a **median**, not a mean. One post that happened to be
 *    picked up by a large account would drag a mean far enough to make every
 *    other comparison meaningless.
 * 2. The baseline is built from **comparable** posts only: same account, same
 *    content format, inside the trailing window. A short video and a text post
 *    are not two samples of one thing.
 * 3. A post whose metric is **unavailable** is excluded and counted, never read
 *    as zero. That count is shown, because a baseline built from four of ten
 *    posts is a different claim from one built from ten.
 * 4. Below `MINIMUM_BASELINE_SAMPLE` no comparison is produced at all. Between
 *    that and `RELIABLE_BASELINE_SAMPLE` the comparison is produced but marked
 *    `smallSample`, which the UI turns into "test the hook again" rather than
 *    into a result.
 * 5. Inside `LEVEL_BAND` the answer is "in line with baseline". A 3 percent
 *    difference is noise and presenting it as a movement invites the reader to
 *    act on nothing.
 */

/** Fewer comparable posts than this and no comparison is offered. */
export const MINIMUM_BASELINE_SAMPLE = 5;

/** At or above this the comparison stops carrying the small sample caveat. */
export const RELIABLE_BASELINE_SAMPLE = 10;

/** Differences inside this band read as level rather than as a movement. */
export const LEVEL_BAND = 0.05;

/** The median of a list of numbers. Empty input has no median, so it is null. */
export function median(values: readonly number[]): number | null {
  if (values.length === 0) {
    return null;
  }
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) {
    return sorted[middle] ?? null;
  }
  const lower = sorted[middle - 1];
  const upper = sorted[middle];
  if (lower === undefined || upper === undefined) {
    return null;
  }
  return (lower + upper) / 2;
}

export interface BuildBaselineInput {
  readonly metric: NormalizedMetricName;
  readonly format: ContentKind;
  /** The value being compared. Callers pass null when it is unavailable. */
  readonly value: number | null;
  /** Comparable posts, already filtered to the same account and format. */
  readonly comparablePosts: readonly BaselinePost[];
  /** Comparable posts whose metric could not be read. */
  readonly excludedCount: number;
  readonly confounders: readonly ConfounderCode[];
}

/**
 * Build the comparison, or return null when one would be dishonest.
 *
 * Null is returned when the subject value is missing or when the sample is
 * below `MINIMUM_BASELINE_SAMPLE`. Callers render "No baseline yet" with the
 * reason, which is a fact, rather than a zero or an empty cell, which are not.
 */
export function buildBaseline(input: BuildBaselineInput): BaselineComparison | null {
  if (input.value === null) {
    return null;
  }
  if (input.comparablePosts.length < MINIMUM_BASELINE_SAMPLE) {
    return null;
  }

  const centre = median(input.comparablePosts.map((post) => post.value));
  if (centre === null || centre <= 0) {
    // A zero median makes a ratio meaningless rather than infinite.
    return null;
  }

  const deltaRatio = (input.value - centre) / centre;
  const direction: BaselineComparison['direction'] =
    Math.abs(deltaRatio) < LEVEL_BAND ? 'level' : deltaRatio > 0 ? 'above' : 'below';

  const confounders = new Set<ConfounderCode>(input.confounders);
  if (input.excludedCount > 0) {
    // Coverage gaps change what the median describes, so they are a confounder.
    confounders.add('provider_definition_change');
  }

  return {
    metric: input.metric,
    format: input.format,
    median: centre,
    sampleSize: input.comparablePosts.length,
    deltaRatio,
    direction,
    smallSample: input.comparablePosts.length < RELIABLE_BASELINE_SAMPLE,
    comparablePosts: [...input.comparablePosts].sort((left, right) =>
      right.publishedAt.localeCompare(left.publishedAt),
    ),
    excludedCount: input.excludedCount,
    confounders: [...confounders],
  };
}

/**
 * Order rows by how far they sit from their own baseline, largest movement
 * first, with rows that have no comparison last.
 *
 * Sorting by raw value would put the biggest account at the top every time and
 * answer a question nobody asked.
 */
export function byBaselineMovement(
  left: { readonly baseline: BaselineComparison | null },
  right: { readonly baseline: BaselineComparison | null },
): number {
  const leftDelta = left.baseline ? Math.abs(left.baseline.deltaRatio) : -1;
  const rightDelta = right.baseline ? Math.abs(right.baseline.deltaRatio) : -1;
  return rightDelta - leftDelta;
}
