import { describe, expect, it } from 'vitest';

import type { PolarConfig } from '@relay/config';

import { createPolarClient } from './client';
import { deriveEntitlement } from './entitlements';
import { InMemorySubscriptionStore } from './inbox';
import type { ProjectAllowanceGrant } from './project-allowance';
import {
  DRIFT_PAGE_THRESHOLD_PER_HOUR,
  reconcileSubscriptions,
  reconcileWorkspace,
} from './reconcile';
import { type LocalPolarSimulator } from './simulator';
import { toVerifiedSubscription } from './webhooks';
import { MutableClock } from './time';

const START = '2026-08-04T14:00:00.000Z';

const config: PolarConfig = {
  checkoutEnabled: false,
  accessToken: undefined,
  webhookSecret: undefined,
  server: 'sandbox',
  monthlyProductId: undefined,
  annualProductId: undefined,
  growthMonthlyProductId: undefined,
  growthAnnualProductId: undefined,
  studioMonthlyProductId: undefined,
  studioAnnualProductId: undefined,
  productIdsByEnvKey: {},
  trialDays: 7,
};

async function setup() {
  const clock = new MutableClock(START);
  const client = createPolarClient({ config, clock }) as LocalPolarSimulator;
  const subscriptions = new InMemorySubscriptionStore();
  const checkout = await client.createCheckout({
    productId: 'sim_prod_monthly',
    successUrl: 'https://app.example.test/billing/return',
    idempotencyKey: 'reconcile-0001',
    metadata: { workspaceId: 'ws_01' },
  });
  const created = await client.confirmCheckout(checkout.id);
  client.drainDeliveries();
  return { clock, client, subscriptions, created };
}

describe('reconciliation', () => {
  it('creates local state for a subscription whose webhook never arrived', async () => {
    const { clock, client, subscriptions } = await setup();
    const report = await reconcileSubscriptions({ client, subscriptions, clock });

    expect(report.checked).toBe(1);
    expect(report.repaired).toBe(1);
    expect(report.drifts[0]?.kinds).toContain('missing_locally');
    expect(report.alerts).toBe(1);

    const stored = await subscriptions.getByWorkspaceId('ws_01');
    expect(stored?.source).toBe('reconciliation');
    expect(deriveEntitlement(stored, { now: clock.iso() }).state).toBe('full');
  });

  it('repairs an entitlement a dropped webhook left stale, within one cycle', async () => {
    const { clock, client, subscriptions, created } = await setup();
    await subscriptions.upsert(
      toVerifiedSubscription({
        subscription: created,
        workspaceId: 'ws_01',
        source: 'webhook',
        verifiedAt: START,
        previous: null,
      }),
    );

    // Polar moves the subscription to unpaid, and the webhook is lost.
    clock.advanceDays(10);
    await client.mutateSilently(created.id, { status: 'unpaid' });

    const report = await reconcileSubscriptions({ client, subscriptions, clock });
    expect(report.repaired).toBe(1);
    expect(report.drifts[0]?.kinds).toContain('status_changed');
    expect(report.drifts[0]?.kinds).toContain('entitlement_state_changed');
    expect(report.drifts[0]?.alert).toBe(true);

    const stored = await subscriptions.getBySubscriptionId(created.id);
    expect(stored?.status).toBe('unpaid');
    expect(deriveEntitlement(stored, { now: clock.iso() }).state).toBe('read_only');
  });

  it('reports no drift when local state already matches Polar', async () => {
    const { clock, client, subscriptions, created } = await setup();
    await subscriptions.upsert(
      toVerifiedSubscription({
        subscription: created,
        workspaceId: 'ws_01',
        source: 'webhook',
        verifiedAt: START,
        previous: null,
      }),
    );
    const report = await reconcileSubscriptions({ client, subscriptions, clock });
    expect(report.repaired).toBe(0);
    expect(report.drifts).toHaveLength(0);
    expect(report.alerts).toBe(0);
    expect(report.shouldPage).toBe(false);
  });

  it('records an audit callback for every repair', async () => {
    const { clock, client, subscriptions } = await setup();
    const audited: string[] = [];
    await reconcileSubscriptions({
      client,
      subscriptions,
      clock,
      onDriftRepaired: (drift) => {
        audited.push(drift.subscriptionId);
      },
    });
    expect(audited).toHaveLength(1);
  });

  it('pages only when drift is unusual', async () => {
    expect(DRIFT_PAGE_THRESHOLD_PER_HOUR).toBe(5);
  });

  it('closes the gap for a single workspace stuck on the pending return page', async () => {
    const { clock, client, subscriptions, created } = await setup();
    const snapshot = await reconcileWorkspace(
      { client, subscriptions, clock },
      { workspaceId: 'ws_01', subscriptionId: created.id },
    );
    expect(snapshot.state).toBe('full');
    expect(snapshot.verified).toBe(true);
    expect((await subscriptions.getByWorkspaceId('ws_01'))?.source).toBe('reconciliation');
  });

  it('returns no entitlement when a workspace has never subscribed', async () => {
    const { clock, client, subscriptions } = await setup();
    const snapshot = await reconcileWorkspace(
      { client, subscriptions, clock },
      { workspaceId: 'ws_unknown' },
    );
    expect(snapshot.state).toBe('none');
  });
});

describe('reconciliation repairs project capacity too', () => {
  it('re-emits the projects.active.max row when it repairs a subscription', async () => {
    const { clock, client, subscriptions } = await setup();
    const grants: ProjectAllowanceGrant[] = [];
    await reconcileSubscriptions({
      client,
      subscriptions,
      clock,
      onProjectAllowance: (grant) => {
        grants.push(grant);
      },
    });
    expect(grants).toHaveLength(1);
    expect(grants[0]?.key).toBe('projects.active.max');
    expect(grants[0]?.numericValue).toBe(3);
    expect(grants[0]?.source).toBe('reconciliation');
  });

  it('emits it from a single workspace repair as well', async () => {
    const { clock, client, subscriptions, created } = await setup();
    const grants: ProjectAllowanceGrant[] = [];
    await reconcileWorkspace(
      {
        client,
        subscriptions,
        clock,
        onProjectAllowance: (grant) => {
          grants.push(grant);
        },
      },
      { workspaceId: 'ws_01', subscriptionId: created.id },
    );
    expect(grants).toHaveLength(1);
    expect(grants[0]?.workspaceId).toBe('ws_01');
    expect(grants[0]?.numericValue).toBe(3);
  });
});
