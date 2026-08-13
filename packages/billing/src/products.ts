import { ACTIVE_CHANNEL_LIMIT, WORKSPACE_MEMBER_LIMIT } from '@relay/contracts';

import { formatMoneyMinor } from './money';
import { BASE_TIER_KEY, PLAN_TIERS, SHARED_INCLUSION_KEYS, tierProjectAllowance } from './tiers';
import { buildTierPresentation, publishableTierPresentations } from './tier-presentation';
import type { TierPresentation } from './tier-presentation';
import type { BillingInterval } from './intervals';

export {
  BILLING_INTERVALS,
  billingIntervalSchema,
  normalizeInterval,
  type BillingInterval,
} from './intervals';

/**
 * The public products.
 *
 * Every number a customer can see about pricing is defined exactly once, in
 * `tiers.ts`, and formatted exactly once, here. The marketing page, the
 * checkout disclosure, the Billing settings screen, the CLI and the API all
 * read this module, so there is no second place for the annual saving to drift
 * out of step with the annual price.
 *
 * Three commercial rules are load bearing and are asserted by tests:
 *  - a tier buys project capacity only. Every tier includes every feature;
 *  - the annual framing is stated as money saved and whole months free, never
 *    as a percentage off: $25 and $250 is 16.67%, and no rounding of that is
 *    both honest and memorable;
 *  - no trial copy anywhere claims a temporary payment authorization of any
 *    amount. Polar collects a payment method and defers the first charge, and
 *    saying anything more than that would be a claim we cannot support.
 */

/** The tier a workspace has unless verified subscription state says otherwise. */
export const PLAN_KEY = BASE_TIER_KEY;

export const PLAN_CURRENCY = PLAN_TIERS[BASE_TIER_KEY].currency;

export const MONTHLY_PRICE_MINOR = PLAN_TIERS[BASE_TIER_KEY].monthlyPriceMinor;
export const ANNUAL_PRICE_MINOR = PLAN_TIERS[BASE_TIER_KEY].annualPriceMinor;

/**
 * $250 a year divided by twelve. **Fractional, and therefore never rendered.**
 *
 * A year buys ten months, so this is $20.8333…, and formatting it produces a
 * price with cents in it. Every surface quotes a year as a year and describes
 * the discount with `freeMonthsEquivalent` instead. Kept so `products.test.ts`
 * can pin the fact that it does not divide, which is the reason for the rule.
 */
export const ANNUAL_EFFECTIVE_MONTHLY_MINOR = ANNUAL_PRICE_MINOR / 12;

/** Twelve monthly charges minus one annual charge. $300 - $250 = $50. */
export const ANNUAL_SAVING_MINOR = MONTHLY_PRICE_MINOR * 12 - ANNUAL_PRICE_MINOR;

/** 5000 / 30000 = 16.67%. Recorded for internal reporting, never rendered. */
export const ANNUAL_SAVING_BASIS_POINTS = Math.round(
  (ANNUAL_SAVING_MINOR * 10_000) / (MONTHLY_PRICE_MINOR * 12),
);

/** Both intervals. Must equal the trial length configured on the Polar product. */
export const TRIAL_DAYS = 7;

/** Polar sends its own pre-conversion reminder three days before conversion. */
export const POLAR_TRIAL_REMINDER_LEAD_DAYS = 3;

/** Day 4 of a seven day trial. We align to it and never contradict it. */
export const POLAR_TRIAL_REMINDER_DAY = TRIAL_DAYS - POLAR_TRIAL_REMINDER_LEAD_DAYS;

/** Our own trial status summary lands on day 6, after Polar's reminder. */
export const RELAY_TRIAL_SUMMARY_DAY = TRIAL_DAYS - 1;

/** Active connections a workspace may hold. Never enforced by disconnecting. */
export const ACTIVE_CHANNEL_ALLOWANCE = ACTIVE_CHANNEL_LIMIT;

/** Active projects included in the base subscription. Higher tiers raise it. */
export const PROJECT_ALLOWANCE = tierProjectAllowance(BASE_TIER_KEY);

/** Workspace owner plus five invited teammates. Identical on every tier. */
export const MEMBER_ALLOWANCE = WORKSPACE_MEMBER_LIMIT;

