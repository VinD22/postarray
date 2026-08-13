import {
  BASE_PROJECT_LIMIT,
  MAX_CHANNEL_LIMIT,
  MAX_PROJECT_LIMIT,
  channelAllowanceForProjects,
} from '@relay/contracts';
import type { MessageKey } from '@relay/i18n/translate';

/**
 * The project capacity tiers, mirrored for the web app.
 *
 * `apps/web` does not depend on `@relay/billing`: that package carries webhook
 * signature verification, a Polar client and a simulator, none of which belong
 * anywhere near a browser bundle. So the figures a page renders are duplicated
 * here, the same precedent the landing page already sets for the monthly price.
 * `tiers.test.ts` pins the base allowance to `@relay/contracts` and caps every
 * tier at the authorization ceiling, so the duplication cannot drift silently.
 *
 * The authority is `packages/billing/src/tiers.ts`. Change it there first.
 *
 * A tier buys active project capacity and nothing else. Every tier includes
 * every feature, which is why there is one inclusion list and not one per tier.
 * Channel capacity is derived from the project allowance rather than stored, so
 * there is nowhere here a per-channel price could be written either.
 *
 * ## The annual ladder
 *
 * Every annual price is exactly ten times its monthly price, so a year costs
 * what ten months cost and the saving is exactly two months on every tier. That
 * is the whole reason no surface here divides an annual price by twelve: $250
 * over twelve months is $20.83, and a headline price carrying cents (worse, a
 * superscript-cents price) is the specific presentation this product refuses.
 * A yearly plan is quoted as a yearly amount, and the discount is stated once,
 * in whole months, by `freeMonthsEquivalent`.
 */

/** Not a price and not an allowance. Marks a number only the founder decides. */
export const FOUNDER_DECISION_PENDING = -1;

export interface WebPlanTier {
  readonly key: string;
  readonly rank: number;
  readonly projectAllowance: number;
  readonly monthlyPriceMinor: number;
  readonly annualPriceMinor: number;
  readonly currency: string;
  readonly nameKey: MessageKey;
  readonly taglineKey: MessageKey;
  /**
   * Which environment variable carries this tier's Polar product id. Mirrored
   * from `packages/billing/src/tiers.ts`; ids themselves never live in source.
   * `purchasableTiers` reads these, which is how the price page grows a column
   * on the day a product is created rather than on the day someone edits a
   * list of tier keys.
   */
  readonly monthlyProductIdEnvKey: string;
  readonly annualProductIdEnvKey: string;
}

export const WEB_PLAN_TIERS: readonly WebPlanTier[] = [
  {
    key: 'relay_standard',
    rank: 0,
    projectAllowance: BASE_PROJECT_LIMIT,
    monthlyPriceMinor: 2_500,
    // Ten months for a year, so the saving is two months: $50.
    annualPriceMinor: 25_000,
    currency: 'USD',
    nameKey: 'billing.tier.standard.name',
    taglineKey: 'billing.tier.standard.tagline',
    monthlyProductIdEnvKey: 'POLAR_MONTHLY_PRODUCT_ID',
    annualProductIdEnvKey: 'POLAR_ANNUAL_PRODUCT_ID',
  },
  {
    key: 'relay_growth',
    rank: 1,
    projectAllowance: 10,
    monthlyPriceMinor: 5_000,
    // Ten months for a year, so the saving is two months: $100.
    annualPriceMinor: 50_000,
    currency: 'USD',
    nameKey: 'billing.tier.growth.name',
    taglineKey: 'billing.tier.growth.tagline',
    monthlyProductIdEnvKey: 'POLAR_GROWTH_MONTHLY_PRODUCT_ID',
    annualProductIdEnvKey: 'POLAR_GROWTH_ANNUAL_PRODUCT_ID',
  },
  {
    key: 'relay_studio',
    rank: 2,
    // The authorization ceiling exactly, so no surface claims "unlimited".
    projectAllowance: MAX_PROJECT_LIMIT,
    monthlyPriceMinor: 10_000,
    // Ten months for a year, so the saving is two months: $200.
    annualPriceMinor: 100_000,
    currency: 'USD',
    nameKey: 'billing.tier.studio.name',
    taglineKey: 'billing.tier.studio.tagline',
    monthlyProductIdEnvKey: 'POLAR_STUDIO_MONTHLY_PRODUCT_ID',
    annualProductIdEnvKey: 'POLAR_STUDIO_ANNUAL_PRODUCT_ID',
  },
];

export const BASE_TIER_KEY = 'relay_standard';

/** One list, shared by every tier. Varying it would be a feature gate. */
export const WEB_SHARED_INCLUSION_KEYS: readonly MessageKey[] = [
  'billing.plan.includes.channels',
  'billing.plan.includes.members',
  'billing.plan.includes.posts',
  'billing.plan.includes.connectors',
  'billing.plan.includes.analytics',
  'billing.plan.includes.api',
  'billing.plan.includes.automation',
  'billing.plan.includes.ai',
  'billing.plan.includes.support',
];

export function tierDecisionPending(tier: WebPlanTier): boolean {
  return (
    tier.projectAllowance === FOUNDER_DECISION_PENDING ||
    tier.monthlyPriceMinor === FOUNDER_DECISION_PENDING ||
    tier.annualPriceMinor === FOUNDER_DECISION_PENDING
  );
}

