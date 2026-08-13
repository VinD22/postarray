# `components/motion`

GSAP-powered motion primitives (F4 of the redesign plan). All client
components (`'use client'`); all built on top of `@/lib/motion/gsap`, the
only file in the codebase that imports `gsap` directly.

## The two non-negotiable rules

1. **The global 1ms reduced-motion CSS override does not reach GSAP.** GSAP
   writes inline styles from a `requestAnimationFrame` loop, which CSS cannot
   touch. Every component here branches on `useMotionOk()` (which wraps
   `usePrefersReducedMotion` — SSR-defaults `true`) and renders the finished,
   static end state instead of animating to it.
2. **Never author hidden initial state in markup.** No `opacity-0` classes,
   no conditional `hidden` gated on JS. Server HTML is the finished page —
   what search engines, no-JS clients and reduced-motion visitors see. Hide
   or offset an element only from inside `useGSAP`, scoped to the component
   via the `useGSAP({ scope })` container-ref pattern.

## Marketing-tier by default

These components are the marketing choreography kit. In-app product code
(`apps/web/src/components/**` outside `(marketing)`, `apps/web/src/features/**`
app screens) may freely import `<CountUp>`, `<Reveal>`, `<StaggerList>` and
`<PageTransitionProvider tier="app">` — none of them pull in `SplitText` or a
scroll-driven `ScrollTrigger` scene. `<KineticHeadline>`, `<Marquee>` and
`<PinnedScene>` stay on the marketing surface, with one named exception: the
onboarding receipt heading (`components/onboarding/done-step.tsx`, WP-4) — the
one moment in the signed-in product that is deliberately a celebration, not a
working screen. Do not reach for `KineticHeadline` elsewhere in-app without
updating this note.

`<Magnetic>` / `<MagneticButton>` are marketing-tier by default (pointer-follow
flourish is a marketing device), with two named exceptions: the app shell's
persistent compose action (`components/shell/compose-button.tsx`, WP-5) — the
product's single loudest, most-repeated control — and the onboarding receipt's
"Go to Home" action (`components/onboarding/done-step.tsx`, WP-4), the single
button that ends the first-run flow. Do not reach for `Magnetic` elsewhere
in-app without updating this note.

### The three expressive moments in the signed-in product (Track B, phase 4)

The app tier is **fast**: 120-200ms. Loud in-app means better choreography,
not longer duration — a slow app is never delightful no matter how pretty it
is. The expressive tier (400-900ms) is permitted at exactly three moments, and
`components/home/app-motion-tier.test.ts` is the gate that keeps it at three.
It scans every file under `components/home`, `components/empty`,
`components/onboarding`, `features/calendar`, `features/receipts` and
`features/composer`, reads their _import specifiers_ from
`@/components/motion`, and fails on any expressive primitive outside this
list. Adding a fourth moment means arguing for it here and adding it there.

1. **Publish and live success** — `features/receipts/publish-celebration.tsx`.
   One `<CelebrationBurst tier="lg">` per campaign, fired only for a
   publication that genuinely just happened (`isFreshPublication`, a five
   minute window read once in a state initialiser, so a refetch that lands a
   second destination settles that row's badge instead of firing a second
   burst). Everything else on that panel is fast: the card slams in at 200ms
   on a back-out, and each destination's `LiveBadge` settles as that platform
   answers. The receipts arriving are the animation. **No sound**, and no
   toggle for one — the same test asserts no `<audio>` and no `new Audio(`
   anywhere on these surfaces.
2. **Onboarding completion** — `components/onboarding/done-step.tsx`. Already
   listed above for `KineticHeadline` and `MagneticButton`; its burst is now
   the shared `<CelebrationBurst tier="lg">` rather than the retired
   single-purpose `ConfettiBurst`, so finishing onboarding and landing a first
   cross-post look like the same moment, because they are.
3. **First-run empty states** — `components/empty/empty-scene.tsx`. Permitted
   the expressive tier and currently declining it: the line-art stroke draw-in
   runs at 200ms per stroke, 40ms apart. The gate asserts that too, so if it
   ever reaches for the expressive tier the change gets argued for rather than
   absorbed by the permission.

