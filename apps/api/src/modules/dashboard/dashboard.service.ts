import { Inject, Injectable } from '@nestjs/common';
import { normalizeProjectLimit } from '@relay/contracts';
import type { ProviderId } from '@relay/contracts';

import type {
  ActionItemView,
  ActorContext,
  Clock,
  MetricObservationView,
  ReceiptSummaryView,
  Services,
} from '../../application/port';
import { CLOCK, SERVICES } from '../../application/tokens';
import type {
  ConnectionHealth,
  DashboardProviderView,
  DashboardSummaryQuery,
  DashboardSummaryView,
  DashboardTopPostView,
  DashboardTopPostAbsentView,
  DashboardWeekView,
} from './dashboard.schemas';

/**
 * The home screen's aggregate.
 *
 * It composes the services that already own each fact rather than querying
 * around them, so the dashboard cannot drift from the screens it summarizes.
 * The honesty rules live here, not in the UI:
 *
 *  - partial success is counted on its own, never folded into either side,
 *  - a top post exists only when a fresh, actually-available observation says
 *    so; a tie or an absence is an explicit state with a reason,
 *  - a metric is named with the provider's own vocabulary, and every number
 *    carries how old it is,
 *  - a provider with no connection reports `null` health, never "active".
 */

/** Only the services this aggregate composes. Keeps the test doubles honest. */
export type DashboardServices = Pick<
  Services,
  'receipts' | 'scheduling' | 'actionCenter' | 'connections' | 'analytics' | 'projects' | 'identity'
>;

const DAY_MS = 86_400_000;

/**
 * Mirrors `DEFAULT_STALE_AFTER_SECONDS` in `@relay/analytics-domain`. That
 * package is not a dependency of the API process; the number is duplicated with
 * this note rather than the threshold being invented locally.
 */
const STALE_AFTER_SECONDS = 6 * 60 * 60;

/** Bounds the per-receipt metric reads behind one dashboard request. */
const TOP_POST_CANDIDATE_LIMIT = 20;
const RECEIPT_PAGE_LIMIT = 100;
const ATTENTION_LIMIT = 10;

/** Worst first. The provider row shows the state that needs a human. */
const HEALTH_SEVERITY: readonly ConnectionHealth[] = [
  'revoked',
  'expired',
  'action_required',
  'disconnected',
  'paused',
  'active',
];

function worseHealth(left: ConnectionHealth | null, right: ConnectionHealth): ConnectionHealth {
  if (left === null) {
    return right;
  }
  return HEALTH_SEVERITY.indexOf(left) <= HEALTH_SEVERITY.indexOf(right) ? left : right;
}

interface ProviderTally {
  published: number;
  partial: number;
  failed: number;
  lastReceiptAt: string | null;
}

function emptyTally(): ProviderTally {
  return { published: 0, partial: 0, failed: 0, lastReceiptAt: null };
}

type ReceiptOutcome = 'published' | 'partial' | 'failed' | null;

/**
 * A receipt's contribution to the week.
 *
 * States that are still in flight contribute to nothing: counting a dispatching
 * job as either a success or a failure would be a guess about an external
 * system that has not answered yet.
 */
function outcomeOf(receipt: ReceiptSummaryView): ReceiptOutcome {
  switch (receipt.state) {
    case 'published':
      return receipt.failedItemCount > 0 ? 'partial' : 'published';
    case 'partially_published':
      return 'partial';
    case 'failed_permanently':
    case 'action_required':
      return 'failed';
    default:
      return null;
  }
}

interface Candidate {
  readonly contentItemId: string;
  readonly receiptId: string;
  readonly observation: MetricObservationView;
}

@Injectable()
export class DashboardService {
  constructor(
    @Inject(SERVICES) private readonly services: DashboardServices,
    // The injected clock rather than an overridable `new Date()`: a test pins
    // the window by supplying a clock, which is the same seam every other
    // service here uses.
    @Inject(CLOCK) private readonly clock: Clock,
  ) {}

