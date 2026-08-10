import type { Logger } from '@relay/observability';

import { deriveEntitlement, verifiedSubscriptionSchema } from './entitlements';
import type { EntitlementSnapshot, VerifiedSubscription } from './entitlements';
import { InMemorySubscriptionStore, InMemoryWebhookInbox } from './inbox';
import type {
  SubscriptionStore,
  WebhookInboxStore,
  WebhookResult,
  WebhookSignatureState,
} from './inbox';
import { buildProjectAllowanceGrant } from './project-allowance';
import type { ProjectAllowanceGrant } from './project-allowance';
import {
  isKnownPolarEventType,
  polarBenefitGrantSchema,
  polarOrderSchema,
  polarSubscriptionSchema,
  polarWebhookBodySchema,
} from './polar-schemas';
import type { PolarEventType, PolarOrder, PolarSubscription } from './polar-schemas';
import { hashBody, verifyWebhookSignature } from './signature';
import type { Clock } from './time';
import { isAfter, nowIso } from './time';

export { InMemorySubscriptionStore, InMemoryWebhookInbox } from './inbox';
export type {
  MarkProcessedInput,
  NewWebhookInboxRecord,
  SubscriptionStore,
  WebhookInboxRecord,
  WebhookInboxStore,
  WebhookResult,
  WebhookSignatureState,
} from './inbox';

/**
 * Webhook ingestion.
 *
 * Order of operations, and it matters:
 *   1. verify the signature, before parsing anything for side effects;
 *   2. write the inbox row, rejected bodies included, for forensics;
 *   3. stop with `noop` if the unique index says we have seen this event id;
 *   4. compare Polar's `modified_at` and mark an older event `superseded`;
 *   5. apply, which is a pure function of the payload plus current state, so
 *      retrying is always safe.
 */

export interface EntitlementChange {
  readonly workspaceId: string;
  readonly subscriptionId: string;
  readonly before: EntitlementSnapshot | null;
  readonly after: EntitlementSnapshot;
  readonly cause: PolarEventType;
}

export interface OrderEvent {
  readonly order: PolarOrder;
  readonly workspaceId: string | null;
  readonly eventType: PolarEventType;
}

export interface WebhookProcessorDeps {
  readonly inbox: WebhookInboxStore;
  readonly subscriptions: SubscriptionStore;
  readonly clock: Clock;
  readonly webhookSecret: string | undefined;
  readonly logger?: Logger;
  readonly toleranceSeconds?: number;
  /** Polar product id to tier key. Unmapped ids resolve to the base tier. */
  readonly productTiers?: Readonly<Record<string, string>>;
  /** Fired whenever the derived entitlement state changes. */
  readonly onEntitlementChange?: (change: EntitlementChange) => Promise<void> | void;
  /**
   * Fired on every verified subscription upsert with the numeric entitlement
   * row migration 0066 reads. The caller writes it; this package does not own a
   * database connection. It is idempotent: the same event replayed produces the
   * same row.
   */
  readonly onProjectAllowance?: (grant: ProjectAllowanceGrant) => Promise<void> | void;
  /** Fired on `order.paid`. The affiliate ledger accrues from here. */
  readonly onOrderPaid?: (event: OrderEvent) => Promise<void> | void;
  /** Fired on `order.refunded`. The affiliate ledger reverses from here. */
  readonly onOrderRefunded?: (event: OrderEvent) => Promise<void> | void;
}

export interface IncomingWebhook {
  readonly rawBody: string;
  readonly headers: Readonly<Record<string, string | undefined>>;
}

export interface WebhookOutcome {
  readonly result: WebhookResult;
  readonly signatureState: WebhookSignatureState;
  readonly providerEventId: string;
  readonly eventType: string;
  readonly known: boolean;
  readonly entitlementBefore: EntitlementSnapshot | null;
  readonly entitlementAfter: EntitlementSnapshot | null;
  readonly note: string | null;
}

/** The workspace a subscription belongs to, from metadata or the external id. */
export function workspaceIdOf(subscription: PolarSubscription): string | null {
  const fromMetadata = subscription.metadata.workspaceId;
  if (typeof fromMetadata === 'string' && fromMetadata.length > 0) {
    return fromMetadata;
  }
  return null;
}

