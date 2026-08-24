import { RelayError } from '@relay/contracts';
import type { SubscriptionStatus } from '@relay/contracts';

import { BILLING_MESSAGE_KEYS } from './messages';
import {
  polarCheckoutSchema,
  polarCustomerSchema,
  polarCustomerSessionSchema,
  polarOrderSchema,
  polarProductSchema,
  polarSubscriptionSchema,
} from './polar-schemas';
import type {
  PolarBenefitGrant,
  PolarCheckout,
  PolarCustomer,
  PolarCustomerSession,
  PolarEventType,
  PolarOrder,
  PolarProduct,
  PolarSubscription,
} from './polar-schemas';
import type {
  CancelSubscriptionInput,
  CreateCheckoutInput,
  ListSubscriptionsInput,
  ListSubscriptionsResult,
  PolarClient,
  UsageEventInput,
} from './client';
import { ANNUAL_PRICE_MINOR, MONTHLY_PRICE_MINOR, TRIAL_DAYS } from './products';
import type { BillingInterval } from './products';
import { tierPriceMinor } from './tiers';
import type { PlanTierKey } from './tiers';
import {
  WEBHOOK_HEADER_ID,
  WEBHOOK_HEADER_SIGNATURE,
  WEBHOOK_HEADER_TIMESTAMP,
  signWebhook,
} from './signature';
import type { Clock } from './time';
import { addDays, addMonths, addYears, isAtOrAfter, nowIso } from './time';

/**
 * The local Polar simulator.
 *
 * It is the default merchant-of-record implementation whenever no access token
 * is configured, and it models the whole commercial lifecycle: hosted checkout,
 * a seven day trial, conversion to a paid subscription, renewal, a failed
 * payment and its recovery, cancellation before and after conversion, refunds
 * and the customer portal. It emits real Standard Webhooks deliveries, signed
 * with the configured secret, so the webhook inbox, signature verification and
 * entitlement derivation are exercised end to end with no key and no network.
 *
 * All identifiers are obviously fake and all URLs are on `example.test`.
 */

export const SIMULATOR_HOST = 'https://polar.simulator.example.test';
export const SIMULATOR_WEBHOOK_SECRET = 'whsec_c2ltdWxhdG9yLXNlY3JldC1ub3QtYS1yZWFsLWtleQ==';
export const SIMULATOR_MONTHLY_PRODUCT_ID = 'sim_prod_monthly';
export const SIMULATOR_ANNUAL_PRODUCT_ID = 'sim_prod_annual';
export const SIMULATOR_GROWTH_MONTHLY_PRODUCT_ID = 'sim_prod_growth_monthly';
export const SIMULATOR_GROWTH_ANNUAL_PRODUCT_ID = 'sim_prod_growth_annual';
export const SIMULATOR_STUDIO_MONTHLY_PRODUCT_ID = 'sim_prod_studio_monthly';
export const SIMULATOR_STUDIO_ANNUAL_PRODUCT_ID = 'sim_prod_studio_annual';
export const SIMULATOR_BENEFIT_ID = 'sim_benefit_relay_standard';

/**
 * The simulated product catalog, one entry per (tier, interval).
 *
 * The higher tiers are here so a local checkout of Growth or Studio runs the
 * whole lifecycle with no key and no network, and so the entitlement derivation
 * is exercised against a product that maps to something other than the base
 * tier. Prices are read from the tier table, so a simulated charge can never
 * disagree with the real one.
 */
export interface SimulatedProduct {
  readonly productId: string;
  readonly tierKey: PlanTierKey;
  readonly interval: BillingInterval;
  readonly priceMinor: number;
  readonly name: string;
}

function simulatedProduct(
  productId: string,
  tierKey: PlanTierKey,
  interval: BillingInterval,
  name: string,
): SimulatedProduct {
  return Object.freeze({
    productId,
    tierKey,
    interval,
    priceMinor: tierPriceMinor(tierKey, interval),
    name,
  });
}

