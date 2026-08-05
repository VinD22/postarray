import { Body, Controller, Get, HttpCode, Inject, Post, Query, Req } from '@nestjs/common';
import type { RelayConfig } from '@relay/config';
import { RelayError, ERROR_CODES, ValidationFailedError } from '@relay/contracts';
import type { Logger } from '@relay/observability';
import type { Request } from 'express';

import type {
  ActorContext,
  CheckoutSessionView,
  Clock,
  EntitlementStateView,
  KeyValueStore,
  PortalLinkView,
  UsageSummaryView,
} from '../../application/port.js';
import { CLOCK, KEY_VALUE_STORE, LOGGER, RELAY_CONFIG } from '../../application/tokens.js';
import {
  Actor,
  Idempotent,
  Public,
  RateLimit,
  RequireScope,
  RequireStepUp,
} from '../../common/decorators.js';
import { toEpochSeconds } from '../../common/instant.js';
import { relayState } from '../../common/request.types.js';
import { parseBody, parseOrThrow, parseQuery } from '../../common/zod.js';
import { bodyHash, verifySignature } from '../../security/signing.js';
import {
  createCheckoutSchema,
  createPortalLinkSchema,
  polarWebhookSchema,
  usageQuerySchema,
} from './billing.schemas.js';
import { BillingService } from './billing.service.js';

/** Webhook event ids are remembered for a week, well past any retry schedule. */
const WEBHOOK_DEDUPE_TTL_SECONDS = 7 * 24 * 60 * 60;

/**
 * Billing: entitlement state, usage, hosted checkout and the customer portal.
 *
 * Relay never sees a card number. Polar is the merchant of record and hosts the
 * checkout, so there is no card data in any Relay database, log or backup, and
 * that is a property of the architecture rather than of a policy document.
 */
@Controller('v1/billing')
export class BillingController {
  constructor(
    private readonly billing: BillingService,
    @Inject(RELAY_CONFIG) private readonly config: RelayConfig,
  ) {}

  /** The plan, the trial state, and what the workspace may currently do. */
  @Get('entitlements')
  @RequireScope('billing:read')
  entitlements(@Actor() actor: ActorContext): Promise<EntitlementStateView> {
    return this.billing.getEntitlements(actor);
  }

  /**
   * Metered usage: provider pass-through cost and AI text tokens. Shown before
   * an action rather than only on an invoice, so nobody discovers a cost after
   * committing to it.
   */
  @Get('usage')
  @RequireScope('billing:read')
  usage(@Actor() actor: ActorContext, @Query() query: unknown): Promise<UsageSummaryView> {
    const range = parseQuery(usageQuerySchema, query);
    const complete =
      range.from !== undefined && range.to !== undefined && range.ianaTimeZone !== undefined
        ? { from: range.from, to: range.to, ianaTimeZone: range.ianaTimeZone }
        : undefined;
    return this.billing.getUsage(actor, complete);
  }

  /**
   * Start a hosted checkout. The returned URL is Polar's. The success URL is
   * validated against our own app origin, because a checkout handoff that can
   * be pointed anywhere is a phishing primitive with our brand on it.
   */
  @Post('checkout')
  @RequireScope('billing:read')
  @RequireStepUp()
  @Idempotent()
  @HttpCode(201)
  checkout(@Actor() actor: ActorContext, @Body() body: unknown): Promise<CheckoutSessionView> {
    const input = parseBody(createCheckoutSchema, body);
    return this.billing.createCheckout(actor, {
      interval: input.interval,
      successUrl: this.requireAppOrigin(input.successUrl),
    });
  }

  @Post('portal')
  @RequireScope('billing:read')
  @RequireStepUp()
  @HttpCode(201)
  portal(@Actor() actor: ActorContext, @Body() body: unknown): Promise<PortalLinkView> {
    const { returnUrl } = parseBody(createPortalLinkSchema, body);
    return this.billing.createPortalLink(actor, this.requireAppOrigin(returnUrl));
  }

