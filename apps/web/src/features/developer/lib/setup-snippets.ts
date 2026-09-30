/**
 * Copyable client configuration.
 *
 * Two ways in, and each client uses exactly one:
 *
 * - `oauth`: MCP clients. The remote MCP server verifies OAuth tokens only, so
 *   Claude, Claude Desktop, Claude Code, Codex, Cursor and any spec-following
 *   MCP client connect with the endpoint alone. The client discovers the
 *   authorization server from the server's 401, registers itself, and opens
 *   Post Array so the person can sign in and approve access. Nothing secret
 *   goes into a snippet, so there is nothing to leak from a committed file.
 * - `token`: the CLI and workflow orchestrators, which call the REST API with
 *   a service account credential read from an environment variable. The
 *   placeholder name is the same everywhere, so a person who sets it once is
 *   done.
 *
 * This is the only snippet generator. The product's connect screen and the
 * marketing page both read it, which is what stops the two from documenting
 * different configuration for the same client. `audience` is the only thing
 * that differs between them: the connect screen offers the clients a person
 * actually points at Post Array, the marketing page shows everything.
 */

export const CREDENTIAL_ENV_VAR = 'POSTARRAY_SERVICE_TOKEN';

/** The server name every MCP snippet registers, so tools read `postarray`. */
export const MCP_SERVER_NAME = 'postarray';

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
  /** How the client proves who it is. See the module comment. */
  readonly auth: 'oauth' | 'token';
  /** What to do with the snippet, when saving it as `filename` is not the answer. */
  readonly hintKey?: string;
}

export const SETUP_CLIENTS: readonly SetupClient[] = [
  {
    id: 'claude-ai',
    labelKey: 'developer.connect.client.claudeAi',
    language: 'text',
    filename: null,
    audience: 'client',
    auth: 'oauth',
    hintKey: 'developer.connect.hint.claudeAi',
  },
  {
    id: 'claude-code',
    labelKey: 'developer.connect.client.claudeCode',
    language: 'bash',
    filename: null,
    audience: 'client',
    auth: 'oauth',
    hintKey: 'developer.connect.hint.claudeCode',
  },
  {
    id: 'claude-desktop',
    labelKey: 'developer.connect.client.claudeDesktop',
    language: 'text',
    filename: null,
    audience: 'client',
    auth: 'oauth',
    // Claude Desktop adds remote servers through the same Connectors settings.
    hintKey: 'developer.connect.hint.claudeAi',
  },
  {
    id: 'codex',
    labelKey: 'developer.connect.client.codex',
    language: 'toml',
    filename: 'config.toml',
    audience: 'client',
    auth: 'oauth',
    hintKey: 'developer.connect.hint.codex',
  },
  {
    id: 'cursor',
    labelKey: 'developer.connect.client.cursor',
    language: 'json',
    filename: '.cursor/mcp.json',
    audience: 'client',
    auth: 'oauth',
    hintKey: 'developer.connect.hint.oauthFile',
  },
  {
    id: 'generic-mcp',
    labelKey: 'developer.connect.client.genericMcp',
    language: 'json',
    filename: 'mcp.json',
    audience: 'client',
    auth: 'oauth',
    hintKey: 'developer.connect.hint.oauthFile',
  },
  {
    id: 'cli',
    labelKey: 'developer.connect.client.cli',
    language: 'bash',
    filename: null,
    audience: 'client',
    auth: 'token',
  },
  {
    id: 'hermes',
    labelKey: 'developer.setup.hermes',
    language: 'yaml',
    filename: 'hermes.yaml',
    audience: 'workflow',
    auth: 'token',
  },
  {
    id: 'buzz',
    labelKey: 'developer.setup.buzz',
    language: 'yaml',
    filename: 'workflow.yaml',
    audience: 'workflow',
    auth: 'token',
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
    case 'claude-ai':
    case 'claude-desktop':
      // Pasted into Settings, Connectors, Add custom connector.
      return mcpEndpoint;

    case 'claude-code':
      return `claude mcp add --transport http ${MCP_SERVER_NAME} ${mcpEndpoint}`;

    case 'cursor':
      return [
        '{',
        '  "mcpServers": {',
        `    "${MCP_SERVER_NAME}": {`,
        `      "url": "${mcpEndpoint}"`,
        '    }',
        '  }',
        '}',
      ].join('\n');

    case 'codex':
      return [`[mcp_servers.${MCP_SERVER_NAME}]`, `url = "${mcpEndpoint}"`].join('\n');

    case 'hermes':
      return [
        'tools:',
        `  - name: ${MCP_SERVER_NAME}`,
        '    kind: http',
        `    endpoint: ${apiBaseUrl}`,
        '    auth:',
        '      type: bearer',
        `      token: ${token}`,
        `    identity: ${serviceAccountName}`,
      ].join('\n');

    case 'buzz':
      return [
        `name: publish-with-${MCP_SERVER_NAME}`,
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
        `  "name": "${MCP_SERVER_NAME}",`,
        '  "transport": "streamable-http",',
        `  "url": "${mcpEndpoint}"`,
        '}',
      ].join('\n');
  }
}
