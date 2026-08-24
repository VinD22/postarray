# Multilingual rollout: 20 interface locales and international SEO

**Status:** implementation plan and release checklist. The engineering plumbing described below is
now present in the repository. Translation, native review, keyword research, and production launch
remain gated work.

**Audience:** junior developers working in parallel with a localization lead, web lead, API lead,
and SEO reviewer.

## 1. Launch contract

The launch roster is explicit and ordered. Do not derive it from directory names or from the content
language list:

`en`, `es`, `pt-BR`, `fr`, `de`, `it`, `nl`, `pl`, `tr`, `id`, `ar`, `hi`, `ja`, `ko`, `zh-Hans`,
`ru`, `uk`, `he`, `vi`, `th`.

English remains unprefixed (`/pricing`). Every other locale uses a BCP-47 path prefix
(`/de/pricing`, `/zh-Hans/tools`, `/ar/legal/privacy`). The five legacy locales `es-419`, `cs`,
`sv`, `fil`, and `zh-Hant` remain in the registry for compatibility, but are retired, hidden from
the picker and redirected to the English equivalent with a 301. Other planned registry locales stay
available for future research and for content-language selection. They are not interface locales.

Every launch locale is initially `beta`. A locale may become `reviewed` only after a named native
reviewer signs off the catalog, ICU/plural behavior, legal copy, accessibility, SEO copy, and the
runtime screens. No reviewer names or fake dates belong in source.

## 2. What is already implemented

The following foundation is in the current code and should be reused, not rebuilt:

- `packages/i18n/src/locales.ts` owns the 20-locale public roster, direction, plural rules,
  formatting metadata, planned locales, and retired compatibility locales.
- `packages/i18n/src/messages/index.ts` lazy-loads catalogs. Runtime fallback is English, while
  `review-gate.ts` can run in strict mode and reject every fallback key.
- Catalog module parity, active-catalog lint, ICU argument checks, forbidden-copy checks, and the
  review record gate run in Vitest. `module-parity.ts` prevents a namespace being silently omitted
  from one locale's index.
- `apps/web/src/[locale]` is the route tree. The proxy rewrites unprefixed URLs to English, sets the
  locale header and cookie for explicit prefixes, redirects `/en/*`, rejects unknown locales, and
  301 redirects retired prefixes.
- Marketing metadata emits a self canonical, reciprocal `hreflang` entries, `x-default`, localized
  Open Graph locale values, and locale-aware JSON-LD. Article metadata lists only languages in which
  the article actually exists and canonicalizes an untranslated request to English.
- The sitemap emits every marketing route once per public locale and every translated article once
  per available article language. `/blog.xml` is the English feed and `/{locale}/blog.xml` is a
  localized feed that omits untranslated articles.
- The CLI has `--locale` and environment/profile precedence. Human diagnostics and help are localized;
  `--json` field names, enum values, exit codes, and machine errors are unchanged.
- API OAuth discovery advertises the same 20 locales. The OpenAPI reference page accepts `?lang=`
  or `Accept-Language` without changing `/openapi.json`. The web OAuth consent page renders the exact
  requested scopes, workspace choice, approval warning, localized buttons, and a hash of the copy
  shown to the user before posting the nonce-bound decision.

## 3. Surface inventory, with no omissions

The implementation team must audit every item in this inventory. Add a row to the coverage test when
a new route or human-facing message surface is introduced.

### Web application and authentication

- Marketing home, product, pricing, integrations, capabilities, schedule, platform schedule pages,
  specs, platform specs, constraints, use cases, comparisons, resources, changelog, status, demo,
  opportunities, for-creators, for-agencies, for-developers, tool directory, every free tool, legal
  index and every legal page, blog index, every article, and localized RSS feeds.
- Auth: sign-in, sign-up, forgot password, check email, reset password, provider errors, and all
  validation, rate-limit, offline, and permission states.
- Onboarding: use case, workspace, plan, connect, compose, and done.
- Signed-in app: home, compose, calendar, posts, approvals, connections and connection detail,
  library, action center, assistant, growth, analytics, receipts, links, automation rules and feeds,
  posting sets, media editing and rights, onboarding resume, and every settings section.
- Settings: workspace, projects, members, billing, localization, security, data controls, agents,
  developer apps, webhooks, API keys, service accounts, and all unavailable/permission-denied states.
