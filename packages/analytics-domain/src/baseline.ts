import type { NormalizedMetricName } from '@relay/contracts';

import { confounder, isComparable, isIncompatibleKind, kindFamily } from './types.js';
import type { ComparablePost, Confounder, ObservedPost } from './types.js';

/**
 * The honest feedback engine.
 *
 * A post is compared against the account's own trailing median of the last N
 * comparable posts on the same platform, in the same content kind. There is no
 * global benchmark, because a global benchmark compares a bakery in Lisbon with
 * a games publisher in Seoul and calls the difference performance.
 *
 * Every comparison returns the effect size, the sample size and the confounders
 * it can see. A small sample is reported as a small sample rather than smoothed
 * away.
 */

export const DEFAULT_MINIMUM_SAMPLE = 5;
export const DEFAULT_HISTORY_LIMIT = 20;
/** Below this many comparable posts, every statement must be hedged. */
export const SMALL_SAMPLE_THRESHOLD = 8;
/** Relative differences inside this band are reported as no real difference. */
export const NOISE_BAND = 0.1;

export const BASELINE_OUTCOMES = [
  'compared',
  'refused_incompatible_kinds',
  'subject_unavailable',
  'insufficient_history',
] as const;
export type BaselineOutcome = (typeof BASELINE_OUTCOMES)[number];

export const BASELINE_DIRECTIONS = ['above', 'below', 'similar'] as const;
export type BaselineDirection = (typeof BASELINE_DIRECTIONS)[number];

export interface BaselineInput {
  readonly metric: NormalizedMetricName;
  readonly subject: ObservedPost;
  /** Prior posts on the same account. Filtering happens here, not in the caller. */
  readonly history: readonly ObservedPost[];
  readonly minimumSample?: number;
  readonly historyLimit?: number;
}

export interface BaselineResult {
  readonly outcome: BaselineOutcome;
  readonly metric: NormalizedMetricName;
  readonly subjectValue: number | null;
  readonly medianValue: number | null;
  /** Relative difference against the median. Null when there is no comparison. */
  readonly effectSize: number | null;
  readonly direction: BaselineDirection | null;
  readonly sampleSize: number;
  readonly smallSample: boolean;
  /** Posts excluded because they are not comparable, with the reason. */
  readonly excludedCount: number;
  readonly confounders: readonly Confounder[];
  readonly comparedReceiptIds: readonly string[];
}

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
  return lower === undefined || upper === undefined ? null : (lower + upper) / 2;
}

function hourOf(instant: string): number | null {
  const parsed = Number(instant.slice(11, 13));
  return Number.isFinite(parsed) ? parsed : null;
}

function detectConfounders(
  subject: ComparablePost,
  compared: readonly ObservedPost[],
): Confounder[] {
  const found: Confounder[] = [];

  const subjectHour = hourOf(subject.publishedAt);
  const hours = compared
    .map((entry) => hourOf(entry.post.publishedAt))
    .filter((hour): hour is number => hour !== null);
  if (subjectHour !== null && hours.length > 0) {
    const spread = Math.max(...hours.map((hour) => Math.abs(hour - subjectHour)));
    if (spread >= 4) {
      found.push(
        confounder('POSTING_HOUR_DIFFERS', 'analytics.feedback.association', {
          before: `${Math.min(...hours)}`,
          after: `${subjectHour}`,
        }),
      );
    }
  }

  const mediaMismatch = compared.filter((entry) => entry.post.hasMedia !== subject.hasMedia).length;
  if (mediaMismatch > 0) {
    found.push(
      confounder('MEDIA_PRESENCE_DIFFERS', 'analytics.definition.notComparable', {
        provider: subject.provider,
        otherProvider: subject.provider,
      }),
    );
  }

  const linkMismatch = compared.filter((entry) => entry.post.hasLink !== subject.hasLink).length;
  if (linkMismatch > 0) {
    found.push(
      confounder('LINK_PRESENCE_DIFFERS', 'analytics.feedback.doNotInfer', {
        count: linkMismatch,
      }),
    );
  }

  if (compared.length > 0 && compared.length < SMALL_SAMPLE_THRESHOLD) {
    found.push(
      confounder('SMALL_SAMPLE', 'analytics.feedback.smallSample', { count: compared.length }),
    );
  }

  return found;
}

