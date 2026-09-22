'use client';

/**
 * Channels whose capabilities could not be read when the composer opened.
 *
 * One failing provider used to take the whole composer down. Now that channel
 * is left out of the rail, because every counter and limit reads its snapshot,
 * and this notice names it so its absence is never silent. A saved target on
 * it is kept on the draft, not dropped.
 */

import { type ReactNode } from 'react';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { useComposer } from '../composer-context';

export function UnavailableChannelsNotice(): ReactNode {
  const t = useTranslations();
  const { bootstrap } = useComposer();
  const unavailable = bootstrap.unavailableAccounts ?? [];

  if (unavailable.length === 0) {
    return null;
  }

  return (
    <Notice
      tone="warning"
      title={t.full('composerWeb.channels.unavailableTitle', { count: unavailable.length })}
      description={t.full('composerWeb.channels.unavailableBody')}
    >
      <ul className="text-body-sm text-text-secondary flex flex-col gap-0.5">
        {unavailable.map((account) => (
          <li key={account.connectionId}>{account.displayName}</li>
        ))}
      </ul>
    </Notice>
  );
}
