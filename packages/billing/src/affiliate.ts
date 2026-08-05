import { z } from 'zod';

import { RelayError } from '@relay/contracts';

import { BILLING_MESSAGE_KEYS } from './messages.js';
import { USD, applyBasisPoints } from './money.js';
import { addDays, addMonths, differenceDays, isAfter, isAtOrAfter, isBefore } from './time.js';

/**
 * Referral attribution, the commission ledger and payout batches.
 *
 * Three rules are non negotiable and are enforced here rather than in a policy
 * document: commission is never conditional on a positive review, a partner can
 * never earn on a workspace they own or administer, and the ledger is append
 * only, so a correction is always a new compensating entry.
 */

export const AFFILIATE_TERMS = Object.freeze({
  /** 20% recurring, which keeps the referred cohort above the 55% margin floor. */
  commissionBasisPoints: 2_000,
  /** Twelve months from the referred subscription's first paid charge. */
  durationMonths: 12,
  /** Net revenue: paid amount minus Polar fees and any refund. */
  basis: 'net_revenue' as const,
  /** No commission during the trial. Prevents card-collection farming. */
  accruesDuringTrial: false,
  /** Covers the refund and chargeback window. */
  holdDays: 45,
  /** Last non-direct touch within this window, stored at signup. */
  attributionWindowDays: 60,
  attributionModel: 'last_non_direct' as const,
  selfReferralAllowed: false,
  /** Never conditional on a positive review, rating or endorsement. */
  reviewConditional: false,
  /** Referred subscriptions are capped at this share of new subscriptions. */
  newSubscriptionSharePercent: 30,
  /** Referred-cohort gross margin must stay above this. */
  cohortMarginFloorBasisPoints: 5_500,
  disclosureKey: 'billing.referral.disclosure',
});

export const REFERRAL_CHANNELS = [
  'direct',
  'referral_link',
  'partner_content',
  'partner_email',
  'partner_event',
] as const;
export const referralChannelSchema = z.enum(REFERRAL_CHANNELS);
export type ReferralChannel = z.infer<typeof referralChannelSchema>;

export interface ReferralTouch {
  readonly partnerId: string;
  readonly channel: ReferralChannel;
  readonly occurredAt: string;
}

export const ATTRIBUTION_REFUSALS = [
  'no_touch',
  'outside_window',
  'direct_only',
  'self_referral',
] as const;
export type AttributionRefusal = (typeof ATTRIBUTION_REFUSALS)[number];

export interface ReferralAttribution {
  readonly referralId: string;
  readonly partnerId: string;
  readonly workspaceId: string;
  readonly channel: ReferralChannel;
  readonly touchedAt: string;
  readonly attributedAt: string;
  /** Written once at signup. There is no re-attribution path. */
  readonly immutable: true;
}

export interface AttributeReferralInput {
  readonly referralId: string;
  readonly workspaceId: string;
  readonly signupAt: string;
  readonly touches: readonly ReferralTouch[];
  /** Workspaces the candidate partner owns or administers. Blocks self-referral. */
  readonly partnerAdministeredWorkspaceIds?: Readonly<Record<string, readonly string[]>>;
  readonly windowDays?: number;
}

export type AttributionResult =
  | { readonly attributed: true; readonly attribution: ReferralAttribution }
  | { readonly attributed: false; readonly refusal: AttributionRefusal };

/**
 * Last non-direct touch within the window, stored at signup and immutable
 * afterwards. Simple, explainable, and not gameable by re-clicking a link.
 */
