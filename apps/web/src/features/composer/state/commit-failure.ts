/**
 * What to show when a commit did not go through.
 *
 * A failed publish used to reach a screen-reader live region and nothing else:
 * the spinner stopped, the sheet stayed open, and a sighted user was told
 * nothing at all. This turns the thrown error into the three things a visible
 * failure needs — what did not happen, why, and the reference support can look
 * up — so the sheet, the toast and any future surface all say the same thing.
 */

import { ApiError } from '@/lib/api';

export type CommitIntent = 'draft' | 'approval' | 'schedule' | 'publish';

/**
 * Each title names the thing that did not happen. Publishing says "did not
 * finish" rather than "was not published", because a publish that failed part
 * way may still have reached some accounts, and claiming otherwise would be the
 * same class of lie as claiming success.
 */
export const COMMIT_FAILURE_TITLE_KEY = {
  draft: 'composerWeb.commitFailed.draft',
  approval: 'composerWeb.commitFailed.approval',
  schedule: 'composerWeb.commitFailed.schedule',
  publish: 'composerWeb.commitFailed.publish',
} as const satisfies Record<CommitIntent, string>;

export interface CommitFailure {
  readonly intent: CommitIntent;
  readonly titleKey: (typeof COMMIT_FAILURE_TITLE_KEY)[CommitIntent];
  /** The user-safe sentence. Never a provider payload or an internal id. */
  readonly messageKey: string;
  /** What to do next. `error.<code>.action` always exists in the catalog. */
  readonly actionKey: string;
  readonly values: Readonly<Record<string, string | number>>;
  readonly correlationId: string | null;
}

export function describeCommitFailure(intent: CommitIntent, error: unknown): CommitFailure {
  const apiError = ApiError.fromUnknown(error, null);
  return {
    intent,
    titleKey: COMMIT_FAILURE_TITLE_KEY[intent],
    messageKey: apiError.messageKey,
    actionKey: apiError.actionKey,
    values: apiError.messageValues,
    correlationId: apiError.correlationId,
  };
}
