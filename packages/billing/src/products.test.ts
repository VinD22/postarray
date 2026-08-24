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
  it('prices monthly at $25 and annual at $250', () => {
    expect(MONTHLY_PRICE_MINOR).toBe(2_500);
    expect(ANNUAL_PRICE_MINOR).toBe(25_000);
    expect(planPriceMinor('month')).toBe(2_500);
    expect(planPriceMinor('year')).toBe(25_000);
  });

  it('derives the annual framing from the prices, not from a hand written number', () => {
    expect(ANNUAL_SAVING_MINOR).toBe(MONTHLY_PRICE_MINOR * 12 - ANNUAL_PRICE_MINOR);
    expect(ANNUAL_SAVING_MINOR).toBe(5_000);
    // Two months, exactly, which is the whole of the annual offer.
    expect(ANNUAL_SAVING_MINOR).toBe(MONTHLY_PRICE_MINOR * 2);
  });

  it('does not divide the annual price into twelve, because it does not divide', () => {
    // $250 over twelve is $20.8333…, a fractional cent. This is the arithmetic
    // reason a year is quoted as a year on every surface rather than as a
    // per-month equivalent: rendering this number produces a price with cents
    // in it, which is the presentation the owner rejected outright.
    //
    // Pinned rather than deleted so that a future ladder which *does* divide
    // cleanly has to come here and decide deliberately to print a monthly
    // figure again, instead of one silently reappearing.
    expect(ANNUAL_EFFECTIVE_MONTHLY_MINOR * 12).toBe(ANNUAL_PRICE_MINOR);
    expect(Number.isInteger(ANNUAL_EFFECTIVE_MONTHLY_MINOR)).toBe(false);
    expect(MANDATED_COPY.annualFraming).not.toContain('/month');
  });

  it('is a two month saving, stated in months and money but never as a percentage', () => {
    // 1,667 basis points is 16.67%, which is what ten-months-for-twelve works
    // out to. The figure is pinned because the copy must never round it into
    // "20% off", and it is never rendered: every surface says two months free
    // or fifty dollars, both of which are exact.
    expect(ANNUAL_SAVING_BASIS_POINTS).toBe(1_667);
    expect(ANNUAL_SAVING_BASIS_POINTS).toBeLessThan(2_000);
  });

  it('formats the presentation amounts from the minor units', () => {
    expect(PRICE_PRESENTATION.month.priceText).toBe('$25');
    expect(PRICE_PRESENTATION.month.exactPriceText).toBe('$25.00');
    expect(PRICE_PRESENTATION.year.priceText).toBe('$250');
    expect(PRICE_PRESENTATION.year.exactPriceText).toBe('$250.00');
    expect(PRICE_PRESENTATION.annualFraming.savingText).toBe('$50');
    expect(PRICE_PRESENTATION.annualFraming.freeMonthsEquivalent).toBe(2);
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
      'Save $50/year. That is 2 months free.',
    );
  });

  it('ties the mandated annual sentence to the arithmetic, so it cannot drift', () => {
    const derived = derivedAnnualFramingAmounts();
    expect(derived.saving).toBe('$50');
    expect(derived.freeMonths).toBe(2);
    // Change either price without rewording the sentence and this fails. The
    // per-month half of the old assertion is gone with the figure it checked:
    // an annual plan is quoted as a year, so there is no monthly amount in the
    // sentence to keep in step.
    expect(MANDATED_COPY.annualFraming).toContain(`Save ${derived.saving}/year`);
    expect(catalog['billing.plan.annualFraming']).toContain(derived.saving);
    // The second claim the sentence makes. Both halves are tied to arithmetic,
    // so neither the money nor the month count can drift from the charge.
    expect(catalog['billing.plan.annualFraming']).toContain(
      String(PRICE_PRESENTATION.annualFraming.freeMonthsEquivalent),
    );
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
    expect(base.month.priceText).toBe('$25');
    expect(base.year.priceText).toBe('$250');
    expect(base.year.priceMinor).toBe(base.month.priceMinor * 10);
    expect(base.annualFraming.freeMonthsEquivalent).toBe(2);
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
      { tier: 'relay_standard', month: '$25', year: '$250', projects: 3, channels: 30 },
      { tier: 'relay_growth', month: '$50', year: '$500', projects: 10, channels: 100 },
      { tier: 'relay_studio', month: '$100', year: '$1,000', projects: 25, channels: 250 },
    ]);
  });

  it('never states a per-month equivalent for an annual plan, on any tier', () => {
    // The inverse of the rule this replaces. That one required annual to divide
    // into twelve whole dollars so a per-month figure could be printed; this
    // ladder charges ten months for twelve, which does not divide, and the
    // right answer is to quote a year as a year rather than to print $20.83.
    // A price with cents in it is the presentation the owner rejected outright
    // after seeing a competitor render one in superscript.
    for (const tier of TIER_PRESENTATIONS) {
      expect(tier.annualFraming.effectiveMonthlyIsExact, tier.tierKey).toBe(false);
      expect(tier.annualFraming.freeMonthsEquivalent, tier.tierKey).toBe(2);
      expect(tier.year.priceMinor, tier.tierKey).toBe(tier.month.priceMinor * 10);
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
