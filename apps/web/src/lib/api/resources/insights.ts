/** Analytics, experiments, tracked links and the growth advisor. */

import type {
  GrowthExportFormat,
  GrowthPlan,
  OperationRef,
  OpportunityRecord,
  ToolRecord,
} from '@relay/contracts';

import { call } from '../call';
import { demoAnalyticsOverview, page } from '../fixtures';
import type {
  BusinessProfileView,
  GrowthPlanSummaryView,
  MetricView,
  Paginated,
  ProviderId,
} from '../types';

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
  readonly projectId?: string;
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

/** The wire shape of `POST /v1/analytics/comparisons`. */
export interface ComparisonReport {
  readonly subjectLabel: string;
  readonly baselineLabel: string;
  readonly sampleSize: number;
  readonly rows: readonly {
    readonly normalizedName: string;
    readonly unit: string;
    readonly subject: number | null;
    readonly baseline: number | null;
    readonly deltaPercent: number | null;
    readonly availability: string;
    readonly comparable: boolean;
    readonly caveatKeys: readonly string[];
  }[];
  readonly caveatKeys: readonly string[];
}

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
          ...(query.projectId === undefined ? {} : { projectId: query.projectId }),
          // Repeated ids travel as one comma separated parameter.
          connectionIds: query.connectionIds.join(','),
          from: query.from,
          to: query.to,
          metric: query.metric,
          ...(query.contentKind === undefined ? {} : { contentKind: query.contentKind }),
        },
      },
      () => ({
        ...demoAnalyticsOverview,
        range: { start: query.from, end: query.to, preset: 'custom' as const },
        rankMetric: query.metric,
        rows:
          query.metric === demoAnalyticsOverview.rankMetric
            ? demoAnalyticsOverview.rows.filter(
                (row) => query.contentKind === undefined || row.format === query.contentKind,
              )
            : [],
      }),
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
   * Compare a set of published posts, or a period, against the account's own
   * baseline. There is no cross-platform leaderboard here.
   *
   * A POST because the request names a list of receipts, which does not belong
   * in a query string, and `sideEffectFree` because it is a read: it creates
   * nothing, so it needs no idempotency key. The endpoint is
   * `POST /v1/analytics/comparisons`; there has never been a
   * `GET /v1/analytics/compare` to call.
   */
  compare: (input: {
    baseline: 'trailing_median' | 'previous_period';
    receiptIds?: readonly string[];
    period?: MetricWindow & { readonly ianaTimeZone: string };
    connectionId?: string;
  }): Promise<ComparisonReport | null> =>
    call(
      '/analytics/comparisons',
      {
        method: 'POST',
        sideEffectFree: true,
        body: {
          baseline: input.baseline,
          ...(input.receiptIds === undefined ? {} : { receiptIds: [...input.receiptIds] }),
          ...(input.period === undefined ? {} : { period: input.period }),
          ...(input.connectionId === undefined ? {} : { connectionId: input.connectionId }),
        },
      },
      () => null,
    ),

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
  readonly workspaceId: string;
  readonly slug: string;
  readonly shortUrl: string;
  readonly destinationUrl: string;
  readonly domain: string | null;
  readonly campaignId: string | null;
  readonly utm: Readonly<Record<string, string>>;
  readonly state: 'active' | 'disabled' | 'expired' | 'blocked';
  readonly expiresAt: string | null;
  readonly disabledAt: string | null;
  readonly destinationHistory: readonly {
    readonly url: string;
    readonly activeFrom: string;
    readonly activeTo: string | null;
    readonly changedByActorId: string;
  }[];
  readonly createdByUserId: string;
  readonly createdAt: string;
}

export interface ShortLinkStats {
  readonly linkId: string;
  readonly totalClicks: number;
  readonly humanClicks: number;
  readonly suspectedBotClicks: number;
  readonly lastEventAt: string | null;
  readonly series: readonly { readonly bucketStart: string; readonly requests: number }[];
  readonly topCountries: readonly { readonly countryCode: string; readonly clicks: number }[];
  readonly topReferrerClasses: readonly {
    readonly referrerClass: string;
    readonly clicks: number;
  }[];
  readonly topDeviceClasses: readonly { readonly deviceClass: string; readonly clicks: number }[];
  readonly sourceKey: 'analytics.source.first_party_redirect';
}

