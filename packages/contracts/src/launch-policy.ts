import type { ProviderId } from './enums';

/**
 * The deliberately small launch cohort shown in customer connection flows.
 * Adapter code for later providers may remain in the repository, but it is not
 * part of the product promise until the cohort changes and definition-of-done
 * evidence exists.
 */
export const CORE_PROVIDER_IDS = [
  'x',
  'instagram',
  'linkedin',
  'facebook',
  'youtube',
  'tiktok',
  'reddit',
  'medium',
] as const satisfies readonly ProviderId[];

export type CoreProviderId = (typeof CORE_PROVIDER_IDS)[number];

const CORE_PROVIDER_SET: ReadonlySet<ProviderId> = new Set(CORE_PROVIDER_IDS);

export function isCoreProvider(provider: ProviderId): provider is CoreProviderId {
  return CORE_PROVIDER_SET.has(provider);
}
