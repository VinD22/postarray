import type { Paginated } from '@relay/contracts';

import type { ActorContext, ApprovalService, PageQuery, ServiceDeps } from '../types.js';
import type { ApprovalRequestView } from '../views.js';

import { recordAudit } from '../internal/audit.js';
import { loadAggregate, reapprovalRequired } from '../internal/content-store.js';
import { invalid, notFound } from '../internal/errors.js';
import { withIdempotency } from '../internal/idempotency.js';
import { pageArgs, toPage } from '../internal/pagination.js';
import { authorized, guard, type Db } from '../internal/runtime.js';
import { toApprovalPolicy } from '../internal/storage-enums.js';

/**
 * Approvals.
 *
 * An approval binds to a checksum, not to a content item. If the content, the
 * accounts, the locale, the media, the disclosure, the privacy setting, the
 * time or the target list change afterwards, the checksum changes and the
 * approval no longer covers what would publish. That is one comparison rather
 * than eight rules that drift apart.
 */

const APPROVAL_STATE_TO_VIEW = {
  pending: 'requested',
  approved: 'approved',
  changes_requested: 'rejected',
  rejected: 'rejected',
  expired: 'expired',
  canceled: 'not_required',
} as const;

type StoredApprovalState = keyof typeof APPROVAL_STATE_TO_VIEW;

interface ApprovalRow {
  id: string;
  contentItemId: string;
  contentVersionId: string;
  policy: string;
  state: string;
  requestedByUserId: string | null;
  assignedUserIds: string[];
  note: string | null;
  dueAt: Date | null;
  resolvedAt: Date | null;
  createdAt: Date;
  decisions: {
    id: string;
    decision: string;
    decidedByUserId: string;
    comment: string | null;
    reviewedContentHash: string;
    createdAt: Date;
  }[];
}

function toView(row: ApprovalRow): ApprovalRequestView {
  const state = row.state as StoredApprovalState;
  return {
    id: row.id,
    contentItemId: row.contentItemId,
    contentVersionId: row.contentVersionId,
    policy: row.policy,
    state: APPROVAL_STATE_TO_VIEW[state] ?? 'requested',
    requestedBy: row.requestedByUserId,
    assignedUserIds: [...row.assignedUserIds],
    note: row.note,
    dueAt: row.dueAt?.toISOString() ?? null,
    resolvedAt: row.resolvedAt?.toISOString() ?? null,
    decisions: row.decisions.map((decision) => ({
      id: decision.id,
      decision:
        decision.decision === 'approve'
          ? 'approve'
          : decision.decision === 'reject'
            ? 'reject'
            : 'request_changes',
      decidedByUserId: decision.decidedByUserId,
      comment: decision.comment,
      reviewedChecksum: decision.reviewedContentHash,
      createdAt: decision.createdAt.toISOString(),
    })),
    createdAt: row.createdAt.toISOString(),
  };
}

const APPROVAL_SELECT = {
  id: true,
  contentItemId: true,
  contentVersionId: true,
  policy: true,
  state: true,
  requestedByUserId: true,
  assignedUserIds: true,
  note: true,
  dueAt: true,
  resolvedAt: true,
  createdAt: true,
  decisions: {
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      decision: true,
      decidedByUserId: true,
      comment: true,
      reviewedContentHash: true,
      createdAt: true,
    },
  },
} as const;

async function reload(db: Db, approvalId: string): Promise<ApprovalRequestView> {
  const row = await db.approvalRequest.findFirst({
    where: { id: approvalId },
    select: APPROVAL_SELECT,
  });
  if (row === null) {
    throw notFound('approval_request', approvalId);
  }
  return toView(row);
}

