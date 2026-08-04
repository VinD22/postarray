# @relay/i18n

Every user visible string in Relay lives here, along with the locale registry,
the ICU runtime, the `Intl` formatters, the pseudo locale generator and the
catalog lint rules.

V1 ships English only. The architecture is built so that adding a language is a
catalog file plus a config entry, never a refactor. No component changes.

```ts
import { createTranslator, formatDateTime, resolveLocale } from '@relay/i18n';
```

| Entry point | Contents |
| --- | --- |
| `@relay/i18n` | everything below except the React binding |
| `@relay/i18n/locales` | the 32 locale descriptors, `resolveLocale`, `isRtl` |
| `@relay/i18n/messages` | the English catalog and the catalog registry |
| `@relay/i18n/format` | `Intl` formatters, all locale and time zone explicit |
| `@relay/i18n/translate` | `createTranslator` and the ICU runtime |
| `@relay/i18n/pseudo` | `en-XA` and `en-XB` generators for CI |
| `@relay/i18n/lint` | catalog rules run in CI |
| `@relay/i18n/codes` | the domain code lists the catalog must cover |
| `@relay/i18n/react` | provider, `useTranslations`, `Trans` (React peer) |

---

## Adding a language

This is the whole job. It should take an afternoon plus review time.

### 1. Copy the English catalog

```bash
cp -r src/messages/en src/messages/de
```

Translate the **values only**. Never rename, reorder or invent a key. If a
sentence has no good equivalent, translate the intent, not the words.

Rules while translating:

- Keep every ICU argument exactly as it appears: `{account}`, `{count}`,
  `{provider}`. Lint fails if a translation drops one or invents one.
- Rewrite plurals for your language rather than copying the English cases.
  German needs `one` and `other`. Polish needs `one`, `few`, `many` and `other`.
  Arabic needs six. Lint tells you which cases your locale requires.
- Never split a sentence into two keys so it reads better in your language.
  Reorder inside the one message instead.
- Do not translate product nouns that the brand glossary marks as protected.
- Do not use an em dash. Use a period, a comma, a colon or parentheses.
- Keep the calm, direct voice. No hype words. Lint enforces the English list;
  apply the same judgement in your language.

### 2. Register the catalog

In `src/messages/index.ts`:

```ts
export const CATALOGS: Readonly<Record<string, CatalogLoader>> = {
  en: async () => en,
  de: async () => (await import('./de/index.js')).de,
};
```

### 3. Turn the locale on

In `src/locales.ts`, change that locale's `status` from `'planned'` to
`'active'`. Check its `weekStartsOn`, `hourCycle` and `direction` while you are
there. Everything else in the product reads those fields.

### 4. Run the checks

```bash
pnpm --filter @relay/i18n lint          # source lint
pnpm --filter @relay/i18n lint:catalog  # catalog rules
pnpm --filter @relay/i18n test          # everything, including the above
```

The catalog rules fail with the exact offending keys. They check that:

- no key collides, and no key is used as both a message and a namespace
- no key is derived from English text
- every message parses as ICU
- every plural covers the cases your locale needs, and every plural and select
  has an `other` case
- no message contains a concatenation marker, an em dash or a forbidden word
- every `RelayError` code has an `error.<code>.message`
- every publish state has a `state.<state>.label`
- every approval state has a `state.approval.<state>.label`
- every validation issue has a `validation.<code>.message`
- every translated message keeps the arguments the English one has

### 5. Check right to left, if it applies

Arabic, Hebrew and Urdu are `rtl`. Before you claim a right to left locale
works, run the app in `en-XB` and check that:

- the layout mirrors because it uses logical CSS properties, not because
  someone wrote a right to left override
- media controls, timelines, progress and platform logos do **not** mirror
- numbers, times, URLs and handles stay readable inside mirrored text
- keyboard navigation follows the visual order

### 6. Check expansion

Run the app in `en-XA`. Every string is accented, bracketed and about 40%
longer than English. Nothing may clip, wrap into an unreadable shape or push a
control off screen. German and Finnish are the real world worst cases, so if a
screen survives `en-XA` it will usually survive them.

---

## What not to do

- **Do not key a message by its English text.** `action.saveDraft`, not
  `saveDraft` and never `Save draft`.
- **Do not concatenate.** Not in the catalog, not in a component. A sentence is
  one key. Word order is not universal.
- **Do not interpolate one translated fragment into another translated string.**
  Pass data, not translated text.
- **Do not add a user facing English literal to a component, a controller or an
  error.** It cannot be translated and lint outside this package will reject it.
- **Do not translate a key, a code, an argument name or a plural keyword.**
- **Do not delete a key you think is unused.** Another surface may use it.
  Removing a key is a separate, deliberate change.
- **Do not format a date or a time without an explicit IANA zone.** Every
  formatter in `format.ts` demands one. A schedule shown in the wrong zone is a
  publishing incident.
- **Do not machine translate and mark the locale reviewed.** See below.

---

## Beta versus human reviewed

A locale is **beta** the moment it is switched on. The interface labels it, and
untranslated keys fall back to English silently and are reported once.

A locale may only be marked human reviewed when all of the following are true.

1. A native speaker of that language has read every string in context, in the
   running app, not in a spreadsheet.
2. The reviewer is briefed on the product voice: direct, calm, specific, human,
   no hype, no em dashes.
3. Brand and legal copy has been checked by someone accountable for it. Billing
   amounts, trial terms, consent text, disclosures and the media generation
   boundary paragraph are not free translation. They state legal and commercial
   facts.
4. Plural, date, number, currency, list and relative time output has been
   checked in the app for that locale, not assumed from the catalog.
5. Screenshots at 360, 768 and 1440 pixels wide show no clipped or overlapping
   text, in light and dark themes.
6. For a right to left locale, the mirroring review above is signed off.
7. `pnpm --filter @relay/i18n test` passes with zero findings for that locale.
8. The reviewer is named in the pull request, with the review date.

Until every one of those holds, the locale stays labelled beta in the language
picker. We would rather ship an honest beta label than claim a review that did
not happen.

---

## Three separate concepts

Keep these apart. They must never overwrite each other.

| Concept | Where it lives | Example |
| --- | --- | --- |
| Interface locale | user preference | the app is in Japanese |
| Content language | per post and per brand | the post is written in Spanish |
| Audience market | per brand and per campaign | the audience is in Mexico |

A user can run the interface in English, write in Japanese and target Brazil.
Never infer one from another.

---

## Notes for the next maintainer

- The catalog is one flat object of dot separated keys. `MessageKey` is derived
  from it with `keyof typeof en`, so a typo in a component is a type error.
- `createTranslator` never throws and never renders a key. Missing translations
  fall back to English. A message that cannot be formatted falls back to its
  literal text with the arguments removed. Every fallback is reported once per
  key through a pluggable reporter.
- The domain code lists in `src/codes.ts` mirror `@relay/contracts`. When that
  package lands, assert against its unions instead so a new error code fails the
  catalog lint rather than shipping untranslated.
- `intl-messageformat` is the FormatJS ICU runtime, and
  `@formatjs/icu-messageformat-parser` is its parser, used by lint. They are the
  only runtime dependencies.
