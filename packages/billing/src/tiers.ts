import { z } from 'zod';

import { BASE_PROJECT_LIMIT, MAX_PROJECT_LIMIT, RelayError } from '@relay/contracts';

import type { BillingInterval } from './intervals';
import { BILLING_MESSAGE_KEYS } from './messages';
import { USD } from './money';

/**
 * Project capacity tiers.
 *
 * The commercial model is project led, not account led. A tier buys **active
 * project capacity and nothing else**. Every tier unlocks every shipped
 * feature, every connector, every surface and the same channel and member
 * allowances. Feature gated variants, per seat prices and per channel prices
 * are named policy violations in
 * `docs/planning/08-billing-entitlements-and-economics.md` section 2.2, so the
 * tier record deliberately has no field they could be expressed in.
 *
 * ## Replacing a founder placeholder
 *
 * `relay_growth` and `relay_studio` exist as structure, not as products. Every
 * number and product id on them is the `FOUNDER_DECISION_PENDING` sentinel, and
 * a tier carrying any sentinel is excluded from `PUBLISHABLE_TIER_KEYS`, from
 * every pricing presentation and from checkout. To ship one:
 *
 *  1. record the founder decision in
 *     `docs/planning/08-billing-entitlements-and-economics.md` section 13;
 *  2. create the two Polar products and put their ids behind the two env vars
 *     named on the tier, never in source;
 *  3. replace `projectAllowance`, `monthlyPriceMinor`, `annualPriceMinor` and
 *     both `*ProductIdEnvKey` values here, all of them, in one edit;
 *  4. add the tier's name and tagline strings to the English catalog.
 *
 * `tiers.test.ts` fails if a half-replaced tier reaches customer facing copy or
 * a checkout, so a forgotten step cannot ship quietly.
 */

export const PLAN_TIER_KEYS = ['relay_standard', 'relay_growth', 'relay_studio'] as const;
export const planTierKeySchema = z.enum(PLAN_TIER_KEYS);
export type PlanTierKey = z.infer<typeof planTierKeySchema>;

/** The tier every workspace falls back to. Never absent, never pending. */
export const BASE_TIER_KEY = 'relay_standard' as const satisfies PlanTierKey;

/**
 * Not a price, not an allowance, not an environment variable name. Any tier
 * carrying this in any field is structurally incapable of being sold.
 */
export const FOUNDER_DECISION_PENDING = -1;
export const FOUNDER_DECISION_PENDING_ENV_KEY = 'FOUNDER_DECISION_PENDING';

export interface PlanTier {
  readonly key: PlanTierKey;
  /** Ascending display order. The base tier is always 0. */
  readonly rank: number;
  /** Active projects included. Archived projects never occupy a slot. */
  readonly projectAllowance: number;
  readonly monthlyPriceMinor: number;
  readonly annualPriceMinor: number;
  readonly currency: string;
  readonly nameKey: string;
  readonly taglineKey: string;
  /** Which env var carries the Polar product id. Ids never live in source. */
  readonly monthlyProductIdEnvKey: string;
  readonly annualProductIdEnvKey: string;
}

const PENDING_TIER = {
  projectAllowance: FOUNDER_DECISION_PENDING,
  monthlyPriceMinor: FOUNDER_DECISION_PENDING,
  annualPriceMinor: FOUNDER_DECISION_PENDING,
  currency: USD,
  monthlyProductIdEnvKey: FOUNDER_DECISION_PENDING_ENV_KEY,
  annualProductIdEnvKey: FOUNDER_DECISION_PENDING_ENV_KEY,
} as const;

export const PLAN_TIERS: Readonly<Record<PlanTierKey, PlanTier>> = Object.freeze({
  relay_standard: Object.freeze({
    key: 'relay_standard',
    rank: 0,
    projectAllowance: BASE_PROJECT_LIMIT,
    monthlyPriceMinor: 2_900,
    annualPriceMinor: 30_000,
    currency: USD,
    nameKey: 'billing.tier.standard.name',
    taglineKey: 'billing.tier.standard.tagline',
    monthlyProductIdEnvKey: 'POLAR_MONTHLY_PRODUCT_ID',
    annualProductIdEnvKey: 'POLAR_ANNUAL_PRODUCT_ID',
  }),
  relay_growth: Object.freeze({
    ...PENDING_TIER,
    key: 'relay_growth',
    rank: 1,
    nameKey: 'billing.tier.growth.name',
    taglineKey: 'billing.tier.growth.tagline',
  }),
  relay_studio: Object.freeze({
    ...PENDING_TIER,
    key: 'relay_studio',
    rank: 2,
    nameKey: 'billing.tier.studio.name',
    taglineKey: 'billing.tier.studio.tagline',
  }),
});

