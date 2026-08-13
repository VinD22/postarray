import type { ReactNode } from 'react';
import { cn } from '@relay/design-system/utils';

/**
 * "Where am I in this sequence" — shared by every multi-beat scene.
 *
 * A `ScrollScene` with three pinned beats and a `SceneSequencer` with nine
 * both need to answer the same question, and both were about to grow their
 * own dot row. One component, so the answer looks and reads the same
 * wherever it appears.
 *
 * Two things are non-negotiable in it:
 *
 *  - **Never colour alone.** The active beat is marked by a wider filled dot
 *    AND by `positionLabel`, an already-translated "2 of 5" string that is
 *    visible text, not an `aria-label`. Someone who cannot distinguish the
 *    filled dot from the empty ones still reads their position.
 *  - **Server HTML is the finished state.** The dots are plain elements with
 *    a token background and a CSS width transition. There is no GSAP here and
 *    nothing to branch on `useMotionOk` for: the global 1ms reduced-motion
 *    override reaches a CSS transition, which is exactly why this is CSS.
 *
 * It is presentational: it reports progress and never offers a control. A
 * scene that needs pause/step controls owns them itself (`SceneSequencer`
 * requires `controlLabels` for that reason).
 */
export interface TourIndicatorProps {
  readonly total: number;
  /** Zero-based index of the beat currently showing. */
  readonly activeIndex: number;
  /** Already-translated, e.g. "2 of 5". Visible text, not an aria-label. */
  readonly positionLabel: string;
  readonly className?: string;
}

export function TourIndicator({
  total,
  activeIndex,
  positionLabel,
  className,
}: TourIndicatorProps): ReactNode {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span aria-hidden="true" className="flex items-center gap-1.5">
        {Array.from({ length: Math.max(0, total) }, (_unused, index) => (
          <span
            key={index}
            data-active={index === activeIndex ? 'true' : 'false'}
            className={cn(
              'block h-1.5 rounded-full transition-[width,background-color]',
              'duration-(--duration-fast) ease-(--ease-standard)',
              index === activeIndex ? 'bg-text-primary w-6' : 'bg-border-strong w-1.5',
            )}
          />
        ))}
      </span>
      <span className="text-body-sm text-text-tertiary font-mono tabular-nums">
        {positionLabel}
      </span>
    </div>
  );
}
