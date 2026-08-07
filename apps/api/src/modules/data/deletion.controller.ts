import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import type { DeletionRequestView } from '@relay/application';

import type { ActorContext } from '../../application/port';
import { Actor, Idempotent, RequireStepUp } from '../../common/decorators';
import { deletionRequestIdSchema } from '../../common/schemas';
import { parseBody, parseParams } from '../../common/zod';
import { requestDeletionSchema, type RequestDeletionInput } from './data.schemas';
import { DataService } from './data.service';

/**
 * Workspace closure is intentionally not scope-delegable. The application
 * service enforces the owner-only `workspace.delete` permission; this route
 * adds fresh step-up proof before accepting the irreversible request.
 */
@Controller('v1/data/deletion-requests')
export class DeletionController {
  constructor(private readonly data: DataService) {}

  @Get()
  current(@Actor() actor: ActorContext): Promise<DeletionRequestView | null> {
    return this.data.currentDeletion(actor);
  }

  @Post()
  @RequireStepUp()
  @Idempotent()
  @HttpCode(202)
  request(@Actor() actor: ActorContext, @Body() body: unknown): Promise<DeletionRequestView> {
    const input: RequestDeletionInput = parseBody(requestDeletionSchema, body);
    return this.data.requestDeletion(actor, input);
  }

  @Get(':id')
  get(@Actor() actor: ActorContext, @Param('id') id: string): Promise<DeletionRequestView> {
    return this.data.getDeletion(actor, parseParams(deletionRequestIdSchema, id));
  }

  @Post(':id/cancel')
  @RequireStepUp()
  @Idempotent()
  @HttpCode(200)
  cancel(@Actor() actor: ActorContext, @Param('id') id: string): Promise<DeletionRequestView> {
    return this.data.cancelDeletion(actor, parseParams(deletionRequestIdSchema, id));
  }
}
