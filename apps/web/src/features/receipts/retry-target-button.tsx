'use client';

/**
 * Retry one account on a partially published post.
 *
 * The mutation behind this was written, tested and connected to nothing, while
 * the screen showed a fixed sentence saying retry was unavailable. It is
 * available, for exactly one account at a time, and this is the control that
 * offers it.
 *
 * Everything here is scoped to a single variant. The confirmation says so in
 * its own words, because the fear a person brings to this button is that it
 * republishes the whole campaign and gives the accounts that already worked a
 * second copy. It does not, and being told that is what makes the button
 * pressable.
 */

import { useState, type ReactNode } from 'react';
import { Button, ConfirmDialog, Notice } from '@relay/design-system';
import { useAnnouncer } from '@relay/design-system/hooks';
import { useTranslations } from '@relay/i18n/react';

import { useProviderName } from '@/features/connections/provider';

import { decideRetry, retryBlockKey } from './retry-target';
import type { CampaignTargetView } from './types';
import { useRetryTarget } from './use-receipt';

export interface RetryTargetButtonProps {
  readonly target: CampaignTargetView;
  /** The campaign's publish job, read from a receipt. Null when none exists. */
  readonly publishJobId: string | null;
}

export function RetryTargetButton({ target, publishJobId }: RetryTargetButtonProps): ReactNode {
  const t = useTranslations();
  const { announce } = useAnnouncer();
  const providerName = useProviderName();
  const retry = useRetryTarget();
  const [confirming, setConfirming] = useState(false);

  const decision = decideRetry(target, publishJobId);

  if (decision.kind === 'blocked') {
    return <p className="text-body-sm text-text-tertiary">{t(retryBlockKey(decision.reason))}</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setConfirming(true);
          }}
        >
          {t('web.receipt.retry.action')}
        </Button>
      </div>

      {retry.error === null ? null : (
        <Notice
          liveness="alert"
          tone="destructive"
          title={t('web.receipt.retry.failedTitle')}
          description={t('web.receipt.retry.failedBody')}
        />
      )}

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={t('web.receipt.retry.confirmTitle', { account: target.accountLabel })}
        description={t('web.receipt.retry.confirmBody')}
        consequences={[
          {
            id: 'publishes',
            text: t('web.receipt.retry.consequence.publishes', {
              account: target.accountLabel,
              provider: providerName(target.provider),
            }),
          },
          { id: 'unaffected', text: t('web.receipt.retry.consequence.unaffected') },
          { id: 'once', text: t('web.receipt.retry.consequence.once') },
        ]}
        confirmLabel={t('web.receipt.retry.confirm')}
        cancelLabel={t('web.receipt.retry.cancel')}
        closeLabel={t('a11y.label.closeDialog')}
        onConfirm={async () => {
          await retry
            .mutateAsync({
              publishJobId: decision.publishJobId,
              variantId: decision.variantId,
            })
            .then(() => {
              announce(t('web.receipt.retry.started', { account: target.accountLabel }), 'polite');
            })
            .catch(() => {
              announce(t('web.receipt.retry.failedTitle'), 'assertive');
            });
          setConfirming(false);
        }}
      />
    </div>
  );
}
