'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
  XCircle,
} from 'lucide-react';
import { cn } from '../utils/cn.js';

export type NoticeTone = 'info' | 'success' | 'warning' | 'destructive' | 'neutral';

const toneClasses: Record<NoticeTone, string> = {
  info: 'border-info-border bg-info-bg text-info-fg',
  success: 'border-success-border bg-success-bg text-success-fg',
  warning: 'border-warning-border bg-warning-bg text-warning-fg',
  destructive: 'border-destructive-border bg-destructive-bg text-destructive-fg',
  neutral: 'border-border-default bg-surface-sunken text-text-secondary',
};

const toneIcons: Record<NoticeTone, ReactNode> = {
  info: <Info aria-hidden="true" className="size-4" />,
  success: <CheckCircle2 aria-hidden="true" className="size-4" />,
  warning: <AlertTriangle aria-hidden="true" className="size-4" />,
  destructive: <XCircle aria-hidden="true" className="size-4" />,
  neutral: <ShieldAlert aria-hidden="true" className="size-4" />,
};

export interface NoticeProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  tone?: NoticeTone;
  /** The headline. One sentence, specific about what happened. */
  title: ReactNode;
  /** What it means and what happens next. */
  description?: ReactNode;
  /** Actions. Keep to one primary plus at most one secondary. */
  actions?: ReactNode;
  /** Replaces the tone icon. */
  icon?: ReactNode;
  /**
   * `alert` for something that has already gone wrong and needs attention,
   * `status` for a condition the user should notice at their own pace.
   * Anything else stays a plain region.
   */
  liveness?: 'alert' | 'status' | 'none';
}

/**
 * The one banner shape used by every state notice in the product.
 *
 * A notice always carries three things: an icon, a coloured border and tint,
 * and words. Colour alone never distinguishes a warning from an error, which
 * is what makes these usable in greyscale, in high contrast mode, and for the
 * eight percent of men with a colour vision deficiency.
 *
 * It is a flat tinted rectangle with a 8px radius. No shadow, no left accent
 * bar, no illustration.
 */
export const Notice = forwardRef<HTMLDivElement, NoticeProps>(function Notice(
  {
    className,
    tone = 'info',
    title,
    description,
    actions,
    icon,
    liveness = 'none',
    children,
    ...props
  },
  ref,
) {
  return (
    <div
      ref={ref}
      role={liveness === 'none' ? undefined : liveness}
      aria-live={liveness === 'status' ? 'polite' : undefined}
      className={cn(
        'flex flex-col gap-2 rounded-lg border p-3',
        'sm:flex-row sm:items-start sm:gap-3',
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      <span className="mt-0.5 shrink-0">{icon ?? toneIcons[tone]}</span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-body-md font-medium">{title}</p>
        {description ? (
          <div className="text-body-sm text-text-secondary">{description}</div>
        ) : null}
        {children}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
});
