'use client';

import { createElement, useRef, type ElementType, type Ref, type RefObject } from 'react';

import { useDirectionAttributes } from '@/lib/i18n';
import { EASE_OUT_EXPO, EXPRESSIVE_MD } from '@/lib/motion/constants';
import { gsap, SplitText, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

// Scripts SplitText's `chars` mode cannot safely split (glyph shaping,
// combining marks). These locales always fall back to `words`, matching the
// F4 rule: never `chars` for CJK/RTL locales.
const NON_CHAR_SPLITTABLE_LOCALE_PREFIXES = ['zh', 'ja', 'ko'];

export interface KineticHeadlineProps {
  /** Already-translated text — this component never touches @relay/i18n itself. */
  readonly children: string;
  readonly as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  readonly split?: 'words' | 'chars';
  /** ScrollTrigger's trigger element, if it should differ from the headline itself. */
  readonly trigger?: RefObject<HTMLElement | null>;
  readonly className?: string;
}

/**
 * Splits its text and animates each unit in with a clean rise (no rotation —
 * editorial headlines stay level).
 *
 * Reduced motion renders the plain, unsplit heading — see the header
 * comment in `lib/motion/gsap.ts`. `SplitText` rewrites the DOM to wrap each
 * word/char in its own element; `split.revert()` always runs on cleanup so
 * the DOM returns to plain text (for reduced-motion re-checks, unmounts and
 * locale changes alike).
 */
export function KineticHeadline({
  children,
  as: Tag = 'h2',
  split = 'words',
  trigger,
  className,
}: KineticHeadlineProps) {
  const RenderTag = Tag as ElementType;
  const scope = useRef<HTMLElement>(null);
  const motionOk = useMotionOk();
  const { dir, lang } = useDirectionAttributes();

  const isNonCharSplittable = NON_CHAR_SPLITTABLE_LOCALE_PREFIXES.some(
    (prefix) => lang === prefix || lang.startsWith(`${prefix}-`),
  );
  const effectiveSplit = dir === 'rtl' || isNonCharSplittable ? 'words' : split;

  useGSAP(
    () => {
      if (!motionOk || !scope.current) return;

      const splitInstance = SplitText.create(scope.current, { type: effectiveSplit });
      const units = effectiveSplit === 'chars' ? splitInstance.chars : splitInstance.words;
      if (units.length === 0) {
        splitInstance.revert();
        return;
      }

      gsap.from(units, {
        opacity: 0,
        yPercent: 100,
        stagger: 0.025,
        duration: EXPRESSIVE_MD,
        ease: EASE_OUT_EXPO,
        scrollTrigger: {
          trigger: trigger?.current ?? scope.current,
          start: 'top 85%',
          once: true,
        },
      });

      return () => {
        splitInstance.revert();
      };
    },
    { scope, dependencies: [motionOk, effectiveSplit, children, trigger] },
  );

  return createElement(
    RenderTag,
    { ref: scope as Ref<HTMLElement>, className },
    children,
  );
}