export const SIMULATOR_PRODUCTS: readonly SimulatedProduct[] = Object.freeze([
  simulatedProduct(SIMULATOR_MONTHLY_PRODUCT_ID, 'relay_standard', 'month', 'Post Array Monthly'),
  simulatedProduct(SIMULATOR_ANNUAL_PRODUCT_ID, 'relay_standard', 'year', 'Post Array Annual'),
  simulatedProduct(
    SIMULATOR_GROWTH_MONTHLY_PRODUCT_ID,
    'relay_growth',
    'month',
    'Post Array Growth Monthly',
  ),
  simulatedProduct(
    SIMULATOR_GROWTH_ANNUAL_PRODUCT_ID,
    'relay_growth',
    'year',
    'Post Array Growth Annual',
  ),
  simulatedProduct(
    SIMULATOR_STUDIO_MONTHLY_PRODUCT_ID,
    'relay_studio',
    'month',
    'Post Array Studio Monthly',
  ),
  simulatedProduct(
    SIMULATOR_STUDIO_ANNUAL_PRODUCT_ID,
    'relay_studio',
    'year',
    'Post Array Studio Annual',
  ),
]);

/** The simulated product id for one purchasable combination, or `undefined`. */
export function simulatorProductId(
  tier: PlanTierKey,
  interval: BillingInterval,
): string | undefined {
  return SIMULATOR_PRODUCTS.find(
    (product) => product.tierKey === tier && product.interval === interval,
  )?.productId;
}

/**
 * The `productId -> tierKey` map a simulated environment hands to entitlement
 * derivation, so a locally bought Growth subscription grants Growth capacity.
 */
export const SIMULATOR_PRODUCT_TIERS: Readonly<Record<string, PlanTierKey>> = Object.freeze(
  Object.fromEntries(SIMULATOR_PRODUCTS.map((product) => [product.productId, product.tierKey])),
);

export interface SimulatedDelivery {
  readonly eventType: PolarEventType;
  readonly webhookId: string;
  readonly timestampSeconds: number;
  readonly rawBody: string;
  readonly headers: Readonly<Record<string, string>>;
}

export interface LocalPolarSimulatorOptions {
  readonly clock: Clock;
  readonly server?: 'sandbox' | 'production';
  readonly trialDays?: number;
  readonly webhookSecret?: string | undefined;
  readonly monthlyProductId?: string | undefined;
  readonly annualProductId?: string | undefined;
}

interface MutableSubscription {
  id: string;
  status: SubscriptionStatus;
  customerId: string;
  productId: string;
  amountMinor: number;
  currency: string;
  interval: BillingInterval;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  startedAt: string;
  endsAt: string | null;
  endedAt: string | null;
  trialStart: string | null;
  trialEnd: string | null;
  createdAt: string;
  modifiedAt: string;
  metadata: Record<string, string>;
}

interface MutableCheckout {
  id: string;
  status: 'open' | 'confirmed' | 'expired';
  productId: string;
  customerId: string | null;
  customerEmail: string | null;
  successUrl: string;
  expiresAt: string;
  createdAt: string;
  modifiedAt: string;
  metadata: Record<string, string>;
  subscriptionId: string | null;
}

interface MutableOrder {
  id: string;
  status: 'paid' | 'pending' | 'refunded';
  paid: boolean;
  customerId: string;
  subscriptionId: string;
  productId: string;
  subtotalMinor: number;
  taxMinor: number;
  totalMinor: number;
  refundedMinor: number;
  currency: string;
  billingReason: string;
  createdAt: string;
  modifiedAt: string;
}

export class LocalPolarSimulator implements PolarClient {
  readonly mode = 'simulator' as const;
  readonly server: 'sandbox' | 'production';
  readonly webhookSecret: string;

