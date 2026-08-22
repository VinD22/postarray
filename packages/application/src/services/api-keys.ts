import { narrowScopes } from '@relay/authz';
import { normalizeScopes, type Paginated, type Scope } from '@relay/contracts';

import type { ActorContext, ApiKeyService, PageQuery, ServiceDeps } from '../types';
import type { ApiKeyView, CreatedApiKeyView } from '../views';

import { recordAudit } from '../internal/audit';
import { HASH_ALGORITHM, mintApiKeySecret } from '../internal/api-key-secret';
import { invalid, notFound } from '../internal/errors';
import { pageArgs, toPage } from '../internal/pagination';
import { authorized } from '../internal/runtime';

/**
 * Workspace API keys.
 *
 * Format `rly_ak_<prefix>_<secret>`. Only the prefix and a hash of the secret
 * are stored, and the plaintext is returned exactly once. Expiry is mandatory:
 * there is no "never expires" option, because a credential nobody remembers
 * creating is the one that leaks.
 *
 * A key can only ever carry a subset of what its creator holds. `narrowScopes`
 * computes `min(requested, creator role, creator credential)`, so an owner's
 * privileges never flow wholesale into an automation identity.
 */

const MAX_EXPIRY_DAYS = 365;

const API_KEY_SELECT = {
  id: true,
  workspaceId: true,
  name: true,
  prefix: true,
  scopes: true,
  createdByUserId: true,
  serviceAccountId: true,
  expiresAt: true,
  lastUsedAt: true,
  revokedAt: true,
  createdAt: true,
} as const;

interface ApiKeyRow {
  id: string;
  workspaceId: string;
  name: string;
  prefix: string;
  scopes: string[];
  createdByUserId: string;
  serviceAccountId: string | null;
  expiresAt: Date | null;
  lastUsedAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
}

function toView(row: ApiKeyRow): ApiKeyView {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    name: row.name,
    prefix: row.prefix,
    scopes: normalizeScopes(row.scopes),
    createdByUserId: row.createdByUserId,
    serviceAccountId: row.serviceAccountId,
    expiresAt: row.expiresAt?.toISOString() ?? null,
    lastUsedAt: row.lastUsedAt?.toISOString() ?? null,
    revokedAt: row.revokedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

export function createApiKeyService(deps: ServiceDeps): ApiKeyService {
  return {
    async list(ctx: ActorContext, query: PageQuery = {}): Promise<Paginated<ApiKeyView>> {
      return authorized(deps, ctx, 'developer.manage', undefined, async (db) => {
        const args = pageArgs(query);
        const rows = await db.apiKey.findMany({
          orderBy: { id: 'desc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: API_KEY_SELECT,
        });
        return toPage(rows, args, (row) => row.id, toView);
      });
    },

    async create(
      ctx: ActorContext,
      input: {
        name: string;
        scopes: readonly Scope[];
        expiresAt: string;
        serviceAccountId?: string | null;
      },
    ): Promise<CreatedApiKeyView> {
      return authorized(deps, ctx, 'developer.manage', undefined, async (db, actor) => {
        const role = actor.policyActor.role;
        if (role === null || actor.userId === null) {
          throw invalid('errors.api_key_requires_member', {});
        }

        const expiresAt = new Date(input.expiresAt);
        if (Number.isNaN(expiresAt.getTime())) {
          throw invalid('errors.api_key_expiry_required', {});
        }
        const now = deps.clock.now();
        if (expiresAt.getTime() <= now.getTime()) {
          throw invalid('errors.api_key_expiry_in_past', {});
        }
        if (expiresAt.getTime() - now.getTime() > MAX_EXPIRY_DAYS * 86_400_000) {
          throw invalid('errors.api_key_expiry_too_far', { maxDays: MAX_EXPIRY_DAYS });
        }

        // A credential cannot mint a wider credential than it holds itself.
        const narrowed = narrowScopes({
          requested: input.scopes,
          grantorRole: role,
          ...(actor.policyActor.actorType === 'user'
            ? {}
            : { holderScopes: actor.policyActor.scopes }),
        });
        if (narrowed.granted.length === 0) {
          throw invalid('errors.api_key_scopes_refused', {
            refused: [...narrowed.refused],
          });
        }

        const minted = mintApiKeySecret();

        const created = await db.apiKey.create({
          data: {
            workspaceId: actor.workspace.id,
            name: input.name,
            prefix: minted.prefix,
            secretHash: minted.storedHash,
            hashAlgorithm: HASH_ALGORITHM,
            scopes: [...narrowed.granted],
            serviceAccountId: input.serviceAccountId ?? null,
            expiresAt,
            createdByUserId: actor.userId,
          },
          select: API_KEY_SELECT,
        });

        await recordAudit(db, actor, {
          action: 'api_key.created',
          targetType: 'api_key',
          targetId: created.id,
          after: {
            prefix: minted.prefix,
            scopes: [...narrowed.granted],
            expiresAt: expiresAt.toISOString(),
          },
          metadata: { refusedScopes: [...narrowed.refused] },
        });

        // The only time the plaintext exists outside the caller's memory.
        return { key: toView(created), plaintext: minted.plaintext };
      });
    },

    async revoke(ctx: ActorContext, apiKeyId: string): Promise<ApiKeyView> {
      return authorized(deps, ctx, 'developer.manage', undefined, async (db, actor) => {
        const before = await db.apiKey.findFirst({
          where: { id: apiKeyId },
          select: API_KEY_SELECT,
        });
        if (before === null) {
          throw notFound('api_key', apiKeyId);
        }
        const after = await db.apiKey.update({
          where: { id: apiKeyId },
          data: { revokedAt: deps.clock.now() },
          select: API_KEY_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'api_key.revoked',
          targetType: 'api_key',
          targetId: apiKeyId,
          before: { revoked: false },
          after: { revoked: true },
        });
        return toView(after);
      });
    },
  };
}
