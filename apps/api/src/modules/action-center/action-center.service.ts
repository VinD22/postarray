import { Inject, Injectable } from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type { ActionItemView, ActorContext, Services } from '../../application/port';
import { SERVICES } from '../../application/tokens';
import type { z } from 'zod';
import type { actionCenterQuerySchema } from './action-center.schemas';

type ActionCenterQuery = z.infer<typeof actionCenterQuerySchema>;

@Injectable()
export class ActionCenterService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  list(ctx: ActorContext, query: ActionCenterQuery): Promise<Paginated<ActionItemView>> {
    return this.services.actionCenter.list(ctx, query);
  }

  snooze(ctx: ActorContext, itemId: string, until: string): Promise<ActionItemView> {
    return this.services.actionCenter.snooze(ctx, itemId, until);
  }

  unsnooze(ctx: ActorContext, itemId: string): Promise<void> {
    return this.services.actionCenter.unsnooze(ctx, itemId);
  }
}
