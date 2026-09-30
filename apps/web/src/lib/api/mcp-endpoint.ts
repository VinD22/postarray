/**
 * The remote MCP endpoint people paste into Claude and other MCP clients.
 *
 * `NEXT_PUBLIC_POSTARRAY_MCP_URL` wins when it is set, and it must equal the
 * MCP server's `MCP_RESOURCE_URL` exactly, path included, because tokens are
 * bound to that string. When it is not set the endpoint is derived from the
 * API URL by the deployment convention: `https://api.<domain>` serves the
 * MCP server at `https://mcp.<domain>/mcp`, and a local API on port 3001 has
 * the MCP server on port 3003. Anything else yields an empty string, which the
 * connect screen shows as "not configured" rather than guessing a URL.
 */

export interface McpEndpointEnvironment {
  readonly mcpUrl?: string | undefined;
  readonly apiUrl?: string | undefined;
}

function trimmed(value: string | undefined): string | null {
  const raw = value?.trim();
  return raw === undefined || raw.length === 0 ? null : raw.replace(/\/+$/, '');
}

export function readMcpEndpoint(
  environment: McpEndpointEnvironment = {
    mcpUrl: process.env.NEXT_PUBLIC_POSTARRAY_MCP_URL,
    apiUrl: process.env.NEXT_PUBLIC_POSTARRAY_API_URL,
  },
): string {
  const explicit = trimmed(environment.mcpUrl);
  if (explicit !== null) {
    return explicit;
  }
  const api = trimmed(environment.apiUrl);
  if (api === null) {
    return '';
  }
  let url: URL;
  try {
    url = new URL(api);
  } catch {
    return '';
  }
  if (url.hostname.startsWith('api.')) {
    return `${url.protocol}//mcp.${url.hostname.slice('api.'.length)}/mcp`;
  }
  if ((url.hostname === 'localhost' || url.hostname === '127.0.0.1') && url.port === '3001') {
    return `${url.protocol}//${url.hostname}:3003/mcp`;
  }
  return '';
}

export const mcpEndpoint: string = readMcpEndpoint();
