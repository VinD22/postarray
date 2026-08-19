import { ROLES, type Role } from '@relay/contracts';

import { PERMISSIONS, type Permission } from './permissions';

/**
 * The built-in role to permission matrix.
 *
 * Seven seeded roles, no custom roles in V1. The matrix is code rather than
 * data so a policy change is a reviewed diff with tests, not a row someone
 * edited in production. Per-workspace grants and denials layer on top of this
 * through `role_permissions`, and a denial always wins.
 */

/** Everything a viewer may do: read, and nothing else. */
const VIEWER: readonly Permission[] = [
  'workspace.read',
  'member.read',
  'project.read',
  'connection.read',
  'content.read',
  'media.read',
  'receipt.read',
  'analytics.read',
  'link.read',
  'rule.read',
  'rss.read',
  'growth.read',
  'webhook.read',
  'health.read',
];

/** An analyst reads everything a viewer reads, plus measurement work. */
const ANALYST: readonly Permission[] = [
  ...VIEWER,
  'analytics.export',
  'experiment.write',
  'growth.export',
];

/**
 * An approver decides. It is deliberately not a superset of the editor: an
 * approver may stop work in flight but may not author the copy it approves.
 */
const APPROVER: readonly Permission[] = [
  ...VIEWER,
  'content.approve',
  'post.cancel',
  'analytics.export',
];

/**
 * An editor authors. It may schedule inside the workspace approval policy but
 * can never publish immediately and can never approve.
 */
const EDITOR: readonly Permission[] = [
  ...VIEWER,
  'content.write',
  'content.delete',
  'content.request_approval',
  'media.write',
  'media.delete',
  'link.write',
  'growth.write',
  'growth.export',
  'post.schedule',
  'post.reschedule',
  'post.cancel',
];

/**
 * A manager runs the publishing operation: connections, approvals, immediate
 * publishing, automation. It does not touch money, credentials or membership
 * roles.
 */
const MANAGER: readonly Permission[] = [
  ...EDITOR,
  'content.approve',
  'project.write',
  'connection.connect',
  'connection.reconnect',
  'connection.pause',
  'connection.disconnect',
  'post.publish_now',
  'post.retry',
  'rule.write',
  'rule.run',
  'rss.write',
  'experiment.write',
  'analytics.export',
  'member.invite',
  'audit.read',
  'billing.read',
];

/** An admin runs the tenant, including credentials and billing. */
const ADMIN: readonly Permission[] = [
  ...MANAGER,
  'workspace.update',
  'member.update_role',
  'member.remove',
  'project.delete',
  'webhook.write',
  'developer.manage',
  'billing.manage',
];

/** The owner is the only role that can hand the workspace over or destroy it. */
const OWNER: readonly Permission[] = [...PERMISSIONS];

function freeze(permissions: readonly Permission[]): ReadonlySet<Permission> {
  return new Set(permissions);
}

export const ROLE_PERMISSIONS: Readonly<Record<Role, ReadonlySet<Permission>>> = Object.freeze({
  owner: freeze(OWNER),
  admin: freeze(ADMIN),
  manager: freeze(MANAGER),
  editor: freeze(EDITOR),
  approver: freeze(APPROVER),
  analyst: freeze(ANALYST),
  viewer: freeze(VIEWER),
});

/**
 * Ordering used only to answer "what is the least privileged role that could do
 * this?" for the UI. It is never used to decide access: a higher rank does not
 * imply a lower rank's permissions, because approver and editor are siblings.
 */
export const ROLE_RANK: Readonly<Record<Role, number>> = Object.freeze({
  viewer: 0,
  analyst: 1,
  approver: 2,
  editor: 3,
  manager: 4,
  admin: 5,
  owner: 6,
});

export function roleHasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].has(permission);
}

export function permissionsForRole(role: Role): readonly Permission[] {
  return PERMISSIONS.filter((permission) => ROLE_PERMISSIONS[role].has(permission));
}

/** Every role that carries `permission`, lowest rank first. */
export function rolesWithPermission(permission: Permission): readonly Role[] {
  return [...ROLES]
    .filter((role) => ROLE_PERMISSIONS[role].has(permission))
    .sort((left, right) => ROLE_RANK[left] - ROLE_RANK[right]);
}

/**
 * The least privileged built-in role that carries `permission`. The UI renders
 * this in a denial ("this needs the manager role"), so it must be the smallest
 * honest answer, not simply "owner".
 */
export function minimumRoleFor(permission: Permission): Role | null {
  const [first] = rolesWithPermission(permission);
  return first ?? null;
}

/** A per-workspace override row: an explicit extra grant or an explicit denial. */
export interface RolePermissionOverride {
  readonly role: Role;
  readonly permission: Permission;
  readonly effect: 'allow' | 'deny';
}

export interface EffectivePermissions {
  readonly role: Role;
  readonly permissions: ReadonlySet<Permission>;
  readonly denied: ReadonlySet<Permission>;
}

/**
 * Fold workspace overrides onto the built-in matrix. A `deny` always wins over
 * both the matrix and an `allow`, so a workspace can only ever make a role
 * safer than the shipped default in the direction it cares about.
 */
export function effectivePermissions(
  role: Role,
  overrides: readonly RolePermissionOverride[] = [],
): EffectivePermissions {
  const granted = new Set<Permission>(ROLE_PERMISSIONS[role]);
  const denied = new Set<Permission>();

  for (const override of overrides) {
    if (override.role !== role) {
      continue;
    }
    if (override.effect === 'deny') {
      denied.add(override.permission);
      granted.delete(override.permission);
    } else if (!denied.has(override.permission)) {
      granted.add(override.permission);
    }
  }

  for (const permission of denied) {
    granted.delete(permission);
  }

  return { role, permissions: granted, denied };
}
