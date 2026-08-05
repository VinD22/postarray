import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type { ActorContext, FeedHealth, FeedPreview, FeedView } from '../../application/port.js';
import { Actor, Idempotent, RateLimit, RequireScope } from '../../common/decorators.js';
import { cursorQuerySchema } from '../../common/pagination.js';
import { feedIdSchema } from '../../common/schemas.js';
import { parseBody, parseParams, parseQuery } from '../../common/zod.js';
import { createFeedSchema, updateFeedSchema, validateFeedSchema } from './rss.schemas.js';
import { RssService } from './rss.service.js';

/**
 * RSS and Atom autoposting.
 *
 * `POST /validate` is the test-mode route: it fetches the feed once, safely,
 * and shows what the next few items would become, without creating anything.
 * A user should always be able to see what an automation would do before it
 * does it.
 *
 * Feed health is a first-class read, because a feed that quietly stopped
 * returning items looks exactly like a feed with nothing new, and the two need
 * different responses from the customer.
 */
@Controller('v1/rss')
export class RssController {
  constructor(private readonly rss: RssService) {}

  @Get('feeds')
  @RequireScope('rules:read')
  list(@Actor() actor: ActorContext, @Query() query: unknown): Promise<Paginated<FeedView>> {
    return this.rss.list(actor, parseQuery(cursorQuerySchema, query));
  }

  /** Fetch once and preview. Creates nothing, publishes nothing. */
  @Post('feeds/validate')
  @RequireScope('rules:read')
  @RateLimit({ limit: 20, windowSeconds: 60 })
  @HttpCode(200)
  validate(@Actor() actor: ActorContext, @Body() body: unknown): Promise<FeedPreview> {
    const { url } = parseBody(validateFeedSchema, body);
    return this.rss.validateFeed(actor, url);
  }

  @Post('feeds')
  @RequireScope('rules:write')
  @Idempotent()
  @HttpCode(201)
  create(@Actor() actor: ActorContext, @Body() body: unknown): Promise<FeedView> {
    return this.rss.create(actor, parseBody(createFeedSchema, body));
  }

  @Patch('feeds/:id')
  @RequireScope('rules:write')
  update(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<FeedView> {
    return this.rss.update(
      actor,
      parseParams(feedIdSchema, id),
      parseBody(updateFeedSchema, body),
    );
  }

  /** Last successful fetch, last error, and how many items it produced. */
  @Get('feeds/:id/health')
  @RequireScope('rules:read')
  health(@Actor() actor: ActorContext, @Param('id') id: string): Promise<FeedHealth> {
    return this.rss.getHealth(actor, parseParams(feedIdSchema, id));
  }

  @Delete('feeds/:id')
  @RequireScope('rules:write')
  @HttpCode(204)
  async delete(@Actor() actor: ActorContext, @Param('id') id: string): Promise<void> {
    await this.rss.delete(actor, parseParams(feedIdSchema, id));
  }
}
