import { RelayError } from '@relay/contracts';

import { BILLING_MESSAGE_KEYS } from './messages';
import { formatMoneyMinor } from './money';
import {
  POLAR_TRIAL_REMINDER_DAY,
  POLAR_TRIAL_REMINDER_LEAD_DAYS,
  RELAY_TRIAL_SUMMARY_DAY,
  TRIAL_DAYS,
} from './products';
import { BASE_TIER_KEY, planTier, tierPriceMinor } from './tiers';
import type { PlanTierKey } from './tiers';
import type { BillingInterval } from './intervals';
import type { VerifiedSubscription } from './entitlements';
import { addDays, daysUntil, isAtOrAfter, isBefore, normalizeInstant } from './time';

/**
 * The seven day trial.
 *
 * Polar owns the money: it collects the payment method, charges nothing today,
 * sends its own pre-conversion reminder and charges on the conversion date. We
 * own the accuracy of what we say about it. Every date and amount rendered
 * anywhere comes from `computeTrialSchedule`, so the banner, the email, the
 * checkout disclosure and the API all quote the same instant.
 *
 * We never contradict Polar's reminder. Polar's lands on day 4 of 7 (three days
 * before conversion); our own trial summary lands on day 6, after it.
 */

export const TRIAL_DUE_TODAY_MINOR = 0;

/** Trial spend cap on metered provider usage. Raising it is explicit. */
export const TRIAL_METERED_SPEND_CAP_MINOR = 500;

export interface TrialSchedule {
  readonly interval: BillingInterval;
  readonly trialDays: number;
  readonly startsAt: string;
  /** The instant the trial ends and, unless cancelled, the card is charged. */
  readonly conversionAt: string;
  readonly firstChargeAt: string;
  readonly firstChargeMinor: number;
  readonly renewalMinor: number;
  readonly currency: string;
  readonly dueTodayMinor: number;
  /** Polar's pre-conversion reminder. We align to it, we do not send it. */
  readonly polarReminderAt: string;
  readonly polarReminderDay: number;
  readonly polarReminderLeadDays: number;
  /** Our trial status summary, deliberately after Polar's reminder. */
  readonly relaySummaryAt: string;
  readonly relaySummaryDay: number;
  readonly cancelBeforeAt: string;
}

export interface ComputeTrialScheduleInput {
  readonly startedAt: string;
  readonly interval: BillingInterval;
  readonly trialDays?: number;
  /** Defaults to the base tier. Higher tiers charge their own price. */
  readonly tier?: PlanTierKey;
}

/**
 * Exact conversion date computation. Everything is derived from the checkout
 * confirmation instant, so a trial confirmed at 14:00 UTC converts at 14:00
 * UTC, not at midnight and not a day late.
 */
export function computeTrialSchedule(input: ComputeTrialScheduleInput): TrialSchedule {
  const trialDays = input.trialDays ?? TRIAL_DAYS;
  if (!Number.isInteger(trialDays) || trialDays <= 0) {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: BILLING_MESSAGE_KEYS.responseInvalid,
      details: { trialDays },
    });
  }
  const startsAt = normalizeInstant(input.startedAt);
  const conversionAt = addDays(startsAt, trialDays);
  const tierKey = input.tier ?? BASE_TIER_KEY;
  const price = tierPriceMinor(tierKey, input.interval);
  const reminderDay = Math.max(0, trialDays - POLAR_TRIAL_REMINDER_LEAD_DAYS);
  const summaryDay = Math.max(reminderDay, trialDays - 1);
  return {
    interval: input.interval,
    trialDays,
    startsAt,
    conversionAt,
    firstChargeAt: conversionAt,
    firstChargeMinor: price,
    renewalMinor: price,
    currency: planTier(tierKey).currency,
    dueTodayMinor: TRIAL_DUE_TODAY_MINOR,
    polarReminderAt: addDays(startsAt, reminderDay),
    polarReminderDay: reminderDay,
    polarReminderLeadDays: POLAR_TRIAL_REMINDER_LEAD_DAYS,
    relaySummaryAt: addDays(startsAt, summaryDay),
    relaySummaryDay: summaryDay,
    cancelBeforeAt: conversionAt,
  };
}

export const TRIAL_PHASES = [
  'before_reminder',
  'after_reminder',
  'final_day',
  'converted',
] as const;
export type TrialPhase = (typeof TRIAL_PHASES)[number];

export interface TrialStatus {
  readonly phase: TrialPhase;
  readonly daysRemaining: number;
  readonly conversionAt: string;
  readonly firstChargeMinor: number;
  readonly firstChargeText: string;
  readonly currency: string;
  readonly polarReminderSent: boolean;
  readonly relaySummaryDue: boolean;
  readonly daysRemainingKey: string;
  readonly firstChargeKey: string;
}

