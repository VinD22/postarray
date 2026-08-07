import type { Paginated } from '@relay/contracts';

import type { ActorContext, PageQuery, ReceiptService, ServiceDeps } from '../types';
import type { PublicationReceiptView, ReceiptSummaryView } from '../views';

import { notFound } from '../internal/errors';
import { fromStoredSurface, toIso, toProviderId } from '../internal/mappers';
import { pageArgs, toPage } from '../internal/pagination';
import { authorized, type Db } from '../internal/runtime';

/**
 * Publication receipts.
 *
 * Immutable evidence that an external post exists: the external id, the
 * permalink, the content checksum, the exact short URLs that appeared, the
 * approval that authorised it and every attempt it took. This is what a user
 * shows a client when they ask whether it really published.
 */

const RECEIPT_SELECT = {
  id: true,
  workspaceId: true,
  publishJobId: true,
  provider: true,
  connectionId: true,
  externalPostId: true,
  permalink: true,
  contentVersionId: true,
  contentHash: true,
  publishedShortLinks: true,
  scheduledFor: true,
  scheduledTimeZone: true,
  dispatchedAt: true,
  publishedAt: true,
  surface: true,
  approvedByUserId: true,
  costActualMinor: true,
  costCurrency: true,
  lastAnalyticsSyncAt: true,
  deletedExternallyAt: true,
  createdAt: true,
  publishJob: {
    select: {
      state: true,
      attempts: {
        orderBy: { attemptNumber: 'asc' },
        select: {
          id: true,
          attemptNumber: true,
          outcome: true,
          errorClass: true,
          errorCode: true,
          httpStatus: true,
          startedAt: true,
          endedAt: true,
        },
      },
      postVariant: {
        select: {
          commentItems: {
            orderBy: { position: 'asc' },
            select: { id: true, position: true, state: true },
          },
        },
      },
    },
  },
} as const;

interface ReceiptRow {
  id: string;
  workspaceId: string;
  publishJobId: string;
  provider: string;
  connectionId: string;
  externalPostId: string;
  permalink: string | null;
  contentVersionId: string;
  contentHash: string;
  publishedShortLinks: string[];
  scheduledFor: Date | null;
  scheduledTimeZone: string | null;
  dispatchedAt: Date | null;
  publishedAt: Date;
  surface: string;
  approvedByUserId: string | null;
  costActualMinor: number | null;
  costCurrency: string | null;
  lastAnalyticsSyncAt: Date | null;
  deletedExternallyAt: Date | null;
  createdAt: Date;
  publishJob: {
    state: string;
    attempts: {
      id: string;
      attemptNumber: number;
      outcome: string;
      errorClass: string | null;
      errorCode: string | null;
      httpStatus: number | null;
      startedAt: Date;
      endedAt: Date | null;
    }[];
    postVariant: {
      commentItems: { id: string; position: number; state: string }[];
    } | null;
  };
}

