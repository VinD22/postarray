import { z } from 'zod';

import { RelayError } from '@relay/contracts';
import type { PolarConfig } from '@relay/config';

import { BILLING_MESSAGE_KEYS } from './messages.js';
import {
  polarBenefitGrantSchema,
  polarCheckoutSchema,
  polarCustomerSchema,
  polarCustomerSessionSchema,
  polarListSchema,
  polarOrderSchema,
  polarProductSchema,
  polarSubscriptionSchema,
} from './polar-schemas.js';
import type {
  PolarBenefitGrant,
  PolarCheckout,
  PolarCustomer,
  PolarCustomerSession,
  PolarOrder,
  PolarProduct,
  PolarSubscription,
} from './polar-schemas.js';
import type { BillingInterval } from './products.js';
import { LocalPolarSimulator } from './simulator.js';
import type { Clock } from './time.js';
import { systemClock } from './time.js';

/**
 * The merchant-of-record port.
 *
 * Two implementations satisfy it: `HttpPolarClient`, which talks to Polar's
 * REST API, and `LocalPolarSimulator`, which models the same lifecycle in
 * process. `createPolarClient` picks the simulator whenever no access token is
 * configured, so the whole billing lifecycle is testable and demoable with no
 * key at all.
 *
 * The officially published `@polar-sh/sdk` client is adopted through
 * `polarClientFromSdk`, which takes an already-constructed SDK instance and
 * adapts it structurally. Keeping the coupling structural means the SDK's own
 * response types never leak past this file and a Polar SDK major version is a
 * change here rather than everywhere.
 */

export const POLAR_API_BASE_URLS = Object.freeze({
  sandbox: 'https://sandbox-api.polar.sh',
  production: 'https://api.polar.sh',
});

export interface CreateCheckoutInput {
  readonly productId: string;
  readonly successUrl: string;
  readonly customerId?: string;
  readonly customerEmail?: string;
  readonly customerExternalId?: string;
  readonly metadata?: Readonly<Record<string, string>>;
  /** Server-side dedupe so a double-click cannot create two subscriptions. */
  readonly idempotencyKey: string;
}

export interface ListSubscriptionsInput {
  readonly modifiedSince?: string;
  readonly limit?: number;
  readonly page?: number;
}

export interface ListSubscriptionsResult {
  readonly items: readonly PolarSubscription[];
  readonly hasMore: boolean;
  readonly nextPage: number | null;
}

export interface CancelSubscriptionInput {
  readonly subscriptionId: string;
  /** Default. Access continues to the period end and nothing is deleted. */
  readonly atPeriodEnd?: boolean;
  readonly reason?: string;
}

export interface UsageEventInput {
  readonly name: string;
  readonly externalCustomerId: string;
  readonly timestamp: string;
  readonly metadata: Readonly<Record<string, string | number>>;
}

export interface PolarClient {
  readonly mode: 'live' | 'simulator';
  readonly server: 'sandbox' | 'production';
  getProduct(productId: string): Promise<PolarProduct>;
  getCustomer(customerId: string): Promise<PolarCustomer | null>;
  createCheckout(input: CreateCheckoutInput): Promise<PolarCheckout>;
  getCheckout(checkoutId: string): Promise<PolarCheckout | null>;
  getSubscription(subscriptionId: string): Promise<PolarSubscription | null>;
  listSubscriptions(input: ListSubscriptionsInput): Promise<ListSubscriptionsResult>;
  cancelSubscription(input: CancelSubscriptionInput): Promise<PolarSubscription>;
  uncancelSubscription(subscriptionId: string): Promise<PolarSubscription>;
  /** Interval change. Polar prorates; the caller states the outcome first. */
  changeSubscriptionProduct(input: {
    subscriptionId: string;
    productId: string;
    interval: BillingInterval;
  }): Promise<PolarSubscription>;
  createCustomerPortalSession(input: {
    customerId: string;
    returnUrl?: string;
  }): Promise<PolarCustomerSession>;
  getOrder(orderId: string): Promise<PolarOrder | null>;
  listOrders(input: { subscriptionId?: string; customerId?: string }): Promise<readonly PolarOrder[]>;
  listBenefitGrants(input: { subscriptionId: string }): Promise<readonly PolarBenefitGrant[]>;
  ingestUsage(events: readonly UsageEventInput[]): Promise<{ accepted: number }>;
}

