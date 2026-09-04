'use client';

/**
 * The composer header: what state the draft is in, and nothing else.
 *
 * Saved, saving, offline, conflict, failed and version pinned each read as a
 * sentence. A failed save never suggests the text was lost, because it was not.
 */

import { type ReactNode } from 'react';
import { Button, Kbd } from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import { formatRelativeTime } from '@relay/i18n';

import { useComposer } from '../composer-context';

export interface ComposerHeaderProps {
  readonly onClose: () => void;
  readonly onShowShortcuts: () => void;
}

export function ComposerHeader({ onClose, onShowShortcuts }: ComposerHeaderProps): ReactNode {
  const t = useTranslations();
  const { state, autosave, savedAt, conflict, resolveConflict, saveNow, dispatch } = useComposer();

  return (
    <header className="border-border-default bg-surface-raised shadow-raised flex flex-col gap-2 rounded-lg border px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-text-primary text-[clamp(1.75rem,2.5vw,2.5rem)] leading-none font-bold tracking-[-0.035em]">
          {t.full('composer.title')}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <p aria-live="polite" className="text-body-sm text-text-tertiary">
            {autosave === 'saving' ? t.full('composer.autosave.saving') : null}
            {autosave === 'saved' && savedAt
              ? t.full('composer.autosave.saved', {
                  relativeTime: formatRelativeTime(t.locale, savedAt),
                })
              : null}
            {autosave === 'offline' ? t.full('composer.autosave.offline') : null}
            {autosave === 'failed' ? t.full('composer.autosave.failed') : null}
          </p>

          {autosave === 'failed' ? (
            <Button variant="secondary" size="sm" onClick={() => void saveNow()}>
              {t.full('composerWeb.autosave.retry')}
            </Button>
          ) : null}

          <Button variant="ghost" size="sm" onClick={onShowShortcuts}>
            {t.full('composerWeb.shortcuts.open')}
            <Kbd keys="?" />
          </Button>

          <Button variant="ghost" size="sm" onClick={onClose}>
            {t.full('action.close')}
          </Button>
        </div>
      </div>

      {state.approvalPinned ? (
        <Notice
          tone="warning"
          liveness="status"
          title={t.full('composerWeb.autosave.pinned')}
          actions={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => dispatch({ type: 'approval/unpin' })}
            >
              {t.full('composerWeb.autosave.pinnedAcknowledge')}
            </Button>
          }
        />
      ) : null}

      {conflict ? (
        <Notice
          tone="warning"
          liveness="alert"
          title={t.full('composer.autosave.conflict', { name: conflict.editorName })}
          description={t.full('composerWeb.autosave.conflictHelp')}
          actions={
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={() => resolveConflict('mine')}>
                {t.full('composerWeb.autosave.conflictKeepMine')}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => resolveConflict('theirs')}>
                {t.full('composerWeb.autosave.conflictKeepTheirs', { name: conflict.editorName })}
              </Button>
            </div>
          }
        />
      ) : null}
    </header>
  );
}
