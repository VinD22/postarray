import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';

import type { ActorContext } from '../../application/port';
import { Actor, RequireScope } from '../../common/decorators';
import { dataExportIdSchema } from '../../common/schemas';
import { parseParams } from '../../common/zod';
import { DataService } from './data.service';

/**
 * Streams a decrypted export only after the workspace guard and application
 * authorization have both run. The workspace in the route is intentional:
 * browser navigations cannot attach the workspace header used by JSON calls.
 */
@Controller('v1/workspaces/:workspaceId/data/exports')
export class DataExportContentController {
  constructor(private readonly data: DataService) {}

  @Get(':id/content')
  @RequireScope('analytics:read')
  async content(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<void> {
    const content = await this.data.content(actor, parseParams(dataExportIdSchema, id));
    response.setHeader('content-type', content.contentType);
    response.setHeader('content-disposition', `attachment; filename="${content.filename}"`);
    response.setHeader('cache-control', 'private, no-store');
    response.setHeader('expires', '0');
    response.status(200).send(Buffer.from(content.bytes));
  }
}
