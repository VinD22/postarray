import { describe, expect, it } from 'vitest';

import {
  InMemorySubscriptionStore,
  InMemoryWebhookInbox,
  createWebhookProcessor,
  shouldAlertOnFailure,
  toVerifiedSubscription,
  workspaceIdOf,
} from './webhooks';
import type { EntitlementChange, OrderEvent } from './webhooks';
import { polarSubscriptionSchema } from './polar-schemas';
import {
  WEBHOOK_HEADER_ID,
  WEBHOOK_HEADER_SIGNATURE,
  WEBHOOK_HEADER_TIMESTAMP,
  signWebhook,
} from './signature';
import { MutableClock } from './time';

const SECRET = 'whsec_dGVzdC1zZWNyZXQtbm90LWEtcmVhbC1rZXk=';
const NOW = '2026-08-04T14:00:00.000Z';

function subscriptionPayload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'sim_sub_000001',
    status: 'trialing',
    customer_id: 'sim_cust_000001',
    product_id: 'sim_prod_monthly',
    amount: 2_900,
    currency: 'usd',
    recurring_interval: 'month',
    current_period_start: NOW,
    current_period_end: '2026-08-11T14:00:00.000Z',
    cancel_at_period_end: false,
    canceled_at: null,
    started_at: NOW,
    ends_at: null,
    ended_at: null,
    trial_start: NOW,
    trial_end: '2026-08-11T14:00:00.000Z',
    created_at: NOW,
    modified_at: NOW,
    metadata: { workspaceId: 'ws_01' },
    ...overrides,
  };
}

interface Harness {
  readonly inbox: InMemoryWebhookInbox;
  readonly subscriptions: InMemorySubscriptionStore;
  readonly clock: MutableClock;
  readonly changes: EntitlementChange[];
  readonly orders: OrderEvent[];
  deliver(
    type: string,
    data: unknown,
    options?: { eventId?: string; secret?: string; body?: string },
  ): ReturnType<ReturnType<typeof createWebhookProcessor>['handle']>;
}

function makeHarness(): Harness {
  const inbox = new InMemoryWebhookInbox();
  const subscriptions = new InMemorySubscriptionStore();
  const clock = new MutableClock(NOW);
  const changes: EntitlementChange[] = [];
  const orders: OrderEvent[] = [];
  const processor = createWebhookProcessor({
    inbox,
    subscriptions,
    clock,
    webhookSecret: SECRET,
    onEntitlementChange: (change) => {
      changes.push(change);
    },
    onOrderPaid: (event) => {
      orders.push(event);
    },
    onOrderRefunded: (event) => {
      orders.push(event);
    },
  });

  let sequence = 0;
  return {
    inbox,
    subscriptions,
    clock,
    changes,
    orders,
    async deliver(type, data, options = {}) {
      sequence += 1;
      const eventId = options.eventId ?? `sim_evt_${String(sequence).padStart(6, '0')}`;
      const rawBody = options.body ?? JSON.stringify({ type, data });
      const timestampSeconds = Math.floor(clock.now().getTime() / 1000);
      const signature = await signWebhook({
        secret: options.secret ?? SECRET,
        webhookId: eventId,
        timestampSeconds,
        rawBody,
      });
      return processor.handle({
        rawBody,
        headers: {
          [WEBHOOK_HEADER_ID]: eventId,
          [WEBHOOK_HEADER_TIMESTAMP]: String(timestampSeconds),
          [WEBHOOK_HEADER_SIGNATURE]: signature,
        },
      });
    },
  };
}

describe('the webhook inbox', () => {
  it('records the event id, signature state, body hash and timestamps', async () => {
    const harness = makeHarness();
    const outcome = await harness.deliver('subscription.created', subscriptionPayload());
    expect(outcome.result).toBe('applied');

    const row = await harness.inbox.get(outcome.providerEventId);
    expect(row).not.toBeNull();
    expect(row?.signatureState).toBe('verified');
    expect(row?.bodyHash).toMatch(/^[0-9a-f]{64}$/);
    expect(row?.receivedAt).toBe(NOW);
    expect(row?.processedAt).toBe(NOW);
    expect(row?.result).toBe('applied');
    expect(row?.attempts).toBe(1);
  });

  it('applies the same event id once and records noop on the replay', async () => {
    const harness = makeHarness();
    const first = await harness.deliver('subscription.created', subscriptionPayload(), {
      eventId: 'sim_evt_dup',
    });
    const second = await harness.deliver('subscription.created', subscriptionPayload(), {
      eventId: 'sim_evt_dup',
    });
    expect(first.result).toBe('applied');
    expect(second.result).toBe('noop');
    expect(second.note).toBe('duplicate_event_id');
    expect(await harness.inbox.list()).toHaveLength(1);
  });

  it('stores a forged delivery as rejected and grants nothing', async () => {
    const harness = makeHarness();
    const outcome = await harness.deliver('subscription.created', subscriptionPayload(), {
      secret: 'whsec_d3Jvbmctc2VjcmV0',
    });
    expect(outcome.signatureState).toBe('rejected');
    expect(outcome.result).toBe('noop');
    const row = await harness.inbox.get(outcome.providerEventId);
    expect(row?.signatureState).toBe('rejected');
    expect(await harness.subscriptions.list()).toHaveLength(0);
    expect(harness.changes).toHaveLength(0);
  });

  it('stores an unknown event type and takes no action, without throwing', async () => {
    const harness = makeHarness();
    const outcome = await harness.deliver('checkout.some_future_event', { id: 'x' });
    expect(outcome.result).toBe('noop');
    expect(outcome.known).toBe(false);
    expect(outcome.note).toBe('unknown_event_type');
    const row = await harness.inbox.get(outcome.providerEventId);
    expect(row?.result).toBe('noop');
  });

  it('marks a body that is not JSON as failed rather than crashing', async () => {
    const harness = makeHarness();
    const outcome = await harness.deliver('subscription.created', null, { body: 'not json' });
    expect(outcome.result).toBe('failed');
    expect(outcome.note).toBe('body_not_json');
  });

  it('alerts after three failures and never discards the row', async () => {
    expect(shouldAlertOnFailure(2)).toBe(false);
    expect(shouldAlertOnFailure(3)).toBe(true);
  });
});

