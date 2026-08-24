/**
 * Connection view models.
 *
 * `ConnectionView` in `@/lib/api/types` carries identity and health. The
 * connections screen also needs the permission summary, the customer group and
 * any production or beta limitation, because those are the three things that
 * decide whether an account can actually do the job somebody expects of it.
 *
 * TODO(web): fold these into `ConnectionView` once the connections read model
 * publishes them.
 */

import type {
  CapabilitySupport,
  ConnectionHealth,
  ConnectionView,
  ContentKind,
  IsoInstant,
  ProviderId,
} from '@/lib/api/types';
import type { CapabilitySnapshot } from '@relay/contracts';

export type { CapabilitySnapshot, ConnectionHealth, ConnectionView };

/** One OAuth scope Post Array asks for, and what the product uses it for. */
export interface RequestedScope {
  readonly scope: string;
  /** Catalog key for the sentence explaining why it is needed. */
  readonly purposeKey: string;
}

/**
 * Three states, not two.
 *
 * `unknown` is what to show when Post Array has no record of the grant. Showing that
 * as `not_granted` is a false negative, and a false negative here tells a
 * person their working account is broken.
 */
export type PermissionState = 'granted' | 'not_granted' | 'unknown';

export interface PermissionView extends RequestedScope {
  readonly state: PermissionState;
}

/** A production or beta limitation that changes what a person should expect. */
export interface ConnectionLimitation {
  readonly id: string;
  /** Catalog key for the sentence. */
  readonly messageKey: string;
  readonly values?: Readonly<Record<string, string | number>>;
  readonly severity: 'info' | 'warning';
}

export interface CustomerGroup {
  readonly id: string;
  readonly name: string;
  readonly connectionIds: readonly string[];
}

export interface ConnectionRow extends ConnectionView {
  readonly customerGroupId?: string | null;
  readonly permissions?: readonly PermissionView[];
  readonly limitations?: readonly ConnectionLimitation[];
  /** Present when this connector is not past its definition of done. */
  readonly beta?: boolean;
  /** Estimated cost of one create, in minor units, when the provider meters. */
  readonly perCreateMinor?: number | null;
  readonly currency?: string | null;
  /** Scheduled posts that will not publish while this account is unhealthy. */
  readonly scheduledPostCount?: number;
  /** When the health was last read from the provider. */
  readonly healthCheckedAt?: IsoInstant | null;
}

/** Health values that mean somebody has to act. */
export const ACTION_REQUIRED_HEALTH: readonly ConnectionHealth[] = [
  'expired',
  'revoked',
  'permission_missing',
];

export function needsAction(health: ConnectionHealth): boolean {
  return ACTION_REQUIRED_HEALTH.includes(health);
}

export function isPaused(health: ConnectionHealth): boolean {
  return health === 'paused';
}

/* -------------------------------------------------------------------------
   Capability matrix
   ------------------------------------------------------------------------- */

/**
 * The capability rows the matrix shows.
 *
 * These are the features a person asks about before they promise something to
 * a client. Each maps to a field on the versioned capability snapshot, so the
 * matrix is generated from connector metadata and cannot drift from what the
 * adapter actually does.
 */
export const CAPABILITY_FEATURES = [
  'text',
  'image',
  'carousel',
  'video',
  'document',
  'thread',
  'firstComment',
  'mentions',
  'destinations',
  'privacy',
  'thumbnail',
  'altText',
  'analytics',
  'delete',
  'disclosure',
] as const;

export type CapabilityFeature = (typeof CAPABILITY_FEATURES)[number];

/** Content kinds a feature maps onto, when it is a content kind. */
export const FEATURE_CONTENT_KIND: Partial<Record<CapabilityFeature, ContentKind>> = {
  text: 'text',
  image: 'image',
  carousel: 'carousel',
  video: 'video',
  document: 'document',
  thread: 'thread',
};

export interface CapabilityCell {
  readonly feature: CapabilityFeature;
  readonly provider: ProviderId;
  readonly support: CapabilitySupport;
}

export interface CapabilityMatrix {
  readonly providers: readonly ProviderId[];
  readonly rows: readonly {
    readonly feature: CapabilityFeature;
    readonly cells: readonly CapabilityCell[];
  }[];
  /** The newest snapshot instant across every provider in the matrix. */
  readonly observedAt: string | null;
  /** Connector definition version, when every snapshot agrees on one. */
  readonly capabilityVersion: string | null;
}
