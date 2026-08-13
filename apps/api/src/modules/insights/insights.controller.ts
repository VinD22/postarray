import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import type { OperationRef } from '@relay/contracts';

import type { ActorContext } from '../../application/port';
import { Actor, Idempotent, RequireScope } from '../../common/decorators';
import { parseBody, parseQuery } from '../../common/zod';
import type { DigestView, InsightView } from './insights.port';
import { generateDigestSchema, listInsightsQuerySchema } from './insights.schemas';
import { InsightsService } from './insights.service';

/**
 * The weekly digest: "what has been happening".
 *
 * Everything this returns is an i18n key plus arguments, including the parts a
 * model wrote, which are carried as an argument to a narrative key rather than
 * as free text the client has to trust. A digest exists whether or not the
 * writing assistant ran, so `latest` is never empty because a vendor is down:
 * it returns the deterministic rows with `source: "deterministic"` and the
 * reason it fell back.
 */
@Controller('v1/insights')
export class InsightsController {
  constructor(private readonly insights: InsightsService) {}

  /** The most recent stored digest. `null` before the first one is built. */
  @Get('digest/latest')
  @RequireScope('analytics:read')
  getLatestDigest(@Actor() actor: ActorContext): Promise<DigestView | null> {
    return this.insights.getLatestDigest(actor);
  }

  /**
   * Rebuild on demand. Asynchronous, so a slow model call is never an HTTP
   * timeout that looks like a failure, and idempotent per window: the same
   * week requested twice is one digest.
   */
  @Post('digest')
  @RequireScope('analytics:read')
  @Idempotent()
  @HttpCode(202)
  generateDigest(@Actor() actor: ActorContext, @Body() body: unknown): Promise<OperationRef> {
    return this.insights.generateDigest(actor, parseBody(generateDigestSchema, body));
  }

  /** Stored insights, optionally narrowed to one content item. */
  @Get()
  @RequireScope('analytics:read')
  async list(
    @Actor() actor: ActorContext,
    @Query() query: unknown,
  ): Promise<{ data: readonly InsightView[] }> {
    return { data: await this.insights.list(actor, parseQuery(listInsightsQuerySchema, query)) };
  }
}
