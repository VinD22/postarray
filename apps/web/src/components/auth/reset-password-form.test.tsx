import type { ReactElement, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { en } from '@relay/i18n/messages';
import type { PartialCatalog } from '@relay/i18n/messages';

import { IntlProvider } from '@/lib/i18n/provider';
import type * as ApiModule from '@/lib/api';

/**
 * The states of the screen a locked-out person lands on.
 *
 * This route did not exist until now: the API's reset email pointed at
 * `/{locale}/reset-password` and the link produced a 404. What is held here is
 * every branch of the replacement, because each one is a different sentence a
 * person reads at the worst possible moment, and none of them may quietly
 * become "that did not work".
 */

const CATALOG: PartialCatalog = en;

const searchParams = new URLSearchParams();
const push = vi.fn();

vi.mock('next/navigation', () => ({
  useSearchParams: () => searchParams,
  useRouter: () => ({
    push,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/en/reset-password',
}));

const completePasswordReset = vi.fn();

vi.mock('@/lib/api', async () => {
  const actual = await vi.importActual<typeof ApiModule>('@/lib/api');
  return {
    ...actual,
    api: { auth: { completePasswordReset: (input: unknown) => completePasswordReset(input) } },
  };
});

const { ResetPasswordForm } = await import('./reset-password-form');
const { ApiError } = await import('@/lib/api/error');

function mount(node: ReactNode): ReactElement {
  return (
    <IntlProvider locale="en" timeZone="UTC" catalog={CATALOG}>
      {node}
    </IntlProvider>
  );
}

beforeEach(() => {
  completePasswordReset.mockReset();
  push.mockReset();
  searchParams.forEach((_value, key) => searchParams.delete(key));
});

describe('reset password screen', () => {
  it('refuses to show password boxes when the page was opened without a link', () => {
    render(mount(<ResetPasswordForm />));

    expect(screen.getByText(en['auth.newPassword.linkMissing'])).toBeInTheDocument();
    expect(screen.queryByLabelText(en['auth.newPassword.label'])).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: en['auth.newPassword.linkInvalidAction'] }),
    ).toBeInTheDocument();
  });

  it('reads the token from the link and sets the new password', async () => {
    searchParams.set('token', 'a-token-from-the-email');
    completePasswordReset.mockResolvedValue({ status: 'reset' });
    const user = userEvent.setup();

    render(mount(<ResetPasswordForm />));
    await user.type(screen.getByLabelText(en['auth.newPassword.label']), 'a long new password');
    await user.type(
      screen.getByLabelText(en['auth.newPassword.confirmLabel']),
      'a long new password',
    );
    await user.click(screen.getByRole('button', { name: en['auth.newPassword.submit'] }));

    expect(completePasswordReset).toHaveBeenCalledWith({
      token: 'a-token-from-the-email',
      newPassword: 'a long new password',
    });
    expect(screen.getByText(en['auth.resetPassword.done'])).toBeInTheDocument();
    // Success routes to sign in rather than establishing a session here.
    await user.click(screen.getByRole('button', { name: en['auth.newPassword.signInNow'] }));
    // 'en' is the default locale, so the localized router leaves the path bare.
    expect(push).toHaveBeenCalledWith('/sign-in', undefined);
  });

  it('catches a mismatch in the form, before the secret is sent anywhere', async () => {
    searchParams.set('token', 'a-token-from-the-email');
    const user = userEvent.setup();

    render(mount(<ResetPasswordForm />));
    await user.type(screen.getByLabelText(en['auth.newPassword.label']), 'a long new password');
    await user.type(
      screen.getByLabelText(en['auth.newPassword.confirmLabel']),
      'a different password',
    );
    await user.click(screen.getByRole('button', { name: en['auth.newPassword.submit'] }));

    expect(screen.getByText(en['auth.newPassword.mismatch'])).toBeInTheDocument();
    expect(completePasswordReset).not.toHaveBeenCalled();
  });

  it('says the link expired rather than blaming the password', async () => {
    searchParams.set('token', 'a-stale-token');
    completePasswordReset.mockRejectedValue(
      new ApiError({
        code: 'VALIDATION_FAILED',
        status: 422,
        messageCode: 'validation_failed',
        retryable: false,
        details: {},
        correlationId: null,
        retryAfterSeconds: null,
      }),
    );
    const user = userEvent.setup();

    render(mount(<ResetPasswordForm />));
    await user.type(screen.getByLabelText(en['auth.newPassword.label']), 'a long new password');
    await user.type(
      screen.getByLabelText(en['auth.newPassword.confirmLabel']),
      'a long new password',
    );
    await user.click(screen.getByRole('button', { name: en['auth.newPassword.submit'] }));

    expect(screen.getByText(en['auth.newPassword.linkInvalid'])).toBeInTheDocument();
  });

  it('tells a rate limited person how long to wait, in minutes', async () => {
    searchParams.set('token', 'a-token-from-the-email');
    completePasswordReset.mockRejectedValue(
      new ApiError({
        code: 'RATE_LIMITED',
        status: 429,
        messageCode: 'rate_limited',
        retryable: true,
        details: {},
        correlationId: null,
        retryAfterSeconds: 120,
      }),
    );
    const user = userEvent.setup();

    render(mount(<ResetPasswordForm />));
    await user.type(screen.getByLabelText(en['auth.newPassword.label']), 'a long new password');
    await user.type(
      screen.getByLabelText(en['auth.newPassword.confirmLabel']),
      'a long new password',
    );
    await user.click(screen.getByRole('button', { name: en['auth.newPassword.submit'] }));

    expect(screen.getByText(/2 minutes/)).toBeInTheDocument();
  });
});
