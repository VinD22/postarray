import { Inject, Injectable } from '@nestjs/common';
import type { RememberedTargetsView } from '@relay/contracts';

import type { ActorContext, Services } from '../../application/port';
import { SERVICES } from '../../application/tokens';

/** Transport-level delegation for the composer's remembered target selection. */
@Injectable()
export class TargetMemoryService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  read(ctx: ActorContext, brandId: string): Promise<RememberedTargetsView> {
    return this.services.rememberedTargets.read(ctx, { brandId });
  }

  remember(
    ctx: ActorContext,
    brandId: string,
    connectionIds: readonly string[],
  ): Promise<RememberedTargetsView> {
    return this.services.rememberedTargets.remember(ctx, { brandId, connectionIds });
  }

  forget(ctx: ActorContext, brandId: string): Promise<void> {
    return this.services.rememberedTargets.forget(ctx, { brandId });
  }

  setEnabled(
    ctx: ActorContext,
    brandId: string,
    enabled: boolean,
  ): Promise<{ brandId: string; enabled: boolean }> {
    return this.services.rememberedTargets.setEnabled(ctx, { brandId, enabled });
  }
}
