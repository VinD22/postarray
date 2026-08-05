import { describe, expect, it } from 'vitest';

import { capabilitySnapshotSchema, metricObservationSchema } from '@relay/contracts';

import { ProviderCallError } from '../errors.js';
import { fixedClock, recordingSleeper } from '../ports.js';
import { FakeConnector, createFakeConnector } from './connector.js';
import {
  fakeConnectionRef,
  fakeDraft,
  fakeImageAsset,
  fakeMediaPreparationRequest,
  fakeMetricsRequest,
  fakePublishRequest,
  fakeStatusRequest,
  fakeThreadItem,
  fakeVideoAsset,
} from './fixtures.js';
import { FakeProviderState } from './state.js';

const clock = fixedClock('2026-08-04T12:00:00.000Z');

function connector(): FakeConnector {
  return createFakeConnector({
    clock,
    instant: true,
    state: new FakeProviderState({ clock, seed: 42 }),
  });
}

describe('identity and authorization', () => {
  it('declares the contract version and separates the three comment capabilities', () => {
    const identity = connector().identity();
    expect(identity.provider).toBe('fake');
    expect(identity.contractVersion).toBe('1.0.0');
    expect(identity.features['first_comment']).toBe('supported');
    expect(identity.features['comment_count']).toBe('supported');
    expect(identity.features['comment_replies']).toBe('not_implemented');
    expect(identity.label).toBe('beta');
    expect(identity.limitationKey).not.toBeNull();
  });

  it('requests PKCE and explains every scope', () => {
    const authorization = connector().authorization();
    expect(authorization.pkceRequired).toBe(true);
    expect(authorization.refreshAtLifetimeFraction).toBe(0.75);
    for (const scope of authorization.scopes) {
      expect(scope.explanationKey.length).toBeGreaterThan(0);
      expect(scope.usedBy.length).toBeGreaterThan(0);
    }
  });
});

describe('discovery', () => {
  it('returns every eligible identity plus the ones that cannot publish', async () => {
    const accounts = await connector().discoverAccounts({
      provider: 'fake',
      workspaceId: 'ws_1',
      accessToken: fakeConnectionRef({}, { clock }).accessToken,
      refreshToken: null,
      grantedScopes: ['fake.read', 'fake.write'],
      obtainedAt: '2026-08-04T12:00:00.000Z',
      accessTokenExpiresAt: null,
      grantMetadata: {},
    });
    expect(accounts.length).toBeGreaterThan(1);
    const ineligible = accounts.filter((account) => !account.eligible);
    expect(ineligible).toHaveLength(1);
    expect(ineligible[0]?.ineligibleReasonKey).not.toBeNull();
    expect(JSON.stringify(accounts)).not.toContain('fake-account-token');
  });

  it('lists destinations and marks the ones we may not post to', async () => {
    const destinations = await connector().listDestinations({
      connection: fakeConnectionRef({}, { clock }),
      kind: 'community',
      query: null,
      cursor: null,
      limit: 10,
    });
    expect(destinations.length).toBeGreaterThan(0);
    expect(destinations.some((destination) => !destination.canPost)).toBe(true);
  });

  it('resolves a mention to an immutable external id', async () => {
    const mentions = await connector().searchMentions({
      connection: fakeConnectionRef({}, { clock }),
      query: '@ada',
      limit: 5,
    });
    expect(mentions[0]?.externalId).toBe('fake-mention-ada');
    expect(mentions[0]?.resolvedToExternalId).toBe(true);
  });
});

describe('capabilities', () => {
  it('returns a schema valid snapshot', async () => {
    const snapshot = await connector().getCapabilities(fakeConnectionRef({}, { clock }));
    expect(capabilitySnapshotSchema.safeParse(snapshot).success).toBe(true);
    expect(snapshot.contentKinds['long_video']).toBe('unsupported');
    expect(snapshot.contentKinds['document']).toBe('not_implemented');
    expect(snapshot.cost?.perUrlCreateMinor).toBeGreaterThan(snapshot.cost?.perCreateMinor ?? 0);
  });

  it('downgrades on demand so approval drift is testable', async () => {
    const provider = connector();
    provider.setFailureMode('capability_downgrade');
    const snapshot = await provider.getCapabilities(fakeConnectionRef({}, { clock }));
    expect(snapshot.threads.support).toBe('not_implemented');
    expect(snapshot.text.maxLength).toBe(280);
  });
});

