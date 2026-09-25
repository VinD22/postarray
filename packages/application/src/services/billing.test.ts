import { describe, expect, it, vi } from 'vitest';
import { PLAN_TIER_KEYS } from '@relay/contracts';
import type { ActorContext, ServiceDeps } from '../types';
import { createBillingService } from './billing';

// Authorization is covered by its own suite; this isolates the checkout handoff.
vi.mock('../internal/runtime', () => ({
  authorized: (
    _deps: unknown,
    _ctx: unknown,
    _action: unknown,
    _resource: unknown,
    run: () => Promise<unknown>,
  ) => run(),
}));

const ctx = {
  workspaceId: 'ws_one',
  actorId: 'usr_one',
  idempotencyKey: 'checkout-request',
  locale: 'en',
} as ActorContext;
function setup() {
  const createCheckout = vi
    .fn()
    .mockResolvedValue({ checkoutUrl: 'https://example.test/checkout' });
  const service = createBillingService({ billing: { createCheckout } } as unknown as ServiceDeps);
  return { createCheckout, service };
}

describe('checkout tier handoff', () => {
  it.each(PLAN_TIER_KEYS)('carries %s to the billing gateway', async (tier) => {
    const { service, createCheckout } = setup();
    await service.createCheckout(ctx, {
      interval: 'annual',
      successUrl: 'https://example.test/return',
      tier,
    });
    expect(createCheckout).toHaveBeenCalledWith(
      expect.objectContaining({
        tier,
        interval: 'annual',
        workspaceId: 'ws_one',
        idempotencyKey: 'checkout-request',
      }),
    );
  });
  it('defaults older callers to the base plan', async () => {
    const { service, createCheckout } = setup();
    await service.createCheckout(ctx, {
      interval: 'monthly',
      successUrl: 'https://example.test/return',
    });
    expect(createCheckout).toHaveBeenCalledWith(
      expect.objectContaining({ tier: 'relay_standard' }),
    );
  });
});
