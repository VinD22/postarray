import { Injectable } from '@nestjs/common';
import {
  normalizeScopes,
  type ApprovalLevel,
  type CreationSurface,
  type Scope,
} from '@relay/contracts';
import { canonicalizeLocaleTag, isActiveLocale, resolveLocale } from '@relay/i18n';

import type { ActorContext, IdentityContext } from '../application/port';
import type { Principal } from './request.types';

/**
 * The one construction site for `ActorContext`.
 *
 * Section 1 of `docs/planning/04-auth-oauth-and-security.md` is explicit that
 * the actor context is built once, at the edge, by a single resolver per
 * surface. This class is that resolver for the REST API. If you find yourself
 * assembling an actor context anywhere else in this application, that is the
 * bug.
 *
 * The context is a *narrowing*, never a widening. `workspaceId` is singular:
 * a request that wants to touch two workspaces is two requests.
 */
export interface ActorContextInput {
  readonly principal: Principal;
  readonly workspaceId: string;
  readonly correlationId: string;
  readonly surface: CreationSurface;
  readonly idempotencyKey?: string | undefined;
  readonly acceptLanguage?: string | undefined;
}

@Injectable()
export class ActorContextFactory {
  build(input: ActorContextInput): ActorContext {
    const { principal } = input;

    // Registry order, duplicates and unknown values dropped. The application
    // layer intersects this again with the live membership, which is what makes
    // a demotion take effect without touching the credential.
    const scopes: readonly Scope[] = normalizeScopes(principal.scopes);

    const context: ActorContext = {
      actorType: principal.actorType,
      actorId: principal.actorId,
      workspaceId: input.workspaceId,
      scopes,
      surface: input.surface,
      correlationId: input.correlationId,
      approvalLevel: principal.approvalLevel,
      locale: this.resolveLocale(principal, input.acceptLanguage),
      ...(input.idempotencyKey === undefined ? {} : { idempotencyKey: input.idempotencyKey }),
      // Which credential proved this identity. The application layer re-checks
      // its revocation, so a rotated key is refused there too and not only by
      // the edge index that normally stops it.
      ...(principal.credentialId === undefined ? {} : { credentialId: principal.credentialId }),
    };
    return context;
  }

  /**
   * The tenant-free form, for creating a workspace and for accepting an
   * invitation into one the caller has not joined yet.
   */
  buildIdentity(input: Omit<ActorContextInput, 'workspaceId'>): IdentityContext {
    const { principal } = input;
    return {
      actorType: principal.actorType,
      actorId: principal.actorId,
      userId: principal.userId,
      surface: input.surface,
      correlationId: input.correlationId,
      locale: this.resolveLocale(principal, input.acceptLanguage),
      ...(input.idempotencyKey === undefined ? {} : { idempotencyKey: input.idempotencyKey }),
    };
  }

  /**
   * The credential's stored locale wins, because it is the preference the human
   * actually saved. `Accept-Language` is the fallback for a first request.
   */
  private resolveLocale(principal: Principal, acceptLanguage: string | undefined): string {
    const stored = canonicalizeLocaleTag(principal.locale);
    if (isActiveLocale(stored)) {
      return stored;
    }
    return resolveLocale(acceptLanguage ?? null);
  }
}

/** Approval levels in ascending order, for capping comparisons. */
export const APPROVAL_LEVEL_ORDER: readonly ApprovalLevel[] = [
  'level_0_read',
  'level_1_draft',
  'level_2_scheduled',
  'level_3_confirm',
];

/** True when `held` is at least `required` on the autonomy ladder. */
export function meetsApprovalLevel(held: ApprovalLevel, required: ApprovalLevel): boolean {
  return APPROVAL_LEVEL_ORDER.indexOf(held) >= APPROVAL_LEVEL_ORDER.indexOf(required);
}
