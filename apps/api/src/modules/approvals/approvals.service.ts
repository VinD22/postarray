import { Inject, Injectable } from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type {
  ActorContext,
  ApprovalRequestView,
  CursorQuery,
  Services,
} from '../../application/port';
import { SERVICES } from '../../application/tokens';
import type { DecideApprovalInput, RequestApprovalInput } from './approvals.schemas';

/** Transport-level delegation for approvals. The policy itself is not here. */
@Injectable()
export class ApprovalsService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  get(ctx: ActorContext, approvalId: string): Promise<ApprovalRequestView> {
    return this.services.approvals.get(ctx, approvalId);
  }

  request(ctx: ActorContext, input: RequestApprovalInput): Promise<ApprovalRequestView> {
    return this.services.approvals.request(ctx, input);
  }

  decide(
    ctx: ActorContext,
    approvalId: string,
    input: DecideApprovalInput,
  ): Promise<ApprovalRequestView> {
    return this.services.approvals.decide(ctx, { approvalId, ...input });
  }

  listPending(ctx: ActorContext, query: CursorQuery): Promise<Paginated<ApprovalRequestView>> {
    return this.services.approvals.listPending(ctx, query);
  }
}