/** Days of full access after a failed payment before the workspace is read only. */
export const GRACE_PERIOD_DAYS = 7;

/** Days spent read only after the grace period before the subscription ends. */
export const READ_ONLY_PERIOD_DAYS = 30;

/**
 * The exact strings the checkout disclosure and the billing screen must show.
 * They are duplicated in the `@relay/i18n` English catalog, which is where the
 * UI reads them from. `products.test.ts` asserts the two agree and that the
 * annual sentence still matches the arithmetic, so neither a catalog edit that
 * softens the disclosure nor a price change that strands the sentence can ship.
 */
export const MANDATED_COPY = Object.freeze({
  dueToday: '$0 due today',
  annualFraming: 'Save $50/year. That is 2 months free.',
  monthlyPrice: '$25/month',
  annualPrice: '$250/year',
});

/** Phrases that may never appear in any billing surface. */
export const FORBIDDEN_BILLING_PHRASES: readonly string[] = Object.freeze([
  '20% off',
  '20 % off',
  '$2 hold',
  '$2.00 hold',
  'card hold',
  'verification hold',
  'temporary authorization',
  'temporary authorisation',
]);

export interface PlanProduct {
  readonly key: string;
  readonly interval: BillingInterval;
  /** Which environment variable carries the Polar product id for this interval. */
  readonly productIdEnvKey: string;
  readonly priceMinor: number;
  readonly currency: string;
  readonly trialDays: number;
}

export const MONTHLY_PRODUCT: PlanProduct = Object.freeze({
  key: PLAN_KEY,
  interval: 'month',
  productIdEnvKey: PLAN_TIERS[BASE_TIER_KEY].monthlyProductIdEnvKey,
  priceMinor: MONTHLY_PRICE_MINOR,
  currency: PLAN_CURRENCY,
  trialDays: TRIAL_DAYS,
});

export const ANNUAL_PRODUCT: PlanProduct = Object.freeze({
  key: PLAN_KEY,
  interval: 'year',
  productIdEnvKey: PLAN_TIERS[BASE_TIER_KEY].annualProductIdEnvKey,
  priceMinor: ANNUAL_PRICE_MINOR,
  currency: PLAN_CURRENCY,
  trialDays: TRIAL_DAYS,
});

export const PLAN_PRODUCTS: Readonly<Record<BillingInterval, PlanProduct>> = Object.freeze({
  month: MONTHLY_PRODUCT,
  year: ANNUAL_PRODUCT,
});

export function planProduct(interval: BillingInterval): PlanProduct {
  return PLAN_PRODUCTS[interval];
}

export function planPriceMinor(interval: BillingInterval): number {
  return PLAN_PRODUCTS[interval].priceMinor;
}

/**
 * Everything every tier unlocks. Message keys only: the copy lives in the i18n
 * catalog and this list fixes the order it renders in. Identical for every
 * tier, which is what `tiers.test.ts` asserts.
 */
export const PLAN_INCLUSION_KEYS: readonly string[] = SHARED_INCLUSION_KEYS;

export interface IntervalPresentation {
  readonly interval: BillingInterval;
  readonly priceMinor: number;
  readonly currency: string;
  /** `$29` and `$300`, with the zero cents trimmed. */
  readonly priceText: string;
  /** `$29.00` and `$300.00`, used wherever an exact charge is stated. */
  readonly exactPriceText: string;
  readonly headlineKey: string;
  readonly labelKey: string;
  readonly trialDays: number;
}

export interface AnnualFramingPresentation {
  readonly effectiveMonthlyMinor: number;
  readonly effectiveMonthlyText: string;
  readonly savingMinor: number;
  readonly savingText: string;
  readonly savingBasisPoints: number;
  /** Whole months saved by paying yearly, or null when it is not a whole number. */
  readonly freeMonthsEquivalent: number | null;
  /** `Save $50/year. That is 2 months free.` Never a percentage. */
  readonly framingText: string;
  readonly framingKey: string;
}

