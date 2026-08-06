import type { ElementType, ReactNode } from 'react';
import { KineticHeadline } from '@/components/motion';
import { cn } from '@relay/design-system/utils';

/**
 * The loud system's headline. Sets the display font at one of the three
 * fluid marketing steps foundation added in `theme.css`
 * (`--text-display-lg/-xl/-2xl`, clamp(2rem..4rem) through clamp(3.5rem..9rem)) —
 * the poster scale the rest of the site's `Display`/`Heading` never reaches.
 *
 * Text color is intentionally left to inherit rather than forced to
 * `text-primary`: a `LoudDisplay` is as often set inside a colored `Band`
 * (accent-on, cta-on, blush-on, text-inverted) as it is on plain paper, and
 * the surrounding surface already carries the correct token.
 *
 * `kinetic` hands rendering to `KineticHeadline` (chars/words rise + rotate
 * on scroll entry, reduced-motion renders the plain heading) — see that
 * component's doc comment for the split-mode/locale rules. Non-kinetic stays
 * a plain heading with zero client JS, which is what most section titles
 * should be; `kinetic` is for the one or two headlines per page that carry
 * the moment (typically the hero).
 */

export type LoudDisplaySize = 'lg' | 'xl' | '2xl';

const SIZE_CLASS: Record<LoudDisplaySize, string> = {
  lg: 'text-display-lg',
  xl: 'text-display-xl',
  '2xl': 'text-display-2xl',
};

export interface LoudDisplayProps {
  /** Plain, already-translated text. `KineticHeadline` requires a string, not markup. */
  readonly children: string;
  readonly as?: 'h1' | 'h2' | 'h3' | 'p';
  readonly size?: LoudDisplaySize;
  readonly uppercase?: boolean;
  readonly kinetic?: boolean;
  /** Forwarded to `KineticHeadline` when `kinetic` is set. */
  readonly split?: 'words' | 'chars';
  readonly className?: string;
}

export function LoudDisplay({
  children,
  as = 'h1',
  size = '2xl',
  uppercase = false,
  kinetic = false,
  split = 'words',
  className,
}: LoudDisplayProps): ReactNode {
  const classes = cn(
    'font-display text-pretty',
    SIZE_CLASS[size],
    uppercase && 'uppercase',
    className,
  );

  if (kinetic) {
    return (
      <KineticHeadline as={as} split={split} className={classes}>
        {children}
      </KineticHeadline>
    );
  }

  const Tag = as as ElementType;
  return <Tag className={classes}>{children}</Tag>;
}
