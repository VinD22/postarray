import { spawnSync } from 'node:child_process';

const ISOLATED_DATABASE_CONFIRMATION = 'confirm-isolated-branch';

const databaseUrl = process.env['DIRECT_DATABASE_URL'] ?? process.env['DATABASE_URL'];
if (databaseUrl === undefined || databaseUrl === '') {
  fail(
    'DIRECT_DATABASE_URL or DATABASE_URL is required. The release check refuses to skip database and RLS verification.',
  );
}

if (process.env['RELAY_RELEASE_DATABASE_TEST_WRITES'] !== ISOLATED_DATABASE_CONFIRMATION) {
  fail(
    `Set RELAY_RELEASE_DATABASE_TEST_WRITES=${ISOLATED_DATABASE_CONFIRMATION} only after confirming the database URL targets an isolated release branch. The RLS suite creates and removes test fixtures.`,
  );
}

if (isEnabled(process.env['BILLING_CHECKOUT_ENABLED'])) {
  fail('BILLING_CHECKOUT_ENABLED must be false for the public prelaunch release.');
}

const steps = [
  {
    label: 'Verify the remote migration ledger without changing schema',
    args: ['--filter', '@relay/database', 'migrations:verify'],
  },
  { label: 'Check formatting', args: ['format:check'] },
  {
    label: 'Run fresh type, lint, unit, integration and RLS gates',
    args: ['exec', 'turbo', 'run', 'typecheck', 'lint', 'test', '--force'],
  },
  {
    label: 'Run browser smoke, accessibility and pseudo-locale gates',
    args: ['--filter', '@relay/web', 'test:e2e'],
  },
  {
    label: 'Build every production surface from a fresh task run',
    args: ['exec', 'turbo', 'run', 'build', '--force'],
  },
  {
    label: 'Audit production dependencies',
    args: ['audit', '--prod', '--audit-level', 'high'],
  },
];

for (const step of steps) {
  process.stdout.write(`\nRelease gate: ${step.label}\n`);
  runPnpm(step.args);
}

process.stdout.write('\nRelease gate passed. Keep checkout and unverified connectors disabled.\n');

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

function isEnabled(value) {
  if (value === undefined) return false;
  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
}

function fail(message) {
  process.stderr.write(`Release gate stopped: ${message}\n`);
  process.exit(1);
}
