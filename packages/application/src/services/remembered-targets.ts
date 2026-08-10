import {
  filterRememberedTargets,
  type OfferableChannel,
  type RememberedTargetsView,
} from '@relay/contracts';
import { z } from 'zod';

import type { ActorContext, RememberedTargetService, ServiceDeps } from '../types';

import { recordAudit } from '../internal/audit';
import { invalid, notFound } from '../internal/errors';
import { authorized, type ActorSnapshot, type Db } from '../internal/runtime';

/**
 * Remembered targets.
 *
 * "Remember these accounts for next time" is a small convenience with a large
 * blast radius if it is built carelessly, so the rules are enforced here rather
 * than left to callers:
 *
 *  1. **Opt in, per project, default off.** While the project flag is false
 *     this service reads nothing and, more importantly, writes nothing. There
 *     is no row to leak and nothing to forget. Turning the flag off deletes
 *     what was stored rather than merely hiding it.
 *
 *  2. **Channel identifiers only.** `remember` accepts a list of connection
 *     ids and stores exactly that. It has no parameter for a caption, a time,
 *     a privacy value or an approval state, and cannot acquire one without
 *     changing this signature, which is the point.
 *
 *  3. **Per person.** The row is keyed on the acting user. The database
 *     enforces this a second time with self-row policies (migration 0070), so
 *     a bug here cannot expose one member's selection to another.
 *
 *  4. **Re-checked before it is offered.** A remembered channel is only
 *     returned if it is still in the project, still authorized for the person
 *     asking, and still healthy. A revoked account is never quietly
 *     reselected; it comes back as a dropped id so the composer can say what it
 *     did not restore.
 */

const connectionIdsSchema = z.array(z.string().min(1)).max(200);

interface BrandRow {
  id: string;
  rememberTargetsEnabled: boolean;
}

async function requireBrand(db: Db, brandId: string): Promise<BrandRow> {
  const brand = await db.brand.findFirst({
    where: { id: brandId },
    select: { id: true, rememberTargetsEnabled: true },
  });
  if (brand === null) {
    throw notFound('brand', brandId);
  }
  return brand;
}

function requirePerson(actor: ActorSnapshot, brandId: string): string {
  if (actor.userId === null) {
    // The memory belongs to a person. A service account or an agent has no
    // "last time", and writing one under a machine identity would create a
    // selection nobody can see, correct or delete.
    throw invalid('errors.target_memory_requires_person', { brandId });
  }
  return actor.userId;
}

/**
 * Which channels the acting person may actually be offered.
 *
 * A channel counts as offerable when it belongs to this project, its status is
 * `active`, and policy says this actor may write through it. The authorization
 * arm is what stops the memory from becoming a way to see, or preselect, an
 * account somebody's role does not reach.
 */
async function offerableChannels(
  db: Db,
  actor: ActorSnapshot,
  brandId: string,
): Promise<readonly OfferableChannel[]> {
  const rows = await db.socialConnection.findMany({
    where: { brandId },
    select: { id: true, status: true },
  });
  const allowed = actor.restrictions.connectionIds ?? null;
  return rows.map((row) => ({
    connectionId: row.id,
    health: row.status,
    authorized: allowed === null || allowed.includes(row.id),
  }));
}

