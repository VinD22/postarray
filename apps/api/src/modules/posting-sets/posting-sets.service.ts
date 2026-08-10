import { Inject, Injectable } from '@nestjs/common';
import type { Paginated, PostingSetView } from '@relay/contracts';

import type { ActorContext, Services } from '../../application/port';
import { SERVICES } from '../../application/tokens';
import type {
  CreatePostingSetInput,
  ListPostingSetsQuery,
  UpdatePostingSetInput,
} from './posting-sets.schemas';

/**
 * Transport-level delegation for Posting Sets.
 *
 * The authorization decision, the name uniqueness check, the audit append and
 * the rule that a Set is read only at apply time all live behind
 * `services.postingSets`. This class turns a query string into that call and
 * nothing else.
 */
@Injectable()
export class PostingSetsService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  list(ctx: ActorContext, query: ListPostingSetsQuery): Promise<Paginated<PostingSetView>> {
    const { cursor, limit, brandId, includeArchived } = query;
    return this.services.postingSets.list(ctx, {
      ...(cursor === undefined ? {} : { cursor }),
      ...(limit === undefined ? {} : { limit }),
      ...(brandId === undefined ? {} : { brandId }),
      ...(includeArchived === undefined ? {} : { includeArchived }),
    });
  }

  get(ctx: ActorContext, setId: string): Promise<PostingSetView> {
    return this.services.postingSets.get(ctx, setId);
  }

  create(ctx: ActorContext, input: CreatePostingSetInput): Promise<PostingSetView> {
    return this.services.postingSets.create(ctx, input);
  }

  update(ctx: ActorContext, setId: string, patch: UpdatePostingSetInput): Promise<PostingSetView> {
    return this.services.postingSets.update(ctx, setId, patch);
  }

  archive(ctx: ActorContext, setId: string): Promise<PostingSetView> {
    return this.services.postingSets.archive(ctx, setId);
  }
}
