import { Controller, Get, HttpCode, Param, Post } from '@nestjs/common';

import type { ActorContext, AgentConfirmationView } from '../../application/port';
import { Actor, Idempotent, RateLimit, RequireScope, RequireStepUp } from '../../common/decorators';
import { agentConfirmationIdSchema } from '../../common/schemas';
import { parseParams } from '../../common/zod';
import { AgentConfirmationsService } from './agent-confirmations.service';

/** Human-session side of the MCP immediate-publication confirmation flow. */
@Controller('v1/agent-confirmations')
export class AgentConfirmationsController {
  constructor(private readonly confirmations: AgentConfirmationsService) {}

  @Get(':id')
  @RequireScope('drafts:read')
  get(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
  ): Promise<AgentConfirmationView> {
    return this.confirmations.get(actor, parseParams(agentConfirmationIdSchema, id));
  }

  @Post(':id/approve')
  @RequireScope('posts:publish')
  @RequireStepUp()
  @Idempotent()
  @RateLimit({ limit: 20, windowSeconds: 60, cost: 2 })
  @HttpCode(200)
  approve(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
  ): Promise<AgentConfirmationView> {
    return this.confirmations.approve(actor, parseParams(agentConfirmationIdSchema, id));
  }
}
