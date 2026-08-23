'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { isScope, type Scope } from '@relay/contracts';
import { Badge, Button, Code, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Separator } from '@relay/design-system/primitives';
import { ErrorState, LoadingState, Notice, SkeletonText } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import { Check, ExternalLink, Minus } from 'lucide-react';

import { scopeDescriptionKey, scopeGroups, withheldScopes } from '../lib/scope-groups';
import { api, newIdempotencyKey } from '@/lib/api';
import type { OAuthConsentView } from '@/lib/api/resources/oauth';
import { useSearchParams } from 'next/navigation';

function requestedScopes(data: OAuthConsentView): readonly Scope[] {
  return data.scopes.flatMap((item) => (isScope(item.scope) ? [item.scope] : []));
}

async function consentVersionHash(
  data: OAuthConsentView,
  workspaceId: string,
  locale: string,
  t: (key: string, values?: Record<string, string | number | boolean>) => string,
): Promise<string> {
  const workspace = data.workspaces.find((item) => item.id === workspaceId);
  const scopes = requestedScopes(data);
  const groups = scopeGroups(scopes);
  const visibleCopy = [
    locale,
    data.client.clientId,
    data.client.name,
    data.client.homepageUrl,
    data.client.privacyPolicyUrl,
    data.client.termsUrl,
    data.client.firstParty ? '' : t('developer.consent.notFirstParty'),
    t('developer.consent.title', { app: data.client.name }),
    t('developer.consent.workspace'),
    workspace?.name ?? '',
    t('developer.consent.projects'),
    t('common.all'),
    ...groups.flatMap((group) => [
      t(group.titleKey),
      t(group.helpKey),
      ...group.scopes.map((scope) => `${scope}:${t(scopeDescriptionKey(scope))}`),
    ]),
    t('developer.consent.willNotBeAbleTo', { app: data.client.name }),
    ...withheldScopes(scopes).map((scope) => `${scope}:${t(scopeDescriptionKey(scope))}`),
    t('developer.consent.approvalStillApplies'),
    t('developer.consent.revokeAnyTime'),
    t(data.approvalLevelKey),
  ].join('\u001f');

  const digest = await globalThis.crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(visibleCopy),
  );
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function OAuthConsentScreen(): ReactNode {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const requestId = searchParams.get('request_id');
  const query = useQuery({
    queryKey: ['oauth-consent', requestId],
    queryFn: () => api.oauth.getConsent(requestId ?? ''),
    enabled: requestId !== null && requestId.length > 0,
    retry: false,
  });
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [decisionError, setDecisionError] = useState<unknown>(null);
  const mutation = useMutation({
    mutationFn: async (decision: 'approve' | 'deny') => {
      const data = query.data;
      const selectedWorkspaceId = workspaceId ?? data?.workspaces[0]?.id ?? null;
      if (data === undefined || requestId === null || selectedWorkspaceId === null) {
        throw new Error('CONSENT_WORKSPACE_REQUIRED');
      }
      const scopes = requestedScopes(data);
      return api.oauth.submitConsent(
        {
          requestId,
          consentNonce: data.consentNonce,
          decision,
          workspaceId: selectedWorkspaceId,
          projectIds: [],
          connectionIds: [],
          grantedScopes: decision === 'approve' ? scopes : [],
          consentVersionHash: await consentVersionHash(data, selectedWorkspaceId, t.locale, t),
        },
        newIdempotencyKey('oauth_consent'),
      );
    },
    onSuccess: (result) => {
      window.location.assign(result.redirectTo);
    },
    onError: setDecisionError,
  });

  const data = query.data;
  const selectedWorkspaceId = workspaceId ?? data?.workspaces[0]?.id ?? '';
  const scopes = useMemo(() => (data === undefined ? [] : requestedScopes(data)), [data]);
  const groups = useMemo(() => scopeGroups(scopes), [scopes]);
  const withheld = useMemo(() => withheldScopes(scopes), [scopes]);
  const approvalLevel =
    data?.approvalLevelKey.startsWith('developer.consent.approval_level.') === true
      ? t(data.approvalLevelKey)
      : t('developer.consent.approvalStillApplies');

  if (requestId === null || requestId.length === 0) {
    return (
      <ConsentFrame>
        <Notice
          tone="warning"
          title={t('developer.consent.errorTitle')}
          description={t('developer.consent.missingRequest')}
        />
      </ConsentFrame>
    );
  }

  if (query.isPending) {
    return (
      <ConsentFrame>
        <LoadingState label={t('developer.consent.loading')}>
          <div className="border-border-default bg-surface-raised rounded-lg border p-6">
            <SkeletonText lines={8} />
          </div>
        </LoadingState>
      </ConsentFrame>
    );
  }

  if (query.error !== null || data === undefined) {
    return (
      <ConsentFrame>
        <ErrorState
          title={t('developer.consent.errorTitle')}
          description={t('developer.consent.errorBody')}
          onRetry={() => void query.refetch()}
          retryLabel={t('action.retry')}
        />
      </ConsentFrame>
    );
  }

  const noWorkspace = data.workspaces.length === 0;
  const busy = mutation.isPending;

  return (
    <ConsentFrame>
      <article className="border-border-default bg-surface-raised flex flex-col gap-6 rounded-xl border p-5 sm:p-8">
        <div className="flex flex-col gap-2">
          <Badge tone="info">{t('developer.apps.consentPreviewSample')}</Badge>
          <h1 className="text-title-lg text-text-primary">{t('developer.consent.title', { app: data.client.name })}</h1>
          <p className="text-body-sm text-text-secondary">
            {t('developer.consent.developerIdentity', { developer: data.client.name })}
          </p>
          {!data.client.firstParty ? (
            <p className="text-body-sm text-warning-fg">{t('developer.consent.notFirstParty')}</p>
          ) : null}
          <div className="text-body-sm text-text-tertiary flex flex-wrap gap-x-4 gap-y-1">
            <a className="inline-flex items-center gap-1 underline underline-offset-2" href={data.client.homepageUrl} target="_blank" rel="noreferrer noopener">
              {t('developer.apps.homepage')} <ExternalLink aria-hidden="true" className="size-3" />
            </a>
            <a className="inline-flex items-center gap-1 underline underline-offset-2" href={data.client.privacyPolicyUrl} target="_blank" rel="noreferrer noopener">
              {t('developer.apps.privacyUrl')} <ExternalLink aria-hidden="true" className="size-3" />
            </a>
            <a className="inline-flex items-center gap-1 underline underline-offset-2" href={data.client.termsUrl} target="_blank" rel="noreferrer noopener">
              {t('developer.apps.termsUrl')} <ExternalLink aria-hidden="true" className="size-3" />
            </a>
          </div>
        </div>

        <Separator />

        <section className="flex flex-col gap-3" aria-labelledby="consent-workspace-heading">
          <div>
            <h2 id="consent-workspace-heading" className="text-body-md text-text-primary font-medium">
              {t('developer.consent.selectWorkspace')}
            </h2>
            <p className="text-body-sm text-text-secondary">{t('developer.consent.workspaceHelp')}</p>
          </div>
          {noWorkspace ? (
            <Notice tone="warning" title={t('error.workspace_not_found.message')} description={t('error.workspace_not_found.action')} />
          ) : (
            <div className="flex max-w-xl flex-col gap-2">
              <Label htmlFor="oauth-consent-workspace">{t('developer.consent.workspace')}</Label>
              <Select value={selectedWorkspaceId} onValueChange={setWorkspaceId}>
                <SelectTrigger id="oauth-consent-workspace" aria-label={t('developer.consent.workspace')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {data.workspaces.map((workspace) => (
                    <SelectItem key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </section>

        <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-[minmax(8rem,12rem)_1fr]">
          <dt className="text-label text-text-tertiary">{t('developer.consent.projects')}</dt>
          <dd className="text-body-md text-text-primary">{t('common.all')}</dd>
          <dt className="text-label text-text-tertiary">{t('developer.consent.clientId')}</dt>
          <dd className="text-body-md text-text-primary"><Code>{data.client.clientId}</Code></dd>
        </dl>

        <Separator />

        <section className="flex flex-col gap-4">
          <h2 className="text-body-md text-text-primary font-medium">{t('developer.consent.willBeAbleTo', { app: data.client.name })}</h2>
          {groups.length === 0 ? <p className="text-body-md text-text-secondary">{t('common.none')}</p> : null}
          {groups.map((group) => (
            <div key={group.risk} className="flex flex-col gap-1">
              <p className="text-label text-text-tertiary">{t(group.titleKey)}</p>
              <ul className="flex flex-col gap-1">
                {group.scopes.map((scope) => (
                  <li key={scope} className="text-body-md flex items-start gap-2">
                    <Check aria-hidden="true" className="text-success-fg mt-0.5 size-4 shrink-0" />
                    <span className="flex min-w-0 flex-col">
                      <span className="text-text-primary">{t(scopeDescriptionKey(scope))}</span>
                      <Code className="w-fit">{scope}</Code>
                    </span>
                  </li>
                ))}
              </ul>
              {group.risk === 'consequential' ? <p className="text-body-sm text-warning-fg">{t(group.helpKey)}</p> : null}
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-1">
          <h2 className="text-body-md text-text-primary font-medium">{t('developer.consent.willNotBeAbleTo', { app: data.client.name })}</h2>
          <ul className="flex flex-col gap-1">
            {withheld.map((scope) => (
              <li key={scope} className="text-body-md text-text-secondary flex items-start gap-2">
                <Minus aria-hidden="true" className="text-text-tertiary mt-0.5 size-4 shrink-0" />
                <span>{t(scopeDescriptionKey(scope))}</span>
              </li>
            ))}
          </ul>
        </section>

        <Notice
          tone="neutral"
          title={t('developer.consent.approvalStillApplies')}
          description={t('developer.consent.approvalLevel', { level: approvalLevel })}
        />
        <p className="text-body-sm text-text-secondary">{t('developer.consent.revokeAnyTime')}</p>
        {decisionError !== null ? <Notice tone="destructive" title={t('developer.consent.errorTitle')} description={t('error.internal.action')} /> : null}

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            disabled={busy || noWorkspace}
            loading={busy}
            loadingLabel={t('developer.consent.submitting')}
            onClick={() => {
              setDecisionError(null);
              mutation.mutate('approve');
            }}
          >
            {t('developer.consent.allow')}
          </Button>
          <Button
            variant="ghost"
            disabled={busy || noWorkspace}
            onClick={() => {
              setDecisionError(null);
              mutation.mutate('deny');
            }}
          >
            {t('developer.consent.deny')}
          </Button>
        </div>
      </article>
    </ConsentFrame>
  );
}

function ConsentFrame({ children }: { readonly children: ReactNode }): ReactNode {
  return (
    <main className="bg-surface-canvas flex min-h-screen items-start justify-center px-4 py-8 sm:px-6 sm:py-16">
      <div className="w-full max-w-3xl">{children}</div>
    </main>
  );
}
