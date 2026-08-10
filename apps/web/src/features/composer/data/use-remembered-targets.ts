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
  brandId: string | null,
): UseQueryResult<RememberedTargetsView | null, ApiError> {
  const workspaceId = useWorkspaceId();
  return useQuery({
    queryKey: keys.rememberedTargets(workspaceId, brandId ?? 'none'),
    queryFn: () => (brandId === null ? Promise.resolve(null) : api.targetMemory.read(brandId)),
    enabled: brandId !== null,
    // Read once when the composer opens. Re-reading mid-edit could change the
    // selection under somebody's cursor, which is worse than a stale notice.
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export interface RememberTargetsInput {
  readonly brandId: string;
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
      api.targetMemory.remember(input.brandId, input.connectionIds),
    onSuccess: (_result, input) => {
      void queryClient.invalidateQueries({
        queryKey: keys.rememberedTargets(workspaceId, input.brandId),
      });
    },
  });
}

/** Forget this person's selection. Always available, opted in or not. */
export function useForgetTargets(): UseMutationResult<void, ApiError, string> {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  return useMutation({
    mutationFn: (brandId: string) => api.targetMemory.forget(brandId),
    onSuccess: (_result, brandId) => {
      void queryClient.invalidateQueries({
        queryKey: keys.rememberedTargets(workspaceId, brandId),
      });
    },
  });
}
