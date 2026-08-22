import { describe, expect, it } from 'vitest';

import { CONNECT_CLIENTS, CREDENTIAL_ENV_VAR, SETUP_CLIENTS, buildSnippet } from './setup-snippets';

const input = {
  mcpEndpoint: 'https://mcp.relay.example/mcp',
  apiBaseUrl: 'https://api.relay.example/v1',
  serviceAccountName: 'Content agent',
};

describe('client setup snippets', () => {
  it('never embeds a credential literal, only the environment variable', () => {
    for (const client of SETUP_CLIENTS) {
      const snippet = buildSnippet(client.id, input);
      expect(snippet).toContain(CREDENTIAL_ENV_VAR);
      expect(snippet).not.toMatch(/sk-|token="[A-Za-z0-9]{16,}"/);
    }
  });

  it('points every client at the endpoint the workspace was given', () => {
    for (const client of SETUP_CLIENTS) {
      const snippet = buildSnippet(client.id, input);
      const referencesAnEndpoint =
        snippet.includes(input.mcpEndpoint) || snippet.includes(input.apiBaseUrl);
      expect(referencesAnEndpoint).toBe(true);
    }
  });

  it('produces parseable JSON for the two JSON clients', () => {
    for (const clientId of ['claude-code', 'claude-desktop', 'cursor', 'generic-mcp']) {
      expect(() => JSON.parse(buildSnippet(clientId, input))).not.toThrow();
    }
  });

  it('sends an idempotency key with every write in the workflow snippet', () => {
    const snippet = buildSnippet('buzz', input);
    expect(snippet.match(/idempotency_key/g)).toHaveLength(2);
  });

  it('offers exactly the clients the connect screen names, and the CLI', () => {
    expect(CONNECT_CLIENTS.map((client) => client.id)).toEqual([
      'claude-code',
      'claude-desktop',
      'codex',
      'cursor',
      'generic-mcp',
      'cli',
    ]);
  });

  it('only shows CLI commands the CLI actually has', () => {
    // The marketing terminal reads these same lines. A command invented here
    // becomes a promise on a public page, so the vocabulary is pinned.
    const verbs = buildSnippet('cli', input)
      .split('\n')
      .filter((line) => line.startsWith('relay '))
      .map((line) => line.split(' ').slice(1, 3).join(' '));
    expect(verbs).toEqual(['config set', 'auth login', 'accounts list', 'media upload']);
  });

  it('falls back to the generic MCP shape for an unknown client', () => {
    expect(buildSnippet('something-else', input)).toBe(buildSnippet('generic-mcp', input));
  });
});
