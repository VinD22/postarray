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
import { canReschedule, hasExternalPost } from './reschedule';
import type { CalendarEntry } from './types';

export interface EntryDetailSheetProps {
  entry: CalendarEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hrefForEntry: (entry: CalendarEntry) => string;
  hrefForReceipt: (entry: CalendarEntry) => string | null;
  onReschedule: (entry: CalendarEntry) => void;
}

export function EntryDetailSheet({
  entry,
  open,
  onOpenChange,
  hrefForEntry,
  hrefForReceipt,
  onReschedule,
}: EntryDetailSheetProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();
  const providerName = useProviderName();

  if (!entry) return null;

  const receiptHref = hrefForReceipt(entry);
  const title = entry.title.trim() || t('web.calendar.entry.untitled');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="inline-end" closeLabel={t('web.calendar.detail.close')}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <AccountIdentity provider={entry.provider} accountLabel={entry.accountLabel} size="sm" />
        </SheetHeader>

        <SheetBody>
          <div className="flex flex-col gap-4">
            <StatusPill state={entry.state} label={t(`state.${entry.state}.label`)} />

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
