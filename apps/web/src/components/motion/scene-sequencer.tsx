'use client';

import { useEffect, useImperativeHandle, useRef, useState, type ReactNode, type Ref } from 'react';

import { EXPRESSIVE_MD } from '@/lib/motion/constants';
import { gsap, useGSAP, type ScrollTrigger } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';
import { cn } from '@relay/design-system/utils';

export interface SequencerScene {
  /** Stable across renders. Used as the React key and the timeline label. */
  readonly id: string;
  /** The step name, already translated by the caller. Always visible. */
  readonly label: ReactNode;
  readonly content: ReactNode;
}

export interface SceneSequencerHandle {
  /** Pauses and keeps it paused until `play()`. Auto-pause cannot override this. */
  readonly pause: () => void;
  readonly play: () => void;
  /** Seeks to a scene without changing whether the tour is running. */
  readonly jump: (index: number) => void;
  readonly activeIndex: () => number;
}

export interface SceneSequencerControlLabels {
  readonly pause: string;
  readonly play: string;
}

export interface SceneSequencerProps {
  readonly scenes: readonly SequencerScene[];
  /** Seconds each scene holds before handing over. */
  readonly hold?: number;
  readonly loop?: boolean;
  /** Seconds of crossfade between two scenes. */
  readonly transition?: number;
  /**
   * Accessible names for the pause/play control, already translated. Required
   * rather than optional: an auto-advancing sequence longer than five seconds
   * needs a pause mechanism to satisfy WCAG 2.2.2, and an optional prop is a
   * pause mechanism that will be forgotten. The control is not rendered when
   * motion is off, because nothing is moving to pause.
   */
  readonly controlLabels: SceneSequencerControlLabels;
  readonly onActiveChange?: (index: number) => void;
  readonly className?: string;
  readonly ref?: Ref<SceneSequencerHandle>;
}

/** Why the tour is currently not playing. Any true reason keeps it paused. */
interface PauseReasons {
  user: boolean;
  offScreen: boolean;
  documentHidden: boolean;
  focusWithin: boolean;
}

/**
 * An auto-advancing, looping product tour.
 *
 * The fallback is the design, not a consolation. Server HTML renders every
 * scene stacked vertically with its step label showing — an ordered list that
 * reads top to bottom as a complete written walkthrough of the product. That
 * markup is what a no-JS client, a search crawler and a reduced-motion visitor
 * get, and it is the same markup the animated version is built from. Nothing
 * is hidden in server CSS and nothing is added by JS except position.
 *
 * On mount, and only when `useMotionOk()` says yes, JS collapses that stack
 * into a single overlaid stage (`gsap.set`, in an effect — never a server
 * class) and drives one master timeline across it. One timeline, not one per
 * scene: a single seekable object is what makes `jump()` exact and what keeps
 * pause/resume from drifting out of sync.
 *
 * It stops itself whenever nobody is watching or somebody is working:
 *
 * - scrolled out of view (`ScrollTrigger.onToggle`)
 * - the tab is backgrounded (`visibilitychange`)
 * - focus lands inside the frame (`focusin`) — a keyboard visitor reading a
 *   scene should not have it swapped out from under them
 *
 * Those are independent reasons, tracked separately, so resuming after one
 * clears never overrides another that has not. An explicit `pause()` from the
 * handle or the visible control outranks all of them.
 */
