# Home and app shell redesign: implementation handoff

> Implemented 2026-09-05 using Option A, “Editorial ledger.” The shared shell and Home changes below
> are now the shipped direction. Billing archaeology confirmed two distinct stages: signup begins on
> free publishing credits with no card or countdown; a person who later enters paid checkout can still
> have a seven-day paid-plan trial. The Home banner is retained only for that explicit `trialing` state.

Written 2026-09-04, after running the app in demo mode and reviewing the
marketing work that landed in `82b89e2`. This is a build brief for one
developer. It states what is wrong, what to change file by file, what must not
change, and how to prove it is done. Read `AGENTS.md` and
`packages/design-system/README.md` first: this document assumes both and only
records where it revises them.

## Why this work exists

`82b89e2` reworked the marketing site into an editorial system: a 750-weight
sans headline at `clamp(3.25rem, 2rem + 5vw, 7.75rem)` with one Fraunces italic
accent line under it, `py-20 md:py-28 lg:py-32` section rhythm, body copy at
`text-body-lg` with `leading-[1.7]`, one vermilion action per screen. It reads
as a product someone designed.

The in-app screens did not get that pass. Running `/home` in demo mode, the
complaints in the brief are all visible and all true:

- **Small type.** Every row on Home is `text-body-md` (14px/21px) or
  `text-body-sm` (13px). The only large thing on the screen is the three stat
  numerals. A screen whose job is "read this and decide" is set at the size we
  use for table cells.
- **Too much text.** Each of the three stat tiles carries a label, a numeral
  and a hint sentence up to 38 characters wide. Every section carries a title, a
  meta line and often a second explanatory sentence. Six action items render at
  once, each with a title, an "Affects X, Y" line and a relative timestamp.
  Then a four-column table. Then a right rail with two more lists. The screen
  says roughly forty distinct sentences before the reader has decided anything.
- **Flat hierarchy.** `home-screen.tsx` wraps the whole page in one
  `StaggerList` and gives every `HomeSection` the same heading treatment
  (`text-title-sm`, 16px). "Needs you now" and "Connection health" look equally
  important. They are not.
- **Doesn't feel premium.** Bordered panels, hairline rules and 14px text with
  no display face anywhere except the page title. The editorial vocabulary the
  marketing site earned stops at the app boundary.

Scope for this ticket: **`/home` first, then the app shell** so the other eleven
screens inherit the shell changes. Other screens are a follow-up.

Ordering decision already made with the founder: Home keeps its current
information order. It leads with **what needs me**, then **what goes out next**.
This is a volume and hierarchy problem, not an information-architecture problem.

## Before you start: mockups

Do not start in the editor. Produce mockups of the three directions in §3
first, get one picked, then build. The rest of this document assumes Option A
was chosen and flags where B or C would differ.

## 1. What the screen is made of today

Route: `apps/web/src/app/[locale]/(app)/home/page.tsx` (13 lines; renders
`<HomeScreen />` with no props, metadata from `home.title`).

`apps/web/src/components/home/home-screen.tsx` (165 lines, `'use client'`):

| Anchor | What it does |
| --- | --- |
| L51 | `useActionCenter()` |
| L56-61 | `useCalendar({ from: now, to: now + 24h, projectId })` |
| L66-82 | one-shot polite announcement of `home.greetingSummary` once both reads settle |
| L86-96 | `PageHeader` with `home.title` / `home.subtitle` + vermilion Compose button, gated on `canPublish` |
| L98 | `<StaggerList className="relay-page flex flex-col gap-8 py-6 md:py-8" stagger={0.06} y={16}>` — the whole page is one mount stagger |
| L103 | two-column grid `xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)] xl:gap-10` |
| L104-150 | left column: `HomeSection id="home-needs-you"` (emphasis, `Badge tone="accent"` count, link to `/action-center`), empty branch renders `EmptyState compact` + `EmptyScene scene="actionCenter"`, non-empty wrapped in `border-cta border-s-[3px] ps-4`, `ActionCenterList maxItems={5} showSnooze={false}`; then `<Separator/>`, then `UpcomingQueue` |
| L152-157 | right rail `border-border-subtle xl:border-s xl:ps-8`: `RecentReceipts`, `Separator`, `ConnectionHealth` |
| L159-161 | footer line `shell.workspace.current` |

Supporting components in the same directory:

- `section.tsx` (68 lines) — `HomeSection({id, title, meta, link, children, className, emphasis})`. `flex flex-col gap-3`; heading `text-title-sm text-text-primary`, plus `font-display font-bold` only when `emphasis`. Sets `data-stagger-item`.
- `stat-tiles.tsx` (228 lines) — reads `useCalendar` over 7 days and `useConnections`. Exports the pure `readingFor()` (L51) and `soonestEntry()` (L65). Section is `panelSurface` + `grid md:grid-cols-12`, three tiles at `md:col-span-3 / 3 / 6`. `Tile` (L151): `min-h-32 p-4 md:p-5`, label `text-label text-text-secondary font-medium`, value `font-display text-[clamp(1.75rem,2.5vw,2.75rem)] leading-none font-bold tracking-[-0.03em]`, hint `text-body-sm text-text-tertiary max-w-[38ch]`. `Numeral` (L191) counts up over `DURATION_SLOW` (200ms) and renders the final value instantly under reduced motion. A failed read renders `common.unavailable` plus `home.error.body`, never `0`.
- `recent-receipts.tsx` (118 lines) — `useRecentReceipts(4)` → design-system `Timeline`. Publish rows carry `LiveBadge`; partial rows carry the `state.partially_published.description` sentence. Full loading/error/empty branches.
- `connection-health.tsx` (144 lines) — `useConnections()`, unhealthy sorted first, bordered `<ul>` of rows (`border-b py-2.5`) with `StatusDot`, name link, health word, relative last-publish. `HEALTH_LABEL_KEY` at L17.
- `upcoming-queue.tsx` (155 lines) — `useCalendar` 24h → `<table className="text-body-md w-full border-collapse">` inside `.relay-scroll-x`, four `text-label text-text-tertiary` column heads, `StatusPill size="sm"` per row, meta line naming the workspace time zone.
- `trial-banner.tsx` (80 lines) — `useBillingState()`, returns null unless `status === 'trialing'`. See §5 item 2: this may be dead code under the current billing model.
- `digest-card.tsx` (50 lines) — built, deliberately **not** mounted. Leave it that way until BE-16.

Copy: prefix `home.*`, 49 keys at `packages/i18n/src/messages/en/web-shell.ts`
L103-165, including the `home.v2.tiles.*` and `home.v2.digest.*` sub-namespaces.
Home also consumes `actionCenter.*`, `state.*`, `connection.*`, `empty.*`,
`billing.trial.*`, `shell.workspace.current` and `common.unavailable`.

## 2. The design vocabulary you are pulling from

All values below are real and already in the tree. Copy them; do not round them
to a 4/8px grid and do not invent new ones.

**Faces.** `apps/web/src/app/globals.css` L17-29 overrides the design-system
defaults through `@theme inline`: the app's UI sans is **Manrope**
(`var(--font-relay-ui)`), and `--font-serif` / `--font-display` are both
**Fraunces** (`var(--font-relay-display)`). `packages/design-system/src/tokens/theme.css`
L973-979 holds the fallback stacks.

**Product type ramp** (`theme.css` L982-1017) — what app screens use today:

| Token | Size / line-height | Tracking | Weight |
| --- | --- | --- | --- |
| `--text-display` | 2.75rem / 3rem | −0.022em | 600 |
| `--text-title-lg` | 1.75rem / 2.125rem | −0.018em | 600 |
| `--text-title-md` | 1.25rem / 1.75rem | −0.012em | 600 |
| `--text-title-sm` | 1rem / 1.375rem | −0.006em | 600 |
| `--text-body-lg` | 1rem / 1.625rem | — | — |
| `--text-body-md` | 0.875rem / 1.3125rem | — | — |
| `--text-body-sm` | 0.8125rem / 1.1875rem | — | — |
| `--text-label` | 0.75rem / 1rem | +0.01em | 550 |

**Fluid display steps** (`theme.css` L1028-1043), currently commented as
`font-display` surfaces only — see §6, this ticket revises that note:

- `--text-display-2xl: clamp(3.25rem, 2rem + 5.5vw, 8rem)` / 0.98 / −0.02em / 600
- `--text-display-xl: clamp(2.75rem, 1.75rem + 3.5vw, 5.5rem)` / 0.98 / −0.02em / 600
- `--text-display-lg: clamp(2rem, 1.5rem + 2.25vw, 3.75rem)` / 1.02 / −0.018em / 600

