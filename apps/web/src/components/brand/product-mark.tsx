import type { ReactNode } from 'react';

import { cn } from '@relay/design-system/utils';

/**
 * The Post Array mark.
 *
 * Four offset publishing surfaces make one compact identity. It is decorative
 * beside the product name, so the visible wordmark remains the accessible
 * label everywhere this appears.
 */
export function ProductMark({ className }: { readonly className?: string }): ReactNode {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'bg-surface-inverted grid size-8 shrink-0 grid-cols-2 gap-[3px] rounded-md p-[7px]',
        className,
      )}
    >
      <span className="bg-accent rounded-[1px]" />
      <span className="bg-surface-canvas rounded-[1px]" />
      <span className="bg-text-tertiary rounded-[1px]" />
      <span className="bg-surface-raised rounded-[1px]" />
    </span>
  );
}
