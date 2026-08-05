import {
  CONTENT_VERSION_SCHEMA_VERSION,
  checksumPayload,
  computeChecksum,
  contentVersionSchema,
  masterDraftSchema,
  postVariantSchema,
  threadItemSchema,
} from '@relay/contracts';
import type {
  ContentVersion,
  LinkSpec,
  MasterDraft,
  PostVariant,
  ProviderId,
  ThreadItem,
  VariantOverrides,
} from '@relay/contracts';

import { FIXTURE_NOW, fixtureId, fixtureUrl } from '../ids';
import { makeCapabilitySnapshot } from './capabilities';
import { makeConnection } from './connection';

/**
 * Drafts, variants and frozen content versions.
 *
 * Copy in these fixtures is deliberately plain, product-neutral and obviously
 * a fixture. It never impersonates a real company, quotes a real campaign or
 * invents a performance claim.
 */

export function makeLink(overrides: Partial<LinkSpec> = {}): LinkSpec {
  return {
    originalUrl: fixtureUrl('/blog/fixture-post'),
    tracked: true,
    shortLinkId: fixtureId('shortLink', 'fixture-link'),
    publishedUrl: fixtureUrl('/l/fixture'),
    utm: { source: 'fixture', medium: 'social', campaign: 'fixture_campaign' },
    frozenAt: FIXTURE_NOW,
    ...overrides,
  };
}

export function makeThreadItem(overrides: Partial<ThreadItem> = {}): ThreadItem {
  const seed = `thread-item-${overrides.order ?? 0}`;
  return threadItemSchema.parse({
    id: fixtureId('comment', seed),
    kind: 'thread',
    order: 0,
    body: 'The second part of the fixture thread.',
    mediaIds: [],
    links: [],
    delaySeconds: 0,
    connectionId: null,
    ...overrides,
  });
}

export function makeFirstComment(overrides: Partial<ThreadItem> = {}): ThreadItem {
  return makeThreadItem({
    kind: 'comment',
    order: 0,
    body: 'The full write-up is linked here.',
    links: [makeLink()],
    delaySeconds: 300,
    ...overrides,
  });
}

export interface MakeDraftInput extends Partial<MasterDraft> {
  readonly seed?: string;
}

/** A schema-valid master draft. Text only, no media, by default. */
export function makeDraft(input: MakeDraftInput = {}): MasterDraft {
  const { seed: seedOverride, ...overrides } = input;
  const seed = seedOverride ?? 'fixture-draft';
  const workspaceId = overrides.workspaceId ?? fixtureId('workspace', 'fixture-workspace');
  return masterDraftSchema.parse({
    id: fixtureId('contentItem', seed),
    workspaceId,
    brandId: fixtureId('brand', 'fixture-brand'),
    campaignId: null,
    title: 'Fixture draft',
    body: 'We shipped a change to how scheduling handles time zones. Details below.',
    contentKind: 'text',
    locale: 'en',
    mediaIds: [],
    links: [],
    signature: null,
    threadItems: [],
    schedule: null,
    disclosure: { aiAssisted: false, commercialContent: false, brandedContent: false },
    createdVia: 'web',
    ...overrides,
  });
}

/** A draft with an image, a tracked link and a first comment. */
export function makeRichDraft(input: MakeDraftInput = {}): MasterDraft {
  return makeDraft({
    seed: 'fixture-rich-draft',
    contentKind: 'image',
    body: 'A short note about the release, with the changelog linked in the first comment.',
    mediaIds: [fixtureId('media', 'fixture-image')],
    links: [makeLink()],
    threadItems: [makeFirstComment()],
    ...input,
  });
}

/** A thread: a root post plus two ordered parts. */
export function makeThreadDraft(input: MakeDraftInput = {}): MasterDraft {
  return makeDraft({
    seed: 'fixture-thread-draft',
    contentKind: 'thread',
    body: 'Three things we learned shipping the scheduler. One:',
    threadItems: [
      makeThreadItem({ order: 0, body: 'Two: store the zone, never the offset.' }),
      makeThreadItem({ order: 1, body: 'Three: a repeated schedule needs an explicit end.' }),
    ],
    ...input,
  });
}

export interface MakePostVariantInput extends Partial<PostVariant> {
  readonly provider?: ProviderId;
  readonly seed?: string;
}

export function makePostVariant(input: MakePostVariantInput = {}): PostVariant {
  const { seed: seedOverride, provider: providerOverride, ...overrides } = input;
  const provider = providerOverride ?? 'x';
  const seed = seedOverride ?? `${provider}-variant`;
  const connection = makeConnection({ provider });
  const snapshot = makeCapabilitySnapshot({ provider, connectionId: connection.id });
  return postVariantSchema.parse({
    id: fixtureId('postVariant', seed),
    workspaceId: overrides.workspaceId ?? connection.workspaceId,
    contentItemId: overrides.contentItemId ?? fixtureId('contentItem', 'fixture-draft'),
    connectionId: connection.id,
    provider,
    accountType: snapshot.accountType,
    overrides: {},
    destination: null,
    mentions: [],
    privacyValue: snapshot.privacy.mustBeExplicit ? 'PUBLIC_TO_EVERYONE' : null,
    disclosure: null,
    capabilityVersion: snapshot.capabilityVersion,
    ...overrides,
  });
}

/** A variant whose body deliberately diverges from the master. */
export function makeOverriddenVariant(
  provider: ProviderId,
  patch: VariantOverrides,
  input: MakePostVariantInput = {},
): PostVariant {
  return makePostVariant({ provider, overrides: patch, seed: `${provider}-overridden`, ...input });
}

export interface MakeContentVersionInput {
  readonly master?: MasterDraft;
  readonly variants?: readonly PostVariant[];
  readonly revision?: number;
  readonly createdAt?: string;
  readonly createdBy?: string;
}

/**
 * A frozen, checksummed content version. The checksum is computed over the same
 * canonical payload the application layer uses, so a receipt built from this
 * fixture proves exactly what would have been published.
 */
export async function makeContentVersion(
  input: MakeContentVersionInput = {},
): Promise<ContentVersion> {
  const master = input.master ?? makeDraft();
  const variants = input.variants ?? [
    makePostVariant({ contentItemId: master.id, workspaceId: master.workspaceId }),
  ];
  const checksum = await computeChecksum(checksumPayload(master, variants));
  return contentVersionSchema.parse({
    id: fixtureId('contentVersion', `${master.id}:${input.revision ?? 1}`),
    workspaceId: master.workspaceId,
    contentItemId: master.id,
    schemaVersion: CONTENT_VERSION_SCHEMA_VERSION,
    revision: input.revision ?? 1,
    master,
    variants,
    checksum,
    createdAt: input.createdAt ?? FIXTURE_NOW,
    createdBy: input.createdBy ?? fixtureId('user', 'fixture-owner'),
    createdVia: 'web',
    aiAssistance: null,
  });
}
