import type { AccountType, CapabilitySnapshot, ProviderId } from '@relay/contracts';

import { FIXTURE_NOW, fakeExternalId, fakeHandle, fixtureId } from '../ids.js';
import { makeCapabilitySnapshot } from './capabilities.js';

/**
 * Connections, destinations and mention entities.
 *
 * A connection never carries a credential. The fixture holds only the public
 * account facts plus a credential reference, which is what the application
 * layer sees; the ciphertext lives in the vault and never in a test file.
 */

export const CONNECTION_HEALTHS = [
  'healthy',
  'action_required',
  'expiring',
  'paused',
  'revoked',
] as const;
export type ConnectionHealth = (typeof CONNECTION_HEALTHS)[number];

export interface ConnectionFixture {
  readonly id: string;
  readonly workspaceId: string;
  readonly brandId: string | null;
  readonly provider: ProviderId;
  readonly accountType: AccountType;
  readonly externalAccountId: string;
  readonly displayName: string;
  readonly handle: string;
  readonly avatarUrl: string | null;
  readonly health: ConnectionHealth;
  readonly scopes: readonly string[];
  readonly credentialId: string;
  readonly credentialExpiresAt: string | null;
  readonly capabilityVersion: string;
  readonly connectedAt: string;
  readonly lastCheckedAt: string;
  readonly isActive: boolean;
}

export interface MakeConnectionInput extends Partial<ConnectionFixture> {
  readonly seed?: string;
}

const DEFAULT_SCOPES: Readonly<Record<ProviderId, readonly string[]>> = {
  x: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
  linkedin: ['w_member_social', 'r_basicprofile'],
  instagram: ['instagram_basic', 'instagram_content_publish', 'pages_show_list'],
  facebook: ['pages_manage_posts', 'pages_read_engagement', 'pages_show_list'],
  youtube: ['https://www.googleapis.com/auth/youtube.upload'],
  tiktok: ['video.publish', 'video.upload', 'user.info.basic'],
  threads: ['threads_basic', 'threads_content_publish'],
  bluesky: ['app-password'],
  fake: ['fake.read', 'fake.write'],
};

export function makeConnection(input: MakeConnectionInput = {}): ConnectionFixture {
  const { seed: seedOverride, ...overrides } = input;
  const provider = input.provider ?? 'x';
  const seed = seedOverride ?? `${provider}-primary`;
  const snapshot = makeCapabilitySnapshot({ provider });
  return {
    id: fixtureId('connection', seed),
    workspaceId: input.workspaceId ?? fixtureId('workspace', 'fixture-workspace'),
    brandId: null,
    provider,
    accountType: snapshot.accountType,
    externalAccountId: fakeExternalId(provider, seed),
    displayName: `Fixture ${provider} account`,
    handle: fakeHandle(seed),
    avatarUrl: null,
    health: 'healthy',
    scopes: [...(DEFAULT_SCOPES[provider] ?? [])],
    credentialId: fixtureId('credential', seed),
    credentialExpiresAt: '2026-11-02T12:00:00.000Z',
    capabilityVersion: snapshot.capabilityVersion,
    connectedAt: FIXTURE_NOW,
    lastCheckedAt: FIXTURE_NOW,
    isActive: true,
    ...overrides,
  };
}

/** One healthy connection per V1 provider, all in the same workspace. */
export function makeConnectionSet(workspaceId?: string): readonly ConnectionFixture[] {
  const providers: readonly ProviderId[] = [
    'x',
    'linkedin',
    'instagram',
    'facebook',
    'youtube',
    'tiktok',
    'threads',
    'bluesky',
    'fake',
  ];
  return providers.map((provider) =>
    makeConnection({
      provider,
      ...(workspaceId === undefined ? {} : { workspaceId }),
    }),
  );
}

/** A connection whose token was revoked at the provider. */
export function makeRevokedConnection(provider: ProviderId = 'x'): ConnectionFixture {
  return makeConnection({
    provider,
    seed: `${provider}-revoked`,
    health: 'revoked',
    isActive: false,
    credentialExpiresAt: '2026-08-01T12:00:00.000Z',
  });
}

/** An Instagram consumer account, which cannot publish and must say why. */
export function makeIneligibleInstagramConnection(): ConnectionFixture {
  return makeConnection({
    provider: 'instagram',
    seed: 'instagram-personal',
    accountType: 'personal_profile',
    health: 'action_required',
    isActive: false,
    scopes: ['instagram_basic'],
  });
}

export interface DestinationFixture {
  readonly id: string;
  readonly connectionId: string;
  readonly kind: 'none' | 'community' | 'board' | 'group' | 'page' | 'organization' | 'channel' | 'publication';
  readonly externalId: string;
  readonly displayLabel: string;
}

export function makeDestination(overrides: Partial<DestinationFixture> = {}): DestinationFixture {
  const connectionId = overrides.connectionId ?? makeConnection().id;
  const seed = overrides.displayLabel ?? 'fixture-destination';
  return {
    id: fixtureId('destination', seed),
    connectionId,
    kind: 'page',
    externalId: fakeExternalId('destination', seed),
    displayLabel: 'Fixture Destination',
    ...overrides,
  };
}

export interface MentionFixture {
  readonly id: string;
  readonly connectionId: string;
  readonly externalId: string;
  readonly displayLabel: string;
  readonly handle: string;
}

export function makeMention(overrides: Partial<MentionFixture> = {}): MentionFixture {
  const seed = overrides.handle ?? 'fixture-mention';
  return {
    id: fixtureId('mention', seed),
    connectionId: overrides.connectionId ?? makeConnection().id,
    externalId: fakeExternalId('mention', seed),
    displayLabel: 'Fixture Mention',
    handle: fakeHandle(seed),
    ...overrides,
  };
}

/** The capability snapshot that belongs to a connection fixture. */
export function capabilitiesFor(connection: ConnectionFixture): CapabilitySnapshot {
  return makeCapabilitySnapshot({
    provider: connection.provider,
    connectionId: connection.id,
    capabilityVersion: connection.capabilityVersion,
  });
}
