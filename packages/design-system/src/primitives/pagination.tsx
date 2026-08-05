'use client';

import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from './button';

export interface PaginationMessages {
  /** Accessible name for the navigation region. */
  readonly label: string;
  readonly previous: string;
  readonly next: string;
  /** Already formatted by the caller through ICU, for example "41 to 60 of 384". */
  readonly range: string;
}

export interface PaginationProps {
  messages: PaginationMessages;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  /** Page size control or any other trailing content. */
  children?: ReactNode;
  className?: string;
}

/**
 * Cursor-friendly pagination.
 *
 * Deliberately previous and next rather than numbered pages: the API is
 * cursor-based, so a page number would be a fiction, and "41 to 60 of 384" is
 * the sentence people actually read. The chevrons flip in RTL because the
 * previous direction follows the writing direction.
 *
 * The range text is a live region so a screen reader hears the new range after
 * the table updates, instead of silently landing on a different set of rows.
 */
export function Pagination({
  messages,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  children,
  className,
}: PaginationProps): ReactNode {
  return (
    <nav
      aria-label={messages.label}
      className={cn('flex flex-wrap items-center justify-between gap-3 px-3 py-2', className)}
    >
      <p aria-live="polite" className="text-body-sm text-text-secondary tabular-nums">
        {messages.range}
      </p>
      <div className="flex items-center gap-2">
        {children}
        <Button
          size="sm"
          variant="secondary"
          disabled={!hasPrevious}
          onClick={onPrevious}
          iconStart={<ChevronLeft className="size-4 rtl:rotate-180" />}
        >
          {messages.previous}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={!hasNext}
          onClick={onNext}
          iconEnd={<ChevronRight className="size-4 rtl:rotate-180" />}
        >
          {messages.next}
        </Button>
      </div>
    </nav>
  );
}
