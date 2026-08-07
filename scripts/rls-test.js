import { spawnSync } from 'node:child_process';

/**
 * Local runner for the PostgreSQL RLS matrix.
 *
 * Requires a migrated database. Tests roll back every case, but shared
 * databases should still use an isolated branch before `release:check`.
 */

const databaseUrl = process.env['DIRECT_DATABASE_URL'] ?? process.env['DATABASE_URL'];
if (databaseUrl === undefined || databaseUrl === '') {
  fail('Set DIRECT_DATABASE_URL or DATABASE_URL to run the RLS matrix.');
}

process.stdout.write(
  'Running two-workspace RLS matrix (each case rolls back; prefer an isolated branch on shared Postgres).\n',
);

runPnpm(['--filter', '@relay/database', 'exec', 'vitest', 'run', 'src/rls.test.ts']);

function runPnpm(args) {
  const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
  const result = spawnSync(command, args, {
    env: process.env,
    stdio: 'inherit',
    shell: false,
  });

  if (result.error !== undefined) {
    fail(`Could not start pnpm: ${result.error.message}`);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function fail(message) {
  process.stderr.write(`RLS runner stopped: ${message}\n`);
  process.exit(1);
}
