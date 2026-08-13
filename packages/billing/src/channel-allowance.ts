import { CHANNEL_LIMIT_ENTITLEMENT_KEY, normalizeChannelLimit } from '@relay/contracts';

import { isVerifiedSource } from './entitlements';
import type { VerifiedSubscription } from './entitlements';
import { BILLING_MESSAGE_KEYS } from './messages';
import { tierChannelAllowance, tierForProductId } from './tiers';
import type { PlanTierKey } from './tiers';

/**
 * Channel capacity, written the same way project capacity is.
 *
 * The number is **derived** from the tier's project allowance, not sold: a tier
 * buys active projects and nothing else, and a per channel price is a named
 * policy violation in `docs/planning/08-billing-entitlements-and-economics.md`
 * section 2.2. What section 2.2 now also says is that capacity may scale with
 * the one number we sell, which is exactly what this row carries: five channels
 * per project, pooled across the workspace, floored at the no-entitlement
 * allowance and ceilinged at `MAX_CHANNEL_LIMIT`.
 *
 * Pooled, not per project, on purpose. Real projects are uneven: one client
 * runs six accounts and the next runs one, and a per-project quota would refuse
 * the sixth connection while five slots sat idle next door.
 *
 * The downgrade rule is copied from `project-allowance.ts` verbatim, because it
 * is the same promise: **we never disconnect a channel to enforce an
 * allowance.** A workspace above its allowance keeps every connection it has,
 * keeps publishing through all of them, and loses only the ability to connect
 * another one.
 */

export const CHANNEL_ALLOWANCE_ENTITLEMENT_KEY = CHANNEL_LIMIT_ENTITLEMENT_KEY;

export interface ChannelAllowanceGrant {
  readonly workspaceId: string;
  readonly subscriptionId: string;
  /** Always `channels.active.max`. */
  readonly key: string;
  readonly kind: 'numeric_limit';
  readonly numericValue: number;
  readonly tierKey: PlanTierKey;
  readonly source: 'webhook' | 'reconciliation';
  readonly effectiveFrom: string;
}

export interface BuildChannelAllowanceGrantInput {
  readonly subscription: VerifiedSubscription;
  readonly effectiveFrom: string;
  readonly productTiers?: Readonly<Record<string, string>>;
}

/**
 * The entitlement row for a verified subscription, or `null` when the record is
 * not evidence. A browser redirect carries `source: 'redirect'` and produces no
 * grant at all, which is the same rule projects and the entitlement snapshot
 * follow. Access is never derived from a checkout return page.
 */
export function buildChannelAllowanceGrant(
  input: BuildChannelAllowanceGrantInput,
): ChannelAllowanceGrant | null {
  const { subscription } = input;
  if (!isVerifiedSource(subscription.source)) {
    return null;
  }
  if (subscription.source !== 'webhook' && subscription.source !== 'reconciliation') {
    return null;
  }
  const tierKey = tierForProductId(subscription.productId, input.productTiers ?? {});
  return {
    workspaceId: subscription.workspaceId,
    subscriptionId: subscription.subscriptionId,
    key: CHANNEL_ALLOWANCE_ENTITLEMENT_KEY,
    kind: 'numeric_limit',
    // Clamped twice on purpose, exactly as the project row is: once by the
    // derivation, once again here against the authorization ceiling.
    numericValue: normalizeChannelLimit(tierChannelAllowance(tierKey)),
    tierKey,
    source: subscription.source,
    effectiveFrom: input.effectiveFrom,
  };
}

export interface ChannelCapacityPosture {
  readonly allowance: number;
  readonly activeChannels: number;
  readonly remaining: number;
  readonly overAllowance: boolean;
  readonly canConnectChannel: boolean;
  /** Capacity never blocks publishing through a connection that already exists. */
  readonly existingChannelsBlockedByCapacity: false;
  /** A downgrade disconnects nothing. Ever. */
  readonly channelsDisconnectedByDowngrade: 0;
  readonly noticeKey: string | null;
  readonly refusalMessageKey: string | null;
}

/**
 * What a workspace may do at its current channel count.
 *
 * This answers the capacity question only. Whether the workspace may write at
 * all is the entitlement state's business, and the two are kept separate so a
 * billing problem is never reported as a capacity problem or the other way
 * round.
 */
export function channelCapacityPosture(input: {
  readonly activeChannels: number;
  readonly allowance: number;
}): ChannelCapacityPosture {
  const allowance = normalizeChannelLimit(input.allowance);
  const activeChannels = Math.max(0, Math.trunc(input.activeChannels));
  const hasRoom = activeChannels < allowance;
  const overAllowance = activeChannels > allowance;
  return {
    allowance,
    activeChannels,
    remaining: Math.max(0, allowance - activeChannels),
    overAllowance,
    canConnectChannel: hasRoom,
    existingChannelsBlockedByCapacity: false,
    channelsDisconnectedByDowngrade: 0,
    noticeKey: overAllowance ? 'billing.downgrade.overLimit' : null,
    refusalMessageKey: hasRoom ? null : BILLING_MESSAGE_KEYS.channelLimitReached,
  };
}
