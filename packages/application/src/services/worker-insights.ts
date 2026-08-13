import { buildBaselineInsights, compareToTrailingMedian } from '@relay/analytics-domain';
import type { ComparablePost, ObservedPost } from '@relay/analytics-domain';
import type { MetricObservation, NormalizedMetricName } from '@relay/contracts';

import type {
  ActorContext,
  ServiceDeps,
  WorkerActivityContext,
  WorkerInsightService,
  WorkerPostFeedbackWindow,
} from '../types';

import { decimalToNumber, toProviderId } from '../internal/mappers';
import { toJson } from '../internal/json';
import { runInWorkspace, type Db } from '../internal/runtime';
import { parseStoredMaster } from '../internal/stored-content';

/**
 * Per-post feedback.
 *
 * One post, compared against this account's own trailing median over
 * comparable posts, written down as an `Insight` row the post page reads.
 *
 * Three properties hold whether or not AI is configured:
 *
 * 1. **The comparison is deterministic.** `compareToTrailingMedian` in
 *    `@relay/analytics-domain` decides the verdict, the effect size, the sample
 *    size and the confounders. A narrator may later reword the result; it can
 *    never change it.
 * 2. **Missing is not zero.** A subject reading that is unavailable produces
 *    `subject_unavailable`, not a comparison against a zero we invented.
 * 3. **It is idempotent by post and window.** A post is described once at the
 *    24 hour mark and refreshed once at 7 days. A retried activity, or a second
 *    analytics sync inside the same window, finds the row it already wrote.
 */

/** Nothing is said about a post younger than this. The numbers are still moving. */
const FIRST_WINDOW_HOURS = 24;
/** The one refresh. After this the post is described and left alone. */
const SECOND_WINDOW_HOURS = 24 * 7;

/** Comparable posts read for the baseline. The domain trims further. */
const HISTORY_LIMIT = 20;

/** Preference order for the metric a post is described by. */
const PRIMARY_METRICS: readonly NormalizedMetricName[] = ['impressions', 'reach', 'views', 'likes'];

/** Every post-feedback insight carries this prefix, which is how we find ours. */
const MESSAGE_KEY_PREFIX = 'insight.post_feedback.';

function context(ctx: WorkerActivityContext): ActorContext {
  return { ...ctx, scopes: [] };
}

interface ObservationRow {
  readonly receiptId: string | null;
  readonly observedAt: Date;
  readonly availability: string;
  readonly provider: string;
  readonly normalizedValue: { toString(): string } | null;
  readonly rawValue: { toString(): string } | null;
  readonly metricDefinition: { readonly normalizedName: string };
}

const OBSERVATION_SELECT = {
  receiptId: true,
  observedAt: true,
  availability: true,
  provider: true,
  normalizedValue: true,
  rawValue: true,
  metricDefinition: { select: { normalizedName: true } },
} as const;

/**
 * Rebuild the domain observation from a stored row.
 *
 * `availability` is carried across rather than assumed: a row that says the
 * reading could not be taken stays unavailable all the way into the comparison,
 * which is what stops it being counted as a zero.
 */
function toObservation(row: ObservationRow): MetricObservation {
  const available = row.availability === 'available';
  return {
    normalizedName: row.metricDefinition.normalizedName as NormalizedMetricName,
    provider: toProviderId(row.provider),
    providerField: row.metricDefinition.normalizedName,
    scope: 'post',
    value: available ? decimalToNumber(row.normalizedValue ?? row.rawValue) : null,
    unit: 'count',
    denominator: 'none',
    availability: available ? 'available' : 'unavailable_stale',
    observedAt: row.observedAt.toISOString(),
    freshnessSeconds: 0,
    rawProviderPayloadHash: '0'.repeat(64),
  };
}

interface ReceiptRow {
  readonly id: string;
  readonly connectionId: string;
  readonly provider: string;
  readonly publishedAt: Date;
  readonly contentVersionId: string;
  readonly publishJob: { readonly contentItemId: string };
}

