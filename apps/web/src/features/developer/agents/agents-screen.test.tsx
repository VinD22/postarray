import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider } from '@relay/i18n/react';
import { en } from '@relay/i18n/messages';

/**
 * The first-run state.
 *
 * An empty agents list is not a failure and not a zero. It is a workspace
 * where nobody has connected an agent yet, so what is asserted here is that
 * the screen explains what connecting one gives you and offers exactly one
 * way to start, rather than rendering an empty table.
 */

vi.mock('../../settings/lib/keys', () => ({
  settingsKey: (workspaceId: string, ...parts: readonly (string | number)[]) => [
    'ws',
    workspaceId,
    'settings',
    ...parts,
  ],
  useWorkspaceId: () => 'ws_test',
}));

vi.mock('../../settings/lib/gateway', () => ({
  agentsGateway: {
    list: () => Promise.resolve([]),
    activity: () => Promise.resolve([]),
    create: () => Promise.reject(new Error('not called')),
    rotate: () => Promise.reject(new Error('not called')),
    setEnabled: () => Promise.resolve(),
    dryRun: () => Promise.reject(new Error('not called')),
  },
  projectsGateway: { list: () => Promise.resolve([]) },
  securityGateway: { connections: () => Promise.resolve([]) },
  workspaceGateway: {
    identity: () =>
      Promise.resolve({
        mcpEndpoint: 'https://mcp.relay.example/mcp',
        apiBaseUrl: 'https://api.relay.example',
      }),
  },
}));

const { AgentsScreen } = await import('./agents-screen');

function mount(node: ReactNode): ReactElement {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <QueryClientProvider client={client}>
      <I18nProvider locale="en" catalog={en} timeZone="UTC">
        {node}
      </I18nProvider>
    </QueryClientProvider>
  );
}

describe('agents screen, first run', () => {
  it('explains what connecting an agent gives you instead of showing an empty table', async () => {
    render(mount(<AgentsScreen />));

    expect(await screen.findByText('Connect an AI agent to this workspace')).toBeInTheDocument();
    expect(screen.getByText(/its own credential, its own limits/)).toBeInTheDocument();
    expect(screen.getByText(/one button stops the agent/)).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('offers exactly one way to start', async () => {
    render(mount(<AgentsScreen />));

    await screen.findByText('Connect an AI agent to this workspace');
    const actions = screen
      .getAllByRole('button')
      .filter((button) => button.textContent === 'Create a service account');
    expect(actions).toHaveLength(2); // the page header action and the empty-state action
  });
});