describe('validation and preview', () => {
  it('accepts a plain draft and prices it', async () => {
    const provider = connector();
    const result = await provider.validateDraft(fakeDraft({}, { clock }));
    expect(result.ok).toBe(true);
    expect(result.estimatedCostMinor).toBe(2);
    expect(result.currency).toBe('USD');
  });

  it('prices a post containing a URL ten times higher', async () => {
    const provider = connector();
    const result = await provider.validateDraft(
      fakeDraft({ body: 'Read this https://example.invalid/post' }, { clock }),
    );
    expect(result.estimatedCostMinor).toBe(20);
  });

  it('reports text over the limit with the exact overage', async () => {
    const provider = connector();
    const result = await provider.validateDraft(fakeDraft({ body: 'x'.repeat(2500) }, { clock }));
    expect(result.ok).toBe(false);
    const issue = result.issues.find((entry) => entry.code === 'text_too_long');
    expect(issue?.params['over']).toBe(300);
    expect(issue?.severity).toBe('error');
  });

  it('requires alt text on an image unless it is waived', async () => {
    const provider = connector();
    const missing = await provider.validateDraft(
      fakeDraft(
        { contentKind: 'image', media: [fakeImageAsset({ altText: null, altTextWaived: false })] },
        { clock },
      ),
    );
    expect(missing.issues.some((issue) => issue.code === 'alt_text_missing')).toBe(true);

    const waived = await provider.validateDraft(
      fakeDraft(
        { contentKind: 'image', media: [fakeImageAsset({ altText: null, altTextWaived: true })] },
        { clock },
      ),
    );
    expect(waived.issues.some((issue) => issue.code === 'alt_text_missing')).toBe(false);
  });

  it('refuses a content kind the provider does not offer', async () => {
    const provider = connector();
    const result = await provider.validateDraft(fakeDraft({ contentKind: 'long_video' }, { clock }));
    expect(result.ok).toBe(false);
    expect(result.issues[0]?.messageKey).toBe('error.capability_unsupported.message');
  });

  it('refuses a video longer than the ceiling', async () => {
    const provider = connector();
    const result = await provider.validateDraft(
      fakeDraft(
        { contentKind: 'video', media: [fakeVideoAsset({ durationSeconds: 600 })] },
        { clock },
      ),
    );
    expect(result.issues.some((issue) => issue.code === 'media_duration_too_long')).toBe(true);
  });

  it('produces a preview with entity ranges and a counter', async () => {
    const provider = connector();
    const preview = await provider.preview(
      fakeDraft({ body: 'Hello @ada, look at #relay https://example.invalid/x' }, { clock }),
    );
    expect(preview.entities.map((entity) => entity.kind)).toEqual(['mention', 'hashtag', 'link']);
    expect(preview.entities[0]?.nativeTag).toBe(false);
    expect(preview.counter.limit).toBe(2200);
    expect(preview.truncation.willTruncate).toBe(false);
  });
});

describe('media preparation', () => {
  it('is idempotent on asset, connection and variant', async () => {
    const provider = connector();
    const draft = fakeDraft({ contentKind: 'image', media: [fakeImageAsset()] }, { clock });
    const request = fakeMediaPreparationRequest(draft);
    const first = await provider.prepareMedia(request);
    const second = await provider.prepareMedia(request);
    expect(first[0]?.reusedFromPreviousAttempt).toBe(false);
    expect(second[0]?.reusedFromPreviousAttempt).toBe(true);
    expect(second[0]?.providerMediaId).toBe(first[0]?.providerMediaId);
  });

  it('reports slow processing rather than pretending it is ready', async () => {
    const provider = connector();
    provider.setFailureMode('slow_media', 1);
    const draft = fakeDraft({ contentKind: 'video', media: [fakeVideoAsset()] }, { clock });
    const prepared = await provider.prepareMedia(fakeMediaPreparationRequest(draft));
    expect(prepared[0]?.uploadState).toBe('processing');
  });
});