/** Where a trial is right now. Drives the in-app banner and the day 6 email. */
export function trialStatus(schedule: TrialSchedule, now: string): TrialStatus {
  const converted = isAtOrAfter(now, schedule.conversionAt);
  const reminderSent = isAtOrAfter(now, schedule.polarReminderAt);
  const summaryDue = isAtOrAfter(now, schedule.relaySummaryAt) && !converted;
  const phase: TrialPhase = converted
    ? 'converted'
    : summaryDue
      ? 'final_day'
      : reminderSent
        ? 'after_reminder'
        : 'before_reminder';
  return {
    phase,
    daysRemaining: daysUntil(schedule.conversionAt, now),
    conversionAt: schedule.conversionAt,
    firstChargeMinor: schedule.firstChargeMinor,
    firstChargeText: formatMoneyMinor(schedule.firstChargeMinor, schedule.currency),
    currency: schedule.currency,
    polarReminderSent: reminderSent,
    relaySummaryDue: summaryDue,
    daysRemainingKey: 'billing.trial.daysRemaining',
    firstChargeKey: 'billing.trial.firstCharge',
  };
}

/**
 * Start-up check. A Polar product whose configured trial length differs from
 * ours would make every conversion date we render a lie, so the service refuses
 * to boot rather than showing a wrong number.
 */
export function assertTrialConfiguration(input: {
  polarTrialDays: number | null;
  configuredTrialDays: number;
  productId: string;
}): void {
  if (
    input.polarTrialDays !== input.configuredTrialDays ||
    input.configuredTrialDays !== TRIAL_DAYS
  ) {
    throw new RelayError('CONFLICT', {
      messageKey: BILLING_MESSAGE_KEYS.conflict,
      details: {
        productId: input.productId,
        polarTrialDays: input.polarTrialDays,
        configuredTrialDays: input.configuredTrialDays,
        expectedTrialDays: TRIAL_DAYS,
      },
    });
  }
}

/** We align to Polar's reminder rather than sending a competing one. */
export function polarReminderAlignmentIsValid(schedule: TrialSchedule): boolean {
  return (
    schedule.polarReminderDay === POLAR_TRIAL_REMINDER_DAY &&
    schedule.relaySummaryDay === RELAY_TRIAL_SUMMARY_DAY &&
    isBefore(schedule.polarReminderAt, schedule.relaySummaryAt) &&
    isBefore(schedule.relaySummaryAt, schedule.conversionAt)
  );
}

export interface CancellationOutcome {
  /** True only when the cancellation happens before the first charge. */
  readonly willNotBeCharged: boolean;
  readonly accessEndsAt: string;
  readonly accessEndsAtDate: string;
  /** `billing.trial.canceled` reads "Your trial is canceled. You will not be charged." */
  readonly confirmationKey: string;
  readonly bodyKey: string;
  readonly chargedSoFarMinor: number;
  readonly refundRequested: false;
}

export interface CancellationInput {
  readonly subscription: VerifiedSubscription;
  readonly now: string;
  readonly schedule?: TrialSchedule;
}

/**
 * What cancelling says and does.
 *
 * Cancelling during the trial confirms "You will not be charged" and keeps
 * every feature until the trial end. Cancelling after a paid period keeps
 * access to the exact period end. Neither path deletes anything, and neither
 * path routes through support.
 */
export function cancellationOutcome(input: CancellationInput): CancellationOutcome {
  const { subscription } = input;
  const trialEnd = subscription.trialEnd;
  const beforeConversion =
    subscription.status === 'trialing' && trialEnd !== null && isBefore(input.now, trialEnd);
  const accessEndsAt = beforeConversion
    ? trialEnd
    : (subscription.currentPeriodEnd ?? subscription.endsAt ?? input.now);
  return {
    willNotBeCharged: beforeConversion,
    accessEndsAt,
    accessEndsAtDate: accessEndsAt.slice(0, 10),
    confirmationKey: beforeConversion ? 'billing.trial.canceled' : 'billing.cancel.confirmed',
    bodyKey: beforeConversion ? 'billing.cancel.beforeTrialEnd' : 'billing.cancel.afterTrial',
    chargedSoFarMinor: beforeConversion ? 0 : subscription.amountMinor,
    refundRequested: false,
  };
}

/** The calm options offered on the cancellation screen. No dark patterns. */
export const CANCELLATION_OFFER_KEYS: readonly string[] = Object.freeze([
  'billing.cancel.keepData',
  'billing.subscription.invoices',
  'billing.subscription.readOnly',
  'action.manageBilling',
]);
