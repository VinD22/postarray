'use client';

/**
 * Posting Set data access.
 *
 * No write here is optimistic. A Set decides which accounts a future post goes
 * to, and showing an account as saved before the server agreed would leave a
 * person building their next campaign on a list that does not exist.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import type {
  Paginated,
  PostingSetInput,
  PostingSetPatch,
  PostingSetView,
  SlotProposal,
} from '@relay/contracts';

import { api, newIdempotencyKey, type ApiError } from '@/lib/api';
import { keys } from '@/lib/api/keys';
import { useWorkspaceId } from '@/lib/auth/session-context';

export function usePostingSets(
  filter: { projectId?: string; includeArchived?: boolean } = {},
): UseQueryResult<Paginated<PostingSetView>, ApiError> {
  const workspaceId = useWorkspaceId();
  return useQuery({
    queryKey: keys.postingSets(workspaceId, filter),
    queryFn: () => api.postingSets.list(filter),
  });
}

/**
 * The instant this project's queue would offer next.
 *
 * Read from the queue rules service rather than recomputed here. A Set that
 * says "next free slot" means the project's own queue rules, and duplicating
 * slot arithmetic in the browser would eventually disagree with the server
 * about which hour is free.
 */
export function useNextQueueSlot(
  projectId: string | null,
): UseQueryResult<SlotProposal | { instant: string; ianaTimeZone: string } | null, ApiError> {
  const workspaceId = useWorkspaceId();
  return useQuery({
    queryKey: [...keys.postingSets(workspaceId, {}), 'next-slot', projectId ?? 'none'],
    queryFn: () =>
      projectId === null ? Promise.resolve(null) : api.scheduling.nextAvailableSlot({ projectId }),
    enabled: projectId !== null,
  });
}

function useInvalidateSets(): () => void {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  return () => {
    void queryClient.invalidateQueries({ queryKey: ['ws', workspaceId, 'posting-sets'] });
  };
}

export function useCreatePostingSet(): UseMutationResult<
  PostingSetView,
  ApiError,
  PostingSetInput
> {
  const invalidate = useInvalidateSets();
  return useMutation({
    mutationFn: (input: PostingSetInput) => api.postingSets.create(input, newIdempotencyKey('set')),
    onSuccess: invalidate,
  });
}

export interface UpdatePostingSetInput {
  readonly setId: string;
  readonly patch: PostingSetPatch;
}

export function useUpdatePostingSet(): UseMutationResult<
  PostingSetView,
  ApiError,
  UpdatePostingSetInput
> {
  const invalidate = useInvalidateSets();
  return useMutation({
    mutationFn: (input: UpdatePostingSetInput) =>
      api.postingSets.update(input.setId, input.patch, newIdempotencyKey('set')),
    onSuccess: invalidate,
  });
}

export function useArchivePostingSet(): UseMutationResult<PostingSetView, ApiError, string> {
  const invalidate = useInvalidateSets();
  return useMutation({
    mutationFn: (setId: string) => api.postingSets.archive(setId),
    onSuccess: invalidate,
  });
}
