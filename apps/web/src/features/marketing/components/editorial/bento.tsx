import type { ReactNode } from 'react';
import { cn } from '@relay/design-system/utils';

/**
 * The bento band's grid.
 *
 * Built for the home page's proof band and moved here, per the note that used
 * to sit in `home/index.ts`, the day a second page wanted it: pricing's
 * "why one price" band, product's compose demonstration and screenshot, and
 * integrations' platform and capability stats all lay their cells out with
 * this same grid. Nothing below is home-specific; every page that reaches for
 * it gets the same guarantee.
 *
 * ## What this exists to prevent
 *
 * A row of three identical cards is banned outright by the design system, and
 * a plain `grid-cols-3` is the shortest path back to one. So the span is not a
 * number a call site picks: it is a named role, there are three of them, and
 * two of the three are different widths by construction. A grid whose cells
 * are all `lead` does not tile, and a grid whose cells are all `side` leaves a
 * visible hole — the layout itself argues against the uniform case rather than
 * relying on a reviewer noticing it.
 *
 * The roles, on the 12 column track:
 *
 *   `lead`  seven columns and two rows. The evidence: something with real
 *           product output in it, tall enough to be read rather than glanced
 *           at.
 *   `side`  five columns, one row. Two of these stack beside one `lead` and
 *           the three of them close the block exactly.
 *   `full`  all twelve. For a cell that is a rule or a run of copy rather than
 *           a panel.
 *
 * Below `lg` every cell is one column wide and the roles collapse, which is
 * the reading order and needs no reordering.
 *
 * ## Surface
 *
 * `surface="panel"` is a paper panel at the poster radius (`--radius-poster`,
 * the one 20px radius the system keeps for marketing). `surface="bare"` draws
 * nothing at all, and it exists for the cell whose content is already made of
 * panels: cards inside a card is the failure mode a bento invites, and the
 * variant scene is nine cards.
 */
export type BentoCellSpan = 'lead' | 'side' | 'full';
export type BentoCellSurface = 'panel' | 'bare';

const SPAN_CLASS: Record<BentoCellSpan, string> = {
  lead: 'lg:col-span-7 lg:row-span-2',
  side: 'lg:col-span-5',
  full: 'lg:col-span-12',
};

const SURFACE_CLASS: Record<BentoCellSurface, string> = {
  // `rounded-poster` is `--radius-poster`, 20px, the marketing-only radius.
  // The ground is the raised paper surface rather than the canvas, so the cell
  // separates from the tinted band underneath it in both themes.
  panel: 'border-border-subtle bg-surface-raised rounded-poster border p-6 md:p-8',
  bare: '',
};

export interface BentoGridProps {
  readonly className?: string;
  readonly children: ReactNode;
}

export function BentoGrid({ className, children }: BentoGridProps): ReactNode {
  return (
    <div className={cn('grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-8', className)}>
      {children}
    </div>
  );
}

export interface BentoCellProps {
  readonly span: BentoCellSpan;
  readonly surface?: BentoCellSurface;
  /** Renders as `<div>` by default; `<section>` when the cell has its own heading. */
  readonly as?: 'div' | 'section';
  readonly id?: string;
  /** Accessible name, for a cell with no visible heading. */
  readonly ariaLabel?: string;
  readonly className?: string;
  readonly children: ReactNode;
}

export function BentoCell({
  span,
  surface = 'panel',
  as: Tag = 'div',
  id,
  ariaLabel,
  className,
  children,
}: BentoCellProps): ReactNode {
  return (
    <Tag
      id={id}
      aria-label={ariaLabel}
      data-bento-span={span}
      className={cn('min-w-0', SPAN_CLASS[span], SURFACE_CLASS[surface], className)}
    >
      {children}
    </Tag>
  );
}
