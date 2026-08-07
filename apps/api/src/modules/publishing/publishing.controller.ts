import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import type {
  ActorContext,
  Paginated,
  PublicationReceiptView,
  PublishJobView,
  ReceiptSummaryView,
} from '../../application/port';
import { Actor, Idempotent, RateLimit, RequireScope } from '../../common/decorators';
import { cursorQuerySchema } from '../../common/pagination';
import { publishJobIdSchema, receiptIdSchema } from '../../common/schemas';
import { parseBody, parseParams, parseQuery } from '../../common/zod';
import { publishNowSchema, retryTargetSchema } from './publishing.schemas';
import { PublishingService } from './publishing.service';

/**
 * Immediate publishing, job status and publication receipts.
 *
 * The receipt is the product's answer to "did Relay post something I never
 * approved". It records the surface, the actor, the approval decision, the
 * exact content version hash and the permalink, which is precisely the set of
 * facts that question needs.
 *
 * A partially published job stays partially published. One failed target never
 * rolls back a target that already produced a real post on someone's timeline,
 * because there is no honest way to un-publish something a provider has already
 * shown to an audience.
 */
@Controller('v1')
export class PublishingController {
  constructor(private readonly publishing: PublishingService) {}

  /**
   * Publish now. Accepted rather than completed: the workflow starts, and the
   * job id is how a client follows it. Publishing synchronously would mean a
   * client timeout could not be distinguished from a failed publish.
   */
  @Post('publications')
  @RequireScope('posts:publish')
  @Idempotent()
  @RateLimit({ limit: 30, windowSeconds: 60, cost: 5, connectorBudget: true })
  @HttpCode(202)
  publishNow(@Actor() actor: ActorContext, @Body() body: unknown): Promise<PublishJobView> {
    return this.publishing.publishNow(actor, parseBody(publishNowSchema, body));
  }

  /** Job status, including every attempt and its classified error. */
  @Get('jobs/:id')
  @RequireScope('drafts:read')
  getJob(@Actor() actor: ActorContext, @Param('id') id: string): Promise<PublishJobView> {
    return this.publishing.getJob(actor, parseParams(publishJobIdSchema, id));
  }

  /** Retry one failed target. The targets that succeeded are left alone. */
  @Post('jobs/:id/retry')
  @RequireScope('posts:publish')
  @Idempotent()
  @RateLimit({ limit: 30, windowSeconds: 60, cost: 2, connectorBudget: true })
  @HttpCode(202)
  retryTarget(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<PublishJobView> {
    const { targetId } = parseBody(retryTargetSchema, body);
    return this.publishing.retryTarget(actor, parseParams(publishJobIdSchema, id), targetId);
  }

  /** Every receipt this job produced, one per external publication. */
  @Get('jobs/:id/receipts')
  @RequireScope('analytics:read')
  async listReceipts(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
  ): Promise<{ data: readonly PublicationReceiptView[] }> {
    return {
      data: await this.publishing.listReceiptsForJob(actor, parseParams(publishJobIdSchema, id)),
    };
  }

  /** Most recent immutable receipts across the current workspace. */
  @Get('receipts')
  @RequireScope('analytics:read')
  listRecentReceipts(
    @Actor() actor: ActorContext,
    @Query() query: Record<string, unknown>,
  ): Promise<Paginated<ReceiptSummaryView>> {
    return this.publishing.listRecentReceipts(actor, parseQuery(cursorQuerySchema, query));
  }

  @Get('receipts/:id')
  @RequireScope('analytics:read')
  getReceipt(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
  ): Promise<PublicationReceiptView> {
    return this.publishing.getReceipt(actor, parseParams(receiptIdSchema, id));
  }
}
