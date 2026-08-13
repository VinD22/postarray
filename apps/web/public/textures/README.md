# Textures

Four abstract risograph washes, used by `ColorBand`'s opt-in `texture` prop
(`src/features/marketing/components/scene/color-band.tsx`) and painted by the
`.relay-band-wash-*` classes in `src/app/globals.css`.

| File | Ground | Wash | Used when |
| --- | --- | --- | --- |
| `wash-warm-light.avif` | warm cream paper | terracotta into antique gold, from the left edge | `accent="warm"`, light theme |
| `wash-warm-dark.avif` | warm charcoal | coral into gold, from the top left | `accent="warm"`, dark theme |
| `wash-cool-light.avif` | warm cream paper | blue-violet into terracotta, top-left corner | `accent="cool"`, light theme |
| `wash-cool-dark.avif` | warm charcoal | periwinkle into coral, top-left corner | `accent="cool"`, dark theme |

`neutral` has no texture on purpose. The mono treatment is the point of it.

## The rules these files exist under

**They may not carry a claim.** Every one is an abstract wash: no object, no
figure, no letter, no interface. This repository does not ship a drawn or
generated picture of the product, because a rendered interface is a claim about
what the product does, and a generated one is a claim nobody checked. The
screenshots on the marketing pages are real server-rendered panels
(`src/features/demo/panels/`), and that is the only kind of product imagery
here.

**They stay at or below 8% opacity.** That is rule 3 of the gradient and
texture policy in `packages/design-system/src/tokens/theme.css`, and the reason
is mechanical rather than aesthetic: below that threshold the texture does not
move measured contrast, so `contrast.test.ts` can go on measuring the flat
token underneath and still be telling the truth about what a reader sees. The
opacity is set in `globals.css`, not on the element, so a call site cannot
raise it.

**They stay small.** 14–54KB each, AVIF, 1280px wide. They render at 8% under a
tint, so resolution beyond that buys nothing a reader can see. Anything added
here should hold to the same ceiling: images ≤150KB.

**One file loads per band.** The theme is a `data-theme` attribute rather than a
media feature, so a component cannot pick the right asset without shipping a
script to read the attribute. The class-per-family approach in `globals.css`
lets CSS choose instead, which is why there is no `<picture>` here.

## Provenance

Generated with Recraft V4.1 (`model_type: utility`) via the Higgsfield MCP
server on 13 August 2026, prompted with the exact shipped palette hexes —
`#FFFCF8` paper, `#0F0F0E` charcoal, `#B4462B` / `#E07A5F` terracotta,
`#8A6100` / `#F5C233` marigold, `#3B4CC0` / `#8B9BF4` ultramarine — so the
washes sit in the same colour world as the tokens rather than near it.

Regenerating one is a design decision, not a refresh: these are the grounds two
pages are composed against. If you replace a file, keep the composition
(a wash entering from one edge and fading to clean ground) — a centred mass
reads as a stain behind the text column, which is exactly what the first
attempt at `wash-warm-light` did and why it was discarded.
