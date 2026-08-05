import { RelayError, computeChecksum } from '@relay/contracts';
import type { PolarConfig } from '@relay/config';

import type { PolarClient } from './client.js';
import { isSimulated } from './client.js';
import { BILLING_MESSAGE_KEYS } from './messages.js';
import { formatMoneyMinor } from './money.js';
import {
  ACTIVE_CHANNEL_ALLOWANCE,
  MANDATED_COPY,
  PLAN_CURRENCY,
  PRICE_PRESENTATION,
  TRIAL_DAYS,
} from './products.js';
import type { BillingInterval } from './products.js';
import { SIMULATOR_ANNUAL_PRODUCT_ID, SIMULATOR_MONTHLY_PRODUCT_ID } from './simulator.js';
import { computeTrialSchedule } from './trial.js';
import type { TrialSchedule } from './trial.js';
import type { Clock } from './time.js';
import { isoDateOf, nowIso } from './time.js';

/**
 * Checkout, and the disclosure the customer must see **before** they confirm.
 *
 * The disclosure is not marketing. It is the record of what was promised, so it
 * is versioned, checksummed and retained with a timestamp in `consents`. If a
 * customer later disputes a charge, we can show exactly what they read.
 *
 * Nothing here grants access. The redirect that follows checkout grants
 * nothing either. Entitlements come from the verified webhook and from
 * reconciliation, and only from those.
 */

/** Bump when any sentence in the disclosure changes. Stored with the consent. */
export const DISCLOSURE_VERSION = '2026-08-04';

export interface DisclosureLine {
  /** Stable identifier so a test can assert the block is complete. */
  readonly id: string;
  readonly messageKey: string;
  readonly params: Readonly<Record<string, string | number>>;
}

/** Every line the checkout disclosure must contain, in render order. */
export const REQUIRED_DISCLOSURE_LINE_IDS: readonly string[] = Object.freeze([
  'due_today',
  'trial_end',
  'first_charge',
  'interval',
  'renewal',
  'cancellation_path',
  'channel_allowance',
  'fair_use',
  'metered_x_usage',
  'no_media_generation',
  'tax',
]);

export interface CheckoutDisclosure {
  readonly version: string;
  readonly interval: BillingInterval;
  readonly currency: string;
  /** Always zero. Rendered as the exact string "$0 due today". */
  readonly dueTodayMinor: number;
  readonly dueTodayText: string;
  readonly trialDays: number;
  readonly trialEndsAt: string;
  readonly trialEndsOnDate: string;
  readonly firstChargeMinor: number;
  readonly firstChargeText: string;
  readonly firstChargeAt: string;
  readonly firstChargeOnDate: string;
  readonly renewalMinor: number;
  readonly renewalText: string;
  readonly annualFramingText: string | null;
  readonly activeChannelAllowance: number;
  readonly lines: readonly DisclosureLine[];
}

export interface BuildDisclosureInput {
  readonly interval: BillingInterval;
  readonly startedAt: string;
  readonly trialDays?: number;
}

/**
 * The block rendered beside the primary action, and repeated on the Billing
 * settings page. Dates and amounts come from `computeTrialSchedule`, sentences
 * come from `@relay/i18n` keys, so this function never contains prose.
 */
