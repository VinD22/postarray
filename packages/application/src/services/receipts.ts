import {
  errorCodeSchema,
  type ErrorClass,
  type Paginated,
  type PublicationReceipt,
  type PublishState,
} from '@relay/contracts';

import type { ActorContext, PageQuery, ReceiptService, ServiceDeps } from '../types';
import type { PublicationReceiptView, ReceiptSummaryView } from '../views';

import { notFound } from '../internal/errors';
import {
  fromStoredAccountType,
  fromStoredSurface,
  toIso,
  toLocalDateTime,
  toProviderId,
} from '../internal/mappers';
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
  responseEvidence: true,
  lastAnalyticsSyncAt: true,
  deletedExternallyAt: true,
  createdAt: true,
  publishJob: {
    select: {
      state: true,
      scheduledFor: true,
      scheduledTimeZone: true,
      nextAttemptAt: true,
      approvalPolicy: true,
      approvalRequest: {
        select: {
          id: true,
          state: true,
          decisions: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { decidedByUserId: true, createdAt: true },
          },
        },
      },
      connection: {
        select: {
          accountType: true,
          externalAccountId: true,
          capabilityVersion: true,
        },
      },
      attempts: {
        orderBy: { attemptNumber: 'asc' },
        select: {
          id: true,
          attemptNumber: true,
          outcome: true,
          errorClass: true,
          errorCode: true,
          sanitizedResponse: true,
          providerRequestId: true,
          httpStatus: true,
          startedAt: true,
          endedAt: true,
        },
      },
      postVariant: {
        select: {
          capabilitySnapshotVersion: true,
          estimatedCostMinor: true,
          estimatedCostCurrency: true,
          commentItems: {
            orderBy: { position: 'asc' },
            select: { id: true, position: true, state: true, delayMinutes: true },
          },
        },
      },
    },
  },
} as const;

export interface ReceiptRow {
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
  responseEvidence: unknown;
  lastAnalyticsSyncAt: Date | null;
  deletedExternallyAt: Date | null;
  createdAt: Date;
  publishJob: {
    state: string;
    scheduledFor: Date;
    scheduledTimeZone: string;
    nextAttemptAt: Date | null;
    approvalPolicy: string;
    approvalRequest: {
      id: string;
      state: string;
      decisions: { decidedByUserId: string; createdAt: Date }[];
    } | null;
    connection: {
      accountType: string;
      externalAccountId: string;
      capabilityVersion: string | null;
    };
    attempts: {
      id: string;
      attemptNumber: number;
      outcome: string;
      errorClass: string | null;
      errorCode: string | null;
      sanitizedResponse: unknown;
      providerRequestId: string | null;
      httpStatus: number | null;
      startedAt: Date;
      endedAt: Date | null;
    }[];
    postVariant: {
      capabilitySnapshotVersion: string | null;
      estimatedCostMinor: number | null;
      estimatedCostCurrency: string | null;
      commentItems: { id: string; position: number; state: string; delayMinutes: number }[];
    } | null;
  };
}

const ERROR_CLASSES = new Set<ErrorClass>([
  'user_action_required',
  'content_invalid',
  'transient_provider',
  'permanent_provider',
  'internal',
  'unknown',
]);

function errorClass(value: string | null): ErrorClass | null {
  return value !== null && ERROR_CLASSES.has(value as ErrorClass) ? (value as ErrorClass) : null;
}

function errorCode(value: string | null): PublicationReceipt['attempts'][number]['errorCode'] {
  const parsed = errorCodeSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function responseEvidence(value: unknown): Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? { ...value }
    : {};
}

function publishState(value: string): PublishState {
  const states: readonly PublishState[] = [
    'draft',
    'validation_needed',
    'approval_requested',
    'approved',
    'scheduled',
    'preparing_media',
    'dispatching',
    'provider_processing',
    'published',
    'partially_published',
    'action_required',
    'retry_scheduled',
    'failed_permanently',
    'canceled',
    'deleted_externally',
  ];
  return states.includes(value as PublishState) ? (value as PublishState) : 'action_required';
}

function approvalState(policy: string, state: string | undefined): PublicationReceipt['approval']['state'] {
  if (policy === 'none') {
    return 'not_required';
  }
  switch (state) {
    case 'approved':
      return 'approved';
    case 'expired':
      return 'expired';
    case 'rejected':
    case 'canceled':
    case 'changes_requested':
      return 'rejected';
    default:
      return 'requested';
  }
}

function attemptResultState(outcome: string, jobState: string): PublishState {
  switch (outcome) {
    case 'succeeded':
      return 'published';
    case 'pending':
      return 'dispatching';
    case 'failed':
      return publishState(jobState);
    default:
      return 'action_required';
  }
}

