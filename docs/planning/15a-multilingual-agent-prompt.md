# 15a. Parallel Sub-Agent Execution Prompt

Paste the block for the phase you are on into your coding agent, verbatim. Each phase assumes the
previous one has landed on `main` and been verified.

**Ground rules for every phase, every agent:**

- The plan is `docs/planning/15-multilingual-rollout.md`. Read §1 (what already exists) and §10 (the
  traps) before writing any code. Most of the i18n machinery is already built.
- Do not install a new i18n library. `packages/i18n` is the system.
- Do not hardcode a locale list anywhere. Import `ACTIVE_LOCALE_CODES` from `@relay/i18n`.
- Run `pnpm verify` (typecheck + lint + test) before reporting done. Report the real output. If a
  check fails, say so with the output — do not report a phase complete with a red gate.
- One PR per agent. Do not let two agents edit the same file in the same phase; the assignments below
  are already partitioned to prevent that.

---

## Phase P0 — Foundations (1 agent, ~1 day)

```
Read docs/planning/15-multilingual-rollout.md sections 1, 2 and 3 in full.

Do exactly these four things and nothing else:

1. Add NEXT_PUBLIC_SITE_ORIGIN to the environment config and to .env.example, and document it
   wherever other NEXT_PUBLIC_ vars are documented. It is currently defaulting to
   'https://relay.example' in apps/web/src/features/marketing/site.ts, which silently breaks every
   canonical URL.

2. Add a `reviewStatus: 'beta' | 'reviewed'` field to LocaleDescriptor in
   packages/i18n/src/locales.ts. Every locale gets 'beta'. Update locales.test.ts.

3. Write packages/i18n/GLOSSARY.md per section B4 of the plan: terms that must never be translated
   (product nouns and every connector name — read packages/connectors to get the real list), and
   terms with one mandated translation (post, draft, schedule, publish, approve, connection).

4. Create docs/planning/i18n-pending-keys.md with a short header explaining that any PR adding an
   English catalog key during a translation batch must log it here.

Report the exact key count from messageKeys() in your PR description.
Do not touch routing, the app directory, or any catalog values.
```

---

## Phase P1 — Locale routing (2 agents in parallel, ~1 week)

Agent 1 owns `apps/web/src/app/**` and `middleware.ts`. Agent 2 owns the link layer and lint. They
must not both edit route files — Agent 2 waits for Agent 1's move to land before its final sweep.

```
AGENT A1-ROUTING

Read docs/planning/15-multilingual-rollout.md section 4 (Workstream A) and section 10 (traps 2, 4, 15).

Implement locale routing in apps/web. English stays unprefixed. No catalogs change; the app is still
English only when you are done. That is expected — this phase is pure plumbing.

1. git mv the four route groups under apps/web/src/app/[locale]/. Use git mv so history survives.
2. Pick option A1a or A1b from the plan for the <html lang>/<html dir> problem. State which and why
   in the PR description.
3. Add generateStaticParams() to every statically renderable segment, sourced from
   ACTIVE_LOCALE_CODES. Never a literal array.
4. Validate params.locale with isActiveLocale(); unknown locales must notFound(), never fall back to
   English.
5. Create apps/web/src/middleware.ts implementing exactly the rules in section A4: skip _next/api/
   files; /en/* 301s to /*; active non-default locale rewrites through; everything else rewrites
   internally to /en/*; set x-relay-locale; set the relay_locale cookie (Path=/, SameSite=Lax,
   Max-Age=31536000, NOT HttpOnly) only when the URL carried an explicit prefix.
6. DO NOT redirect based on Accept-Language. Read trap 2 before you argue with this.
7. Update the doc comment on negotiateLocale in lib/i18n/routing.ts — its role narrows now that the
   URL wins.

Verify: pnpm verify passes; every existing route still resolves at its current URL; /en/pricing 301s
to /pricing; /xx/pricing 404s. Paste the curl output for those three in the PR.
```

```
AGENT A2-LINKS

Read docs/planning/15-multilingual-rollout.md section A6.

1. Add localizedHref(path, locale) to apps/web/src/lib/i18n/routing.ts. Returns `path` for the
   default locale, `/${locale}${path}` otherwise. Handle the root path and trailing slashes. Unit
   test it, including es-419 and zh-Hans.
2. Create apps/web/src/components/link.tsx wrapping next/link, applying localizedHref to internal
   hrefs and passing external ones through untouched.
3. Add an ESLint no-restricted-imports rule banning raw 'next/link' outside that wrapper.
4. After AGENT A1-ROUTING lands, migrate every internal <Link> in apps/web to the wrapper. There are
   29 marketing pages plus the app shell; the lint rule tells you when you are done.

Do not edit middleware.ts or any file under apps/web/src/app/[locale]/ layouts — A1 owns those.
```

