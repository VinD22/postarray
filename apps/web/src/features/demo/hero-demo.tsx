'use client';

import { useRef, useState, type ReactNode } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { useDirectionAttributes } from '@/lib/i18n';
import { EASE_OUT_BACK, EASE_OUT_EXPO, EXPRESSIVE_MD, EXPRESSIVE_SM } from '@/lib/motion/constants';
import { gsap, SplitText, useGSAP, type ScrollTrigger } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

import { DemoFrame } from './demo-frame';

/**
 * The hero demonstration: the whole product as a nine scene tour that advances
 * on its own and loops.
 *
 * ## The fallback is the design
 *
 * Server HTML is an ordered list of all nine scenes, each with its step name
 * above it, stacked and complete. That is what a crawler, a visitor with
 * JavaScript off and a visitor who asked for reduced motion get, and it is
 * strictly more of the product than the three panels this component used to
 * show. Nothing is hidden in server CSS, so nothing has to be un-hidden for
 * the page to be readable, and the headline beside it is never waiting on this
 * component to paint.
 *
 * On mount, and only when `useMotionOk()` agrees, JavaScript collapses that
 * stack into one overlaid stage (`gsap.set`, in an effect, never a class in
 * the HTML) and runs a single master timeline across it. One timeline, not
 * nine: a single seekable object is what makes the step indicator's jump exact
 * and keeps pause and resume from drifting.
 *
 * ## It stops when nobody is watching
 *
 * Scrolled out of view, tab in the background, or focus inside the frame: any
 * of those pauses it, tracked as separate reasons so clearing one cannot
 * resume through another. The last one matters most. A keyboard visitor who
 * tabs into the tour gets a still panel to read instead of one that is swapped
 * out from under them mid sentence.
 *
 * ## What it still refuses to do
 *
 * It is not a live account, it submits nothing, and it invents nothing. The
 * publish scene shows genuinely pending steps and "Unavailable" fields,
 * because no connector has passed provider verification, and the digest scene
 * is sentences rather than figures for the same reason.
 *
 * This component is a sibling of `components/motion/scene-sequencer.tsx` and
 * follows its architecture (collapse in an effect, `autoAlpha` so an inactive
 * scene leaves the accessibility tree, pause reasons as independent flags, the
 * ScrollTrigger written as tween vars so it degrades in a test environment).
 * It is a separate implementation because this tour needs a per scene hold, a
 * per scene entrance choreography and a nine button step indicator, none of
 * which that primitive exposes.
 */
export interface HeroDemoScene {
  readonly id: string;
  /** The step name, already translated. Always visible, never a number alone. */
  readonly label: string;
  /** Accessible name of the indicator button, for example "Show step 3: Compose once". */
  readonly jumpLabel: string;
  /** Seconds this scene holds once it has finished arriving. */
  readonly hold: number;
  /** A finished panel, rendered on the server and handed over as a prop. */
  readonly content: ReactNode;
}

export interface HeroDemoProps {
  readonly badge: string;
  readonly caption: string;
  readonly pauseLabel: string;
  readonly playLabel: string;
  readonly replayLabel: string;
  /** Accessible name of the step indicator list, for example "Tour steps". */
  readonly stepsLabel: string;
  readonly scenes: readonly HeroDemoScene[];
  readonly className?: string;
}

/** Crossfade between two scenes. Expressive tier: 400ms in, 650ms for the seam. */
const TRANSITION = EXPRESSIVE_SM;

/** The loop seam: a longer wipe so the return to scene one reads as a restart. */
const WIPE = EXPRESSIVE_MD;

/** Seconds the last scene holds before the loop starts again. */
const LOOP_HOLD = 2;

/** Distance a scene rises as it arrives. Small enough not to read as a slide. */
const RISE = 12;

/** Stagger between the rows inside one scene. */
const ROW_STAGGER = 0.09;

/** Locales whose text `SplitText` must not be split below the line. */
const NON_LINE_SPLITTABLE_PREFIXES = ['zh', 'ja', 'ko'];

/** Why the tour is not playing. Any true reason keeps it paused. */
interface PauseReasons {
  user: boolean;
  offScreen: boolean;
  documentHidden: boolean;
  focusWithin: boolean;
}

