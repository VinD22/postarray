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
}

export const WEB_PLAN_TIERS: readonly WebPlanTier[] = [
  {
    key: 'relay_standard',
    rank: 0,
    projectAllowance: BASE_PROJECT_LIMIT,
    monthlyPriceMinor: 2_900,
    annualPriceMinor: 30_000,
    currency: 'USD',
    nameKey: 'billing.tier.standard.name',
    taglineKey: 'billing.tier.standard.tagline',
  },
  {
    key: 'relay_growth',
    rank: 1,
    projectAllowance: 10,
    monthlyPriceMinor: 5_900,
    annualPriceMinor: 61_200,
    currency: 'USD',
    nameKey: 'billing.tier.growth.name',
    taglineKey: 'billing.tier.growth.tagline',
  },
  {
    key: 'relay_studio',
    rank: 2,
    // The authorization ceiling exactly, so no surface claims "unlimited".
    projectAllowance: MAX_PROJECT_LIMIT,
    monthlyPriceMinor: 11_900,
    annualPriceMinor: 123_600,
    currency: 'USD',
    nameKey: 'billing.tier.studio.name',
    taglineKey: 'billing.tier.studio.tagline',
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
