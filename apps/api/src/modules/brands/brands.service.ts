import { Inject, Injectable } from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type { ActorContext, BrandView, CursorQuery, Services } from '../../application/port';
import { SERVICES } from '../../application/tokens';
import type { CreateBrandInput, UpdateBrandInput } from './brands.schemas';

/** Transport-level delegation for brands. No rule lives here. */
@Injectable()
export class BrandsService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  list(ctx: ActorContext, query: CursorQuery): Promise<Paginated<BrandView>> {
    return this.services.brands.list(ctx, query);
  }

  get(ctx: ActorContext, brandId: string): Promise<BrandView> {
    return this.services.brands.get(ctx, brandId);
  }

  create(ctx: ActorContext, input: CreateBrandInput): Promise<BrandView> {
    return this.services.brands.create(ctx, input);
  }

  update(ctx: ActorContext, brandId: string, patch: UpdateBrandInput): Promise<BrandView> {
    return this.services.brands.update(ctx, brandId, patch);
  }

  delete(ctx: ActorContext, brandId: string): Promise<void> {
    return this.services.brands.delete(ctx, brandId);
  }
}
