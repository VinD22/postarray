import { describe, expect, it } from 'vitest';

import { BASE_PROJECT_LIMIT, MAX_CHANNEL_LIMIT, MAX_PROJECT_LIMIT } from '@relay/contracts';
import { en } from '@relay/i18n';

import { buildCheckoutDisclosure, resolveProductId } from './checkout';
import { TIER_PRESENTATIONS } from './products';
import { buildTierPresentation, tierPresentationStrings } from './tier-presentation';
import {
  BASE_TIER_KEY,
  FOUNDER_DECISION_PENDING,
  FOUNDER_DECISION_PENDING_ENV_KEY,
  PENDING_TIER_KEYS,
  PLAN_TIERS,
  PLAN_TIER_KEYS,
  PUBLISHABLE_TIER_KEYS,
  SHARED_INCLUSION_KEYS,
  isPublishableTier,
  planTier,
  productTiersFromProductIds,
  tierChannelAllowance,
  tierDecisionPending,
  tierForProductId,
  tierInclusionKeys,
  tierProjectAllowance,
} from './tiers';
import type { PlanTier, PlanTierKey } from './tiers';

const catalog = en as Readonly<Record<string, string>>;

const emptyConfig = {
  checkoutEnabled: false,
  accessToken: undefined,
  webhookSecret: undefined,
  server: 'sandbox' as const,
  monthlyProductId: undefined,
  annualProductId: undefined,
  growthMonthlyProductId: undefined,
  growthAnnualProductId: undefined,
  studioMonthlyProductId: undefined,
  studioAnnualProductId: undefined,
  productIdsByEnvKey: {},
  trialDays: 7,
};

describe('the tier table', () => {
  it('is project capacity and nothing else', () => {
    // A tier record has no field a feature gate, a seat price or a per channel
    // price could be expressed in. Adding one is the policy violation.
    const fields = Object.keys(PLAN_TIERS[BASE_TIER_KEY]).sort();
    expect(fields).toEqual([
      'annualPriceMinor',
      'annualProductIdEnvKey',
      'currency',
      'key',
      'monthlyPriceMinor',
      'monthlyProductIdEnvKey',
      'nameKey',
      'projectAllowance',
      'rank',
      'taglineKey',
    ]);
  });

  it('prices the base tier at $25 monthly, $250 annual, three projects', () => {
    const base = planTier(BASE_TIER_KEY);
    expect(base.key).toBe('relay_standard');
    expect(base.monthlyPriceMinor).toBe(2_500);
    expect(base.annualPriceMinor).toBe(25_000);
    expect(base.projectAllowance).toBe(BASE_PROJECT_LIMIT);
    expect(base.projectAllowance).toBe(3);
  });

  it('never grants more projects than the authorization ceiling', () => {
    for (const key of PLAN_TIER_KEYS) {
      const allowance = tierProjectAllowance(key);
      expect(allowance, key).toBeGreaterThanOrEqual(1);
      expect(allowance, key).toBeLessThanOrEqual(MAX_PROJECT_LIMIT);
      expect(allowance, key).toBeLessThanOrEqual(25);
    }
  });

  it('prices Growth at $50 monthly, $500 annual, ten projects', () => {
    const growth = planTier('relay_growth');
    expect(growth.monthlyPriceMinor).toBe(5_000);
    expect(growth.annualPriceMinor).toBe(50_000);
    expect(growth.projectAllowance).toBe(10);
    expect(growth.monthlyProductIdEnvKey).toBe('POLAR_GROWTH_MONTHLY_PRODUCT_ID');
    expect(growth.annualProductIdEnvKey).toBe('POLAR_GROWTH_ANNUAL_PRODUCT_ID');
  });

  it('prices Studio at $100 monthly, $1,000 annual, twenty-five projects', () => {
    const studio = planTier('relay_studio');
    expect(studio.monthlyPriceMinor).toBe(10_000);
    expect(studio.annualPriceMinor).toBe(100_000);
    expect(studio.projectAllowance).toBe(25);
    expect(studio.monthlyProductIdEnvKey).toBe('POLAR_STUDIO_MONTHLY_PRODUCT_ID');
    expect(studio.annualProductIdEnvKey).toBe('POLAR_STUDIO_ANNUAL_PRODUCT_ID');
  });

  it('saturates the authorization ceiling at the largest tier, never claiming unlimited', () => {
    expect(planTier('relay_studio').projectAllowance).toBe(MAX_PROJECT_LIMIT);
  });

  it('prices a year at ten months on every tier, so the offer is one sentence', () => {
    // Replaces an older rule that annual had to divide into twelve whole
    // dollars. That rule existed to keep a derived per-month figure printable;
    // this ladder does not print one, because ten-for-twelve is the clearer
    // offer and dividing it would produce $20.83. The pin moved to the fact the
    // pricing page now actually states, and it is stricter: every tier must
    // agree, so a future tier cannot quietly break the shared sentence.
    for (const key of PUBLISHABLE_TIER_KEYS) {
      const tier = planTier(key);
      expect(tier.annualPriceMinor, key).toBe(tier.monthlyPriceMinor * 10);
    }
  });

  it('publishes all three tiers now that the founder has decided them', () => {
    expect(PUBLISHABLE_TIER_KEYS).toEqual(['relay_standard', 'relay_growth', 'relay_studio']);
    expect(PENDING_TIER_KEYS).toEqual([]);
  });
});

