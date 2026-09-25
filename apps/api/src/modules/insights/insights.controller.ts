import { Body, Controller, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import type { OperationRef } from '@relay/contracts';

import type { ActorContext } from '../../application/port';
import { Actor, Idempotent, RequireScope } from '../../common/decorators';
import { contentItemIdSchema } from '../../common/schemas';
import { parseBody, parseParams, parseQuery } from '../../common/zod';
import type {
  DigestSettingsView,
  DigestView,
  InsightView,
  OpenExperimentView,
  PostExperimentView,
  PostFeedbackView,
  WhatWorksView,
} from './insights.port';
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

  /** Whether the weekly summary is also emailed. The digest is built either way. */
  @Get('digest/settings')
  @RequireScope('analytics:read')
  getDigestSettings(@Actor() actor: ActorContext): Promise<DigestSettingsView> {
    return this.insights.digestSettings(actor);
  }

  @Put('digest/settings')
  @RequireScope('accounts:write')
  updateDigestSettings(
    @Actor() actor: ActorContext,
    @Body() body: unknown,
  ): Promise<DigestSettingsView> {
    return this.insights.updateDigestSettings(actor, body);
  }

  /** "How it did" for one post: per channel delivery, readings, one next test. */
  @Get('posts/:contentItemId')
  @RequireScope('analytics:read')
  postFeedback(
    @Actor() actor: ActorContext,
    @Param('contentItemId') contentItemId: string,
  ): Promise<PostFeedbackView> {
    return this.insights.postFeedback(actor, parseParams(contentItemIdSchema, contentItemId));
  }

  /** Experiments a draft can still join, with their variants. */
  @Get('experiments/open')
  @RequireScope('analytics:read')
  async openExperiments(
    @Actor() actor: ActorContext,
  ): Promise<{ data: readonly OpenExperimentView[] }> {
    return { data: await this.insights.openExperiments(actor) };
  }

  /** The experiment this post belongs to, summarized. `null` when it has none. */
  @Get('posts/:contentItemId/experiment')
  @RequireScope('analytics:read')
  postExperiment(
    @Actor() actor: ActorContext,
    @Param('contentItemId') contentItemId: string,
  ): Promise<PostExperimentView | null> {
    return this.insights.postExperiment(actor, parseParams(contentItemIdSchema, contentItemId));
  }

  /** Tag an unpublished post into one variant. Refused once it has published. */
  @Put('posts/:contentItemId/experiment')
  @RequireScope('analytics:read', 'drafts:write')
  @Idempotent()
  tagExperiment(
    @Actor() actor: ActorContext,
    @Param('contentItemId') contentItemId: string,
    @Body() body: unknown,
  ): Promise<PostExperimentView | null> {
    return this.insights.tagExperiment(
      actor,
      parseParams(contentItemIdSchema, contentItemId),
      body,
    );
  }

  /** Image traits joined with the account's own readings, above sample thresholds. */
  @Get('what-works')
  @RequireScope('analytics:read')
  whatWorks(@Actor() actor: ActorContext): Promise<WhatWorksView> {
    return this.insights.whatWorks(actor);
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
