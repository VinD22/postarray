import { describe, expect, it } from 'vitest';

import { RelayError } from '@relay/contracts';

import {
  AFFILIATE_TERMS,
  InMemoryCommissionLedger,
  accrueCommission,
  attributeReferral,
  buildPayoutBatch,
  commissionBalance,
  evaluateFraudTriggers,
  isWithinCommissionWindow,
  reverseCommission,
} from './affiliate.js';
import type { CommissionLedgerEntry, ReferralAttribution } from './affiliate.js';

const SIGNUP_AT = '2026-08-04T14:00:00.000Z';
const FIRST_CHARGE_AT = '2026-08-11T14:00:00.000Z';

const attribution: ReferralAttribution = {
  referralId: 'ref_0001',
  partnerId: 'aff_partner_a',
  workspaceId: 'ws_01',
  channel: 'referral_link',
  touchedAt: '2026-08-03T10:00:00.000Z',
  attributedAt: SIGNUP_AT,
  immutable: true,
};

describe('affiliate terms', () => {
  it('is 20% of net revenue for twelve months, held for 45 days', () => {
    expect(AFFILIATE_TERMS.commissionBasisPoints).toBe(2_000);
    expect(AFFILIATE_TERMS.durationMonths).toBe(12);
    expect(AFFILIATE_TERMS.basis).toBe('net_revenue');
    expect(AFFILIATE_TERMS.holdDays).toBe(45);
  });

  it('is never conditional on a positive review', () => {
    expect(AFFILIATE_TERMS.reviewConditional).toBe(false);
  });

  it('never accrues during a trial', () => {
    expect(AFFILIATE_TERMS.accruesDuringTrial).toBe(false);
  });
});

describe('attribution', () => {
  it('takes the last non-direct touch inside the window', () => {
    const result = attributeReferral({
      referralId: 'ref_0001',
      workspaceId: 'ws_01',
      signupAt: SIGNUP_AT,
      touches: [
        {
          partnerId: 'aff_partner_a',
          channel: 'partner_content',
          occurredAt: '2026-07-20T00:00:00.000Z',
        },
        {
          partnerId: 'aff_partner_b',
          channel: 'referral_link',
          occurredAt: '2026-08-03T10:00:00.000Z',
        },
        { partnerId: 'aff_partner_b', channel: 'direct', occurredAt: '2026-08-04T13:00:00.000Z' },
      ],
    });
    expect(result.attributed).toBe(true);
    if (result.attributed) {
      expect(result.attribution.partnerId).toBe('aff_partner_b');
      expect(result.attribution.immutable).toBe(true);
    }
  });

  it('ignores touches older than the sixty day window', () => {
    const result = attributeReferral({
      referralId: 'ref_0002',
      workspaceId: 'ws_01',
      signupAt: SIGNUP_AT,
      touches: [
        {
          partnerId: 'aff_partner_a',
          channel: 'referral_link',
          occurredAt: '2026-01-01T00:00:00.000Z',
        },
      ],
    });
    expect(result).toEqual({ attributed: false, refusal: 'outside_window' });
  });

  it('attributes nothing when every touch was direct', () => {
    const result = attributeReferral({
      referralId: 'ref_0003',
      workspaceId: 'ws_01',
      signupAt: SIGNUP_AT,
      touches: [
        { partnerId: 'aff_partner_a', channel: 'direct', occurredAt: '2026-08-01T00:00:00.000Z' },
      ],
    });
    expect(result).toEqual({ attributed: false, refusal: 'direct_only' });
  });

  it('blocks self-referral at attribution time', () => {
    const result = attributeReferral({
      referralId: 'ref_0004',
      workspaceId: 'ws_01',
      signupAt: SIGNUP_AT,
      touches: [
        {
          partnerId: 'aff_partner_a',
          channel: 'referral_link',
          occurredAt: '2026-08-02T00:00:00.000Z',
        },
      ],
      partnerAdministeredWorkspaceIds: { aff_partner_a: ['ws_01', 'ws_02'] },
    });
    expect(result).toEqual({ attributed: false, refusal: 'self_referral' });
  });
});

