import { describe, expect, it } from 'vitest';
import { en } from '@relay/i18n/messages';

/**
 * Prices are formatted from the tier module's minor units on the plan card.
 * Prose that states an amount survives a reprice and starts lying, which the
 * prelaunch billing notice did ("$29 a month" after the tiers moved).
 */
describe('billing prelaunch terms', () => {
  it('states no currency amount in prose', () => {
    expect(en['billing.ui.prelaunchTerms']).not.toMatch(/[$€£]\s?\d/);
  });
});
