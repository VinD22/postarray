'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { gsap, useGSAP, type ScrollTrigger } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';
import { PinnedScene } from './pinned-scene';

/**
 * A design-token custom property name, e.g. `--surface-canvas`.
 *
 * Typed as a template literal rather than `string` so `background` cannot be
 * handed a raw hex. That is the gradient/texture policy in `theme.css` rule 4
 * ("no arbitrary hex anywhere") expressed as a compile error instead of a
 * review comment: the two ends of the interpolation are documented tokens, so
 * every colour the scrub passes through lies between two measured values.
 */
export type ThemeTokenName = `--${string}`;

export interface ScrollSceneBackground {
  readonly from: ThemeTokenName;
  readonly to: ThemeTokenName;
}

export interface ScrollSceneProps {
  readonly scenes: readonly ReactNode[];
  /** Scrubbed 0-1 progress through the pinned distance. */
  readonly onProgress?: (progress: number) => void;
  /**
   * Fires with the name of the beat the scrub has reached. A beat is any
   * descendant carrying `data-scene-beat="<name>"`; beats divide the scrub
   * evenly in DOM order.
   */
  readonly onBeat?: (beat: string) => void;
  /** Interpolates the frame's background between two token values. */
  readonly background?: ScrollSceneBackground;
  readonly className?: string;
}

/**
 * `PinnedScene` plus choreography.
 *
 * This is a composition over `PinnedScene`, not a replacement for it:
 * `PinnedScene` still owns the pin and the crossfade, and is still the right
 * component on its own when a section only needs scenes to hand over to each
 * other. `ScrollScene` adds the three things a *choreographed* section needs
 * and nothing more — a scrubbed progress signal, named beats so a sibling can
 * react to "we have reached the publish moment", and an optional background
 * interpolation between two documented tokens.
 *
 * Performance budget (see `README.md`): the scrub callback does no layout
 * reads. The beat names and both background colours are resolved once at
 * setup; per-frame work is one `gsap.set` of `backgroundColor` and an integer
 * comparison.
 *
 * With motion off, `PinnedScene` renders its own stacked static fallback,
 * `onProgress` and `onBeat` never fire, and the background stays whatever the
 * surrounding surface token already painted. Nothing here emits hidden state
 * into server HTML.
 */
export function ScrollScene({
  scenes,
  onProgress,
  onBeat,
  background,
  className,
}: ScrollSceneProps) {
  const scope = useRef<HTMLDivElement>(null);
  const motionOk = useMotionOk();

  // Callbacks live in refs so a caller passing an inline arrow does not tear
  // down and rebuild the ScrollTrigger on every render.
  const onProgressRef = useRef(onProgress);
  const onBeatRef = useRef(onBeat);
  useEffect(() => {
    onProgressRef.current = onProgress;
    onBeatRef.current = onBeat;
  }, [onProgress, onBeat]);

  useGSAP(
    () => {
      if (!motionOk || !scope.current || scenes.length < 2) return;
      const el = scope.current;

      const beats = gsap.utils
        .toArray<HTMLElement>('[data-scene-beat]', el)
        .map((node) => node.dataset.sceneBeat ?? '')
        .filter((name) => name !== '');

      // Resolved once, at setup. `getPropertyValue` on a custom property is a
      // style read, which is exactly why it does not belong in `onUpdate`.
      const computed = getComputedStyle(el);
      const from = background ? computed.getPropertyValue(background.from).trim() : '';
      const to = background ? computed.getPropertyValue(background.to).trim() : '';
      const canTintBackground = from !== '' && to !== '';
      const interpolateBackground = canTintBackground
        ? gsap.utils.interpolate(from, to)
        : undefined;

      let lastBeat = -1;

      // The scroll hookup goes through timeline vars rather than
      // `ScrollTrigger.create`. `lib/motion/gsap.ts` registers ScrollTrigger
      // only outside the test environment (its own header explains why: the
      // plugin keeps a browser-global timer alive past JSDOM teardown), and an
      // unregistered `ScrollTrigger.create` throws where an unregistered
      // `scrollTrigger` var is simply ignored. Every scroll-driven component in
      // this directory hooks up the same way, so all of them stay renderable in
      // a component test. `useGSAP`'s context reverts the timeline and its
      // trigger on unmount, so neither needs manual cleanup.
      gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${(scenes.length - 1) * window.innerHeight}`,
          scrub: true,
          onUpdate: (self) => {
            onProgressRef.current?.(self.progress);

            if (interpolateBackground) {
              gsap.set(el, { backgroundColor: interpolateBackground(self.progress) });
            }

            if (beats.length > 0) {
              const index = Math.min(beats.length - 1, Math.floor(self.progress * beats.length));
              const name = beats[index];
              if (index !== lastBeat && name !== undefined) {
                lastBeat = index;
                onBeatRef.current?.(name);
              }
            }
          },
        } satisfies ScrollTrigger.Vars,
      });
    },
    { scope, dependencies: [motionOk, scenes.length, background?.from, background?.to] },
  );

  return (
    <div ref={scope} className={className}>
      <PinnedScene scenes={scenes} />
    </div>
  );
}
