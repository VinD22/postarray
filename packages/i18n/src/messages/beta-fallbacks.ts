/**
 * B5-controlled messages remain in the reviewed English source until Legal has
 * approved a human translation. This is an explicit, narrow exception to the
 * active-catalog parity gate, never a general escape hatch for missing work.
 */

/**
 * Locales that carry a real translation of the eleven namespaces listed in
 * `LOCALE_FILLED_PREFIXES`, not the whole B5 backlog.
 *
 * This is a narrow, additive exception, not a locale-wide override. Every
 * other B5 prefix and key below, including billing, legal, pricing, security
 * copy and the safety-critical namespaces (queue rules' daylight-saving
 * wording, media editor claims, approval flow, pause and resume, bulk
 * import), stays on the reviewed English source for these locales exactly as
 * it does for every other beta locale. Those namespaces are excluded here on
 * purpose: they need the human legal or security review this file's opening
 * comment requires, which translating the eleven content namespaces below
 * does not provide. Adding a locale to this list without also filling its
 * eleven catalogs makes `active-catalogs.test.ts` fail loudly for that
 * locale, which is the intended guard rail: this list cannot get ahead of
 * the work.
 */
export const FULL_COVERAGE_LOCALE_CODES = [
  'en',
  'pt-BR',
  'es',
  'de',
  'fr',
  'ja',
  'id',
  'hi',
  'ar',
  'zh-Hans',
  'it',
  'nl',
  'pl',
  'cs',
  'sv',
  'tr',
  'ru',
  'uk',
  'he',
  'ko',
  'vi',
  'th',
  'fil',
  'zh-Hant',
  'es-419',
] as const;

/**
 * The eleven namespaces a `FULL_COVERAGE_LOCALE_CODES` locale has actually
 * translated: content and product-description copy (the blog, the free
 * tools, the per-platform scheduler pages, the use case pages, the
 * comparison page chrome, the in-page demonstration, bulk CSV import, the
 * non-generative media editor, posting sets and holds, queue rules, and
 * transactional email). Every prefix here is a subset of
 * `BETA_ENGLISH_FALLBACK_PREFIXES` below; this list exists only to carve a
 * hole in that list for the locales that have filled it, key for key, prefix
 * for prefix, matching what `docs/planning` describes as phase 5 of the
 * multilingual rollout.
 */
export const LOCALE_FILLED_PREFIXES = [
  'email.',
  'queue.',
  'web.blog.',
  'web.tools.',
  'web.meta.tools.',
  'import.',
  'web.schedule.',
  'web.meta.schedule.',
  'web.meta.schedulePlatform.',
  'web.useCases.',
  'web.meta.useCases.',
  'web.meta.useCase.',
  'calendar.hold.',
  'set.',
  'targetMemory.',
  'web.comparison.',
  'mediaLib.derivative.',
  'error.media_derivative_',
  'web.demo.',
  'web.meta.demo.',
] as const;

