import type { PublishState } from '@relay/contracts';

import type { ActorContext, ServiceDeps } from '../types';
import type { ContentPublicationTargetView, ContentPublicationView } from '../views';

import { isFinalTargetState, latestJobPerTarget } from '../internal/content-lifecycle';
import { notFound } from '../internal/errors';
import { PUBLISH_JOB_SELECT, jobToView } from '../internal/publish-path';
import { authorized, type Db } from '../internal/runtime';

/**
 * `GET /v1/content/:id/publication`: one read for "where did this post go".
 *
 * Per target: the latest job, its receipt and permalink when it went out, and
 * its failure code when it did not. It replaces scanning the last hundred
 * workspace receipts for the ones that happen to belong to this item, which
 * silently missed any target published before the newest hundred.
 */

const RETRYABLE: ReadonlySet<PublishState> = new Set<PublishState>([
  'action_required',
  'failed_permanently',
]);

const JOB_SELECT = {
  ...PUBLISH_JOB_SELECT,
  connection: {
    select: { provider: true, handle: true, displayName: true },
  },
  receipt: {
    select: { id: true, externalPostId: true, permalink: true, publishedAt: true },
  },
} as const;

async function creatorName(
  db: Db,
  workspaceId: string,
  userId: string | null,
): Promise<string | null> {
  if (userId === null) return null;
  const membership = await db.membership.findFirst({
    where: { workspaceId, userId },
    select: { user: { select: { displayName: true } } },
  });
  const name = membership?.user.displayName.trim() ?? '';
  return name.length === 0 ? null : name;
}

export async function readContentPublication(
  deps: ServiceDeps,
  ctx: ActorContext,
  contentItemId: string,
): Promise<ContentPublicationView> {
  return authorized(deps, ctx, 'receipt.read', undefined, async (db) => {
    const item = await db.contentItem.findFirst({
      where: { id: contentItemId },
      select: { id: true, state: true, createdByUserId: true },
    });
    if (item === null) {
      throw notFound('content_item', contentItemId);
    }

    const rows = await db.publishJob.findMany({
      where: { contentItemId, commentThreadItemId: null },
      orderBy: { createdAt: 'asc' },
      select: JOB_SELECT,
    });

    const counts = new Map<string, number>();
    for (const row of rows) {
      const key = `${row.contentVersionId}:${row.postVariantId ?? row.id}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    const targets: ContentPublicationTargetView[] = latestJobPerTarget(rows).map((row) => {
      const job = jobToView(row);
      const receipt = row.receipt;
      return {
        postVariantId: row.postVariantId,
        connectionId: row.connectionId,
        provider: job.provider,
        accountLabel: row.connection.handle ?? row.connection.displayName,
        job,
        jobCount: counts.get(`${row.contentVersionId}:${row.postVariantId ?? row.id}`) ?? 1,
        final: isFinalTargetState(job.state),
        retryable: receipt === null && RETRYABLE.has(job.state) && row.postVariantId !== null,
        receiptId: receipt?.id ?? null,
        externalPostId: receipt?.externalPostId ?? null,
        permalink: receipt?.permalink ?? null,
        publishedAt: receipt?.publishedAt?.toISOString() ?? null,
        failureCode: receipt === null ? job.lastErrorCode : null,
      };
    });

    return {
      contentItemId: item.id,
      state: item.state as PublishState,
      settled: targets.length > 0 && targets.every((target) => target.final),
      createdByName: await creatorName(db, ctx.workspaceId, item.createdByUserId),
      targets,
    };
  });
}
