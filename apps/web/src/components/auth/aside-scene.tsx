import type { ReactNode } from 'react';

import { cn } from '@relay/design-system/utils';

import { ProviderMark } from '@/features/connections/provider';
import type { ProviderId } from '@/lib/api';

export interface AsideSceneCard {
  readonly provider: ProviderId;
  /** Already-translated platform name. */
  readonly name: string;
}

export interface AsideSceneProps {
  readonly cards: readonly AsideSceneCard[];
  readonly className?: string;
}

// Each card owns its own named keyframe, starting at a distinct stacked
// position (front / middle / back) so a `prefers-reduced-motion` visitor —
// where the animation collapses to 1ms with no `animation-fill-mode` — lands
// on that same resting position rather than all three cards snapping to an
// identical, un-animated transform. See `globals.css` for the keyframes.
const CARD_CLASS = ['relay-aside-card-a', 'relay-aside-card-b', 'relay-aside-card-c'] as const;

/**
 * Three overlapping "post preview" cards that slowly trade places.
 *
 * Purely decorative: the two bars inside each card stand in for a caption
 * that is never shown, so nothing here can be read as an invented post or a
 * real customer's content. The trade-places motion is three copies of one
 * shape, each animated by its own CSS keyframe (no JavaScript at all), which
 * is what lets `(auth)/layout.tsx` stay `force-static`. The global
 * `prefers-reduced-motion` override in `theme.css` freezes every card at its
 * keyframe's starting position for free — no JS branch needed here.
 */
export function AsideScene({ cards, className }: AsideSceneProps): ReactNode {
  return (
    <div aria-hidden="true" className={cn('relative h-40 w-full max-w-[18rem]', className)}>
      {cards.slice(0, 3).map((card, index) => (
        <div
          key={card.provider}
          className={cn(
            'bg-surface-raised border-border-bold inset-inline-start-0 absolute top-0',
            'shadow-hard flex w-[12rem] flex-col gap-2 rounded-lg border-2 p-3',
            CARD_CLASS[index],
          )}
        >
          <div className="flex items-center gap-2">
            <ProviderMark provider={card.provider} labelledBySibling />
            <span className="text-label text-text-secondary">{card.name}</span>
          </div>
          <span className="bg-surface-sunken block h-2 w-[85%] rounded-full" />
          <span className="bg-surface-sunken block h-2 w-[55%] rounded-full" />
        </div>
      ))}
    </div>
  );
}
