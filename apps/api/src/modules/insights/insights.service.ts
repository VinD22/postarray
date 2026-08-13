import { Inject, Injectable } from '@nestjs/common';
import type { OperationRef } from '@relay/contracts';

import type { ActorContext } from '../../application/port';
import { INSIGHTS_PORT } from './insights.port';
import type { DigestView, InsightView, InsightsPort } from './insights.port';
import type { GenerateDigestInput, ListInsightsQuery } from './insights.schemas';

/** Transport-level delegation for the weekly digest and stored insights. */
@Injectable()
export class InsightsService {
  constructor(@Inject(INSIGHTS_PORT) private readonly insights: InsightsPort) {}

  getLatestDigest(ctx: ActorContext): Promise<DigestView | null> {
    return this.insights.getLatestDigest(ctx);
  }

  generateDigest(ctx: ActorContext, input: GenerateDigestInput): Promise<OperationRef> {
    return this.insights.generateDigest(ctx, {
      ...(input.windowStart === undefined ? {} : { windowStart: input.windowStart }),
      replaceExisting: input.replaceExisting,
    });
  }

  list(ctx: ActorContext, query: ListInsightsQuery): Promise<readonly InsightView[]> {
    return this.insights.listInsights(ctx, {
      ...(query.contentItemId === undefined ? {} : { contentItemId: query.contentItemId }),
    });
  }
}
