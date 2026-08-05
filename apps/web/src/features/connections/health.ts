/**
 * Connection health, and the exact remediation for each state.
 *
 * "Reconnect" on its own is not a remediation. The person needs to know which
 * account, what will happen to the posts already scheduled on it, and, when
 * the platform is the blocker, what they have to change there first. This
 * module holds that mapping so the row, the detail page and the action center
 * cannot disagree about it.
 */

import type { ConnectionHealth, ProviderId } from '@/lib/api/types';
import type { ConnectionRow } from './types';

/** Hours of remaining access below which we call a token "expiring soon". */
export const EXPIRY_WARNING_HOURS = 72;

export type HealthTone = 'ok' | 'warning' | 'destructive' | 'neutral';

const TONE: Readonly<Record<ConnectionHealth, HealthTone>> = {
  healthy: 'ok',
  expiring_soon: 'warning',
  expired: 'destructive',
  revoked: 'destructive',
  paused: 'neutral',
  permission_missing: 'warning',
  review_pending: 'warning',
  unknown: 'neutral',
};

export function healthTone(health: ConnectionHealth): HealthTone {
  return TONE[health];
}

/**
 * The catalog key for the remediation sentence.
 *
 * Instagram and Facebook get provider-specific sentences because the fix is
 * genuinely different: an Instagram account type has to change in the
 * Instagram app before reconnecting can possibly work, and telling somebody to
 * "reconnect" first wastes their time and produces the same failure twice.
 */
export function remediationKey(health: ConnectionHealth, provider: ProviderId): string | null {
  switch (health) {
    case 'expired':
    case 'revoked':
      return 'connection.incident.invalidToken';
    case 'permission_missing':
      return provider === 'instagram'
        ? 'connection.incident.accountTypeInvalid'
        : 'connection.incident.permissionLost';
    case 'review_pending':
      return 'connection.incident.reviewRestricted';
    case 'expiring_soon':
      return 'connection.reconnect.body';
    default:
      return null;
  }
}

/** The single verb this row's state calls for, or null when nothing is wrong. */
export type RemediationAction = 'reconnect' | 'resume' | 'inspect' | null;

export function remediationAction(health: ConnectionHealth): RemediationAction {
  switch (health) {
    case 'expired':
    case 'revoked':
    case 'expiring_soon':
      return 'reconnect';
    case 'permission_missing':
      return 'reconnect';
    case 'paused':
      return 'resume';
    case 'review_pending':
      return 'inspect';
    default:
      return null;
  }
}

/**
 * Derive health from an expiry when the server has not classified it.
 *
 * Never guesses "healthy": an account with no expiry we can read is `unknown`,
 * not fine. Saying "Working" about something we cannot check is exactly the
 * kind of confident wrongness that costs somebody a launch post.
 */
export function deriveHealth(expiresAt: string | null, now: Date = new Date()): ConnectionHealth {
  if (expiresAt === null) return 'unknown';
  const remainingMs = new Date(expiresAt).getTime() - now.getTime();
  if (Number.isNaN(remainingMs)) return 'unknown';
  if (remainingMs <= 0) return 'expired';
  if (remainingMs <= EXPIRY_WARNING_HOURS * 3_600_000) return 'expiring_soon';
  return 'healthy';
}

/** The count of permissions the provider has not granted. */
export function missingPermissionCount(row: ConnectionRow): number {
  return (row.permissions ?? []).filter((permission) => !permission.granted).length;
}

/** Sort so the accounts that need a person come first. */
export function sortByUrgency(rows: readonly ConnectionRow[]): readonly ConnectionRow[] {
  const order: Readonly<Record<ConnectionHealth, number>> = {
    revoked: 0,
    expired: 1,
    permission_missing: 2,
    expiring_soon: 3,
    review_pending: 4,
    unknown: 5,
    paused: 6,
    healthy: 7,
  };
  return [...rows].sort((left, right) => {
    const delta = order[left.health] - order[right.health];
    if (delta !== 0) return delta;
    if (left.provider !== right.provider) return left.provider.localeCompare(right.provider);
    return left.displayName.localeCompare(right.displayName);
  });
}
