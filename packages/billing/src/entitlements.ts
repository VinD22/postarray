import { z } from 'zod';

import { RelayError, subscriptionStatusSchema } from '@relay/contracts';
import type { SubscriptionStatus } from '@relay/contracts';

import { BILLING_MESSAGE_KEYS } from './messages';
import {
  ACTIVE_CHANNEL_ALLOWANCE,
  GRACE_PERIOD_DAYS,
  READ_ONLY_PERIOD_DAYS,
  billingIntervalSchema,
} from './products';
import { addDays, daysUntil, isAtOrAfter, isBefore } from './time';

/**
 * Entitlements are **derived**, never hand set, and only ever from verified
 * subscription state.
 *
 * `source` is part of the record on purpose. A state observed on the browser
 * success redirect carries `source: 'redirect'` and derives to `none`, so the
 * rule "the redirect grants nothing" is enforced by the type and the function
 * rather than by everyone remembering it.
 *
 * `past_due` never silently deletes content and never silently dispatches a
 * scheduled post. It moves to a disclosed grace period, then to read only, and
 * scheduled work is paused rather than cancelled.
 */

export const SUBSCRIPTION_SOURCES = [
  'webhook',
  'reconciliation',
  'redirect',
  'unverified',
] as const;
export const subscriptionSourceSchema = z.enum(SUBSCRIPTION_SOURCES);
export type SubscriptionSource = z.infer<typeof subscriptionSourceSchema>;

/** Only these two are evidence. Everything else derives to no entitlement. */
export const VERIFIED_SUBSCRIPTION_SOURCES: readonly SubscriptionSource[] = Object.freeze([
  'webhook',
  'reconciliation',
]);

export function isVerifiedSource(source: SubscriptionSource): boolean {
  return VERIFIED_SUBSCRIPTION_SOURCES.includes(source);
}

/** The workspace-scoped record we store from Polar and reconcile against. */
export const verifiedSubscriptionSchema = z
  .object({
    subscriptionId: z.string().min(1),
    workspaceId: z.string().min(1),
    customerId: z.string().min(1),
    productId: z.string().min(1),
    interval: billingIntervalSchema,
    status: subscriptionStatusSchema,
    amountMinor: z.number().int().nonnegative(),
    currency: z.string().length(3),
    currentPeriodStart: z.string().min(1),
    currentPeriodEnd: z.string().min(1).nullable(),
    cancelAtPeriodEnd: z.boolean(),
    canceledAt: z.string().min(1).nullable(),
    trialStart: z.string().min(1).nullable(),
    trialEnd: z.string().min(1).nullable(),
    endsAt: z.string().min(1).nullable(),
    endedAt: z.string().min(1).nullable(),
    /** Polar's own ordering key. Older events are superseded, never applied. */
    modifiedAt: z.string().min(1),
    /** When the subscription first went `past_due`. Starts the grace clock. */
    pastDueSince: z.string().min(1).nullable(),
    source: subscriptionSourceSchema,
    verifiedAt: z.string().min(1),
  })
  .strict();
export type VerifiedSubscription = z.infer<typeof verifiedSubscriptionSchema>;

export const ENTITLEMENT_STATES = [
  'full',
  'full_grace',
  'full_until_period_end',
  'read_only',
  'none',
] as const;
export const entitlementStateSchema = z.enum(ENTITLEMENT_STATES);
export type EntitlementState = z.infer<typeof entitlementStateSchema>;

export const ENTITLEMENT_REASONS = [
  'no_subscription',
  'unverified_source',
  'trialing',
  'active',
  'grace_period',
  'grace_expired',
  'ends_at_period_end',
  'subscription_ended',
  'unpaid',
  'incomplete',
  'channel_allowance_exceeded',
] as const;
export const entitlementReasonSchema = z.enum(ENTITLEMENT_REASONS);
export type EntitlementReason = z.infer<typeof entitlementReasonSchema>;

export const BILLING_ACTIONS = [
  'read',
  'export',
  'analytics_read',
  'create_draft',
  'edit_draft',
  'schedule_post',
  'publish_post',
  'dispatch_scheduled_post',
  'ai_text',
  'connect_channel',
  'invite_member',
  'manage_billing',
  'use_api',
] as const;
export const billingActionSchema = z.enum(BILLING_ACTIONS);
export type BillingAction = z.infer<typeof billingActionSchema>;

