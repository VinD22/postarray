/** Analytics, experiments, tracked links and the growth advisor. */

import type {
  BusinessProfile,
  GrowthExportFormat,
  GrowthPlan,
  OpportunityRecord,
  ToolRecord,
} from '@relay/contracts';

import { call } from '../call';
import { demoGrowthPlan, page } from '../fixtures';
import type { GrowthPlanSummaryView, MetricView, Paginated, ProviderId } from '../types';

export type MetricWindow = {
  readonly from: string;
  readonly to: string;
};

export interface ExperimentView {
  readonly id: string;
  readonly name: string;
  readonly state: 'running' | 'completed' | 'stopped';
  readonly startedAt: string;
  readonly completedAt: string | null;
  readonly metricName: string;
  readonly sampleSize: number;
  readonly summaryKey: string;
}

/**
 * The workspace-wide analytics read behind the overview screen: several
 * accounts, one normalized ranking metric, one window.
 */
export interface AnalyticsOverviewQuery {
  readonly brandId?: string;
  readonly connectionIds: readonly string[];
  readonly from: string;
  readonly to: string;
  /** The normalized metric the rows are ranked by. */
  readonly metric: string;
  /** Restricts the rows to one content kind when the screen filters by format. */
  readonly contentKind?: string;
}

export type MetricSeriesQuery = MetricWindow & {
  readonly metric: string;
};

export const analyticsApi = {
  /**
   * Everything the overview screen renders: the ranked rows, the per account
   * freshness and the accounts that returned no data. Assembled by the API so
   * the browser never fans out one request per connection.
   *
   * The payload is returned unknown until `@relay/application` publishes its
   * analytics query DTOs: the shape belongs to the analytics feature, which
   * this layer must not import, so the caller narrows it once at its boundary.
   */
  getOverview: (query: AnalyticsOverviewQuery): Promise<unknown> =>
    call(
      '/analytics/overview',
      {
        query: {
          ...(query.brandId === undefined ? {} : { brandId: query.brandId }),
          // Repeated ids travel as one comma separated parameter.
          connectionIds: query.connectionIds.join(','),
          from: query.from,
          to: query.to,
          metric: query.metric,
          ...(query.contentKind === undefined ? {} : { contentKind: query.contentKind }),
        },
      },
      () => null,
    ),

  /** One metric for one account, as points over the window rather than totals. */
  getMetricSeries: (connectionId: string, query: MetricSeriesQuery): Promise<unknown> =>
    call(`/analytics/accounts/${connectionId}/series`, { query }, () => null),

  getPostMetrics: (
    contentItemId: string,
    query: { connectionId?: string } = {},
  ): Promise<readonly MetricView[]> =>
    call(`/analytics/posts/${contentItemId}`, { query }, () => []),

  getAccountMetrics: (connectionId: string, query: MetricWindow): Promise<readonly MetricView[]> =>
    call(`/analytics/accounts/${connectionId}`, { query }, () => []),

  /**
   * Compare a post against the user's own recent baseline. There is no
   * cross-platform leaderboard here: the caller names one normalized metric.
   */
  compare: (query: {
    contentItemId: string;
    metricName: string;
    baselineSize: number;
  }): Promise<{
    value: number | null;
    baselineMedian: number | null;
    deltaPercent: number | null;
    sampleSize: number;
    comparabilityNoteKey: string | null;
  } | null> => call('/analytics/compare', { query }, () => null),

  listExperiments: (
    query: { cursor?: string; limit?: number } = {},
  ): Promise<Paginated<ExperimentView>> =>
    call('/analytics/experiments', { query }, () => page<ExperimentView>([])),

  createExperiment: (
    input: {
      name: string;
      metricName: string;
      hypothesis: string;
      /** The accounts the experiment draws its posts from. */
      connectionIds?: readonly string[];
      variants?: readonly { label: string; description: string }[];
      measurementWindowDays?: number;
      minimumPostsPerVariant?: number;
    },
    idempotencyKey: string,
  ): Promise<ExperimentView | null> =>
    call('/analytics/experiments', { method: 'POST', body: input, idempotencyKey }, () => null),
};

