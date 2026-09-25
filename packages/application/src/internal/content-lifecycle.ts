import type { PublishState } from '@relay/contracts';

import type { Db } from './runtime';

/**
 * The content item lifecycle after publishing.
 *
 * A content item is published through one job per target. When every target's
 * latest job has reached a final state the item itself settles: `published`
 * when every target went out, `partially_published` when some did, and
 * `failed_permanently` when none did. Until then it is left exactly where the
 * publish path put it. Settling is what lets the editing and delete guards in
 * the content service see that something is live.
 */

/** A target's job has stopped moving. A retry would be a new job. */
const FINAL: ReadonlySet<PublishState> = new Set<PublishState>([
  'published',
  'partially_published',
  'deleted_externally',
  'failed_permanently',
  'action_required',
  'validation_needed',
  'canceled',
]);

const WENT_OUT: ReadonlySet<PublishState> = new Set<PublishState>([
  'published',
  'partially_published',
  'deleted_externally',
]);

export function isFinalTargetState(state: PublishState): boolean {
  return FINAL.has(state);
}

export function wentOut(state: PublishState): boolean {
  return WENT_OUT.has(state);
}

/**
 * The settled item state, or null while any target is still moving or when
 * nothing was attempted at all (every target canceled leaves the item alone).
 */
export function settleContentState(
  latestTargetStates: readonly PublishState[],
): Extract<PublishState, 'published' | 'partially_published' | 'failed_permanently'> | null {
  const attempted = latestTargetStates.filter((state) => state !== 'canceled');
  if (attempted.length === 0) return null;
  if (attempted.some((state) => !FINAL.has(state))) return null;
  const out = attempted.filter((state) => WENT_OUT.has(state)).length;
  if (out === attempted.length) return 'published';
  if (out > 0) return 'partially_published';
  return 'failed_permanently';
}

export interface TargetJobRow {
  readonly id: string;
  readonly postVariantId: string | null;
  readonly contentVersionId: string;
  readonly state: string;
  readonly createdAt: Date;
}

/**
 * The latest job per target, for the version most recently sent.
 *
 * Jobs of an older version (an edit, then a new schedule) describe a post that
 * was never sent as it now reads, so only the newest version's jobs count. A
 * retry is a later job for the same variant, so it replaces the failure it
 * retried rather than sitting beside it.
 */
export function latestJobPerTarget<T extends TargetJobRow>(rows: readonly T[]): T[] {
  const ordered = [...rows].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  const newest = ordered.at(-1);
  if (newest === undefined) return [];
  const byTarget = new Map<string, T>();
  for (const row of ordered) {
    if (row.contentVersionId !== newest.contentVersionId) continue;
    byTarget.set(row.postVariantId ?? row.id, row);
  }
  return [...byTarget.values()];
}

/**
 * Settle one content item from its jobs. Idempotent: running it twice, or for
 * a job that is not the last to finish, writes nothing new.
 */
export async function settleContentItem(
  db: Db,
  input: { readonly workspaceId: string; readonly contentItemId: string },
): Promise<PublishState | null> {
  const rows = await db.publishJob.findMany({
    where: {
      workspaceId: input.workspaceId,
      contentItemId: input.contentItemId,
      commentThreadItemId: null,
    },
    select: {
      id: true,
      postVariantId: true,
      contentVersionId: true,
      state: true,
      createdAt: true,
    },
  });
  const settled = settleContentState(
    latestJobPerTarget(rows).map((row) => row.state as PublishState),
  );
  if (settled === null) return null;
  await db.contentItem.updateMany({
    where: {
      id: input.contentItemId,
      workspaceId: input.workspaceId,
      state: { not: settled },
    },
    data: { state: settled },
  });
  return settled;
}
