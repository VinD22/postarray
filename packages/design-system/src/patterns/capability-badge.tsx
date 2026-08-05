'use client';

import type { ReactNode } from 'react';
import { CircleDashed, CircleSlash, Clock3, Check } from 'lucide-react';
import { cn } from '../utils/cn.js';

/**
 * Connector capability states.
 *
 * The distinction between `unsupported` and `not_implemented` is a hard rule
 * of this codebase, and this badge is where a user sees it:
 *
 * - `supported`: built, tested against the provider simulator and the recorded
 *   fixtures, and past the connector definition of done.
 * - `unsupported`: the provider's official API does not offer it. No amount of
 *   work on our side will change this.
 * - `not_implemented`: the provider offers it and we have not built it yet.
 * - `requires_review`: built, but gated behind the provider's app review or a
 *   production access approval that is still pending.
 *
 * Collapsing the middle two into "unavailable" would tell a customer that a
 * platform cannot do something when the truth is that we have not shipped it.
 */
export type CapabilityState = 'supported' | 'unsupported' | 'not_implemented' | 'requires_review';

const stateClass: Record<CapabilityState, string> = {
  supported: 'border-success-border bg-success-bg text-success-fg',
  unsupported: 'border-border-default bg-surface-sunken text-text-secondary',
  not_implemented: 'border-info-border bg-info-bg text-info-fg',
  requires_review: 'border-warning-border bg-warning-bg text-warning-fg',
};

const stateIcon: Record<CapabilityState, ReactNode> = {
  supported: <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />,
  unsupported: <CircleSlash aria-hidden="true" className="size-3.5" />,
  not_implemented: <CircleDashed aria-hidden="true" className="size-3.5" />,
  requires_review: <Clock3 aria-hidden="true" className="size-3.5" />,
};

export interface CapabilityBadgeProps {
  state: CapabilityState;
  /** The translated state name. Required: this is never icon-only. */
  label: string;
  /** A short qualifier, for example the review submission date. */
  detail?: ReactNode;
  className?: string;
}

export function CapabilityBadge({
  state,
  label,
  detail,
  className,
}: CapabilityBadgeProps): ReactNode {
  return (
    <span
      data-capability={state}
      className={cn(
        'text-body-sm inline-flex items-center gap-1.5 rounded-md border px-2 py-1',
        stateClass[state],
        className,
      )}
    >
      {stateIcon[state]}
      <span className="font-medium">{label}</span>
      {detail ? <span className="text-text-secondary">{detail}</span> : null}
    </span>
  );
}
