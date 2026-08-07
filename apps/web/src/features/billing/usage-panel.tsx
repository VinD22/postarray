'use client';

import type { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
} from '@relay/design-system/primitives';
import { FreshnessLabel, MetricValue, Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { useFormatters } from '../settings/lib/formatters';
import type { UsageView } from '../settings/lib/view-models';

export interface UsagePanelProps {
  usage: UsageView;
}

/**
 * Metered provider usage, billed at cost.
 *
 * The unit price and the quantity are both shown because "1.42" with no
 * denominator is not something a finance team can check. When the provider has
 * not returned usage yet the total is `Unavailable` with the reason, never a
 * zero that would read as "you spent nothing".
 */
export function UsagePanel({ usage }: UsagePanelProps): ReactNode {
  const t = useTranslations();
  const formatters = useFormatters();

  if (!usage.available) {
    return (
      <div className="flex flex-col gap-3">
        <MetricValue
          label={t('billing.ui.usageTotal')}
          availability="pending"
          unavailableText={t('common.unavailable')}
          reason={t('billing.ui.usageUnavailableReason')}
          size="lg"
        />
        <p className="text-body-sm text-text-secondary">{t('billing.usage.meteredNote')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-body-sm text-text-tertiary">
        {usage.periodEnd === null
          ? t('billing.ui.usagePeriodUnavailable', {
              start: formatters.date(usage.periodStart),
            })
          : t('billing.ui.usagePeriod', {
              start: formatters.date(usage.periodStart),
              end: formatters.date(usage.periodEnd),
            })}
      </p>

      {usage.lines.length === 0 ? (
        <p className="text-body-md text-text-secondary">{t('billing.ui.usageEmpty')}</p>
      ) : (
        <TableContainer>
          <Table>
            <TableCaption className="sr-only">{t('billing.ui.usageCaption')}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">{t('billing.ui.usageColumn.item')}</TableHead>
                <TableHead scope="col" numeric>
                  {t('billing.ui.usageColumn.quantity')}
                </TableHead>
                <TableHead scope="col" numeric>
                  {t('billing.ui.usageColumn.unitPrice')}
                </TableHead>
                <TableHead scope="col" numeric>
                  {t('billing.ui.usageColumn.amount')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usage.lines.map((line) => (
                <TableRow key={line.id}>
                  <TableRowHeader>{line.label}</TableRowHeader>
                  <TableCell numeric>{formatters.number(line.quantity)}</TableCell>
                  <TableCell numeric>
                    {line.unitPrice === null
                      ? t('common.unavailable')
                      : formatters.money(line.unitPrice)}
                  </TableCell>
                  <TableCell numeric>
                    {line.amount === null ? t('common.unavailable') : formatters.money(line.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableRowHeader>{t('billing.ui.usageTotal')}</TableRowHeader>
                <TableCell numeric />
                <TableCell numeric />
                <TableCell numeric>
                  {usage.total === null ? t('common.unavailable') : formatters.money(usage.total)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}

      <div className="flex flex-col gap-1">
        {usage.reconciledAt === null ? (
          <FreshnessLabel level="syncing" text={t('billing.ui.usagePending')} />
        ) : (
          <FreshnessLabel
            level="fresh"
            isoTimestamp={usage.reconciledAt}
            text={t('billing.ui.usageReconciled', {
              date: formatters.date(usage.reconciledAt),
            })}
          />
        )}
        {usage.priceSourceVerifiedAt === null ? null : (
          <p className="text-body-sm text-text-tertiary">
            {t('billing.ui.usageSource', {
              date: formatters.date(usage.priceSourceVerifiedAt),
            })}
          </p>
        )}
      </div>

      <Notice
        tone="neutral"
        title={t('billing.usage.xCharges')}
        description={t('billing.usage.meteredNote')}
      />

      {usage.spendAlert === null ? null : (
        <div className="flex flex-col gap-1">
          <p className="text-body-md text-text-primary">
            <span className="text-text-tertiary">{t('billing.ui.spendAlert')} </span>
            <span className="font-medium tabular-nums">{formatters.money(usage.spendAlert)}</span>
          </p>
          <p className="text-body-sm text-text-secondary">{t('billing.ui.spendAlertHelp')}</p>
          {usage.pauseAtAlert ? (
            <p className="text-body-sm text-text-secondary">{t('billing.ui.spendAlertPause')}</p>
          ) : null}
        </div>
      )}

      {usage.balance === null ? null : (
        <MetricValue
          label={t('billing.ui.balanceLabel')}
          availability="available"
          value={formatters.money(usage.balance)}
          definition={t('billing.ui.balanceHelp')}
        />
      )}
    </div>
  );
}