---

## Phase P2 — SEO plumbing (2 agents in parallel, ~1 week)

```
AGENT B1-TRANSLATOR

Read docs/planning/15-multilingual-rollout.md section B1 and trap 6.

apps/web/src/features/marketing/i18n.ts memoizes ONE English translator in a module-level variable.
Under a warm serverless instance this will serve English to a German request. Fix it:

1. marketingTranslator(locale: string) with a Map<string, Translator> cache.
2. formatDate(iso, locale) and formatDateTime(iso, locale), each with its own cached
   Intl.DateTimeFormat per locale. Keep the UTC pinning and keep the existing comment explaining why
   dateStyle and timeZoneName cannot be combined — that comment records a real Intl constraint.
3. Thread the locale through all 29 marketing pages from the route params.

This is a mechanical diff. Keep it mechanical — no behaviour changes, no refactors along the way.
Do not touch seo.ts; AGENT B2-SEO owns it.
```

```
AGENT B2-SEO

Read docs/planning/15-multilingual-rollout.md section 6 (Workstream C) and traps 1, 3, 4.
Coordinate with AGENT B1-TRANSLATOR: you consume its locale-aware marketingTranslator(locale).

1. Extend pageMetadata() in apps/web/src/features/marketing/seo.ts to take the locale and emit
   alternates.languages for every ACTIVE_LOCALE_CODE plus x-default pointing at the English URL.
   Canonical is SELF-REFERENTIAL per locale — /de/pricing canonicalizes to /de/pricing. Read trap 1;
   getting this wrong deletes 24 languages from the index.
2. Create apps/web/src/app/sitemap.ts. One entry per page with alternates.languages, NOT 25 entries
   per page. Source routes from features/marketing/site.ts (ROUTES / PRIMARY_NAV), never a new
   hardcoded array. Exclude (app), (auth), (onboarding).
3. Create apps/web/src/app/robots.ts. Allow the marketing tree, disallow signed-in paths and their
   locale-prefixed variants, reference the sitemap absolutely.
4. Add robots: { index: false, follow: false } to the (app), (auth) and (onboarding) layout metadata.
5. Localize the JSON-LD builders: pass the locale, add inLanguage. Do NOT localize priceCurrency —
   it stays USD unless Billing actually charges otherwise. Do NOT add aggregateRating or review; the
   existing comment in seo.ts explains the standard and it is correct.
6. Add OG locale and alternateLocale, converting BCP-47 to the underscore OG form. Write and test the
   converter; note that es-419 has no clean OG equivalent.
7. Write CI tests for hreflang reciprocity (every route × every locale) and sitemap completeness.

Verify with the full section C8 checklist and paste the output in the PR.
```

---

## Phase P3 — Language picker (1 agent, ~4 days)

```
AGENT C1-PICKER

Read docs/planning/15-multilingual-rollout.md section 7 (Workstream D), decision D10, and traps 10,
11, 14.

Build the navbar language picker. It renders with one active locale today; that is fine and is the
right time to build it.

Before writing a component, check packages/design-system for an existing menu/select primitive. One
is already used in features/settings/localization/localization-screen.tsx. Reuse, do not invent.

Requirements, all mandatory:
- Lives in apps/web/src/features/marketing/components/site-header.tsx: desktop between the nav list
  and sign-in; mobile inside the existing <details> disclosure.
- NO FLAGS. Flags are countries, not languages. Trigger shows the current endonym plus a globe icon.
- Options show endonym (primary) + English name (secondary). Both are already on LocaleDescriptor.
- Each option is a real <a href> to localizedHref(currentPath, locale) — same page, not the homepage.
  Middle-click and open-in-new-tab must work.
- Each option carries lang={bcp47} and dir={direction}. Current locale gets aria-current="true".
- Beta badge driven by the reviewStatus field added in P0.
- Filter input, matching both endonym and English name, diacritic-insensitive (NFD + strip combining
  marks) so "Espanol" finds "Español".
- Full keyboard support: Enter/Space opens, arrows move, type-ahead, Esc closes and restores focus,
  Tab closes.
- MUST NOT make the marketing site dynamic. (marketing)/layout.tsx exports dynamic='force-static' and
  the comment explains why. Props computed on the server, path from the usePathname() the header
  already calls. No cookies(), no headers(), no fetch. Read trap 11.
- Logical CSS properties only (start-/end-/ps-/pe-), matching the existing header.

Also: in features/settings/localization/localization-screen.tsx, remove `disabled` from the
interface-locale Select and wire it to persist and navigate. Leave the content-locales checkbox list
completely alone — it correctly offers all 32 ALL_LOCALES because content language is not interface
language. Read section 1.3 before you touch that file.

Verify in the en-XB pseudo-locale before claiming RTL works.
```