  private readonly clock: Clock;
  private readonly trialDays: number;
  private readonly monthlyProductId: string;
  private readonly annualProductId: string;

  private sequence = 0;
  private readonly customers = new Map<string, PolarCustomer>();
  private readonly checkouts = new Map<string, MutableCheckout>();
  private readonly checkoutsByIdempotencyKey = new Map<string, string>();
  private readonly subscriptions = new Map<string, MutableSubscription>();
  private readonly orders = new Map<string, MutableOrder>();
  private readonly benefitGrants = new Map<string, PolarBenefitGrant>();
  private readonly failNextChargeFor = new Set<string>();
  private readonly usageEvents: UsageEventInput[] = [];
  private deliveries: SimulatedDelivery[] = [];

  constructor(options: LocalPolarSimulatorOptions) {
    this.clock = options.clock;
    this.server = options.server ?? 'sandbox';
    this.trialDays = options.trialDays ?? TRIAL_DAYS;
    this.webhookSecret =
      options.webhookSecret === undefined || options.webhookSecret.length === 0
        ? SIMULATOR_WEBHOOK_SECRET
        : options.webhookSecret;
    this.monthlyProductId = options.monthlyProductId ?? SIMULATOR_MONTHLY_PRODUCT_ID;
    this.annualProductId = options.annualProductId ?? SIMULATOR_ANNUAL_PRODUCT_ID;
  }

  // ---------------------------------------------------------------- internals

  private nextId(prefix: string): string {
    this.sequence += 1;
    return `sim_${prefix}_${String(this.sequence).padStart(6, '0')}`;
  }

  private now(): string {
    return nowIso(this.clock);
  }

  /**
   * The catalog entry for a product id, if it is one of the simulated tiers.
   * The two base ids are excluded because the constructor may have overridden
   * them, and an override must keep winning.
   */
  private catalogEntry(productId: string): SimulatedProduct | undefined {
    if (productId === this.monthlyProductId || productId === this.annualProductId) {
      return undefined;
    }
    return SIMULATOR_PRODUCTS.find((product) => product.productId === productId);
  }

  private intervalOf(productId: string): BillingInterval {
    if (productId === this.annualProductId) {
      return 'year';
    }
    return this.catalogEntry(productId)?.interval ?? 'month';
  }

  private priceOf(productId: string): number {
    const entry = this.catalogEntry(productId);
    if (entry !== undefined) {
      return entry.priceMinor;
    }
    return this.intervalOf(productId) === 'year' ? ANNUAL_PRICE_MINOR : MONTHLY_PRICE_MINOR;
  }

  private nameOf(productId: string): string {
    const entry = this.catalogEntry(productId);
    if (entry !== undefined) {
      return entry.name;
    }
    return this.intervalOf(productId) === 'year' ? 'Post Array Annual' : 'Post Array Monthly';
  }

  private advancePeriod(instant: string, interval: BillingInterval): string {
    return interval === 'year' ? addYears(instant, 1) : addMonths(instant, 1);
  }

  private toPolarSubscription(record: MutableSubscription): PolarSubscription {
    return polarSubscriptionSchema.parse({
      id: record.id,
      status: record.status,
      customer_id: record.customerId,
      product_id: record.productId,
      amount: record.amountMinor,
      currency: record.currency.toLowerCase(),
      recurring_interval: record.interval,
      current_period_start: record.currentPeriodStart,
      current_period_end: record.currentPeriodEnd,
      cancel_at_period_end: record.cancelAtPeriodEnd,
      canceled_at: record.canceledAt,
      started_at: record.startedAt,
      ends_at: record.endsAt,
      ended_at: record.endedAt,
      trial_start: record.trialStart,
      trial_end: record.trialEnd,
      created_at: record.createdAt,
      modified_at: record.modifiedAt,
      metadata: record.metadata,
    });
  }

