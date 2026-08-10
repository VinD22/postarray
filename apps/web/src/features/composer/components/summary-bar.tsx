'use client';

/**
 * The persistent summary bar on small screens.
 *
 * Targets, issues, time, estimated cost and the primary action, always visible
 * while the composer is a guided sequence. It is sticky at the block end and
 * carries `scroll-margin-block` on its focusable controls so it never covers
 * the element the keyboard just moved to.
 */

import { useRef, type ReactNode } from 'react';
import { Button } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';
import { formatCurrency, formatDateTime } from '@relay/i18n';
import { cn } from '@relay/design-system/utils';

import { useMotionOk } from '@/lib/motion/use-motion-ok';
import { useComposer } from '../composer-context';

export interface SummaryBarProps {
  readonly onOpenReview: () => void;
}

export function SummaryBar({ onOpenReview }: SummaryBarProps): ReactNode {
  const t = useTranslations();
  const { bootstrap, state, totals } = useComposer();
  const schedule = state.master.schedule;
  const zone = schedule?.ianaTimeZone ?? bootstrap.workspaceTimeZone;
  const motionOk = useMotionOk();

  // The issue badge plays one settle-in pulse whenever the count *grows* — a
  // `key` remount replays the CSS animation cheaply, but this bar is always
  // mounted and re-renders on every keystroke (a character count crossing a
  // limit toggles an issue instantly), so it deliberately does not pulse on
  // every change: only on a new issue appearing, never on one clearing,
  // which would otherwise fire mid-typing.
  const pulseGeneration = useRef(0);
  const previousIssueCount = useRef(totals.issueCount);
  if (totals.issueCount > previousIssueCount.current) {
    pulseGeneration.current += 1;
  }
  previousIssueCount.current = totals.issueCount;

  return (
    <div
      aria-label={t.full('composerWeb.summary.label')}
      role="region"
      className={cn(
        'sticky bottom-0 z-(--z-index-sticky) flex flex-wrap items-center gap-x-4 gap-y-1',
        'bg-surface-raised border-border-bold shadow-hard border-t-2 px-4 py-2.5',
      )}
    >
      <span className="text-label text-text-secondary tabular-nums">
        {t.full('composerWeb.summary.targets', { count: totals.targetCount })}
      </span>

      <span
        key={pulseGeneration.current}
        className={cn(
          'text-label tabular-nums',
          motionOk && 'relay-dot-settle motion-reduce:animate-none',
          totals.blockedCount > 0
            ? 'text-destructive-fg'
            : totals.issueCount > 0
              ? 'text-warning-fg'
              : 'text-text-secondary',
        )}
      >
        {t.full('composerWeb.summary.issues', { count: totals.issueCount })}
      </span>

      <span className="text-label text-text-secondary tabular-nums">
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

      <span className="text-label text-text-secondary tabular-nums">
        {totals.estimatedCostMinor === null || totals.costCurrency === null
          ? t.full('composerWeb.summary.costUnknown')
          : formatCurrency(t.locale, totals.estimatedCostMinor, totals.costCurrency)}
      </span>

      <Button variant="primary" size="md" className="ms-auto scroll-mb-24" onClick={onOpenReview}>
        {t.full('composerWeb.summary.openReview')}
      </Button>
    </div>
  );
}
