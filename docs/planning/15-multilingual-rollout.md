# 15. Multilingual Rollout: 25 Interface Locales, Language Picker, and International SEO

**Status:** implementation plan. Supersedes nothing; extends `07-ai-growth-advisor-and-localization.md`.
**Audience:** the junior engineering team executing this. Read all of section 1 and 2 before writing code.
**Owner:** Localization Lead. **Reviewers:** Web Lead (routing + SEO), Design Lead (picker), Eng Manager (sequencing).
**Compiled:** 6 August 2026, from a direct audit of the repository at commit `81666fe`.

> Read this next to `packages/i18n/README.md`. That README is the authority on *how to translate*.
> This document is the authority on *what to build around it*. Where they disagree, the README wins
> for catalog rules and this document wins for routing, SEO and UI.

---

## 1. What already exists (audited, not assumed)

This is the single most important section. **A large amount of this work is already done.** The most
common way this project fails is a developer rebuilding something that exists, or installing
`next-intl` on top of a hand-rolled system that already works. Do not do either.

### 1.1 What is built and working

`packages/i18n` is a complete, tested internationalization library written for this product. It contains:

| File | What it gives you | Do not rewrite |
| --- | --- | --- |
| `src/locales.ts` (731 lines) | A registry of **32 locale descriptors**, each with `bcp47`, `name`, `endonym`, `script`, `direction`, `pluralCategories`, `weekStartsOn`, `hourCycle`, and a `status` of `'active'` or `'planned'`. Plus `resolveLocale()` (full BCP-47 lookup with truncation and language-level fallback), `parseAcceptLanguage()`, `canonicalizeLocaleTag()` (handles `zh-TW`→`zh-Hant`, `pt`→`pt-BR`, Spanish region→`es-419`), `isRtl()`, `getDirection()`. | ✅ |
| `src/messages/en/` (~4,400 keys across 24 namespace files) | The complete English catalog. `MessageKey` is derived from it, so a typo in a component is a **compile error**. | ✅ |
| `src/messages/index.ts` | `CATALOGS` registry and `loadCatalog(locale)`, already async and code-split-ready. Currently has exactly one entry: `en`. | ✅ |
| `src/translate.ts` | `createTranslator()`. Never throws, never renders a raw key, falls back to English, reports each miss once through a pluggable reporter. | ✅ |
| `src/icu.ts` | ICU message parsing and argument extraction (FormatJS). | ✅ |
| `src/format.ts` (581 lines) | Every `Intl` formatter, all requiring an **explicit** locale and IANA time zone. Dates, times, numbers, currency, percent, lists, relative time, durations, bytes, time-zone labels. | ✅ |
| `src/pseudo.ts` | `en-XA` (accented + 40% expansion) and `en-XB` (bidi mirror) generators for CI. | ✅ |
| `src/lint.ts` (505 lines) | Catalog lint rules: key collisions, English-derived keys, ICU validity, required plural categories per locale, missing `other` case, forbidden words and em dashes, and coverage assertions for every `RelayError` code, publish state, approval state and validation issue code. | ✅ |
| `src/react.tsx` | `I18nProvider`, `useTranslations`, `useI18n`, `Trans`, `useDirectionAttributes`. | ✅ |

`apps/web/src/lib/i18n/` wires that into Next.js:

- `routing.ts` — `LOCALE_COOKIE` (`relay_locale`), `TIME_ZONE_COOKIE`, `negotiateLocale()`, `resolveTimeZone()`, and a `routing` object already declaring `localePrefix: 'as-needed'`.
- `server.ts` — `getStaticIntl()` (for prerendered pages) and `getRequestIntl()` (per-request negotiation), plus `getTranslations(namespace)`.
- `provider.tsx` / `index.ts` — the client boundary.

The design system already uses **CSS logical properties** (`start-4`, `end-3`, `pe-4`, `ps-`) rather
than `left`/`right`, which is why RTL is a realistic goal rather than a rewrite. Keep it that way.

### 1.2 What is not built — the actual work

Everything the product shows a visitor today is English, and there is **no way to reach any other
language**. Concretely:

1. **`ACTIVE_LOCALES` has exactly one member: `en`.** Every other locale is `status: 'planned'`. `negotiateLocale()` deliberately refuses to return an inactive locale, so Accept-Language negotiation is currently a no-op that always returns `en`.
2. **`CATALOGS` has exactly one entry.** There are zero translated catalog files on disk. `loadCatalog('de')` returns the English catalog today.
3. **There is no locale segment in any URL.** `apps/web/src/app/` contains `(app)`, `(auth)`, `(marketing)`, `(onboarding)` — all route groups, none of which appear in a URL. There is no `[locale]` directory anywhere. **This is the single biggest gap, and it is the one with SEO consequences.**
4. **There is no `middleware.ts`.** Nothing redirects, nothing sets a locale cookie, nothing negotiates at the edge.
5. **There is no `sitemap.ts` and no `robots.ts`.** They do not exist anywhere in `apps/web`. The public site currently emits no sitemap and no robots directives at all.
6. **There is no `hreflang` / `alternates.languages` anywhere.** `pageMetadata()` in `apps/web/src/features/marketing/seo.ts` sets a single `alternates: { canonical: url }` and nothing else.
7. **There is no language picker anywhere in the product.** `SiteHeader` (`apps/web/src/features/marketing/components/site-header.tsx`) has brand, nav, sign-in and start-trial — no picker.
8. **The one locale control that exists is disabled.** `apps/web/src/features/settings/localization/localization-screen.tsx` renders a `<Select … disabled>` over `ACTIVE_LOCALES`, which is a one-item list. It also renders `ALL_LOCALES` as *content* locales, which is a different concept (see 1.3) and is correct as-is.
9. **The marketing site is hard-wired to English.** `apps/web/src/features/marketing/i18n.ts` creates one cached translator with `createTranslator(DEFAULT_LOCALE, en)` and memoizes it in a module-level variable. Its `Intl.DateTimeFormat` instances are likewise pinned to `DEFAULT_LOCALE` and `UTC`. All 29 marketing pages read from it.
10. **The root layout is locale-static.** `apps/web/src/app/layout.tsx` calls `getStaticIntl()`, which hardcodes `DEFAULT_LOCALE`. It correctly sets `<html lang>` and `<html dir>` from that, so once the locale becomes real, both attributes follow for free.
11. **`SITE_ORIGIN` defaults to `https://relay.example`.** Set `NEXT_PUBLIC_SITE_ORIGIN` before any SEO work is verifiable.

