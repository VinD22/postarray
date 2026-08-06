import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@relay/design-system/utils';

/**
 * The rotated, poster-cut badge: a hard-outlined chip that reads as a
 * physical sticker slapped onto the page rather than a flat UI label.
 *
 * `rotate` is clamped to the loud system's −6..6 degree range, carried as
 * the `--sticker-rotate` custom property so the one Tailwind arbitrary-value
 * utility (`rotate-[var(--sticker-rotate)]`) covers every angle without a
 * `style` transform string. `shape="starburst"` clips the same chip into a
 * jagged badge via `clip-path`; `shape="pill"` (the default) is a fully
 * rounded capsule.
 *
 * A `Sticker` is a plain, non-interactive `<span>` — it carries real text
 * (a count, "7-day trial", a receipt line) unless the caller marks it purely
 * decorative with `ariaHidden`, which several `loud/*` compositions do for
 * corner flourishes that add nothing a screen reader needs.
 */

export type StickerTone = 'paper' | 'brand' | 'cta' | 'pop' | 'ink';
export type StickerShape = 'pill' | 'starburst';

const TONE_CLASS: Record<StickerTone, string> = {
  paper: 'bg-surface-raised text-text-primary',
  brand: 'bg-accent text-accent-on',
  cta: 'bg-cta text-cta-on',
  pop: 'bg-blush text-blush-on',
  ink: 'bg-surface-inverted text-text-inverted',
};

// A closed, roughly ten-point star polygon. Decorative only, so the exact
// vertex count is an aesthetic choice, not a contract.
const STARBURST_CLIP_PATH =
  'polygon(50% 0%, 61% 14%, 76% 6%, 78% 22%, 94% 18%, 88% 33%, 100% 42%, 86% 50%, 100% 58%, 88% 67%, 94% 82%, 78% 78%, 76% 94%, 61% 86%, 50% 100%, 39% 86%, 24% 94%, 22% 78%, 6% 82%, 12% 67%, 0% 58%, 14% 50%, 0% 42%, 12% 33%, 6% 18%, 22% 22%, 24% 6%, 39% 14%)';

export interface StickerProps {
  readonly tone?: StickerTone;
  readonly shape?: StickerShape;
  /** Degrees. Clamped to the loud system's −6..6 range. */
  readonly rotate?: number;
  /** Marks a purely decorative instance (corner flourish, not information). */
  readonly ariaHidden?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
}

export function Sticker({
  tone = 'paper',
  shape = 'pill',
  rotate = -4,
  ariaHidden = false,
  className,
  children,
}: StickerProps): ReactNode {
  const clampedRotate = Math.max(-6, Math.min(6, rotate));
  const style = {
    '--sticker-rotate': `${clampedRotate}deg`,
    ...(shape === 'starburst' ? { clipPath: STARBURST_CLIP_PATH } : {}),
  } as CSSProperties;

  return (
    <span
      aria-hidden={ariaHidden || undefined}
      style={style}
      className={cn(
        'border-border-bold shadow-hard rotate-[var(--sticker-rotate)]',
        'text-label relative inline-flex items-center justify-center gap-1 border-2',
        'tracking-wide whitespace-nowrap uppercase',
        shape === 'pill' ? 'rounded-full px-3 py-1.5' : 'rounded-sm px-4 py-4',
        TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