/** Always available, in every state, including after the subscription ends. */
export const ALWAYS_ALLOWED_ACTIONS: readonly BillingAction[] = Object.freeze([
  'read',
  'export',
  'manage_billing',
]);

/** Blocked the moment a workspace becomes read only. */
export const CONSUMING_ACTIONS: readonly BillingAction[] = Object.freeze([
  'schedule_post',
  'publish_post',
  'dispatch_scheduled_post',
  'ai_text',
  'connect_channel',
]);

export type EntitlementEffect = 'allow' | 'deny' | 'read_only';

export interface EntitlementSnapshot {
  readonly state: EntitlementState;
  readonly reason: EntitlementReason;
  readonly verified: boolean;
  readonly subscriptionId: string | null;
  readonly status: SubscriptionStatus | null;
  readonly publishAllowed: boolean;
  readonly scheduleAllowed: boolean;
  readonly dispatchAllowed: boolean;
  readonly aiAllowed: boolean;
  readonly analyticsAllowed: boolean;
  readonly exportAllowed: boolean;
  readonly activeChannelAllowance: number;
  readonly isTrialing: boolean;
  readonly trialEndsAt: string | null;
  readonly trialDaysRemaining: number | null;
  /** When a `past_due` workspace becomes read only. Shown in the banner. */
  readonly readOnlyAt: string | null;
  /** When access ends entirely. Data is retained past this date. */
  readonly accessEndsAt: string | null;
  readonly bannerKey: string | null;
  readonly evaluatedAt: string;
}

export interface DeriveEntitlementOptions {
  readonly now: string;
  readonly gracePeriodDays?: number;
  readonly readOnlyPeriodDays?: number;
  readonly activeChannelAllowance?: number;
}

const FULL_STATES: readonly EntitlementState[] = Object.freeze([
  'full',
  'full_grace',
  'full_until_period_end',
]);

export function isFullAccess(state: EntitlementState): boolean {
  return FULL_STATES.includes(state);
}

function snapshot(
  input: {
    state: EntitlementState;
    reason: EntitlementReason;
    subscription: VerifiedSubscription | null;
    bannerKey: string | null;
    readOnlyAt?: string | null;
    accessEndsAt?: string | null;
  },
  options: DeriveEntitlementOptions,
): EntitlementSnapshot {
  const full = isFullAccess(input.state);
  const subscription = input.subscription;
  const isTrialing = subscription?.status === 'trialing';
  const trialEndsAt = isTrialing ? (subscription?.trialEnd ?? null) : null;
  return {
    state: input.state,
    reason: input.reason,
    verified: subscription !== null && isVerifiedSource(subscription.source),
    subscriptionId: subscription?.subscriptionId ?? null,
    status: subscription?.status ?? null,
    publishAllowed: full,
    scheduleAllowed: full,
    dispatchAllowed: full,
    aiAllowed: full,
    analyticsAllowed: input.state !== 'none',
    exportAllowed: true,
    activeChannelAllowance: options.activeChannelAllowance ?? ACTIVE_CHANNEL_ALLOWANCE,
    isTrialing,
    trialEndsAt,
    trialDaysRemaining: trialEndsAt === null ? null : daysUntil(trialEndsAt, options.now),
    readOnlyAt: input.readOnlyAt ?? null,
    accessEndsAt: input.accessEndsAt ?? null,
    bannerKey: input.bannerKey,
    evaluatedAt: options.now,
  };
}

/**
 * The one derivation. Every row of the entitlement table in
 * `docs/planning/08-billing-entitlements-and-economics.md` section 5.3 maps
 * here, and `entitlements.test.ts` walks the table.
 */