### 1.3 The three concepts you must never conflate

This trips up every newcomer. The README states it and the settings screen already models it:

| Concept | Where it lives | Example | This plan touches it? |
| --- | --- | --- | --- |
| **Interface locale** | user preference / URL | the app chrome is in Japanese | **Yes. This is the whole project.** |
| **Content language** | per post, per brand | the post is written in Spanish | No. Already built. Leave alone. |
| **Audience market** | per brand, per campaign | the audience is in Mexico | No. Already built. Leave alone. |

A user can run the interface in English, write in Japanese and target Brazil. Never infer one from
another. If you find yourself filtering `contentLocales` by `ACTIVE_LOCALES`, stop — that is the bug.

---

## 2. The 25 locales, and why

We ship 25 of the 32 already in the registry. That means **deleting no metadata** — the seven we do
not ship stay `status: 'planned'`, exactly as they are today.

### 2.1 The list

Ordered by rollout wave (see §6), not by importance.

**Wave 1 — 6 locales.** Largest markets, Latin script, low structural risk. These prove the pipeline.

| # | Tag | Language | Dir | Plural cases | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | `en` | English | ltr | one, other | Source. Already active. |
| 2 | `es` | Spanish (Spain) | ltr | one, many, other | 2nd-largest web language; Spain is a distinct SaaS market from LatAm. |
| 3 | `es-419` | Spanish (Latin America) | ltr | one, many, other | Mexico/Colombia/Argentina are top-5 social-media-penetration markets. `canonicalizeLocaleTag` already routes 21 regions here. |
| 4 | `pt-BR` | Portuguese (Brazil) | ltr | one, many, other | Brazil is a top-3 market by social media time-per-user globally. |
| 5 | `fr` | French | ltr | one, many, other | France + Canada + francophone Africa. |
| 6 | `de` | German | ltr | one, other | Highest B2B SaaS willingness-to-pay in the EU. Also the **worst-case string expansion** — see §7.3. |

**Wave 2 — 7 locales.** European long tail plus Turkey. Latin script, so no font or shaping work.

| # | Tag | Language | Dir | Plural cases | Why |
| --- | --- | --- | --- | --- | --- |
| 7 | `it` | Italian | ltr | one, many, other | Large SMB/agency segment. |
| 8 | `nl` | Dutch | ltr | one, other | Very high digital ad spend per capita; strong agency market. |
| 9 | `pl` | Polish | ltr | one, **few**, many, other | Largest CEE market. First locale with a `few` category — a real plural test. |
| 10 | `cs` | Czech | ltr | one, few, many, other | CEE coverage; shares the Polish plural shape. |
| 11 | `sv` | Swedish | ltr | one, other | Nordic anchor. We ship **one** Nordic locale; see §2.2. |
| 12 | `tr` | Turkish | ltr | one, other | Top-10 country by social media users. Also the **dotted-i casing trap** — see §7.5. |
| 13 | `ru` | Russian | ltr | one, few, many, other | First Cyrillic locale; large Russian-speaking diaspora across CIS. |

**Wave 3 — 4 locales.** RTL and Indic. Highest engineering risk. Do not start before Wave 1 ships clean.

| # | Tag | Language | Dir | Plural cases | Why |
| --- | --- | --- | --- | --- | --- |
| 14 | `uk` | Ukrainian | ltr | one, few, many, other | Cyrillic; deliberately shipped as its own locale, never folded into `ru`. |
| 15 | `ar` | Arabic | **rtl** | **all six** | Largest RTL market. Exercises every plural category the runtime has. `weekStartsOn: 6`. |
| 16 | `he` | Hebrew | **rtl** | one, **two**, other | Second RTL locale; catches RTL work that was special-cased to Arabic. Has a `two` category. |
| 17 | `hi` | Hindi | ltr | one, other | Largest Indian market; Devanagari script (line-height and font-fallback work). |

**Wave 4 — 8 locales.** APAC. CJK line-breaking, no-plural languages, and a script-variant pair.

| # | Tag | Language | Dir | Plural cases | Why |
| --- | --- | --- | --- | --- | --- |
| 18 | `id` | Indonesian | ltr | **other only** | Top-5 country by social media users. First no-plural locale. |
| 19 | `vi` | Vietnamese | ltr | other only | Fast-growing creator economy; Latin script with heavy diacritics. |
| 20 | `th` | Thai | ltr | other only | No inter-word spaces — a real line-breaking test. |
| 21 | `fil` | Filipino | ltr | one, other | Highest social-media-hours-per-day in the world. `tl` already aliases here. |
| 22 | `zh-Hans` | Chinese (Simplified) | ltr | other only | Largest single language market. `zh`, `zh-CN`, `zh-SG` already alias here. |
| 23 | `zh-Hant` | Chinese (Traditional) | ltr | other only | Taiwan + Hong Kong. **Not** a font switch on `zh-Hans`; different vocabulary. `zh-TW`, `zh-HK`, `zh-MO` alias here. |
| 24 | `ja` | Japanese | ltr | other only | Top-3 SaaS spend globally. |
| 25 | `ko` | Korean | ltr | other only | Dense creator/agency market. |

### 2.2 The seven we do not ship, and why

