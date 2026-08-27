# @relay/design-system

The visual foundation of the Post Array publishing desk: tokens, accessible
primitives, product patterns and hooks.

```ts
import '@relay/design-system/styles.css';

import { Button, Field, Input } from '@relay/design-system/primitives';
import { StatusPill, MetricValue } from '@relay/design-system/patterns';
import { useTheme, useAnnouncer } from '@relay/design-system/hooks';
import { lightTheme, contrastRatio } from '@relay/design-system/tokens';
```

We ship TypeScript source. There is no build step: the consuming app
transpiles it.

## Token philosophy

Three layers, and component code may only touch the third.

1. **Palette.** Raw ramps (`--relay-paper-*`, `--relay-ink-*`,
   `--relay-charcoal-*`, `--relay-terracotta-*`, `--relay-vermilion-*`,
   `--relay-marigold-*`, `--relay-ultramarine-*`, and the status ramps). Never
   referenced outside `theme.css`.
2. **Semantic.** What a colour is _for_: `--surface-raised`, `--text-secondary`,
   `--accent-hover`, `--status-warning-border`. Redefined per theme.
3. **Utilities.** Tailwind `@theme` entries that point at layer 2, so
   `bg-surface-raised` resolves differently in each theme with no class churn
   and no `dark:` variant scattered through components.

A theme switch is one attribute on `<html>`.

### The character

An editorial publishing desk. Warm paper (`#FFFCF8`), near-black ink
(`#141413`), generous whitespace, hairline rules. Hierarchy comes from type
and space and tonal surface steps, not from heavy shadows or neon fills.

**The navigational accent is a deep terracotta** (`#B4462B` light, lightened to
`#E07A5F` dark). It carries links, focus rings, text selection, the active tab
and the calendar "today" marker. It is deliberately _not_ a button fill, so
colour reads as navigation and state rather than as a call to action.

**The action accent is a vivid vermilion** (`#CE2700` light, `#FF6D32` dark).
It fills the primary commit button and nothing else. This is a change: the
commit fill used to be ink. On a product about social media the one button a
visitor is asked to press should be the loudest surface on the screen, and an
ink rectangle is not. Navigation and action are now two different reds, and
they are measurably different — ΔE\*ab 27.2 in light, 30.2 in dark, roughly
twice the separation of the deliberate near-neighbours the palette already
carries.

**Four accent families**, all sharing one token set, and nothing else may join:

| Family | Tokens | Light / dark | For |
| --- | --- | --- | --- |
| Terracotta | `--accent-*` | `#B4462B` / `#E07A5F` | Links, focus, selection, state |
| Vermilion | `--accent-action-*` | `#CE2700` / `#FF6D32` | The primary commit button, and nothing else |
| Marigold | `--accent-warm-*` | `#8A6100` / `#F5C233` | Energy, celebration, highlight |
| Ultramarine | `--accent-cool-*` | `#3B4CC0` / `#8B9BF4` | The cool counterweight: "live" and "published" moments |

All four mirror the same token set (`default` / `hover` / `active` /
`subtle-bg` / `subtle-bg-hover` / `on-accent`), so a surface that can be tinted
with one can be tinted with any, and `accentFamilyPairs` in `tokens.ts`
generates the same thirteen contrast assertions for each. None carries a status
meaning: status stays success / warning / destructive / info, and status is
never colour alone.

Two of the four light steps are calculated rather than picked by eye, and both
came out darker than the eye wanted. A brighter marigold reads 3.63:1 on white.
A vermilion at `#E5401F` carries white at only 4.13:1, and at `#FF4A24` at
3.36:1 — under the body floor for the label the button actually has, so the
ramp walked down in luminance until white cleared it (5.36:1) and then back out
to the most chromatic value available there.

The vermilion button's focus ring is still terracotta and still `outline-offset`,
which is the only reason it is visible: terracotta drawn _on_ the vermilion fill
measures 1.02:1. Do not give the primary button an inset focus ring.

`--cta-*` and `--accent-blush-*` survive as small-control fills (the calendar
view switch, the growth plan tabs, the "today" cell). They are warm paper tints
(`#EDE8E0`), not the sunshine yellow and bubblegum pink they were named for,
and ink is still the only foreground either one carries.

Dark is designed, not inverted: a warm near-black canvas with paper-ink text,
a terracotta lifted so it reads on the dark ground, and a destructive solid
that is a light coral carrying dark text rather than a dark red carrying white
text.