  private toPolarOrder(record: MutableOrder): PolarOrder {
    return polarOrderSchema.parse({
      id: record.id,
      status: record.status,
      paid: record.paid,
      customer_id: record.customerId,
      subscription_id: record.subscriptionId,
      product_id: record.productId,
      subtotal_amount: record.subtotalMinor,
      tax_amount: record.taxMinor,
      total_amount: record.totalMinor,
      refunded_amount: record.refundedMinor,
      currency: record.currency.toLowerCase(),
      billing_reason: record.billingReason,
      created_at: record.createdAt,
      modified_at: record.modifiedAt,
      metadata: {},
    });
  }

  private toPolarCheckout(record: MutableCheckout): PolarCheckout {
    return polarCheckoutSchema.parse({
      id: record.id,
      status: record.status,
      url: `${SIMULATOR_HOST}/checkout/${record.id}`,
      product_id: record.productId,
      customer_id: record.customerId,
      customer_email: record.customerEmail,
      success_url: record.successUrl,
      expires_at: record.expiresAt,
      created_at: record.createdAt,
      modified_at: record.modifiedAt,
      metadata: record.metadata,
    });
  }

  private touch(record: MutableSubscription): void {
    record.modifiedAt = this.now();
  }

  private async emit(eventType: PolarEventType, data: unknown): Promise<void> {
    const webhookId = this.nextId('evt');
    const timestampSeconds = Math.floor(this.clock.now().getTime() / 1000);
    const rawBody = JSON.stringify({ type: eventType, data });
    const signature = await signWebhook({
      secret: this.webhookSecret,
      webhookId,
      timestampSeconds,
      rawBody,
    });
    this.deliveries.push({
      eventType,
      webhookId,
      timestampSeconds,
      rawBody,
      headers: {
        [WEBHOOK_HEADER_ID]: webhookId,
        [WEBHOOK_HEADER_TIMESTAMP]: String(timestampSeconds),
        [WEBHOOK_HEADER_SIGNATURE]: signature,
        'content-type': 'application/json',
      },
    });
  }

  private async emitSubscription(
    eventType: PolarEventType,
    record: MutableSubscription,
  ): Promise<void> {
    await this.emit(eventType, this.rawSubscription(record));
  }

  private rawBenefitGrant(grant: PolarBenefitGrant): Record<string, unknown> {
    return {
      id: grant.id,
      benefit_id: grant.benefitId,
      customer_id: grant.customerId,
      subscription_id: grant.subscriptionId,
      is_granted: grant.isGranted,
      is_revoked: grant.isRevoked,
      created_at: grant.createdAt,
      modified_at: grant.modifiedAt,
    };
  }

  private rawSubscription(record: MutableSubscription): Record<string, unknown> {
    return {
      id: record.id,
      status: record.status,
      customer_id: record.customerId,
      product_id: record.productId,
      amount: record.amountMinor,
      currency: record.currency.toLowerCase(),
      recurring_interval: record.interval,
      current_period_start: record.currentPeriodStart,
      current_period_end: record.currentPeriodEnd,
      cancel_at_period_end: record.cancelAtPeriodEnd,
      canceled_at: record.canceledAt,
      started_at: record.startedAt,
      ends_at: record.endsAt,
      ended_at: record.endedAt,
      trial_start: record.trialStart,
      trial_end: record.trialEnd,
      created_at: record.createdAt,
      modified_at: record.modifiedAt,
      metadata: record.metadata,
    };
  }

  private rawOrder(record: MutableOrder): Record<string, unknown> {
    return {
      id: record.id,
      status: record.status,
      paid: record.paid,
      customer_id: record.customerId,
      subscription_id: record.subscriptionId,
      product_id: record.productId,
      subtotal_amount: record.subtotalMinor,
      tax_amount: record.taxMinor,
      total_amount: record.totalMinor,
      refunded_amount: record.refundedMinor,
      currency: record.currency.toLowerCase(),
      billing_reason: record.billingReason,
      created_at: record.createdAt,
      modified_at: record.modifiedAt,
      metadata: {},
    };
  }

