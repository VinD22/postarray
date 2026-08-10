import { describe, expect, it } from 'vitest';

import { BASE_PROJECT_LIMIT, MAX_PROJECT_LIMIT } from '@relay/contracts';
import { en } from '@relay/i18n';

import {
  BASE_TIER_KEY,
  FOUNDER_DECISION_PENDING,
  WEB_PLAN_TIERS,
  WEB_SHARED_INCLUSION_KEYS,
  displayProjectAllowance,
  findTier,
  pendingTiers,
  priceUnits,
  publishableTiers,
} from './tiers';

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

  it('keeps founder placeholders out of anything a visitor sees', () => {
    expect(publishableTiers().map((tier) => tier.key)).toEqual([BASE_TIER_KEY]);
    expect(pendingTiers().map((tier) => tier.key)).toEqual(['relay_growth', 'relay_studio']);
    for (const tier of publishableTiers()) {
      expect(tier.projectAllowance).not.toBe(FOUNDER_DECISION_PENDING);
      expect(tier.monthlyPriceMinor).not.toBe(FOUNDER_DECISION_PENDING);
      expect(tier.annualPriceMinor).not.toBe(FOUNDER_DECISION_PENDING);
    }
  });

  it('renders an undecided or unknown allowance as unavailable, never as 0', () => {
    for (const tier of pendingTiers()) {
      expect(displayProjectAllowance(tier), tier.key).toBeNull();
    }
    expect(displayProjectAllowance(null)).toBeNull();
    expect(displayProjectAllowance(findTier(BASE_TIER_KEY))).toBe(3);
    expect(displayProjectAllowance(findTier('relay_nonexistent'))).toBeNull();
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
