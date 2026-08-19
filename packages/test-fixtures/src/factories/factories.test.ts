import { describe, expect, it } from 'vitest';

import {
  businessProfileSchema,
  capabilitySnapshotSchema,
  checksumPayload,
  computeChecksum,
  contentVersionSchema,
  growthPlanSchema,
  isMetricPresent,
  masterDraftSchema,
  metricObservationSchema,
  postVariantSchema,
  publicationReceiptSchema,
  publishJobSchema,
  resolveVariant,
  rollUpCampaignState,
  summarizeCapabilities,
  webhookEnvelopeSchema,
} from '@relay/contracts';
import type { ProviderId } from '@relay/contracts';

import {
  capabilitiesFor,
  makeAccountMetrics,
  makeAllCapabilitySnapshots,
  makeBusinessProfile,
  makeCapabilitySnapshot,
  makeConnection,
  makeConnectionSet,
  makeContentVersion,
  makeDraft,
  makeDriftedCapabilitySnapshot,
  makeFailingValidationResult,
  makeGrowthPlan,
  makeIneligibleInstagramConnection,
  makeJob,
  makeOverriddenVariant,
  makePartialReceipt,
  makePendingApprovalJob,
  makePostMetrics,
  makePostVariant,
  makeReceipt,
  makeRevokedConnection,
  makeRichDraft,
  makeThreadDraft,
  makeThreadReceipt,
  makeWorkspaceBundle,
} from './index';