/** The shape a post must be reduced to before it can be compared. */
async function comparablePost(
  db: Db,
  workspaceId: string,
  receipt: ReceiptRow,
): Promise<ComparablePost> {
  const version = await db.contentVersion.findFirst({
    where: { id: receipt.contentVersionId, workspaceId },
    select: { payload: true },
  });
  const master = version === null ? null : safeMaster(version.payload);
  return {
    receiptId: receipt.id,
    provider: toProviderId(receipt.provider),
    contentKind: master?.contentKind ?? 'text',
    connectionId: receipt.connectionId,
    publishedAt: receipt.publishedAt.toISOString(),
    hasMedia: (master?.mediaIds.length ?? 0) > 0,
    hasLink: (master?.links.length ?? 0) > 0,
  };
}

/** A payload we cannot parse describes nothing, so it describes a plain post. */
function safeMaster(payload: unknown): ReturnType<typeof parseStoredMaster> | null {
  try {
    return parseStoredMaster(payload);
  } catch {
    return null;
  }
}

export function createWorkerInsightService(deps: ServiceDeps): WorkerInsightService {
  return {
    async generatePostFeedback(input) {
      return runInWorkspace(deps, context(input.ctx), async (db) => {
        const receipt = await db.publicationReceipt.findFirst({
          where: { id: input.receiptId, workspaceId: input.ctx.workspaceId },
          select: {
            id: true,
            connectionId: true,
            provider: true,
            publishedAt: true,
            contentVersionId: true,
            publishJob: { select: { contentItemId: true } },
          },
        });
        if (receipt === null) {
          return {
            insightId: null,
            created: false,
            window: null,
            verdict: 'insufficient_data',
            reasonKey: `${MESSAGE_KEY_PREFIX}no_receipt`,
          };
        }

        const ageHours =
          (new Date(input.observedAt).getTime() - receipt.publishedAt.getTime()) / 3_600_000;
        if (ageHours < FIRST_WINDOW_HOURS) {
          // Too early to say anything. Saying it early would mean saying it
          // wrong, and the post page would rather show nothing than a guess.
          return {
            insightId: null,
            created: false,
            window: null,
            verdict: 'insufficient_data',
            reasonKey: `${MESSAGE_KEY_PREFIX}too_early`,
          };
        }
        const window: WorkerPostFeedbackWindow =
          ageHours >= SECOND_WINDOW_HOURS ? 'seven_days' : 'twenty_four_hours';
        const contentItemId = receipt.publishJob.contentItemId;

        // Idempotent by post and window. A retried activity finds its own row.
        const written = await db.insight.findMany({
          where: {
            workspaceId: input.ctx.workspaceId,
            contentItemId,
            messageKey: { startsWith: MESSAGE_KEY_PREFIX },
          },
          select: { id: true, messageKey: true, messageArgs: true },
        });
        const existing = written.find(
          (row) =>
            typeof row.messageArgs === 'object' &&
            row.messageArgs !== null &&
            Reflect.get(row.messageArgs, 'window') === window,
        );
        if (existing !== undefined) {
          return {
            insightId: existing.id,
            created: false,
            window,
            verdict: verdictOf(existing.messageArgs),
            reasonKey: null,
          };
        }

        const subjectRows = await db.metricObservation.findMany({
          where: { receiptId: receipt.id, workspaceId: input.ctx.workspaceId },
          orderBy: { observedAt: 'desc' },
          take: 100,
          select: OBSERVATION_SELECT,
        });
        const subjectPost = await comparablePost(db, input.ctx.workspaceId, receipt);
        const latest = new Map<string, ObservationRow>();
        for (const row of subjectRows) {
          const name = row.metricDefinition.normalizedName;
          if (!latest.has(name)) {
            latest.set(name, row);
          }
        }
        const metric =
          PRIMARY_METRICS.find(
            (candidate) => latest.get(candidate)?.availability === 'available',
          ) ?? PRIMARY_METRICS[0];
        const subjectRow = metric === undefined ? undefined : latest.get(metric);

        // History: earlier posts on the same connection. Comparability across
        // platform and content kind is decided by the domain, not here.
        const priorReceipts = await db.publicationReceipt.findMany({
          where: {
            workspaceId: input.ctx.workspaceId,
            connectionId: receipt.connectionId,
            publishedAt: { lt: receipt.publishedAt },
          },
          orderBy: { publishedAt: 'desc' },
          take: HISTORY_LIMIT,
          select: {
            id: true,
            connectionId: true,
            provider: true,
            publishedAt: true,
            contentVersionId: true,
            publishJob: { select: { contentItemId: true } },
          },
        });
        const history: ObservedPost[] = [];
        for (const prior of priorReceipts) {
          const rows = await db.metricObservation.findMany({
            where: {
              receiptId: prior.id,
              workspaceId: input.ctx.workspaceId,
              metricDefinition: { normalizedName: metric },
            },
            orderBy: { observedAt: 'desc' },
            take: 1,
            select: OBSERVATION_SELECT,
          });
          const row = rows[0];
          if (row === undefined) {
            continue;
          }
          history.push({
            post: await comparablePost(db, input.ctx.workspaceId, prior),
            observation: toObservation(row),
          });
        }

        const comparison = compareToTrailingMedian({
          metric: metric ?? 'impressions',
          subject: {
            post: subjectPost,
            observation:
              subjectRow === undefined
                ? unavailableSubject(metric ?? 'impressions', subjectPost, input.observedAt)
                : toObservation(subjectRow),
          },
          history,
        });
        const [headline] = buildBaselineInsights(comparison);
        const verdict =
          comparison.outcome === 'compared' && comparison.direction !== null
            ? comparison.direction
            : 'insufficient_data';

        const created = await db.insight.create({
          data: {
            workspaceId: input.ctx.workspaceId,
            contentItemId,
            // The catalog owns the wording. This row holds a key and its args.
            messageKey: `${MESSAGE_KEY_PREFIX}${verdict}`,
            messageArgs: toJson({
              window,
              verdict,
              metric: comparison.metric,
              code: headline?.code ?? 'NO_BASELINE_YET',
              statementKey: headline?.messageKey ?? 'analytics.baseline.trailingMedian',
              statementParams: headline?.params ?? {},
              effectSize: comparison.effectSize,
              medianValue: comparison.medianValue,
              subjectValue: comparison.subjectValue,
              smallSample: comparison.smallSample,
              confounderKeys: comparison.confounders.map((entry) => entry.messageKey),
            }),
            evidenceIds: [receipt.id, ...comparison.comparedReceiptIds],
            confidence: headline?.confidence ?? 'low',
            sampleSize: comparison.sampleSize,
            state: 'new',
            // No model produced this. Recording a model name here would claim a
            // provenance the row does not have.
            aiModel: null,
            aiPromptVersion: null,
          },
          select: { id: true },
        });
        return { insightId: created.id, created: true, window, verdict, reasonKey: null };
      });
    },
  };
}

/** No reading at all is an unavailable reading, never a zero. */
function unavailableSubject(
  metric: NormalizedMetricName,
  post: ComparablePost,
  observedAt: string,
): MetricObservation {
  return {
    normalizedName: metric,
    provider: post.provider,
    providerField: metric,
    scope: 'post',
    value: null,
    unit: 'count',
    denominator: 'none',
    availability: 'unavailable_pending',
    observedAt,
    freshnessSeconds: 0,
    rawProviderPayloadHash: '0'.repeat(64),
  };
}

function verdictOf(args: unknown): 'above' | 'below' | 'similar' | 'insufficient_data' {
  if (typeof args !== 'object' || args === null) {
    return 'insufficient_data';
  }
  const value: unknown = Reflect.get(args, 'verdict');
  return value === 'above' || value === 'below' || value === 'similar'
    ? value
    : 'insufficient_data';
}
