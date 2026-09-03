'use client';

/**
 * "You have unsaved changes from last time."
 *
 * The composer keeps a copy of the draft on the device while it is dirty. This
 * is the one place that copy is offered back, and the offer is always a choice:
 * nothing is restored without a click, because restoring silently would replace
 * whatever the server has with a version somebody may have abandoned on
 * purpose.
 *
 * Two outcomes, and they read differently on purpose. When the server still
 * holds the version the copy was taken from, both are the same post and the
 * copy is simply newer. When the server has moved on, somebody saved this draft
 * from another device, and the honest thing is to say so and drop the copy
 * rather than offer a restore that would quietly undo their work.
 */

import { useState, type ReactNode } from 'react';
import { Button } from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { useComposer } from '../composer-context';
import {
  clearDraftMirror,
  draftMirrorKey,
  readDraftMirror,
  restoreOfferFrom,
  type RestoreOffer,
} from '../hooks/use-draft-mirror';

export function RestoreBanner(): ReactNode {
  const t = useTranslations();
  const { bootstrap, state, dispatch } = useComposer();
  const key = draftMirrorKey(bootstrap.master.workspaceId, bootstrap.master.id);

  /*
   * Read once, on mount, before the mirror hook writes anything. Reading it
   * again later would race the writer and could offer somebody their own
   * current text back as if it were an older copy.
   */
  const [offer, setOffer] = useState<RestoreOffer>(() =>
    typeof window === 'undefined'
      ? { kind: 'none' }
      : restoreOfferFrom(readDraftMirror(key), bootstrap.updatedAt),
  );

  if (offer.kind === 'none') {
    return null;
  }

  if (offer.kind === 'superseded') {
    clearDraftMirror(key);
    return (
      <Notice
        tone="info"
        liveness="status"
        title={t.full('composerWeb.restore.supersededTitle')}
        description={t.full('composerWeb.restore.supersededBody')}
      />
    );
  }

  const restored = offer.state;

  return (
    <Notice
      tone="info"
      liveness="status"
      title={t.full('composerWeb.restore.title')}
      description={t.full('composerWeb.restore.body')}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              // The restored copy is dirty by definition, so the next autosave
              // writes it to the server. Nothing else has to happen here.
              dispatch({
                type: 'state/replace',
                state: { ...restored, revision: state.revision + 1 },
              });
              setOffer({ kind: 'none' });
            }}
          >
            {t.full('composerWeb.restore.restore')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearDraftMirror(key);
              setOffer({ kind: 'none' });
            }}
          >
            {t.full('composerWeb.restore.discard')}
          </Button>
        </div>
      }
    />
  );
}
