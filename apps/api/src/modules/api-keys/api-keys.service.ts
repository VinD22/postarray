import { Inject, Injectable } from '@nestjs/common';
import { ID_PREFIXES, NotFoundError, isId, type Paginated } from '@relay/contracts';

import type {
  ActorContext,
  ApiKeyView,
  Clock,
  CursorQuery,
  Services,
} from '../../application/port.js';
import { CLOCK, SERVICES } from '../../application/tokens.js';
import { instantAfter } from '../../common/instant.js';
import { CredentialDirectory } from '../../security/credential-directory.js';
import { CREDENTIAL_PREFIXES, issueCredential } from '../../security/credentials.js';
import { apiKeyRecordSchema } from '../../security/records.js';
import type { CreateApiKeyInput } from './api-keys.schemas.js';

export interface CreatedApiKey {
  readonly apiKey: ApiKeyView;
  /**
   * The full credential, shown exactly once. It is never stored, never logged
   * and cannot be recovered. A key the server can read back is a key the server
   * can leak.
   */
  readonly secret: string;
}

/**
 * API key issuance.
 *
 * The plaintext is minted here, at the edge, and only its keyed digest travels
 * anywhere. Two records are written: the durable one, owned by the application
 * layer, which is what the settings screen lists and what the audit log points
 * at; and a verification record in the key value store, which is what
 * `AuthGuard` reads on every request so a revocation takes effect in seconds
 * rather than at the next deploy.
 */
@Injectable()
export class ApiKeysService {
  constructor(
    @Inject(SERVICES) private readonly services: Services,
    @Inject(CLOCK) private readonly clock: Clock,
    private readonly directory: CredentialDirectory,
  ) {}

  list(ctx: ActorContext, query: CursorQuery): Promise<Paginated<ApiKeyView>> {
    return this.services.apiKeys.list(ctx, query);
  }

  async create(ctx: ActorContext, input: CreateApiKeyInput): Promise<CreatedApiKey> {
    const issued = issueCredential(CREDENTIAL_PREFIXES.apiKey, this.directory.pepper);
    const now = this.clock.now();
    const expiresAt = instantAfter(now, input.expiresInDays * 24 * 60 * 60);

    const created = await this.services.apiKeys.create(ctx, {
      name: input.name,
      scopes: input.scopes,
      approvalLevel: input.approvalLevel,
      brandIds: input.brandIds,
      connectionIds: input.connectionIds,
      ipAllowlist: input.ipAllowlist,
      expiresAt,
      publicPrefix: issued.publicPrefix,
      secretHash: issued.secretHash,
    });

    const apiKeyId = created['id'];
    if (typeof apiKeyId !== 'string' || !isId(ID_PREFIXES.apiKey, apiKeyId)) {
      throw new NotFoundError({ details: { resource: 'api_key' } });
    }

    await this.directory.putApiKey(
      apiKeyRecordSchema.parse({
        apiKeyId,
        workspaceId: ctx.workspaceId,
        createdByUserId: created['createdByUserId'],
        name: input.name,
        publicPrefix: issued.publicPrefix,
        secretHash: issued.secretHash,
        scopes: input.scopes,
        approvalLevel: input.approvalLevel,
        brandIds: input.brandIds,
        connectionIds: input.connectionIds,
        ipAllowlist: input.ipAllowlist,
        expiresAt,
        revokedAt: null,
        createdAt: now.toISOString(),
      }),
    );

    return { apiKey: created, secret: issued.plaintext };
  }

  async revoke(ctx: ActorContext, apiKeyId: string): Promise<void> {
    // The durable record is revoked first. If dropping the edge index then
    // fails, the key is already marked revoked and the next lookup refuses it;
    // the reverse order would leave a revoked key briefly usable, which is the
    // one failure mode a revocation may never have.
    const { publicPrefix } = await this.services.apiKeys.revoke(ctx, apiKeyId);
    await this.directory.revokeApiKey(publicPrefix);
  }
}
