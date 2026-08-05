import { Inject, Injectable } from '@nestjs/common';
import {
  ID_PREFIXES,
  approvalLevelSchema,
  idSchema,
  isoInstantSchema,
  localeSchema,
  providerIdSchema,
  scopeSchema,
} from '@relay/contracts';
import { z } from 'zod';

import type { ActorContext, Clock, KeyValueStore } from '../../application/port';
import { CLOCK, KEY_VALUE_STORE } from '../../application/tokens';
import { requireEpochMillis } from '../../common/instant';

/**
 * The server side of a social publisher OAuth handshake.
 *
 * The provider redirects a browser back to us with `code` and `state`. That
 * request carries no credential of ours, so everything needed to finish the
 * handshake safely has to have been recorded when the flow started:
 *
 * - **Who started it.** The workspace, the actor and the scopes are read back
 *   from here, never from the callback URL. A callback cannot name its own
 *   workspace, so a forged callback has nothing to aim at.
 * - **The exact `state`.** Compared byte for byte against both this record and
 *   a cookie set on the same browser. `state` alone protects the client;
 *   the cookie is what protects us.
 * - **A short life.** Five minutes. A handshake a human abandoned is not a
 *   handshake an attacker gets to finish tomorrow.
 *
 * This is login CSRF defence: without it, an attacker can walk a victim through
 * a callback that attaches the *attacker's* social account to the victim's
 * workspace, and every post the victim schedules then goes to the attacker.
 */
export const OAUTH_TRANSACTION_TTL_SECONDS = 300;

export const oauthTransactionSchema = z
  .object({
    transactionId: z.string().min(16).max(256),
    provider: providerIdSchema,
    /** The exact value we sent to the provider. Compared, never re-derived. */
    state: z.string().min(16).max(512),
    workspaceId: idSchema(ID_PREFIXES.workspace),
    brandId: idSchema(ID_PREFIXES.brand),
    actorId: z.string().min(1).max(128),
    actorType: z.enum(['user', 'service_account', 'oauth_app', 'system']),
    scopes: z.array(scopeSchema).max(64),
    approvalLevel: approvalLevelSchema,
    locale: localeSchema,
    correlationId: z.string().min(1).max(128),
    surface: z.enum(['web', 'api', 'mcp', 'cli', 'rss', 'automation_rule', 'agent']),
    /** Where to send the browser afterwards. Validated against the app origin. */
    redirectTo: z.string().min(1).max(2048).nullable(),
    createdAt: isoInstantSchema,
    expiresAt: isoInstantSchema,
  })
  .strict();
export type OAuthTransaction = z.infer<typeof oauthTransactionSchema>;

@Injectable()
export class OAuthTransactionStore {
  constructor(
    @Inject(KEY_VALUE_STORE) private readonly kv: KeyValueStore,
    @Inject(CLOCK) private readonly clock: Clock,
  ) {}

  private key(transactionId: string): string {
    return `relay:conn-oauth:${transactionId}`;
  }

  async put(transaction: OAuthTransaction): Promise<void> {
    await this.kv.set(this.key(transaction.transactionId), JSON.stringify(transaction), {
      ttlSeconds: OAUTH_TRANSACTION_TTL_SECONDS,
    });
  }

  /** Read and delete. A transaction is single use, like the code it completes. */
  async consume(transactionId: string): Promise<OAuthTransaction | null> {
    const raw = await this.kv.get(this.key(transactionId));
    if (raw === null) {
      return null;
    }
    await this.kv.delete(this.key(transactionId));
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return null;
    }
    const result = oauthTransactionSchema.safeParse(parsed);
    if (!result.success) {
      return null;
    }
    if (requireEpochMillis(result.data.expiresAt) <= this.clock.now().getTime()) {
      return null;
    }
    return result.data;
  }

  /** Rebuild the actor that started the handshake. Never trust the callback. */
  toActorContext(transaction: OAuthTransaction): ActorContext {
    return {
      actorType: transaction.actorType,
      actorId: transaction.actorId,
      workspaceId: transaction.workspaceId,
      scopes: transaction.scopes,
      surface: transaction.surface,
      correlationId: transaction.correlationId,
      approvalLevel: transaction.approvalLevel,
      locale: transaction.locale,
    };
  }
}
