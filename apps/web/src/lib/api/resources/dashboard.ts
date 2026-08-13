/**
 * The home screen's one aggregated read.
 *
 * The server owns every honesty rule in this payload: partial success is its
 * own count, and a top post is either a real, fresh, provider-named number or
 * an explicit `no_fresh_metrics` state with a reason. The client renders what
 * it is given and derives nothing.
 */

import { call } from '../call';
import { demoActionItems, demoConnections, demoReceipts } from '../fixtures';
import type { ActionItemView, ConnectionHealth, ProviderId } from '../types';

export type DashboardSummaryQuery = {
  /** How many days back the counts reach. The server defaults to 7. */
  readonly days?: number;
};

export type DashboardWeekView = {
  readonly published: number;
  readonly partial: number;
  readonly failed: number;
  readonly scheduled: number;
};

export type DashboardProviderView = {
  readonly provider: ProviderId;
  readonly published: number;
  readonly partial: number;
  readonly failed: number;
  readonly lastReceiptAt: string | null;
  /** Null when the workspace holds no connection for this provider. */
  readonly connectionHealth: ConnectionHealth | null;
};

export type DashboardFreshnessView = {
  readonly label: 'fresh' | 'stale';
  readonly observedAt: string;
  readonly ageSeconds: number;
  readonly staleAfterSeconds: number;
};

export type DashboardTopPostView = {
  readonly contentItemId: string;
  readonly metricKey: string;
  /** The provider's own name for the metric, never our normalized label. */
  readonly providerMetricName: string;
  readonly value: number;
  readonly freshness: DashboardFreshnessView;
  readonly evidenceIds: readonly string[];
};

export type DashboardTopPostAbsentView = {
  readonly state: 'no_fresh_metrics';
  readonly reason:
    'no_observations' | 'no_available_observations' | 'no_fresh_observations' | 'tie';
};

export type DashboardDigestView = {
  readonly headlineKey: string;
  readonly headlineArgs: Readonly<Record<string, string | number>>;
  readonly windowStart: string;
  readonly windowEnd: string;
  readonly createdAt: string;
};

export type DashboardProjectsView = {
  readonly active: number;
  readonly allowance: number;
  readonly remaining: number;
};

export type DashboardSummaryView = {
  readonly week: DashboardWeekView;
  readonly perProvider: readonly DashboardProviderView[];
  readonly topPost: DashboardTopPostView | DashboardTopPostAbsentView;
  readonly digest: DashboardDigestView | null;
  readonly attention: readonly ActionItemView[];
  readonly projects: DashboardProjectsView;
};

/**
 * The demo payload is counted from the same seeded receipts every other demo
 * screen uses, so the numbers agree with the lists beside them. There is no
 * seeded metric observation, so the demo top post is the honest absence rather
 * than an invented winner.
 */
function demoSummary(): DashboardSummaryView {
  const published = demoReceipts.filter(
    (receipt) => receipt.state === 'published' && receipt.failedItemCount === 0,
  );
  const partial = demoReceipts.filter(
    (receipt) => receipt.state === 'partially_published' || receipt.failedItemCount > 0,
  );

  return {
    week: {
      published: published.length,
      partial: partial.length,
      failed: 0,
      scheduled: 0,
    },
    perProvider: demoReceipts.map((receipt) => ({
      provider: receipt.provider,
      published: published.filter((row) => row.provider === receipt.provider).length,
      partial: partial.filter((row) => row.provider === receipt.provider).length,
      failed: 0,
      lastReceiptAt: receipt.publishedAt,
      connectionHealth:
        demoConnections.find((connection) => connection.provider === receipt.provider)?.health ??
        null,
    })),
    topPost: { state: 'no_fresh_metrics', reason: 'no_observations' },
    digest: null,
    attention: demoActionItems.filter((item) => item.snoozedUntil === null),
    projects: { active: 2, allowance: 3, remaining: 1 },
  };
}

export const dashboardApi = {
  // A read: no idempotency key, by construction.
  getSummary: (query: DashboardSummaryQuery = {}): Promise<DashboardSummaryView> =>
    call('/dashboard/summary', { query }, demoSummary),
};
