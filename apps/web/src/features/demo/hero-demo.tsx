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
 * ## The stage is the size of the scene on it
 *
 * The nine panels are wildly different heights — a project card is 187px and
 * the variant list is 495px at the hero's width — so a stage sized once to the
 * tallest left the short scenes floating in 300px of nothing with the step
 * rail stranded at the bottom. It read as a broken layout rather than as a
 * tour. The stage therefore follows the active scene: heights are measured
 * once per width, and each scene's entrance carries a matching height tween on
 * the container.
 *
 * That tween is the one animation here that touches a layout property, and it
 * is cheap on purpose: the scenes are absolutely positioned, so nothing inside
 * the stage reflows when it resizes. The only things that move are the step
 * rail and the caption underneath. It is a per-scene tween, never a scrub and
 * never a tick, which is the line the motion README's performance budget
 * draws.
 *
 * The height is applied from a `gsap.call` rather than authored as a timeline
 * tween, so it always animates from the height that is really on screen. A
 * timeline tween caches its start value the first time it renders, and a
 * visitor who jumps to step 7 from step 2 would poison that cache for every
 * later loop.
 *
 * A frame that changes height would be a frame that moves, because the hero
 * lays its two columns out centred against each other. So the component
 * reserves the tallest scene's worth of room on a wrapper around the frame and
 * lets the frame grow downwards inside it. The wrapper is a constant height, so
 * the frame's top edge never moves and the space it is not using is outside the
 * dashed border, where there is nothing to see.
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

/**
 * Where one scene sits on the master timeline.
 *
 * `start` is where it begins arriving, `arrive` is where it has finished
 * arriving (the point a jump lands on), and `end` is where the next one takes
 * over. `start` to `end` is what the step's progress fill measures.
 */
