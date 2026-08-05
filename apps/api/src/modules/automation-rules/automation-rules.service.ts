import { Inject, Injectable } from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type {
  ActorContext,
  AutomationRuleView,
  CursorQuery,
  RulePreview,
  RuleRunView,
  Services,
  ViewModel,
} from '../../application/port.js';
import { SERVICES } from '../../application/tokens.js';

/** Transport-level delegation for Automation Rules. */
@Injectable()
export class AutomationRulesService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  list(ctx: ActorContext, query: CursorQuery): Promise<Paginated<AutomationRuleView>> {
    return this.services.automationRules.list(ctx, query);
  }

  get(ctx: ActorContext, ruleId: string): Promise<AutomationRuleView> {
    return this.services.automationRules.get(ctx, ruleId);
  }

  create(ctx: ActorContext, input: ViewModel): Promise<AutomationRuleView> {
    return this.services.automationRules.create(ctx, input);
  }

  update(ctx: ActorContext, ruleId: string, patch: ViewModel): Promise<AutomationRuleView> {
    return this.services.automationRules.update(ctx, ruleId, patch);
  }

  enable(ctx: ActorContext, ruleId: string): Promise<AutomationRuleView> {
    return this.services.automationRules.enable(ctx, ruleId);
  }

  disable(ctx: ActorContext, ruleId: string): Promise<AutomationRuleView> {
    return this.services.automationRules.disable(ctx, ruleId);
  }

  delete(ctx: ActorContext, ruleId: string): Promise<void> {
    return this.services.automationRules.delete(ctx, ruleId);
  }

  preview(ctx: ActorContext, ruleId: string): Promise<RulePreview> {
    return this.services.automationRules.preview(ctx, ruleId);
  }

  testRun(ctx: ActorContext, ruleId: string, sampleEvent: ViewModel): Promise<RuleRunView> {
    return this.services.automationRules.testRun(ctx, { ruleId, sampleEvent });
  }

  listRuns(ctx: ActorContext, ruleId: string, query: CursorQuery): Promise<Paginated<RuleRunView>> {
    return this.services.automationRules.listRuns(ctx, { ruleId, ...query });
  }
}
