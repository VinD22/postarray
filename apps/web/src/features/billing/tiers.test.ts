import { describe, expect, it } from 'vitest';

import { BASE_PROJECT_LIMIT, MAX_CHANNEL_LIMIT, MAX_PROJECT_LIMIT } from '@relay/contracts';
import { en } from '@relay/i18n';

import {
  BASE_TIER_KEY,
  FOUNDER_DECISION_PENDING,
  WEB_PLAN_TIERS,
  WEB_SHARED_INCLUSION_KEYS,
  annualSavingMinor,
  displayChannelAllowance,
  displayProjectAllowance,
  findTier,
  freeMonthsEquivalent,
  pendingTiers,
  priceUnits,
  publishableTiers,
  purchasableTiers,
  tierDecisionPending,
  tierProductsConfigured,
} from './tiers';
import type { WebPlanTier } from './tiers';

const catalog = en as Readonly<Record<string, string>>;

describe('the web tier table', () => {
  it('mirrors the base allowance from the contracts package', () => {
    const base = findTier(BASE_TIER_KEY);
    expect(base?.projectAllowance).toBe(BASE_PROJECT_LIMIT);
    expect(base?.projectAllowance).toBe(3);
    expect(base?.monthlyPriceMinor).toBe(2_500);
    expect(base?.annualPriceMinor).toBe(25_000);
    expect(priceUnits(2_500)).toBe(25);
    expect(priceUnits(25_000)).toBe(250);
  });

  it('never shows a tier above the authorization ceiling', () => {
    for (const tier of publishableTiers()) {
      expect(tier.projectAllowance, tier.key).toBeGreaterThanOrEqual(1);
      expect(tier.projectAllowance, tier.key).toBeLessThanOrEqual(MAX_PROJECT_LIMIT);
    }
  });

  it('mirrors the Growth and Studio numbers from the billing package', () => {
    const growth = findTier('relay_growth');
    expect(growth?.projectAllowance).toBe(10);
    expect(growth?.monthlyPriceMinor).toBe(5_000);
    expect(growth?.annualPriceMinor).toBe(50_000);
    expect(priceUnits(5_000)).toBe(50);
    expect(priceUnits(50_000)).toBe(500);

    const studio = findTier('relay_studio');
    expect(studio?.projectAllowance).toBe(MAX_PROJECT_LIMIT);
    expect(studio?.monthlyPriceMinor).toBe(10_000);
    expect(studio?.annualPriceMinor).toBe(100_000);
    expect(priceUnits(10_000)).toBe(100);
    expect(priceUnits(100_000)).toBe(1_000);
  });

  /**
   * The ladder's shape, which is what makes the yearly view presentable at all.
   * A year costs ten months everywhere, so the saving is exactly two months on
   * every tier, and no surface ever has to divide an annual price by twelve
   * into a headline carrying cents.
   */
  it('prices a year at ten months on every tier, so the saving is two months', () => {
    for (const tier of publishableTiers()) {
      expect(tier.annualPriceMinor, tier.key).toBe(tier.monthlyPriceMinor * 10);
      expect(annualSavingMinor(tier), tier.key).toBe(tier.monthlyPriceMinor * 2);
      expect(freeMonthsEquivalent(tier), tier.key).toBe(2);
      // Whole dollars in both intervals: a price with cents in it is the
      // presentation the pricing page exists to refuse.
      expect(tier.monthlyPriceMinor % 100, tier.key).toBe(0);
      expect(tier.annualPriceMinor % 100, tier.key).toBe(0);
    }
  });

  /**
   * The previous ladder ($29 a month, $300 a year) saved $48, which is 1.65
   * months. Nothing rounds that to two: the badge disappears and the yearly
   * view falls back to money, which is always exact. Proved on a synthetic
   * tier so it keeps being proved after the real ladder divides cleanly.
   */
  it('declines to invent a whole-month saving when the ladder stops dividing', () => {
    const awkward: WebPlanTier = {
      key: 'relay_awkward',
      rank: 9,
      projectAllowance: 3,
      monthlyPriceMinor: 2_900,
      annualPriceMinor: 30_000,
      currency: 'USD',
      nameKey: 'billing.tier.standard.name',
      taglineKey: 'billing.tier.standard.tagline',
      monthlyProductIdEnvKey: 'POLAR_AWKWARD_MONTHLY_PRODUCT_ID',
      annualProductIdEnvKey: 'POLAR_AWKWARD_ANNUAL_PRODUCT_ID',
    };
    expect(annualSavingMinor(awkward)).toBe(4_800);
    expect(freeMonthsEquivalent(awkward)).toBeNull();
  });

  /**
   * Publishable is not purchasable.
   *
   * All three tiers are decided, so all three are publishable. A tier becomes
   * purchasable only once its two Polar products are configured, which is a
   * fact about the deployment rather than about source. That is what keeps
   * Growth and Studio off the price page today without anyone maintaining a
   * hardcoded list of "the tiers we are showing this week", and what makes
   * them appear the day the products exist.
   */
  describe('purchasability', () => {
    const EVERY_PRODUCT = {
      POLAR_MONTHLY_PRODUCT_ID: 'prod_m',
      POLAR_ANNUAL_PRODUCT_ID: 'prod_a',
      POLAR_GROWTH_MONTHLY_PRODUCT_ID: 'prod_gm',
      POLAR_GROWTH_ANNUAL_PRODUCT_ID: 'prod_ga',
      POLAR_STUDIO_MONTHLY_PRODUCT_ID: 'prod_sm',
      POLAR_STUDIO_ANNUAL_PRODUCT_ID: 'prod_sa',
    };

    it('offers the base tier in a deployment with no storefront at all', () => {
      // Its action starts a trial that collects no card, so it is honest here.
      expect(purchasableTiers({}).map((tier) => tier.key)).toEqual([BASE_TIER_KEY]);
    });

    it('grows the ladder on its own once the products exist', () => {
      expect(purchasableTiers(EVERY_PRODUCT).map((tier) => tier.key)).toEqual([
        BASE_TIER_KEY,
        'relay_growth',
        'relay_studio',
      ]);
    });

    it('needs both intervals configured before it will offer a larger tier', () => {
      const halfConfigured = {
        ...EVERY_PRODUCT,
        POLAR_GROWTH_ANNUAL_PRODUCT_ID: '',
        POLAR_STUDIO_ANNUAL_PRODUCT_ID: undefined,
      };
      expect(purchasableTiers(halfConfigured).map((tier) => tier.key)).toEqual([BASE_TIER_KEY]);
    });

    it('reads the env keys the billing package names, not a guess at them', () => {
      const growth = findTier('relay_growth');
      expect(growth?.monthlyProductIdEnvKey).toBe('POLAR_GROWTH_MONTHLY_PRODUCT_ID');
      expect(growth?.annualProductIdEnvKey).toBe('POLAR_GROWTH_ANNUAL_PRODUCT_ID');
      expect(growth === null ? false : tierProductsConfigured(growth, EVERY_PRODUCT)).toBe(true);
      expect(growth === null ? true : tierProductsConfigured(growth, {})).toBe(false);
    });

    it('never offers a tier the founder has not decided, however it is configured', () => {
      for (const tier of purchasableTiers(EVERY_PRODUCT)) {
        expect(tierDecisionPending(tier), tier.key).toBe(false);
      }
    });
  });

  it('shows all three decided tiers and keeps placeholders out of anything a visitor sees', () => {
    expect(publishableTiers().map((tier) => tier.key)).toEqual([
      BASE_TIER_KEY,
      'relay_growth',
      'relay_studio',
    ]);
    expect(pendingTiers()).toEqual([]);
    for (const tier of publishableTiers()) {
      expect(tier.projectAllowance).not.toBe(FOUNDER_DECISION_PENDING);
      expect(tier.monthlyPriceMinor).not.toBe(FOUNDER_DECISION_PENDING);
      expect(tier.annualPriceMinor).not.toBe(FOUNDER_DECISION_PENDING);
    }
  });

  /**
   * The placeholder machinery outlives the placeholders. All three tiers are
   * decided today, so this proves the guard on a synthetic tier instead of
   * passing vacuously over an empty list.
   */
  it('still refuses to price a tier that is only structure', () => {
    const undecided: WebPlanTier = {
      key: 'relay_future',
      rank: 3,
      projectAllowance: FOUNDER_DECISION_PENDING,
      monthlyPriceMinor: FOUNDER_DECISION_PENDING,
      annualPriceMinor: FOUNDER_DECISION_PENDING,
      currency: 'USD',
      nameKey: 'billing.tier.growth.name',
      taglineKey: 'billing.tier.growth.tagline',
      monthlyProductIdEnvKey: 'POLAR_FUTURE_MONTHLY_PRODUCT_ID',
      annualProductIdEnvKey: 'POLAR_FUTURE_ANNUAL_PRODUCT_ID',
    };
    expect(tierDecisionPending(undecided)).toBe(true);
    expect(displayProjectAllowance(undecided)).toBeNull();
    expect(displayChannelAllowance(undecided)).toBeNull();
  });

  it('renders an undecided or unknown allowance as unavailable, never as 0', () => {
    for (const tier of pendingTiers()) {
      expect(displayProjectAllowance(tier), tier.key).toBeNull();
    }
    expect(displayProjectAllowance(null)).toBeNull();
    expect(displayProjectAllowance(findTier(BASE_TIER_KEY))).toBe(3);
    expect(displayProjectAllowance(findTier('relay_nonexistent'))).toBeNull();
  });

  it('derives the channel allowance from the project allowance, never from a price', () => {
    expect(displayChannelAllowance(findTier(BASE_TIER_KEY))).toBe(30);
    expect(displayChannelAllowance(findTier('relay_growth'))).toBe(100);
    expect(displayChannelAllowance(findTier('relay_studio'))).toBe(MAX_CHANNEL_LIMIT);
    expect(displayChannelAllowance(null)).toBeNull();
    expect(displayChannelAllowance(findTier('relay_nonexistent'))).toBeNull();
  });

  it('gives every tier the same feature list, because nothing is gated', () => {
    expect(WEB_SHARED_INCLUSION_KEYS).not.toContain('billing.plan.includes.projects');
    for (const key of WEB_SHARED_INCLUSION_KEYS) {
      expect(catalog[key], key).toBeTypeOf('string');
    }
  });

  it('names every tier through a catalog key, never a literal', () => {
    for (const tier of WEB_PLAN_TIERS) {
      expect(catalog[tier.nameKey], tier.nameKey).toBeTypeOf('string');
      expect(catalog[tier.taglineKey], tier.taglineKey).toBeTypeOf('string');
      expect(catalog[tier.nameKey]).not.toContain('—');
      expect(catalog[tier.taglineKey]).not.toContain('—');
    }
  });
});
