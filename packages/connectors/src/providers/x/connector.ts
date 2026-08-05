import {
  CapabilityNotImplementedError,
  ContentInvalidError,
  RelayError,
  validationIssue,
  validationResult,
  type CapabilitySnapshot,
  type MetricObservation,
  type ValidationIssue,
  type ValidationResult,
} from '@relay/contracts';

import {
  NOT_IMPLEMENTED_FEATURES,
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
  type FailedItem,
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
import {
  accessTokenOf,
  bearerHeader,
  connectionMetadataString,
  errorSummary,
  providerOptionsOf,
} from '../shared/access.js';
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
 *    create we query the account's recent posts for a matching post inside the dispatch
 *    window and adopt it rather than creating a second one. A duplicate is both a policy
 *    violation and a billing event.
 */

const PROVIDER = 'x' as const;
const API_BASE = 'https://api.x.com/2';
const AUTHORIZE_URL = 'https://x.com/i/oauth2/authorize';
const TOKEN_URL = 'https://api.x.com/2/oauth2/token';
const REVOKE_URL = 'https://api.x.com/2/oauth2/revoke';
const MEDIA_CHUNK_BYTES = 4 * 1024 * 1024;
const DUPLICATE_LOOKBACK_MINUTES = 30;

function handleOf(connection: ProviderConnection): string | null {
  return (
    connectionMetadataString(connection, 'username') ??
    connectionMetadataString(connection, 'handle')
  );
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
  const { http, clock, config, logger } = deps;

  function bearer(accessToken: string): Record<string, string> {
    return bearerHeader(accessToken);
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
          details: { provider: PROVIDER, operation, remediationCode: REMEDIATION.duplicateContent },
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
   * the guard that makes a create safe to repeat. It runs before every create, because
   * `PublishRequest` carries no attempt counter that would let us tell a first attempt
   * from a retry after a lost response.
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
        remediationCode: REMEDIATION.contactSupport,
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

  async function uploadOne(accessToken: string, media: ProviderMedia): Promise<PreparedMedia> {
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
      remediationCode: REMEDIATION.mediaInvalid,
    });
    const initialized = parseProviderBody(xMediaUploadResponseSchema, initialize, {
      provider: PROVIDER,
      operation: 'x.media.initialize',
      response: initialize,
    });
    const mediaId = initialized.data.id;

    if (media.sourceUrl === null) {
      // Without the short lived signed URL there are no bytes to send, and a media id
      // with no bytes would publish as a broken attachment.
      throw providerFailure({
        provider: PROVIDER,
        operation: 'x.media.fetch_source',
        remediationCode: REMEDIATION.mediaInvalid,
        details: { mediaId: media.mediaId, reason: 'MEDIA_SOURCE_URL_MISSING' },
      });
    }
    const download = await http.request({
      method: 'GET',
      url: media.sourceUrl,
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
        remediationCode: REMEDIATION.mediaInvalid,
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
      remediationCode: REMEDIATION.mediaInvalid,
    });
    const finalized = parseProviderBody(xMediaUploadResponseSchema, finalize, {
      provider: PROVIDER,
      operation: 'x.media.finalize',
      response: finalize,
    });
    const processing = finalized.data.processing_info;

    const altTextApplied = media.altText !== null && media.altText !== '';
    if (altTextApplied) {
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
      derivativeId: media.derivativeId,
      providerMediaId: mediaId,
      // X has no container step: the media id is the whole story.
      containerId: null,
      uploadState:
        processing === undefined || processing.state === 'succeeded'
          ? 'ready'
          : processing.state === 'failed'
            ? 'failed'
            : 'processing',
      derivativeChecksum: media.checksum,
      byteSize: media.byteSize,
      altTextApplied,
      publicUrl: null,
      expiresAt: null,
      reusedFromPreviousAttempt: false,
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
        contractVersion: CONNECTOR_CONTRACT_VERSION,
        connectorVersion: '1.0.0',
        label: 'beta',
        limitationKey: 'connectors.x.review_pending',
        officialDocsUrl: 'https://docs.x.com/x-api',
        officialPolicyUrl: 'https://developer.x.com/en/developer-terms/policy',
        engineeringOwner: 'Backend/Connectors 1',
        policyOwner: 'Policy Owner',
        lastPolicyReviewAt: `${SOURCE_VERIFIED_ON}T00:00:00.000Z`,
        nextPolicyReviewAt: '2027-02-04T00:00:00.000Z',
        features: {
          ...NOT_IMPLEMENTED_FEATURES,
          discover_accounts: 'supported',
          // Communities exist; availability at our access tier is unconfirmed.
          list_destinations: 'not_implemented',
          search_mentions: 'supported',
          // X resolves `@handle` at render time, so there is no entity to store.
          native_mentions: 'unsupported',
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
          comment_replies: 'not_implemented',
          // X offers no idempotency token for a post create.
          provider_idempotency: 'unsupported',
          post_analytics: 'supported',
          account_analytics: 'supported',
          privacy_controls: 'unsupported',
          ai_disclosure: 'not_implemented',
          commercial_disclosure: 'unsupported',
          alt_text: 'supported',
          carousel: 'unsupported',
          video: 'supported',
          document: 'unsupported',
          metered_cost: 'supported',
        },
      };
    },

    authorization(): AuthorizationDefinition {
      return {
        flavor: 'oauth2_pkce',
        authorizeUrl: AUTHORIZE_URL,
        tokenUrl: TOKEN_URL,
        revokeUrl: REVOKE_URL,
        redirectPath: '/oauth/x/callback',
        scopes: [
          {
            scope: 'tweet.read',
            explanationKey: 'connectors.x.scope.tweet_read',
            usedBy: ['composer', 'analytics'],
            required: true,
          },
          {
            scope: 'tweet.write',
            explanationKey: 'connectors.x.scope.tweet_write',
            usedBy: ['composer', 'queue'],
            required: true,
          },
          {
            scope: 'users.read',
            explanationKey: 'connectors.x.scope.users_read',
            usedBy: ['connections', 'composer'],
            required: true,
          },
          {
            scope: 'media.write',
            explanationKey: 'connectors.x.scope.media_write',
            usedBy: ['composer'],
            required: false,
          },
          {
            scope: 'offline.access',
            explanationKey: 'connectors.x.scope.offline_access',
            usedBy: ['queue'],
            required: true,
          },
        ],
        pkceRequired: true,
        multiStep: false,
        stepDescriptionKeys: [],
        supportsRefresh: true,
        refreshAtLifetimeFraction: 0.75,
        extraAuthorizeParameters: {},
      };
    },

    async discoverAccounts(grant: OAuthGrant): Promise<ExternalAccount[]> {
      const response = await http.request({
        method: 'GET',
        url: `${API_BASE}/users/me`,
        auth: { handle: grant.accessToken },
        query: { 'user.fields': X_USER_FIELDS },
        accept: 'json',
        provider: PROVIDER,
        operation: 'x.discover_accounts',
      });
      ensureOk(response, {
        provider: PROVIDER,
        operation: 'x.discover_accounts',
        response,
        remediationCode: REMEDIATION.reconnectAccount,
      });
      const parsed = parseProviderBody(xUserResponseSchema, response, {
        provider: PROVIDER,
        operation: 'x.discover_accounts',
        response,
      });
      const user = parsed.data;
      const canWrite = grant.grantedScopes.includes('tweet.write');
      return [
        {
          externalAccountId: user.id,
          accountType: 'personal_profile',
          displayName: user.name,
          handle: user.username,
          avatarUrl: user.profile_image_url ?? null,
          profileUrl: `https://x.com/${user.username}`,
          parentExternalId: null,
          grantedScopes: [...grant.grantedScopes],
          eligible: canWrite,
          ineligibleReasonKey: canWrite ? null : 'connectors.x.write_scope_missing',
          // X issues no per account credential: the user token is the account token.
          accountAccessToken: null,
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
      const accessToken = await accessTokenOf(input.connection);
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
      const resolvedAt = nowIso();
      return (parsed.data ?? []).slice(0, input.limit).map((user) => ({
        externalId: user.id,
        displayLabel: user.name,
        handle: user.username,
        kind: 'person' as const,
        avatarUrl: user.profile_image_url ?? null,
        // X resolves the handle when it renders the post. The entity id is not stored in
        // the post, so the composer must show this as plain text, not a native tag.
        resolvedToExternalId: false,
        resolvedAt,
      }));
    },

    async getCapabilities(connection: ProviderConnection): Promise<CapabilitySnapshot> {
      return await Promise.resolve(
        buildXCapabilities({
          connection,
          observedAt: nowIso(),
          grantedScopes: connection.grantedScopes,
        }),
      );
    },

    async validateDraft(draft: ProviderDraft): Promise<ValidationResult> {
      const snapshot = draft.capabilities;
      const targetId = draft.connection.connectionId;
      const issues: ValidationIssue[] = [
        ...validateDraftShape(draft, snapshot, { unit: 'weighted', allowMixedMedia: false }),
      ];

      const options = xProviderOptionsSchema.parse(providerOptionsOf(draft));

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

      return await Promise.resolve(
        validationResult({
          issues,
          estimatedCostMinor: cost.minorUnits,
          currency: cost.currency,
        }),
      );
    },

    estimateCost(draft: ProviderDraft): XCostEstimate {
      return estimateCost(draft);
    },

    async prepareMedia(input: MediaPreparationRequest): Promise<PreparedMedia[]> {
      const accessToken = await accessTokenOf(input.connection);
      const prepared: PreparedMedia[] = [];
      for (const media of input.media) {
        prepared.push(await uploadOne(accessToken, media));
      }
      return prepared;
    },

    async preview(draft: ProviderDraft): Promise<CanonicalPreview> {
      return await Promise.resolve(
        buildPreview(draft, draft.capabilities, {
          unit: 'weighted',
          mediaLayout: draft.media.some((item) => item.kind === 'video') ? 'video' : 'grid',
          linkRendering: 'card',
          resolvesMentionsAtRender: true,
          privacyLabelKey: null,
          warningKeys: isLinkHeavy(estimateCost(draft)) ? ['connectors.x.link_heavy'] : [],
        }),
      );
    },

    async publish(request: PublishRequest): Promise<PublishResult> {
      const draft = request.draft;
      const connection = draft.connection;
      const accessToken = await accessTokenOf(connection);
      const mediaIds = providerMediaIds(request);
      const cost = estimateCost(draft);

      // Mandatory before any create: X has no idempotency token, so the only way to
      // avoid a duplicate post and a duplicate charge is to look for one first.
      let rootId = await findRecentMatchingPost(connection, accessToken, draft.body);
      const adopted = rootId !== null;
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

      const publishedAt = nowIso();
      const root: PublishItemResult = {
        kind: 'root',
        order: 0,
        threadItemId: null,
        externalPostId: rootId,
        permalink: permalink(connection, rootId),
        publishedAt,
      };

      const items: PublishItemResult[] = [root];
      const failures: FailedItem[] = [];
      let previousId = rootId;
      let failed = false;

      // The connector never sleeps and never schedules. Every part handed to it is
      // published now, in order; the worker decides which parts to hand over and when.
      for (const item of [...draft.threadItems].sort((left, right) => left.order - right.order)) {
        if (failed) {
          // Once a part fails the chain is broken, so the rest are reported as failed
          // rather than silently attached to the wrong parent.
          failures.push({
            kind: item.kind,
            order: item.order,
            threadItemId: item.threadItemId,
            error: errorSummary({
              errorClass: 'TRANSIENT_PROVIDER',
              remediationCode: REMEDIATION.commentFailedRootPublished,
              messageKey: 'state.partially_published.label',
              retryable: true,
            }),
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
          items.push({
            kind: item.kind,
            order: item.order,
            threadItemId: item.threadItemId,
            externalPostId: itemId,
            permalink: permalink(connection, itemId),
            publishedAt,
          });
        } catch (error) {
          // A failed part never invalidates a root post that already exists externally.
          failed = true;
          failures.push({
            kind: item.kind,
            order: item.order,
            threadItemId: item.threadItemId,
            error: errorSummary({
              errorClass: 'TRANSIENT_PROVIDER',
              remediationCode: REMEDIATION.commentFailedRootPublished,
              messageKey: 'state.partially_published.label',
              retryable: true,
              providerMessage: RelayError.is(error) ? error.code : null,
            }),
          });
        }
      }

      const sanitizedResponse = {
        rootExternalPostId: rootId,
        itemCount: items.length,
        adoptedExistingPost: adopted,
      };

      if (failures.length > 0) {
        return {
          status: 'partial',
          externalPostId: rootId,
          permalink: permalink(connection, rootId),
          publishedAt,
          items,
          failures,
          sanitizedResponse,
          providerRequestId: null,
          costMinor: cost.minorUnits,
          currency: cost.currency,
        };
      }

      return {
        status: 'published',
        externalPostId: rootId,
        permalink: permalink(connection, rootId),
        publishedAt,
        items,
        sanitizedResponse,
        providerRequestId: null,
        costMinor: cost.minorUnits,
        currency: cost.currency,
      };
    },

    async getStatus(input: StatusRequest): Promise<PublishStatus> {
      const externalPostId = input.externalPostId ?? input.providerJobId;
      if (externalPostId === null) {
        // X creates directly, so with no post id there is nothing to poll and we refuse
        // to guess. `unknown` is the honest answer.
        return {
          state: 'unknown',
          externalPostId: null,
          permalink: null,
          publishedAt: null,
          items: [],
          error: null,
          pollAfterSeconds: null,
          sanitizedResponse: { reason: 'no_post_id_to_poll' },
        };
      }
      const accessToken = await accessTokenOf(input.connection);
      const response = await http.request({
        method: 'GET',
        url: `${API_BASE}/tweets/${externalPostId}`,
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
          publishedAt: null,
          items: [],
          error: errorSummary({
            errorClass: 'PERMANENT_PROVIDER',
            remediationCode: REMEDIATION.providerRejectedContent,
            messageKey: 'error.provider_content_rejected.message',
            retryable: false,
          }),
          pollAfterSeconds: null,
          sanitizedResponse: { status: response.status },
        };
      }
      if (!response.ok) {
        return {
          state: 'unknown',
          externalPostId: null,
          permalink: null,
          publishedAt: null,
          items: [],
          error: null,
          pollAfterSeconds: null,
          sanitizedResponse: { status: response.status },
        };
      }
      const parsed = parseProviderBody(xPostLookupResponseSchema, response, {
        provider: PROVIDER,
        operation: 'x.get_status',
        response,
      });
      const post = parsed.data;
      if (post === undefined) {
        return {
          state: 'unknown',
          externalPostId: null,
          permalink: null,
          publishedAt: null,
          items: [],
          error: null,
          pollAfterSeconds: null,
          sanitizedResponse: { status: response.status },
        };
      }
      const publishedAt = post.created_at ?? nowIso();
      return {
        state: 'published',
        externalPostId: post.id,
        permalink: permalink(input.connection, post.id),
        publishedAt,
        items: [
          {
            kind: 'root',
            order: 0,
            threadItemId: null,
            externalPostId: post.id,
            permalink: permalink(input.connection, post.id),
            publishedAt,
          },
        ],
        error: null,
        pollAfterSeconds: null,
        sanitizedResponse: { status: response.status, externalPostId: post.id },
      };
    },

    async deletePost(input: DeleteRequest): Promise<void> {
      const accessToken = await accessTokenOf(input.connection);
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
      const accessToken = await accessTokenOf(input.connection);
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
      if (externalPostId === null) {
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
        rawPayload: {
          public: post?.public_metrics ?? {},
          nonPublic: post?.non_public_metrics ?? {},
        },
      });
    },

    async refreshCredential(input: RefreshRequest): Promise<CredentialResult> {
      const clientId = config.providers.x.clientId;
      if (clientId === undefined) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'x.refresh_credential',
          remediationCode: REMEDIATION.contactSupport,
          details: { missingConfig: 'X_CLIENT_ID' },
        });
      }
      return await input.refreshToken.use(
        async (refreshToken) =>
          await refreshOAuth2Token({
            http,
            clock,
            provider: PROVIDER,
            tokenUrl: TOKEN_URL,
            clientId,
            ...(config.providers.x.clientSecret === undefined
              ? {}
              : { clientSecret: config.providers.x.clientSecret }),
            refreshToken,
            basicAuth: true,
          }),
      );
    },

    async revoke(input: RevokeRequest): Promise<void> {
      const clientId = config.providers.x.clientId;
      if (clientId === undefined) {
        return;
      }
      const response = await input.accessToken.use(
        async (accessToken) =>
          await http.request({
            method: 'POST',
            url: REVOKE_URL,
            form: { token: accessToken, client_id: clientId, token_type_hint: 'access_token' },
            accept: 'json',
            provider: PROVIDER,
            operation: 'x.revoke',
          }),
      );
      if (!response.ok) {
        // We delete our stored credential regardless. A provider revoke failure must never
        // leave us holding a token we told the user we deleted.
        logger.warn({ provider: PROVIDER, status: response.status }, 'x revoke did not succeed');
      }
    },
  };
}

export const X_REQUESTED_SCOPES = X_SCOPES;
