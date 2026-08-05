import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type {
  ActorContext,
  AutomationRuleView,
  RulePreview,
  RuleRunView,
} from '../../application/port.js';
import { Actor, Idempotent, RequireScope, RequireStepUp } from '../../common/decorators.js';
import { cursorQuerySchema } from '../../common/pagination.js';
import { ruleIdSchema } from '../../common/schemas.js';
import { parseBody, parseParams, parseQuery } from '../../common/zod.js';
import {
  createRuleSchema,
  testRunSchema,
  updateRuleSchema,
} from './automation-rules.schemas.js';
import { AutomationRulesService } from './automation-rules.service.js';

/**
 * Automation Rules.
 *
 * The route that matters most here is `preview`. Before a rule is switched on,
 * a person is shown which accounts it can reach, the maximum number of external
 * actions one run can produce, which approvals it will still need, which
 * provider restrictions apply and what it is estimated to cost. Turning on
 * something whose blast radius you have not seen is how an automation product
 * damages a customer's account, and this endpoint exists to make that
 * impossible to do by accident.
 *
 * A rule is always created disabled, and enabling one that can produce more
 * than a handful of external actions is a step-up action.
 */
@Controller('v1/automation-rules')
export class AutomationRulesController {
  constructor(private readonly rules: AutomationRulesService) {}

  @Get()
  @RequireScope('rules:read')
  list(
    @Actor() actor: ActorContext,
    @Query() query: unknown,
  ): Promise<Paginated<AutomationRuleView>> {
    return this.rules.list(actor, parseQuery(cursorQuerySchema, query));
  }

  @Get(':id')
  @RequireScope('rules:read')
  get(@Actor() actor: ActorContext, @Param('id') id: string): Promise<AutomationRuleView> {
    return this.rules.get(actor, parseParams(ruleIdSchema, id));
  }

  @Post()
  @RequireScope('rules:write')
  @Idempotent()
  @HttpCode(201)
  create(@Actor() actor: ActorContext, @Body() body: unknown): Promise<AutomationRuleView> {
    return this.rules.create(actor, parseBody(createRuleSchema, body));
  }

  @Patch(':id')
  @RequireScope('rules:write')
  update(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<AutomationRuleView> {
    return this.rules.update(
      actor,
      parseParams(ruleIdSchema, id),
      parseBody(updateRuleSchema, body),
    );
  }

  /** Accounts reached, maximum external actions, approvals, cost estimate. */
  @Get(':id/preview')
  @RequireScope('rules:read')
  preview(@Actor() actor: ActorContext, @Param('id') id: string): Promise<RulePreview> {
    return this.rules.preview(actor, parseParams(ruleIdSchema, id));
  }

  /** Run against a sample event. Produces no external action, ever. */
  @Post(':id/test-runs')
  @RequireScope('rules:read')
  @HttpCode(200)
  testRun(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<RuleRunView> {
    const { sampleEvent } = parseBody(testRunSchema, body);
    return this.rules.testRun(actor, parseParams(ruleIdSchema, id), sampleEvent);
  }

  @Get(':id/runs')
  @RequireScope('rules:read')
  listRuns(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Query() query: unknown,
  ): Promise<Paginated<RuleRunView>> {
    return this.rules.listRuns(
      actor,
      parseParams(ruleIdSchema, id),
      parseQuery(cursorQuerySchema, query),
    );
  }

  @Post(':id/enable')
  @RequireScope('rules:write')
  @RequireStepUp()
  @Idempotent()
  @HttpCode(200)
  enable(@Actor() actor: ActorContext, @Param('id') id: string): Promise<AutomationRuleView> {
    return this.rules.enable(actor, parseParams(ruleIdSchema, id));
  }

  @Post(':id/disable')
  @RequireScope('rules:write')
  @Idempotent()
  @HttpCode(200)
  disable(@Actor() actor: ActorContext, @Param('id') id: string): Promise<AutomationRuleView> {
    return this.rules.disable(actor, parseParams(ruleIdSchema, id));
  }

  @Delete(':id')
  @RequireScope('rules:write')
  @HttpCode(204)
  async delete(@Actor() actor: ActorContext, @Param('id') id: string): Promise<void> {
    await this.rules.delete(actor, parseParams(ruleIdSchema, id));
  }
}
