import { Inject, Injectable } from '@nestjs/common';
import type { PublicationReceipt, PublishJob } from '@relay/contracts';

import type { ActorContext, Services, ViewModel } from '../../application/port';
import { SERVICES } from '../../application/tokens';

/**
 * Transport-level delegation for publishing and receipts.
 *
 * Every external side effect produces an immutable publication receipt and an
 * audit event, and one failed target never rolls back a target that already
 * produced a real post. Both facts are properties of the application layer and
 * the Temporal workflow behind it, not of this class.
 */
@Injectable()
export class PublishingService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  publishNow(
    ctx: ActorContext,
    input: { contentItemId: string; confirmation: ViewModel },
  ): Promise<PublishJob> {
    return this.services.publishing.publishNow(ctx, input);
  }

  getJob(ctx: ActorContext, jobId: string): Promise<PublishJob> {
    return this.services.publishing.getJob(ctx, jobId);
  }

  retryTarget(ctx: ActorContext, jobId: string, targetId: string): Promise<PublishJob> {
    return this.services.publishing.retryTarget(ctx, { jobId, targetId });
  }

  getReceipt(ctx: ActorContext, receiptId: string): Promise<PublicationReceipt> {
    return this.services.receipts.get(ctx, receiptId);
  }

  listReceiptsForJob(ctx: ActorContext, jobId: string): Promise<readonly PublicationReceipt[]> {
    return this.services.receipts.listForJob(ctx, jobId);
  }
}
