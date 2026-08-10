import {
  CSV_MANIFEST_PARSER_VERSION,
  bulkImportApplyModeSchema,
  bulkImportOptionsSchema,
  type BulkImportApplyMode,
  type BulkImportJobView,
  type BulkImportReport,
  type BulkImportRowState,
  type BulkImportRowView,
  type Paginated,
} from '@relay/contracts';
import { createHash } from 'node:crypto';

import type {
  ActorContext,
  BulkImportService,
  ContentService,
  MediaService,
  PageQuery,
  SchedulingService,
  ServiceDeps,
} from '../types';

import { recordAudit } from '../internal/audit';
import { parseCsvManifest } from '../internal/csv-manifest';
import { invalid, notFound } from '../internal/errors';
import { toJson } from '../internal/json';
import { pageArgs, toPage } from '../internal/pagination';
import { authorized } from '../internal/runtime';
import {
  BULK_IMPORT_JOB_SELECT,
  BULK_IMPORT_ROW_SELECT,
  toColumnReport,
  toErrorReportCsv,
  toIssues,
  toJobView,
  toRowView,
} from './bulk-import-mappers';
import { applyImportRow } from './bulk-import-apply';

/**
 * Bulk CSV import.
 *
 * The shape of the feature is two calls, and the gap between them is the point.
 * `upload` reads the file, decides what each line means, records a verdict per
 * line and reports. It has created no draft and scheduled nothing. `apply` is
 * the second call a person makes after reading that report, and its default
 * mode is drafts.
 *
 * Uploading the same file twice is safe: the manifest checksum plus the
 * workspace resolves to the job that already exists. Applying twice is safe:
 * every line has its own row, unique inside the job, and a row that already
 * produced a draft is found rather than repeated.
 *
 * This service creates nothing by itself. Drafts come from the content service
 * and schedules come from the scheduling service, which are the same two calls
 * the composer and the REST API make. There is no second publishing path here,
 * and there is no path here that publishes at all.
 */

const MAX_MANIFEST_BYTES = 5 * 1024 * 1024;