/**
 * Channels are derived from projects, not sold. This is what lets a ten and a
 * twenty-five project tier exist without a per-channel price appearing anywhere.
 */
describe('the channel allowance a tier implies', () => {
  it('derives ten channels per project, one per launch platform, pooled across the workspace', () => {
    expect(tierChannelAllowance('relay_standard')).toBe(30);
    expect(tierChannelAllowance('relay_growth')).toBe(100);
    expect(tierChannelAllowance('relay_studio')).toBe(250);
  });

  it('never exceeds the authorization ceiling on any tier', () => {
    for (const key of PLAN_TIER_KEYS) {
      expect(tierChannelAllowance(key), key).toBeLessThanOrEqual(MAX_CHANNEL_LIMIT);
    }
  });

  it('is not a field on the tier record, so it can never carry a price', () => {
    for (const key of PLAN_TIER_KEYS) {
      expect(Object.keys(PLAN_TIERS[key])).not.toContain('channelAllowance');
    }
  });
});

describe('the configured product id map', () => {
  it('inverts the environment into a productId to tier mapping', () => {
    const mapping = productTiersFromProductIds({
      POLAR_MONTHLY_PRODUCT_ID: 'prod_std_m',
      POLAR_ANNUAL_PRODUCT_ID: 'prod_std_y',
      POLAR_GROWTH_MONTHLY_PRODUCT_ID: 'prod_gro_m',
      POLAR_STUDIO_ANNUAL_PRODUCT_ID: 'prod_stu_y',
    });
    expect(mapping).toEqual({
      prod_std_m: 'relay_standard',
      prod_std_y: 'relay_standard',
      prod_gro_m: 'relay_growth',
      prod_stu_y: 'relay_studio',
    });
  });

  it('ignores an absent or blank product id rather than mapping an empty key', () => {
    const mapping = productTiersFromProductIds({
      POLAR_MONTHLY_PRODUCT_ID: '',
      POLAR_GROWTH_ANNUAL_PRODUCT_ID: undefined,
    });
    expect(mapping).toEqual({});
  });
});

/**
 * The no-feature-gating invariant. If this fails, someone has made a tier buy
 * a feature rather than project capacity, which section 2.2 of
 * `docs/planning/08-billing-entitlements-and-economics.md` forbids outright.
 */
describe('every tier gets every feature', () => {
  const gatingMessage =
    'A tier has a different feature list. Tiers buy active project capacity only. ' +
    'Feature gated tiers are a policy violation, not a pricing experiment.';

  it('gives every tier the identical inclusion list', () => {
    for (const key of PLAN_TIER_KEYS) {
      expect(tierInclusionKeys(key), `${key}: ${gatingMessage}`).toEqual(SHARED_INCLUSION_KEYS);
      expect(tierInclusionKeys(key), `${key}: ${gatingMessage}`).toBe(SHARED_INCLUSION_KEYS);
    }
  });

  it('gives every presented tier the identical inclusion list', () => {
    for (const presentation of TIER_PRESENTATIONS) {
      expect(presentation.inclusionKeys, `${presentation.tierKey}: ${gatingMessage}`).toEqual(
        SHARED_INCLUSION_KEYS,
      );
    }
  });

  it('does not list project capacity as a feature, because it is the price', () => {
    expect(SHARED_INCLUSION_KEYS).not.toContain('billing.plan.includes.projects');
  });

  it('resolves every inclusion key in the English catalog', () => {
    for (const key of SHARED_INCLUSION_KEYS) {
      expect(catalog[key], key).toBeTypeOf('string');
    }
  });
});

/**
 * The sentinel guard. A tier that still carries a founder placeholder must be
 * impossible to price, impossible to present and impossible to buy. If a
 * placeholder is ever replaced by hand in only some of its fields, this fails.
 *
 * All three shipped tiers are decided, so the loops below are empty today. The
 * synthetic cases keep the machinery itself proven, because the guard has to
 * still work on the day a fourth tier is added as structure.
 */
