import {
  DEFAULT_STALE_AFTER_SECONDS,
  compareToTrailingMedian,
  type ObservedPost,
} from '@relay/analytics-domain';
import type {
  ContentKind,
  MetricAggregation,
  MetricAvailability,
  MetricDenominator,
  MetricUnit,
  NormalizedMetricName,
  ProviderId,
} from '@relay/contracts';

import type {
  AccountAttentionRowView,
  AccountFreshnessRowView,
  AnalyticsAccountRef,
  AnalyticsOverviewView,
  AnalyticsRangeView,
  BaselineComparisonView,
  MetricDefinitionView,
  MetricReadingView,
  MetricSeriesView,
  PostComparisonRowView,
  SeriesPointView,
} from '../views';
import { decimalToNumber, toProviderId } from '../internal/mappers';
import type { Db } from '../internal/runtime';

/**
 * The analytics overview read.
 *
 * Everything here is measured or absent. A metric the provider did not return
 * is `unavailable_*` with a null value, an account that has never synced is
 * `never`, and a comparison with too little history refuses rather than
 * reporting a confident number over three posts. Nothing is filled in with a
 * zero and nothing is estimated.
 *
 * The baseline is not computed here: it is `compareToTrailingMedian` from
 * `@relay/analytics-domain`, which owns what "comparable" means (same platform,
 * same content kind), the noise band, the small-sample threshold and the
 * confounders. This module's job is to turn rows out of Postgres into that
 * function's input and its result back into a view.
 */

/** How far back to look for the posts a baseline is drawn from. */
const HISTORY_DAYS = 90;
/** Ceiling on rows read per query. Analytics is a read, not an export. */
const ROW_LIMIT = 500;
const DAY_SECONDS = 86_400;

export interface OverviewInput {
  readonly connectionIds: readonly string[];
  readonly projectId?: string | undefined;
  readonly range: { readonly from: string; readonly to: string };
  readonly metric: NormalizedMetricName;
  readonly contentKind?: ContentKind | undefined;
}

/* ---------------------------------------------------------------- mapping -- */

const AVAILABILITY_MAP: Readonly<Record<string, MetricAvailability>> = {
  available: 'available',
  unavailable: 'unavailable_provider',
  unsupported: 'unavailable_provider',
  requires_permission: 'unavailable_permission',
  restricted_by_provider: 'unavailable_provider',
};

const AGGREGATION_MAP: Readonly<Record<string, MetricAggregation>> = {
  latest_snapshot: 'last',
  sum: 'sum',
  average: 'average',
  max: 'none',
  not_aggregatable: 'none',
};

interface DefinitionRow {
  readonly providerFieldName: string;
  readonly providerDefinition: string;
  readonly normalizedName: string;
  readonly unit: string;
  readonly aggregationRule: string;
  readonly denominatorNote: string | null;
  readonly documentationUrl: string | null;
  readonly lastVerifiedAt: Date | null;
}

interface ObservationRow {
  readonly receiptId: string | null;
  readonly observedAt: Date;
  readonly rawValue: { toString(): string } | null;
  readonly normalizedValue: { toString(): string } | null;
  readonly availability: string;
  readonly provider: string;
  readonly metricDefinition: DefinitionRow;
}

const OBSERVATION_SELECT = {
  receiptId: true,
  observedAt: true,
  rawValue: true,
  normalizedValue: true,
  availability: true,
  provider: true,
  metricDefinition: {
    select: {
      providerFieldName: true,
      providerDefinition: true,
      normalizedName: true,
      unit: true,
      aggregationRule: true,
      denominatorNote: true,
      documentationUrl: true,
      lastVerifiedAt: true,
    },
  },
} as const;

/**
 * The denominator a rate is measured against.
 *
 * `denominator_note` is free text a human wrote against provider docs, so it is
 * matched against the closed set rather than parsed. Anything that does not
 * match is `none`, which is the honest answer: we do not know, and guessing
 * would attach a denominator the provider never stated.
 */
function toDenominator(note: string | null): MetricDenominator {
  const candidates: readonly MetricDenominator[] = [
    'impressions',
    'reach',
    'views',
    'followers',
    'sessions',
  ];
  const lowered = (note ?? '').toLowerCase();
  return candidates.find((entry) => lowered.includes(entry)) ?? 'none';
}

