import { computeChecksum } from '@relay/contracts';

import { formatMoneyMinor } from './money';
import {
  ACTIVE_CHANNEL_ALLOWANCE,
  MANDATED_COPY,
  PLAN_CURRENCY,
  PRICE_PRESENTATION,
} from './products';
import {
  BASE_TIER_KEY,
  assertTierPublishable,
  tierPriceMinor,
  tierProjectAllowance,
} from './tiers';
import type { PlanTierKey } from './tiers';
import { TIER_PROJECT_ALLOWANCE_KEY } from './tier-presentation';
import { computeTrialSchedule } from './trial';
import type { TrialSchedule } from './trial';
import type { BillingInterval } from './intervals';
import { isoDateOf } from './time';

/**
 * The disclosure a customer must read **before** they confirm a purchase, and
 * the retained proof of what they read.
 *
 * It is not marketing. It is the record of what was promised, so it is
 * versioned, checksummed and stored with a timestamp in `consents`. If a
 * customer later disputes a charge, we can show exactly what they saw. Nothing
 * here contains prose: every line is an `@relay/i18n` key plus parameters, and
 * every amount is derived from integer minor units.
 */

/** Bump when any sentence in the disclosure changes. Stored with the consent. */
export const DISCLOSURE_VERSION = '2026-08-10';

export interface DisclosureLine {
  /** Stable identifier so a test can assert the block is complete. */
  readonly id: string;
  readonly messageKey: string;
  readonly params: Readonly<Record<string, string | number>>;
}

/** Every line the checkout disclosure must contain, in render order. */
/**
 * Every line a trial checkout must show before the customer confirms.
 *
 * `trial_end` and `first_charge` are on this list because a trial defers money:
 * the customer is agreeing to a charge on a date, and the date is the term.
 */
export const REQUIRED_DISCLOSURE_LINE_IDS: readonly string[] = Object.freeze([
  'due_today',
  'tier',
  'project_allowance',
  'trial_end',
  'first_charge',
  'interval',
  'renewal',
  'cancellation_path',
  'channel_allowance',
  'fair_use',
  'metered_x_usage',
  'no_media_generation',
  'tax',
]);

/**
 * Every line a checkout that charges today must show.
 *
 * The same list without the two that only a trial has. It is a separate
 * constant rather than a filter so that adding a required line means adding it
 * deliberately to each kind of checkout, which is the property that stops a
 * new disclosure obligation from silently applying to only one of them.
 */
export const REQUIRED_IMMEDIATE_DISCLOSURE_LINE_IDS: readonly string[] = Object.freeze([
  'due_today',
  'tier',
  'project_allowance',
  'interval',
  'renewal',
  'cancellation_path',
  'channel_allowance',
  'fair_use',
  'metered_x_usage',
  'no_media_generation',
  'tax',
]);

/** The line ids a disclosure must carry, given whether it defers the charge. */
export function requiredDisclosureLineIds(trialDays: number): readonly string[] {
  return trialDays > 0 ? REQUIRED_DISCLOSURE_LINE_IDS : REQUIRED_IMMEDIATE_DISCLOSURE_LINE_IDS;
}

export interface CheckoutDisclosure {
  readonly version: string;
  readonly interval: BillingInterval;
  readonly tierKey: PlanTierKey;
  /** Active projects this purchase includes. Stated before confirming. */
  readonly projectAllowance: number;
  readonly currency: string;
  /** Always zero. Rendered as the exact string "$0 due today". */
  readonly dueTodayMinor: number;
  readonly dueTodayText: string;
  readonly trialDays: number;
  readonly trialEndsAt: string;
  readonly trialEndsOnDate: string;
  readonly firstChargeMinor: number;
  readonly firstChargeText: string;
  readonly firstChargeAt: string;
  readonly firstChargeOnDate: string;
  readonly renewalMinor: number;
  readonly renewalText: string;
  readonly annualFramingText: string | null;
  readonly activeChannelAllowance: number;
  readonly lines: readonly DisclosureLine[];
}

export interface BuildDisclosureInput {
  readonly interval: BillingInterval;
  readonly startedAt: string;
  readonly trialDays?: number;
  /** Defaults to the base tier. A tier awaiting a founder decision throws. */
  readonly tier?: PlanTierKey;
}