**Space, radius, border** (`theme.css` L1045-1063): `--spacing: 0.25rem`,
`--spacing-touch: 2.75rem`; radii `xs 0 / sm 2px / md 4px / lg 6px / xl 8px /
editorial-poster 20px / full`; border widths 1px / 1.5px / 2px.

**Shadows** (L1066-1072): `--shadow-raised: 0 1px 2px rgb(20 18 15 / .05), 0 1px
1px rgb(20 18 15 / .03)`; `--shadow-overlay: 0 12px 32px -12px rgb(20 18 15 /
.18)`; the `--shadow-hard*` names are historical and resolve to diffuse
shadows. Dark overrides at L1136-1156.

**Motion** (L1076-1096): functional 80/120/160/200ms, expressive
400/650/900ms; eases `--ease-standard`, `--ease-entrance`, `--ease-exit`,
`--ease-out-back`, `--ease-out-expo`. In-app stays in the functional tier.

**Layout** (L1114-1116): `--layout-app-max: 110rem`,
`--layout-gutter: clamp(1.25rem, 4vw, 5rem)`. `.relay-page` in `globals.css`
L93-99 applies both.

**Colour**: light at `theme.css` L481-559 — `--surface-canvas/raised/sunken/
overlay/hover/active/inverted/scrim`, `--border-subtle/default/strong/focus/
bold`, `--text-primary/secondary/tertiary`, `--accent-*` (terracotta,
navigation), `--accent-action-*` (vermilion, one primary fill per screen),
`--accent-warm-*` / `--accent-cool-*` (marketing scenes only, nothing else may
join them), `--accent-blush-*`. Dark is defined twice: L635-699 under
`prefers-color-scheme` and L747+ under `[data-theme='dark']`. Both must be kept
in step; never write a `dark:` variant.

**Marketing components worth reading before you design:**

- `apps/web/src/features/marketing/components/editorial/display.tsx` —
  `EditorialDisplay({children, as, size, reveal, className})`, sizes map
  sm→`text-display-lg`, md→`text-display-xl`, lg→`text-display-2xl`; base
  `font-display text-balance tracking-[-0.025em] [font-variation-settings:"opsz" 72]`;
  colour is inherited, never forced.
- `.../editorial/hero-headline.tsx` — the marketing headline recipe: line 1 is
  **sans** at `clamp(3.25rem, 2rem + 5vw, 7.75rem)`, `leading-[0.88]`,
  `font-[750]`, `tracking-[-0.06em]`; line 2 is Fraunces italic at `font-[540]`,
  `tracking-[-0.045em]`, in `text-accent-action`.
- `.../home-journey.tsx` — section heading `font-display text-display-lg
  text-balance`, ghost numeral `font-display text-display-lg text-border-default
  tabular-nums`, body `text-body-lg text-text-secondary leading-[1.7]
  max-w-[62ch]`.
- `globals.css` L109-116 `.relay-auth-title` — the sans editorial headline in
  its already-shipped app-side form: `clamp(2.5rem, 2.1rem + 1.5vw, 3.75rem)`,
  weight 750, `leading-[0.98]`, `tracking-[-0.045em]`. **This is the closest
  precedent for what Home's heading should be**, and it already ships on the
  auth screens, so it is not a new invention.
- `packages/design-system/src/patterns/page-header.tsx` L55 — the h1 is already
  editorial: `type-title text-[clamp(2.25rem,1.9rem+1.5vw,3.5rem)]
  leading-[0.98] font-bold tracking-[-0.035em] text-balance`. Home is not using
  a small title; it is using a large title above small everything-else.
- `packages/design-system/src/utils/style-constants.ts:45` —
  `panelSurface = 'bg-surface-raised border border-border-default rounded-lg'`.

## 3. The three directions to mock

Mock at 1440×900 desktop, plus a 390×844 phone artboard of whichever wins.
Use real demo values so the mock is honest: workspace "Example Studio EU",
4 scheduled this week, 4 connected accounts, next out 10:38 PM to
@example_studio in Europe/Berlin, the six action items, three receipts, four
connection rows.

**Option A — "Editorial ledger" (leading candidate).** Same order, far less
volume.

- Page header: `Home` at the `.relay-auth-title` recipe. Subtitle cut to one
  short sentence. Exactly one vermilion control on the screen (see §4 on the
  duplicate Compose).