  /** A redirect target must be on our own app origin, exactly. */
  private requireAppOrigin(candidate: string): string {
    const appUrl = this.config.core.appUrl;
    if (appUrl === undefined) {
      throw new RelayError(ERROR_CODES.INTERNAL, { details: { reason: 'app_url_unset' } });
    }
    let target: URL;
    let expected: URL;
    try {
      target = new URL(candidate);
      expected = new URL(appUrl);
    } catch {
      throw new ValidationFailedError({ details: { field: 'url', reason: 'malformed' } });
    }
    if (target.origin !== expected.origin) {
      throw new ValidationFailedError({ details: { field: 'url', reason: 'origin_not_allowed' } });
    }
    return target.toString();
  }
}

/**
 * The Polar webhook receiver.
 *
 * The order here is the security control. The signature is verified over the
 * raw bytes **before** the body is parsed, because a JSON parse is a side
 * effect on attacker-controlled input and a handler that parses first has
 * already acted on an unverified message.
 *
 * Then: reject anything outside a five minute window, deduplicate on Polar's
 * own event id, and process idempotently. At-least-once delivery is the only
 * guarantee any provider offers, so a handler that is not safe to run twice is
 * a handler that will eventually double-charge or double-grant.
 *
 * A duplicate is acknowledged with 200 and processed zero times. Returning an
 * error for a duplicate would make Polar retry it forever.
 */
@Controller('v1/webhooks/polar')
export class PolarWebhookController {
  constructor(
    private readonly billing: BillingService,
    @Inject(RELAY_CONFIG) private readonly config: RelayConfig,
    @Inject(KEY_VALUE_STORE) private readonly kv: KeyValueStore,
    @Inject(CLOCK) private readonly clock: Clock,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {}

  @Public()
  @Post()
  @RateLimit({ limit: 600, windowSeconds: 60 })
  @HttpCode(200)
  async receive(@Req() request: Request): Promise<{ received: true; duplicate: boolean }> {
    const secret = this.config.polar.webhookSecret;
    if (secret === undefined) {
      // Refusing is correct: accepting an unverifiable webhook would mean
      // deriving an entitlement from an unauthenticated request.
      throw new RelayError(ERROR_CODES.INTERNAL, { details: { reason: 'webhook_secret_unset' } });
    }

    const raw = relayState(request).rawBody;
    const verification = verifySignature({
      secrets: [secret],
      signatureHeader: header(request, 'webhook-signature'),
      timestampHeader: header(request, 'webhook-timestamp'),
      rawBody: raw,
      nowEpochSeconds: toEpochSeconds(this.clock.now()),
    });
    if (!verification.valid || raw === undefined) {
      this.logger.warn({ reason: verification.reason ?? 'missing_body' }, 'polar_webhook_rejected');
      throw new RelayError(ERROR_CODES.FORBIDDEN, {
        details: { reason: `signature_${verification.reason ?? 'missing'}` },
      });
    }

    const eventId = header(request, 'webhook-id');
    if (eventId === undefined) {
      throw new ValidationFailedError({ details: { header: 'webhook-id', reason: 'required' } });
    }

    // Only now, with the bytes proven authentic, is the body parsed.
    const payload = parseOrThrow(polarWebhookSchema, safeJson(raw), { source: 'webhook' });

    const dedupeKey = `relay:webhook-inbox:polar:${eventId}`;
    const first = await this.kv.setIfAbsent(dedupeKey, this.clock.now().toISOString(), {
      ttlSeconds: WEBHOOK_DEDUPE_TTL_SECONDS,
    });
    if (!first) {
      return { received: true, duplicate: true };
    }

    const result = await this.billing.handleProviderWebhook({
      eventId,
      eventType: payload.type,
      bodyHash: bodyHash(raw),
      payload: payload.data,
    });
    return { received: true, duplicate: result.duplicate };
  }
}

function header(request: Request, name: string): string | undefined {
  const value = request.headers[name];
  return typeof value === 'string' ? value : undefined;
}

function safeJson(raw: Buffer): unknown {
  try {
    return JSON.parse(raw.toString('utf8'));
  } catch {
    throw new ValidationFailedError({ details: { source: 'webhook', reason: 'not_json' } });
  }
}
