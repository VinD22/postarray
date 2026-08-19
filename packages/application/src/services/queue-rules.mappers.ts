import {
  queueRuleSnapshotSchema,
  queueWindowSchema,
  queueBlackoutSchema,
  slotReasonSchema,
  type QueueBlackout,
  type QueueRuleDefinition,
  type QueueRuleSnapshot,
  type QueueRuleView,
  type QueueSlotReservationView,
  type QueueWindow,
  type SlotProposal,
} from '@relay/contracts';
import { z } from 'zod';

import { invalid, notFound } from '../internal/errors';
import type { Db } from '../internal/runtime';
import type { OccupiedSlot, SlotFinderRule } from '../internal/slot-finder';
import type { Clock } from '../types';

/**
 * Row selects and view mapping for queue rules and slot reservations.
 *
 * JSON columns are parsed, never cast. A window list written by an older build
 * that no longer satisfies the schema is dropped rather than trusted, because a
 * malformed window would otherwise place a real post at a real time.
 */

export const QUEUE_RULE_SELECT = {
  id: true,
  workspaceId: true,
  projectId: true,
  name: true,
  ianaTimeZone: true,
  windows: true,
  minimumGapMinutes: true,
  maximumPerDay: true,
  blackouts: true,
  connectionIds: true,
  priority: true,
  enabled: true,
  archivedAt: true,
  createdByUserId: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const RESERVATION_SELECT = {
  id: true,
  workspaceId: true,
  projectId: true,
  queueRuleId: true,
  state: true,
  scheduledFor: true,
  scheduledTimeZone: true,
  localDateTime: true,
  ruleSnapshot: true,
  contentItemId: true,
  publishJobId: true,
  expiresAt: true,
  createdByUserId: true,
  createdAt: true,
  updatedAt: true,
} as const;

export interface QueueRuleRow {
  readonly id: string;
  readonly workspaceId: string;
  readonly projectId: string;
  readonly name: string;
  readonly ianaTimeZone: string;
  readonly windows: unknown;
  readonly minimumGapMinutes: number;
  readonly maximumPerDay: number | null;
  readonly blackouts: unknown;
  readonly connectionIds: readonly string[];
  readonly priority: number;
  readonly enabled: boolean;
  readonly archivedAt: Date | null;
  readonly createdByUserId: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ReservationRow {
  readonly id: string;
  readonly workspaceId: string;
  readonly projectId: string;
  readonly queueRuleId: string | null;
  readonly state: string;
  readonly scheduledFor: Date;
  readonly scheduledTimeZone: string;
  readonly localDateTime: string;
  readonly ruleSnapshot: unknown;
  readonly contentItemId: string | null;
  readonly publishJobId: string | null;
  readonly expiresAt: Date | null;
  readonly createdByUserId: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

const windowListSchema = z.array(queueWindowSchema).catch([]);
const blackoutListSchema = z.array(queueBlackoutSchema).catch([]);

export function toWindows(value: unknown): readonly QueueWindow[] {
  return windowListSchema.parse(value);
}

export function toBlackouts(value: unknown): readonly QueueBlackout[] {
  return blackoutListSchema.parse(value);
}

/** The rule as the pure slot finder wants it: no ids, no timestamps. */
export function toDefinition(row: QueueRuleRow): QueueRuleDefinition {
  return {
    name: row.name,
    ianaTimeZone: row.ianaTimeZone,
    windows: [...toWindows(row.windows)],
    minimumGapMinutes: row.minimumGapMinutes,
    // Null is no ceiling. Zero is zero. Never coalesce one into the other.
    maximumPerDay: row.maximumPerDay,
    blackouts: [...toBlackouts(row.blackouts)],
    connectionIds: [...row.connectionIds],
    priority: row.priority,
    enabled: row.enabled,
  };
}

export function toRuleView(row: QueueRuleRow): QueueRuleView {
  return {
    ...toDefinition(row),
    id: row.id,
    workspaceId: row.workspaceId,
    projectId: row.projectId,
    archived: row.archivedAt !== null,
    createdByUserId: row.createdByUserId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

const RESERVATION_STATES = new Set(['proposed', 'accepted', 'released', 'expired']);

function toReservationState(value: string): QueueSlotReservationView['state'] {
  return RESERVATION_STATES.has(value) ? (value as QueueSlotReservationView['state']) : 'released';
}

/**
 * The stored snapshot, read back as it was written. A snapshot that no longer
 * parses is surfaced with its reasons intact rather than discarded: it is
 * evidence, and evidence that cannot be re-validated still has to be readable.
 */
export function toSnapshot(value: unknown, fallbackTimeZone: string): QueueRuleSnapshot {
  const parsed = queueRuleSnapshotSchema.safeParse(value);
  if (parsed.success) {
    return parsed.data;
  }
  const reasons = z
    .array(slotReasonSchema)
    .catch([])
    .parse((value as { reasons?: unknown } | null)?.reasons);
  return {
    name: '',
    ianaTimeZone: fallbackTimeZone,
    windows: [],
    minimumGapMinutes: 0,
    maximumPerDay: null,
    blackouts: [],
    connectionIds: [],
    priority: 0,
    enabled: false,
    queueRuleId: null,
    capturedAt: new Date(0).toISOString(),
    reasons,
  };
}

export function toReservationView(row: ReservationRow): QueueSlotReservationView {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    projectId: row.projectId,
    state: toReservationState(row.state),
    instant: row.scheduledFor.toISOString(),
    ianaTimeZone: row.scheduledTimeZone,
    localDateTime: row.localDateTime,
    ruleSnapshot: toSnapshot(row.ruleSnapshot, row.scheduledTimeZone),
    contentItemId: row.contentItemId,
    publishJobId: row.publishJobId,
    expiresAt: row.expiresAt === null ? null : row.expiresAt.toISOString(),
    createdByUserId: row.createdByUserId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

/** Freeze the rule that produced this proposal, plus the reasons it gave. */
export function freezeSnapshot(
  proposal: SlotProposal,
  rules: readonly SlotFinderRule[],
  fallbackTimeZone: string,
  capturedAt: Date,
): QueueRuleSnapshot {
  const used = rules.find((rule) => rule.id === proposal.queueRuleId);
  const definition: QueueRuleDefinition =
    used === undefined
      ? {
          name: '',
          ianaTimeZone: fallbackTimeZone,
          windows: [],
          minimumGapMinutes: 0,
          maximumPerDay: null,
          blackouts: [],
          connectionIds: [],
          priority: 0,
          enabled: true,
        }
      : stripId(used);
  return queueRuleSnapshotSchema.parse({
    ...definition,
    queueRuleId: proposal.queueRuleId,
    capturedAt: capturedAt.toISOString(),
    reasons: proposal.reasons,
  });
}

function stripId(rule: SlotFinderRule): QueueRuleDefinition {
  const { id: _id, ...definition } = rule;
  return definition;
}

const LIVE_RESERVATION_STATES = ['proposed', 'accepted'];
const CLOSED_JOB_STATES = ['canceled', 'failed_permanently'] as const;
/** How far ahead occupancy is read. Comfortably past the search horizon. */
const OCCUPANCY_WINDOW_DAYS = 90;

/**
 * Attach a publish job to the reservation a person already accepted.
 *
 * Scheduling calls this after the job exists. It matches on the project and the
 * exact instant, and only on a reservation that is already `accepted` and not
 * yet linked, so a schedule that happens to land on someone else's proposal
 * never silently consumes it. Returns the reservation id when one was linked.
 */
export async function linkReservationToJob(
  db: Db,
  input: {
    readonly projectId: string;
    readonly instant: Date;
    readonly contentItemId: string;
    readonly publishJobId: string;
  },
): Promise<string | null> {
  const match = await db.queueSlotReservation.findFirst({
    where: {
      projectId: input.projectId,
      scheduledFor: input.instant,
      state: 'accepted',
      publishJobId: null,
      contentItemId: input.contentItemId,
    },
    select: { id: true },
  });
  if (match === null) {
    return null;
  }
  await db.queueSlotReservation.update({
    where: { id: match.id },
    data: { publishJobId: input.publishJobId },
  });
  return match.id;
}

export interface QueueContext {
  readonly rules: readonly SlotFinderRule[];
  readonly occupied: readonly OccupiedSlot[];
  readonly reserved: readonly OccupiedSlot[];
  readonly timeZone: string;
  readonly after: Date;
}

/**
 * Everything the pure finder needs, read once. The finder itself never touches
 * the database, which is what makes its daylight-saving behaviour testable.
 */
export async function readQueueContext(
  db: Db,
  clock: Clock,
  workspaceTimeZone: string,
  input: { readonly projectId: string; readonly after?: string },
): Promise<QueueContext> {
  const project = await db.project.findFirst({
    where: { id: input.projectId },
    select: { defaultTimeZone: true },
  });
  if (project === null) {
    throw notFound('project', input.projectId);
  }
  const after = input.after === undefined ? clock.now() : new Date(input.after);
  if (Number.isNaN(after.getTime())) {
    throw invalid('errors.invalid_range', { after: input.after ?? null });
  }
  const to = new Date(after.getTime() + OCCUPANCY_WINDOW_DAYS * 86_400_000);

  const [ruleRows, jobs, reservations] = await Promise.all([
    db.queueRule.findMany({
      where: { projectId: input.projectId, archivedAt: null, enabled: true },
      orderBy: [{ priority: 'desc' }, { name: 'asc' }],
      select: QUEUE_RULE_SELECT,
    }),
    db.publishJob.findMany({
      where: {
        scheduledFor: { gte: after, lte: to },
        state: { notIn: [...CLOSED_JOB_STATES] },
        contentItem: { projectId: input.projectId },
      },
      select: { scheduledFor: true, connectionId: true },
    }),
    db.queueSlotReservation.findMany({
      where: {
        projectId: input.projectId,
        scheduledFor: { gte: after, lte: to },
        state: { in: LIVE_RESERVATION_STATES },
      },
      select: { scheduledFor: true },
    }),
  ]);

  return {
    rules: ruleRows.map((row) => ({ ...toDefinition(row), id: row.id })),
    occupied: jobs.map((job) => ({
      instant: job.scheduledFor.toISOString(),
      connectionId: job.connectionId,
    })),
    reserved: reservations.map((row) => ({ instant: row.scheduledFor.toISOString() })),
    timeZone: project.defaultTimeZone ?? workspaceTimeZone,
    after,
  };
}
