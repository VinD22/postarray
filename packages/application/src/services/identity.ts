import { delegableScopes } from '@relay/authz';
import {
  ERROR_CODES,
  PROJECT_LIMIT_ENTITLEMENT_KEY,
  RelayError,
  normalizeProjectLimit,
  type ApprovalLevel,
  type Role,
} from '@relay/contracts';

import type {
  IdentityContext,
  IdentityService,
  ServiceDeps,
  SessionView,
  UserSecurityProfile,
} from '../types';
import { workspaceSlug } from '../internal/workspace-slug';
import { deriveOnboardingComplete } from './onboarding';

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
/**
 * Interactive transaction budget for identity writes.
 *
 * Prisma defaults to five seconds, which is generous against a database on the
 * same machine and too tight against a managed one where a single round trip
 * costs about half a second. Signup does a handful of reads and writes and was
 * failing against a remote Neon branch as "transaction not found", which reads
 * like a dropped connection rather than the timeout it is. Production runs
 * against a managed database, so the local default was never the relevant one.
 */
const IDENTITY_TX_OPTIONS = { timeout: 20_000, maxWait: 10_000 } as const;

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

    async getSessionView(
      userId: string,
      preferredWorkspaceId?: string,
    ): Promise<SessionView | null> {
      const user = await deps.prisma.user.findFirst({
        where: { id: userId, status: 'active' },
        select: {
          id: true,
          email: true,
          displayName: true,
          avatarUrl: true,
          locale: true,
          timeZone: true,
          aliases: {
            where: { isPrimary: true, verifiedAt: { not: null } },
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { handle: true },
          },
          memberships: {
            where: {
              state: 'active',
              workspace: { status: { notIn: ['suspended', 'deleted'] } },
            },
            orderBy: { createdAt: 'asc' },
            select: {
              role: true,
              workspace: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  status: true,
                  defaultLocale: true,
                  defaultTimeZone: true,
                  entitlements: {
                    where: { key: PROJECT_LIMIT_ENTITLEMENT_KEY },
                    take: 1,
                    select: { numericValue: true },
                  },
                  projects: {
                    where: { archivedAt: null },
                    orderBy: { createdAt: 'asc' },
                    select: {
                      id: true,
                      name: true,
                      socialConnections: { select: { id: true } },
                    },
                  },
                  // The explicit first-run record for this person in this
                  // workspace. Read in the same query as everything else the
                  // session needs, so resolving a session stays one round trip.
                  onboardingStates: {
                    where: { userId },
                    take: 1,
                    select: { completedAt: true },
                  },
                },
              },
            },
          },
        },
      });
      if (user === null || user.memberships.length === 0) {
        return null;
      }

      const activeMembership =
        user.memberships.find((membership) => membership.workspace.id === preferredWorkspaceId) ??
        user.memberships[0];
      if (activeMembership === undefined) {
        return null;
      }
      const toWorkspace = (
        membership: (typeof user.memberships)[number],
      ): SessionView['workspace'] => ({
        id: membership.workspace.id,
        name: membership.workspace.name,
        slug: membership.workspace.slug,
        timeZone: membership.workspace.defaultTimeZone,
        locale: membership.workspace.defaultLocale,
        role: membership.role,
        readOnly: !['active', 'trialing'].includes(membership.workspace.status),
        projectLimit: normalizeProjectLimit(membership.workspace.entitlements[0]?.numericValue),
      });

      return {
        user: {
          id: user.id,
          name: user.displayName,
          email: user.email,
          username: user.aliases[0]?.handle ?? null,
          avatarUrl: user.avatarUrl,
          locale: user.locale,
          timeZone: user.timeZone,
        },
        workspace: toWorkspace(activeMembership),
        workspaces: user.memberships.map(toWorkspace),
        projects: activeMembership.workspace.projects.map((project) => ({
          id: project.id,
          workspaceId: activeMembership.workspace.id,
          name: project.name,
          connectionIds: project.socialConnections.map((connection) => connection.id),
        })),
        scopes: delegableScopes(activeMembership.role),
        // The real value, not a constant. `deriveOnboardingComplete` is
        // deliberately conservative about the direction that hurts: an
        // established workspace with a project and a live connection reads as
        // onboarded even when no explicit record exists, because this flag
        // gates a redirect on every signed-in page and dumping existing
        // customers into a setup wizard they finished months ago is a worse
        // failure than letting one new account skip it.
        onboardingComplete: deriveOnboardingComplete({
          explicitlyCompleted: activeMembership.workspace.onboardingStates[0]?.completedAt != null,
          activeProjectCount: activeMembership.workspace.projects.length,
          connectionCount: activeMembership.workspace.projects.reduce(
            (total, project) => total + project.socialConnections.length,
            0,
          ),
        }),
      };
    },

    async linkProviderIdentity(input): Promise<string | null> {
      const email = input.email.trim().toLowerCase();
      const bySubject = await deps.prisma.user.findFirst({
        where: { authSubjectId: input.identitySubjectId, status: 'active' },
        select: { id: true, email: true, authSubjectId: true },
      });
      if (bySubject !== null) {
        return bySubject.email === email ? bySubject.id : null;
      }

      const byEmail = await deps.prisma.user.findFirst({
        where: { email, status: 'active' },
        select: { id: true, authSubjectId: true, emailVerifiedAt: true },
      });
      if (byEmail === null) {
        return null;
      }
      if (byEmail.authSubjectId !== null && byEmail.authSubjectId !== input.identitySubjectId) {
        return null;
      }

      const verifiedAt =
        input.emailVerified && byEmail.emailVerifiedAt === null ? deps.clock.now() : undefined;
      const updated = await deps.prisma.user.update({
        where: { id: byEmail.id },
        data: {
          ...(byEmail.authSubjectId === null ? { authSubjectId: input.identitySubjectId } : {}),
          ...(verifiedAt === undefined ? {} : { emailVerifiedAt: verifiedAt }),
        },
        select: { id: true },
      });
      return updated.id;
    },

    async recordSignupConsent(input): Promise<void> {
      // Prisma's interactive transactions default to a five second budget,
      // which is generous against a database on the same machine and too tight
      // against a managed one where a single round trip costs about half a
      // second. Signup does a handful of reads and writes and was failing on a
      // remote Neon branch as "transaction not found", which reads like a
      // dropped connection rather than a timeout. Production runs against a
      // managed database, so the local default was never the relevant one.
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
                  displayName: input.displayName,
                  locale: input.locale,
                  timeZone: input.timeZone,
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
                  timeZone: input.timeZone,
                  status: 'active',
                },
                select: { id: true },
              });

        const memberships = await tx.membership.count({ where: { userId: user.id } });
        if (memberships === 0) {
          await tx.workspace.create({
            data: {
              name: input.displayName,
              slug: workspaceSlug(input.displayName),
              ownerUserId: user.id,
              defaultLocale: input.locale,
              defaultTimeZone: input.timeZone,
              contentLocales: [input.locale],
              memberships: {
                create: {
                  userId: user.id,
                  role: 'owner',
                  state: 'active',
                  acceptedAt: deps.clock.now(),
                },
              },
              projects: {
                create: {
                  name: input.displayName,
                  slug: workspaceSlug(input.displayName),
                  defaultTimeZone: input.timeZone,
                },
              },
            },
          });
        }

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
      }, IDENTITY_TX_OPTIONS);
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
      }, IDENTITY_TX_OPTIONS);
    },
  };
}
