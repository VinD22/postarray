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

A calm publishing desk. A warm neutral canvas, one accent, and semantic
warning, destructive, success and info. Hierarchy comes from typography and
from tonal surface steps separated by hairline borders, not from shadows.
Product controls sit at 6-10px radii and tight, predictable density.

Dark is designed, not inverted. Its surfaces are warm charcoals with a smaller
step delta, its accent is lifted so it reads on a dark ground, and its
destructive solid is a light coral carrying dark text instead of a dark red
carrying white text.

### Provider brand colours

Eleven provider colours exist as `--brand-*`. They are permitted on an 8px
identity dot and on a 1px rule. They are never a surface, never a button, and
never the only way a provider is identified: the account name is always beside
the dot.

### Motion

120-200ms, functional only, three named easings. Nothing animates for
spectacle and nothing animates data. `prefers-reduced-motion: reduce` collapses
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

- Purple or blue neon gradients, glowing orbs, glass panels, grid or dot
  backgrounds.
- Gradient headline text. Emphasis is weight and size.
- A row of three identical icon-plus-heading-plus-text cards.
- A card for something that reads better as a row, a table, a timeline or a
  sentence. Six facts about one post are a `DefinitionList`, not six cards.
- Oversized rounded rectangles everywhere. Product controls stay at 6-10px.
- Pill-shaped status overload, and deeply rounded table containers. Tables have
  no rounded wrapper at all.
- Heavy drop shadows. Elevation is a border plus a surface step. Only overlays
  get a shadow, and it carries an offset and a blur.
- Decorative score widgets, gauges, progress rings and sparklines standing in
  for content.
- Emoji as iconography. Icons come from `lucide-react`, one set, one weight.
- Fake dashboards, invented metrics, fabricated testimonials, placeholder logos.
- Animation that slows down composing, reviewing or scheduling.
- An eyebrow or kicker above a heading.

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
