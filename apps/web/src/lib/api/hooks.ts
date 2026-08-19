'use client';

/**
 * TanStack Query hooks.
 *
 * Reads are queries. Writes are mutations, and an optimistic update is used
 * only where a rollback is genuinely safe: renaming, snoozing, pausing. Nothing
 * that publishes, schedules, cancels or approves is ever optimistic, because
 * the truth about an external side effect lives on the server.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import { useSession, useWorkspaceId } from '@/lib/auth/session-context';

import { api } from './client';
import { newIdempotencyKey } from './correlation';
import { ApiError } from './error';
import { keys } from './keys';
import type {
  ActionItemCategory,
  ActionItemView,
  ApprovalRequestView,
  BillingStateView,
  CalendarEntryView,
  ConnectionView,
  ContentItemView,
  GrowthPlanSummaryView,
  HealthView,
  MemberView,
  Paginated,
  ProviderId,
  PublishState,
  ReceiptSummaryView,
} from './types';

/* -------------------------------------------------------------------------
   Reads
   ------------------------------------------------------------------------- */

export function useConnections(
  filter: { projectId?: string; provider?: ProviderId } = {},
): UseQueryResult<Paginated<ConnectionView>, ApiError> {
  const workspaceId = useWorkspaceId();
  return useQuery({
    queryKey: keys.connections(workspaceId, filter),
    queryFn: () => api.connections.list(filter),
  });
}

export function useAvailableProviders(): UseQueryResult<readonly ProviderId[], ApiError> {
  const workspaceId = useWorkspaceId();
  return useQuery({
    queryKey: [...keys.connections(workspaceId, {}), 'available-providers'],
    queryFn: () => api.connections.listAvailableProviders(),
    staleTime: 5 * 60_000,
  });
}

export function useConnection(connectionId: string): UseQueryResult<ConnectionView, ApiError> {
  const workspaceId = useWorkspaceId();
  return useQuery({
    queryKey: keys.connection(workspaceId, connectionId),
    queryFn: () => api.connections.get(connectionId),
  });
}

export function useActionCenter(
  filter: { category?: ActionItemCategory; includeSnoozed?: boolean } = {},
): UseQueryResult<Paginated<ActionItemView>, ApiError> {
  const workspaceId = useWorkspaceId();
  return useQuery({
    queryKey: keys.actionCenter(workspaceId, filter),
    queryFn: () => api.actionCenter.list(filter),
    // The queue is the reason someone opens Home. Keep it close to live.
    staleTime: 15_000,
    refetchInterval: 60_000,
  });
}

export function useCalendar(range: {
  from: string;
  to: string;
  projectId?: string;
  state?: PublishState;
}): UseQueryResult<Paginated<CalendarEntryView>, ApiError> {
  const { workspace } = useSession();
  const workspaceId = workspace.id;
  return useQuery({
    queryKey: keys.calendar(workspaceId, range),
    queryFn: () => api.scheduling.getCalendar({ ...range, ianaTimeZone: workspace.timeZone }),
  });
}

export function useRecentReceipts(
  limit = 5,
): UseQueryResult<Paginated<ReceiptSummaryView>, ApiError> {
  const workspaceId = useWorkspaceId();
  return useQuery({
    queryKey: [...keys.receipts(workspaceId), limit],
    queryFn: () => api.receipts.listRecent({ limit }),
  });
}

export function useApprovalRequest(
  approvalId: string,
): UseQueryResult<ApprovalRequestView | null, ApiError> {
  const workspaceId = useWorkspaceId();
  return useQuery({
    queryKey: keys.approval(workspaceId, approvalId),
    queryFn: async () => {
      try {
        return await api.approvals.get(approvalId);
      } catch (error) {
        if (ApiError.is(error) && error.status === 404) return null;
        throw error;
      }
    },
  });
}

export function useContentItem(
  contentItemId: string | null,
): UseQueryResult<ContentItemView, ApiError> {
  const workspaceId = useWorkspaceId();
  return useQuery({
    queryKey: keys.contentItem(workspaceId, contentItemId ?? 'pending'),
    queryFn: () => api.content.get(contentItemId ?? ''),
    enabled: contentItemId !== null,
  });
}

export function useGrowthPlanSummary(): UseQueryResult<GrowthPlanSummaryView, ApiError> {
  const workspaceId = useWorkspaceId();
  return useQuery({
    queryKey: keys.growthPlanSummary(workspaceId),
    queryFn: () => api.growth.getPlanSummary(),
  });
}