export function deriveEntitlement(
  subscription: VerifiedSubscription | null,
  options: DeriveEntitlementOptions,
): EntitlementSnapshot {
  if (subscription === null) {
    return snapshot(
      {
        state: 'none',
        reason: 'no_subscription',
        subscription: null,
        bannerKey: 'billing.subscription.status.none',
      },
      options,
    );
  }
  if (!isVerifiedSource(subscription.source)) {
    // The success redirect is not evidence. Reconciliation closes the gap.
    return snapshot(
      {
        state: 'none',
        reason: 'unverified_source',
        subscription,
        bannerKey: 'billing.checkout.notEntitledYet',
      },
      options,
    );
  }

  const graceDays = options.gracePeriodDays ?? GRACE_PERIOD_DAYS;
  const readOnlyDays = options.readOnlyPeriodDays ?? READ_ONLY_PERIOD_DAYS;

  switch (subscription.status) {
    case 'trialing':
    case 'active': {
      if (subscription.cancelAtPeriodEnd) {
        const endsAt = subscription.endsAt ?? subscription.currentPeriodEnd;
        if (endsAt !== null && isAtOrAfter(options.now, endsAt)) {
          return snapshot(
            {
              state: 'read_only',
              reason: 'subscription_ended',
              subscription,
              bannerKey: 'billing.subscription.readOnly',
              accessEndsAt: endsAt,
            },
            options,
          );
        }
        return snapshot(
          {
            state: 'full_until_period_end',
            reason: 'ends_at_period_end',
            subscription,
            bannerKey: 'billing.subscription.endsOn',
            accessEndsAt: endsAt,
          },
          options,
        );
      }
      return snapshot(
        {
          state: 'full',
          reason: subscription.status === 'trialing' ? 'trialing' : 'active',
          subscription,
          bannerKey: subscription.status === 'trialing' ? 'billing.trial.daysRemaining' : null,
        },
        options,
      );
    }

    case 'past_due': {
      const since = subscription.pastDueSince ?? subscription.modifiedAt;
      const readOnlyAt = addDays(since, graceDays);
      const accessEndsAt = addDays(readOnlyAt, readOnlyDays);
      if (isBefore(options.now, readOnlyAt)) {
        return snapshot(
          {
            state: 'full_grace',
            reason: 'grace_period',
            subscription,
            bannerKey: 'billing.subscription.pastDueBody',
            readOnlyAt,
            accessEndsAt,
          },
          options,
        );
      }
      return snapshot(
        {
          state: 'read_only',
          reason: 'grace_expired',
          subscription,
          bannerKey: 'billing.subscription.readOnly',
          readOnlyAt,
          accessEndsAt,
        },
        options,
      );
    }

    case 'canceled': {
      const endsAt = subscription.endedAt ?? subscription.endsAt ?? subscription.currentPeriodEnd;
      if (endsAt !== null && isBefore(options.now, endsAt)) {
        return snapshot(
          {
            state: 'full_until_period_end',
            reason: 'ends_at_period_end',
            subscription,
            bannerKey: 'billing.subscription.endsOn',
            accessEndsAt: endsAt,
          },
          options,
        );
      }
      return snapshot(
        {
          state: 'read_only',
          reason: 'subscription_ended',
          subscription,
          bannerKey: 'billing.subscription.readOnly',
          accessEndsAt: endsAt,
        },
        options,
      );
    }

    case 'unpaid':
      return snapshot(
        {
          state: 'read_only',
          reason: 'unpaid',
          subscription,
          bannerKey: 'billing.subscription.readOnly',
        },
        options,
      );

    case 'incomplete':
      return snapshot(
        {
          state: 'none',
          reason: 'incomplete',
          subscription,
          bannerKey: 'billing.subscription.status.none',
        },
        options,
      );
  }
}

export interface EntitlementDecision {
  readonly effect: EntitlementEffect;
  readonly action: BillingAction;
  readonly state: EntitlementState;
  readonly reason: EntitlementReason;
  readonly messageKey: string;
  readonly bannerKey: string | null;
  readonly readOnlyAt: string | null;
  readonly accessEndsAt: string | null;
}

export interface EvaluateEntitlementOptions extends DeriveEntitlementOptions {
  /** Current active connection count, checked only for `connect_channel`. */
  readonly activeChannelCount?: number;
}

