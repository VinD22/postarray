# 23. Translation Review Handoff

**Audience:** the developer who will make the fifteen-language promise true.

**Status:** the engineering is finished. What remains is human review, one locale
at a time. You do not need to translate anything from scratch.

**Prepared:** 10 August 2026.

---

## 1. What you are actually being asked to do

Read this section carefully, because the job is smaller and stranger than it
sounds.

Every one of the fifteen catalogs is **already complete and already lint clean**.
There are roughly 4,700 keys per locale across 27 namespaces, and the machinery
around them (ICU parsing, typed keys, plural categories, pseudo-locales,
formatters, routing) has been in place for a while.

What is missing is a **named human being who has read a catalog and put their
name against it**. That is the only thing standing between the product and its
language promise, and it is deliberately not something an engineer or an agent
can do alone.

So your job is:

1. Read a locale's translations and judge whether they are actually good.
2. Fix the ones that are not.
3. Sign your name and the date against that locale.
4. Repeat.

Each locale you sign flips its badge from `beta` to `reviewed` in the language
picker. Each one you do not sign stays `beta`, which is honest and costs nothing.

**Do not batch-sign fifteen locales in one pull request.** One locale per pull
request, so a bad review can be reverted without touching the others.

---

## 2. Why it was left this way

The temptation was to write fifteen names into a file and call the feature done.
The reason that did not happen is worth internalising before you start:

`reviewStatus` is not decoration. It drives a badge that tells a paying customer
"a person has checked this language." If nobody has, the badge is a lie in
fifteen languages simultaneously, and it is the kind of lie that is discovered
by exactly the customer it hurts most.

Machine translation gets you a catalog. It does not get you the badge.

---

## 3. Where everything lives

| Path | What it is |
| --- | --- |
| `packages/i18n/src/messages/en/` | The English source catalog, 27 namespace files. The controlling truth. |
| `packages/i18n/src/messages/<locale>/` | One directory per locale, same namespace filenames. |
| `packages/i18n/src/locales.ts` | The locale registry: tag, endonym, script, direction, plural categories, week start, hour cycle, `status`. |
| `packages/i18n/src/reviews.ts` | **The file you edit.** Signed reviews. Currently an empty array. |
| `packages/i18n/src/review-gate.ts` | The gate that decides whether a signature is allowed to exist. |
| `packages/i18n/src/review-gate.test.ts` | Runs that gate over every entry in CI. |
| `packages/i18n/src/messages/beta-fallbacks.ts` | Key prefixes that always render reviewed English while a locale is beta. |
| `docs/planning/i18n-pending-keys.md` | Ledger of English keys added during a translation batch. |
| `docs/planning/15-multilingual-rollout.md` | The full architecture and the D1 to D10 decisions. Read it once. |

---

## 4. The fifteen

Listed in `REVIEW_PROMISE_LOCALE_CODES` in `packages/i18n/src/reviews.ts`:

`en`, `es`, `pt-BR`, `fr`, `de`, `it`, `nl`, `pl`, `tr`, `id`, `ar`, `hi`, `ja`,
`ko`, `zh-Hans`.

Membership in that list is a **target, not a claim**. It changes no behaviour and
grants no badge. It exists so the gate can report the gap between the promise and
the signed reviews.

About ten further locales are active beyond these fifteen. They stay `beta`
indefinitely and that is fine. Do not promote one just because its catalog looks
tidy; the promise list is the founder's scope decision.

Suggested order, easiest to hardest:

1. **`en`** first. It is the source locale, so its review is a proofread of the
   English itself. Doing it first teaches you the tooling with no language risk.
2. **`es`, `pt-BR`, `fr`, `de`, `it`, `nl`** next. Latin script, well-supported
   plural rules, most reviewers available.
3. **`pl`, `tr`, `id`** next. Polish has the most demanding plural logic in the
   set; Turkish has the dotted and dotless `i` casing trap.
4. **`ar`, `hi`, `ja`, `ko`, `zh-Hans`** last. Arabic is right-to-left and needs
   a layout pass, not just a text pass. CJK needs a line-breaking and font check.
   Hindi needs a script rendering check.

---

## 5. How to sign a locale

### 5.1 Run the gate first

```bash
pnpm --filter @relay/i18n test          # everything, including the review gate
pnpm --filter @relay/i18n lint:catalog  # catalog lint and pseudo-locale checks
```

### 5.2 Read the catalog

Open `packages/i18n/src/messages/<locale>/` and read it against
`packages/i18n/src/messages/en/`. You are looking for:

- **Sentences left in English.** The gate catches these (`untranslated-english`),
  but it cannot catch a sentence that was translated *badly*.
- **Wrong register.** Formal versus informal address must be consistent within a
  locale. Decide once per language and hold it everywhere.
- **Platform vocabulary.** Social platforms have native terms in each language.
  A literal translation of "post", "thread", "reel" or "story" often reads wrong
  to someone who actually uses that platform in that language.
- **Broken ICU placeholders.** `{count}`, `{account}`, plural and select blocks
  must survive translation intact.
- **Plural categories.** Polish, Arabic and Russian have categories that English
  does not. A translation with only `one` and `other` is wrong in those.
- **Length.** German expands; check that nothing overflows a control. The
  pseudo-locale `en-XA` simulates this without needing German.

