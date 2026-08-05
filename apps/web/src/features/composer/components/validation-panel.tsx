'use client';

/**
 * The validation panel.
 *
 * One list, grouped by account, blocking issues first. Every row is a sentence
 * that names the account and the actual number, and clicking it opens that
 * target so the fix is one keystroke away. The panel also carries the "next
 * issue" cursor used by the keyboard shortcut.
 */

import { type ReactNode } from 'react';
import { AlertTriangle, CircleAlert, Info } from 'lucide-react';
import { useTranslations } from '@relay/i18n/react';
import { cn } from '@relay/design-system/utils';
import type { ValidationIssue } from '@relay/contracts';

import { useComposer } from '../composer-context.js';
import { PROVIDER_LABEL } from './provider-identity.js';

export interface ValidationPanelProps {
  /** Index into the flattened issue list, driven by the keyboard shortcut. */
  readonly focusedIssueIndex: number | null;
}

export function ValidationPanel({ focusedIssueIndex }: ValidationPanelProps): ReactNode {
  const t = useTranslations();
  const { summaries, totals, dispatch } = useComposer();
  let cursor = -1;

  return (
    <section aria-labelledby="composer-validation-heading" className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <h3 id="composer-validation-heading" className="text-title-sm text-text-primary">
          {t.full('composer.validation.title')}
        </h3>
        <span className="text-label tabular-nums text-text-tertiary">
          {t.full('composer.validation.issueCount', {
            count: totals.issueCount,
            targets: totals.targetCount,
          })}
        </span>
      </div>

      {totals.issueCount === 0 ? (
        <p className="text-body-sm text-text-secondary">{t.full('composer.validation.clean')}</p>
      ) : (
        <ul className="flex flex-col">
          {summaries.flatMap((summary) =>
            summary.issues.map((issue) => {
              cursor += 1;
              const focused = cursor === focusedIssueIndex;
              return (
                <li key={`${summary.connectionId}-${issue.code}-${issue.field ?? ''}`}>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({ type: 'target/open', connectionId: summary.connectionId })
                    }
                    className={cn(
                      'flex min-h-11 w-full items-start gap-2 rounded-md px-2 py-2 text-start',
                      'border-b border-border-subtle',
                      'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
                      'hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2',
                      'focus-visible:outline-border-focus',
                      focused && 'bg-accent-subtle',
                    )}
                  >
                    <SeverityIcon severity={issue.severity} />
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-label text-text-tertiary">
                        {summary.account.displayName}
                      </span>
                      <span className="text-body-sm text-text-primary">
                        {t(issue.messageKey, {
                          ...issue.params,
                          provider: PROVIDER_LABEL[summary.account.provider],
                          account: summary.account.handle ?? summary.account.displayName,
                        })}
                      </span>
                      <span
                        className={cn(
                          'text-label',
                          issue.severity === 'error' ? 'text-destructive-fg' : 'text-warning-fg',
                        )}
                      >
                        {issue.severity === 'error'
                          ? t.full('composer.validation.blocking')
                          : t.full('composer.validation.warning')}
                      </span>
                    </span>
                  </button>
                </li>
              );
            }),
          )}
        </ul>
      )}
    </section>
  );
}

function SeverityIcon({ severity }: { readonly severity: ValidationIssue['severity'] }): ReactNode {
  if (severity === 'error') {
    return <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-destructive-fg" />;
  }
  if (severity === 'warning') {
    return <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0 text-warning-fg" />;
  }
  return <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-info-fg" />;
}
