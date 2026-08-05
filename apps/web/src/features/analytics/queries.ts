'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { NormalizedMetricName } from '@relay/contracts';

import { api } from '@/lib/api';

import type {
  AnalyticsOverview,
  AnalyticsRange,
  ExperimentView,
  MetricSeriesView,
  PostComparisonRow,
} from './types';

/**
 * Reads for the analytics screens.
 *
 * Analytics is read only, so there is exactly one mutation here: creating an
 * experiment, which is a Relay side record and touches no provider. Nothing on
 * these screens is optimistically updated. An optimistic analytics number would
 * be an invented measurement, which is the one thing this product must never
 * show.
 *
 * `staleTime` is generous on purpose. Providers aggregate on their own schedule
 * and refetching every focus change would produce identical numbers while
 * spending provider quota that publishing needs.
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
  readonly brandId: string | null;
  readonly connectionIds: readonly string[];
  readonly range: AnalyticsRange;
  readonly rankMetric: NormalizedMetricName;
  readonly format: string | null;
}

/**
 * Boundary shim.
 *
 * `@/lib/api` returns the REST view models. They are generated from the same
 * `@relay/contracts` types these view models are derived from, but the two are
 * not the same declaration, so the cast is made here, once, rather than in
 * every component.
 *
 * TODO(web): depends on `@/lib/api` publishing typed analytics view models.
 */
function adapt<T>(value: unknown): T {
  return value as T;
}

export function useAnalyticsOverview(input: OverviewInput, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.overview(input),
    enabled,
    staleTime: FIVE_MINUTES,
    queryFn: async (): Promise<AnalyticsOverview> => {
      const result = await api.analytics.getOverview({
        ...(input.brandId === null ? {} : { brandId: input.brandId }),
        connectionIds: input.connectionIds,
        from: input.range.start,
        to: input.range.end,
        metric: input.rankMetric,
        ...(input.format === null ? {} : { contentKind: input.format }),
      });
      return adapt<AnalyticsOverview>(result);
    },
  });
}

export function usePostMetrics(contentItemId: string, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.post(contentItemId),
    enabled,
    staleTime: FIVE_MINUTES,
    queryFn: async (): Promise<PostComparisonRow> =>
      adapt<PostComparisonRow>(await api.analytics.getPostMetrics(contentItemId)),
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
    queryFn: async (): Promise<MetricSeriesView> =>
      adapt<MetricSeriesView>(
        await api.analytics.getMetricSeries(connectionId, {
          metric,
          from: range.start,
          to: range.end,
        }),
      ),
  });
}

export function useExperiments(workspaceScope: string, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.experiments(workspaceScope),
    enabled,
    staleTime: FIVE_MINUTES,
    queryFn: async (): Promise<readonly ExperimentView[]> => {
      const result = await api.analytics.listExperiments({});
      return adapt<{ readonly data: readonly ExperimentView[] }>(result).data;
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
 */
export function useCreateExperiment(workspaceScope: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateExperimentInput): Promise<ExperimentView> =>
      adapt<ExperimentView>(
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
    onSuccess: () => {
      void client.invalidateQueries({
        queryKey: analyticsKeys.experiments(workspaceScope),
      });
    },
  });
}