- OAuth consent at `/consent`, including missing request, expired request, no workspace, loading,
  submit, denial, redirect, and API error states. This is transactional and `noindex`.

### Non-web human surfaces

- CLI command names and help, profile and locale selection, human-readable success/failure output,
  validation diagnostics, paging prompts, and offline/rate-limit messages. Keep stable JSON output
  and shell exit semantics in English-neutral machine form.
- API OpenAPI reference chrome, OAuth discovery locale list, OAuth consent copy, problem messages,
  and localized `Content-Language`/`Vary` headers. Keep schemas, field names, status codes, and
  operation IDs stable.
- Transactional email, invitations, password reset, connection notices, publication receipts,
  weekly digest, webhook descriptions, and any notification templates. Emails require native review
  before a locale is promoted.
- Accessibility names, announcements, tooltips, empty/loading/error/offline/partial-success states,
  and confirmation dialogs. A translated happy path is not coverage.

Machine-to-machine contracts are not translated: API JSON keys, webhook payload keys, CLI `--json`,
provider identifiers, scope identifiers, URL slugs, public IDs, and error codes stay stable.

## 4. Catalog work for each locale

Run this sequence once per locale. A junior developer owns the mechanics; the localization lead owns
meaning and the native reviewer owns release approval.

1. Freeze the English key set for the batch. Any new English key is added to the pending-key report.
2. Copy the complete English module shape into the locale index and preserve every key, ICU argument,
   markup tag, connector name, URL, and product noun.
3. Translate values with the approved glossary. Machine translation may create a first draft only.
4. Rewrite plural/select branches for the locale's CLDR categories. In particular, Arabic uses all
   six categories; Polish, Czech, Russian, and Ukrainian use `one/few/many/other`; Hebrew uses
   `one/two/other`; German, Dutch, and Turkish use `one/other`; Indonesian, Vietnamese, Thai,
   Simplified Chinese, Japanese, and Korean use `other`.
5. Keep legal, billing, consent, security, approval, provider-capability, and media-rights wording
   in reviewed English until a native/legal reviewer signs the translation. Label the locale beta.
6. Run catalog lint, module parity, active-catalog tests, pseudo-locale layout checks, and the strict
   review gate with `allowEnglishFallbacks: false` before requesting review.
7. Record the native reviewer, date, glossary version, source/catalog digests, and evidence for all
   required areas in `LOCALE_REVIEWS`. Never invent a reviewer or use a blanket acknowledgement.

Required glossary terms include Post Array, Composer, Growth Advisor, Action Center, Workspace, post,
draft, schedule, publish, approve, connection, and every connector name. Product nouns and provider
names must not drift between catalog, SEO title, email, CLI, and API reference.

## 5. SEO and content localization

SEO is a per-language editorial task, not a string replacement task.

- For every existing public route, research the target-language query, search intent, title length,
  meta description, headings, internal anchor text, FAQ wording, and terminology. Store the keyword
  brief with the locale review. Do not create extra landing pages until search data proves demand.
- Use the existing route registry and dynamic registries as the source of truth. Every route in
  `MARKETING_ROUTES`, every platform/spec/tool/use-case/comparison slug, every legal page, the blog
  index, and every available article locale must have a metadata test.
- Each localized marketing page must have a truthful localized title and description, one self
  canonical, a reciprocal hreflang cluster containing only public locales for the page, `x-default`
  to English, and Open Graph/Twitter values in the same language. Structured data must match visible
  copy and include the correct `inLanguage`; never invent ratings, reviews, prices, or capabilities.
- An article without a translation is not advertised in that locale's hreflang cluster, sitemap, or
  RSS feed. A reader who reaches the fallback gets English content and an English canonical.
- Keep stable URL slugs in V1. If translated slugs become worthwhile, add a separate slug map and
  permanent redirects after a measured SEO experiment.
- Marketing routes are indexable. App, auth, onboarding, and consent routes are `noindex`. Robots,
  metadata, sitemap, canonical, and feed behavior must agree.
- Verify in a built deployment: all sitemap URLs return 200, `/en/*` returns a 301 to English,
  retired prefixes return a 301, unknown prefixes are not rendered as English, every hreflang target
  is reciprocal, and no page exposes an English fallback title while claiming a translated locale.

