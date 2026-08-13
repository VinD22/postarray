import { Controller, Get, Query } from '@nestjs/common';

import type { ActorContext } from '../../application/port';
import { Actor, RequireScope } from '../../common/decorators';
import { parseQuery } from '../../common/zod';
import { dashboardSummaryQuerySchema, type DashboardSummaryView } from './dashboard.schemas';
import { DashboardService } from './dashboard.service';

/**
 * One aggregated read for the app home screen.
 *
 * The screen used to compose several hooks and would have composed more; each
 * addition was another chance for one part of the page to be honest and
 * another part to round a missing number to zero. This endpoint owns that
 * question once.
 */
@Controller('v1/dashboard')
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get('summary')
  // The aggregate is a read of drafts, receipts and analytics. `analytics:read`
  // is the narrowest scope that covers the metric part of it.
  @RequireScope('analytics:read')
  summary(@Actor() actor: ActorContext, @Query() query: unknown): Promise<DashboardSummaryView> {
    return this.dashboard.getSummary(actor, parseQuery(dashboardSummaryQuerySchema, query));
  }
}
