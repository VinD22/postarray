import { z } from 'zod';

import { RESOURCE_URIS, defineTool, pageInputShape, resourceLink } from './registry';
import type { ToolDefinition, ToolResult } from './registry';
import type { MediaAssetSummary } from '../ports';

/**
 * Read tools for the media library.
 *
 * They live in their own file rather than in `read.ts` only because that file
 * is already at its size limit; every tool here is `risk: 'read'` and changes
 * nothing. There is no generative media in this product, so there is no tool
 * here that produces an image or a video: an asset exists because a person
 * uploaded it or because `import_media` fetched a URL they supplied.
 *
 * A missing dimension, duration or alt text is `null`, never `0` and never an
 * invented value. `scan_state` travels with every row so an agent never treats
 * an unscanned asset as safe to attach.
 */

function mediaRow(asset: MediaAssetSummary): Record<string, unknown> {
  return {
    media_id: asset.id,
    project_id: asset.projectId,
    kind: asset.kind,
    mime_type: asset.mimeType,
    byte_size: asset.byteSize,
    width: asset.width,
    height: asset.height,
    duration_ms: asset.durationMs,
    file_name: asset.fileName,
    alt_text: asset.altText,
    scan_state: asset.scanState,
    origin_kind: asset.originKind,
    origin_url: asset.originUrl,
    retention_expires_at: asset.retentionExpiresAt,
    storage_available: asset.storageAvailable,
    created_at: asset.createdAt,
  };
}

export const getMediaTool = defineTool({
  name: 'get_media',
  risk: 'read',
  summary:
    'Read one media asset: its type, dimensions, alt text, scan state and how long it is retained.',
  sideEffects: 'none',
  scopes: ['media:read'],
  approvalLevel: 'level_0_read',
  requiresIdempotencyKey: false,
  requiresHumanConfirmation: false,
  inputSchema: z.object({ media_id: z.string().min(1) }),
  async run(context, input): Promise<ToolResult> {
    const asset = await context.services.media.get(context.actor, input.media_id);
    return {
      data: mediaRow(asset),
      resourceLinks: [
        resourceLink(RESOURCE_URIS.media(asset.id), 'media asset', 'The stored asset.'),
      ],
    };
  },
});

export const listMediaTool = defineTool({
  name: 'list_media',
  risk: 'read',
  summary: 'List media assets in this workspace, newest first, as a bounded page.',
  sideEffects: 'none',
  scopes: ['media:read'],
  approvalLevel: 'level_0_read',
  requiresIdempotencyKey: false,
  requiresHumanConfirmation: false,
  inputSchema: z.object({
    project_id: z.string().min(1).optional(),
    kind: z.string().min(1).max(32).optional(),
    ...pageInputShape,
  }),
  async run(context, input): Promise<ToolResult> {
    const page = await context.services.media.list(context.actor, {
      ...(input.project_id === undefined ? {} : { projectId: input.project_id }),
      ...(input.kind === undefined ? {} : { kind: input.kind }),
      ...(input.cursor === undefined ? {} : { cursor: input.cursor }),
      limit: input.limit,
    });
    return {
      data: {
        media: page.data.map(mediaRow),
        next_cursor: page.pageInfo.nextCursor,
        has_more: page.pageInfo.hasMore,
      },
      resourceLinks: page.data.map((asset) =>
        resourceLink(RESOURCE_URIS.media(asset.id), asset.fileName ?? asset.id, 'A stored asset.'),
      ),
    };
  },
});

export const MEDIA_READ_TOOLS: readonly ToolDefinition[] = [getMediaTool, listMediaTool];