export function attributeReferral(input: AttributeReferralInput): AttributionResult {
  if (input.touches.length === 0) {
    return { attributed: false, refusal: 'no_touch' };
  }
  const windowDays = input.windowDays ?? AFFILIATE_TERMS.attributionWindowDays;
  const windowStart = addDays(input.signupAt, -windowDays);
  const inWindow = input.touches.filter(
    (touch) =>
      isAtOrAfter(touch.occurredAt, windowStart) && !isAfter(touch.occurredAt, input.signupAt),
  );
  if (inWindow.length === 0) {
    return { attributed: false, refusal: 'outside_window' };
  }
  const nonDirect = inWindow.filter((touch) => touch.channel !== 'direct');
  if (nonDirect.length === 0) {
    return { attributed: false, refusal: 'direct_only' };
  }
  let latest = nonDirect[0];
  if (latest === undefined) {
    return { attributed: false, refusal: 'direct_only' };
  }
  for (const touch of nonDirect) {
    if (isAfter(touch.occurredAt, latest.occurredAt)) {
      latest = touch;
    }
  }
  const administered = input.partnerAdministeredWorkspaceIds?.[latest.partnerId] ?? [];
  if (administered.includes(input.workspaceId)) {
    return { attributed: false, refusal: 'self_referral' };
  }
  return {
    attributed: true,
    attribution: {
      referralId: input.referralId,
      partnerId: latest.partnerId,
      workspaceId: input.workspaceId,
      channel: latest.channel,
      touchedAt: latest.occurredAt,
      attributedAt: input.signupAt,
      immutable: true,
    },
  };
}

export const LEDGER_ENTRY_TYPES = [
  'accrual',
  'hold',
  'release',
  'reversal_refund',
  'reversal_chargeback',
  'reversal_fraud',
  'payout',
  'adjustment',
] as const;
export const ledgerEntryTypeSchema = z.enum(LEDGER_ENTRY_TYPES);
export type LedgerEntryType = z.infer<typeof ledgerEntryTypeSchema>;

/** Entry types that move money. `hold` and `release` are informational. */
export const MONETARY_ENTRY_TYPES: readonly LedgerEntryType[] = Object.freeze([
  'accrual',
  'reversal_refund',
  'reversal_chargeback',
  'reversal_fraud',
  'payout',
  'adjustment',
]);

export interface CommissionLedgerEntry {
  readonly id: string;
  readonly partnerId: string;
  readonly referralId: string;
  readonly workspaceId: string;
  readonly orderId: string | null;
  readonly entryType: LedgerEntryType;
  /** Signed minor units. Reversals and payouts are negative. */
  readonly amountMinor: number;
  readonly currency: string;
  readonly createdAt: string;
  /** Set on `accrual` and `hold`. Payable once the hold has passed. */
  readonly holdUntil: string | null;
  readonly reason: string | null;
  /** Manual adjustments require two approvers. */
  readonly approverIds: readonly string[];
}

/**
 * The ledger port has an append and a read. There is deliberately no update and
 * no delete, matching the `INSERT`-only grant and the trigger in the database.
 */
export interface CommissionLedger {
  append(entry: CommissionLedgerEntry): Promise<void>;
  list(filter?: {
    partnerId?: string;
    referralId?: string;
  }): Promise<readonly CommissionLedgerEntry[]>;
}

export class InMemoryCommissionLedger implements CommissionLedger {
  private readonly entries: CommissionLedgerEntry[] = [];
  private readonly seen = new Set<string>();

  async append(entry: CommissionLedgerEntry): Promise<void> {
    if (entry.entryType === 'adjustment' && entry.approverIds.length < 2) {
      throw new RelayError('FORBIDDEN', {
        messageKey: BILLING_MESSAGE_KEYS.forbidden,
        details: { entryType: entry.entryType, approvers: entry.approverIds.length },
      });
    }
    if (this.seen.has(entry.id)) {
      // Appending the same entry id twice is a duplicate, never an overwrite.
      throw new RelayError('CONFLICT', {
        messageKey: BILLING_MESSAGE_KEYS.conflict,
        details: { entryId: entry.id },
      });
    }
    this.seen.add(entry.id);
    this.entries.push(
      Object.freeze({ ...entry, approverIds: Object.freeze([...entry.approverIds]) }),
    );
  }

