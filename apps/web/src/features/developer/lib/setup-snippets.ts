/**
 * Copyable client configuration.
 *
 * Every snippet reads the credential from an environment variable rather than
 * embedding it, because the most common way a service account leaks is a
 * config file committed to a repository. The placeholder name is the same in
 * every one of them, so a user who sets it once is done.
 *
 * This is the only snippet generator. The product's connect screen and the
 * marketing page both read it, which is what stops the two from documenting
 * different configuration for the same client. `audience` is the only thing
 * that differs between them: the connect screen offers the clients a person
 * actually points at Relay, the marketing page shows everything.
 */

export const CREDENTIAL_ENV_VAR = 'RELAY_SERVICE_TOKEN';

export interface SetupClient {
  readonly id: string;
  readonly labelKey: string;
  readonly language: string;
  readonly filename: string | null;
  /**
   * `client` is an MCP client or the CLI: something a person connects to a
   * workspace, and therefore something the connect screen offers. `workflow`
   * is an orchestrator we document but do not walk anyone through.
   */
  readonly audience: 'client' | 'workflow';
}

export const SETUP_CLIENTS: readonly SetupClient[] = [
  {
    id: 'claude-code',
    labelKey: 'developer.connect.client.claudeCode',
    language: 'json',
    filename: '.mcp.json',
    audience: 'client',
  },
  {
    id: 'claude-desktop',
    labelKey: 'developer.connect.client.claudeDesktop',
    language: 'json',
    filename: 'claude_desktop_config.json',
    audience: 'client',
  },
  {
    id: 'codex',
    labelKey: 'developer.connect.client.codex',
    language: 'toml',
    filename: 'config.toml',
    audience: 'client',
  },
  {
    id: 'cursor',
    labelKey: 'developer.connect.client.cursor',
    language: 'json',
    filename: '.cursor/mcp.json',
    audience: 'client',
  },
  {
    id: 'generic-mcp',
    labelKey: 'developer.connect.client.genericMcp',
    language: 'json',
    filename: 'mcp.json',
    audience: 'client',
  },
  {
    id: 'cli',
    labelKey: 'developer.connect.client.cli',
    language: 'bash',
    filename: null,
    audience: 'client',
  },
  {
    id: 'hermes',
    labelKey: 'developer.setup.hermes',
    language: 'yaml',
    filename: 'hermes.yaml',
    audience: 'workflow',
  },
  {
    id: 'buzz',
    labelKey: 'developer.setup.buzz',
    language: 'yaml',
    filename: 'workflow.yaml',
    audience: 'workflow',
  },
];

/** The clients the connect screen offers, in the order it offers them. */
export const CONNECT_CLIENTS: readonly SetupClient[] = SETUP_CLIENTS.filter(
  (client) => client.audience === 'client',
);

export interface SnippetInput {
  readonly mcpEndpoint: string;
  readonly apiBaseUrl: string;
  readonly serviceAccountName: string;
}

export function buildSnippet(clientId: string, input: SnippetInput): string {
  const { mcpEndpoint, apiBaseUrl, serviceAccountName } = input;
  const token = `\${${CREDENTIAL_ENV_VAR}}`;

  switch (clientId) {
    case 'claude-code':
      return [
        '{',
        '  "mcpServers": {',
        '    "relay": {',
        '      "type": "http",',
        `      "url": "${mcpEndpoint}",`,
        '      "headers": {',
        `        "Authorization": "Bearer ${token}"`,
        '      }',
        '    }',
        '  }',
        '}',
      ].join('\n');

    case 'claude-desktop':
      return [
        '{',
        '  "mcpServers": {',
        '    "relay": {',
        '      "command": "npx",',
        '      "args": ["-y", "mcp-remote", "' + mcpEndpoint + '"],',
        '      "env": {',
        '        "' + CREDENTIAL_ENV_VAR + '": "' + token + '"',
        '      }',
        '    }',
        '  }',
        '}',
      ].join('\n');

    case 'cursor':
      return [
        '{',
        '  "mcpServers": {',
        '    "relay": {',
        '      "url": "' + mcpEndpoint + '",',
        '      "headers": {',
        '        "Authorization": "Bearer ' + token + '"',
        '      }',
        '    }',
        '  }',
        '}',
      ].join('\n');

    case 'codex':
      return [
        '[mcp_servers.relay]',
        `url = "${mcpEndpoint}"`,
        'transport = "http"',
        '',
        '[mcp_servers.relay.headers]',
        `Authorization = "Bearer ${token}"`,
      ].join('\n');

    case 'hermes':
      return [
        'tools:',
        '  - name: relay',
        '    kind: mcp',
        `    endpoint: ${mcpEndpoint}`,
        '    auth:',
        '      type: bearer',
        `      token: ${token}`,
        `    identity: ${serviceAccountName}`,
      ].join('\n');

    case 'buzz':
      return [
        `name: publish-with-relay`,
        'steps:',
        '  - id: draft',
        '    uses: relay/create-draft@v1',
        '    with:',
        `      api_base_url: ${apiBaseUrl}`,
        `      token: ${token}`,
        '      idempotency_key: ${{ run.id }}',
        '  - id: schedule',
        '    uses: relay/schedule@v1',
        '    with:',
        '      content_item_id: ${{ steps.draft.outputs.content_item_id }}',
        '      idempotency_key: ${{ run.id }}-schedule',
      ].join('\n');

    case 'cli':
      return [
        `export ${CREDENTIAL_ENV_VAR}="paste-the-credential-here"`,
        `relay config set apiUrl ${apiBaseUrl}`,
        'relay auth login',
        'relay accounts list --json',
        'relay media upload ./launch.png --idempotency-key launch-image-1 --json',
      ].join('\n');

    case 'generic-mcp':
    default:
      return [
        '{',
        '  "name": "relay",',
        '  "transport": "streamable-http",',
        `  "url": "${mcpEndpoint}",`,
        '  "headers": {',
        `    "Authorization": "Bearer ${token}"`,
        '  }',
        '}',
      ].join('\n');
  }
}