export function receiptRowToView(row: ReceiptRow): PublicationReceiptView {
  const followUps = row.publishJob.postVariant?.commentItems ?? [];
  const scheduledInstant = row.scheduledFor ?? row.publishJob.scheduledFor;
  const ianaTimeZone = row.scheduledTimeZone ?? row.publishJob.scheduledTimeZone;
  const decision = row.publishJob.approvalRequest?.decisions[0];
  const estimate = row.publishJob.postVariant?.estimatedCostMinor ?? null;
  const estimateCurrency = row.publishJob.postVariant?.estimatedCostCurrency ?? null;
  const cost =
    estimate !== null && estimateCurrency !== null && /^[A-Z]{3}$/.test(estimateCurrency)
      ? {
          currency: estimateCurrency,
          estimatedMinor: estimate,
          actualMinor:
            row.costCurrency === estimateCurrency ? row.costActualMinor : null,
          reconciledAt: row.lastAnalyticsSyncAt?.toISOString() ?? null,
        }
      : null;
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    publishJobId: row.publishJobId,
    provider: toProviderId(row.provider),
    accountType: fromStoredAccountType(row.publishJob.connection.accountType),
    connectionId: row.connectionId,
    externalAccountId: row.publishJob.connection.externalAccountId,
    externalPostId: row.externalPostId,
    permalink: row.permalink,
    contentVersionId: row.contentVersionId,
    contentVersionChecksum: row.contentHash,
    capabilityVersion:
      row.publishJob.postVariant?.capabilitySnapshotVersion ??
      row.publishJob.connection.capabilityVersion ??
      'unavailable',
    scheduledLocalTime: toLocalDateTime(scheduledInstant, ianaTimeZone),
    ianaTimeZone,
    scheduledInstant: scheduledInstant.toISOString(),
    dispatchedAt: (row.dispatchedAt ?? row.publishedAt).toISOString(),
    publishedAt: row.publishedAt.toISOString(),
    creationSurface: fromStoredSurface(row.surface),
    approval: {
      state: approvalState(
        row.publishJob.approvalPolicy,
        row.publishJob.approvalRequest?.state,
      ),
      approvalId: row.publishJob.approvalRequest?.id ?? null,
      decidedBy: decision?.decidedByUserId ?? row.approvedByUserId,
      decidedAt: decision?.createdAt.toISOString() ?? null,
      policyKey: row.publishJob.approvalPolicy === 'none' ? null : row.publishJob.approvalPolicy,
    },
    cost,
    attempts: row.publishJob.attempts.map((attempt) => {
      const classification = errorClass(attempt.errorClass);
      return {
        id: attempt.id,
        publishJobId: row.publishJobId,
        attemptNumber: attempt.attemptNumber,
        startedAt: attempt.startedAt.toISOString(),
        finishedAt: toIso(attempt.endedAt),
        resultState: attemptResultState(attempt.outcome, row.publishJob.state),
        errorClass: classification,
        errorCode: errorCode(attempt.errorCode),
        retryable: classification === 'transient_provider',
        nextRetryAt:
          classification === 'transient_provider'
            ? toIso(row.publishJob.nextAttemptAt)
            : null,
        providerRequestId: attempt.providerRequestId,
        httpStatus: attempt.httpStatus,
        sanitizedResponse: responseEvidence(attempt.sanitizedResponse),
      };
    }),
    sanitizedProviderResponse: responseEvidence(row.responseEvidence),
    root: {
      kind: 'root',
      order: 0,
      threadItemId: null,
      state: 'published',
      externalPostId: row.externalPostId,
      permalink: row.permalink,
      delaySeconds: 0,
      publishedAt: row.publishedAt.toISOString(),
      errorCode: null,
    },
    items: [
      // A failed follow-up never retroactively fails the root post that already
      // published, so each item carries its own state.
      ...followUps.map((item) => ({
        kind: 'comment' as const,
        order: item.position + 1,
        threadItemId: item.id,
        state: publishState(item.state),
        externalPostId: null,
        permalink: null,
        delaySeconds: item.delayMinutes * 60,
        publishedAt: null,
        errorCode: null,
      })),
    ],
    lastAnalyticsSyncAt: toIso(row.lastAnalyticsSyncAt),
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
        return receiptRowToView(row);
      });
    },

    async listForJob(ctx: ActorContext, jobId: string): Promise<readonly PublicationReceiptView[]> {
      return authorized(deps, ctx, 'receipt.read', undefined, async (db) => {
        const rows = await readReceipts(db, { publishJobId: jobId });
        return rows.map(receiptRowToView);
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