/**
 * The block rendered beside the primary action, and repeated on the Billing
 * settings page. Dates and amounts come from `computeTrialSchedule`, sentences
 * come from `@relay/i18n` keys, so this function never contains prose.
 */
/**
 * There is no trial end and no conversion date when nothing is being deferred.
 * These fields exist on the record for the trial case; a no-trial disclosure
 * fills them with an explicit sentinel rather than today's date dressed up as
 * a deadline, so nothing downstream can render one.
 */
const NO_TRIAL_INSTANT = '';
const NO_TRIAL_DATE = '';

export function buildCheckoutDisclosure(input: BuildDisclosureInput): CheckoutDisclosure {
  const tier = assertTierPublishable(input.tier ?? BASE_TIER_KEY);
  const projectAllowance = tierProjectAllowance(tier.key);

  // No trial is the normal case, and the disclosure has to say so. The Polar
  // products carry no trial period, so a block announcing "$0 due today" and a
  // first charge a week out would be describing terms the customer is not
  // being given, on the one screen where that matters most. Zero days takes
  // its own path rather than a zero-length trial schedule, because a trial
  // that ends the instant it starts is a fiction the rest of this module would
  // then have to keep telling.
  if ((input.trialDays ?? 0) === 0) {
    return buildImmediateChargeDisclosure({ tier, projectAllowance, interval: input.interval });
  }

  const schedule: TrialSchedule = computeTrialSchedule({
    startedAt: input.startedAt,
    interval: input.interval,
    tier: tier.key,
    ...(input.trialDays === undefined ? {} : { trialDays: input.trialDays }),
  });
  const firstChargeText = formatMoneyMinor(schedule.firstChargeMinor, schedule.currency);
  const renewalText = formatMoneyMinor(schedule.renewalMinor, schedule.currency);
  const trialEndsOnDate = isoDateOf(schedule.conversionAt);
  const firstChargeOnDate = isoDateOf(schedule.firstChargeAt);
  const intervalLabelKey =
    input.interval === 'year'
      ? PRICE_PRESENTATION.year.labelKey
      : PRICE_PRESENTATION.month.labelKey;

  const lines: DisclosureLine[] = [
    { id: 'due_today', messageKey: 'billing.trial.dueToday', params: {} },
    { id: 'tier', messageKey: tier.nameKey, params: {} },
    {
      id: 'project_allowance',
      messageKey: TIER_PROJECT_ALLOWANCE_KEY,
      params: { count: projectAllowance },
    },
    {
      id: 'trial_end',
      messageKey: 'billing.trial.length',
      params: { date: trialEndsOnDate, days: schedule.trialDays },
    },
    {
      id: 'first_charge',
      messageKey: 'billing.trial.firstCharge',
      params: { amount: firstChargeText, date: firstChargeOnDate },
    },
    { id: 'interval', messageKey: intervalLabelKey, params: {} },
    {
      id: 'renewal',
      messageKey: 'billing.trial.renewal',
      params: { amount: renewalText, interval: input.interval },
    },
    { id: 'cancellation_path', messageKey: 'billing.trial.cancelBefore', params: {} },
    {
      id: 'channel_allowance',
      messageKey: 'billing.plan.includes.channels',
      params: { limit: ACTIVE_CHANNEL_ALLOWANCE },
    },
    { id: 'fair_use', messageKey: 'billing.plan.fairUse', params: {} },
    { id: 'metered_x_usage', messageKey: 'billing.usage.xCharges', params: {} },
    { id: 'no_media_generation', messageKey: 'billing.usage.noMediaCredits', params: {} },
    { id: 'tax', messageKey: 'billing.checkout.taxNote', params: {} },
  ];

  return {
    version: DISCLOSURE_VERSION,
    interval: input.interval,
    tierKey: tier.key,
    projectAllowance,
    currency: schedule.currency,
    dueTodayMinor: schedule.dueTodayMinor,
    dueTodayText: MANDATED_COPY.dueToday,
    trialDays: schedule.trialDays,
    trialEndsAt: schedule.conversionAt,
    trialEndsOnDate,
    firstChargeMinor: schedule.firstChargeMinor,
    firstChargeText,
    firstChargeAt: schedule.firstChargeAt,
    firstChargeOnDate,
    renewalMinor: schedule.renewalMinor,
    renewalText,
    annualFramingText:
      input.interval === 'year' ? PRICE_PRESENTATION.annualFraming.framingText : null,
    activeChannelAllowance: ACTIVE_CHANNEL_ALLOWANCE,
    lines,
  };
}

