'use client';

import type { ReactNode } from 'react';
import { Lock } from 'lucide-react';
import { cn } from '../utils/cn';
import { Notice } from './notice';
import { Code } from '../primitives/code';

export interface PermissionDeniedProps {
  /** What the user tried to do and cannot. */
  title: ReactNode;
  /** Which role or scope is required, in words. */
  description: ReactNode;
  /**
   * The exact role or scope names. Rendered as code because they are
   * identifiers the workspace owner will look for verbatim.
   */
  requirements?: readonly string[];
  /** Label for the requirements list, from the message catalog. */
  requirementsLabel?: ReactNode;
  /**
   * How to get access: the workspace owner's name, a request action, a link to
   * the members page. A denial with no route forward is a dead end.
   */
  contact?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/**
 * Permission denied.
 *
 * This screen states the required role or scope and names the path to getting
 * it. It never pretends the feature does not exist, and it never hides the
 * control that led here without explanation: a disabled button with no reason
 * generates a support ticket every time.
 */
export function PermissionDenied({
  title,
  description,
  requirements,
  requirementsLabel,
  contact,
  actions,
  className,
}: PermissionDeniedProps): ReactNode {
  return (
    <Notice
      tone="neutral"
      icon={<Lock aria-hidden="true" className="size-4" />}
      title={title}
      description={
        <div className="flex flex-col gap-2">
          <p>{description}</p>
          {requirements && requirements.length > 0 ? (
            <div className="flex flex-col gap-1">
              {requirementsLabel ? <p className="text-text-tertiary">{requirementsLabel}</p> : null}
              <ul className={cn('flex flex-wrap gap-1.5')}>
                {requirements.map((requirement) => (
                  <li key={requirement}>
                    <Code>{requirement}</Code>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {contact ? <p>{contact}</p> : null}
        </div>
      }
      actions={actions}
      className={className}
    />
  );
}