They stay in the registry as `planned`. Removing them would break `canonicalizeLocaleTag` aliases and
the content-language picker, which legitimately offers all 32.

| Tag | Language | Why not in the 25 |
| --- | --- | --- |
| `pt-PT` | Portuguese (Portugal) | `pt-BR` is intelligible in Portugal and is 20× the market. Shipping both doubles review cost for a rounding error in reach. `canonicalizeLocaleTag` currently sends bare `pt` → `pt-BR`. |
| `nb` | Norwegian Bokmål | Norway, Denmark and Finland have among the highest English proficiency in the world **and** small populations. We ship `sv` as the Nordic signal and revisit if Nordic sign-ups justify three more review budgets. |
| `da` | Danish | As above. |
| `fi` | Finnish | As above. Note `fi` is the other string-expansion worst case; keep it in `en-XA` testing even though we do not ship it. |
| `ms` | Malay | Highly intelligible with `id`, which we do ship, and one-tenth the users. |
| `bn` | Bengali | Very large population, very low SaaS monetization for a paid publishing tool. Revisit with data, not intuition. |
| `ur` | Urdu | Same monetization argument as `bn`, and RTL review budget in Wave 3 is already committed to `ar` and `he`. |

**If a stakeholder wants a swap, the swap is a one-line status change plus one catalog.** That is the
point of the architecture. Do not treat this list as sacred; treat it as the default.

---

## 3. Architecture decisions (already made — do not relitigate)

These were decided by the existing code. A junior developer overturning one of these will cause days
of rework, so each is stated with its reason.

**D1. No new i18n library.** No `next-intl`, no `react-i18next`, no `lingui`. `packages/i18n` already
does everything those do and is typed against our own catalog. Adding one means two translators, two
ICU runtimes and two fallback policies.

**D2. Locale lives in the URL path, as a prefix, `as-needed`.** `routing.ts` already declares
`localePrefix: 'as-needed'`. English is served at `/pricing`; German at `/de/pricing`. No subdomains,
no ccTLDs, no query parameters, no cookie-only switching.
*Why:* a crawler must be able to reach every localized page by following a link. A cookie-only or
`Accept-Language`-only switch is invisible to Googlebot, which crawls from the US with
`Accept-Language: en`. You would ship 25 languages and rank in one. This is the entire SEO story.

**D3. No prefix for English, ever.** `/pricing` stays `/pricing`. It has existing links and rankings.
`/en/pricing` must **301** to `/pricing`.

**D4. Never auto-redirect a visitor based on `Accept-Language` alone.** A visitor who asks for
`/de/pricing` gets `/de/pricing`, full stop. Middleware may negotiate only for the bare root `/` and
only on a first visit with no locale cookie, and even then Google's guidance and our own preference is
to **suggest, not redirect**. Auto-redirecting is how you get a German-only index: Googlebot requests
`/pricing` and gets bounced to `/de/pricing`, so `/pricing` never gets indexed.

**D5. `x-default` points at the English URL.** It is the unprefixed one.

**D6. The signed-in product (`(app)`, `(auth)`, `(onboarding)`) is `noindex` and does not need a
locale prefix for SEO** — but it gets one anyway, for a different reason: a shareable URL should
reproduce the sender's language, and per-request negotiation forces every route out of static
rendering. One mechanism for the whole app is simpler than two.

**D7. Catalogs are lazily imported per locale.** `CATALOGS` is already `Record<string, () => Promise<PartialCatalog>>`.
A visitor downloads one catalog, never 25. Never `import` a non-English catalog at module top level.

**D8. Machine translation is allowed for the first pass; claiming it is reviewed is not.** The README
defines the eight conditions for "human reviewed". Until all eight hold, the locale is labelled
**beta** in the picker. This is a product requirement, not a nicety.

**D9. A locale flips to `active` only when its catalog is complete and lint-clean.** Missing keys fall
back to English *silently* by design — which is a good runtime behaviour and a terrible release
criterion. Gate on lint, not on eyeballs.

**D10. Never use a flag for a language.** Flags are countries. Spanish is not Spain, English is not
the United States, and Arabic is not any one flag. Use the endonym. `LocaleDescriptor.endonym` exists
for exactly this.

---

## 4. Workstream A — Locale routing

**Goal:** every page is reachable at `/{locale}/path`, English stays unprefixed, and nothing renders
in the wrong language.

### A1. Introduce the `[locale]` segment

Move the four route groups under a dynamic segment:

```
apps/web/src/app/
  layout.tsx                 ← stays: <html>, fonts, theme bootstrap
  [locale]/
    layout.tsx               ← new: resolves the locale, mounts IntlProvider
    (marketing)/…            ← moved
    (app)/…                  ← moved
    (auth)/…                 ← moved
    (onboarding)/…           ← moved
    not-found.tsx
  sitemap.ts                 ← new (Workstream C)
  robots.ts                  ← new (Workstream C)
```

Use `git mv` so history survives. Every relative import inside those trees must be re-checked; the
repo standard is **extensionless relative imports** (see commit `a8df6bb`) and `@/` aliases, so most
will not move, but run `pnpm typecheck` after the move and before anything else.

`<html lang>` and `<html dir>` must be set from the resolved locale. Today the root layout does that
from `getStaticIntl()`. Next.js does not let a nested layout write `<html>` attributes, so the root
layout must learn the locale. Two acceptable options, pick one and write it down in the PR:

- **A1a (preferred):** keep `<html>` in the root layout and read the locale from the pathname via
  middleware-injected header (`x-relay-locale`). Cheap, keeps the root layout static-friendly.
- **A1b:** move `<html>`/`<body>` into `app/[locale]/layout.tsx` and reduce the root layout to a
  pass-through. Simpler to reason about, but every route must then live under `[locale]`.

### A2. `generateStaticParams`

Every statically renderable segment exports:

```ts
export function generateStaticParams() {
  return ACTIVE_LOCALE_CODES.map((locale) => ({ locale }));
}
```

Import `ACTIVE_LOCALE_CODES` from `@relay/i18n`. **Never hardcode a locale array in a route file.**
The registry is the single source of truth; if you copy the list, the 26th locale will be a bug hunt.

### A3. Validate the segment

An unknown `params.locale` must `notFound()`, not fall back to English. `/xx/pricing` returning the
English homepage creates infinite crawlable garbage URLs. Use `isActiveLocale()` from `@relay/i18n`.

Note the **`as-needed` collision**: with English unprefixed, `/pricing` and `/de` are both a single
path segment. The `[locale]` segment will greedily match `pricing`. Resolve it in middleware:

- If segment 1 is an active non-default locale → rewrite to `/[locale]/...` as-is.
- If segment 1 is `en` → **301** to the path with `/en` stripped (D3).
- Otherwise → rewrite `/(.*)` to `/en/$1` internally, so the URL stays clean but the segment resolves.

### A4. `middleware.ts`

Create `apps/web/src/middleware.ts`. Its entire job:

1. Skip `/_next`, `/api`, and anything with a file extension (`config.matcher`).
2. Determine the locale from the first path segment; if absent, `en`.
3. Apply the rewrite/redirect rules in A3.
4. Set `x-relay-locale` on the request headers for A1a.
5. On a response for a path that *had* an explicit locale prefix, set the `relay_locale` cookie
   (`LOCALE_COOKIE`, already exported from `routing.ts`) so the choice sticks. Cookie attributes:
   `Path=/`, `SameSite=Lax`, `Max-Age=31536000`, **not** `HttpOnly` (the picker reads it).
6. **Do not redirect on `Accept-Language` (D4).**

Keep middleware small and allocation-free. It runs on every request.

### A5. Update `negotiateLocale`

`routing.ts` currently negotiates cookie → `Accept-Language` → default. That stays, but its role
narrows: with a locale in the URL, the URL always wins. Negotiation is now only for the bare `/` and
for choosing which locale to *suggest*. Update the doc comment; a stale comment here will mislead the
next person.

### A6. Locale-aware links

Every internal `<Link href>` must carry the current locale. Add one helper — `localizedHref(path, locale)`
in `apps/web/src/lib/i18n/routing.ts` — returning `path` for `en` and `/${locale}${path}` otherwise.
Then either wrap `next/link` once in `@/components/link` and use it everywhere, or apply the helper at
each call site. **Prefer the wrapper.** 29 marketing pages plus the app shell is too many call sites
to police by review.

Add an ESLint rule (or a `no-restricted-imports` entry) banning raw `next/link` outside that wrapper.

---

## 5. Workstream B — Catalogs and translation

### B1. Fix the marketing translator first

`apps/web/src/features/marketing/i18n.ts` memoizes one English translator in a module-level `cached`
variable. That is a correctness bug the moment a second locale exists — under a warm serverless
instance, a German request would get the cached English translator.

Rewrite it as `marketingTranslator(locale: string)` with a `Map<string, Translator>` cache, and make
`formatDate` / `formatDateTime` take a locale too. This touches all 29 marketing pages. **Do this in
its own PR, before any catalog lands**, so the diff is mechanical and reviewable.

### B2. Extract and freeze the source catalog

Run `messageKeys()` from `@relay/i18n` to get the exact key count (~4,400 across 24 namespace files).
Publish that number in the PR. Then **freeze English** for the duration of a translation batch: a key
added mid-batch is a key that arrives untranslated in 24 catalogs.

Practical rule: English catalog changes are allowed, but any PR adding an English key must add it to
`docs/planning/i18n-pending-keys.md` so the next batch picks it up.

### B3. Translation pipeline per locale

For each locale, in this order:

1. `cp -r packages/i18n/src/messages/en packages/i18n/src/messages/<code>` (note: `es-419`, `pt-BR`,
   `zh-Hans` and `zh-Hant` are valid directory names; keep the exact registry casing).
2. Rename the exported const in each file and in `index.ts` (`en` → `de`, etc.).
3. Machine-translate **values only**. Never touch a key, an ICU argument name, or a plural keyword.
4. **Rewrite plural blocks for the target language.** Do not copy the English `one`/`other` shape.
   `de` needs one/other. `pl`, `cs`, `ru`, `uk` need one/few/many/other. `ar` needs all six.
   `id`, `vi`, `th`, `zh-*`, `ja`, `ko` need only `other`. `he` needs one/two/other.
   The registry's `pluralCategories` field is your checklist; lint enforces it.
5. Register the loader in `packages/i18n/src/messages/index.ts`:
   ```ts
   de: async () => (await import('./de/index')).de,
   ```
6. Run `pnpm --filter @relay/i18n test` — catalog lint runs there.
7. **Only then** flip `status: 'planned'` → `'active'` in `locales.ts`.

### B4. Glossary before translation, not after

Before a single catalog is machine-translated, produce `packages/i18n/GLOSSARY.md` listing terms that
must **not** be translated (product nouns: Relay, Composer, Growth Advisor, Action Center, Brand,
Workspace, and every connector name: X, LinkedIn, Instagram, TikTok, …) and terms with one mandated
translation per language (post, draft, schedule, publish, approve, connection). Feed it to the machine
translator as a constraint and to every human reviewer as a checklist. Inconsistent terminology is the
number one complaint about machine-translated SaaS.

### B5. Legal, billing and consent copy is not machine-translated

Per the README's condition 3: billing amounts, trial terms, consent text, disclosures and the media
generation boundary paragraph state legal and commercial facts. These namespaces
(`billing`, `web-marketing` legal sections, `settings` data/privacy) get human translation from the
start, or they stay in English with an explicit English-fallback note. Decide per locale with Legal.
Do not let a junior developer make this call alone.

