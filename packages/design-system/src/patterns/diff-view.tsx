'use client';

import { useId, useMemo, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from '../primitives/button';
import { IconButton } from '../primitives/icon-button';
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
  /**
   * Accessible name for one segment's accept control, built by the caller from
   * the segment so the name says which run it applies to. Required whenever
   * `onAcceptSegment` is supplied; without it the control is not rendered,
   * because an unnamed icon button is not a control.
   */
  readonly acceptSegmentLabel?: (segment: DiffSegment) => string;
}

export interface DiffViewProps {
  segments: readonly DiffSegment[];
  messages: DiffViewMessages;
  onAccept: () => void;
  onReject: () => void;
  /**
   * Accept one run on its own, leaving the rest of the suggestion pending.
   *
   * The argument is the segment's index in `segments`, not in the filtered
   * before or after column, so a caller can map it straight back to the
   * proposal it sent. Omit it and the view keeps its original all-or-nothing
   * shape exactly: no per-segment control is rendered.
   *
   * This exists because a suggestion is rarely uniformly good. Rewriting three
   * sentences to fix one is how a person ends up rejecting a change they
   * partly wanted, and accepting a change they partly did not.
   */
  onAcceptSegment?: ((index: number) => void) | undefined;
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
 *
 * A suggestion can be taken whole or in pieces. `onAccept` and `onReject` are
 * the whole-proposal decision and have not changed. Supplying
 * `onAcceptSegment` additionally puts a named accept control after each
 * inserted and deleted run, so a person can keep the sentence they wanted
 * without inheriting the two they did not.
 */
export function DiffView({
  segments,
  messages,
  onAccept,
  onReject,
  onAcceptSegment,
  busy = false,
  className,
}: DiffViewProps): ReactNode {
  const headingId = useId();

  // The index travels with each segment, because both columns are filtered
  // views of one list and a position in either one means nothing to the caller.
  const { before, after } = useMemo(() => {
    const indexed = segments.map((segment, index) => ({ segment, index }));
    return {
      before: indexed.filter((entry) => entry.segment.operation !== 'added'),
      after: indexed.filter((entry) => entry.segment.operation !== 'removed'),
    };
  }, [segments]);

  const acceptSegmentLabel = messages.acceptSegmentLabel;
  const perSegment =
    onAcceptSegment !== undefined && acceptSegmentLabel !== undefined
      ? (segment: DiffSegment, index: number): ReactNode => (
          <IconButton
            size="sm"
            variant="ghost"
            disabled={busy}
            label={acceptSegmentLabel(segment)}
            icon={<Check aria-hidden="true" />}
            onClick={() => onAcceptSegment(index)}
            className="align-middle"
          />
        )
      : undefined;

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
            {before.map(({ segment, index }) =>
              segment.operation === 'removed' ? (
                <span key={segment.id}>
                  <del className="bg-destructive-bg text-destructive-fg decoration-destructive-border">
                    <VisuallyHidden>{messages.removedAnnotation}</VisuallyHidden>
                    {segment.text}
                  </del>
                  {perSegment?.(segment, index)}
                </span>
              ) : (
                <span key={segment.id}>{segment.text}</span>
              ),
            )}
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="text-label text-text-tertiary">{messages.afterLabel}</p>
          <p className="text-body-md text-text-primary whitespace-pre-wrap">
            {after.map(({ segment, index }) =>
              segment.operation === 'added' ? (
                <span key={segment.id}>
                  <ins className="bg-success-bg text-success-fg decoration-success-border">
                    <VisuallyHidden>{messages.addedAnnotation}</VisuallyHidden>
                    {segment.text}
                  </ins>
                  {perSegment?.(segment, index)}
                </span>
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
