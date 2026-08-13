# `features/marketing/components/scene`

The scene vocabulary: the choreography layer of the "loud and alive" pass.

## What this directory is for

The primitives themselves live in `apps/web/src/components/motion` — they are
generic and app-safe to import. This directory holds the **governance** and the
marketing-only compositions built on top of them.

The governance file is the point, and it comes first:

- **`scene-budget.test.ts`** — a per-page ceiling on every loud device, read
  straight out of the page sources. One pinned `ScrollScene`, up to two
  `ColorBand`s, at most one `Marquee`, one `SceneSequencer`, and
  `ParallaxLayer` only inside a `ScrollScene`. Ordinary pages get less than
  that; home gets the full allowance, argued for in the override table.

The compositions it governs (Track B phase 3):

- **`color-band.tsx`** — a full-bleed band whose ground is tinted in one accent
  family while the ink stays ink. Not the inverted band, which flips
  figure/ground and is capped at one per page by `editorial/
  inverted-band.test.ts`. Publishes `data-scene-accent`, which is what the
  custom cursor reads to adopt the band's accent.
- **`gradient-wash.tsx`** — a decorative duotone layer, stops inside one family,
  fading to transparent at the edge placements so no running copy sits on the
  ramp (the gradient policy in `theme.css`, rule 1).
- **`sticker.tsx`** — a chip rotated at most 3 degrees, with `fact` and `source`
  both required. The v1 sticker was deleted for being decorative; this one
  cannot be empty, because an empty one does not compile.
- **`tour-indicator.tsx`** — shared "2 of 5" progress for any multi-beat scene.
  Visible text beside the dots, never colour alone.

## Why a budget rather than a style guide

This product already had a loud system once and deleted it. It was not deleted
because the individual devices were bad — a poster card is a fine thing — but
because nothing stopped them accumulating until every section was shouting and
none of them meant anything. `editorial/inverted-band.test.ts` still holds the
empty allow-list that keeps that vocabulary dead.

The scene vocabulary is the second attempt. What makes it a genuinely different
attempt is not better taste, which cannot be enforced, but a number per page
that a test can read. Loud is a budget to spend, not a texture to apply.

**If a page will not fit in its budget, the answer is to take a device out.**
The override table exists to record one argued exception, and no override may
exceed `VOCABULARY_CEILING` — raising that is a redesign, not a budget edit.

## Colour

Scenes draw on the two accent families added for this pass:
`--accent-warm-*` (marigold: energy, celebration, highlight) and
`--accent-cool-*` (ultramarine: "live" and published moments). Terracotta stays
the product accent and keeps carrying links, focus and selection.

Every step of both families is contrast-verified in both themes by
`packages/design-system/src/tokens/contrast.test.ts`. Gradients and textures
cannot be gate-checked at all, so they are governed by the written policy in
the `theme.css` header instead — read it before painting anything: body text
never sits on a gradient, display text over a gradient passes AA against both
extreme stops, texture overlays stay at or below 8% opacity, and there is no
arbitrary hex anywhere.

## Not built yet

`ColorBand` does not exist on disk. The budget counts it already, on purpose:
the ceiling should be in place before the component that needs it, not after.
