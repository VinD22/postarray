import { Inject, Injectable } from '@nestjs/common';
import type { RememberedTargetsView } from '@relay/contracts';

import type { ActorContext, Services } from '../../application/port';
import { SERVICES } from '../../application/tokens';

/** Transport-level delegation for the composer's remembered target selection. */
@Injectable()
export class TargetMemoryService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  read(ctx: ActorContext, projectId: string): Promise<RememberedTargetsView> {
    return this.services.rememberedTargets.read(ctx, { projectId });
  }

  remember(
    ctx: ActorContext,
    projectId: string,
    connectionIds: readonly string[],
  ): Promise<RememberedTargetsView> {
    return this.services.rememberedTargets.remember(ctx, { projectId, connectionIds });
  }

  forget(ctx: ActorContext, projectId: string): Promise<void> {
    return this.services.rememberedTargets.forget(ctx, { projectId });
  }

  setEnabled(
    ctx: ActorContext,
    projectId: string,
    enabled: boolean,
  ): Promise<{ projectId: string; enabled: boolean }> {
    return this.services.rememberedTargets.setEnabled(ctx, { projectId, enabled });
  }
}