Radii are near-square (0/2/4/6/8px) with one 20px poster radius
(`--radius-editorial` / `--radius-poster`) for marketing surfaces. Elevation is
quiet: tonal steps plus soft, diffuse shadows. The `--shadow-hard*` tokens keep
their names for compatibility but now resolve to soft, low-contrast shadows
rather than offset blocks.

### Provider brand colours

Nineteen provider colours exist as `--brand-*`, one per `ProviderKey`. They are
permitted in exactly three places:

1. An 8px identity dot.
2. A 1px rule.
3. **A provider logo at logo scale, inside a provider row or grid** — amended
   in, deliberately, and no further. A row of real marks in their real colours
   is the one glance that tells a visitor which networks we publish to, and a
   row of monochrome dots cannot do it.

The third one carries conditions, and they are the same conditions the dot has
always carried:

- The mark is a logo or glyph, never a block of colour.
- Its name is present as text in the same row or grid cell, so colour is never
  the sole identifier — which is what keeps the row working under colour
  blindness and under a monochrome print stylesheet.
- It never becomes a page surface: no brand-coloured band, card, button or
  section background, in any theme.

Everything outside those three lines is still banned.

### Motion

Two tiers. Functional, in-app motion stays 120-200ms, three named easings,
nothing animates for spectacle and nothing animates data. Expressive motion
(400-900ms) is reserved for marketing and overlay entrances/exits. **GSAP is
banned in this package** — it lives only in `apps/web/src/lib/motion`; this
package stays CSS-only, so a component here animates without a JS branch and
the global reduced-motion override actually reaches it.
`prefers-reduced-motion: reduce` collapses
every transition and animation to 1ms globally, and `usePrefersReducedMotion`
covers the cases CSS cannot reach.

### Direction

Everything uses logical properties: `ps-*`/`pe-*`, `start-*`/`end-*`,
`border-s`/`border-e`, `text-start`. RTL is a `dir="rtl"` attribute and nothing
else. No component contains `left`, `right`, `ml-` or `pr-`.

## The accessibility bar

WCAG 2.2 AA is a merge requirement here, not a follow-up ticket.

- **Contrast.** Every documented token pair is asserted at 4.5:1 for body text
  and 3:1 for large text and control boundaries, in both themes, by
  `src/tokens/contrast.test.ts`. The computed ratios are recorded in the header
  of `theme.css`. Changing a colour without updating both fails the build.
- **Keyboard.** Every interactive component is reachable and operable from the
  keyboard, with a visible 2px accent focus ring set outside the control's own
  border. No drag-only operation exists anywhere in the product.
- **Never colour alone.** Status, capability and freshness all carry an icon
  and a word in addition to a tone.
- **Tooltips are never the only source of a critical fact.** They repeat or
  shorten something already on the page.
- **Announcements.** Save state, validation changes, upload progress, schedule
  confirmation and publish results go through `useAnnouncer`. Polite for
  progress and confirmations, assertive for failures.
- **Targets.** 44px minimum on coarse pointers, achieved without inflating
  desktop density.
- **Zoom and reflow.** Everything works at 360px wide and at 200% zoom with no
  horizontal page scroll. Wide content scrolls inside its own container.
- **Missing data is never zero.** `MetricValue` renders a word and a reason
  when a number is unavailable.

## Banned patterns

These are not style preferences. A review rejects them.

**Still banned:**

- Emoji as iconography. Icons come from `lucide-react`, one set, one weight.
- Gradient headline text. Emphasis is weight and size.
- Glowing orbs and glass panels.
- Fake dashboards, invented metrics, fabricated testimonials, placeholder logos.
- Animation that slows down composing, reviewing or scheduling.
- Color alone carrying status, capability or freshness. Every state also
  carries an icon and a word.
- Sub-AA color pairs. Every documented pair clears 4.5:1 (body text) or 3:1
  (large text and control boundaries) in both themes.
- Physical direction props and utilities (`left`, `right`, `ml-`, `pr-`).
  Logical properties only.
- `dark:` Tailwind variants anywhere. Themes are redefined CSS vars under
  `[data-theme]`.
