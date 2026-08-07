import {
  dataExportFormatSchema,
  dataExportScopeSchema,
  RelayError,
  type DataExportFormat,
  type DataExportScope,
} from '@relay/contracts';

import type {
  ActorContext,
  DataExportBuildResult,
  DataExportEncryptionPort,
  ServiceDeps,
  WorkflowActorContext,
} from '../types';

import { recordAudit } from '../internal/audit';
import { invalid, notFound } from '../internal/errors';
import { runInWorkspace } from '../internal/runtime';
import { readDataExportArchive } from './data-export-archive';

const EXPORT_TTL_DAYS = 7;
const EXPORT_MAX_PLAINTEXT_BYTES = 100 * 1024 * 1024;
const EXPORT_CONTENT_TYPE = 'application/octet-stream';
const EXPORT_PREFIX = 'exports';

const DATA_EXPORT_SELECT = {
  id: true,
  workspaceId: true,
  scope: true,
  format: true,
  state: true,
  storageKey: true,
  byteSize: true,
  checksumSha256: true,
  expiresAt: true,
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
  expiresAt: Date | null;
};

export const DATA_EXPORT_TTL_DAYS = EXPORT_TTL_DAYS;
export const DATA_EXPORT_MAX_PLAINTEXT_BYTES = EXPORT_MAX_PLAINTEXT_BYTES;

export interface DataExportBuilder {
  build(input: {
    readonly ctx: WorkflowActorContext;
    readonly exportId: string;
    readonly scope: DataExportScope;
    readonly format: DataExportFormat;
  }): Promise<DataExportBuildResult>;
}

function systemContext(input: WorkflowActorContext): ActorContext {
  return {
    actorType: 'system',
    actorId: 'data-export-worker',
    workspaceId: input.workspaceId,
    scopes: [],
    surface: 'automation_rule',
    correlationId: input.correlationId,
    approvalLevel: 'level_3_confirm',
    locale: input.locale,
  };
}

function storageKey(workspaceId: string, exportId: string): string {
  return `${workspaceId}/${EXPORT_PREFIX}/${exportId}.relay.json.enc`;
}

function toResult(row: DataExportRow): DataExportBuildResult {
  return {
    state: row.state === 'ready' || row.state === 'delivered' ? 'ready' : 'failed',
    byteSize: row.byteSize === null ? null : Number(row.byteSize),
    checksumSha256: row.checksumSha256,
  };
}

function isReady(row: DataExportRow, now: Date): boolean {
  return (
    (row.state === 'ready' || row.state === 'delivered') &&
    row.storageKey !== null &&
    row.byteSize !== null &&
    row.checksumSha256 !== null &&
    row.expiresAt !== null &&
    row.expiresAt.getTime() > now.getTime()
  );
}

async function markFailed(
  deps: ServiceDeps,
  ctx: ActorContext,
  exportId: string,
  error: RelayError,
): Promise<void> {
  await runInWorkspace(deps, ctx, async (db, actor) => {
    const updated = await db.dataExport.updateMany({
      where: { id: exportId, state: { in: ['requested', 'building', 'failed', 'expired'] } },
      data: { state: 'failed', failureNote: error.code },
    });
    if (updated.count === 0) return;
    await recordAudit(db, actor, {
      action: 'data.export.failed',
      targetType: 'data_export',
      targetId: exportId,
      metadata: { code: error.code },
    });
  });
}

function archiveBytes(archive: Readonly<Record<string, unknown>>): Uint8Array {
  return Buffer.from(JSON.stringify(archive), 'utf8');
}

function expiresAt(now: Date): Date {
  return new Date(now.getTime() + EXPORT_TTL_DAYS * 24 * 60 * 60 * 1_000);
}

