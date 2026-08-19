import { z } from 'zod';

import { ID_PREFIXES, idSchema } from './ids';
import { isoInstantSchema } from './primitives';

/**
 * Remembered targets.
 *
 * The composer can offer to start with the channels you picked last time. That
 * is the whole feature, and the boundaries around it are the interesting part:
 *
 *   1. It is **off by default**, per project, and opting out stores nothing.
 *      A project that never turns it on has no rows in this table at all.
 *   2. It stores **channel identifiers only**. No caption, no schedule, no
 *      privacy value, no approval state, no media, no draft body. A selection
 *      is not content, and this table must never become a shadow draft store.
 *   3. It is **per person within a project**. Two members of the same project
 *      have separate memories, and neither can read the other's.
 *   4. A remembered channel is **re-checked before it is offered**. A channel
 *      that was revoked, paused, expired or moved to another project since the
 *      last post is dropped, silently as far as the selection is concerned and
 *      visibly as far as the person is concerned: the composer shows what it
 *      restored, never a preselected account nobody can publish to.
 */

/** The only channel health in which a remembered channel may be re-offered. */
export const OFFERABLE_TARGET_HEALTH = 'active' as const;

export const rememberedTargetsSchema = z
  .object({
    projectId: idSchema(ID_PREFIXES.project),
    userId: idSchema(ID_PREFIXES.user),
    /** Channel identifiers, in the order they were last selected. */
    connectionIds: z.array(idSchema(ID_PREFIXES.connection)).max(200),
    updatedAt: isoInstantSchema,
  })
  .strict();
export type RememberedTargets = z.infer<typeof rememberedTargetsSchema>;

/**
 * What the composer receives when it opens.
 *
 * `enabled` is the project's opt-in. When it is false the selection is always
 * empty, and `droppedConnectionIds` is empty too: nothing was stored, so
 * nothing could have been dropped.
 */
export const rememberedTargetsViewSchema = z
  .object({
    projectId: idSchema(ID_PREFIXES.project),
    enabled: z.boolean(),
    connectionIds: z.array(idSchema(ID_PREFIXES.connection)),
    /** Remembered channels that are no longer offerable, for honest copy. */
    droppedConnectionIds: z.array(idSchema(ID_PREFIXES.connection)),
    updatedAt: isoInstantSchema.nullable(),
  })
  .strict();
export type RememberedTargetsView = z.infer<typeof rememberedTargetsViewSchema>;

/** One channel as the filter sees it. Health is the connection's own health. */
export interface OfferableChannel {
  readonly connectionId: string;
  readonly health: string;
  /** False when the acting person may not publish through this channel. */
  readonly authorized: boolean;
}

export interface RememberedTargetsFilterResult {
  readonly connectionIds: readonly string[];
  readonly droppedConnectionIds: readonly string[];
}

/**
 * Keep only the remembered channels that are still connected, still authorized
 * and not paused, preserving the order they were remembered in.
 *
 * Pure, and exported from contracts rather than from the service, so the
 * composer, the API and the service all answer this question the same way. A
 * channel that is absent from `available` was deleted or moved out of the
 * project; that is a drop, not an error.
 */
export function filterRememberedTargets(
  rememberedConnectionIds: readonly string[],
  available: readonly OfferableChannel[],
): RememberedTargetsFilterResult {
  const byId = new Map(available.map((channel) => [channel.connectionId, channel] as const));
  const kept: string[] = [];
  const dropped: string[] = [];
  for (const connectionId of rememberedConnectionIds) {
    const channel = byId.get(connectionId);
    if (channel !== undefined && channel.authorized && channel.health === OFFERABLE_TARGET_HEALTH) {
      kept.push(connectionId);
      continue;
    }
    dropped.push(connectionId);
  }
  return { connectionIds: kept, droppedConnectionIds: dropped };
}
