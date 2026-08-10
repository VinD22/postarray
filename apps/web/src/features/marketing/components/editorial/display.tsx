import type { ElementType, ReactNode } from 'react';
import { cn } from '@relay/design-system/utils';

import { LineMaskHeadline } from './line-mask-headline';

/**
 * The editorial headline.
 *
 * Same three fluid display steps as the loud system's `LoudDisplay`
 * (`--text-display-lg/-xl/-2xl`), with two changes that make them read as
 * editorial rather than as poster: `uppercase` is gone as an option, because
 * setting a whole sentence in capitals is a volume control rather than a
 * hierarchy, and the text always comes out level.
 *
 * Colour is left to inherit rather than forced to `text-primary`: an
 * `EditorialDisplay` sits inside an inverted `EditorialSection` as often as it
 * sits on paper, and the surrounding surface already carries the right token.
 *
 * `reveal` hands rendering to `LineMaskHeadline` (per-line mask reveal on
 * scroll entry, plain heading under reduced motion). That belongs to the one
 * headline per page that carries the moment, normally the hero; every other
 * heading stays a plain server-rendered tag with zero client JS.
 */
export type EditorialDisplaySize = 'sm' | 'md' | 'lg';

const SIZE_CLASS: Record<EditorialDisplaySize, string> = {
  sm: 'text-display-lg',
  md: 'text-display-xl',
  lg: 'text-display-2xl',
};

export interface EditorialDisplayProps {
  /** Plain, already-translated text. `LineMaskHeadline` requires a string, not markup. */
  readonly children: string;
  readonly as?: 'h1' | 'h2' | 'h3' | 'p';
  readonly size?: EditorialDisplaySize;
  readonly reveal?: boolean;
  readonly className?: string;
}

export function EditorialDisplay({
  children,
  as = 'h1',
  size = 'md',
  reveal = false,
  className,
}: EditorialDisplayProps): ReactNode {
  const classes = cn('font-display text-balance', SIZE_CLASS[size], className);

  if (reveal) {
    return (
      <LineMaskHeadline as={as} className={classes}>
        {children}
      </LineMaskHeadline>
    );
  }

  const Tag = as as ElementType;
  return <Tag className={classes}>{children}</Tag>;
}
