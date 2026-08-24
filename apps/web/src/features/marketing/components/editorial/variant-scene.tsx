'use client';

import { Check } from 'lucide-react';
import type { ReactNode } from 'react';

import { StaggerList } from '@/components/motion';
import { ProviderMark } from '@/features/connections/provider';
import type { ProviderId } from '@/lib/api/types';
import { cn } from '@relay/design-system/utils';

import { EditorialCard } from './card';
import { Eyebrow } from './eyebrow';

export interface EditorialVariantRow {
  readonly id: string;
  readonly provider: ProviderId;
  /** Already-translated. */
  readonly account: string;
  readonly variant: string;
  readonly check: string;
}

export interface EditorialVariantSceneProps {
  readonly rows: readonly EditorialVariantRow[];
  /** Already-translated label for the source draft, e.g. "Master draft". */
  readonly masterLabel: string;
  readonly className?: string;
}

/**
 * "One draft, N platform-native variants", shown as one still frame.
 *
 * The loud version of this scene pinned the viewport for roughly three screen
 * heights and scrubbed five crossfading frames as you scrolled, with a static
 * stacked fallback below `lg` and under reduced motion. Two frames of that
 * are worth keeping — the content, and the screen-reader contract — and the
 * rest is scroll hijacking: it takes the page away from the reader to reveal
 * information a grid can state at once, and the fallback it degraded to was
 * already this layout, which is the tell that the pin was decoration.
 *
 * So this is the fallback, promoted to the only rendering: the master draft
 * beside its variants, staggered in at 70ms as the block scrolls into view,
 * identical on every viewport width and every motion preference. Nothing here
 * is focusable, and nothing is hidden from assistive technology, so unlike the
 * pinned version there is no `aria-hidden` presentation copy and no separate
 * `<dl>` mirror to keep in sync — the visible cards are the accessible
 * content, which is one fewer place for the two to drift apart.
 */
export function EditorialVariantScene({
  rows,
  masterLabel,
  className,
}: EditorialVariantSceneProps): ReactNode {
  return (
    <StaggerList
      stagger={0.07}
      className={cn(
        // Auto-fill rather than fixed 15rem cards in a wrapping flex row: the
        // fixed version tiled to whatever multiple of 240px fit and left the
        // remainder of the cell empty — a visible column of nothing beside the
        // scene. The tracks now share the width they are given, so the scene
        // ends where its container does at every size.
        'grid grid-cols-[repeat(auto-fill,minmax(min(15rem,100%),1fr))] items-stretch gap-5',
        className,
      )}
    >
      <div data-stagger-item>
        <EditorialCard tone="inverted" interactive={false} className="h-full">
          <Eyebrow tone="inherit">{masterLabel}</Eyebrow>
        </EditorialCard>
      </div>
      {rows.map((row) => (
        <div key={row.id} data-stagger-item>
          <EditorialCard className="h-full">
            <div className="flex items-center gap-2">
              <ProviderMark provider={row.provider} labelledBySibling />
              <span className="text-body-sm text-text-secondary">{row.account}</span>
            </div>
            <p className="text-body-md text-text-primary mt-3">{row.variant}</p>
            <div className="text-body-sm text-text-tertiary mt-4 flex items-start gap-2">
              <Check aria-hidden="true" className="text-success-fg mt-0.5 size-4 shrink-0" />
              <span>{row.check}</span>
            </div>
          </EditorialCard>
        </div>
      ))}
    </StaggerList>
  );
}
