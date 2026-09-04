/**
 * Look at, and revive, dead-lettered outbox rows.
 *
 * A row reaches the dead-letter table after ten failed dispatches or, since
 * the outbox was split by kind, immediately when no dispatcher understands its
 * kind. Either way a person has to look at it, fix whatever caused it, and put
 * it back. This is that second step.
 *
 * It is an operator command run on the box, like the rest of the worker's
 * tooling, not an HTTP endpoint: replaying an event re-sends real webhooks and
 * re-notifies real people, which is not something a session cookie should be
 * able to do.
 *
 *   pnpm --filter @relay/worker outbox:replay --list
 *   pnpm --filter @relay/worker outbox:replay --list --kind post.published
 *   pnpm --filter @relay/worker outbox:replay --replay evt_01H...
 */
import { loadConfigFor } from '@relay/config';
import { Prisma, createPrismaClient, serviceRoleClaims, withRlsContext } from '@relay/database';

const WORKER_SERVICE_NAME = 'worker' as const;

interface DeadLetterRow {
  readonly id: string;
  readonly outboxEventId: string;
  readonly workspaceId: string;
  readonly kind: string;
  readonly dedupeKey: string;
  readonly attempts: number;
  readonly errorCode: string;
  readonly failedAt: Date;
}

export interface ReplayArgs {
  readonly mode: 'list' | 'replay' | 'help';
  readonly kind: string | null;
  readonly outboxEventId: string | null;
}

export function parseArgs(argv: readonly string[]): ReplayArgs {
  const replayIndex = argv.indexOf('--replay');
  if (replayIndex >= 0) {
    const id = argv[replayIndex + 1];
    if (id === undefined || id.startsWith('--')) {
      return { mode: 'help', kind: null, outboxEventId: null };
    }
    return { mode: 'replay', kind: null, outboxEventId: id };
  }
  if (argv.includes('--list')) {
    const kindIndex = argv.indexOf('--kind');
    const raw = kindIndex >= 0 ? (argv[kindIndex + 1] ?? null) : null;
    const kind = raw === null || raw.startsWith('--') ? null : raw;
    return { mode: 'list', kind, outboxEventId: null };
  }
  return { mode: 'help', kind: null, outboxEventId: null };
}

const USAGE = `outbox-replay

  --list [--kind <kind>]     print dead-lettered rows as JSON
  --replay <outboxEventId>   clear the dead letter and make the row claimable again
`;

export async function main(argv: readonly string[] = process.argv.slice(2)): Promise<void> {
  const args = parseArgs(argv);
  if (args.mode === 'help') {
    process.stdout.write(USAGE);
    return;
  }

  const config = loadConfigFor(WORKER_SERVICE_NAME);
  const prisma = createPrismaClient({
    ...(config.database.url === undefined ? {} : { databaseUrl: config.database.url }),
  });

  try {
    if (args.mode === 'list') {
      const rows = await withRlsContext(prisma, serviceRoleClaims(), (tx) =>
        tx.$queryRaw<DeadLetterRow[]>(Prisma.sql`
          SELECT
            id,
            outbox_event_id AS "outboxEventId",
            workspace_id AS "workspaceId",
            kind,
            dedupe_key AS "dedupeKey",
            attempts,
            error_code AS "errorCode",
            failed_at AS "failedAt"
          FROM private.outbox_dead_letter
          ${args.kind === null ? Prisma.empty : Prisma.sql`WHERE kind = ${args.kind}`}
          ORDER BY failed_at DESC
          LIMIT 200
        `),
      );
      process.stdout.write(`${JSON.stringify(rows, null, 2)}\n`);
      return;
    }

    const outboxEventId = args.outboxEventId ?? '';
    const revived = await withRlsContext(prisma, serviceRoleClaims(), async (tx) => {
      const updated = await tx.$executeRaw(Prisma.sql`
        UPDATE private.outbox
        SET dead_lettered_at = NULL,
            attempts = 0,
            available_at = now(),
            claimed_at = NULL,
            last_error_code = NULL
        WHERE id = ${outboxEventId}
      `);
      if (updated === 0) {
        return 0;
      }
      await tx.$executeRaw(Prisma.sql`
        DELETE FROM private.outbox_dead_letter WHERE outbox_event_id = ${outboxEventId}
      `);
      return updated;
    });

    if (revived === 0) {
      process.stderr.write(`No outbox row with id ${outboxEventId}\n`);
      process.exitCode = 1;
      return;
    }
    process.stdout.write(`Replayed ${outboxEventId}. The next poll will claim it.\n`);
  } finally {
    await prisma.$disconnect();
  }
}

const entryPoint = process.argv[1] ?? '';
if (entryPoint.endsWith('outbox-replay.ts') || entryPoint.endsWith('outbox-replay.mjs')) {
  void main();
}