export interface PricePresentation {
  readonly planKey: string;
  readonly currency: string;
  readonly nameKey: string;
  readonly taglineKey: string;
  readonly month: IntervalPresentation;
  readonly year: IntervalPresentation;
  readonly annualFraming: AnnualFramingPresentation;
  readonly trialDays: number;
  readonly trialDueTodayText: string;
  readonly trialDueTodayKey: string;
  readonly activeChannelAllowance: number;
  readonly projectAllowance: number;
  readonly memberAllowance: number;
  readonly inclusionKeys: readonly string[];
  readonly fairUseKey: string;
  readonly mediaGenerationBoundaryKey: string;
  readonly meteredUsageKey: string;
  readonly cancellationKey: string;
}

const BASE_TIER_PRESENTATION = buildTierPresentation(BASE_TIER_KEY, TRIAL_DAYS);

/**
 * The base tier, in the shape the pre-tier surfaces already render. Amount
 * strings are derived from the minor units above, so the numbers cannot drift;
 * sentences are message keys, so the words cannot be hard coded in a component.
 */
export const PRICE_PRESENTATION: PricePresentation = Object.freeze({
  planKey: PLAN_KEY,
  currency: PLAN_CURRENCY,
  nameKey: 'billing.plan.name',
  taglineKey: 'billing.plan.single',
  month: Object.freeze({
    ...BASE_TIER_PRESENTATION.month,
    headlineKey: 'billing.plan.monthlyPrice',
  }),
  year: Object.freeze({
    ...BASE_TIER_PRESENTATION.year,
    headlineKey: 'billing.plan.annualPrice',
  }),
  annualFraming: Object.freeze({
    effectiveMonthlyMinor: BASE_TIER_PRESENTATION.annualFraming.effectiveMonthlyMinor,
    effectiveMonthlyText: BASE_TIER_PRESENTATION.annualFraming.effectiveMonthlyText,
    savingMinor: BASE_TIER_PRESENTATION.annualFraming.savingMinor,
    savingText: BASE_TIER_PRESENTATION.annualFraming.savingText,
    savingBasisPoints: BASE_TIER_PRESENTATION.annualFraming.savingBasisPoints,
    freeMonthsEquivalent: BASE_TIER_PRESENTATION.annualFraming.freeMonthsEquivalent,
    framingText: MANDATED_COPY.annualFraming,
    framingKey: 'billing.plan.annualFraming',
  }),
  trialDays: TRIAL_DAYS,
  trialDueTodayText: MANDATED_COPY.dueToday,
  trialDueTodayKey: 'billing.trial.dueToday',
  activeChannelAllowance: ACTIVE_CHANNEL_ALLOWANCE,
  projectAllowance: PROJECT_ALLOWANCE,
  memberAllowance: MEMBER_ALLOWANCE,
  inclusionKeys: PLAN_INCLUSION_KEYS,
  fairUseKey: 'billing.plan.fairUse',
  mediaGenerationBoundaryKey: 'billing.mediaGeneration.explanation',
  meteredUsageKey: 'billing.usage.meteredNote',
  cancellationKey: 'billing.cancel.beforeTrialEnd',
});

/** Every tier a pricing page or a tier picker may offer, cheapest first. */
export const TIER_PRESENTATIONS: readonly TierPresentation[] =
  publishableTierPresentations(TRIAL_DAYS);

/**
 * A Polar product whose configured trial length disagrees with `TRIAL_DAYS`
 * would make our on-screen conversion date a lie. The service start-up check
 * calls this and refuses to boot.
 */
export function trialLengthMatches(polarTrialDays: number, configuredTrialDays: number): boolean {
  return polarTrialDays === configuredTrialDays && configuredTrialDays === TRIAL_DAYS;
}

/**
 * Every amount the mandated annual sentence claims, derived from minor units.
 *
 * It used to also return a per-month equivalent. That field is gone with the
 * figure it formatted: on this ladder it renders `$20.83`, and an exported
 * helper that produces the one presentation the product refuses is a trap
 * rather than a convenience.
 */
export function derivedAnnualFramingAmounts(): { saving: string; freeMonths: number | null } {
  return {
    saving: formatMoneyMinor(ANNUAL_SAVING_MINOR, PLAN_CURRENCY, { trimZeroFraction: true }),
    freeMonths: BASE_TIER_PRESENTATION.annualFraming.freeMonthsEquivalent,
  };
}
