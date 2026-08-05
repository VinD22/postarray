import { Inject, Injectable } from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type {
  ActorContext,
  CursorQuery,
  Services,
  ShortLinkStats,
  ShortLinkView,
  TimeRange,
} from '../../application/port';
import { SERVICES } from '../../application/tokens';
import type { CreateShortLinkInput } from './short-links.schemas';

/** Transport-level delegation for short links. */
@Injectable()
export class ShortLinksService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  create(ctx: ActorContext, input: CreateShortLinkInput): Promise<ShortLinkView> {
    return this.services.shortLinks.create(ctx, input);
  }

  list(ctx: ActorContext, query: CursorQuery): Promise<Paginated<ShortLinkView>> {
    return this.services.shortLinks.list(ctx, query);
  }

  getStats(ctx: ActorContext, linkId: string, range: TimeRange): Promise<ShortLinkStats> {
    return this.services.shortLinks.getStats(ctx, { linkId, range });
  }
}