describe('publishing', () => {
  it('publishes a root post and returns external evidence', async () => {
    const provider = connector();
    const draft = fakeDraft({}, { clock });
    const result = await provider.publish(fakePublishRequest(draft, {}, { clock }));
    expect(result.status).toBe('published');
    if (result.status === 'published') {
      expect(result.externalPostId.length).toBeGreaterThan(0);
      expect(result.permalink).toContain(result.externalPostId);
      expect(result.items).toHaveLength(1);
      expect(result.costMinor).toBe(2);
    }
  });

  it('publishes a root post plus its first comment', async () => {
    const provider = connector();
    const draft = fakeDraft({ threadItems: [fakeThreadItem()] }, { clock });
    const result = await provider.publish(fakePublishRequest(draft, {}, { clock }));
    expect(result.status).toBe('published');
    if (result.status === 'published') {
      expect(result.items).toHaveLength(2);
      expect(result.items[1]?.kind).toBe('comment');
      expect(result.costMinor).toBe(4);
    }
  });

  it('keeps the root published when a follow up item fails', async () => {
    const provider = connector();
    provider.setFailureMode('partial_thread_failure', 1);
    const draft = fakeDraft({ threadItems: [fakeThreadItem()] }, { clock });
    const result = await provider.publish(fakePublishRequest(draft, {}, { clock }));
    expect(result.status).toBe('partial');
    if (result.status === 'partial') {
      expect(result.items).toHaveLength(1);
      expect(result.failures).toHaveLength(1);
      expect(result.failures[0]?.error.remediationCode).toBe('comment_failed_root_published');
      expect(result.externalPostId.length).toBeGreaterThan(0);
    }
  });

  it('refuses a second publication of the same content', async () => {
    const provider = connector();
    const draft = fakeDraft({}, { clock });
    const request = fakePublishRequest(draft, {}, { clock });
    const first = await provider.publish(request);
    expect(first.status).toBe('published');
    const second = await provider.publish(request);
    expect(second.status).toBe('failed');
    if (second.status === 'failed') {
      expect(second.error.remediationCode).toBe('duplicate_content');
      expect(second.error.errorClass).toBe('CONTENT_INVALID');
    }
    expect(provider.state.postsFor(draft.connection.connectionId)).toHaveLength(1);
  });

  it('reports a permanent rejection without retrying', async () => {
    const provider = connector();
    provider.setFailureMode('content_rejected', 1);
    const result = await provider.publish(fakePublishRequest(fakeDraft({}, { clock }), {}, { clock }));
    expect(result.status).toBe('failed');
    if (result.status === 'failed') {
      expect(result.error.errorClass).toBe('PERMANENT_PROVIDER');
      expect(result.error.retryable).toBe(false);
    }
  });

  it('classifies a rate limit as transient with a retry hint', async () => {
    const provider = connector();
    provider.setFailureMode('rate_limit', 1);
    try {
      await provider.publish(fakePublishRequest(fakeDraft({}, { clock }), {}, { clock }));
      expect.unreachable('a rate limited publish must throw');
    } catch (error) {
      expect(ProviderCallError.is(error)).toBe(true);
      if (ProviderCallError.is(error)) {
        expect(error.classified.errorClass).toBe('TRANSIENT_PROVIDER');
        expect(error.classified.retryAfterSeconds).toBe(90);
        // A publish is never retried automatically, whatever the class.
        expect(error.classified.retryable).toBe(false);
      }
    }
  });

  it('raises user action required when the token expired at execution', async () => {
    const provider = connector();
    provider.setFailureMode('expired_token', 1);
    try {
      await provider.publish(fakePublishRequest(fakeDraft({}, { clock }), {}, { clock }));
      expect.unreachable('an expired token must throw');
    } catch (error) {
      expect(ProviderCallError.is(error)).toBe(true);
      if (ProviderCallError.is(error)) {
        expect(error.classified.errorClass).toBe('USER_ACTION_REQUIRED');
        expect(error.classified.remediationCode).toBe('reconnect_account');
      }
    }
  });
});

describe('status polling', () => {
  it('reports processing until the container finishes, then published', async () => {
    const provider = connector();
    provider.setFailureMode('slow_media', 1);
    const draft = fakeDraft({}, { clock });
    const request = fakePublishRequest(draft, {}, { clock });
    const pending = await provider.publish(request);
    expect(pending.status).toBe('pending');
    if (pending.status !== 'pending') return;

    const statusRequest = fakeStatusRequest(draft, { providerJobId: pending.providerJobId }, { clock });
    expect((await provider.getStatus(statusRequest)).state).toBe('processing');
    expect((await provider.getStatus(statusRequest)).state).toBe('processing');
    const finished = await provider.getStatus(statusRequest);
    expect(finished.state).toBe('published');
    expect(finished.externalPostId).not.toBeNull();
  });

  it('never reports a stuck container as published', async () => {
    const provider = connector();
    provider.setFailureMode('container_stuck', 1);
    const draft = fakeDraft({}, { clock });
    const pending = await provider.publish(fakePublishRequest(draft, {}, { clock }));
    if (pending.status !== 'pending') {
      expect.unreachable('expected a pending result');
      return;
    }
    for (let poll = 0; poll < 5; poll += 1) {
      const status = await provider.getStatus(
        fakeStatusRequest(draft, { providerJobId: pending.providerJobId }, { clock }),
      );
      expect(status.state).toBe('processing');
    }
  });

  it('finds an existing post by content fingerprint', async () => {
    const provider = connector();
    const draft = fakeDraft({}, { clock });
    await provider.publish(fakePublishRequest(draft, {}, { clock }));
    const status = await provider.getStatus(fakeStatusRequest(draft, {}, { clock }));
    expect(status.state).toBe('published');
    expect(status.externalPostId).not.toBeNull();
  });
});

