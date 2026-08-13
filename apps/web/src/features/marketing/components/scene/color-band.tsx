import type { ElementType, ReactNode } from 'react';
import { cn } from '@relay/design-system/utils';

import { Container } from '../layout';

/**
 * A full-bleed band whose ground is tinted in one of the two scene accent
 * families, with ink staying ink.
 *
 * This is deliberately NOT the inverted band. The inverted band flips the
 * page's whole figure/ground relationship and there is exactly one per page
 * (`editorial/inverted-band.test.ts`). A `ColorBand` only tints the ground of
 * one section: `--color-accent-*-subtle` is a documented surface tint, body
 * text keeps `--color-text-primary` on top of it, and both pairs are
 * contrast-verified in both themes by
 * `packages/design-system/src/tokens/contrast.test.ts`.
 *
 * Two per page, counted by `scene/scene-budget.test.ts`. Two can punctuate a
 * long page; three means the page is a colour swatch.
 *
 * ## Accent families
 *
 * `warm` marigold, `cool` ultramarine, `neutral` the sunken paper surface.
 * `neutral` is a real member of the set rather than an escape hatch: the
 * developer audience gets a mono treatment on purpose, and it still needs the
 * band's rhythm.
 *
 * ## `data-scene-accent`
 *
 * The band publishes its family on the DOM so the custom cursor can adopt it
 * while the pointer is inside (`components/cursor/custom-cursor.tsx` reads the
 * nearest `[data-scene-accent]` ancestor). This is the cleanest mechanism
 * available: no context crosses the RSC boundary, no cursor-side registry of
 * section rectangles has to be kept in sync with the layout, and there is
 * nothing to measure on a scroll frame.
 */
export type SceneAccent = 'warm' | 'cool' | 'neutral';

const GROUND_CLASS: Record<SceneAccent, string> = {
  warm: 'bg-accent-warm-subtle',
  cool: 'bg-accent-cool-subtle',
  neutral: 'bg-surface-sunken',
};

/**
 * The hairline that keeps the band from floating. A tinted ground alone is a
 * weak edge in the dark theme, where the tint is a near-black.
 */
const EDGE_CLASS: Record<SceneAccent, string> = {
  warm: 'border-accent-warm/25',
  cool: 'border-accent-cool/25',
  neutral: 'border-border-subtle',
};

/**
 * The class that paints a printed wash under a band's tint.
 *
 * The file itself is chosen in `globals.css`, not here, for the same reason
 * every other themed value in this codebase is: the theme is a `data-theme`
 * attribute rather than a media feature, so a component cannot pick the right
 * asset without shipping a script to read the attribute. A class whose
 * `background-image` is redefined under both dark selectors costs nothing and
 * loads exactly one file.
 *
 * Rule 3 of the gradient and texture policy in `theme.css` allows a texture at
 * or below 8% opacity over a token surface, on the grounds that below that
 * threshold it does not move measured contrast — which is why the contrast
 * gate can keep ignoring it and stay honest. That ceiling lives in the CSS
 * beside the images, and it is not a knob: a call site passes a boolean.
 */
const TEXTURE_CLASS: Record<Exclude<SceneAccent, 'neutral'>, string> = {
  warm: 'relay-band-wash-warm',
  cool: 'relay-band-wash-cool',
};

export interface ColorBandProps {
  readonly accent: SceneAccent;
  readonly as?: 'section' | 'div';
  readonly id?: string;
  /** Accessible name, for a band with no visible heading. */
  readonly ariaLabel?: string;
  /**
   * Print a wash under the tint. Off by default: a texture is punctuation,
   * and a page whose every band carries one has stopped punctuating anything.
   * `neutral` has none on purpose — the mono treatment is the point of it.
   */
  readonly texture?: boolean;
  /** Extra classes on the padded content wrapper, not the full-bleed band. */
  readonly containerClassName?: string;
  readonly className?: string;
  readonly children: ReactNode;
}

export function ColorBand({
  accent,
  as = 'section',
  id,
  ariaLabel,
  texture,
  containerClassName,
  className,
  children,
}: ColorBandProps): ReactNode {
  const Tag = as as ElementType;
  const wash = accent === 'neutral' || texture !== true ? null : TEXTURE_CLASS[accent];
  return (
    <Tag
      id={id}
      aria-label={ariaLabel}
      data-scene-accent={accent}
      className={cn(
        'text-text-primary relative w-full overflow-hidden border-y',
        GROUND_CLASS[accent],
        EDGE_CLASS[accent],
        className,
      )}
    >
      {/*
        A CSS background rather than an `<img>`: it is paper stock, not
        content, and a screen reader should no more meet it than it meets the
        band's tint.
      */}
      {wash === null ? null : (
        <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0', wash)} />
      )}
      <Container>
        <div className={cn('relative py-20 md:py-28', containerClassName)}>{children}</div>
      </Container>
    </Tag>
  );
}
