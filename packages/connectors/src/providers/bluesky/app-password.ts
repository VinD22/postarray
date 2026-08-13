import {
  REMEDIATION,
  SecretValue,
  ensureOk,
  parseProviderBody,
  type Clock,
  type CredentialResult,
  type HttpClient,
} from '../shared/contract-shape';
import { systemClock } from '../../ports';

import { atprotoSessionSchema } from './schemas';

/**
 * Bluesky app password exchange.
 *
 * The AT Protocol's OAuth profile is not the authorization-code flow the rest
 * of this codebase implements, which is why the connector declares
 * `flavor: 'provider_specific'`. What Bluesky does document for programmatic
 * clients is an app password: a revocable, scoped credential a person creates
 * at https://bsky.app/settings/app-passwords and can revoke there at any time.
 * We never ask for a main account password.
 *
 * This function owns the HTTP shape and the response schema, because the
 * provider package owns provider facts. It returns a `CredentialResult` and
 * nothing else: the caller encrypts the session pair through the vault, and the
 * app password is dropped the moment this call returns. It is never persisted,
 * never logged and never placed on the returned object.
 *
 * Source (re-verify before changing):
 * https://docs.bsky.app/docs/api/com-atproto-server-create-session
 */

const PROVIDER = 'bluesky' as const;
const OPERATION = 'bluesky.create_session';

export interface AppPasswordSessionInput {
  readonly http: HttpClient;
  /** The connector-declared session endpoint, including the configured PDS host. */
  readonly sessionUrl: string;
  /** A handle, a DID or an email. The provider decides which it recognizes. */
  readonly identifier: string;
  readonly appPassword: SecretValue;
  /** The scopes the connector declares for this grant. */
  readonly grantedScopes: readonly string[];
  readonly clock?: Clock;
}

export async function createAppPasswordSession(
  input: AppPasswordSessionInput,
): Promise<CredentialResult> {
  const clock = input.clock ?? systemClock;
  const response = await input.http.request({
    method: 'POST',
    url: input.sessionUrl,
    json: { identifier: input.identifier, password: input.appPassword.reveal() },
    accept: 'json',
    provider: PROVIDER,
    operation: OPERATION,
  });
  ensureOk(response, {
    provider: PROVIDER,
    operation: OPERATION,
    response,
    // A rejected app password is a person-fixable problem, not an outage.
    remediationCode: REMEDIATION.reconnectAccount,
  });
  const session = parseProviderBody(atprotoSessionSchema, response, {
    provider: PROVIDER,
    operation: OPERATION,
    response,
  });

  return {
    accessToken: new SecretValue(session.accessJwt, 'access_token'),
    refreshToken: new SecretValue(session.refreshJwt, 'refresh_token'),
    tokenType: 'bearer',
    // The AT Protocol returns no expiry. The access JWT is short lived and the
    // connector refreshes proactively rather than guessing a lifetime, which is
    // also why the authorization definition sets `supportsRefresh: true`.
    expiresAt: null,
    grantedScopes: [...input.grantedScopes],
    refreshTokenRotated: true,
    obtainedAt: clock.now().toISOString(),
  };
}
