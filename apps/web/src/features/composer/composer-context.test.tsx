import type { ReactElement, ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import { en } from '@relay/i18n/messages';
import { I18nProvider } from '@relay/i18n/react';

import { SEED_BOOTSTRAP } from './state/seed';
import { ComposerProvider, useComposer } from './composer-context';
import { ComposerSaveConflict } from './state/save-conflict';
import { UNSAVED_DRAFT_ID, type ComposerBootstrap, type ComposerSaveOutcome } from './types';

/**
 * The two save rules that keep the composer honest under a fast typist: a
 * draft with nothing in it is never written to the server at all, and edits
 * made while a save is running join one follow-up round instead of queueing a
 * write each.
 */

const OUTCOME: ComposerSaveOutcome = {
  contentItemId: 'content_created',
  savedAt: '2026-09-02T10:00:00.000Z',
  savedConnectionIds: [],
  failedConnectionIds: [],
};

const UNSAVED: ComposerBootstrap = {
  ...SEED_BOOTSTRAP,
  updatedAt: null,
  selectedConnectionIds: [],
  settings: {},
  master: { ...SEED_BOOTSTRAP.master, id: UNSAVED_DRAFT_ID, body: '', title: null },
};

function Probe(): ReactNode {
  const { state, dispatch, saveNow, conflict, autosave } = useComposer();
  return (
    <>
      <p data-testid="draft-id">{state.master.id}</p>
      <p data-testid="autosave">{autosave}</p>
      <p data-testid="their-body">{conflict?.theirBody ?? ''}</p>
      <button
        type="button"
        onClick={() => {
          saveNow().then(
            () => document.body.setAttribute('data-commit', 'went-on'),
            () => document.body.setAttribute('data-commit', 'stopped'),
          );
        }}
      >
        commit
      </button>
      <button
        type="button"
        onClick={() => dispatch({ type: 'master/patch', patch: { body: `${state.master.body}x` } })}
      >
        type
      </button>
      <button
        type="button"
        onClick={() => dispatch({ type: 'target/add', connectionId: 'conn_seed_x_acme' })}
      >
        add target
      </button>
    </>
  );
}

function mount(onSave: () => Promise<ComposerSaveOutcome>): ReactElement {
  return (
    <I18nProvider locale="en" catalog={en} timeZone="Europe/Berlin">
      <ComposerProvider
        bootstrap={UNSAVED}
        media={{ get: () => null }}
        approvalRequired={false}
        onSave={onSave}
      >
        <Probe />
      </ComposerProvider>
    </I18nProvider>
  );
}

describe('ComposerProvider saving', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('writes nothing for a draft somebody only selected channels in', () => {
    vi.useFakeTimers();
    const onSave = vi.fn(() => Promise.resolve(OUTCOME));
    render(mount(onSave));

    act(() => {
      screen.getByRole('button', { name: 'add target' }).click();
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onSave).not.toHaveBeenCalled();
  });

  it('writes once the draft has words in it, and takes the id it comes back with', async () => {
    const onSave = vi.fn(() => Promise.resolve(OUTCOME));
    render(mount(onSave));

    act(() => {
      screen.getByRole('button', { name: 'type' }).click();
    });

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(screen.getByTestId('draft-id')).toHaveTextContent('content_created');
    });
  });

  it('coalesces edits made while a save is in flight into one follow-up round', async () => {
    let release: (() => void) | null = null;
    const onSave = vi.fn(
      () =>
        new Promise<ComposerSaveOutcome>((resolve) => {
          release = () => resolve(OUTCOME);
        }),
    );
    render(mount(onSave));

    act(() => {
      screen.getByRole('button', { name: 'type' }).click();
    });
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1);
    });

    // Three more edits while the first save is still running.
    act(() => {
      screen.getByRole('button', { name: 'type' }).click();
      screen.getByRole('button', { name: 'type' }).click();
      screen.getByRole('button', { name: 'type' }).click();
    });
    await act(async () => {
      release?.();
      await Promise.resolve();
    });

    // One more round for all three, not one round each.
    await waitFor(() => {
      expect(onSave.mock.calls.length).toBeLessThanOrEqual(2);
    });
  });

  it('stops a commit when any target failed to save', async () => {
    const onSave = vi.fn(() =>
      Promise.resolve({ ...OUTCOME, failedConnectionIds: ['conn_seed_x_acme'] }),
    );
    render(mount(onSave));

    act(() => {
      screen.getByRole('button', { name: 'commit' }).click();
    });

    await waitFor(() => expect(document.body.getAttribute('data-commit')).toBe('stopped'));
    document.body.removeAttribute('data-commit');
  });

  it('shows a refused stale save as a conflict with the saved text, not a failure', async () => {
    const onSave = vi.fn(() =>
      Promise.reject(
        new ComposerSaveConflict({
          theirBody: 'Their text.',
          changedAt: '2026-09-02T10:01:00.000Z',
          serverVersionId: 'ver_02',
          accept: () => undefined,
        }),
      ),
    );
    render(mount(onSave));

    act(() => {
      screen.getByRole('button', { name: 'commit' }).click();
    });

    await waitFor(() => expect(screen.getByTestId('autosave').textContent).toBe('conflict'));
    expect(screen.getByTestId('their-body').textContent).toBe('Their text.');
    expect(document.body.getAttribute('data-commit')).toBe('stopped');
    document.body.removeAttribute('data-commit');
  });
});
