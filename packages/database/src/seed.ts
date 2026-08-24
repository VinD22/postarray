import { createPrismaClient, type RelayPrismaClient } from './client';
import { isProcessEntryPoint } from './invoked-directly';
import { createStderrLogger, type DatabaseLogger } from './logger';
import { seedGlobalCatalogs } from './seed/catalog';
import { SEED_IDS, seedTenantCore } from './seed/tenant-core';
import { seedTenantContent } from './seed/tenant-content';
import { serviceRoleClaims, withRlsContext } from './tenancy/rls-context';

/**
 * Realistic local data.
 *
 * What this produces: one workspace, an owner, an editor and an approver, two
 * projects, a `fake` provider connection with a complete capability snapshot,
 * five posts spread across draft, validation-needed, scheduled and published
 * with receipts, attempts and metric observations (publishing through the fake
 * connection additionally requires POSTARRAY_ALLOW_FAKE_CONNECTOR=true, which is
 * honored only outside production), one automation rule with a
 * run, one RSS feed, one tracked short link with clicks, a trialing
 * subscription, and three verified records in each curated catalog.
 *
 * Two rules the seed follows, and they are not negotiable:
 *
 *   * Every third-party URL is on `example.test`, a reserved domain that cannot
 *     resolve. No invented real-looking directory, publication, tool or customer
 *     appears anywhere, because seed data ends up in screenshots and demos.
 *   * No performance claim, customer logo or testimonial is fabricated. The
 *     metric numbers exist so a chart has a shape; the one metric the fake
 *     provider does not return is stored as `unavailable`, never as zero.
 *
 * The whole seed runs in one transaction with service-role RLS claims, so a
 * failure leaves the database exactly as it was. Everything is an upsert keyed
 * on a deterministic UUID, so running it twice is a no-op rather than a
 * duplicate.
 */

export interface SeedOptions {
  readonly prisma?: RelayPrismaClient;
  readonly logger?: DatabaseLogger;
  readonly databaseUrl?: string;
}

export async function seed(options: SeedOptions = {}): Promise<void> {
  if (process.env['NODE_ENV'] === 'production') {
    throw new Error('Refusing to seed: NODE_ENV is production.');
  }

  const logger = options.logger ?? createStderrLogger();
  const prisma =
    options.prisma ??
    createPrismaClient(
      options.databaseUrl === undefined ? { logger } : { logger, databaseUrl: options.databaseUrl },
    );

  const startedAt = Date.now();
  logger.info('db.seed.start');

  try {
    await withRlsContext(
      prisma,
      serviceRoleClaims(),
      async (tx) => {
        await seedGlobalCatalogs(tx);
        await seedTenantCore(tx);
        await seedTenantContent(tx);
      },
      // Ten minutes, not two. The seed is one interactive transaction of a few
      // hundred writes, which is a second or two against a local Postgres and
      // several minutes against a remote Neon branch where every round trip
      // costs about half a second. Two minutes was enough for the former and
      // silently too short for the latter, which fails late and confusingly as
      // "transaction not found" rather than as a timeout.
      { timeoutMs: 600_000, maxWaitMs: 30_000 },
    );
  } finally {
    if (options.prisma === undefined) {
      await prisma.$disconnect();
    }
  }

  logger.info('db.seed.complete', {
    workspaceId: SEED_IDS.workspace,
    durationMs: Date.now() - startedAt,
  });
}

export { SEED_IDS } from './seed/tenant-core';
export { SEED_OPPORTUNITY_IDS, SEED_TOOL_IDS, SEED_METRIC_IDS } from './seed/catalog';

const invokedDirectly = isProcessEntryPoint(import.meta.url, 'seed');

if (invokedDirectly) {
  seed().catch((error: unknown) => {
    createStderrLogger().error('db.seed.failed', {
      message: error instanceof Error ? error.message : String(error),
    });
    process.exitCode = 1;
  });
}
