import { RelayError } from '@relay/contracts';
import type { PolarConfig } from '@relay/config';

import type { PolarClient } from './client';
import { isSimulated } from './client';
import { buildCheckoutDisclosure, buildConsentRecord } from './disclosure';
import type { CheckoutDisclosure, DisclosureConsentRecord } from './disclosure';
import { BILLING_MESSAGE_KEYS } from './messages';
import { PLAN_CURRENCY, TRIAL_DAYS } from './products';
import type { BillingInterval } from './intervals';
import { BASE_TIER_KEY, assertTierPublishable } from './tiers';
import type { PlanTierKey } from './tiers';
import { SIMULATOR_ANNUAL_PRODUCT_ID, SIMULATOR_MONTHLY_PRODUCT_ID } from './simulator';
import type { Clock } from './time';
import { nowIso } from './time';

/**
 * Checkout.
 *
 * Nothing here grants access. The redirect that follows checkout grants
 * nothing either. Entitlements come from the verified webhook and from
 * reconciliation, and only from those.
 *
 * The pre-purchase disclosure lives in `disclosure.ts` and is re-exported here
 * so every caller keeps one import for the whole checkout surface.
 */

export {
  DISCLOSURE_VERSION,
  REQUIRED_DISCLOSURE_LINE_IDS,
  buildCheckoutDisclosure,
  buildConsentRecord,
  type BuildDisclosureInput,
  type CheckoutDisclosure,
  type DisclosureConsentRecord,
  type DisclosureLine,
} from './disclosure';

export interface CheckoutDeps {
  readonly client: PolarClient;
  readonly config: PolarConfig;
  readonly clock: Clock;
  /**
   * Polar product ids for tiers above the base one, keyed `<tier>:<interval>`.
   * `PolarConfig` carries the two base product ids directly; a higher tier
   * cannot be sold until its ids are supplied here from the environment.
   */
  readonly tierProductIds?: Readonly<Record<string, string>>;
}

export interface CreateCheckoutSessionInput {
  readonly interval: BillingInterval;
  /** Defaults to the base tier. A tier awaiting a founder decision throws. */
  readonly tier?: PlanTierKey;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly successUrl: string;
  readonly locale: string;
  readonly idempotencyKey: string;
  readonly customerEmail?: string;
  readonly customerId?: string;
}

export interface CheckoutSession {
  readonly checkoutId: string;
  readonly checkoutUrl: string;
  readonly productId: string;
  readonly interval: BillingInterval;
  readonly tierKey: PlanTierKey;
  readonly disclosure: CheckoutDisclosure;
  readonly consent: DisclosureConsentRecord;
  /** Access is granted by the webhook, never by the return page. */
  readonly grantsEntitlement: false;
  readonly pendingStateKey: string;
}

export interface ResolveProductIdInput {
  readonly config: PolarConfig;
  readonly interval: BillingInterval;
  readonly tier?: PlanTierKey;
  readonly allowSimulatorFallback: boolean;
  readonly tierProductIds?: Readonly<Record<string, string>>;
}

/** The `tierProductIds` lookup key for one purchasable combination. */
export function tierProductKey(tier: PlanTierKey, interval: BillingInterval): string {
  return `${tier}:${interval}`;
}

/**
 * Resolve the Polar product id for a (tier, interval), or refuse to guess.
 *
 * Fail closed is the whole point: an unconfigured product throws rather than
 * falling back to a different tier's product, because charging a customer the
 * base price for a larger allowance would be worse than not selling at all.
 */
export function resolveProductId(input: ResolveProductIdInput): string {
  const tier = assertTierPublishable(input.tier ?? BASE_TIER_KEY);
  const { config, interval } = input;
  const envKey = interval === 'year' ? tier.annualProductIdEnvKey : tier.monthlyProductIdEnvKey;

  const supplied = input.tierProductIds?.[tierProductKey(tier.key, interval)];
  const configured =
    supplied ?? (interval === 'year' ? config.annualProductId : config.monthlyProductId);
  const usesBaseConfig = tier.key === BASE_TIER_KEY;

  if (supplied !== undefined && supplied.length > 0) {
    return supplied;
  }
  if (usesBaseConfig && configured !== undefined && configured.length > 0) {
    return configured;
  }
  if (usesBaseConfig && input.allowSimulatorFallback) {
    return interval === 'year' ? SIMULATOR_ANNUAL_PRODUCT_ID : SIMULATOR_MONTHLY_PRODUCT_ID;
  }
  throw new RelayError('INTERNAL', {
    messageKey: BILLING_MESSAGE_KEYS.internal,
    details: { missingEnvVar: envKey, tier: tier.key, interval },
  });
}

/**
 * Create the hosted checkout session and return it together with the
 * disclosure the UI must render before the customer leaves for Polar.
 *
 * The idempotency key is passed through to Polar so a double-click produces one
 * session, not two subscriptions.
 */
export async function createCheckoutSession(
  deps: CheckoutDeps,
  input: CreateCheckoutSessionInput,
): Promise<CheckoutSession> {
  const now = nowIso(deps.clock);
  const tierKey = input.tier ?? BASE_TIER_KEY;
  const productId = resolveProductId({
    config: deps.config,
    interval: input.interval,
    tier: tierKey,
    allowSimulatorFallback: isSimulated(deps.client),
    ...(deps.tierProductIds === undefined ? {} : { tierProductIds: deps.tierProductIds }),
  });
  const disclosure = buildCheckoutDisclosure({
    interval: input.interval,
    tier: tierKey,
    startedAt: now,
    trialDays: deps.config.trialDays,
  });

  const checkout = await deps.client.createCheckout({
    productId,
    successUrl: input.successUrl,
    idempotencyKey: input.idempotencyKey,
    customerExternalId: input.workspaceId,
    metadata: {
      workspaceId: input.workspaceId,
      actorId: input.actorId,
      interval: input.interval,
      tier: tierKey,
      disclosureVersion: disclosure.version,
    },
    ...(input.customerEmail === undefined ? {} : { customerEmail: input.customerEmail }),
    ...(input.customerId === undefined ? {} : { customerId: input.customerId }),
  });

  const consent = await buildConsentRecord({
    disclosure,
    workspaceId: input.workspaceId,
    actorId: input.actorId,
    shownAt: now,
    locale: input.locale,
  });

  return {
    checkoutId: checkout.id,
    checkoutUrl: checkout.url,
    productId,
    interval: input.interval,
    tierKey,
    disclosure,
    consent,
    grantsEntitlement: false,
    pendingStateKey: 'billing.checkout.notEntitledYet',
  };
}

/**
 * What the return page may say. It reports whether the verified webhook has
 * landed yet and never derives access from the redirect itself.
 */
export interface CheckoutReturnState {
  readonly entitlementsReady: boolean;
  readonly messageKey: string;
  readonly pollForSeconds: number;
}

export const CHECKOUT_RETURN_POLL_SECONDS = 60;

export function checkoutReturnState(entitlementsReady: boolean): CheckoutReturnState {
  return {
    entitlementsReady,
    messageKey: entitlementsReady
      ? 'billing.subscription.status.trialing'
      : 'billing.checkout.returning',
    pollForSeconds: entitlementsReady ? 0 : CHECKOUT_RETURN_POLL_SECONDS,
  };
}

/** Both intervals carry the same trial, so this is a constant, not a lookup. */
export const CHECKOUT_TRIAL_DAYS = TRIAL_DAYS;
export const CHECKOUT_CURRENCY = PLAN_CURRENCY;
