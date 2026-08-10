'use client';

import { useRef, useState, type ReactNode } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { EASE_OUT_EXPO, EXPRESSIVE_SM } from '@/lib/motion/constants';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

import { DemoFrame } from './demo-frame';

/**
 * The hero demonstration: a draft, its platform-native versions, a time, and
 * the week they land on, revealed one stage at a time.
 *
 * ## What the motion is allowed to do
 *
 * It is additive only. Every stage is in the server-rendered HTML in its
 * finished state, and the timeline is built with `gsap.from`, so a reader with
 * `prefers-reduced-motion`, a reader with JavaScript off and a search engine
 * all get the complete panel with no animation at all. Nothing is ever hidden
 * from assistive technology: the sequence changes when a stage becomes
 * *visible*, never whether it exists.
 *
 * It also ends. The timeline plays once, over about three seconds, and stops
 * on the finished picture. There is no loop beside a headline competing with
 * the text for attention, which is the failure mode of most product-tour
 * animations.
 *
 * The control is a real button, not a hover target: pause, resume, and replay
 * once it has settled. It renders only when the timeline exists, because a
 * pause button on a panel that is not animating is a false affordance.
 *
 * ## What it is not
 *
 * It is not a live account and it does not submit anything. There is no form,
 * no destination and no state that outlives the page. The frame says so in a
 * `<figcaption>`, which is part of the figure's accessible name rather than
 * decoration beside it.
 */
export interface HeroDemoStage {
  readonly id: string;
  /** A finished panel, rendered on the server and handed over as a prop. */
  readonly content: ReactNode;
}

export interface HeroDemoProps {
  readonly badge: string;
  readonly caption: string;
  readonly pauseLabel: string;
  readonly playLabel: string;
  readonly replayLabel: string;
  readonly stages: readonly HeroDemoStage[];
  readonly className?: string;
}

/** Seconds each stage holds before the next one arrives. */
const STAGE_HOLD = 0.5;

export function HeroDemo({
  badge,
  caption,
  pauseLabel,
  playLabel,
  replayLabel,
  stages,
  className,
}: HeroDemoProps): ReactNode {
  const scope = useRef<HTMLDivElement>(null);
  const timeline = useRef<ReturnType<typeof gsap.timeline> | null>(null);
  const motionOk = useMotionOk();
  const [paused, setPaused] = useState(false);
  const [settled, setSettled] = useState(false);

  useGSAP(
    () => {
      if (!motionOk || !scope.current) return undefined;

      const panels = gsap.utils.toArray<HTMLElement>('[data-demo-stage]', scope.current);
      if (panels.length === 0) return undefined;

      const created = gsap.timeline({
        defaults: { duration: EXPRESSIVE_SM, ease: EASE_OUT_EXPO },
        onComplete: () => {
          setSettled(true);
        },
      });
      panels.forEach((panel, index) => {
        created.from(panel, { opacity: 0, y: 12 }, index === 0 ? 0 : `+=${STAGE_HOLD}`);
      });
      timeline.current = created;

      return () => {
        timeline.current = null;
      };
    },
    { scope, dependencies: [motionOk, stages.length] },
  );

  const toggle = (): void => {
    const current = timeline.current;
    if (!current) return;

    if (settled) {
      setSettled(false);
      setPaused(false);
      current.restart();
      return;
    }

    const next = !paused;
    current.paused(next);
    setPaused(next);
  };

  const label = settled ? replayLabel : paused ? playLabel : pauseLabel;
  const Icon = settled ? RotateCcw : paused ? Play : Pause;

  return (
    <DemoFrame
      badge={badge}
      caption={caption}
      className={className}
      control={
        motionOk ? (
          // Icon only, with the sentence as its accessible name. The frame is
          // about 26rem wide in the hero, and "Replay the demonstration" set
          // beside the badge wrapped onto the badge itself. A screen reader
          // still gets the whole sentence, and the target stays 44x44.
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={toggle}
            aria-label={label}
            title={label}
            className="min-h-11 min-w-11 shrink-0 px-0"
          >
            <Icon aria-hidden="true" className="size-4 shrink-0" />
          </Button>
        ) : undefined
      }
    >
      <div ref={scope} className={cn('space-y-3')}>
        {stages.map((stage) => (
          <div key={stage.id} data-demo-stage>
            {stage.content}
          </div>
        ))}
      </div>
    </DemoFrame>
  );
}
