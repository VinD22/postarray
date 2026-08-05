'use client';

import { useId, useMemo, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Button } from '../primitives/button';
import { VisuallyHidden } from '../primitives/visually-hidden';

export type DiffOperation = 'unchanged' | 'added' | 'removed';

export interface DiffSegment {
  readonly id: string;
  readonly operation: DiffOperation;
  readonly text: string;
}

export interface DiffViewMessages {
  /** Accessible name for the whole proposal region. */
  readonly regionLabel: string;
  /** Heading over the current text. */
  readonly beforeLabel: ReactNode;
  /** Heading over the proposed text. */
  readonly afterLabel: ReactNode;
  readonly acceptLabel: string;
  readonly rejectLabel: string;
  /** Read out before an added run, for example "added". */
  readonly addedAnnotation: string;
  /** Read out before a removed run. */
  readonly removedAnnotation: string;
  /** Explains where the suggestion came from and that nothing changed yet. */
  readonly provenance?: ReactNode;
}

export interface DiffViewProps {
  segments: readonly DiffSegment[];
  messages: DiffViewMessages;
  onAccept: () => void;
  onReject: () => void;
  /** Disable both actions while the parent is applying the decision. */
  busy?: boolean;
  className?: string;
}

/**
 * The accept or reject view for an AI suggestion.
 *
 * The product rule: an assistant never silently replaces a user's text. Every
 * proposed change is shown as a diff against what is there now, and it only
 * lands when a person accepts it. Rejecting leaves the original untouched.
 *
 * Added and removed runs are marked three ways, because an underline or a
 * colour alone fails for someone who cannot see either: `<ins>` and `<del>`
 * elements give the semantics, a tint gives the glance, and a visually hidden
 * annotation gives the screen reader the word.
 */
export function DiffView({
  segments,
  messages,
  onAccept,
  onReject,
  busy = false,
  className,
}: DiffViewProps): ReactNode {
  const headingId = useId();

  const { before, after } = useMemo(() => {
    return {
      before: segments.filter((segment) => segment.operation !== 'added'),
      after: segments.filter((segment) => segment.operation !== 'removed'),
    };
  }, [segments]);

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        'border-border-default flex flex-col gap-3 rounded-lg border',
        'bg-surface-raised p-3',
        className,
      )}
    >
      <VisuallyHidden id={headingId}>{messages.regionLabel}</VisuallyHidden>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="text-label text-text-tertiary">{messages.beforeLabel}</p>
          <p className="text-body-md text-text-secondary whitespace-pre-wrap">
            {before.map((segment) =>
              segment.operation === 'removed' ? (
                <del
                  key={segment.id}
                  className="bg-destructive-bg text-destructive-fg decoration-destructive-border"
                >
                  <VisuallyHidden>{messages.removedAnnotation}</VisuallyHidden>
                  {segment.text}
                </del>
              ) : (
                <span key={segment.id}>{segment.text}</span>
              ),
            )}
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="text-label text-text-tertiary">{messages.afterLabel}</p>
          <p className="text-body-md text-text-primary whitespace-pre-wrap">
            {after.map((segment) =>
              segment.operation === 'added' ? (
                <ins
                  key={segment.id}
                  className="bg-success-bg text-success-fg decoration-success-border"
                >
                  <VisuallyHidden>{messages.addedAnnotation}</VisuallyHidden>
                  {segment.text}
                </ins>
              ) : (
                <span key={segment.id}>{segment.text}</span>
              ),
            )}
          </p>
        </div>
      </div>

      {messages.provenance ? (
        <p className="text-body-sm text-text-tertiary">{messages.provenance}</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="primary" disabled={busy} onClick={onAccept}>
          {messages.acceptLabel}
        </Button>
        <Button size="sm" variant="secondary" disabled={busy} onClick={onReject}>
          {messages.rejectLabel}
        </Button>
      </div>
    </section>
  );
}