interface SceneSpan {
  start: number;
  arrive: number;
  end: number;
}

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
  /** The wrapper that holds the tallest scene's worth of room open. */
  const reserveRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const fillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const spansRef = useRef<readonly SceneSpan[]>([]);
  /** Natural height of each scene at the current width, measured once per width. */
  const heightsRef = useRef<number[]>([]);
  /** The scene the stage is currently sized to, so a resize can re-apply it. */
  const activeRef = useRef(0);
  /** Sizes the stage to a scene. Called from the timeline and from a jump. */
  const applyHeightRef = useRef<(index: number, animate: boolean) => void>(() => undefined);
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
      if (!motionOk || !scope.current || !listRef.current || !reserveRef.current) return undefined;
      if (scenes.length < 2) return undefined;
      const el = scope.current;
      const list = listRef.current;
      const reserve = reserveRef.current;

      const items = gsap.utils.toArray<HTMLElement>('[data-demo-scene]', list);
      if (items.length < 2) return undefined;

      // Collapse the stack into a stage. Every layout read in this component
      // happens here, at setup, or in the resize observer below — never on a
      // tick and never inside a scroll callback.
      gsap.set(items, {
        position: 'absolute',
        insetBlockStart: 0,
        insetInlineStart: 0,
        inlineSize: '100%',
      });
      gsap.set(list, { position: 'relative' });

      /**
       * Re-read every scene's natural height, size the stage to the scene on
       * it, and hold the tallest scene's worth of room open on the wrapper.
       *
       * Reading a scene's height is valid at any time: each one is absolutely
       * positioned at the stage's full inline size, so `offsetHeight` is its own
       * content height and owes nothing to the stage's. Text wrapping is the
       * only input, so this runs once at setup and once per width change, never
       * on a tick.
       */
      const remeasure = (index: number): void => {
        heightsRef.current = items.map((item) => item.offsetHeight);
        const tallest = Math.max(...heightsRef.current);
        const height = heightsRef.current[index] ?? tallest;

        // The reserve is read rather than calculated: put the tallest scene on
        // the stage, clear last pass's reserve, and ask the wrapper how tall it
        // is. Subtracting a "chrome" constant instead would be wrong wherever
        // the frame's height is not the stage's — at the widths where the step
        // list sits beside the stage and is the taller of the two, it never is.
        gsap.set(list, { height: tallest });
        reserve.style.minBlockSize = '';
        const full = reserve.offsetHeight;

        gsap.set(list, { height });
        reserve.style.minBlockSize = `${Math.round(full)}px`;
      };

      const applyHeight = (index: number, animate: boolean): void => {
        const height = heightsRef.current[index];
        if (height === undefined) return;
        activeRef.current = index;
        if (animate) {
          gsap.to(list, {
            height,
            duration: TRANSITION,
            ease: EASE_OUT_EXPO,
            overwrite: 'auto',
          });
        } else {
          gsap.set(list, { height });
        }
      };
      applyHeightRef.current = applyHeight;

      remeasure(0);
      activeRef.current = 0;
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

      const spans: SceneSpan[] = [];

      scenes.forEach((scene, index) => {
        const item = items[index];
        if (!item) return;

        const start = timeline.duration();
        spans.push({ start, arrive: start, end: start });

        timeline.addLabel(`scene-${scene.id}`, start);
        timeline.call(
          () => {
            setActive(index);
            applyHeight(index, true);
          },
          undefined,
          start,
        );

        const previous = items[index - 1];
        if (previous) {
          // The outgoing scene leaves faster than the incoming one arrives. An
          // even cross-dissolve holds two whole panels on screen at half
          // opacity each, which on this ground reads as a printing error; at
          // this ratio the old one is gone before the new one is legible.
          timeline.to(previous, { autoAlpha: 0, duration: TRANSITION * 0.55 }, start);
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

        // Everything above is this scene's entrance, so the timeline's length
        // right now is the instant it has finished arriving. That is where a
        // jump lands: seeking to the label itself parks the playhead on the
        // first frame of a fade-in, and since clicking a step also pauses the
        // tour (focus is inside the frame), the visitor would be left looking
        // at an empty stage.
        const arrive = timeline.duration();
        const span = spans[index];
        if (span) span.arrive = arrive;

        // An empty tween is how a GSAP timeline waits. The hold is the point:
        // a scene nobody can finish reading is a slideshow, not a tour.
        timeline.to({}, { duration: scene.hold }, start + TRANSITION);
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

      // A panel's height depends on how its text wraps, so every width change
      // invalidates the measurements. Only width is watched: the stage's own
      // height is animated from here, and reacting to that would be a loop.
      let lastWidth = list.getBoundingClientRect().width;
      const observer =
        typeof ResizeObserver === 'undefined'
          ? null
          : new ResizeObserver((entries) => {
              const width = entries[0]?.contentRect.width ?? lastWidth;
              if (Math.abs(width - lastWidth) < 1) return;
              lastWidth = width;
              remeasure(activeRef.current);
            });
      observer?.observe(list);

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
        observer?.disconnect();
        reserve.style.minBlockSize = '';
        for (const split of splits) split.revert();
        timeline.kill();
        timelineRef.current = null;
        spansRef.current = [];
        heightsRef.current = [];
        applyHeightRef.current = () => undefined;
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
    // Land on the finished scene, not on the first frame of its entrance.
    timeline.seek(spansRef.current[index]?.arrive ?? `scene-${scene.id}`);
    setActive(index);
    // `seek` suppresses the timeline's own callbacks, so the stage is resized
    // here rather than being left at the height of the scene we came from.
    applyHeightRef.current(index, true);
  };

  const toggleLabel = running ? pauseLabel : playLabel;
  const ToggleIcon = running ? Pause : Play;

  return (
    /*
      The room the frame is allowed to use. It is a plain block with no border
      and no background until the effect gives it a minimum height, so with no
      JavaScript and under reduced motion it is nothing at all.
    */
    <div ref={reserveRef}>
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
        <div
          ref={scope}
          className={cn(
            // Wide enough, and the stage and the chapter list sit side by side:
            // the tour stops being a small box with a strip of numbers under it
            // and becomes a thing with a table of contents, where the step you
            // are on is named rather than numbered. The list is the taller of
            // the two columns for most scenes, which is also what stops the
            // frame changing height as the tour runs.
            motionOk && scenes.length > 1
              ? 'grid gap-x-8 gap-y-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]'
              : undefined,
          )}
        >
          {/*
            The stack. This is the server layout and the whole tour in reading
            order; the client only ever changes where these sit, never whether
            they exist.
          */}
          <ol ref={listRef} className="space-y-3">
            {scenes.map((scene, index) => (
              <li key={scene.id} data-demo-scene data-demo-scene-index={index}>
                {/*
                  The step name above the panel. It is how the stacked
                  walkthrough is labelled with no JavaScript and under reduced
                  motion, so it is always in the server HTML; where the chapter
                  list is beside the stage naming the same step, it steps aside.
                */}
                <p
                  className={cn(
                    'text-label text-text-tertiary mb-2',
                    motionOk && scenes.length > 1 ? 'lg:hidden' : undefined,
                  )}
                >
                  {scene.label}
                </p>
                {scene.content}
              </li>
            ))}
          </ol>

          {/*
            The chapter list. Real buttons, because clicking one moves the
            timeline, and only rendered once the timeline exists: a control that
            cannot do anything is a false affordance. The name is text, the
            active step carries `aria-current`, and the fill is a third signal on
            top of those two rather than the only one.
          */}
          {motionOk && scenes.length > 1 ? (
            <ol
              aria-label={stepsLabel}
              className={cn(
                // Below the stage it is a rail across the foot of the frame,
                // taking the frame's own padding back: nine 44px targets need
                // 396px and the padded content box is 382px in a hero column,
                // which is exactly how the ninth step used to end up orphaned on
                // a row of its own. Beside the stage it is a plain list.
                'border-border-subtle -mx-3 border-t px-1 pt-2 sm:-mx-4',
                'lg:mx-0 lg:border-t-0 lg:px-0 lg:pt-0',
                // Nine wraps evenly or not at all: three is the only other
                // number that divides it. Three rows of three on a phone, one
                // row of nine once nine targets fit, one column beside the
                // stage once there is room for one.
                'grid grid-cols-3 gap-x-1 gap-y-1 sm:grid-cols-9 lg:grid-cols-1 lg:gap-y-0.5',
              )}
            >
              {scenes.map((scene, index) => (
                <li key={scene.id} className="min-w-0">
                  <button
                    type="button"
                    onClick={() => jump(index)}
                    aria-current={index === active ? 'step' : undefined}
                    aria-label={scene.jumpLabel}
                    title={scene.jumpLabel}
                    className={cn(
                      'flex min-h-11 w-full min-w-11 flex-col items-center justify-center gap-1.5',
                      'rounded-sm px-1 lg:items-stretch lg:justify-start lg:px-2 lg:py-1.5',
                      'hover:bg-surface-hover',
                      index === active
                        ? 'text-text-primary lg:bg-surface-raised'
                        : 'text-text-tertiary',
                    )}
                  >
                    <span className="flex items-baseline gap-2">
                      <span className="text-label font-mono tabular-nums">{index + 1}</span>
                      {/*
                        The step's name, at the width where the list is a column
                        with room for it. Hidden below that, where the button is
                        a 44px tick and the name is its accessible name.
                      */}
                      <span className="text-body-sm hidden min-w-0 text-start leading-[1.4] lg:block">
                        {scene.label}
                      </span>
                    </span>
                    <span
                      className={cn(
                        'block h-0.5 w-full max-w-8 overflow-hidden rounded-full lg:max-w-none',
                        // Below the column width the empty track is the tick,
                        // so all nine are drawn. In the column, nine hairlines
                        // read as nine underlines, so only the step being
                        // played carries one.
                        index === active
                          ? 'bg-border-subtle'
                          : 'bg-border-subtle lg:bg-transparent',
                      )}
                    >
                      <span
                        aria-hidden="true"
                        ref={(node) => {
                          fillRefs.current[index] = node;
                        }}
                        className={cn(
                          'block h-full w-full rounded-full',
                          index === active ? 'bg-accent-cool' : 'bg-transparent',
                        )}
                        // `transform-origin` has no logical form, so the growth
                        // direction is resolved against `dir` the same way
                        // `Marquee` resolves its travel.
                        style={{
                          transform: 'scaleX(0)',
                          transformOrigin: dir === 'rtl' ? 'right center' : 'left center',
                        }}
                      />
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </DemoFrame>
    </div>
  );
}
