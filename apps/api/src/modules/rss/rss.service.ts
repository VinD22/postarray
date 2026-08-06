import { Inject, Injectable } from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type {
  ActorContext,
  CursorQuery,
  FeedHealth,
  FeedPreview,
  FeedView,
  Services,
} from '../../application/port';
import { SERVICES } from '../../application/tokens';
import type { CreateFeedInput, UpdateFeedInput } from './rss.schemas';

/** Transport-level delegation for RSS feeds. */
@Injectable()
export class RssService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  validateFeed(ctx: ActorContext, url: string): Promise<FeedPreview> {
    return this.services.rss.validateFeed(ctx, { url });
  }

  create(ctx: ActorContext, input: CreateFeedInput): Promise<FeedView> {
    return this.services.rss.create(ctx, input);
  }

  update(ctx: ActorContext, feedId: string, patch: UpdateFeedInput): Promise<FeedView> {
    return this.services.rss.update(ctx, feedId, patch);
  }

  list(ctx: ActorContext, query: CursorQuery): Promise<Paginated<FeedView>> {
    return this.services.rss.list(ctx, query);
  }

  delete(ctx: ActorContext, feedId: string): Promise<void> {
    return this.services.rss.delete(ctx, feedId);
  }

  getHealth(ctx: ActorContext, feedId: string): Promise<FeedHealth> {
    return this.services.rss.getHealth(ctx, feedId);
  }
}
