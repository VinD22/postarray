import { PROJECT_LIMIT_ENTITLEMENT_KEY, normalizeProjectLimit } from '@relay/contracts';

import { isVerifiedSource } from './entitlements';
import type { VerifiedSubscription } from './entitlements';
import { BILLING_MESSAGE_KEYS } from './messages';
import { tierForProductId, tierProjectAllowance } from './tiers';
import type { PlanTierKey } from './tiers';

/**
 * Project capacity, written where the database can already enforce it.
 *
 * Migration `0066_project_capacity_guard.sql` reads the numeric entitlement
 * `projects.active.max` under an advisory lock and refuses an insert that would
 * exceed it. That trigger is the race-safe final guard and this module does not
 * add a second one; it only produces the row the trigger reads, from verified
 * subscription state, so the number the customer bought and the number the
 * database enforces are the same number.
 *
 * Downgrade is deliberately gentle and the rule is asserted by
 * `project-allowance.test.ts`: **we never archive a project to enforce an
 * allowance.** A workspace that drops below its project count keeps full read
 * and write access to every project it already has. What it loses is the
 * ability to create another one, or to bring an archived one back.
 */

export const PROJECT_ALLOWANCE_ENTITLEMENT_KEY = PROJECT_LIMIT_ENTITLEMENT_KEY;

export interface ProjectAllowanceGrant {
  readonly workspaceId: string;
  readonly subscriptionId: string;
  /** Always `projects.active.max`. The key migration 0066 reads. */
  readonly key: string;
  readonly kind: 'numeric_limit';
  readonly numericValue: number;
  readonly tierKey: PlanTierKey;
  readonly source: 'webhook' | 'reconciliation';
  readonly effectiveFrom: string;
}

export interface BuildProjectAllowanceGrantInput {
  readonly subscription: VerifiedSubscription;
  readonly effectiveFrom: string;
  readonly productTiers?: Readonly<Record<string, string>>;
}

/**
 * The entitlement row for a verified subscription, or `null` when the record is
 * not evidence. A browser redirect carries `source: 'redirect'` and produces no
 * grant at all, which is the same rule the entitlement snapshot follows.
 */
export function buildProjectAllowanceGrant(
  input: BuildProjectAllowanceGrantInput,
): ProjectAllowanceGrant | null {
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
    key: PROJECT_ALLOWANCE_ENTITLEMENT_KEY,
    kind: 'numeric_limit',
    // Clamped twice on purpose: once here against the authorization ceiling in
    // `@relay/contracts`, and once again by the trigger, which does not trust
    // this row either.
    numericValue: normalizeProjectLimit(tierProjectAllowance(tierKey)),
    tierKey,
    source: subscription.source,
    effectiveFrom: input.effectiveFrom,
  };
}

export interface ProjectCapacityPosture {
  readonly allowance: number;
  readonly activeProjects: number;
  readonly remaining: number;
  readonly overAllowance: boolean;
  readonly canCreateProject: boolean;
  readonly canUnarchiveProject: boolean;
  /** Capacity never blocks reading or editing a project that already exists. */
  readonly existingProjectsBlockedByCapacity: false;
  /** A downgrade archives nothing. Ever. */
  readonly projectsArchivedByDowngrade: 0;
  readonly noticeKey: string | null;
  readonly refusalMessageKey: string | null;
}

/**
 * What a workspace may do at its current project count.
 *
 * This answers the capacity question only. Whether the workspace may write at
 * all is the entitlement state's business (`read_only` still blocks edits), and
 * the two are kept separate so a billing problem is never reported as a
 * capacity problem or the other way round.
 */
export function projectCapacityPosture(input: {
  readonly activeProjects: number;
  readonly allowance: number;
}): ProjectCapacityPosture {
  const allowance = normalizeProjectLimit(input.allowance);
  const activeProjects = Math.max(0, Math.trunc(input.activeProjects));
  const hasRoom = activeProjects < allowance;
  const overAllowance = activeProjects > allowance;
  return {
    allowance,
    activeProjects,
    remaining: Math.max(0, allowance - activeProjects),
    overAllowance,
    canCreateProject: hasRoom,
    canUnarchiveProject: hasRoom,
    existingProjectsBlockedByCapacity: false,
    projectsArchivedByDowngrade: 0,
    noticeKey: overAllowance ? 'billing.downgrade.projectsOverAllowance' : null,
    refusalMessageKey: hasRoom ? null : BILLING_MESSAGE_KEYS.projectLimitReached,
  };
}
