import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type { ActorContext, ShortLinkStats, ShortLinkView } from '../../application/port';
import { Actor, Idempotent, RequireScope } from '../../common/decorators';
import { shortLinkIdSchema } from '../../common/schemas';
import { parseBody, parseParams, parseQuery } from '../../common/zod';
import {
  createShortLinkSchema,
  listShortLinksQuerySchema,
  shortLinkStatsQuerySchema,
} from './short-links.schemas';
import { ShortLinksService } from './short-links.service';

/**
 * Short links and their click analytics.
 *
 * Click statistics are reported as two separate series: total requests, and
 * deduplicated human clicks after bot classification. Publishing one number
 * that quietly mixes them is how a link report ends up flattering and useless.
 * They are also kept visibly separate from provider analytics, because they
 * measure a different thing.
 */
@Controller('v1/short-links')
export class ShortLinksController {
  constructor(private readonly shortLinks: ShortLinksService) {}

  @Get()
  @RequireScope('analytics:read')
  list(@Actor() actor: ActorContext, @Query() query: unknown): Promise<Paginated<ShortLinkView>> {
    return this.shortLinks.list(actor, parseQuery(listShortLinksQuerySchema, query));
  }

  @Post()
  @RequireScope('drafts:write')
  @Idempotent()
  @HttpCode(201)
  create(@Actor() actor: ActorContext, @Body() body: unknown): Promise<ShortLinkView> {
    return this.shortLinks.create(actor, parseBody(createShortLinkSchema, body));
  }

  @Get(':id/stats')
  @RequireScope('analytics:read')
  stats(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Query() query: unknown,
  ): Promise<ShortLinkStats> {
    return this.shortLinks.getStats(
      actor,
      parseParams(shortLinkIdSchema, id),
      parseQuery(shortLinkStatsQuerySchema, query),
    );
  }
}
