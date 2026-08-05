import { ALL_SCOPES, type Scope } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { can, type PolicyActor } from './policy';
import { PERMISSIONS } from './permissions';
import { ROLE_PERMISSIONS } from './roles';
import {
  NON_DELEGABLE_PERMISSIONS,
  PERMISSION_SCOPES,
  SCOPE_PERMISSIONS,
  delegableScopes,
  effectiveCredentialPermissions,
  narrowScopes,
  scopeGrantsPermission,
} from './scopes';

function credential(overrides: Partial<PolicyActor> = {}): PolicyActor {
  return {
    actorType: 'service_account',
    actorId: 'svc-1',
    workspaceId: 'ws-1',
    role: 'owner',
    membershipState: 'active',
    scopes: [],
    approvalLevel: 'level_3_confirm',
    ...overrides,
  };
}

describe('scope registry bridge', () => {
  it('maps every scope onto at least one permission it unlocks', () => {
    for (const scope of ALL_SCOPES) {
      expect(SCOPE_PERMISSIONS[scope].length).toBeGreaterThan(0);
    }
  });

  it('only names permissions that exist', () => {
    const known = new Set<string>(PERMISSIONS);
    for (const scope of ALL_SCOPES) {
      for (const permission of SCOPE_PERMISSIONS[scope]) {
        expect(known.has(permission)).toBe(true);
      }
    }
  });

  it('is a consistent two way index', () => {
    for (const scope of ALL_SCOPES) {
      for (const permission of SCOPE_PERMISSIONS[scope]) {
        expect(PERMISSION_SCOPES[permission]).toContain(scope);
      }
    }
  });

  it('keeps human-only permissions permanently out of reach of a credential', () => {
    expect(NON_DELEGABLE_PERMISSIONS).toContain('content.approve');
    expect(NON_DELEGABLE_PERMISSIONS).toContain('member.update_role');
    expect(NON_DELEGABLE_PERMISSIONS).toContain('billing.manage');
    expect(NON_DELEGABLE_PERMISSIONS).toContain('developer.manage');
    expect(NON_DELEGABLE_PERMISSIONS).toContain('workspace.delete');
  });

  it('never lets a write scope imply publishing', () => {
    expect(scopeGrantsPermission(['drafts:write'], 'post.publish_now')).toBe(false);
    expect(scopeGrantsPermission(['posts:schedule'], 'post.publish_now')).toBe(false);
    expect(scopeGrantsPermission(['posts:publish'], 'post.publish_now')).toBe(true);
  });
});

describe('an agent session never inherits owner privileges', () => {
  it('denies a permission whose scope is absent even though the role allows it', () => {
    const actor = credential({ scopes: ['drafts:read'] });
    expect(ROLE_PERMISSIONS['owner'].has('post.publish_now')).toBe(true);
    const decision = can(actor, 'post.publish_now');
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe('scope_missing');
    expect(decision.requiredScopes).toEqual(['posts:publish']);
  });

  it('denies every permission when the credential holds no scopes at all', () => {
    const actor = credential({ scopes: [] });
    for (const permission of PERMISSIONS) {
      expect(can(actor, permission).allowed).toBe(false);
    }
  });

  it('denies a non delegable permission even with every scope granted', () => {
    const actor = credential({ scopes: [...ALL_SCOPES] });
    const decision = can(actor, 'content.approve');
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe('permission_not_delegable');
  });

  it('lets the same scopes through for a browser session, because a person is not capped', () => {
    const person: PolicyActor = credential({ actorType: 'user', scopes: [] });
    expect(can(person, 'post.publish_now').allowed).toBe(true);
  });
});

describe('a credential can only ever hold a subset of its granting user', () => {
  it('narrows a request to what the grantor role may delegate', () => {
    const requested: readonly Scope[] = ['drafts:write', 'posts:publish', 'connections:admin'];
    const asManager = narrowScopes({ requested, grantorRole: 'manager' });
    expect(asManager.granted).toEqual(['drafts:write', 'posts:publish', 'connections:admin']);

    const asEditor = narrowScopes({ requested, grantorRole: 'editor' });
    expect(asEditor.granted).toEqual(['drafts:write']);
    expect(asEditor.refused).toEqual(['posts:publish', 'connections:admin']);
  });

  it('never returns a scope that was not requested', () => {
    const result = narrowScopes({ requested: ['drafts:read'], grantorRole: 'owner' });
    expect(result.granted).toEqual(['drafts:read']);
  });

  it('refuses to let a credential mint a wider credential than it holds', () => {
    const result = narrowScopes({
      requested: ['drafts:write', 'posts:publish'],
      grantorRole: 'owner',
      holderScopes: ['drafts:write'],
    });
    expect(result.granted).toEqual(['drafts:write']);
    expect(result.refused).toEqual(['posts:publish']);
  });

  it('keeps connection administration away from third party applications', () => {
    const result = narrowScopes({
      requested: ['connections:admin', 'accounts:read'],
      grantorRole: 'owner',
      thirdParty: true,
    });
    expect(result.granted).toEqual(['accounts:read']);
    expect(result.refused).toEqual(['connections:admin']);
  });

  it('recomputes effective permissions from the grantor live role', () => {
    const granted: readonly Scope[] = ['posts:publish', 'drafts:write'];
    const asManager = effectiveCredentialPermissions(granted, 'manager');
    expect(asManager.has('post.publish_now')).toBe(true);

    // The user is demoted. The token did not change, the authority did.
    const asEditor = effectiveCredentialPermissions(granted, 'editor');
    expect(asEditor.has('post.publish_now')).toBe(false);
    expect(asEditor.has('content.write')).toBe(true);
  });

  it('an analyst can delegate reads and nothing consequential', () => {
    const scopes = delegableScopes('analyst');
    expect(scopes).toContain('analytics:read');
    expect(scopes).not.toContain('posts:publish');
    expect(scopes).not.toContain('posts:schedule');
    expect(scopes).not.toContain('drafts:write');
  });

  it('a viewer cannot delegate anything that writes', () => {
    for (const scope of delegableScopes('viewer')) {
      for (const permission of SCOPE_PERMISSIONS[scope]) {
        expect(ROLE_PERMISSIONS['viewer'].has(permission)).toBe(true);
      }
    }
  });
});
