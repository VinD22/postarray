import { describe, expect, it } from 'vitest';

import { RelayError } from '@relay/contracts';

import { bearerFromHeader, createIntrospectionVerifier } from './verifier';
import type { IntrospectionTransport } from './verifier';
import { approvalLevelSatisfies, authorizeCall } from './authorize';
import { buildAuthenticateChallenge, buildProtectedResourceMetadata } from './metadata';

const RESOURCE = 'https://mcp.relay.example/mcp';
const INTROSPECTION = 'https://api.relay.example/oauth/introspect';
const NOW = Date.parse('2026-08-04T12:00:00.000Z');

function transportReturning(
  body: unknown,
  status = 200,
): IntrospectionTransport & {
  calls: { url: string; form: Record<string, string> }[];
} {
  const calls: { url: string; form: Record<string, string> }[] = [];
  return {
    calls,
    async post(url, form) {
      calls.push({ url, form: { ...form } });
      return { status, body: JSON.stringify(body) };
    },
  };
}

function verifier(transport: IntrospectionTransport) {
  return createIntrospectionVerifier({
    introspectionUrl: INTROSPECTION,
    resourceUrl: RESOURCE,
    transport,
    clientId: 'mcp-resource-server',
    clientSecret: 'not-a-real-secret',
    clock: { now: () => NOW },
  });
}

const ACTIVE = {
  active: true,
  sub: 'user_01',
  client_id: 'rly_pk_agent',
  grant_id: 'grant_01',
  workspace_id: 'ws_01',
  scope: 'accounts:read drafts:read',
  approval_level: 'level_2_scheduled',
  aud: [RESOURCE],
  exp: Math.floor(NOW / 1000) + 3600,
  locale: 'en',
};

describe('audience binding', () => {
  it('accepts a token whose audience is this resource', async () => {
    const grant = await verifier(transportReturning(ACTIVE)).verify('token');
    expect(grant.workspaceId).toBe('ws_01');
    expect(grant.scopes).toEqual(['accounts:read', 'drafts:read']);
    expect(grant.approvalLevel).toBe('level_2_scheduled');
  });

  it('rejects a token minted for another service', async () => {
    const other = { ...ACTIVE, aud: ['https://someone-else.example/mcp'] };
    await expect(verifier(transportReturning(other)).verify('token')).rejects.toSatisfy(
      (error: unknown) => RelayError.is(error) && error.details['reason'] === 'AUDIENCE_MISMATCH',
    );
  });

  it('rejects a token with no audience at all', async () => {
    const { aud: _aud, ...withoutAudience } = ACTIVE;
    await expect(verifier(transportReturning(withoutAudience)).verify('token')).rejects.toSatisfy(
      (error: unknown) => RelayError.is(error) && error.details['reason'] === 'AUDIENCE_MISMATCH',
    );
  });

  it('does not accept a prefix of this resource', async () => {
    const lookalike = { ...ACTIVE, aud: ['https://mcp.relay.example.attacker.test/mcp'] };
    await expect(verifier(transportReturning(lookalike)).verify('token')).rejects.toThrow();
  });

  it('tolerates a trailing slash difference and nothing more', async () => {
    const grant = await verifier(transportReturning({ ...ACTIVE, aud: [`${RESOURCE}/`] })).verify(
      'token',
    );
    expect(grant.subject).toBe('user_01');
  });
});

describe('token state', () => {
  it('rejects an inactive token', async () => {
    await expect(verifier(transportReturning({ active: false })).verify('t')).rejects.toSatisfy(
      (error: unknown) => RelayError.is(error) && error.details['reason'] === 'TOKEN_INACTIVE',
    );
  });

  it('rejects an expired token even if introspection says active', async () => {
    const expired = { ...ACTIVE, exp: Math.floor(NOW / 1000) - 1 };
    await expect(verifier(transportReturning(expired)).verify('t')).rejects.toSatisfy(
      (error: unknown) => RelayError.is(error) && error.details['reason'] === 'TOKEN_EXPIRED',
    );
  });

  it('rejects a killed grant', async () => {
    await expect(
      verifier(transportReturning({ ...ACTIVE, killed: true })).verify('t'),
    ).rejects.toSatisfy(
      (error: unknown) => RelayError.is(error) && error.details['reason'] === 'GRANT_DISABLED',
    );
  });

  it('rejects an active token that does not identify its exact grant', async () => {
    const { grant_id: _grantId, ...withoutGrantId } = ACTIVE;
    await expect(verifier(transportReturning(withoutGrantId)).verify('t')).rejects.toSatisfy(
      (error: unknown) => RelayError.is(error) && error.details['reason'] === 'TOKEN_INCOMPLETE',
    );
  });

  it('rejects an empty token without calling the issuer', async () => {
    const transport = transportReturning(ACTIVE);
    await expect(verifier(transport).verify('   ')).rejects.toThrow();
    expect(transport.calls).toHaveLength(0);
  });

  it('falls back to the least privileged approval level for an unknown one', async () => {
    const grant = await verifier(
      transportReturning({ ...ACTIVE, approval_level: 'level_9_yolo' }),
    ).verify('t');
    expect(grant.approvalLevel).toBe('level_0_read');
  });

  it('sends the resource it serves and its own client credentials', async () => {
    const transport = transportReturning(ACTIVE);
    await verifier(transport).verify('t');
    expect(transport.calls[0]?.form).toMatchObject({
      resource: RESOURCE,
      client_id: 'mcp-resource-server',
      token_type_hint: 'access_token',
    });
  });

  it('reports an unreachable or failing authorization server as unavailable, not as a bad token', async () => {
    const unavailable = (error: unknown): boolean =>
      RelayError.is(error) && error.code === 'PROVIDER_UNAVAILABLE' && error.status === 503;

    for (const status of [500, 502, 503, 429]) {
      await expect(verifier(transportReturning({}, status)).verify('t')).rejects.toSatisfy(
        unavailable,
      );
    }
    // Our own client refused is a deployment fault, not the caller's token.
    await expect(verifier(transportReturning({}, 401)).verify('t')).rejects.toSatisfy(unavailable);

    const throwing: IntrospectionTransport = {
      async post() {
        throw new Error('ECONNREFUSED');
      },
    };
    await expect(verifier(throwing).verify('t')).rejects.toSatisfy(unavailable);

    const garbled: IntrospectionTransport = {
      async post() {
        return { status: 200, body: '<html>bad gateway</html>' };
      },
    };
    await expect(verifier(garbled).verify('t')).rejects.toSatisfy(unavailable);
  });

  it('does not cache a failure: the next call asks again', async () => {
    let calls = 0;
    const flaky: IntrospectionTransport = {
      async post() {
        calls += 1;
        return calls === 1
          ? { status: 503, body: '' }
          : { status: 200, body: JSON.stringify(ACTIVE) };
      },
    };
    const instance = verifier(flaky);
    await expect(instance.verify('t')).rejects.toThrow();
    const grant = await instance.verify('t');
    expect(grant.grantId).toBe('grant_01');
    // And a success is cached, so a burst of tool calls costs one introspection.
    await instance.verify('t');
    expect(calls).toBe(2);
  });

  it('drops scopes it does not recognise instead of trusting them', async () => {
    const grant = await verifier(
      transportReturning({ ...ACTIVE, scope: 'accounts:read posts:* everything' }),
    ).verify('t');
    expect(grant.scopes).toEqual(['accounts:read']);
  });
});

