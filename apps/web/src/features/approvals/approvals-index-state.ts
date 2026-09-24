import type { ApiError } from '@/lib/api/error';

/**
 * Which of the seven states the approvals index renders. Pure, so every
 * branch is tested without a DOM.
 */
export type ApprovalsIndexState =
  | 'loading'
  | 'offline'
  | 'permission-denied'
  | 'rate-limited'
  | 'error'
  | 'empty'
  | 'partial'
  | 'ready';

export interface ApprovalsIndexInput {
  readonly isPending: boolean;
  readonly error: Pick<ApiError, 'isOffline' | 'isAuthorization' | 'isRateLimited'> | null;
  readonly count: number;
  readonly hasMore: boolean;
  /** Member names failed to load, so requesters cannot be named. */
  readonly membersFailed: boolean;
}

export function approvalsIndexState(input: ApprovalsIndexInput): ApprovalsIndexState {
  if (input.isPending) return 'loading';
  if (input.error !== null) {
    if (input.error.isOffline) return 'offline';
    if (input.error.isAuthorization) return 'permission-denied';
    if (input.error.isRateLimited) return 'rate-limited';
    return 'error';
  }
  if (input.count === 0) return 'empty';
  if (input.hasMore || input.membersFailed) return 'partial';
  return 'ready';
}
