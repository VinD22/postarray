/** Analytics, experiments, tracked links and the growth advisor. */

import type { BusinessProfile, GrowthExportFormat, GrowthPlan, OpportunityRecord, ToolRecord } from '@relay/contracts';

import { call } from '../call.js';
import { demoGrowthPlan, page } from '../fixtures.js';
import type { GrowthPlanSummaryView, MetricView, Paginated, ProviderId } from '../types.js';

export interface MetricWindow {
  readonly from: string;
  readonly to: string;
}

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

export const analyticsApi = {
  getPostMetrics: (
    contentItemId: string,
    query: { connectionId?: string } = {},
  ): Promise<readonly MetricView[]> =>
    call(`/analytics/posts/${contentItemId}`, { query }, () => []),

  getAccountMetrics: (
    connectionId: string,
    query: MetricWindow,
  ): Promise<readonly MetricView[]> =>
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
    input: { name: string; metricName: string; hypothesis: string },
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
    input: { destinationUrl: string; domain?: string; campaign?: string },
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
    call(planId === undefined ? '/growth/plans/current' : `/growth/plans/${planId}`, {}, () => null),

  /** Home only needs the summary, not the whole plan document. */
  getPlanSummary: (): Promise<GrowthPlanSummaryView> =>
    call('/growth/plans/current/summary', {}, () => demoGrowthPlan),

  exportPlan: (planId: string, format: GrowthExportFormat): Promise<{ downloadUrl: string } | null> =>
    call(`/growth/plans/${planId}/exports`, { method: 'POST', body: { format }, sideEffectFree: true }, () => null),

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