  private requireSubscription(subscriptionId: string): MutableSubscription {
    const record = this.subscriptions.get(subscriptionId);
    if (record === undefined) {
      throw new RelayError('NOT_FOUND', { messageKey: BILLING_MESSAGE_KEYS.notFound });
    }
    return record;
  }

  private createOrder(
    record: MutableSubscription,
    billingReason: string,
    paid: boolean,
  ): MutableOrder {
    const createdAt = this.now();
    const order: MutableOrder = {
      id: this.nextId('order'),
      status: paid ? 'paid' : 'pending',
      paid,
      customerId: record.customerId,
      subscriptionId: record.id,
      productId: record.productId,
      subtotalMinor: record.amountMinor,
      taxMinor: 0,
      totalMinor: record.amountMinor,
      refundedMinor: 0,
      currency: record.currency,
      billingReason,
      createdAt,
      modifiedAt: createdAt,
    };
    this.orders.set(order.id, order);
    return order;
  }

  // ------------------------------------------------------------- PolarClient

  async getProduct(productId: string): Promise<PolarProduct> {
    const interval = this.intervalOf(productId);
    return polarProductSchema.parse({
      id: productId,
      name: this.nameOf(productId),
      is_recurring: true,
      recurring_interval: interval,
      trial_days: this.trialDays,
      prices: [
        {
          id: `${productId}_price`,
          price_amount: this.priceOf(productId),
          price_currency: 'usd',
        },
      ],
      created_at: this.now(),
      modified_at: this.now(),
    });
  }

  async getCustomer(customerId: string): Promise<PolarCustomer | null> {
    return this.customers.get(customerId) ?? null;
  }

  async createCheckout(input: CreateCheckoutInput): Promise<PolarCheckout> {
    const existingId = this.checkoutsByIdempotencyKey.get(input.idempotencyKey);
    if (existingId !== undefined) {
      const existing = this.checkouts.get(existingId);
      if (existing !== undefined) {
        return this.toPolarCheckout(existing);
      }
    }
    const createdAt = this.now();
    const record: MutableCheckout = {
      id: this.nextId('checkout'),
      status: 'open',
      productId: input.productId,
      customerId: input.customerId ?? null,
      customerEmail: input.customerEmail ?? null,
      successUrl: input.successUrl,
      expiresAt: addDays(createdAt, 1),
      createdAt,
      modifiedAt: createdAt,
      metadata: { ...(input.metadata ?? {}) },
      subscriptionId: null,
    };
    this.checkouts.set(record.id, record);
    this.checkoutsByIdempotencyKey.set(input.idempotencyKey, record.id);
    return this.toPolarCheckout(record);
  }

  async getCheckout(checkoutId: string): Promise<PolarCheckout | null> {
    const record = this.checkouts.get(checkoutId);
    return record === undefined ? null : this.toPolarCheckout(record);
  }

  async getSubscription(subscriptionId: string): Promise<PolarSubscription | null> {
    const record = this.subscriptions.get(subscriptionId);
    return record === undefined ? null : this.toPolarSubscription(record);
  }

