import {
  CapabilityNotImplementedError,
  ContentInvalidError,
  RelayError,
  validationIssue,
  validationResult,
  type MetricObservation,
  type ValidationIssue,
  type ValidationResult,
} from '@relay/contracts';

import {
  REMEDIATION,
  ensureOk,
  parseProviderBody,
  providerFailure,
  type AuthorizationDefinition,
  type CanonicalPreview,
  type ConnectorDeps,
  type CredentialResult,
  type DeleteRequest,
  type DestinationRequest,
  type ExternalAccount,
  type MediaPreparationRequest,
  type MentionEntity,
  type MentionSearchRequest,
  type MetricsRequest,
  type OAuthGrant,
  type PreparedMedia,
  type ProviderConnection,
  type ProviderDestination,
  type ProviderDraft,
  type ProviderIdentity,
  type ProviderMedia,
  type PublishItemResult,
  type PublishRequest,
  type PublishResult,
  type PublishStatus,
  type RefreshRequest,
  type RevokeRequest,
  type SocialConnector,
  type StatusRequest,
  refreshOAuth2Token,
} from '../shared/contract-shape.js';
import { CONNECTOR_CONTRACT_VERSION } from '../shared/contract-shape.js';
import { buildPreview } from '../shared/preview.js';
import { mapMetrics } from '../shared/metrics.js';
import { normalizeForSimilarity } from '../shared/text.js';
import { validateDraftShape } from '../shared/validate.js';
import { SOURCE_VERIFIED_ON } from '../shared/verification.js';
import { X_SCOPES, buildXCapabilities } from './capabilities.js';
import { estimateCost, isLinkHeavy, type XCostEstimate } from './cost.js';
import { X_ACCOUNT_METRICS, X_POST_FIELDS, X_POST_METRICS, X_USER_FIELDS } from './metrics.js';
import {
  xCreatePostResponseSchema,
  xDeleteResponseSchema,
  xErrorBodySchema,
  xMediaUploadResponseSchema,
  xPostLookupResponseSchema,
  xProviderOptionsSchema,
  xTimelineResponseSchema,
  xUserResponseSchema,
  xUserSearchResponseSchema,
} from './schemas.js';

/**
 * X connector.
 *
 * Official X API v2 only. Direct create, no container step. Threads are replies to our own
 * previous post. Media is uploaded first and referenced by media id.
 *
 * Two rules drive most of the code here:
 *
 * 1. **Cost.** X charges per operation and charges materially more for a create that
 *    contains a URL. Every draft carries an estimate and the estimate travels into the
 *    validation result so the composer, the schedule confirmation and any bulk preview
 *    show the same number.
 * 2. **No duplicates.** X offers no idempotency token for post creation, so before any
 *    retry of a create we query the account's recent posts for a matching post inside the
 *    dispatch window and adopt it rather than creating a second one. A duplicate is both a
 *    policy violation and a billing event.
 */

const PROVIDER = 'x' as const;
const API_BASE = 'https://api.x.com/2';
const AUTHORIZE_URL = 'https://x.com/i/oauth2/authorize';
const TOKEN_URL = 'https://api.x.com/2/oauth2/token';
const REVOKE_URL = 'https://api.x.com/2/oauth2/revoke';
const MEDIA_CHUNK_BYTES = 4 * 1024 * 1024;
const DUPLICATE_LOOKBACK_MINUTES = 30;

interface XResume {
  readonly rootExternalPostId?: string;
  readonly lastExternalPostId?: string;
  readonly publishedOrders?: readonly number[];
  readonly dueOrders?: readonly number[];
  readonly attempted?: boolean;
}

function readResume(value: Readonly<Record<string, unknown>>): XResume {
  const publishedOrders = Array.isArray(value['publishedOrders'])
    ? value['publishedOrders'].filter((entry): entry is number => typeof entry === 'number')
    : undefined;
  const dueOrders = Array.isArray(value['dueOrders'])
    ? value['dueOrders'].filter((entry): entry is number => typeof entry === 'number')
    : undefined;
  return {
    ...(typeof value['rootExternalPostId'] === 'string'
      ? { rootExternalPostId: value['rootExternalPostId'] }
      : {}),
    ...(typeof value['lastExternalPostId'] === 'string'
      ? { lastExternalPostId: value['lastExternalPostId'] }
      : {}),
    ...(publishedOrders === undefined ? {} : { publishedOrders }),
    ...(dueOrders === undefined ? {} : { dueOrders }),
    ...(typeof value['attempted'] === 'boolean' ? { attempted: value['attempted'] } : {}),
  };
}

