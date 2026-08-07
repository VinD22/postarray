'use client';

import type { ReactNode } from 'react';

import { AccountIdentity } from '@/features/connections/provider';
import type { ContentReviewVariantView } from '@/lib/api';
import { useFormatters, useTranslations } from '@/lib/i18n';

import { Badge } from '@relay/design-system/primitives';

export function ApprovalVariantCard({
  variant,
  index,
}: {
  readonly variant: ContentReviewVariantView;
  readonly index: number;
}): ReactNode {
  const t = useTranslations();
  const format = useFormatters();

  return (
    <article className="border-border-bold bg-surface-raised shadow-hard-sm flex flex-col gap-5 border-2 p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <AccountIdentity provider={variant.provider} accountLabel={variant.accountLabel} />
        <Badge tone="outline">{format.number(index + 1)}</Badge>
      </div>

      <p className="text-body-md text-text-primary max-w-3xl leading-7 whitespace-pre-wrap">
        {variant.body}
      </p>

      <dl className="border-border-subtle text-body-sm grid gap-x-6 gap-y-3 border-t pt-4 sm:grid-cols-2">
        <VariantFact term={t('approval.content.language')} value={variant.locale} />
        <VariantFact
          term={t('approval.content.media')}
          value={t('approval.content.mediaCount', { count: variant.mediaIds.length })}
        />
        <VariantFact
          term={t('approval.content.destination')}
          value={variant.destinationLabel ?? t('common.unavailable')}
        />
        <VariantFact
          term={t('approval.content.privacy')}
          value={variant.privacyValue ?? t('common.unavailable')}
        />
        <VariantFact
          term={t('approval.content.schedule')}
          value={
            variant.scheduledAt === null
              ? t('common.unavailable')
              : `${format.dateTime(variant.scheduledAt)} (${variant.scheduledTimeZone ?? format.timeZone})`
          }
        />
        <VariantFact
          term={t('approval.content.cost')}
          value={
            variant.estimatedCost === null
              ? t('approval.content.costUnavailable')
              : format.money(variant.estimatedCost)
          }
        />
      </dl>
    </article>
  );
}

function VariantFact({
  term,
  value,
}: {
  readonly term: string;
  readonly value: string;
}): ReactNode {
  return (
    <div className="min-w-0">
      <dt className="text-label text-text-tertiary">{term}</dt>
      <dd className="text-text-primary mt-0.5 break-words">{value}</dd>
    </div>
  );
}