export function SceneSequencer({
  scenes,
  hold = 3,
  loop = true,
  transition = EXPRESSIVE_MD,
  controlLabels,
  onActiveChange,
  className,
  ref,
}: SceneSequencerProps) {
  const scope = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const motionOk = useMotionOk();

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const pauseRef = useRef<PauseReasons>({
    user: false,
    offScreen: false,
    documentHidden: false,
    focusWithin: false,
  });
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(true);

  const onActiveChangeRef = useRef(onActiveChange);
  useEffect(() => {
    onActiveChangeRef.current = onActiveChange;
  }, [onActiveChange]);

  useImperativeHandle(
    ref,
    () => ({
      pause: () => {
        pauseRef.current.user = true;
        syncPlayback();
      },
      play: () => {
        pauseRef.current.user = false;
        syncPlayback();
      },
      jump: (index: number) => {
        const timeline = timelineRef.current;
        if (!timeline) return;
        const scene = scenes[index];
        if (!scene) return;
        timeline.seek(`scene-${scene.id}`);
      },
      activeIndex: () => activeRef.current,
    }),
    // `scenes` is read inside `jump`; the rest close over refs only.
    [scenes],
  );

  /**
   * The single place playback state is decided. Every pause source writes its
   * own flag and calls this, so no source can resume through another's reason.
   */
  function syncPlayback(): void {
    const timeline = timelineRef.current;
    if (!timeline) return;
    const reasons = pauseRef.current;
    const shouldPlay =
      !reasons.user && !reasons.offScreen && !reasons.documentHidden && !reasons.focusWithin;
    if (shouldPlay) timeline.play();
    else timeline.pause();
    setRunning(shouldPlay);
  }

  useGSAP(
    () => {
      if (!motionOk || !scope.current || !listRef.current || scenes.length < 2) return;
      const el = scope.current;
      const list = listRef.current;

      const items = gsap.utils.toArray<HTMLElement>('[data-scene-item]', list);
      if (items.length < 2) return;

      // Collapse the stack. Measured once, here, and never again — this is the
      // only layout read in the component and it happens at setup, not in a
      // scroll or tick callback.
      const tallest = Math.max(...items.map((item) => item.offsetHeight));
      gsap.set(list, { position: 'relative', height: tallest });
      gsap.set(items, {
        position: 'absolute',
        insetBlockStart: 0,
        insetInlineStart: 0,
        inlineSize: '100%',
      });
      // `autoAlpha` (not `opacity`) so an inactive scene is `visibility:
      // hidden` — out of the accessibility tree and out of the tab order,
      // rather than an invisible keyboard trap stacked on the visible one.
      gsap.set(items.slice(1), { autoAlpha: 0 });
      gsap.set(items[0] ?? null, { autoAlpha: 1 });

      const announce = (index: number): void => {
        activeRef.current = index;
        setActive(index);
        onActiveChangeRef.current?.(index);
      };

      const timeline = gsap.timeline({ repeat: loop ? -1 : 0 });
      timelineRef.current = timeline;

      scenes.forEach((scene, index) => {
        const item = items[index];
        if (!item) return;
        timeline.addLabel(`scene-${scene.id}`);
        timeline.call(() => announce(index));
        if (index === 0) {
          timeline.set(item, { autoAlpha: 1 }, '<');
        } else {
          const previous = items[index - 1];
          if (previous) timeline.to(previous, { autoAlpha: 0, duration: transition }, '<');
          timeline.to(item, { autoAlpha: 1, duration: transition }, '<');
        }
        // An empty tween is how a GSAP timeline waits. The hold is the whole
        // point of the sequencer: a scene the visitor cannot finish reading is
        // a slideshow, not a tour.
        timeline.to({}, { duration: hold });
      });

      if (loop) {
        // Fade the last scene out so the repeat starts from a clean stage
        // rather than snapping the first scene on top of a still-visible last.
        const last = items[items.length - 1];
        if (last) timeline.to(last, { autoAlpha: 0, duration: transition });
      }

      const onVisibility = (): void => {
        pauseRef.current.documentHidden = document.visibilityState === 'hidden';
        syncPlayback();
      };
      const onFocusIn = (): void => {
        pauseRef.current.focusWithin = true;
        syncPlayback();
      };
      const onFocusOut = (): void => {
        pauseRef.current.focusWithin = false;
        syncPlayback();
      };

      document.addEventListener('visibilitychange', onVisibility);
      el.addEventListener('focusin', onFocusIn);
      el.addEventListener('focusout', onFocusOut);

      // A scroll watcher, not an animation: the tween drives a throwaway proxy
      // object and touches no DOM. It exists only to carry `onToggle`.
      //
      // Written as tween vars rather than `ScrollTrigger.create` because
      // `lib/motion/gsap.ts` registers ScrollTrigger only outside the test
      // environment (its header explains why), and an unregistered
      // `ScrollTrigger.create` throws where an unregistered `scrollTrigger` var
      // is simply ignored. That keeps this component renderable in a component
      // test instead of only in a browser. `useGSAP`'s context reverts it.
      gsap.to(
        { offscreenWatcher: 0 },
        {
          offscreenWatcher: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            onToggle: (self) => {
              pauseRef.current.offScreen = !self.isActive;
              syncPlayback();
            },
          } satisfies ScrollTrigger.Vars,
        },
      );

      syncPlayback();

      return () => {
        document.removeEventListener('visibilitychange', onVisibility);
        el.removeEventListener('focusin', onFocusIn);
        el.removeEventListener('focusout', onFocusOut);
        timeline.kill();
        timelineRef.current = null;
      };
    },
    { scope, dependencies: [motionOk, scenes, hold, loop, transition] },
  );

  return (
    <div ref={scope} className={className}>
      <ol ref={listRef} className="flex flex-col gap-16">
        {scenes.map((scene, index) => (
          <li key={scene.id} data-scene-item data-scene-index={index}>
            <p className="text-label text-text-tertiary mb-3">{scene.label}</p>
            {scene.content}
          </li>
        ))}
      </ol>

      {motionOk && scenes.length > 1 ? (
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              pauseRef.current.user = running;
              syncPlayback();
            }}
            className={cn(
              'inline-flex min-h-11 min-w-11 items-center justify-center',
              'rounded-md px-4',
              'border-border-default text-text-secondary border',
              'hover:bg-surface-hover',
            )}
          >
            {running ? controlLabels.pause : controlLabels.play}
          </button>
          {/* The step indicator is text and position, never colour alone. */}
          <ol className="flex items-center gap-2">
            {scenes.map((scene, index) => (
              <li
                key={scene.id}
                aria-current={index === active ? 'step' : undefined}
                className={cn(
                  'text-label',
                  index === active ? 'text-accent-cool' : 'text-text-tertiary',
                )}
              >
                {scene.label}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
