import type { ReactNode } from 'react';
import { cn } from '@relay/design-system/utils';

import { Eyebrow } from '@/features/marketing/components/editorial';

/**
 * The frame every demonstration sits in.
 *
 * It exists to make one thing impossible to miss and impossible to skip: this
 * is a demonstration filled with sample content, not somebody's account. The
 * statement is a `<figcaption>` inside a `<figure>`, which means it names the
 * figure for assistive technology rather than sitting near it as unrelated
 * prose, so a screen reader user meets the disclaimer with the panel instead of
 * after it.
 *
 * The frame is deliberately quiet: a dashed hairline and a small label. A
 * chrome-heavy browser frame or a drawn device would be decoration standing in
 * for a screenshot, and the panels inside are the real interface, so dressing
 * them up would only make them look less real.
 */
export interface DemoFrameProps {
  /** Short label, for example "Demonstration". */
  readonly badge: string;
  /** The sentence that says this is sample content and submits nothing. */
  readonly caption: string;
  /** Optional control beside the badge, for example the pause button. */
  readonly control?: ReactNode;
  readonly className?: string;
  readonly children: ReactNode;
}

export function DemoFrame({
  badge,
  caption,
  control,
  className,
  children,
}: DemoFrameProps): ReactNode {
  return (
    <figure
      className={cn(
        'border-border-strong bg-surface-sunken rounded-lg border border-dashed',
        'p-3 sm:p-4',
        className,
      )}
    >
      {/*
        The control row keeps its height whether or not a control is in it, so
        a pause button that only exists once JavaScript has confirmed the
        reader did not ask for reduced motion cannot shift the panel when it
        appears.
      */}
      <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <Eyebrow>{badge}</Eyebrow>
        {control}
      </div>

      <div className="space-y-3">{children}</div>

      <figcaption className="text-body-sm text-text-tertiary mt-4 max-w-[62ch] leading-[1.6]">
        {caption}
      </figcaption>
    </figure>
  );
}

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
