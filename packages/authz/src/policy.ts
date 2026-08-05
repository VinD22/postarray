import type { ApprovalLevel, Role, Scope } from '@relay/contracts';

import { PERMISSIONS, isPermission, isReadPermission, type Permission } from './permissions.js';
import { effectivePermissions, minimumRoleFor, type RolePermissionOverride } from './roles.js';
import { isDelegable, scopeGrantsPermission, scopesForPermission } from './scopes.js';

/**
 * `can(actor, permission, resource?)`.
 *
 * A decision is never a bare boolean. The UI renders the reason next to the
 * disabled control, and a REST client turns it into a problem document, so the
 * reason has to be specific enough to act on: which role, which scope, which
 * brand. Every branch below returns a typed reason and an i18n message key.
 */

export const DECISION_REASONS = [
  'role_grants_permission',
  'workspace_grant',
  'no_membership',
  'membership_not_active',
  'workspace_read_only',
  'workspace_suspended',
  'role_lacks_permission',
  'workspace_denies_permission',
  'permission_not_delegable',
  'scope_missing',
  'grant_revoked',
  'credential_expired',
  'grantor_lacks_permission',
  'brand_out_of_scope',
  'connection_out_of_scope',
  'self_approval_forbidden',
  'approval_level_insufficient',
  'kill_switch_engaged',
  'unknown_permission',
] as const;

export type DecisionReason = (typeof DECISION_REASONS)[number];

export type DecisionDetailValue = string | number | boolean | null;

export interface Decision {
  readonly allowed: boolean;
  readonly reason: DecisionReason;
  /** ICU key in `@relay/i18n`. Never an English literal. */
  readonly messageKey: string;
  readonly permission: Permission;
  /** The least privileged built-in role that would satisfy a role denial. */
  readonly requiredRole?: Role;
  /** Any one of these scopes would satisfy a scope denial. */
  readonly requiredScopes?: readonly Scope[];
  readonly details?: Readonly<Record<string, DecisionDetailValue>>;
}

export const WORKSPACE_STATES = [
  'active',
  'trialing',
  'past_due',
  'read_only',
  'suspended',
  'deleted',
] as const;
export type WorkspaceState = (typeof WORKSPACE_STATES)[number];

export const MEMBERSHIP_STATES = ['invited', 'active', 'suspended', 'removed'] as const;
export type MembershipState = (typeof MEMBERSHIP_STATES)[number];

export type PolicyActorType = 'user' | 'service_account' | 'oauth_app' | 'system';

export interface PolicyActor {
  readonly actorType: PolicyActorType;
  readonly actorId: string;
  readonly workspaceId: string;
  /** The membership role. A credential carries its granting user's live role. */
  readonly role: Role | null;
  readonly membershipState: MembershipState;
  readonly scopes: readonly Scope[];
  readonly approvalLevel: ApprovalLevel;
  /**
   * Whether the scope list is a hard cap. A browser session acts as the person,
   * so it is not; every automation identity is, which is what stops an owner's
   * privileges flowing into an agent.
   */
  readonly scopesEnforced?: boolean;
  /** Empty means every brand in the workspace. */
  readonly brandScope?: readonly string[];
  /** Empty means every connection in the workspace. */
  readonly connectionScope?: readonly string[];
  readonly grantRevoked?: boolean;
  readonly credentialExpired?: boolean;
  readonly workspaceState?: WorkspaceState;
  readonly killSwitchEngaged?: boolean;
  readonly roleOverrides?: readonly RolePermissionOverride[];
}

export interface PolicyResource {
  readonly brandId?: string | null;
  readonly connectionId?: string | null;
  /** The actor that authored the thing being acted on, for self-approval. */
  readonly authorActorId?: string | null;
  readonly workspaceId?: string;
}

export interface WorkspacePolicy {
  /** Off by default: an author approving their own post defeats the control. */
  readonly allowSelfApproval?: boolean;
}

export interface PolicyOptions {
  readonly workspacePolicy?: WorkspacePolicy;
}

function messageKeyFor(reason: DecisionReason): string {
  return `authz.${reason}`;
}

