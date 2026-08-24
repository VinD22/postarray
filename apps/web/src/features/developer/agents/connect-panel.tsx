'use client';

import { useState, type ReactNode } from 'react';
import { Button, Code, Input } from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useAnnouncer } from '@relay/design-system/hooks';
import { useTranslations } from '@relay/i18n/react';

import { useFormatters } from '../../settings/lib/formatters';
import type { OneTimeCredential } from '../../settings/lib/view-models';
import { CredentialPanel } from '../components/credential-panel';
import { CONNECT_CLIENTS, CREDENTIAL_ENV_VAR, buildSnippet } from '../lib/setup-snippets';

export interface ConnectPanelProps {
  readonly mcpEndpoint: string;
  readonly apiBaseUrl: string;
  readonly serviceAccountName: string;
  /**
   * The credential, for the one render after it was created or rotated. `null`
   * every other time, which is the honest state: Post Array stores a hash and this
   * screen has nothing to show.
   */
  readonly credential: OneTimeCredential | null;
  readonly onCredentialAcknowledged: () => void;
  /**
   * When the workspace last recorded a call from this agent. `null` means no
   * call has been recorded, which is said in words. `undefined` means the
   * activity read failed, and then nothing is claimed either way.
   */
  readonly lastUsedAt: string | null | undefined;
}

/**
 * Connect your AI.
 *
 * One decision, then two things to do with the answer. The client picker is a
 * radio group rather than tabs because it is a choice the person makes about
 * their own machine, not a way of browsing our documentation, and it drives
 * the filename, the language and the snippet together.
 *
 * Every snippet comes from `buildSnippet`, the same function the marketing
 * page calls, so the configuration a signed-in customer copies and the one a
 * visitor reads cannot describe different software.
 *
 * The status line states only what was recorded. There is no reachability
 * check behind it and no "online" indicator: Post Array cannot see the agent, only
 * the calls the agent made.
 */
export function ConnectPanel(props: ConnectPanelProps): ReactNode {
  const t = useTranslations();
  const formatters = useFormatters();
  const { announce } = useAnnouncer();
  const [clientId, setClientId] = useState<string>(CONNECT_CLIENTS[0]?.id ?? 'generic-mcp');
  const [copyFailed, setCopyFailed] = useState(false);

  const client =
    CONNECT_CLIENTS.find((candidate) => candidate.id === clientId) ?? CONNECT_CLIENTS[0];
  const snippet = buildSnippet(clientId, {
    mcpEndpoint: props.mcpEndpoint,
    apiBaseUrl: props.apiBaseUrl,
    serviceAccountName: props.serviceAccountName,
  });
  const clientLabel = client === undefined ? '' : t(client.labelKey);

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopyFailed(false);
      announce(t('developer.connect.copied'));
    } catch {
      setCopyFailed(true);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-heading-sm text-text-primary">{t('developer.connect.title')}</h3>
        <p className="text-body-sm text-text-secondary">{t('developer.connect.lede')}</p>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-body-sm text-text-secondary mb-2">
          {t('developer.connect.clientLabel')}
        </legend>
        <div className="flex flex-wrap gap-2">
          {CONNECT_CLIENTS.map((candidate) => {
            const selected = candidate.id === clientId;
            return (
              <label
                key={candidate.id}
                className={[
                  'text-body-sm cursor-pointer rounded-sm border px-3 py-1.5',
                  selected
                    ? 'border-border-strong text-text-accent font-medium'
                    : 'border-border-subtle text-text-secondary',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="connect-client"
                  className="sr-only"
                  value={candidate.id}
                  checked={selected}
                  onChange={() => setClientId(candidate.id)}
                />
                {t(candidate.labelKey)}
              </label>
            );
          })}
        </div>
      </fieldset>

      <section className="flex flex-col gap-2">
        <h4 className="text-body-md text-text-primary font-medium">
          {t('developer.connect.step.credential')}
        </h4>
        {props.credential === null ? (
          <Notice
            tone="neutral"
            title={t('developer.connect.credentialOnce')}
            description={t('developer.connect.credentialGone')}
          />
        ) : (
          <CredentialPanel
            credential={props.credential}
            kind="service-account"
            onAcknowledge={props.onCredentialAcknowledged}
          />
        )}
        <p className="text-body-sm text-text-secondary">
          {t('developer.connect.credentialEnv', { variable: CREDENTIAL_ENV_VAR })}
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h4 className="text-body-md text-text-primary font-medium">
          {t('developer.connect.step.config')}
        </h4>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-body-sm text-text-tertiary">
            {client?.filename === null || client === undefined
              ? t('developer.connect.cliHint')
              : t('developer.connect.fileHint', { filename: client.filename })}
          </p>
          <Button size="sm" variant="secondary" onClick={() => void copy()}>
            {t('developer.connect.copy', { client: clientLabel })}
          </Button>
        </div>
        <Code block className="overflow-x-auto">
          {snippet}
        </Code>
        {copyFailed ? (
          <p className="text-body-sm text-warning-fg">{t('settings.ui.copyFailed')}</p>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-body-sm text-text-secondary flex flex-col gap-1">
            {t('developer.setup.mcpEndpoint')}
            <Input readOnly value={props.mcpEndpoint} className="font-mono" />
          </label>
          <label className="text-body-sm text-text-secondary flex flex-col gap-1">
            {t('developer.setup.apiBaseUrl')}
            <Input readOnly value={props.apiBaseUrl} className="font-mono" />
          </label>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h4 className="text-body-md text-text-primary font-medium">
          {t('developer.connect.step.verify')}
        </h4>
        <p className="text-body-sm text-text-secondary">
          {props.lastUsedAt === undefined
            ? t('developer.connect.status.unavailable')
            : props.lastUsedAt === null
              ? t('developer.connect.status.never')
              : t('developer.connect.status.lastCall', {
                  relativeTime: formatters.relative(props.lastUsedAt),
                })}
        </p>
      </section>
    </div>
  );
}
