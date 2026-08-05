'use client';

/**
 * Work that needs a person, on the calendar itself.
 *
 * A failed publish is not a toast. It sits here, above the grid, for as long
 * as it is unresolved, and it is also in the action center. Two places, both
 * durable, because a person who was not looking at the screen when the toast
 * fired is exactly the person who needs to know.
 */

import type { ReactNode } from 'react';
import { Button, Notice } from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';

export interface AttentionBarProps {
  count: number;
  actionCenterHref: string;
  showingOnlyAttention: boolean;
  onShowOnlyAttention: () => void;
}

export function AttentionBar({
  count,
  actionCenterHref,
  showingOnlyAttention,
  onShowOnlyAttention,
}: AttentionBarProps): ReactNode {
  const t = useTranslations();
  if (count === 0) return null;

  return (
    <Notice
      tone="warning"
      liveness="status"
      title={t('web.calendar.attention.title', { count })}
      description={t('web.calendar.attention.body')}
      actions={
        <>
          {showingOnlyAttention ? null : (
            <Button variant="secondary" size="sm" onClick={onShowOnlyAttention}>
              {t('web.calendar.attention.showOnly')}
            </Button>
          )}
          <Button variant="secondary" size="sm" asChild>
            <a href={actionCenterHref}>{t('web.calendar.attention.open')}</a>
          </Button>
        </>
      }
    />
  );
}