function toDefinitionView(row: DefinitionRow, provider: ProviderId): MetricDefinitionView {
  return {
    normalizedName: row.normalizedName as NormalizedMetricName,
    provider,
    providerField: row.providerFieldName,
    definition: row.providerDefinition,
    ...(row.documentationUrl === null ? {} : { definitionSourceUrl: row.documentationUrl }),
    unit: row.unit as MetricUnit,
    denominator: toDenominator(row.denominatorNote),
    aggregation: AGGREGATION_MAP[row.aggregationRule] ?? 'none',
    historyWindowDays: null,
    // Null, not an epoch. A substituted date renders as "1 January 1970" and
    // claims a verification nobody performed, which rule 8 forbids. The view
    // says "not verified" instead.
    lastVerifiedAt: row.lastVerifiedAt?.toISOString() ?? null,
  };
}

function toReading(row: ObservationRow, now: Date): MetricReadingView {
  const provider = toProviderId(row.provider);
  const availability = AVAILABILITY_MAP[row.availability] ?? 'unavailable_provider';
  const value = decimalToNumber(row.normalizedValue ?? row.rawValue);
  return {
    normalizedName: row.metricDefinition.normalizedName as NormalizedMetricName,
    provider,
    availability,
    // A missing reading is null with a reason. It is never rendered as zero.
    value: availability === 'available' ? value : null,
    observedAt: row.observedAt.toISOString(),
    freshnessSeconds: Math.max(0, Math.round((now.getTime() - row.observedAt.getTime()) / 1000)),
    definition: toDefinitionView(row.metricDefinition, provider),
  };
}

/* ------------------------------------------------------------ content kind -- */

const LINK_PATTERN = /https?:\/\//i;

/**
 * The content kind of a published post, derived from the media it carried.
 *
 * This is the same derivation the composer uses and it is mechanical: it reads
 * what was attached rather than classifying anything. It only ever matters for
 * deciding which posts are comparable with which.
 */
function deriveKind(mediaKinds: readonly string[]): ContentKind {
  if (mediaKinds.length === 0) {
    return 'text';
  }
  if (mediaKinds.includes('video')) {
    return 'video';
  }
  if (mediaKinds.includes('document')) {
    return 'document';
  }
  return mediaKinds.length > 1 ? 'carousel' : 'image';
}

/* ------------------------------------------------------------------ types -- */

interface ReceiptRow {
  readonly id: string;
  readonly connectionId: string;
  readonly provider: string;
  readonly publishedAt: Date;
  readonly permalink: string | null;
  readonly contentVersionId: string;
  readonly contentVersion: {
    readonly contentItemId: string;
    readonly body: string;
    readonly contentItem: { readonly title: string | null };
  };
}

interface PreparedPost {
  readonly receipt: ReceiptRow;
  readonly kind: ContentKind;
  readonly hasMedia: boolean;
  readonly hasLink: boolean;
  readonly reading: MetricReadingView | null;
}

function accountRef(connection: {
  id: string;
  provider: string;
  handle: string | null;
  displayName: string;
}): AnalyticsAccountRef {
  return {
    connectionId: connection.id,
    provider: toProviderId(connection.provider),
    handle: connection.handle ?? '',
    displayName: connection.displayName,
  };
}

function toObservedPost(post: PreparedPost, metric: NormalizedMetricName): ObservedPost | null {
  const reading = post.reading;
  if (reading === null) {
    return null;
  }
  return {
    post: {
      receiptId: post.receipt.id,
      provider: toProviderId(post.receipt.provider),
      contentKind: post.kind,
      connectionId: post.receipt.connectionId,
      publishedAt: post.receipt.publishedAt.toISOString(),
      hasMedia: post.hasMedia,
      hasLink: post.hasLink,
    },
    observation: {
      normalizedName: metric,
      provider: toProviderId(post.receipt.provider),
      providerField: reading.definition.providerField,
      scope: 'post',
      value: reading.value,
      unit: reading.definition.unit,
      denominator: reading.definition.denominator,
      availability: reading.availability,
      observedAt: reading.observedAt,
      freshnessSeconds: reading.freshnessSeconds,
      rawProviderPayloadHash: '',
    },
  };
}

function titleOf(post: PreparedPost): string {
  return post.receipt.contentVersion.contentItem.title ?? '';
}

