import { describe, expect, it } from 'vitest';

import { BASE_PROJECT_LIMIT, MAX_PROJECT_LIMIT } from '@relay/contracts';
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
  tierForProductId,
  tierInclusionKeys,
  tierProjectAllowance,
} from './tiers';
import type { PlanTierKey } from './tiers';

const catalog = en as Readonly<Record<string, string>>;

const emptyConfig = {
  checkoutEnabled: false,
  accessToken: undefined,
  webhookSecret: undefined,
  server: 'sandbox' as const,
  monthlyProductId: undefined,
  annualProductId: undefined,
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

  it('prices the base tier at $29 monthly, $300 annual, three projects', () => {
    const base = planTier(BASE_TIER_KEY);
    expect(base.key).toBe('relay_standard');
    expect(base.monthlyPriceMinor).toBe(2_900);
    expect(base.annualPriceMinor).toBe(30_000);
    expect(base.projectAllowance).toBe(BASE_PROJECT_LIMIT);
    expect(base.projectAllowance).toBe(3);
  });

  it('never grants more projects than the authorization ceiling', () => {
    for (const key of PLAN_TIER_KEYS) {
      const allowance = tierProjectAllowance(key);
      expect(allowance, key).toBeGreaterThanOrEqual(1);
      expect(allowance, key).toBeLessThanOrEqual(MAX_PROJECT_LIMIT);
      expect(allowance, key).toBeLessThanOrEqual(20);
    }
  });

  it('keeps two founder placeholder tiers as structure, not as products', () => {
    expect(PUBLISHABLE_TIER_KEYS).toEqual([BASE_TIER_KEY]);
    expect(PENDING_TIER_KEYS).toEqual(['relay_growth', 'relay_studio']);
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
 */
describe('a founder placeholder can never reach a customer', () => {
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
  });
});
