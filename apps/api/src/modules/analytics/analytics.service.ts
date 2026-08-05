import { Inject, Injectable } from '@nestjs/common';
import type { MetricObservation, Paginated } from '@relay/contracts';

import type {
  ActorContext,
  ComparisonReport,
  CursorQuery,
  ExperimentView,
  Services,
  TimeRange,
  ViewModel,
} from '../../application/port';
import { SERVICES } from '../../application/tokens';
import type { CompareRequestInput } from './analytics.schemas';

/** Transport-level delegation for analytics. Normalization is not done here. */
@Injectable()
export class AnalyticsService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  getPostMetrics(ctx: ActorContext, receiptId: string): Promise<readonly MetricObservation[]> {
    return this.services.analytics.getPostMetrics(ctx, { receiptId });
  }

  getAccountMetrics(
    ctx: ActorContext,
    connectionId: string,
    range: TimeRange,
  ): Promise<readonly MetricObservation[]> {
    return this.services.analytics.getAccountMetrics(ctx, { connectionId, range });
  }

  compare(ctx: ActorContext, input: CompareRequestInput): Promise<ComparisonReport> {
    return this.services.analytics.compare(ctx, input);
  }

  listExperiments(ctx: ActorContext, query: CursorQuery): Promise<Paginated<ExperimentView>> {
    return this.services.analytics.listExperiments(ctx, query);
  }

  createExperiment(ctx: ActorContext, input: ViewModel): Promise<ExperimentView> {
    return this.services.analytics.createExperiment(ctx, input);
  }
}