describe('bearerFromHeader', () => {
  it('reads a well formed header', () => {
    expect(bearerFromHeader('Bearer abc.def')).toBe('abc.def');
    expect(bearerFromHeader('bearer abc')).toBe('abc');
  });

  it('refuses anything else', () => {
    expect(bearerFromHeader(undefined)).toBeNull();
    expect(bearerFromHeader('Basic abc')).toBeNull();
    expect(bearerFromHeader('Bearer')).toBeNull();
    expect(bearerFromHeader('Bearer a b')).toBeNull();
  });
});

describe('authorizeCall', () => {
  const grant = {
    active: true as const,
    subject: 's',
    clientId: 'c',
    grantId: 'g',
    workspaceId: 'ws',
    scopes: ['posts:schedule'] as const,
    approvalLevel: 'level_2_scheduled' as const,
    audience: [RESOURCE],
    expiresAt: '2026-08-04T13:00:00.000Z',
    locale: 'en',
    killed: false,
  };

  const requirement = {
    toolName: 'schedule_post',
    scopes: ['posts:schedule'] as const,
    approvalLevel: 'level_2_scheduled' as const,
    requiresIdempotencyKey: true,
    requiresHumanConfirmation: false,
  };

  it('allows a satisfied call', () => {
    expect(() => {
      authorizeCall({
        grant: { ...grant, scopes: [...grant.scopes] },
        requirement: { ...requirement, scopes: [...requirement.scopes] },
        idempotencyKey: 'abcdefgh',
        workspaceKilled: false,
      });
    }).not.toThrow();
  });

  it('refuses without an idempotency key', () => {
    expect(() => {
      authorizeCall({
        grant: { ...grant, scopes: [...grant.scopes] },
        requirement: { ...requirement, scopes: [...requirement.scopes] },
        idempotencyKey: undefined,
        workspaceKilled: false,
      });
    }).toThrow();
  });

  it('refuses a killed workspace before anything else', () => {
    try {
      authorizeCall({
        grant: { ...grant, scopes: [...grant.scopes] },
        requirement: { ...requirement, scopes: [...requirement.scopes] },
        idempotencyKey: 'abcdefgh',
        workspaceKilled: true,
      });
      expect.unreachable('should have thrown');
    } catch (error) {
      expect(RelayError.is(error) && error.code).toBe('POLICY_BLOCKED');
    }
  });
});

describe('approvalLevelSatisfies', () => {
  it('is a ladder, not a set', () => {
    expect(approvalLevelSatisfies('level_3_confirm', 'level_0_read')).toBe(true);
    expect(approvalLevelSatisfies('level_2_scheduled', 'level_2_scheduled')).toBe(true);
    expect(approvalLevelSatisfies('level_1_draft', 'level_2_scheduled')).toBe(false);
    expect(approvalLevelSatisfies('level_0_read', 'level_1_draft')).toBe(false);
  });
});

describe('protected resource metadata', () => {
  it('advertises the issuer and header-only bearer', () => {
    const metadata = buildProtectedResourceMetadata({
      resourceUrl: RESOURCE,
      issuerUrl: 'https://api.relay.example',
      scopes: ['accounts:read'],
    });
    expect(metadata.resource).toBe(RESOURCE);
    expect(metadata.authorization_servers).toEqual(['https://api.relay.example']);
    expect(metadata.bearer_methods_supported).toEqual(['header']);
  });

  it('builds a challenge that points at the metadata document', () => {
    const challenge = buildAuthenticateChallenge({
      resourceMetadataUrl: 'https://mcp.relay.example/.well-known/oauth-protected-resource',
      error: 'invalid_token',
      errorDescription: 'AUDIENCE_MISMATCH',
    });
    expect(challenge).toContain('Bearer resource_metadata=');
    expect(challenge).toContain('error="invalid_token"');
    expect(challenge).toContain('AUDIENCE_MISMATCH');
  });
});
