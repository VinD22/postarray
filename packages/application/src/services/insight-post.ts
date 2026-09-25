import type { Db } from '../internal/runtime';
import { explainFailure, isFailedState } from './insight-failures';
import type {
  FeedbackVerdict,
  FeedbackWindow,
  InsightArgs,
  NextTestView,
  PostChannelFeedbackView,
  PostFeedbackReadingView,
  PostFeedbackView,
} from './insights-types';

/**
 * The "How it did" read for one post, per channel.
 *
 * Nothing is computed here that the worker did not already decide. The verdict,
 * the median, the sample size and the confounders come from the stored
 * `insight.post_feedback.*` rows, which `compareToTrailingMedian` wrote. This
 * file only joins them to the publish jobs and receipts, picks the one next
 * test deterministically, and explains a failure in plain language.
 */

export const POST_FEEDBACK_PREFIX = 'insight.post_feedback.';
const FIRST_WINDOW_MS = 24 * 3_600_000;

/** Confounder message keys the domain emits, mapped to the one variable to hold. */
const CONFOUNDER_VARIABLE: Readonly<Record<string, 'hour' | 'media' | 'link'>> = {
  'analytics.feedback.association': 'hour',
  'analytics.definition.notComparable': 'media',
  'analytics.feedback.doNotInfer': 'link',
};

function record(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function numberOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function verdictOf(value: unknown): FeedbackVerdict {
  return value === 'above' || value === 'below' || value === 'similar'
    ? value
    : 'insufficient_data';
}

function windowOf(value: unknown): FeedbackWindow | null {
  return value === 'twenty_four_hours' || value === 'seven_days' ? value : null;
}

export function toReading(row: {
  readonly id: string;
  readonly messageArgs: unknown;
  readonly evidenceIds: readonly string[];
  readonly sampleSize: number | null;
  readonly createdAt: Date;
}): PostFeedbackReadingView | null {
  const args = record(row.messageArgs);
  const window = windowOf(args.window);
  if (window === null) {
    return null;
  }
  const confounders = Array.isArray(args.confounderKeys)
    ? args.confounderKeys.filter((entry): entry is string => typeof entry === 'string')
    : [];
  return {
    insightId: row.id,
    window,
    verdict: verdictOf(args.verdict),
    metric: typeof args.metric === 'string' ? args.metric : 'impressions',
    subjectValue: numberOrNull(args.subjectValue),
    medianValue: numberOrNull(args.medianValue),
    effectSize: numberOrNull(args.effectSize),
    sampleSize: row.sampleSize,
    smallSample: args.smallSample === true,
    confounderKeys: [...new Set(confounders)],
    evidenceIds: [...row.evidenceIds],
    createdAt: row.createdAt.toISOString(),
  };
}

/**
 * One suggested next test, changing exactly one variable.
 *
 * Never offered without a real comparison, and never measured by a metric the
 * account could not read: a reading whose subject value is unavailable gets no
 * suggestion at all.
 */
export function deterministicNextTest(reading: PostFeedbackReadingView): NextTestView | null {
  if (reading.verdict === 'insufficient_data' || reading.subjectValue === null) {
    return null;
  }
  const variable =
    reading.verdict === 'above'
      ? 'repeat'
      : (reading.confounderKeys
          .map((key) => CONFOUNDER_VARIABLE[key])
          .find((entry) => entry !== undefined) ?? 'hour');
  const args: InsightArgs = { metric: reading.metric };
  return {
    messageKey: `insight.nextTest.${variable}`,
    messageArgs: args,
    metric: reading.metric,
    evidenceIds: reading.evidenceIds.slice(0, 1),
    source: 'deterministic',
  };
}

function pendingReason(
  state: string,
  publishedAt: Date | null,
  now: Date,
  hasReadings: boolean,
): string | null {
  if (hasReadings || isFailedState(state)) {
    return null;
  }
  if (publishedAt === null) {
    return `${POST_FEEDBACK_PREFIX}not_published`;
  }
  return now.getTime() - publishedAt.getTime() < FIRST_WINDOW_MS
    ? `${POST_FEEDBACK_PREFIX}too_early`
    : `${POST_FEEDBACK_PREFIX}waiting`;
}

export async function readPostFeedback(
  db: Db,
  workspaceId: string,
  contentItemId: string,
  now: Date,
): Promise<PostFeedbackView> {
  const [jobs, insights] = await Promise.all([
    db.publishJob.findMany({
      where: { workspaceId, contentItemId, commentThreadItemId: null },
      orderBy: { scheduledFor: 'asc' },
      take: 50,
      select: {
        id: true,
        connectionId: true,
        state: true,
        scheduledFor: true,
        dispatchedAt: true,
        lastErrorClass: true,
        lastErrorCode: true,
        connection: { select: { provider: true } },
        receipt: { select: { id: true, publishedAt: true, permalink: true } },
      },
    }),
    db.insight.findMany({
      where: { workspaceId, contentItemId, messageKey: { startsWith: POST_FEEDBACK_PREFIX } },
      orderBy: { createdAt: 'asc' },
      take: 200,
      select: { id: true, messageArgs: true, evidenceIds: true, sampleSize: true, createdAt: true },
    }),
  ]);

  const readingsByReceipt = new Map<string, PostFeedbackReadingView[]>();
  for (const row of insights) {
    const receiptId = row.evidenceIds[0];
    const reading = toReading(row);
    if (receiptId === undefined || reading === null) {
      continue;
    }
    const list = readingsByReceipt.get(receiptId) ?? [];
    list.push(reading);
    readingsByReceipt.set(receiptId, list);
  }

  const channels: PostChannelFeedbackView[] = jobs.map((job) => {
    const receipt = job.receipt;
    const readings = receipt === null ? [] : (readingsByReceipt.get(receipt.id) ?? []);
    // The seven day reading supersedes the 24 hour one when both exist.
    const latest =
      readings.find((entry) => entry.window === 'seven_days') ??
      readings.find((entry) => entry.window === 'twenty_four_hours') ??
      null;
    const failed = isFailedState(job.state);
    return {
      publishJobId: job.id,
      receiptId: receipt?.id ?? null,
      connectionId: job.connectionId,
      provider: job.connection.provider,
      state: job.state,
      scheduledFor: job.scheduledFor.toISOString(),
      dispatchedAt: job.dispatchedAt?.toISOString() ?? null,
      publishedAt: receipt?.publishedAt.toISOString() ?? null,
      permalink: receipt?.permalink ?? null,
      readings,
      verdict: latest?.verdict ?? null,
      nextTest: latest === null ? null : deterministicNextTest(latest),
      failure: failed
        ? explainFailure({ errorClass: job.lastErrorClass, errorCode: job.lastErrorCode })
        : null,
      pendingReasonKey: pendingReason(
        job.state,
        receipt?.publishedAt ?? null,
        now,
        readings.length > 0,
      ),
    };
  });

  return { contentItemId, channels };
}
