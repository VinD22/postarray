import type { ProviderId } from './enums';

/**
 * The deliberately small launch cohort shown in customer connection flows.
 * Adapter code for other providers may remain in the repository, but it is not
 * part of the product promise until the cohort changes and definition-of-done
 * evidence exists. Reddit and Medium adapters are still here and still tested;
 * they are simply no longer offered as part of the launch promise.
 *
 * Membership here is a statement of intent, never a statement of readiness.
 * A provider in this list still renders its real capability state, and still
 * cannot publish in production until it appears in the reviewed
 * `VERIFIED_PRODUCTION_CONNECTORS` allow-list in `@relay/config`.
 */
export const CORE_PROVIDER_IDS = [
  'x',
  'instagram',
  'facebook',
  'linkedin',
  'tiktok',
  'youtube',
  'pinterest',
  'bluesky',
  'threads',
  'google_business_profile',
] as const satisfies readonly ProviderId[];

export type CoreProviderId = (typeof CORE_PROVIDER_IDS)[number];

const CORE_PROVIDER_SET: ReadonlySet<ProviderId> = new Set(CORE_PROVIDER_IDS);

export function isCoreProvider(provider: ProviderId): provider is CoreProviderId {
  return CORE_PROVIDER_SET.has(provider);
}
