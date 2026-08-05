'use client';

import type { ReactNode } from 'react';
import { CopyableSecret } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { useFormatters } from '../../settings/lib/formatters';
import type { OneTimeCredential } from '../../settings/lib/view-models';

export interface CredentialPanelProps {
  credential: OneTimeCredential;
  /** Distinguishes an agent credential from an OAuth client secret. */
  kind: 'service-account' | 'client-secret' | 'signing-secret';
  onAcknowledge: () => void;
}

const COPY_KEYS = {
  'service-account': {
    label: 'developer.ui.agents.credentialLabel',
    warningTitle: 'developer.ui.agents.credentialWarning',
    warningBody: 'developer.ui.agents.credentialWarningBody',
    consumed: 'developer.ui.agents.credentialConsumed',
    acknowledge: 'developer.ui.agents.credentialStored',
  },
  'client-secret': {
    label: 'developer.apps.clientSecret',
    warningTitle: 'developer.ui.apps.secretWarning',
    warningBody: 'developer.ui.apps.secretWarningBody',
    consumed: 'developer.ui.apps.secretConsumed',
    acknowledge: 'developer.ui.apps.secretStored',
  },
  'signing-secret': {
    label: 'developer.ui.webhooks.secretTitle',
    warningTitle: 'developer.ui.apps.secretWarning',
    warningBody: 'developer.ui.webhooks.secretBody',
    consumed: 'developer.ui.apps.secretConsumed',
    acknowledge: 'developer.ui.apps.secretStored',
  },
} as const;

/**
 * A credential shown exactly once.
 *
 * The panel states that up front rather than after the copy, because a user
 * who learns the rule too late has already navigated away. The acknowledgement
 * is a real action, not a timer: nothing hides the value until the person says
 * they have stored it.
 */
export function CredentialPanel({
  credential,
  kind,
  onAcknowledge,
}: CredentialPanelProps): ReactNode {
  const t = useTranslations();
  const formatters = useFormatters();
  const keys = COPY_KEYS[kind];

  return (
    <div className="flex flex-col gap-2">
      <CopyableSecret
        value={credential.value}
        onAcknowledge={onAcknowledge}
        messages={{
          valueLabel: t(keys.label),
          warningTitle: t(keys.warningTitle),
          warningDescription: t(keys.warningBody),
          copyLabel: t('action.copy'),
          copiedLabel: t('action.copied'),
          revealLabel: t('developer.ui.agents.credentialReveal'),
          hideLabel: t('developer.ui.agents.credentialHide'),
          consumedText: t(keys.consumed),
          acknowledgeLabel: t(keys.acknowledge),
        }}
      />
      {credential.expiresAt === null ? null : (
        <p className="text-body-sm text-text-tertiary">
          {t('developer.credential.expires', { date: formatters.date(credential.expiresAt) })}
        </p>
      )}
    </div>
  );
}