const PROVIDERS: readonly ProviderId[] = [
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

describe('workspace factories', () => {
  it('builds a consistent bundle', () => {
    const bundle = makeWorkspaceBundle();
    expect(bundle.membership.workspaceId).toBe(bundle.workspace.id);
    expect(bundle.membership.userId).toBe(bundle.owner.id);
    expect(bundle.project.workspaceId).toBe(bundle.workspace.id);
    expect(bundle.campaign.projectId).toBe(bundle.project.id);
  });

  it('accepts overrides without losing consistency', () => {
    const bundle = makeWorkspaceBundle({ workspace: { slug: 'other-workspace' } });
    expect(bundle.workspace.slug).toBe('other-workspace');
    expect(bundle.project.workspaceId).toBe(bundle.workspace.id);
  });
});

describe('capability snapshots', () => {
  it('is schema valid for every provider', () => {
    for (const [provider, snapshot] of Object.entries(makeAllCapabilitySnapshots())) {
      expect(() => capabilitySnapshotSchema.parse(snapshot), provider).not.toThrow();
    }
  });

  it('distinguishes unsupported from not implemented', () => {
    const summary = summarizeCapabilities(makeCapabilitySnapshot({ provider: 'linkedin' }));
    expect(summary.unsupportedContentKinds).toContain('thread');
    expect(summary.notImplementedContentKinds.length).toBeGreaterThan(0);
    expect(summary.unsupportedContentKinds).not.toEqual(summary.notImplementedContentKinds);
  });

  it('meters only X', () => {
    expect(summarizeCapabilities(makeCapabilitySnapshot({ provider: 'x' })).isMetered).toBe(true);
    for (const provider of PROVIDERS.filter((entry) => entry !== 'x')) {
      expect(summarizeCapabilities(makeCapabilitySnapshot({ provider })).isMetered, provider).toBe(
        false,
      );
    }
  });

  it('requires an explicit privacy choice where the provider does', () => {
    expect(makeCapabilitySnapshot({ provider: 'tiktok' }).privacy.mustBeExplicit).toBe(true);
    expect(makeCapabilitySnapshot({ provider: 'x' }).privacy.mustBeExplicit).toBe(false);
  });

  it('models drift as a smaller limit and a lost permission', () => {
    const before = makeCapabilitySnapshot({ provider: 'x' });
    const after = makeDriftedCapabilitySnapshot('x');
    expect(after.text.maxLength).toBeLessThan(before.text.maxLength);
    expect(after.analytics.support).toBe('unsupported');
    expect(after.capabilityVersion).not.toBe(before.capabilityVersion);
  });
});

describe('connections', () => {
  it('never carries a credential, only a reference to one', () => {
    const connection = makeConnection();
    expect(Object.keys(connection)).not.toContain('accessToken');
    expect(Object.keys(connection)).not.toContain('refreshToken');
    expect(connection.credentialId).toMatch(/^cred_/);
  });

  it('covers every V1 provider', () => {
    expect(makeConnectionSet().map((connection) => connection.provider)).toEqual(PROVIDERS);
  });

  it('models a revoked connection and an ineligible Instagram account', () => {
    expect(makeRevokedConnection().health).toBe('revoked');
    const ineligible = makeIneligibleInstagramConnection();
    expect(ineligible.accountType).toBe('personal_profile');
    expect(ineligible.health).toBe('action_required');
  });

  it('produces capabilities that belong to the connection', () => {
    const connection = makeConnection({ provider: 'linkedin' });
    expect(capabilitiesFor(connection).connectionId).toBe(connection.id);
  });
});

describe('drafts and variants', () => {
  it('is schema valid', () => {
    expect(() => masterDraftSchema.parse(makeDraft())).not.toThrow();
    expect(() => masterDraftSchema.parse(makeRichDraft())).not.toThrow();
    expect(() => masterDraftSchema.parse(makeThreadDraft())).not.toThrow();
    expect(() => postVariantSchema.parse(makePostVariant())).not.toThrow();
  });

  it('inherits from the master until a field is overridden', () => {
    const master = makeDraft();
    const inheriting = makePostVariant();
    const resolved = resolveVariant(master, inheriting.overrides);
    expect(resolved.overridden).toHaveLength(0);
    expect(resolved.values.body).toBe(master.body);

    const overridden = makeOverriddenVariant('x', { body: 'A shorter version for X.' });
    const afterOverride = resolveVariant(master, overridden.overrides);
    expect(afterOverride.overridden).toEqual(['body']);
    expect(afterOverride.values.body).toBe('A shorter version for X.');
    expect(afterOverride.values.contentKind).toBe(master.contentKind);
  });

  it('freezes a checksummed content version over the master and its variants', async () => {
    const master = makeDraft();
    const variants = [
      makePostVariant({ contentItemId: master.id, workspaceId: master.workspaceId }),
    ];
    const version = await makeContentVersion({ master, variants });
    expect(() => contentVersionSchema.parse(version)).not.toThrow();
    expect(version.checksum).toBe(await computeChecksum(checksumPayload(master, variants)));
  });
});

describe('jobs and receipts', () => {
  it('is schema valid', () => {
    expect(() => publishJobSchema.parse(makeJob())).not.toThrow();
    expect(() => publicationReceiptSchema.parse(makeReceipt())).not.toThrow();
    expect(() => publicationReceiptSchema.parse(makeThreadReceipt())).not.toThrow();
  });

  it('never lets an unapproved job reach a dispatched state', () => {
    const pending = makePendingApprovalJob();
    expect(pending.approvalState).toBe('requested');
    expect(pending.state).toBe('approval_requested');
    expect(() =>
      makeJob({ approvalRequired: true, approvalState: 'requested', state: 'dispatching' }),
    ).toThrow();
  });

  it('carries the evidence a receipt needs to prove anything', () => {
    const receipt = makeReceipt();
    expect(receipt.externalPostId.length).toBeGreaterThan(0);
    expect(receipt.contentVersionChecksum).toMatch(/^[0-9a-f]{64}$/);
    expect(receipt.capabilityVersion.length).toBeGreaterThan(0);
    expect(receipt.root.state).toBe('published');
  });

  it('records the estimated and the reconciled cost on a metered provider', () => {
    const receipt = makeReceipt({ provider: 'x' });
    expect(receipt.cost).not.toBeNull();
    expect(receipt.cost?.reconciledAt).not.toBeNull();
    expect(makeReceipt({ provider: 'linkedin' }).cost).toBeNull();
  });

  it('reports a partly published campaign as partial, never as failed', () => {
    const partial = makePartialReceipt();
    expect(partial.root.state).toBe('published');
    expect(partial.items[0]?.state).toBe('failed_permanently');
    expect(rollUpCampaignState(['published', 'failed_permanently'])).toBe('partially_published');
  });
});

describe('metrics', () => {
  it('is schema valid and never reports a missing metric as zero', () => {
    for (const observation of makePostMetrics()) {
      expect(() => metricObservationSchema.parse(observation)).not.toThrow();
      if (observation.availability !== 'available') {
        expect(observation.value).toBeNull();
        expect(isMetricPresent(observation)).toBe(false);
      }
    }
    expect(makePostMetrics().some((entry) => entry.availability !== 'available')).toBe(true);
    expect(makeAccountMetrics().every((entry) => entry.scope === 'account')).toBe(true);
  });

  it('carries the provider field alongside the normalized name', () => {
    const [first] = makePostMetrics();
    expect(first?.providerField).toBe('impression_count');
    expect(first?.normalizedName).toBe('impressions');
  });
});

describe('growth', () => {
  it('is schema valid', () => {
    expect(() => businessProfileSchema.parse(makeBusinessProfile())).not.toThrow();
    expect(() => growthPlanSchema.parse(makeGrowthPlan())).not.toThrow();
  });

  it('keeps facts and assumptions apart', () => {
    const plan = makeGrowthPlan();
    const factIds = plan.business_snapshot.facts.map((fact) => fact.id);
    const assumptionIds = plan.business_snapshot.assumptions.map((entry) => entry.id);
    expect(factIds.some((id) => assumptionIds.includes(id))).toBe(false);
    expect(plan.business_snapshot.facts.every((fact) => fact.confirmedByUser)).toBe(true);
  });

  it('proposes exactly four weeks', () => {
    expect(makeGrowthPlan().calendar_proposal.map((week) => week.weekNumber)).toEqual([1, 2, 3, 4]);
  });
});

describe('api envelopes', () => {
  it('builds a schema valid webhook envelope and validation result', async () => {
    const { makeWebhookEnvelope } = await import('./api');
    expect(() => webhookEnvelopeSchema.parse(makeWebhookEnvelope())).not.toThrow();
    const failing = makeFailingValidationResult();
    expect(failing.ok).toBe(false);
    expect(failing.issues).toHaveLength(2);
  });
});
