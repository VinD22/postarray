import { describe, expect, it } from 'vitest';

import { BASE_PROJECT_LIMIT, MAX_CHANNEL_LIMIT, MAX_PROJECT_LIMIT } from '@relay/contracts';
import { en } from '@relay/i18n';

import {
  BASE_TIER_KEY,
  FOUNDER_DECISION_PENDING,
  WEB_PLAN_TIERS,
  WEB_SHARED_INCLUSION_KEYS,
  displayChannelAllowance,
  displayProjectAllowance,
  findTier,
  pendingTiers,
  priceUnits,
  publishableTiers,
  tierDecisionPending,
} from './tiers';
import type { WebPlanTier } from './tiers';

const catalog = en as Readonly<Record<string, string>>;

describe('the web tier table', () => {
  it('mirrors the base allowance from the contracts package', () => {
    const base = findTier(BASE_TIER_KEY);
    expect(base?.projectAllowance).toBe(BASE_PROJECT_LIMIT);
    expect(base?.projectAllowance).toBe(3);
    expect(base?.monthlyPriceMinor).toBe(2_900);
    expect(base?.annualPriceMinor).toBe(30_000);
    expect(priceUnits(2_900)).toBe(29);
    expect(priceUnits(30_000)).toBe(300);
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
    expect(growth?.monthlyPriceMinor).toBe(5_900);
    expect(growth?.annualPriceMinor).toBe(61_200);
    expect(priceUnits(5_900)).toBe(59);
    expect(priceUnits(61_200)).toBe(612);

    const studio = findTier('relay_studio');
    expect(studio?.projectAllowance).toBe(MAX_PROJECT_LIMIT);
    expect(studio?.monthlyPriceMinor).toBe(11_900);
    expect(studio?.annualPriceMinor).toBe(123_600);
    expect(priceUnits(11_900)).toBe(119);
    expect(priceUnits(123_600)).toBe(1_236);
  });

  it('divides every annual price into twelve whole dollars', () => {
    for (const tier of publishableTiers()) {
      expect(tier.annualPriceMinor % 1_200, tier.key).toBe(0);
    }
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
    expect(displayChannelAllowance(findTier(BASE_TIER_KEY))).toBe(15);
    expect(displayChannelAllowance(findTier('relay_growth'))).toBe(50);
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