export interface HttpPolarClientOptions {
  readonly accessToken: string;
  readonly server: 'sandbox' | 'production';
  readonly fetchImpl?: typeof fetch;
  readonly timeoutMs?: number;
  readonly clock?: Clock;
}

const DEFAULT_TIMEOUT_MS = 15_000;

function providerError(status: number, body: unknown): RelayError {
  const retryable = status === 429 || status >= 500;
  return new RelayError(retryable ? 'PROVIDER_TRANSIENT' : 'PROVIDER_PERMANENT', {
    messageKey: retryable
      ? BILLING_MESSAGE_KEYS.providerTransient
      : BILLING_MESSAGE_KEYS.providerPermanent,
    details: { httpStatus: status, provider: 'polar', body },
    retryable,
  });
}

interface PolarRequestOptions {
  readonly body?: unknown;
  readonly query?: Readonly<Record<string, string | number | undefined>>;
  readonly idempotencyKey?: string;
  readonly allowNotFound?: boolean;
}

/** The live client. Every response is parsed, never cast. */
export class HttpPolarClient implements PolarClient {
  readonly mode = 'live' as const;
  readonly server: 'sandbox' | 'production';

  private readonly accessToken: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly timeoutMs: number;

  constructor(options: HttpPolarClientOptions) {
    this.accessToken = options.accessToken;
    this.server = options.server;
    this.baseUrl = POLAR_API_BASE_URLS[options.server];
    this.fetchImpl = options.fetchImpl ?? globalThis.fetch;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  private async request<T extends z.ZodType>(
    method: string,
    path: string,
    schema: T,
    options: PolarRequestOptions = {},
  ): Promise<z.output<T> | null> {
    const url = new URL(path, this.baseUrl);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
    const headers: Record<string, string> = {
      authorization: `Bearer ${this.accessToken}`,
      accept: 'application/json',
    };
    if (options.body !== undefined) {
      headers['content-type'] = 'application/json';
    }
    if (options.idempotencyKey !== undefined) {
      headers['idempotency-key'] = options.idempotencyKey;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
    }, this.timeoutMs);
    let response: Response;
    try {
      response = await this.fetchImpl(url.toString(), {
        method,
        headers,
        signal: controller.signal,
        ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
      });
    } catch (cause) {
      throw new RelayError('PROVIDER_UNAVAILABLE', {
        messageKey: BILLING_MESSAGE_KEYS.providerUnavailable,
        details: { provider: 'polar' },
        cause,
      });
    } finally {
      clearTimeout(timer);
    }

    if (response.status === 404 && options.allowNotFound === true) {
      return null;
    }
    const text = await response.text();
    const parsedBody: unknown = text.length === 0 ? {} : safeJsonParse(text);
    if (!response.ok) {
      throw providerError(response.status, parsedBody);
    }
    const result = schema.safeParse(parsedBody);
    if (!result.success) {
      throw new RelayError('VALIDATION_FAILED', {
        messageKey: BILLING_MESSAGE_KEYS.responseInvalid,
        details: {
          provider: 'polar',
          issues: result.error.issues.slice(0, 10).map((issue) => ({
            path: issue.path.map((segment) => String(segment)).join('.'),
            code: issue.code,
          })),
        },
      });
    }
    return result.data;
  }

  private async requireRequest<T extends z.ZodType>(
    method: string,
    path: string,
    schema: T,
    options: PolarRequestOptions = {},
  ): Promise<z.output<T>> {
    const value = await this.request(method, path, schema, options);
    if (value === null) {
      throw new RelayError('NOT_FOUND', { messageKey: BILLING_MESSAGE_KEYS.notFound });
    }
    return value;
  }

