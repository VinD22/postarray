'use client';

/**
 * The row detail.
 *
 * The compact layouts collapse the table to one meaningful row per post; this
 * is where the columns that did not fit reappear. It is the same data, not a
 * summary, so a person approving from a phone is not asked to trust a shorter
 * version of the truth.
 */

import type { ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';
import {
  Button,
  DefinitionList,
  Notice,
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  StatusPill,
} from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';

import { Link } from '@/components/link';
import { AccountIdentity, useProviderName } from '@/features/connections/provider';
import { useCalendarFormat } from './format';
import { holdControlFor } from './hold';
import { canReschedule, hasExternalPost } from './reschedule';
import type { CalendarEntry } from './types';

export interface EntryDetailSheetProps {
  entry: CalendarEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hrefForEntry: (entry: CalendarEntry) => string;
  hrefForReceipt: (entry: CalendarEntry) => string | null;
  onReschedule: (entry: CalendarEntry) => void;
  /** Opens the hold confirmation. Absent while the screen has not wired it. */
  onPause?: (entry: CalendarEntry) => void;
  onResume?: (entry: CalendarEntry) => void;
  /** Where a person goes to clear a hold the billing path placed. */
  billingHref?: string;
}

export function EntryDetailSheet({
  entry,
  open,
  onOpenChange,
  hrefForEntry,
  hrefForReceipt,
  onReschedule,
  onPause,
  onResume,
  billingHref,
}: EntryDetailSheetProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();
  const providerName = useProviderName();

  if (!entry) return null;

  const receiptHref = hrefForReceipt(entry);
  const title = entry.title.trim() || t('web.calendar.entry.untitled');
  const hold = entry.hold ?? null;
  const holdControl = holdControlFor({ state: entry.state, hold });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="inline-end" closeLabel={t('web.calendar.detail.close')}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <AccountIdentity provider={entry.provider} accountLabel={entry.accountLabel} size="sm" />
        </SheetHeader>

        <SheetBody>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill state={entry.state} label={t(`state.${entry.state}.label`)} />
              {/* A hold is shown as its own pill, never as a colour on the
                  state pill: "paused" and "scheduled" are both true at once,
                  and status is never carried by colour alone here. */}
              {hold ? (
                <StatusPill
                  state="action_required"
                  label={
                    hold.reason === 'billing'
                      ? t('calendar.hold.badgeBilling')
                      : t('calendar.hold.badge')
                  }
                />
              ) : null}
            </div>

            {hold ? (
              <Notice
                tone={hold.reason === 'billing' ? 'warning' : 'info'}
                title={
                  hold.reason === 'billing'
                    ? t('calendar.hold.badgeBilling')
                    : t('calendar.hold.badge')
                }
                description={
                  hold.reason === 'billing'
                    ? t('calendar.hold.byBilling', { date: format.dateTime(hold.since) })
                    : t('calendar.hold.byPerson', { date: format.dateTime(hold.since) })
                }
              />
            ) : null}

            <DefinitionList
              layout="columns"
              items={[
                {
                  id: 'time',
                  term: t('receipt.times.scheduled'),
                  definition: (
                    <time dateTime={entry.scheduledAt} className="tabular-nums">
                      {format.dateTime(entry.scheduledAt)}
                    </time>
                  ),
                  hint: t('calendar.timeZoneNote', { timeZone: format.zoneLabel() }),
                },
                {
                  id: 'targets',
                  term: t('a11y.region.targets'),
                  definition: t('calendar.post.targetCount', { count: entry.targetCount }),
                },
                {
                  id: 'language',
                  term: t('web.calendar.table.column.language'),
                  definition: entry.contentLocale ?? t('common.notSet'),
                },
                {
                  id: 'media',
                  term: t('web.calendar.table.column.media'),
                  definition: t(`calendar.post.mediaType.${entry.mediaKind}`),
                },
                {
                  id: 'approver',
                  term: t('web.calendar.table.column.approver'),
                  definition:
                    entry.approvalState === 'not_required'
                      ? t('web.calendar.table.noApprover')
                      : (entry.approverName ?? t(`state.approval.${entry.approvalState}.label`)),
                },
                {
                  id: 'campaign',
                  term: t('web.calendar.table.column.campaign'),
                  definition: entry.campaignName ?? t('web.calendar.table.noCampaign'),
                },
              ]}
            />

            {hasExternalPost(entry.state) && entry.permalink ? (
              <a
                href={entry.permalink}
                target="_blank"
                rel="noreferrer noopener"
                className="text-body-md text-text-accent inline-flex items-center gap-1.5"
              >
                {t('action.openInProvider', { provider: providerName(entry.provider) })}
                <ExternalLink aria-hidden="true" className="size-3.5" />
                <span className="sr-only">{t('a11y.label.externalLink')}</span>
              </a>
            ) : null}
          </div>
        </SheetBody>

        <SheetFooter>
          {receiptHref ? (
            <Button variant="secondary" asChild>
              <Link href={receiptHref}>{t('action.viewReceipt')}</Link>
            </Button>
          ) : null}
          {/* The hold control. Its copy says plainly what stops and what does
              not: pausing cannot retract something already published, which is
              why the control disappears entirely once it has. */}
          {holdControl === 'pause' && onPause ? (
            <Button
              variant="secondary"
              onClick={() => {
                onOpenChange(false);
                onPause(entry);
              }}
            >
              {t('calendar.hold.action')}
            </Button>
          ) : null}
          {holdControl === 'resume' && onResume ? (
            <Button
              variant="secondary"
              onClick={() => {
                onOpenChange(false);
                onResume(entry);
              }}
            >
              {t('calendar.hold.resumeAction')}
            </Button>
          ) : null}
          {holdControl === 'billing' && billingHref ? (
            <Button variant="secondary" asChild>
              <Link href={billingHref}>{t('calendar.hold.blocked.billingAction')}</Link>
            </Button>
          ) : null}
          {canReschedule(entry.state) ? (
            <Button
              variant="secondary"
              onClick={() => {
                onOpenChange(false);
                onReschedule(entry);
              }}
            >
              {t('action.reschedule')}
            </Button>
          ) : null}
          <Button variant="primary" asChild>
            <Link href={hrefForEntry(entry)}>{t('action.viewDetails')}</Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