- Yellow or pink used as text color. `--cta-*` and `--accent-blush-*` are
  small-control fills carrying ink (`--cta-on` / `--accent-blush-on`); in the
  editorial system both resolve to warm paper tints rather than the yellow and
  pink they are named for. Neither is ever a text color itself, whatever hue it
  currently holds.
- A row of three identical icon-plus-heading-plus-text cards.
- A card for something that reads better as a row, a table, a timeline or a
  sentence. Six facts about one post are a `DefinitionList`, not six cards.
- Pill-shaped status overload, and deeply rounded table containers. Tables have
  no rounded wrapper at all.
- Decorative score widgets, gauges, progress rings and sparklines standing in
  for content.
- An eyebrow or kicker above a heading.

**Newly allowed:**

- Elevation through the shadow tokens only (never a hand-rolled `box-shadow`).
  The `--shadow-hard*` names are historical: they resolve to soft, diffuse
  shadows, not offset blocks.
- Sharp 0-8px radii on product controls, plus the 20px poster radius
  (`--radius-editorial` / `--radius-poster`) for marketing surfaces.
- CTA fills (`bg-cta`, `text-cta-on`) with the mandatory 2px `--border-bold`
  outline, on small controls only.
- The two scene accent families (`--accent-warm-*` marigold, `--accent-cool-*`
  ultramarine) on marketing scene surfaces, inside the per-page ceilings in
  `apps/web/src/features/marketing/components/scene/scene-budget.test.ts`.
- A chromatic primary button: `--accent-action-*` vermilion with
  `--accent-action-on-accent` on top. One per screen — a second vermilion
  surface stops the first one meaning "press this".
- Provider brand colour at logo scale in a provider row or grid, under the
  three conditions above.
- Kinetic, decorative marketing motion, always behind a
  `prefers-reduced-motion` gate.
- Marquees.
- Big display type.

## No English in this package

There is no user-visible English string literal anywhere in `src`. Every label,
description, error, accessible name and empty-state sentence is a required prop
supplied by the caller from `@relay/i18n`. This is enforced by review, and it is
what makes a locale addition a catalog file rather than a refactor.

The exceptions are non-linguistic: keyboard symbols in `Kbd` (⌘ is ⌘ in every
locale), `data-*` attributes, and test fixtures.

## Adding a component

1. **Check it is needed.** If two screens want slightly different versions of
   the same thing, that is one component with a variant, not two components.
2. **Decide the layer.** `primitives/` is a generic accessible control that
   knows nothing about publishing. `patterns/` composes primitives into
   something the product means, and may know about publish states, capabilities
   and providers.
3. **One file, one concept**, under ~300 lines, named export only, `'use client'`
   at the top if it has state or handlers.
4. **Write the logic first**, then style it. Prefer a Radix primitive over
   hand-rolling focus management; a hand-rolled listbox has a keyboard bug you
   have not found yet.
5. **Forward the ref** and spread the rest of the props, so a caller is never
   blocked by a prop you did not anticipate.
6. **Style with `cva` variants** and merge `className` last through `cn` so a
   caller can always override.
7. **Take every user-visible string as a prop.** If a component needs a default
   label, it needs a required prop instead.
8. **Use the semantic tokens.** No hex values, no `dark:` variants, no
   `--relay-*` palette references.
9. **Logical properties only.**
10. **Colocate a test** as `component.test.tsx` covering render, keyboard
    operation and the ARIA relationships. Export it from the layer's
    `index.ts`.
11. **Check the five states**: loading, empty, error, disabled, and the state
    where the data is partially available. If the component cannot express one
    of them, say so in its doc comment.

## Layout

```text
src/
  tokens/       theme.css, tokens.ts, contrast.ts, contrast.test.ts
  primitives/   accessible controls
  patterns/     product-level compositions
  hooks/        theme, media queries, announcements, hotkeys, controllable state
  utils/        cn, shared class fragments
  styles.css    the single stylesheet entry point
```

## Theme bootstrap

To avoid a flash of the wrong theme, inject `themeBootstrapScript` as the first
script in `<head>`, before any stylesheet:

```tsx
import { themeBootstrapScript, ThemeProvider } from '@relay/design-system/hooks';
```

The preference is `light` or `dark`; there is no `system` value. The script
reads the stored preference, falls back to `prefers-color-scheme` only when
nothing is stored, and sets `data-theme` plus `color-scheme` on the root
element before first paint. `ThemeProvider` then takes over for runtime
changes.
