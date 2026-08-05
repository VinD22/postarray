'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Badge,
  Button,
  Code,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@relay/design-system/primitives';
import {
  ConfirmDialog,
  DefinitionList,
  EmptyState,
  Notice,
  PageHeader,
} from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { SettingsPanel, SettingsStack } from '../../settings/components/section.js';
import { AsyncBoundary } from '../../settings/lib/async-boundary.js';
import {
  agentsGateway,
  brandsGateway,
  securityGateway,
  workspaceGateway,
} from '../../settings/lib/gateway.js';
import { useFormatters } from '../../settings/lib/formatters.js';
import { settingsKey, useWorkspaceId } from '../../settings/lib/keys.js';
import { useSettingsMutation } from '../../settings/lib/use-settings-mutation.js';
import type { OneTimeCredential, ServiceAccountView } from '../../settings/lib/view-models.js';
import { CredentialPanel } from '../components/credential-panel.js';
import { SetupSnippets } from '../components/setup-snippets.js';
import { ActivityTable } from './activity-table.js';
import { DryRunPlayground } from './dry-run-playground.js';
import { ServiceAccountForm, type ServiceAccountFormValue } from './service-account-form.js';

export function AgentsScreen(): ReactNode {
  const t = useTranslations();
  const section = t('settings.ui.section.agents');
  const formatters = useFormatters();
  const workspaceId = useWorkspaceId();
  const AGENTS_KEY = settingsKey(workspaceId, 'agents');
  const BRANDS_KEY = settingsKey(workspaceId, 'brands');
  const CONNECTIONS_KEY = settingsKey(workspaceId, 'security', 'connections');

  const agents = useQuery({ queryKey: AGENTS_KEY, queryFn: () => agentsGateway.list() });
  const workspace = useQuery({
    queryKey: settingsKey(workspaceId, 'workspace'),
    queryFn: () => workspaceGateway.identity(),
  });
  const mcpEndpoint = workspace.data?.mcpEndpoint ?? '';
  const apiBaseUrl = workspace.data?.apiBaseUrl ?? '';
  const brands = useQuery({ queryKey: BRANDS_KEY, queryFn: () => brandsGateway.list() });
  const connections = useQuery({
    queryKey: CONNECTIONS_KEY,
    queryFn: () => securityGateway.connections(),
  });

  const [creating, setCreating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [credential, setCredential] = useState<OneTimeCredential | null>(null);
  const [pendingStop, setPendingStop] = useState<ServiceAccountView | null>(null);
  const [pendingRotate, setPendingRotate] = useState<ServiceAccountView | null>(null);

  const rows = agents.data ?? [];
  const selected = rows.find((agent) => agent.id === selectedId) ?? rows[0] ?? null;

  const activity = useQuery({
    queryKey: settingsKey(workspaceId, 'agents', selected?.id ?? 'none', 'activity'),
    queryFn: () => agentsGateway.activity(selected?.id ?? ''),
    enabled: selected !== null,
  });

  const contentLocales = useMemo(
    () => Array.from(new Set((brands.data ?? []).flatMap((brand) => brand.contentLocales))).sort(),
    [brands.data],
  );

  const create = useSettingsMutation({
    section,
    mutationFn: agentsGateway.create,
    invalidate: [AGENTS_KEY],
    onSuccess: (result) => {
      setCredential(result);
      setCreating(false);
    },
  });

  const rotate = useSettingsMutation({
    section,
    mutationFn: agentsGateway.rotate,
    invalidate: [AGENTS_KEY],
    onSuccess: (result) => {
      setCredential(result);
      setPendingRotate(null);
    },
  });

  const setEnabled = useSettingsMutation({
    section,
    mutationFn: (input: { id: string; enabled: boolean }) =>
      agentsGateway.setEnabled(input.id, input.enabled),
    invalidate: [AGENTS_KEY],
    onSuccess: () => setPendingStop(null),
  });

  function submitCreate(value: ServiceAccountFormValue): void {
    void create.run(value);
  }

  return (
    <>
      <PageHeader
        title={section}
        description={t('developer.subtitle')}
        actions={
          creating ? null : (
            <Button variant="primary" onClick={() => setCreating(true)}>
              {t('developer.serviceAccount.create')}
            </Button>
          )
        }
      />

      <SettingsStack>
        {credential === null ? null : (
          <CredentialPanel
            credential={credential}
            kind="service-account"
            onAcknowledge={() => setCredential(null)}
          />
        )}

        {creating ? (
          <ServiceAccountForm
            brands={(brands.data ?? []).map((brand) => ({ id: brand.id, name: brand.name }))}
            connections={connections.data ?? []}
            contentLocales={contentLocales}
            timeZone={formatters.timeZone}
            saving={create.isSaving}
            onCancel={() => setCreating(false)}
            onSubmit={submitCreate}
          />
        ) : (
          <AsyncBoundary
            section={section}
            isPending={agents.isPending}
            error={agents.error}
            onRetry={() => void agents.refetch()}
          >
            {rows.length === 0 ? (
              <EmptyState
                title={t('developer.ui.agents.emptyTitle')}
                description={t('developer.ui.agents.emptyBody')}
                example={t('developer.ui.agents.emptyExample')}
                action={
                  <Button variant="primary" onClick={() => setCreating(true)}>
                    {t('developer.serviceAccount.create')}
                  </Button>
                }
              />
            ) : (
              <>
                <ul className="border-border-default flex flex-col border-y">
                  {rows.map((agent) => (
                    <li
                      key={agent.id}
                      className="border-border-subtle flex flex-col gap-2 border-b py-3 last:border-b-0 md:flex-row md:items-start md:justify-between"
                    >
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            className="text-body-md text-text-accent font-medium underline-offset-2 hover:underline"
                            aria-current={agent.id === selected?.id ? 'true' : undefined}
                            onClick={() => setSelectedId(agent.id)}
                          >
                            {agent.name}
                          </button>
                          <Badge
                            tone={
                              agent.state === 'active'
                                ? 'success'
                                : agent.state === 'stopped'
                                  ? 'destructive'
                                  : 'warning'
                            }
                          >
                            {t(
                              agent.state === 'active'
                                ? 'developer.ui.agents.statusActive'
                                : agent.state === 'stopped'
                                  ? 'developer.ui.agents.statusStopped'
                                  : 'developer.ui.agents.statusExpired',
                            )}
                          </Badge>
                        </span>
                        <span className="text-body-sm text-text-secondary">{agent.purpose}</span>
                        <span className="text-body-sm text-text-tertiary">
                          {t('developer.credential.created', {
                            date: formatters.date(agent.createdAt),
                            name: agent.createdByName,
                          })}
                          {agent.lastUsedAt === null
                            ? ` ${t('developer.credential.neverUsed')}`
                            : ` ${t('developer.credential.lastUsed', {
                                relativeTime: formatters.relative(agent.lastUsedAt),
                              })}`}
                        </span>
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setPendingRotate(agent)}
                        >
                          {t('developer.ui.agents.rotate')}
                        </Button>
                        {agent.state === 'stopped' ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            loading={setEnabled.isSaving}
                            onClick={() => void setEnabled.run({ id: agent.id, enabled: true })}
                          >
                            {t('developer.ui.agents.resume')}
                          </Button>
                        ) : (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setPendingStop(agent)}
                          >
                            {t('developer.serviceAccount.killSwitch')}
                          </Button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                {selected === null ? null : (
                  <>
                    {selected.state === 'stopped' ? (
                      <Notice
                        tone="destructive"
                        title={t('developer.ui.agents.statusStopped')}
                        description={t('developer.ui.agents.stoppedBody')}
                      />
                    ) : null}

                    <SettingsPanel title={t('developer.ui.agents.detailTitle')}>
                      <DefinitionList
                        items={[
                          {
                            id: 'brands',
                            term: t('developer.serviceAccount.scopeBrands'),
                            definition:
                              selected.brandScope.length === 0
                                ? t('common.all')
                                : formatters.list(selected.brandScope.map((brand) => brand.name)),
                          },
                          {
                            id: 'accounts',
                            term: t('developer.serviceAccount.scopePlatforms'),
                            definition:
                              selected.connectionLabels.length === 0
                                ? t('common.none')
                                : formatters.list([...selected.connectionLabels]),
                          },
                          {
                            id: 'scopes',
                            term: t('developer.scope.title'),
                            definition: (
                              <span className="flex flex-wrap gap-1">
                                {selected.scopes.map((scope) => (
                                  <Code key={scope}>{scope}</Code>
                                ))}
                              </span>
                            ),
                          },
                          {
                            id: 'cadence',
                            term: t('developer.serviceAccount.scopeCadence'),
                            definition: t('developer.ui.agents.summaryMaxActions', {
                              count: selected.maxPostsPerDay,
                            }),
                          },
                          {
                            id: 'lookahead',
                            term: t('developer.serviceAccount.scopeLookAhead'),
                            definition: formatters.number(selected.lookAheadDays),
                          },
                          {
                            id: 'hours',
                            term: t('developer.ui.agents.quietHours'),
                            definition: `${selected.quietHoursStart} to ${selected.quietHoursEnd}`,
                            hint: selected.timeZone,
                          },
                          {
                            id: 'locales',
                            term: t('developer.serviceAccount.scopeLocales'),
                            definition:
                              selected.contentLocales.length === 0
                                ? t('common.all')
                                : formatters.list([...selected.contentLocales]),
                          },
                          {
                            id: 'domains',
                            term: t('developer.serviceAccount.scopeDomains'),
                            definition:
                              selected.allowedDomains.length === 0
                                ? t('common.none')
                                : formatters.list([...selected.allowedDomains]),
                          },
                          {
                            id: 'approval',
                            term: t('developer.serviceAccount.approvalLevel'),
                            definition: t(`developer.approvalLevel.${selected.approvalLevel}`),
                            hint: t(
                              `developer.approvalLevel.description.${selected.approvalLevel}`,
                            ),
                          },
                          {
                            id: 'expiry',
                            term: t('developer.ui.agents.expiry'),
                            definition:
                              selected.credentialExpiresAt === null
                                ? t('common.none')
                                : t('developer.credential.expires', {
                                    date: formatters.date(selected.credentialExpiresAt),
                                  }),
                          },
                        ]}
                      />
                    </SettingsPanel>

                    <Tabs defaultValue="activity">
                      <TabsList aria-label={t('developer.ui.agents.detailTitle')}>
                        <TabsTrigger value="activity">{t('developer.activity.title')}</TabsTrigger>
                        <TabsTrigger value="setup">{t('developer.setup.title')}</TabsTrigger>
                        <TabsTrigger value="playground">
                          {t('developer.playground.title')}
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="activity">
                        <AsyncBoundary
                          section={t('developer.activity.title')}
                          isPending={activity.isPending}
                          error={activity.error}
                          onRetry={() => void activity.refetch()}
                        >
                          <ActivityTable rows={activity.data ?? []} />
                        </AsyncBoundary>
                      </TabsContent>

                      <TabsContent value="setup">
                        <SetupSnippets
                          mcpEndpoint={mcpEndpoint}
                          apiBaseUrl={apiBaseUrl}
                          serviceAccountName={selected.name}
                        />
                      </TabsContent>

                      <TabsContent value="playground">
                        <DryRunPlayground account={selected} />
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
        open={pendingStop !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingStop(null);
          }
        }}
        tone="destructive"
        title={t('developer.ui.agents.killTitle', { name: pendingStop?.name ?? '' })}
        description={t('developer.ui.agents.stoppedBody')}
        consequences={[
          { id: 'calls', text: t('developer.ui.agents.killConsequence.calls') },
          { id: 'scheduled', text: t('developer.ui.agents.killConsequence.scheduled') },
          { id: 'reversible', text: t('developer.ui.agents.killConsequence.reversible') },
        ]}
        confirmLabel={t('developer.serviceAccount.killSwitch')}
        cancelLabel={t('action.cancel')}
        closeLabel={t('a11y.label.closeDialog')}
        onConfirm={() => {
          if (pendingStop !== null) {
            void setEnabled.run({ id: pendingStop.id, enabled: false });
          }
        }}
      />

      <ConfirmDialog
        open={pendingRotate !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingRotate(null);
          }
        }}
        title={t('developer.ui.agents.rotateTitle', { name: pendingRotate?.name ?? '' })}
        description={t('developer.credential.shownOnce')}
        consequences={[
          { id: 'old', text: t('developer.ui.agents.rotateConsequence.old') },
          { id: 'new', text: t('developer.ui.agents.rotateConsequence.new') },
          { id: 'clients', text: t('developer.ui.agents.rotateConsequence.clients') },
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
    </>
  );
}