function toView(row: ReceiptRow): PublicationReceiptView {
  const followUps = row.publishJob.postVariant?.commentItems ?? [];
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    publishJobId: row.publishJobId,
    provider: toProviderId(row.provider),
    connectionId: row.connectionId,
    externalPostId: row.externalPostId,
    permalink: row.permalink,
    contentVersionId: row.contentVersionId,
    contentChecksum: row.contentHash,
    publishedShortLinks: [...row.publishedShortLinks],
    scheduledInstant: toIso(row.scheduledFor),
    ianaTimeZone: row.scheduledTimeZone,
    dispatchedAt: toIso(row.dispatchedAt),
    publishedAt: row.publishedAt.toISOString(),
    creationSurface: fromStoredSurface(row.surface),
    approvedByUserId: row.approvedByUserId,
    costActualMinor: row.costActualMinor,
    costCurrency: row.costCurrency,
    items: [
      {
        kind: 'root',
        order: 0,
        state: 'published',
        externalPostId: row.externalPostId,
        permalink: row.permalink,
        publishedAt: row.publishedAt.toISOString(),
        errorCode: null,
      },
      // A failed follow-up never retroactively fails the root post that already
      // published, so each item carries its own state.
      ...followUps.map((item) => ({
        kind: 'comment' as const,
        order: item.position + 1,
        state: item.state as PublicationReceiptView['items'][number]['state'],
        externalPostId: null,
        permalink: null,
        publishedAt: null,
        errorCode: null,
      })),
    ],
    attempts: row.publishJob.attempts.map((attempt) => ({
      id: attempt.id,
      attemptNumber: attempt.attemptNumber,
      outcome: attempt.outcome,
      errorClass: attempt.errorClass,
      errorCode: attempt.errorCode,
      httpStatus: attempt.httpStatus,
      startedAt: attempt.startedAt.toISOString(),
      endedAt: toIso(attempt.endedAt),
    })),
    lastAnalyticsSyncAt: toIso(row.lastAnalyticsSyncAt),
    deletedExternallyAt: toIso(row.deletedExternallyAt),
    createdAt: row.createdAt.toISOString(),
  };
}

async function readReceipts(db: Db, where: { id?: string; publishJobId?: string }) {
  return db.publicationReceipt.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
    select: RECEIPT_SELECT,
  });
}

const RECENT_RECEIPT_SELECT = {
  id: true,
  provider: true,
  permalink: true,
  publishedAt: true,
  publishJob: {
    select: {
      state: true,
      contentItem: { select: { id: true, title: true } },
      connection: { select: { displayName: true } },
      postVariant: {
        select: {
          commentItems: { select: { state: true } },
        },
      },
    },
  },
} as const;

interface RecentReceiptRow {
  id: string;
  provider: string;
  permalink: string | null;
  publishedAt: Date;
  publishJob: {
    state: ReceiptSummaryView['state'];
    contentItem: { id: string; title: string | null };
    connection: { displayName: string };
    postVariant: { commentItems: { state: string }[] } | null;
  };
}

function toSummary(row: RecentReceiptRow): ReceiptSummaryView {
  return {
    receiptId: row.id,
    contentItemId: row.publishJob.contentItem.id,
    title: row.publishJob.contentItem.title,
    provider: toProviderId(row.provider),
    accountLabel: row.publishJob.connection.displayName,
    state: row.publishJob.state,
    publishedAt: row.publishedAt.toISOString(),
    permalink: row.permalink,
    failedItemCount:
      row.publishJob.postVariant?.commentItems.filter((item) => item.state !== 'published')
        .length ?? 0,
  };
}

export function createReceiptService(deps: ServiceDeps): ReceiptService {
  return {
    async get(ctx: ActorContext, receiptId: string): Promise<PublicationReceiptView> {
      return authorized(deps, ctx, 'receipt.read', undefined, async (db) => {
        const [row] = await readReceipts(db, { id: receiptId });
        if (row === undefined) {
          throw notFound('publication_receipt', receiptId);
        }
        return toView(row);
      });
    },

    async listForJob(ctx: ActorContext, jobId: string): Promise<readonly PublicationReceiptView[]> {
      return authorized(deps, ctx, 'receipt.read', undefined, async (db) => {
        const rows = await readReceipts(db, { publishJobId: jobId });
        return rows.map(toView);
      });
    },

    async listRecent(ctx: ActorContext, query?: PageQuery): Promise<Paginated<ReceiptSummaryView>> {
      return authorized(deps, ctx, 'receipt.read', undefined, async (db) => {
        const args = pageArgs(query);
        const rows = await db.publicationReceipt.findMany({
          orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
          take: args.take,
          skip: args.skip,
          cursor: args.cursor,
          select: RECENT_RECEIPT_SELECT,
        });
        return toPage(rows, args, (row) => row.id, toSummary);
      });
    },
  };
}
