'use client';

import type { ReactNode } from 'react';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { useFormatters } from '@/features/settings/lib/formatters';

/**
 * The workspace has spent its AI allowance for the month.
 *
 * Said plainly, with no jargon and no blame: what ran out, what it stops, what
 * still works, and when it starts again. An unknown reset date says so rather
 * than showing a guess.
 */
export function AssistantOverBudget({
  resetAt,
  action,
}: {
  readonly resetAt: string | null;
  readonly action?: ReactNode;
}): ReactNode {
  const t = useTranslations();
  const formatters = useFormatters();

  return (
    <Notice
      tone="warning"
      liveness="status"
      title={t('assistantWeb.overBudget.title')}
      description={
        <span className="flex flex-col gap-1">
          <span>{t('assistantWeb.overBudget.body')}</span>
          <span>
            {resetAt === null
              ? t('assistantWeb.overBudget.resetUnknown')
              : t('assistantWeb.overBudget.reset', { dateTime: formatters.dateTime(resetAt) })}
          </span>
        </span>
      }
      actions={action}
    />
  );
}
