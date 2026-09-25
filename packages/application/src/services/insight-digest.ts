import {
  DIGEST_NARRATIVE_KEYS,
  buildDigestFloor,
  buildDigestRetrieval,
  postProcessDigest,
  weeklyDigestResultSchema,
} from '@relay/ai/digest';
import type {
  BaselineResultLike,
  DigestInsightRow,
  DigestMetricInput,
  DigestReceipt,
  InsightLike,
  WeeklyDigestResult,
} from '@relay/ai/digest';
import {
  UNAVAILABLE_REASON_KEYS,
  buildUnavailabilityInsights,
  compareAcrossPlatforms,
  computeFreshness,
  mappingForMetric,
  median,
} from '@relay/analytics-domain';
import type { NormalizedMetric, UnavailableReason } from '@relay/analytics-domain';
import type { MetricObservation, NormalizedMetricName } from '@relay/contracts';

import type { ActorContext, ServiceDeps } from '../types';
import { assertMonthlyAiBudget, recordAiUsage } from '../internal/ai-spend';
import { toJson } from '../internal/json';
import { decimalToNumber, toProviderId } from '../internal/mappers';
import type { Db } from '../internal/runtime';
import { localDateIn, partsOf, resolveWallClock } from '../internal/zone-time';
import { POST_FEEDBACK_PREFIX } from './insight-post';
import type { DigestRowView, DigestView, InsightArgs } from './insights-types';

/**
 * The weekly digest, built from first-party rows and stored as insights.
 *
 * The order is the one `@relay/ai`'s digest pipeline defines: deterministic
 * retrieval, the deterministic floor, then (only when the gateway is ready and
 * the monthly budget allows) one model call whose every numeral is audited
 * against the retrieval. Every exit stores a complete digest; a vendor outage
 * or a rejected audit stores the floor and says why.
 *
 * Storage is `app.insights`, one row per digest line, tagged in `messageArgs`
 * with reserved `_`-prefixed keys (window, order, narrative flag). The client
 * never sees those keys: `toRowView` strips them.
 */

export const DIGEST_WINDOW_ARG = '_digestWindow';
const HEADER_PREFIX = 'digest.headline.';
const EMAIL_MARKER_KEY = 'insight.digest.emailSent';
const METRICS: readonly NormalizedMetricName[] = ['impressions', 'reach', 'views', 'likes'];

const FALLBACK_REASON_KEYS: Readonly<Record<string, string>> = {
  ai_disabled: 'digest.unavailable.aiOff',
  ai_circuit_open: 'digest.unavailable.aiOff',
  ai_call_failed: 'digest.unavailable.aiOff',
  ai_budget: 'digest.unavailable.aiOff',
  audit_rejected: 'digest.unavailable.rejected',
};

const DB_TO_REASON: Readonly<Record<string, UnavailableReason>> = {
  unsupported: 'unavailable_provider',
  restricted_by_provider: 'unavailable_provider',
  requires_permission: 'unavailable_permission',
  unavailable: 'unavailable_pending',
};

/* ------------------------------------------------------------------------- */
/* Windows                                                                   */
/* ------------------------------------------------------------------------- */

function addDays(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number);
  const next = new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, (d ?? 1) + days));
  return next.toISOString().slice(0, 10);
}

/** The most recently completed week, in the workspace's zone and week start. */
export function lastCompletedWeek(
  now: Date,
  timeZone: string,
  weekStart: number,
): { readonly windowStart: string; readonly windowEnd: string } {
  const today = localDateIn(now, timeZone);
  const parts = partsOf(now, timeZone);
  const isoDay =
    ((new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).getUTCDay() + 6) % 7) + 1;
  const offset = (isoDay - weekStart + 7) % 7;
  const windowStart = addDays(today, -offset - 7);
  return { windowStart, windowEnd: addDays(windowStart, 6) };
}

function startOfDay(date: string, timeZone: string): Date {
  const [year = 1970, month = 1, day = 1] = date.split('-').map(Number);
  const resolved = resolveWallClock({ year, month, day, minuteOfDay: 0 }, timeZone);
  // Midnight skipped by a DST jump: the day starts at the first real instant,
  // which the naive UTC reading approximates to within the jump.
  return resolved.kind === 'nonexistent'
    ? new Date(Date.UTC(year, month - 1, day))
    : resolved.instant;
}

/* ------------------------------------------------------------------------- */
/* Retrieval                                                                 */
/* ------------------------------------------------------------------------- */

