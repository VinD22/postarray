import { Inject, Injectable } from '@nestjs/common';
import type { OperationRef, Paginated } from '@relay/contracts';

import type { MediaDerivativeOperation } from '@relay/contracts';

import type {
  ActorContext,
  CursorQuery,
  MediaAssetView,
  MediaDerivativeRequest,
  MediaDerivativeView,
  Services,
} from '../../application/port';
import { SERVICES } from '../../application/tokens';
import type { CreateUploadUrlInput, DeclareRightsInput } from './media.schemas';

/** Transport-level delegation for the media library. */
@Injectable()
export class MediaService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  createUploadUrl(
    ctx: ActorContext,
    input: CreateUploadUrlInput,
  ): Promise<{
    uploadUrl: string;
    mediaId: string;
    method: 'PUT' | 'POST';
    headers: Readonly<Record<string, string>>;
    expiresAt: string;
    retentionExpiresAt: string;
  }> {
    return this.services.media.createUploadUrl(ctx, input);
  }

  finalizeUpload(ctx: ActorContext, mediaId: string): Promise<MediaAssetView> {
    return this.services.media.finalizeUpload(ctx, mediaId);
  }

  acceptDirectUpload(
    ctx: ActorContext,
    input: {
      storageKey: string;
      contentType: string;
      checksumSha256: string;
      bytes: Uint8Array;
    },
  ): Promise<{ byteSize: number }> {
    return this.services.media.acceptDirectUpload(ctx, input);
  }

  readObjectForDownload(
    ctx: ActorContext,
    input: { storageKey: string },
  ): Promise<{ bytes: Uint8Array; contentType: string }> {
    return this.services.media.readObjectForDownload(ctx, input);
  }

  importFromUrl(
    ctx: ActorContext,
    input: { url: string; brandId?: string | null },
  ): Promise<OperationRef> {
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

  /** Crop, rotate, resize, convert, compress. The original stays untouched. */
  edit(
    ctx: ActorContext,
    mediaId: string,
    ops: readonly MediaDerivativeOperation[],
  ): Promise<MediaDerivativeRequest> {
    return this.services.media.edit(ctx, { mediaId, ops });
  }

  listDerivatives(ctx: ActorContext, mediaId: string): Promise<readonly MediaDerivativeView[]> {
    return this.services.media.listDerivatives(ctx, mediaId);
  }

  setAltText(
    ctx: ActorContext,
    mediaId: string,
    input: {
      altText: string | null;
      waived?: boolean;
      waivedReason?: string | null;
    },
  ): Promise<MediaAssetView> {
    return this.services.media.setAltText(ctx, { mediaId, ...input });
  }

  declareRights(
    ctx: ActorContext,
    mediaId: string,
    input: DeclareRightsInput,
  ): Promise<MediaAssetView> {
    return this.services.media.declareRights(ctx, { mediaId, ...input });
  }
}
