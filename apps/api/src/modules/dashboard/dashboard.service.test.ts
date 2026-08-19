import { describe, expect, it, vi } from 'vitest';

import type {
  ActorContext,
  MetricObservationView,
  ReceiptSummaryView,
} from '../../application/port';
import { DashboardService, type DashboardServices } from './dashboard.service';

/**
 * The dashboard is the screen most likely to be believed at a glance, so these
 * tests are mostly about what it refuses to say: no invented winner, no zero
 * standing in for a number nobody has read, no provider reported healthy on the
 * strength of having no connections.
 */

const NOW = new Date('2026-08-12T12:00:00.000Z');

const actor: ActorContext = {
  actorType: 'user',
  actorId: 'usr_1',
  workspaceId: 'ws_1',
  scopes: [],
  surface: 'web',
  correlationId: 'corr_1',
  approvalLevel: 'level_3_confirm',
  locale: 'en',
};

function page<T>(data: readonly T[]) {
  return { data, nextCursor: null };
}

function receipt(overrides: Partial<ReceiptSummaryView> = {}): ReceiptSummaryView {
  return {
    receiptId: 'rcp_1',
    contentItemId: 'post_1',
    title: 'A post',
    provider: 'bluesky',
    accountLabel: '@relay',
    state: 'published',
    publishedAt: '2026-08-11T09:00:00.000Z',
    permalink: null,
    failedItemCount: 0,
    ...overrides,
  };
}

function observation(overrides: Partial<MetricObservationView> = {}): MetricObservationView {
  return {
    normalizedName: 'impressions',
    provider: 'bluesky',
    providerField: 'post_impressions_unique',
    providerDefinition: "The provider's own definition.",
    scope: 'post',
    value: 100,
    unit: 'count',
    availability: 'available',
    observedAt: '2026-08-12T11:00:00.000Z',
    freshnessSeconds: 3600,
    derivationRestricted: false,
    ...overrides,
  } as MetricObservationView;
}

interface Wiring {
  readonly receipts?: readonly ReceiptSummaryView[];
  readonly calendarStates?: readonly string[];
  readonly connections?: readonly { provider: string; health: string }[];
  readonly projects?: number;
  readonly metricsByReceipt?: Readonly<Record<string, readonly MetricObservationView[]>>;
  readonly projectLimit?: number;
}

/** The window is pinned by the clock the service is given, not by a subclass. */
const FIXED_CLOCK = { now: () => NOW };

function service(wiring: Wiring = {}) {
  const getPostMetrics = vi.fn(async (_ctx: unknown, input: { receiptId: string }) =>
    Promise.resolve(wiring.metricsByReceipt?.[input.receiptId] ?? []),
  );
  const services = {
    receipts: { listRecent: async () => page(wiring.receipts ?? []) },
    scheduling: {
      getCalendar: async () => page((wiring.calendarStates ?? []).map((state) => ({ state }))),
    },
    actionCenter: { list: async () => page([{ id: 'act_1' }]) },
    connections: { list: async () => page(wiring.connections ?? []) },
    projects: {
      list: async () =>
        page(Array.from({ length: wiring.projects ?? 0 }, (_, i) => ({ id: `proj_${i}` }))),
    },
    analytics: { getPostMetrics },
    identity: {
      getSessionView: async () => ({ workspace: { projectLimit: wiring.projectLimit ?? 3 } }),
    },
  } as unknown as DashboardServices;

  return { service: new DashboardService(services, FIXED_CLOCK), getPostMetrics };
}

