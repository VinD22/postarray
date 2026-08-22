import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type {
  ActorContext,
  AnalyticsOverviewView,
  ComparisonReport,
  ExperimentView,
  MetricObservationView,
  MetricSeriesView,
} from '../../application/port';
import { Actor, Idempotent, RequireScope } from '../../common/decorators';
import { cursorQuerySchema } from '../../common/pagination';
import { connectionIdSchema, receiptIdSchema } from '../../common/schemas';
import { parseBody, parseParams, parseQuery } from '../../common/zod';
import {
  accountMetricsQuerySchema,
  accountRangeQuerySchema,
  compareRequestSchema,
  createExperimentSchema,
  metricSeriesQuerySchema,
  overviewQuerySchema,
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

  /**
   * Everything the overview screen renders, in one request.
   *
   * Assembled here rather than in the browser so a workspace with twelve
   * connected accounts is one round trip, and so the trailing-median baseline
   * is computed once against the same history for every row.
   *
   * A metric the provider did not return comes back `unavailable_*` with a null
   * value. It is never a zero, and an account that answered nothing is reported
   * in `accountsWithoutData` rather than being silently dropped from the table.
   */
  @Get('overview')
  @RequireScope('analytics:read')
  overview(@Actor() actor: ActorContext, @Query() query: unknown): Promise<AnalyticsOverviewView> {
    return this.analytics.getOverview(actor, parseQuery(overviewQuerySchema, query));
  }

  /** Metrics for one external publication, keyed by its receipt. */
  @Get('posts/:id')
  @RequireScope('analytics:read')
  async postMetrics(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
  ): Promise<{ data: readonly MetricObservationView[] }> {
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
  ): Promise<{ data: readonly MetricObservationView[] }> {
    const { connectionId, from, to, ianaTimeZone } = parseQuery(accountMetricsQuerySchema, query);
    return {
      data: await this.analytics.getAccountMetrics(actor, connectionId, {
        from,
        to,
        ianaTimeZone,
      }),
    };
  }

  /**
   * The same account read as `GET accounts?connectionId=`, addressed by path.
   *
   * Both spellings exist because the collection form is the one the CLI and MCP
   * already use and the path form is the one a REST client reaches for. They
   * delegate to the same service call; neither is a different read.
   */
  @Get('accounts/:id')
  @RequireScope('analytics:read')
  async accountMetricsById(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Query() query: unknown,
  ): Promise<{ data: readonly MetricObservationView[] }> {
    const { from, to, ianaTimeZone } = parseQuery(accountRangeQuerySchema, query);
    return {
      data: await this.analytics.getAccountMetrics(actor, parseParams(connectionIdSchema, id), {
        from,
        to,
        ianaTimeZone: ianaTimeZone ?? 'UTC',
      }),
    };
  }

  /**
   * One metric for one account over time, as daily buckets.
   *
   * A bucket with no observation is `null`. A day nobody measured and a day
   * nothing happened are different facts, and drawing them the same way would
   * invent a measurement.
   */
  @Get('accounts/:id/series')
  @RequireScope('analytics:read')
  metricSeries(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Query() query: unknown,
  ): Promise<MetricSeriesView> {
    return this.analytics.getMetricSeries(
      actor,
      parseParams(connectionIdSchema, id),
      parseQuery(metricSeriesQuerySchema, query),
    );
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
