'use client';

import {
  CalendarClock,
  ChartNoAxesCombined,
  CheckCheck,
  FileCheck2,
  FileInput,
  Layers3,
  Send,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { HeroWebglStage } from '@/lib/motion/webgl/hero-webgl-stage';

export type HomeJourneyStepId =
  'source' | 'compose' | 'validate' | 'approve' | 'schedule' | 'publish' | 'learn';

export interface HomeJourneyStep {
  readonly id: HomeJourneyStepId;
  readonly title: string;
  readonly body: string;
}

export interface HomeJourneyProps {
  readonly steps: readonly HomeJourneyStep[];
  readonly label: string;
}

const STEP_ICONS: Record<HomeJourneyStepId, LucideIcon> = {
  source: FileInput,
  compose: Layers3,
  validate: CheckCheck,
  approve: FileCheck2,
  schedule: CalendarClock,
  publish: Send,
  learn: ChartNoAxesCombined,
};

/**
 * One persistent route map makes the seven tabs feel like one journey. The
 * publish stop earns the real fan-out diagram; every other stop stays a cheap
 * DOM illustration. Both are decorative beside the complete text explanation.
 */
function JourneyMap({
  steps,
  activeIndex,
  activeId,
}: {
  readonly steps: readonly HomeJourneyStep[];
  readonly activeIndex: number;
  readonly activeId: HomeJourneyStepId;
}): ReactNode {
  const ActiveIcon = STEP_ICONS[activeId];

  return (
    <div
      aria-hidden="true"
      className="border-border-subtle bg-surface-canvas absolute [inset-block:calc(var(--spacing)*7)] end-7 hidden w-[38%] overflow-hidden rounded-lg border md:block lg:[inset-block:calc(var(--spacing)*10)] lg:end-10"
    >
      <span className="border-border-default absolute [inset-block:calc(var(--spacing)*9)] start-[1.9375rem] border-s" />
      <ol className="absolute [inset-block:calc(var(--spacing)*6)] start-5 z-(--z-index-raised) flex flex-col justify-between">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={cn(
              'relative flex size-6 items-center justify-center rounded-md border text-[0.625rem] font-semibold tabular-nums transition-[transform,background-color,color,border-color] duration-(--duration-slow)',
              index < activeIndex && 'border-accent bg-accent text-accent-on',
              index === activeIndex &&
                'border-border-bold bg-surface-inverted text-text-inverted shadow-raised scale-110',
              index > activeIndex && 'border-border-default bg-surface-raised text-text-tertiary',
            )}
          >
            {index + 1}
          </li>
        ))}
      </ol>

      {activeId === 'publish' ? (
        <HeroWebglStage className="absolute [inset-block:calc(var(--spacing)*4)] start-14 end-2" />
      ) : (
        <div className="absolute [inset-block:calc(var(--spacing)*8)] start-16 end-6 flex items-center justify-center">
          <span className="border-border-default bg-surface-raised shadow-raised relative flex aspect-square w-[min(72%,12rem)] items-center justify-center rounded-lg border">
            <span className="border-border-subtle absolute -start-3 -top-3 size-full rounded-lg border" />
            <span className="border-border-subtle absolute -end-3 -bottom-3 size-full rounded-lg border" />
            <ActiveIcon className="text-accent relative size-12" strokeWidth={1.25} />
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Seven stages, but only one argument at a time. The old page stacked every
 * long explanation in the scroll, which made the workflow feel harder than it
 * is. Tabs keep the complete product story in the DOM while letting a reader
 * choose how deeply to inspect it.
 */
export function HomeJourney({ steps, label }: HomeJourneyProps): ReactNode {
  const firstStep = steps[0];
  if (!firstStep) return null;

  return (
    <Tabs
      defaultValue={firstStep.id}
      orientation="vertical"
      className="grid gap-8 lg:grid-cols-[minmax(15rem,0.72fr)_minmax(0,1.6fr)] lg:gap-14"
    >
      <TabsList
        aria-label={label}
        className="flex items-stretch gap-2 overflow-x-auto border-0 pb-2 lg:grid lg:grid-cols-1 lg:overflow-visible lg:pb-0"
      >
        {steps.map((step, index) => {
          const Icon = STEP_ICONS[step.id];
          return (
            <TabsTrigger
              key={step.id}
              value={step.id}
              className={cn(
                'group -mb-0 min-h-14 w-[15rem] shrink-0 justify-start gap-3 rounded-lg border px-3 py-3 text-start lg:w-auto',
                'border-transparent bg-transparent whitespace-normal',
                'hover:bg-surface-raised hover:text-text-primary',
                'data-[state=active]:border-border-strong data-[state=active]:bg-surface-inverted',
                'data-[state=active]:text-text-inverted data-[state=active]:shadow-hard',
              )}
            >
              <span
                className={cn(
                  'border-border-default bg-surface-raised text-text-secondary flex size-9 shrink-0 items-center justify-center rounded-md border',
                  'group-data-[state=active]:border-text-inverted/20 group-data-[state=active]:bg-text-inverted/10 group-data-[state=active]:text-text-inverted',
                )}
              >
                <Icon aria-hidden="true" className="size-[1.125rem]" strokeWidth={1.7} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-mono text-[0.6875rem] opacity-60">0{index + 1}</span>
                <span className="text-body-md ms-3 font-semibold">{step.title}</span>
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      <div className="min-w-0">
        {steps.map((step, index) => {
          const Icon = STEP_ICONS[step.id];
          return (
            <TabsContent key={step.id} value={step.id} className="pt-0">
              <article
                className={cn(
                  'home-journey-panel border-border-subtle bg-surface-raised relative isolate',
                  'rounded-poster shadow-hard min-h-[28rem] overflow-hidden border p-7 md:p-10 lg:min-h-[32rem]',
                )}
              >
                <div
                  aria-hidden="true"
                  className="border-border-subtle absolute -end-20 -top-20 size-80 rounded-full border"
                />
                <div
                  aria-hidden="true"
                  className="border-border-subtle absolute -end-5 top-12 size-48 rounded-full border"
                />

                <JourneyMap steps={steps} activeIndex={index} activeId={step.id} />

                <div className="relative flex min-h-[24rem] flex-col justify-between lg:min-h-[27rem]">
                  <div className="flex items-start justify-between gap-6">
                    <span className="bg-accent-action text-accent-action-on shadow-hard flex size-14 items-center justify-center rounded-lg sm:size-16">
                      <Icon aria-hidden="true" className="size-7 sm:size-8" strokeWidth={1.5} />
                    </span>
                    <span className="font-display text-display-lg text-border-default tabular-nums">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="relative max-w-[42rem] md:max-w-[55%]">
                    <h3 className="font-display text-display-lg text-text-primary text-balance">
                      {step.title}
                    </h3>
                    <p className="text-body-lg text-text-secondary mt-5 max-w-[62ch] leading-[1.7] text-pretty">
                      {step.body}
                    </p>
                  </div>

                  <div aria-hidden="true" className="mt-10 flex items-center gap-2">
                    {steps.map((item, itemIndex) => (
                      <span
                        key={item.id}
                        className={cn(
                          'h-1 rounded-full transition-[width,background-color] duration-(--duration-slow)',
                          itemIndex === index ? 'bg-accent-action w-10' : 'bg-border-default w-3',
                        )}
                      />
                    ))}
                  </div>
                </div>
              </article>
            </TabsContent>
          );
        })}
      </div>
    </Tabs>
  );
}
