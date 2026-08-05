/**
 * The `@relay/i18n` message keys this package attaches to errors and to
 * disclosure blocks.
 *
 * Nothing in `packages/billing` contains a user-facing English sentence. Every
 * key here exists in the English catalog, and `products.test.ts` asserts that,
 * so a catalog rename breaks the build rather than shipping a blank banner.
 */
export const BILLING_MESSAGE_KEYS = Object.freeze({
  providerUnavailable: 'error.provider_unavailable.message',
  providerTransient: 'error.provider_transient.message',
  providerPermanent: 'error.provider_permanent.message',
  responseInvalid: 'error.validation_failed.message',
  notFound: 'error.not_found.message',
  conflict: 'error.conflict.message',
  idempotencyKeyReused: 'error.idempotency_key_reused.message',
  signatureInvalid: 'error.webhook_signature_invalid.message',
  paymentRequired: 'error.payment_required.message',
  pastDue: 'error.subscription_past_due.message',
  trialExpired: 'error.trial_expired.message',
  entitlementMissing: 'error.entitlement_missing.message',
  channelLimitReached: 'error.channel_limit_reached.message',
  forbidden: 'error.forbidden.message',
  quotaExceeded: 'error.quota_exceeded.message',
  internal: 'error.internal.message',
});

export type BillingMessageKey =
  (typeof BILLING_MESSAGE_KEYS)[keyof typeof BILLING_MESSAGE_KEYS];