export interface ToVerifiedSubscriptionInput {
  readonly subscription: PolarSubscription;
  readonly workspaceId: string;
  readonly source: 'webhook' | 'reconciliation';
  readonly verifiedAt: string;
  readonly previous: VerifiedSubscription | null;
}

/**
 * Normalise a Polar subscription into the record entitlements derive from.
 * `pastDueSince` is preserved across updates so the grace clock starts when the
 * payment first failed, not when the latest webhook happened to arrive.
 */
export function toVerifiedSubscription(input: ToVerifiedSubscriptionInput): VerifiedSubscription {
  const { subscription, previous } = input;
  const pastDueSince =
    subscription.status === 'past_due'
      ? ((previous?.status === 'past_due' ? previous.pastDueSince : null) ??
        subscription.modifiedAt)
      : null;
  return verifiedSubscriptionSchema.parse({
    subscriptionId: subscription.id,
    workspaceId: input.workspaceId,
    customerId: subscription.customerId,
    productId: subscription.productId,
    interval: subscription.interval,
    status: subscription.status,
    amountMinor: subscription.amountMinor,
    currency: subscription.currency,
    currentPeriodStart: subscription.currentPeriodStart,
    currentPeriodEnd: subscription.currentPeriodEnd,
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    canceledAt: subscription.canceledAt,
    trialStart: subscription.trialStart,
    trialEnd: subscription.trialEnd,
    endsAt: subscription.endsAt,
    endedAt: subscription.endedAt,
    modifiedAt: subscription.modifiedAt,
    pastDueSince,
    source: input.source,
    verifiedAt: input.verifiedAt,
  });
}

const SUBSCRIPTION_EVENTS: readonly PolarEventType[] = Object.freeze([
  'subscription.created',
  'subscription.updated',
  'subscription.active',
  'subscription.canceled',
  'subscription.uncanceled',
  'subscription.revoked',
  'subscription.past_due',
]);

const ORDER_EVENTS: readonly PolarEventType[] = Object.freeze([
  'order.created',
  'order.paid',
  'order.refunded',
]);

const BENEFIT_GRANT_EVENTS: readonly PolarEventType[] = Object.freeze([
  'benefit_grant.created',
  'benefit_grant.cycled',
  'benefit_grant.updated',
  'benefit_grant.revoked',
]);

export interface WebhookProcessor {
  handle(incoming: IncomingWebhook): Promise<WebhookOutcome>;
}

