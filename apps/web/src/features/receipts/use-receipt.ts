'use client';

/**
 * Post and receipt data access.
 *
 * The page composes the content item, the accepted publish job, the receipt
 * summaries and the full immutable receipt. They arrive separately, so this
 * query keeps them on one cache key and polls only while a known job can still
 * produce evidence.
 *
 * There is no optimistic update anywhere in this file. Everything here either
 * describes something that already happened externally or triggers something
 * that will, and neither is safe to guess at.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { api, keys, type ApiError } from '@/lib/api';
import { useSession, useWorkspaceId } from '@/lib/auth/session-context';
import type { PublicationReceipt, ReceiptSummaryView } from '@/lib/api/types';
import type { PostDetail, PublishJob } from './types';

/** How many recent receipts to scan for this content item's targets. */
const RECEIPT_SCAN_LIMIT = 100;
const POST_DETAIL_POLL_MS = 2_000;

const FINISHED_WITHOUT_RECEIPT = new Set(['failed_permanently', 'canceled', 'deleted_externally']);

/** Keep a newly accepted job live until evidence arrives or the job stops. */
export function shouldPollPostDetail(
  detail:
    | { readonly receipt: unknown | null; readonly job: Pick<PublishJob, 'state'> | null }
    | undefined,
): boolean {
  if (!detail || detail.receipt !== null || detail.job === null) {
    return false;
  }
  return !FINISHED_WITHOUT_RECEIPT.has(detail.job.state);
}

/**
 * The content item plus its receipt summaries.
 *
 * The summaries come from the recent receipts list filtered to this item,
 * because a content item does not carry its publish job id. When the job-scoped
 * read becomes reachable from a content item this collapses to one call.
 *
 * TODO(web): switch to `api.receipts.listForJob` once `ContentItemView`
 * carries `publishJobId`.
 */
export function usePostDetail(
  contentItemId: string,
  publishJobId: string | null,
): UseQueryResult<PostDetail, ApiError> {
  const workspaceId = useWorkspaceId();
  const { workspace } = useSession();

  return useQuery({
    // This cannot share `keys.contentItem`: that cache contains a
    // `ContentItemView`, while this query returns the larger `PostDetail`.
    // Sharing the key made navigation order decide which shape a screen read.
    queryKey: keys.postDetail(workspaceId, contentItemId, publishJobId),
    staleTime: 15_000,
    refetchInterval: (query) =>
      shouldPollPostDetail(query.state.data) ? POST_DETAIL_POLL_MS : false,
    queryFn: async (): Promise<PostDetail> => {
      const [item, recent, requestedJob] = await Promise.all([
        api.content.get(contentItemId),
        api.receipts.listRecent({ limit: RECEIPT_SCAN_LIMIT }),
        publishJobId === null ? Promise.resolve(null) : api.publishing.getJob(publishJobId),
      ]);

      const summaries = recent.data.filter((summary) => summary.contentItemId === contentItemId);
      const primary = pickPrimarySummary(summaries);
      const receipt = primary ? await api.receipts.get(primary.receiptId) : null;
      const job = requestedJob?.contentItemId === contentItemId ? requestedJob : null;

      return {
        item,
        receiptSummaries: summaries,
        receipt,
        job,
        viewerRole: workspace.role,
        approverName: null,
      };
    },
  });
}

/**
 * Which target's full receipt to open first.
 *
 * A failure, if there is one, because that is what somebody came to read. A
 * receipt page that opens on the target that worked buries the problem.
 */
export function pickPrimarySummary(
  summaries: readonly ReceiptSummaryView[],
): ReceiptSummaryView | null {
  if (summaries.length === 0) return null;
  return (
    summaries.find((summary) => summary.failedItemCount > 0) ??
    summaries.find((summary) => summary.state !== 'published') ??
    summaries[0] ??
    null
  );
}

/** The full immutable record for one receipt. */
export function useReceipt(
  receiptId: string | null,
): UseQueryResult<PublicationReceipt | null, ApiError> {
  const workspaceId = useWorkspaceId();
  return useQuery({
    queryKey: keys.receipt(workspaceId, receiptId ?? 'none'),
    enabled: receiptId !== null,
    // A receipt is immutable. Once read it never needs refetching.
    staleTime: Infinity,
    queryFn: () => api.receipts.get(receiptId as string),
  });
}

export interface RetryTargetInput {
  readonly publishJobId: string;
  readonly variantId: string;
}

/**
 * Retry one failed target.
 *
 * Scoped to a single variant on purpose. A retry that re-ran the whole
 * campaign would publish a second copy to the accounts that already succeeded,
 * which is the exact failure mode partial publication exists to avoid. The
 * idempotency key is derived rather than random, so a double click cannot turn
 * one retry into two external posts.
 */
export function useRetryTarget(): UseMutationResult<unknown, ApiError, RetryTargetInput> {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: (input: RetryTargetInput) =>
      api.publishing.retryTarget(
        input.publishJobId,
        input.variantId,
        retryIdempotencyKey(input.publishJobId, input.variantId),
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ws', workspaceId, 'content'] });
      void queryClient.invalidateQueries({ queryKey: keys.receipts(workspaceId) });
    },
  });
}

export function retryIdempotencyKey(publishJobId: string, variantId: string): string {
  return `retry.${publishJobId}.${variantId}`;
}