  async list(
    filter: { partnerId?: string; referralId?: string } = {},
  ): Promise<readonly CommissionLedgerEntry[]> {
    return this.entries.filter(
      (entry) =>
        (filter.partnerId === undefined || entry.partnerId === filter.partnerId) &&
        (filter.referralId === undefined || entry.referralId === filter.referralId),
    );
  }
}

export interface AccrueCommissionInput {
  readonly entryIdPrefix: string;
  readonly attribution: ReferralAttribution;
  readonly orderId: string;
  readonly orderPaid: boolean;
  readonly orderTotalMinor: number;
  readonly orderRefundedMinor: number;
  readonly polarFeeMinor: number;
  readonly currency?: string;
  readonly firstPaidChargeAt: string;
  readonly occurredAt: string;
  readonly holdDays?: number;
}

export interface AccrualResult {
  readonly accrued: boolean;
  readonly reason: 'accrued' | 'not_paid' | 'outside_commission_window' | 'no_net_revenue';
  readonly netRevenueMinor: number;
  readonly commissionMinor: number;
  readonly entries: readonly CommissionLedgerEntry[];
}

/** True while the referred subscription is inside its 12 month window. */
export function isWithinCommissionWindow(
  firstPaidChargeAt: string,
  at: string,
  months: number = AFFILIATE_TERMS.durationMonths,
): boolean {
  return isBefore(at, addMonths(firstPaidChargeAt, months));
}

/**
 * Commission accrues on a successful charge only, never during the trial, and
 * only on money we actually received: the paid amount minus Polar's fee minus
 * any refund already applied to that order.
 */
export function accrueCommission(input: AccrueCommissionInput): AccrualResult {
  const currency = input.currency ?? USD;
  if (!input.orderPaid) {
    return {
      accrued: false,
      reason: 'not_paid',
      netRevenueMinor: 0,
      commissionMinor: 0,
      entries: [],
    };
  }
  if (!isWithinCommissionWindow(input.firstPaidChargeAt, input.occurredAt)) {
    return {
      accrued: false,
      reason: 'outside_commission_window',
      netRevenueMinor: 0,
      commissionMinor: 0,
      entries: [],
    };
  }
  const netRevenueMinor = Math.max(
    0,
    input.orderTotalMinor - input.polarFeeMinor - input.orderRefundedMinor,
  );
  if (netRevenueMinor === 0) {
    return {
      accrued: false,
      reason: 'no_net_revenue',
      netRevenueMinor: 0,
      commissionMinor: 0,
      entries: [],
    };
  }
  const commissionMinor = applyBasisPoints(netRevenueMinor, AFFILIATE_TERMS.commissionBasisPoints);
  const holdUntil = addDays(input.occurredAt, input.holdDays ?? AFFILIATE_TERMS.holdDays);
  const base = {
    partnerId: input.attribution.partnerId,
    referralId: input.attribution.referralId,
    workspaceId: input.attribution.workspaceId,
    orderId: input.orderId,
    currency,
    createdAt: input.occurredAt,
    approverIds: [] as readonly string[],
  };
  return {
    accrued: true,
    reason: 'accrued',
    netRevenueMinor,
    commissionMinor,
    entries: [
      {
        ...base,
        id: `${input.entryIdPrefix}_accrual`,
        entryType: 'accrual',
        amountMinor: commissionMinor,
        holdUntil,
        reason: null,
      },
      {
        ...base,
        id: `${input.entryIdPrefix}_hold`,
        entryType: 'hold',
        amountMinor: 0,
        holdUntil,
        reason: 'refund_and_chargeback_window',
      },
    ],
  };
}

export type ReversalKind = 'reversal_refund' | 'reversal_chargeback' | 'reversal_fraud';

/**
 * A reversal is a new compensating entry. The original accrual is never edited
 * and never deleted, so the history of what we owed and why stays readable.
 */