export function createWebhookProcessor(deps: WebhookProcessorDeps): WebhookProcessor {
  async function applySubscriptionEvent(
    eventType: PolarEventType,
    data: unknown,
    receivedAt: string,
  ): Promise<{
    result: WebhookResult;
    before: EntitlementSnapshot | null;
    after: EntitlementSnapshot | null;
    note: string | null;
  }> {
    const parsed = polarSubscriptionSchema.safeParse(data);
    if (!parsed.success) {
      return { result: 'failed', before: null, after: null, note: 'subscription_payload_invalid' };
    }
    const subscription = parsed.data;
    const workspaceId = workspaceIdOf(subscription);
    if (workspaceId === null) {
      return { result: 'failed', before: null, after: null, note: 'workspace_not_identified' };
    }
    const previous = await deps.subscriptions.getBySubscriptionId(subscription.id);
    if (previous !== null && isAfter(previous.modifiedAt, subscription.modifiedAt)) {
      // Out of order delivery. The stored state is newer; do not regress it.
      return { result: 'superseded', before: null, after: null, note: 'older_than_stored_state' };
    }
    const derivation = {
      now: receivedAt,
      ...(deps.productTiers === undefined ? {} : { productTiers: deps.productTiers }),
    };
    const before = previous === null ? null : deriveEntitlement(previous, derivation);
    const next = toVerifiedSubscription({
      subscription,
      workspaceId,
      source: 'webhook',
      verifiedAt: receivedAt,
      previous,
    });
    await deps.subscriptions.upsert(next);
    const grant = buildProjectAllowanceGrant({
      subscription: next,
      effectiveFrom: receivedAt,
      ...(deps.productTiers === undefined ? {} : { productTiers: deps.productTiers }),
    });
    if (grant !== null) {
      await deps.onProjectAllowance?.(grant);
    }
    const after = deriveEntitlement(next, derivation);
    if (before === null || before.state !== after.state) {
      await deps.onEntitlementChange?.({
        workspaceId,
        subscriptionId: subscription.id,
        before,
        after,
        cause: eventType,
      });
    }
    return { result: 'applied', before, after, note: null };
  }

  async function applyOrderEvent(
    eventType: PolarEventType,
    data: unknown,
  ): Promise<{ result: WebhookResult; note: string | null }> {
    const parsed = polarOrderSchema.safeParse(data);
    if (!parsed.success) {
      return { result: 'failed', note: 'order_payload_invalid' };
    }
    const order = parsed.data;
    const workspaceId =
      order.subscriptionId === null
        ? null
        : ((await deps.subscriptions.getBySubscriptionId(order.subscriptionId))?.workspaceId ??
          null);
    const event: OrderEvent = { order, workspaceId, eventType };
    if (eventType === 'order.paid') {
      await deps.onOrderPaid?.(event);
    } else if (eventType === 'order.refunded') {
      await deps.onOrderRefunded?.(event);
    }
    return { result: 'applied', note: null };
  }

  async function applyBenefitGrantEvent(
    data: unknown,
  ): Promise<{ result: WebhookResult; note: string | null }> {
    const parsed = polarBenefitGrantSchema.safeParse(data);
    if (!parsed.success) {
      return { result: 'failed', note: 'benefit_grant_payload_invalid' };
    }
    // Benefit grants mirror the subscription we already derive from. They are
    // recorded for reconciliation and never used as a second source of truth.
    return { result: 'applied', note: 'benefit_grant_recorded' };
  }

  return {
    async handle(incoming: IncomingWebhook): Promise<WebhookOutcome> {
      const receivedAt = nowIso(deps.clock);
      const nowSeconds = Math.floor(deps.clock.now().getTime() / 1000);
      const verification = await verifyWebhookSignature({
        secret: deps.webhookSecret,
        rawBody: incoming.rawBody,
        headers: incoming.headers,
        nowSeconds,
        ...(deps.toleranceSeconds === undefined ? {} : { toleranceSeconds: deps.toleranceSeconds }),
      });
      const bodyHash = await hashBody(incoming.rawBody);

      // Read the type for routing and metrics only. Nothing is acted upon until
      // the signature has verified.
      const bodyParse = polarWebhookBodySchema.safeParse(safeJson(incoming.rawBody));
      const eventType = bodyParse.success ? bodyParse.data.type : 'unknown';
      const providerEventId = verification.webhookId ?? `unsigned_${bodyHash.slice(0, 32)}`;

      const insertion = await deps.inbox.insert({
        providerEventId,
        eventType,
        signatureState: verification.state,
        signatureFailureReason: verification.state === 'rejected' ? verification.reason : null,
        bodyHash,
        payload: incoming.rawBody,
        receivedAt,
      });

      if (verification.state === 'rejected') {
        // Stored for forensics, never processed. It grants nothing.
        if (insertion === 'inserted') {
          await deps.inbox.markProcessed({
            providerEventId,
            result: 'noop',
            processedAt: receivedAt,
            lastError: verification.reason,
          });
        }
        deps.logger?.warn(
          { providerEventId, reason: verification.reason },
          'billing.webhook.signature_rejected',
        );
        return {
          result: 'noop',
          signatureState: 'rejected',
          providerEventId,
          eventType,
          known: false,
          entitlementBefore: null,
          entitlementAfter: null,
          note: verification.reason,
        };
      }

      if (insertion === 'duplicate') {
        return {
          result: 'noop',
          signatureState: 'verified',
          providerEventId,
          eventType,
          known: isKnownPolarEventType(eventType),
          entitlementBefore: null,
          entitlementAfter: null,
          note: 'duplicate_event_id',
        };
      }

      await deps.inbox.incrementAttempt(providerEventId);

      if (!bodyParse.success) {
        await deps.inbox.markProcessed({
          providerEventId,
          result: 'failed',
          processedAt: receivedAt,
          lastError: 'body_not_json',
        });
        return {
          result: 'failed',
          signatureState: 'verified',
          providerEventId,
          eventType,
          known: false,
          entitlementBefore: null,
          entitlementAfter: null,
          note: 'body_not_json',
        };
      }

      if (!isKnownPolarEventType(eventType)) {
        // Unknown types are stored and take no action. Never a throw.
        await deps.inbox.markProcessed({
          providerEventId,
          result: 'noop',
          processedAt: receivedAt,
        });
        return {
          result: 'noop',
          signatureState: 'verified',
          providerEventId,
          eventType,
          known: false,
          entitlementBefore: null,
          entitlementAfter: null,
          note: 'unknown_event_type',
        };
      }

      const data = bodyParse.data.data;
      try {
        if (SUBSCRIPTION_EVENTS.includes(eventType)) {
          const applied = await applySubscriptionEvent(eventType, data, receivedAt);
          await deps.inbox.markProcessed({
            providerEventId,
            result: applied.result,
            processedAt: receivedAt,
            ...(applied.note === null ? {} : { lastError: applied.note }),
          });
          return {
            result: applied.result,
            signatureState: 'verified',
            providerEventId,
            eventType,
            known: true,
            entitlementBefore: applied.before,
            entitlementAfter: applied.after,
            note: applied.note,
          };
        }

        if (ORDER_EVENTS.includes(eventType)) {
          const applied = await applyOrderEvent(eventType, data);
          await deps.inbox.markProcessed({
            providerEventId,
            result: applied.result,
            processedAt: receivedAt,
            ...(applied.note === null ? {} : { lastError: applied.note }),
          });
          return {
            result: applied.result,
            signatureState: 'verified',
            providerEventId,
            eventType,
            known: true,
            entitlementBefore: null,
            entitlementAfter: null,
            note: applied.note,
          };
        }

        if (BENEFIT_GRANT_EVENTS.includes(eventType)) {
          const applied = await applyBenefitGrantEvent(data);
          await deps.inbox.markProcessed({
            providerEventId,
            result: applied.result,
            processedAt: receivedAt,
            ...(applied.note === null ? {} : { lastError: applied.note }),
          });
          return {
            result: applied.result,
            signatureState: 'verified',
            providerEventId,
            eventType,
            known: true,
            entitlementBefore: null,
            entitlementAfter: null,
            note: applied.note,
          };
        }

        // Known, consumed for completeness, no entitlement consequence.
        await deps.inbox.markProcessed({
          providerEventId,
          result: 'noop',
          processedAt: receivedAt,
        });
        return {
          result: 'noop',
          signatureState: 'verified',
          providerEventId,
          eventType,
          known: true,
          entitlementBefore: null,
          entitlementAfter: null,
          note: 'no_entitlement_effect',
        };
      } catch (error) {
        const attempts = await deps.inbox.incrementAttempt(providerEventId);
        await deps.inbox.markProcessed({
          providerEventId,
          result: 'failed',
          processedAt: receivedAt,
          lastError: 'processing_failed',
        });
        deps.logger?.error(
          { providerEventId, eventType, attempts, err: error },
          'billing.webhook.processing_failed',
        );
        return {
          result: 'failed',
          signatureState: 'verified',
          providerEventId,
          eventType,
          known: true,
          entitlementBefore: null,
          entitlementAfter: null,
          note: 'processing_failed',
        };
      }
    },
  };
}

function safeJson(raw: string): unknown {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

/** After three failures the row is alerted on. It is never discarded. */
export const WEBHOOK_FAILURE_ALERT_THRESHOLD = 3;

export function shouldAlertOnFailure(attempts: number): boolean {
  return attempts >= WEBHOOK_FAILURE_ALERT_THRESHOLD;
}

/** Convenience wiring for local development and tests. */
export function createInMemoryWebhookStores(): {
  inbox: InMemoryWebhookInbox;
  subscriptions: InMemorySubscriptionStore;
} {
  return { inbox: new InMemoryWebhookInbox(), subscriptions: new InMemorySubscriptionStore() };
}
