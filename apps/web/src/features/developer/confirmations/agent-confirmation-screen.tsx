'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { AgentConfirmationView } from '@relay/application';
import { Badge, Button, Input, Label } from '@relay/design-system/primitives';
import {
  DefinitionList,
  ErrorState,
  LoadingState,
  Notice,
  PageHeader,
  SkeletonText,
} from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { api, newIdempotencyKey } from '@/lib/api';
import { useOnlineStatus } from '@/lib/utils/use-online-status';
import { describeApiError } from '@/features/settings/lib/api-error';
import { useFormatters } from '@/features/settings/lib/formatters';

function stateTone(state: AgentConfirmationView['state']): 'warning' | 'success' | 'neutral' {
  if (state === 'pending') return 'warning';
  if (state === 'approved') return 'success';
  return 'neutral';
}

export function AgentConfirmationScreen({
  confirmationId,
}: {
  readonly confirmationId: string;
}): ReactNode {
  const t = useTranslations();
  const formatters = useFormatters();
  const online = useOnlineStatus();
  const queryClient = useQueryClient();
  const queryKey = ['agent-confirmation', confirmationId] as const;
  const query = useQuery({
    queryKey,
    queryFn: () => api.agentConfirmations.get(confirmationId),
    retry: false,
  });
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<unknown>(null);
  const [needsStepUp, setNeedsStepUp] = useState(false);
  const [password, setPassword] = useState('');
  const [approvalKey, setApprovalKey] = useState<string | null>(null);

  async function approve(key: string): Promise<void> {
    const approved = await api.agentConfirmations.approve(confirmationId, key);
    queryClient.setQueryData(queryKey, approved);
    setNeedsStepUp(false);
    setPassword('');
    setActionError(null);
  }

  async function beginApproval(): Promise<void> {
    const key = approvalKey ?? newIdempotencyKey('confirm');
    setApprovalKey(key);
    setBusy(true);
    setActionError(null);
    try {
      await approve(key);
    } catch (error) {
      if (describeApiError(error).code === 'AUTH_MFA_REQUIRED') {
        setNeedsStepUp(true);
      } else {
        setActionError(error);
      }
    } finally {
      setBusy(false);
    }
  }

  async function submitStepUp(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const key = approvalKey ?? newIdempotencyKey('confirm');
    setApprovalKey(key);
    setBusy(true);
    setActionError(null);
    try {
      await api.auth.stepUpWithPassword(password);
      await approve(key);
    } catch (error) {
      setActionError(error);
    } finally {
      setBusy(false);
    }
  }

  const confirmation = query.data;
  const describedError = actionError === null ? null : describeApiError(actionError);

  return (
    <>
      <PageHeader
        title={t('developer.confirmation.title')}
        description={t('developer.confirmation.subtitle')}
      />

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 md:px-6">
        {query.isPending ? (
          <LoadingState label={t('developer.confirmation.loading')}>
            <div className="border-border-bold bg-surface-raised shadow-hard rounded-lg border-2 p-6">
              <SkeletonText lines={6} />
            </div>
          </LoadingState>
        ) : null}

        {query.error !== null ? (
          <ErrorState
            title={t('developer.confirmation.errorTitle')}
            description={t('developer.confirmation.errorBody')}
            onRetry={() => void query.refetch()}
            retryLabel={t('action.retry')}
          />
        ) : null}

        {confirmation !== undefined ? (
          <section className="border-border-bold bg-surface-raised shadow-hard flex flex-col gap-6 rounded-lg border-2 p-5 md:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-1">
                <h2 className="text-title-md text-text-primary font-display font-bold">
                  {t('developer.confirmation.reviewTitle')}
                </h2>
                <p className="text-body-md text-text-secondary">
                  {t('developer.confirmation.reviewBody')}
                </p>
              </div>
              <Badge tone={stateTone(confirmation.state)}>
                {t(`developer.confirmation.state.${confirmation.state}`)}
              </Badge>
            </div>

            <DefinitionList
              items={[
                {
                  id: 'count',
                  term: t('developer.confirmation.publicationsLabel'),
                  definition: t('developer.confirmation.publicationsValue', {
                    count: confirmation.summary.externalPublicationCount,
                  }),
                },
                {
                  id: 'providers',
                  term: t('developer.confirmation.providersLabel'),
                  definition: formatters.list(
                    confirmation.summary.providers.map((provider) =>
                      t(`web.provider.${provider}`),
                    ),
                  ),
                },
                {
                  id: 'expires',
                  term: t('developer.confirmation.expiresLabel'),
                  definition: formatters.dateTime(confirmation.expiresAt),
                },
                {
                  id: 'version',
                  term: t('developer.confirmation.versionLabel'),
                  definition: confirmation.summary.versionChecksum.slice(0, 12),
                  hint: t('developer.confirmation.versionHint'),
                },
              ]}
            />

            <div className="flex flex-col gap-2">
              <h3 className="text-title-sm text-text-primary font-display font-bold">
                {t('developer.confirmation.accountsTitle')}
              </h3>
              <ul className="border-border-default flex flex-col border-y">
                {confirmation.summary.accounts.map((account, index) => (
                  <li
                    key={account.connectionId}
                    className="border-border-subtle text-body-md text-text-primary flex items-center justify-between gap-3 border-b py-3 last:border-b-0"
                  >
                    <span className="min-w-0 truncate font-medium">{account.label}</span>
                    <span className="text-label text-text-tertiary tabular-nums">
                      {t('developer.confirmation.accountPosition', {
                        position: index + 1,
                        count: confirmation.summary.accountCount,
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {confirmation.state === 'pending' ? (
              <Notice
                tone="warning"
                title={t('developer.confirmation.pendingTitle')}
                description={t('developer.confirmation.pendingBody')}
                actions={
                  needsStepUp ? null : (
                    <Button
                      variant="primary"
                      loading={busy}
                      disabled={!online}
                      onClick={() => void beginApproval()}
                    >
                      {t('developer.confirmation.approve')}
                    </Button>
                  )
                }
              />
            ) : null}

            {confirmation.state === 'approved' ? (
              <Notice
                tone="success"
                liveness="status"
                title={t('developer.confirmation.approvedTitle')}
                description={t('developer.confirmation.approvedBody')}
              />
            ) : null}

            {confirmation.state === 'consumed' ? (
              <Notice
                tone="neutral"
                title={t('developer.confirmation.consumedTitle')}
                description={t('developer.confirmation.consumedBody')}
              />
            ) : null}

            {confirmation.state === 'expired' ? (
              <Notice
                tone="destructive"
                title={t('developer.confirmation.expiredTitle')}
                description={t('developer.confirmation.expiredBody')}
              />
            ) : null}

            {needsStepUp && confirmation.state === 'pending' ? (
              <form
                className="border-border-default bg-surface-sunken flex flex-col gap-4 rounded-lg border p-4"
                onSubmit={(event) => void submitStepUp(event)}
              >
                <div className="flex flex-col gap-1">
                  <h3 className="text-title-sm text-text-primary font-display font-bold">
                    {t('developer.confirmation.stepUpTitle')}
                  </h3>
                  <p className="text-body-sm text-text-secondary">
                    {t('developer.confirmation.stepUpBody')}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="confirmation-password">
                    {t('developer.confirmation.passwordLabel')}
                  </Label>
                  <Input
                    id="confirmation-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    minLength={12}
                    value={password}
                    invalid={describedError?.code === 'AUTH_REQUIRED'}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button type="submit" variant="primary" loading={busy} disabled={!online}>
                    {t('developer.confirmation.verifyAndApprove')}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setNeedsStepUp(false);
                      setActionError(null);
                    }}
                  >
                    {t('action.cancel')}
                  </Button>
                </div>
              </form>
            ) : null}

            {describedError !== null ? (
              <ErrorState
                title={t('developer.confirmation.actionErrorTitle')}
                description={
                  describedError.messageKey === null
                    ? t('error.unknown.message')
                    : t(describedError.messageKey, describedError.values)
                }
                reference={
                  describedError.correlationId === null
                    ? undefined
                    : {
                        label: t('settings.ui.state.referenceLabel'),
                        value: describedError.correlationId,
                      }
                }
              />
            ) : null}
          </section>
        ) : null}
      </div>
    </>
  );
}