export function createRememberedTargetService(deps: ServiceDeps): RememberedTargetService {
  return {
    async read(
      ctx: ActorContext,
      input: { readonly brandId: string },
    ): Promise<RememberedTargetsView> {
      return authorized(
        deps,
        ctx,
        'content.read',
        { brandId: input.brandId },
        async (db, actor) => {
          const brand = await requireBrand(db, input.brandId);
          const empty: RememberedTargetsView = {
            brandId: brand.id,
            enabled: brand.rememberTargetsEnabled,
            connectionIds: [],
            droppedConnectionIds: [],
            updatedAt: null,
          };
          if (!brand.rememberTargetsEnabled || actor.userId === null) {
            return empty;
          }

          const row = await db.rememberedTarget.findFirst({
            where: { brandId: brand.id, userId: actor.userId },
            select: { connectionIds: true, updatedAt: true },
          });
          if (row === null) {
            return empty;
          }

          const channels = await offerableChannels(db, actor, brand.id);
          const filtered = filterRememberedTargets(row.connectionIds, channels);
          return {
            brandId: brand.id,
            enabled: true,
            connectionIds: [...filtered.connectionIds],
            droppedConnectionIds: [...filtered.droppedConnectionIds],
            updatedAt: row.updatedAt.toISOString(),
          };
        },
      );
    },

    async remember(
      ctx: ActorContext,
      input: { readonly brandId: string; readonly connectionIds: readonly string[] },
    ): Promise<RememberedTargetsView> {
      const connectionIds = connectionIdsSchema.parse([...input.connectionIds]);
      return authorized(
        deps,
        ctx,
        'content.write',
        { brandId: input.brandId },
        async (db, actor) => {
          const brand = await requireBrand(db, input.brandId);
          if (!brand.rememberTargetsEnabled) {
            // Opted out. Nothing is written, no row is created, and the caller
            // is told plainly that nothing was remembered rather than being led
            // to believe a preference was saved.
            return {
              brandId: brand.id,
              enabled: false,
              connectionIds: [],
              droppedConnectionIds: [],
              updatedAt: null,
            };
          }
          const userId = requirePerson(actor, brand.id);

          // Deduplicate, keep the order the person selected in, and store only
          // identifiers. Nothing about the draft travels with them.
          const unique = [...new Set(connectionIds)];
          const at = deps.clock.now();
          const existing = await db.rememberedTarget.findFirst({
            where: { brandId: brand.id, userId },
            select: { id: true },
          });
          if (existing === null) {
            await db.rememberedTarget.create({
              data: {
                workspaceId: actor.workspace.id,
                brandId: brand.id,
                userId,
                connectionIds: unique,
              },
            });
          } else {
            await db.rememberedTarget.update({
              where: { id: existing.id },
              data: { connectionIds: unique, updatedAt: at },
            });
          }

          const channels = await offerableChannels(db, actor, brand.id);
          const filtered = filterRememberedTargets(unique, channels);
          return {
            brandId: brand.id,
            enabled: true,
            connectionIds: [...filtered.connectionIds],
            droppedConnectionIds: [...filtered.droppedConnectionIds],
            updatedAt: at.toISOString(),
          };
        },
      );
    },

    async forget(ctx: ActorContext, input: { readonly brandId: string }): Promise<void> {
      await authorized(
        deps,
        ctx,
        'content.write',
        { brandId: input.brandId },
        async (db, actor) => {
          if (actor.userId === null) {
            return;
          }
          // Forgetting must always be available, including when the project
          // flag is already off, so this never consults the flag.
          await db.rememberedTarget.deleteMany({
            where: { brandId: input.brandId, userId: actor.userId },
          });
        },
      );
    },

    async setEnabled(
      ctx: ActorContext,
      input: { readonly brandId: string; readonly enabled: boolean },
    ): Promise<{ readonly brandId: string; readonly enabled: boolean }> {
      return authorized(
        deps,
        ctx,
        'brand.write',
        { brandId: input.brandId },
        async (db, actor) => {
          const brand = await requireBrand(db, input.brandId);
          if (brand.rememberTargetsEnabled === input.enabled) {
            return { brandId: brand.id, enabled: input.enabled };
          }

          await db.brand.update({
            where: { id: brand.id },
            data: { rememberTargetsEnabled: input.enabled },
          });

          // Switching the project off is a deletion, not a hiding. A person who
          // turned this off and was told "we will not remember your accounts"
          // is entitled to have that be true of what was already stored.
          const cleared =
            input.enabled === false
              ? await db.rememberedTarget.deleteMany({ where: { brandId: brand.id } })
              : { count: 0 };

          await recordAudit(db, actor, {
            action: 'brand.target_memory_changed',
            targetType: 'brand',
            targetId: brand.id,
            before: { rememberTargetsEnabled: brand.rememberTargetsEnabled },
            after: { rememberTargetsEnabled: input.enabled },
            metadata: { clearedMemories: cleared.count },
          });

          return { brandId: brand.id, enabled: input.enabled };
        },
      );
    },
  };
}