describe('DashboardService.getSummary', () => {
  it('counts partial success on its own, never folded into either side', async () => {
    const { service: dashboard } = service({
      receipts: [
        receipt({ receiptId: 'rcp_1' }),
        receipt({ receiptId: 'rcp_2', state: 'partially_published', failedItemCount: 1 }),
        // A `published` receipt that lost a target is still partial.
        receipt({ receiptId: 'rcp_3', failedItemCount: 2 }),
        receipt({ receiptId: 'rcp_4', state: 'failed_permanently' }),
        // Still in flight: contributes to nothing at all.
        receipt({ receiptId: 'rcp_5', state: 'dispatching' }),
      ],
      calendarStates: ['scheduled', 'scheduled', 'draft'],
    });

    const summary = await dashboard.getSummary(actor, { days: 7 });

    expect(summary.week).toEqual({ published: 1, partial: 2, failed: 1, scheduled: 2 });
  });

  it('ignores receipts outside the requested window', async () => {
    const { service: dashboard } = service({
      receipts: [
        receipt({ receiptId: 'rcp_old', publishedAt: '2026-07-01T09:00:00.000Z' }),
        receipt({ receiptId: 'rcp_new' }),
      ],
    });

    const summary = await dashboard.getSummary(actor, { days: 7 });
    expect(summary.week.published).toBe(1);
  });

  it('returns no_fresh_metrics rather than a zero or a guess when nothing has been observed', async () => {
    const { service: dashboard, getPostMetrics } = service({
      receipts: [receipt()],
      // MetricObservation rows are written by another part of the system. Today
      // there are none, and that is the path this endpoint must get right.
      metricsByReceipt: {},
    });

    const summary = await dashboard.getSummary(actor, { days: 7 });

    expect(getPostMetrics).toHaveBeenCalledWith(actor, { receiptId: 'rcp_1' });
    expect(summary.topPost).toEqual({ state: 'no_fresh_metrics', reason: 'no_observations' });
    // And specifically not a fabricated winner with a zero on it.
    expect(summary.topPost).not.toHaveProperty('value');
  });

  it('refuses a winner when the only readings are unavailable', async () => {
    const { service: dashboard } = service({
      receipts: [receipt()],
      metricsByReceipt: {
        rcp_1: [observation({ availability: 'unavailable_permission', value: null })],
      },
    });

    const summary = await dashboard.getSummary(actor, { days: 7 });
    expect(summary.topPost).toEqual({
      state: 'no_fresh_metrics',
      reason: 'no_available_observations',
    });
  });

  it('refuses a winner when every available reading is stale', async () => {
    const { service: dashboard } = service({
      receipts: [receipt()],
      metricsByReceipt: { rcp_1: [observation({ freshnessSeconds: 60 * 60 * 24 })] },
    });

    const summary = await dashboard.getSummary(actor, { days: 7 });
    expect(summary.topPost).toEqual({
      state: 'no_fresh_metrics',
      reason: 'no_fresh_observations',
    });
  });

  it('refuses to break a tie', async () => {
    const { service: dashboard } = service({
      receipts: [receipt({ receiptId: 'rcp_1' }), receipt({ receiptId: 'rcp_2' })],
      metricsByReceipt: {
        rcp_1: [observation({ value: 100 })],
        rcp_2: [observation({ value: 100 })],
      },
    });

    const summary = await dashboard.getSummary(actor, { days: 7 });
    expect(summary.topPost).toEqual({ state: 'no_fresh_metrics', reason: 'tie' });
  });

  it('names the winning metric with the provider vocabulary and attaches freshness', async () => {
    const { service: dashboard } = service({
      receipts: [
        receipt({ receiptId: 'rcp_1', contentItemId: 'post_1' }),
        receipt({ receiptId: 'rcp_2', contentItemId: 'post_2' }),
      ],
      metricsByReceipt: {
        rcp_1: [observation({ value: 100 })],
        rcp_2: [observation({ value: 250 })],
      },
    });

    const summary = await dashboard.getSummary(actor, { days: 7 });

    expect(summary.topPost).toEqual({
      contentItemId: 'post_2',
      metricKey: 'impressions',
      providerMetricName: 'post_impressions_unique',
      value: 250,
      freshness: {
        label: 'fresh',
        observedAt: '2026-08-12T11:00:00.000Z',
        ageSeconds: 3600,
        staleAfterSeconds: 6 * 60 * 60,
      },
      evidenceIds: ['rcp_2'],
    });
  });

  it('reports the worst connection health per provider and null when there is none', async () => {
    const { service: dashboard } = service({
      receipts: [receipt({ provider: 'bluesky' }), receipt({ receiptId: 'rcp_2', provider: 'x' })],
      connections: [
        { provider: 'bluesky', health: 'active' },
        { provider: 'bluesky', health: 'expired' },
      ],
    });

    const summary = await dashboard.getSummary(actor, { days: 7 });
    const byProvider = Object.fromEntries(
      summary.perProvider.map((row) => [row.provider, row.connectionHealth]),
    );

    expect(byProvider.bluesky).toBe('expired');
    // No connection for `x`: absence of data, not a clean bill of health.
    expect(byProvider.x).toBeNull();
  });

  it('keeps a connected provider visible even with no activity this week', async () => {
    const { service: dashboard } = service({
      receipts: [],
      connections: [{ provider: 'linkedin', health: 'active' }],
    });

    const summary = await dashboard.getSummary(actor, { days: 7 });
    expect(summary.perProvider).toEqual([
      {
        provider: 'linkedin',
        published: 0,
        partial: 0,
        failed: 0,
        lastReceiptAt: null,
        connectionHealth: 'active',
      },
    ]);
  });

  it('reports project capacity against the workspace entitlement', async () => {
    const { service: dashboard } = service({ projects: 4, projectLimit: 10 });
    const summary = await dashboard.getSummary(actor, { days: 7 });
    expect(summary.projects).toEqual({ active: 4, allowance: 10, remaining: 6 });
  });

  it('never invents a digest before one has been written', async () => {
    const { service: dashboard } = service();
    const summary = await dashboard.getSummary(actor, { days: 7 });
    expect(summary.digest).toBeNull();
  });

  it('passes the action center queue through untouched', async () => {
    const { service: dashboard } = service();
    const summary = await dashboard.getSummary(actor, { days: 7 });
    expect(summary.attention).toHaveLength(1);
  });
});
