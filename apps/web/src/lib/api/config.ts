/**
 * Runtime configuration for the API client.
 *
 * `NEXT_PUBLIC_RELAY_API_URL` is the only switch that matters. When it is
 * absent the client serves seeded fixtures and the shell renders a persistent
 * "Demo data" notice, so nobody mistakes a seeded workspace for a real one.
 */

export interface ApiConfig {
  readonly baseUrl: string | null;
  readonly mode: 'live' | 'demo';
  readonly apiVersion: string;
  /** Milliseconds before a request is abandoned. */
  readonly timeoutMs: number;
}

function readBaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_RELAY_API_URL?.trim();
  if (!raw) {
    return null;
  }
  return raw.replace(/\/+$/, '');
}

export function readApiConfig(): ApiConfig {
  const baseUrl = readBaseUrl();
  return {
    baseUrl,
    mode: baseUrl === null ? 'demo' : 'live',
    apiVersion: 'v1',
    timeoutMs: 20_000,
  };
}

export const apiConfig: ApiConfig = readApiConfig();

/** True when the screens are showing seeded example content. */
export const isDemoMode = apiConfig.mode === 'demo';
