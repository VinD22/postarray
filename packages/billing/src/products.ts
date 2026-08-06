import { z } from 'zod';
import { ACTIVE_CHANNEL_LIMIT, WORKSPACE_MEMBER_LIMIT } from '@relay/contracts';

import { formatMoneyMinor, USD } from './money';

/**
 * The one public plan.
 *
 * Every number a customer can see about pricing is defined exactly once, here.
 * The marketing page, the checkout disclosure, the Billing settings screen, the
 * CLI and the API all read this module, so there is no second place for the
 * annual saving to drift out of step with the annual price.
 *
 * Two commercial rules are load bearing and are asserted by tests:
 *  - the annual framing is stated as money saved, never as a percentage off,
 *    because a percentage discount claim would not be true for $29 and $300;
 *  - no trial copy anywhere claims a temporary payment authorization of any
 *    amount. Polar collects a payment method and defers the first charge, and
 *    saying anything more than that would be a claim we cannot support.
 */

export const BILLING_INTERVALS = ['month', 'year'] as const;
export const billingIntervalSchema = z.enum(BILLING_INTERVALS);
export type BillingInterval = z.infer<typeof billingIntervalSchema>;

/** There is one plan. There are no tiers, no seats and no add-on products. */
export const PLAN_KEY = 'relay_standard';

export const PLAN_CURRENCY = USD;

export const MONTHLY_PRICE_MINOR = 2_900;
export const ANNUAL_PRICE_MINOR = 30_000;

/** $300 a year presented per month. Exact, not rounded. */
export const ANNUAL_EFFECTIVE_MONTHLY_MINOR = ANNUAL_PRICE_MINOR / 12;

/** Twelve monthly charges minus one annual charge. $348 - $300 = $48. */
export const ANNUAL_SAVING_MINOR = MONTHLY_PRICE_MINOR * 12 - ANNUAL_PRICE_MINOR;

/** 4800 / 34800 = 13.79%. Recorded for internal reporting, never rendered. */
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

/** Workspace owner plus five invited teammates. */
export const MEMBER_ALLOWANCE = WORKSPACE_MEMBER_LIMIT;

/** Days of full access after a failed payment before the workspace is read only. */
export const GRACE_PERIOD_DAYS = 7;

/** Days spent read only after the grace period before the subscription ends. */
export const READ_ONLY_PERIOD_DAYS = 30;

/**
 * The exact strings the checkout disclosure and the billing screen must show.
 * They are duplicated in the `@relay/i18n` English catalog, which is where the
 * UI reads them from. `products.test.ts` asserts the two agree, so a catalog
 * edit that softens the disclosure fails the build.
 */
