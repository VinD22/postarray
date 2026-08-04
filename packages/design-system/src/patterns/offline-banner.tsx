'use client';

import type { ReactNode } from 'react';
import { CloudOff } from 'lucide-react';
import { Notice } from './notice.js';

export interface OfflineBannerProps {
  /** For example: the connection dropped. */
  title: ReactNode;
  /**
   * What still works and what does not. Be exact: drafts continue to save
   * locally, scheduling and publishing are unavailable until the connection
   * returns. Vagueness here makes people retry and duplicate work.
   */
  description: ReactNode;
  /** Optional: the time of the last successful save, already formatted. */
  lastSaved?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/**
 * The offline banner.
 *
 * It is a status, not an alert: losing a connection is not an error the user
 * caused, and an assertive announcement mid-sentence is hostile. What matters
 * is that the banner is truthful about which actions are disabled, and that
 * the composer's disabled publish button agrees with it.
 */
export function OfflineBanner({
  title,
  description,
  lastSaved,
  actions,
  className,
}: OfflineBannerProps): ReactNode {
  return (
    <Notice
      tone="warning"
      liveness="status"
      icon={<CloudOff aria-hidden="true" className="size-4" />}
      title={title}
      description={
        <div className="flex flex-col gap-1">
          <p>{description}</p>
          {lastSaved ? <p className="text-text-tertiary">{lastSaved}</p> : null}
        </div>
      }
      actions={actions}
      className={className}
    />
  );
}
