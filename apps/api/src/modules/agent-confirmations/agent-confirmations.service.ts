import { Inject, Injectable } from '@nestjs/common';

import type { ActorContext, AgentConfirmationView, Services } from '../../application/port';
import { SERVICES } from '../../application/tokens';

@Injectable()
export class AgentConfirmationsService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  get(ctx: ActorContext, confirmationId: string): Promise<AgentConfirmationView> {
    return this.services.agentConfirmations.get(ctx, confirmationId);
  }

  approve(ctx: ActorContext, confirmationId: string): Promise<AgentConfirmationView> {
    return this.services.agentConfirmations.approve(ctx, confirmationId);
  }
}
