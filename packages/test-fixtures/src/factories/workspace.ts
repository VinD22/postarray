import type { Role } from '@relay/contracts';

import { FIXTURE_NOW, fixtureEmail, fixtureId, fixtureUrl } from '../ids.js';

/**
 * Workspace-shaped fixtures.
 *
 * `@relay/contracts` does not define a workspace DTO, so these are the minimal
 * shapes the application services and the database repositories agree on. Every
 * name, email and domain is obviously fake and every host is `example.test`.
 */

export interface WorkspaceFixture {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly ianaTimeZone: string;
  readonly locale: string;
  readonly createdAt: string;
  readonly activeConnectionCount: number;
  readonly entitlementState: 'full' | 'full_grace' | 'full_until_period_end' | 'read_only' | 'none';
}

export interface UserFixture {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
  readonly locale: string;
  readonly emailVerifiedAt: string | null;
  readonly createdAt: string;
}

export interface MembershipFixture {
  readonly id: string;
  readonly workspaceId: string;
  readonly userId: string;
  readonly role: Role;
  readonly brandIds: readonly string[];
  readonly createdAt: string;
}

export interface BrandFixture {
  readonly id: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly siteUrl: string;
  readonly ianaTimeZone: string;
  readonly defaultLocale: string;
  readonly createdAt: string;
}

export interface CampaignFixture {
  readonly id: string;
  readonly workspaceId: string;
  readonly brandId: string;
  readonly name: string;
  readonly startsOn: string;
  readonly endsOn: string | null;
  readonly createdAt: string;
}

export function makeWorkspace(overrides: Partial<WorkspaceFixture> = {}): WorkspaceFixture {
  const seed = overrides.slug ?? 'fixture-workspace';
  return {
    id: fixtureId('workspace', seed),
    name: 'Fixture Workspace',
    slug: seed,
    ianaTimeZone: 'Europe/Berlin',
    locale: 'en',
    createdAt: FIXTURE_NOW,
    activeConnectionCount: 3,
    entitlementState: 'full',
    ...overrides,
  };
}

export function makeUser(overrides: Partial<UserFixture> = {}): UserFixture {
  const seed = overrides.displayName ?? 'fixture-owner';
  return {
    id: fixtureId('user', seed),
    email: fixtureEmail('owner'),
    displayName: 'Fixture Owner',
    locale: 'en',
    emailVerifiedAt: FIXTURE_NOW,
    createdAt: FIXTURE_NOW,
    ...overrides,
  };
}

export function makeMembership(overrides: Partial<MembershipFixture> = {}): MembershipFixture {
  const workspaceId = overrides.workspaceId ?? makeWorkspace().id;
  const userId = overrides.userId ?? makeUser().id;
  return {
    id: fixtureId('membership', `${workspaceId}:${userId}`),
    workspaceId,
    userId,
    role: 'owner',
    brandIds: [],
    createdAt: FIXTURE_NOW,
    ...overrides,
  };
}

export function makeBrand(overrides: Partial<BrandFixture> = {}): BrandFixture {
  const workspaceId = overrides.workspaceId ?? makeWorkspace().id;
  const seed = overrides.name ?? 'fixture-brand';
  return {
    id: fixtureId('brand', seed),
    workspaceId,
    name: 'Fixture Brand',
    siteUrl: fixtureUrl('/'),
    ianaTimeZone: 'Europe/Berlin',
    defaultLocale: 'en',
    createdAt: FIXTURE_NOW,
    ...overrides,
  };
}

export function makeCampaign(overrides: Partial<CampaignFixture> = {}): CampaignFixture {
  const workspaceId = overrides.workspaceId ?? makeWorkspace().id;
  const brandId = overrides.brandId ?? makeBrand({ workspaceId }).id;
  const seed = overrides.name ?? 'fixture-campaign';
  return {
    id: fixtureId('campaign', seed),
    workspaceId,
    brandId,
    name: 'Fixture Campaign',
    startsOn: '2026-08-04',
    endsOn: null,
    createdAt: FIXTURE_NOW,
    ...overrides,
  };
}

/** A workspace, an owner, a membership, a brand and a campaign, all consistent. */
export interface WorkspaceBundle {
  readonly workspace: WorkspaceFixture;
  readonly owner: UserFixture;
  readonly membership: MembershipFixture;
  readonly brand: BrandFixture;
  readonly campaign: CampaignFixture;
}

export function makeWorkspaceBundle(
  overrides: { workspace?: Partial<WorkspaceFixture>; owner?: Partial<UserFixture> } = {},
): WorkspaceBundle {
  const workspace = makeWorkspace(overrides.workspace ?? {});
  const owner = makeUser(overrides.owner ?? {});
  const membership = makeMembership({ workspaceId: workspace.id, userId: owner.id });
  const brand = makeBrand({ workspaceId: workspace.id });
  const campaign = makeCampaign({ workspaceId: workspace.id, brandId: brand.id });
  return { workspace, owner, membership, brand, campaign };
}
