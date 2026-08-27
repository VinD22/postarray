import {
  CONTENT_KINDS,
  MEDIA_KINDS,
  capabilitySnapshotSchema,
  type CapabilitySnapshot,
  type CapabilitySupport,
  type ContentKind,
  type MediaKind,
} from '@relay/contracts';

/**
 * Builders for a `CapabilitySnapshot`.
 *
 * A snapshot is data. These helpers exist so an adapter cannot accidentally omit a field
 * or leave a content kind undeclared: everything defaults to the honest, conservative
 * value and the adapter states only what it actually knows.
 */

/**
 * Every content kind starts as `not_implemented`, which is the truthful default for
 * something we have not built. An adapter promotes a kind to `supported`, demotes it to
 * `unsupported` when the provider does not offer it at all, or marks it
 * `requires_review` when the provider offers it but our app review does not cover it yet.
 */
export function contentKinds(
  overrides: Partial<Record<ContentKind, CapabilitySupport>>,
): Record<ContentKind, CapabilitySupport> {
  const record = {} as Record<ContentKind, CapabilitySupport>;
  for (const kind of CONTENT_KINDS) {
    record[kind] = overrides[kind] ?? 'not_implemented';
  }
  return record;
}

/** Byte ceilings per media kind. An omitted kind is `null`, meaning "we do not know". */
export function mediaBytes(
  overrides: Partial<Record<MediaKind, number | null>>,
): Record<MediaKind, number | null> {
  const record = {} as Record<MediaKind, number | null>;
  for (const kind of MEDIA_KINDS) {
    record[kind] = overrides[kind] ?? null;
  }
  return record;
}

export const MEGABYTE = 1024 * 1024;

/**
 * Parse and freeze a snapshot. Every adapter returns through here, so a snapshot that
 * would fail the contract schema fails at the adapter rather than three layers later.
 */
export function buildSnapshot(input: unknown): CapabilitySnapshot {
  return Object.freeze(capabilitySnapshotSchema.parse(input));
}

/** No sequence support at all: the provider genuinely cannot do it. */
export const UNSUPPORTED_SEQUENCE = Object.freeze({
  support: 'unsupported' as CapabilitySupport,
  maxItems: 0,
  minDelaySeconds: 0,
});

/** We never use provider side scheduling. Post Array schedules through Temporal. */
export const RELAY_SIDE_SCHEDULING = Object.freeze({
  providerNative: 'not_implemented' as CapabilitySupport,
  maxLookAheadDays: 365,
  minLeadSeconds: 0,
});

/** No privacy selector on this provider: the post is as public as the account is. */
export const NO_PRIVACY_CHOICE = Object.freeze({
  support: 'unsupported' as CapabilitySupport,
  mustBeExplicit: false,
  options: [] as const,
});

/**
 * Capability 3 of the three comment capabilities (fetch and reply to individual
 * comments) is `not_implemented` on every connector in V1 by product decision, recorded in
 * `docs/planning/05-social-connectors.md` section 2.1.
 */
export const COMMENT_INBOX_V1_STATE: CapabilitySupport = 'not_implemented';
