import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type { ActionItemView, ActorContext } from '../../application/port';
import { Actor, Idempotent, RequireScope } from '../../common/decorators';
import { parseBody, parseQuery } from '../../common/zod';
import { ActionCenterService } from './action-center.service';
import { actionCenterQuerySchema, snoozeActionSchema } from './action-center.schemas';

@Controller('v1/action-center')
export class ActionCenterController {
  constructor(private readonly actionCenter: ActionCenterService) {}

  @Get()
  @RequireScope('drafts:read')
  list(
    @Actor() actor: ActorContext,
    @Query() query: unknown,
  ): Promise<Paginated<ActionItemView>> {
    return this.actionCenter.list(actor, parseQuery(actionCenterQuerySchema, query));
  }

  @Post(':id/snooze')
  @RequireScope('drafts:read')
  @Idempotent()
  @HttpCode(200)
  snooze(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<ActionItemView> {
    const { until } = parseBody(snoozeActionSchema, body);
    return this.actionCenter.snooze(actor, id, until);
  }

  @Delete(':id/snooze')
  @RequireScope('drafts:read')
  @HttpCode(204)
  async unsnooze(@Actor() actor: ActorContext, @Param('id') id: string): Promise<void> {
    await this.actionCenter.unsnooze(actor, id);
  }
}
