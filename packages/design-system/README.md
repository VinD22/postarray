# @relay/design-system

The visual foundation of the Relay publishing desk: tokens, accessible
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

1. **Palette.** Raw ramps (`--relay-sand-*`, `--relay-petrol-*`). Never
   referenced outside `theme.css`.
2. **Semantic.** What a colour is _for_: `--surface-raised`, `--text-secondary`,
   `--accent-hover`, `--status-warning-border`. Redefined per theme.
3. **Utilities.** Tailwind `@theme` entries that point at layer 2, so
   `bg-surface-raised` resolves differently in each theme with no class churn
   and no `dark:` variant scattered through components.

A theme switch is one attribute on `<html>`.

### The character

A loud publishing desk: paper, electric blue and a sunshine CTA, with a
blush accent held in reserve. Hierarchy comes from huge display type, 2px ink
outlines and hard offset shadows, not from soft elevation. Product controls
still sit at tight, predictable density; the poster energy is in type, color
and the hard-shadow press, not in spacing.

Dark is designed, not inverted. It is an inky navy-black canvas carrying the
same neons: the accent lifts to a lighter blue so it reads on a dark ground,
and its destructive solid is a light coral carrying dark text instead of a
dark red carrying white text.

### Provider brand colours

Eleven provider colours exist as `--brand-*`. They are permitted on an 8px
identity dot and on a 1px rule. They are never a surface, never a button, and
never the only way a provider is identified: the account name is always beside
the dot.

### Motion

Two tiers. Functional, in-app motion stays 120-200ms, three named easings,
nothing animates for spectacle and nothing animates data. Expressive motion
(400-900ms) is reserved for marketing and overlay entrances/exits. **GSAP is
banned in this package** — it lives only in `apps/web/src/lib/motion`; this
package stays CSS-only so `@relay/design-system` keeps its `react` +
`@relay/i18n` dependency surface. `prefers-reduced-motion: reduce` collapses
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
- Yellow or pink used as text color. Yellow is the CTA fill (`--cta-*`, ink
  text on it); pink is the decorative blush accent (`--accent-blush-*`, ink
  text on it). Neither is ever a text color itself.
- A row of three identical icon-plus-heading-plus-text cards.
- A card for something that reads better as a row, a table, a timeline or a
  sentence. Six facts about one post are a `DefinitionList`, not six cards.
- Pill-shaped status overload, and deeply rounded table containers. Tables have
  no rounded wrapper at all.
- Decorative score widgets, gauges, progress rings and sparklines standing in
  for content.
- An eyebrow or kicker above a heading.

**Newly allowed:**

- Hard offset shadows, through the `--shadow-hard*` tokens only (never a
  hand-rolled `box-shadow`).
- Sharp 0-6px radii on product controls, plus the 20px poster radius
  (`--radius-editorial` / `--radius-poster`) for marketing surfaces.
- Loud CTA fills (`bg-cta`, `text-cta-on`) with the mandatory 2px
  `--border-bold` outline.
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

It reads the stored preference, resolves `system` against the media query, and
sets `data-theme` plus `color-scheme` on the root element before first paint.
`ThemeProvider` then takes over for runtime changes.