### 5.3 What you may not machine translate

Per `docs/planning/15-multilingual-rollout.md`, these need a human who
understands the meaning, not a fluent-sounding rendering:

- Legal copy, terms, privacy, data processing.
- Billing copy, prices, trial terms, refund language.
- Consent language.
- The media generation boundary paragraph.

While a locale is `beta`, key prefixes listed in `beta-fallbacks.ts` render
reviewed English instead of the local translation. That is a safety net, not a
substitute for reviewing them before you sign.

### 5.4 Sign it

Add one object to `LOCALE_REVIEWS` in `packages/i18n/src/reviews.ts`:

```ts
export const LOCALE_REVIEWS: readonly LocaleReview[] = [
  {
    locale: 'de',
    reviewer: 'Ada Lovelace',        // a real person, never a team alias
    reviewedOn: '2026-08-14',        // YYYY-MM-DD, UTC, the day review ended
    identicalToEnglish: ['web.brand.name'], // keys deliberately left as English
  },
];
```

`identicalToEnglish` is how you tell the gate that a byte-identical string is
intentional (a proper noun, an ISO code, a symbol) rather than an untranslated
sentence. Listing a key here is a statement that you looked at it and meant it.

### 5.5 Re-run and open the pull request

```bash
pnpm --filter @relay/i18n test
pnpm verify   # before any commit, per AGENTS.md
```

---

## 6. What the gate refuses

`review-gate.ts` will fail the build for any of these. The rule names appear in
the failure message.

| Rule | Meaning |
| --- | --- |
| `unknown-locale` | The tag is not in the locale registry. |
| `inactive-locale` | The locale is not `status: 'active'`. |
| `duplicate-review` | Two entries for one locale. |
| `reviewer-missing` | No name, a placeholder, or a team alias. |
| `review-date-invalid` | Not an ISO `YYYY-MM-DD` date. |
| `review-date-in-future` | Signed with a future date. |
| `catalog-missing` | No catalog directory for the locale. |
| `catalog-incomplete` | Keys present in English are missing here. |
| `catalog-lint-error` | ICU syntax, placeholder or plural errors. |
| `untranslated-english` | A translatable string is byte-identical to English and was not acknowledged. |
| `stale-sign-off` | An acknowledged key's English source changed after you signed. |

`stale-sign-off` is the one that will surprise you later: if someone edits an
English string you had acknowledged as intentionally identical, your signature no
longer covers it and the build tells you to look again. That is working as
intended.

---

## 7. Rules that are already decided

Do not relitigate these; they are settled in
`docs/planning/15-multilingual-rollout.md` and enforced in code.

- English is canonical and has **no URL prefix**. `/en/*` permanently redirects
  to the unprefixed path.
- Other locales use a path prefix: `/de/pricing`.
- **Never auto-redirect on `Accept-Language`.** Detection may inform a
  suggestion, never a redirect. Crawlers must be able to reach English.
- `x-default` points at English.
- Signed-in routes may carry a locale prefix but stay `noindex`.
- **Never use a flag for a language.** The picker uses endonyms.
- Translated URL slugs are out of scope. `/de/pricing`, not `/de/preise`.
- Interface locale, content language and audience market are three different
  things. If you find yourself filtering content languages by the interface
  locale list, stop: that is a bug.
- No em dashes in user-visible copy, in any language.

---

## 8. Adding an English key during a batch

If you must add a new English string while translations are in flight:

1. Add it to the right namespace in `packages/i18n/src/messages/en/`.
2. Append a row to `docs/planning/i18n-pending-keys.md` recording the key, the
   pull request and the reason.
3. Register it in `packages/i18n/src/messages/beta-fallbacks.ts` if it belongs to
   a sensitive prefix, or the locale parity tests will fail.

Every locale catalog must gain the key too, or `catalog-incomplete` fires. This
is why English keys are frozen for the duration of a translation batch wherever
possible.

---

## 9. Definition of done, per locale

A locale is done when all of the following are true:

- [ ] Catalog complete and lint clean.
- [ ] A named human read it and fixed what needed fixing.
- [ ] Register, platform vocabulary and plural categories checked.
- [ ] Legal, billing and consent copy reviewed by a human, not machine output.
- [ ] Pseudo-locale expansion pass shows no overflow.
- [ ] For `ar`: a right-to-left layout pass, not only a text pass.
- [ ] For `ja`, `ko`, `zh-Hans`, `hi`: script rendering and line-breaking checked.
- [ ] Keyboard and screen-reader pass on the composer, calendar and receipt.
- [ ] Localized metadata (title, description, canonical, hreflang) verified.
- [ ] Entry added to `LOCALE_REVIEWS` with a real name and date.
- [ ] `pnpm verify` green.

Until every box is ticked, the locale stays `beta`. That is a perfectly
acceptable state to ship in, and it is a great deal better than a badge that is
not true.

---

## 10. One thing to be careful about

There is a real temptation, when you are eleven locales in and tired, to sign the
last four because the catalogs "look fine."

The gate cannot stop you. It checks completeness, syntax, and that you
acknowledged identical strings. It cannot check whether the Korean actually reads
like Korean.

That last judgement is the entire reason this file has your name in it rather
than a machine's.
