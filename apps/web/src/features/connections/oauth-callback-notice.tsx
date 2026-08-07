'use client';

import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';

import { Notice, type NoticeTone } from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';

import { parseOAuthCallbackResult } from './oauth-callback-result';
import { useProviderName } from './provider';

/**
 * Turns the callback's small machine vocabulary into calm, localizable UI.
 * A successful callback is intentionally not announced here: the refreshed
 * account list is the source of truth, and a count in a URL must never be
 * mistaken for a persisted connection.
 */
export function OAuthCallbackNotice(): ReactNode {
  const searchParams = useSearchParams();
  const result = parseOAuthCallbackResult(searchParams);
  const t = useTranslations();
  const providerName = useProviderName();

  if (result === null || result.status === 'connected') return null;

  const provider = providerName(result.provider);
  if (result.status === 'declined') {
    return (
      <Notice
        tone="warning"
        liveness="status"
        title={t('connection.oauth.canceled', { provider })}
      />
    );
  }

  switch (result.reason) {
    case 'not_implemented':
      return (
        <Notice
          tone="warning"
          liveness="alert"
          title={t('error.capability_not_implemented.message', { provider })}
          description={t('error.capability_not_implemented.action')}
        />
      );
    case 'unsupported':
      return (
        <Notice
          tone="warning"
          liveness="alert"
          title={t('error.capability_unsupported.message', { provider })}
          description={t('error.capability_unsupported.action')}
        />
      );
    case 'provider':
      return (
        <Notice
          tone="destructive"
          liveness="alert"
          title={t('error.provider_unavailable.message', { provider })}
          description={t('error.provider_unavailable.action')}
        />
      );
    default:
      return (
        <Notice
          tone={genericFailureTone}
          liveness="alert"
          title={t('error.internal.message')}
          description={t('error.internal.action')}
        />
      );
  }
}

const genericFailureTone: NoticeTone = 'destructive';
