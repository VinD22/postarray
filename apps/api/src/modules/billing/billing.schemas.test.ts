import { describe, expect, it } from 'vitest';
import { PLAN_TIER_KEYS } from '@relay/contracts';
import { createCheckoutSchema } from './billing.schemas';

const input = { interval: 'annual', successUrl: 'https://example.test/settings/billing' };

describe('checkout capacity selection', () => {
  it.each(PLAN_TIER_KEYS)('preserves the selected %s tier', (tier) => {
    expect(createCheckoutSchema.parse({ ...input, tier }).tier).toBe(tier);
  });
  it('keeps legacy clients compatible and rejects invented plans or client prices', () => {
    expect(createCheckoutSchema.parse(input).tier).toBeUndefined();
    expect(createCheckoutSchema.safeParse({ ...input, tier: 'unlimited' }).success).toBe(false);
    expect(createCheckoutSchema.safeParse({ ...input, price: 1 }).success).toBe(false);
  });
});