export const shortLinksApi = {
  create: (
    input: {
      destinationUrl: string;
      /** A verified branded domain. Absent uses the default isolated domain. */
      domainId?: string;
      campaignId?: string;
      slug?: string;
      utm?: Readonly<Record<string, string>>;
      expiresAt?: string;
    },
    idempotencyKey: string,
  ): Promise<ShortLinkView | null> =>
    call('/short-links', { method: 'POST', body: input, idempotencyKey }, () => null),

  get: (linkId: string): Promise<ShortLinkView | null> =>
    call(`/short-links/${linkId}`, {}, () => null),

  getStats: (
    linkId: string,
    query: MetricWindow & { readonly ianaTimeZone: string },
  ): Promise<ShortLinkStats | null> => call(`/short-links/${linkId}/stats`, { query }, () => null),

  list: (query: { cursor?: string; limit?: number } = {}): Promise<Paginated<ShortLinkView>> =>
    call('/short-links', { query }, () => page<ShortLinkView>([])),

  updateDestination: (
    linkId: string,
    input: { destinationUrl: string; reason: string },
    idempotencyKey: string,
  ): Promise<ShortLinkView | null> =>
    call(
      `/short-links/${linkId}/destination`,
      { method: 'PATCH', body: input, idempotencyKey },
      () => null,
    ),

  setEnabled: (
    linkId: string,
    input: { enabled: boolean; reason: string },
    idempotencyKey: string,
  ): Promise<ShortLinkView | null> =>
    call(
      `/short-links/${linkId}/state`,
      { method: 'PATCH', body: input, idempotencyKey },
      () => null,
    ),
};

export const growthApi = {
  getBusinessProfile: (): Promise<BusinessProfileView | null> =>
    call('/growth/profile', {}, () => null),

  upsertBusinessProfile: (
    input: Readonly<Record<string, unknown>>,
    idempotencyKey: string,
  ): Promise<BusinessProfileView> =>
    call('/growth/profile', { method: 'PUT', body: input, idempotencyKey }, () => {
      throw new Error('DEMO_GROWTH_PROFILE_UNAVAILABLE');
    }),

  confirmBusinessProfile: (
    profileId: string,
    input: {
      confirmedAssumptionIds?: readonly string[];
      corrections?: Readonly<Record<string, string>>;
    },
    idempotencyKey: string,
  ): Promise<BusinessProfileView> =>
    call(
      `/growth/profile/${encodeURIComponent(profileId)}/confirm`,
      { method: 'POST', body: input, idempotencyKey },
      () => {
        throw new Error('DEMO_GROWTH_PROFILE_UNAVAILABLE');
      },
    ),

  generatePlan: (profileId: string, idempotencyKey: string): Promise<OperationRef> =>
    call('/growth/plans', { method: 'POST', body: { profileId }, idempotencyKey }, () => {
      throw new Error('DEMO_GROWTH_PLAN_UNAVAILABLE');
    }),

  getPlan: (planId?: string): Promise<GrowthPlan | null> =>
    call(
      planId === undefined ? '/growth/plans/current' : `/growth/plans/${planId}`,
      {},
      () => null,
    ),

  /** Home only needs the summary, not the whole plan document. */
  getPlanSummary: (): Promise<GrowthPlanSummaryView> =>
    call('/growth/plans/current/summary', {}, () => ({
      planId: null,
      version: null,
      approvedAt: null,
      currentWeek: null,
      totalWeeks: null,
      undraftedBriefCount: null,
      profileComplete: false,
    })),

  exportPlan: (
    planId: string,
    format: GrowthExportFormat,
  ): Promise<{ downloadUrl: string } | null> =>
    call(`/growth/plans/${encodeURIComponent(planId)}/export`, { query: { format } }, () => null),

  createDraftFromItem: (
    input: { planId: string; itemId: string },
    idempotencyKey: string,
  ): Promise<{ contentItemId: string } | null> =>
    call(
      `/growth/plans/${encodeURIComponent(input.planId)}/drafts`,
      { method: 'POST', body: { itemId: input.itemId }, idempotencyKey },
      () => null,
    ),

  proposeSlotFromItem: (
    input: { planId: string; itemId: string },
    idempotencyKey: string,
  ): Promise<{ scheduledAt: string; timeZone: string } | null> =>
    call(
      `/growth/plans/${encodeURIComponent(input.planId)}/slot-proposals`,
      { method: 'POST', body: { itemId: input.itemId }, idempotencyKey },
      () => null,
    ),

  listOpportunities: (
    query: { category?: string; cursor?: string; limit?: number } = {},
  ): Promise<Paginated<OpportunityRecord>> =>
    call('/growth/opportunities', { query }, () => page<OpportunityRecord>([])),

  listTools: (
    query: { need?: string; cursor?: string; limit?: number } = {},
  ): Promise<Paginated<ToolRecord>> => call('/growth/tools', { query }, () => page<ToolRecord>([])),
};

export type { ProviderId };
