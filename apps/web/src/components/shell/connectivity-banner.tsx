'use client';

import { useEffect, useRef } from 'react';

import { useAnnouncer } from '@relay/design-system/hooks';
import { OfflineBanner } from '@relay/design-system/patterns';
import { Button } from '@relay/design-system/primitives';

import { useTranslations } from '@/lib/i18n';
import { useOnlineStatus } from '@/lib/utils/use-online-status';

/**
 * The offline banner.
 *
 * It states exactly what still works, because vagueness here is what makes
 * people retry and duplicate work. Going offline and coming back are both
 * announced politely: an assertive announcement mid-sentence is hostile.
 */
export function ConnectivityBanner() {
  const t = useTranslations();
  const online = useOnlineStatus();
  const { announce } = useAnnouncer();
  const previous = useRef(online);

  useEffect(() => {
    if (previous.current !== online) {
      announce(online ? t('a11y.announce.online') : t('a11y.announce.offline'), 'polite');
      previous.current = online;
    }
  }, [online, announce, t]);

  if (online) {
    return null;
  }

  return (
    <OfflineBanner
      title={t('shell.offline.title')}
      description={t('shell.offline.body')}
      className="rounded-none border-x-0 border-t-0"
      actions={
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            window.location.reload();
          }}
        >
          {t('shell.offline.retry')}
        </Button>
      }
    />
  );
}
