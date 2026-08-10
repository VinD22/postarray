import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import type {
  Paginated,
  QueueRuleView,
  QueueSlotReservationView,
  SlotProposal,
} from '@relay/contracts';

import type { ActorContext } from '../../application/port';
import { Actor, Idempotent, RequireScope } from '../../common/decorators';
import { parseBody, parseParams, parseQuery } from '../../common/zod';
import {
  acceptQueueSlotSchema,
  createQueueRuleSchema,
  listQueueRulesQuerySchema,
  listQueueSlotsQuerySchema,
  nextQueueSlotQuerySchema,
  proposeQueueSlotSchema,
  queueRuleIdSchema,
  queueSlotIdSchema,
  releaseQueueSlotSchema,
  updateQueueRuleSchema,
} from './queue-rules.schemas';
import { QueueRulesService } from './queue-rules.service';

/**
 * Queue rules and slot reservations.
 *
 * A proposal is not a schedule. `POST /queue/slots` reserves an instant and
 * returns it with the reasons it was chosen; `POST /queue/slots/{id}/accept`
 * is the human decision. Nothing on this controller dispatches a post, which is
 * why none of it carries `posts:publish`.
 */
@Controller('v1/queue')
export class QueueRulesController {
  constructor(private readonly queue: QueueRulesService) {}

  @Get('rules')
  @RequireScope('rules:read')
  listRules(
    @Actor() actor: ActorContext,
    @Query() query: unknown,
  ): Promise<Paginated<QueueRuleView>> {
    return this.queue.list(actor, parseQuery(listQueueRulesQuerySchema, query));
  }

  @Get('rules/:id')
  @RequireScope('rules:read')
  getRule(@Actor() actor: ActorContext, @Param('id') id: string): Promise<QueueRuleView> {
    return this.queue.get(actor, parseParams(queueRuleIdSchema, id));
  }

  @Post('rules')
  @RequireScope('rules:write')
  @Idempotent()
  @HttpCode(201)
  createRule(@Actor() actor: ActorContext, @Body() body: unknown): Promise<QueueRuleView> {
    return this.queue.create(actor, parseBody(createQueueRuleSchema, body));
  }

  @Patch('rules/:id')
  @RequireScope('rules:write')
  @Idempotent()
  updateRule(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<QueueRuleView> {
    return this.queue.update(
      actor,
      parseParams(queueRuleIdSchema, id),
      parseBody(updateQueueRuleSchema, body),
    );
  }

  /**
   * Archiving stops future proposals. Reservations that already exist keep
   * their instant and their frozen copy of the rule, which is why this is not
   * a destructive delete.
   */
  @Delete('rules/:id')
  @RequireScope('rules:write')
  @HttpCode(200)
  archiveRule(@Actor() actor: ActorContext, @Param('id') id: string): Promise<QueueRuleView> {
    return this.queue.archive(actor, parseParams(queueRuleIdSchema, id));
  }

  /** Read-only. Shows the slot and its reasons without holding anything. */
  @Get('next-slot')
  @RequireScope('drafts:read')
  nextSlot(@Actor() actor: ActorContext, @Query() query: unknown): Promise<SlotProposal> {
    return this.queue.previewSlot(actor, parseQuery(nextQueueSlotQuerySchema, query));
  }

  @Get('slots')
  @RequireScope('drafts:read')
  listSlots(
    @Actor() actor: ActorContext,
    @Query() query: unknown,
  ): Promise<Paginated<QueueSlotReservationView>> {
    return this.queue.listReservations(actor, parseQuery(listQueueSlotsQuerySchema, query));
  }

  /** Holds an instant for a person to accept. It schedules nothing. */
  @Post('slots')
  @RequireScope('posts:schedule')
  @Idempotent()
  @HttpCode(201)
  proposeSlot(
    @Actor() actor: ActorContext,
    @Body() body: unknown,
  ): Promise<QueueSlotReservationView> {
    return this.queue.proposeSlot(actor, parseBody(proposeQueueSlotSchema, body));
  }

  @Post('slots/:id/accept')
  @RequireScope('posts:schedule')
  @Idempotent()
  @HttpCode(200)
  acceptSlot(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<QueueSlotReservationView> {
    const { contentItemId } = parseBody(acceptQueueSlotSchema, body);
    return this.queue.acceptSlot(actor, parseParams(queueSlotIdSchema, id), contentItemId);
  }

  @Post('slots/:id/release')
  @RequireScope('posts:schedule')
  @HttpCode(200)
  releaseSlot(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<QueueSlotReservationView> {
    const { reason } = parseBody(releaseQueueSlotSchema, body);
    return this.queue.releaseSlot(actor, parseParams(queueSlotIdSchema, id), reason);
  }
}