Everything else this phase added stays inside the fast tier by construction:
the calendar's drag lift and release settle (120ms), its one-time today pulse
and first-paint week fill (200ms strokes, 40ms apart, both guarded by a
`useRef` so a filter change or a drag never replays them), the composer's
`Flip` step thumb (120ms), and Home's stat numerals (200ms, no
`ScrollTrigger`, which is why they are a local tween rather than `<CountUp>`
at 900ms).

`<PageTransitionProvider>` has a third tier, `tier="onboarding"` (WP-4): a
springy 24px inline-end slide + fade, used only by `(onboarding)/layout.tsx`
to carry the step rail's own forward motion into the content pane between
onboarding's six steps. Product screens outside onboarding use `tier="app"`.

The `Flip` plugin is registered in `lib/motion/gsap.ts` alongside the rest and
is app-safe to import directly from there (not just via a `components/motion`
wrapper) for chrome-level sliding indicators that have no marketing
equivalent — the primary nav's active-item marker, the mobile tab bar's dot,
segmented-control thumbs, and similar (WP-5, WP-2, WP-7), plus the composer's
target-rail marker and its mobile step thumb (`features/composer`, Track B
phase 4). Every such use still branches on `useMotionOk()` and renders the
finished position with no animation when motion is off, exactly like the
components above, and every one of them positions the indicator from measured
bounding rects so it lands correctly under `dir="rtl"` with no
logical/physical branch.

`Flip` is for an element that persists across a layout change. The composer's
master-to-variant **pane** swap is not one: React replaces that subtree
outright, so there is nothing for `Flip` to track between states. That switch
keeps `components/pane-transition.tsx` (a 160ms logical slide on the incoming
pane), and the thing that actually moves between master and variant — the
rail's active marker — is the `Flip` above.

GSAP chunks load via client leaves, so marketing pages
stay RSC.

## Components

| Component                     | Notes                                                                                                                                                                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Reveal`                      | Fade + rise on scroll enter. App-safe.                                                                                                                                                                                      |
| `StaggerList`                 | One timeline staggering `[data-stagger-item]` children in. App-safe.                                                                                                                                                        |
| `KineticHeadline`             | `SplitText` rise/rotate per word or char; always falls back to `words` for RTL and CJK (`zh`/`ja`/`ko`) locales; `split.revert()` runs on every cleanup.                                                                    |
| `Marquee`                     | Duplicated `aria-hidden` track looping via `xPercent`; direction resolves against `dir`, not raw left/right.                                                                                                                |
| `PinnedScene`                 | ScrollTrigger pin + scrubbed crossfade timeline. Max 1-2 per page.                                                                                                                                                          |
| `Magnetic` / `MagneticButton` | `gsap.quickTo` pointer-follow with elastic return; `(pointer: fine)` only, via `useMotionOk({ requireFinePointer: true })`.                                                                                                 |
| `CountUp`                     | Tweens a numeric proxy, snapped to whole numbers; caller supplies `format` (typically a locale-bound `Intl.NumberFormat`).                                                                                                  |
| `PageTransitionProvider`      | Fades new route content in on `usePathname()` change — opacity only for `tier="marketing"` (≤300ms), opacity + 8px rise for `tier="app"` (120ms), opacity + logical 24px slide for `tier="onboarding"` (400ms, `back.out`). |

## The scene vocabulary

The second-generation loud system. Marketing-tier, except `LiveBadge`.

Every one of these is **budgeted per page** by
`features/marketing/components/scene/scene-budget.test.ts`. Read that file
before reaching for one. A device you cannot fit in the budget is a device the
page does not get; the budget is the whole reason loud was allowed back.

| Component          | Notes                                                                                                                                                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SceneSequencer`   | Auto-advancing looping tour on one master timeline. Server HTML is the whole walkthrough as a labelled `<ol>`; JS collapses it to an overlaid stage. Auto-pauses off-screen, on `visibilitychange`, and on `focusin`. Requires `controlLabels` (WCAG 2.2.2). Max 1/page.  |
| `ScrollScene`      | Composition **over** `PinnedScene` (which is kept, not replaced): adds scrubbed `onProgress`, named beats via `data-scene-beat`, and background interpolation between two documented **tokens** (`--…` template-literal type, so a raw hex will not compile). Max 1/page. |
| `ParallaxLayer`    | Scrubbed `yPercent` on a wrapper, `depth` clamped to ±0.3, transform only. Motion off returns children **unwrapped** — no element at all. Only valid inside a `ScrollScene`.                                                                                              |
| `CelebrationBurst` | Deterministic radial burst, `tier="sm"` (12 pieces) or `"lg"` (24), coloured from the three accent families; one burst per `trigger` value. Renders **nothing** under reduced motion — celebration is additive, so absence is the correct fallback.                       |
| `LiveBadge`        | Dot + required label. CSS-driven (`relay-dot-settle` + `relay-icon-draw`), so the global 1ms override handles reduced motion with no JS branch and it is cheap enough for the **fast in-app tier**. Animates only on the false→true transition.                           |

