import { describe, expect, it } from 'vitest';

import { en } from '@relay/i18n';

import { BILLING_MESSAGE_KEYS } from './messages';
import {
  ANNUAL_EFFECTIVE_MONTHLY_MINOR,
  ANNUAL_PRICE_MINOR,
  ANNUAL_SAVING_BASIS_POINTS,
  ANNUAL_SAVING_MINOR,
  MANDATED_COPY,
  MONTHLY_PRICE_MINOR,
  PLAN_INCLUSION_KEYS,
  PRICE_PRESENTATION,
  TIER_PRESENTATIONS,
  TRIAL_DAYS,
  derivedAnnualFramingAmounts,
  normalizeInterval,
  planPriceMinor,
  trialLengthMatches,
} from './products';

const catalog = en as Readonly<Record<string, string>>;

describe('the base tier', () => {
  it('prices monthly at $29 and annual at $300', () => {
    expect(MONTHLY_PRICE_MINOR).toBe(2_900);
    expect(ANNUAL_PRICE_MINOR).toBe(30_000);
    expect(planPriceMinor('month')).toBe(2_900);
    expect(planPriceMinor('year')).toBe(30_000);
  });

  it('derives the annual framing from the prices, not from a hand written number', () => {
    expect(ANNUAL_EFFECTIVE_MONTHLY_MINOR).toBe(2_500);
    expect(ANNUAL_SAVING_MINOR).toBe(MONTHLY_PRICE_MINOR * 12 - ANNUAL_PRICE_MINOR);
    expect(ANNUAL_SAVING_MINOR).toBe(4_800);
  });

  it('is a 13.8% saving, which is why it is never described as 20% off', () => {
    expect(ANNUAL_SAVING_BASIS_POINTS).toBe(1_379);
    expect(ANNUAL_SAVING_BASIS_POINTS).toBeLessThan(2_000);
  });

  it('formats the presentation amounts from the minor units', () => {
    expect(PRICE_PRESENTATION.month.priceText).toBe('$29');
    expect(PRICE_PRESENTATION.month.exactPriceText).toBe('$29.00');
    expect(PRICE_PRESENTATION.year.priceText).toBe('$300');
    expect(PRICE_PRESENTATION.year.exactPriceText).toBe('$300.00');
    expect(PRICE_PRESENTATION.annualFraming.effectiveMonthlyText).toBe('$25');
    expect(PRICE_PRESENTATION.annualFraming.savingText).toBe('$48');
  });

  it('carries a seven day trial on both intervals', () => {
    expect(TRIAL_DAYS).toBe(7);
    expect(PRICE_PRESENTATION.month.trialDays).toBe(7);
    expect(PRICE_PRESENTATION.year.trialDays).toBe(7);
    expect(trialLengthMatches(7, 7)).toBe(true);
    expect(trialLengthMatches(14, 7)).toBe(false);
    expect(trialLengthMatches(14, 14)).toBe(false);
  });

  it('normalises the Polar recurring interval spellings', () => {
    expect(normalizeInterval('month')).toBe('month');
    expect(normalizeInterval('monthly')).toBe('month');
    expect(normalizeInterval('year')).toBe('year');
    expect(normalizeInterval('annual')).toBe('year');
    expect(normalizeInterval('week')).toBeNull();
  });
});

