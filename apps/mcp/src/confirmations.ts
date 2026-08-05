import { createHash, randomUUID } from 'node:crypto';

import { RelayError } from '@relay/contracts';

import type { PublishConfirmation } from './ports.js';

/**
 * Human confirmation for immediate publication.
 *
 * The rule is that an immediate publish needs an explicit human decision, and
 * the hard part is that this server cannot see one. An agent host can claim the
 * user approved; that claim arrives over the same channel as the request and is
 * worth exactly nothing.
 *
 * So the flow is:
 *
 *  1. `publish_post` without a confirmation id mints a pending confirmation
 *     bound to the workspace, the grant, the content item and a fingerprint of
 *     the exact targets, and returns a URL on the Relay app domain.
 *  2. A person opens that URL, in a session this server did not create, sees
 *     what will publish and where, and approves it.
 *  3. `publish_post` is called again with the id. The confirmation is consumed
 *     once, and only if the fingerprint still matches.
 *
 * Changing the content after step 2 changes the fingerprint, which invalidates
 * the confirmation. That is the "content changed after approval" rule, enforced
 * rather than described.
 */

export interface PendingConfirmation {
  readonly confirmationId: string;
  readonly workspaceId: string;
  readonly grantId: string;
  readonly contentItemId: string;
  readonly fingerprint: string;
  readonly summary: ConfirmationSummary;
  readonly createdAtMs: number;
  readonly expiresAtMs: number;
  readonly confirmedBy: string | null;
  readonly confirmedAtMs: number | null;
  readonly consumed: boolean;
}

export interface ConfirmationSummary {
  readonly contentItemId: string;
  readonly accountCount: number;
  readonly externalPublicationCount: number;
  readonly providers: readonly string[];
  readonly accounts: readonly { readonly connectionId: string; readonly label: string }[];
}

export interface ConfirmationRequest {
  readonly workspaceId: string;
  readonly grantId: string;
  readonly contentItemId: string;
  readonly summary: ConfirmationSummary;
}

export interface ConfirmationTicket {
  readonly confirmationId: string;
  readonly confirmUrl: string;
  readonly expiresAt: string;
  readonly summary: ConfirmationSummary;
}

export interface ConfirmationStore {
  request(input: ConfirmationRequest): Promise<ConfirmationTicket>;
  /** Consumes the confirmation. Throws unless a person approved this exact plan. */
  consume(input: {
    confirmationId: string;
    workspaceId: string;
    grantId: string;
    contentItemId: string;
    summary: ConfirmationSummary;
  }): Promise<PublishConfirmation>;
  /** Called by the app when a person approves. Not reachable from MCP. */
  approve(input: { confirmationId: string; approvedBy: string }): Promise<void>;
  get(confirmationId: string): Promise<PendingConfirmation | null>;
}

export const DEFAULT_CONFIRMATION_TTL_SECONDS = 15 * 60;

/**
 * The exact plan a person is agreeing to. Any change to the accounts, the
 * count or the content item produces a different fingerprint.
 */
export function fingerprintSummary(summary: ConfirmationSummary): string {
  const canonical = JSON.stringify({
    contentItemId: summary.contentItemId,
    externalPublicationCount: summary.externalPublicationCount,
    accounts: [...summary.accounts]
      .map((account) => account.connectionId)
      .sort((left, right) => (left < right ? -1 : left > right ? 1 : 0)),
  });
  return createHash('sha256').update(canonical).digest('hex');
}

export interface MemoryConfirmationStoreOptions {
  readonly clock: { now(): number };
  /** Absolute URL of the confirmation screen on the app domain. */
  readonly confirmUrlTemplate: (confirmationId: string) => string;
  readonly ttlSeconds?: number;
}

function isoOf(epochMs: number): string {
  return new globalThis.Date(epochMs).toISOString();
}

/**
 * The in-process implementation. Production replaces this with a Redis or
 * Postgres backed one so a confirmation survives a restart and cannot be
 * consumed twice across replicas; the interface is the same.
 */
