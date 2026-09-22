import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import {
  acceptSuggestionRequestSchema,
  bestTimeRequestSchema,
  reviewRequestSchema,
  suggestionRequestSchema,
} from '@relay/application';
import type {
  AcceptedSuggestionView,
  BestTimeView,
  ReviewView,
  SuggestionView,
} from '@relay/application';

import type { ActorContext, Services } from '../../application/port';
import { SERVICES } from '../../application/tokens';
import { Actor, RequireScope } from '../../common/decorators';
import { parseBody } from '../../common/zod';

/**
 * Composer suggestions.
 *
 * Transport only. Every route delegates to `services.aiSuggestions`, the same
 * use case the MCP tools and the CLI reach, so the budget ceiling, the
 * authorization check and the untrusted-data fence are identical on every
 * surface.
 *
 * Nothing here writes a draft. `suggestions`, `reviews` and `best-times` are
 * reads that cost model time; `acceptances` records which model and prompt
 * version produced text the person kept, and returns that text for the
 * ordinary save path. Responses are whole bodies: no route in this API
 * streams, so a draft from a brief arrives in one response.
 * TODO(api): stream `draft_from_brief` once the API has a streaming transport.
 */
@Controller('v1/suggestions')
export class SuggestionsController {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  @Post()
  @RequireScope('drafts:read')
  @HttpCode(200)
  suggest(@Actor() actor: ActorContext, @Body() body: unknown): Promise<SuggestionView> {
    return this.services.aiSuggestions.suggest(actor, parseBody(suggestionRequestSchema, body));
  }

  @Post('reviews')
  @RequireScope('drafts:read')
  @HttpCode(200)
  review(@Actor() actor: ActorContext, @Body() body: unknown): Promise<ReviewView> {
    return this.services.aiSuggestions.review(actor, parseBody(reviewRequestSchema, body));
  }

  @Post('acceptances')
  @RequireScope('drafts:write')
  @HttpCode(200)
  accept(@Actor() actor: ActorContext, @Body() body: unknown): Promise<AcceptedSuggestionView> {
    return this.services.aiSuggestions.accept(
      actor,
      parseBody(acceptSuggestionRequestSchema, body),
    );
  }

  @Post('best-times')
  @RequireScope('analytics:read')
  @HttpCode(200)
  bestTime(@Actor() actor: ActorContext, @Body() body: unknown): Promise<BestTimeView> {
    return this.services.aiSuggestions.bestTime(actor, parseBody(bestTimeRequestSchema, body));
  }
}
