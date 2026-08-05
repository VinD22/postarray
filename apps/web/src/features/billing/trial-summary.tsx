'use client';

import type { ReactNode } from 'react';
import { Button } from '@relay/design-system/primitives';
import { DefinitionList, Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { useFormatters } from '../settings/lib/formatters.js';
import type { BillingStateView } from '../settings/lib/view-models.js';

export interface TrialSummaryProps {
  state: BillingStateView;
  onOpenPortal: () => void;
  openingPortal: boolean;
}

/**
 * The status block.
 *
 * Every number here is a legal statement, so nothing is computed in the
 * browser: the days remaining, the conversion instant and the amount all come
 * from the billing service, and if the service has not told us an amount we
 * say so rather than showing a plausible one.
 */
export function TrialSummary({
  state,
  onOpenPortal,
  openingPortal,
}: TrialSummaryProps): ReactNode {
  const t = useTranslations();
  const formatters = useFormatters();

  const intervalLabel =
    state.interval === 'annual'
      ? t('billing.plan.interval.annual')
      : t('billing.plan.interval.monthly');

  const conversionSentence =
    state.conversionAt !== null && state.conversionAmount !== null
      ? t('billing.ui.convertsOn', {
          date: formatters.exactDate(state.conversionAt),
          amount: formatters.money(state.conversionAmount),
          interval: intervalLabel,
        })
      : t('common.unavailable');

  const items = [
    {
      id: 'status',
      term: t('common.status'),
      definition:
        state.status === 'trialing' && state.trialDaysRemaining !== null
          ? t('billing.ui.trialDaysRemaining', { count: state.trialDaysRemaining })
          : t(`billing.subscription.status.${statusKey(state.status)}`),
    },
    {
      id: 'conversion',
      term: t('billing.ui.conversionLabel'),
      definition: conversionSentence,
    },
    {
      id: 'interval',
      term: t('billing.plan.selectInterval'),
      definition: state.interval === null ? t('common.notSet') : intervalLabel,
    },
    {
      id: 'payment',
      term: t('billing.subscription.paymentMethod'),
      definition:
        state.paymentMethod === null
          ? t('billing.ui.paymentMethodMissing')
          : t('billing.ui.paymentMethodDescriptor', {
              brand: state.paymentMethod.brand,
              last4: state.paymentMethod.last4,
              expiry: state.paymentMethod.expiry,
            }),
      hint: t('billing.ui.paymentMethodPolar'),
    },
    {
      id: 'channels',
      term: t('billing.ui.channelsLabel'),
      definition: t('billing.ui.allowanceChannelsUsage', {
        used: formatters.number(state.activeChannels),
        limit: formatters.number(state.channelAllowance),
      }),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {state.status === 'trialing' ? (
        <Notice
          tone="info"
          title={
            state.trialDaysRemaining === null
              ? t('billing.trial.length')
              : t('billing.ui.trialDaysRemaining', { count: state.trialDaysRemaining })
          }
          description={
            <div className="flex flex-col gap-1">
              <p>{conversionSentence}</p>
              <p>{t('billing.ui.dueToday')}</p>
              {state.conversionAt === null ? null : (
                <p>
                  {t('billing.ui.cancelBeforeDate', {
                    date: formatters.exactDate(state.conversionAt),
                  })}
                </p>
              )}
              <p className="text-text-tertiary">{t('billing.trial.reminder')}</p>
            </div>
          }
        />
      ) : null}

      {state.status === 'past_due' ? (
        <Notice
          tone="destructive"
          liveness="status"
          title={t('billing.ui.pastDueHeading')}
          description={
            <div className="flex flex-col gap-1">
              <p>{t('billing.ui.pastDueBody')}</p>
              {state.graceEndsAt === null ? null : (
                <p>
                  {t('billing.ui.gracePolicy', {
                    date: formatters.exactDate(state.graceEndsAt),
                  })}
                </p>
              )}
            </div>
          }
          actions={
            <Button size="sm" variant="primary" loading={openingPortal} onClick={onOpenPortal}>
              {t('billing.subscription.portal')}
            </Button>
          }
        />
      ) : null}

      {state.readOnly ? (
        <Notice
          tone="warning"
          title={t('settings.ui.state.readOnlyTitle')}
          description={t('settings.ui.state.readOnlyBody')}
        />
      ) : null}

      {state.canceledAt !== null && state.accessUntil !== null ? (
        <Notice
          tone="neutral"
          title={t('billing.ui.canceledNotice')}
          description={t('billing.subscription.endsOn', {
            date: formatters.exactDate(state.accessUntil),
          })}
        />
      ) : null}

      <DefinitionList items={items} />
    </div>
  );
}

function statusKey(status: BillingStateView['status']): string {
  switch (status) {
    case 'past_due':
      return 'pastDue';
    case 'trialing':
      return 'trialing';
    case 'active':
      return 'active';
    case 'canceled':
      return 'canceled';
    case 'unpaid':
      return 'unpaid';
    case 'incomplete':
      return 'none';
    default:
      return 'none';
  }
}