- Stat tiles become a **ledger line**, not a panel: three numerals at
  `text-display-lg` in the display face with the label above in `text-label`,
  separated by hairlines, no surrounding card, **no hint sentence** (the hint
  moves to an accessible description, it is not deleted). "Next one out" shows
  the time and the account, nothing else.
- "Needs you now": top **three** items rendered large — title at
  `text-body-lg` with `leading-[1.7]`, one tertiary meta line, one action
  control. NOW / SOON keep their small-caps group labels. Everything beyond
  three collapses to "3 more in the Action center". The 3px start bar stays;
  the per-row buttons drop to secondary/ghost so the bar is the only red.
- "Next 24 hours": the four-column table becomes a **timeline list** — time in
  tabular figures at the start, title, account chip, status pill at the end.
  Five rows, then "Open the calendar".
- Right rail: receipts drop to three, titles only, status word in tertiary.
  Connection health becomes a one-line summary ("2 accounts working, 2 need
  attention") plus only the rows that need attention, then "All connections".
- Rhythm: 40px between sections, 24px inside a section, controls unchanged at
  product density. Reading rows lift to `text-body-lg`.

**Option B — "Command sheet".** One flat list under a single "Today" heading,
interleaving action items and the next 24 hours in time order; the three stats
collapse to one sentence. Least chrome on the screen; the tradeoff is that the
numerals disappear and the two populations (things that need a decision, things
that are simply scheduled) stop being visually distinct.

**Option C — "Numbers first".** Stat tiles stay a bordered panel but roughly
double height with the numeral at `text-display-xl`; everything below is as in
Option A. Most immediate visual punch; the tradeoff is a screenful of numbers
before the reader reaches anything actionable, and Home is explicitly a queue of
actions (`docs/planning/06` D4).

Give each mock a note stating its tradeoff. Do not present three shades of the
same idea.

## 4. Implementation, file by file (assuming Option A)

### Home

**`home-screen.tsx`** — new grid and order; `ActionCenterList maxItems={3}`;
decide the empty-state illustration question (§6); move or drop the
`shell.workspace.current` footer line (the workspace is already named in the top
bar). Keep the `useAnnouncer` block at L66-82 working: if the summary sentence
changes, the announcement must still fire exactly once after both reads settle.

**`section.tsx`** — heading always in the display face at `text-title-lg`; add
an optional `summary` prop for the one-line section sentence; section gap 40px.
`data-stagger-item` must stay on the same element or the mount stagger breaks.

**`stat-tiles.tsx`** — replace the `panelSurface` grid with the ledger row;
`Tile` drops the visible hint paragraph but keeps the text as an
`aria-describedby` target, so nothing is lost to a screen reader; numeral at
`text-display-lg`. **Do not touch `readingFor`, `soonestEntry` or `Numeral`** —
they are pinned by tests and by the "missing data is `unavailable`, never `0`"
rule. The count-up is permitted on Home under the four conditions in
`docs/planning/06` L80-84; it already meets them.

**`upcoming-queue.tsx`** — table to `<ol>` timeline. Keep tabular figures on the
times. Keep the time-zone sentence but shorten it (new key
`home.v2.queue.timezone`). The `.relay-scroll-x` wrapper exists because the
table overflowed; a list should not, but the smoke test asserts no horizontal
page overflow, so verify at 360px.

**`connection-health.tsx`** — summary line plus attention rows only, then a link
to all connections. New key `home.v2.connections.summary`. Keep `StatusDot`
alongside the health word: status may never be carried by colour alone.

**`recent-receipts.tsx`** — `useRecentReceipts(3)`, title-only rows. Keep the
partial-publication sentence: it is the one place a person learns a post went
out to some accounts and not others.

**i18n** — new keys under `home.v2.*` in
`packages/i18n/src/messages/en/web-shell.ts`. **Every new English key must also
be registered in `BETA_ENGLISH_FALLBACK_KEYS` in
`packages/i18n/src/messages/beta-fallbacks.ts`, or 26 tests fail.** Namespaces
listed in `LOCALE_FILLED_PREFIXES` cannot be registered at all; `home.` is fine.
No em dashes in product copy. No string concatenation, no interpolating one
translated fragment into another.

**Tests** — add `home-screen.test.tsx` covering the seven states (loading,
empty, error, partial, offline, permission-denied, rate-limited) plus axe, as
`docs/planning/26-experience-frontend-design.md` L565 already asks for.

### Shell

**`packages/design-system/src/patterns/page-header.tsx`** — the header pads
`px-4 md:px-7` while the body below uses `.relay-page`
(`--layout-gutter: clamp(1.25rem, 4vw, 5rem)`). The two edges do not line up on
any screen in the app. Align the header to the same gutter. Description to
`text-body-lg`, one sentence. This single change lifts all twelve screens.

**`app-shell.tsx`** — top-bar geometry stays. Resolve the duplicate Compose: the
top bar has a vermilion `Compose` and the Home page header has a second one.
One vermilion fill per screen is a hard rule. Recommendation: keep the top-bar
button (it is global) and make the page-header action secondary, or drop it on
Home.

**`primary-nav.tsx`** — item text to `text-body-lg` at `lg`, icons to 1.25rem,
and give the active item a 2px terracotta start bar in addition to the fill.
Terracotta is the navigation red; vermilion must not appear in the nav.

**`mobile-nav.tsx`** — icon size only. Do not restructure. Touch targets stay at
or above 44px (`--spacing-touch`).

## 5. Bugs to fix in the same branch

Found while running the app; small, and all user-visible.

1. **Duplicated error text.** `apps/web/src/features/analytics/components/query-error-state.tsx`
   L96-100: when the error is not an `ApiError`, `description` is passed as both
   the body and `subject.value`, so the analytics error card prints the same
   sentence twice, the second time labelled "Details". Pass `subject` only when
   `apiError` is non-null. Visible right now on `/analytics` in demo mode.
2. **Two billing models in the copy.** `auth.signUp.trialNote` says "No card and
   no countdown", while `home.trial.banner` (`web-shell.ts` L141) renders
   "Trial, N days left. Converts {date} to {amount}." and
   `error.trial_expired.*` (`errors.ts` L57-58) still exists. Confirm the
   current model (the free plan with credits replaced the trial) and either
   retire `trial-banner.tsx` and its keys or reword them. Note `trial-banner.tsx`
   returns null unless `status === 'trialing'`, so this may already be dead code
   — establish that before deleting.
3. **Demo mode has no analytics fixture.** `/analytics` greets a demo visitor
   with an error card. Add an overview fixture in
   `apps/web/src/lib/api/fixtures.ts`. Relevant if demo mode also backs the
   public "View the demo" link.
4. **`metadataBase` is unset.** Marketing pages are fine (they build absolute
   URLs from `SITE_ORIGIN` in `features/marketing/seo.ts`), but app, auth and
   onboarding routes fall back to `http://localhost:3000` for OG images. Set it
   in `apps/web/src/app/[locale]/layout.tsx` from the same origin value.

Out of scope for this branch, recorded so it is not lost: the production build
prerenders **5,110 static pages** and `.next` reaches **5.5 GB**, which is a
real constraint on the deploy box and needs its own decision (ISR or a reduced
locale set for the long-tail marketing routes).

## 6. Rules this work must honour, and the three it revises

**Honour, without exception:**

- Vermilion is the single primary fill per screen; terracotta carries
  navigation, links, focus and selection. Marigold and ultramarine are
  marketing-scene colours and may not appear in the app.
- No gradient headline text, no glass panels, no glowing orbs, no emoji
  iconography, no fake dashboards or invented metrics, no decorative score
  widgets, no three-identical-card rows, and no card for something that reads
  better as a row or a sentence.
- Status is never carried by colour alone, and never by weight alone.
- Missing data renders `unavailable`, never `0`.
- Tabular figures on every number in a table, counter or receipt. Never below
  12px. Never all-caps on a translated string.
- Logical properties only (`padding-inline-start`, never `padding-left`); no
  `dark:` variants — dark is a designed token set, not an inversion. Layout must
  tolerate RTL and 30-50% text expansion.
- Motion stays in the functional 120-200ms tier and respects
  `prefers-reduced-motion`. GSAP lives only in `apps/web/src/lib/motion` and
  never in `packages/design-system`.
- `apps/web/src/components/home/app-motion-tier.test.ts` is a **source-scanning
  gate**: it scans `components/home`, `components/empty`,
  `components/onboarding`, `features/calendar`, `features/receipts` and
  `features/composer` for `EXPRESSIVE_SM/MD/LG` and a banned-primitive list
  (`CelebrationBurst, KineticHeadline, Magnetic, MagneticButton, Marquee,
  PinnedScene, ScrollScene, ParallaxLayer, SceneSequencer, CountUp`). It fails
  in both directions: adding a fourth expressive moment fails, and removing one
  of the three sanctioned ones also fails. `Reveal`, `StaggerList` and
  `LiveBadge` are app-safe.
- WCAG 2.2 AA is a merge requirement. Every screen designs its loading, empty,
  error, partial-success, offline, permission-denied and rate-limited states.

**Revises, deliberately — update `docs/planning/06-product-ux-and-design-system.md`
in the same commit rather than leaving the contradiction:**

1. **D7, "one density: compact product, roomy marketing"** (L960, with the
   32/48/64 vs 8/12/24 numbers at L784-785). Home gets a reading density: 40px
   between sections, `text-body-lg` on rows a person reads to decide. Controls,
   forms and tables keep product density everywhere including Home. The rule
   becomes "compact controls, comfortable reading", not "compact everything".
2. **`--font-editorial` is "marketing headlines and pull quotes only"** (L756-762).
   `PageHeader` has shipped an editorial h1 on every app screen since before this
   ticket, and `.relay-auth-title` ships the sans-editorial recipe on the auth
   screens. Record what is actually true: the display face is allowed for screen
   and section titles in-app; product body, controls, tables and labels stay in
   the UI sans.
3. **The empty Home state.** L187-214 says a zero-action Home reads "Nothing
   needs you right now" and renders **no illustration**, but
   `home-screen.tsx:125` renders `EmptyScene scene="actionCenter"`. Pick one and
   make the code and the doc agree. Recommendation: keep the scene — an empty
   Home is the one moment on the screen with room for it — and correct the doc.

Also worth knowing: `docs/planning/06` L957 (D4) says Home shows no counts
because "Home stays a queue of actions; counts live in Analytics". `StatTiles`
is a deliberate, documented reversal argued in its own file header. The ledger
treatment keeps the reversal but stops the counts from dominating the screen.

## 7. Definition of done

1. The chosen direction is built and matches the mock at 1440 and 390, in light
   and dark.
2. `pnpm verify` passes — typecheck, lint, and the full unit suite (1450 web
   tests today), including `app-motion-tier.test.ts`, `stat-tiles.test.ts` and
   the i18n catalogue tests.
3. `pnpm --filter @relay/web test:e2e` passes:
   - `e2e/smoke.spec.ts` — `/home` renders exactly one `<main>`, shows the
     "You are looking at demo data" notice (this guard is what proves the suite
     is not auditing an error page), and has **no horizontal page overflow** at
     any tested width.
   - `e2e/accessibility.spec.ts` — axe finds no serious or critical WCAG A/AA
     violation on `/home` in **both** light and dark, and under the
     pseudo-locale.
4. New `home-screen.test.tsx` covers the seven states plus axe.
5. Manual pass: full keyboard traversal of Home; every numeral renders
   `unavailable` when its read fails (break the fixture to confirm); the trial
   banner is absent when the workspace is not trialing; exactly one vermilion
   element is visible on the screen; the four bugs in §5 are fixed.
6. `docs/planning/06-product-ux-and-design-system.md` records the three
   revisions in §6, and `docs/planning/29-experience-implementation-status.md`
   gets a line saying what shipped.

## 8. Traps that will cost you time

These are recorded from the previous session and are all still live.

- Adding one English key fails 26 i18n tests until it is registered in
  `BETA_ENGLISH_FALLBACK_KEYS`.
- Never put a Next navigation hook in `apps/web/src/components/link.tsx`. Many
  tests mount it without an App Router, and doing so breaks them in bulk with
  failures that look unrelated to the change.
- `features/marketing/components/editorial/tier-grid.test.tsx` and
  `features/marketing/locale-metadata-sweep.test.ts` are flaky under parallel
  load, not broken. Re-run before investigating.
- A full `next build` needs `NEXT_PUBLIC_SITE_ORIGIN` set (there is a deliberate
  guard that refuses to ship a localhost canonical) and several GB of free disk.
  Running out of disk mid-build corrupts the Turbopack cache and produces a
  spurious `Module not found: Can't resolve 'react'`; `rm -rf apps/web/.next`
  clears it.
