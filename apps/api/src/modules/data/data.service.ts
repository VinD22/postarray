import { Inject, Injectable } from '@nestjs/common';
import type { DataExportView, DeletionRequestView } from '@relay/application';
import type { Paginated } from '@relay/contracts';

import type { ActorContext, CursorQuery, Services } from '../../application/port';
import { SERVICES } from '../../application/tokens';
import type { RequestDataExportInput, RequestDeletionInput } from './data.schemas';

@Injectable()
export class DataService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  request(ctx: ActorContext, input: RequestDataExportInput): Promise<DataExportView> {
    return this.services.dataExports.request(ctx, input);
  }

  list(ctx: ActorContext, query: CursorQuery): Promise<Paginated<DataExportView>> {
    return this.services.dataExports.list(ctx, query);
  }

  get(ctx: ActorContext, exportId: string): Promise<DataExportView> {
    return this.services.dataExports.get(ctx, exportId);
  }

  download(
    ctx: ActorContext,
    exportId: string,
  ): Promise<{ readonly downloadUrl: string; readonly expiresAt: string }> {
    return this.services.dataExports.download(ctx, exportId);
  }

  requestDeletion(ctx: ActorContext, input: RequestDeletionInput): Promise<DeletionRequestView> {
    return this.services.dataLifecycle.request(ctx, input);
  }

  currentDeletion(ctx: ActorContext): Promise<DeletionRequestView | null> {
    return this.services.dataLifecycle.current(ctx);
  }

  getDeletion(ctx: ActorContext, requestId: string): Promise<DeletionRequestView> {
    return this.services.dataLifecycle.get(ctx, requestId);
  }

  cancelDeletion(ctx: ActorContext, requestId: string): Promise<DeletionRequestView> {
    return this.services.dataLifecycle.cancel(ctx, requestId);
  }
}