/** The only tiers a price page or a picker may show. */
export function publishableTiers(): readonly WebPlanTier[] {
  return WEB_PLAN_TIERS.filter((tier) => !tierDecisionPending(tier)).sort(
    (left, right) => left.rank - right.rank,
  );
}

/** Structure that is not a product yet. Counted, never priced. */
export function pendingTiers(): readonly WebPlanTier[] {
  return WEB_PLAN_TIERS.filter(tierDecisionPending).sort((left, right) => left.rank - right.rank);
}

/**
 * Just enough of the environment to answer "does this tier exist in Polar yet".
 * Passed in rather than read here so this module stays free of `process`, which
 * would otherwise follow it into every client bundle that imports a tier name.
 */
export type TierEnvironment = Readonly<Record<string, string | undefined>>;

/** True when both of a tier's Polar products are configured in this deployment. */
export function tierProductsConfigured(tier: WebPlanTier, env: TierEnvironment): boolean {
  const monthly = env[tier.monthlyProductIdEnvKey];
  const annual = env[tier.annualProductIdEnvKey];
  return monthly !== undefined && monthly.length > 0 && annual !== undefined && annual.length > 0;
}

/**
 * The tiers a visitor may actually be shown a price and a button for.
 *
 * Publishable is not the same as purchasable. A tier is publishable once the
 * founder has decided its numbers, which all three are; it becomes purchasable
 * only once its two Polar products exist, which is a fact about configuration
 * rather than about source. Larger tiers are therefore absent from the page
 * until the day their product ids are set, and present the day after, with no
 * code change and no hardcoded list of "the tiers we are showing this week".
 *
 * The base tier is the exception on purpose, and it is not a list of one: it is
 * the tier every workspace is on with or without a storefront, and the action
 * beside it starts a trial that collects no card. That button is honest in a
 * deployment with no Polar products at all, which is exactly the deployment
 * this rule keeps working (local development, preview builds, the demo).
 */
export function purchasableTiers(env: TierEnvironment): readonly WebPlanTier[] {
  return publishableTiers().filter(
    (tier) => tier.key === BASE_TIER_KEY || tierProductsConfigured(tier, env),
  );
}

/**
 * Twelve monthly charges minus one annual charge, in integer minor units.
 * Never a percentage: the saving is money, and money is what we state.
 */
export function annualSavingMinor(tier: WebPlanTier): number {
  return tier.monthlyPriceMinor * 12 - tier.annualPriceMinor;
}

/**
 * The annual saving expressed in whole months, or `null` when it does not land
 * on one. Two, on every tier in the ladder above, which is why the yearly view
 * can carry one badge instead of a stack of restatements of the same discount.
 *
 * `null` is a real answer, not a failure: a renderer that gets it states the
 * saving in money instead. Nothing rounds a fractional month into a whole one.
 */
export function freeMonthsEquivalent(tier: WebPlanTier): number | null {
  const saving = annualSavingMinor(tier);
  if (tier.monthlyPriceMinor <= 0 || saving <= 0) {
    return null;
  }
  return saving % tier.monthlyPriceMinor === 0 ? saving / tier.monthlyPriceMinor : null;
}

export function findTier(key: string | null): WebPlanTier | null {
  if (key === null) {
    return null;
  }
  return WEB_PLAN_TIERS.find((tier) => tier.key === key) ?? null;
}

/**
 * The active project allowance to render, or `null` when we do not know it.
 * `null` renders as "unavailable". It is never rendered as 0, because 0 would
 * be a claim that the workspace may hold no projects at all.
 */
export function displayProjectAllowance(tier: WebPlanTier | null): number | null {
  if (tier === null || tierDecisionPending(tier)) {
    return null;
  }
  return Math.min(MAX_PROJECT_LIMIT, Math.max(1, tier.projectAllowance));
}

/**
 * The active channel allowance to render, or `null` when we do not know it.
 *
 * Derived from the project allowance, exactly as `@relay/billing` derives it, so
 * a card cannot show a channel count the entitlement would not grant. Pooled
 * across the workspace, not fenced per project. Never rendered as 0.
 */
export function displayChannelAllowance(tier: WebPlanTier | null): number | null {
  const projects = displayProjectAllowance(tier);
  if (projects === null) {
    return null;
  }
  return Math.min(MAX_CHANNEL_LIMIT, channelAllowanceForProjects(projects));
}

/** Whole-currency amount for `Intl.NumberFormat`. Minor units are the source. */
export function priceUnits(minor: number): number {
  return minor / 100;
}

/**
 * The base tier's two prices in whole currency units.
 *
 * For the surfaces that render whole dollars rather than minor units. It exists
 * so those surfaces stop carrying their own copy of the figures: the landing
 * page held `const MONTHLY_PRICE_DOLLARS = 29` beside a grid that read the tier
 * module, and a reprice left the two disagreeing on the same screen. Reading
 * both from here means a reprice moves them together or not at all.
 */
export function baseTierPriceUnits(): { readonly month: number; readonly year: number } {
  const base = findTier(BASE_TIER_KEY);
  if (base === null) {
    throw new Error('The base tier is missing from WEB_PLAN_TIERS.');
  }
  return { month: priceUnits(base.monthlyPriceMinor), year: priceUnits(base.annualPriceMinor) };
}
