'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  analyticsOverviewViewSchema,
  analyticsPageSchema,
  experimentViewSchema,
  metricObservationListSchema,
  metricSeriesViewSchema,
  normalizedMetricNameSchema,
  type AnalyticsOverviewViewShape,
  type ExperimentViewShape,
  type MetricDefinitionViewShape,
  type MetricObservationViewShape,
  type MetricReadingViewShape,
  type NormalizedMetricName,
} from '@relay/contracts';

import { api } from '@/lib/api';

import type {
  AccountAttentionRow,
  AccountFreshnessRow,
  AnalyticsOverview,
  AnalyticsRange,
  BaselineComparison,
  ConfounderCode,
  ExperimentStatus,
  ExperimentView,
  MetricDefinitionView,
  MetricReading,
  MetricSeriesView,
  PostComparisonRow,
  PostMetricsView,
} from './types';

/**
 * Reads for the analytics screens.
 *
 * Analytics is read only, so there is exactly one mutation here: creating an
 * experiment, which is a Post Array side record and touches no provider. Nothing on
 * these screens is optimistically updated. An optimistic analytics number would
 * be an invented measurement, which is the one thing this product must never
 * show.
 *
 * `staleTime` is generous on purpose. Providers aggregate on their own schedule
 * and refetching every focus change would produce identical numbers while
 * spending provider quota that publishing needs.
 *
 * ## The boundary
 *
 * This file used to hold `function adapt<T>(value: unknown) { return value as T }`
 * with a TODO admitting it was a shim. It was not a shim, it was an assertion
 * that two shapes matched when nobody had checked, and it was hiding two
 * crashes waiting for live data: the experiments screen mapped over a
 * `variants` array the API has never sent, and the post detail screen read
 * fields off a value the endpoint returns as a list of readings. AGENTS.md
 * says parse, do not cast, and an HTTP response read in a browser is an
 * external boundary even when this repository serves it.
 *
 * So every read below parses the response against a schema from
 * `@relay/contracts` and then maps the wire shape to the view model in
 * `./types` explicitly. Where the wire carries less than the screen wants, the
 * mapper produces `null` and the screen renders the word. Nothing here
 * substitutes a zero, an empty string or an epoch for a fact the server did
 * not state.
 */

const FIVE_MINUTES = 5 * 60 * 1000;

export const analyticsKeys = {
  all: ['analytics'] as const,
  overview: (input: OverviewInput) => ['analytics', 'overview', input] as const,
  post: (contentItemId: string) => ['analytics', 'post', contentItemId] as const,
  series: (connectionId: string, metric: NormalizedMetricName, range: AnalyticsRange) =>
    ['analytics', 'series', connectionId, metric, range] as const,
  experiments: (workspaceScope: string) => ['analytics', 'experiments', workspaceScope] as const,
  experiment: (experimentId: string) => ['analytics', 'experiment', experimentId] as const,
};

export interface OverviewInput {
  readonly projectId: string | null;
  readonly connectionIds: readonly string[];
  readonly range: AnalyticsRange;
  readonly rankMetric: NormalizedMetricName;
  readonly format: string | null;
}

/* -------------------------------------------------------------------------
   Wire to view model
   ------------------------------------------------------------------------- */

const CONFOUNDER_CODES: readonly ConfounderCode[] = [
  'time_of_day',
  'mixed_formats',
  'follower_change',
  'paid_distribution',
  'provider_definition_change',
];

/**
 * Keep only the confounders this build has copy for.
 *
 * A code the server knows about and this client does not would otherwise be
 * printed raw at a reader, or interpolated into a missing message key. Dropping
 * it loses a caveat, which is bad; showing `provider_definition_change_v2` at a
 * user is worse and is not recoverable by them.
 */
function toConfounders(codes: readonly string[]): readonly ConfounderCode[] {
  return codes.filter((code): code is ConfounderCode =>
    (CONFOUNDER_CODES as readonly string[]).includes(code),
  );
}

function toDefinition(definition: MetricDefinitionViewShape): MetricDefinitionView {
  return {
    normalizedName: definition.normalizedName,
    provider: definition.provider,
    providerField: definition.providerField,
    definition: definition.definition,
    ...(definition.definitionSourceUrl === undefined
      ? {}
      : { definitionSourceUrl: definition.definitionSourceUrl }),
    unit: definition.unit,
    denominator: definition.denominator,
    aggregation: definition.aggregation,
    historyWindowDays: definition.historyWindowDays,
    lastVerifiedAt: definition.lastVerifiedAt,
  };
}