export function HeroDemo({
  badge,
  caption,
  pauseLabel,
  playLabel,
  replayLabel,
  stepsLabel,
  scenes,
  className,
}: HeroDemoProps): ReactNode {
  const scope = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const fillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const spansRef = useRef<readonly { start: number; end: number }[]>([]);
  const pauseRef = useRef<PauseReasons>({
    user: false,
    offScreen: false,
    documentHidden: false,
    focusWithin: false,
  });

  const motionOk = useMotionOk();
  const { dir, lang } = useDirectionAttributes();
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(true);

  /**
   * The single place playback is decided, so no source can resume through
   * another source's reason.
   */
  function syncPlayback(): void {
    const timeline = timelineRef.current;
    if (!timeline) return;
    const reasons = pauseRef.current;
    const play =
      !reasons.user && !reasons.offScreen && !reasons.documentHidden && !reasons.focusWithin;
    if (play) timeline.play();
    else timeline.pause();
    setRunning(play);
  }

  useGSAP(
    () => {
      if (!motionOk || !scope.current || !listRef.current || scenes.length < 2) return undefined;
      const el = scope.current;
      const list = listRef.current;

      const items = gsap.utils.toArray<HTMLElement>('[data-demo-scene]', list);
      if (items.length < 2) return undefined;

      // Collapse the stack into a stage. The only layout read in this
      // component, taken once at setup rather than on a tick.
      const tallest = Math.max(...items.map((item) => item.offsetHeight));
      gsap.set(list, { position: 'relative', height: tallest });
      gsap.set(items, {
        position: 'absolute',
        insetBlockStart: 0,
        insetInlineStart: 0,
        inlineSize: '100%',
      });
      // `autoAlpha`, not `opacity`: an inactive scene is `visibility: hidden`,
      // so it leaves the accessibility tree and the tab order instead of
      // sitting invisibly on top of the visible one.
      gsap.set(items.slice(1), { autoAlpha: 0 });
      gsap.set(items[0] ?? null, { autoAlpha: 1 });

      // The draft body reveals per line, never per character: a typewriter
      // reads as a gimmick and is unreadable at speed. RTL and the scripts
      // `SplitText` cannot safely break get the whole block instead, the same
      // rule `KineticHeadline` follows.
      const splittable =
        dir !== 'rtl' &&
        !NON_LINE_SPLITTABLE_PREFIXES.some(
          (prefix) => lang === prefix || lang.startsWith(`${prefix}-`),
        );
      const splits: { revert: () => void }[] = [];

      const timeline = gsap.timeline({ repeat: -1 });
      timelineRef.current = timeline;

      const spans: { start: number; end: number }[] = [];

      scenes.forEach((scene, index) => {
        const item = items[index];
        if (!item) return;

        const start = timeline.duration();
        spans.push({ start, end: start });

        timeline.addLabel(`scene-${scene.id}`, start);
        timeline.call(() => setActive(index), undefined, start);

        const previous = items[index - 1];
        if (previous) {
          timeline.to(previous, { autoAlpha: 0, duration: TRANSITION }, start);
        }
        timeline.fromTo(
          item,
          { autoAlpha: 0, y: RISE },
          {
            autoAlpha: 1,
            y: 0,
            duration: TRANSITION,
            ease: EASE_OUT_EXPO,
            immediateRender: false,
          },
          start,
        );

        // Rows inside the scene arrive in sequence, so the eye is told what to
        // read first. `fromTo` with `immediateRender: false` so building the
        // timeline never hides anything before it plays.
        const rows = gsap.utils.toArray<HTMLElement>('[data-demo-enter]', item);
        if (rows.length > 0) {
          timeline.fromTo(
            rows,
            { autoAlpha: 0, y: 8 },
            {
              autoAlpha: 1,
              y: 0,
              duration: EXPRESSIVE_SM,
              ease: EASE_OUT_BACK,
              stagger: ROW_STAGGER,
              immediateRender: false,
            },
            start + TRANSITION * 0.5,
          );
        }

        const body = item.querySelector<HTMLElement>('[data-demo-lines]');
        if (body) {
          const lines = splittable ? SplitText.create(body, { type: 'lines' }).lines : [];
          if (lines.length > 0) {
            splits.push(SplitText.create(body, { type: 'lines' }));
            timeline.fromTo(
              lines,
              { autoAlpha: 0, y: 8 },
              {
                autoAlpha: 1,
                y: 0,
                duration: EXPRESSIVE_SM,
                ease: EASE_OUT_EXPO,
                stagger: 0.08,
                immediateRender: false,
              },
              start + TRANSITION * 0.5,
            );
          }
        }

        // An empty tween is how a GSAP timeline waits. The hold is the point:
        // a scene nobody can finish reading is a slideshow, not a tour.
        timeline.to({}, { duration: scene.hold }, start + TRANSITION);
        const span = spans[index];
        if (span) span.end = timeline.duration();
      });

      // The seam: hold on the finished picture, then wipe back to scene one.
      timeline.to({}, { duration: LOOP_HOLD });
      const last = items[items.length - 1];
      if (last) timeline.to(last, { autoAlpha: 0, duration: WIPE });
      const lastSpan = spans[spans.length - 1];
      if (lastSpan) lastSpan.end = timeline.duration();
      spansRef.current = spans;

      // The progress fill on the active step. One transform write per frame on
      // one element, driven by the timeline that is already running.
      timeline.eventCallback('onUpdate', () => {
        const time = timeline.time();
        spans.forEach((span, index) => {
          const fill = fillRefs.current[index];
          if (!fill) return;
          const length = span.end - span.start;
          const ratio = length <= 0 ? 0 : (time - span.start) / length;
          fill.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
        });
      });

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
      // and touches no DOM. Written as tween vars rather than
      // `ScrollTrigger.create` because `lib/motion/gsap.ts` registers
      // ScrollTrigger only outside the test environment, and an unregistered
      // `scrollTrigger` var is ignored where an unregistered `create` throws.
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
        for (const split of splits) split.revert();
        timeline.kill();
        timelineRef.current = null;
        spansRef.current = [];
      };
    },
    { scope, dependencies: [motionOk, scenes, dir, lang] },
  );

  const toggle = (): void => {
    pauseRef.current.user = running;
    syncPlayback();
  };

  const restart = (): void => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    pauseRef.current.user = false;
    timeline.time(0);
    syncPlayback();
  };

  const jump = (index: number): void => {
    const timeline = timelineRef.current;
    const scene = scenes[index];
    if (!timeline || !scene) return;
    timeline.seek(`scene-${scene.id}`);
    setActive(index);
  };

  const toggleLabel = running ? pauseLabel : playLabel;
  const ToggleIcon = running ? Pause : Play;

  return (
    <DemoFrame
      badge={badge}
      caption={caption}
      className={className}
      control={
        motionOk && scenes.length > 1 ? (
          // Icon only, with the sentence as the accessible name: the frame is
          // about 26rem wide in the hero and the full sentence set beside the
          // badge wrapped onto the badge itself. Targets stay 44x44.
          <span className="flex shrink-0 items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={toggle}
              aria-label={toggleLabel}
              title={toggleLabel}
              className="min-h-11 min-w-11 shrink-0 px-0"
            >
              <ToggleIcon aria-hidden="true" className="size-4 shrink-0" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={restart}
              aria-label={replayLabel}
              title={replayLabel}
              className="min-h-11 min-w-11 shrink-0 px-0"
            >
              <RotateCcw aria-hidden="true" className="size-4 shrink-0" />
            </Button>
          </span>
        ) : undefined
      }
    >
      <div ref={scope}>
        {/*
          The stack. This is the server layout and the whole tour in reading
          order; the client only ever changes where these sit, never whether
          they exist.
        */}
        <ol ref={listRef} className="space-y-3">
          {scenes.map((scene, index) => (
            <li key={scene.id} data-demo-scene data-demo-scene-index={index}>
              <p className="text-label text-text-tertiary mb-2">{scene.label}</p>
              {scene.content}
            </li>
          ))}
        </ol>

        {/*
          The step indicator. Real buttons, because clicking one moves the
          timeline, and only rendered once the timeline exists: a control that
          cannot do anything is a false affordance. The label is text, the
          active step carries `aria-current`, and the fill is a third signal on
          top of those two rather than the only one.
        */}
        {motionOk && scenes.length > 1 ? (
          <ol aria-label={stepsLabel} className="mt-4 flex flex-wrap gap-1">
            {scenes.map((scene, index) => (
              <li key={scene.id}>
                <button
                  type="button"
                  onClick={() => jump(index)}
                  aria-current={index === active ? 'step' : undefined}
                  aria-label={scene.jumpLabel}
                  title={scene.jumpLabel}
                  className={cn(
                    'relative flex min-h-11 min-w-11 flex-col justify-end gap-1 overflow-hidden',
                    'rounded-sm px-2 pb-1.5 text-start',
                    'hover:bg-surface-hover',
                    index === active ? 'text-text-primary' : 'text-text-tertiary',
                  )}
                >
                  <span className="text-label font-mono tabular-nums">{index + 1}</span>
                  <span className="bg-border-subtle block h-0.5 w-full overflow-hidden rounded-full">
                    <span
                      aria-hidden="true"
                      ref={(node) => {
                        fillRefs.current[index] = node;
                      }}
                      className={cn(
                        'block h-full w-full origin-[left_center] rounded-full',
                        index === active ? 'bg-accent-cool' : 'bg-transparent',
                      )}
                      style={{ transform: 'scaleX(0)' }}
                    />
                  </span>
                </button>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </DemoFrame>
  );
}