### B6. Beta labelling

Add a `reviewStatus: 'beta' | 'reviewed'` field to `LocaleDescriptor`. Every locale ships `beta` and
is promoted only when all eight README conditions hold, with the reviewer named and dated in the PR.
The picker renders the beta badge from this field (§6.4). This is a small change with large honesty
value — do it in the same PR as the first non-English catalog, not later.

---

## 6. Workstream C — International SEO

Nothing in this workstream is optional. Locale routing without these is 25 languages that no one finds.

### C1. `hreflang` on every public page

Extend `pageMetadata()` in `apps/web/src/features/marketing/seo.ts` to take the current locale and
emit the full alternates block:

```ts
alternates: {
  canonical: absoluteUrl(path, locale),
  languages: {
    ...Object.fromEntries(ACTIVE_LOCALE_CODES.map((l) => [l, absoluteUrl(path, l)])),
    'x-default': absoluteUrl(path, DEFAULT_LOCALE),
  },
},
```

Rules that get this wrong in practice, so verify each one:

- **`hreflang` must be reciprocal.** If `/de/pricing` points at `/fr/pricing`, then `/fr/pricing` must
  point back. Generating the full set from `ACTIVE_LOCALE_CODES` on every page gives you this by
  construction — which is exactly why you must not hand-maintain per-page lists.
- **Self-referential entry required.** The German page lists German among its own alternates.
- **Absolute URLs only.** Relative `hreflang` is ignored.
- **Canonical is self-referential per locale.** `/de/pricing` canonicalizes to `/de/pricing`, never to
  `/pricing`. Cross-language canonicals delete 24 languages from the index. This is the most common
  and most damaging mistake in this entire document.
- **Only `active` locales appear.** A `planned` locale in `hreflang` points at a 404.
- **`es-419` is a valid `hreflang` value**, as is `zh-Hans` / `zh-Hant`. Do not "simplify" them to
  `es` / `zh`; you would collide with the `es` entry and lose the script distinction.

### C2. `sitemap.ts` — this file does not exist yet

Create `apps/web/src/app/sitemap.ts`. Next's `MetadataRoute.Sitemap` supports per-entry `alternates.languages`,
which is the correct shape: **one `<url>` entry per page, with `xhtml:link` alternates**, not 25
separate entries per page.

Source the route list from `apps/web/src/features/marketing/site.ts` (`ROUTES` and `PRIMARY_NAV`
already exist) rather than a new hardcoded array. There are 29 marketing pages; a hand-written list
will drift within a month.

Exclude `(app)`, `(auth)` and `(onboarding)` entirely.

### C3. `robots.ts` — this file does not exist yet

Create `apps/web/src/app/robots.ts`:
- `allow: '/'` for the marketing tree.
- `disallow` the signed-in paths and any locale-prefixed variant of them.
- `sitemap: new URL('/sitemap.xml', SITE_ORIGIN).toString()`.

Also add `robots: { index: false, follow: false }` to the metadata of the `(app)`, `(auth)` and
`(onboarding)` layouts. Belt and braces: `robots.txt` prevents crawling, the meta tag prevents indexing,
and they solve different problems.

### C4. Set `NEXT_PUBLIC_SITE_ORIGIN`

`SITE_ORIGIN` falls back to `https://relay.example`. Every canonical, every `hreflang`, every JSON-LD
`url` and the sitemap all derive from it. Set it per environment before anyone tries to verify C1–C3,
or you will spend an afternoon debugging correct code.

### C5. Localize structured data

`organizationJsonLd()`, `offerJsonLd()`, `faqJsonLd()` and `breadcrumbJsonLd()` all call
`marketingTranslator()` with no argument. After B1 they take a locale. Additionally:

- Add `inLanguage` to the `SoftwareApplication` and `FAQPage` nodes.
- `priceCurrency` stays `USD` unless Billing actually charges in another currency. **Do not localize a
  price you do not charge.** The existing comment in `seo.ts` about not inventing `aggregateRating`
  reflects the standard here: mark up only what is true and checkable.

### C6. Localize OpenGraph

`pageMetadata()` already sets `openGraph`. Add `locale: <current>` and `alternateLocale: <the others>`.
OG locales use underscores (`de_DE`), not hyphens — write one converter, test it, and note that
`es-419` has no clean OG equivalent (use `es_ES` or omit).

### C7. Translated URL slugs — explicitly out of scope for V1

`/de/preise` instead of `/de/pricing` is a real ranking benefit and a large amount of routing
machinery (a per-locale slug map, plus permanent redirects forever). **Not in V1.** Record it in
`docs/planning/13-risk-register-and-open-decisions.md` as an open decision so it is a choice, not an
oversight.

### C8. Verification checklist (run before claiming SEO works)

1. `curl -s https://<host>/de/pricing | grep hreflang` — 26 entries (25 locales + `x-default`).
2. Same page: exactly one `<link rel="canonical">`, pointing at itself.
3. `curl -s https://<host>/sitemap.xml` — every marketing page once, each with alternates.
4. `curl -s -H 'Accept-Language: de' https://<host>/pricing -o /dev/null -w '%{http_code}'` → **200**, not 302.
5. `curl -s -o /dev/null -w '%{http_code}' https://<host>/en/pricing` → **301** to `/pricing`.
6. `/xx/pricing` → **404**.
7. Google Rich Results Test on `/de/pricing` — structured data valid, no rating markup.
8. Google Search Console → International Targeting → zero `hreflang` errors. This is the only test
   that catches non-reciprocal tags at scale; check it a week after launch, not on launch day.

---

## 7. Workstream D — The language picker

**Goal:** a picker in the navbar that is genuinely good — fast, accessible, keyboard-driven, and
correct in RTL — not a `<select>` with 25 flags in it.

### D1. Where it goes

