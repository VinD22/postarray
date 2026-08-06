import type { ElementType, ReactNode } from 'react';
import { cn } from '@relay/design-system/utils';

/**
 * The loud system's card: a hard-outlined poster rather than a soft
 * elevated panel.
 *
 * `tone` maps to the same five semantic tones as `Band`/`Sticker`, so a
 * `PosterCard` reads correctly whichever band it sits on. Hover lifts the
 * card up and away from its own `shadow-hard`, revealing more of it
 * (`.relay-poster-card` in `globals.css`); the horizontal component of that
 * lift mirrors `--shadow-hard-x`, so it stays correct under `dir="rtl"` with
 * no second rule. The lift is plain CSS, no client JS, so a `PosterCard` by
 * itself never forces a Server Component's tree to become a client leaf.
 *
 * A press (mouse or `:focus-visible` activation) settles it straight back to
 * flush, matching `.relay-pressable`'s press recipe elsewhere in the system.
 */
export type PosterCardTone = 'paper' | 'brand' | 'cta' | 'pop' | 'ink';

const TONE_CLASS: Record<PosterCardTone, string> = {
  paper: 'bg-surface-raised text-text-primary',
  brand: 'bg-accent text-accent-on',
  cta: 'bg-cta text-cta-on',
  pop: 'bg-blush text-blush-on',
  ink: 'bg-surface-inverted text-text-inverted',
};

export interface PosterCardProps {
  readonly tone?: PosterCardTone;
  /** Renders as `<div>` by default; `<li>` inside a list, `<article>` for a self-contained unit. */
  readonly as?: 'div' | 'li' | 'article';
  readonly className?: string;
  readonly children: ReactNode;
}

export function PosterCard({
  tone = 'paper',
  as = 'div',
  className,
  children,
}: PosterCardProps): ReactNode {
  const Tag = as as ElementType;
  return (
    <Tag
      data-tone={tone}
      className={cn(
        'relay-poster-card border-border-bold shadow-hard rounded-lg border-2 p-6',
        TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
