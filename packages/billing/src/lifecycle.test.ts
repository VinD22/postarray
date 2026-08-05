import { beforeEach, describe, expect, it } from 'vitest';

import type { PolarConfig } from '@relay/config';

import { createCheckoutSession } from './checkout.js';
import { createPolarClient } from './client.js';
import { deriveEntitlement, evaluateEntitlement, scheduledPostDisposition } from './entitlements.js';
import type { EntitlementSnapshot } from './entitlements.js';
import { InMemorySubscriptionStore, InMemoryWebhookInbox } from './inbox.js';
import { reconcileSubscriptions } from './reconcile.js';
import { LocalPolarSimulator } from './simulator.js';
import { cancellationOutcome } from './trial.js';
import { MutableClock } from './time.js';
import { createWebhookProcessor } from './webhooks.js';
import type { OrderEvent, WebhookProcessor } from './webhooks.js';

/**
 * The whole billing lifecycle against the local simulator, with no Polar key
 * and no network: checkout, trial, conversion, renewal, failed payment, grace,
 * read only, recovery, cancellation and refund.
 */

const START = '2026-08-04T14:00:00.000Z';

const config: PolarConfig = {
  accessToken: undefined,
  webhookSecret: undefined,
  server: 'sandbox',
  monthlyProductId: undefined,
  annualProductId: undefined,
  trialDays: 7,
};

let clock: MutableClock;
let client: LocalPolarSimulator;
let inbox: InMemoryWebhookInbox;
let subscriptions: InMemorySubscriptionStore;
let processor: WebhookProcessor;
let orderEvents: OrderEvent[];

async function pump(): Promise<void> {
  for (const delivery of client.drainDeliveries()) {
    await processor.handle({ rawBody: delivery.rawBody, headers: delivery.headers });
  }
}

async function entitlement(): Promise<EntitlementSnapshot> {
  const stored = await subscriptions.getByWorkspaceId('ws_01');
  return deriveEntitlement(stored, { now: clock.iso() });
}

async function startTrial(interval: 'month' | 'year' = 'month'): Promise<string> {
  const session = await createCheckoutSession(
    { client, config, clock },
    {
      interval,
      workspaceId: 'ws_01',
      actorId: 'user_01',
      successUrl: 'https://app.example.test/billing/return',
      locale: 'en',
      idempotencyKey: `checkout-ws_01-${interval}`,
    },
  );
  const subscription = await client.confirmCheckout(session.checkoutId);
  await pump();
  return subscription.id;
}

beforeEach(() => {
  clock = new MutableClock(START);
  client = createPolarClient({ config, clock }) as LocalPolarSimulator;
  inbox = new InMemoryWebhookInbox();
  subscriptions = new InMemorySubscriptionStore();
  orderEvents = [];
  processor = createWebhookProcessor({
    inbox,
    subscriptions,
    clock,
    webhookSecret: client.webhookSecret,
    onOrderPaid: (event) => {
      orderEvents.push(event);
    },
    onOrderRefunded: (event) => {
      orderEvents.push(event);
    },
  });
});

describe('trial to paid', () => {
  it('grants full access only after the verified subscription.created webhook', async () => {
    const session = await createCheckoutSession(
      { client, config, clock },
      {
        interval: 'month',
        workspaceId: 'ws_01',
        actorId: 'user_01',
        successUrl: 'https://app.example.test/billing/return',
        locale: 'en',
        idempotencyKey: 'checkout-ws_01-first',
      },
    );
    expect((await entitlement()).state).toBe('none');

    await client.confirmCheckout(session.checkoutId);
    // The customer is back on our site but the webhook has not been processed.
    expect((await entitlement()).state).toBe('none');

    await pump();
    const granted = await entitlement();
    expect(granted.state).toBe('full');
    expect(granted.isTrialing).toBe(true);
    expect(granted.trialDaysRemaining).toBe(7);
  });

  it('charges nothing during the trial and converts on day seven', async () => {
    await startTrial();
    expect(orderEvents).toHaveLength(0);

    clock.advanceDays(6);
    await client.tick();
    await pump();
    expect((await entitlement()).status).toBe('trialing');
    expect(orderEvents).toHaveLength(0);

    clock.advanceDays(1);
    await client.tick();
    await pump();

    const converted = await entitlement();
    expect(converted.status).toBe('active');
    expect(converted.state).toBe('full');
    expect(converted.isTrialing).toBe(false);
    expect(orderEvents).toHaveLength(1);
    expect(orderEvents[0]?.order.totalMinor).toBe(2_900);
  });

  it('charges the annual price on the annual interval', async () => {
    await startTrial('year');
    clock.advanceDays(7);
    await client.tick();
    await pump();
    expect(orderEvents[0]?.order.totalMinor).toBe(30_000);
  });

  it('renews the following period without a second trial', async () => {
    await startTrial();
    clock.advanceDays(7);
    await client.tick();
    await pump();

    clock.advanceDays(31);
    await client.tick();
    await pump();
    expect(orderEvents).toHaveLength(2);
    expect((await entitlement()).state).toBe('full');
  });
});

