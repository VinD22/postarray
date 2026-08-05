import type { ActorContext, ServiceDeps, WorkspaceService } from '../types.js';
import type { WorkspaceView } from '../views.js';

import { recordAudit } from '../internal/audit.js';
import { notFound } from '../internal/errors.js';
import { authorized, type Db } from '../internal/runtime.js';

/** Workspace settings and the operator kill switch. */

async function readWorkspace(db: Db, workspaceId: string): Promise<WorkspaceView> {
  const row = await db.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      defaultLocale: true,
      defaultTimeZone: true,
      killSwitchAt: true,
      createdAt: true,
    },
  });
  if (row === null) {
    throw notFound('workspace', workspaceId);
  }
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    status: row.status,
    defaultLocale: row.defaultLocale,
    defaultTimeZone: row.defaultTimeZone,
    killSwitchEngaged: row.killSwitchAt !== null,
    createdAt: row.createdAt.toISOString(),
  };
}

export function createWorkspaceService(deps: ServiceDeps): WorkspaceService {
  return {
    async get(ctx: ActorContext): Promise<WorkspaceView> {
      return authorized(deps, ctx, 'workspace.read', undefined, async (db) =>
        readWorkspace(db, ctx.workspaceId),
      );
    },

    async update(
      ctx: ActorContext,
      patch: { name?: string; defaultLocale?: string; defaultTimeZone?: string },
    ): Promise<WorkspaceView> {
      return authorized(deps, ctx, 'workspace.update', undefined, async (db, actor) => {
        const before = await readWorkspace(db, ctx.workspaceId);
        await db.workspace.update({
          where: { id: ctx.workspaceId },
          data: {
            ...(patch.name === undefined ? {} : { name: patch.name }),
            ...(patch.defaultLocale === undefined
              ? {}
              : { defaultLocale: patch.defaultLocale }),
            ...(patch.defaultTimeZone === undefined
              ? {}
              : { defaultTimeZone: patch.defaultTimeZone }),
          },
        });
        const after = await readWorkspace(db, ctx.workspaceId);
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'workspace',
          targetId: ctx.workspaceId,
          before,
          after,
        });
        return after;
      });
    },

    /**
     * Stops every outbound provider call for this tenant within one request.
     * Nothing already published is touched; nothing new leaves.
     */
    async engageKillSwitch(ctx: ActorContext, reasonKey: string): Promise<WorkspaceView> {
      return authorized(deps, ctx, 'workspace.update', undefined, async (db, actor) => {
        const before = await readWorkspace(db, ctx.workspaceId);
        await db.workspace.update({
          where: { id: ctx.workspaceId },
          data: { killSwitchAt: deps.clock.now(), killSwitchReason: reasonKey },
        });
        const after = await readWorkspace(db, ctx.workspaceId);
        await recordAudit(db, actor, {
          action: 'workspace.kill_switch_engaged',
          targetType: 'workspace',
          targetId: ctx.workspaceId,
          before,
          after,
          metadata: { reasonKey },
        });
        return after;
      });
    },

    async releaseKillSwitch(ctx: ActorContext): Promise<WorkspaceView> {
      return authorized(deps, ctx, 'workspace.update', undefined, async (db, actor) => {
        const before = await readWorkspace(db, ctx.workspaceId);
        await db.workspace.update({
          where: { id: ctx.workspaceId },
          data: { killSwitchAt: null, killSwitchReason: null },
        });
        const after = await readWorkspace(db, ctx.workspaceId);
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'workspace',
          targetId: ctx.workspaceId,
          before,
          after,
          metadata: { killSwitchReleased: true },
        });
        return after;
      });
    },
  };
}
