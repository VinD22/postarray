'use client';

import type { ReactNode } from 'react';
import { cn } from '../utils/cn.js';
import { Button } from '../primitives/button.js';
import { Code } from '../primitives/code.js';
import { Notice } from './notice.js';

export interface ErrorStateProps {
  /** What failed, in the user's terms. Name the account and the action. */
  title: ReactNode;
  /**
   * What it means and what happens next. If a draft was preserved, say so
   * here, because that is the first thing the user wants to know.
   */
  description: ReactNode;
  /**
   * The affected subject: the account, the connection, the scheduled post.
   * Rendered as a definition row so the user can see exactly what is affected
   * rather than inferring it from where the error appeared.
   */
  subject?: { label: ReactNode; value: ReactNode } | undefined;
  /**
   * A retry handler. Supply it only when retrying is genuinely safe. A publish
   * that may already have reached the provider must not offer a retry button,
   * because a second attempt would duplicate an external post.
   */
  onRetry?: (() => void) | undefined;
  retryLabel?: string | undefined;
  /** Retry is running. */
  retrying?: boolean;
  /** A secondary route out: contact support, open the connection settings. */
  secondaryAction?: ReactNode;
  /**
   * A sanitized support reference. Never a provider payload, never a token,
   * never an internal identifier the user cannot act on.
   */
  reference?: { label: ReactNode; value: string } | undefined;
  /** The user's work, preserved and still visible. */
  children?: ReactNode;
  className?: string;
}

/**
 * The error state.
 *
 * Four obligations, all of them non-negotiable:
 *
 * 1. Name the affected account or action. "Something went wrong" is not an
 *    error message, it is a shrug.
 * 2. Preserve the user's content. Anything passed as children stays on screen
 *    and stays editable.
 * 3. Say what happens next: whether it will retry itself, whether the draft is
 *    safe, whether an external post already exists.
 * 4. Offer retry only when retrying cannot cause a duplicate side effect.
 */
export function ErrorState({
  title,
  description,
  subject,
  onRetry,
  retryLabel,
  retrying = false,
  secondaryAction,
  reference,
  children,
  className,
}: ErrorStateProps): ReactNode {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Notice
        tone="destructive"
        liveness="alert"
        title={title}
        description={
          <div className="flex flex-col gap-2">
            <p>{description}</p>
            {subject ? (
              <p className="text-text-secondary">
                <span className="font-medium text-text-primary">{subject.label}</span>
                <span aria-hidden="true">{': '}</span>
                {subject.value}
              </p>
            ) : null}
            {reference ? (
              <p className="flex flex-wrap items-center gap-1.5 text-text-tertiary">
                {reference.label} <Code>{reference.value}</Code>
              </p>
            ) : null}
          </div>
        }
        actions={
          onRetry || secondaryAction ? (
            <>
              {onRetry && retryLabel ? (
                <Button
                  size="sm"
                  variant="secondary"
                  loading={retrying}
                  onClick={onRetry}
                >
                  {retryLabel}
                </Button>
              ) : null}
              {secondaryAction}
            </>
          ) : null
        }
      />
      {children}
    </div>
  );
}
