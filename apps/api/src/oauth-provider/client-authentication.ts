import { Inject, Injectable } from '@nestjs/common';
import { ForbiddenError } from '@relay/contracts';

import type { Clock } from '../application/port';
import { CLOCK } from '../application/tokens';
import { requireEpochMillis } from '../common/instant';
import { CredentialDirectory } from '../security/credential-directory';
import { secretMatches } from '../security/credentials';
import type { OAuthClientRecord } from '../security/records';

/**
 * Client authentication for the token, revocation and introspection endpoints.
 *
 * A public client has no secret: PKCE is what binds its exchange. A
 * confidential client must present its current secret, or the previous one
 * during the 24 hour rotation overlap. Every failure is the same
 * `invalid_client`, so the endpoint cannot be used to learn which client ids
 * exist.
 */
@Injectable()
export class OAuthClientAuthenticator {
  constructor(
    private readonly directory: CredentialDirectory,
    @Inject(CLOCK) private readonly clock: Clock,
  ) {}

  async authenticate(
    clientId: string,
    clientSecret: string | undefined,
  ): Promise<OAuthClientRecord> {
    const client = await this.directory.getOAuthClient(clientId);
    if (client === null) {
      throw new ForbiddenError({ details: { reason: 'invalid_client' } });
    }
    if (client.clientType === 'public') {
      return client;
    }
    if (clientSecret === undefined) {
      throw new ForbiddenError({ details: { reason: 'invalid_client' } });
    }
    const pepper = this.directory.pepper;
    const currentMatches =
      client.secretHash !== null && secretMatches(clientSecret, client.secretHash, pepper);
    const previousLive =
      client.previousSecretExpiresAt !== null &&
      requireEpochMillis(client.previousSecretExpiresAt) > this.clock.now().getTime();
    const previousMatches =
      previousLive &&
      client.previousSecretHash !== null &&
      secretMatches(clientSecret, client.previousSecretHash, pepper);
    if (!currentMatches && !previousMatches) {
      throw new ForbiddenError({ details: { reason: 'invalid_client' } });
    }
    return client;
  }
}
