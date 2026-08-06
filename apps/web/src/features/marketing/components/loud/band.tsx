import type { ElementType, ReactNode } from 'react';
import { cn } from '@relay/design-system/utils';

import { Container } from '../layout';

/**
 * The full-bleed, color-blocked section.
 *
 * `Band` is the editorial answer to `Section`: instead of a hairline dividing
 * two quiet columns, a `Band` is an edge-to-edge block of one of the brand
 * tones. `data-tone` carries the choice onto the DOM so a future surface can
 * key off it without a second prop, and every tone maps only to semantic
 * tokens, never to a literal color, so both themes stay correct automatically:
 *
 *   paper  -> `surface-canvas` / `text-primary`   the quiet default
 *   brand  -> `accent` / `accent-on`               ink block (light) / paper block (dark)
 *   cta    -> `cta` / `cta-on`                      warm paper-tint block
 *   pop    -> `blush` / `blush-on`                  warm paper-tint block
 *   ink    -> `surface-inverted` / `text-inverted`  the honesty/boundary tone
 *
 * `cta` and `pop` are full-viewport fills of warm paper tints. In dark theme
 * `.relay-band-cta` / `.relay-band-pop` in `globals.css` fold the fill toward
 * the dark canvas with `color-mix()` so a full-bleed tint reads as confident,
 * not washed out. `brand` and `ink` need no such remap: `accent` and
 * `surface-inverted` are already designed per-theme, so the raw semantic
 * token is correct as-is in both themes.
 *
 * `divider="zigzag"` stamps a torn-paper edge at the band's block-end, in the
 * `--border-bold` ink outline color, between bands (see `ZigzagEdge`, also
 * used standalone by `SiteFooter` at its block-start).
 */

export type BandTone = 'paper' | 'brand' | 'cta' | 'pop' | 'ink';

const TONE_CLASS: Record<BandTone, string> = {
  paper: 'bg-surface-canvas text-text-primary',
  brand: 'bg-accent text-accent-on',
  cta: 'relay-band-cta text-cta-on',
  pop: 'relay-band-pop text-blush-on',
  ink: 'bg-surface-inverted text-text-inverted',
};

export interface BandProps {
  readonly tone?: BandTone;
  readonly divider?: 'zigzag' | 'none';
  /** Renders as `<section>` by default; `<div>` when nested inside another landmark. */
  readonly as?: 'section' | 'div';
  readonly id?: string;
  readonly ariaLabel?: string;
  readonly className?: string;
  /** Extra classes on the padded content wrapper, not the full-bleed band itself. */
  readonly containerClassName?: string;
  readonly children: ReactNode;
}

export function Band({
  tone = 'paper',
  divider = 'none',
  as = 'section',
  id,
  ariaLabel,
  className,
  containerClassName,
  children,
}: BandProps): ReactNode {
  const Tag = as as ElementType;
  return (
    <Tag
      id={id}
      aria-label={ariaLabel}
      data-tone={tone}
      className={cn('relative w-full', TONE_CLASS[tone], className)}
    >
      <Container>
        <div className={cn('py-14 md:py-20 lg:py-24', containerClassName)}>{children}</div>
      </Container>
      {divider === 'zigzag' ? <ZigzagEdge position="end" /> : null}
    </Tag>
  );
}

/**
 * The torn/poster-cut zigzag edge, in the `--border-bold` ink outline color.
 *
 * `position="end"` (the default, used by `Band`) sits it at the block-end
 * edge, straddling the seam with whatever comes next. `position="start"` is
 * for a surface that wants the same seam at its own top edge without owning
 * a full `Band` — `SiteFooter` uses this to read as torn from the CTA slab
 * above it.
 */
export function ZigzagEdge({
  position = 'end',
  className,
}: {
  readonly position?: 'start' | 'end';
  readonly className?: string;
}): ReactNode {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 8"
      preserveAspectRatio="none"
      className={cn(
        'pointer-events-none absolute inset-x-0 block h-2 w-full',
        position === 'end' ? 'bottom-0 translate-y-1/2' : 'top-0 -translate-y-1/2',
        className,
      )}
    >
      <polygon
        points="0,8 4,0 8,8 12,0 16,8 20,0 24,8 28,0 32,8 36,0 40,8"
        style={{ fill: 'var(--border-bold)' }}
      />
    </svg>
  );
}