/**
 * Compare one post against the account's own trailing median.
 *
 * Refuses rather than guesses when the subject reading is unavailable, when the
 * history contains no comparable post, or when the caller asked to compare
 * across incompatible content kinds.
 */
export function compareToTrailingMedian(input: BaselineInput): BaselineResult {
  const minimumSample = input.minimumSample ?? DEFAULT_MINIMUM_SAMPLE;
  const historyLimit = input.historyLimit ?? DEFAULT_HISTORY_LIMIT;
  const subject = input.subject;

  const base = {
    metric: input.metric,
    subjectValue: subject.observation.value,
    medianValue: null,
    effectSize: null,
    direction: null,
    smallSample: true,
    comparedReceiptIds: [] as readonly string[],
  } as const;

  if (
    subject.observation.availability !== 'available' ||
    subject.observation.value === null
  ) {
    return {
      ...base,
      subjectValue: null,
      outcome: 'subject_unavailable',
      sampleSize: 0,
      excludedCount: input.history.length,
      confounders: [],
    };
  }

  const samePlatform = input.history.filter(
    (entry) => entry.post.provider === subject.post.provider,
  );
  const comparable = samePlatform
    .filter((entry) => isComparable(entry.post, subject.post))
    .filter(
      (entry) =>
        entry.observation.availability === 'available' && entry.observation.value !== null,
    )
    .sort((left, right) => (left.post.publishedAt < right.post.publishedAt ? 1 : -1))
    .slice(0, historyLimit);

  if (comparable.length === 0) {
    const incompatible = samePlatform.filter((entry) =>
      isIncompatibleKind(entry.post.contentKind, subject.post.contentKind),
    );
    if (incompatible.length > 0) {
      return {
        ...base,
        outcome: 'refused_incompatible_kinds',
        sampleSize: 0,
        excludedCount: input.history.length,
        confounders: [
          confounder('INCOMPATIBLE_CONTENT_KINDS', 'analytics.feedback.notComparableFormats', {
            subjectKind: kindFamily(subject.post.contentKind),
          }),
        ],
      };
    }
    return {
      ...base,
      outcome: 'insufficient_history',
      sampleSize: 0,
      excludedCount: input.history.length,
      confounders: [],
    };
  }

  if (comparable.length < minimumSample) {
    return {
      ...base,
      outcome: 'insufficient_history',
      sampleSize: comparable.length,
      excludedCount: input.history.length - comparable.length,
      comparedReceiptIds: comparable.map((entry) => entry.post.receiptId),
      confounders: [
        confounder('SMALL_SAMPLE', 'analytics.feedback.smallSample', {
          count: comparable.length,
        }),
      ],
    };
  }

  const values = comparable
    .map((entry) => entry.observation.value)
    .filter((value): value is number => value !== null);
  const medianValue = median(values);
  const subjectValue = subject.observation.value;

  if (medianValue === null) {
    return {
      ...base,
      outcome: 'insufficient_history',
      sampleSize: comparable.length,
      excludedCount: input.history.length - comparable.length,
      confounders: [],
    };
  }

  const effectSize = medianValue === 0 ? null : (subjectValue - medianValue) / medianValue;
  const direction: BaselineDirection =
    effectSize === null || Math.abs(effectSize) < NOISE_BAND
      ? 'similar'
      : effectSize > 0
        ? 'above'
        : 'below';

  return {
    outcome: 'compared',
    metric: input.metric,
    subjectValue,
    medianValue,
    effectSize,
    direction,
    sampleSize: comparable.length,
    smallSample: comparable.length < SMALL_SAMPLE_THRESHOLD,
    excludedCount: input.history.length - comparable.length,
    confounders: detectConfounders(subject.post, comparable),
    comparedReceiptIds: comparable.map((entry) => entry.post.receiptId),
  };
}
