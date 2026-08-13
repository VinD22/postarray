import { describe, expect, it } from 'vitest';
import { en } from '@relay/i18n';

import { BASE_TIER_KEY, WEB_PLAN_TIERS, annualSavingMinor, priceUnits } from './tiers';

/**
 * Billing copy is a legal statement, so the phrasings we must not ship are
 * asserted rather than reviewed. The research brief bans the percentage framing
 * of the annual price and the temporary hold claim outright.
 */

const BILLING_KEYS = Object.keys(en).filter((key) => key.startsWith('billing.'));

function billingCopy(): string[] {
  return BILLING_KEYS.map((key) => (en as Record<string, string>)[key] ?? '');
}

describe('billing copy', () => {
  it('has billing copy to check', () => {
    expect(BILLING_KEYS.length).toBeGreaterThan(0);
  });

  it('never frames the annual price as a percentage discount', () => {
    for (const value of billingCopy()) {
      expect(value).not.toMatch(/\d+\s*%\s*(off|discount)/i);
      expect(value.toLowerCase()).not.toContain('20% off');
    }
  });

  it('never claims a temporary hold of any amount', () => {
    for (const value of billingCopy()) {
      expect(value.toLowerCase()).not.toContain('hold of $');
      expect(value).not.toMatch(/\$\d+(\.\d+)?\s+(temporary\s+)?hold/i);
    }
  });

  /**
   * Was: "the first key ending in annualFraming contains these two literals".
   * That asserted a sentence, so a reprice stranded it and nothing checked the
   * other framing sentences at all. It now asserts the arithmetic, on every
   * sentence a price surface reads, against the same tier module the pages
   * format their numbers from. A reprice moves both or fails here.
   */
  it('states the annual saving in currency, on every sentence a price surface reads', () => {
    const catalog = en as Record<string, string>;
    const money = (minor: number): string =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(priceUnits(minor));

    const framingKeys = [
      'billing.plan.annualFraming',
      ...WEB_PLAN_TIERS.map(
        (tier) => `billing.tier.${tier.key.replace('relay_', '')}.annualFraming`,
      ),
    ];

    for (const key of framingKeys) {
      const sentence = catalog[key];
      expect(sentence, key).toBeTypeOf('string');
      // Money, never a rate. The real discount is not a round percentage and a
      // percentage claim is banned outright by the billing package.
      expect(sentence, key).not.toContain('%');
      expect(sentence?.toLowerCase(), key).not.toContain(' off');
      expect(sentence, key).toMatch(/\$\d/);
    }

    // And the base tier's sentence states the saving this repository would
    // actually charge, rather than a figure that survived a reprice.
    const base = WEB_PLAN_TIERS.find((tier) => tier.key === BASE_TIER_KEY);
    expect(base).toBeDefined();
    expect(catalog['billing.plan.annualFraming']).toContain(
      money(base === undefined ? 0 : annualSavingMinor(base)),
    );
  });

  it('uses no em dash and no hype word anywhere in billing copy', () => {
    const banned = [
      'revolutionary',
      'magical',
      'effortless',
      'viral',
      'autonomous',
      'game-changing',
      'seamless',
      'unleash',
    ];
    for (const value of billingCopy()) {
      expect(value).not.toContain('—');
      for (const word of banned) {
        expect(value.toLowerCase()).not.toContain(word);
      }
    }
  });

  it('never offers image or video generation as something the plan includes', () => {
    for (const [key, value] of Object.entries(en as Record<string, string>)) {
      if (!key.startsWith('billing.')) {
        continue;
      }
      if (/image|video/i.test(value)) {
        // The only permitted mentions are the ones that say we do not do it.
        expect(value).toMatch(/not (included|sold|generate)|does not generate|no image/i);
      }
    }
  });
});