## 6. Junior developer work sequence

Work in small branches. Do not reformat another team's files. Every change ends with focused tests,
`pnpm verify`, and a short coverage note.

**Track A, catalog and review gates:** locale registry, catalogs, glossary, ICU/plural lint, strict
review records, pseudo-locale snapshots, email/digest coverage.

**Track B, web surfaces:** route inventory, language picker and settings persistence, auth/onboarding,
app shell and settings, consent, RTL and pseudo-locale review.

**Track C, SEO/content:** per-locale keyword briefs, marketing metadata, hreflang, sitemap, robots,
article availability, RSS, JSON-LD, redirects, Search Console validation.

**Track D, developer surfaces:** CLI locale precedence and help, stable JSON snapshots, API docs
presentation, OAuth discovery and consent integration, webhook/email copy checks.

Recommended order:

1. Run the route and message inventory and create a coverage matrix with one row per route, surface,
   locale, owner, translation status, reviewer, and SEO status.
2. Finish English and glossary changes, then batch locales in waves of four or five. Do not mark a
   locale reviewed because its catalog loads; require strict fallback and native sign-off.
3. Validate web chrome and app state variants in English, `en-XA`, `en-XB`, Arabic, German, Thai,
   Japanese, and Simplified Chinese. Check 360, 768, and 1440px widths, light/dark themes, keyboard,
   screen reader names, and reduced motion.
4. Run per-locale SEO checks on every public route and every dynamic page family. Check title/meta
   truncation, canonical/hreflang reciprocity, JSON-LD language, feed language, and internal links.
5. Launch a locale only after its translations, SEO brief, native review, support macros, email
   templates, and rollback/redirect test are complete.

## 7. Automated coverage gates

Add or maintain tests for all of the following:

- The public roster contains exactly 20 codes, no retired code, and every code has a catalog loader.
- Every active catalog has English key parity, valid ICU arguments, valid plural branches, no raw
  keys, no forbidden claims, and no accidental em dashes in product copy.
- Every route module under the locale tree is represented in the route inventory. Every marketing
  route has metadata, sitemap, hreflang, canonical, and localized navigation coverage.
- Every app/auth/onboarding/consent surface has loading, empty, error, partial-success, offline,
  permission-denied, and rate-limited behavior where that state is possible.
- Locale switching preserves the current path and query, uses endonyms without flags, exposes `lang`
  and `dir`, supports keyboard navigation, and keeps English machine contracts unchanged.
- Retired locale URLs 301 to English, `/en/*` 301s to English, unknown prefixes do not render an
  English page, and query strings survive redirects.
- CLI human output changes with `--locale` and environment precedence; JSON snapshots do not change.
- API docs presentation changes with `?lang` or `Accept-Language`; `/openapi.json` does not change.
- Consent decisions include the nonce, one workspace, exact requested scopes, idempotency key, and
  the hash of the rendered copy. Approval policy and withheld scopes are visible before the action.
- A strict review gate rejects missing translations, missing evidence, missing specialist approvals,
  stale digests, and English fallbacks.

Run focused tests first to preserve resources, then `pnpm verify` sequentially. Do not run every
Vitest project concurrently on a low-disk workspace.

## 8. Definition of done

- All 20 locales are reachable in the web route tree, CLI, API reference, OAuth discovery, emails,
  and settings picker, with beta/reviewed status truthful.
- Every human-visible route and state in the inventory has catalog coverage and a native review row.
- Every public page has localized SEO metadata, truthful structured data, self canonical, reciprocal
  hreflang, sitemap coverage, and a language-appropriate feed where content exists.
- No app/auth/onboarding/consent page is indexable. No retired or unknown locale creates a duplicate
  crawlable page.
- RTL, plural, date/time, number, currency, line-breaking, text expansion, keyboard, and screen
  reader checks pass for representative locales and pseudo locales.
- Machine contracts, stable IDs, provider names, URLs, and error codes remain backward compatible.
- Strict review gates pass for each locale being promoted. If any item is not true, the locale stays
  beta and the launch report names the missing evidence.

This plan intentionally does not add new SEO pages. It improves and localizes the pages that exist,
then uses measured search demand to decide whether another page is worth the maintenance and review
cost.
