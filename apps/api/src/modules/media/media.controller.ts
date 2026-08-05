import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import type { OperationRef, Paginated } from '@relay/contracts';

import type { ActorContext, MediaAssetView } from '../../application/port.js';
import { Actor, Idempotent, RateLimit, RequireScope } from '../../common/decorators.js';
import { mediaIdSchema } from '../../common/schemas.js';
import { parseBody, parseParams, parseQuery } from '../../common/zod.js';
import {
  createUploadUrlSchema,
  editMediaSchema,
  importFromUrlSchema,
  listMediaQuerySchema,
  setAltTextSchema,
} from './media.schemas.js';
import { MediaService } from './media.service.js';

/**
 * The media library.
 *
 * V1 accepts finished media and never generates it. There is no image or video
 * generation endpoint, entitlement or usage meter here, and adding one is a
 * product decision, not a refactor.
 *
 * Editing is non-generative by construction: crop, resize, rotate and compress.
 * Every derivative is re-encoded, which also strips metadata, so an EXIF GPS
 * tag cannot ride along into a published photo.
 */
@Controller('v1/media')
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Get()
  @RequireScope('media:read')
  list(@Actor() actor: ActorContext, @Query() query: unknown): Promise<Paginated<MediaAssetView>> {
    return this.media.list(actor, parseQuery(listMediaQuerySchema, query));
  }

  @Get(':id')
  @RequireScope('media:read')
  get(@Actor() actor: ActorContext, @Param('id') id: string): Promise<MediaAssetView> {
    return this.media.get(actor, parseParams(mediaIdSchema, id));
  }

  /**
   * A short-lived signed URL scoped to one object key, one content type and one
   * maximum size. Issued only after the plan and quota check passes, so a
   * workspace cannot fill storage it is not entitled to.
   */
  @Post('uploads')
  @RequireScope('media:write')
  @Idempotent()
  @RateLimit({ limit: 120, windowSeconds: 60 })
  @HttpCode(201)
  createUploadUrl(
    @Actor() actor: ActorContext,
    @Body() body: unknown,
  ): Promise<{ uploadUrl: string; mediaId: string; headers: Readonly<Record<string, string>> }> {
    return this.media.createUploadUrl(actor, parseBody(createUploadUrlSchema, body));
  }

  /**
   * Hand the asset to the processing pipeline. It stays `scanning` and unusable
   * until MIME sniffing, checksum verification, the malware scan and metadata
   * extraction have all completed. No user-uploaded byte is served to anyone
   * before that.
   */
  @Post(':id/finalize')
  @RequireScope('media:write')
  @Idempotent()
  @HttpCode(202)
  finalize(@Actor() actor: ActorContext, @Param('id') id: string): Promise<MediaAssetView> {
    return this.media.finalizeUpload(actor, parseParams(mediaIdSchema, id));
  }

  /** Import by URL. Asynchronous, and returns an operation handle to follow. */
  @Post('imports')
  @RequireScope('media:write')
  @Idempotent()
  @RateLimit({ limit: 30, windowSeconds: 60 })
  @HttpCode(202)
  importFromUrl(@Actor() actor: ActorContext, @Body() body: unknown): Promise<OperationRef> {
    return this.media.importFromUrl(actor, parseBody(importFromUrlSchema, body));
  }

  /** Crop, resize, rotate, compress. Nothing generative. */
  @Post(':id/edits')
  @RequireScope('media:write')
  @Idempotent()
  @HttpCode(200)
  edit(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<MediaAssetView> {
    const { ops } = parseBody(editMediaSchema, body);
    return this.media.edit(actor, parseParams(mediaIdSchema, id), ops);
  }

  @Put(':id/alt-text')
  @RequireScope('media:write')
  setAltText(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<MediaAssetView> {
    const input = parseBody(setAltTextSchema, body);
    return this.media.setAltText(actor, parseParams(mediaIdSchema, id), input);
  }

  @Delete(':id')
  @RequireScope('media:write')
  @HttpCode(204)
  async delete(@Actor() actor: ActorContext, @Param('id') id: string): Promise<void> {
    await this.media.delete(actor, parseParams(mediaIdSchema, id));
  }
}