describe('the presentation object agrees with the English catalog', () => {
  it('renders "$0 due today" exactly', () => {
    expect(PRICE_PRESENTATION.trialDueTodayText).toBe('$0 due today');
    expect(catalog[PRICE_PRESENTATION.trialDueTodayKey]).toBe(MANDATED_COPY.dueToday);
  });

  it('renders the annual framing in money, exactly as the catalog does', () => {
    expect(catalog[PRICE_PRESENTATION.annualFraming.framingKey]).toBe(MANDATED_COPY.annualFraming);
    expect(PRICE_PRESENTATION.annualFraming.framingText).toBe(
      '$25/month billed annually. Save $48/year.',
    );
  });

  it('ties the mandated annual sentence to the arithmetic, so it cannot drift', () => {
    const derived = derivedAnnualFramingAmounts();
    expect(derived.perMonth).toBe('$25');
    expect(derived.saving).toBe('$48');
    // Change either price without rewording the sentence and this fails.
    expect(MANDATED_COPY.annualFraming).toContain(`${derived.perMonth}/month`);
    expect(MANDATED_COPY.annualFraming).toContain(`Save ${derived.saving}/year`);
    expect(catalog['billing.plan.annualFraming']).toContain(derived.perMonth);
    expect(catalog['billing.plan.annualFraming']).toContain(derived.saving);
  });

  it('keeps the headline prices in step with the catalog', () => {
    expect(catalog[PRICE_PRESENTATION.month.headlineKey]).toBe(MANDATED_COPY.monthlyPrice);
    expect(catalog[PRICE_PRESENTATION.year.headlineKey]).toBe(MANDATED_COPY.annualPrice);
  });

  it('references only message keys that exist', () => {
    const keys = [
      PRICE_PRESENTATION.nameKey,
      PRICE_PRESENTATION.taglineKey,
      PRICE_PRESENTATION.month.headlineKey,
      PRICE_PRESENTATION.month.labelKey,
      PRICE_PRESENTATION.year.headlineKey,
      PRICE_PRESENTATION.year.labelKey,
      PRICE_PRESENTATION.annualFraming.framingKey,
      PRICE_PRESENTATION.trialDueTodayKey,
      PRICE_PRESENTATION.fairUseKey,
      PRICE_PRESENTATION.mediaGenerationBoundaryKey,
      PRICE_PRESENTATION.meteredUsageKey,
      PRICE_PRESENTATION.cancellationKey,
      ...PLAN_INCLUSION_KEYS,
      ...Object.values(BILLING_MESSAGE_KEYS),
    ];
    for (const key of keys) {
      expect(catalog[key], key).toBeTypeOf('string');
    }
  });

  it('states the 10 active channel allowance', () => {
    expect(PRICE_PRESENTATION.activeChannelAllowance).toBe(10);
    expect(catalog['billing.plan.includes.channels']).toContain('10');
  });

  it('states the three-project base allowance', () => {
    expect(PRICE_PRESENTATION.projectAllowance).toBe(3);
    expect(catalog['billing.plan.includes.projects']).toContain('3');
  });
});

describe('the tier presentations every pricing surface renders', () => {
  it('offers all three decided tiers, cheapest first', () => {
    expect(TIER_PRESENTATIONS.map((tier) => tier.tierKey)).toEqual([
      'relay_standard',
      'relay_growth',
      'relay_studio',
    ]);
  });

  it('derives every amount from the tier minor units', () => {
    const base = TIER_PRESENTATIONS[0];
    expect(base).toBeDefined();
    if (base === undefined) {
      return;
    }
    expect(base.month.priceText).toBe('$29');
    expect(base.year.priceText).toBe('$300');
    expect(base.annualFraming.effectiveMonthlyMinor * 12).toBe(base.year.priceMinor);
    expect(base.annualFraming.effectiveMonthlyIsExact).toBe(true);
    expect(base.annualFraming.savingMinor).toBe(base.month.priceMinor * 12 - base.year.priceMinor);
    expect(base.projectAllowance).toBe(3);
  });

  it('renders the ladder a buyer actually chooses from', () => {
    const rendered = TIER_PRESENTATIONS.map((tier) => ({
      tier: tier.tierKey,
      month: tier.month.priceText,
      year: tier.year.priceText,
      projects: tier.projectAllowance,
      channels: tier.channelAllowance,
    }));
    expect(rendered).toEqual([
      { tier: 'relay_standard', month: '$29', year: '$300', projects: 3, channels: 15 },
      { tier: 'relay_growth', month: '$59', year: '$612', projects: 10, channels: 50 },
      { tier: 'relay_studio', month: '$119', year: '$1,236', projects: 20, channels: 100 },
    ]);
  });

  it('states an exact per-month equivalent on every tier, never a rounded one', () => {
    for (const tier of TIER_PRESENTATIONS) {
      expect(tier.annualFraming.effectiveMonthlyIsExact, tier.tierKey).toBe(true);
      expect(tier.annualFraming.effectiveMonthlyMinor * 12, tier.tierKey).toBe(
        tier.year.priceMinor,
      );
    }
  });

  it('references only message keys that exist', () => {
    for (const tier of TIER_PRESENTATIONS) {
      for (const key of [
        tier.nameKey,
        tier.taglineKey,
        tier.projectAllowanceKey,
        tier.channelAllowanceKey,
        tier.annualFraming.framingKey,
        tier.annualFraming.mandatedFramingKey,
        tier.month.labelKey,
        tier.year.labelKey,
        ...tier.inclusionKeys,
      ]) {
        expect(catalog[key], key).toBeTypeOf('string');
      }
    }
  });
});
