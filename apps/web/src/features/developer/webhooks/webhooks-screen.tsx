'use client';

import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge, Button, Code } from '@relay/design-system/primitives';
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
import { securityGateway, webhooksGateway } from '../../settings/lib/gateway.js';
import { useFormatters } from '../../settings/lib/formatters.js';
import { settingsKey, useWorkspaceId } from '../../settings/lib/keys.js';
import { useSettingsMutation } from '../../settings/lib/use-settings-mutation.js';
import type { OneTimeCredential, WebhookEndpointView } from '../../settings/lib/view-models.js';
import { CredentialPanel } from '../components/credential-panel.js';
import { DeliveryLog } from './delivery-log.js';
import { WebhookForm, type WebhookFormValue } from './webhook-form.js';


export function WebhooksScreen(): ReactNode {
  const t = useTranslations();
  const section = t('settings.ui.section.webhooks');
  const formatters = useFormatters();
  const workspaceId = useWorkspaceId();
  const WEBHOOKS_KEY = settingsKey(workspaceId, 'webhooks');
  const CONNECTIONS_KEY = settingsKey(workspaceId, 'security', 'connections');

  const endpoints = useQuery({ queryKey: WEBHOOKS_KEY, queryFn: () => webhooksGateway.list() });
  const connections = useQuery({
    queryKey: CONNECTIONS_KEY,
    queryFn: () => securityGateway.connections(),
  });

  const [creating, setCreating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [secret, setSecret] = useState<OneTimeCredential | null>(null);
  const [pendingRotate, setPendingRotate] = useState<WebhookEndpointView | null>(null);
  const [pendingDelete, setPendingDelete] = useState<WebhookEndpointView | null>(null);

  const rows = endpoints.data ?? [];
  const selected = rows.find((endpoint) => endpoint.id === selectedId) ?? rows[0] ?? null;

  const deliveries = useQuery({
    queryKey: settingsKey(workspaceId, 'webhooks', selected?.id ?? 'none', 'deliveries'),
    queryFn: () => webhooksGateway.deliveries(selected?.id ?? ''),
    enabled: selected !== null,
  });

  const create = useSettingsMutation({
    section,
    mutationFn: webhooksGateway.create,
    invalidate: [WEBHOOKS_KEY],
    onSuccess: (result) => {
      setSecret(result.secret);
      setSelectedId(result.endpoint.id);
      setCreating(false);
    },
  });

  const rotate = useSettingsMutation({
    section,
    mutationFn: webhooksGateway.rotateSecret,
    invalidate: [WEBHOOKS_KEY],
    onSuccess: (result) => {
      setSecret(result);
      setPendingRotate(null);
    },
  });

  const setEnabled = useSettingsMutation({
    section,
    mutationFn: (input: { endpointId: string; enabled: boolean }) =>
      webhooksGateway.update(input.endpointId, { enabled: input.enabled }),
    invalidate: [WEBHOOKS_KEY],
  });

  const testDelivery = useSettingsMutation({
    section,
    mutationFn: (input: { endpointId: string }) =>
      webhooksGateway.testDelivery(input.endpointId),
    invalidate: [WEBHOOKS_KEY],
    successMessage: t('developer.ui.webhooks.testDeliverySent'),
    onSuccess: () => void deliveries.refetch(),
  });

  const redeliver = useSettingsMutation({
    section,
    mutationFn: (input: { endpointId: string; deliveryId: string }) =>
      webhooksGateway.redeliver(input.endpointId, input.deliveryId),
    successMessage: t('developer.ui.webhooks.redelivered'),
    onSuccess: () => void deliveries.refetch(),
  });

  const remove = useSettingsMutation({
    section,
    mutationFn: webhooksGateway.remove,
    invalidate: [WEBHOOKS_KEY],
    onSuccess: () => {
      setPendingDelete(null);
      setSelectedId(null);
    },
  });

  function submitCreate(value: WebhookFormValue): void {
    void create.run(value);
  }

  return (
    <>
      <PageHeader
        title={section}
        description={t('developer.ui.webhooks.description')}
        actions={
          creating ? null : (
            <Button variant="primary" onClick={() => setCreating(true)}>
              {t('developer.ui.webhooks.create')}
            </Button>
          )
        }
      />

      <SettingsStack>
        {secret === null ? null : (
          <CredentialPanel
            credential={secret}
            kind="signing-secret"
            onAcknowledge={() => setSecret(null)}
          />
        )}

        {creating ? (
          <WebhookForm
            connections={connections.data ?? []}
            saving={create.isSaving}
            onCancel={() => setCreating(false)}
            onSubmit={submitCreate}
          />
        ) : (
          <AsyncBoundary
            section={section}
            isPending={endpoints.isPending}
            error={endpoints.error}
            onRetry={() => void endpoints.refetch()}
          >
            {rows.length === 0 ? (
              <EmptyState
                title={t('developer.ui.webhooks.emptyTitle')}
                description={t('developer.ui.webhooks.emptyBody')}
                example={t('developer.ui.webhooks.emptyExample')}
                action={
                  <Button variant="primary" onClick={() => setCreating(true)}>
                    {t('developer.ui.webhooks.create')}
                  </Button>
                }
              />
            ) : (
              <>
                <ul className="flex flex-col border-y border-border-default">
                  {rows.map((endpoint) => (
                    <li
                      key={endpoint.id}
                      className="flex flex-col gap-2 border-b border-border-subtle py-3 last:border-b-0 md:flex-row md:items-start md:justify-between"
                    >
                      <div className="flex min-w-0 flex-col gap-1">
                        <button
                          type="button"
                          className="w-fit text-start font-mono text-body-md text-text-accent underline-offset-2 hover:underline"
                          aria-current={endpoint.id === selected?.id ? 'true' : undefined}
                          onClick={() => setSelectedId(endpoint.id)}
                        >
                          {endpoint.url}
                        </button>
                        <span className="text-body-sm text-text-tertiary">
                          {endpoint.allEvents
                            ? t('developer.ui.webhooks.eventsAll')
                            : t('developer.ui.webhooks.eventsCount', {
                                count: endpoint.events.length,
                              })}
                        </span>
                      </div>
                      <Badge tone={endpoint.enabled ? 'success' : 'destructive'}>
                        {endpoint.enabled ? t('common.on') : t('common.off')}
                      </Badge>
                    </li>
                  ))}
                </ul>

                {selected === null ? null : (
                  <>
                    {!selected.enabled && selected.disabledReason === 'persistent_failure' ? (
                      <Notice
                        tone="destructive"
                        title={t('developer.ui.webhooks.disabledTitle')}
                        description={t('developer.ui.webhooks.disabledBody')}
                        actions={
                          <Button
                            size="sm"
                            variant="secondary"
                            loading={setEnabled.isSaving}
                            onClick={() =>
                              void setEnabled.run({ endpointId: selected.id, enabled: true })
                            }
                          >
                            {t('action.enable')}
                          </Button>
                        }
                      />
                    ) : null}

                    {selected.enabled && selected.consecutiveFailures > 0 ? (
                      <Notice
                        tone="warning"
                        title={t('developer.ui.webhooks.failureTitle')}
                        description={t('developer.ui.webhooks.failureBody', {
                          count: selected.consecutiveFailures,
                          limit: selected.failureLimit,
                        })}
                      />
                    ) : null}

                    <SettingsPanel
                      title={selected.url}
                      actions={
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            loading={testDelivery.isSaving}
                            onClick={() => void testDelivery.run({ endpointId: selected.id })}
                          >
                            {t('action.testDelivery')}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setPendingRotate(selected)}
                          >
                            {t('action.rotateSecret')}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            loading={setEnabled.isSaving}
                            onClick={() =>
                              void setEnabled.run({
                                endpointId: selected.id,
                                enabled: !selected.enabled,
                              })
                            }
                          >
                            {selected.enabled ? t('action.disable') : t('action.enable')}
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
                      footnote={t('developer.ui.webhooks.secretBody')}
                    >
                      <DefinitionList
                        items={[
                          {
                            id: 'events',
                            term: t('developer.ui.webhooks.eventsTitle'),
                            definition: selected.allEvents ? (
                              t('developer.ui.webhooks.eventsAll')
                            ) : (
                              <span className="flex flex-wrap gap-1">
                                {selected.events.map((event) => (
                                  <Code key={event}>{event}</Code>
                                ))}
                              </span>
                            ),
                          },
                          {
                            id: 'scope',
                            term: t('developer.ui.webhooks.scopeTitle'),
                            definition:
                              selected.connectionLabels.length === 0
                                ? t('developer.ui.webhooks.scopeAll')
                                : formatters.list([...selected.connectionLabels]),
                          },
                          {
                            id: 'secret',
                            term: t('developer.ui.webhooks.secretTitle'),
                            definition: `v${selected.signingSecretVersion}`,
                          },
                          {
                            id: 'success',
                            term: t('developer.ui.webhooks.lastSuccessLabel'),
                            definition:
                              selected.lastSuccessAt === null
                                ? t('developer.ui.webhooks.lastSuccessNever')
                                : formatters.relative(selected.lastSuccessAt),
                          },
                        ]}
                      />
                    </SettingsPanel>

                    <SettingsPanel
                      title={t('developer.ui.webhooks.deliveriesCaption')}
                      description={t('developer.ui.webhooks.testDeliveryHelp')}
                    >
                      <AsyncBoundary
                        section={t('developer.ui.webhooks.deliveriesCaption')}
                        isPending={deliveries.isPending}
                        error={deliveries.error}
                        onRetry={() => void deliveries.refetch()}
                        skeletonColumns={5}
                      >
                        <DeliveryLog
                          deliveries={deliveries.data ?? []}
                          redelivering={redeliver.isSaving}
                          onRedeliver={(deliveryId) =>
                            void redeliver.run({ endpointId: selected.id, deliveryId })
                          }
                        />
                      </AsyncBoundary>
                    </SettingsPanel>
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
        title={t('developer.ui.webhooks.secretRotateTitle')}
        description={t('developer.ui.webhooks.secretBody')}
        consequences={[
          {
            id: 'overlap',
            text: t('developer.ui.webhooks.secretRotateConsequence.overlap'),
          },
          { id: 'after', text: t('developer.ui.webhooks.secretRotateConsequence.after') },
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
        title={t('developer.ui.webhooks.deleteTitle')}
        description={pendingDelete?.url ?? ''}
        consequences={[
          { id: 'stop', text: t('developer.ui.webhooks.deleteConsequence.stop') },
          { id: 'logs', text: t('developer.ui.webhooks.deleteConsequence.logs') },
        ]}
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
