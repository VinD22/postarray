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

`<PageTransitionProvider>` has a third tier, `tier="onboarding"` (WP-4): a
springy 24px inline-end slide + fade, used only by `(onboarding)/layout.tsx`
to carry the step rail's own forward motion into the content pane between
onboarding's six steps. Product screens outside onboarding use `tier="app"`.

The `Flip` plugin is registered in `lib/motion/gsap.ts` alongside the rest and
is app-safe to import directly from there (not just via a `components/motion`
wrapper) for chrome-level sliding indicators that have no marketing
equivalent — the primary nav's active-item marker, the mobile tab bar's dot,
segmented-control thumbs, and similar (WP-5, WP-2, WP-7). Every such use
still branches on `useMotionOk()` and renders the finished position with no
animation when motion is off, exactly like the components above.

GSAP chunks load via client leaves, so marketing pages
stay RSC.

## Components

| Component                     | Notes                                                                                                                                                    |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Reveal`                      | Fade + rise on scroll enter. App-safe.                                                                                                                   |
| `StaggerList`                 | One timeline staggering `[data-stagger-item]` children in. App-safe.                                                                                     |
| `KineticHeadline`             | `SplitText` rise/rotate per word or char; always falls back to `words` for RTL and CJK (`zh`/`ja`/`ko`) locales; `split.revert()` runs on every cleanup. |
| `Marquee`                     | Duplicated `aria-hidden` track looping via `xPercent`; direction resolves against `dir`, not raw left/right.                                             |
| `PinnedScene`                 | ScrollTrigger pin + scrubbed crossfade timeline. Max 1-2 per page.                                                                                       |
| `Magnetic` / `MagneticButton` | `gsap.quickTo` pointer-follow with elastic return; `(pointer: fine)` only, via `useMotionOk({ requireFinePointer: true })`.                              |
| `CountUp`                     | Tweens a numeric proxy, snapped to whole numbers; caller supplies `format` (typically a locale-bound `Intl.NumberFormat`).                               |
| `PageTransitionProvider`      | Fades new route content in on `usePathname()` change — opacity only for `tier="marketing"` (≤300ms), opacity + 8px rise for `tier="app"` (120ms), opacity + logical 24px slide for `tier="onboarding"` (400ms, `back.out`). |

## Supporting modules

- `@/lib/motion/gsap` — the only `gsap` import; registers `useGSAP`,
  `ScrollTrigger`, `SplitText`, `Flip` once and re-exports them.
- `@/lib/motion/constants` — GSAP-side mirror of the CSS motion tokens in
  `packages/design-system/src/tokens/theme.css` (durations in seconds, GSAP
  ease names). Keep the two in sync by hand.
- `@/lib/motion/use-motion-ok` — `useMotionOk()`: reduced-motion gate, with
  an optional `(pointer: fine)` requirement for pointer-only interactions.