export function createMemoryConfirmationStore(
  options: MemoryConfirmationStoreOptions,
): ConfirmationStore {
  const pending = new Map<string, PendingConfirmation>();
  const ttlMs = (options.ttlSeconds ?? DEFAULT_CONFIRMATION_TTL_SECONDS) * 1000;

  const purge = (): void => {
    const now = options.clock.now();
    for (const [id, record] of pending.entries()) {
      if (record.expiresAtMs <= now) {
        pending.delete(id);
      }
    }
  };

  return {
    async request(input: ConfirmationRequest): Promise<ConfirmationTicket> {
      purge();
      const confirmationId = randomUUID();
      const now = options.clock.now();
      const record: PendingConfirmation = {
        confirmationId,
        workspaceId: input.workspaceId,
        grantId: input.grantId,
        contentItemId: input.contentItemId,
        fingerprint: fingerprintSummary(input.summary),
        summary: input.summary,
        createdAtMs: now,
        expiresAtMs: now + ttlMs,
        confirmedBy: null,
        confirmedAtMs: null,
        consumed: false,
      };
      pending.set(confirmationId, record);
      return {
        confirmationId,
        confirmUrl: options.confirmUrlTemplate(confirmationId),
        expiresAt: isoOf(record.expiresAtMs),
        summary: input.summary,
      };
    },

    async approve(input: { confirmationId: string; approvedBy: string }): Promise<void> {
      const record = pending.get(input.confirmationId);
      if (record === undefined) {
        throw new RelayError('NOT_FOUND', {
          messageKey: 'error.not_found.message',
          details: { reason: 'CONFIRMATION_NOT_FOUND' },
        });
      }
      pending.set(input.confirmationId, {
        ...record,
        confirmedBy: input.approvedBy,
        confirmedAtMs: options.clock.now(),
      });
    },

    async get(confirmationId: string): Promise<PendingConfirmation | null> {
      purge();
      return pending.get(confirmationId) ?? null;
    },

    async consume(input): Promise<PublishConfirmation> {
      purge();
      const record = pending.get(input.confirmationId);
      if (record === undefined) {
        throw new RelayError('APPROVAL_REQUIRED', {
          messageKey: 'error.approval_required.message',
          details: { reason: 'CONFIRMATION_NOT_FOUND_OR_EXPIRED' },
        });
      }
      if (record.consumed) {
        // Single use. Replaying a confirmation is how one approval becomes two
        // publications.
        throw new RelayError('CONFLICT', {
          messageKey: 'error.conflict.message',
          details: { reason: 'CONFIRMATION_ALREADY_USED' },
        });
      }
      if (
        record.workspaceId !== input.workspaceId ||
        record.grantId !== input.grantId ||
        record.contentItemId !== input.contentItemId
      ) {
        throw new RelayError('FORBIDDEN', {
          messageKey: 'error.forbidden.message',
          details: { reason: 'CONFIRMATION_NOT_FOR_THIS_REQUEST' },
        });
      }
      if (record.confirmedBy === null || record.confirmedAtMs === null) {
        throw new RelayError('APPROVAL_REQUIRED', {
          messageKey: 'error.approval_required.message',
          details: { reason: 'CONFIRMATION_PENDING', confirmationId: record.confirmationId },
        });
      }
      if (record.fingerprint !== fingerprintSummary(input.summary)) {
        throw new RelayError('APPROVAL_REQUIRED', {
          messageKey: 'error.content_changed_after_approval.message',
          details: { reason: 'PLAN_CHANGED_AFTER_CONFIRMATION' },
        });
      }

      pending.set(input.confirmationId, { ...record, consumed: true });
      return {
        confirmationId: record.confirmationId,
        confirmedBy: record.confirmedBy,
        confirmedAt: isoOf(record.confirmedAtMs),
        surface: 'mcp',
      };
    },
  };
}
