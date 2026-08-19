/**
 * The fine-grained permission vocabulary.
 *
 * A permission is an action string, never a resource type on its own. Code asks
 * "may this actor `post.publish_now`?", never "is this actor an admin?". Roles
 * are a convenience for humans; the permission is what the policy evaluates.
 */

export const PERMISSIONS = [
  // Workspace
  'workspace.read',
  'workspace.update',
  'workspace.transfer',
  'workspace.delete',

  // Membership
  'member.read',
  'member.invite',
  'member.update_role',
  'member.remove',

  // Projects and campaigns
  'project.read',
  'project.write',
  'project.delete',

  // Connections
  'connection.read',
  'connection.connect',
  'connection.reconnect',
  'connection.pause',
  'connection.disconnect',

  // Content
  'content.read',
  'content.write',
  'content.delete',
  'content.request_approval',
  'content.approve',

  // Media
  'media.read',
  'media.write',
  'media.delete',

  // Publishing
  'post.schedule',
  'post.reschedule',
  'post.cancel',
  'post.publish_now',
  'post.retry',
  'receipt.read',

  // Analytics
  'analytics.read',
  'analytics.export',
  'experiment.write',

  // Short links
  'link.read',
  'link.write',

  // Automation
  'rule.read',
  'rule.write',
  'rule.run',
  'rss.read',
  'rss.write',

  // Growth advisor
  'growth.read',
  'growth.write',
  'growth.export',

  // Integrations
  'webhook.read',
  'webhook.write',
  'developer.manage',

  // Money and evidence
  'billing.read',
  'billing.manage',
  'audit.read',
  'health.read',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const PERMISSION_SET: ReadonlySet<string> = new Set<string>(PERMISSIONS);

export function isPermission(value: unknown): value is Permission {
  return typeof value === 'string' && PERMISSION_SET.has(value);
}

/**
 * Permissions whose exercise creates or destroys something outside Relay, or
 * moves money. They can never be granted implicitly by a broader permission.
 */
export const CONSEQUENTIAL_PERMISSIONS: readonly Permission[] = [
  'connection.connect',
  'connection.disconnect',
  'content.approve',
  'post.schedule',
  'post.publish_now',
  'post.retry',
  'rule.write',
  'rule.run',
  'developer.manage',
  'billing.manage',
  'member.update_role',
  'member.remove',
  'workspace.transfer',
  'workspace.delete',
];

/** Permissions that only read. Safe for an analyst, a viewer or a level 0 agent. */
export const READ_PERMISSIONS: readonly Permission[] = PERMISSIONS.filter(
  (permission) =>
    permission.endsWith('.read') ||
    permission === 'analytics.export' ||
    permission === 'growth.export',
);

const READ_PERMISSION_SET: ReadonlySet<string> = new Set<string>(READ_PERMISSIONS);

export function isReadPermission(permission: Permission): boolean {
  return READ_PERMISSION_SET.has(permission);
}

const CONSEQUENTIAL_PERMISSION_SET: ReadonlySet<string> = new Set<string>(
  CONSEQUENTIAL_PERMISSIONS,
);

export function isConsequentialPermission(permission: Permission): boolean {
  return CONSEQUENTIAL_PERMISSION_SET.has(permission);
}