describe('entitlement derivation from webhooks', () => {
  it('grants full access only after a verified subscription.created', async () => {
    const harness = makeHarness();
    const outcome = await harness.deliver('subscription.created', subscriptionPayload());
    expect(outcome.entitlementAfter?.state).toBe('full');
    expect(outcome.entitlementAfter?.verified).toBe(true);
    expect(harness.changes).toHaveLength(1);
    expect(harness.changes[0]?.after.state).toBe('full');

    const stored = await harness.subscriptions.getByWorkspaceId('ws_01');
    expect(stored?.source).toBe('webhook');
    expect(stored?.status).toBe('trialing');
  });

  it('resolves out of order updates to the latest modified_at', async () => {
    const harness = makeHarness();
    await harness.deliver(
      'subscription.updated',
      subscriptionPayload({ status: 'active', modified_at: '2026-08-11T14:00:00.000Z' }),
    );
    const older = await harness.deliver(
      'subscription.updated',
      subscriptionPayload({ status: 'trialing', modified_at: '2026-08-04T14:00:00.000Z' }),
    );
    expect(older.result).toBe('superseded');
    expect((await harness.subscriptions.getBySubscriptionId('sim_sub_000001'))?.status).toBe(
      'active',
    );
  });

  it('preserves when a payment first failed across later past_due updates', async () => {
    const harness = makeHarness();
    await harness.deliver(
      'subscription.updated',
      subscriptionPayload({ status: 'past_due', modified_at: '2026-08-11T14:00:00.000Z' }),
    );
    await harness.deliver(
      'subscription.updated',
      subscriptionPayload({ status: 'past_due', modified_at: '2026-08-14T14:00:00.000Z' }),
    );
    const stored = await harness.subscriptions.getBySubscriptionId('sim_sub_000001');
    expect(stored?.pastDueSince).toBe('2026-08-11T14:00:00.000Z');
  });

  it('fails cleanly when the workspace cannot be identified', async () => {
    const harness = makeHarness();
    const outcome = await harness.deliver(
      'subscription.created',
      subscriptionPayload({ metadata: {} }),
    );
    expect(outcome.result).toBe('failed');
    expect(outcome.note).toBe('workspace_not_identified');
  });

  it('routes order events to the affiliate hooks', async () => {
    const harness = makeHarness();
    await harness.deliver('subscription.created', subscriptionPayload());
    const paid = await harness.deliver('order.paid', {
      id: 'sim_order_000001',
      status: 'paid',
      paid: true,
      customer_id: 'sim_cust_000001',
      subscription_id: 'sim_sub_000001',
      product_id: 'sim_prod_monthly',
      subtotal_amount: 2_900,
      tax_amount: 0,
      total_amount: 2_900,
      refunded_amount: 0,
      currency: 'usd',
      billing_reason: 'subscription_create',
      created_at: NOW,
      modified_at: NOW,
    });
    expect(paid.result).toBe('applied');
    expect(harness.orders).toHaveLength(1);
    expect(harness.orders[0]?.workspaceId).toBe('ws_01');
    expect(harness.orders[0]?.order.totalMinor).toBe(2_900);
  });

  it('accepts benefit grant events without treating them as a second truth', async () => {
    const harness = makeHarness();
    const outcome = await harness.deliver('benefit_grant.created', {
      id: 'sim_grant_000001',
      benefit_id: 'sim_benefit_relay_standard',
      customer_id: 'sim_cust_000001',
      subscription_id: 'sim_sub_000001',
      is_granted: true,
      is_revoked: false,
      created_at: NOW,
      modified_at: NOW,
    });
    expect(outcome.result).toBe('applied');
    expect(outcome.entitlementAfter).toBeNull();
  });
});

describe('normalisation helpers', () => {
  it('reads the workspace from subscription metadata', () => {
    const subscription = polarSubscriptionSchema.parse(subscriptionPayload());
    expect(workspaceIdOf(subscription)).toBe('ws_01');
    expect(
      workspaceIdOf(polarSubscriptionSchema.parse(subscriptionPayload({ metadata: {} }))),
    ).toBeNull();
  });

  it('normalises a Polar subscription into the record entitlements derive from', () => {
    const subscription = polarSubscriptionSchema.parse(subscriptionPayload());
    const verified = toVerifiedSubscription({
      subscription,
      workspaceId: 'ws_01',
      source: 'webhook',
      verifiedAt: NOW,
      previous: null,
    });
    expect(verified.currency).toBe('USD');
    expect(verified.interval).toBe('month');
    expect(verified.source).toBe('webhook');
    expect(verified.pastDueSince).toBeNull();
  });

  it('collapses incomplete_expired onto incomplete', () => {
    const subscription = polarSubscriptionSchema.parse(
      subscriptionPayload({ status: 'incomplete_expired' }),
    );
    expect(subscription.status).toBe('incomplete');
  });
});
