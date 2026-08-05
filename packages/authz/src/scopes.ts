import { ALL_SCOPES, type Role, type Scope } from '@relay/contracts';

import { PERMISSIONS, type Permission } from './permissions.js';
import { ROLE_PERMISSIONS } from './roles.js';

/**
 * The bridge between the OAuth scope registry in `@relay/contracts` and the
 * permission vocabulary the policy evaluates.
 *
 * Two rules hold everywhere and are proved by the tests next to this file:
 *
 *  1. A credential can only ever hold a **subset** of what its granting user
 *     holds. Effective authority is `granted scopes ∩ grantor role permissions`,
 *     recomputed per request, so demoting the user narrows every live token.
 *  2. Owner privileges never flow automatically into an agent session. A scoped
 *     credential starts at zero and receives exactly what was named. There is no
 *     permission reachable from a scope that the scope does not list.
 *
 * Some permissions map to no scope at all. That is deliberate: approving
 * content, changing a member's role, managing billing, minting credentials and
 * destroying a workspace are human actions. A scoped credential is denied them
 * with `permission_not_delegable` no matter what its granting user could do.
 */

export const SCOPE_PERMISSIONS: Readonly<Record<Scope, readonly Permission[]>> = Object.freeze({
  'accounts:read': ['connection.read'],
  'accounts:write': ['connection.reconnect', 'connection.pause'],
  'connections:admin': ['connection.connect', 'connection.disconnect'],
  'drafts:read': ['content.read', 'brand.read'],
  'drafts:write': ['content.write', 'content.delete', 'content.request_approval'],
  'posts:schedule': ['post.schedule', 'post.reschedule'],
  'posts:publish': ['post.publish_now', 'post.retry'],
  'posts:cancel': ['post.cancel'],
  'analytics:read': ['analytics.read', 'receipt.read', 'link.read'],
  'media:read': ['media.read'],
  'media:write': ['media.write', 'media.delete'],
  'rules:read': ['rule.read', 'rss.read'],
  'rules:write': ['rule.write', 'rule.run', 'rss.write'],
  'growth:read': ['growth.read'],
  'growth:write': ['growth.write', 'growth.export'],
  'webhooks:manage': ['webhook.read', 'webhook.write'],
  'billing:read': ['billing.read'],
});

function buildPermissionScopes(): Readonly<Record<Permission, readonly Scope[]>> {
  const index = new Map<Permission, Scope[]>();
  for (const permission of PERMISSIONS) {
    index.set(permission, []);
  }
  for (const scope of ALL_SCOPES) {
    for (const permission of SCOPE_PERMISSIONS[scope]) {
      const bucket = index.get(permission);
      if (bucket !== undefined) {
        bucket.push(scope);
      }
    }
  }
  const output: Record<string, readonly Scope[]> = {};
  for (const [permission, scopes] of index) {
    output[permission] = Object.freeze([...scopes]);
  }
  return Object.freeze(output) as Readonly<Record<Permission, readonly Scope[]>>;
}

/** For each permission, the scopes that unlock it. Holding any one is enough. */
export const PERMISSION_SCOPES = buildPermissionScopes();

/** Permissions no credential can ever carry, whatever its granting user holds. */
export const NON_DELEGABLE_PERMISSIONS: readonly Permission[] = PERMISSIONS.filter(
  (permission) => PERMISSION_SCOPES[permission].length === 0,
);

export function isDelegable(permission: Permission): boolean {
  return PERMISSION_SCOPES[permission].length > 0;
}

/** The scopes that satisfy `permission`, in registry order. */
export function scopesForPermission(permission: Permission): readonly Scope[] {
  return PERMISSION_SCOPES[permission];
}

/** True when at least one granted scope unlocks `permission`. */
export function scopeGrantsPermission(granted: readonly Scope[], permission: Permission): boolean {
  const accepted = PERMISSION_SCOPES[permission];
  if (accepted.length === 0) {
    return false;
  }
  return accepted.some((scope) => granted.includes(scope));
}

/**
 * The scopes a holder of `role` is allowed to delegate. A scope is delegable
 * only when the role holds **every** permission that scope unlocks, so a
 * partially privileged role can never hand out an authority it lacks.
 */
export function delegableScopes(role: Role): readonly Scope[] {
  const held = ROLE_PERMISSIONS[role];
  return ALL_SCOPES.filter((scope) =>
    SCOPE_PERMISSIONS[scope].every((permission) => held.has(permission)),
  );
}

/**
 * Scopes that a third-party OAuth application may never be granted. Connection
 * administration mints and destroys the credentials the whole product rests on,
 * so it stays with first-party surfaces and workspace-owned automation.
 */
export const THIRD_PARTY_FORBIDDEN_SCOPES: readonly Scope[] = ['connections:admin'];

export function isThirdPartyGrantable(scope: Scope): boolean {
  return !THIRD_PARTY_FORBIDDEN_SCOPES.includes(scope);
}

export interface ScopeNarrowingInput {
  readonly requested: readonly Scope[];
  readonly grantorRole: Role;
  /** Set when the credential belongs to a third-party developer application. */
  readonly thirdParty?: boolean;
  /** An intermediate credential cannot mint a wider one than it holds itself. */
  readonly holderScopes?: readonly Scope[];
}

export interface ScopeNarrowingResult {
  readonly granted: readonly Scope[];
  readonly refused: readonly Scope[];
}

/**
 * `min(requested, grantor role, holder credential, third-party rules)`.
 *
 * Narrowing is monotonic: this function never returns a scope that was not
 * requested, and never one the grantor could not delegate.
 */
export function narrowScopes(input: ScopeNarrowingInput): ScopeNarrowingResult {
  const delegable = new Set(delegableScopes(input.grantorRole));
  const holder = input.holderScopes === undefined ? null : new Set(input.holderScopes);

  const granted: Scope[] = [];
  const refused: Scope[] = [];

  for (const scope of ALL_SCOPES) {
    if (!input.requested.includes(scope)) {
      continue;
    }
    const allowed =
      delegable.has(scope) &&
      (holder === null || holder.has(scope)) &&
      (input.thirdParty !== true || isThirdPartyGrantable(scope));
    if (allowed) {
      granted.push(scope);
    } else {
      refused.push(scope);
    }
  }

  return { granted, refused };
}

/**
 * Effective permissions of a scoped credential: the intersection of what the
 * scopes unlock with what the granting user's live role still holds.
 */
export function effectiveCredentialPermissions(
  granted: readonly Scope[],
  grantorRole: Role,
): ReadonlySet<Permission> {
  const held = ROLE_PERMISSIONS[grantorRole];
  const effective = new Set<Permission>();
  for (const scope of granted) {
    for (const permission of SCOPE_PERMISSIONS[scope]) {
      if (held.has(permission)) {
        effective.add(permission);
      }
    }
  }
  return effective;
}