export const BETA_ENGLISH_FALLBACK_PREFIXES = [
  'billing.',
  // What the assistant did, and what it deliberately did not do. Every one of
  // these sentences draws the line between a proposal and a write, and a
  // machine translation that blurred "once you confirm it" into something
  // vaguer would leave somebody believing a post was scheduled when it was
  // not. Beta locales keep the reviewed English source until a person
  // translates it.
  'assistant.',
  // The assistant screen in the web app. Every sentence either labels a
  // suggestion as a suggestion or states exactly what a confirmation will
  // write, to which accounts, at what time. A machine translation that
  // softened "nothing has been written yet" would leave somebody believing a
  // post was scheduled when it was not. Beta locales keep the reviewed
  // English source until a person translates it.
  'assistantWeb.',
  // What the composer says when a save, an approval request, a schedule or a
  // publish did not go through. Each sentence states exactly what did not
  // happen, and a machine translation that blurred "was not published" into
  // something vaguer would leave somebody believing a post went out when it
  // did not. Beta locales keep the reviewed English source until a person
  // translates it.
  'composerWeb.commitFailed.',
  // Transactional security and invitation mail stays in reviewed English
  // until each beta locale has a human-reviewed delivery template.
  'email.',
  // New authentication security copy remains English in beta locales until
  // the code-entry and provider-availability wording is human reviewed.
  'auth.emailOnly.',
  'auth.otp.',
  // Choosing a new password from a reset link. The screen states exactly what
  // a link can and cannot still do, and a machine translation that softened
  // "expired or already used" into something vaguer would leave somebody
  // retrying a dead link. Beta locales keep the reviewed English source until
  // a person translates it.
  'auth.newPassword.',
  'developer.confirmation.',
  // Connecting an AI client to a workspace. Every sentence is either an exact
  // statement about a credential that cannot be retrieved again, or a
  // statement about what the workspace did and did not record. A machine
  // translation that softened "this screen cannot show it to you again" would
  // leave somebody believing they can come back for it. Beta locales keep the
  // reviewed English source until a person translates it.
  'developer.connect.',
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
  // The generated post specs cluster at /specs. Every sentence in this
  // namespace either labels a value read from the generated publishing-limits
  // dataset or says plainly that a platform limit is not a claim that anything
  // publishes. A machine translation that softened the second would turn a
  // reference page into a capability claim in that language. Beta locales keep
  // the reviewed English source until a person translates them.
  'web.specs.',
  'web.meta.specs.',
  'web.meta.specsPlatform.',
  // The image dimensions pages under /specs/dimensions. Same reasoning as the
  // namespace above, plus one of its own: these values are hand maintained
  // rather than generated, so each page names the official document it read
  // and the day it read it. A machine translation that blurred a stated
  // minimum into a recommendation would put words in a platform's mouth. Beta
  // locales keep the reviewed English source until a person translates them.
  'web.meta.dimensions.',
  'web.meta.dimensionsPlatform.',
  // The generated free tool directory: a character counter per platform and the
  // consolidated media limits table. Every sentence in this namespace either
  // states a platform counting rule, states a recorded ceiling, or promises
  // that what a reader types never leaves the browser. A machine translation
  // that softened the last one would be a privacy claim nobody reviewed, so
  // beta locales keep the reviewed English source until a person translates
  // them. Deliberately not filed under `web.tools.`, which ten locales have
  // already translated key for key.
  'web.toolDirectory.',
  'web.meta.toolDirectory.',
  // Pause and resume, Posting Set management, remembered channel selection
  // (A3, A7, A8). All three make precise claims a machine translation is likely
  // to soften: that pausing cannot retract a post that already published, that
  // editing a Set never touches work already made from it, and exactly what the
  // composer does and does not store about a person's account selection. They
  // stay on the reviewed English source until each has a human translation.
  'calendar.hold.',
  'set.',
  'targetMemory.',
  // Per comparison pages (C6). Every sentence in this namespace is either a
  // state word a table cell depends on or a statement about what this product
  // does not do: no verified connector, no reviewed locale, undecided pricing
  // tiers. A machine translation that softened any of those would be a false
  // claim in that language, which is the exact failure the launch-truth test
  // exists to prevent. Beta locales keep the reviewed English source until a
  // person translates them.
  'web.comparison.',
  // A9: the non-generative media editor. Every sentence in these two
  // namespaces makes a capability claim: that an edit never replaces the
  // original, that this product does not enlarge a picture because the extra
  // pixels would be invented, and that Relay generates no imagery at all. A
  // machine translation that softened any of those would be a false claim in
  // that language. Beta locales keep the reviewed English source until a person
  // translates them.
  'mediaLib.derivative.',
  'error.media_derivative_',
  // The in-page product demonstration: the hero demonstration and the guided
  // walkthrough at /demo. Every sentence here is either sample content, which
  // must stay recognizable as sample content, or a statement about where the
  // workflow stops today: no connector has passed provider verification, so
  // nothing publishes and half of a receipt is unavailable. A machine
  // translation that softened either would turn a demonstration into a claim.
  // Beta locales keep the reviewed English source until a person translates
  // them.
  'web.demo.',
  'web.meta.demo.',
  // Track B phase 4, in-app delight. Four new namespaces, all of them making
  // precise claims a machine translation is likely to soften: the dashboard
  // tiles state what a number counts and when it is unreadable, the publish
  // panel states that some destinations are live and some are not, the empty
  // scenes state what has not happened yet, and the onboarding rows state
  // that an account came back from a provider. Beta locales keep the reviewed
  // English source until a person translates them.
  'home.v2.',
  'publish.receipt.',
  'empty.scene.',
  'onboarding.live.',
] as const;