export function reverseCommission(input: {
  entryId: string;
  accrual: CommissionLedgerEntry;
  kind: ReversalKind;
  amountMinor?: number;
  occurredAt: string;
  reason: string;
}): CommissionLedgerEntry {
  const amount = Math.min(
    input.amountMinor ?? input.accrual.amountMinor,
    input.accrual.amountMinor,
  );
  return {
    id: input.entryId,
    partnerId: input.accrual.partnerId,
    referralId: input.accrual.referralId,
    workspaceId: input.accrual.workspaceId,
    orderId: input.accrual.orderId,
    entryType: input.kind,
    amountMinor: -amount,
    currency: input.accrual.currency,
    createdAt: input.occurredAt,
    holdUntil: null,
    reason: input.reason,
    approverIds: [],
  };
}

export interface CommissionBalance {
  readonly currency: string;
  /** Sum over every monetary entry. Never a stored mutable number. */
  readonly totalMinor: number;
  /** Accruals whose hold has expired and which have not been reversed. */
  readonly payableMinor: number;
  readonly heldMinor: number;
  readonly paidOutMinor: number;
}

export function commissionBalance(
  entries: readonly CommissionLedgerEntry[],
  now: string,
  currency: string = USD,
): CommissionBalance {
  let total = 0;
  let payable = 0;
  let held = 0;
  let paidOut = 0;
  const reversedByOrder = new Map<string, number>();

  for (const entry of entries) {
    if (
      entry.entryType === 'reversal_refund' ||
      entry.entryType === 'reversal_chargeback' ||
      entry.entryType === 'reversal_fraud'
    ) {
      const key = entry.orderId ?? entry.referralId;
      reversedByOrder.set(key, (reversedByOrder.get(key) ?? 0) + Math.abs(entry.amountMinor));
    }
  }

  for (const entry of entries) {
    if (MONETARY_ENTRY_TYPES.includes(entry.entryType)) {
      total += entry.amountMinor;
    }
    if (entry.entryType === 'payout') {
      paidOut += Math.abs(entry.amountMinor);
    }
    if (entry.entryType !== 'accrual') {
      continue;
    }
    const key = entry.orderId ?? entry.referralId;
    const net = Math.max(0, entry.amountMinor - (reversedByOrder.get(key) ?? 0));
    if (entry.holdUntil !== null && isBefore(now, entry.holdUntil)) {
      held += net;
    } else {
      payable += net;
    }
  }

  return {
    currency,
    totalMinor: total,
    payableMinor: Math.max(0, payable - paidOut),
    heldMinor: held,
    paidOutMinor: paidOut,
  };
}

export const FRAUD_TRIGGERS = [
  'referral_burst',
  'trial_cancel_rate',
  'shared_email_domain',
  'inactive_referred_workspaces',
  'chargeback',
] as const;
export type FraudTrigger = (typeof FRAUD_TRIGGERS)[number];

export const FRAUD_THRESHOLDS = Object.freeze({
  referralsPer24Hours: 20,
  trialCancelRateBasisPoints: 3_000,
  inactiveAtDay: 30,
  reviewWithinBusinessDays: 10,
});

export interface FraudSignals {
  readonly referralsInLast24Hours: number;
  readonly referralsTotal: number;
  readonly referralsCanceledInTrial: number;
  readonly referralsSharingPartnerEmailDomain: number;
  readonly referredWorkspacesInactiveAtDay30: number;
  readonly chargebacks: number;
}

export interface FraudReview {
  readonly triggered: readonly FraudTrigger[];
  readonly hold: boolean;
  /** Shown to the partner. We state what is held and why; we do not accuse. */
  readonly reasonCategories: readonly FraudTrigger[];
  readonly appealAvailable: true;
  readonly resolveWithinBusinessDays: number;
}

