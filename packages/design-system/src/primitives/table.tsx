'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '../utils/cn.js';
import { focusRingInset } from '../utils/style-constants.js';

/**
 * A semantic data table, ready for TanStack Table.
 *
 * Decisions that matter here:
 *
 * - A real `<table>`, `<thead>`, `<th scope="col">`. A grid of divs loses row
 *   and column association for every screen reader user.
 * - No rounded container and no card wrapper. Tables are dense reference
 *   surfaces; a 16px radius around 40 rows of data is decoration that costs
 *   horizontal space.
 * - The header sticks inside its own scroll container, with the container
 *   owning the overflow so the page itself never scrolls sideways.
 * - Sorting is a real button inside the header cell with `aria-sort` on the
 *   cell, so the state is announced rather than implied by an arrow.
 * - A caption is required. It may be visually hidden, but the table must say
 *   what it contains.
 */

export interface TableProps extends ComponentPropsWithoutRef<'table'> {
  /** Density. `compact` is the queue and calendar list default. */
  density?: 'compact' | 'comfortable';
}

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { className, density = 'compact', ...props },
  ref,
) {
  return (
    <table
      ref={ref}
      data-density={density}
      className={cn('text-body-md text-text-primary w-full border-collapse text-start', className)}
      {...props}
    />
  );
});

/**
 * The scroll container. It owns the overflow and the maximum height, which is
 * what makes the sticky header work without a fixed layout hack.
 */
export const TableContainer = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  function TableContainer({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'relay-scrollbar relative w-full overflow-auto',
          'border-border-default border-y',
          className,
        )}
        {...props}
      />
    );
  },
);

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  ComponentPropsWithoutRef<'caption'>
>(function TableCaption({ className, ...props }, ref) {
  return (
    <caption
      ref={ref}
      className={cn('text-body-sm text-text-secondary px-3 py-2 text-start', className)}
      {...props}
    />
  );
});

export const TableHeader = forwardRef<HTMLTableSectionElement, ComponentPropsWithoutRef<'thead'>>(
  function TableHeader({ className, ...props }, ref) {
    return (
      <thead
        ref={ref}
        className={cn(
          'bg-surface-canvas sticky top-0 z-(--z-index-sticky)',
          '[&_th]:border-border-default [&_th]:border-b',
          className,
        )}
        {...props}
      />
    );
  },
);

export const TableBody = forwardRef<HTMLTableSectionElement, ComponentPropsWithoutRef<'tbody'>>(
  function TableBody({ className, ...props }, ref) {
    return (
      <tbody
        ref={ref}
        className={cn('[&_tr]:border-border-subtle [&_tr:not(:last-child)]:border-b', className)}
        {...props}
      />
    );
  },
);

export const TableFooter = forwardRef<HTMLTableSectionElement, ComponentPropsWithoutRef<'tfoot'>>(
  function TableFooter({ className, ...props }, ref) {
    return (
      <tfoot
        ref={ref}
        className={cn('border-border-default bg-surface-sunken border-t', className)}
        {...props}
      />
    );
  },
);

export interface TableRowProps extends ComponentPropsWithoutRef<'tr'> {
  selected?: boolean;
  /** Marks a row the user must act on. Paired with a visible status column. */
  attention?: boolean;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { className, selected, attention, ...props },
  ref,
) {
  return (
    <tr
      ref={ref}
      aria-selected={selected}
      data-attention={attention || undefined}
      className={cn(
        'hover:bg-surface-hover',
        'transition-colors duration-[--duration-fast] motion-reduce:transition-none',
        selected && 'bg-accent-subtle hover:bg-accent-subtle-hover',
        attention && 'bg-warning-bg hover:bg-warning-bg',
        className,
      )}
      {...props}
    />
  );
});

export type TableSortDirection = 'ascending' | 'descending' | 'none';

export interface TableHeadProps extends ComponentPropsWithoutRef<'th'> {
  /** Numeric columns align to the inline end so digits line up. */
  numeric?: boolean;
  sortDirection?: TableSortDirection;
  onSort?: () => void;
  /** Accessible name for the sort control, from the message catalog. */
  sortLabel?: string | undefined;
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { className, children, numeric, sortDirection, onSort, sortLabel, ...props },
  ref,
) {
  const sortable = typeof onSort === 'function';
  return (
    <th
      ref={ref}
      scope="col"
      aria-sort={sortable ? (sortDirection ?? 'none') : undefined}
      className={cn(
        'text-label text-text-secondary px-3 py-2 font-medium whitespace-nowrap',
        numeric ? 'text-end tabular-nums' : 'text-start',
        className,
      )}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          aria-label={sortLabel}
          className={cn(
            'hover:text-text-primary inline-flex items-center gap-1 rounded-sm',
            focusRingInset,
          )}
        >
          {children}
          {sortDirection === 'ascending' ? (
            <ArrowUp aria-hidden="true" className="size-3" />
          ) : sortDirection === 'descending' ? (
            <ArrowDown aria-hidden="true" className="size-3" />
          ) : (
            <ChevronsUpDown aria-hidden="true" className="text-text-tertiary size-3" />
          )}
        </button>
      ) : (
        children
      )}
    </th>
  );
});

export interface TableCellProps extends ComponentPropsWithoutRef<'td'> {
  numeric?: boolean;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { className, numeric, ...props },
  ref,
) {
  return (
    <td
      ref={ref}
      className={cn(
        'px-3 py-2 align-middle',
        numeric ? 'text-end tabular-nums' : 'text-start',
        className,
      )}
      {...props}
    />
  );
});

/** A row header, for tables whose first column identifies the row. */
export const TableRowHeader = forwardRef<HTMLTableCellElement, ComponentPropsWithoutRef<'th'>>(
  function TableRowHeader({ className, ...props }, ref) {
    return (
      <th
        ref={ref}
        scope="row"
        className={cn('px-3 py-2 text-start align-middle font-medium', className)}
        {...props}
      />
    );
  },
);
