import type { ElementType, ReactNode } from 'react';
import { cn } from '@relay/design-system/utils';

/**
 * The small-caps label that sits above a heading.
 *
 * This is the replacement for the loud system's informational `Sticker`: a
 * rotated, hard-outlined chip carrying a real fact ("Public prelaunch",
 * "Official APIs only") becomes a flat, level, small-caps line instead. The
 * fact survives; the poster does not.
 *
 * Purely decorative stickers have no editorial equivalent and are deleted at
 * the call site rather than replaced. Whitespace is the decoration now, so a
 * corner flourish that said nothing simply leaves the page.
 *
 * `tone`:
 *   `muted`   (default) tertiary ink, for an eyebrow on the paper canvas.
 *   `inherit` takes the surrounding surface's colour, for an eyebrow inside
 *             an inverted band where `text-text-tertiary` would be wrong.
 *
 * Rendered as a `<p>` by default. Pass `as="h2"` only when the eyebrow really
 * is the section's heading; an eyebrow above an `<h2>` is a label, not a
 * second heading, and promoting it would put a duplicate entry in the
 * document outline.
 */
export type EyebrowTone = 'muted' | 'inherit';

export interface EyebrowProps {
  readonly children: ReactNode;
  readonly as?: 'p' | 'span' | 'h2' | 'h3';
  readonly tone?: EyebrowTone;
  readonly id?: string;
  readonly className?: string;
}

const TONE_CLASS: Record<EyebrowTone, string> = {
  muted: 'text-text-tertiary',
  inherit: '',
};

export function Eyebrow({
  children,
  as = 'p',
  tone = 'muted',
  id,
  className,
}: EyebrowProps): ReactNode {
  const Tag = as as ElementType;
  return (
    <Tag
      id={id}
      className={cn(
        'text-label uppercase',
        // Letter-spacing, not a fake font-variant: the display face has no
        // real small-caps cut, so the small-caps *effect* is uppercase plus
        // open tracking, which stays legible after a 40% longer translation.
        'tracking-[0.14em]',
        TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
