'use client';

import type { ReactNode } from 'react';
import { ConfirmDialog, type ConfirmDialogConsequence } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { useFormatters } from '../settings/lib/formatters.js';
import type { BillingStateView } from '../settings/lib/view-models.js';

export interface CancelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state: BillingStateView;
  onConfirm: () => void;
}

/**
 * Cancellation.
 *
 * One dialog, one confirm button, no discount offer, no survey, no second
 * "are you sure". The first consequence is the one people came for: cancelling
 * before the trial converts means no charge, stated in those words.
 */
export function CancelDialog({
  open,
  onOpenChange,
  state,
  onConfirm,
}: CancelDialogProps): ReactNode {
  const t = useTranslations();
  const formatters = useFormatters();

  const beforeConversion = state.status === 'trialing';
  const endDate = state.accessUntil ?? state.conversionAt;
  const consequences: ConfirmDialogConsequence[] = [];

  if (beforeConversion && state.conversionAt !== null) {
    consequences.push({
      id: 'no-charge',
      text: t('billing.ui.cancelConsequence.noCharge', {
        date: formatters.exactDate(state.conversionAt),
      }),
    });
  }

  if (endDate !== null) {
    consequences.push({
      id: 'access',
      text: t('billing.ui.cancelConsequence.accessUntil', {
        date: formatters.exactDate(endDate),
      }),
    });
    consequences.push({
      id: 'scheduled',
      text: t('billing.ui.cancelConsequence.scheduled', {
        date: formatters.exactDate(endDate),
      }),
    });
  }

  consequences.push({ id: 'data', text: t('billing.ui.cancelConsequence.dataKept') });
  consequences.push({ id: 'restart', text: t('billing.ui.cancelConsequence.restart') });

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('billing.ui.cancelDialogTitle')}
      description={
        beforeConversion && state.conversionAt !== null
          ? t('billing.cancel.beforeTrialEnd', {
              date: formatters.exactDate(state.conversionAt),
            })
          : endDate === null
            ? t('billing.ui.cancelBody')
            : t('billing.cancel.afterTrial', { date: formatters.exactDate(endDate) })
      }
      consequences={consequences}
      confirmLabel={t('billing.ui.cancelConfirm')}
      cancelLabel={t('billing.ui.cancelKeep')}
      closeLabel={t('a11y.label.closeDialog')}
      onConfirm={onConfirm}
    />
  );
}
