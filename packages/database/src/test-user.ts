import { createPrismaClient, type RelayPrismaClient } from './client';
import { isProcessEntryPoint } from './invoked-directly';
import { createStderrLogger, type DatabaseLogger } from './logger';
import { SEED_IDS } from './seed/tenant-core';

/**
 * A tester who can actually sign in.
 *
 * The seed produces three users with `auth_subject_id = NULL` — real rows in
 * `app.users`, but nobody Neon Auth has ever heard of, so nobody can sign in as
 * them. This script closes that gap for the seeded owner without inventing a
 * new identity: it creates a Neon Auth password credential on the owner's own
 * email, then signs in through the API exactly as a browser would. The app's
 * own link seam (`linkProviderIdentity`, `packages/application/src/services/
 * identity.ts`) does the rest — it matches the new Neon Auth subject to the
 * existing `app.users` row by email and stamps `auth_subject_id` onto it.
 *
 * Deliberately NOT a database write of its own. Writing `auth_subject_id`
 * directly would only prove the column can hold a value; going through
 * `/v1/auth/signin` proves the seam that a real signup exercises does too, and
 * it is the one thing a tester's first login actually depends on.
 *
 * Idempotent: signing up an email Neon Auth already knows about fails cleanly,
 * and the script treats that as "already provisioned" rather than an error —
 * running this twice against the same database is a no-op, same as the seed.
 */

export interface TestUserOptions {
  readonly apiUrl?: string;
  readonly authBaseUrl?: string;
  readonly email?: string;
  readonly password?: string;
  readonly displayName?: string;
  readonly logger?: DatabaseLogger;
  readonly prisma?: RelayPrismaClient;
}

export interface TestUserResult {
  readonly email: string;
  readonly password: string;
  readonly userId: string;
  readonly workspaceId: string;
  readonly alreadyProvisioned: boolean;
}

const DEFAULT_EMAIL = 'owner@example.test';
const DEFAULT_PASSWORD = 'RelayTester2026!';
const DEFAULT_DISPLAY_NAME = 'Ada Okafor';

export async function createTestUser(options: TestUserOptions = {}): Promise<TestUserResult> {
  if (process.env['NODE_ENV'] === 'production') {
    throw new Error('Refusing to provision a test user: NODE_ENV is production.');
  }

  const logger = options.logger ?? createStderrLogger();
  const authBaseUrl = options.authBaseUrl ?? process.env['NEON_AUTH_BASE_URL'];
  if (authBaseUrl === undefined || authBaseUrl.length === 0) {
    throw new Error(
      'NEON_AUTH_BASE_URL is not set. Provision Neon Auth on the target branch first ' +
        '(mcp__neon__provision_neon_auth), or pass authBaseUrl explicitly.',
    );
  }
  const apiUrl = options.apiUrl ?? process.env['API_URL'] ?? 'http://localhost:4000';
  const email = options.email ?? DEFAULT_EMAIL;
  const password = options.password ?? DEFAULT_PASSWORD;
  const displayName = options.displayName ?? DEFAULT_DISPLAY_NAME;

  // Confirm the target row exists before touching the auth provider. A
  // signup against an email the seed never created would still succeed on
  // the Neon Auth side and then fail to link, which is a confusing way to
  // learn you seeded the wrong database.
  const prisma = options.prisma ?? createPrismaClient({ logger });
  try {
    const existing = await prisma.user.findFirst({
      where: { email },
      select: { id: true, authSubjectId: true },
    });
    if (existing === null) {
      throw new Error(
        `No app.users row for ${email}. Run "pnpm db:seed" against this database first.`,
      );
    }

    logger.info('db.testUser.start', { email });

    const signUpResponse = await fetch(`${authBaseUrl}/sign-up/email`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: new URL(apiUrl).origin },
      body: JSON.stringify({ email, password, name: displayName }),
    });

    let alreadyProvisioned = false;
    if (signUpResponse.ok) {
      logger.info('db.testUser.authSubjectCreated', { email });
    } else if (signUpResponse.status === 422 || signUpResponse.status === 400) {
      // Better Auth's shape for "this email already has a credential
      // account" — the common case on a second run. Anything else surfaces.
      alreadyProvisioned = existing.authSubjectId !== null;
      logger.info('db.testUser.authSubjectExists', { email, status: signUpResponse.status });
    } else {
      const body = await signUpResponse.text();
      throw new Error(`Neon Auth sign-up failed: ${signUpResponse.status} ${body.slice(0, 500)}`);
    }

    // The link seam only runs on a real sign-in, so provoke one. This is the
    // same request the browser sends from the login form — if it fails here,
    // it would have failed for the tester too.
    const signInResponse = await fetch(`${apiUrl}/v1/auth/signin`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: new URL(apiUrl).origin },
      body: JSON.stringify({ identifier: email, password }),
    });
    if (!signInResponse.ok) {
      const body = await signInResponse.text();
      throw new Error(
        `Sign-in did not link the account: ${signInResponse.status} ${body.slice(0, 500)}. ` +
          'If the auth subject already existed with a different password, reset it in the ' +
          'Neon Auth console or pick a fresh email.',
      );
    }
    const session = (await signInResponse.json()) as {
      readonly userId: string;
      readonly workspaceIds: readonly string[];
    };

    logger.info('db.testUser.complete', { email, userId: session.userId });

    return {
      email,
      password,
      userId: session.userId,
      workspaceId: session.workspaceIds[0] ?? SEED_IDS.workspace,
      alreadyProvisioned,
    };
  } finally {
    if (options.prisma === undefined) {
      await prisma.$disconnect();
    }
  }
}

const invokedDirectly = isProcessEntryPoint(import.meta.url, 'test-user');

if (invokedDirectly) {
  createTestUser()
    .then((result) => {
      // eslint-disable-next-line no-console -- this is the whole point of a CLI entry point
      console.log(
        `\nTest user ready.\n  email:    ${result.email}\n  password: ${result.password}\n  userId:   ${result.userId}\n  workspace: ${result.workspaceId}\n` +
          (result.alreadyProvisioned ? '  (already provisioned; re-linked on this run)\n' : ''),
      );
    })
    .catch((error: unknown) => {
      // eslint-disable-next-line no-console -- CLI entry point failure path
      console.error('db.testUser.failed', error);
      process.exitCode = 1;
    });
}
