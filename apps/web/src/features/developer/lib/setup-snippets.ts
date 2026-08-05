/**
 * Copyable client configuration.
 *
 * Every snippet reads the credential from an environment variable rather than
 * embedding it, because the most common way a service account leaks is a
 * config file committed to a repository. The placeholder name is the same in
 * all six so a user who sets it once is done.
 */

export const CREDENTIAL_ENV_VAR = 'RELAY_SERVICE_TOKEN';

export interface SetupClient {
  readonly id: string;
  readonly labelKey: string;
  readonly language: string;
  readonly filename: string | null;
}

export const SETUP_CLIENTS: readonly SetupClient[] = [
  {
    id: 'claude-code',
    labelKey: 'developer.setup.claudeCode',
    language: 'json',
    filename: '.mcp.json',
  },
  { id: 'codex', labelKey: 'developer.setup.codex', language: 'toml', filename: 'config.toml' },
  { id: 'hermes', labelKey: 'developer.setup.hermes', language: 'yaml', filename: 'hermes.yaml' },
  { id: 'buzz', labelKey: 'developer.setup.buzz', language: 'yaml', filename: 'workflow.yaml' },
  { id: 'cli', labelKey: 'developer.setup.cli', language: 'bash', filename: null },
  {
    id: 'generic-mcp',
    labelKey: 'developer.setup.genericMcp',
    language: 'json',
    filename: 'mcp.json',
  },
];

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
        `relay auth login --token "${token}" --api-url ${apiBaseUrl}`,
        'relay connections list --json',
        'relay draft create --brief ./brief.md --json',
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
