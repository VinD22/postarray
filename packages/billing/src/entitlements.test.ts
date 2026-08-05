import { describe, expect, it } from 'vitest';

import { RelayError } from '@relay/contracts';
import type { SubscriptionStatus } from '@relay/contracts';

import {
  BILLING_ACTIONS,
  channelAllowanceExceeded,
  deriveEntitlement,
  entitlementError,
  evaluateEntitlement,
  isFullAccess,
  isVerifiedSource,
  scheduledPostDisposition,
} from './entitlements.js';
import type { EntitlementState, VerifiedSubscription } from './entitlements.js';
import { GRACE_PERIOD_DAYS } from './products.js';
import { addDays } from './time.js';

const NOW = '2026-08-11T14:00:00.000Z';

function subscription(overrides: Partial<VerifiedSubscription> = {}): VerifiedSubscription {
  return {
    subscriptionId: 'sim_sub_000001',
    workspaceId: 'ws_01',
    customerId: 'sim_cust_000001',
    productId: 'sim_prod_monthly',
    interval: 'month',
    status: 'active',
    amountMinor: 2_900,
    currency: 'USD',
    currentPeriodStart: '2026-08-11T14:00:00.000Z',
    currentPeriodEnd: '2026-09-11T14:00:00.000Z',
    cancelAtPeriodEnd: false,
    canceledAt: null,
    trialStart: null,
    trialEnd: null,
    endsAt: null,
    endedAt: null,
    modifiedAt: NOW,
    pastDueSince: null,
    source: 'webhook',
    verifiedAt: NOW,
    ...overrides,
  };
}

describe('the entitlement table', () => {
  const rows: ReadonlyArray<{
    name: string;
    subscription: VerifiedSubscription | null;
    now?: string;
    state: EntitlementState;
    publish: boolean;
  }> = [
    { name: 'no subscription', subscription: null, state: 'none', publish: false },
    {
      name: 'trialing',
      subscription: subscription({
        status: 'trialing',
        trialStart: '2026-08-04T14:00:00.000Z',
        trialEnd: '2026-08-11T14:00:00.000Z',
      }),
      now: '2026-08-08T14:00:00.000Z',
      state: 'full',
      publish: true,
    },
    { name: 'active', subscription: subscription(), state: 'full', publish: true },
    {
      name: 'past_due within grace',
      subscription: subscription({ status: 'past_due', pastDueSince: NOW }),
      now: addDays(NOW, 3),
      state: 'full_grace',
      publish: true,
    },
    {
      name: 'past_due after grace',
      subscription: subscription({ status: 'past_due', pastDueSince: NOW }),
      now: addDays(NOW, GRACE_PERIOD_DAYS + 1),
      state: 'read_only',
      publish: false,
    },
    {
      name: 'canceled before the trial ends',
      subscription: subscription({
        status: 'trialing',
        cancelAtPeriodEnd: true,
        canceledAt: NOW,
        trialStart: '2026-08-04T14:00:00.000Z',
        trialEnd: '2026-08-11T14:00:00.000Z',
        endsAt: '2026-08-11T14:00:00.000Z',
      }),
      now: '2026-08-08T14:00:00.000Z',
      state: 'full_until_period_end',
      publish: true,
    },
    {
      name: 'canceled after a paid period, still inside it',
      subscription: subscription({
        status: 'canceled',
        canceledAt: NOW,
        endsAt: '2026-09-11T14:00:00.000Z',
      }),
      state: 'full_until_period_end',
      publish: true,
    },
    {
      name: 'revoked, meaning canceled and ended',
      subscription: subscription({
        status: 'canceled',
        canceledAt: NOW,
        endsAt: NOW,
        endedAt: NOW,
      }),
      state: 'read_only',
      publish: false,
    },
    {
      name: 'unpaid',
      subscription: subscription({ status: 'unpaid' }),
      state: 'read_only',
      publish: false,
    },
    {
      name: 'incomplete',
      subscription: subscription({ status: 'incomplete' }),
      state: 'none',
      publish: false,
    },
  ];

  for (const row of rows) {
    it(`maps ${row.name} to ${row.state}`, () => {
      const snapshot = deriveEntitlement(row.subscription, { now: row.now ?? NOW });
      expect(snapshot.state).toBe(row.state);
      expect(snapshot.publishAllowed).toBe(row.publish);
      expect(snapshot.scheduleAllowed).toBe(row.publish);
      expect(snapshot.dispatchAllowed).toBe(row.publish);
      expect(snapshot.aiAllowed).toBe(row.publish);
      // Export is always available. Nothing is ever held hostage.
      expect(snapshot.exportAllowed).toBe(true);
    });
  }

  it('covers every subscription status the contracts package defines', () => {
    const statuses: readonly SubscriptionStatus[] = [
      'trialing',
      'active',
      'past_due',
      'canceled',
      'unpaid',
      'incomplete',
    ];
    for (const status of statuses) {
      const snapshot = deriveEntitlement(subscription({ status }), { now: NOW });
      expect(snapshot.state).toBeTypeOf('string');
    }
  });
});