  async getSummary(ctx: ActorContext, query: DashboardSummaryQuery): Promise<DashboardSummaryView> {
    const now = this.clock.now();
    const windowStart = new Date(now.getTime() - query.days * DAY_MS);

    const [receiptPage, calendarPage, attentionPage, connectionPage, projectPage] =
      await Promise.all([
        this.services.receipts.listRecent(ctx, { limit: RECEIPT_PAGE_LIMIT }),
        this.services.scheduling.getCalendar(ctx, {
          from: now.toISOString(),
          to: new Date(now.getTime() + query.days * DAY_MS).toISOString(),
          limit: RECEIPT_PAGE_LIMIT,
        }),
        this.services.actionCenter.list(ctx, { limit: ATTENTION_LIMIT }),
        this.services.connections.list(ctx, { limit: RECEIPT_PAGE_LIMIT }),
        this.services.projects.list(ctx, { limit: RECEIPT_PAGE_LIMIT }),
      ]);

    const inWindow = receiptPage.data.filter((receipt) => {
      const at = Date.parse(receipt.publishedAt);
      return Number.isFinite(at) && at >= windowStart.getTime() && at <= now.getTime();
    });

    const week: DashboardWeekView = {
      published: inWindow.filter((r) => outcomeOf(r) === 'published').length,
      partial: inWindow.filter((r) => outcomeOf(r) === 'partial').length,
      failed: inWindow.filter((r) => outcomeOf(r) === 'failed').length,
      scheduled: calendarPage.data.filter((entry) => entry.state === 'scheduled').length,
    };

    const attention: readonly ActionItemView[] = attentionPage.data;

    return {
      week,
      perProvider: this.perProvider(inWindow, connectionPage.data),
      topPost: await this.topPost(ctx, inWindow, now),
      // TODO(analytics): read the latest Insight of kind `digest` once the
      // digest producer writes one. Null until then, never a placeholder.
      digest: null,
      attention,
      projects: await this.projects(ctx, projectPage.data.length),
    };
  }

  private perProvider(
    receipts: readonly ReceiptSummaryView[],
    connections: readonly { readonly provider: ProviderId; readonly health: ConnectionHealth }[],
  ): readonly DashboardProviderView[] {
    const tallies = new Map<ProviderId, ProviderTally>();
    const health = new Map<ProviderId, ConnectionHealth>();

    for (const connection of connections) {
      health.set(
        connection.provider,
        worseHealth(health.get(connection.provider) ?? null, connection.health),
      );
    }

    for (const receipt of receipts) {
      const tally = tallies.get(receipt.provider) ?? emptyTally();
      const outcome = outcomeOf(receipt);
      if (outcome !== null) {
        tally[outcome] += 1;
      }
      if (tally.lastReceiptAt === null || receipt.publishedAt > tally.lastReceiptAt) {
        tally.lastReceiptAt = receipt.publishedAt;
      }
      tallies.set(receipt.provider, tally);
    }

    // A connected provider with no activity this week is still a row: an absent
    // row would read as "nothing to see", which is a different claim.
    for (const provider of health.keys()) {
      if (!tallies.has(provider)) {
        tallies.set(provider, emptyTally());
      }
    }

    return [...tallies.entries()]
      .map(([provider, tally]) => ({
        provider,
        published: tally.published,
        partial: tally.partial,
        failed: tally.failed,
        lastReceiptAt: tally.lastReceiptAt,
        connectionHealth: health.get(provider) ?? null,
      }))
      .sort((left, right) => left.provider.localeCompare(right.provider));
  }

