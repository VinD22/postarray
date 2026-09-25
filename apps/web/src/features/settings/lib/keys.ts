'use client';

import { useSession } from '@/lib/auth/session-context';

/**
 * Cache keys for these screens.
 *
 * Every key starts with the workspace id, for the same reason the shared
 * `keys` helper does: switching workspace must never show another tenant's
 * members, credentials or invoices for even one frame.
 */
export type SettingsKeyPart = string | number;

export function settingsKey(
  workspaceId: string,
  ...parts: readonly SettingsKeyPart[]
): readonly SettingsKeyPart[] {
  return ['ws', workspaceId, 'settings', ...parts];
}

/** Read the server-authorized shell context before issuing any settings query. */
export function useWorkspaceId(): string {
  return useSession().workspace.id;
}
