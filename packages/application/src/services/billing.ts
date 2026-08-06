import { ValidationFailedError } from '@relay/contracts';

import type {
  ActorContext,
  CustomerBillingService,
  EntitlementStateView,
  ServiceDeps,
  UsageSummaryView,
} from '../types';

import { authorized } from '../internal/runtime';

/** Billing use cases shared by every product surface. */
export function createBillingService(deps: ServiceDeps): CustomerBillingService {
  return {
    async getEntitlements(ctx: ActorContext): Promise<EntitlementStateView> {
      return authorized(deps, ctx, 'billing.read', undefined, async () =>
        deps.billing.getEntitlements(ctx.workspaceId),
      );
    },

    async getUsage(
      ctx: ActorContext,
      input: {
        readonly range?: {
          readonly from: string;
          readonly to: string;
          readonly ianaTimeZone: string;
        };
      },
    ): Promise<UsageSummaryView> {
      return authorized(deps, ctx, 'billing.read', undefined, async () =>
        deps.billing.getUsage(ctx.workspaceId, input.range),
      );
    },

    async createCheckout(ctx, input) {
      return authorized(deps, ctx, 'billing.manage', undefined, async () => {
        if (ctx.idempotencyKey === undefined) {
          throw new ValidationFailedError({
            messageKey: 'errors.idempotency_key_required',
            details: { operation: 'billing.checkout' },
          });
        }
        return deps.billing.createCheckout({
          workspaceId: ctx.workspaceId,
          actorType: ctx.actorType,
          actorId: ctx.actorId,
          surface: ctx.surface,
          correlationId: ctx.correlationId,
          locale: ctx.locale,
          idempotencyKey: ctx.idempotencyKey,
          interval: input.interval,
          successUrl: input.successUrl,
        });
      });
    },

    async createPortalLink(ctx, input) {
      return authorized(deps, ctx, 'billing.manage', undefined, async () =>
        deps.billing.createPortalLink({
          workspaceId: ctx.workspaceId,
          returnUrl: input.returnUrl,
        }),
      );
    },

    handleProviderWebhook(input) {
      return deps.billing.handleProviderWebhook(input);
    },

    async hasEntitlement(ctx, entitlement) {
      return authorized(deps, ctx, 'billing.read', undefined, async () => {
        const result = await deps.billing.checkEntitlement({
          workspaceId: ctx.workspaceId,
          key: entitlement,
          requested: 0,
        });
        return result.allowed;
      });
    },
  };
}
