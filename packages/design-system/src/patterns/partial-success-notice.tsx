'use client';

import type { ReactNode } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../utils/cn';
import { Notice } from './notice';

export interface PartialSuccessTarget {
  readonly id: string;
  /** The account this target published to, identified exactly. */
  readonly account: ReactNode;
  readonly outcome: 'succeeded' | 'failed';
  /** For a success: the permalink or external id. For a failure: the reason. */
  readonly detail?: ReactNode;
}

export interface PartialSuccessNoticeProps {
  /** For example: published to four of six accounts. Already formatted. */
  title: ReactNode;
  /**
   * What this means for the user. It must be explicit that the successful
   * posts already exist externally and will not be rolled back.
   */
  description: ReactNode;
  targets: readonly PartialSuccessTarget[];
  /** Column heading for the succeeded group, from the message catalog. */
  succeededLabel: ReactNode;
  /** Column heading for the failed group. */
  failedLabel: ReactNode;
  /**
   * Retry only the failed targets. Never offer a retry that would re-run the
   * successful ones, which is why this takes the failed set explicitly.
   */
  actions?: ReactNode;
  className?: string;
}

/**
 * Partial success.
 *
 * The single most important state in the publishing flow and the easiest one
 * to get wrong. When one target succeeds and another fails, the campaign is
 * neither published nor failed: real posts exist in the world and cannot be
 * undone by a retry.
 *
 * This component therefore always splits the result into the two groups, names
 * every account, and never shows a single aggregate icon that would let a user
 * conclude nothing happened.
 */
export function PartialSuccessNotice({
  title,
  description,
  targets,
  succeededLabel,
  failedLabel,
  actions,
  className,
}: PartialSuccessNoticeProps): ReactNode {
  const succeeded = targets.filter((target) => target.outcome === 'succeeded');
  const failed = targets.filter((target) => target.outcome === 'failed');

  return (
    <Notice
      tone="warning"
      liveness="status"
      title={title}
      description={
        <div className="flex flex-col gap-3">
          <p>{description}</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <TargetGroup label={succeededLabel} targets={succeeded} outcome="succeeded" />
            <TargetGroup label={failedLabel} targets={failed} outcome="failed" />
          </div>
        </div>
      }
      actions={actions}
      className={className}
    />
  );
}

function TargetGroup({
  label,
  targets,
  outcome,
}: {
  label: ReactNode;
  targets: readonly PartialSuccessTarget[];
  outcome: 'succeeded' | 'failed';
}): ReactNode {
  if (targets.length === 0) return null;
  return (
    <div className="flex flex-col gap-1">
      <p className="text-label text-text-tertiary">{label}</p>
      <ul className="flex flex-col gap-1">
        {targets.map((target) => (
          <li key={target.id} className="flex items-start gap-1.5">
            {outcome === 'succeeded' ? (
              <CheckCircle2
                aria-hidden="true"
                className="text-success-fg mt-0.5 size-3.5 shrink-0"
              />
            ) : (
              <XCircle
                aria-hidden="true"
                className="text-destructive-fg mt-0.5 size-3.5 shrink-0"
              />
            )}
            <span className={cn('flex min-w-0 flex-col')}>
              <span className="text-text-primary">{target.account}</span>
              {target.detail ? <span className="text-text-tertiary">{target.detail}</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
