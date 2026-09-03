'use client';

/**
 * The composer's remembered channel selection.
 *
 * Read on open, written when a post is scheduled. Nothing here stores anything
 * about the draft itself: the write takes a list of channel identifiers and has
 * no parameter for anything else.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { RememberedTargetsView } from '@relay/contracts';

import { api, type ApiError } from '@/lib/api';
import { keys } from '@/lib/api/keys';
import { useWorkspaceId } from '@/lib/auth/session-context';

export function useRememberedTargets(
  projectId: string | null,
): UseQueryResult<RememberedTargetsView | null, ApiError> {
  const workspaceId = useWorkspaceId();
  return useQuery({
    queryKey: keys.rememberedTargets(workspaceId, projectId ?? 'none'),
    queryFn: () => (projectId === null ? Promise.resolve(null) : api.targetMemory.read(projectId)),
    enabled: projectId !== null,
    // Read once when the composer opens. Re-reading mid-edit could change the
    // selection under somebody's cursor, which is worse than a stale notice.
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export interface RememberTargetsInput {
  readonly projectId: string;
  readonly connectionIds: readonly string[];
}

/**
 * Remember this selection.
 *
 * A no-op on the server while the project has not opted in, and the response
 * says so rather than implying a preference was saved. Failure is deliberately
 * not surfaced as an error toast: not remembering a selection is a convenience
 * that did not happen, and interrupting somebody who has just scheduled a post
 * to tell them so would be the wrong trade.
 */
export function useRememberTargets(): UseMutationResult<
  RememberedTargetsView,
  ApiError,
  RememberTargetsInput
> {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  return useMutation({
    mutationFn: (input: RememberTargetsInput) =>
      api.targetMemory.remember(input.projectId, input.connectionIds),
    onSuccess: (_result, input) => {
      void queryClient.invalidateQueries({
        queryKey: keys.rememberedTargets(workspaceId, input.projectId),
      });
    },
  });
}

/**
 * The project opt in, from the composer.
 *
 * The same call the project settings card makes, kept here rather than
 * imported across features so the composer's data layer stays the one place
 * this screen talks to the API. Not optimistic, for the reason that card
 * gives: turning it off deletes every saved selection in the project, and a
 * switch that has moved while the deletion has not would be a lie about
 * somebody else's data.
 */
export function useSetRememberedTargetsEnabled(): UseMutationResult<
  { readonly projectId: string; readonly enabled: boolean },
  ApiError,
  { readonly projectId: string; readonly enabled: boolean }
> {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  return useMutation({
    mutationFn: (input: { projectId: string; enabled: boolean }) =>
      api.targetMemory.setEnabled(input.projectId, input.enabled),
    onSuccess: (_result, input) => {
      void queryClient.invalidateQueries({ queryKey: ['ws', workspaceId, 'projects'] });
      void queryClient.invalidateQueries({
        queryKey: keys.rememberedTargets(workspaceId, input.projectId),
      });
    },
  });
}

/** Forget this person's selection. Always available, opted in or not. */
export function useForgetTargets(): UseMutationResult<void, ApiError, string> {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  return useMutation({
    mutationFn: (projectId: string) => api.targetMemory.forget(projectId),
    onSuccess: (_result, projectId) => {
      void queryClient.invalidateQueries({
        queryKey: keys.rememberedTargets(workspaceId, projectId),
      });
    },
  });
}
