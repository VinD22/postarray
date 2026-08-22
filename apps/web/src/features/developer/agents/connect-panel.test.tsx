import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nProvider } from '@relay/i18n/react';
import { en } from '@relay/i18n/messages';

import { ConnectPanel } from './connect-panel';
import { CREDENTIAL_ENV_VAR } from '../lib/setup-snippets';

/**
 * What this holds is the part of the connect screen that cannot be recovered
 * if it is wrong: that a credential shown once says so, that it cannot be read
 * again after the person acknowledges it, and that a workspace with no
 * recorded call says exactly that instead of implying silence means idle.
 */

function mount(node: ReactNode): ReactElement {
  return (
    <I18nProvider locale="en" catalog={en} timeZone="UTC">
      {node}
    </I18nProvider>
  );
}

const BASE = {
  mcpEndpoint: 'https://mcp.relay.example/mcp',
  apiBaseUrl: 'https://api.relay.example',
  serviceAccountName: 'Content agent',
  onCredentialAcknowledged: () => undefined,
};

describe('connect panel, credential shown once', () => {
  it('shows the secret with a copy affordance and says it is the only time', () => {
    render(
      mount(
        <ConnectPanel
          {...BASE}
          credential={{ value: 'rly_sa_the_only_copy', expiresAt: null }}
          lastUsedAt={null}
        />,
      ),
    );

    expect(screen.getByText('This is the only time this credential is shown')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  it('replaces the value with an explanation once it is acknowledged, with no way back', async () => {
    const user = userEvent.setup();
    const onAcknowledge = vi.fn();
    render(
      mount(
        <ConnectPanel
          {...BASE}
          onCredentialAcknowledged={onAcknowledge}
          credential={{ value: 'rly_sa_the_only_copy', expiresAt: null }}
          lastUsedAt={null}
        />,
      ),
    );

    await user.click(screen.getByRole('button', { name: 'I have stored this credential' }));

    expect(onAcknowledge).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: 'Show credential' })).not.toBeInTheDocument();
    expect(screen.queryByText('rly_sa_the_only_copy')).not.toBeInTheDocument();
  });

  it('never implies a credential can be retrieved when none is on screen', () => {
    render(mount(<ConnectPanel {...BASE} credential={null} lastUsedAt={null} />));

    expect(
      screen.getByText(/Relay keeps only a hash of it, so this screen cannot show it to you again/),
    ).toBeInTheDocument();
    expect(screen.getByText(/rotate the credential/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Show credential' })).not.toBeInTheDocument();
  });
});

describe('connect panel, client configuration', () => {
  it('offers the five clients plus the CLI and swaps the file name with the choice', async () => {
    const user = userEvent.setup();
    render(mount(<ConnectPanel {...BASE} credential={null} lastUsedAt={null} />));

    for (const label of ['Claude Code', 'Claude Desktop', 'Codex', 'Cursor', 'Any MCP client']) {
      expect(screen.getByRole('radio', { name: label })).toBeInTheDocument();
    }

    expect(screen.getByText('Save this as .mcp.json.')).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Cursor' }));
    expect(screen.getByText('Save this as .cursor/mcp.json.')).toBeInTheDocument();
  });

  it('puts the environment variable in the snippet, never a literal credential', () => {
    render(
      mount(
        <ConnectPanel
          {...BASE}
          credential={{ value: 'rly_sa_the_only_copy', expiresAt: null }}
          lastUsedAt={null}
        />,
      ),
    );

    const snippet = screen.getByText(/mcpServers/).textContent ?? '';
    expect(snippet).toContain(CREDENTIAL_ENV_VAR);
    expect(snippet).not.toContain('rly_sa_the_only_copy');
  });
});

describe('connect panel, recorded activity', () => {
  it('says no call has been recorded rather than showing a zero or a date', () => {
    render(mount(<ConnectPanel {...BASE} credential={null} lastUsedAt={null} />));

    expect(screen.getByText(/No call from this agent has been recorded/)).toBeInTheDocument();
  });

  it('claims nothing at all when the activity read failed', () => {
    render(mount(<ConnectPanel {...BASE} credential={null} lastUsedAt={undefined} />));

    expect(screen.getByText(/could not be read, so nothing is shown here/)).toBeInTheDocument();
    expect(screen.queryByText(/No call from this agent/)).not.toBeInTheDocument();
  });

  it('reports the recorded last call when there is one', () => {
    render(
      mount(<ConnectPanel {...BASE} credential={null} lastUsedAt={new Date().toISOString()} />),
    );

    expect(screen.getByText(/Last call from this agent/)).toBeInTheDocument();
  });
});
