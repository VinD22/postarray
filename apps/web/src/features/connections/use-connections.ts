'use client';

/**
 * Connection data access.
 *
 * The list, the pause and the resume come from `@/lib/api/hooks` so the cache
 * keys and the workspace scoping stay the shell's. This module adds the reads
 * and writes only the connections screen needs.
 *
 * Nothing here is optimistic. Pausing, resuming, reconnecting and
 * disconnecting all change what the outside world will accept from us, and a
 * row that flips before the server agrees would be a claim we cannot back up.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import type { CapabilitySnapshot } from '@relay/contracts';
import { api, keys, newIdempotencyKey, type ApiError } from '@/lib/api';
import {
  useBeginConnection,
  useAvailableProviders,
  useConnections as useConnectionsPage,
  usePauseConnection,
  useResumeConnection,
} from '@/lib/api/hooks';
import { useWorkspaceId } from '@/lib/auth/session-context';
import type { BrandView, ConnectionView, ProviderId } from '@/lib/api/types';
import type { ConnectionRow, CustomerGroup } from './types';

export { useAvailableProviders, useBeginConnection, usePauseConnection, useResumeConnection };

/** The connection list, widened to the row shape this screen renders. */
export function useConnectionRows(filter: { brandId?: string; provider?: ProviderId } = {}): {
  readonly query: ReturnType<typeof useConnectionsPage>;
  readonly rows: readonly ConnectionRow[];
} {
  const query = useConnectionsPage(filter);
  return { query, rows: (query.data?.data ?? []) as readonly ConnectionRow[] };
}

/**
 * The capability snapshot for one account.
 *
 * Cached for five minutes rather than indefinitely: a snapshot is versioned
 * and can change when a provider grants a review or an account type changes,
 * and showing yesterday's answer to "can this account post video" is worse
 * than one extra request.
 */
export function useConnectionCapabilities(
  connectionId: string | null,
): UseQueryResult<CapabilitySnapshot | null, ApiError> {
  const workspaceId = useWorkspaceId();
  return useQuery({
    queryKey: keys.connectionCapabilities(workspaceId, connectionId ?? 'none'),
    enabled: connectionId !== null,
    staleTime: 5 * 60_000,
    queryFn: () => api.connections.getCapabilities(connectionId as string),
  });
}

/**
 * Every account's capability snapshot, for the matrix.
 *
 * One request per connected account, run together. The matrix keeps the newest
 * snapshot per provider, so several accounts on the same platform collapse to
 * one honest column rather than fighting over it.
 */
export function useAllCapabilities(
  connectionIds: readonly string[],
): UseQueryResult<readonly CapabilitySnapshot[], ApiError> {
  const workspaceId = useWorkspaceId();
  return useQuery({
    queryKey: [...keys.workspace(workspaceId), 'capabilities', [...connectionIds].sort()],
    enabled: connectionIds.length > 0,
    staleTime: 5 * 60_000,
    queryFn: async (): Promise<readonly CapabilitySnapshot[]> => {
      const results = await Promise.all(
        connectionIds.map((id) => api.connections.getCapabilities(id)),
      );
      return results.filter((snapshot): snapshot is CapabilitySnapshot => snapshot !== null);
    },
  });
}

/** Reconnect an existing account. Returns the provider consent URL. */
export function useReconnectConnection(): UseMutationResult<
  { authorizationUrl: string; transactionId: string },
  ApiError,
  { readonly connectionId: string }
> {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  return useMutation({
    mutationFn: ({ connectionId }) =>
      api.connections.reconnect(
        connectionId,
        { returnUrl: '/connections' },
        newIdempotencyKey('reconnect'),
      ),
    onSuccess: (_data, { connectionId }) => {
      void queryClient.invalidateQueries({ queryKey: keys.connection(workspaceId, connectionId) });
      void queryClient.invalidateQueries({ queryKey: ['ws', workspaceId, 'connections'] });
    },
  });
}

/**
 * Disconnect.
 *
 * Never optimistic and never silent: it stops scheduled posts from publishing,
 * which is a change to what will happen in the world.
 */
export function useDisconnectConnection(): UseMutationResult<ConnectionView, ApiError, string> {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  return useMutation({
    mutationFn: (connectionId: string) =>
      api.connections.disconnect(connectionId, newIdempotencyKey('disconnect')),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ws', workspaceId, 'connections'] });
      void queryClient.invalidateQueries({ queryKey: ['ws', workspaceId, 'calendar'] });
    },
  });
}

/* -------------------------------------------------------------------------
   Customer groups

   A group is a brand in the domain model: a named set of connections that
   scopes the calendar, analytics and approval policy. The screen calls them
   customer groups because that is what an agency calls a client.
   ------------------------------------------------------------------------- */

export function useCustomerGroups(): UseQueryResult<readonly CustomerGroup[], ApiError> {
  const workspaceId = useWorkspaceId();
  return useQuery({
    queryKey: keys.brands(workspaceId),
    staleTime: 5 * 60_000,
    queryFn: async (): Promise<readonly CustomerGroup[]> => {
      const page = await api.brands.list();
      return page.data.map(toCustomerGroup);
    },
  });
}

function toCustomerGroup(brand: BrandView): CustomerGroup {
  return { id: brand.id, name: brand.name, connectionIds: brand.connectionIds };
}

export function useCreateGroup(): UseMutationResult<
  BrandView,
  ApiError,
  { readonly name: string }
> {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  return useMutation({
    mutationFn: ({ name }) => api.brands.create({ name }, newIdempotencyKey('brand')),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: keys.brands(workspaceId) });
    },
  });
}

/**
 * Move an account between groups.
 *
 * Membership is a property of the group, so a move is one write per side. The
 * account's posts, receipts and metrics are keyed to the connection and are
 * untouched, which is what the dialog promises.
 *
 * TODO(web): collapse to a single call once `PATCH /brands/{id}/connections`
 * is exposed by the client. The two-write form below is correct but not atomic.
 */
export function useMoveConnectionGroup(): UseMutationResult<
  void,
  ApiError,
  {
    readonly connectionId: string;
    readonly fromGroupId: string | null;
    readonly toGroupId: string | null;
    readonly groups: readonly CustomerGroup[];
  }
> {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: async ({ connectionId, fromGroupId, toGroupId, groups }) => {
      const find = (id: string | null): CustomerGroup | undefined =>
        id === null ? undefined : groups.find((group) => group.id === id);

      // `update` is typed for the rename case today. The membership payload is
      // what the REST surface documents, so it is sent through a widened
      // signature rather than modelled as a rename.
      const update = api.brands.update as unknown as (
        brandId: string,
        input: { connectionIds: readonly string[] },
      ) => Promise<unknown>;

      const source = find(fromGroupId);
      if (source) {
        await update(source.id, {
          connectionIds: source.connectionIds.filter((id) => id !== connectionId),
        });
      }

      const destination = find(toGroupId);
      if (destination && !destination.connectionIds.includes(connectionId)) {
        await update(destination.id, {
          connectionIds: [...destination.connectionIds, connectionId],
        });
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: keys.brands(workspaceId) });
      void queryClient.invalidateQueries({ queryKey: ['ws', workspaceId, 'connections'] });
      void queryClient.invalidateQueries({ queryKey: ['ws', workspaceId, 'calendar'] });
    },
  });
}

/** Widen a `ConnectionView` to the row shape without inventing any field. */
export function toConnectionRow(view: ConnectionView): ConnectionRow {
  return view as ConnectionRow;
}
