'use client';

/**
 * The follow up parts, in the order they publish.
 *
 * A part past what the snapshot says the platform accepts is still listed, and
 * marked as not sent, for the same reason an extra attachment is: the writer
 * needs to see the thing that will not go out.
 */

import type { ReactNode } from 'react';
import { useTranslations } from '@relay/i18n/react';
import { cn } from '@relay/design-system/utils';

import type { PreviewThreadItem } from '../types';

export interface PreviewThreadProps {
  readonly items: readonly PreviewThreadItem[];
  readonly maxItems: number;
  readonly providerName: string;
}

export function PreviewThread({ items, maxItems, providerName }: PreviewThreadProps): ReactNode {
  const t = useTranslations();
  if (items.length === 0) {
    return null;
  }
  const dropped = Math.max(items.length - maxItems, 0);

  return (
    <div className="flex flex-col gap-2">
      <ol className="flex flex-col gap-2">
        {items.map((item, index) => {
          const sent = index < maxItems;
          return (
            <li
              key={item.id}
              className={cn(
                'border-border-subtle bg-surface-sunken rounded-md border p-2',
                sent ? '' : 'opacity-60',
              )}
            >
              <p className="text-label text-text-tertiary flex flex-wrap gap-x-3">
                <span>{t.full('composer.sequence.item', { position: index + 2 })}</span>
                <span>
                  {t.full('composer.sequence.delayMinutes', {
                    count: Math.round(item.delaySeconds / 60),
                  })}
                </span>
                {sent ? null : <span>{t.full('composerWeb.preview.notSent.item')}</span>}
              </p>
              <p className="text-body-sm text-text-primary mt-1 whitespace-pre-wrap">
                {item.text.length > 0
                  ? item.text
                  : t.full('composerWeb.preview.empty')}
              </p>
            </li>
          );
        })}
      </ol>
      {dropped > 0 ? (
        <p className="text-label text-warning-fg">
          {t.full('composerWeb.preview.thread.overLimit', {
            provider: providerName,
            limit: maxItems,
          })}
        </p>
      ) : null}
    </div>
  );
}
