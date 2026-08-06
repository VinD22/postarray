import { Inject, Injectable } from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type {
  ActorContext,
  CreatedOAuthAppView,
  CursorQuery,
  OAuthAppView,
  OAuthGrantView,
  Services,
} from '../../application/port';
import { SERVICES } from '../../application/tokens';
import { CredentialDirectory } from '../../security/credential-directory';
import type {
  CreateOAuthAppInput,
  UpdateOAuthAppInput,
} from './developer-apps.schemas';

/**
 * Developer OAuth application management.
 *
 * Revoking a grant has to be effective within seconds, which is exactly why
 * third-party access tokens are opaque reference tokens rather than JWTs. The
 * durable revocation is the application layer's; dropping the edge's token
 * records is this class's, and it is what makes the next request fail.
 */
@Injectable()
export class DeveloperAppsService {
  constructor(
    @Inject(SERVICES) private readonly services: Services,
    private readonly directory: CredentialDirectory,
  ) {}

  list(ctx: ActorContext, query: CursorQuery): Promise<Paginated<OAuthAppView>> {
    return this.services.oauthApps.list(ctx, query);
  }

  get(ctx: ActorContext, appId: string): Promise<OAuthAppView> {
    return this.services.oauthApps.get(ctx, appId);
  }

  create(ctx: ActorContext, input: CreateOAuthAppInput): Promise<CreatedOAuthAppView> {
    return this.services.oauthApps.create(ctx, input);
  }

  update(ctx: ActorContext, appId: string, patch: UpdateOAuthAppInput): Promise<OAuthAppView> {
    return this.services.oauthApps.update(ctx, appId, patch);
  }

  rotateSecret(ctx: ActorContext, appId: string): Promise<CreatedOAuthAppView> {
    return this.services.oauthApps.rotateSecret(ctx, appId);
  }

  delete(ctx: ActorContext, appId: string): Promise<void> {
    return this.services.oauthApps.delete(ctx, appId);
  }

  listGrants(ctx: ActorContext, query: CursorQuery): Promise<Paginated<OAuthGrantView>> {
    return this.services.oauthApps.listGrants(ctx, query);
  }

  async revokeGrant(ctx: ActorContext, grantId: string): Promise<void> {
    await this.services.oauthApps.revokeGrant(ctx, grantId);
    await this.directory.revokeGrantTokens(grantId);
  }
}