describe('the redirect grants nothing', () => {
  it('derives none from a state observed on the success redirect', () => {
    const snapshot = deriveEntitlement(subscription({ source: 'redirect' }), { now: NOW });
    expect(snapshot.state).toBe('none');
    expect(snapshot.reason).toBe('unverified_source');
    expect(snapshot.verified).toBe(false);
  });

  it('accepts only webhook and reconciliation as evidence', () => {
    expect(isVerifiedSource('webhook')).toBe(true);
    expect(isVerifiedSource('reconciliation')).toBe(true);
    expect(isVerifiedSource('redirect')).toBe(false);
    expect(isVerifiedSource('unverified')).toBe(false);
  });
});

describe('grace period', () => {
  it('keeps publishing working for exactly the grace window, then flips', () => {
    const pastDue = subscription({ status: 'past_due', pastDueSince: NOW });
    for (let day = 0; day < GRACE_PERIOD_DAYS; day += 1) {
      const snapshot = deriveEntitlement(pastDue, { now: addDays(NOW, day) });
      expect(snapshot.state, `day ${day}`).toBe('full_grace');
      expect(snapshot.dispatchAllowed).toBe(true);
    }
    const after = deriveEntitlement(pastDue, { now: addDays(NOW, GRACE_PERIOD_DAYS) });
    expect(after.state).toBe('read_only');
    expect(after.dispatchAllowed).toBe(false);
    expect(after.readOnlyAt).toBe(addDays(NOW, GRACE_PERIOD_DAYS));
  });

  it('starts the clock when the payment first failed, not when a later webhook arrived', () => {
    const failedAt = '2026-08-01T00:00:00.000Z';
    const snapshot = deriveEntitlement(
      subscription({ status: 'past_due', pastDueSince: failedAt, modifiedAt: NOW }),
      { now: addDays(failedAt, GRACE_PERIOD_DAYS + 1) },
    );
    expect(snapshot.state).toBe('read_only');
  });
});

describe('evaluateEntitlement', () => {
  it('allows reading and exporting in every state', () => {
    for (const source of ['webhook', 'redirect'] as const) {
      for (const action of ['read', 'export', 'manage_billing'] as const) {
        expect(
          evaluateEntitlement(subscription({ status: 'unpaid', source }), action, { now: NOW })
            .effect,
        ).toBe('allow');
      }
    }
  });

  it('returns read_only, not deny, when the workspace is behind on payment', () => {
    const decision = evaluateEntitlement(subscription({ status: 'unpaid' }), 'publish_post', {
      now: NOW,
    });
    expect(decision.effect).toBe('read_only');
    expect(decision.reason).toBe('unpaid');
    expect(decision.messageKey).toBe('error.payment_required.message');
  });

  it('denies when there is no subscription at all', () => {
    expect(evaluateEntitlement(null, 'publish_post', { now: NOW }).effect).toBe('deny');
  });

  it('keeps analytics readable in read only', () => {
    expect(
      evaluateEntitlement(subscription({ status: 'unpaid' }), 'analytics_read', { now: NOW })
        .effect,
    ).toBe('allow');
  });

  it('denies a thirty first channel and never disconnects one', () => {
    const decision = evaluateEntitlement(subscription(), 'connect_channel', {
      now: NOW,
      activeChannelCount: 30,
    });
    expect(decision.effect).toBe('deny');
    expect(decision.reason).toBe('channel_allowance_exceeded');
    expect(channelAllowanceExceeded(31)).toBe(true);
    expect(channelAllowanceExceeded(30)).toBe(false);
  });

  it('produces a RelayError with a code and a message key', () => {
    const decision = evaluateEntitlement(null, 'publish_post', { now: NOW });
    const error = entitlementError(decision);
    expect(error).toBeInstanceOf(RelayError);
    expect(error.code).toBe('PAYMENT_REQUIRED');
    expect(error.messageKey).toBe('error.payment_required.message');
  });

  it('has an outcome for every declared action', () => {
    for (const action of BILLING_ACTIONS) {
      const decision = evaluateEntitlement(subscription(), action, { now: NOW });
      expect(['allow', 'deny', 'read_only']).toContain(decision.effect);
    }
  });
});

describe('scheduled work when a workspace stops paying', () => {
  it('pauses rather than dispatching or deleting', () => {
    expect(scheduledPostDisposition('full')).toBe('dispatch');
    expect(scheduledPostDisposition('full_grace')).toBe('dispatch');
    expect(scheduledPostDisposition('full_until_period_end')).toBe('dispatch');
    expect(scheduledPostDisposition('read_only')).toBe('pause_by_billing');
    expect(scheduledPostDisposition('none')).toBe('pause_by_billing');
  });

  it('has no cancel or delete outcome at all', () => {
    const outcomes = (
      ['full', 'full_grace', 'full_until_period_end', 'read_only', 'none'] as const
    ).map((state) => scheduledPostDisposition(state));
    expect(outcomes).not.toContain('cancel');
    expect(outcomes).not.toContain('delete');
  });

  it('classifies full access states consistently', () => {
    expect(isFullAccess('full')).toBe(true);
    expect(isFullAccess('read_only')).toBe(false);
  });
});