function toBaseline(
  post: PreparedPost,
  history: readonly PreparedPost[],
  metric: NormalizedMetricName,
): BaselineComparisonView | null {
  const subject = toObservedPost(post, metric);
  if (subject === null) {
    return null;
  }
  const byReceiptId = new Map(history.map((entry) => [entry.receipt.id, entry]));
  const observedHistory = history
    .map((entry) => toObservedPost(entry, metric))
    .filter((entry): entry is ObservedPost => entry !== null);

  const result = compareToTrailingMedian({ metric, subject, history: observedHistory });
  if (result.outcome !== 'compared' || result.medianValue === null) {
    return null;
  }

  return {
    metric,
    median: result.medianValue,
    sampleSize: result.sampleSize,
    deltaRatio: result.effectSize ?? 0,
    direction:
      result.direction === 'above' ? 'above' : result.direction === 'below' ? 'below' : 'level',
    smallSample: result.smallSample,
    excludedCount: result.excludedCount,
    confounders: result.confounders.map((entry) => entry.code),
    format: post.kind,
    comparablePosts: result.comparedReceiptIds.flatMap((receiptId) => {
      const entry = byReceiptId.get(receiptId);
      const value = entry?.reading?.value;
      if (entry === undefined || value === null || value === undefined) {
        return [];
      }
      return [
        {
          contentItemId: entry.receipt.contentVersion.contentItemId,
          title: titleOf(entry),
          publishedAt: entry.receipt.publishedAt.toISOString(),
          value,
        },
      ];
    }),
  };
}

/* -------------------------------------------------------------- freshness -- */

interface SyncRunRow {
  readonly connectionId: string;
  readonly state: string;
  readonly startedAt: Date;
  readonly endedAt: Date | null;
  readonly errorCode: string | null;
}

function freshnessFor(
  account: AnalyticsAccountRef,
  runs: readonly SyncRunRow[],
  now: Date,
): AccountFreshnessRowView {
  const running = runs.find((run) => run.state === 'pending' || run.state === 'running');
  const lastSuccess = runs.find((run) => run.state === 'succeeded');
  const lastSuccessAt = (lastSuccess?.endedAt ?? lastSuccess?.startedAt ?? null)?.toISOString();

  if (running !== undefined) {
    return {
      account,
      state: 'syncing',
      lastSuccessAt: lastSuccessAt ?? null,
      nextAttemptAt: null,
      providerDelaySeconds: null,
    };
  }
  if (lastSuccessAt === undefined) {
    // Never is not stale. It means nothing has ever been read for this account,
    // and the screen says exactly that rather than showing an old number.
    return {
      account,
      state: 'never',
      lastSuccessAt: null,
      nextAttemptAt: null,
      providerDelaySeconds: null,
    };
  }

  const ageSeconds = Math.max(0, Math.round((now.getTime() - Date.parse(lastSuccessAt)) / 1000));
  const state =
    ageSeconds <= DEFAULT_STALE_AFTER_SECONDS
      ? 'fresh'
      : ageSeconds <= DEFAULT_STALE_AFTER_SECONDS * 2
        ? 'aging'
        : 'stale';
  return {
    account,
    state,
    lastSuccessAt,
    nextAttemptAt: null,
    providerDelaySeconds: ageSeconds,
  };
}

const ATTENTION_BY_STATUS: Readonly<Record<string, AccountAttentionRowView['reason']>> = {
  action_required: 'permission_missing',
  expired: 'access_expired',
  revoked: 'access_expired',
  disconnected: 'access_expired',
};

function attentionFor(
  account: AnalyticsAccountRef,
  status: string,
  freshness: AccountFreshnessRowView,
  runs: readonly SyncRunRow[],
  rowCount: number,
): AccountAttentionRowView | null {
  let consecutiveFailures = 0;
  for (const run of runs) {
    if (run.state !== 'failed') {
      break;
    }
    consecutiveFailures += 1;
  }
  const failureCode = runs[0]?.state === 'failed' ? (runs[0]?.errorCode ?? null) : null;
  const base = { account, consecutiveFailures, failureCode };

  const credentialReason = ATTENTION_BY_STATUS[status];
  if (credentialReason !== undefined) {
    return { ...base, reason: credentialReason, since: null };
  }
  if (consecutiveFailures > 0) {
    return {
      ...base,
      reason: 'sync_failing',
      since: runs[0]?.startedAt.toISOString() ?? null,
    };
  }
  if (freshness.state === 'stale' || freshness.state === 'never') {
    return { ...base, reason: 'stale', since: freshness.lastSuccessAt };
  }
  if (rowCount === 0) {
    return { ...base, reason: 'no_posts', since: null };
  }
  return null;
}

/* ------------------------------------------------------------------ reads -- */

function presetFor(from: string, to: string): AnalyticsRangeView['preset'] {
  const days = Math.round((Date.parse(to) - Date.parse(from)) / (DAY_SECONDS * 1000));
  return days === 7 ? '7d' : days === 30 ? '30d' : days === 90 ? '90d' : 'custom';
}

