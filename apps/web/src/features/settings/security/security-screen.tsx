'use client';

import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@/components/link';
import { Button, Code } from '@relay/design-system/primitives';
import { ConfirmDialog, Notice, PageHeader } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import type { Scope } from '@relay/contracts';

import { api } from '@/lib/api';
import { CredentialPanel } from '@/features/developer/components/credential-panel';

import { AsyncBoundary } from '../lib/async-boundary';
import { securityGateway, webhooksGateway } from '../lib/gateway';
import { useFormatters } from '../lib/formatters';
import { settingsKey, useWorkspaceId } from '../lib/keys';
import { useSettingsMutation } from '../lib/use-settings-mutation';
import type { ApiKeyView, OAuthGrantView } from '../lib/view-models';
import { InlineFact, SettingsPanel, SettingsStack } from '../components/section';
import { ApiKeyDialog } from './api-key-dialog';
import { RevokeApiKeyDialog } from './revoke-api-key-dialog';

export function SecurityScreen(): ReactNode {
  const t = useTranslations();
  const section = t('settings.ui.section.security');
  const formatters = useFormatters();
  const workspaceId = useWorkspaceId();
  const KEYS_KEY = settingsKey(workspaceId, 'security', 'api-keys');
  const GRANTS_KEY = settingsKey(workspaceId, 'security', 'grants');
  const SESSIONS_KEY = settingsKey(workspaceId, 'security', 'sessions');
  const WEBHOOKS_KEY = settingsKey(workspaceId, 'webhooks');
  const CONNECTIONS_KEY = settingsKey(workspaceId, 'security', 'connections');

  const apiKeys = useQuery({ queryKey: KEYS_KEY, queryFn: () => securityGateway.apiKeys() });
  const grants = useQuery({ queryKey: GRANTS_KEY, queryFn: () => securityGateway.grants() });
  const sessions = useQuery({ queryKey: SESSIONS_KEY, queryFn: () => securityGateway.sessions() });
  const endpoints = useQuery({ queryKey: WEBHOOKS_KEY, queryFn: () => webhooksGateway.list() });
  const connections = useQuery({
    queryKey: CONNECTIONS_KEY,
    queryFn: () => securityGateway.connections(),
  });

  const [pendingGrant, setPendingGrant] = useState<OAuthGrantView | null>(null);
  const [creatingKey, setCreatingKey] = useState(false);
  const [pendingKey, setPendingKey] = useState<ApiKeyView | null>(null);
  const [credential, setCredential] = useState<{
    readonly value: string;
    readonly expiresAt: string | null;
  } | null>(null);

  const revokeGrant = useSettingsMutation({
    section,
    mutationFn: securityGateway.revokeGrant,
    invalidate: [GRANTS_KEY],
    onSuccess: () => setPendingGrant(null),
    successMessage: t('developer.grants.revoked'),
  });

  const revokeOtherSessions = useSettingsMutation<void, void>({
    section,
    mutationFn: securityGateway.revokeOtherSessions,
    invalidate: [SESSIONS_KEY],
    successMessage: t('settings.ui.security.sessionRevokeSuccess'),
  });

  const revokeKey = useSettingsMutation({
    section,
    mutationFn: async (input: { apiKeyId: string; password: string }) => {
      await api.auth.stepUpWithPassword(input.password);
      await securityGateway.revokeApiKey(input.apiKeyId);
    },
    invalidate: [KEYS_KEY],
    onSuccess: () => setPendingKey(null),
  });

  const createKey = useSettingsMutation({
    section,
    mutationFn: async (input: { name: string; scopes: readonly Scope[]; password: string }) => {
      await api.auth.stepUpWithPassword(input.password);
      return securityGateway.createApiKey({ name: input.name, scopes: input.scopes });
    },
    invalidate: [KEYS_KEY],
    onSuccess: (created) => {
      setCredential(created);
      setCreatingKey(false);
    },
  });

  const keyRows = apiKeys.data ?? [];
  const grantRows = grants.data ?? [];

  return (
    <>
      <PageHeader title={section} description={t('settings.ui.security.description')} />

      <SettingsStack>
        {credential === null ? null : (
          <CredentialPanel
            credential={credential}
            kind="api-key"
            onAcknowledge={() => setCredential(null)}
          />
        )}

        <SettingsPanel title={t('settings.ui.security.accountProtectionTitle')}>
          <Notice
            tone="info"
            title={t('settings.ui.state.notBuiltTitle')}
            description={t('settings.ui.security.mfaUnavailable')}
          />
        </SettingsPanel>

        <SettingsPanel
          title={t('settings.ui.security.sessionsCaption')}
          description={t('settings.ui.security.sessionsBody')}
          actions={
            (sessions.data ?? []).some((session) => !session.isCurrent) ? (
              <Button
                variant="secondary"
                size="sm"
                loading={revokeOtherSessions.isSaving}
                onClick={() => void revokeOtherSessions.run(undefined)}
              >
                {t('settings.ui.security.sessionRevokeAll')}
              </Button>
            ) : null
          }
        >
          <AsyncBoundary
            section={t('settings.ui.security.sessionsCaption')}
            isPending={sessions.isPending}
            error={sessions.error}
            onRetry={() => void sessions.refetch()}
            skeletonRows={2}
            skeletonColumns={3}
          >
            {(sessions.data ?? []).length === 0 ? (
              <p className="text-body-md text-text-secondary">
                {t('settings.ui.security.emptySessions')}
              </p>
            ) : (
              <ul className="flex flex-col">
                {(sessions.data ?? []).map((session) => (
                  <li
                    key={session.id}
                    className="border-border-subtle flex flex-col gap-2 border-b py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="text-body-md text-text-primary font-medium">
                        {t(`settings.ui.security.sessionDevice.${session.device}` as const)}
                        {session.isCurrent ? (
                          <span className="text-body-sm text-text-secondary ms-2 font-normal">
                            {t('settings.ui.security.sessionCurrent')}
                          </span>
                        ) : null}
                      </span>
                      <span className="text-body-sm text-text-tertiary flex flex-wrap gap-x-2 gap-y-1">
                        <span>
                          {session.location ?? t('settings.ui.security.sessionLocationUnknown')}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {t('settings.ui.security.sessionLastUsed', {
                            relativeTime: formatters.relative(session.lastSeenAt),
                          })}
                        </span>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </AsyncBoundary>
        </SettingsPanel>

        <SettingsPanel
          title={t('settings.ui.security.credentialsTitle')}
          description={t('settings.ui.security.credentialsBody')}
          actions={
            <Button variant="primary" size="sm" onClick={() => setCreatingKey(true)}>
              {t('settings.ui.security.apiKeyCreate')}
            </Button>
          }
        >
          <AsyncBoundary
            section={t('settings.ui.security.credentialsTitle')}
            isPending={apiKeys.isPending}
            error={apiKeys.error}
            onRetry={() => void apiKeys.refetch()}
            skeletonRows={3}
            skeletonColumns={3}
          >
            {keyRows.length === 0 ? (
              <p className="text-body-md text-text-secondary">{t('developer.activity.empty')}</p>
            ) : (
              <ul className="flex flex-col">
                {keyRows.map((key) => (
                  <li
                    key={key.id}
                    className="border-border-subtle flex flex-col gap-2 border-b py-3 last:border-b-0 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="text-body-md text-text-primary font-medium">{key.name}</span>
                      <span className="text-body-sm text-text-tertiary flex flex-wrap items-center gap-2">
                        <Code>{key.prefix}</Code>
                        {t('developer.credential.created', {
                          date: formatters.date(key.createdAt),
                          name: key.createdByName,
                        })}
                        {key.lastUsedAt === null
                          ? t('developer.credential.neverUsed')
                          : t('developer.credential.lastUsed', {
                              relativeTime: formatters.relative(key.lastUsedAt),
                            })}
                        {key.expiresAt === null
                          ? null
                          : t('developer.credential.expires', {
                              date: formatters.date(key.expiresAt),
                            })}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      loading={revokeKey.isSaving}
                      onClick={() => setPendingKey(key)}
                    >
                      {t('action.revoke')}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </AsyncBoundary>
        </SettingsPanel>

        <SettingsPanel
          title={t('settings.ui.security.webhooksTitle')}
          actions={
            <Button variant="secondary" size="sm" asChild>
              <Link href="/settings/webhooks">
                {t('settings.ui.security.viewInSection', {
                  section: t('settings.ui.section.webhooks'),
                })}
              </Link>
            </Button>
          }
        >
          <InlineFact
            label={t('common.results', { count: (endpoints.data ?? []).length })}
            value={formatters.list((endpoints.data ?? []).map((endpoint) => endpoint.url))}
          />
        </SettingsPanel>

        <SettingsPanel
          title={t('settings.ui.security.grantsTitle')}
          description={t('settings.ui.security.grantsBody')}
        >
          <AsyncBoundary
            section={t('settings.ui.security.grantsTitle')}
            isPending={grants.isPending}
            error={grants.error}
            onRetry={() => void grants.refetch()}
            skeletonRows={2}
            skeletonColumns={3}
          >
            {grantRows.length === 0 ? (
              <p className="text-body-md text-text-secondary">
                {t('settings.ui.security.emptyGrants')}
              </p>
            ) : (
              <ul className="flex flex-col">
                {grantRows.map((grant) => (
                  <li
                    key={grant.id}
                    className="border-border-subtle flex flex-col gap-2 border-b py-3 last:border-b-0 md:flex-row md:items-start md:justify-between"
                  >
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="text-body-md text-text-primary font-medium">
                        {grant.appName}
                      </span>
                      <span className="text-body-sm text-text-tertiary">
                        {t('developer.grants.grantedOn', {
                          date: formatters.date(grant.consentedAt),
                        })}
                        {grant.lastUsedAt === null
                          ? null
                          : ` ${t('developer.grants.lastUsed', {
                              relativeTime: formatters.relative(grant.lastUsedAt),
                            })}`}
                      </span>
                      <span className="flex flex-wrap gap-1 pt-1">
                        <span className="sr-only">{t('settings.ui.security.grantScopes')}</span>
                        {grant.scopes.map((scope) => (
                          <Code key={scope}>{scope}</Code>
                        ))}
                      </span>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => setPendingGrant(grant)}>
                      {t('developer.grants.revoke')}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </AsyncBoundary>
        </SettingsPanel>

        <SettingsPanel
          title={t('settings.ui.security.socialPermissionsTitle')}
          description={t('settings.ui.security.socialPermissionsBody')}
        >
          <AsyncBoundary
            section={t('settings.ui.security.socialPermissionsTitle')}
            isPending={connections.isPending}
            error={connections.error}
            onRetry={() => void connections.refetch()}
            skeletonRows={3}
            skeletonColumns={2}
          >
            <ul className="flex flex-col">
              {(connections.data ?? []).map((connection) => (
                <li
                  key={connection.id}
                  className="border-border-subtle flex flex-col gap-1 border-b py-3 last:border-b-0"
                >
                  <span className="text-body-md text-text-primary font-medium">
                    {connection.accountLabel}
                  </span>
                  <span className="text-body-sm text-text-secondary">
                    {connection.grantedCapabilities.length === 0
                      ? t('common.unavailable')
                      : formatters.list([...connection.grantedCapabilities])}
                  </span>
                </li>
              ))}
            </ul>
          </AsyncBoundary>
        </SettingsPanel>

        <Notice
          tone="info"
          title={t('settings.security.killSwitch')}
          description={t('settings.ui.security.killSwitchUnavailable')}
        />
      </SettingsStack>

      <ConfirmDialog
        open={pendingGrant !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingGrant(null);
          }
        }}
        tone="destructive"
        title={t('settings.ui.security.revokeGrantTitle', { app: pendingGrant?.appName ?? '' })}
        description={t('settings.ui.security.grantsBody')}
        consequences={[
          { id: 'tokens', text: t('settings.ui.security.revokeGrantConsequence.tokens') },
          { id: 'scheduled', text: t('settings.ui.security.revokeGrantConsequence.scheduled') },
          { id: 'reconnect', text: t('settings.ui.security.revokeGrantConsequence.reconnect') },
        ]}
        confirmLabel={t('developer.grants.revoke')}
        cancelLabel={t('action.cancel')}
        closeLabel={t('a11y.label.closeDialog')}
        onConfirm={() => {
          if (pendingGrant !== null) {
            void revokeGrant.run(pendingGrant.id);
          }
        }}
      />

      <ApiKeyDialog
        open={creatingKey}
        saving={createKey.isSaving}
        onOpenChange={setCreatingKey}
        onSubmit={(input) => void createKey.run(input)}
      />

      <RevokeApiKeyDialog
        apiKey={pendingKey}
        saving={revokeKey.isSaving}
        onOpenChange={(open) => {
          if (!open) setPendingKey(null);
        }}
        onSubmit={(input) => void revokeKey.run(input)}
      />
    </>
  );
}