  async getProduct(productId: string): Promise<PolarProduct> {
    return this.requireRequest('GET', `/v1/products/${productId}`, polarProductSchema);
  }

  async getCustomer(customerId: string): Promise<PolarCustomer | null> {
    return this.request('GET', `/v1/customers/${customerId}`, polarCustomerSchema, {
      allowNotFound: true,
    });
  }

  async createCheckout(input: CreateCheckoutInput): Promise<PolarCheckout> {
    return this.requireRequest('POST', '/v1/checkouts/', polarCheckoutSchema, {
      idempotencyKey: input.idempotencyKey,
      body: {
        products: [input.productId],
        success_url: input.successUrl,
        ...(input.customerId === undefined ? {} : { customer_id: input.customerId }),
        ...(input.customerEmail === undefined ? {} : { customer_email: input.customerEmail }),
        ...(input.customerExternalId === undefined
          ? {}
          : { customer_external_id: input.customerExternalId }),
        metadata: { ...(input.metadata ?? {}) },
      },
    });
  }

  async getCheckout(checkoutId: string): Promise<PolarCheckout | null> {
    return this.request('GET', `/v1/checkouts/${checkoutId}`, polarCheckoutSchema, {
      allowNotFound: true,
    });
  }

  async getSubscription(subscriptionId: string): Promise<PolarSubscription | null> {
    return this.request('GET', `/v1/subscriptions/${subscriptionId}`, polarSubscriptionSchema, {
      allowNotFound: true,
    });
  }

  async listSubscriptions(input: ListSubscriptionsInput): Promise<ListSubscriptionsResult> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 100;
    const parsed = await this.requireRequest(
      'GET',
      '/v1/subscriptions/',
      polarListSchema(polarSubscriptionSchema),
      {
        query: {
          page,
          limit,
          ...(input.modifiedSince === undefined ? {} : { modified_at_gte: input.modifiedSince }),
        },
      },
    );
    const hasMore = page < parsed.pagination.max_page;
    return { items: parsed.items, hasMore, nextPage: hasMore ? page + 1 : null };
  }

  async cancelSubscription(input: CancelSubscriptionInput): Promise<PolarSubscription> {
    const atPeriodEnd = input.atPeriodEnd ?? true;
    return this.requireRequest(
      'PATCH',
      `/v1/subscriptions/${input.subscriptionId}`,
      polarSubscriptionSchema,
      {
        body: atPeriodEnd
          ? { cancel_at_period_end: true, ...(input.reason === undefined ? {} : { customer_cancellation_reason: input.reason }) }
          : { revoke: true },
      },
    );
  }

  async uncancelSubscription(subscriptionId: string): Promise<PolarSubscription> {
    return this.requireRequest('PATCH', `/v1/subscriptions/${subscriptionId}`, polarSubscriptionSchema, {
      body: { cancel_at_period_end: false },
    });
  }

  async changeSubscriptionProduct(input: {
    subscriptionId: string;
    productId: string;
  }): Promise<PolarSubscription> {
    return this.requireRequest(
      'PATCH',
      `/v1/subscriptions/${input.subscriptionId}`,
      polarSubscriptionSchema,
      { body: { product_id: input.productId } },
    );
  }

  async createCustomerPortalSession(input: {
    customerId: string;
  }): Promise<PolarCustomerSession> {
    return this.requireRequest('POST', '/v1/customer-sessions/', polarCustomerSessionSchema, {
      body: { customer_id: input.customerId },
    });
  }

  async getOrder(orderId: string): Promise<PolarOrder | null> {
    return this.request('GET', `/v1/orders/${orderId}`, polarOrderSchema, { allowNotFound: true });
  }

  async listOrders(input: {
    subscriptionId?: string;
    customerId?: string;
  }): Promise<readonly PolarOrder[]> {
    const parsed = await this.requireRequest('GET', '/v1/orders/', polarListSchema(polarOrderSchema), {
      query: {
        ...(input.subscriptionId === undefined ? {} : { subscription_id: input.subscriptionId }),
        ...(input.customerId === undefined ? {} : { customer_id: input.customerId }),
        limit: 100,
      },
    });
    return parsed.items;
  }

  async listBenefitGrants(input: { subscriptionId: string }): Promise<readonly PolarBenefitGrant[]> {
    const parsed = await this.requireRequest(
      'GET',
      '/v1/benefit-grants/',
      polarListSchema(polarBenefitGrantSchema),
      { query: { subscription_id: input.subscriptionId, limit: 100 } },
    );
    return parsed.items;
  }

  async ingestUsage(events: readonly UsageEventInput[]): Promise<{ accepted: number }> {
    if (events.length === 0) {
      return { accepted: 0 };
    }
    await this.requireRequest('POST', '/v1/events/ingest', z.object({}).loose(), {
      body: {
        events: events.map((event) => ({
          name: event.name,
          external_customer_id: event.externalCustomerId,
          timestamp: event.timestamp,
          metadata: { ...event.metadata },
        })),
      },
    });
    return { accepted: events.length };
  }
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { raw: text.slice(0, 512) };
  }
}

