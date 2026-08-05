import { Inject, Injectable } from '@nestjs/common';
import type {
  GrowthExportFormat,
  GrowthPlan,
  OperationRef,
  OpportunityRecord,
  ToolRecord,
} from '@relay/contracts';

import type {
  ActorContext,
  BusinessProfileView,
  CalendarEntry,
  ContentItemView,
  Services,
  ViewModel,
} from '../../application/port.js';
import { SERVICES } from '../../application/tokens.js';

/** Transport-level delegation for the Growth Advisor. */
@Injectable()
export class GrowthService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  upsertProfile(ctx: ActorContext, input: ViewModel): Promise<BusinessProfileView> {
    return this.services.growth.upsertBusinessProfile(ctx, input);
  }

  confirmProfile(ctx: ActorContext, profileId: string): Promise<BusinessProfileView> {
    return this.services.growth.confirmBusinessProfile(ctx, profileId);
  }

  generatePlan(ctx: ActorContext, profileId: string): Promise<OperationRef> {
    return this.services.growth.generatePlan(ctx, { profileId });
  }

  getPlan(ctx: ActorContext, planId: string): Promise<GrowthPlan> {
    return this.services.growth.getPlan(ctx, planId);
  }

  exportPlan(
    ctx: ActorContext,
    planId: string,
    format: GrowthExportFormat,
  ): Promise<{ contentType: string; body: string }> {
    return this.services.growth.exportPlan(ctx, { planId, format });
  }

  createDraftFromItem(
    ctx: ActorContext,
    input: { planId: string; itemId: string },
  ): Promise<ContentItemView> {
    return this.services.growth.createDraftFromItem(ctx, input);
  }

  proposeSlotFromItem(
    ctx: ActorContext,
    input: { planId: string; itemId: string },
  ): Promise<CalendarEntry> {
    return this.services.growth.proposeSlotFromItem(ctx, input);
  }

  listOpportunities(
    ctx: ActorContext,
    query: { category?: string; region?: string; verifiedAfter?: string },
  ): Promise<readonly OpportunityRecord[]> {
    return this.services.growth.listOpportunities(ctx, query);
  }

  listTools(
    ctx: ActorContext,
    query: { workflow?: string; verifiedAfter?: string },
  ): Promise<readonly ToolRecord[]> {
    return this.services.growth.listTools(ctx, query);
  }
}