- **Marketing navbar** (`site-header.tsx`): between the nav list and the sign-in link on desktop;
  inside the `<details>` disclosure on mobile. This is the one visitors and crawlers see.
- **App shell**: not in the top bar. Signed-in users set their language in
  Settings → Localization, which already exists — just enable the disabled `<Select>` (§D6).
  Two competing controls that write the same preference is a sync bug waiting to happen.

### D2. Behaviour

- Trigger shows the **current locale's endonym** (`日本語`, `Deutsch`), plus a globe icon. No flags (D10).
- Opening reveals all 25, each rendered as **endonym (primary) + English name (secondary)**. Both
  fields already exist on `LocaleDescriptor`. Someone lost in a language they cannot read needs the
  English name to escape; someone who reads the language wants their own name for it.
- Selecting a locale navigates to **the same page in that locale** — `localizedHref(currentPath, next)` —
  and sets `relay_locale`. Never send the user to the homepage. Losing your place is the single most
  common language-picker failure.
- Each option is a real `<a href>`. Crawlers must follow them, and middle-click and open-in-new-tab
  must work. It is a navigation, not a state toggle.
- Beta locales carry a small `beta` badge from `reviewStatus` (§B6).
- Above ~12 entries, include a filter input. 25 is past that line. Filter must match **both** the
  endonym and the English name, and be diacritic-insensitive (`Espanol` finds `Español` — use
  `String.prototype.normalize('NFD')` and strip combining marks).

### D3. Accessibility — non-negotiable

- Build it from the design system's existing menu/select primitive rather than a new popover. Check
  `packages/design-system` first; `Select` already exists and is used in the localization screen.
- Trigger: `aria-haspopup`, `aria-expanded`, and an `aria-label` from the catalog (add
  `a11y.languagePicker.label` if it is not already a key — check before adding).
- Full keyboard support: `Enter`/`Space` opens, `↑`/`↓` moves, type-ahead jumps, `Esc` closes and
  restores focus to the trigger, `Tab` closes.
- Each option gets `lang={locale.bcp47}` and `dir={locale.direction}` so a screen reader pronounces
  `日本語` in Japanese and renders `العربية` right-to-left inside an LTR menu.
- The current locale gets `aria-current="true"`.
- Announce the change politely after navigation — do not trap focus.

### D4. It must not break the static marketing site

`(marketing)/layout.tsx` exports `dynamic = 'force-static'` and the comment explains why: these pages
are the same bytes for everyone and must be CDN-cacheable. `SiteHeader` is already the only client
component there, and the reason is documented.

**The picker must not change that.** It receives its data as props computed on the server (the locale
list is static per build) and the current path from `usePathname()`, which `SiteHeader` already calls.
No `cookies()`, no `headers()`, no fetch. If you find yourself making the marketing layout dynamic to
render a language picker, stop and re-read this paragraph.

### D5. RTL

The header uses logical properties already (`start-`, `end-`, `pe-`). The picker must too. Verify in
`en-XB` (bidi pseudo-locale, already built) before verifying in Arabic — pseudo-locale failures are
faster to diagnose because you can still read the text.

### D6. Enable the settings control

In `localization-screen.tsx`, remove `disabled` from the interface-locale `<Select>` and wire it to
persist the preference (workspace/user setting + `relay_locale` cookie) and navigate to the same path
in the new locale. Leave the **content locales** checkbox list exactly as it is — it correctly offers
all 32 `ALL_LOCALES`, because content language is not interface language (§1.3).

---

## 8. Workstream E — Quality gates

### E1. CI additions

| Check | Command | Fails when |
| --- | --- | --- |
| Catalog lint, all active locales | `pnpm --filter @relay/i18n test` | Any rule in `lint.ts` fires |
| Key parity | new test: every active catalog's key set ⊇ a defined threshold | A catalog silently regresses |
| No English literals in components | existing repo lint rule (see README "What not to do") | A raw string reaches a JSX text node |
| `hreflang` reciprocity | new test over `pageMetadata()` output for every route × locale | Any non-reciprocal or missing self-reference |
| Sitemap completeness | new test: every route in `ROUTES` appears once | A page is added without a sitemap entry |
| `generateStaticParams` uses the registry | lint rule / grep for hardcoded locale arrays | Someone copies the list |

### E2. Pseudo-locale testing — use what is already built

`packages/i18n/src/pseudo.ts` gives you `en-XA` and `en-XB` for free. Wire them behind a dev-only flag
and require, per the README:

- **`en-XA`** (accented, +40% length): no clipping, no unreadable wrap, no control pushed off screen,
  at 360 / 768 / 1440 px, in light and dark. German and Finnish are the real-world worst cases; a
  screen surviving `en-XA` usually survives them.
- **`en-XB`** (bidi): layout mirrors via logical properties, **not** via a manual override. Media
  controls, timelines, progress bars and platform logos must **not** mirror. Numbers, times, URLs and
  handles stay readable inside mirrored text. Keyboard order follows visual order.

### E3. Manual review gate per locale

The eight conditions in `packages/i18n/README.md` §"Beta versus human reviewed". Do not restate them
here and let the two drift — link to them, apply them, and name the reviewer and date in the PR.

---

## 9. Sequencing and estimates

Waves are gated: **do not start wave N+1 until wave N is verified in production.** The purpose of
Wave 1 is to find the routing and SEO bugs on 5 locales instead of 24.

