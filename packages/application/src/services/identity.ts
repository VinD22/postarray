import { delegableScopes } from '@relay/authz';
import { ERROR_CODES, RelayError, type ApprovalLevel, type Role } from '@relay/contracts';

import type { IdentityContext, IdentityService, ServiceDeps, UserSecurityProfile } from '../types';

const ASCII_ALIAS = /^[a-z][a-z0-9._-]{2,29}$/;
const RESERVED_ALIASES = new Set([
  'admin',
  'api',
  'billing',
  'help',
  'login',
  'mcp',
  'relay',
  'root',
  'security',
  'settings',
  'support',
  'system',
]);

/**
 * Conservative launch policy for aliases.
 *
 * NFKC is always applied, but V1 accepts ASCII only until the UTS-39
 * confusables data pipeline is in place. That is safer than accepting Unicode
 * names while pretending a lowercase transform prevents lookalike attacks.
 */
export function normalizeAliasForLookup(value: string): string | null {
  const normalized = value.trim().normalize('NFKC').toLowerCase();
  return ASCII_ALIAS.test(normalized) ? normalized : null;
}

function aliasUnavailable(details: Readonly<Record<string, unknown>> = {}): RelayError {
  return new RelayError(ERROR_CODES.VALIDATION_FAILED, {
    messageKey: 'errors.alias_unavailable',
    details,
  });
}

function approvalForRole(role: Role): ApprovalLevel {
  switch (role) {
    case 'owner':
    case 'admin':
    case 'manager':
      return 'level_3_confirm';
    case 'editor':
    case 'approver':
      return 'level_2_scheduled';
    case 'analyst':
    case 'viewer':
      return 'level_0_read';
  }
}

const APPROVAL_RANK: Readonly<Record<ApprovalLevel, number>> = {
  level_0_read: 0,
  level_1_draft: 1,
  level_2_scheduled: 2,
  level_3_confirm: 3,
};

function strongestApproval(roles: readonly Role[]): ApprovalLevel {
  return roles.reduce<ApprovalLevel>((strongest, role) => {
    const candidate = approvalForRole(role);
    return APPROVAL_RANK[candidate] > APPROVAL_RANK[strongest] ? candidate : strongest;
  }, 'level_0_read');
}

export function createIdentityService(deps: ServiceDeps): IdentityService {
  return {
    async resolveLoginIdentifier(
      identifier: string,
    ): Promise<{ userId: string; email: string } | null> {
      const email = identifier.trim().toLowerCase();
      const byEmail = email.includes('@')
        ? await deps.prisma.user.findFirst({
            where: { email, status: 'active' },
            select: { id: true, email: true },
          })
        : null;
      if (byEmail !== null) {
        return { userId: byEmail.id, email: byEmail.email };
      }

      const normalized = normalizeAliasForLookup(identifier);
      if (normalized === null) {
        return null;
      }
      const alias = await deps.prisma.userAlias.findFirst({
        where: {
          normalizedHandle: normalized,
          isPrimary: true,
          verifiedAt: { not: null },
          user: { status: 'active' },
        },
        select: { user: { select: { id: true, email: true } } },
      });
      return alias === null ? null : { userId: alias.user.id, email: alias.user.email };
    },

    async getSecurityProfile(identitySubjectOrUserId: string): Promise<UserSecurityProfile | null> {
      const user = await deps.prisma.user.findFirst({
        where: {
          OR: [{ id: identitySubjectOrUserId }, { authSubjectId: identitySubjectOrUserId }],
          status: 'active',
        },
        select: {
          id: true,
          email: true,
          emailVerifiedAt: true,
          locale: true,
          mfaEnrolledAt: true,
          memberships: {
            where: { state: 'active', workspace: { status: { notIn: ['suspended', 'deleted'] } } },
            select: { workspaceId: true, role: true },
          },
        },
      });
      if (user === null) {
        return null;
      }

      const scopesByWorkspace = Object.fromEntries(
        user.memberships.map((membership) => [
          membership.workspaceId,
          delegableScopes(membership.role),
        ]),
      );
      return {
        userId: user.id,
        email: user.email,
        emailVerified: user.emailVerifiedAt !== null,
        locale: user.locale,
        approvalLevel: strongestApproval(user.memberships.map((membership) => membership.role)),
        workspaceIds: user.memberships.map((membership) => membership.workspaceId),
        scopesByWorkspace,
        mfaEnrolled: user.mfaEnrolledAt !== null,
      };
    },

    async recordSignupConsent(input): Promise<void> {
      await deps.prisma.$transaction(async (tx) => {
        const existing = await tx.user.findUnique({
          where: { email: input.email.trim().toLowerCase() },
          select: { id: true, authSubjectId: true },
        });
        const user =
          existing === null
            ? await tx.user.create({
                data: {
                  authSubjectId: input.identitySubjectId,
                  email: input.email.trim().toLowerCase(),
                  displayName: input.email.trim().toLowerCase(),
                  locale: input.locale,
                  status: 'active',
                },
                select: { id: true },
              })
            : await tx.user.update({
                where: { id: existing.id },
                data: {
                  ...(existing.authSubjectId === null
                    ? { authSubjectId: input.identitySubjectId }
                    : {}),
                  locale: input.locale,
                  status: 'active',
                },
                select: { id: true },
              });

        await tx.consent.createMany({
          data: [
            {
              userId: user.id,
              kind: 'terms_of_service',
              documentVersion: input.termsVersionHash,
              countryCode: input.countryCode,
            },
            {
              userId: user.id,
              kind: 'privacy_notice',
              documentVersion: input.privacyVersionHash,
              countryCode: input.countryCode,
            },
          ],
          skipDuplicates: true,
        });
      });
    },

    async setUsernameAlias(ctx: IdentityContext, alias: string): Promise<{ alias: string }> {
      const userId = ctx.userId;
      const normalized = normalizeAliasForLookup(alias);
      if (userId === undefined || normalized === null || RESERVED_ALIASES.has(normalized)) {
        throw aliasUnavailable({ reason: 'policy_rejected' });
      }

      return deps.prisma.$transaction(async (tx) => {
        const collision = await tx.userAlias.findUnique({
          where: { normalizedHandle: normalized },
          select: { userId: true, isPrimary: true },
        });
        if (collision !== null && (collision.userId !== userId || !collision.isPrimary)) {
          throw aliasUnavailable({ reason: 'unavailable' });
        }
        if (collision !== null) {
          return { alias: normalized };
        }

        await tx.userAlias.updateMany({
          where: { userId, isPrimary: true },
          data: { isPrimary: false, reservedReason: 'retired' },
        });
        const created = await tx.userAlias.create({
          data: {
            userId,
            handle: normalized,
            normalizedHandle: normalized,
            isPrimary: true,
            verifiedAt: deps.clock.now(),
          },
          select: { handle: true },
        });
        return { alias: created.handle };
      });
    },
  };
}
