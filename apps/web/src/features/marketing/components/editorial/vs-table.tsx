import { Check, X } from 'lucide-react';
import type { ReactNode } from 'react';

import { StaggerList } from '@/components/motion';
import { cn } from '@relay/design-system/utils';

/**
 * The comparison table.
 *
 * ## The truthfulness contract (unchanged from the loud version)
 *
 * This component owns no copy of its own. Every label, column and cell comes
 * from the caller, so it cannot itself fabricate a claim about a competitor.
 * The one column that has ever had real content behind it is the caller's own
 * product column (`tone="own"`) — every entry in the comparison catalog
 * (`data/catalogs.ts`) still has `href: null` while its fact check is in
 * progress, so a page with nothing real to say about a named competitor
 * should pass no column for it rather than invent cells.
 *
 * `tone="own"` is meant for exactly one column, the caller's own, and should
 * be first in `columns` so it lands at the logical start; every other column
 * stays neutral.
 *
 * A boolean cell always renders its icon *and* its already-translated
 * `trueLabel`/`falseLabel` text, so a yes/no is never carried by colour or by
 * an icon shape alone. That is a WCAG requirement here, not a stylistic one,
 * and it is the reason both labels are required props.
 *
 * ## What changed
 *
 * Only the surface. The loud version emphasised the own-product column with a
 * full `--color-cta` fill and 2px ink borders; in the muted palette that reads
 * as a highlighter stripe through a quiet table. The emphasis is now a tonal
 * `surface-sunken` fill with hairline inline rules, the header rule is a
 * single hairline rather than a 2px ink bar, and true/false use the
 * text-verified `text-accent` and `destructive-fg` tokens (pink was never
 * legible as text; see `theme.css`'s contrast header).
 *
 * The horizontal scroll container is a named, focusable `region` rather than a
 * bare `overflow-x` div. A scrollable area that only a pointer can reach is a
 * WCAG 2.2 failure (`scrollable-region-focusable`), which the loud version
 * had: it put `relay-scroll-x` straight on the animation wrapper, so a
 * keyboard user could never scroll a table wider than the viewport. The
 * `tabIndex` is the same remedy `Marquee` uses for the same problem.
 */
export interface EditorialVsTableColumn {
  readonly id: string;
  readonly label: string;
  /** `own` marks the caller's own product column. At most one. */
  readonly tone?: 'own' | 'neutral';
}

export interface EditorialVsTableRow {
  readonly id: string;
  readonly label: ReactNode;
  readonly cells: Readonly<Record<string, boolean | ReactNode>>;
}

export interface EditorialVsTableProps {
  readonly caption: string;
  readonly rowHeaderLabel: string;
  readonly columns: readonly EditorialVsTableColumn[];
  readonly rows: readonly EditorialVsTableRow[];
  /** Accessible text for a `true` boolean cell. Required: never icon-only. */
  readonly trueLabel: string;
  /** Accessible text for a `false` boolean cell. Required: never icon-only. */
  readonly falseLabel: string;
  readonly className?: string;
}

export function EditorialVsTable({
  caption,
  rowHeaderLabel,
  columns,
  rows,
  trueLabel,
  falseLabel,
  className,
}: EditorialVsTableProps): ReactNode {
  const lastRowId = rows.at(-1)?.id;

  return (
    <StaggerList stagger={0.07} className={className}>
      <div
        role="region"
        aria-label={caption}
        tabIndex={0}
        className={cn(
          'relay-scroll-x rounded-sm outline-none',
          'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
        )}
      >
        <table className="w-full min-w-[28rem] border-collapse text-start">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-border-strong border-b">
              <th
                scope="col"
                className="text-label text-text-tertiary px-4 py-3 text-start tracking-[0.14em] uppercase"
              >
                {rowHeaderLabel}
              </th>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={cn(
                    'text-title-sm text-text-primary px-4 py-3 text-start',
                    column.tone === 'own' && 'bg-surface-sunken border-border-default border-s',
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
                  className="text-body-md text-text-primary px-4 py-4 text-start font-normal"
                >
                  {row.label}
                </th>
                {columns.map((column) => {
                  const cell = row.cells[column.id];
                  return (
                    <td
                      key={column.id}
                      className={cn(
                        'text-body-md px-4 py-4 align-top',
                        column.tone === 'own' &&
                          cn(
                            'bg-surface-sunken border-border-default border-s',
                            row.id === lastRowId && 'border-b',
                          ),
                      )}
                    >
                      {cell === true ? (
                        <span className="text-text-accent inline-flex items-center gap-1.5">
                          <Check aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.5} />
                          <span>{trueLabel}</span>
                        </span>
                      ) : cell === false ? (
                        // `destructive-fg` is the AA-verified text tone. The
                        // blush fill colour is never legible as text (1.55:1 on
                        // paper), so it is not an option here.
                        <span className="text-destructive-fg inline-flex items-center gap-1.5">
                          <X aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.5} />
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
      </div>
    </StaggerList>
  );
}
