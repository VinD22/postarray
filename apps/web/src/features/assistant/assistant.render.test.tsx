import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AgentConfirmationView } from '@relay/application';
import type { AssistantActionOutput } from '@relay/contracts';
import { en } from '@relay/i18n/messages';
import { I18nProvider } from '@relay/i18n/react';

import { AssistantActionConfirmation } from './action-confirmation';
import { AssistantEmptyState } from './empty-state';
import { AssistantOverBudget } from './over-budget-notice';

/**
 * What is held here is what makes this surface safe to ship rather than its
 * markup: that a person sees the whole of an action before they can approve
 * it, that an exhausted allowance is explained in plain words, and that the
 * first thing anybody meets is an invitation rather than a blank box.
 */

function mount(node: ReactNode): ReactElement {
  return (
    <I18nProvider locale="en" catalog={en} timeZone="Europe/Madrid">
      {node}
    </I18nProvider>
  );
}

const CONFIRMATION: AgentConfirmationView = {
  id: 'confirm_01',
  workspaceId: 'ws_01',
  contentItemId: 'content_01',
  state: 'pending',
  summary: {
    contentItemId: 'content_01',
    versionChecksum: 'abcdef0123456789',
    accountCount: 2,
    externalPublicationCount: 2,
    providers: ['x', 'linkedin'],
    accounts: [
      { connectionId: 'conn_1', label: 'Cafe Verde on X' },
      { connectionId: 'conn_2', label: 'Cafe Verde on LinkedIn' },
    ],
  },
  confirmedByUserId: null,
  confirmedAt: null,
  consumedAt: null,
  expiresAt: '2026-03-02T09:00:00.000Z',
  createdAt: '2026-03-01T09:00:00.000Z',
};

const SCHEDULE_ACTION: AssistantActionOutput = {
  tool: 'schedule_post',
  state: 'awaiting_confirmation',
  confirmationId: 'confirm_01',
  confirmUrl: '/confirm/confirm_01',
  proposal: {
    contentItemId: 'content_01',
    body: 'New beans landed this morning. Come and try them.',
    instant: '2026-03-03T08:30:00.000Z',
    ianaTimeZone: 'Europe/Madrid',
    localDateTime: '2026-03-03T09:30',
    reasonKeys: ['queue.reason.next_free_slot'],
  },
  resultId: null,
  blockedReasonKey: null,
};

describe('the confirmation moment', () => {
  it('shows every account, the exact text and the time in the workspace zone before approving', () => {
    render(
      mount(
        <AssistantActionConfirmation
          action={SCHEDULE_ACTION}
          confirmation={CONFIRMATION}
          busy={false}
          disabled={false}
          onApprove={() => undefined}
          onCancel={() => undefined}
          confirmHref="/confirm/confirm_01"
        />,
      ),
    );

    expect(screen.getByText('Cafe Verde on X')).toBeInTheDocument();
    expect(screen.getByText('Cafe Verde on LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('2 accounts')).toBeInTheDocument();
    expect(
      screen.getByText('New beans landed this morning. Come and try them.'),
    ).toBeInTheDocument();
    // The instant is rendered in the workspace zone, and the zone is named
    // beside it. 08:30 UTC is 09:30 in Madrid.
    expect(
      screen.getByText(
        (content) => content.includes('9:30') && content.includes('(Europe/Madrid)'),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Nothing has been written yet. Read this, and approve it only if it is what you want.',
      ),
    ).toBeInTheDocument();
  });

  it('only acts when the person presses the commit button, and offers a way out', async () => {
    const onApprove = vi.fn();
    const onCancel = vi.fn();
    const user = userEvent.setup();

    render(
      mount(
        <AssistantActionConfirmation
          action={SCHEDULE_ACTION}
          confirmation={CONFIRMATION}
          busy={false}
          disabled={false}
          onApprove={onApprove}
          onCancel={onCancel}
          confirmHref={null}
        />,
      ),
    );

    expect(onApprove).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Approve and do it' }));
    expect(onApprove).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Not now' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('says the accounts are unavailable rather than implying there are none', () => {
    render(
      mount(
        <AssistantActionConfirmation
          action={SCHEDULE_ACTION}
          confirmation={null}
          busy={false}
          disabled
          onApprove={() => undefined}
          onCancel={() => undefined}
          confirmHref={null}
        />,
      ),
    );

    expect(screen.getByText('Which accounts this reaches is unavailable.')).toBeInTheDocument();
  });
});

describe('the over budget state', () => {
  it('says what ran out, what it stops and what still works', () => {
    render(mount(<AssistantOverBudget resetAt="2026-04-01T00:00:00.000Z" />));

    expect(
      screen.getByText('This workspace has used its AI allowance for the month.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/you can still write, schedule and publish posts yourself/),
    ).toBeInTheDocument();
    expect(screen.getByText(/The allowance starts again/)).toBeInTheDocument();
  });

  it('admits an unknown reset date instead of showing a guess', () => {
    render(mount(<AssistantOverBudget resetAt={null} />));

    expect(screen.getByText('We do not have a date for when it starts again.')).toBeInTheDocument();
    expect(screen.queryByText(/The allowance starts again/)).not.toBeInTheDocument();
  });
});

describe('the first run state', () => {
  it('invites a person in their own words and puts a prompt in the box', async () => {
    const onPrompt = vi.fn();
    const user = userEvent.setup();

    render(mount(<AssistantEmptyState onPrompt={onPrompt} />));

    expect(screen.getByText('Tell it what you want, in your own words.')).toBeInTheDocument();
    expect(screen.getByText(/It never posts anything by itself./)).toBeInTheDocument();
    expect(
      screen.getByText('Nothing is written until you approve it.', { exact: false }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Plan my week of posts.' }));
    expect(onPrompt).toHaveBeenCalledWith('Plan my week of posts.');
  });
});
