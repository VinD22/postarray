import { test } from '@playwright/test';

/** What the golden path needs from the running stack. See the config header. */
export interface GoldenEnv {
  readonly apiUrl: string;
  readonly email: string;
  readonly password: string;
  readonly channels: readonly [string, string];
}

function read(name: string): string | null {
  const value = process.env[name]?.trim();
  return value === undefined || value.length === 0 ? null : value;
}

/** The environment, or the reason the golden path cannot run here. */
export function readGoldenEnv(): GoldenEnv | { readonly missing: string } {
  const apiUrl = read('GOLDEN_E2E_API_URL') ?? 'http://localhost:3001';
  const email = read('GOLDEN_E2E_EMAIL');
  const password = read('GOLDEN_E2E_PASSWORD');
  const channels = (read('GOLDEN_E2E_CHANNELS') ?? '')
    .split(',')
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
  if (email === null) return { missing: 'GOLDEN_E2E_EMAIL' };
  if (password === null) return { missing: 'GOLDEN_E2E_PASSWORD' };
  const [first, second] = channels;
  if (first === undefined || second === undefined) {
    return { missing: 'GOLDEN_E2E_CHANNELS (two connection names)' };
  }
  return { apiUrl, email, password, channels: [first, second] };
}

/**
 * Skip, with the reason, when the stack is not there. A missing stack is an
 * environment fact, not a product failure, and must not read as one.
 */
export async function requireGoldenStack(): Promise<GoldenEnv> {
  const env = readGoldenEnv();
  if ('missing' in env) {
    test.skip(true, `Golden path needs ${env.missing}. See playwright.golden.config.ts.`);
    throw new Error('unreachable');
  }
  const healthy = await fetch(`${env.apiUrl}/healthz`).then(
    (response) => response.ok,
    () => false,
  );
  test.skip(!healthy, `API at ${env.apiUrl} did not answer /healthz.`);
  return env;
}
