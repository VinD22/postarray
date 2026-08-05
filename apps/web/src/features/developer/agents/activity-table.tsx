'use client';

import { useState, type ReactNode } from 'react';
import {
  Checkbox,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
  StatusDot,
} from '@relay/design-system/primitives';
import { EmptyState, Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { useFormatters } from '../../settings/lib/formatters.js';
import type { AgentActivityView } from '../../settings/lib/view-models.js';

const OUTCOME_TONE = {
  ok: 'success',
  denied: 'warning',
  failed: 'destructive',
} as const;

export interface ActivityTableProps {
  rows: readonly AgentActivityView[];
}

/**
 * What the agent did, including what it was refused.
 *
 * A denied attempt is a first class row. It is the only way a user finds out
 * that an agent is trying to do something its approval level forbids, so it is
 * never collapsed into a log a person has to go looking for.
 */
export function ActivityTable({ rows }: ActivityTableProps): ReactNode {
  const t = useTranslations();
  const formatters = useFormatters();
  const [deniedOnly, setDeniedOnly] = useState(false);

  const deniedCount = rows.filter((row) => row.outcome === 'denied').length;
  const visible = deniedOnly ? rows.filter((row) => row.outcome === 'denied') : rows;

  if (rows.length === 0) {
    return (
      <EmptyState
        compact
        title={t('developer.ui.activity.emptyTitle')}
        description={t('developer.ui.activity.emptyBody')}
        example={t('developer.ui.activity.emptyExample')}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {deniedCount > 0 ? (
        <Notice
          tone="warning"
          title={t('developer.activity.denied', {
            reason: t('developer.ui.activity.deniedExplain'),
          })}
        />
      ) : null}

      <label className="text-body-md text-text-primary flex min-h-11 w-fit items-center gap-2">
        <Checkbox
          checked={deniedOnly}
          onCheckedChange={(checked) => setDeniedOnly(checked === true)}
        />
        {t('developer.ui.activity.filterDenied')}
      </label>

      <TableContainer className="max-h-[28rem]">
        <Table>
          <TableCaption className="sr-only">{t('developer.ui.activity.caption')}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">{t('developer.ui.activity.column.time')}</TableHead>
              <TableHead scope="col">{t('developer.ui.activity.column.tool')}</TableHead>
              <TableHead scope="col">{t('developer.ui.activity.column.outcome')}</TableHead>
              <TableHead scope="col">{t('developer.ui.activity.column.subject')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((row) => (
              <TableRow key={row.id} attention={row.outcome === 'denied'}>
                <TableRowHeader className="whitespace-nowrap tabular-nums">
                  {formatters.dateTime(row.occurredAt)}
                </TableRowHeader>
                <TableCell className="font-mono">{row.tool}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-2">
                    <StatusDot tone={OUTCOME_TONE[row.outcome]} />
                    {t(`developer.ui.activity.outcome.${row.outcome}`)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex flex-col">
                    <span>{row.subject ?? t('common.none')}</span>
                    {row.reason === null ? null : (
                      <span className="text-body-sm text-text-secondary">{row.reason}</span>
                    )}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <p className="text-body-sm text-text-tertiary">{t('developer.activity.redacted')}</p>
    </div>
  );
}