  /**
   * The best-performing post of the window, or an explicit absence.
   *
   * Ranking happens inside a single normalized metric, because "views" on one
   * platform and "impressions" on another are not the same number and a winner
   * picked across them would be invented. Two posts tied at the top is not a
   * winner either.
   */
  private async topPost(
    ctx: ActorContext,
    receipts: readonly ReceiptSummaryView[],
    now: Date,
  ): Promise<DashboardTopPostView | DashboardTopPostAbsentView> {
    const ranked = receipts
      .filter((receipt) => outcomeOf(receipt) === 'published' || outcomeOf(receipt) === 'partial')
      .slice(0, TOP_POST_CANDIDATE_LIMIT);

    if (ranked.length === 0) {
      return { state: 'no_fresh_metrics', reason: 'no_observations' };
    }

    const observationSets = await Promise.all(
      ranked.map((receipt) =>
        this.services.analytics.getPostMetrics(ctx, { receiptId: receipt.receiptId }),
      ),
    );

    let sawAny = false;
    let sawAvailable = false;
    const candidates: Candidate[] = [];

    observationSets.forEach((observations, index) => {
      const receipt = ranked[index];
      if (receipt === undefined) {
        return;
      }
      for (const observation of observations) {
        sawAny = true;
        if (observation.availability !== 'available' || observation.value === null) {
          continue;
        }
        sawAvailable = true;
        if (observation.freshnessSeconds > STALE_AFTER_SECONDS) {
          continue;
        }
        candidates.push({
          contentItemId: receipt.contentItemId,
          receiptId: receipt.receiptId,
          observation,
        });
      }
    });

    if (candidates.length === 0) {
      if (!sawAny) {
        return { state: 'no_fresh_metrics', reason: 'no_observations' };
      }
      return {
        state: 'no_fresh_metrics',
        reason: sawAvailable ? 'no_fresh_observations' : 'no_available_observations',
      };
    }

    // One metric at a time. The metric with the widest coverage wins the
    // comparison; ties on coverage are broken by name so the answer is stable.
    const byMetric = new Map<string, Candidate[]>();
    for (const candidate of candidates) {
      const key = candidate.observation.normalizedName;
      byMetric.set(key, [...(byMetric.get(key) ?? []), candidate]);
    }
    const [metricKey, group] = [...byMetric.entries()].sort(
      (left, right) => right[1].length - left[1].length || left[0].localeCompare(right[0]),
    )[0] ?? ['', []];

    const sorted = [...group].sort(
      (left, right) => (right.observation.value ?? 0) - (left.observation.value ?? 0),
    );
    const best = sorted[0];
    if (best === undefined || best.observation.value === null) {
      return { state: 'no_fresh_metrics', reason: 'no_fresh_observations' };
    }
    const runnerUp = sorted[1];
    if (runnerUp !== undefined && runnerUp.observation.value === best.observation.value) {
      // Two posts, one number. Naming either one would be a coin flip dressed
      // up as a finding.
      return { state: 'no_fresh_metrics', reason: 'tie' };
    }

    const ageSeconds = Math.max(
      0,
      Math.round((now.getTime() - Date.parse(best.observation.observedAt)) / 1000),
    );

    return {
      contentItemId: best.contentItemId,
      metricKey,
      // The provider's own field name, carried through from the metric
      // definition that mirrors `@relay/analytics-domain`'s registry.
      providerMetricName: best.observation.providerField,
      value: best.observation.value,
      freshness: {
        label: ageSeconds > STALE_AFTER_SECONDS ? 'stale' : 'fresh',
        observedAt: best.observation.observedAt,
        ageSeconds,
        staleAfterSeconds: STALE_AFTER_SECONDS,
      },
      evidenceIds: [best.receiptId],
    };
  }

  /**
   * Project capacity.
   *
   * The allowance is the workspace's entitlement, read through the session view
   * that already owns it. Callers that are not a user (a service account, an
   * OAuth app) fall back to `normalizeProjectLimit`'s documented default rather
   * than to a number this endpoint made up.
   */
  private async projects(
    ctx: ActorContext,
    active: number,
  ): Promise<DashboardSummaryView['projects']> {
    const session =
      ctx.actorType === 'user'
        ? await this.services.identity.getSessionView(ctx.actorId, ctx.workspaceId)
        : null;
    const allowance = normalizeProjectLimit(session?.workspace.projectLimit);
    return { active, allowance, remaining: Math.max(0, allowance - active) };
  }
}