describe('deletion and analytics', () => {
  it('deletes an external post and refuses a second delete', async () => {
    const provider = connector();
    const draft = fakeDraft({}, { clock });
    const result = await provider.publish(fakePublishRequest(draft, {}, { clock }));
    if (result.status !== 'published') {
      expect.unreachable('expected a published result');
      return;
    }
    await provider.deletePost({
      connection: draft.connection,
      externalPostId: result.externalPostId,
      confirmedByActorId: 'user_1',
    });
    await expect(
      provider.deletePost({
        connection: draft.connection,
        externalPostId: result.externalPostId,
        confirmedByActorId: 'user_1',
      }),
    ).rejects.toBeInstanceOf(ProviderCallError);
  });

  it('returns observations and marks what it cannot read as unavailable', async () => {
    const provider = connector();
    const draft = fakeDraft({}, { clock });
    const result = await provider.publish(fakePublishRequest(draft, {}, { clock }));
    if (result.status !== 'published') {
      expect.unreachable('expected a published result');
      return;
    }
    const observations = await provider.fetchMetrics(
      fakeMetricsRequest(draft, result.externalPostId),
    );
    expect(observations.length).toBeGreaterThan(0);
    for (const observation of observations) {
      expect(metricObservationSchema.safeParse(observation).success).toBe(true);
    }
    const clicks = observations.find((entry) => entry.normalizedName === 'link_clicks');
    expect(clicks?.availability).toBe('unavailable_permission');
    // Missing data is unavailable, never zero.
    expect(clicks?.value).toBeNull();
  });
});

describe('credentials', () => {
  it('rotates both halves of the credential', async () => {
    const provider = connector();
    const result = await provider.refreshCredential({
      connectionId: 'conn_1',
      workspaceId: 'ws_1',
      provider: 'fake',
      refreshToken: fakeConnectionRef({}, { clock }).accessToken,
      grantedScopes: ['fake.read'],
      client: { clientId: 'id', clientSecret: null, redirectUri: 'https://app.invalid/cb' },
    });
    expect(result.refreshTokenRotated).toBe(true);
    expect(JSON.stringify(result)).not.toContain('fake-access-');
  });

  it('raises user action required once the connection is revoked', async () => {
    const provider = connector();
    const connection = fakeConnectionRef({}, { clock });
    await provider.revoke({
      connectionId: connection.connectionId,
      workspaceId: connection.workspaceId,
      provider: 'fake',
      accessToken: connection.accessToken,
      refreshToken: null,
      client: { clientId: 'id', clientSecret: null, redirectUri: 'https://app.invalid/cb' },
    });
    await expect(
      provider.publish(fakePublishRequest(fakeDraft({ connection }, { clock }), {}, { clock })),
    ).rejects.toBeInstanceOf(ProviderCallError);
  });
});

describe('determinism', () => {
  it('produces the same identifiers for the same seed', async () => {
    const first = createFakeConnector({
      clock,
      instant: true,
      state: new FakeProviderState({ clock, seed: 7 }),
    });
    const second = createFakeConnector({
      clock,
      instant: true,
      state: new FakeProviderState({ clock, seed: 7 }),
    });
    const draft = fakeDraft({}, { clock });
    const left = await first.publish(fakePublishRequest(draft, {}, { clock }));
    const right = await second.publish(fakePublishRequest(draft, {}, { clock }));
    expect(left.status).toBe('published');
    if (left.status === 'published' && right.status === 'published') {
      expect(left.externalPostId).toBe(right.externalPostId);
    }
  });

  it('simulates latency through the injected sleeper', async () => {
    const sleeper = recordingSleeper();
    const provider = createFakeConnector({
      clock,
      sleeper,
      state: new FakeProviderState({ clock, seed: 3 }),
    });
    await provider.publish(fakePublishRequest(fakeDraft({}, { clock }), {}, { clock }));
    expect(sleeper.waits).toHaveLength(1);
    expect(sleeper.waits[0]).toBeGreaterThan(0);
  });
});
