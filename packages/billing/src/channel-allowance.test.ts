import { describe, expect, it } from 'vitest';

import { CHANNEL_LIMIT_ENTITLEMENT_KEY, MAX_CHANNEL_LIMIT } from '@relay/contracts';
import { en } from '@relay/i18n';

import { buildAllowanceGrants } from './allowance-grants';
import {
  CHANNEL_ALLOWANCE_ENTITLEMENT_KEY,
  buildChannelAllowanceGrant,
  channelCapacityPosture,
} from './channel-allowance';
import { verifiedSubscriptionSchema } from './entitlements';
import type { SubscriptionSource, VerifiedSubscription } from './entitlements';

const NOW = '2026-08-12T12:00:00.000Z';

const PRODUCT_TIERS = Object.freeze({
  prod_base: 'relay_standard',
  prod_growth: 'relay_growth',
  prod_studio: 'relay_studio',
});

function subscription(source: SubscriptionSource, productId = 'prod_base'): VerifiedSubscription {
  return verifiedSubscriptionSchema.parse({
    subscriptionId: 'sub_01',
    workspaceId: 'ws_01',
    customerId: 'cus_01',
    productId,
    interval: 'month',
    status: 'active',
    amountMinor: 2_900,
    currency: 'USD',
    currentPeriodStart: NOW,
    currentPeriodEnd: '2026-09-12T12:00:00.000Z',
    cancelAtPeriodEnd: false,
    canceledAt: null,
    trialStart: null,
    trialEnd: null,
    endsAt: null,
    endedAt: null,
    modifiedAt: NOW,
    pastDueSince: null,
    source,
    verifiedAt: NOW,
  });
}

describe('the channels.active.max entitlement row', () => {
  it('writes the key every connection surface already reads', () => {
    expect(CHANNEL_ALLOWANCE_ENTITLEMENT_KEY).toBe('channels.active.max');
    expect(CHANNEL_ALLOWANCE_ENTITLEMENT_KEY).toBe(CHANNEL_LIMIT_ENTITLEMENT_KEY);
  });

  it('derives the allowance from the tier that was bought, never from a channel price', () => {
    const cases: readonly (readonly [string, number, string])[] = [
      ['prod_base', 15, 'relay_standard'],
      ['prod_growth', 50, 'relay_growth'],
      ['prod_studio', MAX_CHANNEL_LIMIT, 'relay_studio'],
    ];
    for (const [productId, expected, tierKey] of cases) {
      const grant = buildChannelAllowanceGrant({
        subscription: subscription('webhook', productId),
        effectiveFrom: NOW,
        productTiers: PRODUCT_TIERS,
      });
      expect(grant?.numericValue, productId).toBe(expected);
      expect(grant?.tierKey, productId).toBe(tierKey);
      expect(grant?.kind, productId).toBe('numeric_limit');
    }
  });

  it('grants from reconciliation too, because both are verified evidence', () => {
    const grant = buildChannelAllowanceGrant({
      subscription: subscription('reconciliation'),
      effectiveFrom: NOW,
    });
    expect(grant?.source).toBe('reconciliation');
    expect(grant?.numericValue).toBe(15);
  });

  it('grants nothing from a browser redirect or an unverified record', () => {
    expect(
      buildChannelAllowanceGrant({ subscription: subscription('redirect'), effectiveFrom: NOW }),
    ).toBeNull();
    expect(
      buildChannelAllowanceGrant({ subscription: subscription('unverified'), effectiveFrom: NOW }),
    ).toBeNull();
  });

  it('falls back to the base tier for a product we cannot map, never to the largest', () => {
    const grant = buildChannelAllowanceGrant({
      subscription: subscription('webhook', 'prod_from_another_universe'),
      effectiveFrom: NOW,
      productTiers: PRODUCT_TIERS,
    });
    expect(grant?.tierKey).toBe('relay_standard');
    expect(grant?.numericValue).toBe(15);
  });
});

describe('one verified subscription writes both capacity rows', () => {
  it('emits projects.active.max and channels.active.max from the same tier', () => {
    const grants = buildAllowanceGrants({
      subscription: subscription('webhook', 'prod_growth'),
      effectiveFrom: NOW,
      productTiers: PRODUCT_TIERS,
    });
    expect(grants.map((grant) => grant.key)).toEqual([
      'projects.active.max',
      'channels.active.max',
    ]);
    expect(grants.map((grant) => grant.numericValue)).toEqual([10, 50]);
    for (const grant of grants) {
      expect(grant.tierKey, grant.key).toBe('relay_growth');
      expect(grant.source, grant.key).toBe('webhook');
      expect(grant.workspaceId, grant.key).toBe('ws_01');
      expect(grant.effectiveFrom, grant.key).toBe(NOW);
    }
  });

  it('writes nothing at all from a checkout redirect', () => {
    expect(
      buildAllowanceGrants({ subscription: subscription('redirect'), effectiveFrom: NOW }),
    ).toEqual([]);
  });
});

/**
 * Downgrade. The rule the founder cares about, in the channel dimension: a
 * workspace that ends up over its allowance keeps every connection it has. We
 * never disconnect for them.
 */
describe('a workspace over its new channel allowance', () => {
  const posture = channelCapacityPosture({ activeChannels: 22, allowance: 15 });

  it('disconnects nothing, ever', () => {
    expect(posture.channelsDisconnectedByDowngrade).toBe(0);
  });

  it('keeps publishing through every connection it already has', () => {
    expect(posture.existingChannelsBlockedByCapacity).toBe(false);
  });

  it('cannot connect another channel', () => {
    expect(posture.overAllowance).toBe(true);
    expect(posture.canConnectChannel).toBe(false);
    expect(posture.remaining).toBe(0);
  });

  it('explains the state without threatening disconnection', () => {
    const catalog = en as Readonly<Record<string, string>>;
    expect(posture.noticeKey).toBe('billing.downgrade.overLimit');
    const notice = catalog['billing.downgrade.overLimit'] ?? '';
    expect(notice).toContain('nothing is disconnected for you');
    expect(notice).not.toContain('delete');
    expect(notice).not.toContain('—');
  });
});

describe('a workspace inside its channel allowance', () => {
  it('may connect up to the allowance', () => {
    const posture = channelCapacityPosture({ activeChannels: 14, allowance: 15 });
    expect(posture.canConnectChannel).toBe(true);
    expect(posture.remaining).toBe(1);
    expect(posture.overAllowance).toBe(false);
    expect(posture.noticeKey).toBeNull();
    expect(posture.refusalMessageKey).toBeNull();
  });

  it('refuses the next channel exactly at the allowance', () => {
    const posture = channelCapacityPosture({ activeChannels: 15, allowance: 15 });
    expect(posture.canConnectChannel).toBe(false);
    expect(posture.overAllowance).toBe(false);
    expect(posture.refusalMessageKey).toBe('error.channel_limit_reached.message');
  });

  it('clamps a nonsense allowance rather than trusting it', () => {
    expect(channelCapacityPosture({ activeChannels: 0, allowance: 9_000 }).allowance).toBe(100);
    expect(channelCapacityPosture({ activeChannels: 0, allowance: 0 }).allowance).toBe(1);
  });
});
