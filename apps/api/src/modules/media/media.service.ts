import { Inject, Injectable } from '@nestjs/common';
import type { OperationRef, Paginated } from '@relay/contracts';

import type {
  ActorContext,
  CursorQuery,
  MediaAssetView,
  Services,
  ViewModel,
} from '../../application/port';
import { SERVICES } from '../../application/tokens';
import type { CreateUploadUrlInput } from './media.schemas';

/** Transport-level delegation for the media library. */
@Injectable()
export class MediaService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  createUploadUrl(
    ctx: ActorContext,
    input: CreateUploadUrlInput,
  ): Promise<{ uploadUrl: string; mediaId: string; headers: Readonly<Record<string, string>> }> {
    return this.services.media.createUploadUrl(ctx, input);
  }

  finalizeUpload(ctx: ActorContext, mediaId: string): Promise<MediaAssetView> {
    return this.services.media.finalizeUpload(ctx, mediaId);
  }

  importFromUrl(ctx: ActorContext, input: { url: string; brandId: string }): Promise<OperationRef> {
    return this.services.media.importFromUrl(ctx, input);
  }

  list(
    ctx: ActorContext,
    query: CursorQuery & { brandId?: string; kind?: string },
  ): Promise<Paginated<MediaAssetView>> {
    return this.services.media.list(ctx, query);
  }

  get(ctx: ActorContext, mediaId: string): Promise<MediaAssetView> {
    return this.services.media.get(ctx, mediaId);
  }

  delete(ctx: ActorContext, mediaId: string): Promise<void> {
    return this.services.media.delete(ctx, mediaId);
  }

  edit(ctx: ActorContext, mediaId: string, ops: readonly ViewModel[]): Promise<MediaAssetView> {
    return this.services.media.edit(ctx, { mediaId, ops });
  }

  setAltText(
    ctx: ActorContext,
    mediaId: string,
    input: { altText: string | null; waived?: boolean },
  ): Promise<MediaAssetView> {
    return this.services.media.setAltText(ctx, { mediaId, ...input });
  }
}