describe('failed payment', () => {
  it('keeps everything working through the grace period, then goes read only', async () => {
    const subscriptionId = await startTrial();
    client.failNextCharge(subscriptionId);
    clock.advanceDays(7);
    await client.tick();
    await pump();

    const pastDue = await entitlement();
    expect(pastDue.status).toBe('past_due');
    expect(pastDue.state).toBe('full_grace');
    expect(pastDue.dispatchAllowed).toBe(true);
    expect(pastDue.readOnlyAt).not.toBeNull();

    clock.advanceDays(8);
    const readOnly = await entitlement();
    expect(readOnly.state).toBe('read_only');
    expect(readOnly.dispatchAllowed).toBe(false);
    expect(readOnly.exportAllowed).toBe(true);
    expect(readOnly.analyticsAllowed).toBe(true);
  });

  it('pauses approved scheduled posts rather than dispatching or deleting them', async () => {
    const subscriptionId = await startTrial();
    client.failNextCharge(subscriptionId);
    clock.advanceDays(7);
    await client.tick();
    await pump();
    clock.advanceDays(8);

    const readOnly = await entitlement();
    expect(scheduledPostDisposition(readOnly.state)).toBe('pause_by_billing');
    expect(
      evaluateEntitlement(await subscriptions.getByWorkspaceId('ws_01'), 'dispatch_scheduled_post', {
        now: clock.iso(),
      }).effect,
    ).toBe('read_only');
  });

  it('restores full access when the payment goes through', async () => {
    const subscriptionId = await startTrial();
    client.failNextCharge(subscriptionId);
    clock.advanceDays(7);
    await client.tick();
    await pump();
    clock.advanceDays(8);
    expect((await entitlement()).state).toBe('read_only');

    await client.payOutstanding(subscriptionId);
    await pump();
    const restored = await entitlement();
    expect(restored.status).toBe('active');
    expect(restored.state).toBe('full');
    expect(scheduledPostDisposition(restored.state)).toBe('dispatch');
  });
});

describe('cancellation', () => {
  it('cancelling in the trial confirms no charge and no charge happens', async () => {
    const subscriptionId = await startTrial();
    clock.advanceDays(3);
    await client.cancelSubscription({ subscriptionId, atPeriodEnd: true });
    await pump();

    const stored = await subscriptions.getByWorkspaceId('ws_01');
    expect(stored).not.toBeNull();
    if (stored === null) {
      return;
    }
    const outcome = cancellationOutcome({ subscription: stored, now: clock.iso() });
    expect(outcome.willNotBeCharged).toBe(true);
    expect(outcome.confirmationKey).toBe('billing.trial.canceled');

    const during = await entitlement();
    expect(during.state).toBe('full_until_period_end');

    clock.advanceDays(5);
    await client.tick();
    await pump();
    expect(orderEvents).toHaveLength(0);
    expect((await entitlement()).state).toBe('read_only');
  });

  it('cancelling after a paid period keeps access to the period end', async () => {
    const subscriptionId = await startTrial();
    clock.advanceDays(7);
    await client.tick();
    await pump();

    clock.advanceDays(3);
    await client.cancelSubscription({ subscriptionId, atPeriodEnd: true });
    await pump();
    expect((await entitlement()).state).toBe('full_until_period_end');

    clock.advanceDays(30);
    await client.tick();
    await pump();
    expect((await entitlement()).state).toBe('read_only');
  });

  it('uncancelling restores the renewal', async () => {
    const subscriptionId = await startTrial();
    await client.cancelSubscription({ subscriptionId, atPeriodEnd: true });
    await pump();
    await client.uncancelSubscription(subscriptionId);
    await pump();
    const stored = await subscriptions.getByWorkspaceId('ws_01');
    expect(stored?.cancelAtPeriodEnd).toBe(false);
    expect((await entitlement()).state).toBe('full');
  });
});

describe('refunds and the customer portal', () => {
  it('emits order.refunded for the affiliate ledger to reverse against', async () => {
    await startTrial();
    clock.advanceDays(7);
    await client.tick();
    await pump();
    const paid = orderEvents[0];
    expect(paid).toBeDefined();
    if (paid === undefined) {
      return;
    }

    await client.refundOrder(paid.order.id);
    await pump();
    expect(orderEvents).toHaveLength(2);
    expect(orderEvents[1]?.eventType).toBe('order.refunded');
    expect(orderEvents[1]?.order.refundedMinor).toBe(2_900);
  });

  it('links to a hosted customer portal rather than rebuilding one', async () => {
    await startTrial();
    const stored = await subscriptions.getByWorkspaceId('ws_01');
    expect(stored).not.toBeNull();
    if (stored === null) {
      return;
    }
    const session = await client.createCustomerPortalSession({ customerId: stored.customerId });
    expect(session.customerPortalUrl).toContain('example.test');
  });
});

describe('reconciliation closes a webhook gap', () => {
  it('repairs entitlements when a delivery is dropped entirely', async () => {
    const subscriptionId = await startTrial();
    clock.advanceDays(7);
    await client.tick();
    // The deliveries are discarded: this is a dropped webhook, not a retry.
    client.drainDeliveries();

    await client.mutateSilently(subscriptionId, { status: 'unpaid' });
    const report = await reconcileSubscriptions({ client, subscriptions, clock });
    expect(report.repaired).toBe(1);
    expect((await entitlement()).state).toBe('read_only');
  });
});

describe('the inbox holds a record of every delivery', () => {
  it('records each processed event exactly once', async () => {
    await startTrial();
    clock.advanceDays(7);
    await client.tick();
    await pump();

    const rows = await inbox.list();
    expect(rows.length).toBeGreaterThan(0);
    const ids = new Set(rows.map((row) => row.providerEventId));
    expect(ids.size).toBe(rows.length);
    for (const row of rows) {
      expect(row.signatureState).toBe('verified');
      expect(row.processedAt).not.toBeNull();
      expect(row.result).not.toBe('pending');
    }
  });
});
