import { describe, expect, it } from 'vitest';

import { CONNECT_CLIENTS, CREDENTIAL_ENV_VAR, SETUP_CLIENTS, buildSnippet } from './setup-snippets';

const input = {
  mcpEndpoint: 'https://mcp.postarray.com/mcp',
  apiBaseUrl: 'https://api.postarray.com',
  serviceAccountName: 'Content agent',
};

const oauthClients = SETUP_CLIENTS.filter((client) => client.auth === 'oauth');
const tokenClients = SETUP_CLIENTS.filter((client) => client.auth === 'token');

describe('client setup snippets', () => {
  it('gives MCP clients the endpoint alone: they sign in with OAuth, so no credential appears', () => {
    // The MCP server verifies OAuth tokens only. A snippet that sent a service
    // credential as a bearer token would be refused on every call.
    for (const client of oauthClients) {
      const snippet = buildSnippet(client.id, input);
      expect(snippet, client.id).toContain(input.mcpEndpoint);
      expect(snippet, client.id).not.toContain(CREDENTIAL_ENV_VAR);
      expect(snippet, client.id).not.toMatch(/authorization|bearer/i);
    }
  });

  it('reads the credential from the environment for the CLI and workflows, never a literal', () => {
    for (const client of tokenClients) {
      const snippet = buildSnippet(client.id, input);
      expect(snippet, client.id).toContain(CREDENTIAL_ENV_VAR);
      expect(snippet, client.id).toContain(input.apiBaseUrl);
      expect(snippet).not.toMatch(/sk-|token="[A-Za-z0-9]{16,}"/);
    }
  });

  it('gives Claude the exact commands and URL it expects', () => {
    expect(buildSnippet('claude-code', input)).toBe(
      'claude mcp add --transport http postarray https://mcp.postarray.com/mcp',
    );
    expect(buildSnippet('claude-ai', input)).toBe('https://mcp.postarray.com/mcp');
    expect(buildSnippet('claude-desktop', input)).toBe('https://mcp.postarray.com/mcp');
  });

  it('writes a Codex table Codex reads, named postarray', () => {
    const snippet = buildSnippet('codex', input);
    expect(snippet).toBe('[mcp_servers.postarray]\nurl = "https://mcp.postarray.com/mcp"');
    expect(snippet).not.toContain('relay');
    expect(snippet).not.toContain('transport =');
  });

  it('produces parseable JSON for the JSON clients, named postarray', () => {
    for (const clientId of ['cursor', 'generic-mcp']) {
      const parsed = JSON.parse(buildSnippet(clientId, input)) as Record<string, unknown>;
      expect(JSON.stringify(parsed)).toContain('"postarray"');
    }
  });

  it('gives every OAuth client an instruction for what to do with the snippet', () => {
    for (const client of oauthClients) {
      expect(client.hintKey, client.id).toMatch(/^developer\.connect\.hint\./);
    }
  });

  it('sends an idempotency key with every write in the workflow snippet', () => {
    const snippet = buildSnippet('buzz', input);
    expect(snippet.match(/idempotency_key/g)).toHaveLength(2);
  });

  it('offers exactly the clients the connect screen names, and the CLI', () => {
    expect(CONNECT_CLIENTS.map((client) => client.id)).toEqual([
      'claude-ai',
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
