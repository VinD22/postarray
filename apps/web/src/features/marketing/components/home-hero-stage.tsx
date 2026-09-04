import { Check, Layers3 } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@relay/design-system/utils';

import { ProviderLogo } from './editorial/provider-logo';
import type { CoreProviderId } from '@relay/contracts';

export interface HomeHeroStageRow {
  readonly id: string;
  readonly provider: CoreProviderId;
  readonly account: string;
}

export interface HomeHeroStageProps {
  readonly rows: readonly HomeHeroStageRow[];
  readonly masterLabel: string;
  readonly caption: string;
}

const TARGET_POSITION_CLASSES = [
  'top-[7%] end-[7%]',
  'top-[25%] end-[1%]',
  'top-[43%] end-[8%]',
  'top-[61%] end-[2%]',
  'top-[79%] end-[10%]',
] as const;

/**
 * The hero's product story in one glance: a source draft on the inline-start
 * edge and the real launch cohort fanning out on the inline-end edge.
 *
 * This is deliberately an illustration, not a dashboard screenshot. Every
 * account name is sample content and the caption says so. The route lines are
 * decorative, while every provider is still named in text beside its official
 * mark, so the idea survives reduced motion, greyscale and screen readers.
 */
export function HomeHeroStage({ rows, masterLabel, caption }: HomeHeroStageProps): ReactNode {
  return (
    <figure className="relative">
      <div
        className={cn(
          'home-publish-stage border-border-strong bg-surface-inverted relative isolate',
          'rounded-poster shadow-hard-lg min-h-[31rem] overflow-hidden border sm:min-h-[35rem]',
        )}
      >
        <div
          aria-hidden="true"
          className="border-text-inverted/10 absolute -start-36 top-1/2 size-[30rem] -translate-y-1/2 rounded-full border"
        />
        <div
          aria-hidden="true"
          className="border-text-inverted/10 absolute -start-20 top-1/2 size-[22rem] -translate-y-1/2 rounded-full border"
        />

        <svg
          aria-hidden="true"
          viewBox="0 0 640 560"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full rtl:-scale-x-100"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1.5">
            <path
              className="home-publish-route text-accent-warm"
              d="M170 280 C310 280 340 70 535 70"
            />
            <path
              className="home-publish-route text-accent-cool"
              d="M170 280 C320 280 360 170 575 170"
            />
            <path
              className="home-publish-route text-accent"
              d="M170 280 C330 280 365 270 525 270"
            />
            <path
              className="home-publish-route text-accent-action"
              d="M170 280 C320 280 360 370 565 370"
            />
            <path
              className="home-publish-route text-text-inverted/40"
              d="M170 280 C300 280 350 470 515 470"
            />
          </g>
        </svg>

        <div
          className={cn(
            'bg-surface-raised text-text-primary absolute start-[6%] top-1/2 z-(--z-index-raised)',
            'shadow-overlay w-[7.5rem] -translate-y-1/2 rounded-lg border border-transparent p-3',
            'sm:start-[8%] sm:w-[10.5rem] sm:p-5',
          )}
        >
          <span className="bg-accent-action-subtle text-accent-action flex size-10 items-center justify-center rounded-md">
            <Layers3 aria-hidden="true" className="size-5" strokeWidth={1.7} />
          </span>
          <p className="text-title-sm mt-4 text-pretty">{masterLabel}</p>
          <div aria-hidden="true" className="mt-5 space-y-2.5">
            <span className="bg-border-default block h-1.5 w-full rounded-full" />
            <span className="bg-border-default block h-1.5 w-4/5 rounded-full" />
            <span className="bg-border-default block h-1.5 w-3/5 rounded-full" />
          </div>
        </div>

        <ol className="absolute inset-0 z-(--z-index-raised)">
          {rows.slice(0, TARGET_POSITION_CLASSES.length).map((row, index) => (
            <li
              key={row.id}
              className={cn(
                'home-publish-target bg-surface-raised text-text-primary absolute',
                'shadow-overlay flex min-h-14 w-[9.5rem] items-center gap-2.5 rounded-md border border-transparent px-3 py-2',
                'sm:min-h-16 sm:w-[12rem] sm:px-4',
                TARGET_POSITION_CLASSES[index],
              )}
            >
              <ProviderLogo provider={row.provider} className="size-5 shrink-0 sm:size-6" />
              <span className="min-w-0 flex-1">
                <span className="text-body-sm block truncate font-medium">{row.account}</span>
              </span>
              <Check
                aria-hidden="true"
                className="text-success-fg size-4 shrink-0"
                strokeWidth={2}
              />
            </li>
          ))}
        </ol>
      </div>

      <figcaption className="text-body-sm text-text-tertiary mt-4 max-w-[62ch] leading-[1.6]">
        {caption}
      </figcaption>
    </figure>
  );
}
