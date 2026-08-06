'use client';

import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@/components/link';
import {
  Badge,
  Button,
  Code,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
} from '@relay/design-system/primitives';
import { ConfirmDialog, Notice, PageHeader } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { AsyncBoundary } from '../lib/async-boundary';
import { agentsGateway, securityGateway, webhooksGateway } from '../lib/gateway';
import { useFormatters } from '../lib/formatters';
import { settingsKey, useWorkspaceId } from '../lib/keys';
import { useSettingsMutation } from '../lib/use-settings-mutation';
import type { OAuthGrantView } from '../lib/view-models';
import { InlineFact, SettingRow, SettingsPanel, SettingsStack } from '../components/section';

export function SecurityScreen(): ReactNode {
  const t = useTranslations();
  const section = t('settings.ui.section.security');
  const formatters = useFormatters();
  const workspaceId = useWorkspaceId();
  const SESSIONS_KEY = settingsKey(workspaceId, 'security', 'sessions');
  const KEYS_KEY = settingsKey(workspaceId, 'security', 'api-keys');
  const GRANTS_KEY = settingsKey(workspaceId, 'security', 'grants');
  const AGENTS_KEY = settingsKey(workspaceId, 'agents');
  const WEBHOOKS_KEY = settingsKey(workspaceId, 'webhooks');
  const CONNECTIONS_KEY = settingsKey(workspaceId, 'security', 'connections');

  const sessions = useQuery({ queryKey: SESSIONS_KEY, queryFn: () => securityGateway.sessions() });
  const mfa = useQuery({
    queryKey: settingsKey(workspaceId, 'security', 'mfa'),
    queryFn: () => securityGateway.mfaEnabled(),
  });
  const apiKeys = useQuery({ queryKey: KEYS_KEY, queryFn: () => securityGateway.apiKeys() });
  const grants = useQuery({ queryKey: GRANTS_KEY, queryFn: () => securityGateway.grants() });
  const agents = useQuery({ queryKey: AGENTS_KEY, queryFn: () => agentsGateway.list() });
  const endpoints = useQuery({ queryKey: WEBHOOKS_KEY, queryFn: () => webhooksGateway.list() });
  const connections = useQuery({
    queryKey: CONNECTIONS_KEY,
    queryFn: () => securityGateway.connections(),
  });

  const [pendingGrant, setPendingGrant] = useState<OAuthGrantView | null>(null);

  const revokeGrant = useSettingsMutation({
    section,
    mutationFn: securityGateway.revokeGrant,
    invalidate: [GRANTS_KEY],
    onSuccess: () => setPendingGrant(null),
    successMessage: t('developer.grants.revoked'),
  });

  const revokeOtherSessions = useSettingsMutation({
    section,
    mutationFn: securityGateway.revokeOtherSessions,
    invalidate: [SESSIONS_KEY],
  });

  const revokeKey = useSettingsMutation({
    section,
    mutationFn: securityGateway.revokeApiKey,
    invalidate: [KEYS_KEY],
  });

  const sessionRows = sessions.data ?? [];
  const keyRows = apiKeys.data ?? [];
  const grantRows = grants.data ?? [];

  return (
    <>
      <PageHeader title={section} description={t('settings.ui.security.description')} />

      <SettingsStack>
        <SettingsPanel
          title={t('settings.security.mfa')}
          description={t('settings.ui.security.mfaBody')}
        >
          <div className="flex flex-col">
            <SettingRow
              label={
                mfa.data === null || mfa.data === undefined
                  ? t('settings.security.mfa')
                  : mfa.data
                    ? t('settings.ui.security.mfaOn')
                    : t('settings.ui.security.mfaOff')
              }
              description={t('settings.security.mfaRequiredFor')}
              control={
                mfa.data === true ? null : (
                  <Button variant="primary" size="sm">
                    {t('settings.security.mfaEnable')}
                  </Button>
                )
              }
            />
            <SettingRow
              label={t('settings.security.passkeys')}
              control={
                <Button variant="secondary" size="sm">
                  {t('action.add')}
                </Button>
              }
            />
          </div>
        </SettingsPanel>

        <SettingsPanel title={t('settings.security.sessions')}>
          <AsyncBoundary
            section={t('settings.security.sessions')}
            isPending={sessions.isPending}
            error={sessions.error}
            onRetry={() => void sessions.refetch()}
            skeletonRows={3}
            skeletonColumns={3}
          >
            {sessionRows.length <= 1 ? (
              <p className="text-body-md text-text-secondary">
                {t('settings.ui.security.emptySessions')}
              </p>
            ) : (
              <TableContainer>
                <Table>
                  <TableCaption className="sr-only">
                    {t('settings.ui.security.sessionsCaption')}
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead scope="col">
                        {t('settings.ui.security.sessionColumn.device')}
                      </TableHead>
                      <TableHead scope="col">
                        {t('settings.ui.security.sessionColumn.location')}
                      </TableHead>
                      <TableHead scope="col">
                        {t('settings.ui.security.sessionColumn.lastSeen')}
                      </TableHead>
                      <TableHead scope="col">
                        <span className="sr-only">{t('common.details')}</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessionRows.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableRowHeader>
                          <span className="flex flex-wrap items-center gap-2">
                            {entry.device}
                            {entry.isCurrent ? (
                              <Badge tone="accent">
                                {t('settings.ui.security.sessionCurrent')}
                              </Badge>
                            ) : null}
                          </span>
                        </TableRowHeader>
                        <TableCell>
                          {entry.location ?? t('settings.ui.security.sessionLocationUnknown')}
                        </TableCell>
                        <TableCell>{formatters.relative(entry.lastSeenAt)}</TableCell>
                        <TableCell className="text-end">
                          {entry.isCurrent ? null : (
                            <Button variant="ghost" size="sm">
                              {t('settings.security.sessionRevoke')}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </AsyncBoundary>
          {sessionRows.length > 1 ? (
            <div>
              <Button
                variant="secondary"
                size="sm"
                loading={revokeOtherSessions.isSaving}
                onClick={() => void revokeOtherSessions.run(undefined)}
              >
                {t('settings.ui.security.sessionRevokeAll')}
              </Button>
            </div>
          ) : null}
        </SettingsPanel>

        <SettingsPanel
          title={t('settings.ui.security.credentialsTitle')}
          description={t('settings.ui.security.credentialsBody')}
          actions={
            <Button variant="secondary" size="sm" asChild>
              <Link href="/settings/agents">
                {t('settings.ui.security.viewInSection', {
                  section: t('settings.ui.section.agents'),
                })}
              </Link>
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
                      onClick={() => void revokeKey.run(key.id)}
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
          title={t('settings.ui.security.agentsTitle')}
          actions={
            <Button variant="secondary" size="sm" asChild>
              <Link href="/settings/agents">
                {t('settings.ui.security.viewInSection', {
                  section: t('settings.ui.section.agents'),
                })}
              </Link>
            </Button>
          }
        >
          <InlineFact
            label={t('common.results', { count: (agents.data ?? []).length })}
            value={formatters.list((agents.data ?? []).map((agent) => agent.name))}
          />
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
                      <span className="text-body-sm text-text-secondary">
                        {t('developer.consent.developerIdentity', {
                          developer: grant.developerName,
                        })}
                      </span>
                      <span className="text-body-sm text-text-tertiary">
                        {t('developer.grants.grantedOn', {
                          date: formatters.date(grant.grantedAt),
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
                      ? t('common.none')
                      : formatters.list([...connection.grantedCapabilities])}
                  </span>
                </li>
              ))}
            </ul>
          </AsyncBoundary>
        </SettingsPanel>

        <Notice
          tone="warning"
          title={t('settings.security.killSwitch')}
          description={t('settings.security.killSwitchBody')}
          actions={
            <Button variant="secondary" size="sm">
              {t('settings.security.killSwitch')}
            </Button>
          }
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
    </>
  );
}
