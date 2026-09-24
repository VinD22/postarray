import { Inject, Injectable } from '@nestjs/common';
import type { OperationRef } from '@relay/contracts';

import type { ActorContext } from '../../application/port';
import { INSIGHTS_PORT } from './insights.port';
import type {
  DigestSettingsView,
  DigestView,
  InsightView,
  InsightsPort,
  OpenExperimentView,
  PostExperimentView,
  PostFeedbackView,
  WhatWorksView,
} from './insights.port';
import type { GenerateDigestInput, ListInsightsQuery } from './insights.schemas';

/** Transport-level delegation for stored insights. */
@Injectable()
export class InsightsService {
  constructor(@Inject(INSIGHTS_PORT) private readonly insights: InsightsPort) {}

  getLatestDigest(ctx: ActorContext): Promise<DigestView | null> {
    return this.insights.latestDigest(ctx);
  }

  generateDigest(ctx: ActorContext, input: GenerateDigestInput): Promise<OperationRef> {
    return this.insights.generateDigest(ctx, {
      ...(input.windowStart === undefined ? {} : { windowStart: input.windowStart }),
      replaceExisting: input.replaceExisting,
    });
  }

  list(ctx: ActorContext, query: ListInsightsQuery): Promise<readonly InsightView[]> {
    return this.insights.list(ctx, {
      ...(query.contentItemId === undefined ? {} : { contentItemId: query.contentItemId }),
    });
  }

  postFeedback(ctx: ActorContext, contentItemId: string): Promise<PostFeedbackView> {
    return this.insights.postFeedback(ctx, contentItemId);
  }

  postExperiment(ctx: ActorContext, contentItemId: string): Promise<PostExperimentView | null> {
    return this.insights.postExperiment(ctx, contentItemId);
  }

  openExperiments(ctx: ActorContext): Promise<readonly OpenExperimentView[]> {
    return this.insights.openExperiments(ctx);
  }

  tagExperiment(
    ctx: ActorContext,
    contentItemId: string,
    body: unknown,
  ): Promise<PostExperimentView | null> {
    return this.insights.tagExperiment(ctx, contentItemId, body);
  }

  whatWorks(ctx: ActorContext): Promise<WhatWorksView> {
    return this.insights.whatWorks(ctx);
  }

  digestSettings(ctx: ActorContext): Promise<DigestSettingsView> {
    return this.insights.digestSettings(ctx);
  }

  updateDigestSettings(ctx: ActorContext, body: unknown): Promise<DigestSettingsView> {
    return this.insights.updateDigestSettings(ctx, body);
  }
}
