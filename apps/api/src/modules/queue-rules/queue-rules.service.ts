import { Inject, Injectable } from '@nestjs/common';
import type {
  Paginated,
  QueueRuleView,
  QueueSlotReservationView,
  SlotProposal,
} from '@relay/contracts';

import type { ActorContext, Services } from '../../application/port';
import { SERVICES } from '../../application/tokens';
import type {
  CreateQueueRuleInput,
  ListQueueRulesQuery,
  ListQueueSlotsQuery,
  NextQueueSlotQuery,
  ProposeQueueSlotInput,
  UpdateQueueRuleInput,
} from './queue-rules.schemas';

/**
 * Transport-level delegation for queue rules.
 *
 * The window arithmetic, the daylight-saving decisions, the frozen snapshot and
 * the audit append all live behind `services.queueRules`. This class turns a
 * query string into that call and nothing else.
 */
@Injectable()
export class QueueRulesService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  list(ctx: ActorContext, query: ListQueueRulesQuery): Promise<Paginated<QueueRuleView>> {
    const { cursor, limit, projectId } = query;
    return this.services.queueRules.list(ctx, {
      ...(cursor === undefined ? {} : { cursor }),
      ...(limit === undefined ? {} : { limit }),
      ...(projectId === undefined ? {} : { projectId }),
    });
  }

  get(ctx: ActorContext, ruleId: string): Promise<QueueRuleView> {
    return this.services.queueRules.get(ctx, ruleId);
  }

  create(ctx: ActorContext, input: CreateQueueRuleInput): Promise<QueueRuleView> {
    return this.services.queueRules.create(ctx, input);
  }

  update(ctx: ActorContext, ruleId: string, patch: UpdateQueueRuleInput): Promise<QueueRuleView> {
    return this.services.queueRules.update(ctx, ruleId, patch);
  }

  archive(ctx: ActorContext, ruleId: string): Promise<QueueRuleView> {
    return this.services.queueRules.archive(ctx, ruleId);
  }

  previewSlot(ctx: ActorContext, query: NextQueueSlotQuery): Promise<SlotProposal> {
    return this.services.queueRules.previewSlot(ctx, query);
  }

  proposeSlot(ctx: ActorContext, input: ProposeQueueSlotInput): Promise<QueueSlotReservationView> {
    return this.services.queueRules.proposeSlot(ctx, input);
  }

  acceptSlot(
    ctx: ActorContext,
    reservationId: string,
    contentItemId: string,
  ): Promise<QueueSlotReservationView> {
    return this.services.queueRules.acceptSlot(ctx, { reservationId, contentItemId });
  }

  releaseSlot(
    ctx: ActorContext,
    reservationId: string,
    reason?: string,
  ): Promise<QueueSlotReservationView> {
    return this.services.queueRules.releaseSlot(ctx, {
      reservationId,
      ...(reason === undefined ? {} : { reason }),
    });
  }

  listReservations(
    ctx: ActorContext,
    query: ListQueueSlotsQuery,
  ): Promise<Paginated<QueueSlotReservationView>> {
    const { cursor, limit, projectId } = query;
    return this.services.queueRules.listReservations(ctx, {
      projectId,
      ...(cursor === undefined ? {} : { cursor }),
      ...(limit === undefined ? {} : { limit }),
    });
  }
}
