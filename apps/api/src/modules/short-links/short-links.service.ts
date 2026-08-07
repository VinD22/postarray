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
import type {
  CreateShortLinkInput,
  SetShortLinkEnabledInput,
  UpdateShortLinkDestinationInput,
} from './short-links.schemas';

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

  get(ctx: ActorContext, linkId: string): Promise<ShortLinkView> {
    return this.services.shortLinks.get(ctx, linkId);
  }

  getStats(ctx: ActorContext, linkId: string, range: TimeRange): Promise<ShortLinkStats> {
    return this.services.shortLinks.getStats(ctx, { linkId, range });
  }

  updateDestination(
    ctx: ActorContext,
    linkId: string,
    input: UpdateShortLinkDestinationInput,
  ): Promise<ShortLinkView> {
    return this.services.shortLinks.updateDestination(ctx, linkId, input);
  }

  setEnabled(
    ctx: ActorContext,
    linkId: string,
    input: SetShortLinkEnabledInput,
  ): Promise<ShortLinkView> {
    return this.services.shortLinks.setEnabled(ctx, linkId, input);
  }
}
