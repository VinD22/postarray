import { Inject, Injectable } from '@nestjs/common';

import type {
  ActorContext,
  CheckoutSessionView,
  EntitlementStateView,
  PortalLinkView,
  Services,
  TimeRange,
  UsageSummaryView,
  ViewModel,
} from '../../application/port.js';
import { SERVICES } from '../../application/tokens.js';

/** Transport-level delegation for billing. Entitlement logic is not here. */
@Injectable()
export class BillingService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  getEntitlements(ctx: ActorContext): Promise<EntitlementStateView> {
    return this.services.billing.getEntitlements(ctx);
  }

  getUsage(ctx: ActorContext, range: TimeRange | undefined): Promise<UsageSummaryView> {
    return this.services.billing.getUsage(ctx, range === undefined ? {} : { range });
  }

  createCheckout(
    ctx: ActorContext,
    input: { interval: 'monthly' | 'annual'; successUrl: string },
  ): Promise<CheckoutSessionView> {
    return this.services.billing.createCheckout(ctx, input);
  }

  createPortalLink(ctx: ActorContext, returnUrl: string): Promise<PortalLinkView> {
    return this.services.billing.createPortalLink(ctx, { returnUrl });
  }

  handleProviderWebhook(input: {
    eventId: string;
    eventType: string;
    bodyHash: string;
    payload: ViewModel;
  }): Promise<{ processed: boolean; duplicate: boolean }> {
    return this.services.billing.handleProviderWebhook(input);
  }
}
