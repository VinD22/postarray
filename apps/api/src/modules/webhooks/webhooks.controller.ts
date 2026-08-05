import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import type {
  OperationRef,
  Paginated,
  WebhookDeliveryLog,
  WebhookEndpoint,
} from '@relay/contracts';

import type { ActorContext, ContentItemView } from '../../application/port.js';
import { Actor, Idempotent, RequireScope } from '../../common/decorators.js';
import { cursorQuerySchema } from '../../common/pagination.js';
import { webhookDeliveryIdSchema, webhookEndpointIdSchema } from '../../common/schemas.js';
import { parseBody, parseParams, parseQuery } from '../../common/zod.js';
import {
  createWebhookEndpointSchema,
  inboundIntegrationSchema,
  updateWebhookEndpointSchema,
} from './webhooks.schemas.js';
import { WebhooksService } from './webhooks.service.js';

/**
 * Outbound webhook endpoints.
 *
 * Deliveries are signed with HMAC-SHA256 over `timestamp + "." + raw body`, and
 * the timestamp travels in its own header so a receiver can reject anything
 * older than five minutes. Retries back off with jitter and every attempt is
 * logged with its response status and a redacted body prefix, so "did you send
 * it" is answerable without asking the customer to check their logs.
 *
 * An endpoint that fails for seven consecutive days is disabled automatically,
 * with an email and an Action Center item. Retrying forever into a dead URL is
 * a cost we would be paying on the customer's behalf without telling them.
 */
@Controller('v1/webhooks')
export class WebhooksController {
  constructor(private readonly webhooks: WebhooksService) {}

  @Get('endpoints')
  @RequireScope('webhooks:manage')
  list(@Actor() actor: ActorContext, @Query() query: unknown): Promise<Paginated<WebhookEndpoint>> {
    return this.webhooks.list(actor, parseQuery(cursorQuerySchema, query));
  }

  @Post('endpoints')
  @RequireScope('webhooks:manage')
  @Idempotent()
  @HttpCode(201)
  create(@Actor() actor: ActorContext, @Body() body: unknown): Promise<WebhookEndpoint> {
    return this.webhooks.create(actor, parseBody(createWebhookEndpointSchema, body));
  }

  @Patch('endpoints/:id')
  @RequireScope('webhooks:manage')
  update(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<WebhookEndpoint> {
    return this.webhooks.update(
      actor,
      parseParams(webhookEndpointIdSchema, id),
      parseBody(updateWebhookEndpointSchema, body),
    );
  }

  @Delete('endpoints/:id')
  @RequireScope('webhooks:manage')
  @HttpCode(204)
  async delete(@Actor() actor: ActorContext, @Param('id') id: string): Promise<void> {
    await this.webhooks.delete(actor, parseParams(webhookEndpointIdSchema, id));
  }

  /**
   * Send a test event. It is marked `isTest` in the envelope so a receiver can
   * never mistake it for real traffic and act on it.
   */
  @Post('endpoints/:id/test')
  @RequireScope('webhooks:manage')
  @Idempotent()
  @HttpCode(202)
  test(@Actor() actor: ActorContext, @Param('id') id: string): Promise<WebhookDeliveryLog> {
    return this.webhooks.testDelivery(actor, parseParams(webhookEndpointIdSchema, id));
  }

  @Get('endpoints/:id/deliveries')
  @RequireScope('webhooks:manage')
  listDeliveries(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Query() query: unknown,
  ): Promise<Paginated<WebhookDeliveryLog>> {
    return this.webhooks.listDeliveries(
      actor,
      parseParams(webhookEndpointIdSchema, id),
      parseQuery(cursorQuerySchema, query),
    );
  }

  /** Resend one delivery. The envelope id stays the same, so the receiver dedupes. */
  @Post('deliveries/:id/redeliver')
  @RequireScope('webhooks:manage')
  @Idempotent()
  @HttpCode(202)
  redeliver(@Actor() actor: ActorContext, @Param('id') id: string): Promise<WebhookDeliveryLog> {
    return this.webhooks.redeliver(actor, parseParams(webhookDeliveryIdSchema, id));
  }
}

/**
 * The inbound integration endpoint.
 *
 * A customer's own system posts JSON here to create a draft or to start a named
 * Automation Rule. It is authenticated like any other API call and carries an
 * `Idempotency-Key`, so an at-least-once sender cannot create the same draft
 * twice.
 *
 * What it explicitly cannot do is publish. Inbound data is a request to enter
 * the normal workflow, at the start of it, subject to the same validation,
 * account scope and approval policy as a draft a person typed. That is the
 * whole safety property of this route, and it is why the payload can name a
 * rule but can never name a connection to post to directly.
 */
@Controller('v1/integrations')
export class InboundIntegrationController {
  constructor(private readonly webhooks: WebhooksService) {}

  @Post('inbound')
  @RequireScope('rules:write')
  @Idempotent()
  @HttpCode(202)
  async inbound(
    @Actor() actor: ActorContext,
    @Body() body: unknown,
  ): Promise<{ draft: ContentItemView | null; operation: OperationRef | null }> {
    const payload = parseBody(inboundIntegrationSchema, body);
    if (payload.draft !== undefined) {
      return {
        draft: await this.webhooks.createDraftFromInbound(actor, payload.draft),
        operation: null,
      };
    }
    if (payload.rule !== undefined) {
      const operation = await this.webhooks.startRuleFromInbound(actor, {
        ruleName: payload.rule.name,
        event: payload.rule.event,
      });
      return { draft: null, operation };
    }
    // Unreachable: the schema refines to exactly one of the two branches.
    return { draft: null, operation: null };
  }
}