describe('accrual', () => {
  it('accrues nothing while the order is unpaid, which is the whole trial', () => {
    const result = accrueCommission({
      entryIdPrefix: 'entry_1',
      attribution,
      orderId: 'sim_order_1',
      orderPaid: false,
      orderTotalMinor: 2_900,
      orderRefundedMinor: 0,
      polarFeeMinor: 212,
      firstPaidChargeAt: FIRST_CHARGE_AT,
      occurredAt: FIRST_CHARGE_AT,
    });
    expect(result.accrued).toBe(false);
    expect(result.reason).toBe('not_paid');
    expect(result.entries).toHaveLength(0);
  });

  it('accrues 20% of net revenue on the first successful charge', () => {
    const result = accrueCommission({
      entryIdPrefix: 'entry_2',
      attribution,
      orderId: 'sim_order_2',
      orderPaid: true,
      orderTotalMinor: 2_900,
      orderRefundedMinor: 0,
      polarFeeMinor: 212,
      firstPaidChargeAt: FIRST_CHARGE_AT,
      occurredAt: FIRST_CHARGE_AT,
    });
    expect(result.accrued).toBe(true);
    expect(result.netRevenueMinor).toBe(2_688);
    expect(result.commissionMinor).toBe(538);
    expect(result.entries.map((entry) => entry.entryType)).toEqual(['accrual', 'hold']);
    expect(result.entries[0]?.holdUntil).toBe('2026-09-25T14:00:00.000Z');
  });

  it('stops accruing after the twelve month window', () => {
    expect(isWithinCommissionWindow(FIRST_CHARGE_AT, '2027-08-10T14:00:00.000Z')).toBe(true);
    expect(isWithinCommissionWindow(FIRST_CHARGE_AT, '2027-08-12T14:00:00.000Z')).toBe(false);
    const result = accrueCommission({
      entryIdPrefix: 'entry_3',
      attribution,
      orderId: 'sim_order_3',
      orderPaid: true,
      orderTotalMinor: 2_900,
      orderRefundedMinor: 0,
      polarFeeMinor: 212,
      firstPaidChargeAt: FIRST_CHARGE_AT,
      occurredAt: '2027-09-11T14:00:00.000Z',
    });
    expect(result.reason).toBe('outside_commission_window');
  });

  it('never pays commission on money we did not receive', () => {
    const result = accrueCommission({
      entryIdPrefix: 'entry_4',
      attribution,
      orderId: 'sim_order_4',
      orderPaid: true,
      orderTotalMinor: 2_900,
      orderRefundedMinor: 2_900,
      polarFeeMinor: 212,
      firstPaidChargeAt: FIRST_CHARGE_AT,
      occurredAt: FIRST_CHARGE_AT,
    });
    expect(result.reason).toBe('no_net_revenue');
  });
});

describe('the ledger', () => {
  async function seedLedger() {
    const ledger = new InMemoryCommissionLedger();
    const accrual = accrueCommission({
      entryIdPrefix: 'entry_5',
      attribution,
      orderId: 'sim_order_5',
      orderPaid: true,
      orderTotalMinor: 2_900,
      orderRefundedMinor: 0,
      polarFeeMinor: 212,
      firstPaidChargeAt: FIRST_CHARGE_AT,
      occurredAt: FIRST_CHARGE_AT,
    });
    for (const entry of accrual.entries) {
      await ledger.append(entry);
    }
    return { ledger, accrual };
  }

  it('exposes no update and no delete', () => {
    const ledger = new InMemoryCommissionLedger();
    const surface = ledger as unknown as Record<string, unknown>;
    expect(surface.update).toBeUndefined();
    expect(surface.delete).toBeUndefined();
    expect(surface.remove).toBeUndefined();
  });

  it('rejects appending the same entry id twice rather than overwriting', async () => {
    const { ledger, accrual } = await seedLedger();
    const first = accrual.entries[0];
    expect(first).toBeDefined();
    if (first !== undefined) {
      await expect(ledger.append(first)).rejects.toBeInstanceOf(RelayError);
    }
  });

  it('requires two approvers for a manual adjustment', async () => {
    const ledger = new InMemoryCommissionLedger();
    const adjustment: CommissionLedgerEntry = {
      id: 'entry_adjust_1',
      partnerId: 'aff_partner_a',
      referralId: 'ref_0001',
      workspaceId: 'ws_01',
      orderId: null,
      entryType: 'adjustment',
      amountMinor: 100,
      currency: 'USD',
      createdAt: FIRST_CHARGE_AT,
      holdUntil: null,
      reason: 'support_goodwill',
      approverIds: ['user_a'],
    };
    await expect(ledger.append(adjustment)).rejects.toBeInstanceOf(RelayError);
    await expect(
      ledger.append({ ...adjustment, approverIds: ['user_a', 'user_b'] }),
    ).resolves.toBeUndefined();
  });

  it('nets an accrual to zero through a reversal without mutating the accrual', async () => {
    const { ledger, accrual } = await seedLedger();
    const accrualEntry = accrual.entries[0];
    expect(accrualEntry).toBeDefined();
    if (accrualEntry === undefined) {
      return;
    }
    await ledger.append(
      reverseCommission({
        entryId: 'entry_5_reversal',
        accrual: accrualEntry,
        kind: 'reversal_refund',
        occurredAt: '2026-08-20T14:00:00.000Z',
        reason: 'order_refunded',
      }),
    );

    const entries = await ledger.list({ partnerId: 'aff_partner_a' });
    const balance = commissionBalance(entries, '2026-10-01T00:00:00.000Z');
    expect(balance.totalMinor).toBe(0);
    expect(balance.payableMinor).toBe(0);

    const stillThere = entries.find((entry) => entry.id === accrualEntry.id);
    expect(stillThere?.amountMinor).toBe(538);
    expect(stillThere?.entryType).toBe('accrual');
  });

  it('holds a commission until the refund window closes', async () => {
    const { ledger } = await seedLedger();
    const entries = await ledger.list();
    const duringHold = commissionBalance(entries, '2026-09-01T00:00:00.000Z');
    expect(duringHold.heldMinor).toBe(538);
    expect(duringHold.payableMinor).toBe(0);

    const afterHold = commissionBalance(entries, '2026-10-01T00:00:00.000Z');
    expect(afterHold.heldMinor).toBe(0);
    expect(afterHold.payableMinor).toBe(538);
  });
});

