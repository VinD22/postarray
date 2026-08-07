import {
  dataExportFormatSchema,
  dataExportScopeSchema,
  dataExportStateSchema,
  type DataExportFormat,
  type DataExportScope,
  type Paginated,
} from '@relay/contracts';
import { createHash } from 'node:crypto';

import type {
  ActorContext,
  DataExportContent,
  DataExportService,
  DataExportView,
  PageQuery,
  ServiceDeps,
  WorkflowActorContext,
} from '../types';

import { recordAudit } from '../internal/audit';
import { invalid, notFound } from '../internal/errors';
import { withIdempotency } from '../internal/idempotency';
import { pageArgs, toPage } from '../internal/pagination';
import { authorized } from '../internal/runtime';
import { createDataExportBuilder } from './data-export-builder';

const EXPORT_LINK_TTL_SECONDS = 15 * 60;
const EXPORT_CONTENT_TYPE = 'application/json' as const;

const DATA_EXPORT_SELECT = {
  id: true,
  workspaceId: true,
  scope: true,
  format: true,
  state: true,
  storageKey: true,
  byteSize: true,
  checksumSha256: true,
  downloadedAt: true,
  expiresAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

type DataExportRow = {
  id: string;
  workspaceId: string;
  scope: string;
  format: string;
  state: string;
  storageKey: string | null;
  byteSize: bigint | null;
  checksumSha256: string | null;
  downloadedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type StoredExportRow = DataExportRow & {
  storageKey: string;
  byteSize: bigint;
  checksumSha256: string;
  expiresAt: Date;
};

function toView(row: DataExportRow): DataExportView {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    scope: dataExportScopeSchema.parse(row.scope),
    format: dataExportFormatSchema.parse(row.format),
    state: dataExportStateSchema.parse(row.state),
    preparedAt:
      row.state === 'ready' || row.state === 'delivered' ? row.updatedAt.toISOString() : null,
    expiresAt: row.expiresAt?.toISOString() ?? null,
    byteSize: row.byteSize === null ? null : Number(row.byteSize),
    checksumSha256: row.checksumSha256,
    // A signed URL is minted only by `download`, never persisted in a view or
    // returned from a list endpoint.
    downloadUrl: null,
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

function contentUrl(apiUrl: string | undefined, workspaceId: string, exportId: string): string {
  if (apiUrl === undefined) {
    throw invalid('errors.export_unavailable', { reason: 'api_url_missing' });
  }
  return `${apiUrl.replace(/\/+$/u, '')}/v1/workspaces/${encodeURIComponent(workspaceId)}/data/exports/${encodeURIComponent(exportId)}/content`;
}

function assertStoredExport(row: DataExportRow, now: Date): asserts row is StoredExportRow {
  if (
    (row.state !== 'ready' && row.state !== 'delivered') ||
    row.storageKey === null ||
    row.byteSize === null ||
    row.checksumSha256 === null ||
    row.expiresAt === null
  ) {
    throw invalid('errors.export_not_ready', { exportId: row.id });
  }
  if (row.expiresAt.getTime() <= now.getTime()) {
    throw invalid('errors.export_expired', { exportId: row.id });
  }
}

/** Workspace data rights, with a strict allow-list enforced by the worker. */
export function createDataExportService(deps: ServiceDeps): DataExportService {
  const builder = createDataExportBuilder(deps);

  return {
    async request(
      ctx: ActorContext,
      input: { scope?: DataExportScope; format?: DataExportFormat },
    ): Promise<DataExportView> {
      const scope = dataExportScopeSchema.parse(input.scope ?? 'workspace');
      const format = dataExportFormatSchema.parse(input.format ?? 'json');

      return withIdempotency(deps.kv, ctx, {
        operation: 'data.export.request',
        body: { scope, format },
        resourceIdOf: (view) => view.id,
        run: async () => {
          const view = await authorized(
            deps,
            ctx,
            'analytics.export',
            undefined,
            async (db, actor) => {
              if (actor.userId === null) {
                throw invalid('errors.export_requires_member', {});
              }

              const existing =
                ctx.idempotencyKey === undefined
                  ? null
                  : await db.dataExport.findFirst({
                      where: {
                        workspaceId: ctx.workspaceId,
                        idempotencyKey: ctx.idempotencyKey,
                      },
                      select: DATA_EXPORT_SELECT,
                    });
              if (existing !== null) {
                return toView(existing);
              }

              const created = await db.dataExport.create({
                data: {
                  workspaceId: ctx.workspaceId,
                  requestedByUserId: actor.userId,
                  idempotencyKey: ctx.idempotencyKey ?? null,
                  scope,
                  format,
                  state: 'requested',
                },
                select: DATA_EXPORT_SELECT,
              });
              await recordAudit(db, actor, {
                action: 'data.export.requested',
                targetType: 'data_export',
                targetId: created.id,
                after: { scope, format, state: created.state },
              });
              return toView(created);
            },
            { timeoutMs: 30_000 },
          );

          // Starting a workflow is idempotent by export id. If a Temporal
          // outage occurs the row remains requested and a retry can resume it.
          if (view.state === 'requested' || view.state === 'failed') {
            await deps.scheduler.scheduleDataExport({
              exportId: view.id,
              workspaceId: ctx.workspaceId,
              executeAt: deps.clock.now(),
              workflowInput: {
                ctx: workflowContext(ctx),
                exportId: view.id,
                scope: view.scope,
                format: view.format,
              },
            });
          }
          return view;
        },
      });
    },

    async list(ctx: ActorContext, query: PageQuery = {}): Promise<Paginated<DataExportView>> {
      return authorized(deps, ctx, 'analytics.export', undefined, async (db) => {
        const args = pageArgs(query);
        const rows = await db.dataExport.findMany({
          orderBy: { id: 'desc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: DATA_EXPORT_SELECT,
        });
        return toPage(rows, args, (row) => row.id, toView);
      });
    },

    async get(ctx: ActorContext, exportId: string): Promise<DataExportView> {
      return authorized(deps, ctx, 'analytics.export', undefined, async (db) => {
        const row = await db.dataExport.findFirst({
          where: { id: exportId },
          select: DATA_EXPORT_SELECT,
        });
        if (row === null) {
          throw notFound('data_export', exportId);
        }
        return toView(row);
      });
    },

    build(input) {
      return builder.build(input);
    },

    async download(
      ctx: ActorContext,
      exportId: string,
    ): Promise<{ readonly downloadUrl: string; readonly expiresAt: string }> {
      return authorized(deps, ctx, 'analytics.export', undefined, async (db, actor) => {
        const row = await db.dataExport.findFirst({
          where: { id: exportId },
          select: DATA_EXPORT_SELECT,
        });
        if (row === null) {
          throw notFound('data_export', exportId);
        }
        const now = deps.clock.now();
        try {
          assertStoredExport(row, now);
        } catch (error) {
          if (row.expiresAt !== null && row.expiresAt.getTime() <= now.getTime()) {
            await db.dataExport.update({ where: { id: row.id }, data: { state: 'expired' } });
            await recordAudit(db, actor, {
              action: 'data.export.expired',
              targetType: 'data_export',
              targetId: row.id,
            });
          }
          throw error;
        }

        return {
          downloadUrl: contentUrl(deps.config.core.apiUrl, ctx.workspaceId, row.id),
          expiresAt: row.expiresAt.toISOString(),
        };
      });
    },

    async content(ctx: ActorContext, exportId: string): Promise<DataExportContent> {
      return authorized(deps, ctx, 'analytics.export', undefined, async (db, actor) => {
        const row = await db.dataExport.findFirst({
          where: { id: exportId },
          select: DATA_EXPORT_SELECT,
        });
        if (row === null) throw notFound('data_export', exportId);

        const now = deps.clock.now();
        try {
          assertStoredExport(row, now);
        } catch (error) {
          if (row.expiresAt !== null && row.expiresAt.getTime() <= now.getTime()) {
            await db.dataExport.update({ where: { id: row.id }, data: { state: 'expired' } });
            await recordAudit(db, actor, {
              action: 'data.export.expired',
              targetType: 'data_export',
              targetId: row.id,
            });
          }
          throw error;
        }

        const stored = await deps.storage.head(row.storageKey);
        if (
          stored === null ||
          stored.byteSize !== Number(row.byteSize) ||
          stored.checksumSha256 !== row.checksumSha256
        ) {
          throw invalid('errors.export_unavailable', { reason: 'object_integrity' });
        }
        const encrypted = await deps.storage.read(row.storageKey);
        if (
          encrypted.byteLength !== Number(row.byteSize) ||
          createHash('sha256').update(encrypted).digest('hex') !== row.checksumSha256
        ) {
          throw invalid('errors.export_unavailable', { reason: 'object_integrity' });
        }
        const encryption = deps.exportEncryption;
        if (encryption === undefined) {
          throw invalid('errors.export_unavailable', { reason: 'export_encryption_unavailable' });
        }
        const plaintext = await encryption.decrypt({
          workspaceId: ctx.workspaceId,
          exportId: row.id,
          bytes: encrypted,
        });
        try {
          const parsed: unknown = JSON.parse(Buffer.from(plaintext).toString('utf8'));
          if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
            throw new Error('archive_not_object');
          }
        } catch {
          throw invalid('errors.export_unavailable', { reason: 'archive_invalid' });
        }

        await db.dataExport.update({
          where: { id: row.id },
          data: { state: 'delivered', downloadedAt: now },
        });
        await recordAudit(db, actor, {
          action: 'data.export.downloaded',
          targetType: 'data_export',
          targetId: row.id,
          metadata: { linkTtlSeconds: EXPORT_LINK_TTL_SECONDS, contentType: EXPORT_CONTENT_TYPE },
        });

        return {
          bytes: plaintext,
          contentType: EXPORT_CONTENT_TYPE,
          filename: `relay-workspace-export-${row.id}.json`,
          expiresAt: row.expiresAt.toISOString(),
        };
      });
    },
  };
}
