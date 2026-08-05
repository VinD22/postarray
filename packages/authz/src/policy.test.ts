import { describe, expect, it } from 'vitest';

import { can, grantedPermissions, type PolicyActor } from './policy';
import { minimumRoleFor, roleHasPermission } from './roles';

function user(overrides: Partial<PolicyActor> = {}): PolicyActor {
  return {
    actorType: 'user',
    actorId: 'user-1',
    workspaceId: 'ws-1',
    role: 'editor',
    membershipState: 'active',
    scopes: [],
    approvalLevel: 'level_3_confirm',
    ...overrides,
  };
}

describe('can', () => {
  it('allows an owner everything', () => {
    const owner = user({ role: 'owner', actorId: 'owner-1' });
    expect(can(owner, 'workspace.delete').allowed).toBe(true);
    expect(can(owner, 'post.publish_now').allowed).toBe(true);
    expect(can(owner, 'billing.manage').allowed).toBe(true);
  });

  it('never returns an allowed decision without a reason', () => {
    const decision = can(user(), 'content.write');
    expect(decision.allowed).toBe(true);
    expect(decision.reason).toBe('role_grants_permission');
    expect(decision.messageKey).toBe('authz.role_grants_permission');
  });

  it('denies an analyst scheduling and names the role that would work', () => {
    const decision = can(user({ role: 'analyst' }), 'post.schedule');
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe('role_lacks_permission');
    expect(decision.requiredRole).toBe('editor');
  });

  it('denies an editor immediate publishing', () => {
    const decision = can(user({ role: 'editor' }), 'post.publish_now');
    expect(decision.allowed).toBe(false);
    expect(decision.requiredRole).toBe('manager');
  });

  it('denies an editor approving their own post when self approval is off', () => {
    const manager = user({ role: 'manager', actorId: 'author-1' });
    const decision = can(
      manager,
      'content.approve',
      { authorActorId: 'author-1' },
      { workspacePolicy: { allowSelfApproval: false } },
    );
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe('self_approval_forbidden');
  });

  it('allows self approval only when the workspace has enabled it', () => {
    const manager = user({ role: 'manager', actorId: 'author-1' });
    const decision = can(
      manager,
      'content.approve',
      { authorActorId: 'author-1' },
      { workspacePolicy: { allowSelfApproval: true } },
    );
    expect(decision.allowed).toBe(true);
  });

  it('allows approving somebody else regardless of the workspace policy', () => {
    const manager = user({ role: 'manager', actorId: 'approver-1' });
    expect(can(manager, 'content.approve', { authorActorId: 'author-9' }).allowed).toBe(true);
  });

  it('honours a workspace denial over the built-in matrix', () => {
    const actor = user({
      role: 'manager',
      roleOverrides: [{ role: 'manager', permission: 'post.publish_now', effect: 'deny' }],
    });
    const decision = can(actor, 'post.publish_now');
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe('workspace_denies_permission');
  });

  it('honours a workspace grant and labels the decision as one', () => {
    const actor = user({
      role: 'viewer',
      roleOverrides: [{ role: 'viewer', permission: 'content.write', effect: 'allow' }],
    });
    const decision = can(actor, 'content.write');
    expect(decision.allowed).toBe(true);
    expect(decision.reason).toBe('workspace_grant');
  });

  it('fails closed on an inactive membership', () => {
    const decision = can(user({ membershipState: 'suspended' }), 'content.read');
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe('membership_not_active');
  });

  it('fails closed on a revoked grant, including for reads', () => {
    const actor = user({
      actorType: 'oauth_app',
      scopes: ['drafts:read'],
      grantRevoked: true,
    });
    const decision = can(actor, 'content.read');
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe('grant_revoked');
  });

  it('fails closed on an expired credential', () => {
    const actor = user({
      actorType: 'service_account',
      scopes: ['drafts:read'],
      credentialExpired: true,
    });
    expect(can(actor, 'content.read').reason).toBe('credential_expired');
  });

  it('refuses writes in a read only workspace but still allows reads', () => {
    const actor = user({ role: 'manager', workspaceState: 'read_only' });
    expect(can(actor, 'content.write').reason).toBe('workspace_read_only');
    expect(can(actor, 'content.read').allowed).toBe(true);
  });

  it('refuses everything in a suspended workspace', () => {
    const actor = user({ role: 'owner', workspaceState: 'suspended' });
    expect(can(actor, 'content.read').reason).toBe('workspace_suspended');
  });

  it('refuses writes while the operator kill switch is engaged', () => {
    const actor = user({ role: 'owner', killSwitchEngaged: true });
    expect(can(actor, 'post.publish_now').reason).toBe('kill_switch_engaged');
    expect(can(actor, 'receipt.read').allowed).toBe(true);
  });

  it('refuses a resource from another workspace', () => {
    const decision = can(user({ role: 'owner' }), 'content.read', { workspaceId: 'ws-2' });
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe('no_membership');
  });

  it('enforces brand narrowing only for the named brand', () => {
    const actor = user({
      actorType: 'service_account',
      role: 'manager',
      scopes: ['drafts:write'],
      brandScope: ['brand-a'],
    });
    expect(can(actor, 'content.write', { brandId: 'brand-a' }).allowed).toBe(true);
    const denied = can(actor, 'content.write', { brandId: 'brand-b' });
    expect(denied.allowed).toBe(false);
    expect(denied.reason).toBe('brand_out_of_scope');
  });

  it('enforces connection narrowing', () => {
    const actor = user({
      actorType: 'service_account',
      role: 'manager',
      scopes: ['posts:schedule'],
      connectionScope: ['conn-a'],
    });
    expect(can(actor, 'post.schedule', { connectionId: 'conn-a' }).allowed).toBe(true);
    expect(can(actor, 'post.schedule', { connectionId: 'conn-b' }).reason).toBe(
      'connection_out_of_scope',
    );
  });

  it('caps a level 2 agent below immediate publishing', () => {
    const agent = user({
      actorType: 'service_account',
      role: 'manager',
      scopes: ['posts:schedule', 'posts:publish'],
      approvalLevel: 'level_2_scheduled',
    });
    expect(can(agent, 'post.schedule').allowed).toBe(true);
    const decision = can(agent, 'post.publish_now');
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe('approval_level_insufficient');
    expect(decision.details?.['required']).toBe('level_3_confirm');
  });

  it('caps a level 0 agent at reading', () => {
    const agent = user({
      actorType: 'service_account',
      role: 'manager',
      scopes: ['drafts:read', 'drafts:write'],
      approvalLevel: 'level_0_read',
    });
    expect(can(agent, 'content.read').allowed).toBe(true);
    expect(can(agent, 'content.write').reason).toBe('approval_level_insufficient');
  });

  it('grantedPermissions lists exactly what the actor may do', () => {
    const viewer = user({ role: 'viewer' });
    const granted = grantedPermissions(viewer);
    expect(granted).toContain('content.read');
    expect(granted).not.toContain('content.write');
    for (const permission of granted) {
      expect(roleHasPermission('viewer', permission)).toBe(true);
    }
  });

  it('minimumRoleFor returns the smallest honest answer', () => {
    expect(minimumRoleFor('content.read')).toBe('viewer');
    expect(minimumRoleFor('content.approve')).toBe('approver');
    expect(minimumRoleFor('workspace.delete')).toBe('owner');
  });
});
