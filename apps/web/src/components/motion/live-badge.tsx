'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '@relay/design-system/utils';

export interface LiveBadgeProps {
  /** Whether the thing this badge describes is live right now. */
  readonly live: boolean;
  /**
   * The badge text, already translated by the caller. Required, and never
   * decorative: the dot alone would be colour-alone status, which this
   * codebase does not ship.
   */
  readonly label: ReactNode;
  /**
   * Optional lucide icon. Its stroke draws itself in once, on the transition
   * into "live", via the shared `relay-icon-draw` keyframe.
   */
  readonly icon?: ReactNode;
  readonly className?: string;
}

/**
 * A dot-and-label badge that celebrates the moment something goes live.
 *
 * Deliberately CSS-driven rather than GSAP-driven. Both animations it plays
 * (`relay-dot-settle` and `relay-icon-draw`, both already in `globals.css`)
 * are plain, finite CSS animations, which means three good things at once:
 * the badge is cheap enough for the fast in-app motion tier rather than being
 * marketing-only, the global 1ms `prefers-reduced-motion` override in
 * `theme.css` already collapses it to its settled end state with no JS branch,
 * and `motion-reduce:animate-none` can sit on the elements as a second,
 * explicit guard (the same belt-and-braces `connection-health.tsx` uses).
 *
 * The animation classes are applied only on a false-to-true transition, and
 * removed once played, so a badge that renders already-live (a page load, a
 * re-render for an unrelated prop) settles silently instead of replaying a
 * celebration the visitor has already had.
 *
 * Colour is ultramarine, the cool accent, because that is the family that
 * means "published" — but colour is never the signal here. The label is.
 */
export function LiveBadge({ live, label, icon, className }: LiveBadgeProps) {
  const wasLiveRef = useRef(live);
  const [justWentLive, setJustWentLive] = useState(false);

  useEffect(() => {
    const wasLive = wasLiveRef.current;
    wasLiveRef.current = live;
    if (!live || wasLive) {
      setJustWentLive(false);
      return;
    }
    setJustWentLive(true);
  }, [live]);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1',
        'text-label font-[550]',
        live ? 'bg-accent-cool-subtle text-accent-cool' : 'bg-surface-sunken text-text-tertiary',
        className,
      )}
      data-live={live}
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-2 shrink-0 rounded-full',
          live ? 'bg-accent-cool' : 'bg-border-strong',
          justWentLive && 'relay-dot-settle motion-reduce:animate-none',
        )}
      />
      {icon === undefined ? null : (
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex shrink-0',
            justWentLive && 'relay-icon-draw motion-reduce:animate-none',
          )}
        >
          {icon}
        </span>
      )}
      {label}
    </span>
  );
}