function messageKeyFor(reason: EntitlementReason): string {
  switch (reason) {
    case 'grace_period':
    case 'grace_expired':
      return BILLING_MESSAGE_KEYS.pastDue;
    case 'unpaid':
    case 'subscription_ended':
      return BILLING_MESSAGE_KEYS.paymentRequired;
    case 'channel_allowance_exceeded':
      return BILLING_MESSAGE_KEYS.channelLimitReached;
    case 'no_subscription':
    case 'incomplete':
    case 'unverified_source':
      return BILLING_MESSAGE_KEYS.paymentRequired;
    // States that grant access. The key is carried for completeness and is not
    // rendered while the effect is `allow`.
    case 'trialing':
    case 'active':
    case 'ends_at_period_end':
      return BILLING_MESSAGE_KEYS.entitlementMissing;
  }
}

/**
 * `allow`, `deny` or `read_only` for one action, with the reason attached.
 *
 * `read_only` is distinct from `deny` because the product says something
 * different for each: read only means the workspace still works and the fix is
 * a payment, deny means this action is not available at all.
 */
export function evaluateEntitlement(
  subscription: VerifiedSubscription | null,
  action: BillingAction,
  options: EvaluateEntitlementOptions,
): EntitlementDecision {
  const derived = deriveEntitlement(subscription, options);
  const base = {
    action,
    state: derived.state,
    bannerKey: derived.bannerKey,
    readOnlyAt: derived.readOnlyAt,
    accessEndsAt: derived.accessEndsAt,
  } as const;

  if (ALWAYS_ALLOWED_ACTIONS.includes(action)) {
    return {
      ...base,
      effect: 'allow',
      reason: derived.reason,
      messageKey: messageKeyFor(derived.reason),
    };
  }

  if (derived.state === 'none') {
    return {
      ...base,
      effect: 'deny',
      reason: derived.reason,
      messageKey: messageKeyFor(derived.reason),
    };
  }

  if (derived.state === 'read_only') {
    const readOnly = action === 'analytics_read' ? ('allow' as const) : ('read_only' as const);
    return {
      ...base,
      effect: readOnly,
      reason: derived.reason,
      messageKey: messageKeyFor(derived.reason),
    };
  }

  if (
    action === 'connect_channel' &&
    options.activeChannelCount !== undefined &&
    options.activeChannelCount >= derived.activeChannelAllowance
  ) {
    return {
      ...base,
      effect: 'deny',
      reason: 'channel_allowance_exceeded',
      messageKey: messageKeyFor('channel_allowance_exceeded'),
    };
  }

  return {
    ...base,
    effect: 'allow',
    reason: derived.reason,
    messageKey: messageKeyFor(derived.reason),
  };
}

/** Turn a refusal into the error the application layer throws. */
export function entitlementError(decision: EntitlementDecision): RelayError {
  if (decision.effect === 'allow') {
    throw new RelayError('INTERNAL', { messageKey: BILLING_MESSAGE_KEYS.internal });
  }
  const code =
    decision.reason === 'channel_allowance_exceeded' ? 'QUOTA_EXCEEDED' : 'PAYMENT_REQUIRED';
  return new RelayError(code, {
    messageKey: decision.messageKey,
    details: {
      entitlementState: decision.state,
      reason: decision.reason,
      action: decision.action,
      readOnlyAt: decision.readOnlyAt,
      accessEndsAt: decision.accessEndsAt,
    },
  });
}

/** What happens to already-approved scheduled work in a given state. */
export const SCHEDULED_POST_DISPOSITIONS = ['dispatch', 'pause_by_billing'] as const;
export type ScheduledPostDisposition = (typeof SCHEDULED_POST_DISPOSITIONS)[number];

/**
 * There is deliberately no `cancel` and no `delete` outcome. A workspace that
 * stops paying keeps its scheduled posts; they are paused with an Action Center
 * item and can be resumed at a fresh time, never backfilled and never dropped.
 */
export function scheduledPostDisposition(state: EntitlementState): ScheduledPostDisposition {
  return isFullAccess(state) ? 'dispatch' : 'pause_by_billing';
}

/** A workspace may hold at most this many active connections. */
export function channelAllowanceExceeded(
  activeChannelCount: number,
  allowance: number = ACTIVE_CHANNEL_ALLOWANCE,
): boolean {
  return activeChannelCount > allowance;
}