| Phase | Contents | Depends on | Rough size |
| --- | --- | --- | --- |
| **P0** | Set `NEXT_PUBLIC_SITE_ORIGIN`. Write `GLOSSARY.md`. Add `reviewStatus` to `LocaleDescriptor`. Freeze English. | — | 1–2 days |
| **P1** | Workstream A: `[locale]` segment, middleware, `generateStaticParams`, `localizedHref` + link wrapper. **Still English only.** Ship it. Verify nothing regressed. | P0 | 4–6 days |
| **P2** | B1 (marketing translator takes a locale) + C1–C6 (hreflang, sitemap, robots, JSON-LD, OG). Still English only, but the SEO plumbing is live and testable with one locale. | P1 | 3–5 days |
| **P3** | Workstream D: the picker, plus D6. Renders with one locale; looks trivial; is the right time to build it. | P1 | 3–4 days |
| **P4** | **Wave 1 catalogs** (`es`, `es-419`, `pt-BR`, `fr`, `de`). Flip to active. Run C8 end to end. | P2, P3 | 5–8 days |
| **P5** | Wave 2 (`it`, `nl`, `pl`, `cs`, `sv`, `tr`, `ru`) — first `few`/`many` plurals. | P4 verified live | 5–7 days |
| **P6** | Wave 3 (`uk`, `ar`, `he`, `hi`) — **RTL**. Budget separately; this is not a catalog exercise. | P5 | 6–10 days |
| **P7** | Wave 4 (`id`, `vi`, `th`, `fil`, `zh-Hans`, `zh-Hant`, `ja`, `ko`) — CJK line breaking, no-plural locales. | P6 | 6–9 days |
| **P8** | Human review passes; promote locales from `beta` to `reviewed` individually as reviewers sign off. | ongoing | ongoing |

P1–P3 are largely parallelizable across three people; the catalog waves are parallelizable per locale.

---

## 10. The traps that will actually bite you

Read this list once before you start and once during code review.

1. **Cross-language canonical.** `/de/pricing` canonicalizing to `/pricing` removes German from the
   index. Every localized page canonicalizes to itself. (§C1)
2. **Auto-redirect on `Accept-Language`.** Googlebot crawls with `en` from the US; redirect it and the
   other 24 languages are never crawled. (§D4 in decisions, §A4)
3. **Non-reciprocal `hreflang`.** Google discards the whole cluster. Generate from the registry. (§C1)
4. **Hardcoding the locale list** in `generateStaticParams`, the sitemap, the picker or middleware.
   Import `ACTIVE_LOCALE_CODES`. Every copy is a future bug. (§A2)
5. **Flipping `status: 'active'` before the catalog is complete.** Missing keys fall back to English
   silently — the locale looks half-translated to users and lint never runs. Flip last. (§B3, D9)
6. **The memoized marketing translator.** `let cached: Translator | null` in
   `features/marketing/i18n.ts` will serve English to a German request on a warm instance. Fix in B1.
7. **Copying English plural blocks.** `de` does not need `many`. `pl` does. `ar` needs six. `ja` needs
   one. `pluralCategories` in the registry is the checklist. (§B3.4)
8. **Turkish casing.** `'I'.toLowerCase()` is `'ı'` in Turkish. Any `toLowerCase()`/`toUpperCase()` on
   user-facing or comparison strings must use `toLocaleLowerCase('en')` explicitly for identifiers, or
   the correct locale for display. Grep for both before shipping `tr`.
9. **Sorting with `<`.** Use `Intl.Collator` for any sorted list of translated strings. `packages/i18n`
   does not currently export a collator — add one to `format.ts` rather than inlining `Intl.Collator`
   in a component.
10. **Flags for languages.** No. (D10)
11. **Making the marketing site dynamic.** `force-static` is deliberate and documented. (§D4)
12. **Concatenating translated fragments.** One sentence is one key. The README is emphatic; ICU
    `select`/`plural` inside a single message is the answer.
13. **Formatting a date without an explicit IANA zone.** Every formatter in `format.ts` requires one.
    A schedule shown in the wrong zone is a publishing incident, not a cosmetic bug.
14. **Losing the user's page on language switch.** Switch in place. (§D2)
15. **`/xx/anything` rendering English instead of 404.** Infinite crawlable garbage. (§A3)
16. **Bundling all 25 catalogs.** `CATALOGS` values are async loaders for a reason. Never top-level
    import a non-English catalog. (D7)

---

## 11. Definition of done

The project is complete when **all** of these are true:

- [ ] 25 locales have `status: 'active'` in `locales.ts` and a registered loader in `CATALOGS`.
- [ ] `pnpm --filter @relay/i18n test` passes with zero findings across all 25.
- [ ] Every marketing page resolves at `/{locale}/{path}` for all 24 non-English locales, and at
      `/{path}` for English.
- [ ] `/en/*` 301s to `/*`. `/xx/*` 404s.
- [ ] Every public page emits 26 `hreflang` entries and a self-referential canonical; reciprocity
      verified by a CI test.
- [ ] `sitemap.xml` and `robots.txt` exist, are correct, and are referenced from each other.
- [ ] Search Console International Targeting reports zero `hreflang` errors, one week post-launch.
- [ ] The navbar picker lists 25 endonyms, is keyboard operable, sets `lang`/`dir` per option, has no
      flags, switches in place, and does not make the marketing site dynamic.
- [ ] Settings → Localization interface-locale select is enabled and persists.
- [ ] `en-XA` shows no clipping at 360 / 768 / 1440 px in light and dark.
- [ ] `en-XB` and Arabic mirror correctly; logos, media controls and progress do not mirror.
- [ ] Every locale is labelled `beta` in the picker until its eight README conditions are signed off,
      with a named reviewer and a date in the PR.
- [ ] No hardcoded locale array exists anywhere outside `packages/i18n/src/locales.ts`.

---

## 12. Parallel-agent execution prompt

See `docs/planning/15a-multilingual-agent-prompt.md`. It is written to be pasted verbatim.

---

## 13. Locale review promotion (C6)

**Added 10 August 2026.** Section 11 already required "a named reviewer and a date in the PR". That is a
process promise, and a process promise is not a gate. This section replaces it with a mechanical one and
records the honest state of the fifteen-language promise.

### 13.1 Where review status now comes from

