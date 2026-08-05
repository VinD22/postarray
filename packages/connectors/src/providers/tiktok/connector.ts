import {
  ConnectionActionRequiredError,
  validationIssue,
  validationResult,
  type MetricObservation,
  type ValidationIssue,
  type ValidationResult,
} from '@relay/contracts';

import {
  CONNECTOR_CONTRACT_VERSION,
  REMEDIATION,
  ensureOk,
  parseProviderBody,
  providerFailure,
  refreshOAuth2Token,
  type AuthorizationDefinition,
  type CanonicalPreview,
  type ConnectorDeps,
  type CredentialResult,
  type ExternalAccount,
  type MediaPreparationRequest,
  type MetricsRequest,
  type OAuthGrant,
  type PreparedMedia,
  type ProviderConnection,
  type ProviderDraft,
  type ProviderIdentity,
  type PublishRequest,
  type PublishResult,
  type PublishStatus,
  type RefreshRequest,
  type RevokeRequest,
  type SocialConnector,
  type StatusRequest,
} from '../shared/contract-shape.js';
import { buildPreview } from '../shared/preview.js';
import { validateDraftShape } from '../shared/validate.js';
import { SOURCE_VERIFIED_ON } from '../shared/verification.js';
import {
  TIKTOK_UNAUDITED_PRIVACY_LEVEL,
  buildTikTokCapabilities,
  interactionAvailability,
  isUnaudited,
} from './capabilities.js';
import {
  tikTokCreatorInfoSchema,
  tikTokPublishInitSchema,
  tikTokPublishStatusSchema,
  tikTokProviderOptionsSchema,
  tikTokUserInfoSchema,
  type TikTokCreatorInfo,
} from './schemas.js';

/**
 * TikTok connector.
 *
 * Content Posting API, Direct Post. The hard requirements from TikTok's content sharing
 * guidelines are product requirements, not nice to haves, and every one of them is enforced
 * here:
 *
 * - **Fetch creator info at publish time**, never at connect time. Options change.
 * - **Never default the privacy selection.** An unselected privacy is a validation error.
 * - Comment, duet and stitch settings are explicit user choices, only where the creator
 *   info says they are available.
 * - Commercial content and music rights declarations are collected where applicable.
 * - **No Relay watermark or logo is ever added.** There is no code path that composites
 *   anything onto a video.
 * - Pull from URL uses a verified owned domain.
 * - **An upload alone is not success.** We poll until TikTok reports a terminal state and a
 *   post id.
 */

const PROVIDER = 'tiktok' as const;
const API_BASE = 'https://open.tiktokapis.com/v2';
const AUTHORIZE_URL = 'https://www.tiktok.com/v2/auth/authorize/';
const TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/';
const REVOKE_URL = 'https://open.tiktokapis.com/v2/oauth/revoke/';
const UPLOAD_CHUNK_BYTES = 10 * 1024 * 1024;

const TERMINAL_SUCCESS = 'PUBLISH_COMPLETE';
const TERMINAL_FAILURE = 'FAILED';

/**
 * Domains we have verified with TikTok for pull-from-URL. A source outside this list is our
 * configuration error and must be impossible to reach in production.
 */
export const VERIFIED_PULL_DOMAINS: readonly string[] = Object.freeze([]);