export async function readOverview(
  db: Db,
  now: Date,
  input: OverviewInput,
): Promise<AnalyticsOverviewView> {
  const from = new Date(input.range.from);
  const to = new Date(input.range.to);
  const historyStart = new Date(from.getTime() - HISTORY_DAYS * DAY_SECONDS * 1000);

  const connections = await db.socialConnection.findMany({
    where: {
      ...(input.connectionIds.length === 0 ? {} : { id: { in: [...input.connectionIds] } }),
      ...(input.projectId === undefined ? {} : { projectId: input.projectId }),
      disconnectedAt: null,
    },
    select: { id: true, provider: true, handle: true, displayName: true, status: true },
  });

  const range: AnalyticsRangeView = {
    start: from.toISOString(),
    end: to.toISOString(),
    preset: presetFor(input.range.from, input.range.to),
  };

  if (connections.length === 0) {
    return {
      range,
      rankMetric: input.metric,
      rows: [],
      freshness: [],
      attention: [],
      observations: [],
      accountsRequested: 0,
      accountsWithData: 0,
      accountsWithoutData: [],
    };
  }

  const connectionIds = connections.map((connection) => connection.id);

  const receipts: readonly ReceiptRow[] = await db.publicationReceipt.findMany({
    where: {
      connectionId: { in: connectionIds },
      publishedAt: { gte: historyStart, lte: to },
      deletedExternallyAt: null,
    },
    orderBy: { publishedAt: 'desc' },
    take: ROW_LIMIT,
    select: {
      id: true,
      connectionId: true,
      provider: true,
      publishedAt: true,
      permalink: true,
      contentVersionId: true,
      contentVersion: {
        select: {
          contentItemId: true,
          body: true,
          contentItem: { select: { title: true } },
        },
      },
    },
  });

  const variants = await db.postVariant.findMany({
    where: {
      contentVersionId: { in: receipts.map((receipt) => receipt.contentVersionId) },
      connectionId: { in: connectionIds },
    },
    select: { contentVersionId: true, connectionId: true, mediaAssetIds: true, body: true },
  });
  const variantByKey = new Map(
    variants.map((variant) => [`${variant.contentVersionId}:${variant.connectionId}`, variant]),
  );

  const mediaIds = [...new Set(variants.flatMap((variant) => variant.mediaAssetIds))];
  const mediaKindById = new Map<string, string>(
    mediaIds.length === 0
      ? []
      : (
          await db.mediaAsset.findMany({
            where: { id: { in: mediaIds } },
            select: { id: true, kind: true },
          })
        ).map((asset) => [asset.id, asset.kind]),
  );

  const observations: readonly ObservationRow[] = await db.metricObservation.findMany({
    where: {
      receiptId: { in: receipts.map((receipt) => receipt.id) },
      metricDefinition: { normalizedName: input.metric },
    },
    orderBy: { observedAt: 'desc' },
    take: ROW_LIMIT * 2,
    select: OBSERVATION_SELECT,
  });

  // Newest wins: the list is already ordered newest first.
  const readingByReceipt = new Map<string, MetricReadingView>();
  for (const observation of observations) {
    if (observation.receiptId === null || readingByReceipt.has(observation.receiptId)) {
      continue;
    }
    readingByReceipt.set(observation.receiptId, toReading(observation, now));
  }

  const prepared: readonly PreparedPost[] = receipts.map((receipt) => {
    const variant = variantByKey.get(`${receipt.contentVersionId}:${receipt.connectionId}`);
    const kinds = (variant?.mediaAssetIds ?? []).flatMap((id) => {
      const kind = mediaKindById.get(id);
      return kind === undefined ? [] : [kind];
    });
    return {
      receipt,
      kind: deriveKind(kinds),
      hasMedia: (variant?.mediaAssetIds ?? []).length > 0,
      hasLink: LINK_PATTERN.test(variant?.body ?? receipt.contentVersion.body),
      reading: readingByReceipt.get(receipt.id) ?? null,
    };
  });

  const accountById = new Map(
    connections.map((connection) => [connection.id, accountRef(connection)]),
  );

  const inWindow = prepared.filter(
    (post) =>
      post.receipt.publishedAt >= from &&
      post.receipt.publishedAt <= to &&
      (input.contentKind === undefined || post.kind === input.contentKind),
  );

  const rows: readonly PostComparisonRowView[] = inWindow.flatMap((post) => {
    const account = accountById.get(post.receipt.connectionId);
    const reading = post.reading;
    if (account === undefined || reading === null) {
      // Nothing was ever observed for this post, so there is no cell to render.
      // A row with a zero in it would be a measurement nobody made. The account
      // shows up in `accountsWithoutData` instead, which is the honest headline.
      // A post that *was* observed but came back `unavailable_*` does get a row:
      // "we asked and the provider would not say" is worth showing.
      return [];
    }
    const history = prepared.filter(
      (entry) =>
        entry.receipt.connectionId === post.receipt.connectionId &&
        entry.receipt.publishedAt < post.receipt.publishedAt,
    );
    return [
      {
        contentItemId: post.receipt.contentVersion.contentItemId,
        title: titleOf(post),
        account,
        format: post.kind,
        publishedAt: post.receipt.publishedAt.toISOString(),
        reading,
        baseline: toBaseline(post, history, input.metric),
        ...(post.receipt.permalink === null ? {} : { receiptUrl: post.receipt.permalink }),
      },
    ];
  });

  const runs: readonly SyncRunRow[] = await db.analyticsSyncRun.findMany({
    where: { connectionId: { in: connectionIds } },
    orderBy: { startedAt: 'desc' },
    take: ROW_LIMIT,
    select: {
      connectionId: true,
      state: true,
      startedAt: true,
      endedAt: true,
      errorCode: true,
    },
  });

  const freshness: AccountFreshnessRowView[] = [];
  const attention: AccountAttentionRowView[] = [];
  const accountsWithoutData: AccountAttentionRowView[] = [];
  let accountsWithData = 0;

  for (const connection of connections) {
    const account = accountRef(connection);
    const ownRuns = runs.filter((run) => run.connectionId === connection.id);
    const own = freshnessFor(account, ownRuns, now);
    freshness.push(own);

    const ownRows = rows.filter((row) => row.account.connectionId === connection.id);
    // "With data" means it answered with a number. A row whose reading is
    // `unavailable_*` still appears in the table, saying so, but it does not
    // count towards "four of six accounts answered".
    const measuredCount = ownRows.filter((row) => row.reading.value !== null).length;
    const rowCount = measuredCount;
    if (measuredCount > 0) {
      accountsWithData += 1;
    }

    const needsAttention = attentionFor(account, connection.status, own, ownRuns, rowCount);
    if (needsAttention !== null) {
      attention.push(needsAttention);
      if (rowCount === 0) {
        accountsWithoutData.push(needsAttention);
      }
    }
  }

  return {
    range,
    rankMetric: input.metric,
    rows,
    freshness,
    attention,
    observations: [],
    accountsRequested: connections.length,
    accountsWithData,
    accountsWithoutData,
  };
}

