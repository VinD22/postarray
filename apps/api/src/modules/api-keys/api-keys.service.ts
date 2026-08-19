import { Inject, Injectable } from '@nestjs/common';
import { ID_PREFIXES, NotFoundError, isId, type Paginated } from '@relay/contracts';

import type {
  ActorContext,
  ApiKeyView,
  Clock,
  CursorQuery,
  Services,
} from '../../application/port';
import { CLOCK, SERVICES } from '../../application/tokens';
import { instantAfter } from '../../common/instant';
import { CredentialDirectory } from '../../security/credential-directory';
import { hashSecret, parseCredential } from '../../security/credentials';
import { apiKeyRecordSchema } from '../../security/records';
import type { CreateApiKeyInput } from './api-keys.schemas';

export interface CreatedApiKey {
  readonly key: ApiKeyView;
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
    const now = this.clock.now();
    const expiresAt = instantAfter(now, input.expiresInDays * 24 * 60 * 60);

    const created = await this.services.apiKeys.create(ctx, {
      name: input.name,
      scopes: input.scopes,
      expiresAt,
    });
    const parsed = parseCredential(created.plaintext);
    if (parsed === null || !isId(ID_PREFIXES.apiKey, created.key.id)) {
      throw new NotFoundError({ details: { resource: 'api_key' } });
    }

    await this.directory.putApiKey(
      apiKeyRecordSchema.parse({
        apiKeyId: created.key.id,
        workspaceId: ctx.workspaceId,
        createdByUserId: created.key.createdByUserId,
        name: input.name,
        publicPrefix: parsed.publicPrefix,
        secretHash: hashSecret(parsed.secret, this.directory.pepper),
        scopes: created.key.scopes,
        approvalLevel: input.approvalLevel,
        projectIds: input.projectIds,
        connectionIds: input.connectionIds,
        ipAllowlist: input.ipAllowlist,
        expiresAt,
        revokedAt: null,
        createdAt: now.toISOString(),
      }),
    );

    return { key: created.key, secret: created.plaintext };
  }

  async revoke(ctx: ActorContext, apiKeyId: string): Promise<void> {
    // The durable record is revoked first. If dropping the edge index then
    // fails, the key is already marked revoked and the next lookup refuses it;
    // the reverse order would leave a revoked key briefly usable, which is the
    // one failure mode a revocation may never have.
    const revoked = await this.services.apiKeys.revoke(ctx, apiKeyId);
    const match = /^rly_ak_([0-9A-Za-z]{8})$/.exec(revoked.prefix);
    if (match?.[1] !== undefined) {
      await this.directory.revokeApiKey(match[1]);
    }
  }
}
