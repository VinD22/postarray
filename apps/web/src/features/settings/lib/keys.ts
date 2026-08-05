'use client';

import { useQuery } from '@tanstack/react-query';
import { api, keys } from '@/lib/api';

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

/**
 * The active workspace id.
 *
 * Reads the session query the shell already populates, so this is a cache hit
 * on every screen after the first. An empty string before the session resolves
 * is deliberate: the queries that depend on it are keyed by it, so they refetch
 * under the real id as soon as it arrives.
 */
export function useWorkspaceId(): string {
  const session = useQuery({ queryKey: keys.session(), queryFn: () => api.session.get() });
  return session.data?.workspace.id ?? '';
}