export interface ShortLinkView {
  readonly id: string;
  readonly shortUrl: string;
  readonly destinationUrl: string;
  readonly domain: string;
  readonly campaign: string | null;
  readonly createdAt: string;
}

export interface ShortLinkStats {
  readonly totalClicks: number;
  readonly deduplicatedClicks: number;
  readonly botFilteredClicks: number;
  readonly lastEventAt: string | null;
}

export const shortLinksApi = {
  create: (
    input: {
      destinationUrl: string;
      /** A verified branded domain. Absent uses the default isolated domain. */
      domainId?: string;
      campaignId?: string;
      /** A vanity path. Absent lets the service mint one. */
      slug?: string;
      utm?: Readonly<Record<string, string>>;
      /** After this instant the link stops redirecting. */
      expiresAt?: string;
    },
    idempotencyKey: string,
  ): Promise<ShortLinkView | null> =>
    call('/links', { method: 'POST', body: input, idempotencyKey }, () => null),

  getStats: (linkId: string, query: MetricWindow): Promise<ShortLinkStats | null> =>
    call(`/links/${linkId}/stats`, { query }, () => null),

  list: (query: { cursor?: string; limit?: number } = {}): Promise<Paginated<ShortLinkView>> =>
    call('/links', { query }, () => page<ShortLinkView>([])),
};

export const growthApi = {
  upsertBusinessProfile: (input: Partial<BusinessProfile>): Promise<BusinessProfile | null> =>
    call('/growth/profile', { method: 'PATCH', body: input }, () => null),

  confirmBusinessProfile: (
    input: { confirmedFactIds: readonly string[] },
    idempotencyKey: string,
  ): Promise<BusinessProfile | null> =>
    call('/growth/profile/confirm', { method: 'POST', body: input, idempotencyKey }, () => null),

  generatePlan: (idempotencyKey: string): Promise<GrowthPlan | null> =>
    call('/growth/plans', { method: 'POST', idempotencyKey }, () => null),

  getPlan: (planId?: string): Promise<GrowthPlan | null> =>
    call(
      planId === undefined ? '/growth/plans/current' : `/growth/plans/${planId}`,
      {},
      () => null,
    ),

  /** Home only needs the summary, not the whole plan document. */
  getPlanSummary: (): Promise<GrowthPlanSummaryView> =>
    call('/growth/plans/current/summary', {}, () => demoGrowthPlan),

  exportPlan: (
    planId: string,
    format: GrowthExportFormat,
  ): Promise<{ downloadUrl: string } | null> =>
    call(
      `/growth/plans/${planId}/exports`,
      { method: 'POST', body: { format }, sideEffectFree: true },
      () => null,
    ),

  createDraftFromItem: (
    input: { planId: string; itemId: string },
    idempotencyKey: string,
  ): Promise<{ contentItemId: string } | null> =>
    call('/growth/plans/drafts', { method: 'POST', body: input, idempotencyKey }, () => null),

  proposeSlotFromItem: (
    input: { planId: string; itemId: string },
    idempotencyKey: string,
  ): Promise<{ scheduledAt: string; timeZone: string } | null> =>
    call('/growth/plans/proposals', { method: 'POST', body: input, idempotencyKey }, () => null),

  listOpportunities: (
    query: { category?: string; cursor?: string; limit?: number } = {},
  ): Promise<Paginated<OpportunityRecord>> =>
    call('/growth/opportunities', { query }, () => page<OpportunityRecord>([])),

  listTools: (
    query: { need?: string; cursor?: string; limit?: number } = {},
  ): Promise<Paginated<ToolRecord>> => call('/growth/tools', { query }, () => page<ToolRecord>([])),
};

export type { ProviderId };