export interface CreatePolarClientOptions {
  readonly config: PolarConfig;
  readonly clock?: Clock;
  readonly fetchImpl?: typeof fetch;
  /** Signing secret the simulator uses so webhook verification is exercised. */
  readonly simulatorWebhookSecret?: string;
}

/**
 * The factory every service uses.
 *
 * With `POLAR_ACCESS_TOKEN` set it returns the live client. Without it, it
 * returns the local simulator, which models checkout, trialing, conversion,
 * cancellation, failed payment and the customer portal, and emits signed
 * webhook events. Nothing degrades to a stub: the lifecycle is complete either
 * way.
 */
export function createPolarClient(options: CreatePolarClientOptions): PolarClient {
  const clock = options.clock ?? systemClock;
  const { config } = options;
  if (config.accessToken === undefined || config.accessToken.length === 0) {
    return new LocalPolarSimulator({
      clock,
      server: config.server,
      trialDays: config.trialDays,
      webhookSecret: options.simulatorWebhookSecret ?? config.webhookSecret,
      monthlyProductId: config.monthlyProductId,
      annualProductId: config.annualProductId,
    });
  }
  return new HttpPolarClient({
    accessToken: config.accessToken,
    server: config.server,
    clock,
    ...(options.fetchImpl === undefined ? {} : { fetchImpl: options.fetchImpl }),
  });
}

/** True when this process is running against the in-process simulator. */
export function isSimulated(client: PolarClient): client is LocalPolarSimulator {
  return client.mode === 'simulator';
}

/**
 * The minimal surface of an `@polar-sh/sdk` instance we use. Declared
 * structurally so the SDK's own generated types never cross this boundary.
 */
export interface PolarSdkLike {
  readonly products: { get(input: { id: string }): Promise<unknown> };
  readonly customers: { get(input: { id: string }): Promise<unknown> };
  readonly checkouts: {
    create(input: Record<string, unknown>): Promise<unknown>;
    get(input: { id: string }): Promise<unknown>;
  };
  readonly subscriptions: {
    get(input: { id: string }): Promise<unknown>;
    list(input: Record<string, unknown>): Promise<unknown>;
    update(input: Record<string, unknown>): Promise<unknown>;
  };
  readonly orders: {
    get(input: { id: string }): Promise<unknown>;
    list(input: Record<string, unknown>): Promise<unknown>;
  };
  readonly customerSessions: { create(input: Record<string, unknown>): Promise<unknown> };
  readonly events: { ingest(input: Record<string, unknown>): Promise<unknown> };
  readonly benefitGrants?: { list(input: Record<string, unknown>): Promise<unknown> };
}

function parseOrThrow<T extends z.ZodType>(schema: T, value: unknown): z.output<T> {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: BILLING_MESSAGE_KEYS.responseInvalid,
      details: { provider: 'polar' },
    });
  }
  return result.data;
}

