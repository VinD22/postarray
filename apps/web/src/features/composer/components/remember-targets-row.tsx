'use client';

/**
 * "Start with the channels I used last time."
 *
 * The feature already existed end to end and had no control anywhere near the
 * screen it acts on. This is that control, in the rail, next to the thing it
 * changes.
 *
 * Two rules the copy has to carry. Turning it on is a per-project decision
 * somebody makes for everybody, and turning it off deletes every saved
 * selection in the project, for everyone, so the off direction asks first.
 * Nothing here is optimistic: a switch that has moved while the deletion has
 * not would be a lie about other people's data.
 *
 * Channels that were remembered but not restored are named, with the reason.
 * A revoked or paused account is never quietly reselected, and it is never
 * quietly dropped either.
 */

import { useState, type ReactNode } from 'react';
import { Button, Switch } from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { useComposer } from '../composer-context';
import { useRememberedTargets, useSetRememberedTargetsEnabled } from '../data/use-remembered-targets';
import type { SeededTargets } from '../data/use-seed-remembered-targets';

export interface RememberTargetsRowProps {
  readonly projectId: string | null;
  readonly seeded: SeededTargets;
}

export function RememberTargetsRow({ projectId, seeded }: RememberTargetsRowProps): ReactNode {
  const t = useTranslations();
  const { bootstrap } = useComposer();
  const memory = useRememberedTargets(projectId);
  const setting = useSetRememberedTargetsEnabled();
  const [confirmingOff, setConfirmingOff] = useState(false);

  if (projectId === null) {
    return null;
  }

  const enabled = memory.data?.enabled ?? false;

  /** What the composer can honestly say about a channel it did not restore. */
  const reasonFor = (connectionId: string): string => {
    const account = bootstrap.accounts.find((entry) => entry.connectionId === connectionId);
    if (account === undefined) {
      return t.full('composerWeb.remember.reason.gone');
    }
    return account.paused
      ? t.full('composerWeb.remember.reason.paused')
      : t.full('composerWeb.remember.reason.unavailable');
  };

  const nameFor = (connectionId: string): string =>
    bootstrap.accounts.find((entry) => entry.connectionId === connectionId)?.displayName ??
    t.full('composerWeb.remember.unknownAccount');

  return (
    <section className="flex flex-col gap-2" aria-labelledby="composer-remember-heading">
      <div className="flex items-start justify-between gap-3">
        <label
          id="composer-remember-heading"
          htmlFor="composer-remember-switch"
          className="text-body-sm text-text-secondary"
        >
          {t.full('composerWeb.remember.toggle')}
        </label>
        <Switch
          id="composer-remember-switch"
          checked={enabled}
          disabled={setting.isPending || memory.isPending}
          onCheckedChange={(next) => {
            if (next) {
              setting.mutate({ projectId, enabled: true });
              return;
            }
            setConfirmingOff(true);
          }}
        />
      </div>

      {confirmingOff ? (
        <Notice
          tone="warning"
          liveness="status"
          title={t.full('targetMemory.setting.title')}
          description={t.full('targetMemory.setting.turnOffWarning')}
          actions={
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setting.mutate(
                    { projectId, enabled: false },
                    { onSettled: () => setConfirmingOff(false) },
                  )
                }
              >
                {t.full('composerWeb.remember.turnOff')}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmingOff(false)}>
                {t.full('action.cancel')}
              </Button>
            </div>
          }
        />
      ) : null}

      {setting.isError ? (
        <Notice
          tone="destructive"
          liveness="alert"
          title={t.full('composerWeb.remember.failedTitle')}
          description={t.full('composerWeb.remember.failedBody')}
        />
      ) : null}

      {/* What the composer restored, and what it deliberately did not. */}
      {seeded.noticeKey === null ? null : seeded.droppedConnectionIds.length === 0 ? (
        <p className="text-body-sm text-text-tertiary" role="status" data-testid="remembered-targets-notice">
          {t.full(seeded.noticeKey, { count: seeded.count })}
        </p>
      ) : (
        <Notice
          tone="info"
          liveness="status"
          title={t.full(seeded.noticeKey, { count: seeded.count })}
          description={
            <ul className="flex flex-col gap-1" data-testid="remembered-targets-notice">
              {seeded.droppedConnectionIds.map((connectionId) => (
                <li key={connectionId} className="text-body-sm">
                  {t.full('composerWeb.remember.droppedItem', {
                    account: nameFor(connectionId),
                    reason: reasonFor(connectionId),
                  })}
                </li>
              ))}
            </ul>
          }
        />
      )}
    </section>
  );
}
