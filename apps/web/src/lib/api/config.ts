/**
 * Runtime configuration for the API client.
 *
 * Live data is the production default. Seeded fixtures require an explicit
 * local-development opt in, so a missing deployment variable can never make a
 * production workspace look healthy while no API is connected.
 */

export interface ApiConfig {
  readonly baseUrl: string | null;
  readonly mode: 'live' | 'demo' | 'unconfigured';
  readonly apiVersion: string;
  /** Milliseconds before a request is abandoned. */
  readonly timeoutMs: number;
}

export interface ApiEnvironment {
  readonly apiUrl?: string;
  readonly demoMode?: string;
  readonly nodeEnv?: string;
}

function readBaseUrl(rawValue: string | undefined): string | null {
  const raw = rawValue?.trim();
  if (!raw) {
    return null;
  }
  return raw.replace(/\/+$/, '');
}

export function readApiConfig(
  environment: ApiEnvironment = {
    apiUrl: process.env.NEXT_PUBLIC_RELAY_API_URL,
    demoMode: process.env.NEXT_PUBLIC_RELAY_DEMO_MODE,
    nodeEnv: process.env.NODE_ENV,
  },
): ApiConfig {
  const baseUrl = readBaseUrl(environment.apiUrl);
  const demoRequested = environment.demoMode?.trim().toLowerCase() === 'true';
  const demoAllowed = demoRequested && environment.nodeEnv !== 'production';

  return {
    baseUrl,
    mode: baseUrl !== null ? 'live' : demoAllowed ? 'demo' : 'unconfigured',
    apiVersion: 'v1',
    timeoutMs: 20_000,
  };
}

export const apiConfig: ApiConfig = readApiConfig();

/** True only when a developer explicitly enabled seeded example content. */
export const isDemoMode = apiConfig.mode === 'demo';
