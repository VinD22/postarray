import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import type { DataExportView } from '@relay/application';
import type { Paginated } from '@relay/contracts';

import type { ActorContext } from '../../application/port';
import { Actor, Idempotent, RequireScope } from '../../common/decorators';
import { dataExportIdSchema } from '../../common/schemas';
import { parseBody, parseParams, parseQuery } from '../../common/zod';
import {
  listDataExportsQuerySchema,
  requestDataExportSchema,
  type RequestDataExportInput,
} from './data.schemas';
import { DataService } from './data.service';

/** Workspace data rights. The worker allow-list excludes credentials and raw provider payloads. */
@Controller('v1/data/exports')
export class DataController {
  constructor(private readonly data: DataService) {}

  @Get()
  @RequireScope('analytics:read')
  list(@Actor() actor: ActorContext, @Query() query: unknown): Promise<Paginated<DataExportView>> {
    return this.data.list(actor, parseQuery(listDataExportsQuerySchema, query));
  }

  @Post()
  @RequireScope('analytics:read')
  @Idempotent()
  @HttpCode(202)
  request(@Actor() actor: ActorContext, @Body() body: unknown): Promise<DataExportView> {
    const input: RequestDataExportInput = parseBody(requestDataExportSchema, body);
    return this.data.request(actor, input);
  }

  @Get(':id')
  @RequireScope('analytics:read')
  get(@Actor() actor: ActorContext, @Param('id') id: string): Promise<DataExportView> {
    return this.data.get(actor, parseParams(dataExportIdSchema, id));
  }

  @Get(':id/download')
  @RequireScope('analytics:read')
  download(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
  ): Promise<{ readonly downloadUrl: string; readonly expiresAt: string }> {
    return this.data.download(actor, parseParams(dataExportIdSchema, id));
  }
}
