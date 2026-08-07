'use client';

/**
 * The list view, which is also the accessible alternative to the grid.
 *
 * Everything the grid shows is here as a real table with real column headers,
 * and every operation the grid offers is here as a menu item. That is what
 * satisfies "no drag-only interaction": a person who cannot drag, or cannot
 * see the grid, still has the whole surface.
 *
 * Below the medium breakpoint the table collapses to one meaningful row per
 * post with a detail sheet, rather than clipping six columns horizontally.
 */

import type { ReactNode } from 'react';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconButton,
  StatusPill,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  VisuallyHidden,
  cn,
  focusRingInset,
} from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';

import { Link } from '@/components/link';
import { AccountIdentity, useProviderName } from '@/features/connections/provider';
import { useCalendarFormat } from './format';
import { entryKey, needsAttention, sortEntries } from './filters';
import { canReschedule, hasExternalPost } from './reschedule';
import type { CalendarEntry } from './types';

export interface CalendarTableProps {
  entries: readonly CalendarEntry[];
  rangeLabel: string;
  hrefForEntry: (entry: CalendarEntry) => string;
  hrefForReceipt: (entry: CalendarEntry) => string | null;
  onReschedule: (entry: CalendarEntry) => void;
  onOpenDetail: (entry: CalendarEntry) => void;
}

export function CalendarTable({
  entries,
  rangeLabel,
  hrefForEntry,
  hrefForReceipt,
  onReschedule,
  onOpenDetail,
}: CalendarTableProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();
  const providerName = useProviderName();
  const rows = sortEntries(entries);

  return (
    <>
      {/* Compact layout: one row per post plus a detail sheet. */}
      <ul className="flex flex-col md:hidden">
        {rows.map((entry) => (
          <li key={entryKey(entry)} className="border-border-subtle border-b">
            <button
              type="button"
              onClick={() => onOpenDetail(entry)}
              className={cn(
                'flex min-h-11 w-full flex-col gap-1.5 px-4 py-3 text-start',
                'hover:bg-surface-hover',
                needsAttention(entry) && 'bg-warning-bg hover:bg-warning-bg',
                focusRingInset,
              )}
            >
              <span className="flex items-baseline gap-2">
                <span className="text-body-sm text-text-secondary tabular-nums">
                  {format.dateTime(entry.scheduledAt)}
                </span>
              </span>
              <span className="text-body-md text-text-primary font-medium">
                {entry.title.trim() || t('web.calendar.entry.untitled')}
              </span>
              <AccountIdentity
                provider={entry.provider}
                accountLabel={entry.accountLabel}
                size="sm"
              />
              <span className="flex flex-wrap items-center gap-1.5">
                <StatusPill state={entry.state} label={t(`state.${entry.state}.label`)} size="sm" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Full table from the medium breakpoint up. */}
      <TableContainer className="hidden md:block">
        <Table>
          <TableCaption>
            <VisuallyHidden>
              {t('web.calendar.table.caption', { range: rangeLabel })}
            </VisuallyHidden>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{t('web.calendar.table.column.time')}</TableHead>
              <TableHead>{t('web.calendar.table.column.account')}</TableHead>
              <TableHead>{t('web.calendar.table.column.content')}</TableHead>
              <TableHead>{t('web.calendar.table.column.language')}</TableHead>
              <TableHead>{t('web.calendar.table.column.media')}</TableHead>
              <TableHead>{t('web.calendar.table.column.status')}</TableHead>
              <TableHead>{t('web.calendar.table.column.approver')}</TableHead>
              <TableHead>{t('web.calendar.table.column.campaign')}</TableHead>
              <TableHead>
                <VisuallyHidden>{t('web.calendar.table.column.actions')}</VisuallyHidden>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((entry) => {
              const receiptHref = hrefForReceipt(entry);
              const title = entry.title.trim() || t('web.calendar.entry.untitled');
              return (
                <TableRow key={entryKey(entry)} attention={needsAttention(entry)}>
                  <TableCell className="whitespace-nowrap">
                    <time dateTime={entry.scheduledAt} className="text-text-secondary tabular-nums">
                      {format.dateTime(entry.scheduledAt)}
                    </time>
                  </TableCell>
                  <TableCell>
                    <AccountIdentity
                      provider={entry.provider}
                      accountLabel={entry.accountLabel}
                      size="sm"
                      secondary={
                        entry.targetCount > 1
                          ? t('calendar.post.targetCount', { count: entry.targetCount })
                          : undefined
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={hrefForEntry(entry)}
                      className={cn(
                        'text-text-primary block max-w-[28ch] truncate font-medium no-underline',
                        'hover:text-text-accent hover:underline',
                        focusRingInset,
                      )}
                    >
                      {title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {entry.contentLocale ?? t('common.notSet')}
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {t(`calendar.post.mediaType.${entry.mediaKind}`)}
                  </TableCell>
                  <TableCell>
                    <StatusPill
                      state={entry.state}
                      label={t(`state.${entry.state}.label`)}
                      size="sm"
                    />
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {entry.approvalState === 'not_required'
                      ? t('web.calendar.table.noApprover')
                      : (entry.approverName ?? t(`state.approval.${entry.approvalState}.label`))}
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {entry.campaignName ?? t('web.calendar.table.noCampaign')}
                  </TableCell>
                  <TableCell className="text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <IconButton
                          size="sm"
                          label={t('web.calendar.table.rowMenu', { title })}
                          icon={<MoreHorizontal aria-hidden="true" />}
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => onOpenDetail(entry)}>
                          {t('action.viewDetails')}
                        </DropdownMenuItem>
                        {canReschedule(entry.state) ? (
                          <DropdownMenuItem onSelect={() => onReschedule(entry)}>
                            {t('action.reschedule')}
                          </DropdownMenuItem>
                        ) : null}
                        {receiptHref ? (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={receiptHref}>{t('action.viewReceipt')}</Link>
                            </DropdownMenuItem>
                          </>
                        ) : null}
                        {hasExternalPost(entry.state) && entry.permalink ? (
                          <DropdownMenuItem asChild>
                            <a href={entry.permalink} target="_blank" rel="noreferrer noopener">
                              {t('action.openInProvider', {
                                provider: providerName(entry.provider),
                              })}
                            </a>
                          </DropdownMenuItem>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
