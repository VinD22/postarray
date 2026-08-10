import type { ElementType, ReactNode } from 'react';
import { cn } from '@relay/design-system/utils';

/**
 * The editorial card: a hairline-bordered panel that lifts slightly on hover.
 *
 * This replaces the loud system's `PosterCard`, whose 2px ink outline and hard
 * offset shadow were drawn for a poster palette. Rendered in the muted
 * terracotta-on-paper tokens those outlines read as the loud system wearing
 * grey, so the surface treatment changes completely: one hairline border, a
 * soft raised shadow, and a two pixel lift into a deeper shadow on hover over
 * ~200ms.
 *
 * The lift is a plain CSS transition, not GSAP, for two reasons. It never
 * forces a Server Component's tree to become a client leaf, and the global
 * `prefers-reduced-motion` override in `theme.css`
 * (`transition-duration: 1ms !important`) already neutralizes it, so this
 * component needs no reduced-motion branch of its own. Only rAF-driven GSAP
 * timelines need the `useMotionOk` hook.
 *
 * The lift is vertical only, so nothing needs mirroring under `dir="rtl"` —
 * unlike the poster card, whose horizontal component had to track
 * `--shadow-hard-x`.
 *
 * `interactive` is on by default. Turn it off for a card that is a container
 * rather than a target (a price block, a terminal transcript): a surface that
 * lifts under the pointer but does nothing when clicked is a false
 * affordance.
 */
export type EditorialCardTone = 'raised' | 'sunken' | 'inverted';

const TONE_CLASS: Record<EditorialCardTone, string> = {
  raised: 'bg-surface-raised text-text-primary border-border-default',
  sunken: 'bg-surface-sunken text-text-primary border-border-subtle',
  inverted: 'bg-surface-inverted text-text-inverted border-transparent',
};

export interface EditorialCardProps {
  readonly tone?: EditorialCardTone;
  /** Renders as `<div>` by default; `<li>` inside a list, `<article>` for a self-contained unit. */
  readonly as?: 'div' | 'li' | 'article';
  /** Whether the card lifts on hover. Off for a card that is not a target. */
  readonly interactive?: boolean;
  /** Drops the default padding, for a card that owns its own internal bands. */
  readonly flush?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
}

export function EditorialCard({
  tone = 'raised',
  as = 'div',
  interactive = true,
  flush = false,
  className,
  children,
}: EditorialCardProps): ReactNode {
  const Tag = as as ElementType;
  return (
    <Tag
      data-tone={tone}
      className={cn(
        'rounded-lg border shadow-raised',
        flush ? 'overflow-hidden' : 'p-6',
        TONE_CLASS[tone],
        interactive &&
          cn(
            'transition duration-(--duration-slow) ease-(--ease-standard)',
            'hover:-translate-y-0.5 hover:shadow-hard',
            'focus-within:-translate-y-0.5 focus-within:shadow-hard',
          ),
        className,
      )}
    >
      {children}
    </Tag>
  );
}
