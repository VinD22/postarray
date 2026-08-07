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
    return this.services.brands.create(ctx, {
      name: input.name,
      ...(input.ianaTimeZone === undefined ? {} : { defaultTimeZone: input.ianaTimeZone }),
    });
  }

  update(ctx: ActorContext, brandId: string, patch: UpdateBrandInput): Promise<BrandView> {
    return this.services.brands.update(ctx, brandId, {
      ...(patch.name === undefined ? {} : { name: patch.name }),
      ...(patch.ianaTimeZone === undefined ? {} : { defaultTimeZone: patch.ianaTimeZone }),
      ...(patch.voice === undefined ? {} : { voice: patch.voice }),
      ...(patch.audience === undefined ? {} : { audience: patch.audience }),
      ...(patch.approvedClaims === undefined ? {} : { approvedClaims: patch.approvedClaims }),
      ...(patch.blockedTerms === undefined ? {} : { blockedTerms: patch.blockedTerms }),
      ...(patch.domains === undefined ? {} : { domains: patch.domains }),
    });
  }

  delete(ctx: ActorContext, brandId: string): Promise<void> {
    return this.services.brands.delete(ctx, brandId);
  }
}
