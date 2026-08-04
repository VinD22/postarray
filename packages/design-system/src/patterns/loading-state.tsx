'use client';

import type { ReactNode } from 'react';
import { cn } from '../utils/cn.js';
import { Skeleton } from '../primitives/skeleton.js';

export interface LoadingStateProps {
  /**
   * Announced politely once while loading, from the message catalog. Say what
   * is loading, not "Loading": "Loading the publishing queue" tells a screen
   * reader user which region is busy.
   */
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * Wraps a skeleton composition and announces it once.
 *
 * The announcement is on the wrapper, not on each placeholder, so a list of
 * twenty skeleton rows produces one sentence instead of twenty.
 */
export function LoadingState({
  label,
  children,
  className,
}: LoadingStateProps): ReactNode {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className={cn(className)}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

export interface SkeletonListProps {
  /** How many rows. Match the page size so the layout does not jump. */
  rows?: number;
  /** Include the leading avatar column. */
  avatar?: boolean;
  className?: string;
}

/**
 * A list skeleton shaped like the queue and connection rows: an optional
 * avatar, two lines of text, and a trailing status. Each row is exactly the
 * height of a real row, which is the whole point.
 */
export function SkeletonList({
  rows = 5,
  avatar = true,
  className,
}: SkeletonListProps): ReactNode {
  return (
    <ul className={cn('flex flex-col', className)}>
      {Array.from({ length: rows }, (_, index) => (
        <li
          key={index}
          className="flex items-center gap-3 border-b border-border-subtle px-3 py-2.5"
        >
          {avatar ? <Skeleton variant="block" className="size-8 shrink-0" /> : null}
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Skeleton width="45%" />
            <Skeleton width="70%" className="h-[1.1875rem]" />
          </div>
          <Skeleton variant="block" width="6rem" className="h-6 shrink-0" />
        </li>
      ))}
    </ul>
  );
}

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

/** A table skeleton that reserves the real cell grid, header included. */
export function SkeletonTable({
  rows = 6,
  columns = 4,
  className,
}: SkeletonTableProps): ReactNode {
  return (
    <div className={cn('w-full', className)} aria-hidden="true">
      <div className="flex gap-3 border-b border-border-default px-3 py-2">
        {Array.from({ length: columns }, (_, index) => (
          <Skeleton key={index} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex gap-3 border-b border-border-subtle px-3 py-2.5"
        >
          {Array.from({ length: columns }, (_, columnIndex) => (
            <Skeleton key={columnIndex} className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

/** Paragraph placeholder. The final line is short, as real text tends to be. */
export function SkeletonText({ lines = 3, className }: SkeletonTextProps): ReactNode {
  return (
    <div className={cn('flex flex-col gap-1.5', className)} aria-hidden="true">
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} width={index === lines - 1 ? '60%' : '100%'} />
      ))}
    </div>
  );
}