/** B5-controlled keys whose namespace also contains ordinary interface copy. */
export const BETA_ENGLISH_FALLBACK_KEYS = [
  // Added when `lastVerifiedAt` became nullable so an unverified metric
  // definition stops rendering a fabricated 1970 verification date. Reviewed
  // English until a reviewer covers it in each locale.
  'analytics.definition.notVerified',
  // Google Business Profile joined the public connector matrix after the
  // catalogs were last translated, and `noVideo` came with it. Reviewed English
  // until a reviewer covers them in each locale.
  'web.marketing.provider.google_business_profile.label',
  'web.marketing.provider.google_business_profile.accountTypes',
  'web.marketing.provider.google_business_profile.restriction',
  'web.marketing.provider.google_business_profile.cost',
  'web.capabilities.note.noVideo',
  'settings.nav.billing',
  'nav.public.terms',
  'nav.public.privacy',
  'composerWeb.native.privacy',
  'approval.reapproval.reason.privacy',
  'capability.feature.privacy',
  'web.cta.startTrial',
  'web.cta.seePricing',
  'web.home.honest.noMedia',
  'settings.projects.disclosureDefaults',
  'settings.projects.localeRules.legal',
  'settings.ui.section.billing',
  'settings.ui.section.billingSummary',
  'nav.projectSwitcher',
  'composerWeb.entity.searchFailed',
  'web.connection.connect.projectContext',
  'settings.ui.projects.disclosureHelp',
  'settings.ui.projects.domainVerificationUnavailable',
  'settings.ui.projects.disclosureUnavailable',
  'settings.ui.projects.glossaryUnavailable',
  'settings.ui.projects.localeRulesUnavailable',
  'settings.ui.security.killSwitchUnavailable',
  // "No ceiling" is the opposite of "a ceiling of zero". A machine translation
  // that blurs the two describes an agent's real powers wrongly in both
  // directions, so beta locales keep the reviewed English until a person
  // translates it.
  'developer.ui.agents.noCadenceCeiling',
  'developer.ui.agents.noLookAheadCeiling',
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
  // Editorial-marketing follow-up: the product and integrations hero
  // headlines and the product page's sequence heading and stat label, plus
  // the integrations stats cell's two labels. New strings, English only
  // until translated, same as the rest of this WP-3 batch.
  'web.product.v2.hero.headline',
  'web.product.v2.hero.headlineAccent',
  'web.product.v2.sequence.title',
  'web.product.v2.sequence.stepsStat',
  'web.integrations.v2.hero.headline',
  'web.integrations.v2.hero.headlineAccent',
  'web.integrations.v2.platformsStat',
  'web.integrations.v2.capabilitiesStat',
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
  //
  // The home connector sticker (Track B phase 3). It states how many
  // connectors exist and where to verify the number, so a machine translation
  // that rounded the plural rule would misstate a countable fact. Reviewed
  // English until a person translates it.
  'web.home.b3.sticker.connectorsFact',
  'web.home.b3.sticker.connectorsSource',
] as const;

/**
 * `locale` carves `LOCALE_FILLED_PREFIXES` out of the B5 list when that
 * locale is in `FULL_COVERAGE_LOCALE_CODES`. Every other B5 prefix and key
 * stays fallback-controlled for that locale exactly as for any other. Omitting
 * `locale` keeps the full, unmodified B5 list.
 */
export function isBetaEnglishFallbackKey(key: string, locale?: string): boolean {
  const onB5List =
    BETA_ENGLISH_FALLBACK_KEYS.includes(key as (typeof BETA_ENGLISH_FALLBACK_KEYS)[number]) ||
    BETA_ENGLISH_FALLBACK_PREFIXES.some((prefix) => key.startsWith(prefix)) ||
    key.startsWith('developer.consent.') ||
    key.startsWith('auth.terms.') ||
    key.startsWith('home.trial.');

  if (!onB5List) {
    return false;
  }

  const locallyFilled =
    locale !== undefined &&
    (FULL_COVERAGE_LOCALE_CODES as readonly string[]).includes(locale) &&
    LOCALE_FILLED_PREFIXES.some((prefix) => key.startsWith(prefix));

  return !locallyFilled;
}

/** Remove only B5-controlled keys from a beta locale catalog. See `isBetaEnglishFallbackKey`. */
export function withoutBetaEnglishFallbacks(
  messages: Readonly<Record<string, string>>,
  locale?: string,
): Readonly<Record<string, string>> {
  return Object.fromEntries(
    Object.entries(messages).filter(([key]) => !isBetaEnglishFallbackKey(key, locale)),
  );
}
