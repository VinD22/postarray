'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { usePrefersReducedMotion } from '@relay/design-system/hooks';
import { cn } from '@relay/design-system/utils';

/** Small enough to read as punctuation, large enough to read as a moment. */
const PIECE_COUNT = { sm: 12, lg: 24 } as const;

/**
 * The three accent families, cycled by index. Never `Math.random()`: a random
 * geometry differs between the server render and the client hydration, and
 * React treats that as a mismatch. Determinism here is a correctness
 * requirement, not a style preference. This generalises the single-purpose
 * `onboarding/confetti-burst.tsx`, which it has now replaced outright: the
 * onboarding receipt and the publish celebration both fire this component at
 * `tier="lg"`, so the two moments look like the same moment.
 */
const TONE_CLASS = ['bg-accent', 'bg-accent-warm', 'bg-accent-cool'] as const;

export type CelebrationTier = keyof typeof PIECE_COUNT;

export interface CelebrationBurstProps {
  /** `sm` is 12 pieces, `lg` is 24. Default `sm`. */
  readonly tier?: CelebrationTier;
  /**
   * Fires one burst per distinct value. Leave undefined to burst once on
   * mount. Changing it (a receipt id, a step number, a `true` flag) fires
   * again; re-rendering with the same value never does.
   */
  readonly trigger?: string | number | boolean;
  readonly className?: string;
}

/**
 * A deterministic radial burst in the terracotta / marigold / ultramarine
 * trio, positioned by the element it is placed inside.
 *
 * Renders NOTHING under `prefers-reduced-motion` — not a frozen burst, not an
 * invisible one. That is a deliberate exception to this directory's usual
 * "render the finished static state" rule, and it holds because celebration is
 * purely additive: a burst never carries information, so there is nothing to
 * preserve. Twenty-four rectangles frozen at their landing points would be
 * clutter, not a fallback. The information the burst is celebrating is always
 * stated in words somewhere else on the screen.
 *
 * `aria-hidden` for the same reason: there is nothing here to announce.
 */
export function CelebrationBurst({ tier = 'sm', trigger, className }: CelebrationBurstProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const firedForRef = useRef<CelebrationBurstProps['trigger'] | symbol>(Symbol('never fired'));
  const [burstKey, setBurstKey] = useState<number | null>(null);

  useEffect(() => {
    // The guard is keyed by the trigger value, not a boolean, so StrictMode's
    // double mount in development fires once and a genuine second celebration
    // still fires.
    if (prefersReducedMotion || firedForRef.current === trigger) return;
    firedForRef.current = trigger;
    // A changing key remounts the pieces, which restarts their CSS animation.
    // Re-applying the same class to the same nodes would not.
    setBurstKey((previous) => (previous ?? 0) + 1);
  }, [prefersReducedMotion, trigger]);

  if (prefersReducedMotion || burstKey === null) {
    return null;
  }

  const count = PIECE_COUNT[tier];

  return (
    <div
      key={burstKey}
      aria-hidden="true"
      className={cn('pointer-events-none absolute overflow-visible', className)}
    >
      {Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2;
        // Four concentric rings so a burst does not read as a single ring of
        // evenly spaced dots. `lg` throws further than `sm`.
        const spread = tier === 'lg' ? 26 : 18;
        const distance = 70 + (index % 4) * spread;
        const x = Math.round(Math.cos(angle) * distance);
        const y = Math.round(Math.sin(angle) * distance - 40);
        const style = {
          '--confetti-x': `${x}px`,
          '--confetti-y': `${y}px`,
          '--confetti-delay': `${(index % 4) * 40}ms`,
          rotate: `${(index * 37) % 360}deg`,
        } as CSSProperties;

        return (
          <span
            key={index}
            style={style}
            className={cn('relay-confetti-piece', TONE_CLASS[index % TONE_CLASS.length])}
          />
        );
      })}
    </div>
  );
}
