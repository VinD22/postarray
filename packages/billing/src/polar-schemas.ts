import { z } from 'zod';

import { subscriptionStatusSchema } from '@relay/contracts';

import { billingIntervalSchema, normalizeInterval } from './products';

/**
 * The Polar wire shapes we consume, parsed at the boundary and normalised into
 * our own camelCase view.
 *
 * Polar is behind an interface on purpose (risk P3 in
 * `docs/planning/08-billing-entitlements-and-economics.md`): nothing outside
 * this package ever sees a Polar payload, so replacing the merchant of record
 * is a change to this file and `client.ts`, not to the application layer.
 *
 * Every object is parsed with `.loose()` rather than `.strict()`. Polar adds
 * fields; an added field must never turn a subscription webhook into a 500.
 */

const isoString = z.string().min(1);
const nullableIso = isoString.nullable().default(null);

/** Polar reports amounts in minor units of `currency`. */
const amountMinor = z.number().int();

export const polarRecurringIntervalSchema = z
  .string()
  .transform((value, ctx) => {
    const interval = normalizeInterval(value);
    if (interval === null) {
      ctx.addIssue({ code: 'custom', message: 'UNKNOWN_RECURRING_INTERVAL' });
      return z.NEVER;
    }
    return interval;
  })
  .pipe(billingIntervalSchema);

/**
 * Polar exposes `incomplete`, `incomplete_expired`, `trialing`, `active`,
 * `past_due`, `canceled` and `unpaid`. `incomplete_expired` collapses onto
 * `incomplete`, which our entitlement table already treats as no access.
 */
export const polarSubscriptionStatusSchema = z
  .string()
  .transform((value) => (value === 'incomplete_expired' ? 'incomplete' : value))
  .pipe(subscriptionStatusSchema);

export const polarCustomerSchema = z
  .object({
    id: isoString,
    email: z.string().min(1).nullable().default(null),
    name: z.string().nullable().default(null),
    external_id: z.string().nullable().default(null),
    created_at: isoString,
    modified_at: nullableIso,
    metadata: z.record(z.string(), z.string()).default({}),
  })
  .loose()
  .transform((value) => ({
    id: value.id,
    email: value.email,
    name: value.name,
    externalId: value.external_id,
    createdAt: value.created_at,
    modifiedAt: value.modified_at ?? value.created_at,
    metadata: value.metadata,
  }));
export type PolarCustomer = z.infer<typeof polarCustomerSchema>;

export const polarProductSchema = z
  .object({
    id: isoString,
    name: z.string().min(1),
    is_recurring: z.boolean().default(true),
    recurring_interval: polarRecurringIntervalSchema,
    /** Days of trial configured on the product. Absent means no trial. */
    trial_days: z.number().int().nonnegative().nullable().default(null),
    prices: z
      .array(
        z
          .object({
            id: isoString,
            price_amount: amountMinor.nullable().default(null),
            price_currency: z.string().min(3).max(3).default('usd'),
          })
          .loose(),
      )
      .default([]),
    created_at: isoString,
    modified_at: nullableIso,
  })
  .loose()
  .transform((value) => {
    const first = value.prices[0];
    return {
      id: value.id,
      name: value.name,
      isRecurring: value.is_recurring,
      interval: value.recurring_interval,
      trialDays: value.trial_days,
      priceMinor: first?.price_amount ?? null,
      currency: (first?.price_currency ?? 'usd').toUpperCase(),
      createdAt: value.created_at,
      modifiedAt: value.modified_at ?? value.created_at,
    };
  });
export type PolarProduct = z.infer<typeof polarProductSchema>;

export const polarSubscriptionSchema = z
  .object({
    id: isoString,
    status: polarSubscriptionStatusSchema,
    customer_id: isoString,
    product_id: isoString,
    amount: amountMinor.default(0),
    currency: z.string().min(3).max(3).default('usd'),
    recurring_interval: polarRecurringIntervalSchema,
    current_period_start: isoString,
    current_period_end: nullableIso,
    cancel_at_period_end: z.boolean().default(false),
    canceled_at: nullableIso,
    started_at: nullableIso,
    ends_at: nullableIso,
    ended_at: nullableIso,
    trial_start: nullableIso,
    trial_end: nullableIso,
    created_at: isoString,
    modified_at: nullableIso,
    metadata: z.record(z.string(), z.string()).default({}),
  })
  .loose()
  .transform((value) => ({
    id: value.id,
    status: value.status,
    customerId: value.customer_id,
    productId: value.product_id,
    amountMinor: value.amount,
    currency: value.currency.toUpperCase(),
    interval: value.recurring_interval,
    currentPeriodStart: value.current_period_start,
    currentPeriodEnd: value.current_period_end,
    cancelAtPeriodEnd: value.cancel_at_period_end,
    canceledAt: value.canceled_at,
    startedAt: value.started_at,
    endsAt: value.ends_at,
    endedAt: value.ended_at,
    trialStart: value.trial_start,
    trialEnd: value.trial_end,
    createdAt: value.created_at,
    /** Ordering key for out-of-order webhook resolution. */
    modifiedAt: value.modified_at ?? value.created_at,
    metadata: value.metadata,
  }));
export type PolarSubscription = z.infer<typeof polarSubscriptionSchema>;

