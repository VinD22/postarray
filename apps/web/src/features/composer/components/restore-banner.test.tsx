import type { ReactElement, ReactNode } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { en } from '@relay/i18n/messages';
import { I18nProvider } from '@relay/i18n/react';

import { ComposerProvider, useComposer } from '../composer-context';
import { initialComposerState, SEED_BOOTSTRAP } from '../state/seed';
import { draftMirrorKey, type DraftMirror } from '../hooks/use-draft-mirror';
import type { ComposerSaveOutcome } from '../types';
import { RestoreBanner } from './restore-banner';

/**
 * Draft recovery, from the reader's side: the offer only appears when there is
 * something to offer, restoring puts the words back, and a draft that was saved
 * from another device is never silently overwritten by this one.
 */

const KEY = draftMirrorKey(SEED_BOOTSTRAP.master.workspaceId, SEED_BOOTSTRAP.master.id);
const RESCUED = 'The sentence that never reached the server.';

const OUTCOME: ComposerSaveOutcome = {
  contentItemId: SEED_BOOTSTRAP.master.id,
  savedAt: '2026-08-04T07:05:00.000Z',
  savedConnectionIds: [],
  failedConnectionIds: [],
};

function storeMirror(overrides: Partial<DraftMirror> = {}): void {
  const base = initialComposerState(SEED_BOOTSTRAP);
  const mirror: DraftMirror = {
    version: 1,
    contentItemId: SEED_BOOTSTRAP.master.id,
    baseUpdatedAt: SEED_BOOTSTRAP.updatedAt,
    dirty: true,
    state: { ...base, master: { ...base.master, body: RESCUED }, revision: 4 },
    ...overrides,
  };
  window.localStorage.setItem(KEY, JSON.stringify(mirror));
}

function Body(): ReactNode {
  const { state } = useComposer();
  return <p data-testid="body">{state.master.body}</p>;
}

function mount(): ReactElement {
  return (
    <I18nProvider locale="en" catalog={en} timeZone="Europe/Berlin">
      <ComposerProvider
        bootstrap={SEED_BOOTSTRAP}
        media={{ get: () => null }}
        approvalRequired={false}
        onSave={() => Promise.resolve(OUTCOME)}
      >
        <RestoreBanner />
        <Body />
      </ComposerProvider>
    </I18nProvider>
  );
}

describe('RestoreBanner', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('says nothing when this device holds no copy', () => {
    render(mount());

    expect(screen.queryByText('Unsaved changes from this device')).not.toBeInTheDocument();
  });

  it('puts the unsaved words back when asked, and only when asked', async () => {
    storeMirror();
    render(mount());

    expect(screen.getByTestId('body')).not.toHaveTextContent(RESCUED);

    await userEvent.click(screen.getByRole('button', { name: 'Restore unsaved changes' }));

    expect(screen.getByTestId('body')).toHaveTextContent(RESCUED);
  });

  it('drops the copy on discard and leaves the saved draft alone', async () => {
    storeMirror();
    render(mount());

    await userEvent.click(screen.getByRole('button', { name: 'Discard the copy' }));

    expect(screen.getByTestId('body')).not.toHaveTextContent(RESCUED);
    expect(window.localStorage.getItem(KEY)).toBeNull();
  });

  it('never offers a restore over a version that was saved somewhere else', () => {
    storeMirror({ baseUpdatedAt: '2026-08-01T07:00:00.000Z' });
    render(mount());

    expect(screen.getByText('A newer version was saved elsewhere')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Restore unsaved changes' }),
    ).not.toBeInTheDocument();
    expect(window.localStorage.getItem(KEY)).toBeNull();
  });
});
