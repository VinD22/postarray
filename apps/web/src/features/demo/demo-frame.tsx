import type { ReactNode } from 'react';
import { cn } from '@relay/design-system/utils';

import { Eyebrow } from '@/features/marketing/components/editorial';

/**
 * One panel inside a demonstration: a labelled surface carrying one step of
 * the workflow.
 */
export interface DemoPanelProps {
  readonly label: string;
  readonly className?: string;
  readonly children: ReactNode;
}

export function DemoPanel({ label, className, children }: DemoPanelProps): ReactNode {
  return (
    <div
      className={cn(
        'border-border-default bg-surface-raised rounded-md border p-3 sm:p-4',
        className,
      )}
    >
      <Eyebrow>{label}</Eyebrow>
      <div className="mt-3">{children}</div>
    </div>
  );
}
