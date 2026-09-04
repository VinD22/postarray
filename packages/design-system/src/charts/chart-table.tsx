'use client';

import type { ReactElement } from 'react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
} from '../primitives/table';

/**
 * "View as table": the same data, as data.
 *
 * This is not a courtesy. A chart is a picture, and a picture is unreadable to
 * a screen reader, unhelpful at 400% zoom, and imprecise for anyone who needs
 * the actual figure rather than the shape. The table is the authoritative
 * rendering and the chart is the summary of it.
 *
 * A `<details>` rather than a toggle button with state: it works before
 * hydration, it is a single accessible disclosure with no ARIA to get wrong,
 * and browser find-in-page reaches inside it.
 *
 * The rule that matters most here is the empty cell. A reading the provider
 * did not return renders the word the caller supplies, in full. Never a dash,
 * which reads as "nothing happened", and never `0`, which is a number nobody
 * measured. A person copying this table into a report must not be able to
 * paste a zero we invented.
 */

/** `null` means the provider returned nothing. It never means zero. */
export type ChartTableCell = string | null;

export interface ChartTableRow {
  readonly id: string;
  /** The already formatted x value: a date, a bucket, a category. */
  readonly x: string;
  /** One entry per series, in the same order as `seriesLabels`. */
  readonly values: readonly ChartTableCell[];
}

export interface ChartTableProps {
  /** The disclosure label, e.g. "View as table". */
  readonly summaryLabel: string;
  /** What the table contains. Visible: this table stands on its own. */
  readonly caption: string;
  readonly xHeader: string;
  readonly seriesLabels: readonly string[];
  readonly rows: readonly ChartTableRow[];
  /** The word a missing reading renders as. Required. */
  readonly unavailableLabel: string;
}

export function ChartTable({
  summaryLabel,
  caption,
  xHeader,
  seriesLabels,
  rows,
  unavailableLabel,
}: ChartTableProps): ReactElement {
  return (
    <details className="group">
      <summary
        className={
          'text-body-sm text-text-secondary hover:text-text-primary marker:text-text-tertiary ' +
          'focus-visible:outline-border-focus inline-flex min-h-11 cursor-pointer items-center ' +
          'focus-visible:outline-2 focus-visible:outline-offset-2'
        }
      >
        {summaryLabel}
      </summary>
      <TableContainer className="mt-2 max-h-96">
        <Table>
          <TableCaption>{caption}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{xHeader}</TableHead>
              {seriesLabels.map((label) => (
                <TableHead key={label} numeric>
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableRowHeader>{row.x}</TableRowHeader>
                {seriesLabels.map((label, index) => {
                  const value = row.values[index] ?? null;
                  return (
                    <TableCell key={label} numeric>
                      {value === null ? (
                        // The word, spelled out. See the header comment.
                        <span className="text-text-tertiary">{unavailableLabel}</span>
                      ) : (
                        value
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </details>
  );
}
