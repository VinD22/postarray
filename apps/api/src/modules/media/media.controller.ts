import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import type { MediaReadUrls, OperationRef, Paginated } from '@relay/contracts';
import type { Request, Response } from 'express';

import type {
  ActorContext,
  MediaAssetView,
  MediaDerivativeRequest,
  MediaDerivativeView,
} from '../../application/port';
import { Actor, Idempotent, RateLimit, RequireScope } from '../../common/decorators';
import { mediaIdSchema } from '../../common/schemas';
import { parseBody, parseParams, parseQuery } from '../../common/zod';
import { readDirectUploadBody } from './direct-upload-body';
import {
  MAX_UPLOAD_BYTES,
  createUploadUrlSchema,
  declareRightsSchema,
  directUploadHeadersSchema,
  editMediaSchema,
  importFromUrlSchema,
  listMediaQuerySchema,
  objectKeyParamsSchema,
  setAltTextSchema,
  toMediaEditOperations,
} from './media.schemas';
import { MediaService } from './media.service';

/** The header `LocalFileStorage` puts on every upload ticket it issues. */
const CHECKSUM_HEADER = 'x-relay-content-sha256';

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
   * Short-lived URLs a browser can load this asset from.
   *
   * Nothing else in the API tells a client where an asset's bytes live, which
   * is why the composer and the library rendered grey rectangles instead of
   * pictures. Renditions that do not exist come back null rather than as a
   * guessed URL, and every link carries the instant it stops working so a
   * client can refresh before an image breaks.
   */
  @Get(':id/read-urls')
  @RequireScope('media:read')
  getReadUrls(@Actor() actor: ActorContext, @Param('id') id: string): Promise<MediaReadUrls> {
    return this.media.getReadUrls(actor, parseParams(mediaIdSchema, id));
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
  ): Promise<{
    uploadUrl: string;
    mediaId: string;
    method: 'PUT' | 'POST';
    headers: Readonly<Record<string, string>>;
    expiresAt: string;
    retentionExpiresAt: string;
  }> {
    return this.media.createUploadUrl(actor, parseBody(createUploadUrlSchema, body));
  }

  /**
   * The other end of a local upload ticket.
   *
   * A deployment with object storage hands out a presigned PUT and never
   * reaches this route; the application service refuses unless the configured
   * adapter is the local filesystem one, so this cannot become a second,
   * unsigned write path in production. It exists because the local adapter
   * points its ticket back here, and without it every upload on a developer
   * laptop and in CI silently PUTs into a 404.
   *
   * Nothing in the request is trusted: the workspace in the key must be the
   * caller's, and the content type and checksum headers are compared against
   * the pending asset row the ticket was issued for.
   */
  @Put('uploads/:workspaceId/:digest')
  @RequireScope('media:write')
  @RateLimit({ limit: 120, windowSeconds: 60 })
  @HttpCode(200)
  async acceptDirectUpload(
    @Actor() actor: ActorContext,
    @Param() params: unknown,
    @Headers() headers: Record<string, string | undefined>,
    @Req() request: Request,
  ): Promise<{ byteSize: number }> {
    const { workspaceId, digest } = parseParams(objectKeyParamsSchema, params);
    const declared = parseBody(directUploadHeadersSchema, {
      contentType: headers['content-type'],
      checksumSha256: headers[CHECKSUM_HEADER],
    });
    const bytes = await readDirectUploadBody(request, MAX_UPLOAD_BYTES);
    return this.media.acceptDirectUpload(actor, {
      storageKey: `${workspaceId}/${digest}`,
      contentType: declared.contentType,
      checksumSha256: declared.checksumSha256,
      bytes,
    });
  }

  /** The read half of the same local-only pair. */
  @Get('objects/:workspaceId/:digest')
  @RequireScope('media:read')
  async readObject(
    @Actor() actor: ActorContext,
    @Param() params: unknown,
    @Res() response: Response,
  ): Promise<void> {
    const { workspaceId, digest } = parseParams(objectKeyParamsSchema, params);
    const object = await this.media.readObjectForDownload(actor, {
      storageKey: `${workspaceId}/${digest}`,
    });
    response.setHeader('content-type', object.contentType);
    response.setHeader('content-length', String(object.bytes.byteLength));
    // User-supplied bytes: never sniffed, never cached by a shared proxy.
    response.setHeader('x-content-type-options', 'nosniff');
    response.setHeader('cache-control', 'private, no-store');
    response.status(200).end(Buffer.from(object.bytes));
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

  /** Import by URL and return the completed, replay-safe operation handle. */
  @Post('imports')
  @RequireScope('media:write')
  @Idempotent()
  @RateLimit({ limit: 30, windowSeconds: 60 })
  @HttpCode(200)
  importFromUrl(@Actor() actor: ActorContext, @Body() body: unknown): Promise<OperationRef> {
    return this.media.importFromUrl(actor, parseBody(importFromUrlSchema, body));
  }

  /**
   * Crop, rotate, resize, convert, compress. Nothing generative.
   *
   * The original is never overwritten. This returns a derivative handle: `ready`
   * when the same edit was already produced, in which case nothing is
   * reprocessed, and `processing` when the worker has been handed the transform
   * and no derivative exists yet. A derivative that does not exist is reported
   * as null, never as an empty placeholder.
   */
  @Post(':id/edits')
  @RequireScope('media:write')
  @Idempotent()
  @HttpCode(200)
  edit(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<MediaDerivativeRequest> {
    const input = parseBody(editMediaSchema, body);
    return this.media.edit(actor, parseParams(mediaIdSchema, id), toMediaEditOperations(input));
  }

  /** Every derivative of one asset. The original is always addressable too. */
  @Get(':id/derivatives')
  @RequireScope('media:read')
  async listDerivatives(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
  ): Promise<{ data: readonly MediaDerivativeView[] }> {
    return { data: await this.media.listDerivatives(actor, parseParams(mediaIdSchema, id)) };
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

  @Put(':id/rights')
  @RequireScope('media:write')
  declareRights(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<MediaAssetView> {
    return this.media.declareRights(
      actor,
      parseParams(mediaIdSchema, id),
      parseBody(declareRightsSchema, body),
    );
  }

  @Delete(':id')
  @RequireScope('media:write')
  @HttpCode(204)
  async delete(@Actor() actor: ActorContext, @Param('id') id: string): Promise<void> {
    await this.media.delete(actor, parseParams(mediaIdSchema, id));
  }
}