describe('a founder placeholder can never reach a customer', () => {
  function syntheticTier(overrides: Partial<PlanTier>): PlanTier {
    return { ...PLAN_TIERS[BASE_TIER_KEY], ...overrides };
  }

  it('refuses a tier whose numbers or product ids are still placeholders', () => {
    expect(tierDecisionPending(PLAN_TIERS[BASE_TIER_KEY])).toBe(false);
    expect(tierDecisionPending(syntheticTier({ projectAllowance: FOUNDER_DECISION_PENDING }))).toBe(
      true,
    );
    expect(
      tierDecisionPending(syntheticTier({ monthlyPriceMinor: FOUNDER_DECISION_PENDING })),
    ).toBe(true);
    expect(tierDecisionPending(syntheticTier({ annualPriceMinor: FOUNDER_DECISION_PENDING }))).toBe(
      true,
    );
    expect(
      tierDecisionPending(
        syntheticTier({ monthlyProductIdEnvKey: FOUNDER_DECISION_PENDING_ENV_KEY }),
      ),
    ).toBe(true);
    expect(
      tierDecisionPending(
        syntheticTier({ annualProductIdEnvKey: FOUNDER_DECISION_PENDING_ENV_KEY }),
      ),
    ).toBe(true);
  });

  it('refuses a half-replaced tier, not just a wholly pending one', () => {
    // Prices decided, product ids forgotten. The dangerous half.
    expect(
      tierDecisionPending(
        syntheticTier({
          projectAllowance: 12,
          monthlyPriceMinor: 7_900,
          annualPriceMinor: 79_200,
          monthlyProductIdEnvKey: FOUNDER_DECISION_PENDING_ENV_KEY,
          annualProductIdEnvKey: FOUNDER_DECISION_PENDING_ENV_KEY,
        }),
      ),
    ).toBe(true);
  });

  function pendingFields(key: PlanTierKey): readonly string[] {
    const tier = PLAN_TIERS[key];
    return Object.entries(tier)
      .filter(
        ([, value]) =>
          value === FOUNDER_DECISION_PENDING || value === FOUNDER_DECISION_PENDING_ENV_KEY,
      )
      .map(([field]) => field);
  }

  it('excludes any tier carrying a sentinel from the publishable set', () => {
    for (const key of PLAN_TIER_KEYS) {
      const pending = pendingFields(key);
      if (pending.length === 0) {
        continue;
      }
      expect(
        isPublishableTier(key),
        `${key} still carries founder placeholders in ${pending.join(', ')} and must not be sold`,
      ).toBe(false);
      expect(PUBLISHABLE_TIER_KEYS, key).not.toContain(key);
    }
  });

  it('keeps every sentinel out of customer facing pricing copy', () => {
    const rendered = TIER_PRESENTATIONS.flatMap((presentation) => [
      presentation.tierKey,
      ...tierPresentationStrings(presentation),
    ]);
    for (const value of rendered) {
      expect(value).not.toContain(String(FOUNDER_DECISION_PENDING));
      expect(value).not.toContain(FOUNDER_DECISION_PENDING_ENV_KEY);
      expect(PENDING_TIER_KEYS).not.toContain(value);
    }
  });

  it('refuses to build a presentation for a pending tier', () => {
    for (const key of PENDING_TIER_KEYS) {
      expect(() => buildTierPresentation(key, 7), key).toThrow();
    }
  });

  it('refuses to disclose or check out a pending tier', () => {
    for (const key of PENDING_TIER_KEYS) {
      expect(
        () =>
          buildCheckoutDisclosure({
            interval: 'month',
            startedAt: '2026-08-10T00:00:00.000Z',
            tier: key,
          }),
        key,
      ).toThrow();
      expect(
        () =>
          resolveProductId({
            config: emptyConfig,
            interval: 'month',
            tier: key,
            allowSimulatorFallback: true,
          }),
        key,
      ).toThrow();
    }
  });

  it('never lets a pending tier grant capacity, even if a product mapped to it', () => {
    for (const key of PENDING_TIER_KEYS) {
      expect(tierProjectAllowance(key), key).toBe(BASE_PROJECT_LIMIT);
      expect(tierForProductId('prod_unknown', { prod_unknown: key }), key).toBe(BASE_TIER_KEY);
    }
  });
});

describe('mapping a Polar product to a tier', () => {
  it('falls back to the base tier for an unknown product, never to unlimited', () => {
    expect(tierForProductId('prod_never_seen')).toBe(BASE_TIER_KEY);
    expect(tierForProductId('prod_never_seen', {})).toBe(BASE_TIER_KEY);
    expect(tierForProductId('prod_x', { prod_x: 'not_a_tier' })).toBe(BASE_TIER_KEY);
    expect(tierProjectAllowance(tierForProductId('prod_never_seen'))).toBe(3);
  });

  it('honours a configured mapping to a publishable tier', () => {
    expect(tierForProductId('prod_base', { prod_base: BASE_TIER_KEY })).toBe(BASE_TIER_KEY);
    expect(tierForProductId('prod_gro', { prod_gro: 'relay_growth' })).toBe('relay_growth');
    expect(tierForProductId('prod_stu', { prod_stu: 'relay_studio' })).toBe('relay_studio');
  });

  it('grants the capacity the mapped tier sells, projects and channels alike', () => {
    const growth = tierForProductId('prod_gro', { prod_gro: 'relay_growth' });
    expect(tierProjectAllowance(growth)).toBe(10);
    expect(tierChannelAllowance(growth)).toBe(100);
  });
});
