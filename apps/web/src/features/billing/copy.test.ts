import { describe, expect, it } from 'vitest';
import { en } from '@relay/i18n';

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

  it('states the annual saving in currency', () => {
    const framing = Object.entries(en as Record<string, string>).find(([key]) =>
      key.endsWith('annualFraming'),
    );
    expect(framing?.[1]).toContain('$25/month billed annually');
    expect(framing?.[1]).toContain('Save $48/year');
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
