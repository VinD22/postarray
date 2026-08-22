'use client';

import type { ReactElement } from 'react';
import { Badge, Notice } from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import type { BulkImportColumnReport, BulkImportIssue } from '@relay/contracts';

import { IMPORT_TEMPLATE_COLUMNS } from '../wizard';

/**
 * The column check.
 *
 * It is shown before a single row, because a renamed header is the most common
 * reason an otherwise correct file reads as entirely broken, and it is the one
 * problem a person can fix in ten seconds once they are told which word we
 * were looking for.
 */
export function ColumnReport({
  columns,
  issues,
}: {
  readonly columns: BulkImportColumnReport;
  readonly issues: readonly BulkImportIssue[];
}): ReactElement {
  const t = useTranslations();
  const missing = columns.missingRequired;
  const unknown = columns.unrecognized;

  return (
    <section aria-labelledby="import-columns-heading" className="flex flex-col gap-3">
      <h2 id="import-columns-heading" className="text-title-md text-text-primary">
        {t.full('import.columns.heading')}
      </h2>

      {missing.length === 0 ? (
        <Notice tone="success" title={t.full('import.columns.ok')} />
      ) : (
        <Notice
          tone="warning"
          title={t.full('import.columns.missing', { count: missing.length })}
          description={
            <ul className="flex flex-col gap-1">
              {missing.map((column) => (
                <li key={column}>{t.full('import.error.missingColumn', { column })}</li>
              ))}
            </ul>
          }
        />
      )}

      {unknown.length === 0 ? null : (
        <Notice
          tone="info"
          title={t.full('import.columns.unknown', { count: unknown.length })}
          description={
            <ul className="flex flex-col gap-1">
              {unknown.map((column) => (
                <li key={column}>{t.full('import.error.unknownColumn', { column })}</li>
              ))}
            </ul>
          }
        />
      )}

      {issues.length === 0 ? null : (
        <ul className="flex flex-col gap-1">
          {issues.map((issue) => (
            <li
              key={`${issue.key}:${issue.column ?? ''}`}
              className="text-body-sm text-text-secondary"
            >
              {issue.key === 'import.error.emptyFile'
                ? t.full('import.error.emptyFile')
                : issue.key === 'import.error.tooManyRows'
                  ? t.full('import.error.tooManyRows', {
                      limit: Number(issue.values['limit'] ?? 0),
                    })
                  : issue.key}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-1.5">
        {IMPORT_TEMPLATE_COLUMNS.map((column) => (
          <Badge key={column} tone={columns.present.includes(column) ? 'success' : 'neutral'}>
            {column}
          </Badge>
        ))}
      </div>
    </section>
  );
}
