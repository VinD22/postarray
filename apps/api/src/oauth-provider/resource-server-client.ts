import { newIdFor } from '@relay/contracts';
import type { RelayConfig } from '@relay/config';

import type { KeyValueStore } from '../application/port';
import { CREDENTIAL_KEYS } from '../security/credential-directory';
import { hashSecret } from '../security/credentials';
import { oauthClientRecordSchema, type OAuthClientRecord } from '../security/records';

/**
 * The MCP server's own confidential client.
 *
 * The MCP server is a resource server: it never runs the authorization flow,
 * it only calls `/oauth/introspect` with `MCP_CLIENT_ID` and
 * `MCP_CLIENT_SECRET`. That client has to exist in the credential directory
 * with the same secret, digested with the same pepper the API uses, or every
 * introspection answers `invalid_client` and every Claude call is a 401.
 *
 * Idempotent: running it again rewrites the digest (so rotating the secret is
 * "change the env, run it again") and keeps the client's identity and creation
 * time. It never prints or returns the secret.
 */

export interface ResourceServerClientResult {
  readonly clientId: string;
  readonly created: boolean;
}

export class ResourceServerClientConfigError extends Error {
  constructor(readonly missing: readonly string[]) {
    super(`Missing configuration: ${missing.join(', ')}`);
    this.name = 'ResourceServerClientConfigError';
  }
}

export async function ensureResourceServerClient(
  kv: KeyValueStore,
  config: RelayConfig,
  now: Date,
): Promise<ResourceServerClientResult> {
  const { clientId, clientSecret, resourceUrl } = config.oauth.resourceServer;
  const pepper = config.oauth.signingLocalKey ?? config.oauth.signingKmsKeyId;
  const missing = [
    ...(clientId === undefined ? ['MCP_CLIENT_ID'] : []),
    ...(clientSecret === undefined ? ['MCP_CLIENT_SECRET'] : []),
    ...(resourceUrl === undefined ? ['MCP_RESOURCE_URL'] : []),
    ...(pepper === undefined ? ['OAUTH_SIGNING_LOCAL_KEY'] : []),
  ];
  if (
    missing.length > 0 ||
    clientId === undefined ||
    clientSecret === undefined ||
    pepper === undefined
  ) {
    throw new ResourceServerClientConfigError(missing);
  }

  const key = CREDENTIAL_KEYS.oauthClient(clientId);
  const raw = await kv.get(key);
  let existing: OAuthClientRecord | null = null;
  if (raw !== null) {
    try {
      existing = oauthClientRecordSchema.safeParse(JSON.parse(raw)).data ?? null;
    } catch {
      existing = null;
    }
  }

  const record = oauthClientRecordSchema.parse({
    clientId,
    appId: existing?.appId ?? newIdFor('oauthClient'),
    workspaceId: null,
    name: 'Post Array MCP server',
    clientType: 'confidential',
    secretHash: hashSecret(clientSecret, pepper),
    previousSecretHash: null,
    previousSecretExpiresAt: null,
    redirectUris: [],
    homepageUrl: '',
    privacyPolicyUrl: '',
    termsUrl: '',
    logoUrl: null,
    supportEmail: '',
    allowedScopes: [],
    firstParty: true,
    registration: 'resource_server',
    disabledAt: null,
    createdAt: existing?.createdAt ?? now.toISOString(),
  });
  await kv.set(key, JSON.stringify(record));
  return { clientId, created: existing === null };
}

/**
 * Register the MCP server's client at API start-up when it is configured.
 *
 * The directory lives in Redis, which a production box keeps on its private
 * network, so a separate script run from a laptop cannot reach it. Doing it on
 * every boot also makes rotating the secret "change the env and restart".
 * Returns `null`, and writes nothing, when no MCP variable is set at all; a
 * partial configuration is an error the caller logs.
 */
export async function registerResourceServerClientAtBoot(
  kv: KeyValueStore,
  config: RelayConfig,
  now: Date,
): Promise<ResourceServerClientResult | null> {
  const { clientId, clientSecret, resourceUrl } = config.oauth.resourceServer;
  if (clientId === undefined && clientSecret === undefined && resourceUrl === undefined) {
    return null;
  }
  return ensureResourceServerClient(kv, config, now);
}
