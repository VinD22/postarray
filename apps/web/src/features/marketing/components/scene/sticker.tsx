import type { ReactNode } from 'react';
import { cn } from '@relay/design-system/utils';

import type { SceneAccent } from './color-band';

/**
 * A slightly rotated chip carrying one fact.
 *
 * ## Why this exists again, and what is different
 *
 * The v1 loud system had a `Sticker`, and it was deleted. Read the mapping
 * table at the top of `editorial/index.ts`: the informational stickers became
 * `Eyebrow`, and the decorative ones were "deleted, not replaced". They were
 * deleted because a rotated starburst chip saying nothing is a poster device
 * pretending to be information.
 *
 * So this component is built so the empty case cannot be expressed. `fact` is
 * required and `source` is required: a sticker states a number or a
 * commitment, and names where a reader can go and check it. There is no
 * children prop and no decorative variant, which means a sticker with nothing
 * to say does not compile.
 *
 * ## Rotation
 *
 * Capped at 3 degrees, in either direction, by clamping rather than by
 * convention. Beyond that the type stops reading as set on a baseline and
 * starts reading as a graphic, and the descenders collide with whatever is
 * beneath it at a 30% longer translation.
 *
 * Rotation is a static inline transform, not an animation: it is present in
 * the server HTML, identical under reduced motion, and costs nothing.
 */
export const MAX_STICKER_TILT_DEGREES = 3;

const TONE_CLASS: Record<SceneAccent, string> = {
  warm: 'bg-accent-warm-subtle border-accent-warm/40',
  cool: 'bg-accent-cool-subtle border-accent-cool/40',
  neutral: 'bg-surface-raised border-border-default',
};

export function clampTilt(degrees: number): number {
  if (Number.isNaN(degrees)) return 0;
  return Math.max(-MAX_STICKER_TILT_DEGREES, Math.min(MAX_STICKER_TILT_DEGREES, degrees));
}

export interface StickerProps {
  /**
   * The fact. Already translated, and genuinely a fact: a count, a price, a
   * limit, a commitment. Not a mood.
   */
  readonly fact: string;
  /**
   * Where the fact comes from, so a reader can check it. Already translated.
   * Rendered as the sticker's second line, never as a tooltip.
   */
  readonly source: string;
  readonly accent?: SceneAccent;
  /** Degrees, clamped to +/-3. */
  readonly tilt?: number;
  readonly className?: string;
}

export function Sticker({
  fact,
  source,
  accent = 'warm',
  tilt = -2,
  className,
}: StickerProps): ReactNode {
  return (
    <span
      data-scene-accent={accent}
      style={{ rotate: `${clampTilt(tilt)}deg` }}
      className={cn(
        'text-text-primary inline-flex flex-col gap-0.5 rounded-sm border px-3 py-2',
        TONE_CLASS[accent],
        className,
      )}
    >
      <span className="text-body-md font-medium">{fact}</span>
      <span className="text-label text-text-tertiary tracking-[0.14em] uppercase">{source}</span>
    </span>
  );
}