describe('fraud review', () => {
  const clean = {
    referralsInLast24Hours: 3,
    referralsTotal: 20,
    referralsCanceledInTrial: 2,
    referralsSharingPartnerEmailDomain: 0,
    referredWorkspacesInactiveAtDay30: 0,
    chargebacks: 0,
  };

  it('holds nothing for an ordinary partner', () => {
    const review = evaluateFraudTriggers(clean);
    expect(review.hold).toBe(false);
    expect(review.triggered).toHaveLength(0);
  });

  it('holds on a referral burst', () => {
    expect(evaluateFraudTriggers({ ...clean, referralsInLast24Hours: 21 }).triggered).toContain(
      'referral_burst',
    );
  });

  it('holds when more than 30% cancel inside the trial', () => {
    expect(evaluateFraudTriggers({ ...clean, referralsCanceledInTrial: 7 }).triggered).toContain(
      'trial_cancel_rate',
    );
    expect(
      evaluateFraudTriggers({ ...clean, referralsCanceledInTrial: 6 }).triggered,
    ).not.toContain('trial_cancel_rate');
  });

  it('holds on a shared email domain, inactive workspaces and chargebacks', () => {
    expect(
      evaluateFraudTriggers({ ...clean, referralsSharingPartnerEmailDomain: 1 }).triggered,
    ).toContain('shared_email_domain');
    expect(
      evaluateFraudTriggers({ ...clean, referredWorkspacesInactiveAtDay30: 4 }).triggered,
    ).toContain('inactive_referred_workspaces');
    expect(evaluateFraudTriggers({ ...clean, chargebacks: 1 }).triggered).toContain('chargeback');
  });

  it('always offers an appeal and a resolution deadline', () => {
    const review = evaluateFraudTriggers({ ...clean, chargebacks: 1 });
    expect(review.appealAvailable).toBe(true);
    expect(review.resolveWithinBusinessDays).toBe(10);
    expect(review.reasonCategories).toEqual(review.triggered);
  });
});

describe('payout batches', () => {
  async function ledgerWithAccrual() {
    const ledger = new InMemoryCommissionLedger();
    const accrual = accrueCommission({
      entryIdPrefix: 'entry_payout',
      attribution,
      orderId: 'sim_order_payout',
      orderPaid: true,
      orderTotalMinor: 2_900,
      orderRefundedMinor: 0,
      polarFeeMinor: 212,
      firstPaidChargeAt: FIRST_CHARGE_AT,
      occurredAt: FIRST_CHARGE_AT,
    });
    for (const entry of accrual.entries) {
      await ledger.append(entry);
    }
    return ledger;
  }

  it('skips entries still inside their hold window', async () => {
    const ledger = await ledgerWithAccrual();
    const result = buildPayoutBatch({
      batchId: 'batch_1',
      entryId: 'entry_payout_1',
      partnerId: 'aff_partner_a',
      periodStart: '2026-08-01T00:00:00.000Z',
      periodEnd: '2026-08-31T23:59:59.000Z',
      entries: await ledger.list(),
      now: '2026-09-01T00:00:00.000Z',
    });
    expect(result.skippedForHold).toHaveLength(1);
    expect(result.payoutEntry).toBeNull();
    expect(result.batch.amountMinor).toBe(0);
  });

  it('pays out once the hold has passed', async () => {
    const ledger = await ledgerWithAccrual();
    const result = buildPayoutBatch({
      batchId: 'batch_2',
      entryId: 'entry_payout_2',
      partnerId: 'aff_partner_a',
      periodStart: '2026-09-01T00:00:00.000Z',
      periodEnd: '2026-09-30T23:59:59.000Z',
      entries: await ledger.list(),
      now: '2026-10-01T00:00:00.000Z',
    });
    expect(result.payoutEntry?.amountMinor).toBe(-538);
    expect(result.batch.state).toBe('approved');
    expect(result.skippedForFraudReview).toBe(false);
  });

  it('pays nothing while a partner is under fraud review', async () => {
    const ledger = await ledgerWithAccrual();
    const result = buildPayoutBatch({
      batchId: 'batch_3',
      entryId: 'entry_payout_3',
      partnerId: 'aff_partner_a',
      periodStart: '2026-09-01T00:00:00.000Z',
      periodEnd: '2026-09-30T23:59:59.000Z',
      entries: await ledger.list(),
      now: '2026-10-01T00:00:00.000Z',
      fraudReview: evaluateFraudTriggers({
        referralsInLast24Hours: 30,
        referralsTotal: 30,
        referralsCanceledInTrial: 0,
        referralsSharingPartnerEmailDomain: 0,
        referredWorkspacesInactiveAtDay30: 0,
        chargebacks: 0,
      }),
    });
    expect(result.skippedForFraudReview).toBe(true);
    expect(result.batch.state).toBe('draft');
    expect(result.payoutEntry).toBeNull();
  });
});
