'use client';

import type { ReactElement } from 'react';
import { useTranslations } from '@relay/i18n/react';
import type { BulkImportIssue } from '@relay/contracts';

/**
 * One stored problem, rendered in the reader's language.
 *
 * A row carries an ICU key and its values, never a sentence, so this is where
 * the sentence is made. The key is shown verbatim when the catalog has no entry
 * for it, which happens when a row was written by a newer parser than the
 * browser is running: showing the key is honest, and inventing wording for an
 * unknown key would not be.
 */
export function IssueText({ issue }: { readonly issue: BulkImportIssue }): ReactElement {
  const t = useTranslations();
  const values: Record<string, string | number | boolean> = { ...issue.values };
  const rendered = t.full(issue.key as Parameters<typeof t.full>[0], values);
  return <span>{rendered === issue.key ? issue.key : rendered}</span>;
}
