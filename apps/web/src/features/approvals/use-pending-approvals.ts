'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { Paginated } from '@relay/contracts';

import { useWorkspaceId } from '@/lib/auth/session-context';
import { api } from '@/lib/api/client';
import type { ApiError } from '@/lib/api/error';
import { keys } from '@/lib/api/keys';
import type { ApprovalRequestView } from '@/lib/api/types';

/** How many requests the index shows before saying more are waiting. */
export const APPROVALS_INDEX_PAGE_SIZE = 50;

/**
 * The approvals waiting on the signed-in person, from `GET /approvals/pending`.
 * Shares the key the decision mutation invalidates, so a decision made on the
 * review screen drops the row here without a manual refresh.
 */
export function usePendingApprovals(): UseQueryResult<Paginated<ApprovalRequestView>, ApiError> {
  const workspaceId = useWorkspaceId();
  return useQuery({
    queryKey: keys.approvalsPending(workspaceId),
    queryFn: () => api.approvals.listPending({ limit: APPROVALS_INDEX_PAGE_SIZE }),
  });
}