/**
 * Adapt an already-constructed `@polar-sh/sdk` instance to the port. Every SDK
 * result is re-parsed with our own schemas, so an SDK shape change surfaces as
 * a validation error at the boundary instead of as a wrong entitlement.
 */
export function polarClientFromSdk(
  sdk: PolarSdkLike,
  server: 'sandbox' | 'production',
): PolarClient {
  return {
    mode: 'live',
    server,
    async getProduct(productId) {
      return parseOrThrow(polarProductSchema, await sdk.products.get({ id: productId }));
    },
    async getCustomer(customerId) {
      return parseOrThrow(polarCustomerSchema, await sdk.customers.get({ id: customerId }));
    },
    async createCheckout(input) {
      return parseOrThrow(
        polarCheckoutSchema,
        await sdk.checkouts.create({
          products: [input.productId],
          successUrl: input.successUrl,
          metadata: { ...(input.metadata ?? {}) },
        }),
      );
    },
    async getCheckout(checkoutId) {
      return parseOrThrow(polarCheckoutSchema, await sdk.checkouts.get({ id: checkoutId }));
    },
    async getSubscription(subscriptionId) {
      return parseOrThrow(polarSubscriptionSchema, await sdk.subscriptions.get({ id: subscriptionId }));
    },
    async listSubscriptions(input) {
      const page = input.page ?? 1;
      const parsed = parseOrThrow(
        polarListSchema(polarSubscriptionSchema),
        await sdk.subscriptions.list({
          page,
          limit: input.limit ?? 100,
          modifiedAtGte: input.modifiedSince,
        }),
      );
      const hasMore = page < parsed.pagination.max_page;
      return { items: parsed.items, hasMore, nextPage: hasMore ? page + 1 : null };
    },
    async cancelSubscription(input) {
      return parseOrThrow(
        polarSubscriptionSchema,
        await sdk.subscriptions.update({
          id: input.subscriptionId,
          subscriptionUpdate: { cancelAtPeriodEnd: input.atPeriodEnd ?? true },
        }),
      );
    },
    async uncancelSubscription(subscriptionId) {
      return parseOrThrow(
        polarSubscriptionSchema,
        await sdk.subscriptions.update({
          id: subscriptionId,
          subscriptionUpdate: { cancelAtPeriodEnd: false },
        }),
      );
    },
    async changeSubscriptionProduct(input) {
      return parseOrThrow(
        polarSubscriptionSchema,
        await sdk.subscriptions.update({
          id: input.subscriptionId,
          subscriptionUpdate: { productId: input.productId },
        }),
      );
    },
    async createCustomerPortalSession(input) {
      return parseOrThrow(
        polarCustomerSessionSchema,
        await sdk.customerSessions.create({ customerId: input.customerId }),
      );
    },
    async getOrder(orderId) {
      return parseOrThrow(polarOrderSchema, await sdk.orders.get({ id: orderId }));
    },
    async listOrders(input) {
      const parsed = parseOrThrow(
        polarListSchema(polarOrderSchema),
        await sdk.orders.list({ subscriptionId: input.subscriptionId, customerId: input.customerId }),
      );
      return parsed.items;
    },
    async listBenefitGrants(input) {
      if (sdk.benefitGrants === undefined) {
        return [];
      }
      const parsed = parseOrThrow(
        polarListSchema(polarBenefitGrantSchema),
        await sdk.benefitGrants.list({ subscriptionId: input.subscriptionId }),
      );
      return parsed.items;
    },
    async ingestUsage(events) {
      if (events.length === 0) {
        return { accepted: 0 };
      }
      await sdk.events.ingest({
        events: events.map((event) => ({
          name: event.name,
          externalCustomerId: event.externalCustomerId,
          timestamp: event.timestamp,
          metadata: { ...event.metadata },
        })),
      });
      return { accepted: events.length };
    },
  };
}
