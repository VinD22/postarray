import { spawnSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import path from 'node:path';

resetNextBuildDirectory();

const executable = path.resolve(
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'playwright.cmd' : 'playwright',
);
const result = spawnSync(executable, ['test'], {
  env: process.env,
  stdio: 'inherit',
  shell: false,
});

if (result.error !== undefined) {
  process.stderr.write(`Could not start Playwright: ${result.error.message}\n`);
  process.exit(1);
}
process.exit(result.status ?? 1);

function resetNextBuildDirectory() {
  const buildDirectory = path.resolve('.next');
  const lockPath = path.join(buildDirectory, 'dev', 'lock');
  let contents = null;
  try {
    contents = readFileSync(lockPath, 'utf8');
  } catch (error) {
    if (!isFileSystemError(error) || error.code !== 'ENOENT') throw error;
  }

  if (contents !== null) {
    const pid = readLockPid(contents);
    if (pid === null) {
      process.stderr.write('The Next.js development lock is malformed. Remove it manually.\n');
      process.exit(1);
    }

    try {
      process.kill(pid, 0);
      process.stderr.write('A Next.js development server is already running.\n');
      process.exit(1);
    } catch (error) {
      if (!isFileSystemError(error) || error.code !== 'ESRCH') throw error;
    }
  }

  rmSync(buildDirectory, { recursive: true, force: true });
  process.stdout.write('Reset the Next.js build directory for E2E.\n');
}

function readLockPid(contents) {
  try {
    const parsed = JSON.parse(contents);
    if (typeof parsed !== 'object' || parsed === null || !('pid' in parsed)) return null;
    const pid = parsed.pid;
    return typeof pid === 'number' && Number.isSafeInteger(pid) && pid > 0 ? pid : null;
  } catch {
    return null;
  }
}

function isFileSystemError(error) {
  return error instanceof Error && 'code' in error && typeof error.code === 'string';
}
