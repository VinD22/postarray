import { z } from 'zod';

import type { VerifiedSubscription } from './entitlements.js';

/**
 * The webhook inbox.
 *
 * Every delivery is persisted before anything is acted upon: the provider event
 * id, whether the signature verified, a hash of the raw body, the raw payload,
 * when it arrived, when it was processed and what happened. `providerEventId`
 * carries a unique index, and that index is the idempotency guarantee: the same
 * event delivered twice applies once and records `noop`.
 *
 * The in-memory implementations here are the local and test substrate. The
 * production implementation lives in `@relay/database` behind the same port.
 */

export const WEBHOOK_SIGNATURE_STATES = ['verified', 'rejected'] as const;
export const webhookSignatureStateSchema = z.enum(WEBHOOK_SIGNATURE_STATES);
export type WebhookSignatureState = z.infer<typeof webhookSignatureStateSchema>;

export const WEBHOOK_RESULTS = ['pending', 'applied', 'noop', 'superseded', 'failed'] as const;
export const webhookResultSchema = z.enum(WEBHOOK_RESULTS);
export type WebhookResult = z.infer<typeof webhookResultSchema>;

export interface WebhookInboxRecord {
  readonly id: string;
  readonly providerEventId: string;
  readonly eventType: string;
  readonly signatureState: WebhookSignatureState;
  readonly signatureFailureReason: string | null;
  readonly bodyHash: string;
  readonly payload: string;
  readonly receivedAt: string;
  readonly processedAt: string | null;
  readonly result: WebhookResult;
  readonly attempts: number;
  readonly lastError: string | null;
}

export interface NewWebhookInboxRecord {
  readonly providerEventId: string;
  readonly eventType: string;
  readonly signatureState: WebhookSignatureState;
  readonly signatureFailureReason: string | null;
  readonly bodyHash: string;
  readonly payload: string;
  readonly receivedAt: string;
}

export interface MarkProcessedInput {
  readonly providerEventId: string;
  readonly result: WebhookResult;
  readonly processedAt: string;
  /** Sanitized. Never a provider payload, a token or an internal identifier. */
  readonly lastError?: string;
}

export interface WebhookInboxStore {
  /** `duplicate` when the unique index on `providerEventId` rejects the row. */
  insert(record: NewWebhookInboxRecord): Promise<'inserted' | 'duplicate'>;
  get(providerEventId: string): Promise<WebhookInboxRecord | null>;
  markProcessed(input: MarkProcessedInput): Promise<void>;
  incrementAttempt(providerEventId: string): Promise<number>;
  list(): Promise<readonly WebhookInboxRecord[]>;
  /** Rows left `failed`, for the retry-with-backoff sweep. */
  listFailed(): Promise<readonly WebhookInboxRecord[]>;
}

export class InMemoryWebhookInbox implements WebhookInboxStore {
  private sequence = 0;
  private readonly rows = new Map<string, WebhookInboxRecord>();

  async insert(record: NewWebhookInboxRecord): Promise<'inserted' | 'duplicate'> {
    if (this.rows.has(record.providerEventId)) {
      return 'duplicate';
    }
    this.sequence += 1;
    this.rows.set(record.providerEventId, {
      id: `inbox_${String(this.sequence).padStart(6, '0')}`,
      providerEventId: record.providerEventId,
      eventType: record.eventType,
      signatureState: record.signatureState,
      signatureFailureReason: record.signatureFailureReason,
      bodyHash: record.bodyHash,
      payload: record.payload,
      receivedAt: record.receivedAt,
      processedAt: null,
      result: 'pending',
      attempts: 0,
      lastError: null,
    });
    return 'inserted';
  }

  async get(providerEventId: string): Promise<WebhookInboxRecord | null> {
    return this.rows.get(providerEventId) ?? null;
  }

  async markProcessed(input: MarkProcessedInput): Promise<void> {
    const existing = this.rows.get(input.providerEventId);
    if (existing === undefined) {
      return;
    }
    this.rows.set(input.providerEventId, {
      ...existing,
      result: input.result,
      processedAt: input.processedAt,
      lastError: input.lastError ?? null,
    });
  }

  async incrementAttempt(providerEventId: string): Promise<number> {
    const existing = this.rows.get(providerEventId);
    if (existing === undefined) {
      return 0;
    }
    const attempts = existing.attempts + 1;
    this.rows.set(providerEventId, { ...existing, attempts });
    return attempts;
  }

  async list(): Promise<readonly WebhookInboxRecord[]> {
    return [...this.rows.values()];
  }

  async listFailed(): Promise<readonly WebhookInboxRecord[]> {
    return [...this.rows.values()].filter((row) => row.result === 'failed');
  }

  clear(): void {
    this.rows.clear();
    this.sequence = 0;
  }
}

/**
 * The stored subscription state entitlements are derived from. One row per
 * workspace, keyed by the Polar subscription id.
 */
export interface SubscriptionStore {
  getBySubscriptionId(subscriptionId: string): Promise<VerifiedSubscription | null>;
  getByWorkspaceId(workspaceId: string): Promise<VerifiedSubscription | null>;
  getByCustomerId(customerId: string): Promise<VerifiedSubscription | null>;
  upsert(record: VerifiedSubscription): Promise<void>;
  list(): Promise<readonly VerifiedSubscription[]>;
}

export class InMemorySubscriptionStore implements SubscriptionStore {
  private readonly rows = new Map<string, VerifiedSubscription>();

  async getBySubscriptionId(subscriptionId: string): Promise<VerifiedSubscription | null> {
    return this.rows.get(subscriptionId) ?? null;
  }

  async getByWorkspaceId(workspaceId: string): Promise<VerifiedSubscription | null> {
    for (const row of this.rows.values()) {
      if (row.workspaceId === workspaceId) {
        return row;
      }
    }
    return null;
  }

  async getByCustomerId(customerId: string): Promise<VerifiedSubscription | null> {
    for (const row of this.rows.values()) {
      if (row.customerId === customerId) {
        return row;
      }
    }
    return null;
  }

  async upsert(record: VerifiedSubscription): Promise<void> {
    this.rows.set(record.subscriptionId, record);
  }

  async list(): Promise<readonly VerifiedSubscription[]> {
    return [...this.rows.values()];
  }

  clear(): void {
    this.rows.clear();
  }
}
