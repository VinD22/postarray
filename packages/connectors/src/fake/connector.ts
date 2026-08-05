import { createHash } from 'node:crypto';

import {
  type CapabilitySnapshot,
  type MetricObservation,
  type ValidationResult,
  canonicalJson,
  metricObservationSchema,
} from '@relay/contracts';

import {
  type AuthorizationDefinition,
  type CanonicalPreview,
  CONNECTOR_CONTRACT_VERSION,
  type ConnectionRef,
  type ConnectorFeature,
  type CredentialResult,
  type DeleteRequest,
  type DestinationRequest,
  type ExternalAccount,
  type MediaPreparationRequest,
  type MentionEntity,
  type MentionSearchRequest,
  type MetricsRequest,
  NOT_IMPLEMENTED_FEATURES,
  type OAuthGrantInput,
  type PreparedMedia,
  type ProviderDestination,
  type ProviderDraft,
  type ProviderIdentity,
  type PublishRequest,
  type PublishResult,
  type PublishStatus,
  type PublishedItem,
  type RefreshRequest,
  type RevokeRequest,
  type SocialConnector,
  type StatusRequest,
  canonicalPreviewSchema,
  preparedMediaSchema,
  providerDestinationSchema,
  publishResultSchema,
  publishStatusSchema,
} from '../contract.js';
import { ProviderCallError, classifyProviderError } from '../errors.js';
import {
  type Clock,
  type ConnectorLogger,
  type Sleeper,
  instantOf,
  noopLogger,
  realSleeper,
  systemClock,
} from '../ports.js';
import { SecretValue } from '../vault.js';
import { type FakeCapabilityOverrides, buildFakeCapabilitySnapshot } from './capabilities.js';
import { FakeProviderState, type FakeFailureMode } from './state.js';
import { buildFakePreview, validateFakeDraft } from './validate.js';

/**
 * The fake provider.
 *
 * It implements every method of the contract with realistic latency, realistic
 * capability limits and switchable failure modes, so the whole compose,
 * validate, approve, schedule, publish, retry, partial success, receipt and
 * analytics loop is exercisable with zero credentials. Seeds, the local dev
 * loop, the MCP sandbox and the duplicate publication tests all use it.
 *
 * Nothing here talks to a network. The only mutable state is in memory.
 */

const FAKE_FEATURES: Readonly<Partial<Record<ConnectorFeature, 'supported' | 'not_implemented'>>> =
  Object.freeze({
    discover_accounts: 'supported',
    list_destinations: 'supported',
    search_mentions: 'supported',
    native_mentions: 'supported',
    get_capabilities: 'supported',
    validate_draft: 'supported',
    prepare_media: 'supported',
    preview: 'supported',
    publish: 'supported',
    get_status: 'supported',
    delete_post: 'supported',
    fetch_metrics: 'supported',
    refresh_credential: 'supported',
    revoke: 'supported',
    first_comment: 'supported',
    thread_parts: 'supported',
    comment_count: 'supported',
    // V1 ships no comment inbox on any connector. Saying so is the point.
    comment_replies: 'not_implemented',
    // The fake deliberately has no provider side idempotency, so every retry
    // path runs through `ensureNotAlreadyPublished()` the way X does.
    provider_idempotency: 'not_implemented',
    post_analytics: 'supported',
    account_analytics: 'supported',
    privacy_controls: 'supported',
    ai_disclosure: 'supported',
    commercial_disclosure: 'supported',
    alt_text: 'supported',
    carousel: 'supported',
    video: 'supported',
    document: 'not_implemented',
    metered_cost: 'supported',
  });

export interface FakeConnectorOptions {
  readonly state?: FakeProviderState;
  readonly clock?: Clock;
  readonly sleeper?: Sleeper;
  readonly logger?: ConnectorLogger;
  readonly capabilityOverrides?: FakeCapabilityOverrides;
  /** Skip the simulated latency entirely. Default false. */
  readonly instant?: boolean;
}

function hashOf(value: unknown): string {
  return createHash('sha256').update(canonicalJson(value), 'utf8').digest('hex');
}