export function useBillingState(): UseQueryResult<BillingStateView, ApiError> {
  const workspaceId = useWorkspaceId();
  return useQuery({
    queryKey: keys.billing(workspaceId),
    queryFn: () => api.billing.getState(),
    staleTime: 5 * 60_000,
  });
}

export function useMembers(): UseQueryResult<Paginated<MemberView>, ApiError> {
  const workspaceId = useWorkspaceId();
  return useQuery({
    queryKey: keys.members(workspaceId),
    queryFn: () => api.members.list(),
  });
}

export function useHealth(): UseQueryResult<HealthView, ApiError> {
  return useQuery({
    queryKey: keys.health(),
    queryFn: () => api.health.get(),
    staleTime: 60_000,
  });
}

/* -------------------------------------------------------------------------
   Writes
   ------------------------------------------------------------------------- */

/**
 * Snoozing is the one Action center write that is optimistic: hiding a row and
 * putting it back on failure loses nothing.
 */
export function useSnoozeActionItem(): UseMutationResult<
  unknown,
  ApiError,
  { itemId: string; until: string }
> {
  const workspaceId = useWorkspaceId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, until }) =>
      api.actionCenter.snooze(itemId, { until }, newIdempotencyKey('snooze')),
    onMutate: async ({ itemId, until }) => {
      const queryKey = keys.actionCenter(workspaceId, {});
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Paginated<ActionItemView>>(queryKey);
      if (previous) {
        queryClient.setQueryData<Paginated<ActionItemView>>(queryKey, {
          ...previous,
          data: previous.data.map((item) =>
            item.id === itemId ? { ...item, snoozedUntil: until } : item,
          ),
        });
      }
      return { previous, queryKey };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.queryKey, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['ws', workspaceId, 'action-center'] });
    },
  });
}

/**
 * Pausing a connection stops future dispatches. It is not optimistic: the user
 * must see the server confirm it before trusting that nothing will publish.
 */
export function usePauseConnection(): UseMutationResult<ConnectionView, ApiError, string> {
  const workspaceId = useWorkspaceId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (connectionId) =>
      api.connections.pause(connectionId, newIdempotencyKey('conn_pause')),
    onSuccess: (_data, connectionId) => {
      void queryClient.invalidateQueries({ queryKey: keys.connection(workspaceId, connectionId) });
      void queryClient.invalidateQueries({ queryKey: ['ws', workspaceId, 'connections'] });
    },
  });
}

export function useResumeConnection(): UseMutationResult<ConnectionView, ApiError, string> {
  const workspaceId = useWorkspaceId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (connectionId) =>
      api.connections.resume(connectionId, newIdempotencyKey('conn_resume')),
    onSuccess: (_data, connectionId) => {
      void queryClient.invalidateQueries({ queryKey: keys.connection(workspaceId, connectionId) });
      void queryClient.invalidateQueries({ queryKey: ['ws', workspaceId, 'connections'] });
    },
  });
}

export function useDecideApproval(): UseMutationResult<
  ApprovalRequestView,
  ApiError,
  {
    readonly approvalId: string;
    readonly decision: 'approve' | 'request_changes' | 'reject';
    readonly note?: string;
  }
> {
  const workspaceId = useWorkspaceId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ approvalId, decision, note }) =>
      api.approvals.decide(
        approvalId,
        { decision, ...(note === undefined ? {} : { note }) },
        newIdempotencyKey('approval_decision'),
      ),
    onSuccess: (approval) => {
      queryClient.setQueryData(keys.approval(workspaceId, approval.id), approval);
      void queryClient.invalidateQueries({ queryKey: keys.approvalsPending(workspaceId) });
      void queryClient.invalidateQueries({ queryKey: ['ws', workspaceId, 'action-center'] });
      void queryClient.invalidateQueries({
        queryKey: keys.contentItem(workspaceId, approval.contentItemId),
      });
    },
  });
}

/** Start the OAuth handoff for a new connection. */
export function useBeginConnection(): UseMutationResult<
  { authorizationUrl: string; transactionId: string },
  ApiError,
  { provider: ProviderId; projectId: string; returnUrl: string }
> {
  return useMutation({
    mutationFn: (input) => api.connections.beginOAuth(input, newIdempotencyKey('oauth')),
  });
}

/** Invalidate everything one workspace owns. Used by the workspace switcher. */
export function useInvalidateWorkspace(): (workspaceId: string) => void {
  const queryClient = useQueryClient();
  return (workspaceId: string) => {
    void queryClient.invalidateQueries({ queryKey: keys.workspace(workspaceId) });
  };
}
