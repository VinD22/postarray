import { deletionRequestScopeSchema, deletionRequestStateSchema } from '@relay/contracts';

import type {
  ActorContext,
  DataLifecycleService,
  DeletionRequestView,
  ServiceDeps,
  WorkflowActorContext,
} from '../types';

import { recordAudit } from '../internal/audit';
import { invalid, notFound } from '../internal/errors';
import { withIdempotency } from '../internal/idempotency';
import { authorized } from '../internal/runtime';

/** The published cooling-off window before a workspace can be erased. */
export const DELETION_COOLING_OFF_MS = 7 * 24 * 60 * 60_000;

const ACTIVE_STATES = ['requested', 'verifying', 'scheduled', 'executing'] as const;

const DELETION_SELECT = {
  id: true,
  workspaceId: true,
  scope: true,
  state: true,
  executeAfter: true,
  verifiedAt: true,
  executedAt: true,
  canceledAt: true,
  createdAt: true,
} as const;

type DeletionRow = {
  id: string;
  workspaceId: string;
  scope: string;
  state: string;
  executeAfter: Date;
  verifiedAt: Date | null;
  executedAt: Date | null;
  canceledAt: Date | null;
  createdAt: Date;
};

function toView(row: DeletionRow): DeletionRequestView {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    scope: deletionRequestScopeSchema.parse(row.scope),
    state: deletionRequestStateSchema.parse(row.state),
    executeAfter: row.executeAfter.toISOString(),
    verifiedAt: row.verifiedAt?.toISOString() ?? null,
    executedAt: row.executedAt?.toISOString() ?? null,
    canceledAt: row.canceledAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

function workflowContext(ctx: ActorContext): WorkflowActorContext {
  return {
    workspaceId: ctx.workspaceId,
    correlationId: ctx.correlationId,
    actorId: ctx.actorId,
    actorType: ctx.actorType,
    surface: ctx.surface,
    approvalLevel: ctx.approvalLevel,
    locale: ctx.locale,
  };
}

function canCancel(state: string): boolean {
  return ACTIVE_STATES.includes(state as (typeof ACTIVE_STATES)[number]);
}

/** Owner-only workspace closure with durable scheduling and cancellation. */
export function createDataLifecycleService(deps: ServiceDeps): DataLifecycleService {
  return {
    async request(ctx, input): Promise<DeletionRequestView> {
      const scope = deletionRequestScopeSchema.parse(input.scope ?? 'workspace');

      return withIdempotency(deps.kv, ctx, {
        operation: 'data.deletion.request',
        body: { scope, confirmation: input.confirmation, reason: input.reason ?? null },
        resourceIdOf: (view) => view.id,
        run: async () => {
          const view = await authorized(
            deps,
            ctx,
            'workspace.delete',
            undefined,
            async (db, actor) => {
              if (actor.userId === null) {
                throw invalid('errors.deletion_requires_member', {}, ctx.correlationId);
              }
              if (input.confirmation !== actor.workspace.name) {
                throw invalid(
                  'errors.validation_failed',
                  { reason: 'workspace_name_confirmation_required' },
                  ctx.correlationId,
                );
              }

              const existingByKey =
                ctx.idempotencyKey === undefined
                  ? null
                  : await db.deletionRequest.findFirst({
                      where: {
                        workspaceId: ctx.workspaceId,
                        idempotencyKey: ctx.idempotencyKey,
                      },
                      select: DELETION_SELECT,
                    });
              if (existingByKey !== null) return toView(existingByKey);

              const existingActive = await db.deletionRequest.findFirst({
                where: { workspaceId: ctx.workspaceId, state: { in: [...ACTIVE_STATES] } },
                orderBy: { createdAt: 'desc' },
                select: DELETION_SELECT,
              });
              if (existingActive !== null) return toView(existingActive);

              const executeAfter = new Date(deps.clock.now().getTime() + DELETION_COOLING_OFF_MS);
              const created = await db.deletionRequest.create({
                data: {
                  workspaceId: ctx.workspaceId,
                  requestedByUserId: actor.userId,
                  idempotencyKey: ctx.idempotencyKey ?? null,
                  scope,
                  state: 'requested',
                  reason: input.reason ?? null,
                  executeAfter,
                },
                select: DELETION_SELECT,
              });
              await recordAudit(db, actor, {
                action: 'deletion.requested',
                targetType: 'deletion_request',
                targetId: created.id,
                after: { scope, state: created.state, executeAfter: executeAfter.toISOString() },
              });
              return toView(created);
            },
            { timeoutMs: 30_000 },
          );

          if (view.state === 'requested') {
            const executeAt = new Date(view.executeAfter);
            await deps.scheduler.scheduleDataDeletion({
              requestId: view.id,
              workspaceId: ctx.workspaceId,
              executeAt,
              workflowInput: {
                ctx: workflowContext(ctx),
                requestId: view.id,
                graceMs: Math.max(0, executeAt.getTime() - deps.clock.now().getTime()),
              },
            });
            await authorized(deps, ctx, 'workspace.delete', undefined, async (db, actor) => {
              const scheduled = await db.deletionRequest.updateMany({
                where: {
                  id: view.id,
                  workspaceId: ctx.workspaceId,
                  state: 'requested',
                },
                data: { state: 'scheduled' },
              });
              if (scheduled.count > 0) {
                await recordAudit(db, actor, {
                  action: 'deletion.scheduled',
                  targetType: 'deletion_request',
                  targetId: view.id,
                  after: { state: 'scheduled', executeAfter: view.executeAfter },
                });
              }
            });
            return { ...view, state: 'scheduled' };
          }
          return view;
        },
      });
    },

    async current(ctx): Promise<DeletionRequestView | null> {
      return authorized(deps, ctx, 'workspace.delete', undefined, async (db) => {
        const row = await db.deletionRequest.findFirst({
          where: { workspaceId: ctx.workspaceId },
          orderBy: { createdAt: 'desc' },
          select: DELETION_SELECT,
        });
        return row === null ? null : toView(row);
      });
    },

    async get(ctx, requestId): Promise<DeletionRequestView> {
      return authorized(deps, ctx, 'workspace.delete', undefined, async (db) => {
        const row = await db.deletionRequest.findFirst({
          where: { id: requestId, workspaceId: ctx.workspaceId },
          select: DELETION_SELECT,
        });
        if (row === null) throw notFound('deletion_request', requestId, ctx.correlationId);
        return toView(row);
      });
    },

    async cancel(ctx, requestId): Promise<DeletionRequestView> {
      return withIdempotency(deps.kv, ctx, {
        operation: 'data.deletion.cancel',
        body: { requestId },
        resourceIdOf: (view) => view.id,
        run: async () => {
          const row = await authorized(deps, ctx, 'workspace.delete', undefined, async (db) => {
            const found = await db.deletionRequest.findFirst({
              where: { id: requestId, workspaceId: ctx.workspaceId },
              select: DELETION_SELECT,
            });
            if (found === null) throw notFound('deletion_request', requestId, ctx.correlationId);
            return found;
          });
          if (!canCancel(row.state)) {
            if (row.state === 'executing') {
              throw invalid(
                'errors.validation_failed',
                { reason: 'deletion_already_executing' },
                ctx.correlationId,
              );
            }
            return toView(row);
          }

          if (row.state === 'scheduled') {
            await deps.scheduler.cancelDataDeletion({
              requestId,
              workspaceId: ctx.workspaceId,
              reason: 'deletion.canceled',
            });
          }

          const canceled = await authorized(
            deps,
            ctx,
            'workspace.delete',
            undefined,
            async (db, actor) => {
              const updated = await db.deletionRequest.updateMany({
                where: {
                  id: requestId,
                  workspaceId: ctx.workspaceId,
                  state: { in: [...ACTIVE_STATES] },
                },
                data: { state: 'canceled', canceledAt: deps.clock.now() },
              });
              if (updated.count > 0) {
                await recordAudit(db, actor, {
                  action: 'deletion.canceled',
                  targetType: 'deletion_request',
                  targetId: requestId,
                  after: { state: 'canceled' },
                });
              }
              const latest = await db.deletionRequest.findFirst({
                where: { id: requestId, workspaceId: ctx.workspaceId },
                select: DELETION_SELECT,
              });
              if (latest === null) {
                throw notFound('deletion_request', requestId, ctx.correlationId);
              }
              return toView(latest);
            },
          );
          return canceled;
        },
      });
    },
  };
}
