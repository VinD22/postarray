'use client';

import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface EmptyStateProps {
  /** What is not here yet. A noun phrase, not an apology. */
  title: ReactNode;
  /** Why this screen is worth using, in one or two sentences. */
  description: ReactNode;
  /**
   * A real example of what the user would see once this is populated. Not a
   * placeholder rectangle: an actual sentence, row or short list they can
   * recognise. This is what turns an empty screen into an explanation.
   */
  example?: ReactNode;
  /** Exactly one primary action. A second choice belongs in `secondaryAction`. */
  action?: ReactNode;
  secondaryAction?: ReactNode;
  /**
   * A small illustration slot. Geometry only: a diagram of the flow, an
   * outlined icon. Never a stock scene and never a decorative blob.
   */
  illustration?: ReactNode;
  className?: string;
  /** Constrain the height when the state sits inside a panel rather than a page. */
  compact?: boolean;
}

/**
 * The empty state.
 *
 * The rules that keep these useful: name the thing that is missing, explain
 * what it is for, show a real example, offer one action. An empty state with
 * three equally weighted buttons is a menu, and an empty state with a large
 * illustration and no example is decoration.
 */
export function EmptyState({
  title,
  description,
  example,
  action,
  secondaryAction,
  illustration,
  className,
  compact = false,
}: EmptyStateProps): ReactNode {
  return (
    <section
      className={cn(
        // A quiet sunken surface behind a dashed hairline. The dashed edge is
        // the whole signal that this area is waiting to be filled; the poster
        // shapes that used to sit in the corner were decoration competing with
        // the one real illustration slot below.
        'border-border-default flex flex-col items-start gap-3 rounded-lg border border-dashed',
        'bg-surface-sunken p-6',
        compact ? 'py-5' : 'py-10',
        className,
      )}
    >
      <div className="flex flex-col items-start gap-3">
        {illustration ? (
          <div aria-hidden="true" className="text-text-tertiary">
            {illustration}
          </div>
        ) : null}

        <div className="flex max-w-[60ch] flex-col gap-1.5">
          <h2 className="text-title-sm text-text-primary">{title}</h2>
          <p className="text-body-md text-text-secondary">{description}</p>
        </div>

        {example ? (
          <div
            className={cn(
              // Raised, because the surrounding empty state is now sunken:
              // the example has to read as a real row sitting on the surface.
              'border-border-default w-full max-w-[60ch] rounded-md border',
              'bg-surface-raised text-body-sm text-text-secondary p-3',
            )}
          >
            {example}
          </div>
        ) : null}

        {action || secondaryAction ? (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {action}
            {secondaryAction}
          </div>
        ) : null}
      </div>
    </section>
  );
}