export function buildCheckoutDisclosure(input: BuildDisclosureInput): CheckoutDisclosure {
  const schedule: TrialSchedule = computeTrialSchedule({
    startedAt: input.startedAt,
    interval: input.interval,
    ...(input.trialDays === undefined ? {} : { trialDays: input.trialDays }),
  });
  const firstChargeText = formatMoneyMinor(schedule.firstChargeMinor, schedule.currency);
  const renewalText = formatMoneyMinor(schedule.renewalMinor, schedule.currency);
  const trialEndsOnDate = isoDateOf(schedule.conversionAt);
  const firstChargeOnDate = isoDateOf(schedule.firstChargeAt);
  const intervalLabelKey =
    input.interval === 'year'
      ? PRICE_PRESENTATION.year.labelKey
      : PRICE_PRESENTATION.month.labelKey;

  const lines: DisclosureLine[] = [
    { id: 'due_today', messageKey: 'billing.trial.dueToday', params: {} },
    {
      id: 'trial_end',
      messageKey: 'billing.trial.length',
      params: { date: trialEndsOnDate, days: schedule.trialDays },
    },
    {
      id: 'first_charge',
      messageKey: 'billing.trial.firstCharge',
      params: { amount: firstChargeText, date: firstChargeOnDate },
    },
    { id: 'interval', messageKey: intervalLabelKey, params: {} },
    {
      id: 'renewal',
      messageKey: 'billing.trial.renewal',
      params: { amount: renewalText, interval: input.interval },
    },
    { id: 'cancellation_path', messageKey: 'billing.trial.cancelBefore', params: {} },
    {
      id: 'channel_allowance',
      messageKey: 'billing.plan.includes.channels',
      params: { limit: ACTIVE_CHANNEL_ALLOWANCE },
    },
    { id: 'fair_use', messageKey: 'billing.plan.fairUse', params: {} },
    { id: 'metered_x_usage', messageKey: 'billing.usage.xCharges', params: {} },
    { id: 'no_media_generation', messageKey: 'billing.usage.noMediaCredits', params: {} },
    { id: 'tax', messageKey: 'billing.checkout.taxNote', params: {} },
  ];

  return {
    version: DISCLOSURE_VERSION,
    interval: input.interval,
    currency: schedule.currency,
    dueTodayMinor: schedule.dueTodayMinor,
    dueTodayText: MANDATED_COPY.dueToday,
    trialDays: schedule.trialDays,
    trialEndsAt: schedule.conversionAt,
    trialEndsOnDate,
    firstChargeMinor: schedule.firstChargeMinor,
    firstChargeText,
    firstChargeAt: schedule.firstChargeAt,
    firstChargeOnDate,
    renewalMinor: schedule.renewalMinor,
    renewalText,
    annualFramingText:
      input.interval === 'year' ? PRICE_PRESENTATION.annualFraming.framingText : null,
    activeChannelAllowance: ACTIVE_CHANNEL_ALLOWANCE,
    lines,
  };
}

export interface DisclosureConsentRecord {
  readonly version: string;
  readonly interval: BillingInterval;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly shownAt: string;
  /** Checksum of the exact disclosure the customer saw. */
  readonly checksum: string;
  readonly locale: string;
}

/** The retained proof of what was shown, written to `consents` at checkout. */
export async function buildConsentRecord(input: {
  disclosure: CheckoutDisclosure;
  workspaceId: string;
  actorId: string;
  shownAt: string;
  locale: string;
}): Promise<DisclosureConsentRecord> {
  return {
    version: input.disclosure.version,
    interval: input.disclosure.interval,
    workspaceId: input.workspaceId,
    actorId: input.actorId,
    shownAt: input.shownAt,
    checksum: await computeChecksum(input.disclosure),
    locale: input.locale,
  };
}

export interface CheckoutDeps {
  readonly client: PolarClient;
  readonly config: PolarConfig;
  readonly clock: Clock;
}

export interface CreateCheckoutSessionInput {
  readonly interval: BillingInterval;
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
  readonly disclosure: CheckoutDisclosure;
  readonly consent: DisclosureConsentRecord;
  /** Access is granted by the webhook, never by the return page. */
  readonly grantsEntitlement: false;
  readonly pendingStateKey: string;
}

/** Resolve the Polar product id for an interval, or refuse to guess. */
export function resolveProductId(
  config: PolarConfig,
  interval: BillingInterval,
  allowSimulatorFallback: boolean,
): string {
  const configured = interval === 'year' ? config.annualProductId : config.monthlyProductId;
  if (configured !== undefined && configured.length > 0) {
    return configured;
  }
  if (allowSimulatorFallback) {
    return interval === 'year' ? SIMULATOR_ANNUAL_PRODUCT_ID : SIMULATOR_MONTHLY_PRODUCT_ID;
  }
  throw new RelayError('INTERNAL', {
    messageKey: BILLING_MESSAGE_KEYS.internal,
    details: {
      missingEnvVar: interval === 'year' ? 'POLAR_ANNUAL_PRODUCT_ID' : 'POLAR_MONTHLY_PRODUCT_ID',
    },
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
  const productId = resolveProductId(deps.config, input.interval, isSimulated(deps.client));
  const disclosure = buildCheckoutDisclosure({
    interval: input.interval,
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
