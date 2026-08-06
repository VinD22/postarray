'use client';

import { Link } from '@/components/link';

import { Button } from '@relay/design-system/primitives';
import { cn, panelPoster } from '@relay/design-system/utils';

import { CountUp } from '@/components/motion';
import { useBillingState } from '@/lib/api/hooks';
import { useFormatters, useTranslations } from '@/lib/i18n';

const DAY_MS = 86_400_000;

/**
 * The trial banner.
 *
 * It states the remaining days, the exact conversion date and the exact amount,
 * and it disappears the moment the subscription is active. No countdown
 * animation on the words themselves, no urgency styling on the sentence: it
 * is a fact, not a nudge. The one loud element is decorative — a large
 * `aria-hidden` numeral that counts up to the same day count on first mount —
 * so a screen reader still hears the fact exactly once, from the sentence.
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
    <div
      role="status"
      data-stagger-item
      className={cn(
        panelPoster,
        'relative flex flex-col gap-3 overflow-hidden p-4 ps-6',
        'sm:flex-row sm:items-center sm:gap-5',
      )}
    >
      <span aria-hidden="true" className="bg-blush absolute inset-y-0 start-0 w-1.5" />

      <div aria-hidden="true" className="flex shrink-0 flex-col items-start">
        <CountUp
          value={days}
          format={format.number}
          className="font-display text-display-md text-text-primary leading-none"
        />
        <span className="text-label text-text-tertiary tracking-wide uppercase">
          {t('billing.trial.daysRemaining', { count: days })}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-body-md text-text-primary font-medium">
          {t('home.trial.banner', {
            days,
            date: format.date(data.firstChargeAt, 'long'),
            amount: format.money(data.firstChargeAmount),
          })}
        </p>
        <p className="text-body-sm text-text-secondary">{t('billing.trial.cancelBefore')}</p>
      </div>

      <div className="shrink-0">
        <Button variant="secondary" size="sm" asChild>
          <Link href="/settings/billing">{t('home.trial.manage')}</Link>
        </Button>
      </div>
    </div>
  );
}
