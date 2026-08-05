import type { Paginated } from '@relay/contracts';

import type { ActorContext, AuditService, PageQuery, ServiceDeps } from '../types.js';
import type { AuditEventView } from '../views.js';

import { fromStoredSurface } from '../internal/mappers.js';
import { pageArgs, toPage } from '../internal/pagination.js';
import { authorized } from '../internal/runtime.js';

/**
 * The audit log.
 *
 * Append only, enforced by a database trigger that rejects UPDATE and DELETE
 * even for the owner role. Reading it is itself a permissioned action, and the
 * `before` and `after` columns are hashes rather than values, so the log proves
 * that something changed without keeping a copy of what it was.
 */

const AUDIT_SELECT = {
  id: true,
  workspaceId: true,
  actorType: true,
  actorId: true,
  surface: true,
  action: true,
  targetType: true,
  targetId: true,
  beforeHash: true,
  afterHash: true,
  correlationId: true,
  createdAt: true,
} as const;

interface AuditRow {
  id: string;
  workspaceId: string;
  actorType: string;
  actorId: string | null;
  surface: string;
  action: string;
  targetType: string;
  targetId: string | null;
  beforeHash: string | null;
  afterHash: string | null;
  correlationId: string | null;
  createdAt: Date;
}

function toView(row: AuditRow): AuditEventView {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    actorType: row.actorType,
    actorId: row.actorId,
    surface: fromStoredSurface(row.surface),
    action: row.action,
    targetType: row.targetType,
    targetId: row.targetId,
    beforeHash: row.beforeHash,
    afterHash: row.afterHash,
    correlationId: row.correlationId,
    createdAt: row.createdAt.toISOString(),
  };
}

export function createAuditService(deps: ServiceDeps): AuditService {
  return {
    async list(
      ctx: ActorContext,
      input: PageQuery & {
        action?: string;
        targetType?: string;
        targetId?: string;
        actorId?: string;
        from?: string;
        to?: string;
      } = {},
    ): Promise<Paginated<AuditEventView>> {
      return authorized(deps, ctx, 'audit.read', undefined, async (db) => {
        const args = pageArgs(input);
        const from = input.from === undefined ? undefined : new Date(input.from);
        const to = input.to === undefined ? undefined : new Date(input.to);
        const rows = await db.auditEvent.findMany({
          where: {
            ...(input.action === undefined ? {} : { action: input.action }),
            ...(input.targetType === undefined ? {} : { targetType: input.targetType }),
            ...(input.targetId === undefined ? {} : { targetId: input.targetId }),
            ...(input.actorId === undefined ? {} : { actorId: input.actorId }),
            ...(from === undefined && to === undefined
              ? {}
              : {
                  createdAt: {
                    ...(from === undefined ? {} : { gte: from }),
                    ...(to === undefined ? {} : { lte: to }),
                  },
                }),
          },
          orderBy: { id: 'desc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: AUDIT_SELECT,
        });
        return toPage(rows, args, (row) => row.id, toView);
      });
    },
  };
}