function deny(
  permission: Permission,
  reason: DecisionReason,
  extra: Omit<Decision, 'allowed' | 'reason' | 'messageKey' | 'permission'> = {},
): Decision {
  return {
    allowed: false,
    reason,
    messageKey: messageKeyFor(reason),
    permission,
    ...extra,
  };
}

function allow(
  permission: Permission,
  reason: Extract<DecisionReason, 'role_grants_permission' | 'workspace_grant'>,
): Decision {
  return { allowed: true, reason, messageKey: messageKeyFor(reason), permission };
}

/** Automation identities are capped by their scopes; a person is not. */
export function scopesAreEnforced(actor: PolicyActor): boolean {
  if (actor.scopesEnforced !== undefined) {
    return actor.scopesEnforced;
  }
  return actor.actorType === 'service_account' || actor.actorType === 'oauth_app';
}

const APPROVAL_LEVEL_RANK: Readonly<Record<ApprovalLevel, number>> = {
  level_0_read: 0,
  level_1_draft: 1,
  level_2_scheduled: 2,
  level_3_confirm: 3,
};

/**
 * The permission's minimum autonomy level. Level 0 reads, level 1 edits drafts,
 * level 2 schedules, level 3 acts immediately on the outside world.
 */
export function requiredApprovalLevel(permission: Permission): ApprovalLevel {
  if (isReadPermission(permission)) {
    return 'level_0_read';
  }
  switch (permission) {
    case 'post.publish_now':
    case 'post.retry':
    case 'connection.connect':
    case 'connection.disconnect':
    case 'rule.run':
      return 'level_3_confirm';
    case 'post.schedule':
    case 'post.reschedule':
    case 'post.cancel':
    case 'rule.write':
    case 'rss.write':
      return 'level_2_scheduled';
    default:
      return 'level_1_draft';
  }
}

function withinBrandScope(actor: PolicyActor, resource: PolicyResource | undefined): boolean {
  const scope = actor.brandScope;
  if (scope === undefined || scope.length === 0) {
    return true;
  }
  const brandId = resource?.brandId;
  if (brandId === undefined || brandId === null) {
    return true;
  }
  return scope.includes(brandId);
}

function withinConnectionScope(actor: PolicyActor, resource: PolicyResource | undefined): boolean {
  const scope = actor.connectionScope;
  if (scope === undefined || scope.length === 0) {
    return true;
  }
  const connectionId = resource?.connectionId;
  if (connectionId === undefined || connectionId === null) {
    return true;
  }
  return scope.includes(connectionId);
}

/**
 * The single authorization decision point. Every surface calls this; no
 * controller re-implements any part of it.
 */
