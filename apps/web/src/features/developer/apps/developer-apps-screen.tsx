'use client';

import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@relay/design-system/primitives';
import {
  CapabilityBadge,
  ConfirmDialog,
  DefinitionList,
  EmptyState,
  Notice,
  PageHeader,
  RateLimitNotice,
} from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { SettingsPanel, SettingsStack } from '../../settings/components/section.js';
import { AsyncBoundary } from '../../settings/lib/async-boundary.js';
import { oauthAppsGateway, workspaceGateway } from '../../settings/lib/gateway.js';
import { useFormatters } from '../../settings/lib/formatters.js';
import { settingsKey, useWorkspaceId } from '../../settings/lib/keys.js';
import { useSettingsMutation } from '../../settings/lib/use-settings-mutation.js';
import type { OAuthAppView, OneTimeCredential } from '../../settings/lib/view-models.js';
import { CredentialPanel } from '../components/credential-panel.js';
import { AppForm, type AppFormValue } from './app-form.js';
import { ConsentPreview } from './consent-preview.js';

export function DeveloperAppsScreen(): ReactNode {
  const t = useTranslations();
  const section = t('settings.ui.section.apps');
  const formatters = useFormatters();
  const workspaceId = useWorkspaceId();
  const APPS_KEY = settingsKey(workspaceId, 'developer-apps');

  const apps = useQuery({ queryKey: APPS_KEY, queryFn: () => oauthAppsGateway.list() });
  const workspace = useQuery({
    queryKey: settingsKey(workspaceId, 'workspace'),
    queryFn: () => workspaceGateway.identity(),
  });
  const workspaceName = workspace.data?.name ?? '';
  const developerName = workspace.data?.developerName ?? '';

  const [creating, setCreating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [secret, setSecret] = useState<OneTimeCredential | null>(null);
  const [pendingRotate, setPendingRotate] = useState<OAuthAppView | null>(null);
  const [pendingDelete, setPendingDelete] = useState<OAuthAppView | null>(null);

  const rows = apps.data ?? [];
  const selected = rows.find((app) => app.id === selectedId) ?? rows[0] ?? null;

  const grants = useQuery({
    queryKey: settingsKey(workspaceId, 'developer-apps', selected?.id ?? 'none', 'grants'),
    queryFn: () => oauthAppsGateway.grants(selected?.id ?? ''),
    enabled: selected !== null,
  });

  const logs = useQuery({
    queryKey: settingsKey(workspaceId, 'developer-apps', selected?.id ?? 'none', 'logs'),
    queryFn: () => oauthAppsGateway.requestLogs(selected?.id ?? ''),
    enabled: selected !== null,
  });

  const create = useSettingsMutation({
    section,
    mutationFn: oauthAppsGateway.create,
    invalidate: [APPS_KEY],
    onSuccess: (result) => {
      setSecret(result.secret);
      setSelectedId(result.app.id);
      setCreating(false);
    },
  });

  const rotate = useSettingsMutation({
    section,
    mutationFn: oauthAppsGateway.rotateSecret,
    invalidate: [APPS_KEY],
    onSuccess: (result) => {
      setSecret(result);
      setPendingRotate(null);
    },
  });

  const setStatus = useSettingsMutation({
    section,
    mutationFn: (input: { appId: string; status: OAuthAppView['status'] }) =>
      oauthAppsGateway.update(input.appId, { status: input.status }),
    invalidate: [APPS_KEY],
  });

  const remove = useSettingsMutation({
    section,
    mutationFn: oauthAppsGateway.remove,
    invalidate: [APPS_KEY],
    onSuccess: () => {
      setPendingDelete(null);
      setSelectedId(null);
    },
  });

  function submitCreate(value: AppFormValue): void {
    void create.run(value);
  }

  return (
    <>
      <PageHeader
        title={section}
        description={t('developer.apps.subtitle')}
        actions={
          creating ? null : (
            <Button variant="primary" onClick={() => setCreating(true)}>
              {t('developer.apps.create')}
            </Button>
          )
        }
      />

      <SettingsStack>
        {secret === null ? null : (
          <CredentialPanel
            credential={secret}
            kind="client-secret"
            onAcknowledge={() => setSecret(null)}
          />
        )}

        {creating ? (
          <AppForm
            developerName={developerName}
            workspaceName={workspaceName}
            saving={create.isSaving}
            onCancel={() => setCreating(false)}
            onSubmit={submitCreate}
          />
        ) : (
          <AsyncBoundary
            section={section}
            isPending={apps.isPending}
            error={apps.error}
            onRetry={() => void apps.refetch()}
          >
            {rows.length === 0 ? (
              <EmptyState
                title={t('developer.ui.apps.emptyTitle')}
                description={t('developer.ui.apps.emptyBody')}
                example={t('developer.ui.apps.emptyExample')}
                action={
                  <Button variant="primary" onClick={() => setCreating(true)}>
                    {t('developer.apps.create')}
                  </Button>
                }
              />
            ) : (
              <>
                <ul className="border-border-default flex flex-col border-y">
                  {rows.map((app) => (
                    <li
                      key={app.id}
                      className="border-border-subtle flex flex-col gap-2 border-b py-3 last:border-b-0 md:flex-row md:items-start md:justify-between"
                    >
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            className="text-body-md text-text-accent font-medium underline-offset-2 hover:underline"
                            aria-current={app.id === selected?.id ? 'true' : undefined}
                            onClick={() => setSelectedId(app.id)}
                          >
                            {app.name}
                          </button>
                          <Badge
                            tone={
                              app.status === 'active'
                                ? 'success'
                                : app.status === 'disabled'
                                  ? 'destructive'
                                  : 'neutral'
                            }
                          >
                            {t(`developer.apps.status.${app.status}`)}
                          </Badge>
                          <Badge tone="outline">{t(`developer.apps.type.${app.clientType}`)}</Badge>
                        </span>
                        <span className="text-body-sm text-text-tertiary">
                          {t('developer.apps.grants.count', { count: app.grantCount })}
                        </span>
                      </div>
                      <Code>{app.clientId}</Code>
                    </li>
                  ))}
                </ul>

                {selected === null ? null : (
                  <>
                    {selected.status === 'disabled' ? (
                      <Notice
                        tone="warning"
                        title={t('developer.apps.status.disabled')}
                        description={t('developer.ui.apps.disabledBody')}
                      />
                    ) : null}

                    {selected.unreachableUrls.length > 0 && selected.linksCheckedAt !== null ? (
                      <Notice
                        tone="warning"
                        title={t('developer.ui.apps.linkUnreachable', {
                          date: formatters.date(selected.linksCheckedAt),
                        })}
                        description={formatters.list([...selected.unreachableUrls])}
                      />
                    ) : null}

                    <SettingsPanel
                      title={selected.name}
                      actions={
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={selected.clientType === 'public'}
                            onClick={() => setPendingRotate(selected)}
                          >
                            {t('action.rotateSecret')}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            loading={setStatus.isSaving}
                            onClick={() =>
                              void setStatus.run({
                                appId: selected.id,
                                status: selected.status === 'disabled' ? 'active' : 'disabled',
                              })
                            }
                          >
                            {selected.status === 'disabled'
                              ? t('developer.ui.apps.enable')
                              : t('developer.ui.apps.disable')}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setPendingDelete(selected)}
                          >
                            {t('action.delete')}
                          </Button>
                        </>
                      }
                    >
                      <DefinitionList
                        items={[
                          {
                            id: 'client-id',
                            term: t('developer.apps.clientId'),
                            definition: <Code>{selected.clientId}</Code>,
                          },
                          {
                            id: 'secret',
                            term: t('developer.apps.clientSecret'),
                            definition:
                              selected.clientType === 'public'
                                ? t('developer.ui.apps.secretPublicClient')
                                : t('developer.apps.secretShownOnce'),
                          },
                          {
                            id: 'redirects',
                            term: t('developer.apps.redirectUris'),
                            definition: (
                              <span className="flex flex-col gap-1">
                                {selected.redirectUris.map((uri) => (
                                  <Code key={uri}>{uri}</Code>
                                ))}
                              </span>
                            ),
                            hint: t('developer.apps.redirectUrisHelp'),
                          },
                          {
                            id: 'links',
                            term: t('developer.ui.apps.linksTitle'),
                            definition: (
                              <span className="flex flex-wrap gap-2">
                                <CapabilityBadge
                                  state={
                                    selected.unreachableUrls.length === 0
                                      ? 'supported'
                                      : 'requires_review'
                                  }
                                  label={
                                    selected.linksCheckedAt === null
                                      ? t('common.unknown')
                                      : t('developer.ui.apps.linkReachable', {
                                          date: formatters.date(selected.linksCheckedAt),
                                        })
                                  }
                                />
                              </span>
                            ),
                          },
                          {
                            id: 'scopes',
                            term: t('developer.ui.apps.scopesTitle'),
                            definition: (
                              <span className="flex flex-wrap gap-1">
                                {selected.scopes.map((scope) => (
                                  <Code key={scope}>{scope}</Code>
                                ))}
                              </span>
                            ),
                          },
                          {
                            id: 'sandbox',
                            term: t('developer.ui.apps.sandboxTitle'),
                            definition: <Code>{selected.sandboxClientId}</Code>,
                            hint: t('developer.ui.apps.sandboxBody'),
                          },
                        ]}
                      />
                    </SettingsPanel>

                    {selected.rateLimitUsed / Math.max(selected.rateLimitPerHour, 1) >= 0.8 ? (
                      <RateLimitNotice
                        title={t('developer.ui.apps.rateLimitLabel')}
                        cause={t('developer.docs.rateLimits')}
                        resetLabel={t('settings.ui.state.rateLimitReset')}
                        resetAt={t('common.now')}
                        usage={{
                          used: selected.rateLimitUsed,
                          limit: selected.rateLimitPerHour,
                          label: t('developer.ui.apps.rateLimitLabel'),
                          text: t('developer.ui.apps.rateLimitUsage', {
                            used: formatters.number(selected.rateLimitUsed),
                            limit: formatters.number(selected.rateLimitPerHour),
                          }),
                        }}
                        alternative={t('developer.docs.pagination')}
                      />
                    ) : (
                      <p className="text-body-sm text-text-tertiary">
                        {t('developer.ui.apps.rateLimitUsage', {
                          used: formatters.number(selected.rateLimitUsed),
                          limit: formatters.number(selected.rateLimitPerHour),
                        })}
                      </p>
                    )}

                    <Tabs defaultValue="consent">
                      <TabsList aria-label={selected.name}>
                        <TabsTrigger value="consent">
                          {t('developer.apps.consentPreview')}
                        </TabsTrigger>
                        <TabsTrigger value="grants">{t('developer.apps.grants.title')}</TabsTrigger>
                        <TabsTrigger value="logs">{t('developer.activity.title')}</TabsTrigger>
                      </TabsList>

                      <TabsContent value="consent">
                        <ConsentPreview
                          appName={selected.name}
                          developerName={selected.developerName}
                          workspaceName={workspaceName}
                          brandNames={[]}
                          scopes={selected.scopes}
                          homepageUrl={selected.homepageUrl}
                          privacyUrl={selected.privacyUrl}
                          termsUrl={selected.termsUrl}
                        />
                      </TabsContent>

                      <TabsContent value="grants">
                        <AsyncBoundary
                          section={t('developer.apps.grants.title')}
                          isPending={grants.isPending}
                          error={grants.error}
                          onRetry={() => void grants.refetch()}
                        >
                          {(grants.data ?? []).length === 0 ? (
                            <p className="text-body-md text-text-secondary">
                              {t('developer.ui.apps.grantsEmpty')}
                            </p>
                          ) : (
                            <TableContainer>
                              <Table>
                                <TableCaption className="sr-only">
                                  {t('developer.ui.apps.grantsCaption')}
                                </TableCaption>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead scope="col">
                                      {t('developer.ui.apps.grantColumn.workspace')}
                                    </TableHead>
                                    <TableHead scope="col">
                                      {t('developer.ui.apps.grantColumn.scopes')}
                                    </TableHead>
                                    <TableHead scope="col">
                                      {t('developer.ui.apps.grantColumn.granted')}
                                    </TableHead>
                                    <TableHead scope="col">
                                      {t('developer.ui.apps.grantColumn.lastUsed')}
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {(grants.data ?? []).map((grant) => (
                                    <TableRow key={grant.id}>
                                      <TableRowHeader>{grant.workspaceName}</TableRowHeader>
                                      <TableCell>
                                        <span className="flex flex-wrap gap-1">
                                          {grant.scopes.map((scope) => (
                                            <Code key={scope}>{scope}</Code>
                                          ))}
                                        </span>
                                      </TableCell>
                                      <TableCell>{formatters.date(grant.grantedAt)}</TableCell>
                                      <TableCell>
                                        {grant.lastUsedAt === null
                                          ? t('developer.credential.neverUsed')
                                          : formatters.relative(grant.lastUsedAt)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          )}
                        </AsyncBoundary>
                      </TabsContent>

                      <TabsContent value="logs">
                        <AsyncBoundary
                          section={t('developer.activity.title')}
                          isPending={logs.isPending}
                          error={logs.error}
                          onRetry={() => void logs.refetch()}
                        >
                          {(logs.data ?? []).length === 0 ? (
                            <p className="text-body-md text-text-secondary">
                              {t('developer.activity.empty')}
                            </p>
                          ) : (
                            <div className="flex flex-col gap-2">
                              <TableContainer className="max-h-96">
                                <Table>
                                  <TableCaption className="sr-only">
                                    {t('developer.ui.apps.logsCaption')}
                                  </TableCaption>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead scope="col">
                                        {t('developer.ui.apps.logColumn.time')}
                                      </TableHead>
                                      <TableHead scope="col">
                                        {t('developer.ui.apps.logColumn.route')}
                                      </TableHead>
                                      <TableHead scope="col" numeric>
                                        {t('developer.ui.apps.logColumn.status')}
                                      </TableHead>
                                      <TableHead scope="col">
                                        {t('developer.ui.apps.logColumn.workspace')}
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {(logs.data ?? []).map((log) => (
                                      <TableRow key={log.id}>
                                        <TableRowHeader className="whitespace-nowrap tabular-nums">
                                          {formatters.dateTime(log.occurredAt)}
                                        </TableRowHeader>
                                        <TableCell className="font-mono">{log.route}</TableCell>
                                        <TableCell numeric>{log.status}</TableCell>
                                        <TableCell>{log.workspaceName}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                              <p className="text-body-sm text-text-tertiary">
                                {t('developer.ui.apps.logsRedacted')}
                              </p>
                            </div>
                          )}
                        </AsyncBoundary>
                      </TabsContent>
                    </Tabs>
                  </>
                )}
              </>
            )}
          </AsyncBoundary>
        )}
      </SettingsStack>

      <ConfirmDialog
        open={pendingRotate !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingRotate(null);
          }
        }}
        title={t('developer.ui.apps.rotateTitle', { app: pendingRotate?.name ?? '' })}
        description={t('developer.apps.secretShownOnce')}
        consequences={[
          { id: 'old', text: t('developer.ui.apps.rotateConsequence.old') },
          { id: 'grants', text: t('developer.ui.apps.rotateConsequence.grants') },
          { id: 'deploy', text: t('developer.ui.apps.rotateConsequence.deploy') },
        ]}
        confirmLabel={t('action.rotateSecret')}
        cancelLabel={t('action.cancel')}
        closeLabel={t('a11y.label.closeDialog')}
        onConfirm={() => {
          if (pendingRotate !== null) {
            void rotate.run(pendingRotate.id);
          }
        }}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDelete(null);
          }
        }}
        tone="destructive"
        title={t('developer.ui.apps.deleteTitle', { app: pendingDelete?.name ?? '' })}
        description={t('developer.apps.deleteConfirm')}
        consequences={[
          { id: 'grants', text: t('developer.ui.apps.deleteConsequence.grants') },
          { id: 'logs', text: t('developer.ui.apps.deleteConsequence.logs') },
          { id: 'irreversible', text: t('developer.ui.apps.deleteConsequence.irreversible') },
        ]}
        confirmationPhrase={pendingDelete?.name}
        confirmationLabel={t('settings.ui.data.deleteConfirmPhraseLabel')}
        confirmLabel={t('action.deletePermanently')}
        cancelLabel={t('action.cancel')}
        closeLabel={t('a11y.label.closeDialog')}
        onConfirm={() => {
          if (pendingDelete !== null) {
            void remove.run(pendingDelete.id);
          }
        }}
      />
    </>
  );
}