export const MANDATED_COPY = Object.freeze({
  dueToday: '$0 due today',
  annualFraming: '$25/month billed annually. Save $48/year.',
  monthlyPrice: '$29/month',
  annualPrice: '$300/year',
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
  readonly productIdEnvKey: 'POLAR_MONTHLY_PRODUCT_ID' | 'POLAR_ANNUAL_PRODUCT_ID';
  readonly priceMinor: number;
  readonly currency: string;
  readonly trialDays: number;
}

export const MONTHLY_PRODUCT: PlanProduct = Object.freeze({
  key: PLAN_KEY,
  interval: 'month',
  productIdEnvKey: 'POLAR_MONTHLY_PRODUCT_ID',
  priceMinor: MONTHLY_PRICE_MINOR,
  currency: PLAN_CURRENCY,
  trialDays: TRIAL_DAYS,
});

export const ANNUAL_PRODUCT: PlanProduct = Object.freeze({
  key: PLAN_KEY,
  interval: 'year',
  productIdEnvKey: 'POLAR_ANNUAL_PRODUCT_ID',
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
 * Everything the single entitlement bundle unlocks. Message keys only: the copy
 * lives in the i18n catalog and this list fixes the order it renders in.
 */
export const PLAN_INCLUSION_KEYS: readonly string[] = Object.freeze([
  'billing.plan.includes.channels',
  'billing.plan.includes.members',
  'billing.plan.includes.posts',
  'billing.plan.includes.connectors',
  'billing.plan.includes.analytics',
  'billing.plan.includes.api',
  'billing.plan.includes.automation',
  'billing.plan.includes.ai',
  'billing.plan.includes.support',
]);

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
  /** `$25/month billed annually. Save $48/year.` Never a percentage. */
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
  readonly inclusionKeys: readonly string[];
  readonly fairUseKey: string;
  readonly mediaGenerationBoundaryKey: string;
  readonly meteredUsageKey: string;
  readonly cancellationKey: string;
}

/**
 * The single object every pricing surface renders. Amount strings are derived
 * from the minor units above, so the numbers cannot drift; sentences are
 * message keys, so the words cannot be hard coded in a component.
 */
export const PRICE_PRESENTATION: PricePresentation = Object.freeze({
  planKey: PLAN_KEY,
  currency: PLAN_CURRENCY,
  nameKey: 'billing.plan.name',
  taglineKey: 'billing.plan.single',
  month: Object.freeze({
    interval: 'month' as const,
    priceMinor: MONTHLY_PRICE_MINOR,
    currency: PLAN_CURRENCY,
    priceText: formatMoneyMinor(MONTHLY_PRICE_MINOR, PLAN_CURRENCY, { trimZeroFraction: true }),
    exactPriceText: formatMoneyMinor(MONTHLY_PRICE_MINOR, PLAN_CURRENCY),
    headlineKey: 'billing.plan.monthlyPrice',
    labelKey: 'billing.plan.interval.monthly',
    trialDays: TRIAL_DAYS,
  }),
  year: Object.freeze({
    interval: 'year' as const,
    priceMinor: ANNUAL_PRICE_MINOR,
    currency: PLAN_CURRENCY,
    priceText: formatMoneyMinor(ANNUAL_PRICE_MINOR, PLAN_CURRENCY, { trimZeroFraction: true }),
    exactPriceText: formatMoneyMinor(ANNUAL_PRICE_MINOR, PLAN_CURRENCY),
    headlineKey: 'billing.plan.annualPrice',
    labelKey: 'billing.plan.interval.annual',
    trialDays: TRIAL_DAYS,
  }),
  annualFraming: Object.freeze({
    effectiveMonthlyMinor: ANNUAL_EFFECTIVE_MONTHLY_MINOR,
    effectiveMonthlyText: formatMoneyMinor(ANNUAL_EFFECTIVE_MONTHLY_MINOR, PLAN_CURRENCY, {
      trimZeroFraction: true,
    }),
    savingMinor: ANNUAL_SAVING_MINOR,
    savingText: formatMoneyMinor(ANNUAL_SAVING_MINOR, PLAN_CURRENCY, { trimZeroFraction: true }),
    savingBasisPoints: ANNUAL_SAVING_BASIS_POINTS,
    framingText: MANDATED_COPY.annualFraming,
    framingKey: 'billing.plan.annualFraming',
  }),
  trialDays: TRIAL_DAYS,
  trialDueTodayText: MANDATED_COPY.dueToday,
  trialDueTodayKey: 'billing.trial.dueToday',
  activeChannelAllowance: ACTIVE_CHANNEL_ALLOWANCE,
  memberAllowance: MEMBER_ALLOWANCE,
  inclusionKeys: PLAN_INCLUSION_KEYS,
  fairUseKey: 'billing.plan.fairUse',
  mediaGenerationBoundaryKey: 'billing.mediaGeneration.explanation',
  meteredUsageKey: 'billing.usage.meteredNote',
  cancellationKey: 'billing.cancel.beforeTrialEnd',
});

/**
 * A Polar product whose configured trial length disagrees with `TRIAL_DAYS`
 * would make our on-screen conversion date a lie. The service start-up check
 * calls this and refuses to boot.
 */
export function trialLengthMatches(polarTrialDays: number, configuredTrialDays: number): boolean {
  return polarTrialDays === configuredTrialDays && configuredTrialDays === TRIAL_DAYS;
}

/** The interval a Polar recurring interval string maps to. */
export function normalizeInterval(value: string): BillingInterval | null {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'month' || normalized === 'monthly') {
    return 'month';
  }
  if (normalized === 'year' || normalized === 'yearly' || normalized === 'annual') {
    return 'year';
  }
  return null;
}