export function isVerifiedPullDomain(url: string, verified: readonly string[]): boolean {
  try {
    const host = new URL(url).host.toLowerCase();
    return verified.some((domain) => host === domain || host.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

export function tikTokPermalink(username: string | null, postId: string): string {
  return username === null
    ? `https://www.tiktok.com/video/${postId}`
    : `https://www.tiktok.com/@${username}/video/${postId}`;
}

export interface TikTokConnector extends SocialConnector {
  /**
   * Creator info, fetched fresh. The composer calls this immediately before it renders the
   * consent UI, and the worker calls it again at dispatch, because the options change.
   */
  fetchCreatorInfo(connection: ProviderConnection): Promise<TikTokCreatorInfo['data']>;
}

export function createTikTokConnector(deps: ConnectorDeps): TikTokConnector {
  const { http, vault, clock, config, logger } = deps;

  async function token(connection: ProviderConnection): Promise<string> {
    return vault.getAccessToken(connection.credentialRef);
  }

  function bearer(accessToken: string): Record<string, string> {
    return { authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' };
  }

  function nowIso(): string {
    return clock.now().toISOString();
  }

  function usernameOf(connection: ProviderConnection): string | null {
    const username = connection.metadata['username'];
    return typeof username === 'string' && username !== '' ? username : null;
  }

  async function creatorInfo(connection: ProviderConnection): Promise<TikTokCreatorInfo['data']> {
    const accessToken = await token(connection);
    const response = await http.request({
      method: 'POST',
      url: `${API_BASE}/post/publish/creator_info/query/`,
      headers: bearer(accessToken),
      accept: 'json',
      provider: PROVIDER,
      operation: 'tiktok.creator_info',
    });
    ensureOk(response, {
      provider: PROVIDER,
      operation: 'tiktok.creator_info',
      response,
      remediationKey: REMEDIATION.reconnectAccount,
    });
    return parseProviderBody(tikTokCreatorInfoSchema, response, {
      provider: PROVIDER,
      operation: 'tiktok.creator_info',
      response,
    }).data;
  }

  async function readStatus(
    connection: ProviderConnection,
    publishId: string,
  ): Promise<PublishStatus> {
    const accessToken = await token(connection);
    const response = await http.request({
      method: 'POST',
      url: `${API_BASE}/post/publish/status/fetch/`,
      headers: bearer(accessToken),
      json: { publish_id: publishId },
      accept: 'json',
      provider: PROVIDER,
      operation: 'tiktok.publish_status',
    });
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
    const parsed = parseProviderBody(tikTokPublishStatusSchema, response, {
      provider: PROVIDER,
      operation: 'tiktok.publish_status',
      response,
    });
    const status = parsed.data.status;
    if (status === TERMINAL_FAILURE) {
      return {
        state: 'failed',
        externalPostId: null,
        permalink: null,
        errorClass: 'PERMANENT_PROVIDER',
        remediationKey: REMEDIATION.providerRejectedContent,
        sanitizedProviderResponse: {
          status,
          ...(parsed.data.fail_reason === undefined
            ? {}
            : { failReason: parsed.data.fail_reason.slice(0, 200) }),
        },
      };
    }
    const postId = parsed.data.publicaly_available_post_id?.[0] ?? null;
    if (status === TERMINAL_SUCCESS && postId !== null) {
      return {
        state: 'published',
        externalPostId: postId,
        permalink: tikTokPermalink(usernameOf(connection), postId),
        errorClass: null,
        remediationKey: null,
        sanitizedProviderResponse: { status },
      };
    }
    // An upload alone is not success. Anything short of a terminal state with a post id is
    // still processing.
    return {
      state: 'processing',
      externalPostId: null,
      permalink: null,
      errorClass: null,
      remediationKey: null,
      sanitizedProviderResponse: { status },
    };
  }

  return {
    identity(): ProviderIdentity {
      return {
        provider: PROVIDER,
        displayName: 'TikTok',
        iconToken: 'provider.tiktok',
        accountTypes: ['creator_profile', 'business_profile'],
        docsUrl: 'https://developers.tiktok.com/doc/content-posting-api-get-started',
        policyUrl: 'https://developers.tiktok.com/doc/content-sharing-guidelines',
        engineeringOwner: 'Backend/Connectors 2',
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
        redirectPath: '/oauth/tiktok/callback',
        scopes: [
          { scope: 'user.info.basic', descriptionKey: 'connectors.tiktok.scope.user_info_basic' },
          {
            scope: 'user.info.profile',
            descriptionKey: 'connectors.tiktok.scope.user_info_profile',
          },
          { scope: 'video.publish', descriptionKey: 'connectors.tiktok.scope.video_publish' },
          { scope: 'video.upload', descriptionKey: 'connectors.tiktok.scope.video_upload' },
        ],
        notesKey: isUnaudited()
          ? 'connectors.tiktok.unaudited_private_only'
          : 'connectors.tiktok.authorization_note',
      };
    },

    async discoverAccounts(grant: OAuthGrant): Promise<ExternalAccount[]> {
      const response = await http.request({
        method: 'GET',
        url: `${API_BASE}/user/info/`,
        headers: { authorization: `Bearer ${grant.accessToken}` },
        query: { fields: 'open_id,union_id,display_name,avatar_url,username,is_verified' },
        accept: 'json',
        provider: PROVIDER,
        operation: 'tiktok.discover_accounts',
      });
      ensureOk(response, {
        provider: PROVIDER,
        operation: 'tiktok.discover_accounts',
        response,
        remediationKey: REMEDIATION.reconnectAccount,
      });
      const parsed = parseProviderBody(tikTokUserInfoSchema, response, {
        provider: PROVIDER,
        operation: 'tiktok.discover_accounts',
        response,
      });
      const user = parsed.data.user;
      const canPublish = grant.scopes.includes('video.publish');
      return [
        {
          externalId: user.open_id,
          accountType: 'creator_profile',
          displayName: user.display_name ?? user.username ?? 'TikTok creator',
          handle: user.username ?? null,
          avatarUrl: user.avatar_url ?? null,
          parentExternalId: null,
          connectable: canPublish,
          blockedReasonKey: canPublish ? null : 'connectors.tiktok.publish_scope_missing',
          scopes: [...grant.scopes],
          metadata: {
            username: user.username ?? null,
            unionId: user.union_id ?? null,
            unaudited: isUnaudited(),
          },
        },
      ];
    },

    async fetchCreatorInfo(connection: ProviderConnection) {
      return creatorInfo(connection);
    },

    async getCapabilities(connection: ProviderConnection) {
      // Creator info is fetched here so the composer always renders the creator's real,
      // current options rather than a cached guess.
      let creator: TikTokCreatorInfo['data'] | undefined;
      try {
        creator = await creatorInfo(connection);
      } catch (error) {
        logger.warn(
          { provider: PROVIDER, connectionId: connection.connectionId },
          'tiktok creator info unavailable, reporting the unaudited fallback',
        );
        void error;
      }
      return buildTikTokCapabilities({
        connection,
        observedAt: nowIso(),
        grantedScopes: connection.scopes,
        ...(creator === undefined ? {} : { creatorInfo: creator }),
      });
    },

    async validateDraft(draft: ProviderDraft): Promise<ValidationResult> {
      const snapshot = draft.capabilities;
      const targetId = draft.connection.connectionId;
      const options = tikTokProviderOptionsSchema.parse(draft.providerOptions);
      const issues: ValidationIssue[] = [
        ...validateDraftShape(draft, snapshot, {
          unit: 'grapheme',
          requiresMedia: true,
          allowMixedMedia: false,
        }),
      ];

      // `validateDraftShape` already raises PRIVACY_CHOICE_REQUIRED because
      // `mustBeExplicit` is true. This adds the TikTok specific wording and the unaudited
      // restriction on top.
      const chosen = options.privacyLevel ?? draft.privacyValue;
      if (chosen !== null && chosen !== undefined && isUnaudited()) {
        if (chosen !== TIKTOK_UNAUDITED_PRIVACY_LEVEL) {
          issues.push(
            validationIssue({
              code: 'TIKTOK_UNAUDITED_PRIVATE_ONLY',
              severity: 'error',
              field: 'privacyValue',
              targetId,
              remediationKey: REMEDIATION.awaitingProviderApproval,
              params: { provider: PROVIDER, value: chosen },
            }),
          );
        } else {
          issues.push(
            validationIssue({
              code: 'TIKTOK_POSTS_ARE_PRIVATE',
              severity: 'warning',
              field: 'privacyValue',
              targetId,
              remediationKey: REMEDIATION.awaitingProviderApproval,
              params: { provider: PROVIDER },
            }),
          );
        }
      }

      // Comment, duet and stitch are explicit choices. An unset value is not "off".
      for (const [field, value] of [
        ['disableComment', options.disableComment],
        ['disableDuet', options.disableDuet],
        ['disableStitch', options.disableStitch],
      ] as const) {
        if (value === undefined) {
          issues.push(
            validationIssue({
              code: 'TIKTOK_INTERACTION_CHOICE_REQUIRED',
              severity: 'error',
              field: `providerOptions.${field}`,
              targetId,
              params: { provider: PROVIDER, setting: field },
            }),
          );
        }
      }

      if (options.commercialContent === undefined) {
        issues.push(
          validationIssue({
            code: 'TIKTOK_COMMERCIAL_DECLARATION_REQUIRED',
            severity: 'error',
            field: 'providerOptions.commercialContent',
            targetId,
            params: { provider: PROVIDER },
          }),
        );
      } else if (
        options.commercialContent &&
        options.brandOrganic !== true &&
        options.brandedContent !== true
      ) {
        issues.push(
          validationIssue({
            code: 'TIKTOK_COMMERCIAL_KIND_REQUIRED',
            severity: 'error',
            field: 'providerOptions.brandedContent',
            targetId,
            params: { provider: PROVIDER },
          }),
        );
      }

      if (options.musicRightsConfirmed !== true) {
        issues.push(
          validationIssue({
            code: 'TIKTOK_MUSIC_RIGHTS_CONFIRMATION_REQUIRED',
            severity: 'error',
            field: 'providerOptions.musicRightsConfirmed',
            targetId,
            params: { provider: PROVIDER },
          }),
        );
      }

      if (options.consentConfirmed !== true) {
        issues.push(
          validationIssue({
            code: 'TIKTOK_CONSENT_REQUIRED',
            severity: 'error',
            field: 'providerOptions.consentConfirmed',
            targetId,
            params: { provider: PROVIDER },
          }),
        );
      }

      if (draft.threadItems.some((item) => item.kind === 'comment')) {
        issues.push(
          validationIssue({
            code: 'TIKTOK_FIRST_COMMENT_UNSUPPORTED',
            severity: 'error',
            field: 'threadItems',
            targetId,
            params: { provider: PROVIDER },
          }),
        );
      }

      return validationResult({ issues });
    },

    async prepareMedia(input: MediaPreparationRequest): Promise<PreparedMedia[]> {
      // TikTok initializes the publish and the upload in one call, so media preparation
      // records the source decision and leaves the init to `publish`. This keeps the
      // creator info fetch and the init in the same step, which is what TikTok requires.
      return input.media.map((media) => ({
        mediaId: media.mediaId,
        providerMediaId: null,
        providerContainerId: null,
        uploadUrl: null,
        state: 'ready',
        checksum: media.sha256,
        variant: `tiktok:${media.kind}`,
        metadata: {
          byteSize: media.byteSize,
          mimeType: media.mimeType,
          // The source URL host is recorded so the pull-from-URL domain check is auditable.
          sourceHost: new URL(media.downloadUrl).host,
        },
      }));
    },

    async preview(draft: ProviderDraft): Promise<CanonicalPreview> {
      const options = tikTokProviderOptionsSchema.parse(draft.providerOptions);
      return buildPreview(draft, draft.capabilities, {
        unit: 'grapheme',
        mediaLayout: 'video',
        linkRendering: 'inline_text',
        resolvesMentionsAtRender: true,
        privacyLabelKey:
          options.privacyLevel === undefined
            ? 'connectors.tiktok.privacy.not_chosen'
            : `connectors.tiktok.privacy.${options.privacyLevel.toLowerCase()}`,
        warningKeys: isUnaudited() ? ['connectors.tiktok.unaudited_private_only'] : [],
      });
    },

    async publish(request: PublishRequest): Promise<PublishResult> {
      const { connection, draft } = request;
      const accessToken = await token(connection);
      const options = tikTokProviderOptionsSchema.parse(draft.providerOptions);

      const existing = request.resume['publishId'];
      if (typeof existing === 'string' && existing !== '') {
        // Never re-initialize a publish we already started.
        const status = await readStatus(connection, existing);
        return {
          state:
            status.state === 'published'
              ? 'published'
              : status.state === 'failed'
                ? 'failed'
                : 'processing',
          externalPostId: status.externalPostId,
          permalink: status.permalink,
          root: {
            kind: 'root',
            order: 0,
            threadItemId: null,
            state:
              status.state === 'published'
                ? 'published'
                : status.state === 'failed'
                  ? 'failed'
                  : 'processing',
            externalPostId: status.externalPostId,
            permalink: status.permalink,
            errorClass: status.errorClass,
            errorCode: null,
            remediationKey: status.remediationKey,
          },
          items: [],
          pollToken: existing,
          resume: { publishId: existing },
          sanitizedProviderResponse: status.sanitizedProviderResponse,
          costMinor: null,
          currency: null,
        };
      }

      // Creator info is re-fetched at dispatch. A post scheduled far in advance must not
      // publish with an option that is no longer available.
      const creator = await creatorInfo(connection);
      const available = creator.privacy_level_options;
      const privacyLevel = options.privacyLevel;
      if (privacyLevel === undefined || !available.includes(privacyLevel)) {
        throw new ConnectionActionRequiredError({
          messageKey: 'connectors.tiktok.privacy_option_unavailable',
          details: {
            provider: PROVIDER,
            remediationKey: REMEDIATION.choosePrivacyOption,
            available: available.join(', '),
          },
        });
      }

      const interactions = interactionAvailability(creator);
      if (options.disableComment === false && !interactions.commentAllowed) {
        throw new ConnectionActionRequiredError({
          messageKey: 'connectors.tiktok.comments_disabled_by_creator',
          details: { provider: PROVIDER, remediationKey: REMEDIATION.choosePrivacyOption },
        });
      }

      const media = draft.media[0];
      if (media === undefined) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'tiktok.publish_init',
          remediationKey: REMEDIATION.mediaInvalid,
          details: { reason: 'no_media' },
        });
      }

      const verified = isVerifiedPullDomain(media.downloadUrl, VERIFIED_PULL_DOMAINS);
      const sourceInfo = verified
        ? { source: 'PULL_FROM_URL', video_url: media.downloadUrl }
        : {
            source: 'FILE_UPLOAD',
            video_size: media.byteSize,
            chunk_size: Math.min(UPLOAD_CHUNK_BYTES, media.byteSize),
            total_chunk_count: Math.max(
              1,
              Math.ceil(media.byteSize / Math.min(UPLOAD_CHUNK_BYTES, media.byteSize)),
            ),
          };

      const init = await http.request({
        method: 'POST',
        url: `${API_BASE}/post/publish/video/init/`,
        headers: bearer(accessToken),
        json: {
          post_info: {
            title: draft.body,
            privacy_level: privacyLevel,
            disable_comment: options.disableComment ?? true,
            disable_duet: options.disableDuet ?? true,
            disable_stitch: options.disableStitch ?? true,
            ...(options.videoCoverTimestampMs === undefined
              ? {}
              : { video_cover_timestamp_ms: options.videoCoverTimestampMs }),
            brand_content_toggle: options.brandedContent ?? false,
            brand_organic_toggle: options.brandOrganic ?? false,
          },
          source_info: sourceInfo,
        },
        accept: 'json',
        provider: PROVIDER,
        operation: 'tiktok.publish_init',
      });
      ensureOk(init, { provider: PROVIDER, operation: 'tiktok.publish_init', response: init });
      const initialized = parseProviderBody(tikTokPublishInitSchema, init, {
        provider: PROVIDER,
        operation: 'tiktok.publish_init',
        response: init,
      });
      const publishId = initialized.data.publish_id;
      const uploadUrl = initialized.data.upload_url;

      if (!verified && uploadUrl !== undefined) {
        const source = await http.request({
          method: 'GET',
          url: media.downloadUrl,
          accept: 'binary',
          provider: PROVIDER,
          operation: 'tiktok.fetch_source',
        });
        ensureOk(source, {
          provider: PROVIDER,
          operation: 'tiktok.fetch_source',
          response: source,
        });
        const bytes = source.bytes;
        const chunkSize = Math.min(UPLOAD_CHUNK_BYTES, bytes.byteLength);
        for (let offset = 0; offset < bytes.byteLength; offset += chunkSize) {
          const end = Math.min(offset + chunkSize, bytes.byteLength);
          const upload = await http.request({
            method: 'PUT',
            url: uploadUrl,
            headers: {
              'content-type': media.mimeType,
              'content-range': `bytes ${String(offset)}-${String(end - 1)}/${String(bytes.byteLength)}`,
            },
            body: bytes.subarray(offset, end),
            accept: 'none',
            provider: PROVIDER,
            operation: 'tiktok.upload_chunk',
          });
          ensureOk(upload, {
            provider: PROVIDER,
            operation: 'tiktok.upload_chunk',
            response: upload,
            remediationKey: REMEDIATION.mediaInvalid,
          });
        }
      }

      // The upload finished, which is emphatically not a publication. Poll for the
      // terminal state and a post id.
      const status = await readStatus(connection, publishId);
      const state =
        status.state === 'published'
          ? 'published'
          : status.state === 'failed'
            ? 'failed'
            : 'processing';

      return {
        state,
        externalPostId: status.externalPostId,
        permalink: status.permalink,
        root: {
          kind: 'root',
          order: 0,
          threadItemId: null,
          state:
            state === 'published' ? 'published' : state === 'failed' ? 'failed' : 'processing',
          externalPostId: status.externalPostId,
          permalink: status.permalink,
          errorClass: status.errorClass,
          errorCode: null,
          remediationKey: status.remediationKey,
        },
        items: [],
        pollToken: publishId,
        resume: { publishId },
        sanitizedProviderResponse: {
          ...status.sanitizedProviderResponse,
          source: verified ? 'PULL_FROM_URL' : 'FILE_UPLOAD',
        },
        costMinor: null,
        currency: null,
      };
    },

    async getStatus(input: StatusRequest): Promise<PublishStatus> {
      return readStatus(input.connection, input.pollToken);
    },

    async fetchMetrics(input: MetricsRequest): Promise<MetricObservation[]> {
      // We are not approved for a TikTok insights product. The honest, actionable answer is
      // an empty observation set plus the capability snapshot's `requires_review`, not a
      // screen of zeros. When an insights product is approved, map its fields here.
      logger.debug(
        { provider: PROVIDER, scope: input.scope },
        'tiktok metrics unavailable: no approved insights product',
      );
      return [];
    },

    async refreshCredential(input: RefreshRequest): Promise<CredentialResult> {
      const clientKey = config.providers.tiktok.clientKey;
      const clientSecret = config.providers.tiktok.clientSecret;
      if (clientKey === undefined || clientSecret === undefined) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'tiktok.refresh_credential',
          remediationKey: REMEDIATION.contactSupport,
          details: { missingConfig: 'TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET' },
        });
      }
      return refreshOAuth2Token({
        http,
        clock,
        provider: PROVIDER,
        tokenUrl: TOKEN_URL,
        clientId: clientKey,
        clientSecret,
        refreshToken: input.refreshToken,
        basicAuth: false,
      });
    },

    async revoke(input: RevokeRequest): Promise<void> {
      const clientKey = config.providers.tiktok.clientKey;
      const clientSecret = config.providers.tiktok.clientSecret;
      if (clientKey === undefined || clientSecret === undefined) {
        return;
      }
      const accessToken = await token(input.connection);
      const response = await http.request({
        method: 'POST',
        url: REVOKE_URL,
        form: { client_key: clientKey, client_secret: clientSecret, token: accessToken },
        accept: 'json',
        provider: PROVIDER,
        operation: 'tiktok.revoke',
      });
      if (!response.ok) {
        logger.warn({ provider: PROVIDER, status: response.status }, 'tiktok revoke did not succeed');
      }
    },
  };
}