/**
 * Everything every tier includes, in render order. There is exactly one list
 * because there is exactly one feature set. `tiers.test.ts` asserts no tier
 * carries a different one, and that test is the no-feature-gating invariant.
 *
 * Project capacity is deliberately absent: it is the one number that varies, so
 * it is rendered from `projectAllowance`, not from this list.
 */
export const SHARED_INCLUSION_KEYS: readonly string[] = Object.freeze([
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

export function planTier(key: PlanTierKey): PlanTier {
  return PLAN_TIERS[key];
}

/**
 * The inclusion list for a tier. It takes the tier only so that an edit trying
 * to vary the list by tier has an obvious place to fail; the body ignores it on
 * purpose and the invariant test enforces that it keeps ignoring it.
 */
export function tierInclusionKeys(key: PlanTierKey): readonly string[] {
  void planTier(key);
  return SHARED_INCLUSION_KEYS;
}

/** True while any number or product id on the tier is still a sentinel. */
export function tierDecisionPending(tier: PlanTier): boolean {
  return (
    tier.projectAllowance === FOUNDER_DECISION_PENDING ||
    tier.monthlyPriceMinor === FOUNDER_DECISION_PENDING ||
    tier.annualPriceMinor === FOUNDER_DECISION_PENDING ||
    tier.monthlyProductIdEnvKey === FOUNDER_DECISION_PENDING_ENV_KEY ||
    tier.annualProductIdEnvKey === FOUNDER_DECISION_PENDING_ENV_KEY
  );
}

export function isPublishableTier(key: PlanTierKey): boolean {
  return !tierDecisionPending(PLAN_TIERS[key]);
}

function byRank(left: PlanTierKey, right: PlanTierKey): number {
  return PLAN_TIERS[left].rank - PLAN_TIERS[right].rank;
}

/** The only tiers a price page, a tier picker or a checkout may ever offer. */
export const PUBLISHABLE_TIER_KEYS: readonly PlanTierKey[] = Object.freeze(
  [...PLAN_TIER_KEYS].filter(isPublishableTier).sort(byRank),
);

/** Structure that exists but is not a product yet. Never rendered to a buyer. */
export const PENDING_TIER_KEYS: readonly PlanTierKey[] = Object.freeze(
  [...PLAN_TIER_KEYS].filter((key) => !isPublishableTier(key)).sort(byRank),
);

export function publishableTiers(): readonly PlanTier[] {
  return PUBLISHABLE_TIER_KEYS.map(planTier);
}

/**
 * Active projects the tier grants, clamped to the authorization ceiling in
 * `@relay/contracts`. A tier still awaiting a founder decision grants the base
 * allowance, never its sentinel and never anything unbounded.
 */
export function tierProjectAllowance(key: PlanTierKey): number {
  const tier = PLAN_TIERS[key];
  if (tierDecisionPending(tier)) {
    return BASE_PROJECT_LIMIT;
  }
  return Math.min(MAX_PROJECT_LIMIT, Math.max(1, Math.trunc(tier.projectAllowance)));
}

/** The charge for one interval on a tier, in integer minor units. */
export function tierPriceMinor(key: PlanTierKey, interval: BillingInterval): number {
  const tier = assertTierPublishable(key);
  return interval === 'year' ? tier.annualPriceMinor : tier.monthlyPriceMinor;
}

/**
 * Map a Polar product id to a tier.
 *
 * `productTiers` is supplied by configuration, so the mapping lives beside the
 * product ids rather than in source. An id we do not recognise, or one that
 * names a tier the founder has not signed off, resolves to the base tier. It
 * never resolves to the largest tier and there is no unlimited outcome.
 */
export function tierForProductId(
  productId: string,
  productTiers: Readonly<Record<string, string>> = {},
): PlanTierKey {
  const parsed = planTierKeySchema.safeParse(productTiers[productId]);
  if (!parsed.success || !isPublishableTier(parsed.data)) {
    return BASE_TIER_KEY;
  }
  return parsed.data;
}

/** Refuse to price, present or sell a tier the founder has not decided. */
export function assertTierPublishable(key: PlanTierKey): PlanTier {
  const tier = PLAN_TIERS[key];
  if (tierDecisionPending(tier)) {
    throw new RelayError('INTERNAL', {
      messageKey: BILLING_MESSAGE_KEYS.internal,
      details: { tier: key, reason: 'founder_decision_pending' },
    });
  }
  return tier;
}
