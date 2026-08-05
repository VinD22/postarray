import { createHash } from 'node:crypto';

import type { CapabilitySnapshot } from '@relay/contracts';

import type {
  ConnectionRef,
  MediaPreparationRequest,
  MetricsRequest,
  PreparedMedia,
  ProviderDraft,
  ProviderMediaRef,
  ProviderThreadItem,
  PublishRequest,
  StatusRequest,
} from '../contract';
import { fingerprintDraft } from '../idempotency';
import { type Clock, instantOf, systemClock } from '../ports';
import { leaseSecret } from '../vault';
import { buildFakeCapabilitySnapshot, type FakeCapabilityOverrides } from './capabilities';

/**
 * Ready made fake inputs.
 *
 * The seed script, the local development loop, the MCP sandbox and every test
 * that needs a plausible draft use these, so one change to the contract updates
 * every caller in one place.
 */

export const FAKE_CONNECTION_ID = 'conn_00000000000000000000000001';
export const FAKE_WORKSPACE_ID = 'ws_00000000000000000000000001';
export const FAKE_CONTENT_ITEM_ID = 'content_0000000000000000000001';
export const FAKE_POST_VARIANT_ID = 'pv_000000000000000000000001';
export const FAKE_CONTENT_VERSION_ID = 'cver_00000000000000000000001';

