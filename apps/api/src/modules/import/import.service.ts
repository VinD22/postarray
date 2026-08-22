import { Inject, Injectable } from '@nestjs/common';
import type {
  BulkImportJobView,
  BulkImportReport,
  BulkImportRowView,
  Paginated,
} from '@relay/contracts';

import type { ActorContext, Services } from '../../application/port';
import { SERVICES } from '../../application/tokens';
import type { ListImportRowsQuery, ListImportsQuery, UploadImportInput } from './import.schemas';

/**
 * Transport-level delegation for bulk import.
 *
 * The parser, the checksum lookup, the per-row idempotency and the audit append
 * all live behind `services.bulkImports`. This class turns a request into that
 * call and nothing else.
 */
@Injectable()
export class ImportService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  upload(ctx: ActorContext, input: UploadImportInput): Promise<BulkImportReport> {
    return this.services.bulkImports.upload(ctx, {
      projectId: input.projectId,
      filename: input.filename,
      content: input.content,
      ...(input.options === undefined ? {} : { options: input.options }),
    });
  }

  get(ctx: ActorContext, importJobId: string): Promise<BulkImportReport> {
    return this.services.bulkImports.get(ctx, importJobId);
  }

  list(ctx: ActorContext, query: ListImportsQuery): Promise<Paginated<BulkImportJobView>> {
    const { cursor, limit, projectId } = query;
    return this.services.bulkImports.list(ctx, {
      ...(cursor === undefined ? {} : { cursor }),
      ...(limit === undefined ? {} : { limit }),
      ...(projectId === undefined ? {} : { projectId }),
    });
  }

  listRows(
    ctx: ActorContext,
    importJobId: string,
    query: ListImportRowsQuery,
  ): Promise<Paginated<BulkImportRowView>> {
    const { cursor, limit, state } = query;
    return this.services.bulkImports.listRows(ctx, importJobId, {
      ...(cursor === undefined ? {} : { cursor }),
      ...(limit === undefined ? {} : { limit }),
      ...(state === undefined ? {} : { state }),
    });
  }

  applyAsDrafts(ctx: ActorContext, importJobId: string): Promise<BulkImportReport> {
    return this.services.bulkImports.apply(ctx, { importJobId, mode: 'drafts' });
  }

  applyAsScheduled(ctx: ActorContext, importJobId: string): Promise<BulkImportReport> {
    return this.services.bulkImports.apply(ctx, { importJobId, mode: 'scheduled' });
  }

  errorReport(
    ctx: ActorContext,
    importJobId: string,
  ): Promise<{ readonly filename: string; readonly csv: string }> {
    return this.services.bulkImports.errorReport(ctx, importJobId);
  }
}
