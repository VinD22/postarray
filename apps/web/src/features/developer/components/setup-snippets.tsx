'use client';

import { useState, type ReactNode } from 'react';
import {
  Button,
  Code,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useAnnouncer } from '@relay/design-system/hooks';
import { useTranslations } from '@relay/i18n/react';

import { SETUP_CLIENTS, buildSnippet, type SnippetInput } from '../lib/setup-snippets.js';

export type SetupSnippetsProps = SnippetInput;

/**
 * Copyable configuration for the six clients we document.
 *
 * The endpoint fields sit above the tabs because they are the same for every
 * client and are the two values a person most often needs to paste somewhere
 * we have not thought of.
 */
export function SetupSnippets(props: SetupSnippetsProps): ReactNode {
  const t = useTranslations();
  const { announce } = useAnnouncer();
  const [copyFailed, setCopyFailed] = useState(false);

  async function copy(value: string, clientLabel: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
      setCopyFailed(false);
      announce(t('developer.ui.setup.snippetCopied', { client: clientLabel }));
    } catch {
      setCopyFailed(true);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-body-sm text-text-secondary">
          {t('developer.setup.mcpEndpoint')}
          <Input readOnly value={props.mcpEndpoint} className="font-mono" />
        </label>
        <label className="flex flex-col gap-1 text-body-sm text-text-secondary">
          {t('developer.setup.apiBaseUrl')}
          <Input readOnly value={props.apiBaseUrl} className="font-mono" />
        </label>
      </div>

      <Notice tone="neutral" title={t('developer.ui.setup.credentialPlaceholder')} />

      <Tabs defaultValue={SETUP_CLIENTS[0]?.id ?? 'cli'}>
        <TabsList aria-label={t('developer.ui.setup.tabLabel')}>
          {SETUP_CLIENTS.map((client) => (
            <TabsTrigger key={client.id} value={client.id}>
              {t(client.labelKey)}
            </TabsTrigger>
          ))}
        </TabsList>

        {SETUP_CLIENTS.map((client) => {
          const snippet = buildSnippet(client.id, props);
          const label = t(client.labelKey);
          return (
            <TabsContent key={client.id} value={client.id}>
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-body-sm text-text-tertiary">
                    {client.filename === null ? t('developer.setup.cli') : client.filename}
                  </p>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => void copy(snippet, label)}
                  >
                    {t('developer.ui.setup.copySnippet', { client: label })}
                  </Button>
                </div>
                <Code block className="overflow-x-auto">
                  {snippet}
                </Code>
                <p className="text-body-sm text-text-secondary">
                  {t('developer.ui.setup.help')}
                </p>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      {copyFailed ? (
        <p className="text-body-sm text-warning-fg">{t('settings.ui.copyFailed')}</p>
      ) : null}
    </div>
  );
}
