import { describe, expect, it } from 'vitest';

import { RelayError } from '@relay/contracts';

import type { VerifiedSubscription } from './entitlements';
import { POLAR_TRIAL_REMINDER_DAY, RELAY_TRIAL_SUMMARY_DAY, TRIAL_DAYS } from './products';
import {
  TRIAL_DUE_TODAY_MINOR,
  assertTrialConfiguration,
  cancellationOutcome,
  computeTrialSchedule,
  polarReminderAlignmentIsValid,
  trialStatus,
} from './trial';

const CONFIRMED_AT = '2026-08-04T14:00:00.000Z';

describe('the seven day trial', () => {
  const monthly = computeTrialSchedule({ startedAt: CONFIRMED_AT, interval: 'month' });

  it('charges nothing today', () => {
    expect(monthly.dueTodayMinor).toBe(0);
    expect(TRIAL_DUE_TODAY_MINOR).toBe(0);
  });

  it('converts exactly seven days later, to the second', () => {
    expect(monthly.conversionAt).toBe('2026-08-11T14:00:00.000Z');
    expect(monthly.firstChargeAt).toBe(monthly.conversionAt);
    expect(monthly.trialDays).toBe(TRIAL_DAYS);
  });

  it('states the first charge and the renewal amount', () => {
    expect(monthly.firstChargeMinor).toBe(2_900);
    expect(monthly.renewalMinor).toBe(2_900);
    const annual = computeTrialSchedule({ startedAt: CONFIRMED_AT, interval: 'year' });
    expect(annual.firstChargeMinor).toBe(30_000);
    expect(annual.conversionAt).toBe('2026-08-11T14:00:00.000Z');
  });

  it('aligns with Polar reminding on day four and never contradicts it', () => {
    expect(monthly.polarReminderDay).toBe(POLAR_TRIAL_REMINDER_DAY);
    expect(monthly.polarReminderDay).toBe(4);
    expect(monthly.polarReminderAt).toBe('2026-08-08T14:00:00.000Z');
    expect(monthly.relaySummaryDay).toBe(RELAY_TRIAL_SUMMARY_DAY);
    expect(monthly.relaySummaryAt).toBe('2026-08-10T14:00:00.000Z');
    expect(polarReminderAlignmentIsValid(monthly)).toBe(true);
  });

  it('rejects a nonsense trial length', () => {
    expect(() =>
      computeTrialSchedule({ startedAt: CONFIRMED_AT, interval: 'month', trialDays: 0 }),
    ).toThrow(RelayError);
  });
});

describe('trial status', () => {
  const schedule = computeTrialSchedule({ startedAt: CONFIRMED_AT, interval: 'month' });

  it('reports days remaining rounded up, so the banner never undercounts', () => {
    expect(trialStatus(schedule, '2026-08-04T14:00:00.000Z').daysRemaining).toBe(7);
    expect(trialStatus(schedule, '2026-08-09T02:00:00.000Z').daysRemaining).toBe(3);
    expect(trialStatus(schedule, '2026-08-11T14:00:00.000Z').daysRemaining).toBe(0);
  });

  it('moves through the phases in order', () => {
    expect(trialStatus(schedule, '2026-08-05T00:00:00.000Z').phase).toBe('before_reminder');
    expect(trialStatus(schedule, '2026-08-08T15:00:00.000Z').phase).toBe('after_reminder');
    expect(trialStatus(schedule, '2026-08-10T15:00:00.000Z').phase).toBe('final_day');
    expect(trialStatus(schedule, '2026-08-12T00:00:00.000Z').phase).toBe('converted');
  });

  it('renders the first charge as an exact amount', () => {
    expect(trialStatus(schedule, CONFIRMED_AT).firstChargeText).toBe('$29.00');
  });
});

describe('the start-up trial configuration check', () => {
  it('passes when Polar and our config agree on seven days', () => {
    expect(() =>
      assertTrialConfiguration({
        polarTrialDays: 7,
        configuredTrialDays: 7,
        productId: 'sim_prod_monthly',
      }),
    ).not.toThrow();
  });

  it('fails loudly when the Polar product carries a different trial length', () => {
    expect(() =>
      assertTrialConfiguration({
        polarTrialDays: 14,
        configuredTrialDays: 7,
        productId: 'sim_prod_monthly',
      }),
    ).toThrow(RelayError);
    expect(() =>
      assertTrialConfiguration({
        polarTrialDays: null,
        configuredTrialDays: 7,
        productId: 'sim_prod_monthly',
      }),
    ).toThrow(RelayError);
  });
});

function subscription(overrides: Partial<VerifiedSubscription> = {}): VerifiedSubscription {
  return {
    subscriptionId: 'sim_sub_000001',
    workspaceId: 'ws_01',
    customerId: 'sim_cust_000001',
    productId: 'sim_prod_monthly',
    interval: 'month',
    status: 'trialing',
    amountMinor: 2_900,
    currency: 'USD',
    currentPeriodStart: CONFIRMED_AT,
    currentPeriodEnd: '2026-08-11T14:00:00.000Z',
    cancelAtPeriodEnd: false,
    canceledAt: null,
    trialStart: CONFIRMED_AT,
    trialEnd: '2026-08-11T14:00:00.000Z',
    endsAt: null,
    endedAt: null,
    modifiedAt: CONFIRMED_AT,
    pastDueSince: null,
    source: 'webhook',
    verifiedAt: CONFIRMED_AT,
    ...overrides,
  };
}

describe('cancellation', () => {
  it('confirms you will not be charged when cancelled before conversion', () => {
    const outcome = cancellationOutcome({
      subscription: subscription(),
      now: '2026-08-06T09:00:00.000Z',
    });
    expect(outcome.willNotBeCharged).toBe(true);
    expect(outcome.chargedSoFarMinor).toBe(0);
    expect(outcome.confirmationKey).toBe('billing.trial.canceled');
    expect(outcome.accessEndsAt).toBe('2026-08-11T14:00:00.000Z');
    expect(outcome.accessEndsAtDate).toBe('2026-08-11');
  });

  it('keeps access to the exact period end after a paid period', () => {
    const outcome = cancellationOutcome({
      subscription: subscription({
        status: 'active',
        trialEnd: '2026-08-11T14:00:00.000Z',
        currentPeriodStart: '2026-08-11T14:00:00.000Z',
        currentPeriodEnd: '2026-09-11T14:00:00.000Z',
      }),
      now: '2026-08-20T09:00:00.000Z',
    });
    expect(outcome.willNotBeCharged).toBe(false);
    expect(outcome.accessEndsAt).toBe('2026-09-11T14:00:00.000Z');
    expect(outcome.bodyKey).toBe('billing.cancel.afterTrial');
  });

  it('never requests a refund as a side effect of cancelling', () => {
    expect(
      cancellationOutcome({ subscription: subscription(), now: CONFIRMED_AT }).refundRequested,
    ).toBe(false);
  });
});