export const POLAR_ORDER_BILLING_REASONS = [
  'purchase',
  'subscription_create',
  'subscription_cycle',
  'subscription_update',
] as const;

export const polarOrderSchema = z
  .object({
    id: isoString,
    status: z.string().min(1),
    paid: z.boolean().default(false),
    customer_id: isoString,
    subscription_id: z.string().nullable().default(null),
    product_id: z.string().nullable().default(null),
    subtotal_amount: amountMinor.default(0),
    tax_amount: amountMinor.default(0),
    total_amount: amountMinor.default(0),
    refunded_amount: amountMinor.default(0),
    currency: z.string().min(3).max(3).default('usd'),
    billing_reason: z.string().nullable().default(null),
    created_at: isoString,
    modified_at: nullableIso,
    metadata: z.record(z.string(), z.string()).default({}),
  })
  .loose()
  .transform((value) => ({
    id: value.id,
    status: value.status,
    paid: value.paid,
    customerId: value.customer_id,
    subscriptionId: value.subscription_id,
    productId: value.product_id,
    subtotalMinor: value.subtotal_amount,
    taxMinor: value.tax_amount,
    totalMinor: value.total_amount,
    refundedMinor: value.refunded_amount,
    currency: value.currency.toUpperCase(),
    billingReason: value.billing_reason,
    createdAt: value.created_at,
    modifiedAt: value.modified_at ?? value.created_at,
    metadata: value.metadata,
  }));
export type PolarOrder = z.infer<typeof polarOrderSchema>;

export const polarCheckoutSchema = z
  .object({
    id: isoString,
    status: z.string().min(1),
    url: z.string().min(1),
    product_id: isoString,
    customer_id: z.string().nullable().default(null),
    customer_email: z.string().nullable().default(null),
    success_url: z.string().nullable().default(null),
    expires_at: nullableIso,
    created_at: isoString,
    modified_at: nullableIso,
    metadata: z.record(z.string(), z.string()).default({}),
  })
  .loose()
  .transform((value) => ({
    id: value.id,
    status: value.status,
    url: value.url,
    productId: value.product_id,
    customerId: value.customer_id,
    customerEmail: value.customer_email,
    successUrl: value.success_url,
    expiresAt: value.expires_at,
    createdAt: value.created_at,
    modifiedAt: value.modified_at ?? value.created_at,
    metadata: value.metadata,
  }));
export type PolarCheckout = z.infer<typeof polarCheckoutSchema>;

export const polarBenefitGrantSchema = z
  .object({
    id: isoString,
    benefit_id: isoString,
    customer_id: isoString,
    subscription_id: z.string().nullable().default(null),
    is_granted: z.boolean().default(false),
    is_revoked: z.boolean().default(false),
    created_at: isoString,
    modified_at: nullableIso,
  })
  .loose()
  .transform((value) => ({
    id: value.id,
    benefitId: value.benefit_id,
    customerId: value.customer_id,
    subscriptionId: value.subscription_id,
    isGranted: value.is_granted,
    isRevoked: value.is_revoked,
    createdAt: value.created_at,
    modifiedAt: value.modified_at ?? value.created_at,
  }));
export type PolarBenefitGrant = z.infer<typeof polarBenefitGrantSchema>;

export const polarCustomerSessionSchema = z
  .object({
    id: isoString,
    token: z.string().min(1),
    customer_portal_url: z.string().min(1),
    expires_at: isoString,
  })
  .loose()
  .transform((value) => ({
    id: value.id,
    customerPortalUrl: value.customer_portal_url,
    expiresAt: value.expires_at,
  }));
export type PolarCustomerSession = z.infer<typeof polarCustomerSessionSchema>;

/** Cursor page envelope Polar returns from every list endpoint. */
export function polarListSchema<T extends z.ZodType>(item: T) {
  return z
    .object({
      items: z.array(item),
      pagination: z
        .object({
          total_count: z.number().int().nonnegative().default(0),
          max_page: z.number().int().nonnegative().default(1),
        })
        .loose()
        .default({ total_count: 0, max_page: 1 }),
    })
    .loose();
}

/**
 * The events we consume. Anything not listed is stored in the inbox and acted
 * on by nobody, which is different from being rejected.
 */
export const POLAR_EVENT_TYPES = [
  'subscription.created',
  'subscription.updated',
  'subscription.active',
  'subscription.canceled',
  'subscription.uncanceled',
  'subscription.revoked',
  'subscription.past_due',
  'order.created',
  'order.paid',
  'order.refunded',
  'customer.updated',
  'benefit_grant.created',
  'benefit_grant.cycled',
  'benefit_grant.updated',
  'benefit_grant.revoked',
] as const;
export const polarEventTypeSchema = z.enum(POLAR_EVENT_TYPES);
export type PolarEventType = z.infer<typeof polarEventTypeSchema>;

export function isKnownPolarEventType(value: string): value is PolarEventType {
  return (POLAR_EVENT_TYPES as readonly string[]).includes(value);
}

/**
 * The outer webhook body. `type` is always present; `data` is only parsed
 * against a specific schema once the signature has been verified and the type
 * has been recognised.
 */
export const polarWebhookBodySchema = z
  .object({
    type: z.string().min(1),
    data: z.unknown(),
  })
  .loose();
export type PolarWebhookBody = z.infer<typeof polarWebhookBodySchema>;