function handleOf(connection: ProviderConnection): string | null {
  const username = connection.metadata['username'];
  return typeof username === 'string' && username !== '' ? username : null;
}

function permalink(connection: ProviderConnection, postId: string): string {
  const handle = handleOf(connection);
  return handle === null
    ? `https://x.com/i/web/status/${postId}`
    : `https://x.com/${handle}/status/${postId}`;
}

function isDuplicateRejection(body: unknown): boolean {
  const parsed = xErrorBodySchema.safeParse(body);
  if (!parsed.success) {
    return false;
  }
  const text = [
    parsed.data.title ?? '',
    parsed.data.detail ?? '',
    ...(parsed.data.errors ?? []).map((entry) => `${entry.title ?? ''} ${entry.detail ?? ''}`),
  ]
    .join(' ')
    .toLowerCase();
  return text.includes('duplicate');
}

export interface XConnector extends SocialConnector {
  /** The metered cost of publishing this draft, exact to a millionth of a dollar. */
  estimateCost(draft: ProviderDraft): XCostEstimate;
}

export function createXConnector(deps: ConnectorDeps): XConnector {
  const { http, vault, clock, config, logger } = deps;

  async function token(connection: ProviderConnection): Promise<string> {
    return vault.getAccessToken(connection.credentialRef);
  }

  function bearer(accessToken: string): Record<string, string> {
    return { authorization: `Bearer ${accessToken}` };
  }

  function nowIso(): string {
    return clock.now().toISOString();
  }

  async function createPost(
    accessToken: string,
    payload: Record<string, unknown>,
    operation: string,
  ): Promise<string> {
    const response = await http.request({
      method: 'POST',
      url: `${API_BASE}/tweets`,
      headers: bearer(accessToken),
      json: payload,
      accept: 'json',
      provider: PROVIDER,
      operation,
    });
    if (!response.ok) {
      if (isDuplicateRejection(response.body)) {
        throw new ContentInvalidError({
          messageKey: 'connectors.x.duplicate_content',
          details: { provider: PROVIDER, operation, remediationKey: REMEDIATION.duplicateContent },
        });
      }
      throw providerFailure({ provider: PROVIDER, operation, response });
    }
    const parsed = parseProviderBody(xCreatePostResponseSchema, response, {
      provider: PROVIDER,
      operation,
      response,
    });
    // Published means an external post id. Nothing else counts.
    return parsed.data.id;
  }

  /**
   * Look for a post we may already have created. X has no idempotency token, so this is
   * the guard that makes a retry safe. It is mandatory before repeating a create.
   */
  async function findRecentMatchingPost(
    connection: ProviderConnection,
    accessToken: string,
    body: string,
  ): Promise<string | null> {
    const since = new Date(clock.now().getTime() - DUPLICATE_LOOKBACK_MINUTES * 60_000);
    const response = await http.request({
      method: 'GET',
      url: `${API_BASE}/users/${connection.externalAccountId}/tweets`,
      headers: bearer(accessToken),
      query: {
        max_results: 20,
        start_time: since.toISOString(),
        'tweet.fields': X_POST_FIELDS,
      },
      accept: 'json',
      provider: PROVIDER,
      operation: 'x.duplicate_preflight',
    });
    if (!response.ok) {
      // We could not prove the post is absent, so we must not create it again.
      throw providerFailure({
        provider: PROVIDER,
        operation: 'x.duplicate_preflight',
        response,
        remediationKey: REMEDIATION.contactSupport,
      });
    }
    const parsed = parseProviderBody(xTimelineResponseSchema, response, {
      provider: PROVIDER,
      operation: 'x.duplicate_preflight',
      response,
    });
    const target = normalizeForSimilarity(body);
    const match = (parsed.data ?? []).find(
      (post) => normalizeForSimilarity(post.text ?? '') === target,
    );
    return match === undefined ? null : match.id;
  }

  async function uploadOne(
    connection: ProviderConnection,
    accessToken: string,
    media: ProviderMedia,
  ): Promise<PreparedMedia> {
    const category =
      media.kind === 'video' ? 'tweet_video' : media.kind === 'gif' ? 'tweet_gif' : 'tweet_image';

    const initialize = await http.request({
      method: 'POST',
      url: `${API_BASE}/media/upload/initialize`,
      headers: bearer(accessToken),
      json: {
        media_type: media.mimeType,
        total_bytes: media.byteSize,
        media_category: category,
      },
      accept: 'json',
      provider: PROVIDER,
      operation: 'x.media.initialize',
    });
    ensureOk(initialize, {
      provider: PROVIDER,
      operation: 'x.media.initialize',
      response: initialize,
      remediationKey: REMEDIATION.mediaInvalid,
    });
    const initialized = parseProviderBody(xMediaUploadResponseSchema, initialize, {
      provider: PROVIDER,
      operation: 'x.media.initialize',
      response: initialize,
    });
    const mediaId = initialized.data.id;

    const download = await http.request({
      method: 'GET',
      url: media.downloadUrl,
      accept: 'binary',
      provider: PROVIDER,
      operation: 'x.media.fetch_source',
    });
    ensureOk(download, {
      provider: PROVIDER,
      operation: 'x.media.fetch_source',
      response: download,
    });
    const bytes = download.bytes;

    for (let offset = 0, segment = 0; offset < bytes.byteLength; offset += MEDIA_CHUNK_BYTES) {
      const chunk = bytes.subarray(offset, Math.min(offset + MEDIA_CHUNK_BYTES, bytes.byteLength));
      const append = await http.request({
        method: 'POST',
        url: `${API_BASE}/media/upload/${mediaId}/append`,
        headers: {
          ...bearer(accessToken),
          'content-type': 'application/octet-stream',
          'x-segment-index': String(segment),
        },
        query: { segment_index: segment },
        body: chunk,
        accept: 'none',
        provider: PROVIDER,
        operation: 'x.media.append',
      });
      ensureOk(append, {
        provider: PROVIDER,
        operation: 'x.media.append',
        response: append,
        remediationKey: REMEDIATION.mediaInvalid,
      });
      segment += 1;
    }

    const finalize = await http.request({
      method: 'POST',
      url: `${API_BASE}/media/upload/${mediaId}/finalize`,
      headers: bearer(accessToken),
      accept: 'json',
      provider: PROVIDER,
      operation: 'x.media.finalize',
    });
    ensureOk(finalize, {
      provider: PROVIDER,
      operation: 'x.media.finalize',
      response: finalize,
      remediationKey: REMEDIATION.mediaInvalid,
    });
    const finalized = parseProviderBody(xMediaUploadResponseSchema, finalize, {
      provider: PROVIDER,
      operation: 'x.media.finalize',
      response: finalize,
    });
    const processing = finalized.data.processing_info;

    if (media.altText !== null && media.altText !== '') {
      const metadata = await http.request({
        method: 'POST',
        url: `${API_BASE}/media/metadata`,
        headers: bearer(accessToken),
        json: { id: mediaId, metadata: { alt_text: { text: media.altText } } },
        accept: 'json',
        provider: PROVIDER,
        operation: 'x.media.metadata',
      });
      ensureOk(metadata, {
        provider: PROVIDER,
        operation: 'x.media.metadata',
        response: metadata,
      });
    }

    return {
      mediaId: media.mediaId,
      providerMediaId: mediaId,
      providerContainerId: null,
      uploadUrl: null,
      state:
        processing === undefined || processing.state === 'succeeded'
          ? 'ready'
          : processing.state === 'failed'
            ? 'failed'
            : 'processing',
      checksum: media.sha256,
      variant: `x:${category}`,
      metadata: { mediaCategory: category, connectionId: connection.connectionId },
    };
  }

  function providerMediaIds(request: PublishRequest): string[] {
    return request.preparedMedia
      .map((prepared) => prepared.providerMediaId)
      .filter((value): value is string => value !== null);
  }

  return {
    identity(): ProviderIdentity {
      return {
        provider: PROVIDER,
        displayName: 'X',
        iconToken: 'provider.x',
        accountTypes: ['personal_profile', 'creator_profile'],
        docsUrl: 'https://docs.x.com/x-api',
        policyUrl: 'https://developer.x.com/en/developer-terms/policy',
        engineeringOwner: 'Backend/Connectors 1',
        policyOwner: 'Policy Owner',
        lastPolicyReviewAt: SOURCE_VERIFIED_ON,
        contractVersion: CONNECTOR_CONTRACT_VERSION,
      };
    },

    authorization(): AuthorizationDefinition {
      return {
        flavor: 'oauth2_pkce',
        authorizeUrl: AUTHORIZE_URL,
        tokenUrl: TOKEN_URL,
        revokeUrl: REVOKE_URL,
        requiresPkce: true,
        multiStep: false,
        redirectPath: '/oauth/x/callback',
        scopes: [
          { scope: 'tweet.read', descriptionKey: 'connectors.x.scope.tweet_read' },
          { scope: 'tweet.write', descriptionKey: 'connectors.x.scope.tweet_write' },
          { scope: 'users.read', descriptionKey: 'connectors.x.scope.users_read' },
          { scope: 'media.write', descriptionKey: 'connectors.x.scope.media_write' },
          { scope: 'offline.access', descriptionKey: 'connectors.x.scope.offline_access' },
        ],
        notesKey: 'connectors.x.authorization_note',
      };
    },

    async discoverAccounts(grant: OAuthGrant): Promise<ExternalAccount[]> {
      const response = await http.request({
        method: 'GET',
        url: `${API_BASE}/users/me`,
        headers: bearer(grant.accessToken),
        query: { 'user.fields': X_USER_FIELDS },
        accept: 'json',
        provider: PROVIDER,
        operation: 'x.discover_accounts',
      });
      ensureOk(response, {
        provider: PROVIDER,
        operation: 'x.discover_accounts',
        response,
        remediationKey: REMEDIATION.reconnectAccount,
      });
      const parsed = parseProviderBody(xUserResponseSchema, response, {
        provider: PROVIDER,
        operation: 'x.discover_accounts',
        response,
      });
      const user = parsed.data;
      return [
        {
          externalId: user.id,
          accountType: 'personal_profile',
          displayName: user.name,
          handle: user.username,
          avatarUrl: user.profile_image_url ?? null,
          parentExternalId: null,
          connectable: grant.scopes.includes('tweet.write'),
          blockedReasonKey: grant.scopes.includes('tweet.write')
            ? null
            : 'connectors.x.write_scope_missing',
          scopes: [...grant.scopes],
          metadata: { username: user.username, protected: user.protected ?? false },
        },
      ];
    },

    async listDestinations(_input: DestinationRequest): Promise<ProviderDestination[]> {
      // X communities exist, but availability at our access tier is unconfirmed
      // (open decision 1, docs/planning/05-social-connectors.md section 9). The method is
      // present and throws so the capability page renders `not_implemented` rather than
      // implying the provider does not offer communities at all.
      throw new CapabilityNotImplementedError({
        messageKey: 'connectors.x.communities_not_implemented',
        details: { provider: PROVIDER, capability: 'destinations' },
      });
    },

    async searchMentions(input: MentionSearchRequest): Promise<MentionEntity[]> {
      const accessToken = await token(input.connection);
      const handle = input.query.replace(/^@/u, '').trim();
      if (handle === '' || !/^[A-Za-z0-9_]{1,15}$/u.test(handle)) {
        return [];
      }
      const response = await http.request({
        method: 'GET',
        url: `${API_BASE}/users/by`,
        headers: bearer(accessToken),
        query: { usernames: handle, 'user.fields': X_USER_FIELDS },
        accept: 'json',
        provider: PROVIDER,
        operation: 'x.search_mentions',
      });
      if (!response.ok) {
        // A failed suggestion lookup is never a publish blocker.
        logger.warn(
          { provider: PROVIDER, status: response.status },
          'x mention lookup unavailable',
        );
        return [];
      }
      const parsed = parseProviderBody(xUserSearchResponseSchema, response, {
        provider: PROVIDER,
        operation: 'x.search_mentions',
        response,
      });
      return (parsed.data ?? []).map((user) => ({
        externalId: user.id,
        displayLabel: user.name,
        handle: user.username,
        kind: 'person' as const,
        avatarUrl: user.profile_image_url ?? null,
        // X resolves the handle when it renders the post. The entity id is not stored in
        // the post, so the composer must show this as plain text, not a native tag.
        resolved: false,
      }));
    },

    async getCapabilities(connection: ProviderConnection) {
      return buildXCapabilities({
        connection,
        observedAt: nowIso(),
        grantedScopes: connection.scopes,
      });
    },

    async validateDraft(draft: ProviderDraft): Promise<ValidationResult> {
      const snapshot = draft.capabilities;
      const targetId = draft.connection.connectionId;
      const issues: ValidationIssue[] = [
        ...validateDraftShape(draft, snapshot, { unit: 'weighted', allowMixedMedia: false }),
      ];

      const options = xProviderOptionsSchema.parse(draft.providerOptions);

      // An animated GIF is the only media a post may carry.
      const gifCount = draft.media.filter((item) => item.kind === 'gif').length;
      if (gifCount > 0 && draft.media.length > 1) {
        issues.push(
          validationIssue({
            code: 'GIF_MUST_BE_ONLY_MEDIA',
            severity: 'error',
            field: 'media',
            targetId,
            remediationKey: REMEDIATION.mediaInvalid,
            params: { provider: PROVIDER },
          }),
        );
      }

      if (options.communityId !== undefined) {
        issues.push(
          validationIssue({
            code: 'DESTINATION_NOT_IMPLEMENTED',
            severity: 'error',
            field: 'destination',
            targetId,
            params: { provider: PROVIDER },
          }),
        );
      }

      const cost = estimateCost(draft);
      if (isLinkHeavy(cost)) {
        issues.push(
          validationIssue({
            code: 'X_LINK_HEAVY_CAMPAIGN',
            severity: 'warning',
            field: 'body',
            targetId,
            remediationKey: REMEDIATION.usageBalanceRequired,
            params: {
              provider: PROVIDER,
              urlOperationCount: cost.urlOperationCount,
              estimatedMinor: cost.minorUnits,
              currency: cost.currency,
            },
          }),
        );
      }

      return validationResult({
        issues,
        estimatedCostMinor: cost.minorUnits,
        currency: cost.currency,
      });
    },

    estimateCost(draft: ProviderDraft): XCostEstimate {
      return estimateCost(draft);
    },

    async prepareMedia(input: MediaPreparationRequest): Promise<PreparedMedia[]> {
      const accessToken = await token(input.connection);
      const prepared: PreparedMedia[] = [];
      for (const media of input.media) {
        prepared.push(await uploadOne(input.connection, accessToken, media));
      }
      return prepared;
    },

    async preview(draft: ProviderDraft): Promise<CanonicalPreview> {
      return buildPreview(draft, draft.capabilities, {
        unit: 'weighted',
        mediaLayout: draft.media.some((item) => item.kind === 'video') ? 'video' : 'grid',
        linkRendering: 'card',
        resolvesMentionsAtRender: true,
        privacyLabelKey: null,
        warningKeys: isLinkHeavy(estimateCost(draft)) ? ['connectors.x.link_heavy'] : [],
      });
    },

    async publish(request: PublishRequest): Promise<PublishResult> {
      const { connection, draft } = request;
      const accessToken = await token(connection);
      const resume = readResume(request.resume);
      const mediaIds = providerMediaIds(request);
      const cost = estimateCost(draft);

      let rootId = resume.rootExternalPostId ?? null;
      if (rootId === null && resume.attempted === true) {
        // A previous attempt may have created the post before we lost the response.
        rootId = await findRecentMatchingPost(connection, accessToken, draft.body);
      }
      if (rootId === null) {
        rootId = await createPost(
          accessToken,
          {
            text: draft.body,
            ...(mediaIds.length > 0 ? { media: { media_ids: mediaIds } } : {}),
          },
          'x.create_root',
        );
      }

      const root: PublishItemResult = {
        kind: 'root',
        order: 0,
        threadItemId: null,
        state: 'published',
        externalPostId: rootId,
        permalink: permalink(connection, rootId),
        errorClass: null,
        errorCode: null,
        remediationKey: null,
      };

      const publishedOrders = new Set(resume.publishedOrders ?? []);
      const dueOrders = resume.dueOrders;
      const items: PublishItemResult[] = [];
      let previousId = resume.lastExternalPostId ?? rootId;
      let pending = false;
      let failed = false;

      for (const item of [...draft.threadItems].sort((left, right) => left.order - right.order)) {
        if (publishedOrders.has(item.order)) {
          continue;
        }
        const isDue =
          dueOrders === undefined ? item.delaySeconds === 0 : dueOrders.includes(item.order);
        if (!isDue || failed) {
          // A delayed part is the worker's to schedule. The connector never sleeps.
          pending = true;
          items.push({
            kind: item.kind,
            order: item.order,
            threadItemId: item.id,
            state: 'processing',
            externalPostId: null,
            permalink: null,
            errorClass: null,
            errorCode: null,
            remediationKey: null,
          });
          continue;
        }
        try {
          const itemId = await createPost(
            accessToken,
            {
              text: item.body,
              reply: { in_reply_to_tweet_id: previousId },
            },
            `x.create_${item.kind}`,
          );
          previousId = itemId;
          publishedOrders.add(item.order);
          items.push({
            kind: item.kind,
            order: item.order,
            threadItemId: item.id,
            state: 'published',
            externalPostId: itemId,
            permalink: permalink(connection, itemId),
            errorClass: null,
            errorCode: null,
            remediationKey: null,
          });
        } catch (error) {
          // A failed part never invalidates a root post that already exists externally.
          failed = true;
          items.push({
            kind: item.kind,
            order: item.order,
            threadItemId: item.id,
            state: 'failed',
            externalPostId: null,
            permalink: null,
            errorClass: null,
            errorCode: RelayError.is(error) ? error.code : null,
            remediationKey: REMEDIATION.commentFailedRootPublished,
          });
        }
      }

      const state: PublishResult['state'] = failed
        ? 'partially_published'
        : pending
          ? 'processing'
          : 'published';

      return {
        state,
        externalPostId: rootId,
        permalink: permalink(connection, rootId),
        root,
        items,
        pollToken: rootId,
        resume: {
          rootExternalPostId: rootId,
          lastExternalPostId: previousId,
          publishedOrders: [...publishedOrders],
          attempted: true,
        },
        sanitizedProviderResponse: { rootExternalPostId: rootId, itemCount: items.length },
        costMinor: cost.minorUnits,
        currency: cost.currency,
      };
    },

    async getStatus(input: StatusRequest): Promise<PublishStatus> {
      const accessToken = await token(input.connection);
      const response = await http.request({
        method: 'GET',
        url: `${API_BASE}/tweets/${input.pollToken}`,
        headers: bearer(accessToken),
        query: { 'tweet.fields': X_POST_FIELDS },
        accept: 'json',
        provider: PROVIDER,
        operation: 'x.get_status',
      });
      if (response.status === 404) {
        return {
          state: 'failed',
          externalPostId: null,
          permalink: null,
          errorClass: 'PERMANENT_PROVIDER',
          remediationKey: REMEDIATION.providerRejectedContent,
          sanitizedProviderResponse: { status: response.status },
        };
      }
      if (!response.ok) {
        return {
          state: 'unknown',
          externalPostId: null,
          permalink: null,
          errorClass: null,
          remediationKey: null,
          sanitizedProviderResponse: { status: response.status },
        };
      }
      const parsed = parseProviderBody(xPostLookupResponseSchema, response, {
        provider: PROVIDER,
        operation: 'x.get_status',
        response,
      });
      if (parsed.data === undefined) {
        return {
          state: 'unknown',
          externalPostId: null,
          permalink: null,
          errorClass: null,
          remediationKey: null,
          sanitizedProviderResponse: { status: response.status },
        };
      }
      return {
        state: 'published',
        externalPostId: parsed.data.id,
        permalink: permalink(input.connection, parsed.data.id),
        errorClass: null,
        remediationKey: null,
        sanitizedProviderResponse: { status: response.status, externalPostId: parsed.data.id },
      };
    },

    async deletePost(input: DeleteRequest): Promise<void> {
      const accessToken = await token(input.connection);
      const response = await http.request({
        method: 'DELETE',
        url: `${API_BASE}/tweets/${input.externalPostId}`,
        headers: bearer(accessToken),
        accept: 'json',
        provider: PROVIDER,
        operation: 'x.delete_post',
      });
      ensureOk(response, { provider: PROVIDER, operation: 'x.delete_post', response });
      parseProviderBody(xDeleteResponseSchema, response, {
        provider: PROVIDER,
        operation: 'x.delete_post',
        response,
      });
    },

    async fetchMetrics(input: MetricsRequest): Promise<MetricObservation[]> {
      const accessToken = await token(input.connection);
      const observedAt = nowIso();

      if (input.scope === 'account') {
        const response = await http.request({
          method: 'GET',
          url: `${API_BASE}/users/${input.connection.externalAccountId}`,
          headers: bearer(accessToken),
          query: { 'user.fields': X_USER_FIELDS },
          accept: 'json',
          provider: PROVIDER,
          operation: 'x.account_metrics',
        });
        if (!response.ok) {
          return mapMetrics({
            provider: PROVIDER,
            scope: 'account',
            mappings: X_ACCOUNT_METRICS,
            values: {},
            observedAt,
            rawPayload: { status: response.status },
            missingAvailability:
              response.status === 401 || response.status === 403
                ? 'unavailable_permission'
                : 'unavailable_provider',
          });
        }
        const parsed = parseProviderBody(xUserResponseSchema, response, {
          provider: PROVIDER,
          operation: 'x.account_metrics',
          response,
        });
        return mapMetrics({
          provider: PROVIDER,
          scope: 'account',
          mappings: X_ACCOUNT_METRICS,
          values: { ...(parsed.data.public_metrics ?? {}) },
          observedAt,
          rawPayload: parsed.data.public_metrics ?? {},
        });
      }

      const externalPostId = input.externalPostId;
      if (externalPostId === undefined) {
        return mapMetrics({
          provider: PROVIDER,
          scope: 'post',
          mappings: X_POST_METRICS,
          values: {},
          observedAt,
          rawPayload: {},
          missingAvailability: 'unavailable_pending',
        });
      }
      const response = await http.request({
        method: 'GET',
        url: `${API_BASE}/tweets/${externalPostId}`,
        headers: bearer(accessToken),
        query: { 'tweet.fields': X_POST_FIELDS },
        accept: 'json',
        provider: PROVIDER,
        operation: 'x.post_metrics',
      });
      if (!response.ok) {
        return mapMetrics({
          provider: PROVIDER,
          scope: 'post',
          mappings: X_POST_METRICS,
          values: {},
          observedAt,
          rawPayload: { status: response.status },
          missingAvailability:
            response.status === 401 || response.status === 403
              ? 'unavailable_permission'
              : 'unavailable_provider',
        });
      }
      const parsed = parseProviderBody(xPostLookupResponseSchema, response, {
        provider: PROVIDER,
        operation: 'x.post_metrics',
        response,
      });
      const post = parsed.data;
      return mapMetrics({
        provider: PROVIDER,
        scope: 'post',
        mappings: X_POST_METRICS,
        values: { ...(post?.public_metrics ?? {}), ...(post?.non_public_metrics ?? {}) },
        observedAt,
        rawPayload: { public: post?.public_metrics ?? {}, nonPublic: post?.non_public_metrics ?? {} },
      });
    },

    async refreshCredential(input: RefreshRequest): Promise<CredentialResult> {
      const clientId = config.providers.x.clientId;
      if (clientId === undefined) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'x.refresh_credential',
          remediationKey: REMEDIATION.contactSupport,
          details: { missingConfig: 'X_CLIENT_ID' },
        });
      }
      return refreshOAuth2Token({
        http,
        clock,
        provider: PROVIDER,
        tokenUrl: TOKEN_URL,
        clientId,
        ...(config.providers.x.clientSecret === undefined
          ? {}
          : { clientSecret: config.providers.x.clientSecret }),
        refreshToken: input.refreshToken,
        basicAuth: true,
      });
    },

    async revoke(input: RevokeRequest): Promise<void> {
      const clientId = config.providers.x.clientId;
      if (clientId === undefined) {
        return;
      }
      const accessToken = await token(input.connection);
      const response = await http.request({
        method: 'POST',
        url: REVOKE_URL,
        form: { token: accessToken, client_id: clientId, token_type_hint: 'access_token' },
        accept: 'json',
        provider: PROVIDER,
        operation: 'x.revoke',
      });
      if (!response.ok) {
        // We delete our stored credential regardless. A provider revoke failure must never
        // leave us holding a token we told the user we deleted.
        logger.warn({ provider: PROVIDER, status: response.status }, 'x revoke did not succeed');
      }
    },
  };
}

export const X_REQUESTED_SCOPES = X_SCOPES;
