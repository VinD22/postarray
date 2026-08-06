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
import { Sticker } from '@/features/marketing/components/loud/sticker';

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
    // The extra 2px inline-start border is this band's own emphasis, kept
    // outside `Notice` on purpose: that primitive is documented to stay a
    // flat tinted rectangle with no accent bar everywhere else it appears.
    <div className="border-warning-border overflow-hidden rounded-lg border-s-2">
      <Notice
        tone="warning"
        liveness="status"
        title={
          <span className="flex flex-wrap items-center gap-2">
            <Sticker tone="cta" rotate={-3} ariaHidden>
              {count}
            </Sticker>
            {t('web.calendar.attention.title', { count })}
          </span>
        }
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
    </div>
  );
}
