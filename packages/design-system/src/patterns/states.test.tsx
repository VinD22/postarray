import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoadingState, SkeletonList, SkeletonTable, SkeletonText } from './loading-state';
import { EmptyState } from './empty-state';
import { ErrorState } from './error-state';
import { PartialSuccessNotice } from './partial-success-notice';
import { OfflineBanner } from './offline-banner';
import { PermissionDenied } from './permission-denied';
import { RateLimitNotice } from './rate-limit-notice';

/**
 * The seven states every screen has to design.
 *
 * These components are the reason the product does not lie to people: that a
 * missing number is not a zero, that four posts that already exist in the
 * world are not described as a failure, that a retry button never appears on
 * an operation whose retry would publish twice. All of that was documented in
 * doc comments and enforced by nothing.
 *
 * Each block below tests the contract that component's own doc comment
 * states, not merely that it renders. Fixtures are test-only strings; product
 * copy lives in @relay/i18n.
 */

describe('LoadingState', () => {
  it('announces once for the whole region, not once per placeholder', () => {
    render(
      <LoadingState label="Loading the publishing queue">
        <SkeletonList rows={20} />
      </LoadingState>,
    );

    const statuses = screen.getAllByRole('status');
    expect(statuses).toHaveLength(1);
    expect(statuses[0]).toHaveTextContent('Loading the publishing queue');
  });

  it('marks the region busy and announces politely', () => {
    render(
      <LoadingState label="Loading connections">
        <SkeletonText />
      </LoadingState>,
    );

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-busy', 'true');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });

  it('names what is loading, so the label is not the word "Loading" alone', () => {
    render(
      <LoadingState label="Loading the publishing queue">
        <SkeletonList />
      </LoadingState>,
    );
    expect(screen.getByText('Loading the publishing queue')).toBeInTheDocument();
  });

  it('reserves the real row count so the layout does not jump on arrival', () => {
    const { container } = render(<SkeletonList rows={7} />);
    expect(container.querySelectorAll('li')).toHaveLength(7);
  });

  it('hides the purely decorative skeletons from assistive technology', () => {
    const { container: table } = render(<SkeletonTable rows={3} columns={5} />);
    expect(table.firstElementChild).toHaveAttribute('aria-hidden', 'true');

    const { container: text } = render(<SkeletonText lines={4} />);
    expect(text.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('EmptyState', () => {
  const base = {
    title: 'No scheduled posts',
    description: 'Anything you schedule shows up here, in the order it will publish.',
  };

  it('names what is missing as a heading and explains what it is for', () => {
    render(<EmptyState {...base} />);
    expect(screen.getByRole('heading', { level: 2, name: 'No scheduled posts' })).toBeVisible();
    expect(screen.getByText(base.description)).toBeVisible();
  });

  it('takes exactly one primary action, with a second choice demoted', () => {
    render(
      <EmptyState
        {...base}
        action={<button type="button">Schedule a post</button>}
        secondaryAction={<a href="/docs">Read the guide</a>}
      />,
    );

    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Schedule a post' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Read the guide' })).toBeVisible();
  });

  it('renders no action area at all when there is nothing to do here', () => {
    render(<EmptyState {...base} />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('shows a real example, which is what turns an empty screen into an explanation', () => {
    render(<EmptyState {...base} example="Tuesday 09:00, Instagram, product photo" />);
    expect(screen.getByText('Tuesday 09:00, Instagram, product photo')).toBeVisible();
  });

  it('keeps the illustration decorative, so it never competes with the words', () => {
    const { container } = render(
      <EmptyState {...base} illustration={<svg data-testid="diagram" />} />,
    );
    expect(container.querySelector('[aria-hidden="true"]')).toContainElement(
      screen.getByTestId('diagram'),
    );
  });
});

describe('ErrorState', () => {
  const base = {
    title: 'Could not publish to Instagram',
    description: 'Your draft is saved and nothing was posted.',
  };

  it('is an assertive alert, because something has already gone wrong', () => {
    render(<ErrorState {...base} />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(base.title);
    expect(alert).not.toHaveAttribute('aria-live', 'polite');
  });

  it('names the affected subject rather than leaving it to be inferred', () => {
    render(
      <ErrorState {...base} subject={{ label: 'Account', value: '@postarray on Instagram' }} />,
    );
    expect(screen.getByText('Account')).toBeVisible();
    expect(screen.getByText('@postarray on Instagram')).toBeVisible();
  });

  it('keeps the user content on screen, still theirs', () => {
    render(
      <ErrorState {...base}>
        <textarea defaultValue="the draft nobody wants to lose" />
      </ErrorState>,
    );
    expect(screen.getByRole('textbox')).toHaveValue('the draft nobody wants to lose');
  });

  it('offers no retry when the caller did not say retrying is safe', () => {
    // The important half of the contract: a publish that may already have
    // reached the provider must not offer a button that would post twice.
    render(<ErrorState {...base} retryLabel="Try again" />);
    expect(screen.queryByRole('button', { name: 'Try again' })).toBeNull();
  });

  it('offers retry when the caller supplies a handler, and calls it once', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(<ErrorState {...base} onRetry={onRetry} retryLabel="Try again" />);

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('disables the retry button while a retry is already running', () => {
    render(<ErrorState {...base} onRetry={vi.fn()} retryLabel="Try again" retrying />);
    expect(screen.getByRole('button', { name: /Try again/ })).toBeDisabled();
  });

  it('shows a support reference verbatim, as code', () => {
    const { container } = render(
      <ErrorState {...base} reference={{ label: 'Reference', value: 'req_01J8ZK4' }} />,
    );
    const code = container.querySelector('code');
    expect(code).toHaveTextContent('req_01J8ZK4');
  });
});

describe('PartialSuccessNotice', () => {
  const targets = [
    { id: 't1', account: '@postarray on Mastodon', outcome: 'succeeded' as const, detail: 'View post' },
    { id: 't2', account: '@postarray on Bluesky', outcome: 'succeeded' as const, detail: 'View post' },
    { id: 't3', account: '@postarray on Instagram', outcome: 'failed' as const, detail: 'The token expired.' },
  ];

  const base = {
    title: 'Published to 2 of 3 accounts',
    description: 'The two posts that went out already exist and will not be removed.',
    succeededLabel: 'Published',
    failedLabel: 'Not published',
    targets,
  };

  it('splits the result into two named groups instead of one aggregate', () => {
    render(<PartialSuccessNotice {...base} />);
    expect(screen.getByText('Published')).toBeVisible();
    expect(screen.getByText('Not published')).toBeVisible();
  });

  it('names every account, on both sides', () => {
    render(<PartialSuccessNotice {...base} />);
    for (const target of targets) {
      expect(screen.getByText(target.account)).toBeVisible();
    }
  });

  it('carries a permalink for each success and a reason for each failure', () => {
    render(<PartialSuccessNotice {...base} />);
    expect(screen.getAllByText('View post')).toHaveLength(2);
    expect(screen.getByText('The token expired.')).toBeVisible();
  });

  it('puts each target in its own group list, not one merged list', () => {
    render(<PartialSuccessNotice {...base} />);
    const lists = screen.getAllByRole('list');
    expect(lists).toHaveLength(2);
    expect(within(lists[0] as HTMLElement).getAllByRole('listitem')).toHaveLength(2);
    expect(within(lists[1] as HTMLElement).getAllByRole('listitem')).toHaveLength(1);
  });

  it('is a polite status, because the posts already happened', () => {
    render(<PartialSuccessNotice {...base} />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('drops an empty group rather than showing a heading over nothing', () => {
    render(
      <PartialSuccessNotice
        {...base}
        targets={targets.filter((target) => target.outcome === 'succeeded')}
      />,
    );
    expect(screen.getByText('Published')).toBeVisible();
    expect(screen.queryByText('Not published')).toBeNull();
  });
});

describe('OfflineBanner', () => {
  const base = {
    title: 'The connection dropped',
    description: 'Drafts still save on this device. Scheduling and publishing wait for the network.',
  };

  it('is a polite status, never an alert', () => {
    render(<OfflineBanner {...base} />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('says which actions still work and which do not', () => {
    render(<OfflineBanner {...base} />);
    expect(screen.getByText(base.description)).toBeVisible();
  });

  it('shows the last successful save, so nobody retypes work that is safe', () => {
    render(<OfflineBanner {...base} lastSaved="Last saved 14:02" />);
    expect(screen.getByText('Last saved 14:02')).toBeVisible();
  });

  it('carries an icon as well as a tone, so the state is never colour alone', () => {
    const { container } = render(<OfflineBanner {...base} />);
    const icon = container.querySelector('svg');
    expect(icon).not.toBeNull();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('PermissionDenied', () => {
  const base = {
    title: 'You cannot approve this post',
    description: 'Approving needs the Approver role in this workspace.',
  };

  it('states what was attempted and what role it needs', () => {
    render(<PermissionDenied {...base} />);
    expect(screen.getByText(base.title)).toBeVisible();
    expect(screen.getByText(base.description)).toBeVisible();
  });

  it('lists the exact role and scope names as code, because they are looked up verbatim', () => {
    const { container } = render(
      <PermissionDenied
        {...base}
        requirementsLabel="Required"
        requirements={['workspace.approver', 'post:approve']}
      />,
    );
    const codes = [...container.querySelectorAll('code')].map((el) => el.textContent);
    expect(codes).toEqual(['workspace.approver', 'post:approve']);
    expect(screen.getByText('Required')).toBeVisible();
  });

  it('offers a route forward, because a denial with no next step is a dead end', () => {
    render(
      <PermissionDenied
        {...base}
        contact="Ask Priya, who owns this workspace."
        actions={<button type="button">Request access</button>}
      />,
    );
    expect(screen.getByText('Ask Priya, who owns this workspace.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Request access' })).toBeVisible();
  });

  it('does not announce itself: a denial is a place you arrived, not an event', () => {
    render(<PermissionDenied {...base} />);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
  });
});

describe('RateLimitNotice', () => {
  const base = {
    title: 'Instagram publishing is paused for this account',
    cause: 'Instagram allows 25 posts per account per day, and this account has used all of them.',
    resetLabel: 'Resets',
    resetAt: 'Tomorrow at 09:00',
  };

  it('shows when the window resets, in a time element', () => {
    const { container } = render(<RateLimitNotice {...base} />);
    expect(screen.getByText('Resets')).toBeVisible();
    const time = container.querySelector('time');
    expect(time).toHaveTextContent('Tomorrow at 09:00');
  });

  it('names the cause, since a limit with no reason cannot be acted on', () => {
    render(<RateLimitNotice {...base} />);
    expect(screen.getByText(base.cause)).toBeVisible();
  });

  it('exposes usage as a labelled progress bar with a readable value', () => {
    render(
      <RateLimitNotice
        {...base}
        usage={{ used: 25, limit: 25, text: '25 of 25 posts', label: 'Daily post allowance' }}
      />,
    );

    const bar = screen.getByRole('progressbar', { name: 'Daily post allowance' });
    expect(bar).toHaveAttribute('aria-valuenow', '25');
    expect(bar).toHaveAttribute('aria-valuemax', '25');
    expect(bar).toHaveAttribute('aria-valuetext', '25 of 25 posts');
    expect(screen.getByText('25 of 25 posts')).toBeVisible();
  });

  it('offers a cheaper way to get the same outcome, so it is not just a wall', () => {
    render(<RateLimitNotice {...base} alternative="Schedule it for tomorrow instead." />);
    expect(screen.getByText('Schedule it for tomorrow instead.')).toBeVisible();
  });

  it('is a polite status: a quota is a condition, not a failure the user caused', () => {
    render(<RateLimitNotice {...base} />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });
});
