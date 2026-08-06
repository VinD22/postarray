/**
 * B5-controlled messages remain in the reviewed English source until Legal has
 * approved a human translation. This is an explicit, narrow exception to the
 * active-catalog parity gate, never a general escape hatch for missing work.
 */
export const BETA_ENGLISH_FALLBACK_PREFIXES = [
  'billing.',
  // Transactional security and invitation mail stays in reviewed English
  // until each beta locale has a human-reviewed delivery template.
  'email.',
  // New authentication security copy remains English in beta locales until
  // the code-entry and provider-availability wording is human reviewed.
  'auth.emailOnly.',
  'auth.otp.',
  'settings.data.',
  'web.legal.',
  'web.meta.legal.',
  'web.pricing.',
  'web.meta.pricing.',
  'web.cta.trialFootnote',
  'web.home.summaryLine',
  'web.home.pillars.economics.',
  'web.home.v2.',
  'web.resources.legal.',
  'billing.ui.',
  'settings.ui.data.',
  'growth.ui.ugc.',
  'mediaLib.retention.',
  'mediaLib.processing.',
  'validation.media_unavailable.',
  'validation.media_rights_undeclared.',
  'validation.media_not_ready.',
  'validation.media_scan_blocked.',
] as const;

/** B5-controlled keys whose namespace also contains ordinary interface copy. */
export const BETA_ENGLISH_FALLBACK_KEYS = [
  'settings.nav.billing',
  'nav.public.terms',
  'nav.public.privacy',
  'composerWeb.native.privacy',
  'approval.reapproval.reason.privacy',
  'capability.feature.privacy',
  'web.cta.startTrial',
  'web.cta.seePricing',
  'web.home.honest.noMedia',
  'settings.brands.disclosureDefaults',
  'settings.brands.localeRules.legal',
  'settings.ui.section.billing',
  'settings.ui.section.billingSummary',
  'settings.ui.brands.disclosureHelp',
  'actionCenter.filter.billing',
  // WP-8 composer redesign (loud system pass): new strings, English only
  // until translated.
  'composerWeb.savedFlash',
  'composerWeb.validation.clear.v2',
  'composerWeb.schedule.confirmed',
  // WP-3 remaining marketing pages (loud system pass): new strings, English
  // only until translated.
  'web.marketing.v2.closing.title',
  'web.marketing.v2.closing.body',
  'web.product.v2.demo.title',
  'web.product.v2.demo.body',
  'web.integrations.v2.marqueeCaption',
  'web.compare.v2.honest',
  'web.creators.v2.phone.caption',
  'web.agencies.v2.channelsLabel',
  'web.agencies.v2.membersSticker',
  'web.developers.v2.terminal.title',
  'web.notFound.v2.line',
  // WP-11 automation + settings (loud system pass): new strings, English
  // only until translated.
  'settings.ui.referral.linkCopied',
  // WP-9 connections/receipts/library/action center (loud system pass): new
  // strings, English only until translated.
  'mediaLib.alt.nudge',
  'mediaLib.editor.unavailable.title',
  'mediaLib.editor.unavailable.body',
  'web.agencies.job.roles.body',
  'web.agencies.limits.body',
  'web.receipt.partial.retryUnavailable.title',
  'web.receipt.partial.retryUnavailable.body',
  'validation.capability_unavailable.message',
  'validation.content_kind_unsupported.message',
  'validation.content_kind_not_implemented.message',
  'validation.content_kind_requires_review.message',
  'validation.mention_count_exceeded.message',
  'validation.privacy_value_unsupported.message',
  'validation.similar_within_window.message',
  'validation.cross_account_similarity.message',
  'validation.cross_account_similarity.remediation',
  'validation.link_malformed.message',
  'validation.no_targets_selected.message',
] as const;

export function isBetaEnglishFallbackKey(key: string): boolean {
  return (
    BETA_ENGLISH_FALLBACK_KEYS.includes(key as (typeof BETA_ENGLISH_FALLBACK_KEYS)[number]) ||
    BETA_ENGLISH_FALLBACK_PREFIXES.some((prefix) => key.startsWith(prefix)) ||
    key.startsWith('developer.consent.') ||
    key.startsWith('auth.terms.') ||
    key.startsWith('home.trial.')
  );
}

/** Remove only B5-controlled keys from a beta locale catalog. */
export function withoutBetaEnglishFallbacks(
  messages: Readonly<Record<string, string>>,
): Readonly<Record<string, string>> {
  return Object.fromEntries(
    Object.entries(messages).filter(([key]) => !isBetaEnglishFallbackKey(key)),
  );
}
