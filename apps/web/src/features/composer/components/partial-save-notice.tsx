'use client';

/**
 * When a save reached some accounts and not others.
 *
 * Autosave writes the master, the target list and one request per changed
 * target. Those requests can fail one at a time: a rate limit on one account,
 * a connection that expired an hour ago. Before this, such a failure was
 * invisible, and the composer went on showing text that only existed in the
 * browser.
 *
 * The notice names every account, on both sides of the line, and says what
 * happens next. Nothing here retries by hand: the failed targets are still
 * marked as changed, so the next edit writes them again, and a retry button
 * that quietly re-sent the accounts that already succeeded would be the wrong
 * shape for this.
 */

import { type ReactNode } from 'react';
import { PartialSuccessNotice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { useComposer } from '../composer-context';

export function PartialSaveNotice(): ReactNode {
  const t = useTranslations();
  const { bootstrap, state, failedTargetConnectionIds } = useComposer();

  if (failedTargetConnectionIds.length === 0) {
    return null;
  }

  const label = (connectionId: string): string =>
    bootstrap.accounts.find((account) => account.connectionId === connectionId)?.displayName ??
    connectionId;

  return (
    <PartialSuccessNotice
      title={t.full('composerWeb.saveSplit.title', { count: failedTargetConnectionIds.length })}
      description={t.full('composerWeb.saveSplit.body')}
      succeededLabel={t.full('composerWeb.saveSplit.saved')}
      failedLabel={t.full('composerWeb.saveSplit.unsaved')}
      targets={state.selectedConnectionIds.map((connectionId) => ({
        id: connectionId,
        account: label(connectionId),
        outcome: failedTargetConnectionIds.includes(connectionId) ? 'failed' : 'succeeded',
      }))}
    />
  );
}