export function createApprovalService(deps: ServiceDeps): ApprovalService {
  return {
    async request(
      ctx: ActorContext,
      input: { contentItemId: string; approverIds?: readonly string[]; note?: string },
    ): Promise<ApprovalRequestView> {
      return withIdempotency(deps.kv, ctx, {
        operation: 'approvals.request',
        body: input,
        resourceIdOf: (view) => view.id,
        run: async () =>
          authorized(deps, ctx, 'content.request_approval', undefined, async (db, actor) => {
            const aggregate = await loadAggregate(db, input.contentItemId);
            if (aggregate.variants.length === 0) {
              throw invalid('errors.no_targets_selected', {
                contentItemId: input.contentItemId,
              });
            }

            // Approval binds to the current immutable version. Freezing here
            // is what makes "the approver saw exactly this" checkable later.
            const created = await db.approvalRequest.create({
              data: {
                workspaceId: actor.workspace.id,
                contentItemId: aggregate.itemId,
                contentVersionId: aggregate.currentVersionId,
                policy: toApprovalPolicy(
                  aggregate.approvalPolicy === 'none' ? 'any_approver' : aggregate.approvalPolicy,
                ),
                state: 'pending',
                ...(actor.userId === null ? {} : { requestedByUserId: actor.userId }),
                ...(ctx.actorType === 'service_account'
                  ? { requestedByServiceAccountId: ctx.actorId }
                  : {}),
                assignedUserIds: [...(input.approverIds ?? [])],
                ...(input.note === undefined ? {} : { note: input.note }),
              },
              select: { id: true },
            });

            await db.contentItem.update({
              where: { id: aggregate.itemId },
              data: { state: 'approval_requested' },
            });

            await recordAudit(db, actor, {
              action: 'approval.requested',
              targetType: 'approval_request',
              targetId: created.id,
              after: {
                contentVersionId: aggregate.currentVersionId,
                checksum: aggregate.checksum,
              },
              metadata: {
                contentItemId: aggregate.itemId,
                approverCount: input.approverIds?.length ?? 0,
              },
            });

            return reload(db, created.id);
          }),
      });
    },

    async decide(
      ctx: ActorContext,
      input: {
        approvalId: string;
        decision: 'approve' | 'request_changes' | 'reject';
        note?: string;
      },
    ): Promise<ApprovalRequestView> {
      return withIdempotency(deps.kv, ctx, {
        operation: 'approvals.decide',
        body: input,
        resourceIdOf: (view) => view.id,
        run: async () =>
          authorized(deps, ctx, 'content.read', undefined, async (db, actor) => {
            const request = await db.approvalRequest.findFirst({
              where: { id: input.approvalId },
              select: {
                id: true,
                state: true,
                contentItemId: true,
                contentVersionId: true,
              },
            });
            if (request === null) {
              throw notFound('approval_request', input.approvalId);
            }
            if (request.state !== 'pending') {
              throw invalid('errors.approval_already_decided', { state: request.state });
            }

            const aggregate = await loadAggregate(db, request.contentItemId);

            // The author never signs off their own work unless the workspace
            // has deliberately enabled it. The policy owns that rule.
            guard(actor, 'content.approve', {
              brandId: aggregate.brandId,
              authorActorId: aggregate.createdByUserId,
            });

            const reviewed = await db.contentVersion.findFirst({
              where: { id: request.contentVersionId },
              select: { contentHash: true },
            });
            if (reviewed === null) {
              throw notFound('content_version', request.contentVersionId);
            }

            // The draft moved after the request was raised. Deciding on a
            // version that no longer exists would be a rubber stamp.
            if (reviewed.contentHash !== aggregate.checksum) {
              throw invalid('errors.content_changed_after_approval', {
                reviewedChecksum: reviewed.contentHash,
                currentChecksum: aggregate.checksum,
              });
            }

            if (actor.userId === null) {
              throw invalid('errors.approval_requires_human', {});
            }

            await db.approvalDecision.create({
              data: {
                workspaceId: actor.workspace.id,
                approvalRequestId: request.id,
                decision: input.decision,
                decidedByUserId: actor.userId,
                ...(input.note === undefined ? {} : { comment: input.note }),
                reviewedContentHash: reviewed.contentHash,
              },
            });

            const approved = input.decision === 'approve';
            const nextState =
              input.decision === 'approve'
                ? 'approved'
                : input.decision === 'reject'
                  ? 'rejected'
                  : 'changes_requested';

            await db.approvalRequest.update({
              where: { id: request.id },
              data: { state: nextState, resolvedAt: deps.clock.now() },
            });

            await db.contentItem.update({
              where: { id: aggregate.itemId },
              data: approved
                ? {
                    state: 'approved',
                    approvedVersionId: request.contentVersionId,
                    approvedAt: deps.clock.now(),
                  }
                : { state: 'draft' },
            });

            await recordAudit(db, actor, {
              action: 'approval.decided',
              targetType: 'approval_request',
              targetId: request.id,
              before: { state: 'pending' },
              after: { state: nextState, checksum: reviewed.contentHash },
              metadata: { contentItemId: aggregate.itemId, decision: input.decision },
            });

            return reload(db, request.id);
          }),
      });
    },

    async listPending(
      ctx: ActorContext,
      query: PageQuery = {},
    ): Promise<Paginated<ApprovalRequestView>> {
      return authorized(deps, ctx, 'content.read', undefined, async (db) => {
        const args = pageArgs(query);
        const rows = await db.approvalRequest.findMany({
          where: { state: 'pending' },
          orderBy: { id: 'desc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: APPROVAL_SELECT,
        });
        return toPage(rows, args, (row) => row.id, toView);
      });
    },
  };
}

export { reapprovalRequired };
