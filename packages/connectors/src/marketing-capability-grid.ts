import type { CapabilitySupport, ProviderId } from '@relay/contracts';

import type { ConnectorFeature } from './contract';
import type { ConnectorRegistry } from './registry';

/**
 * Marketing matrix columns on the public site.
 *
 * These names are shared with `apps/web/src/features/marketing/data/connectors.ts`.
 * The registry feature map is the source of truth for `not_implemented` versus
 * `unsupported`; hand-authored citations on the site still explain platform limits.
 */
export const MARKETING_CAPABILITY_COLUMNS = [
  'text',
  'image',
  'carousel',
  'video',
  'document',
  'thread',
  'altText',
  'destinations',
  'privacy',
  'thumbnail',
  'analytics',
  'delete',
  'disclosure',
] as const;

export type MarketingCapabilityColumn = (typeof MARKETING_CAPABILITY_COLUMNS)[number];

export type MarketingCapabilityState =
  | 'supported'
  | 'unsupported'
  | 'not_implemented'
  | 'requires_review';

const COLUMN_FEATURES: Readonly<
  Record<MarketingCapabilityColumn, ConnectorFeature | readonly ConnectorFeature[]>
> = {
  text: 'publish',
  image: 'prepare_media',
  carousel: 'carousel',
  video: 'video',
  document: 'document',
  thread: 'thread_parts',
  altText: 'alt_text',
  destinations: 'list_destinations',
  privacy: 'privacy_controls',
  thumbnail: 'prepare_media',
  analytics: ['post_analytics', 'account_analytics'],
  delete: 'delete_post',
  disclosure: ['ai_disclosure', 'commercial_disclosure'],
};

function resolveColumnState(
  features: Readonly<Record<ConnectorFeature, CapabilitySupport>>,
  column: MarketingCapabilityColumn,
): MarketingCapabilityState {
  const mapped = COLUMN_FEATURES[column];
  const keys = (Array.isArray(mapped) ? mapped : [mapped]) as readonly ConnectorFeature[];
  const supports = keys.map((feature) => features[feature] ?? 'not_implemented');
  if (supports.every((state) => state === 'unsupported')) {
    return 'unsupported';
  }
  if (supports.some((state) => state === 'requires_review')) {
    return 'requires_review';
  }
  if (supports.some((state) => state === 'supported')) {
    return 'supported';
  }
  if (supports.some((state) => state === 'not_implemented')) {
    return 'not_implemented';
  }
  return 'unsupported';
}

/** Public marketing never shows `supported` until a connector passes definition of done. */
export function clampMarketingStateForPublic(
  state: MarketingCapabilityState,
): Exclude<MarketingCapabilityState, 'supported'> {
  return state === 'supported' ? 'not_implemented' : state;
}

export function buildPublicMarketingCapabilityStates(
  registry: ConnectorRegistry,
): Readonly<
  Record<
    ProviderId,
    Readonly<Record<MarketingCapabilityColumn, Exclude<MarketingCapabilityState, 'supported'>>>
  >
> {
  const raw = buildMarketingCapabilityStates(registry);
  const output = {} as Record<
    ProviderId,
    Readonly<Record<MarketingCapabilityColumn, Exclude<MarketingCapabilityState, 'supported'>>>
  >;
  for (const [provider, row] of Object.entries(raw) as Array<
    [ProviderId, Readonly<Record<MarketingCapabilityColumn, MarketingCapabilityState>>]
  >) {
    const columns = {} as Record<
      MarketingCapabilityColumn,
      Exclude<MarketingCapabilityState, 'supported'>
    >;
    for (const column of MARKETING_CAPABILITY_COLUMNS) {
      columns[column] = clampMarketingStateForPublic(row[column]);
    }
    output[provider] = columns;
  }
  return output;
}

/** Registry-backed capability states for the public marketing matrix. */
export function buildMarketingCapabilityStates(
  registry: ConnectorRegistry,
): Readonly<Record<ProviderId, Readonly<Record<MarketingCapabilityColumn, MarketingCapabilityState>>>> {
  const matrix = registry.supportMatrix();
  const output = {} as Record<
    ProviderId,
    Readonly<Record<MarketingCapabilityColumn, MarketingCapabilityState>>
  >;
  for (const entry of matrix) {
    const columns = {} as Record<MarketingCapabilityColumn, MarketingCapabilityState>;
    for (const column of MARKETING_CAPABILITY_COLUMNS) {
      columns[column] = resolveColumnState(entry.features, column);
    }
    output[entry.provider] = columns;
  }
  return output;
}

export function serializeMarketingCapabilityStates(
  states: Readonly<
    Record<ProviderId, Readonly<Record<MarketingCapabilityColumn, MarketingCapabilityState>>>
  >,
): string {
  return `/** Generated from @relay/connectors registry. Run \`pnpm generate:marketing-states\`. */\nexport const REGISTRY_MARKETING_CAPABILITY_STATES = ${JSON.stringify(states, null, 2)} as const;\n`;
}
