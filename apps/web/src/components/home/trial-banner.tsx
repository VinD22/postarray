'use client';

import Link from 'next/link';

import { Notice } from '@relay/design-system/patterns';
import { Button } from '@relay/design-system/primitives';

import { useBillingState } from '@/lib/api/hooks';
import { useFormatters, useTranslations } from '@/lib/i18n';

const DAY_MS = 86_400_000;

/**
 * The trial banner.
 *
 * It states the remaining days, the exact conversion date and the exact amount,
 * and it disappears the moment the subscription is active. No countdown
 * animation, no urgency styling: this is a fact, not a nudge.
 */
export function TrialBanner() {
  const t = useTranslations();
  const format = useFormatters();
  const { data } = useBillingState();

  if (!data || data.status !== 'trialing') {
    return null;
  }
  if (data.firstChargeAt === null || data.firstChargeAmount === null) {
    return null;
  }

  const days = Math.max(
    0,
    Math.ceil((new Date(data.firstChargeAt).getTime() - Date.now()) / DAY_MS),
  );

  return (
    <Notice
      tone="info"
      title={t('home.trial.banner', {
        days,
        date: format.date(data.firstChargeAt, 'long'),
        amount: format.money(data.firstChargeAmount),
      })}
      description={t('billing.trial.cancelBefore')}
      actions={
        <Button variant="secondary" size="sm" asChild>
          <Link href="/settings/billing">{t('home.trial.manage')}</Link>
        </Button>
      }
    />
  );
}
