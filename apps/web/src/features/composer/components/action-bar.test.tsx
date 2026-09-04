import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { en } from '@relay/i18n/messages';
import { I18nProvider } from '@relay/i18n/react';

import { ComposerProvider } from '../composer-context';
import { SEED_BOOTSTRAP } from '../state/seed';
import type { ComposerBootstrap, ComposerSaveOutcome } from '../types';
import { ActionBar } from './action-bar';

/**
 * What is held here is that the one action people came to this screen for is
 * always reachable, that it says which action it is, and that the count of
 * problems is a way to get to them rather than a decoration.
 */

const OUTCOME: ComposerSaveOutcome = {
  contentItemId: 'content_seed_launch_thread',
  savedAt: '2026-09-02T10:00:00.000Z',
  savedConnectionIds: [],
  failedConnectionIds: [],
};

function mount(
  node: ReactNode,
  options: {
    readonly bootstrap?: ComposerBootstrap;
    readonly onSave?: () => Promise<ComposerSaveOutcome>;
  } = {},
): ReactElement {
  return (
    <I18nProvider locale="en" catalog={en} timeZone="Europe/Berlin">
      <ComposerProvider
        bootstrap={options.bootstrap ?? SEED_BOOTSTRAP}
        media={{ get: () => null }}
        approvalRequired={false}
        onSave={options.onSave ?? (() => Promise.resolve(OUTCOME))}
      >
        {node}
      </ComposerProvider>
    </I18nProvider>
  );
}

describe('ActionBar', () => {
  it('is a named toolbar carrying exactly one primary action', () => {
    render(mount(<ActionBar onCommit={() => undefined} onShowIssues={() => undefined} />));

    expect(screen.getByRole('toolbar', { name: 'Draft actions' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Publish now' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save draft' })).toBeInTheDocument();
  });

  it('says Schedule once the draft has a time, and Publish now while it has none', () => {
    const scheduled: ComposerBootstrap = {
      ...SEED_BOOTSTRAP,
      master: {
        ...SEED_BOOTSTRAP.master,
        schedule: {
          instant: '2026-09-10T09:00:00.000Z',
          ianaTimeZone: 'Europe/Berlin',
          repeat: null,
        },
      },
    };

    render(
      mount(<ActionBar onCommit={() => undefined} onShowIssues={() => undefined} />, {
        bootstrap: scheduled,
      }),
    );

    expect(screen.getByRole('button', { name: 'Schedule' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Publish now' })).not.toBeInTheDocument();
  });

  it('offers the problem count as a way into the panel that lists them', async () => {
    const onShowIssues = vi.fn();
    // Over X's 280 characters, so the draft really does have something to fix.
    const overLimit: ComposerBootstrap = {
      ...SEED_BOOTSTRAP,
      master: { ...SEED_BOOTSTRAP.master, body: 'a'.repeat(400) },
    };

    render(
      mount(<ActionBar onCommit={() => undefined} onShowIssues={onShowIssues} />, {
        bootstrap: overLimit,
      }),
    );

    const link = screen.getByRole('button', { name: /to fix/ });
    await userEvent.click(link);

    expect(onShowIssues).toHaveBeenCalledTimes(1);
  });

  it('shows no problem count when there is nothing to fix', () => {
    const noTargets: ComposerBootstrap = { ...SEED_BOOTSTRAP, selectedConnectionIds: [] };

    render(
      mount(<ActionBar onCommit={() => undefined} onShowIssues={() => undefined} />, {
        bootstrap: noTargets,
      }),
    );

    expect(screen.queryByRole('button', { name: /to fix/ })).not.toBeInTheDocument();
  });

  it('saves the draft from the bar rather than from a button further down', async () => {
    const onSave = vi.fn(() => Promise.resolve(OUTCOME));

    render(
      mount(<ActionBar onCommit={() => undefined} onShowIssues={() => undefined} />, { onSave }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save draft' }));

    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
