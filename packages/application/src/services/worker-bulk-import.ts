import type {
  ActorContext,
  BulkImportService,
  ServiceDeps,
  WorkerBulkImportService,
  WorkflowActorContext,
} from '../types';
import type { BulkImportWorkflowOutput } from '../types';

import { notFound } from '../internal/errors';
import { runInWorkspace } from '../internal/runtime';
import { BULK_IMPORT_JOB_SELECT, toCounts, toJobView } from './bulk-import-mappers';

/**
 * The worker-facing half of bulk import.
 *
 * It is a thin adapter, not a second implementation. Validation already
 * happened at upload, so `validate` reads back what the parser concluded rather
 * than parsing again: re-reading a file under a possibly newer parser inside a
 * workflow would silently change a person's report after they read it.
 * `applyRows` calls the same `apply` a person's own click calls.
 *
 * Both are safe to retry, which is what an activity needs: the manifest
 * checksum makes the job stable and the per-row key makes each line stable.
 */

function context(ctx: WorkflowActorContext): ActorContext {
  return { ...ctx, scopes: [], actorType: ctx.actorType };
}

export function createWorkerBulkImportService(
  deps: ServiceDeps,
  bulkImports: BulkImportService,
): WorkerBulkImportService {
  async function snapshot(
    ctx: WorkflowActorContext,
    importJobId: string,
  ): Promise<BulkImportWorkflowOutput> {
    return runInWorkspace(deps, context(ctx), async (db) => {
      const job = await db.bulkImportJob.findFirst({
        where: { id: importJobId, workspaceId: ctx.workspaceId },
        select: BULK_IMPORT_JOB_SELECT,
      });
      if (job === null) {
        throw notFound('bulk_import', importJobId, ctx.correlationId);
      }
      return { importJobId, state: toJobView(job).state, counts: toCounts(job) };
    });
  }

  return {
    validate(ctx, input) {
      return snapshot(ctx, input.importJobId);
    },

    async applyRows(ctx, input) {
      await bulkImports.apply(context(ctx), { importJobId: input.importJobId, mode: input.mode });
      return snapshot(ctx, input.importJobId);
    },
  };
}
