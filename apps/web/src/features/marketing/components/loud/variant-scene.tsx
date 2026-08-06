'use client';

import { Check } from 'lucide-react';
import type { ReactNode } from 'react';

import { PinnedScene, StaggerList } from '@/components/motion';
import { ProviderMark } from '@/features/connections/provider';
import type { ProviderId } from '@/lib/api/types';
import { useBreakpoint } from '@relay/design-system/hooks';
import { cn } from '@relay/design-system/utils';

import { PosterCard } from './poster-card';

export interface VariantRow {
  readonly id: string;
  readonly provider: ProviderId;
  /** Already-translated. */
  readonly account: string;
  readonly variant: string;
  readonly check: string;
}

export interface VariantSceneProps {
  readonly rows: readonly VariantRow[];
  /** Already-translated. */
  readonly masterLabel: string;
  /** Already-translated, one per row, e.g. "1 of 5" .. "5 of 5". */
  readonly progressLabels: readonly string[];
  readonly className?: string;
}

/**
 * "One draft, five platform-native variants", pinned and scrubbed.
 *
 * The visible scene — whichever of `PinnedScene` (desktop, motion allowed) or
 * the static stacked fallback (narrow viewport, or reduced motion) is
 * showing — is presentation only and carries `aria-hidden`. A plain,
 * always-present `<dl>` right below it is the one accessible copy of the
 * five variants: real `<dt>`/`<dd>` pairs, `sr-only`, identical on every
 * device and every motion preference. This is deliberately a second, simpler
 * source of truth rather than trying to make the scrubbed, absolutely
 * positioned scene itself fully screen-reader navigable.
 *
 * `PinnedScene` only mounts at `lg` (1024px) and up — its own ~300vh scrub is
 * wasted screen-estate below that width — and only once `useBreakpoint`
 * resolves on the client; both the server render and the first paint show
 * the static stack, so nothing is ever hidden, only widened later (see
 * `useMediaQuery`'s own doc comment). No frame contains a focusable element,
 * so tabbing through the page never catches on the pin.
 */
export function VariantScene({
  rows,
  masterLabel,
  progressLabels,
  className,
}: VariantSceneProps): ReactNode {
  const isDesktop = useBreakpoint('lg', false);

  const scenes = rows.map((_, revealThrough) => (
    <Frame
      key={rows[revealThrough]?.id ?? revealThrough}
      rows={rows}
      revealCount={revealThrough + 1}
      masterLabel={masterLabel}
      progressLabel={progressLabels[revealThrough] ?? ''}
    />
  ));

  return (
    <div className={className}>
      <div aria-hidden="true">
        {isDesktop ? (
          <PinnedScene scenes={scenes} />
        ) : (
          <StaticStack rows={rows} masterLabel={masterLabel} />
        )}
      </div>

      <dl className="sr-only">
        <dt>{masterLabel}</dt>
        {rows.map((row) => (
          <div key={row.id}>
            <dt>{row.account}</dt>
            <dd>{row.variant}</dd>
            <dd>{row.check}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Frame({
  rows,
  revealCount,
  masterLabel,
  progressLabel,
}: {
  readonly rows: readonly VariantRow[];
  readonly revealCount: number;
  readonly masterLabel: string;
  readonly progressLabel: string;
}): ReactNode {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-6">
      <p className="text-label text-text-secondary font-mono tracking-wide">{progressLabel}</p>
      <div className="flex w-full max-w-[68rem] flex-wrap items-start justify-center gap-6">
        <PosterCard tone="ink" className="w-60 shrink-0">
          <p className="text-label tracking-wide uppercase">{masterLabel}</p>
        </PosterCard>
        {rows.slice(0, revealCount).map((row) => (
          <VariantCard key={row.id} row={row} />
        ))}
      </div>
    </div>
  );
}

function StaticStack({
  rows,
  masterLabel,
}: {
  readonly rows: readonly VariantRow[];
  readonly masterLabel: string;
}): ReactNode {
  return (
    <StaggerList className="flex flex-wrap justify-center gap-6 py-8">
      <div data-stagger-item>
        <PosterCard tone="ink" className="w-60 shrink-0">
          <p className="text-label tracking-wide uppercase">{masterLabel}</p>
        </PosterCard>
      </div>
      {rows.map((row) => (
        <div key={row.id} data-stagger-item>
          <VariantCard row={row} />
        </div>
      ))}
    </StaggerList>
  );
}

function VariantCard({ row }: { readonly row: VariantRow }): ReactNode {
  return (
    <PosterCard tone="paper" className={cn('w-60 shrink-0')}>
      <div className="flex items-center gap-2">
        <ProviderMark provider={row.provider} labelledBySibling />
        <span className="text-body-sm text-text-secondary">{row.account}</span>
      </div>
      <p className="text-body-md text-text-primary mt-3">{row.variant}</p>
      <div className="text-body-sm text-text-tertiary mt-4 flex items-start gap-2">
        <Check aria-hidden="true" className="text-success-fg mt-0.5 size-4 shrink-0" />
        <span>{row.check}</span>
      </div>
    </PosterCard>
  );
}
