import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '@relay/contracts';

import type {
  ActorContext,
  Clock,
  IssuedServiceAccountCredentialView,
  ServiceAccountDryRunView,
  ServiceAccountView,
  Services,
} from '../../application/port';
import { CLOCK, SERVICES } from '../../application/tokens';
import { CredentialDirectory } from '../../security/credential-directory';
import { hashSecret, parseCredential } from '../../security/credentials';
import { apiKeyRecordSchema } from '../../security/records';
import type {
  CreateServiceAccountRequest,
  ServiceAccountDryRunRequest,
} from './service-accounts.schemas';

/**
 * The credential half of a service account.
 *
 * The plaintext is minted by `@relay/application`, exists for the duration of
 * this method, and is written down in exactly two places: the caller's response
 * body, and a keyed digest in the edge verification index. It is never logged —
 * the logger from `@relay/observability` redacts by default and nothing here
 * hands it a credential anyway — and there is no read path that can produce it
 * again. Losing it means rotating.
 *
 * Rotation drops the superseded prefixes from the edge index in the same
 * request. The durable row is revoked first by the application layer, and the
 * actor context carries the credential id, so `loadActor` re-reads that row and
 * refuses a revoked credential even in the window before the edge delete lands
 * — or if that delete never lands at all. The reverse order would leave a
 * revoked credential briefly usable, which is the one failure a rotation may
 * not have.
 *
 * Stopping an account deliberately does *not* delete the edge record. The kill
 * switch is enforced in the application layer, which turns a stopped account's
 * call into an audited refusal instead of an anonymous 401 — and it means
 * resuming works instantly, which it could not if we had thrown away the only
 * copy of the digest.
 */
export interface IssuedServiceAccount {
  readonly account: ServiceAccountView;
  /** Shown exactly once. Never stored in this form, never recoverable. */
  readonly secret: string;
  readonly expiresAt: string;
}

@Injectable()
export class ServiceAccountsService {
  constructor(
    @Inject(SERVICES) private readonly services: Services,
    @Inject(CLOCK) private readonly clock: Clock,
    private readonly directory: CredentialDirectory,
  ) {}

  list(ctx: ActorContext): Promise<readonly ServiceAccountView[]> {
    // The view model carries no credential field, so there is nothing to strip.
    return this.services.serviceAccounts.list(ctx);
  }

  async create(
    ctx: ActorContext,
    input: CreateServiceAccountRequest,
  ): Promise<IssuedServiceAccount> {
    const issued = await this.services.serviceAccounts.create(ctx, input);
    return this.indexCredential(ctx, issued);
  }

  async rotate(ctx: ActorContext, serviceAccountId: string): Promise<IssuedServiceAccount> {
    const issued = await this.services.serviceAccounts.rotateCredential(ctx, serviceAccountId);
    return this.indexCredential(ctx, issued);
  }

  setEnabled(
    ctx: ActorContext,
    serviceAccountId: string,
    enabled: boolean,
  ): Promise<ServiceAccountView> {
    return this.services.serviceAccounts.setEnabled(ctx, serviceAccountId, enabled);
  }

  dryRun(
    ctx: ActorContext,
    serviceAccountId: string,
    input: ServiceAccountDryRunRequest,
  ): Promise<ServiceAccountDryRunView> {
    return this.services.serviceAccounts.dryRun(ctx, {
      serviceAccountId,
      tool: input.tool,
      args: input.args,
    });
  }

  /**
   * Write the edge verification record and hand the plaintext back once.
   *
   * The record holds a keyed digest, never the secret, and it carries the
   * service account id so `AuthGuard` can present the account itself as the
   * actor rather than the key that authenticated it.
   */
  private async indexCredential(
    ctx: ActorContext,
    issued: IssuedServiceAccountCredentialView,
  ): Promise<IssuedServiceAccount> {
    const parsed = parseCredential(issued.plaintext);
    if (parsed === null || issued.account.credentialPrefix === null) {
      throw new NotFoundError({ details: { resource: 'service_account' } });
    }

    for (const prefix of issued.revokedPrefixes) {
      const match = /^rly_ak_([0-9A-Za-z]{8})$/u.exec(prefix);
      if (match?.[1] !== undefined) {
        await this.directory.revokeApiKey(match[1]);
      }
    }

    await this.directory.putApiKey(
      apiKeyRecordSchema.parse({
        apiKeyId: issued.credentialId,
        serviceAccountId: issued.account.id,
        workspaceId: ctx.workspaceId,
        createdByUserId: issued.account.createdByUserId,
        name: issued.account.name,
        publicPrefix: parsed.publicPrefix,
        secretHash: hashSecret(parsed.secret, this.directory.pepper),
        scopes: issued.account.scopes,
        approvalLevel: issued.account.approvalLevel,
        projectIds: issued.account.projectIds,
        connectionIds: issued.account.connectionIds,
        ipAllowlist: [],
        expiresAt: issued.expiresAt,
        revokedAt: null,
        createdAt: this.clock.now().toISOString(),
      }),
    );

    return { account: issued.account, secret: issued.plaintext, expiresAt: issued.expiresAt };
  }
}
