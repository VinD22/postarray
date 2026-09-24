import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { en } from '@relay/i18n/messages';
import { I18nProvider } from '@relay/i18n/react';

const claimOAuth = vi.fn();
let keyCounter = 0;

vi.mock('next/navigation', () => ({
  useSearchParams: () =>
    new URLSearchParams('status=select&provider=facebook&transactionId=otx_1'),
}));
vi.mock('@/lib/auth/session-context', () => ({ useWorkspaceId: () => 'ws_1' }));
vi.mock('@/lib/api', () => ({
  keys: { workspace: (id: string) => ['ws', id] },
  newIdempotencyKey: (prefix: string) => `${prefix}_${++keyCounter}`,
  api: {
    connections: {
      getOAuthAccountSelection: () =>
        Promise.resolve({
          transactionId: 'otx_1',
          provider: 'facebook',
          expiresAt: '2026-09-24T10:00:00.000Z',
          accounts: [
            { externalAccountId: 'p1', displayName: 'Cafe Verde', handle: 'cafeverde', eligible: true },
            { externalAccountId: 'p2', displayName: 'Old Page', handle: null, eligible: false },
          ],
        }),
      claimOAuth: (...args: unknown[]) => claimOAuth(...args),
    },
  },
}));

import { OAuthAccountSelectionPanel } from './oauth-account-selection';

function mount(node: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <I18nProvider locale="en" catalog={en} timeZone="Europe/Madrid">
        {node}
      </I18nProvider>
    </QueryClientProvider>,
  );
}

describe('OAuth account selection', () => {
  it('reuses one idempotency key on retry and cannot claim again after success', async () => {
    claimOAuth.mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce([]);
    const user = userEvent.setup();
    mount(<OAuthAccountSelectionPanel />);

    await user.click(await screen.findByRole('checkbox', { name: /Cafe Verde/ }));
    const connect = screen.getByRole('button', { name: en['connection.oauth.connectSelected'] });
    await user.click(connect);
    await screen.findByText(en['connection.oauth.claimFailed']);
    await user.click(screen.getByRole('button', { name: en['connection.oauth.connectSelected'] }));
    await screen.findByText(en['connection.oauth.claimComplete']);

    expect(claimOAuth).toHaveBeenCalledTimes(2);
    expect(claimOAuth.mock.calls[0]?.[1]).toBe(claimOAuth.mock.calls[1]?.[1]);
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: en['connection.oauth.connectSelected'] }),
      ).not.toBeInTheDocument(),
    );
    expect(screen.getByRole('checkbox', { name: /Cafe Verde/ })).toBeDisabled();
  });

  it('names an ineligible account without concatenating translated fragments', async () => {
    claimOAuth.mockReset();
    mount(<OAuthAccountSelectionPanel />);
    expect(await screen.findByText(en['connection.oauth.accountUnavailable'])).toBeInTheDocument();
    expect(screen.getByText('@cafeverde')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Old Page/ })).toBeDisabled();
  });
});
