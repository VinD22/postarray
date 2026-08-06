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
  TRIAL_DAYS,
  normalizeInterval,
  planPriceMinor,
  trialLengthMatches,
} from './products';

const catalog = en as Readonly<Record<string, string>>;

describe('the one public plan', () => {
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
});
