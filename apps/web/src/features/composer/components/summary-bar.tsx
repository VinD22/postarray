'use client';

/**
 * The persistent summary bar on small screens.
 *
 * Targets, issues, time, estimated cost and the primary action, always visible
 * while the composer is a guided sequence. It is sticky at the block end and
 * carries `scroll-margin-block` on its focusable controls so it never covers
 * the element the keyboard just moved to.
 */

import { type ReactNode } from 'react';
import { Button } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';
import { formatCurrency, formatDateTime } from '@relay/i18n';
import { cn } from '@relay/design-system/utils';

import { useComposer } from '../composer-context.js';

export interface SummaryBarProps {
  readonly onOpenReview: () => void;
}

export function SummaryBar({ onOpenReview }: SummaryBarProps): ReactNode {
  const t = useTranslations();
  const { bootstrap, state, totals } = useComposer();
  const schedule = state.master.schedule;
  const zone = schedule?.ianaTimeZone ?? bootstrap.workspaceTimeZone;

  return (
    <div
      aria-label={t.full('composerWeb.summary.label')}
      role="region"
      className={cn(
        'sticky bottom-0 z-(--z-index-sticky) flex flex-wrap items-center gap-x-4 gap-y-1',
        'border-t border-border-default bg-surface-raised px-4 py-2.5',
      )}
    >
      <span className="text-label tabular-nums text-text-secondary">
        {t.full('composerWeb.summary.targets', { count: totals.targetCount })}
      </span>

      <span
        className={cn(
          'text-label tabular-nums',
          totals.blockedCount > 0
            ? 'text-destructive-fg'
            : totals.issueCount > 0
              ? 'text-warning-fg'
              : 'text-text-secondary',
        )}
      >
        {t.full('composerWeb.summary.issues', { count: totals.issueCount })}
      </span>

      <span className="text-label tabular-nums text-text-secondary">
        {schedule === null
          ? t.full('composerWeb.summary.notScheduled')
          : t.full('composerWeb.summary.scheduledFor', {
              time: formatDateTime(t.locale, schedule.instant, {
                timeZone: zone,
                dateStyle: 'short',
                timeStyle: 'short',
              }),
            })}
      </span>

      <span className="text-label tabular-nums text-text-secondary">
        {totals.estimatedCostMinor === null || totals.costCurrency === null
          ? t.full('composerWeb.summary.costUnknown')
          : formatCurrency(t.locale, totals.estimatedCostMinor, totals.costCurrency)}
      </span>

      <Button
        variant="primary"
        size="md"
        className="ms-auto scroll-mb-24"
        onClick={onOpenReview}
      >
        {t.full('composerWeb.summary.openReview')}
      </Button>
    </div>
  );
}
