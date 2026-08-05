import type { ActorContext, CredentialVaultService, ServiceDeps } from '../types.js';

import { recordAudit } from '../internal/audit.js';
import { notFound } from '../internal/errors.js';
import { authorized } from '../internal/runtime.js';

/**
 * The credential vault, seen from the application layer.
 *
 * No method here returns a token, and none ever will. Decryption happens in the
 * worker immediately before a provider request, and a plaintext token never
 * enters a Temporal history, a log, a trace or a client payload. What a user or
 * an operator needs from this service is a status and a revoke button.
 */
export function createCredentialVaultService(deps: ServiceDeps): CredentialVaultService {
  return {
    async status(
      ctx: ActorContext,
      connectionId: string,
    ): Promise<{
      present: boolean;
      accessTokenExpiresAt: string | null;
      refreshTokenExpiresAt: string | null;
      lastRefreshedAt: string | null;
      needsAction: boolean;
    }> {
      return authorized(deps, ctx, 'connection.read', { connectionId }, async (db) => {
        const connection = await db.socialConnection.findFirst({
          where: { id: connectionId },
          select: { id: true, status: true },
        });
        if (connection === null) {
          throw notFound('connection', connectionId);
        }

        const credential = await db.socialCredential.findFirst({
          where: { connectionId },
          // Only metadata. The ciphertext columns are deliberately not selected.
          select: {
            accessTokenExpiresAt: true,
            refreshTokenExpiresAt: true,
            lastRefreshedAt: true,
            lastRefreshError: true,
          },
        });

        const now = deps.clock.now();
        const expired =
          credential?.accessTokenExpiresAt !== null &&
          credential?.accessTokenExpiresAt !== undefined &&
          credential.accessTokenExpiresAt.getTime() <= now.getTime();

        return {
          present: credential !== null,
          accessTokenExpiresAt: credential?.accessTokenExpiresAt?.toISOString() ?? null,
          refreshTokenExpiresAt: credential?.refreshTokenExpiresAt?.toISOString() ?? null,
          lastRefreshedAt: credential?.lastRefreshedAt?.toISOString() ?? null,
          needsAction:
            credential === null ||
            expired ||
            credential.lastRefreshError !== null ||
            connection.status === 'action_required' ||
            connection.status === 'expired' ||
            connection.status === 'revoked',
        };
      });
    },

    async revoke(ctx: ActorContext, connectionId: string): Promise<void> {
      await authorized(
        deps,
        ctx,
        'connection.disconnect',
        { connectionId },
        async (db, actor) => {
          const removed = await db.socialCredential.deleteMany({ where: { connectionId } });
          await db.socialConnection.update({
            where: { id: connectionId },
            data: { status: 'revoked', statusReason: 'connection.revoked_by_user' },
          });
          await recordAudit(db, actor, {
            action: 'credential.revoked',
            targetType: 'social_credential',
            targetId: connectionId,
            after: { removed: removed.count },
          });
        },
      );
    },
  };
}
