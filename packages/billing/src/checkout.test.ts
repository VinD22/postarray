import { describe, expect, it } from 'vitest';

import { RelayError } from '@relay/contracts';
import type { PolarConfig } from '@relay/config';

import {
  DISCLOSURE_VERSION,
  REQUIRED_DISCLOSURE_LINE_IDS,
  buildCheckoutDisclosure,
  buildConsentRecord,
  checkoutReturnState,
  createCheckoutSession,
  resolveProductId,
} from './checkout.js';
import { createPolarClient } from './client.js';
import { deriveEntitlement } from './entitlements.js';
import { LocalPolarSimulator } from './simulator.js';
import { MutableClock } from './time.js';

const CONFIRMED_AT = '2026-08-04T14:00:00.000Z';

const simulatorConfig: PolarConfig = {
  accessToken: undefined,
  webhookSecret: undefined,
  server: 'sandbox',
  monthlyProductId: undefined,
  annualProductId: undefined,
  trialDays: 7,
};

function makeDeps() {
  const clock = new MutableClock(CONFIRMED_AT);
  const client = createPolarClient({ config: simulatorConfig, clock });
  return { clock, client, config: simulatorConfig };
}

describe('the checkout disclosure', () => {
  const disclosure = buildCheckoutDisclosure({ interval: 'month', startedAt: CONFIRMED_AT });

  it('contains every line the customer must see before confirming', () => {
    expect(disclosure.lines.map((line) => line.id)).toEqual([...REQUIRED_DISCLOSURE_LINE_IDS]);
  });

  it('states $0 due today', () => {
    expect(disclosure.dueTodayMinor).toBe(0);
    expect(disclosure.dueTodayText).toBe('$0 due today');
  });

  it('states the exact trial end and the exact first charge', () => {
    expect(disclosure.trialEndsAt).toBe('2026-08-11T14:00:00.000Z');
    expect(disclosure.trialEndsOnDate).toBe('2026-08-11');
    expect(disclosure.firstChargeText).toBe('$29.00');
    expect(disclosure.firstChargeOnDate).toBe('2026-08-11');
    expect(disclosure.renewalText).toBe('$29.00');
    expect(disclosure.interval).toBe('month');
  });

  it('frames the annual price in money saved, not as a percentage', () => {
    const annual = buildCheckoutDisclosure({ interval: 'year', startedAt: CONFIRMED_AT });
    expect(annual.firstChargeText).toBe('$300.00');
    expect(annual.annualFramingText).toBe('$25/month billed annually. Save $48/year.');
    expect(annual.annualFramingText).not.toContain('%');
    expect(disclosure.annualFramingText).toBeNull();
  });

  it('discloses the channel allowance, fair use, metered X usage and the media boundary', () => {
    const ids = disclosure.lines.map((line) => line.id);
    expect(ids).toContain('channel_allowance');
    expect(ids).toContain('fair_use');
    expect(ids).toContain('metered_x_usage');
    expect(ids).toContain('no_media_generation');
    expect(disclosure.activeChannelAllowance).toBe(30);
  });

  it('carries a cancellation path', () => {
    const cancellation = disclosure.lines.find((line) => line.id === 'cancellation_path');
    expect(cancellation?.messageKey).toBe('billing.trial.cancelBefore');
  });

  it('is versioned and checksummed so we can prove what was shown', async () => {
    const consent = await buildConsentRecord({
      disclosure,
      workspaceId: 'ws_01',
      actorId: 'user_01',
      shownAt: CONFIRMED_AT,
      locale: 'en',
    });
    expect(consent.version).toBe(DISCLOSURE_VERSION);
    expect(consent.checksum).toMatch(/^[0-9a-f]{64}$/);
    expect(consent.shownAt).toBe(CONFIRMED_AT);

    const again = await buildConsentRecord({
      disclosure,
      workspaceId: 'ws_01',
      actorId: 'user_01',
      shownAt: CONFIRMED_AT,
      locale: 'en',
    });
    expect(again.checksum).toBe(consent.checksum);
  });
});

describe('creating a checkout session', () => {
  it('returns a hosted checkout url and the disclosure together', async () => {
    const deps = makeDeps();
    const session = await createCheckoutSession(deps, {
      interval: 'month',
      workspaceId: 'ws_01',
      actorId: 'user_01',
      successUrl: 'https://app.example.test/billing/return',
      locale: 'en',
      idempotencyKey: 'checkout-ws_01-0001',
    });
    expect(session.checkoutUrl).toContain('example.test');
    expect(session.disclosure.dueTodayText).toBe('$0 due today');
    expect(session.grantsEntitlement).toBe(false);
  });

  it('creates exactly one session for a repeated idempotency key', async () => {
    const deps = makeDeps();
    const first = await createCheckoutSession(deps, {
      interval: 'month',
      workspaceId: 'ws_01',
      actorId: 'user_01',
      successUrl: 'https://app.example.test/billing/return',
      locale: 'en',
      idempotencyKey: 'checkout-ws_01-0002',
    });
    const second = await createCheckoutSession(deps, {
      interval: 'month',
      workspaceId: 'ws_01',
      actorId: 'user_01',
      successUrl: 'https://app.example.test/billing/return',
      locale: 'en',
      idempotencyKey: 'checkout-ws_01-0002',
    });
    expect(second.checkoutId).toBe(first.checkoutId);
  });

  it('refuses to guess a product id when Polar is live and none is configured', () => {
    expect(() =>
      resolveProductId(
        { ...simulatorConfig, accessToken: 'polar_at_example' },
        'month',
        false,
      ),
    ).toThrow(RelayError);
    expect(resolveProductId(simulatorConfig, 'year', true)).toBe('sim_prod_annual');
  });
});

describe('the return page', () => {
  it('grants nothing and shows a pending state until the webhook lands', async () => {
    const deps = makeDeps();
    const session = await createCheckoutSession(deps, {
      interval: 'month',
      workspaceId: 'ws_01',
      actorId: 'user_01',
      successUrl: 'https://app.example.test/billing/return',
      locale: 'en',
      idempotencyKey: 'checkout-ws_01-0003',
    });
    expect(deps.client).toBeInstanceOf(LocalPolarSimulator);
    await (deps.client as LocalPolarSimulator).confirmCheckout(session.checkoutId);

    // The customer is back on our site, but no verified webhook has been
    // processed yet. Deriving from the redirect must still grant nothing.
    const fromRedirect = deriveEntitlement(null, { now: CONFIRMED_AT });
    expect(fromRedirect.state).toBe('none');

    const pending = checkoutReturnState(false);
    expect(pending.entitlementsReady).toBe(false);
    expect(pending.pollForSeconds).toBe(60);
    expect(pending.messageKey).toBe('billing.checkout.returning');

    expect(checkoutReturnState(true).pollForSeconds).toBe(0);
  });
});
