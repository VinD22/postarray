import { Check, X } from 'lucide-react';
import type { ReactNode } from 'react';

import { StaggerList } from '@/components/motion';
import { cn } from '@relay/design-system/utils';

/**
 * The comparison table (WP-3, `/compare`).
 *
 * This component owns no copy of its own: every label, column and cell comes
 * from the caller, so it cannot itself fabricate a claim about a competitor.
 * The one column that has ever actually shipped content behind it is the
 * caller's own product column (`tone="cta"`) — the comparison catalog this
 * site publishes to (`data/catalogs.ts`) has every competitor's `href` still
 * `null` while its fact check is in progress, so a page that has nothing
 * real to say about a named competitor should not pass one in rather than
 * inventing cells for it.
 *
 * `tone="cta"` is meant for exactly one column — the caller's own — and
 * should be first in `columns` so it lands at the logical start; every other
 * column stays neutral. A hard offset shadow works for a standalone poster
 * card but reads as broken between table cells sharing borders, so the
 * emphasis here is a 2px ink inline border around the column instead of
 * `shadow-hard`.
 *
 * Rows fade in staggered as the table scrolls into view; reduced motion
 * renders the finished table with no animation (`StaggerList`'s own
 * contract). A row's `cells` may be `true`/`false` (rendered as a brand
 * check or a pop X, each carrying real text via `trueLabel`/`falseLabel` so
 * the state is never colour- or icon-only) or arbitrary already-translated
 * content for a row that states a fact rather than a yes/no.
 */
export interface VsTableColumn {
  readonly id: string;
  readonly label: string;
  readonly tone?: 'cta' | 'neutral';
}

export interface VsTableRow {
  readonly id: string;
  readonly label: ReactNode;
  readonly cells: Readonly<Record<string, boolean | ReactNode>>;
}

export interface VsTableProps {
  readonly caption: string;
  readonly rowHeaderLabel: string;
  readonly columns: readonly VsTableColumn[];
  readonly rows: readonly VsTableRow[];
  /** Accessible text for a `true` boolean cell. */
  readonly trueLabel: string;
  /** Accessible text for a `false` boolean cell. */
  readonly falseLabel: string;
  readonly className?: string;
}

export function VsTable({
  caption,
  rowHeaderLabel,
  columns,
  rows,
  trueLabel,
  falseLabel,
  className,
}: VsTableProps): ReactNode {
  return (
    <StaggerList className={cn('relay-scroll-x', className)}>
      <table className="w-full min-w-[28rem] border-collapse text-start">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-border-bold border-b-2">
            <th
              scope="col"
              className="text-label text-text-tertiary px-4 py-3 text-start tracking-wide uppercase"
            >
              {rowHeaderLabel}
            </th>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={cn(
                  'text-title-sm px-4 py-3 text-start',
                  column.tone === 'cta' &&
                    'bg-cta text-cta-on border-border-bold border-s-2 border-t-2',
                )}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} data-stagger-item className="border-border-subtle border-b">
              <th
                scope="row"
                className="text-body-md text-text-primary px-4 py-3 text-start font-normal"
              >
                {row.label}
              </th>
              {columns.map((column) => {
                const cell = row.cells[column.id];
                const isLastRow = row.id === rows.at(-1)?.id;
                return (
                  <td
                    key={column.id}
                    className={cn(
                      'px-4 py-3 align-top',
                      column.tone === 'cta' &&
                        cn(
                          'bg-cta text-cta-on border-border-bold border-s-2',
                          isLastRow && 'border-b-2',
                        ),
                    )}
                  >
                    {cell === true ? (
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5',
                          column.tone === 'cta' ? 'text-cta-on' : 'text-accent',
                        )}
                      >
                        <Check aria-hidden="true" className="size-4" strokeWidth={3} />
                        <span>{trueLabel}</span>
                      </span>
                    ) : cell === false ? (
                      // Pink (`--color-blush`) is a fill colour and is never
                      // legible as text — see theme.css's own contrast header
                      // ("NEITHER IS EVER TEXT"; pink on paper is 1.55:1).
                      // `destructive-fg` is AA-verified as text on canvas.
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5',
                          column.tone === 'cta' ? 'text-cta-on' : 'text-destructive-fg',
                        )}
                      >
                        <X aria-hidden="true" className="size-4" strokeWidth={3} />
                        <span>{falseLabel}</span>
                      </span>
                    ) : (
                      cell
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </StaggerList>
  );
}
