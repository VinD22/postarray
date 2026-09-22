import { Body, Controller, Get, HttpCode, Inject, Param, Post, Put } from '@nestjs/common';
import type {
  AiSettingsView,
  MediaAnalysisOutcome,
  MediaAnalysisView,
  MediaChecksView,
} from '@relay/application';
import { z } from 'zod';

import type { ActorContext, Services } from '../../application/port';
import { SERVICES } from '../../application/tokens';
import { Actor, RequireScope } from '../../common/decorators';
import { mediaIdSchema } from '../../common/schemas';
import { parseBody, parseParams } from '../../common/zod';

const checksBodySchema = z
  .object({ connectionIds: z.array(z.string().min(1).max(128)).max(30).default([]) })
  .strict();

/**
 * Opt-in image analysis.
 *
 * Transport only. Every route delegates to `services.mediaAnalysis`, the same
 * use case the MCP server and the CLI reach, so the four gates (workspace
 * opt-in, same workspace, scanned clean, rights declared) hold on every
 * surface. Analysis only: there is no route here, or anywhere, that creates
 * an image.
 */
@Controller('v1')
export class MediaAnalysisController {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  @Get('ai/settings')
  @RequireScope('accounts:read')
  settings(@Actor() actor: ActorContext): Promise<AiSettingsView> {
    return this.services.mediaAnalysis.settings(actor);
  }

  @Put('ai/settings')
  @RequireScope('accounts:write')
  updateSettings(@Actor() actor: ActorContext, @Body() body: unknown): Promise<AiSettingsView> {
    return this.services.mediaAnalysis.updateSettings(actor, body);
  }

  @Get('media/:id/analysis')
  @RequireScope('media:read')
  get(@Actor() actor: ActorContext, @Param('id') id: string): Promise<MediaAnalysisView | null> {
    return this.services.mediaAnalysis.get(actor, parseParams(mediaIdSchema, id));
  }

  @Post('media/:id/analysis')
  @RequireScope('media:write')
  @HttpCode(200)
  analyze(@Actor() actor: ActorContext, @Param('id') id: string): Promise<MediaAnalysisOutcome> {
    return this.services.mediaAnalysis.analyze(actor, {
      mediaId: parseParams(mediaIdSchema, id),
    });
  }

  @Post('media/:id/analysis/checks')
  @RequireScope('media:write')
  @HttpCode(200)
  checks(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<MediaChecksView> {
    const parsed = parseBody(checksBodySchema, body ?? {});
    return this.services.mediaAnalysis.checks(actor, {
      mediaId: parseParams(mediaIdSchema, id),
      connectionIds: parsed.connectionIds,
    });
  }
}
