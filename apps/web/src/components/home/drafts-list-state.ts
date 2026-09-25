/**
 * Which of the seven designed states the "Continue drafting" list is in.
 *
 * Pure so it can be tested without rendering. Order matters: rows the user has
 * already seen stay on screen whatever the refresh did (partial), and a
 * failed first read is classified by why it failed, because "ask an owner",
 * "wait a minute" and "reconnect" are three different next steps.
 */

export type DraftsListState =
  | 'loading'
  | 'empty'
  | 'ready'
  | 'partial'
  | 'offline'
  | 'denied'
  | 'rateLimited'
  | 'error';

export interface DraftsErrorShape {
  readonly isOffline: boolean;
  readonly isAuthorization: boolean;
  readonly isRateLimited: boolean;
}

export interface DraftsListInput {
  readonly isPending: boolean;
  readonly hasData: boolean;
  readonly rowCount: number;
  /** The last read's error, or null. `apiError` is set when it was an ApiError. */
  readonly failed: boolean;
  readonly apiError: DraftsErrorShape | null;
  readonly online: boolean;
}

export function draftsListState(input: DraftsListInput): DraftsListState {
  if (input.hasData) {
    if (input.failed || !input.online) return 'partial';
    return input.rowCount === 0 ? 'empty' : 'ready';
  }
  if (!input.online || input.apiError?.isOffline === true) return 'offline';
  if (input.isPending) return 'loading';
  if (!input.failed) return 'loading';
  if (input.apiError?.isAuthorization === true) return 'denied';
  if (input.apiError?.isRateLimited === true) return 'rateLimited';
  return 'error';
}
