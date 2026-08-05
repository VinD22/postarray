import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import type { MetricObservation, Paginated } from '@relay/contracts';

import type { ActorContext, ComparisonReport, ExperimentView } from '../../application/port';
import { Actor, Idempotent, RequireScope } from '../../common/decorators';
import { cursorQuerySchema } from '../../common/pagination';
import { receiptIdSchema } from '../../common/schemas';
import { parseBody, parseParams, parseQuery } from '../../common/zod';
import {
  accountMetricsQuerySchema,
  compareRequestSchema,
  createExperimentSchema,
} from './analytics.schemas';
import { AnalyticsService } from './analytics.service';

/**
 * Analytics and experiments.
 *
 * Each observation carries the provider's own definition of the metric and how
 * fresh it is, because "views" does not mean the same thing on two platforms
 * and pretending otherwise produces a comparison that reads well and is wrong.
 */
@Controller('v1/analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  /** Metrics for one external publication, keyed by its receipt. */
  @Get('posts/:id')
  @RequireScope('analytics:read')
  async postMetrics(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
  ): Promise<{ data: readonly MetricObservation[] }> {
    return {
      data: await this.analytics.getPostMetrics(actor, parseParams(receiptIdSchema, id)),
    };
  }

  /** Account-level metrics over an explicit, zone-qualified window. */
  @Get('accounts')
  @RequireScope('analytics:read')
  async accountMetrics(
    @Actor() actor: ActorContext,
    @Query() query: unknown,
  ): Promise<{ data: readonly MetricObservation[] }> {
    const { connectionId, from, to, ianaTimeZone } = parseQuery(accountMetricsQuerySchema, query);
    return {
      data: await this.analytics.getAccountMetrics(actor, connectionId, {
        from,
        to,
        ianaTimeZone,
      }),
    };
  }

  @Post('comparisons')
  @RequireScope('analytics:read')
  @HttpCode(200)
  compare(@Actor() actor: ActorContext, @Body() body: unknown): Promise<ComparisonReport> {
    return this.analytics.compare(actor, parseBody(compareRequestSchema, body));
  }

  @Get('experiments')
  @RequireScope('analytics:read')
  listExperiments(
    @Actor() actor: ActorContext,
    @Query() query: unknown,
  ): Promise<Paginated<ExperimentView>> {
    return this.analytics.listExperiments(actor, parseQuery(cursorQuerySchema, query));
  }

  @Post('experiments')
  @RequireScope('analytics:read', 'drafts:write')
  @Idempotent()
  @HttpCode(201)
  createExperiment(@Actor() actor: ActorContext, @Body() body: unknown): Promise<ExperimentView> {
    return this.analytics.createExperiment(actor, parseBody(createExperimentSchema, body));
  }
}