export function createDataExportBuilder(deps: ServiceDeps): DataExportBuilder {
  return {
    async build(input): Promise<DataExportBuildResult> {
      const scope = dataExportScopeSchema.parse(input.scope);
      const format = dataExportFormatSchema.parse(input.format);
      const ctx = systemContext(input.ctx);

      try {
        const existing = await runInWorkspace(deps, ctx, async (db) =>
          db.dataExport.findFirst({
            where: { id: input.exportId },
            select: DATA_EXPORT_SELECT,
          }),
        );
        if (existing === null) {
          throw notFound('data_export', input.exportId, ctx.correlationId);
        }
        const row = existing as DataExportRow;
        if (row.workspaceId !== ctx.workspaceId || row.scope !== scope || row.format !== format) {
          throw notFound('data_export', input.exportId, ctx.correlationId);
        }

        const now = deps.clock.now();
        if (isReady(row, now) && row.storageKey !== null) {
          const object = await deps.storage.head(row.storageKey);
          if (
            object !== null &&
            object.byteSize === Number(row.byteSize) &&
            object.checksumSha256 === row.checksumSha256
          ) {
            return toResult(row);
          }
        }

        await runInWorkspace(deps, ctx, async (db, actor) => {
          await db.dataExport.updateMany({
            where: {
              id: input.exportId,
              state: { in: ['requested', 'building', 'failed', 'expired'] },
            },
            data: { state: 'building', failureNote: null },
          });
          await recordAudit(db, actor, {
            action: 'data.export.building',
            targetType: 'data_export',
            targetId: input.exportId,
          });
        });

        const archive = await runInWorkspace(deps, ctx, (db) =>
          readDataExportArchive(db, {
            workspaceId: ctx.workspaceId,
            exportId: input.exportId,
            generatedAt: deps.clock.now().toISOString(),
          }),
        );
        const plaintext = archiveBytes(archive);
        if (plaintext.byteLength > EXPORT_MAX_PLAINTEXT_BYTES) {
          throw invalid('errors.export_unavailable', {
            reason: 'archive_size_limit',
            limitBytes: EXPORT_MAX_PLAINTEXT_BYTES,
          });
        }
        const encryption: DataExportEncryptionPort | undefined = deps.exportEncryption;
        if (encryption === undefined) {
          throw new RelayError('CAPABILITY_NOT_IMPLEMENTED', {
            messageKey: 'errors.capability_not_implemented',
            details: { activity: 'buildDataExport', reason: 'export_encryption_unavailable' },
          });
        }
        const encrypted = await encryption.encrypt({
          workspaceId: ctx.workspaceId,
          exportId: input.exportId,
          plaintext,
        });
        const stored = await deps.storage.write(
          storageKey(ctx.workspaceId, input.exportId),
          encrypted.bytes,
          EXPORT_CONTENT_TYPE,
        );
        const readyAt = deps.clock.now();
        const expiry = expiresAt(readyAt);
        await runInWorkspace(deps, ctx, async (db, actor) => {
          await db.dataExport.update({
            where: { id: input.exportId },
            data: {
              state: 'ready',
              storageBucket: deps.config.neon.storageBucket,
              storageKey: stored.key,
              byteSize: BigInt(stored.byteSize),
              checksumSha256: stored.checksumSha256,
              expiresAt: expiry,
              failureNote: null,
            },
          });
          await recordAudit(db, actor, {
            action: 'data.export.ready',
            targetType: 'data_export',
            targetId: input.exportId,
            after: {
              state: 'ready',
              byteSize: stored.byteSize,
              checksumSha256: stored.checksumSha256,
              expiresAt: expiry.toISOString(),
            },
            metadata: { keyVersion: encrypted.keyVersion },
          });
        });
        return {
          state: 'ready',
          byteSize: stored.byteSize,
          checksumSha256: stored.checksumSha256,
        };
      } catch (cause: unknown) {
        const error = RelayError.fromUnknown(cause, ctx.correlationId);
        try {
          await markFailed(deps, ctx, input.exportId, error);
        } catch {
          throw error;
        }
        return { state: 'failed', byteSize: null, checksumSha256: null };
      }
    },
  };
}