export function can(
  actor: PolicyActor,
  permission: Permission,
  resource?: PolicyResource,
  options: PolicyOptions = {},
): Decision {
  if (!isPermission(permission)) {
    return deny(permission, 'unknown_permission');
  }

  // 1. Tenancy. A resource from another workspace is invisible, not merely
  //    forbidden, so callers should already have failed the lookup. Checking
  //    here as well means a mistake upstream cannot become a write.
  if (resource?.workspaceId !== undefined && resource.workspaceId !== actor.workspaceId) {
    return deny(permission, 'no_membership', {
      details: { workspaceId: actor.workspaceId },
    });
  }

  // 2. Workspace lifecycle.
  const workspaceState = actor.workspaceState ?? 'active';
  if (workspaceState === 'suspended' || workspaceState === 'deleted') {
    return deny(permission, 'workspace_suspended', { details: { state: workspaceState } });
  }
  if (
    (workspaceState === 'read_only' || workspaceState === 'past_due') &&
    !isReadPermission(permission)
  ) {
    return deny(permission, 'workspace_read_only', { details: { state: workspaceState } });
  }
  // The kill switch stops outbound work. It deliberately does not lock an
  // administrator out of the setting that releases it, or the log that explains
  // why it was engaged.
  if (
    actor.killSwitchEngaged === true &&
    !isReadPermission(permission) &&
    permission !== 'workspace.update'
  ) {
    return deny(permission, 'kill_switch_engaged');
  }

  // 3. Credential lifecycle. A revoked grant fails closed on every permission,
  //    including reads, because the user asked for it to stop working.
  if (actor.grantRevoked === true) {
    return deny(permission, 'grant_revoked');
  }
  if (actor.credentialExpired === true) {
    return deny(permission, 'credential_expired');
  }

  // 4. Membership and 5. role, with per-workspace overrides folded in.
  const role = actor.role;
  if (actor.actorType !== 'system') {
    const fallbackRole = minimumRoleFor(permission);
    if (role === null) {
      return deny(permission, 'no_membership', {
        ...(fallbackRole === null ? {} : { requiredRole: fallbackRole }),
      });
    }
    if (actor.membershipState !== 'active') {
      return deny(permission, 'membership_not_active', {
        details: { membershipState: actor.membershipState },
      });
    }
    const effective = effectivePermissions(role, actor.roleOverrides ?? []);
    if (effective.denied.has(permission)) {
      return deny(permission, 'workspace_denies_permission', { details: { role } });
    }
    if (!effective.permissions.has(permission)) {
      return deny(permission, 'role_lacks_permission', {
        ...(fallbackRole === null ? {} : { requiredRole: fallbackRole }),
        details: { role },
      });
    }
  }

  // 6. Scopes. An absent scope denies even when the role would allow, and a
  //    permission that maps to no scope is simply not reachable by automation.
  if (scopesAreEnforced(actor)) {
    if (!isDelegable(permission)) {
      return deny(permission, 'permission_not_delegable');
    }
    if (!scopeGrantsPermission(actor.scopes, permission)) {
      return deny(permission, 'scope_missing', {
        requiredScopes: scopesForPermission(permission),
      });
    }
  }

  // 7. Narrowing. Brand and connection scopes intersect down and never union up.
  if (!withinBrandScope(actor, resource)) {
    return deny(permission, 'brand_out_of_scope', {
      details: { brandId: resource?.brandId ?? null },
    });
  }
  if (!withinConnectionScope(actor, resource)) {
    return deny(permission, 'connection_out_of_scope', {
      details: { connectionId: resource?.connectionId ?? null },
    });
  }

  // 8. Autonomy level. Scopes say what an identity may reach; the level says how
  //    far it may go without a human in the loop.
  const needed = requiredApprovalLevel(permission);
  if (APPROVAL_LEVEL_RANK[actor.approvalLevel] < APPROVAL_LEVEL_RANK[needed]) {
    return deny(permission, 'approval_level_insufficient', {
      details: { required: needed, held: actor.approvalLevel },
    });
  }

  // 9. Self approval. An author never signs off their own work unless the
  //    workspace has deliberately turned that on.
  if (
    permission === 'content.approve' &&
    options.workspacePolicy?.allowSelfApproval !== true &&
    resource?.authorActorId !== undefined &&
    resource.authorActorId !== null &&
    resource.authorActorId === actor.actorId
  ) {
    return deny(permission, 'self_approval_forbidden');
  }

  const hadOverride = (actor.roleOverrides ?? []).some(
    (override) => override.permission === permission && override.effect === 'allow',
  );
  return allow(permission, hadOverride ? 'workspace_grant' : 'role_grants_permission');
}

/** `can` in assertion form. Returns the decision so a caller can log it. */
export function assertCan(
  actor: PolicyActor,
  permission: Permission,
  resource?: PolicyResource,
  options: PolicyOptions = {},
): Decision {
  const decision = can(actor, permission, resource, options);
  if (!decision.allowed) {
    throw new PolicyDenied(decision);
  }
  return decision;
}

/**
 * Thrown by `assertCan`. The application layer converts this into a
 * `RelayError`; this package deliberately does not depend on the error taxonomy
 * so it stays usable from a pure policy test.
 */
export class PolicyDenied extends Error {
  readonly decision: Decision;

  constructor(decision: Decision) {
    super(decision.reason);
    this.name = 'PolicyDenied';
    this.decision = decision;
  }
}

/**
 * Every permission the actor currently holds, ignoring per-resource narrowing.
 * The settings page and the CLI `relay whoami` output render this.
 */
export function grantedPermissions(
  actor: PolicyActor,
  options: PolicyOptions = {},
): readonly Permission[] {
  return PERMISSIONS.filter((permission) => can(actor, permission, undefined, options).allowed);
}
