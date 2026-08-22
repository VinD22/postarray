import { Inject, Injectable } from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type {
  ActorContext,
  AnalyticsOverviewView,
  ComparisonReport,
  CursorQuery,
  ExperimentView,
  MetricObservationView,
  MetricSeriesView,
  Services,
  TimeRange,
} from '../../application/port';
import { SERVICES } from '../../application/tokens';
import type {
  CompareRequestInput,
  CreateExperimentInput,
  MetricSeriesQuery,
  OverviewQuery,
} from './analytics.schemas';

/** Transport-level delegation for analytics. Normalization is not done here. */
@Injectable()
export class AnalyticsService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  getOverview(ctx: ActorContext, query: OverviewQuery): Promise<AnalyticsOverviewView> {
    return this.services.analytics.getOverview(ctx, {
      connectionIds: query.connectionIds,
      ...(query.projectId === undefined ? {} : { projectId: query.projectId }),
      range: { from: query.from, to: query.to },
      metric: query.metric,
      ...(query.contentKind === undefined ? {} : { contentKind: query.contentKind }),
    });
  }

  getMetricSeries(
    ctx: ActorContext,
    connectionId: string,
    query: MetricSeriesQuery,
  ): Promise<MetricSeriesView> {
    return this.services.analytics.getMetricSeries(ctx, {
      connectionId,
      metric: query.metric,
      range: { from: query.from, to: query.to },
    });
  }

  getPostMetrics(ctx: ActorContext, receiptId: string): Promise<readonly MetricObservationView[]> {
    return this.services.analytics.getPostMetrics(ctx, { receiptId });
  }

  getAccountMetrics(
    ctx: ActorContext,
    connectionId: string,
    range: TimeRange,
  ): Promise<readonly MetricObservationView[]> {
    return this.services.analytics.getAccountMetrics(ctx, { connectionId, range });
  }

  compare(ctx: ActorContext, input: CompareRequestInput): Promise<ComparisonReport> {
    return this.services.analytics.compare(ctx, input);
  }

  listExperiments(ctx: ActorContext, query: CursorQuery): Promise<Paginated<ExperimentView>> {
    return this.services.analytics.listExperiments(ctx, query);
  }

  createExperiment(ctx: ActorContext, input: CreateExperimentInput): Promise<ExperimentView> {
    return this.services.analytics.createExperiment(ctx, input);
  }
}
