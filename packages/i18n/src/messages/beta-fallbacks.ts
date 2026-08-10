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
  'developer.confirmation.',
  'error.agent_confirmation_',
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
  // Launch-truth and credential copy stays in reviewed English until each
  // beta locale receives a human security review.
  'settings.ui.state.notBuilt',
  'settings.ui.agents.notBuilt',
  'settings.ui.referral.notBuilt',
  'settings.ui.security.accountProtection',
  'settings.ui.security.mfaUnavailable',
  'settings.ui.security.sessionsBody',
  'settings.ui.security.sessionRevokeSuccess',
  'settings.ui.security.sessionLastUsed',
  'settings.ui.security.sessionDevice.',
  'settings.ui.security.apiKey',
  // The V1 project control plane launches in English. These workflow and
  // capacity messages remain on the reviewed source until each beta locale
  // has a human translation.
  'shell.project.',
  'web.connection.project',
  'error.project_',
  'settings.ui.projects.',
  'growth.ui.ugc.',
  'mediaLib.retention.',
  'mediaLib.offline.',
  'mediaLib.rateLimited.',
  'mediaLib.processing.',
  'mediaLib.import.',
  'validation.media_unavailable.',
  'validation.media_rights_undeclared.',
  'validation.media_not_ready.',
  'validation.media_scan_blocked.',
  // The approval review surface is safety-critical. New copy remains in the
  // reviewed English source until each beta locale has a human review.
  'approval.content.',
  'approval.changed.',
  'approval.notFound.',
  // Queue rules and slot reservations (A4). The rule editor and the reasons a
  // slot was chosen stay on the reviewed English source until each beta locale
  // has a human translation of the daylight-saving wording, which is the part
  // most likely to be got subtly wrong.
  'queue.',
  // The blog (C3). Articles are English-only typed content modules, so the
  // chrome around them stays on the reviewed English source until an article
  // actually exists in a locale. Translating the labels first would advertise
  // a translated blog that has no translated writing in it.
  'web.blog.',
  // The free tools (C4). Short interface chrome, but every sentence states a
  // platform rule or a privacy promise, and a machine translation that softens
  // either would be a false claim in that language. Beta locales keep the
  // reviewed English source until a person translates them.
  'web.tools.',
  'web.meta.tools.',
  // Bulk CSV import (A6). Column names, time zone rules and the difference
  // between making a draft and scheduling one are exact statements about how a
  // file is read. A machine translation that blurred "drafts" into "posts"
  // would describe a different and more dangerous tool, so beta locales keep
  // the reviewed English source until a person translates it.
  'import.',
  // Per platform scheduler pages and the project-led use case pages (C5).
  // Every sentence either states a platform rule or states plainly that
  // nothing publishes yet. A machine translation that softened "not built yet"
  // into something warmer would be a capability claim in that language, which
  // is exactly the failure the launch-truth test exists to prevent. Beta
  // locales keep the reviewed English source until a person translates them.
  'web.schedule.',
  'web.meta.schedule.',
  'web.meta.schedulePlatform.',
  'web.useCases.',
  'web.meta.useCases.',
  'web.meta.useCase.',
  // Pause and resume, Posting Set management, remembered channel selection
  // (A3, A7, A8). All three make precise claims a machine translation is likely
  // to soften: that pausing cannot retract a post that already published, that
  // editing a Set never touches work already made from it, and exactly what the
  // composer does and does not store about a person's account selection. They
  // stay on the reviewed English source until each has a human translation.
  'calendar.hold.',
  'set.',
  'targetMemory.',
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
  'nav.projectSwitcher',
  'composerWeb.entity.searchFailed',
  'web.connection.connect.projectContext',
  'settings.ui.brands.disclosureHelp',
  'settings.ui.brands.domainVerificationUnavailable',
  'settings.ui.brands.disclosureUnavailable',
  'settings.ui.brands.glossaryUnavailable',
  'settings.ui.brands.localeRulesUnavailable',
  'settings.ui.security.killSwitchUnavailable',
  'developer.ui.webhooks.secretRotationUnavailable',
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
  // Public launch-truth copy. Beta locales must not retain older claims about
  // media editing, service accounts or workspace-wide controls.
  'web.home.example.instagram.variant',
  'web.product.step.source.body',
  'web.product.step.compose.body',
  'web.creators.lede',
  'web.creators.job.adapt.body',
  'web.developers.safety.body',
  'web.developers.safety.killSwitch',
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
  'approval.reviewDescription',
  'approval.comment.optional',
  'approval.comment.required',
  'approval.noteFromAuthor',
  'approval.decision.title',
  'approval.decision.description',
  'approval.decision.approved',
  'approval.decision.changesRequested',
  'approval.decision.rejected',
  // Google Business Profile joined the launch cohort after the current
  // translation batch was cut. Its name and its account-role requirement stay
  // on the reviewed English source until each beta locale picks them up.
  'web.provider.google_business_profile',
  'web.connection.requirement.google_business_profile',
  // Calendar drag to reschedule (A5). The handle hint and the two live-region
  // sentences are new English copy; beta locales keep the reviewed source
  // until each one has a human translation.
  'calendar.drag.handleHint',
  'calendar.drag.overSlot',
  'calendar.drag.dropped',
  // Pause and resume, Posting Set management and remembered channel selection
  // (A3, A7, A8). All three make precise claims a machine translation is likely
  // to soften: that pausing cannot retract a post that already published, that
  // editing a Set never touches work already made from it, and exactly what the
  // composer does and does not store about a person's account selection. They
  // stay on the reviewed English source until each has a human translation.
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