function toReading(reading: MetricReadingViewShape): MetricReading {
  return {
    normalizedName: reading.normalizedName,
    provider: reading.provider,
    availability: reading.availability,
    // The schema allows a value beside any availability, because that is what
    // the wire allows. The view model's contract is stricter: a reading that
    // is not `available` carries no number at all, so a stale or restricted
    // value can never leak into a figure.
    value: reading.availability === 'available' ? reading.value : null,
    observedAt: reading.observedAt,
    freshnessSeconds: reading.freshnessSeconds,
    definition: toDefinition(reading.definition),
  };
}

/**
 * A post-scope observation, which carries the provider's field and wording but
 * not the catalog entry around them.
 *
 * `denominator`, `aggregation`, `historyWindowDays` and `lastVerifiedAt` are
 * null here because this endpoint does not report them. Filling them with
 * `none` and an epoch would state a denominator nobody chose and a
 * verification that never happened.
 */
function observationToReading(observation: MetricObservationViewShape): MetricReading {
  return {
    normalizedName: observation.normalizedName,
    provider: observation.provider,
    availability: observation.availability,
    value: observation.availability === 'available' ? observation.value : null,
    observedAt: observation.observedAt,
    freshnessSeconds: observation.freshnessSeconds,
    definition: {
      normalizedName: observation.normalizedName,
      provider: observation.provider,
      providerField: observation.providerField,
      definition: observation.providerDefinition,
      unit: observation.unit,
      denominator: null,
      aggregation: null,
      historyWindowDays: null,
      lastVerifiedAt: null,
    },
  };
}

function toOverview(wire: AnalyticsOverviewViewShape): AnalyticsOverview {
  const rows: readonly PostComparisonRow[] = wire.rows.map((row) => ({
    contentItemId: row.contentItemId,
    title: row.title,
    account: row.account,
    format: row.format,
    publishedAt: row.publishedAt,
    reading: toReading(row.reading),
    baseline:
      row.baseline === null
        ? null
        : ({
            metric: row.baseline.metric,
            median: row.baseline.median,
            sampleSize: row.baseline.sampleSize,
            deltaRatio: row.baseline.deltaRatio,
            direction: row.baseline.direction,
            smallSample: row.baseline.smallSample,
            comparablePosts: row.baseline.comparablePosts,
            excludedCount: row.baseline.excludedCount,
            confounders: toConfounders(row.baseline.confounders),
            format: row.baseline.format,
          } satisfies BaselineComparison),
    ...(row.receiptUrl === undefined ? {} : { receiptUrl: row.receiptUrl }),
  }));

  return {
    range: wire.range,
    rankMetric: wire.rankMetric,
    rows,
    freshness: wire.freshness as readonly AccountFreshnessRow[],
    attention: wire.attention as readonly AccountAttentionRow[],
    // The insight engine is not wired to this read. An empty list renders as
    // no observations, which is true; anything else here would be a sentence
    // about the user's numbers that nobody wrote.
    observations: [],
    accountsRequested: wire.accountsRequested,
    accountsWithData: wire.accountsWithData,
    accountsWithoutData: wire.accountsWithoutData as readonly AccountAttentionRow[],
  };
}

/**
 * The server's `state` string, narrowed.
 *
 * An unrecognised state falls back to `planned` rather than being printed. A
 * state this build has no copy for is a fact about the client being old, and
 * the safest reading of an experiment the client cannot classify is the one
 * that claims nothing about its results.
 */
function toStatus(state: string): ExperimentStatus {
  switch (state) {
    case 'collecting':
    case 'running':
      return 'collecting';
    case 'complete':
    case 'completed':
      return 'complete';
    case 'inconclusive':
      return 'inconclusive';
    default:
      return 'planned';
  }
}

function toExperiment(wire: ExperimentViewShape): ExperimentView {
  const metric = normalizedMetricNameSchema.safeParse(wire.successMetric);
  return {
    id: wire.id,
    name: wire.name,
    hypothesis: wire.hypothesis,
    // A metric name this build has no label for would render as a raw message
    // key. Impressions is the ranking default everywhere else in the feature.
    successMetric: metric.success ? metric.data : 'impressions',
    status: toStatus(wire.state),
    windowStart: wire.windowStart,
    windowEnd: wire.windowEnd,
    conclusion: wire.conclusion,
    caveats: wire.caveats,
  };
}

