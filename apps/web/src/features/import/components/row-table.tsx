'use client';

import type { ReactElement } from 'react';
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
} from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import type { BulkImportRowView } from '@relay/contracts';

import { IssueText } from './issue-text';

const STATE_TONE = {
  pending: 'neutral',
  valid: 'success',
  invalid: 'warning',
  applied: 'success',
  skipped: 'neutral',
  failed: 'destructive',
} as const;

/**
 * The per-row report.
 *
 * A table rather than a card grid: this is a spreadsheet, people arrived with a
 * spreadsheet, and the question they are answering is "which line is wrong".
 * The row key is the row header so a screen reader announces the line a problem
 * belongs to before reading the problem.
 */
export function RowTable({ rows }: { readonly rows: readonly BulkImportRowView[] }): ReactElement {
  const t = useTranslations();

  return (
    <TableContainer>
      <Table>
        <caption className="sr-only">{t.full('import.a11y.rowsTable')}</caption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">{t.full('import.table.row')}</TableHead>
            <TableHead scope="col">{t.full('import.table.line')}</TableHead>
            <TableHead scope="col">{t.full('import.table.state')}</TableHead>
            <TableHead scope="col">{t.full('import.table.time')}</TableHead>
            <TableHead scope="col">{t.full('import.table.problems')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableRowHeader>{row.externalRowKey}</TableRowHeader>
              <TableCell>{row.lineNumber}</TableCell>
              <TableCell>
                <Badge tone={STATE_TONE[row.state]}>{t.full(`import.state.${row.state}`)}</Badge>
              </TableCell>
              <TableCell>
                {row.payload === null
                  ? t.full('import.results.unavailable')
                  : `${row.payload.scheduledLocalTime} ${row.payload.ianaTimeZone}`}
              </TableCell>
              <TableCell>
                {row.issues.length === 0 ? (
                  t.full('import.table.noProblems')
                ) : (
                  <ul className="flex flex-col gap-1">
                    {row.issues.map((issue, index) => (
                      <li key={`${issue.key}:${String(index)}`}>
                        <IssueText issue={issue} />
                      </li>
                    ))}
                  </ul>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
