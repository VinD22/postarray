import { describe, expect, it } from 'vitest';

import { readMcpEndpoint } from './mcp-endpoint';

describe('readMcpEndpoint', () => {
  it('uses the configured endpoint exactly, without a trailing slash', () => {
    expect(
      readMcpEndpoint({
        mcpUrl: ' https://mcp.postarray.com/mcp/ ',
        apiUrl: 'https://api.example.test',
      }),
    ).toBe('https://mcp.postarray.com/mcp');
  });

  it('derives the production endpoint from the API host', () => {
    expect(readMcpEndpoint({ apiUrl: 'https://api.postarray.com' })).toBe(
      'https://mcp.postarray.com/mcp',
    );
  });

  it('derives the local endpoint from the local API port', () => {
    expect(readMcpEndpoint({ apiUrl: 'http://localhost:3001' })).toBe('http://localhost:3003/mcp');
  });

  it('guesses nothing for any other host', () => {
    expect(readMcpEndpoint({ apiUrl: 'https://backend.example.test' })).toBe('');
    expect(readMcpEndpoint({})).toBe('');
    expect(readMcpEndpoint({ apiUrl: 'not a url' })).toBe('');
  });
});