/* -------------------------------------------------------------------------
   Queries
   ------------------------------------------------------------------------- */

export function useAnalyticsOverview(input: OverviewInput, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.overview(input),
    enabled,
    staleTime: FIVE_MINUTES,
    queryFn: async (): Promise<AnalyticsOverview> => {
      const result = await api.analytics.getOverview({
        ...(input.projectId === null ? {} : { projectId: input.projectId }),
        connectionIds: input.connectionIds,
        from: input.range.start,
        to: input.range.end,
        metric: input.rankMetric,
        ...(input.format === null ? {} : { contentKind: input.format }),
      });
      return toOverview(analyticsOverviewViewSchema.parse(result));
    },
  });
}

/**
 * Everything the post detail screen shows about one post.
 *
 * Two reads, because no endpoint answers the whole question.
 * `GET /v1/analytics/posts/{id}` returns readings and nothing that identifies
 * the post. The content read supplies the title and the format. The content
 * read is allowed to fail on its own: readings without a title are still worth
 * showing, and the screen renders the missing identity as unavailable rather
 * than as an empty heading.
 */
export function usePostMetrics(contentItemId: string, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.post(contentItemId),
    enabled,
    staleTime: FIVE_MINUTES,
    queryFn: async (): Promise<PostMetricsView> => {
      const [observations, item] = await Promise.all([
        api.analytics.getPostMetrics(contentItemId),
        api.content.get(contentItemId).catch(() => null),
      ]);

      const parsed = metricObservationListSchema.safeParse(observations);
      const readings = (parsed.success ? parsed.data.data : []).map(observationToReading);

      return {
        contentItemId,
        title: item?.title ?? null,
        format: item?.contentKind ?? null,
        publishedAt: item?.scheduledAt ?? null,
        readings,
      };
    },
  });
}

export function useMetricSeries(
  connectionId: string,
  metric: NormalizedMetricName,
  range: AnalyticsRange,
  enabled = true,
) {
  return useQuery({
    queryKey: analyticsKeys.series(connectionId, metric, range),
    enabled,
    staleTime: FIVE_MINUTES,
    queryFn: async (): Promise<MetricSeriesView> => {
      const wire = metricSeriesViewSchema.parse(
        await api.analytics.getMetricSeries(connectionId, {
          metric,
          from: range.start,
          to: range.end,
        }),
      );
      return {
        id: wire.id,
        normalizedName: wire.normalizedName,
        unit: wire.unit,
        // The wire label is the provider's field name. The caller owns the
        // translated legend label and overrides this.
        label: wire.label,
        points: wire.points,
      };
    },
  });
}

const experimentPageSchema = analyticsPageSchema(experimentViewSchema);

export function useExperiments(workspaceScope: string, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.experiments(workspaceScope),
    enabled,
    staleTime: FIVE_MINUTES,
    queryFn: async (): Promise<readonly ExperimentView[]> => {
      const page = experimentPageSchema.parse(await api.analytics.listExperiments({}));
      return page.data.map(toExperiment);
    },
  });
}

export interface CreateExperimentInput {
  readonly name: string;
  readonly hypothesis: string;
  readonly successMetric: NormalizedMetricName;
  readonly connectionIds: readonly string[];
  readonly variants: readonly { readonly label: string; readonly description: string }[];
  readonly measurementWindowDays: number;
  readonly minimumPostsPerVariant: number;
  readonly idempotencyKey: string;
}

/**
 * Create an experiment.
 *
 * No optimistic update: the server assigns the identifier the composer later
 * tags posts with, and showing a provisional experiment that a user could tag
 * against would let a post reference something that does not exist.
 *
 * The variants travel on the way in and do not come back on the way out. That
 * asymmetry is the API's, not a bug here, and `ExperimentView` in `./types`
 * says so.
 */
export function useCreateExperiment(workspaceScope: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateExperimentInput): Promise<ExperimentView> =>
      toExperiment(
        experimentViewSchema.parse(
          await api.analytics.createExperiment(
            {
              name: input.name,
              hypothesis: input.hypothesis,
              metricName: input.successMetric,
              connectionIds: input.connectionIds,
              variants: [...input.variants],
              measurementWindowDays: input.measurementWindowDays,
              minimumPostsPerVariant: input.minimumPostsPerVariant,
            },
            input.idempotencyKey,
          ),
        ),
      ),
    onSuccess: () => {
      void client.invalidateQueries({
        queryKey: analyticsKeys.experiments(workspaceScope),
      });
    },
  });
}