export interface DisclosureConsentRecord {
  readonly version: string;
  readonly interval: BillingInterval;
  readonly tierKey: PlanTierKey;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly shownAt: string;
  /** Checksum of the exact disclosure the customer saw. */
  readonly checksum: string;
  readonly locale: string;
}

/** The retained proof of what was shown, written to `consents` at checkout. */
export async function buildConsentRecord(input: {
  disclosure: CheckoutDisclosure;
  workspaceId: string;
  actorId: string;
  shownAt: string;
  locale: string;
}): Promise<DisclosureConsentRecord> {
  return {
    version: input.disclosure.version,
    interval: input.disclosure.interval,
    tierKey: input.disclosure.tierKey,
    workspaceId: input.workspaceId,
    actorId: input.actorId,
    shownAt: input.shownAt,
    checksum: await computeChecksum(input.disclosure),
    locale: input.locale,
  };
}


/**
 * The disclosure for a checkout that charges today, which is every checkout
 * this product currently runs.
 *
 * It answers the three questions a person has with their card out: what comes
 * off today, what happens next, and how to stop it. There is no trial end, no
 * conversion date and no "cancel before" deadline, because none of those exist
 * here; the fields that describe them carry the charge instant instead of a
 * date invented to fill them.
 */
function buildImmediateChargeDisclosure(input: {
  readonly tier: ReturnType<typeof assertTierPublishable>;
  readonly projectAllowance: number;
  readonly interval: BillingInterval;
}): CheckoutDisclosure {
  const { tier, projectAllowance, interval } = input;
  const priceMinor = tierPriceMinor(tier.key, interval);
  const priceText = formatMoneyMinor(priceMinor, PLAN_CURRENCY);
  const intervalLabelKey =
    interval === 'year' ? PRICE_PRESENTATION.year.labelKey : PRICE_PRESENTATION.month.labelKey;

  const lines: DisclosureLine[] = [
    { id: 'due_today', messageKey: 'billing.charge.dueToday', params: { amount: priceText } },
    { id: 'tier', messageKey: tier.nameKey, params: {} },
    {
      id: 'project_allowance',
      messageKey: TIER_PROJECT_ALLOWANCE_KEY,
      params: { count: projectAllowance },
    },
    { id: 'interval', messageKey: intervalLabelKey, params: {} },
    {
      id: 'renewal',
      messageKey: 'billing.charge.renewal',
      params: { amount: priceText, interval },
    },
    { id: 'cancellation_path', messageKey: 'billing.charge.cancelAnyTime', params: {} },
    {
      id: 'channel_allowance',
      messageKey: 'billing.plan.includes.channels',
      params: { limit: ACTIVE_CHANNEL_ALLOWANCE },
    },
    { id: 'fair_use', messageKey: 'billing.plan.fairUse', params: {} },
    { id: 'metered_x_usage', messageKey: 'billing.usage.xCharges', params: {} },
    { id: 'no_media_generation', messageKey: 'billing.usage.noMediaCredits', params: {} },
    { id: 'tax', messageKey: 'billing.checkout.taxNote', params: {} },
  ];

  return {
    version: DISCLOSURE_VERSION,
    interval,
    tierKey: tier.key,
    projectAllowance,
    currency: PLAN_CURRENCY,
    // The charge is today and it is the full price. Reporting zero here, as a
    // trial would, is the specific lie this branch exists to avoid.
    dueTodayMinor: priceMinor,
    dueTodayText: priceText,
    trialDays: 0,
    trialEndsAt: NO_TRIAL_INSTANT,
    trialEndsOnDate: NO_TRIAL_DATE,
    firstChargeMinor: priceMinor,
    firstChargeText: priceText,
    firstChargeAt: NO_TRIAL_INSTANT,
    firstChargeOnDate: NO_TRIAL_DATE,
    renewalMinor: priceMinor,
    renewalText: priceText,
    annualFramingText: interval === 'year' ? PRICE_PRESENTATION.annualFraming.framingText : null,
    activeChannelAllowance: ACTIVE_CHANNEL_ALLOWANCE,
    lines,
  };
}