export class FakeConnector implements SocialConnector {
  readonly state: FakeProviderState;
  readonly #clock: Clock;
  readonly #sleeper: Sleeper;
  readonly #logger: ConnectorLogger;
  readonly #overrides: FakeCapabilityOverrides;
  readonly #instant: boolean;

  constructor(options: FakeConnectorOptions = {}) {
    this.#clock = options.clock ?? systemClock;
    this.state = options.state ?? new FakeProviderState({ clock: this.#clock });
    this.state.setClock(this.#clock);
    this.#sleeper = options.sleeper ?? realSleeper;
    this.#logger = options.logger ?? noopLogger;
    this.#overrides = options.capabilityOverrides ?? {};
    this.#instant = options.instant ?? false;
  }

  /** Switch the simulated failure. `forCalls` bounds it to the next N calls. */
  setFailureMode(mode: FakeFailureMode, forCalls?: number): void {
    this.state.setFailureMode(mode, forCalls);
  }

  identity(): ProviderIdentity {
    return {
      provider: 'fake',
      displayName: 'Fake provider',
      iconToken: 'provider.fake',
      accountTypes: ['personal_profile', 'page', 'creator_profile'],
      contractVersion: CONNECTOR_CONTRACT_VERSION,
      connectorVersion: '1.0.0',
      label: 'beta',
      limitationKey: 'shell.demo.body',
      officialDocsUrl: 'https://example.invalid/docs/fake-provider',
      officialPolicyUrl: 'https://example.invalid/policy/fake-provider',
      engineeringOwner: 'Connectors Lead',
      policyOwner: 'Policy Owner',
      lastPolicyReviewAt: '2026-08-04T00:00:00.000Z',
      nextPolicyReviewAt: '2099-01-01T00:00:00.000Z',
      features: { ...NOT_IMPLEMENTED_FEATURES, ...FAKE_FEATURES },
    };
  }

  authorization(): AuthorizationDefinition {
    return {
      flavor: 'oauth2_pkce',
      authorizeUrl: 'https://fake.invalid/oauth/authorize',
      tokenUrl: 'https://fake.invalid/oauth/token',
      revokeUrl: 'https://fake.invalid/oauth/revoke',
      redirectPath: '/v1/connections/callback/fake',
      scopes: [
        {
          scope: 'fake.read',
          explanationKey: 'connection.permissions.whyNeeded',
          usedBy: ['connections', 'analytics'],
          required: true,
        },
        {
          scope: 'fake.write',
          explanationKey: 'connection.permissions.whyNeeded',
          usedBy: ['composer', 'queue'],
          required: true,
        },
        {
          scope: 'fake.offline',
          explanationKey: 'connection.permissions.whyNeeded',
          usedBy: ['queue'],
          required: false,
        },
      ],
      pkceRequired: true,
      multiStep: false,
      stepDescriptionKeys: [],
      supportsRefresh: true,
      refreshAtLifetimeFraction: 0.75,
      extraAuthorizeParameters: {},
    };
  }

  async #tick(multiplier = 1): Promise<void> {
    if (this.#instant) {
      return;
    }
    await this.#sleeper.sleep(this.state.latencyMs(multiplier));
  }

  #fail(
    operation: Parameters<typeof classifyProviderError>[0]['operation'],
    input: {
      status?: number;
      body?: unknown;
      headers?: Record<string, string>;
      transportCode?: string;
    },
  ): ProviderCallError {
    return new ProviderCallError(
      classifyProviderError({
        provider: 'fake',
        operation,
        clock: this.#clock,
        ...input,
      }),
    );
  }

  #guardConnection(
    connection: ConnectionRef,
    operation: Parameters<typeof classifyProviderError>[0]['operation'],
    mode: FakeFailureMode,
  ): void {
    if (this.state.revokedConnections.has(connection.connectionId) || mode === 'expired_token') {
      throw this.#fail(operation, {
        status: 401,
        body: { error: 'invalid_token', message: 'The access token expired or was revoked.' },
      });
    }
    if (mode === 'permission_revoked') {
      throw this.#fail(operation, {
        status: 403,
        body: { error: 'insufficient_scope', message: 'Missing permission for this account.' },
      });
    }
    if (mode === 'rate_limit') {
      throw this.#fail(operation, {
        status: 429,
        body: { message: 'Rate limit reached for this account.' },
        headers: { 'retry-after': '90' },
      });
    }
    if (mode === 'transient_5xx') {
      throw this.#fail(operation, {
        status: 503,
        body: { message: 'The fake provider is temporarily unavailable.' },
      });
    }
    if (mode === 'malformed_response') {
      throw this.#fail(operation, { status: 200, body: '<html>not json</html>' });
    }
  }

  async discoverAccounts(input: OAuthGrantInput): Promise<ExternalAccount[]> {
    await this.#tick();
    const mode = this.state.takeFailureMode();
    if (mode === 'expired_token') {
      throw this.#fail('discover_accounts', {
        status: 401,
        body: { error: 'invalid_grant', message: 'The grant is no longer valid.' },
      });
    }
    return this.state.accounts.map((account) => ({
      externalAccountId: account.externalAccountId,
      accountType: account.accountType,
      displayName: account.displayName,
      handle: account.handle,
      avatarUrl: account.avatarUrl,
      profileUrl: account.profileUrl,
      parentExternalId: account.parentExternalId,
      grantedScopes: [...input.grantedScopes],
      eligible: account.eligible,
      ineligibleReasonKey: account.ineligibleReasonKey,
      accountAccessToken: account.eligible
        ? new SecretValue(`fake-account-token-${account.externalAccountId}`, 'access_token')
        : null,
      metadata: { followers: account.followers },
    }));
  }

  async listDestinations(input: DestinationRequest): Promise<ProviderDestination[]> {
    await this.#tick();
    const mode = this.state.takeFailureMode();
    this.#guardConnection(input.connection, 'list_destinations', mode);
    const query = input.query?.toLowerCase() ?? '';
    const nowMs = this.#clock.now().getTime();
    return this.state.destinations
      .filter((destination) => destination.kind === input.kind)
      .filter(
        (destination) => query === '' || destination.displayLabel.toLowerCase().includes(query),
      )
      .slice(0, input.limit)
      .map((destination) =>
        providerDestinationSchema.parse({
          externalId: destination.externalId,
          kind: destination.kind,
          displayLabel: destination.displayLabel,
          parentExternalId: null,
          canPost: destination.canPost,
          refreshedAt: instantOf(nowMs),
          expiresAt: instantOf(nowMs + 24 * 60 * 60 * 1000),
          metadata: {},
        }),
      );
  }

  async searchMentions(input: MentionSearchRequest): Promise<MentionEntity[]> {
    await this.#tick(0.5);
    const mode = this.state.takeFailureMode();
    this.#guardConnection(input.connection, 'search_mentions', mode);
    const query = input.query.toLowerCase().replace(/^@/, '');
    const at = instantOf(this.#clock.now().getTime());
    return this.state.mentions
      .filter(
        (mention) =>
          mention.handle.toLowerCase().includes(query) ||
          mention.displayLabel.toLowerCase().includes(query),
      )
      .slice(0, input.limit)
      .map((mention) => ({
        externalId: mention.externalId,
        kind: mention.kind,
        displayLabel: mention.displayLabel,
        handle: mention.handle,
        avatarUrl: null,
        resolvedToExternalId: true,
        resolvedAt: at,
      }));
  }

  async getCapabilities(connection: ConnectionRef): Promise<CapabilitySnapshot> {
    await this.#tick(0.5);
    const mode = this.state.peekFailureMode();
    if (mode === 'expired_token' || mode === 'permission_revoked') {
      this.state.takeFailureMode();
      this.#guardConnection(connection, 'get_capabilities', mode);
    }
    const downgraded = mode === 'capability_downgrade';
    return buildFakeCapabilitySnapshot({
      connectionId: connection.connectionId,
      accountType: connection.accountType,
      observedAt: instantOf(this.#clock.now().getTime()),
      overrides: downgraded
        ? {
            ...this.#overrides,
            // The exact drift the approval gate must catch.
            threadsSupport: 'not_implemented',
            textMaxLength: 280,
            capabilityVersion: 'fake-2026-08-04.2',
          }
        : this.#overrides,
    });
  }

  async validateDraft(input: ProviderDraft): Promise<ValidationResult> {
    // Deterministic and offline: no provider call, so no failure mode applies.
    return await Promise.resolve(validateFakeDraft(input));
  }

  async preview(input: ProviderDraft): Promise<CanonicalPreview> {
    return await Promise.resolve(canonicalPreviewSchema.parse(buildFakePreview(input)));
  }

  async prepareMedia(input: MediaPreparationRequest): Promise<PreparedMedia[]> {
    await this.#tick(input.media.length === 0 ? 0.5 : input.media.length);
    const mode = this.state.takeFailureMode();
    this.#guardConnection(input.connection, 'prepare_media', mode);

    return input.media.map((asset) => {
      const key = this.state.uploadKey({
        mediaId: asset.mediaId,
        connectionId: input.connection.connectionId,
        postVariantId: input.postVariantId,
      });
      const existing = this.state.uploads.get(key);
      if (existing !== undefined) {
        // Idempotent on (asset, connection, variant): a retry does not re-upload.
        return preparedMediaSchema.parse({
          mediaId: asset.mediaId,
          derivativeId: asset.derivativeId,
          providerMediaId: existing.providerMediaId,
          containerId: null,
          uploadState: existing.remainingProcessingPolls > 0 ? 'processing' : 'ready',
          derivativeChecksum: existing.checksum,
          byteSize: existing.byteSize,
          altTextApplied: asset.altText !== null && asset.altText !== '',
          publicUrl: null,
          expiresAt: null,
          reusedFromPreviousAttempt: true,
        });
      }
      const providerMediaId = this.state.nextId('fkm');
      const slow = mode === 'slow_media';
      this.state.uploads.set(key, {
        key,
        providerMediaId,
        checksum: asset.checksum,
        byteSize: asset.byteSize,
        remainingProcessingPolls: slow ? this.state.containerPolls : 0,
      });
      return preparedMediaSchema.parse({
        mediaId: asset.mediaId,
        derivativeId: asset.derivativeId,
        providerMediaId,
        containerId: null,
        uploadState: slow ? 'processing' : 'ready',
        derivativeChecksum: asset.checksum,
        byteSize: asset.byteSize,
        altTextApplied: asset.altText !== null && asset.altText !== '',
        publicUrl: null,
        expiresAt: null,
        reusedFromPreviousAttempt: false,
      });
    });
  }

  #createRoot(input: PublishRequest, at: string): PublishedItem {
    const externalPostId = this.state.nextId('fkp');
    this.state.addPost({
      externalPostId,
      connectionId: input.draft.connection.connectionId,
      fingerprint: input.contentFingerprint,
      body: input.draft.body,
      permalink: `https://fake.invalid/p/${externalPostId}`,
      createdAt: at,
      kind: 'root',
      order: 0,
      threadItemId: null,
      parentPostId: null,
    });
    return {
      kind: 'root',
      order: 0,
      threadItemId: null,
      externalPostId,
      permalink: `https://fake.invalid/p/${externalPostId}`,
      publishedAt: at,
    };
  }

  async publish(input: PublishRequest): Promise<PublishResult> {
    await this.#tick(1.5);
    const mode = this.state.takeFailureMode();
    this.#guardConnection(input.draft.connection, 'publish', mode);
    const at = instantOf(this.#clock.now().getTime());

    const alreadyPublished = this.state.findRootByFingerprint({
      connectionId: input.draft.connection.connectionId,
      fingerprint: input.contentFingerprint,
      windowFrom: instantOf(this.#clock.now().getTime() - 6 * 60 * 60 * 1000),
      windowTo: at,
    });
    if (mode === 'duplicate_detected' || alreadyPublished !== undefined) {
      return publishResultSchema.parse({
        status: 'failed',
        error: {
          errorClass: 'CONTENT_INVALID',
          remediationCode: 'duplicate_content',
          messageKey: 'error.duplicate_content.message',
          retryable: false,
          providerMessage: 'This account already published this exact content.',
        },
        sanitizedResponse: { code: 'duplicate_content' },
        providerRequestId: this.state.nextId('fkreq'),
      });
    }

    if (mode === 'content_rejected') {
      return publishResultSchema.parse({
        status: 'failed',
        error: {
          errorClass: 'PERMANENT_PROVIDER',
          remediationCode: 'provider_rejected_content',
          messageKey: 'error.provider_content_rejected.message',
          retryable: false,
          providerMessage: 'The fake provider rejected this content.',
        },
        sanitizedResponse: { code: 'content_rejected' },
        providerRequestId: this.state.nextId('fkreq'),
      });
    }

    if (mode === 'container_stuck' || mode === 'slow_media') {
      const providerJobId = this.state.nextId('fkjob');
      this.state.containers.set(providerJobId, {
        providerJobId,
        connectionId: input.draft.connection.connectionId,
        fingerprint: input.contentFingerprint,
        outcome: mode === 'container_stuck' ? 'stuck' : 'published',
        remainingPolls: this.state.containerPolls,
        publishedPostIds: [],
        createdAt: at,
      });
      return publishResultSchema.parse({
        status: 'pending',
        providerJobId,
        pollAfterSeconds: 5,
        giveUpAt: instantOf(this.#clock.now().getTime() + 15 * 60 * 1000),
        sanitizedResponse: { state: 'IN_PROGRESS' },
        providerRequestId: this.state.nextId('fkreq'),
      });
    }

    const root = this.#createRoot(input, at);

    if (mode === 'timeout_after_accept') {
      // The duplicate publication trap: the provider accepted and created the
      // post, then the connection died before we saw the response.
      throw this.#fail('publish', { transportCode: 'UND_ERR_HEADERS_TIMEOUT', body: 'timeout' });
    }

    const items: PublishedItem[] = [root];
    const failures: {
      kind: 'comment' | 'thread';
      order: number;
      threadItemId: string | null;
      error: unknown;
    }[] = [];
    let previousPostId = root.externalPostId;

    for (const item of input.draft.threadItems) {
      if (mode === 'partial_thread_failure') {
        failures.push({
          kind: item.kind,
          order: item.order,
          threadItemId: item.threadItemId,
          error: {
            errorClass: 'TRANSIENT_PROVIDER',
            remediationCode: 'comment_failed_root_published',
            messageKey: 'state.partially_published.label',
            retryable: true,
            providerMessage: 'The follow up item was rejected. The root post is live.',
          },
        });
        continue;
      }
      const externalPostId = this.state.nextId('fkp');
      this.state.addPost({
        externalPostId,
        connectionId: input.draft.connection.connectionId,
        fingerprint: `${input.contentFingerprint}:${item.order}`,
        body: item.body,
        permalink: `https://fake.invalid/p/${externalPostId}`,
        createdAt: at,
        kind: item.kind,
        order: item.order,
        threadItemId: item.threadItemId,
        parentPostId: previousPostId,
      });
      previousPostId = externalPostId;
      items.push({
        kind: item.kind,
        order: item.order,
        threadItemId: item.threadItemId,
        externalPostId,
        permalink: `https://fake.invalid/p/${externalPostId}`,
        publishedAt: at,
      });
    }

    const cost = input.draft.capabilities.cost;
    const containsUrl = input.draft.links.length > 0 || /https?:\/\//i.test(input.draft.body);
    const costMinor =
      cost === null
        ? null
        : (containsUrl ? cost.perUrlCreateMinor : cost.perCreateMinor) * items.length;

    if (failures.length > 0) {
      return publishResultSchema.parse({
        status: 'partial',
        externalPostId: root.externalPostId,
        permalink: root.permalink,
        publishedAt: at,
        items,
        failures,
        sanitizedResponse: { published: items.length, failed: failures.length },
        providerRequestId: this.state.nextId('fkreq'),
        costMinor,
        currency: cost?.currency ?? null,
      });
    }

    this.#logger.info(
      {
        provider: 'fake',
        connectionId: input.draft.connection.connectionId,
        items: items.length,
      },
      'connector.fake.published',
    );

    return publishResultSchema.parse({
      status: 'published',
      externalPostId: root.externalPostId,
      permalink: root.permalink,
      publishedAt: at,
      items,
      sanitizedResponse: { published: items.length },
      providerRequestId: this.state.nextId('fkreq'),
      costMinor,
      currency: cost?.currency ?? null,
    });
  }

  async getStatus(input: StatusRequest): Promise<PublishStatus> {
    await this.#tick(0.5);
    const mode = this.state.takeFailureMode();
    if (mode === 'expired_token' || mode === 'permission_revoked' || mode === 'rate_limit') {
      this.#guardConnection(input.connection, 'get_status', mode);
    }
    const at = instantOf(this.#clock.now().getTime());

    if (input.providerJobId !== null) {
      const container = this.state.containers.get(input.providerJobId);
      if (container === undefined) {
        return publishStatusSchema.parse({
          state: 'unknown',
          externalPostId: null,
          permalink: null,
          publishedAt: null,
          items: [],
          error: null,
          pollAfterSeconds: null,
          sanitizedResponse: { reason: 'container_not_found' },
        });
      }
      if (container.outcome === 'stuck') {
        return publishStatusSchema.parse({
          state: 'processing',
          externalPostId: null,
          permalink: null,
          publishedAt: null,
          items: [],
          error: null,
          pollAfterSeconds: 10,
          sanitizedResponse: { state: 'IN_PROGRESS' },
        });
      }
      if (container.remainingPolls > 0) {
        container.remainingPolls -= 1;
        return publishStatusSchema.parse({
          state: 'processing',
          externalPostId: null,
          permalink: null,
          publishedAt: null,
          items: [],
          error: null,
          pollAfterSeconds: 5,
          sanitizedResponse: { state: 'IN_PROGRESS' },
        });
      }
      if (container.outcome === 'failed') {
        return publishStatusSchema.parse({
          state: 'failed',
          externalPostId: null,
          permalink: null,
          publishedAt: null,
          items: [],
          error: {
            errorClass: 'PERMANENT_PROVIDER',
            remediationCode: 'provider_rejected_content',
            messageKey: 'error.provider_content_rejected.message',
            retryable: false,
            providerMessage: 'The container finished with an error.',
          },
          pollAfterSeconds: null,
          sanitizedResponse: { state: 'ERROR' },
        });
      }
      const existing = this.state.findRootByFingerprint({
        connectionId: container.connectionId,
        fingerprint: container.fingerprint,
        windowFrom: input.dispatchWindowFrom,
        windowTo: input.dispatchWindowTo,
      });
      const post =
        existing ??
        this.state.addPost({
          externalPostId: this.state.nextId('fkp'),
          connectionId: container.connectionId,
          fingerprint: container.fingerprint,
          body: '',
          permalink: '',
          createdAt: at,
          kind: 'root',
          order: 0,
          threadItemId: null,
          parentPostId: null,
        });
      const permalink =
        post.permalink === '' ? `https://fake.invalid/p/${post.externalPostId}` : post.permalink;
      return publishStatusSchema.parse({
        state: 'published',
        externalPostId: post.externalPostId,
        permalink,
        publishedAt: post.createdAt,
        items: [
          {
            kind: 'root',
            order: 0,
            threadItemId: null,
            externalPostId: post.externalPostId,
            permalink,
            publishedAt: post.createdAt,
          },
        ],
        error: null,
        pollAfterSeconds: null,
        sanitizedResponse: { state: 'FINISHED' },
      });
    }

    const byId =
      input.externalPostId === null ? undefined : this.state.getPost(input.externalPostId);
    const found =
      byId ??
      this.state.findRootByFingerprint({
        connectionId: input.connection.connectionId,
        fingerprint: input.contentFingerprint,
        windowFrom: input.dispatchWindowFrom,
        windowTo: input.dispatchWindowTo,
      });

    if (found !== undefined && !found.deleted) {
      return publishStatusSchema.parse({
        state: 'published',
        externalPostId: found.externalPostId,
        permalink: found.permalink,
        publishedAt: found.createdAt,
        items: [
          {
            kind: found.kind,
            order: found.order,
            threadItemId: found.threadItemId,
            externalPostId: found.externalPostId,
            permalink: found.permalink,
            publishedAt: found.createdAt,
          },
        ],
        error: null,
        pollAfterSeconds: null,
        sanitizedResponse: { source: byId === undefined ? 'fingerprint_search' : 'post_lookup' },
      });
    }

    // Nothing exists for this content in the dispatch window, so a create is
    // safe. This is the positive evidence `ensureNotAlreadyPublished()` needs.
    return publishStatusSchema.parse({
      state: 'failed',
      externalPostId: null,
      permalink: null,
      publishedAt: null,
      items: [],
      error: {
        errorClass: 'TRANSIENT_PROVIDER',
        remediationCode: 'wait_for_provider',
        messageKey: 'error.provider_transient.message',
        retryable: true,
        providerMessage: null,
      },
      pollAfterSeconds: null,
      sanitizedResponse: { source: 'fingerprint_search', found: false },
    });
  }

  async deletePost(input: DeleteRequest): Promise<void> {
    await this.#tick(0.5);
    const mode = this.state.takeFailureMode();
    this.#guardConnection(input.connection, 'delete_post', mode);
    const post = this.state.getPost(input.externalPostId);
    if (post === undefined || post.deleted) {
      throw this.#fail('delete_post', {
        status: 404,
        body: { message: 'That post no longer exists on the fake provider.' },
      });
    }
    post.deleted = true;
  }

  async fetchMetrics(input: MetricsRequest): Promise<MetricObservation[]> {
    await this.#tick();
    const mode = this.state.takeFailureMode();
    this.#guardConnection(input.connection, 'fetch_metrics', mode);
    const observedAt = instantOf(this.#clock.now().getTime());
    const snapshot = await this.getCapabilities(input.connection);
    const names =
      input.metrics.length > 0
        ? input.metrics
        : input.scope === 'post'
          ? snapshot.analytics.postMetrics
          : snapshot.analytics.accountMetrics;

    return names.map((name) => {
      const payloadHash = hashOf({ name, scope: input.scope, postId: input.externalPostId });
      // Link clicks need a permission this connection does not have. It is
      // reported as unavailable with a reason, never as zero.
      if (name === 'link_clicks') {
        return metricObservationSchema.parse({
          normalizedName: name,
          provider: 'fake',
          providerField: 'link_clicks_total',
          scope: input.scope,
          value: null,
          unit: 'count',
          denominator: 'none',
          availability: 'unavailable_permission',
          observedAt,
          freshnessSeconds: 0,
          rawProviderPayloadHash: payloadHash,
        });
      }
      const magnitude = Number.parseInt(payloadHash.slice(0, 6), 16) % 5000;
      return metricObservationSchema.parse({
        normalizedName: name,
        provider: 'fake',
        providerField: `${name}_total`,
        scope: input.scope,
        value: name === 'follower_delta' ? magnitude % 200 : magnitude,
        unit: 'count',
        denominator: 'none',
        availability: 'available',
        observedAt,
        freshnessSeconds: 0,
        rawProviderPayloadHash: payloadHash,
      });
    });
  }

  async refreshCredential(input: RefreshRequest): Promise<CredentialResult> {
    await this.#tick(0.5);
    const mode = this.state.takeFailureMode();
    if (mode === 'expired_token' || this.state.revokedConnections.has(input.connectionId)) {
      throw this.#fail('refresh_credential', {
        status: 400,
        body: { error: 'invalid_grant', message: 'The refresh token is no longer valid.' },
      });
    }
    const nowMs = this.#clock.now().getTime();
    return {
      accessToken: new SecretValue(`fake-access-${this.state.nextId('tok')}`, 'access_token'),
      refreshToken: new SecretValue(`fake-refresh-${this.state.nextId('tok')}`, 'refresh_token'),
      tokenType: 'Bearer',
      expiresAt: instantOf(nowMs + 3600 * 1000),
      grantedScopes: [...input.grantedScopes],
      refreshTokenRotated: true,
      obtainedAt: instantOf(nowMs),
    };
  }

  async revoke(input: RevokeRequest): Promise<void> {
    await this.#tick(0.5);
    this.state.takeFailureMode();
    this.state.revokedConnections.add(input.connectionId);
  }
}

/** Build a fake connector with an isolated state. */
export function createFakeConnector(options: FakeConnectorOptions = {}): FakeConnector {
  return new FakeConnector(options);
}
