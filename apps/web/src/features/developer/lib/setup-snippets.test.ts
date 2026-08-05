import { describe, expect, it } from 'vitest';

import { CREDENTIAL_ENV_VAR, SETUP_CLIENTS, buildSnippet } from './setup-snippets';

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
    for (const clientId of ['claude-code', 'generic-mcp']) {
      expect(() => JSON.parse(buildSnippet(clientId, input))).not.toThrow();
    }
  });

  it('sends an idempotency key with every write in the workflow snippet', () => {
    const snippet = buildSnippet('buzz', input);
    expect(snippet.match(/idempotency_key/g)).toHaveLength(2);
  });

  it('falls back to the generic MCP shape for an unknown client', () => {
    expect(buildSnippet('something-else', input)).toBe(buildSnippet('generic-mcp', input));
  });
});
