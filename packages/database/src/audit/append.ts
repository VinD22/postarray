import { createHash } from 'node:crypto';

import type { ActorType, CreationSurface, Prisma } from '@prisma/client';

import type { RlsTransactionClient } from '../tenancy/rls-context.js';

/**
 * Appending to the audit log.
 *
 * Every external side effect produces an audit event, so this is a hot path in
 * terms of call sites even though it is cheap. It exists as one typed helper so
 * that:
 *
 *   * no call site invents its own `action` casing or metadata shape;
 *   * `before` and `after` are hashed rather than stored, which keeps a draft's
 *     contents and a customer's email out of the log while still proving that a
 *     value changed;
 *   * a caller cannot accidentally write an event outside a transaction that is
 *     already carrying RLS claims.
 *
 * The table rejects UPDATE and DELETE at the database level (`0040_audit.sql`),
 * so a mistake here is permanent. Prefer a compensating event.
 */

/** Actions the platform records. Extend deliberately; this list is reviewed. */
export const AUDIT_ACTIONS = {
  workspaceCreated: 'workspace.created',
  workspaceUpdated: 'workspace.updated',
  workspaceKillSwitchEngaged: 'workspace.kill_switch_engaged',
  membershipInvited: 'membership.invited',
  membershipRoleChanged: 'membership.role_changed',
  membershipRemoved: 'membership.removed',
  apiKeyCreated: 'api_key.created',
  apiKeyRevoked: 'api_key.revoked',
  serviceAccountCreated: 'service_account.created',
  connectionConnected: 'connection.connected',
  connectionDisconnected: 'connection.disconnected',
  connectionReconnected: 'connection.reconnected',
  credentialRefreshed: 'credential.refreshed',
  credentialRevoked: 'credential.revoked',
  contentDrafted: 'content.drafted',
  contentVersionCreated: 'content_version.created',
  approvalRequested: 'approval.requested',
  approvalDecided: 'approval.decided',
  postScheduled: 'post.scheduled',
  postRescheduled: 'post.rescheduled',
  postCanceled: 'post.canceled',
  postPublished: 'post.published',
  postFailed: 'post.failed',
  automationRuleActivated: 'automation_rule.activated',
  automationRulePaused: 'automation_rule.paused',
  shortLinkDestinationChanged: 'short_link.destination_changed',
  oauthGrantIssued: 'oauth_grant.issued',
  oauthGrantRevoked: 'oauth_grant.revoked',
  privilegedRead: 'privileged_read',
  subscriptionChanged: 'subscription.changed',
  deletionRequested: 'deletion.requested',
  deletionExecuted: 'deletion.executed',
  dataExported: 'data.exported',
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];

export interface AuditActor {
  readonly type: ActorType;
  /** User id, service account id or OAuth client id, depending on `type`. */
  readonly id?: string;
  /** The developer application the call arrived through, when there is one. */
  readonly clientId?: string;
}

export interface AuditTarget {
  /** Snake case table-ish name, for example `publish_job`. */
  readonly type: string;
  readonly id?: string;
}

export interface AppendAuditEventInput {
  readonly workspaceId: string;
  readonly actor: AuditActor;
  readonly surface: CreationSurface;
  readonly action: AuditAction | (string & {});
  readonly target: AuditTarget;
  /** Hashed, never stored. */
  readonly before?: unknown;
  /** Hashed, never stored. */
  readonly after?: unknown;
  /**
   * Sanitized. Never a token, a provider payload, a raw request body or the
   * contents of a draft.
   */
  readonly metadata?: Prisma.InputJsonValue;
  readonly ipAddress?: string;
  readonly userAgent?: string;
  readonly correlationId?: string;
}

export interface AuditEventRef {
  readonly id: string;
  readonly createdAt: Date;
}

/**
 * Writes one audit event. Call it inside the same transaction as the change it
 * describes, so a rolled back mutation does not leave a claim that it happened.
 */
export async function appendAuditEvent(
  tx: RlsTransactionClient,
  input: AppendAuditEventInput,
): Promise<AuditEventRef> {
  const created = await tx.auditEvent.create({
    data: {
      workspaceId: input.workspaceId,
      actorType: input.actor.type,
      ...(input.actor.id === undefined ? {} : { actorId: input.actor.id }),
      ...(input.actor.clientId === undefined ? {} : { actorClientId: input.actor.clientId }),
      surface: input.surface,
      action: input.action,
      targetType: input.target.type,
      ...(input.target.id === undefined ? {} : { targetId: input.target.id }),
      ...(input.before === undefined ? {} : { beforeHash: hashState(input.before) }),
      ...(input.after === undefined ? {} : { afterHash: hashState(input.after) }),
      metadata: input.metadata ?? {},
      ...(input.ipAddress === undefined ? {} : { ipAddress: input.ipAddress }),
      ...(input.userAgent === undefined ? {} : { userAgent: input.userAgent }),
      ...(input.correlationId === undefined ? {} : { correlationId: input.correlationId }),
    },
    select: { id: true, createdAt: true },
  });

  return created;
}

/** Writes several events in one round trip, for a bulk action. */
export async function appendAuditEvents(
  tx: RlsTransactionClient,
  inputs: readonly AppendAuditEventInput[],
): Promise<number> {
  if (inputs.length === 0) return 0;

  const result = await tx.auditEvent.createMany({
    data: inputs.map((input) => ({
      workspaceId: input.workspaceId,
      actorType: input.actor.type,
      ...(input.actor.id === undefined ? {} : { actorId: input.actor.id }),
      ...(input.actor.clientId === undefined ? {} : { actorClientId: input.actor.clientId }),
      surface: input.surface,
      action: input.action,
      targetType: input.target.type,
      ...(input.target.id === undefined ? {} : { targetId: input.target.id }),
      ...(input.before === undefined ? {} : { beforeHash: hashState(input.before) }),
      ...(input.after === undefined ? {} : { afterHash: hashState(input.after) }),
      metadata: input.metadata ?? {},
      ...(input.ipAddress === undefined ? {} : { ipAddress: input.ipAddress }),
      ...(input.userAgent === undefined ? {} : { userAgent: input.userAgent }),
      ...(input.correlationId === undefined ? {} : { correlationId: input.correlationId }),
    })),
  });

  return result.count;
}

/**
 * SHA-256 over a canonicalized value. Object keys are sorted so a serializer
 * change does not read as a data change.
 */
export function hashState(value: unknown): string {
  return createHash('sha256').update(canonicalize(value)).digest('hex');
}

function canonicalize(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'bigint') return `${value.toString()}n`;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) {
    return `[${value.map((entry) => canonicalize(entry)).join(',')}]`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, entryValue]) => entryValue !== undefined)
      .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
      .map(([key, entryValue]) => `${JSON.stringify(key)}:${canonicalize(entryValue)}`);
    return `{${entries.join(',')}}`;
  }
  return JSON.stringify(value) ?? 'null';
}
