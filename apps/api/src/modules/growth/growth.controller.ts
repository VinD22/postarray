import { Body, Controller, Get, HttpCode, Param, Post, Put, Query, Res } from '@nestjs/common';
import type { GrowthPlan, OperationRef, OpportunityRecord, ToolRecord } from '@relay/contracts';
import type { Response } from 'express';

import type {
  ActorContext,
  BusinessProfileView,
  CalendarEntry,
  ContentItemView,
  GrowthPlanSummaryView,
} from '../../application/port';
import { Actor, Idempotent, RequireScope } from '../../common/decorators';
import { growthPlanIdSchema, growthProfileIdSchema } from '../../common/schemas';
import { parseBody, parseParams, parseQuery } from '../../common/zod';
import {
  businessProfileInputSchema,
  confirmBusinessProfileSchema,
  exportPlanQuerySchema,
  generatePlanSchema,
  listOpportunitiesQuerySchema,
  listToolsQuerySchema,
  planItemSchema,
} from './growth.schemas';
import { GrowthService } from './growth.service';

/**
 * The Growth Advisor.
 *
 * A plan separates what we know from what we assumed, and every opportunity and
 * tool it names comes from an active, verified catalog record with an official
 * URL, its rules and caveats and a last-verified date. When the catalog has
 * nothing that fits, the answer is an empty list, not an invented
 * recommendation: a plausible URL a model produced is worse than no URL.
 *
 * Converting plan items into work is deliberately one at a time. There is no
 * "schedule the whole strategy" route.
 */
@Controller('v1/growth')
export class GrowthController {
  constructor(private readonly growth: GrowthService) {}

  @Get('profile')
  @RequireScope('growth:read')
  getProfile(@Actor() actor: ActorContext): Promise<BusinessProfileView | null> {
    return this.growth.getProfile(actor);
  }

  @Put('profile')
  @RequireScope('growth:write')
  @Idempotent()
  upsertProfile(@Actor() actor: ActorContext, @Body() body: unknown): Promise<BusinessProfileView> {
    return this.growth.upsertProfile(actor, parseBody(businessProfileInputSchema, body));
  }

  /**
   * Confirm the intake. A plan is generated only from a profile a human has
   * read and confirmed, so the assumptions in it are ones somebody agreed to.
   */
  @Post('profile/:id/confirm')
  @RequireScope('growth:write')
  @Idempotent()
  @HttpCode(200)
  confirmProfile(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<BusinessProfileView> {
    const input = parseBody(confirmBusinessProfileSchema, body);
    return this.growth.confirmProfile(actor, {
      profileId: parseParams(growthProfileIdSchema, id),
      ...input,
    });
  }

  /** Asynchronous. Returns an operation handle, not a plan. */
  @Post('plans')
  @RequireScope('growth:write')
  @Idempotent()
  @HttpCode(202)
  generatePlan(@Actor() actor: ActorContext, @Body() body: unknown): Promise<OperationRef> {
    const { profileId } = parseBody(generatePlanSchema, body);
    return this.growth.generatePlan(actor, profileId);
  }

  @Get('plans/current/summary')
  @RequireScope('growth:read')
  getPlanSummary(@Actor() actor: ActorContext): Promise<GrowthPlanSummaryView> {
    return this.growth.getPlanSummary(actor);
  }

  @Get('plans/current')
  @RequireScope('growth:read')
  getCurrentPlan(@Actor() actor: ActorContext): Promise<GrowthPlan | null> {
    return this.growth.getCurrentPlan(actor);
  }

  @Get('plans/:id')
  @RequireScope('growth:read')
  getPlan(@Actor() actor: ActorContext, @Param('id') id: string): Promise<GrowthPlan> {
    return this.growth.getPlan(actor, parseParams(growthPlanIdSchema, id));
  }

  /** Export the validated plan as Markdown, JSON or YAML. */
  @Get('plans/:id/export')
  @RequireScope('growth:read')
  async exportPlan(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Query() query: unknown,
    @Res() response: Response,
  ): Promise<void> {
    const { format } = parseQuery(exportPlanQuerySchema, query);
    const exported = await this.growth.exportPlan(
      actor,
      parseParams(growthPlanIdSchema, id),
      format,
    );
    response.setHeader('content-type', exported.contentType);
    response.setHeader('content-disposition', `attachment; filename="growth-plan.${format}"`);
    response.status(200).send(exported.body);
  }

  /** Turn one selected plan item into a draft. One item, one act. */
  @Post('plans/:id/drafts')
  @RequireScope('growth:write', 'drafts:write')
  @Idempotent()
  @HttpCode(201)
  createDraft(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<ContentItemView> {
    const input = parseBody(planItemSchema.omit({ planId: true }), body);
    return this.growth.createDraftFromItem(actor, {
      planId: parseParams(growthPlanIdSchema, id),
      itemId: input.itemId,
    });
  }

  /** Propose a calendar slot for one item. A proposal, not a schedule. */
  @Post('plans/:id/slot-proposals')
  @RequireScope('growth:write')
  @Idempotent()
  @HttpCode(200)
  proposeSlot(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<CalendarEntry> {
    const input = parseBody(planItemSchema.omit({ planId: true }), body);
    return this.growth.proposeSlotFromItem(actor, {
      planId: parseParams(growthPlanIdSchema, id),
      itemId: input.itemId,
    });
  }

  @Get('opportunities')
  @RequireScope('growth:read')
  async listOpportunities(
    @Actor() actor: ActorContext,
    @Query() query: unknown,
  ): Promise<{ data: readonly OpportunityRecord[] }> {
    return {
      data: await this.growth.listOpportunities(
        actor,
        parseQuery(listOpportunitiesQuerySchema, query),
      ),
    };
  }

  @Get('tools')
  @RequireScope('growth:read')
  async listTools(
    @Actor() actor: ActorContext,
    @Query() query: unknown,
  ): Promise<{ data: readonly ToolRecord[] }> {
    return { data: await this.growth.listTools(actor, parseQuery(listToolsQuerySchema, query)) };
  }
}