---

## Phase P4–P7 — Catalog waves (parallel: one agent per locale)

Run one agent per locale within a wave. **Do not start a wave until the previous wave is verified in
production.** Waves and their locales are in section 2 of the plan.

```
AGENT CATALOG-<LOCALE>

You are translating the Relay interface catalog into <LOCALE NAME> (<TAG>).

Read packages/i18n/README.md section "Adding a language" in full. It is the authority on this task.
Then read docs/planning/15-multilingual-rollout.md section B3 and packages/i18n/GLOSSARY.md.

Steps, in this exact order:
1. cp -r packages/i18n/src/messages/en packages/i18n/src/messages/<TAG>
2. Rename the exported const in every file and in index.ts.
3. Translate VALUES ONLY. Never rename, reorder or invent a key. Never touch an ICU argument name.
   Never translate a plural keyword.
4. Rewrite every plural block for <TAG>. Do not copy the English one/other shape. The required
   categories are in the pluralCategories field of your locale's descriptor in
   packages/i18n/src/locales.ts. Lint will tell you which cases you are missing.
5. Apply GLOSSARY.md: protected product nouns and connector names stay in English; mandated terms use
   the one approved translation, consistently, everywhere.
6. Legal, billing and consent copy (billing.ts, the legal sections of web-marketing.ts, the data and
   privacy sections of settings.ts) is NOT machine-translated. Either get a human translation or
   leave those namespaces untranslated so they fall back to English, and say which you did in the PR.
   Do not decide this alone if you are unsure — flag it.
7. Voice: direct, calm, specific, human. No hype words. No em dashes — use a period, comma, colon or
   parentheses.
8. Register the loader in packages/i18n/src/messages/index.ts as an async dynamic import. Never a
   top-level import.
9. Run: pnpm --filter @relay/i18n test
10. ONLY when it is green, flip status from 'planned' to 'active' in locales.ts. Check weekStartsOn,
    hourCycle and direction while you are in there.

Your locale stays reviewStatus: 'beta'. You may not mark it 'reviewed'. That requires the eight
conditions in the README, a named native-speaker reviewer, and a date.

Paste the full lint output in your PR.
```

**Extra instructions for RTL locales (`ar`, `he`) — append to the block above:**

```
Your locale is right-to-left. Beyond the catalog, verify in the running app per README section 5:
- the layout mirrors because the CSS uses logical properties, NOT because anyone added an RTL
  override. If you need an override, that is a bug in the component — fix the component.
- media controls, timelines, progress bars and platform logos do NOT mirror.
- numbers, times, URLs and handles stay readable inside mirrored text.
- keyboard navigation follows visual order.
Check en-XB first; failures are faster to diagnose when you can still read the text.
Arabic needs all six plural categories. Hebrew needs one, two and other. Neither is optional.
```

**Extra instructions for CJK and no-plural locales (`zh-Hans`, `zh-Hant`, `ja`, `ko`, `th`, `id`, `vi`) — append:**

```
Your locale has only the 'other' plural category (except fil, which has one and other). Collapse
every plural block to a single 'other' case that reads naturally with a number in it. Do not leave an
English 'one' case behind.

zh-Hans and zh-Hant are separate locales with different vocabulary, not a font switch. Do not derive
one from the other by script conversion alone.

th has no inter-word spaces: check that headings, buttons and table cells break sensibly and nothing
overflows at 360px.
```

**Extra instruction for `tr` — append:**

```
Turkish casing: 'I'.toLowerCase() is 'ı'. Before shipping, grep apps/ and packages/ for
toLowerCase() and toUpperCase() on any user-facing or comparison string. Identifier comparisons must
use toLocaleLowerCase('en') explicitly. Report what you found even if you do not fix it.
```

---

## Phase P8 — Review and promotion (ongoing, 1 agent + human reviewers)

```
AGENT REVIEW-COORDINATOR

For each locale, drive it from reviewStatus 'beta' to 'reviewed'.

The bar is the eight conditions in packages/i18n/README.md, "Beta versus human reviewed". All eight,
no exceptions, no partial credit. A locale is promoted in its own PR naming the reviewer and the
review date.

Your job is to prepare each review, not to perform it:
- Screenshots at 360, 768 and 1440px, light and dark, of every major screen in that locale.
- A checklist of every plural, date, number, currency, list and relative-time output IN THE APP for
  that locale — not read off the catalog.
- Confirmation that legal, billing and consent copy was human-translated or is explicitly falling
  back to English.
- A clean pnpm --filter @relay/i18n test run for that locale.

You may not promote a locale yourself. Promotion requires a named native speaker who has read every
string in the running app.
```
