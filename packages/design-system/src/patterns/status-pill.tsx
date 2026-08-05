'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Ban,
  CheckCircle2,
  CircleDashed,
  CircleSlash,
  Clock,
  FileText,
  Hourglass,
  Loader,
  RefreshCw,
  Send,
  ShieldCheck,
  ShieldQuestion,
  Upload,
  XOctagon,
} from 'lucide-react';
import { cn } from '../utils/cn.js';

/**
 * The fifteen publish states.
 *
 * These are the same states the domain uses, so a screen can never invent a
 * sixteenth or collapse two into one. Three of them are routinely confused and
 * are kept apart on purpose:
 *
 * - `partially_published` is not `failed`. Some external posts already exist
 *   and must never be described as if nothing happened.
 * - `retry_scheduled` is not `failed_permanently`. One is still going to run.
 * - `deleted_externally` is not `canceled`. Someone removed the post at the
 *   provider after we published it, which is a fact about the outside world.
 *
 * Every pill carries an icon, a tone and a word. Never colour alone.
 */
export type PublishState =
  | 'draft'
  | 'validation_needed'
  | 'approval_requested'
  | 'approved'
  | 'scheduled'
  | 'preparing_media'
  | 'dispatching'
  | 'provider_processing'
  | 'published'
  | 'partially_published'
  | 'action_required'
  | 'retry_scheduled'
  | 'failed_permanently'
  | 'canceled'
  | 'deleted_externally';

export const PUBLISH_STATES: readonly PublishState[] = [
  'draft',
  'validation_needed',
  'approval_requested',
  'approved',
  'scheduled',
  'preparing_media',
  'dispatching',
  'provider_processing',
  'published',
  'partially_published',
  'action_required',
  'retry_scheduled',
  'failed_permanently',
  'canceled',
  'deleted_externally',
];

type PillTone = 'neutral' | 'accent' | 'progress' | 'success' | 'warning' | 'destructive';

const toneClasses: Record<PillTone, string> = {
  neutral: 'border-border-default bg-surface-sunken text-text-secondary',
  accent: 'border-accent-subtle bg-accent-subtle text-text-accent',
  progress: 'border-info-border bg-info-bg text-info-fg',
  success: 'border-success-border bg-success-bg text-success-fg',
  warning: 'border-warning-border bg-warning-bg text-warning-fg',
  destructive: 'border-destructive-border bg-destructive-bg text-destructive-fg',
};

interface StateDefinition {
  readonly tone: PillTone;
  readonly icon: ReactNode;
  /** True while the state is expected to change on its own. */
  readonly inFlight: boolean;
}

const iconClass = 'size-3.5 shrink-0';

export const PUBLISH_STATE_DEFINITIONS: Readonly<Record<PublishState, StateDefinition>> = {
  draft: {
    tone: 'neutral',
    icon: <FileText aria-hidden="true" className={iconClass} />,
    inFlight: false,
  },
  validation_needed: {
    tone: 'warning',
    icon: <AlertTriangle aria-hidden="true" className={iconClass} />,
    inFlight: false,
  },
  approval_requested: {
    tone: 'warning',
    icon: <ShieldQuestion aria-hidden="true" className={iconClass} />,
    inFlight: false,
  },
  approved: {
    tone: 'accent',
    icon: <ShieldCheck aria-hidden="true" className={iconClass} />,
    inFlight: false,
  },
  scheduled: {
    tone: 'accent',
    icon: <Clock aria-hidden="true" className={iconClass} />,
    inFlight: false,
  },
  preparing_media: {
    tone: 'progress',
    icon: <Upload aria-hidden="true" className={iconClass} />,
    inFlight: true,
  },
  dispatching: {
    tone: 'progress',
    icon: <Send aria-hidden="true" className={iconClass} />,
    inFlight: true,
  },
  provider_processing: {
    tone: 'progress',
    icon: <Hourglass aria-hidden="true" className={iconClass} />,
    inFlight: true,
  },
  published: {
    tone: 'success',
    icon: <CheckCircle2 aria-hidden="true" className={iconClass} />,
    inFlight: false,
  },
  partially_published: {
    tone: 'warning',
    icon: <AlertCircle aria-hidden="true" className={iconClass} />,
    inFlight: false,
  },
  action_required: {
    tone: 'warning',
    icon: <CircleDashed aria-hidden="true" className={iconClass} />,
    inFlight: false,
  },
  retry_scheduled: {
    tone: 'progress',
    icon: <RefreshCw aria-hidden="true" className={iconClass} />,
    inFlight: true,
  },
  failed_permanently: {
    tone: 'destructive',
    icon: <XOctagon aria-hidden="true" className={iconClass} />,
    inFlight: false,
  },
  canceled: {
    tone: 'neutral',
    icon: <Ban aria-hidden="true" className={iconClass} />,
    inFlight: false,
  },
  deleted_externally: {
    tone: 'destructive',
    icon: <CircleSlash aria-hidden="true" className={iconClass} />,
    inFlight: false,
  },
};

export interface StatusPillProps extends ComponentPropsWithoutRef<'span'> {
  state: PublishState;
  /** The translated state name. Required: the pill is never icon-only. */
  label: string;
  /** Extra context after the label, for example the target count. */
  detail?: ReactNode;
  size?: 'sm' | 'md';
  /**
   * Show a spinner for the in-flight states. Off by default, because a queue
   * of forty rows each spinning is noise, not information.
   */
  showActivity?: boolean;
}

export const StatusPill = forwardRef<HTMLSpanElement, StatusPillProps>(function StatusPill(
  { className, state, label, detail, size = 'md', showActivity = false, ...props },
  ref,
) {
  const definition = PUBLISH_STATE_DEFINITIONS[state];
  const spinning = showActivity && definition.inFlight;

  return (
    <span
      ref={ref}
      data-state={state}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border whitespace-nowrap',
        size === 'sm' ? 'text-label px-1.5 py-0.5' : 'text-body-sm px-2 py-1',
        toneClasses[definition.tone],
        className,
      )}
      {...props}
    >
      {spinning ? (
        <Loader
          aria-hidden="true"
          className={cn(iconClass, 'relay-anim-spin motion-reduce:animate-none')}
        />
      ) : (
        definition.icon
      )}
      <span className="font-medium">{label}</span>
      {detail ? <span className="text-text-secondary">{detail}</span> : null}
    </span>
  );
});
