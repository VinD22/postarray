'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState, type ReactNode } from 'react';

import { Button, Notice } from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';

import { api, keys, newIdempotencyKey } from '@/lib/api';
import { useWorkspaceId } from '@/lib/auth/session-context';

import { parseOAuthCallbackResult } from './oauth-callback-result';
import { useProviderName } from './provider';

export function OAuthAccountSelectionPanel(): ReactNode {
  const searchParams = useSearchParams();
  const result = parseOAuthCallbackResult(searchParams);
  const t = useTranslations();
  const providerName = useProviderName();
  const workspaceId = useWorkspaceId();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<readonly string[]>([]);

  const transactionId = result?.status === 'select' ? result.transactionId : undefined;

  const pending = useQuery({
    queryKey: [...keys.workspace(workspaceId), 'oauth-pending', transactionId ?? 'none'],
    enabled: transactionId !== undefined,
    queryFn: () => api.connections.getOAuthAccountSelection(transactionId as string),
  });

  const claim = useMutation({
    mutationFn: () =>
      api.connections.claimOAuth(
        { transactionId: transactionId as string, selectedExternalAccountIds: selected },
        newIdempotencyKey('oauth_claim'),
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ws', workspaceId, 'connections'] });
    },
  });

  const eligibleIds = useMemo(
    () =>
      (pending.data?.accounts ?? [])
        .filter((account) => account.eligible)
        .map((account) => account.externalAccountId),
    [pending.data?.accounts],
  );

  if (transactionId === undefined) return null;

  const provider = providerName(pending.data?.provider ?? result?.provider ?? 'bluesky');

  if (pending.isLoading) {
    return (
      <Notice tone="info" liveness="status" title={t('connection.oauth.returned', { provider })} />
    );
  }

  if (pending.isError || pending.data === undefined) {
    return (
      <Notice
        tone="destructive"
        liveness="alert"
        title={t('error.internal.message')}
        description={t('error.internal.action')}
      />
    );
  }

  return (
    <div className="grid gap-4">
      <Notice tone="info" liveness="status" title={t('connection.oauth.chooseAccounts')} />
      <div className="grid gap-2" role="group" aria-label={t('connection.oauth.chooseAccounts')}>
        {pending.data.accounts.map((account) => {
          const checked = selected.includes(account.externalAccountId);
          const disabled = !account.eligible;
          return (
            <label key={account.externalAccountId} className="flex items-start gap-2">
              <input
                type="checkbox"
                disabled={disabled}
                checked={checked}
                onChange={() => {
                  setSelected((current) =>
                    checked
                      ? current.filter((id) => id !== account.externalAccountId)
                      : [...current, account.externalAccountId],
                  );
                }}
              />
              <span>
                {account.displayName}
                {account.handle === null ? null : ` (@${account.handle})`}
                {disabled ? `: ${t('connection.oauth.accountUnavailable')}` : null}
              </span>
            </label>
          );
        })}
      </div>
      {eligibleIds.length === 0 ? (
        <Notice
          tone="warning"
          liveness="alert"
          title={t('connection.oauth.noEligibleAccounts', { provider, reason: '' })}
        />
      ) : (
        <Button
          type="button"
          variant="primary"
          disabled={selected.length === 0 || claim.isPending}
          onClick={() => {
            void claim.mutate();
          }}
        >
          {t('connection.oauth.connectSelected')}
        </Button>
      )}
      {claim.isSuccess ? (
        <Notice tone="success" liveness="status" title={t('connection.oauth.claimComplete')} />
      ) : null}
    </div>
  );
}
