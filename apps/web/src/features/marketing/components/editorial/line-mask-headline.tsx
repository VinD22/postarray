'use client';

import { useRef, type ElementType, type Ref } from 'react';

import { EASE_OUT_EXPO, EXPRESSIVE_MD } from '@/lib/motion/constants';
import { gsap, SplitText, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

export interface LineMaskHeadlineProps {
  /** Already-translated text. This component never touches @relay/i18n itself. */
  readonly children: string;
  readonly as?: 'h1' | 'h2' | 'h3' | 'p';
  readonly className?: string;
}

/**
 * The hero headline's per-line mask reveal.
 *
 * Each rendered line is wrapped in its own clipping container and slides up
 * into it, staggered 70ms apart. This is the editorial counterpart to the loud
 * system's `KineticHeadline`, which split to words or characters and rose each
 * unit independently — at display scale that reads as a title sequence. A line
 * mask reads as a page being set.
 *
 * Splitting is always by line, never by character. `chars` is unsafe for
 * scripts with glyph shaping or combining marks (Arabic, Hebrew, CJK), and
 * `lines` has no such hazard in any locale, so unlike `KineticHeadline` this
 * component needs no per-locale split-mode branch at all.
 *
 * Two contracts from `lib/motion/gsap.ts` are load-bearing here:
 *
 *  - The global 1ms reduced-motion CSS override does not reach a GSAP timeline
 *    driven from a rAF loop, so this branches on `useMotionOk` and renders the
 *    plain, unsplit heading instead of animating to it.
 *  - Server HTML is the finished page. Nothing is hidden in markup; the split
 *    and the offset only ever happen inside `useGSAP`.
 *
 * The split is reverted the moment the reveal finishes, so the settled DOM is
 * plain text in a plain heading: no residual clipping wrappers around the
 * largest type on the page, where a tight display line-height could otherwise
 * shave a descender.
 */
export function LineMaskHeadline({
  children,
  as: Tag = 'h1',
  className,
}: LineMaskHeadlineProps) {
  const RenderTag = Tag as ElementType;
  const scope = useRef<HTMLElement>(null);
  const motionOk = useMotionOk();

  useGSAP(
    () => {
      if (!motionOk || !scope.current) return;

      const split = SplitText.create(scope.current, { type: 'lines', mask: 'lines' });
      let reverted = false;
      const revert = (): void => {
        if (reverted) return;
        reverted = true;
        split.revert();
      };

      if (split.lines.length === 0) {
        revert();
        return;
      }

      gsap.from(split.lines, {
        yPercent: 100,
        stagger: 0.07,
        duration: EXPRESSIVE_MD,
        ease: EASE_OUT_EXPO,
        onComplete: revert,
        scrollTrigger: {
          trigger: scope.current,
          start: 'top 90%',
          once: true,
        },
      });

      return revert;
    },
    { scope, dependencies: [motionOk, children] },
  );

  return (
    <RenderTag ref={scope as Ref<HTMLElement>} className={className}>
      {children}
    </RenderTag>
  );
}
