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
import type { ContentPublication, PostDetail, PublishJob } from './types';

/** Only used in demo mode, where there is no publication read model. */
const RECEIPT_SCAN_LIMIT = 100;
/** Poll backoff: fast right after a publish, slower while a provider works. */
const POLL_BASE_MS = 2_000;
const POLL_MAX_MS = 15_000;

const FINISHED_WITHOUT_RECEIPT = new Set(['failed_permanently', 'canceled', 'deleted_externally']);

/**
 * Keep the page live until every target has reached a final state.
 *
 * With the publication read model that is its own `settled` flag. Without it
 * (demo mode) the older rule stands: poll a known job until evidence arrives
 * or the job stops.
 */
export function shouldPollPostDetail(
  detail:
    | {
        readonly receipt: unknown | null;
        readonly job: Pick<PublishJob, 'state'> | null;
        readonly publication?: Pick<ContentPublication, 'settled' | 'targets'> | null;
      }
    | undefined,
): boolean {
  if (!detail) return false;
  const publication = detail.publication ?? null;
  if (publication !== null && publication.targets.length > 0) {
    return !publication.settled;
  }
  if (detail.receipt !== null || detail.job === null) {
    return false;
  }
  return !FINISHED_WITHOUT_RECEIPT.has(detail.job.state);
}

/** 2s, 3s, 4.5s and so on, capped at 15s. */
export function pollDelayMs(pollsSoFar: number): number {
  const delay = POLL_BASE_MS * Math.pow(1.5, Math.max(0, pollsSoFar));
  return Math.min(POLL_MAX_MS, Math.round(delay));
}

/**
 * The content item plus where each of its targets stands.
 *
 * One read, `GET /v1/content/:id/publication`, answers per target: the latest
 * job, the receipt and permalink, the failure. It polls with backoff until
 * every target is final, and the workspace event stream invalidates it sooner
 * when a job moves.
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
      shouldPollPostDetail(query.state.data) ? pollDelayMs(query.state.dataUpdateCount - 1) : false,
    queryFn: async (): Promise<PostDetail> => {
      const [item, publication, requestedJob] = await Promise.all([
        api.content.get(contentItemId),
        api.publishing.getContentPublication(contentItemId),
        publishJobId === null ? Promise.resolve(null) : api.publishing.getJob(publishJobId),
      ]);

      const summaries =
        publication === null
          ? (await api.receipts.listRecent({ limit: RECEIPT_SCAN_LIMIT })).data.filter(
              (summary) => summary.contentItemId === contentItemId,
            )
          : [];
      const primaryReceiptId =
        publication === null
          ? (pickPrimarySummary(summaries)?.receiptId ?? null)
          : pickPrimaryReceiptId(publication);
      const receipt = primaryReceiptId === null ? null : await api.receipts.get(primaryReceiptId);
      const job =
        requestedJob?.contentItemId === contentItemId
          ? requestedJob
          : (publication?.targets[0]?.job ?? null);

      return {
        item,
        receiptSummaries: summaries,
        receipt,
        job,
        publication,
        createdByName: publication?.createdByName ?? null,
        viewerRole: workspace.role,
        approverName: null,
      };
    },
  });
}

/**
 * Which receipt to open first from the read model: a target that went out
 * with trouble, then any target that went out. A failed target has no
 * receipt, and it is named in the partial-success panel instead.
 */
export function pickPrimaryReceiptId(publication: ContentPublication): string | null {
  const withReceipt = publication.targets.filter((target) => target.receiptId !== null);
  return withReceipt[0]?.receiptId ?? null;
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
      void queryClient.invalidateQueries({ queryKey: ['ws', workspaceId, 'post-detail'] });
      void queryClient.invalidateQueries({ queryKey: keys.receipts(workspaceId) });
    },
  });
}

export function retryIdempotencyKey(publishJobId: string, variantId: string): string {
  return `retry.${publishJobId}.${variantId}`;
}