`LocaleDescriptor.reviewStatus` is no longer a literal. It is derived, at module evaluation, from
`packages/i18n/src/reviews.ts`:

| File | Role |
| --- | --- |
| `src/reviews.ts` | The data. One `LocaleReview` per promoted locale: `locale`, `reviewer`, `reviewedOn`, and an optional `identicalToEnglish` acknowledgement list. Imports nothing, because `locales.ts` reads it at evaluation time. |
| `src/locales.ts` | Derives `reviewStatus` through `reviewStatusFor()`. There is no other way to set it. Also exports `REVIEWED_LOCALES`, `REVIEWED_LOCALE_CODE_LIST` and `isReviewedLocale()`. |
| `src/review-gate.ts` | The gate. Pure functions over a catalog, a reference catalog and a review record. Nothing in the product calls it. |
| `src/review-gate.test.ts` | Runs the gate over every entry in `LOCALE_REVIEWS` in CI, plus unit tests for each rule. |

The language picker already badges `reviewStatus === 'beta'`, so flipping the data flips the interface.
Nothing else has to change.

### 13.2 The gate

A locale may appear in `LOCALE_REVIEWS` only if all of the following hold. Each is a distinct failure
rule, so a failing build names the actual problem rather than saying "review invalid".

1. `unknown-locale` / `inactive-locale` — the tag is in the registry and its `status` is `active`.
2. `reviewer-missing` — `reviewer` names a person. "TBD", "pending", "the team", "Localization Lead"
   and anything without a letter are rejected by name.
3. `review-date-invalid` / `review-date-in-future` — `reviewedOn` is a real ISO `YYYY-MM-DD` date, not
   after today.
4. `catalog-incomplete` — every English key that is not on the B5 beta-fallback list has a translation.
5. `catalog-lint-error` — the catalog passes `lintCatalog` against the English reference, including
   argument parity, plural categories for that locale, and the forbidden-word and em-dash rules.
6. `untranslated-english` — no message repeats the English source verbatim unless the reviewer listed
   that key in `identicalToEnglish`. Messages with no translatable text, such as `{weekday}, {date}`,
   are correctly not counted.
7. `stale-sign-off` — every key in `identicalToEnglish` still matches English, so the acknowledgement
   list cannot rot into a blanket exemption.
8. `duplicate-review` — one signature per locale.

### 13.3 The honest state, 10 August 2026

The founder named fifteen locales as the public promise: `en`, `es`, `pt-BR`, `fr`, `de`, `it`, `nl`,
`pl`, `tr`, `id`, `ar`, `hi`, `ja`, `ko`, `zh-Hans`. They are recorded as
`REVIEW_PROMISE_LOCALE_CODES`, which is a target and grants no badge.

**Locales that reached `reviewed` today: zero.** Two separate reasons, and both are real:

1. **No named human reviewer exists for any locale.** Naming one is a founder decision, not an
   engineering one. Writing a plausible name into `reviews.ts` would make the badge a lie in fifteen
   languages at once, so `LOCALE_REVIEWS` is empty.
2. **Every one of the fifteen still contains English pass-through strings**, so even with a name they
   would need either a translation pass or an explicit acknowledgement list. Measured on
   10 August 2026, counting only keys that are not on the B5 fallback list and whose English source has
   translatable words:

   | Locale | Pass-through | Locale | Pass-through | Locale | Pass-through |
   | --- | --- | --- | --- | --- | --- |
   | `tr` | 44 | `it` | 77 | `nl` | 118 |
   | `ar` | 50 | `zh-Hans` | 90 | `fr` | 142 |
   | `ja` | 59 | `pt-BR` | 99 | `es` | 168 |
   | `ko` | 62 | `de` | 117 | `id` | 210 |
   | `pl` | 67 | | | `hi` | 380 |

   Reproduce with `findEnglishPassThroughKeys` from `src/review-gate.ts`.

   Many are legitimate: proper nouns, ISO codes, loanwords, single words that are the same in both
   languages. Some are not. `ja` repeats three complete English sentences from the OAuth connection
   flow (`connection.oauth.connectSelected`, `.claimComplete`, `.accountUnavailable`); most of the 380
   in `hi` are whole sentences, including the entire composer adaptation vocabulary. Telling those two
   cases apart is exactly the work a review is, which is why the gate demands a person rather than a
   threshold.

   What *is* true of all fifteen today, and asserted by `review-gate.test.ts`: every catalog is
   **complete** (zero missing non-fallback keys) and **lint clean** (zero lint errors).

### 13.4 Promoting a locale

1. A person reads the catalog against the checklist in `packages/i18n/README.md`.
2. They fix, or explicitly acknowledge, every key `findEnglishPassThroughKeys` reports for that locale.
3. They add one object to `LOCALE_REVIEWS`:

   ```ts
   { locale: 'de', reviewer: 'Ada Kessler', reviewedOn: '2026-08-14' },
   ```

4. `pnpm --filter @relay/i18n test` re-runs the whole gate against the catalog on disk. If it passes,
   the picker drops the beta badge for that locale on the next deploy. If it does not, the failure names
   the keys.

That is the entire promotion. One line, one CI gate, no judgement call in a pull request description.

### 13.5 Metadata sweep

`apps/web/src/features/marketing/locale-metadata-sweep.test.ts` asserts, for every promise locale
across ten key marketing routes: the document `lang` and `dir` the root layout will emit, a
self-referencing canonical, a complete reciprocal hreflang cluster including `x-default`, and a title
and description that are not the English fallback. It also asserts that every reviewed locale is inside
the swept set, so a promotion cannot route around it. The sweep deliberately runs over the promise
rather than only the reviewed set: a vacuous pass on an empty set would tell nobody anything.

Pricing, legal, blog and free-tool routes are excluded from the "not the English fallback" assertion,
because their copy is on the B5 English fallback list by policy. Asserting a translated title there
would assert the opposite of what the project decided.
