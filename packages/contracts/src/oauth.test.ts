import { describe, expect, it } from 'vitest';

import {
  INACTIVE_INTROSPECTION,
  oauthIntrospectionRequestSchema,
  oauthIntrospectionResponseSchema,
} from './oauth';

describe('the introspection contract', () => {
  it('accepts the RFC 8707 resource the MCP server sends', () => {
    const parsed = oauthIntrospectionRequestSchema.safeParse({
      token: 'rly_at_abcdefgh_0123456789abcdef',
      token_type_hint: 'access_token',
      client_id: 'rly_rs_mcp_client',
      client_secret: 'a-secret-of-some-length',
      resource: 'https://mcp.postarray.com/mcp',
    });
    expect(parsed.success).toBe(true);
  });

  it('refuses a request without client authentication', () => {
    expect(
      oauthIntrospectionRequestSchema.safeParse({
        token: 'rly_at_abcdefgh_0123456789abcdef',
        client_id: 'rly_rs_mcp_client',
      }).success,
    ).toBe(false);
  });

  it('carries the grant fields a resource server needs, and ignores unknown ones', () => {
    const parsed = oauthIntrospectionResponseSchema.parse({
      active: true,
      sub: 'user_1',
      client_id: 'rly_dc_claude',
      grant_id: 'grant_1',
      workspace_id: 'ws_1',
      scope: 'drafts:read',
      approval_level: 'level_2_scheduled',
      aud: 'https://mcp.postarray.com/mcp',
      exp: 1_790_000_000,
      locale: 'en',
      killed: false,
      future_field: 'ignored',
    });
    expect(parsed).not.toHaveProperty('future_field');
    expect(parsed.grant_id).toBe('grant_1');
    expect(parsed.workspace_id).toBe('ws_1');
  });

  it('answers inactive with nothing else', () => {
    expect(INACTIVE_INTROSPECTION).toEqual({ active: false });
  });
});
