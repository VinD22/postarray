'use client';

/**
 * The root post and every delayed follow up item, each with its own status.
 *
 * A table rather than a stack of cards: the reader is comparing four rows on
 * three attributes, which is exactly what a table is for. The sentence under
 * the table is not decoration, it is the single most misread fact in this
 * product: a failed comment does not un-publish the root post.
 */

import type { ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';
import {
  Code,
  Notice,
  StatusPill,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
  VisuallyHidden,
} from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import { useCalendarFormat } from '@/features/calendar/format';
import type { PublicationReceipt } from './types';

export interface ReceiptItemsProps {
  receipt: PublicationReceipt;
  provider: string;
}

export function ReceiptItems({ receipt, provider }: ReceiptItemsProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();

  const rows = [receipt.root, ...[...receipt.items].sort((a, b) => a.order - b.order)];
  const anyFailed = receipt.items.some(
    (item) => item.state === 'failed_permanently' || item.errorCode !== null,
  );

  return (
    <div className="flex flex-col gap-3">
      <TableContainer>
        <Table>
          <TableCaption>
            <VisuallyHidden>{t('web.receipt.section.items')}</VisuallyHidden>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{t('common.name')}</TableHead>
              <TableHead>{t('common.status')}</TableHead>
              <TableHead>{t('common.time')}</TableHead>
              <TableHead>{t('receipt.externalId')}</TableHead>
              <TableHead>{t('receipt.permalink')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((item) => (
              <TableRow
                key={`${item.kind}-${item.order}`}
                attention={item.state === 'failed_permanently' || item.errorCode !== null}
              >
                <TableRowHeader>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-text-primary">
                      {item.kind === 'root'
                        ? t('web.receipt.item.root')
                        : t(`web.receipt.item.${item.kind}`, { position: item.order })}
                    </span>
                    <span className="text-body-sm font-normal text-text-tertiary">
                      {item.delaySeconds === 0
                        ? t('web.receipt.item.noDelay')
                        : t('web.receipt.item.delay', {
                            delay: format.duration(item.delaySeconds * 1000),
                          })}
                    </span>
                  </span>
                </TableRowHeader>
                <TableCell>
                  <StatusPill
                    state={item.state}
                    label={t(`state.${item.state}.label`)}
                    size="sm"
                  />
                </TableCell>
                <TableCell>
                  {item.publishedAt ? (
                    <time dateTime={item.publishedAt} className="tabular-nums text-text-secondary">
                      {format.dateTime(item.publishedAt)}
                    </time>
                  ) : (
                    <span className="text-text-tertiary">{t('web.receipt.item.pending')}</span>
                  )}
                </TableCell>
                <TableCell>
                  {item.externalPostId ? (
                    <Code>{item.externalPostId}</Code>
                  ) : (
                    <span className="text-text-tertiary">{t('common.unavailable')}</span>
                  )}
                </TableCell>
                <TableCell>
                  {item.permalink ? (
                    <a
                      href={item.permalink}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 text-text-accent"
                    >
                      {t('action.open')}
                      <ExternalLink aria-hidden="true" className="size-3" />
                      <span className="sr-only">{t('a11y.label.externalLink')}</span>
                    </a>
                  ) : (
                    <span className="text-text-tertiary">
                      {t('receipt.permalinkUnavailable', { provider })}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {anyFailed ? (
        <Notice
          tone="warning"
          title={t('web.receipt.item.rootUnaffected')}
          description={t('receipt.partial.doNotRollback')}
        />
      ) : null}
    </div>
  );
}
