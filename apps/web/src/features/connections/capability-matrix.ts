/**
 * The capability matrix, generated from versioned connector snapshots.
 *
 * The reason this file exists is a single product rule: "this provider does
 * not offer it" and "we have not built it yet" are different sentences and
 * must never be merged into "unavailable". Collapsing them tells a customer a
 * platform cannot do something when the truth is that we have not shipped it,
 * and that is how a product ends up promising what an adapter cannot do.
 *
 * Nothing here invents a value. A feature with no entry on a snapshot is
 * reported as `not_implemented`, which is the honest default: we have not
 * described it, so we have not built it.
 */

import type { CapabilitySupport, ProviderId } from '@/lib/api/types';
import type { CapabilitySnapshot } from '@relay/contracts';
import {
  CAPABILITY_FEATURES,
  FEATURE_CONTENT_KIND,
  type CapabilityFeature,
  type CapabilityMatrix,
} from './types';

/** The support value for one feature on one snapshot. */
export function supportFor(
  snapshot: CapabilitySnapshot,
  feature: CapabilityFeature,
): CapabilitySupport {
  const contentKind = FEATURE_CONTENT_KIND[feature];
  if (contentKind) {
    return snapshot.contentKinds[contentKind] ?? 'not_implemented';
  }

  switch (feature) {
    case 'firstComment':
      return snapshot.firstComment.support;
    case 'mentions':
      return snapshot.mentions.support;
    case 'destinations':
      return summarizeDestinations(snapshot);
    case 'privacy':
      return snapshot.privacy.support;
    case 'thumbnail':
      // A provider that requires a thumbnail necessarily accepts one. A
      // provider that does not require one may still accept it, and we only
      // claim support where the adapter sends it.
      return snapshot.media.requiresThumbnail ? 'supported' : 'not_implemented';
    case 'altText':
      return snapshot.media.altText;
    case 'analytics':
      return snapshot.analytics.support;
    case 'delete':
      return snapshot.deletion.support;
    case 'disclosure':
      return strongestDisclosure(snapshot);
    default:
      return 'not_implemented';
  }
}

/**
 * Destination selection is a list. The row reports the best state across it,
 * because "LinkedIn supports organization destinations" is true even though it
 * does not support boards.
 */
function summarizeDestinations(snapshot: CapabilitySnapshot): CapabilitySupport {
  const relevant = snapshot.destinations.filter(
    (destination) => destination.kind !== 'none',
  );
  if (relevant.length === 0) return 'unsupported';
  return strongest(relevant.map((destination) => destination.support));
}

function strongestDisclosure(snapshot: CapabilitySnapshot): CapabilitySupport {
  return strongest([
    snapshot.disclosure.aiLabel,
    snapshot.disclosure.commercialContent,
    snapshot.disclosure.brandedContent,
  ]);
}

/**
 * Rank order for combining several values into one cell.
 *
 * `unsupported` is the weakest because it is the only one that is a statement
 * about the provider rather than about us, so it must lose to anything we have
 * built or are waiting on review for.
 */
const SUPPORT_RANK: Readonly<Record<CapabilitySupport, number>> = {
  supported: 3,
  requires_review: 2,
  not_implemented: 1,
  unsupported: 0,
};

export function strongest(values: readonly CapabilitySupport[]): CapabilitySupport {
  let best: CapabilitySupport = 'unsupported';
  for (const value of values) {
    if (SUPPORT_RANK[value] > SUPPORT_RANK[best]) best = value;
  }
  return best;
}

/** Build the whole matrix from one snapshot per provider. */
export function buildCapabilityMatrix(
  snapshots: readonly CapabilitySnapshot[],
): CapabilityMatrix {
  const byProvider = new Map<ProviderId, CapabilitySnapshot>();
  for (const snapshot of snapshots) {
    const existing = byProvider.get(snapshot.provider);
    // Keep the newest snapshot per provider so a stale connection cannot make
    // a platform look less capable than it is.
    if (!existing || snapshot.observedAt > existing.observedAt) {
      byProvider.set(snapshot.provider, snapshot);
    }
  }

  const providers = [...byProvider.keys()].sort();
  const rows = CAPABILITY_FEATURES.map((feature) => ({
    feature,
    cells: providers.map((provider) => {
      const snapshot = byProvider.get(provider);
      return {
        feature,
        provider,
        support: snapshot ? supportFor(snapshot, feature) : ('not_implemented' as const),
      };
    }),
  }));

  const observedAt = [...byProvider.values()]
    .map((snapshot) => snapshot.observedAt)
    .sort()
    .at(-1);

  const versions = new Set([...byProvider.values()].map((s) => s.capabilityVersion));

  return {
    providers,
    rows,
    observedAt: observedAt ?? null,
    capabilityVersion: versions.size === 1 ? ([...versions][0] ?? null) : null,
  };
}

/**
 * The capability badge state for a support value.
 *
 * `CapabilityBadge` in the design system already uses exactly these four
 * names, so this is an identity mapping today. It exists so that if the
 * contract ever gains a fifth value, exactly one place has to decide how it
 * renders instead of every call site guessing.
 */
export function badgeState(
  support: CapabilitySupport,
): 'supported' | 'unsupported' | 'not_implemented' | 'requires_review' {
  return support;
}