/* ----------------------------------------------------------------- series -- */

export interface SeriesInput {
  readonly connectionId: string;
  readonly metric: NormalizedMetricName;
  readonly range: { readonly from: string; readonly to: string };
}

/**
 * One metric for one account, as daily buckets.
 *
 * A bucket with no observation is `null`, never `0`. That distinction is the
 * whole point of the chart: a day nobody measured and a day nothing happened
 * are different facts and drawing them the same way invents a measurement.
 */
export async function readSeries(db: Db, now: Date, input: SeriesInput): Promise<MetricSeriesView> {
  const from = new Date(input.range.from);
  const to = new Date(input.range.to);

  const observations: readonly ObservationRow[] = await db.metricObservation.findMany({
    where: {
      connectionId: input.connectionId,
      observedAt: { gte: from, lte: to },
      metricDefinition: { normalizedName: input.metric },
    },
    orderBy: { observedAt: 'asc' },
    take: ROW_LIMIT * 2,
    select: OBSERVATION_SELECT,
  });

  const valueByDay = new Map<string, number>();
  let unit: MetricUnit = 'count';
  let label: string = input.metric;
  for (const observation of observations) {
    const reading = toReading(observation, now);
    unit = reading.definition.unit;
    label = reading.definition.providerField;
    if (reading.value === null) {
      continue;
    }
    // Latest observation of a day wins; the list is ascending.
    valueByDay.set(observation.observedAt.toISOString().slice(0, 10), reading.value);
  }

  const points: SeriesPointView[] = [];
  const startOfDay = Date.parse(`${from.toISOString().slice(0, 10)}T00:00:00.000Z`);
  const endOfDay = Date.parse(`${to.toISOString().slice(0, 10)}T00:00:00.000Z`);
  for (let day = startOfDay; day <= endOfDay; day += DAY_SECONDS * 1000) {
    const bucketStart = new Date(day);
    const key = bucketStart.toISOString().slice(0, 10);
    points.push({
      bucketStart: bucketStart.toISOString(),
      bucketSeconds: DAY_SECONDS,
      value: valueByDay.get(key) ?? null,
    });
  }

  return {
    id: `${input.connectionId}:${input.metric}`,
    normalizedName: input.metric,
    unit,
    label,
    points,
  };
}