function checksumOf(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

function manifestStorageKey(workspaceId: string, checksum: string): string {
  return `${workspaceId}/imports/${checksum}.csv`;
}

export function createBulkImportService(
  deps: ServiceDeps,
  content: ContentService,
  scheduling: SchedulingService,
  media: MediaService,
): BulkImportService {
  async function report(ctx: ActorContext, importJobId: string): Promise<BulkImportReport> {
    return authorized(deps, ctx, 'content.read', undefined, async (db) => {
      const job = await db.bulkImportJob.findFirst({
        where: { id: importJobId },
        select: BULK_IMPORT_JOB_SELECT,
      });
      if (job === null) {
        throw notFound('bulk_import', importJobId);
      }
      return {
        job: toJobView(job),
        columns: toColumnReport(job.columnsReport),
        manifestIssues: toIssues(job.manifestIssues),
      };
    });
  }

  return {
    async upload(ctx, input): Promise<BulkImportReport> {
      if (input.content.length > MAX_MANIFEST_BYTES) {
        throw invalid('errors.import_manifest_too_large', { limit: MAX_MANIFEST_BYTES });
      }
      const options = bulkImportOptionsSchema.parse(input.options ?? {});
      const checksum = checksumOf(input.content);
      const now = deps.clock.now();

      const created = await authorized(
        deps,
        ctx,
        'content.write',
        { brandId: input.projectId },
        async (db, actor) => {
          // The same bytes uploaded twice are the same job. Returning the
          // existing one is what stops a double click, a retried request or a
          // second browser tab from producing a parallel set of rows that would
          // later apply the same content again.
          const existing = await db.bulkImportJob.findFirst({
            where: { workspaceId: ctx.workspaceId, manifestChecksum: checksum },
            select: BULK_IMPORT_JOB_SELECT,
          });
          if (existing !== null) {
            return { job: existing, reused: true } as const;
          }

          const project = await db.brand.findFirst({
            where: { id: input.projectId },
            select: { id: true, defaultTimeZone: true },
          });
          if (project === null) {
            throw notFound('brand', input.projectId);
          }
          if (actor.userId === null) {
            throw invalid('errors.import_requires_member', {});
          }

          const zone = options.defaultTimeZone ?? project.defaultTimeZone ?? undefined;
          const manifest = parseCsvManifest(input.content, {
            now,
            options: { ...options, ...(zone === undefined ? {} : { defaultTimeZone: zone }) },
          });

          const valid = manifest.rows.filter((row) => row.payload !== null).length;
          const job = await db.bulkImportJob.create({
            data: {
              workspaceId: ctx.workspaceId,
              brandId: input.projectId,
              state: manifest.columns.missingRequired.length > 0 ? 'failed' : 'validated',
              filename: input.filename.slice(0, 255),
              manifestChecksum: checksum,
              byteSize: BigInt(Buffer.byteLength(input.content, 'utf8')),
              parserVersion: manifest.parserVersion,
              options: toJson(options),
              manifestIssues: toJson(manifest.issues),
              columnsReport: toJson(manifest.columns),
              rowCount: manifest.rows.length,
              validRowCount: valid,
              invalidRowCount: manifest.rows.length - valid,
              appliedRowCount: 0,
              failedRowCount: 0,
              skippedRowCount: 0,
              requestedByUserId: actor.userId,
              idempotencyKey: ctx.idempotencyKey ?? null,
            },
            select: BULK_IMPORT_JOB_SELECT,
          });

          for (const row of manifest.rows) {
            await db.bulkImportRow.create({
              data: {
                workspaceId: ctx.workspaceId,
                bulkImportJobId: job.id,
                externalRowKey: row.externalRowKey.slice(0, 200),
                lineNumber: row.lineNumber,
                state: row.payload === null ? 'invalid' : 'valid',
                payload: row.payload === null ? undefined : toJson(row.payload),
                validation: toJson({
                  status: row.payload === null ? 'invalid' : 'valid',
                  checkedAt: now.toISOString(),
                  parserVersion: manifest.parserVersion,
                }),
                issues: toJson(row.issues),
              },
            });
          }

          await recordAudit(db, actor, {
            action: 'import.uploaded',
            targetType: 'bulk_import',
            targetId: job.id,
            after: {
              filename: job.filename,
              rows: manifest.rows.length,
              valid,
              parserVersion: manifest.parserVersion,
            },
          });
          return { job, reused: false } as const;
        },
        { timeoutMs: 60_000 },
      );

      if (!created.reused) {
        // The manifest is kept so a person can prove later what was uploaded.
        // It is written after the transaction because a storage failure must
        // not lose the parse result a person is already looking at.
        const key = manifestStorageKey(ctx.workspaceId, checksum);
        await deps.storage.write(key, Buffer.from(input.content, 'utf8'), 'text/csv');
        await authorized(deps, ctx, 'content.write', undefined, async (db) => {
          await db.bulkImportJob.update({
            where: { id: created.job.id },
            data: { storageKey: key },
          });
        });
      }

      return report(ctx, created.job.id);
    },

    get(ctx, importJobId) {
      return report(ctx, importJobId);
    },

    async list(
      ctx: ActorContext,
      query: PageQuery & { readonly projectId?: string } = {},
    ): Promise<Paginated<BulkImportJobView>> {
      return authorized(deps, ctx, 'content.read', undefined, async (db) => {
        const args = pageArgs(query);
        const rows = await db.bulkImportJob.findMany({
          where: query.projectId === undefined ? {} : { brandId: query.projectId },
          orderBy: { id: 'desc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: BULK_IMPORT_JOB_SELECT,
        });
        return toPage(rows, args, (row) => row.id, toJobView);
      });
    },

    async listRows(
      ctx: ActorContext,
      importJobId: string,
      query: PageQuery & { readonly state?: BulkImportRowState } = {},
    ): Promise<Paginated<BulkImportRowView>> {
      return authorized(deps, ctx, 'content.read', undefined, async (db) => {
        const args = pageArgs(query);
        const rows = await db.bulkImportRow.findMany({
          where: {
            bulkImportJobId: importJobId,
            ...(query.state === undefined ? {} : { state: query.state }),
          },
          orderBy: { id: 'asc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: BULK_IMPORT_ROW_SELECT,
        });
        return toPage(rows, args, (row) => row.id, toRowView);
      });
    },

    /**
     * Apply the valid rows.
     *
     * The mode is parsed rather than defaulted in a branch, so "drafts unless
     * someone explicitly said otherwise" is one line rather than a habit. Rows
     * are applied one at a time and a failure is written to the row that caused
     * it: one bad line cannot stop the line after it.
     */
    async apply(ctx, input): Promise<BulkImportReport> {
      const mode: BulkImportApplyMode = bulkImportApplyModeSchema.parse(input.mode ?? 'drafts');
      if (mode === 'scheduled') {
        // Scheduling from a manifest is a separate, consequential decision, so
        // it is checked against the scheduling permission before anything runs.
        await authorized(deps, ctx, 'post.schedule', undefined, async () => undefined);
      }

      const pending = await authorized(deps, ctx, 'content.write', undefined, async (db) => {
        const job = await db.bulkImportJob.findFirst({
          where: { id: input.importJobId },
          select: BULK_IMPORT_JOB_SELECT,
        });
        if (job === null) {
          throw notFound('bulk_import', input.importJobId);
        }
        if (job.state === 'failed') {
          throw invalid('errors.import_not_applicable', { importJobId: job.id });
        }
        const rows = await db.bulkImportRow.findMany({
          where: { bulkImportJobId: job.id, state: { in: ['valid', 'failed'] } },
          orderBy: { id: 'asc' },
          select: BULK_IMPORT_ROW_SELECT,
        });
        return { projectId: job.brandId, rows: rows.map(toRowView) };
      });

      for (const row of pending.rows) {
        const outcome = await applyImportRow({
          deps,
          ctx,
          content,
          scheduling,
          media,
          projectId: pending.projectId,
          importJobId: input.importJobId,
          mode,
          row,
        });
        await authorized(deps, ctx, 'content.write', undefined, async (db) => {
          await db.bulkImportRow.update({
            where: { id: row.id },
            data: {
              state: outcome.state,
              issues: toJson(outcome.issues),
              ...(outcome.contentItemId === null ? {} : { contentItemId: outcome.contentItemId }),
              ...(outcome.publishJobId === null ? {} : { publishJobId: outcome.publishJobId }),
              ...(outcome.state === 'applied' ? { appliedAt: deps.clock.now() } : {}),
            },
          });
        });
      }

      return authorized(deps, ctx, 'content.write', undefined, async (db, actor) => {
        const grouped = await db.bulkImportRow.groupBy({
          by: ['state'],
          where: { bulkImportJobId: input.importJobId },
          _count: { _all: true },
        });
        const countOf = (state: string): number =>
          grouped.find((entry) => entry.state === state)?._count._all ?? 0;

        const job = await db.bulkImportJob.update({
          where: { id: input.importJobId },
          data: {
            state: 'applied',
            applyMode: mode,
            appliedAt: deps.clock.now(),
            ...(actor.userId === null ? {} : { appliedByUserId: actor.userId }),
            appliedRowCount: countOf('applied'),
            failedRowCount: countOf('failed'),
            skippedRowCount: countOf('skipped'),
            invalidRowCount: countOf('invalid'),
            validRowCount: countOf('valid'),
          },
          select: BULK_IMPORT_JOB_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'import.applied',
          targetType: 'bulk_import',
          targetId: job.id,
          after: { mode, applied: countOf('applied'), failed: countOf('failed') },
        });
        return {
          job: toJobView(job),
          columns: toColumnReport(job.columnsReport),
          manifestIssues: toIssues(job.manifestIssues),
        };
      });
    },

    async errorReport(ctx, importJobId) {
      return authorized(deps, ctx, 'content.read', undefined, async (db) => {
        const job = await db.bulkImportJob.findFirst({
          where: { id: importJobId },
          select: BULK_IMPORT_JOB_SELECT,
        });
        if (job === null) {
          throw notFound('bulk_import', importJobId);
        }
        const rows = await db.bulkImportRow.findMany({
          where: { bulkImportJobId: importJobId, state: { in: ['invalid', 'failed'] } },
          orderBy: { id: 'asc' },
          take: 5_000,
          select: BULK_IMPORT_ROW_SELECT,
        });
        return {
          filename: `import-errors-${job.id}.csv`,
          csv: toErrorReportCsv(rows.map(toRowView), toIssues(job.manifestIssues)),
        };
      });
    },
  };
}

export { CSV_MANIFEST_PARSER_VERSION };