interface ObservationRow {
  readonly receiptId: string | null;
  readonly connectionId: string;
  readonly observedAt: Date;
  readonly availability: string;
  readonly provider: string;
  readonly normalizedValue: { toString(): string } | null;
  readonly rawValue: { toString(): string } | null;
  readonly metricDefinition: { readonly normalizedName: string };
}

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
    availability: available
      ? 'available'
      : (DB_TO_REASON[row.availability] ?? 'unavailable_pending'),
    observedAt: row.observedAt.toISOString(),
    freshnessSeconds: 0,
    rawProviderPayloadHash: '0'.repeat(64),
  };
}

/** A stored unavailable reading, restated as the domain's `NormalizedMetric`. */
function toNormalized(row: ObservationRow): NormalizedMetric | null {
  const observation = toObservation(row);
  const mapping = mappingForMetric(observation.provider, 'post', observation.normalizedName);
  if (mapping === null) {
    return null;
  }
  const reason = observation.availability === 'available' ? null : observation.availability;
  return {
    observation,
    definition: mapping.definition,
    providerField: observation.providerField,
    rawValue: observation.value,
    reason,
    reasonKey: reason === null ? null : UNAVAILABLE_REASON_KEYS[reason],
    needsReverification: false,
  };
}

function record(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function num(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

interface Gathered {
  readonly receipts: DigestReceipt[];
  readonly metrics: DigestMetricInput[];
  readonly baselines: BaselineResultLike[];
  readonly baselineInsights: InsightLike[];
  readonly unavailabilityInsights: InsightLike[];
  readonly observations: MetricObservation[];
}

async function gather(db: Db, workspaceId: string, from: Date, to: Date): Promise<Gathered> {
  const [published, failedJobs] = await Promise.all([
    db.publicationReceipt.findMany({
      where: { workspaceId, publishedAt: { gte: from, lt: to } },
      orderBy: { publishedAt: 'asc' },
      take: 500,
      select: {
        id: true,
        provider: true,
        connectionId: true,
        publishedAt: true,
        publishJob: { select: { state: true, contentItemId: true } },
      },
    }),
    db.publishJob.findMany({
      where: {
        workspaceId,
        state: { in: ['failed_permanently', 'action_required'] },
        updatedAt: { gte: from, lt: to },
        receipt: null,
      },
      take: 500,
      select: { id: true, updatedAt: true, connection: { select: { provider: true } } },
    }),
  ]);

  const receipts: DigestReceipt[] = [
    ...published.map((row) => ({
      receiptId: row.id,
      provider: row.provider,
      outcome:
        row.publishJob.state === 'partially_published'
          ? ('partial' as const)
          : ('published' as const),
      publishedAt: row.publishedAt.toISOString(),
    })),
    ...failedJobs.map((row) => ({
      receiptId: row.id,
      provider: row.connection.provider,
      outcome: 'failed' as const,
      publishedAt: row.updatedAt.toISOString(),
    })),
  ];

  const receiptIds = published.map((row) => row.id);
  const rows: ObservationRow[] =
    receiptIds.length === 0
      ? []
      : await db.metricObservation.findMany({
          where: { workspaceId, receiptId: { in: receiptIds } },
          orderBy: { observedAt: 'desc' },
          take: 2000,
          select: {
            receiptId: true,
            connectionId: true,
            observedAt: true,
            availability: true,
            provider: true,
            normalizedValue: true,
            rawValue: true,
            metricDefinition: { select: { normalizedName: true } },
          },
        });
  const latest = new Map<string, ObservationRow>();
  for (const row of rows) {
    const key = `${row.receiptId ?? ''}:${row.metricDefinition.normalizedName}`;
    if (!latest.has(key)) latest.set(key, row);
  }
  const latestRows = [...latest.values()];
  const observations = latestRows.map(toObservation);

  const metrics: DigestMetricInput[] = [];
  const normalized: NormalizedMetric[] = [];
  for (const row of latestRows) {
    const metric = toNormalized(row);
    if (metric === null || row.receiptId === null) continue;
    normalized.push(metric);
    metrics.push({
      receiptId: row.receiptId,
      metric: {
        observation: {
          normalizedName: metric.observation.normalizedName,
          provider: metric.observation.provider,
          value: metric.observation.value,
          unit: metric.observation.unit,
          availability: metric.observation.availability,
          observedAt: metric.observation.observedAt,
        },
        reason: metric.reason,
        reasonKey: metric.reasonKey,
      },
    });
  }

  // Per-post comparisons were already made by the worker. Reuse them rather
  // than computing a second, possibly different, verdict for the same post.
  const contentItemIds = [...new Set(published.map((row) => row.publishJob.contentItemId))];
  const feedback =
    contentItemIds.length === 0
      ? []
      : await db.insight.findMany({
          where: {
            workspaceId,
            contentItemId: { in: contentItemIds },
            messageKey: { startsWith: POST_FEEDBACK_PREFIX },
          },
          orderBy: { createdAt: 'desc' },
          take: 500,
          select: { messageArgs: true, evidenceIds: true, sampleSize: true, confidence: true },
        });
  const seen = new Set<string>();
  const baselines: BaselineResultLike[] = [];
  const baselineInsights: InsightLike[] = [];
  for (const row of feedback) {
    const subjectId = row.evidenceIds[0];
    if (subjectId === undefined || seen.has(subjectId) || !receiptIds.includes(subjectId)) continue;
    seen.add(subjectId);
    const args = record(row.messageArgs);
    const verdict = typeof args.verdict === 'string' ? args.verdict : 'insufficient_data';
    const compared = verdict !== 'insufficient_data';
    baselines.push({
      outcome: compared ? 'compared' : 'insufficient_history',
      metric: typeof args.metric === 'string' ? args.metric : 'impressions',
      subjectValue: num(args.subjectValue),
      medianValue: num(args.medianValue),
      effectSize: num(args.effectSize),
      direction: compared ? verdict : null,
      sampleSize: row.sampleSize ?? 0,
      smallSample: args.smallSample === true,
      comparedReceiptIds: row.evidenceIds.slice(1),
    });
    if (verdict === 'above' || verdict === 'below') {
      baselineInsights.push({
        kind: 'observation',
        code: verdict === 'above' ? 'ABOVE_BASELINE' : 'BELOW_BASELINE',
        messageKey:
          typeof args.statementKey === 'string'
            ? args.statementKey
            : 'analytics.baseline.trailingMedian',
        params: sanitizeParams(args.statementParams),
        evidenceIds: [...row.evidenceIds],
        confidence: row.confidence,
      });
    }
  }

  const unavailabilityInsights: InsightLike[] = buildUnavailabilityInsights(normalized).map(
    (entry) => ({ ...entry, params: { ...entry.params } }),
  );

  // Side by side only when more than one platform published, on one named
  // metric. Only the caveats are kept: a platform that does not report the
  // metric, or defines it differently. There is no ranking to state.
  const providers = [...new Set(published.map((row) => row.provider))];
  if (providers.length > 1) {
    for (const metric of METRICS) {
      const entries = published.map((row) => {
        const reading = latest.get(`${row.id}:${metric}`);
        return {
          provider: toProviderId(row.provider),
          connectionId: row.connectionId,
          value: reading === undefined ? null : toObservation(reading).value,
        };
      });
      if (entries.every((entry) => entry.value === null)) continue;
      const byConnection = new Map<
        string,
        { provider: (typeof entries)[number]['provider']; values: number[] }
      >();
      for (const entry of entries) {
        const bucket = byConnection.get(entry.connectionId) ?? {
          provider: entry.provider,
          values: [],
        };
        if (entry.value !== null) bucket.values.push(entry.value);
        byConnection.set(entry.connectionId, bucket);
      }
      const comparison = compareAcrossPlatforms({
        metric,
        entries: [...byConnection.entries()].map(([connectionId, bucket]) => ({
          provider: bucket.provider,
          connectionId,
          value: median(bucket.values),
        })),
      });
      for (const caveat of comparison.caveats) {
        if (caveat.code === 'METRIC_NOT_REPORTED' || caveat.code === 'DEFINITION_DIFFERS') {
          unavailabilityInsights.push({ ...caveat, params: { ...caveat.params } });
        }
      }
      break;
    }
  }

  return { receipts, metrics, baselines, baselineInsights, unavailabilityInsights, observations };
}

function sanitizeParams(
  value: unknown,
): Readonly<Record<string, string | number | boolean | null>> {
  const out: Record<string, string | number | boolean | null> = {};
  for (const [key, entry] of Object.entries(record(value))) {
    if (
      entry === null ||
      typeof entry === 'string' ||
      typeof entry === 'number' ||
      typeof entry === 'boolean'
    ) {
      out[key] = entry;
    }
  }
  return out;
}

/* ------------------------------------------------------------------------- */
/* Build                                                                     */
/* ------------------------------------------------------------------------- */

export interface BuiltDigest {
  readonly stored: boolean;
  readonly rowCount: number;
  readonly source: 'ai' | 'deterministic';
  readonly fallbackReasonKey: string | null;
}

function narrativeRows(
  digest: WeeklyDigestResult,
  windowStart: string,
  windowEnd: string,
): DigestInsightRow[] {
  const base = {
    kind: 'digest' as const,
    windowStart,
    windowEnd,
    isNarrative: true,
    sampleSize: null,
  };
  const rows: DigestInsightRow[] = [
    {
      ...base,
      messageKey: DIGEST_NARRATIVE_KEYS.headline,
      messageArgs: { statement: digest.headline },
      evidenceIds: [],
      confidence: digest.uncertain ? 'low' : 'medium',
    },
  ];
  for (const observation of digest.observations) {
    rows.push({
      ...base,
      messageKey: DIGEST_NARRATIVE_KEYS.observation,
      messageArgs: {
        statement: observation.statement,
        confounder: observation.confounders[0] ?? null,
      },
      evidenceIds: [...observation.evidenceIds],
      confidence: observation.confidence,
    });
  }
  for (const statement of digest.notSupported) {
    rows.push({
      ...base,
      messageKey: DIGEST_NARRATIVE_KEYS.notSupported,
      messageArgs: { statement },
      evidenceIds: [],
      confidence: 'high',
    });
  }
  if (digest.suggestedNextAction !== null) {
    rows.push({
      ...base,
      messageKey: DIGEST_NARRATIVE_KEYS.nextAction,
      messageArgs: { statement: digest.suggestedNextAction },
      evidenceIds: [],
      confidence: 'low',
    });
  }
  return rows;
}

/**
 * Build and store one window. Runs inside the caller's workspace transaction,
 * so the delete of a replaced week and the insert of its rows are atomic.
 */
export async function buildDigest(
  deps: ServiceDeps,
  ctx: ActorContext,
  db: Db,
  input: {
    readonly windowStart: string;
    readonly windowEnd: string;
    readonly replaceExisting: boolean;
  },
): Promise<BuiltDigest> {
  const { windowStart, windowEnd } = input;
  const existing = await db.insight.findMany({
    where: {
      workspaceId: ctx.workspaceId,
      messageArgs: { path: [DIGEST_WINDOW_ARG], equals: windowStart },
    },
    select: { id: true, messageKey: true, messageArgs: true, aiModel: true },
  });
  const existingRows = existing.filter((row) => row.messageKey !== EMAIL_MARKER_KEY);
  if (existingRows.length > 0 && !input.replaceExisting) {
    const header = existingRows.find((row) => row.messageKey.startsWith(HEADER_PREFIX));
    const args = record(header?.messageArgs);
    return {
      stored: false,
      rowCount: existingRows.length,
      source: args._source === 'ai' ? 'ai' : 'deterministic',
      fallbackReasonKey:
        typeof args._fallbackReasonKey === 'string' ? args._fallbackReasonKey : null,
    };
  }

  const workspace = await db.workspace.findUnique({
    where: { id: ctx.workspaceId },
    select: { defaultTimeZone: true },
  });
  const timeZone = workspace?.defaultTimeZone ?? 'UTC';
  const from = startOfDay(windowStart, timeZone);
  const to = startOfDay(addDays(windowEnd, 1), timeZone);
  const gathered = await gather(db, ctx.workspaceId, from, to);
  const freshness = computeFreshness({
    observations: gathered.observations,
    now: deps.clock.now(),
  });
  const retrieval = buildDigestRetrieval({
    workspaceId: ctx.workspaceId,
    windowStart,
    windowEnd,
    receipts: gathered.receipts,
    metrics: gathered.metrics,
    baselines: gathered.baselines,
    freshness,
  });
  const floor = buildDigestFloor({
    retrieval,
    baselineInsights: gathered.baselineInsights,
    unavailabilityInsights: gathered.unavailabilityInsights,
  });

  let source: 'ai' | 'deterministic' = 'deterministic';
  let fallbackReason = 'ai_disabled';
  let rows: readonly DigestInsightRow[] = floor.rows;
  let aiModel: string | null = null;
  let aiPromptVersion: string | null = null;
  if (deps.ai.isAvailable() && gathered.receipts.length > 0) {
    try {
      await assertMonthlyAiBudget(deps, ctx, db);
      const result = await deps.ai.completeStructured(weeklyDigestResultSchema, {
        context: {
          workspaceId: ctx.workspaceId,
          projectId: null,
          locale: ctx.locale,
          contentLanguage: null,
          correlationId: ctx.correlationId,
        },
        promptId: 'weekly-digest',
        variables: retrieval.variables,
      });
      await recordAiUsage(deps, ctx, result.meta);
      const audited = result.meta.degraded
        ? null
        : postProcessDigest({ output: result.output, retrieval });
      if (audited === null) {
        fallbackReason = 'ai_call_failed';
      } else if (!audited.ok) {
        fallbackReason = 'audit_rejected';
        deps.logger.warn(
          { workspaceId: ctx.workspaceId, violations: audited.violations.length },
          'digest.audit_rejected',
        );
      } else {
        source = 'ai';
        rows = [...floor.rows, ...narrativeRows(audited.digest, windowStart, windowEnd)];
        aiModel = result.meta.model;
        aiPromptVersion = result.meta.promptVersion;
      }
    } catch {
      // Budget refusal or vendor failure. The floor is the whole digest.
      fallbackReason = 'ai_call_failed';
    }
  }
  const fallbackReasonKey = source === 'ai' ? null : (FALLBACK_REASON_KEYS[fallbackReason] ?? null);

  if (existingRows.length > 0) {
    await db.insight.deleteMany({ where: { id: { in: existingRows.map((row) => row.id) } } });
  }
  const header = {
    messageKey: floor.headlineKey,
    messageArgs: { ...floor.headlineArgs },
    evidenceIds: [] as string[],
    confidence: 'high',
    sampleSize: null,
    isNarrative: false,
  };
  const all = [header, ...rows];
  await db.insight.createMany({
    data: all.map((row, order) => ({
      workspaceId: ctx.workspaceId,
      messageKey: row.messageKey,
      messageArgs: toJson({
        ...row.messageArgs,
        [DIGEST_WINDOW_ARG]: windowStart,
        _windowEnd: windowEnd,
        _order: order,
        _narrative: row.isNarrative,
        ...(order === 0 ? { _source: source, _fallbackReasonKey: fallbackReasonKey } : {}),
      }),
      evidenceIds: [...row.evidenceIds],
      confidence: row.confidence,
      sampleSize: row.sampleSize,
      state: 'new' as const,
      aiModel: row.isNarrative ? aiModel : null,
      aiPromptVersion: row.isNarrative ? aiPromptVersion : null,
    })),
  });
  return { stored: true, rowCount: rows.length, source, fallbackReasonKey };
}

/* ------------------------------------------------------------------------- */
/* Read                                                                      */
/* ------------------------------------------------------------------------- */

function publicArgs(value: unknown): InsightArgs {
  const out: Record<string, string | number | boolean | null> = {};
  for (const [key, entry] of Object.entries(sanitizeParams(value))) {
    if (!key.startsWith('_')) out[key] = entry;
  }
  return out;
}

export async function readLatestDigest(db: Db, workspaceId: string): Promise<DigestView | null> {
  const header = await db.insight.findFirst({
    where: { workspaceId, contentItemId: null, messageKey: { startsWith: HEADER_PREFIX } },
    orderBy: { createdAt: 'desc' },
    select: { messageArgs: true },
  });
  const windowStart = record(header?.messageArgs)[DIGEST_WINDOW_ARG];
  if (typeof windowStart !== 'string') {
    return null;
  }
  return readDigest(db, workspaceId, windowStart);
}

export async function readDigest(
  db: Db,
  workspaceId: string,
  windowStart: string,
): Promise<DigestView | null> {
  const stored = await db.insight.findMany({
    where: { workspaceId, messageArgs: { path: [DIGEST_WINDOW_ARG], equals: windowStart } },
    select: {
      messageKey: true,
      messageArgs: true,
      evidenceIds: true,
      confidence: true,
      sampleSize: true,
      aiModel: true,
      aiPromptVersion: true,
      createdAt: true,
    },
  });
  const ordered = stored
    .filter((row) => row.messageKey !== EMAIL_MARKER_KEY)
    .map((row) => ({ row, args: record(row.messageArgs) }))
    .sort((a, b) => (num(a.args._order) ?? 0) - (num(b.args._order) ?? 0));
  const first = ordered[0];
  if (first === undefined || !first.row.messageKey.startsWith(HEADER_PREFIX)) {
    return null;
  }
  const rows: DigestRowView[] = ordered.slice(1).map(({ row, args }) => ({
    messageKey: row.messageKey,
    messageArgs: publicArgs(row.messageArgs),
    evidenceIds: [...row.evidenceIds],
    confidence: row.confidence,
    sampleSize: row.sampleSize,
    isNarrative: args._narrative === true,
  }));
  const narrative = ordered.find(({ args }) => args._narrative === true)?.row;
  return {
    windowStart,
    windowEnd:
      typeof first.args._windowEnd === 'string' ? first.args._windowEnd : addDays(windowStart, 6),
    source: first.args._source === 'ai' ? 'ai' : 'deterministic',
    fallbackReasonKey:
      typeof first.args._fallbackReasonKey === 'string' ? first.args._fallbackReasonKey : null,
    generatedAt: first.row.createdAt.toISOString(),
    aiModel: narrative?.aiModel ?? null,
    aiPromptVersion: narrative?.aiPromptVersion ?? null,
    headlineKey: first.row.messageKey,
    headlineArgs: publicArgs(first.row.messageArgs),
    rows,
  };
}

/* ------------------------------------------------------------------------- */
/* Email                                                                     */
/* ------------------------------------------------------------------------- */

/**
 * Mail the stored, non-narrative totals of one window. Model prose never goes
 * out by email. Idempotent per window through a marker row, so a retried
 * activity does not send twice.
 */
export async function sendDigestEmail(
  deps: ServiceDeps,
  ctx: ActorContext,
  db: Db,
  input: { readonly windowStart: string; readonly windowEnd: string },
): Promise<{ readonly sent: boolean; readonly skippedReasonKey: string | null }> {
  const workspace = await db.workspace.findUnique({
    where: { id: ctx.workspaceId },
    select: { name: true, weeklyDigestEmailEnabled: true, ownerUserId: true },
  });
  if (workspace === null || !workspace.weeklyDigestEmailEnabled) {
    return { sent: false, skippedReasonKey: 'insight.digest.email.skipped.off' };
  }
  const owner = await db.user.findUnique({
    where: { id: workspace.ownerUserId },
    select: { email: true, locale: true },
  });
  if (owner === null) {
    return { sent: false, skippedReasonKey: 'insight.digest.email.skipped.noRecipient' };
  }
  const digest = await readDigest(db, ctx.workspaceId, input.windowStart);
  if (digest === null) {
    return { sent: false, skippedReasonKey: 'insight.digest.email.skipped.noDigest' };
  }
  const marker = await db.insight.findFirst({
    where: {
      workspaceId: ctx.workspaceId,
      messageKey: EMAIL_MARKER_KEY,
      messageArgs: { path: [DIGEST_WINDOW_ARG], equals: input.windowStart },
    },
    select: { id: true },
  });
  if (marker !== null) {
    return { sent: false, skippedReasonKey: 'insight.digest.email.skipped.alreadySent' };
  }
  const measured = digest.rows.some((row) => row.messageKey === 'digest.metrics.noneYet')
    ? 'none'
    : 'some';
  const appUrl = deps.config.core.appUrl;
  await deps.mailer.send({
    to: [owner.email],
    subjectKey: 'email.digest.subject',
    bodyKey: 'insight.digest.email.body',
    params: {
      workspaceName: workspace.name,
      windowStart: digest.windowStart,
      windowEnd: digest.windowEnd,
      published: num(digest.headlineArgs.published) ?? 0,
      partial: num(digest.headlineArgs.partial) ?? 0,
      failed: num(digest.headlineArgs.failed) ?? 0,
      measured,
      digestUrl: appUrl === undefined ? '' : new URL('/home', appUrl).toString(),
    },
    locale: owner.locale,
    workspaceId: ctx.workspaceId,
  });
  await db.insight.create({
    data: {
      workspaceId: ctx.workspaceId,
      messageKey: EMAIL_MARKER_KEY,
      messageArgs: toJson({ [DIGEST_WINDOW_ARG]: input.windowStart }),
      confidence: 'high',
      state: 'new',
    },
    select: { id: true },
  });
  return { sent: true, skippedReasonKey: null };
}