function sha256Hex(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

export function fakeConnectionRef(
  overrides: Partial<ConnectionRef> = {},
  options: { readonly clock?: Clock } = {},
): ConnectionRef {
  return {
    connectionId: FAKE_CONNECTION_ID,
    workspaceId: FAKE_WORKSPACE_ID,
    provider: 'fake',
    accountType: 'personal_profile',
    externalAccountId: 'fake-acct-profile-1',
    displayName: 'Relay Demo Profile',
    grantedScopes: ['fake.read', 'fake.write', 'fake.offline'],
    accessToken: leaseSecret({
      secret: 'fake-access-token-for-local-development',
      credentialKind: 'access_token',
      purpose: 'fixture',
      ...(options.clock === undefined ? {} : { clock: options.clock }),
      ttlMs: 60 * 60 * 1000,
    }),
    locale: 'en',
    metadata: {},
    ...overrides,
  };
}

export function fakeImageAsset(overrides: Partial<ProviderMediaRef> = {}): ProviderMediaRef {
  return {
    mediaId: 'media_0000000000000000000001',
    derivativeId: null,
    kind: 'image',
    mimeType: 'image/png',
    byteSize: 240_000,
    width: 1200,
    height: 1200,
    durationSeconds: null,
    checksum: sha256Hex('fake-image-1'),
    altText: 'A square placeholder image used by the fake provider.',
    altTextWaived: false,
    sourceUrl: null,
    sourceUrlExpiresAt: null,
    ...overrides,
  };
}

export function fakeVideoAsset(overrides: Partial<ProviderMediaRef> = {}): ProviderMediaRef {
  return {
    mediaId: 'media_0000000000000000000002',
    derivativeId: null,
    kind: 'video',
    mimeType: 'video/mp4',
    byteSize: 12_000_000,
    width: 1080,
    height: 1920,
    durationSeconds: 42,
    checksum: sha256Hex('fake-video-1'),
    altText: null,
    altTextWaived: true,
    sourceUrl: null,
    sourceUrlExpiresAt: null,
    ...overrides,
  };
}

export function fakeThreadItem(overrides: Partial<ProviderThreadItem> = {}): ProviderThreadItem {
  return {
    threadItemId: 'cmt_00000000000000000000001',
    kind: 'comment',
    order: 1,
    body: 'The first comment, published one minute after the root post.',
    media: [],
    delaySeconds: 60,
    links: [],
    ...overrides,
  };
}

export interface FakeDraftOptions {
  readonly clock?: Clock;
  readonly capabilities?: CapabilitySnapshot;
  readonly capabilityOverrides?: FakeCapabilityOverrides;
  readonly connection?: ConnectionRef;
}

export function fakeDraft(
  overrides: Partial<ProviderDraft> = {},
  options: FakeDraftOptions = {},
): ProviderDraft {
  const clock = options.clock ?? systemClock;
  const connection = options.connection ?? fakeConnectionRef({}, { clock });
  const capabilities =
    options.capabilities ??
    buildFakeCapabilitySnapshot({
      connectionId: connection.connectionId,
      accountType: connection.accountType,
      observedAt: instantOf(clock.now().getTime()),
      ...(options.capabilityOverrides === undefined
        ? {}
        : { overrides: options.capabilityOverrides }),
    });

  return {
    connection,
    contentItemId: FAKE_CONTENT_ITEM_ID,
    postVariantId: FAKE_POST_VARIANT_ID,
    contentKind: 'text',
    locale: 'en',
    title: null,
    body: 'A plain post from the fake provider, written for the local development loop.',
    media: [],
    links: [],
    threadItems: [],
    destination: null,
    mentions: [],
    privacyValue: 'public',
    disclosure: { aiAssisted: false, commercialContent: false, brandedContent: false },
    scheduledInstant: null,
    createdVia: 'web',
    capabilities,
    ...overrides,
  };
}

export function fakePublishRequest(
  draft: ProviderDraft,
  overrides: Partial<PublishRequest> = {},
  options: { readonly clock?: Clock } = {},
): PublishRequest {
  const clock = options.clock ?? systemClock;
  const fingerprint = fingerprintDraft(draft);
  return {
    draft,
    preparedMedia: [],
    contentVersionId: FAKE_CONTENT_VERSION_ID,
    contentVersionChecksum: sha256Hex(`${draft.postVariantId}:content-version`),
    capabilityVersion: draft.capabilities.capabilityVersion,
    idempotencyKey: 'fake-idem-000000000001',
    contentFingerprint: fingerprint,
    dispatchedAt: instantOf(clock.now().getTime()),
    ...overrides,
  };
}

export function fakeStatusRequest(
  draft: ProviderDraft,
  overrides: Partial<StatusRequest> = {},
  options: { readonly clock?: Clock } = {},
): StatusRequest {
  const clock = options.clock ?? systemClock;
  const nowMs = clock.now().getTime();
  return {
    connection: draft.connection,
    providerJobId: null,
    externalPostId: null,
    idempotencyKey: 'fake-idem-000000000001',
    contentFingerprint: fingerprintDraft(draft),
    dispatchWindowFrom: instantOf(nowMs - 60 * 60 * 1000),
    dispatchWindowTo: instantOf(nowMs + 60 * 60 * 1000),
    ...overrides,
  };
}

export function fakeMediaPreparationRequest(
  draft: ProviderDraft,
  overrides: Partial<MediaPreparationRequest> = {},
): MediaPreparationRequest {
  return {
    connection: draft.connection,
    postVariantId: draft.postVariantId,
    contentKind: draft.contentKind,
    media: draft.media,
    idempotencyKey: 'fake-idem-000000000001',
    capabilities: draft.capabilities,
    ...overrides,
  };
}

export function fakeMetricsRequest(
  draft: ProviderDraft,
  externalPostId: string,
  overrides: Partial<MetricsRequest> = {},
): MetricsRequest {
  return {
    connection: draft.connection,
    scope: 'post',
    externalPostId,
    rangeFrom: null,
    rangeTo: null,
    metrics: [],
    ...overrides,
  };
}

/** A prepared media entry matching an asset, for a publish request. */
export function fakePreparedMedia(asset: ProviderMediaRef): PreparedMedia {
  return {
    mediaId: asset.mediaId,
    derivativeId: asset.derivativeId,
    providerMediaId: `fkm_${asset.mediaId}`,
    containerId: null,
    uploadState: 'ready',
    derivativeChecksum: asset.checksum,
    byteSize: asset.byteSize,
    altTextApplied: asset.altText !== null,
    publicUrl: null,
    expiresAt: null,
    reusedFromPreviousAttempt: false,
  };
}
