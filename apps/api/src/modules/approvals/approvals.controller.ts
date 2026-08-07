import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type { ActorContext, ApprovalRequestView } from '../../application/port';
import { Actor, Idempotent, RequireScope } from '../../common/decorators';
import { approvalIdSchema } from '../../common/schemas';
import { parseBody, parseParams, parseQuery } from '../../common/zod';
import {
  decideApprovalSchema,
  listPendingQuerySchema,
  requestApprovalSchema,
} from './approvals.schemas';
import { ApprovalsService } from './approvals.service';

/**
 * Approvals.
 *
 * `drafts:write` requests a review; deciding one needs `posts:schedule`,
 * because an approval is what unlocks an external publication and it should
 * cost the same permission that scheduling does. There is no scope that grants
 * both by implication.
 */
@Controller('v1/approvals')
export class ApprovalsController {
  constructor(private readonly approvals: ApprovalsService) {}

  /** Reviews waiting on this actor. */
  @Get('pending')
  @RequireScope('drafts:read')
  listPending(
    @Actor() actor: ActorContext,
    @Query() query: unknown,
  ): Promise<Paginated<ApprovalRequestView>> {
    return this.approvals.listPending(actor, parseQuery(listPendingQuerySchema, query));
  }

  /** One request, including resolved decisions, scoped to the actor's workspace. */
  @Get(':id')
  @RequireScope('drafts:read')
  get(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
  ): Promise<ApprovalRequestView> {
    return this.approvals.get(actor, parseParams(approvalIdSchema, id));
  }

  @Post()
  @RequireScope('drafts:write')
  @Idempotent()
  @HttpCode(201)
  request(@Actor() actor: ActorContext, @Body() body: unknown): Promise<ApprovalRequestView> {
    return this.approvals.request(actor, parseBody(requestApprovalSchema, body));
  }

  /**
   * Approve or reject. The decision records the exact content version hash it
   * applied to, so an edit afterwards invalidates the approval rather than
   * riding on it.
   */
  @Post(':id/decision')
  @RequireScope('posts:schedule')
  @Idempotent()
  @HttpCode(200)
  decide(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<ApprovalRequestView> {
    return this.approvals.decide(
      actor,
      parseParams(approvalIdSchema, id),
      parseBody(decideApprovalSchema, body),
    );
  }
}
