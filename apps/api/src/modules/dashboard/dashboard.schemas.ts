import type { ProviderId } from '@relay/contracts';
import { z } from 'zod';

import type { ActionItemView, ConnectionView } from '../../application/port';

/** The connection health vocabulary, taken from the view rather than restated. */
export type ConnectionHealth = ConnectionView['health'];

/**
 * The home screen's one aggregated read.
 *
 * Every honesty rule this endpoint carries is enforced in the service, not in
 * the shapes below: a shape can only refuse to *express* a lie, and the useful
 * work is refusing to *compute* one.
 */

export const dashboardSummaryQuerySchema = z
  .object({
    /**
     * How many days back the "this week" counts reach. Explicit so a caller can
     * ask for the same window twice and get the same answer, rather than the
     * server quietly choosing.
     */
    days: z.coerce.number().int().min(1).max(31).default(7),
  })
  .strict();

export type DashboardSummaryQuery = z.infer<typeof dashboardSummaryQuerySchema>;

/**
 * Partial success is a first-class state. It is never folded into `published`
 * (which would claim targets that failed) nor into `failed` (which would
 * discard posts that are live).
 */
export interface DashboardWeekView {
  readonly published: number;
  readonly partial: number;
  readonly failed: number;
  readonly scheduled: number;
}

export interface DashboardProviderView {
  readonly provider: ProviderId;
  readonly published: number;
  readonly partial: number;
  readonly failed: number;
  readonly lastReceiptAt: string | null;
  /**
   * The worst health among this provider's connections, or null when the
   * workspace has no connection for it. Null is "we hold nothing to report",
   * never "healthy".
   */
  readonly connectionHealth: ConnectionHealth | null;
}

/** Mirrors `@relay/analytics-domain`'s freshness vocabulary. */
export const DASHBOARD_FRESHNESS_LABELS = ['fresh', 'stale'] as const;
export type DashboardFreshnessLabel = (typeof DASHBOARD_FRESHNESS_LABELS)[number];

export interface DashboardFreshnessView {
  readonly label: DashboardFreshnessLabel;
  readonly observedAt: string;
  readonly ageSeconds: number;
  readonly staleAfterSeconds: number;
}

export interface DashboardTopPostView {
  readonly contentItemId: string;
  /** The normalized metric the ranking used. */
  readonly metricKey: string;
  /** The provider's own name for that metric. Never our normalized label. */
  readonly providerMetricName: string;
  readonly value: number;
  readonly freshness: DashboardFreshnessView;
  /** Receipt ids the number can be traced back to. */
  readonly evidenceIds: readonly string[];
}

export const TOP_POST_ABSENT_REASONS = [
  'no_observations',
  'no_available_observations',
  'no_fresh_observations',
  'tie',
] as const;
export type TopPostAbsentReason = (typeof TOP_POST_ABSENT_REASONS)[number];

export interface DashboardTopPostAbsentView {
  readonly state: 'no_fresh_metrics';
  readonly reason: TopPostAbsentReason;
}

/**
 * The latest digest insight. Null while none exists: another agent writes the
 * digest, and an endpoint that invented one in the meantime would be lying
 * about work that has not happened.
 */
export interface DashboardDigestView {
  readonly headlineKey: string;
  readonly headlineArgs: Readonly<Record<string, string | number>>;
  readonly windowStart: string;
  readonly windowEnd: string;
  readonly createdAt: string;
}

export interface DashboardProjectsView {
  readonly active: number;
  readonly allowance: number;
  readonly remaining: number;
}

export interface DashboardSummaryView {
  readonly week: DashboardWeekView;
  readonly perProvider: readonly DashboardProviderView[];
  readonly topPost: DashboardTopPostView | DashboardTopPostAbsentView;
  readonly digest: DashboardDigestView | null;
  readonly attention: readonly ActionItemView[];
  readonly projects: DashboardProjectsView;
}
