import { buildChannelAllowanceGrant } from './channel-allowance';
import type { ChannelAllowanceGrant } from './channel-allowance';
import { buildProjectAllowanceGrant } from './project-allowance';
import type { ProjectAllowanceGrant } from './project-allowance';
import type { VerifiedSubscription } from './entitlements';

/**
 * The numeric entitlement rows one verified subscription writes.
 *
 * Two rows, never one: `projects.active.max`, which the capacity trigger in
 * migration `0066_project_capacity_guard.sql` already reads, and
 * `channels.active.max`, derived from it. Both come from the same tier, so a
 * workspace can never hold a project allowance and a channel allowance that
 * disagree about which tier it is on.
 *
 * Both rows are sourced **only** from verified webhook or reconciliation state.
 * A checkout redirect produces nothing here, because the redirect is not
 * evidence of anything and never grants access.
 */

export type AllowanceGrant = ProjectAllowanceGrant | ChannelAllowanceGrant;

export interface BuildAllowanceGrantsInput {
  readonly subscription: VerifiedSubscription;
  readonly effectiveFrom: string;
  readonly productTiers?: Readonly<Record<string, string>>;
}

/**
 * Both rows, or an empty list when the subscription record is not evidence.
 * Never a partial pair: the two builders apply the same source rule, so either
 * both are written or neither is.
 */
export function buildAllowanceGrants(input: BuildAllowanceGrantsInput): readonly AllowanceGrant[] {
  const forwarded = {
    subscription: input.subscription,
    effectiveFrom: input.effectiveFrom,
    ...(input.productTiers === undefined ? {} : { productTiers: input.productTiers }),
  };
  const projects = buildProjectAllowanceGrant(forwarded);
  const channels = buildChannelAllowanceGrant(forwarded);
  if (projects === null || channels === null) {
    return [];
  }
  return Object.freeze([projects, channels]);
}
