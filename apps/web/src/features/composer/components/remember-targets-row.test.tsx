import type { ReactElement, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { en } from '@relay/i18n/messages';
import { I18nProvider } from '@relay/i18n/react';

const mutate = vi.hoisted(() => vi.fn());
const enabled = vi.hoisted(() => ({ value: false }));

vi.mock('../data/use-remembered-targets', () => ({
  useRememberedTargets: () => ({ data: { enabled: enabled.value }, isPending: false }),
  useSetRememberedTargetsEnabled: () => ({ mutate, isPending: false, isError: false }),
}));

import { ComposerProvider } from '../composer-context';
import { SEED_BOOTSTRAP } from '../state/seed';
import type { ComposerSaveOutcome } from '../types';
import { RememberTargetsRow } from './remember-targets-row';

/**
 * The four boundaries in `target-memory.ts` are what this screen has to make
 * visible: the memory is off unless somebody turns it on, turning it off
 * deletes what other people saved, and a channel that was not restored is
 * named with the reason rather than quietly missing.
 */

const OUTCOME: ComposerSaveOutcome = {
  contentItemId: SEED_BOOTSTRAP.master.id,
  savedAt: '2026-08-04T07:05:00.000Z',
  savedConnectionIds: [],
  failedConnectionIds: [],
};

const NOTHING_SEEDED = {
  noticeKey: null,
  count: 0,
  droppedConnectionIds: [],
} as const;

function mount(node: ReactNode): ReactElement {
  return (
    <I18nProvider locale="en" catalog={en} timeZone="Europe/Berlin">
      <ComposerProvider
        bootstrap={SEED_BOOTSTRAP}
        media={{ get: () => null }}
        approvalRequired={false}
        onSave={() => Promise.resolve(OUTCOME)}
      >
        {node}
      </ComposerProvider>
    </I18nProvider>
  );
}

describe('RememberTargetsRow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    enabled.value = false;
  });

  it('turns the project setting on from the rail', async () => {
    render(mount(<RememberTargetsRow projectId="project_01" seeded={NOTHING_SEEDED} />));

    await userEvent.click(
      screen.getByRole('switch', { name: 'Start with the channels I used last time' }),
    );

    expect(mutate).toHaveBeenCalledWith({ projectId: 'project_01', enabled: true });
  });

  it('asks before turning it off, because that deletes what other people saved', async () => {
    enabled.value = true;
    render(mount(<RememberTargetsRow projectId="project_01" seeded={NOTHING_SEEDED} />));

    await userEvent.click(
      screen.getByRole('switch', { name: 'Start with the channels I used last time' }),
    );

    expect(mutate).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        'Turning this off deletes every saved selection in this project, for everyone.',
      ),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: 'Turn off and delete saved selections' }),
    );

    expect(mutate).toHaveBeenCalledWith(
      { projectId: 'project_01', enabled: false },
      expect.anything(),
    );
  });

  it('names the channel it did not restore, and why', () => {
    const paused = SEED_BOOTSTRAP.accounts[1];
    render(
      mount(
        <RememberTargetsRow
          projectId="project_01"
          seeded={{
            noticeKey: 'targetMemory.composer.droppedSome',
            count: 1,
            droppedConnectionIds: [paused?.connectionId ?? 'conn_seed_li_acme'],
          }}
        />,
      ),
    );

    expect(screen.getByTestId('remembered-targets-notice')).toHaveTextContent(
      'Acme Europe: not available right now',
    );
  });

  it('says nothing at all when the project has no memory to talk about', () => {
    render(mount(<RememberTargetsRow projectId="project_01" seeded={NOTHING_SEEDED} />));

    expect(screen.queryByTestId('remembered-targets-notice')).not.toBeInTheDocument();
  });
});
