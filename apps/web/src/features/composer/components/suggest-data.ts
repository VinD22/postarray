'use client';

/**
 * The composer's Suggest, Review and posting time calls.
 *
 * Thin: every call goes to `/v1/suggestions/*`, the same use case the CLI and
 * the MCP tools reach. Suggest, Review and posting time are reads that change
 * nothing, so they are marked side-effect free. Accepting a suggestion records
 * provenance on the server and carries an idempotency key.
 *
 * The review result is kept in the query cache under a key the validation
 * panel also reads, which is how Review findings join the readiness checklist
 * without a second store.
 */

import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import type {
  AcceptedSuggestionView,
  BestTimeView,
  ReviewView,
  SuggestionKind,
  SuggestionTone,
  SuggestionView,
} from '@relay/application';

import { newIdempotencyKey, request, type ApiError } from '@/lib/api';
import { useWorkspaceId } from '@/lib/auth/session-context';

export type {
  AcceptedSuggestionView,
  BestTimeView,
  ReviewCheckView,
  ReviewView,
  SuggestionKind,
  SuggestionProposal,
  SuggestionTone,
  SuggestionView,
} from '@relay/application';

export interface SuggestInput {
  readonly kind: SuggestionKind;
  readonly body?: string;
  readonly brief?: string;
  readonly contentItemId?: string;
  readonly connectionId?: string;
  readonly tone?: SuggestionTone;
  readonly targetLanguage?: string;
  readonly mediaIds?: readonly string[];
}

export function useSuggest(): UseMutationResult<SuggestionView, ApiError, SuggestInput> {
  return useMutation({
    mutationFn: (input: SuggestInput) =>
      request<SuggestionView>('/v1/suggestions', {
        method: 'POST',
        body: input,
        sideEffectFree: true,
      }),
  });
}

export interface AcceptInput {
  readonly suggestionId: string;
  readonly proposalIndex: number;
  readonly contentItemId?: string;
  readonly connectionId?: string;
}

export function useAcceptSuggestion(): UseMutationResult<
  AcceptedSuggestionView,
  ApiError,
  AcceptInput
> {
  return useMutation({
    mutationFn: (input: AcceptInput) =>
      request<AcceptedSuggestionView>('/v1/suggestions/acceptances', {
        method: 'POST',
        body: input,
        idempotencyKey: newIdempotencyKey('suggest-accept'),
      }),
  });
}

const REVIEW_MUTATION_KEY = ['composer-suggest-review-run'] as const;

/** One cache slot per draft. The validation panel reads the same slot. */
export function reviewKey(workspaceId: string, draftId: string): readonly unknown[] {
  return ['composer-suggest-review', workspaceId, draftId];
}

export interface ReviewInput {
  readonly draftId: string;
  readonly body: string;
  readonly contentItemId?: string;
  readonly mediaIds?: readonly string[];
  readonly altTextPresent?: boolean;
}

export function useRunReview(): UseMutationResult<ReviewView, ApiError, ReviewInput> {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  return useMutation({
    mutationKey: REVIEW_MUTATION_KEY,
    mutationFn: ({ draftId: _draftId, ...body }: ReviewInput) =>
      request<ReviewView>('/v1/suggestions/reviews', {
        method: 'POST',
        body,
        sideEffectFree: true,
      }),
    onSuccess: (result, input) => {
      queryClient.setQueryData(reviewKey(workspaceId, input.draftId), result);
    },
    // A review that did not run is recorded as three checks that could not
    // run, so the checklist says so instead of keeping an older green result.
    onError: (_error, input) => {
      const failed: ReviewView = {
        overall: 'unavailable',
        checks: (['claims', 'accessibility', 'duplicates'] as const).map((check) => ({
          check,
          status: 'unavailable' as const,
          findings: [],
          reasonKey: 'web.suggest.review.error',
          provenance: null,
        })),
      };
      queryClient.setQueryData(reviewKey(workspaceId, input.draftId), failed);
    },
  });
}

/** True while any Review for this workspace is running. */
export function useReviewRunning(): boolean {
  return useIsMutating({ mutationKey: REVIEW_MUTATION_KEY }) > 0;
}

/** The last Review for this draft, if one ran in this session. Never fetches. */
export function useLastReview(draftId: string): ReviewView | null {
  const workspaceId = useWorkspaceId();
  const result = useQuery<ReviewView | null>({
    queryKey: reviewKey(workspaceId, draftId),
    queryFn: () => Promise.resolve(null),
    enabled: false,
    staleTime: Number.POSITIVE_INFINITY,
  });
  return result.data ?? null;
}

export function useBestTime(connectionId: string | null): UseQueryResult<BestTimeView, ApiError> {
  const workspaceId = useWorkspaceId();
  return useQuery({
    queryKey: ['composer-suggest-best-time', workspaceId, connectionId ?? 'none'],
    queryFn: () =>
      request<BestTimeView>('/v1/suggestions/best-times', {
        method: 'POST',
        body: { connectionId },
        sideEffectFree: true,
      }),
    enabled: connectionId !== null,
    staleTime: 60 * 60 * 1000,
    retry: false,
  });
}
