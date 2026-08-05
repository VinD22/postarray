import { ROLES } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { PERMISSIONS } from './permissions';
import {
  ROLE_PERMISSIONS,
  effectivePermissions,
  permissionsForRole,
  roleHasPermission,
} from './roles';

describe('the role matrix', () => {
  it('covers every seeded role', () => {
    for (const role of ROLES) {
      expect(ROLE_PERMISSIONS[role]).toBeInstanceOf(Set);
    }
  });

  it('gives the owner every permission', () => {
    for (const permission of PERMISSIONS) {
      expect(roleHasPermission('owner', permission)).toBe(true);
    }
  });

  it('reserves workspace destruction and transfer for the owner', () => {
    for (const role of ROLES) {
      if (role === 'owner') {
        continue;
      }
      expect(roleHasPermission(role, 'workspace.delete')).toBe(false);
      expect(roleHasPermission(role, 'workspace.transfer')).toBe(false);
    }
  });

  it('never lets a viewer or an analyst write', () => {
    for (const role of ['viewer', 'analyst'] as const) {
      expect(roleHasPermission(role, 'content.write')).toBe(false);
      expect(roleHasPermission(role, 'post.schedule')).toBe(false);
      expect(roleHasPermission(role, 'post.publish_now')).toBe(false);
      expect(roleHasPermission(role, 'content.approve')).toBe(false);
    }
  });

  it('keeps authoring and approving apart', () => {
    expect(roleHasPermission('editor', 'content.write')).toBe(true);
    expect(roleHasPermission('editor', 'content.approve')).toBe(false);
    expect(roleHasPermission('approver', 'content.approve')).toBe(true);
    expect(roleHasPermission('approver', 'content.write')).toBe(false);
  });

  it('keeps money and credentials with admins and owners', () => {
    for (const role of ['manager', 'editor', 'approver', 'analyst', 'viewer'] as const) {
      expect(roleHasPermission(role, 'billing.manage')).toBe(false);
      expect(roleHasPermission(role, 'developer.manage')).toBe(false);
    }
    expect(roleHasPermission('admin', 'billing.manage')).toBe(true);
    expect(roleHasPermission('admin', 'developer.manage')).toBe(true);
  });

  it('returns permissions in the canonical order', () => {
    const listed = permissionsForRole('manager');
    const canonical = PERMISSIONS.filter((permission) => listed.includes(permission));
    expect(listed).toEqual(canonical);
  });
});

describe('workspace overrides', () => {
  it('lets a workspace deny a permission the matrix grants', () => {
    const effective = effectivePermissions('manager', [
      { role: 'manager', permission: 'post.publish_now', effect: 'deny' },
    ]);
    expect(effective.permissions.has('post.publish_now')).toBe(false);
    expect(effective.denied.has('post.publish_now')).toBe(true);
  });

  it('lets a workspace grant a permission the matrix withholds', () => {
    const effective = effectivePermissions('editor', [
      { role: 'editor', permission: 'post.publish_now', effect: 'allow' },
    ]);
    expect(effective.permissions.has('post.publish_now')).toBe(true);
  });

  it('lets a denial win over an allow whatever the order', () => {
    const denyFirst = effectivePermissions('editor', [
      { role: 'editor', permission: 'post.publish_now', effect: 'deny' },
      { role: 'editor', permission: 'post.publish_now', effect: 'allow' },
    ]);
    const allowFirst = effectivePermissions('editor', [
      { role: 'editor', permission: 'post.publish_now', effect: 'allow' },
      { role: 'editor', permission: 'post.publish_now', effect: 'deny' },
    ]);
    expect(denyFirst.permissions.has('post.publish_now')).toBe(false);
    expect(allowFirst.permissions.has('post.publish_now')).toBe(false);
  });

  it('ignores an override written for another role', () => {
    const effective = effectivePermissions('editor', [
      { role: 'manager', permission: 'post.publish_now', effect: 'allow' },
    ]);
    expect(effective.permissions.has('post.publish_now')).toBe(false);
  });
});