## Performance budget

Not aspirations. These are the constraints the scene vocabulary was designed
against, and the reason it can be this loud without costing anything.

- **Transform and opacity only.** Nothing in a scrub or a tick may animate a
  property that triggers layout or paint — no `width`, `height`, `top`,
  `margin`, `box-shadow`. `ScrollScene`'s background interpolation is the one
  colour tween, and it runs on a single element that composites on its own.
- **`will-change` is GSAP's to set.** It manages the hint per tween and clears
  it when the tween ends. A hand-written `will-change` class stays on forever
  and pins a layer in memory for the life of the page.
- **No layout reads in scroll callbacks.** Every measurement happens once, at
  setup: `ScrollScene` resolves both background tokens and its beat names
  before the trigger exists; `SceneSequencer` reads `offsetHeight` once to size
  the collapsed stage. A `getComputedStyle` or `offsetHeight` inside `onUpdate`
  forces synchronous layout on a scroll frame and is the single easiest way to
  make a smooth scene stutter.
- **At most one pinned scene mounted per viewport.** Two pins compete for the
  same scroll distance and neither ends where the reader expects. Enforced by
  the scene budget, not by discipline.
- **The hero `<h1>` stays the LCP element, with its finished text server
  rendered.** No scene may sit above the hero, and no headline may be built by
  JS. `KineticHeadline` splits text that is _already there_; anything that
  renders a headline empty and fills it on mount moves LCP to whenever GSAP
  happens to run, which on a slow connection is seconds.
- **Auto-advancing motion stops when nobody is watching.** `SceneSequencer`
  pauses off-screen, on a backgrounded tab and on focus entering it. A looping
  timeline running in a background tab is a battery cost with no viewer.

## Supporting modules

- `@/lib/motion/gsap` — the only `gsap` import; registers `useGSAP`,
  `ScrollTrigger`, `SplitText`, `Flip` once and re-exports them.
- `@/lib/motion/constants` — GSAP-side mirror of the CSS motion tokens in
  `packages/design-system/src/tokens/theme.css` (durations in seconds, GSAP
  ease names). Keep the two in sync by hand.
- `@/lib/motion/use-motion-ok` — `useMotionOk()`: reduced-motion gate, with
  an optional `(pointer: fine)` requirement for pointer-only interactions.
- `./motion-test-media` — test-only support (never imported by shipped code).
  `src/test/setup.ts` installs a `matchMedia` that answers `false` to
  everything, so the DEFAULT answer to `(prefers-reduced-motion: reduce)` in a
  test is "motion is fine" and a test that ignores `matchMedia` exercises the
  animated path only. `mockMotionPreference` swaps it for one test so both
  paths get covered, and `hiddenStateClassesIn` / `inlineTransformsIn` are the
  two assertions every primitive here owes.

### One more note on ScrollTrigger in tests

`lib/motion/gsap.ts` registers `ScrollTrigger` only outside the test
environment — its header explains why (the plugin keeps a browser-global timer
alive past JSDOM teardown). An unregistered `ScrollTrigger.create()` **throws**,
while an unregistered `scrollTrigger` var is simply ignored with a warning. So
every scroll hookup in this directory goes through tween or timeline vars,
never `ScrollTrigger.create`, and the components stay renderable in a component
test rather than only in a browser. `SceneSequencer`'s off-screen watcher is a
tween on a throwaway proxy object for exactly this reason.
