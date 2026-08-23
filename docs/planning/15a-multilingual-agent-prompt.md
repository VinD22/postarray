# Parallel developer brief: multilingual rollout

Use this brief with `docs/planning/15-multilingual-rollout.md`. It is designed for up to four
parallel workstreams in this repository. The public launch roster is exactly 20 locales:

`en`, `es`, `pt-BR`, `fr`, `de`, `it`, `nl`, `pl`, `tr`, `id`, `ar`, `hi`, `ja`, `ko`, `zh-Hans`,
`ru`, `uk`, `he`, `vi`, `th`.

Do not add a locale to a route, picker, sitemap, API discovery response, or CLI by hand. Import the
registry from `@relay/i18n`. Keep `es-419`, `cs`, `sv`, `fil`, and `zh-Hant` retired and redirect old
URLs to English.

## Shared instructions

- Read the plan and the relevant package README before editing.
- Stay within the files assigned to your track. Do not reformat another track's files.
- Use `apply_patch` for edits. Do not add an i18n library, browser automation, unofficial provider
  API, AI media generation, or product-visible English literals.
- Preserve machine contracts: API keys, webhook keys, CLI JSON, IDs, provider identifiers, scope
  identifiers, error codes, and URL slugs do not change with locale.
- Every external response is parsed at its boundary. Every human string comes from `packages/i18n`.
- Add tests next to the change. Run focused tests while working, then package typecheck, lint, and
  test sequentially. Report real failures instead of hiding them.
- A locale is beta until a named native reviewer and specialist reviewers sign the strict gate. Do
  not add a reviewer name, date, digest, or evidence that does not exist.

## Track A: catalogs, glossary, and review gate

Own `packages/i18n`, `packages/i18n/README.md`, and the translation records.

1. Maintain the explicit 20-locale public roster and the retired compatibility set.
2. Keep every locale catalog module-parity clean and preserve all ICU arguments, tags, product nouns,
   URL values, and connector names.
3. Translate values only. Use the glossary and the target locale's CLDR plural categories. Arabic
   needs six categories; Polish, Czech, Russian, and Ukrainian need `one/few/many/other`; Hebrew
   needs `one/two/other`; German, Dutch, and Turkish need `one/other`; Indonesian, Vietnamese,
   Thai, Simplified Chinese, Japanese, and Korean use `other`.
4. Keep legal, billing, consent, security, approval, provider-capability, and media-rights copy in
   reviewed English until a native/legal review exists. The runtime may fall back in beta; the strict
   gate must reject that fallback at promotion time.
5. Add a review record only when catalog, accessibility, SEO, editorial, legal, billing, and security
   evidence exists. Run the strict gate with `allowEnglishFallbacks: false` before promotion.

Useful commands:

```bash
pnpm --filter @relay/i18n lint
pnpm --filter @relay/i18n test
pnpm --filter @relay/i18n typecheck
```

## Track B: web product surfaces

Own `apps/web/src/app/[locale]`, `apps/web/src/features`, and web API resources assigned to you.

Cover the marketing shell, language picker, settings localization, auth, onboarding, signed-in app,
settings, and OAuth consent. For every route and every possible state, check loading, empty, error,
offline, partial success, permission denied, and rate limited behavior where applicable.

For the language picker, show endonyms and English names without flags, use real links that preserve
the current path and query, set `lang` and `dir`, show beta status, filter diacritics safely, and keep
the marketing layout static. For Arabic and Hebrew, use logical CSS and verify with `en-XB` first.

For consent, show the requesting app, legal links, selected workspace, all requested scopes grouped
by risk, scopes not requested, approval policy, revoke guidance, loading/error states, and disabled
submit state. Post the nonce, exact scope list, one workspace, an idempotency key, and a hash of the
copy actually shown. Redirect only to the server-returned registered URI.

Useful commands:

```bash
pnpm --filter @relay/web typecheck
pnpm --filter @relay/web lint
pnpm --filter @relay/web exec vitest run src/proxy.test.ts src/app/robots.test.ts src/app/sitemap.test.ts
```

## Track C: SEO and content

Own `apps/web/src/features/marketing/seo.ts`, sitemap, robots, feed, blog availability, and SEO tests.

For every existing public page and dynamic page family, create a per-language keyword brief covering
query intent, title, description, headings, internal links, FAQ wording, and terminology. Do not add
new pages until search data validates demand.

Each localized marketing URL needs a truthful localized title and description, self canonical,
reciprocal hreflang with `x-default` to English, localized Open Graph/Twitter metadata, and JSON-LD
whose visible text and `inLanguage` agree. Do not advertise an untranslated article in a locale's
hreflang cluster, sitemap, or RSS feed. Keep app/auth/onboarding/consent out of indexing.

Verify every route in `MARKETING_ROUTES`, all platform/spec/tool/use-case/comparison slugs, every legal
page, blog index/article, sitemap entry, feed entry, canonical, and redirect. Test reciprocal clusters,
unknown/retired locale redirects, and query preservation.

## Track D: CLI, API, email, and developer surfaces

Own `apps/cli`, `apps/api` presentation surfaces, and human-facing email/digest templates assigned to
you.

- Localize CLI help, diagnostics, validation output, errors, and locale precedence. Keep `--json`
  output, enums, exit codes, and field names stable.
- Localize API OpenAPI reference chrome, OAuth discovery locale list, OAuth consent copy, and
  `Content-Language`/`Vary` headers. Keep `/openapi.json` and operation IDs unchanged.
- Cover email subjects, bodies, invitations, password reset, connection notices, publication receipts,
  digest, webhook descriptions, and support macros. Native review is required before promotion.
- Add tests for locale selection, stable machine snapshots, reference-page language, and consent
  request/decision compatibility.

Useful commands:

```bash
pnpm --filter @relay/cli typecheck
pnpm --filter @relay/cli lint
pnpm --filter @relay/cli exec vitest run src/program.test.ts
pnpm --filter @relay/api typecheck
pnpm --filter @relay/api lint
pnpm --filter @relay/api exec vitest run src/openapi/reference-page.test.ts src/oauth-provider/oauth-provider.test.ts
```

## Handoff checklist

Before handing work to the integration owner, include:

1. Files changed and files deliberately left unchanged.
2. Locales exercised, including `en-XA`, `en-XB`, Arabic, German, Thai, Japanese, and Simplified
   Chinese where relevant.
3. Focused test, lint, and typecheck commands with their real result.
4. Any English fallback, untranslated article, missing specialist review, or SEO keyword gap that
   keeps a locale beta.
5. A route/surface coverage note proving that no page or state was silently skipped.