/** The automatic holds in section 9.3. Each one requires a human decision. */
export function evaluateFraudTriggers(signals: FraudSignals): FraudReview {
  const triggered: FraudTrigger[] = [];
  if (signals.referralsInLast24Hours > FRAUD_THRESHOLDS.referralsPer24Hours) {
    triggered.push('referral_burst');
  }
  if (
    signals.referralsTotal > 0 &&
    (signals.referralsCanceledInTrial * 10_000) / signals.referralsTotal >
      FRAUD_THRESHOLDS.trialCancelRateBasisPoints
  ) {
    triggered.push('trial_cancel_rate');
  }
  if (signals.referralsSharingPartnerEmailDomain > 0) {
    triggered.push('shared_email_domain');
  }
  if (signals.referredWorkspacesInactiveAtDay30 > 0) {
    triggered.push('inactive_referred_workspaces');
  }
  if (signals.chargebacks > 0) {
    triggered.push('chargeback');
  }
  return {
    triggered,
    hold: triggered.length > 0,
    reasonCategories: triggered,
    appealAvailable: true,
    resolveWithinBusinessDays: FRAUD_THRESHOLDS.reviewWithinBusinessDays,
  };
}

export const PAYOUT_BATCH_STATES = ['draft', 'approved', 'paid', 'failed'] as const;
export type PayoutBatchState = (typeof PAYOUT_BATCH_STATES)[number];

export interface PayoutBatch {
  readonly id: string;
  readonly partnerId: string;
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly entryIds: readonly string[];
  readonly amountMinor: number;
  readonly currency: string;
  readonly state: PayoutBatchState;
  readonly createdAt: string;
}

export interface BuildPayoutBatchResult {
  readonly batch: PayoutBatch;
  /** The negative ledger entry that records the payout. */
  readonly payoutEntry: CommissionLedgerEntry | null;
  readonly skippedForHold: readonly string[];
  readonly skippedForFraudReview: boolean;
}

/**
 * Assemble a payout. Entries still inside their hold window are skipped, and a
 * partner under fraud review is skipped entirely with the reason visible to
 * them.
 */
export function buildPayoutBatch(input: {
  batchId: string;
  entryId: string;
  partnerId: string;
  periodStart: string;
  periodEnd: string;
  entries: readonly CommissionLedgerEntry[];
  now: string;
  fraudReview?: FraudReview;
  currency?: string;
}): BuildPayoutBatchResult {
  const currency = input.currency ?? USD;
  const partnerEntries = input.entries.filter((entry) => entry.partnerId === input.partnerId);
  const skippedForHold: string[] = [];
  const included: CommissionLedgerEntry[] = [];

  for (const entry of partnerEntries) {
    if (entry.entryType !== 'accrual') {
      continue;
    }
    if (entry.holdUntil !== null && isBefore(input.now, entry.holdUntil)) {
      skippedForHold.push(entry.id);
      continue;
    }
    included.push(entry);
  }

  const balance = commissionBalance(partnerEntries, input.now, currency);
  const amountMinor = Math.min(
    balance.payableMinor,
    included.reduce((total, entry) => total + entry.amountMinor, 0),
  );
  const underReview = input.fraudReview?.hold === true;

  const batch: PayoutBatch = {
    id: input.batchId,
    partnerId: input.partnerId,
    periodStart: input.periodStart,
    periodEnd: input.periodEnd,
    entryIds: included.map((entry) => entry.id),
    amountMinor: underReview ? 0 : amountMinor,
    currency,
    state: underReview ? 'draft' : 'approved',
    createdAt: input.now,
  };

  if (underReview || amountMinor <= 0) {
    return { batch, payoutEntry: null, skippedForHold, skippedForFraudReview: underReview };
  }

  const first = included[0];
  return {
    batch,
    payoutEntry: {
      id: input.entryId,
      partnerId: input.partnerId,
      referralId: first?.referralId ?? input.partnerId,
      workspaceId: first?.workspaceId ?? input.partnerId,
      orderId: null,
      entryType: 'payout',
      amountMinor: -amountMinor,
      currency,
      createdAt: input.now,
      holdUntil: null,
      reason: input.batchId,
      approverIds: [],
    },
    skippedForHold,
    skippedForFraudReview: false,
  };
}

/** Days a commission has been held, for the partner-facing status. */
export function daysHeld(entry: CommissionLedgerEntry, now: string): number {
  return Math.max(0, differenceDays(now, entry.createdAt));
}