  async listSubscriptions(input: ListSubscriptionsInput): Promise<ListSubscriptionsResult> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 100;
    const all = [...this.subscriptions.values()]
      .filter(
        (record) =>
          input.modifiedSince === undefined || isAtOrAfter(record.modifiedAt, input.modifiedSince),
      )
      .sort((left, right) => (left.modifiedAt < right.modifiedAt ? -1 : 1));
    const start = (page - 1) * limit;
    const items = all.slice(start, start + limit).map((record) => this.toPolarSubscription(record));
    const hasMore = start + limit < all.length;
    return { items, hasMore, nextPage: hasMore ? page + 1 : null };
  }

  async cancelSubscription(input: CancelSubscriptionInput): Promise<PolarSubscription> {
    const record = this.requireSubscription(input.subscriptionId);
    const atPeriodEnd = input.atPeriodEnd ?? true;
    record.canceledAt = this.now();
    if (atPeriodEnd) {
      record.cancelAtPeriodEnd = true;
      record.endsAt =
        record.trialEnd !== null && record.status === 'trialing'
          ? record.trialEnd
          : record.currentPeriodEnd;
      this.touch(record);
      await this.emitSubscription('subscription.canceled', record);
    } else {
      record.cancelAtPeriodEnd = false;
      record.status = 'canceled';
      record.endsAt = record.canceledAt;
      record.endedAt = record.canceledAt;
      this.touch(record);
      await this.emitSubscription('subscription.canceled', record);
      await this.emitSubscription('subscription.revoked', record);
      await this.revokeBenefitGrants(record.id);
    }
    return this.toPolarSubscription(record);
  }

  async uncancelSubscription(subscriptionId: string): Promise<PolarSubscription> {
    const record = this.requireSubscription(subscriptionId);
    if (record.endedAt !== null) {
      throw new RelayError('CONFLICT', { messageKey: BILLING_MESSAGE_KEYS.conflict });
    }
    record.cancelAtPeriodEnd = false;
    record.canceledAt = null;
    record.endsAt = null;
    this.touch(record);
    await this.emitSubscription('subscription.uncanceled', record);
    return this.toPolarSubscription(record);
  }

  async changeSubscriptionProduct(input: {
    subscriptionId: string;
    productId: string;
    interval: BillingInterval;
  }): Promise<PolarSubscription> {
    const record = this.requireSubscription(input.subscriptionId);
    record.productId = input.productId;
    record.interval = input.interval;
    record.amountMinor = this.priceOf(input.productId);
    record.currentPeriodEnd = this.advancePeriod(record.currentPeriodStart, record.interval);
    this.touch(record);
    await this.emitSubscription('subscription.updated', record);
    return this.toPolarSubscription(record);
  }

  async createCustomerPortalSession(input: { customerId: string }): Promise<PolarCustomerSession> {
    return polarCustomerSessionSchema.parse({
      id: this.nextId('cs'),
      token: this.nextId('token'),
      customer_portal_url: `${SIMULATOR_HOST}/portal/${input.customerId}`,
      expires_at: addDays(this.now(), 1),
    });
  }

  async getOrder(orderId: string): Promise<PolarOrder | null> {
    const record = this.orders.get(orderId);
    return record === undefined ? null : this.toPolarOrder(record);
  }

  async listOrders(input: {
    subscriptionId?: string;
    customerId?: string;
  }): Promise<readonly PolarOrder[]> {
    return [...this.orders.values()]
      .filter(
        (order) =>
          (input.subscriptionId === undefined || order.subscriptionId === input.subscriptionId) &&
          (input.customerId === undefined || order.customerId === input.customerId),
      )
      .map((order) => this.toPolarOrder(order));
  }

  async listBenefitGrants(input: {
    subscriptionId: string;
  }): Promise<readonly PolarBenefitGrant[]> {
    return [...this.benefitGrants.values()].filter(
      (grant) => grant.subscriptionId === input.subscriptionId,
    );
  }

  async ingestUsage(events: readonly UsageEventInput[]): Promise<{ accepted: number }> {
    this.usageEvents.push(...events);
    return { accepted: events.length };
  }

  // ---------------------------------------------------------------- controls

  /** Everything ingested through `ingestUsage`, for assertions and the demo. */
  get ingestedUsage(): readonly UsageEventInput[] {
    return this.usageEvents;
  }

  /** Take the signed deliveries produced since the last drain. */
  drainDeliveries(): SimulatedDelivery[] {
    const drained = this.deliveries;
    this.deliveries = [];
    return drained;
  }

  /**
   * The customer completes Polar's hosted checkout. Creates a `trialing`
   * subscription, charges nothing, and emits `subscription.created`.
   */
  async confirmCheckout(
    checkoutId: string,
    input: { email?: string; externalId?: string } = {},
  ): Promise<PolarSubscription> {
    const checkout = this.checkouts.get(checkoutId);
    if (checkout === undefined) {
      throw new RelayError('NOT_FOUND', { messageKey: BILLING_MESSAGE_KEYS.notFound });
    }
    if (checkout.subscriptionId !== null) {
      return this.toPolarSubscription(this.requireSubscription(checkout.subscriptionId));
    }
    const createdAt = this.now();
    const customerId = checkout.customerId ?? this.nextId('cust');
    const email = input.email ?? checkout.customerEmail ?? 'owner@example.test';
    this.customers.set(
      customerId,
      polarCustomerSchema.parse({
        id: customerId,
        email,
        name: null,
        external_id: input.externalId ?? checkout.metadata.workspaceId ?? null,
        created_at: createdAt,
        modified_at: createdAt,
        metadata: checkout.metadata,
      }),
    );
    const interval = this.intervalOf(checkout.productId);
    const trialEnd = addDays(createdAt, this.trialDays);
    const record: MutableSubscription = {
      id: this.nextId('sub'),
      status: 'trialing',
      customerId,
      productId: checkout.productId,
      amountMinor: this.priceOf(checkout.productId),
      currency: 'USD',
      interval,
      currentPeriodStart: createdAt,
      currentPeriodEnd: trialEnd,
      cancelAtPeriodEnd: false,
      canceledAt: null,
      startedAt: createdAt,
      endsAt: null,
      endedAt: null,
      trialStart: createdAt,
      trialEnd,
      createdAt,
      modifiedAt: createdAt,
      metadata: { ...checkout.metadata },
    };
    this.subscriptions.set(record.id, record);
    checkout.status = 'confirmed';
    checkout.customerId = customerId;
    checkout.subscriptionId = record.id;
    checkout.modifiedAt = createdAt;
    await this.emitSubscription('subscription.created', record);

    const grant: PolarBenefitGrant = {
      id: this.nextId('grant'),
      benefitId: SIMULATOR_BENEFIT_ID,
      customerId,
      subscriptionId: record.id,
      isGranted: true,
      isRevoked: false,
      createdAt,
      modifiedAt: createdAt,
    };
    this.benefitGrants.set(grant.id, grant);
    await this.emit('benefit_grant.created', this.rawBenefitGrant(grant));
    return this.toPolarSubscription(record);
  }

  private async revokeBenefitGrants(subscriptionId: string): Promise<void> {
    for (const [key, grant] of this.benefitGrants) {
      if (grant.subscriptionId !== subscriptionId || grant.isRevoked) {
        continue;
      }
      const revoked: PolarBenefitGrant = {
        ...grant,
        isGranted: false,
        isRevoked: true,
        modifiedAt: this.now(),
      };
      this.benefitGrants.set(key, revoked);
      await this.emit('benefit_grant.revoked', this.rawBenefitGrant(revoked));
    }
  }

  /** Make the next charge on this subscription fail, as a card decline would. */
  failNextCharge(subscriptionId: string): void {
    this.failNextChargeFor.add(subscriptionId);
  }

  /** The customer fixes their payment method while `past_due`. */
  async payOutstanding(subscriptionId: string): Promise<PolarSubscription> {
    const record = this.requireSubscription(subscriptionId);
    if (record.status !== 'past_due' && record.status !== 'unpaid') {
      return this.toPolarSubscription(record);
    }
    const order = this.createOrder(record, 'subscription_cycle', true);
    record.status = 'active';
    record.currentPeriodStart = this.now();
    record.currentPeriodEnd = this.advancePeriod(record.currentPeriodStart, record.interval);
    this.touch(record);
    await this.emit('order.created', this.rawOrder(order));
    await this.emit('order.paid', this.rawOrder(order));
    await this.emitSubscription('subscription.active', record);
    return this.toPolarSubscription(record);
  }

  /** Refund an order. Reverses affiliate commission through `order.refunded`. */
  async refundOrder(orderId: string, amountMinor?: number): Promise<PolarOrder> {
    const order = this.orders.get(orderId);
    if (order === undefined) {
      throw new RelayError('NOT_FOUND', { messageKey: BILLING_MESSAGE_KEYS.notFound });
    }
    const refund = amountMinor ?? order.totalMinor;
    order.refundedMinor = Math.min(order.totalMinor, order.refundedMinor + refund);
    order.status = 'refunded';
    order.modifiedAt = this.now();
    await this.emit('order.refunded', this.rawOrder(order));
    return this.toPolarOrder(order);
  }

  /**
   * Advance every subscription to the current clock reading: convert trials,
   * renew paid periods, fail declined charges and revoke ended subscriptions.
   * Returns the number of state changes so a caller can assert on progress.
   */
  async tick(): Promise<number> {
    const now = this.now();
    let changes = 0;
    for (const record of this.subscriptions.values()) {
      if (record.endedAt !== null) {
        continue;
      }
      if (record.cancelAtPeriodEnd && record.endsAt !== null && isAtOrAfter(now, record.endsAt)) {
        record.status = 'canceled';
        record.endedAt = record.endsAt;
        this.touch(record);
        await this.emitSubscription('subscription.revoked', record);
        await this.revokeBenefitGrants(record.id);
        changes += 1;
        continue;
      }
      const due =
        record.status === 'trialing'
          ? record.trialEnd
          : record.status === 'active'
            ? record.currentPeriodEnd
            : null;
      if (due === null || !isAtOrAfter(now, due)) {
        continue;
      }
      const reason = record.status === 'trialing' ? 'subscription_create' : 'subscription_cycle';
      if (this.failNextChargeFor.delete(record.id)) {
        const order = this.createOrder(record, reason, false);
        record.status = 'past_due';
        this.touch(record);
        await this.emit('order.created', this.rawOrder(order));
        await this.emitSubscription('subscription.updated', record);
        changes += 1;
        continue;
      }
      const order = this.createOrder(record, reason, true);
      record.status = 'active';
      record.currentPeriodStart = due;
      record.currentPeriodEnd = this.advancePeriod(due, record.interval);
      this.touch(record);
      await this.emit('order.created', this.rawOrder(order));
      await this.emit('order.paid', this.rawOrder(order));
      await this.emitSubscription('subscription.active', record);
      changes += 1;
    }
    return changes;
  }

  /** Move a `past_due` subscription to `unpaid` after Polar exhausts retries. */
  async exhaustRetries(subscriptionId: string): Promise<PolarSubscription> {
    const record = this.requireSubscription(subscriptionId);
    record.status = 'unpaid';
    this.touch(record);
    await this.emitSubscription('subscription.updated', record);
    return this.toPolarSubscription(record);
  }

  /**
   * Mutate stored state without emitting anything, which is how a dropped
   * webhook is reproduced for the reconciliation tests.
   */
  async mutateSilently(
    subscriptionId: string,
    patch: {
      status?: SubscriptionStatus;
      cancelAtPeriodEnd?: boolean;
      currentPeriodEnd?: string;
    },
  ): Promise<PolarSubscription> {
    const record = this.requireSubscription(subscriptionId);
    Object.assign(record, patch);
    this.touch(record);
    return this.toPolarSubscription(record);
  }

  reset(): void {
    this.sequence = 0;
    this.customers.clear();
    this.checkouts.clear();
    this.checkoutsByIdempotencyKey.clear();
    this.subscriptions.clear();
    this.orders.clear();
    this.benefitGrants.clear();
    this.failNextChargeFor.clear();
    this.usageEvents.length = 0;
    this.deliveries = [];
  }
}
