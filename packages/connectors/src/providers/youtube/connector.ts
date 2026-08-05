import {
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
  type DeleteRequest,
  type DestinationRequest,
  type ExternalAccount,
  type MediaPreparationRequest,
  type MetricsRequest,
  type OAuthGrant,
  type PreparedMedia,
  type ProviderConnection,
  type ProviderDestination,
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
import { mapMetrics } from '../shared/metrics.js';
import { buildPreview } from '../shared/preview.js';
import { validateDraftShape } from '../shared/validate.js';
import { SOURCE_VERIFIED_ON } from '../shared/verification.js';
import {
  accessTokenOf,
  errorSummary,
  providerOptionsOf,
  providerOptionsOfConnection,
} from '../shared/access.js';
import { NOT_IMPLEMENTED_FEATURES } from '../../contract.js';
import type { FailedItem, PublishedItem } from '../../contract.js';
import {
  YOUTUBE_MAX_TAGS,
  YOUTUBE_MAX_TITLE_LENGTH,
  YOUTUBE_SHORTS_MAX_DURATION_SECONDS,
  buildYouTubeCapabilities,
  isUnaudited,
  youTubePrivacyOptions,
} from './capabilities.js';
import {
  YOUTUBE_ACCOUNT_METRICS,
  YOUTUBE_CHANNEL_PARTS,
  YOUTUBE_POST_METRICS,
  YOUTUBE_VIDEO_PARTS,
} from './metrics.js';
import {
  googleErrorSchema,
  youTubeChannelListSchema,
  youTubeCommentThreadSchema,
  youTubeProviderOptionsSchema,
  youTubeVideoListSchema,
  youTubeVideoSchema,
} from './schemas.js';

/**
 * YouTube connector.
 *
 * Google OAuth, resumable upload, then `videos.insert` metadata. Two constraints shape
 * everything here:
 *
 * 1. **An unaudited project may upload only as private.** That is a provider rule, encoded
 *    as a capability constraint and enforced in validation, not discovered at runtime.
 * 2. **The Data API is quota limited and an upload is expensive.** Quota exhaustion is a
 *    `TRANSIENT_PROVIDER` with the next window, never a permanent failure.
 *
 * The resumable session is why a worker crash mid upload does not cost the whole upload:
 * the session URI and the confirmed byte offset live in the prepared media metadata.
 */

const PROVIDER = 'youtube' as const;
const API_BASE = 'https://www.googleapis.com/youtube/v3';
const UPLOAD_BASE = 'https://www.googleapis.com/upload/youtube/v3';
const AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const REVOKE_URL = 'https://oauth2.googleapis.com/revoke';
const UPLOAD_CHUNK_BYTES = 8 * 1024 * 1024;

const QUOTA_REASONS = new Set(['quotaExceeded', 'dailyLimitExceeded', 'rateLimitExceeded']);

function googleReason(body: unknown): string | null {
  const parsed = googleErrorSchema.safeParse(body);
  if (!parsed.success) {
    return null;
  }
  return parsed.data.error?.errors?.[0]?.reason ?? parsed.data.error?.status ?? null;
}

function watchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

function toNumberRecord(source: Readonly<Record<string, unknown>>): Record<string, unknown> {
  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(source)) {
    // YouTube reports counts as strings. Anything else is not a metric we can map.
    if (typeof value === 'string' || typeof value === 'number') {
      output[key] = value;
    }
  }
  return output;
}

export function createYouTubeConnector(deps: ConnectorDeps): SocialConnector {
  const { http, clock, config, logger } = deps;

  async function token(connection: ProviderConnection): Promise<string> {
    return accessTokenOf(connection);
  }

  function bearer(accessToken: string): Record<string, string> {
    return { authorization: `Bearer ${accessToken}` };
  }

  function nowIso(): string {
    return clock.now().toISOString();
  }

  /** Quota exhaustion is temporary and reschedulable, never a permanent failure. */
  function classifyQuota(status: number, body: unknown, operation: string): never {
    const reason = googleReason(body);
    throw providerFailure({
      provider: PROVIDER,
      operation,
      remediationCode:
        reason !== null && QUOTA_REASONS.has(reason)
          ? REMEDIATION.quotaExhausted
          : REMEDIATION.contactSupport,
      details: { status, ...(reason === null ? {} : { reason }) },
    });
  }

  async function readChannel(accessToken: string, channelId: string | null) {
    const response = await http.request({
      method: 'GET',
      url: `${API_BASE}/channels`,
      headers: bearer(accessToken),
      query: {
        part: YOUTUBE_CHANNEL_PARTS,
        ...(channelId === null ? { mine: true } : { id: channelId }),
      },
      accept: 'json',
      provider: PROVIDER,
      operation: 'youtube.read_channel',
    });
    ensureOk(response, { provider: PROVIDER, operation: 'youtube.read_channel', response });
    return parseProviderBody(youTubeChannelListSchema, response, {
      provider: PROVIDER,
      operation: 'youtube.read_channel',
      response,
    });
  }

  return {
    identity(): ProviderIdentity {
      return {
        provider: PROVIDER,
        displayName: 'YouTube',
        iconToken: 'provider.youtube',
        accountTypes: ['channel'],
        officialDocsUrl: 'https://developers.google.com/youtube/v3/docs/videos/insert',
        officialPolicyUrl:
          'https://developers.google.com/youtube/terms/api-services-terms-of-service',
        engineeringOwner: 'Backend/Connectors 2',
        policyOwner: 'Policy Owner',
        lastPolicyReviewAt: `${SOURCE_VERIFIED_ON}T00:00:00.000Z`,
        nextPolicyReviewAt: '2027-02-04T00:00:00.000Z',
        contractVersion: CONNECTOR_CONTRACT_VERSION,
        connectorVersion: '1.0.0',
        // Until the API compliance audit passes, uploads are private only.
        label: 'beta',
        limitationKey: 'connectors.youtube.audit_pending',
        features: {
          ...NOT_IMPLEMENTED_FEATURES,
          discover_accounts: 'requires_review',
          get_capabilities: 'supported',
          validate_draft: 'supported',
          prepare_media: 'requires_review',
          preview: 'supported',
          publish: 'requires_review',
          get_status: 'requires_review',
          fetch_metrics: 'requires_review',
          refresh_credential: 'supported',
        },
      };
    },

    authorization(): AuthorizationDefinition {
      return {
        flavor: 'oauth2_pkce',
        authorizeUrl: AUTHORIZE_URL,
        tokenUrl: TOKEN_URL,
        revokeUrl: REVOKE_URL,
        pkceRequired: true,
        multiStep: false,
        stepDescriptionKeys: [],
        supportsRefresh: true,
        refreshAtLifetimeFraction: 0.75,
        extraAuthorizeParameters: { access_type: 'offline', prompt: 'consent' },
        redirectPath: '/oauth/youtube/callback',
        scopes: [
          {
            scope: 'https://www.googleapis.com/auth/youtube.upload',
            explanationKey: 'connectors.youtube.scope.upload',
            usedBy: ['publish'],
            required: true,
          },
          {
            scope: 'https://www.googleapis.com/auth/youtube.readonly',
            explanationKey: 'connectors.youtube.scope.readonly',
            usedBy: ['publish'],
            required: true,
          },
          {
            scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
            explanationKey: 'connectors.youtube.scope.force_ssl',
            usedBy: ['publish'],
            required: true,
          },
        ],
      };
    },

    async discoverAccounts(grant: OAuthGrant): Promise<ExternalAccount[]> {
      const channels = await readChannel(
        await grant.accessToken.use((plaintext) => plaintext),
        null,
      );
      return channels.items.map((channel) => ({
        externalAccountId: channel.id,
        accountType: 'channel' as const,
        displayName: channel.snippet?.title ?? `Channel ${channel.id}`,
        handle: channel.snippet?.customUrl ?? null,
        avatarUrl: channel.snippet?.thumbnails?.default?.url ?? null,
        profileUrl: `https://www.youtube.com/channel/${channel.id}`,
        accountAccessToken: null,
        parentExternalId: null,
        eligible: grant.grantedScopes.some((scope) => scope.endsWith('/youtube.upload')),
        ineligibleReasonKey: grant.grantedScopes.some((scope) => scope.endsWith('/youtube.upload'))
          ? null
          : 'connectors.youtube.upload_scope_missing',
        grantedScopes: [...grant.grantedScopes],
        metadata: {
          longUploadsAllowed: channel.status?.longUploadsStatus === 'allowed',
          uploadsPlaylistId: channel.contentDetails?.relatedPlaylists?.uploads ?? null,
        },
      }));
    },

    async listDestinations(input: DestinationRequest): Promise<ProviderDestination[]> {
      const accessToken = await token(input.connection);
      const channels = await readChannel(accessToken, null);
      return channels.items.map((channel) => ({
        externalId: channel.id,
        kind: 'channel' as const,
        displayLabel: channel.snippet?.title ?? `Channel ${channel.id}`,
        parentExternalId: null,
        canPost: true,
        refreshedAt: nowIso(),
        expiresAt: new Date(clock.now().getTime() + 24 * 60 * 60 * 1000).toISOString(),
        metadata: { longUploadsAllowed: channel.status?.longUploadsStatus === 'allowed' },
      }));
    },

    async getCapabilities(connection: ProviderConnection) {
      return buildYouTubeCapabilities({
        connection,
        observedAt: nowIso(),
        grantedScopes: connection.grantedScopes,
        longUploadsAllowed: connection.metadata['longUploadsAllowed'] === true,
        customThumbnailAllowed: connection.metadata['customThumbnailAllowed'] === true,
      });
    },

    async validateDraft(draft: ProviderDraft): Promise<ValidationResult> {
      const targetId = draft.connection.connectionId;
      const options = youTubeProviderOptionsSchema.parse(providerOptionsOf(draft));
      const issues: ValidationIssue[] = [
        ...validateDraftShape(draft, draft.capabilities, {
          unit: 'utf16',
          requiresMedia: true,
          allowMixedMedia: false,
        }),
      ];

      const title = draft.title;
      if (title === null || title.trim() === '') {
        issues.push(
          validationIssue({
            code: 'YOUTUBE_TITLE_REQUIRED',
            severity: 'error',
            field: 'title',
            targetId,
            params: { provider: PROVIDER },
          }),
        );
      } else if (title.length > YOUTUBE_MAX_TITLE_LENGTH) {
        issues.push(
          validationIssue({
            code: 'YOUTUBE_TITLE_TOO_LONG',
            severity: 'error',
            field: 'title',
            targetId,
            remediationKey: REMEDIATION.contentTooLong,
            params: {
              provider: PROVIDER,
              length: title.length,
              limit: YOUTUBE_MAX_TITLE_LENGTH,
              over: title.length - YOUTUBE_MAX_TITLE_LENGTH,
            },
          }),
        );
      }

      if (options.madeForKids === undefined) {
        issues.push(
          validationIssue({
            code: 'YOUTUBE_AUDIENCE_DECLARATION_REQUIRED',
            severity: 'error',
            field: 'providerOptions.madeForKids',
            targetId,
            params: { provider: PROVIDER },
          }),
        );
      }

      if ((options.tags ?? []).length > YOUTUBE_MAX_TAGS) {
        issues.push(
          validationIssue({
            code: 'YOUTUBE_TOO_MANY_TAGS',
            severity: 'error',
            field: 'providerOptions.tags',
            targetId,
            params: {
              provider: PROVIDER,
              count: (options.tags ?? []).length,
              limit: YOUTUBE_MAX_TAGS,
            },
          }),
        );
      }

      // The unaudited private-only rule. Never a runtime surprise.
      const allowed = youTubePrivacyOptions().map((option) => option.value);
      const chosen = draft.privacyValue ?? 'private';
      if (!allowed.includes(chosen)) {
        issues.push(
          validationIssue({
            code: 'YOUTUBE_PRIVACY_NOT_AVAILABLE',
            severity: 'error',
            field: 'privacyValue',
            targetId,
            remediationKey: REMEDIATION.awaitingProviderApproval,
            params: { provider: PROVIDER, value: chosen, allowed: allowed.join(', ') },
          }),
        );
      } else if (isUnaudited()) {
        issues.push(
          validationIssue({
            code: 'YOUTUBE_UPLOADS_ARE_PRIVATE',
            severity: 'warning',
            field: 'privacyValue',
            targetId,
            remediationKey: REMEDIATION.awaitingProviderApproval,
            params: { provider: PROVIDER },
          }),
        );
      }

      const wantsFirstComment = draft.threadItems.some((item) => item.kind === 'comment');
      if (wantsFirstComment && options.commentsDisabled === true) {
        // Warn at validation rather than failing after the video is already live.
        issues.push(
          validationIssue({
            code: 'YOUTUBE_COMMENTS_DISABLED',
            severity: 'error',
            field: 'threadItems',
            targetId,
            params: { provider: PROVIDER },
          }),
        );
      }

      if (draft.contentKind === 'short_video') {
        for (const [index, media] of draft.media.entries()) {
          if (
            media.durationSeconds !== null &&
            media.durationSeconds > YOUTUBE_SHORTS_MAX_DURATION_SECONDS
          ) {
            issues.push(
              validationIssue({
                code: 'YOUTUBE_NOT_A_SHORT',
                severity: 'warning',
                field: `media.${index}`,
                targetId,
                params: {
                  provider: PROVIDER,
                  durationSeconds: media.durationSeconds,
                  limit: YOUTUBE_SHORTS_MAX_DURATION_SECONDS,
                },
              }),
            );
          }
        }
      }

      if (draft.disclosure.aiAssisted && options.alteredContentDeclared !== true) {
        issues.push(
          validationIssue({
            code: 'YOUTUBE_ALTERED_CONTENT_DECLARATION_REQUIRED',
            severity: 'error',
            field: 'providerOptions.alteredContentDeclared',
            targetId,
            params: { provider: PROVIDER },
          }),
        );
      }

      return validationResult({ issues });
    },

    async prepareMedia(input: MediaPreparationRequest): Promise<PreparedMedia[]> {
      const accessToken = await token(input.connection);
      const options = youTubeProviderOptionsSchema.parse(
        providerOptionsOfConnection(input.connection),
      );
      const media = input.media[0];
      if (media === undefined) {
        return [];
      }

      // Resume a session rather than restarting the upload.
      const storedUri = ({} as Record<string, unknown>)?.['sessionUri'];
      let sessionUri = typeof storedUri === 'string' && storedUri !== '' ? storedUri : null;

      if (sessionUri === null) {
        const start = await http.request({
          method: 'POST',
          url: `${UPLOAD_BASE}/videos`,
          headers: {
            ...bearer(accessToken),
            'x-upload-content-length': String(media.byteSize),
            'x-upload-content-type': media.mimeType,
          },
          query: { uploadType: 'resumable', part: 'snippet,status' },
          json: {
            snippet: {
              // Placeholder metadata. `publish` sets the real snippet from the
              // draft, which is the only place the title and description exist.
              title: 'Pending upload',
              description: '',
              ...(options.tags === undefined ? {} : { tags: options.tags }),
              ...(options.categoryId === undefined ? {} : { categoryId: options.categoryId }),
              ...(options.defaultLanguage === undefined
                ? {}
                : { defaultLanguage: options.defaultLanguage }),
            },
            status: {
              // Always private at upload. `publish` applies the requested privacy,
              // and an unaudited project cannot go beyond private at all.
              privacyStatus: 'private',
              selfDeclaredMadeForKids: options.madeForKids ?? false,
            },
          },
          accept: 'none',
          provider: PROVIDER,
          operation: 'youtube.start_resumable_upload',
        });
        if (!start.ok) {
          classifyQuota(start.status, start.body, 'youtube.start_resumable_upload');
        }
        const location = start.headers['location'];
        if (location === undefined) {
          throw providerFailure({
            provider: PROVIDER,
            operation: 'youtube.start_resumable_upload',
            remediationCode: REMEDIATION.contactSupport,
            details: { missing: 'location' },
          });
        }
        sessionUri = location;
      }

      if (media.sourceUrl === null) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'youtube.prepare_media',
          remediationCode: REMEDIATION.mediaInvalid,
          details: { reason: 'no_source_url' },
        });
      }
      const sourceUrl = media.sourceUrl;
      const source = await http.request({
        method: 'GET',
        url: sourceUrl,
        accept: 'binary',
        provider: PROVIDER,
        operation: 'youtube.fetch_source',
      });
      ensureOk(source, { provider: PROVIDER, operation: 'youtube.fetch_source', response: source });
      const bytes = source.bytes;

      const storedOffset = ({} as Record<string, unknown>)?.['confirmedBytes'];
      let offset = typeof storedOffset === 'number' ? storedOffset : 0;
      let videoId: string | null = null;

      while (offset < bytes.byteLength) {
        const end = Math.min(offset + UPLOAD_CHUNK_BYTES, bytes.byteLength);
        const chunk = bytes.subarray(offset, end);
        const response = await http.request({
          method: 'PUT',
          url: sessionUri,
          headers: {
            'content-type': media.mimeType,
            'content-range': `bytes ${String(offset)}-${String(end - 1)}/${String(bytes.byteLength)}`,
          },
          body: chunk,
          accept: 'json',
          provider: PROVIDER,
          operation: 'youtube.upload_chunk',
        });
        // 308 means "resume incomplete": the chunk landed and more is expected.
        if (response.status === 308) {
          const range = response.headers['range'];
          const lastByte = range === undefined ? end - 1 : Number(range.split('-')[1] ?? end - 1);
          offset = Number.isFinite(lastByte) ? lastByte + 1 : end;
          continue;
        }
        if (!response.ok) {
          classifyQuota(response.status, response.body, 'youtube.upload_chunk');
        }
        const video = parseProviderBody(youTubeVideoSchema, response, {
          provider: PROVIDER,
          operation: 'youtube.upload_chunk',
          response,
        });
        videoId = video.id;
        offset = end;
      }

      return [
        {
          mediaId: media.mediaId,
          providerMediaId: videoId,
          containerId: null,
          // The upload is finished but YouTube still processes the video, so the state is
          // processing until `getStatus` confirms it.
          uploadState: 'processing',
          derivativeId: media.derivativeId,
          derivativeChecksum: media.checksum,
          byteSize: media.byteSize,
          altTextApplied: false,
          publicUrl: null,
          expiresAt: null,
          reusedFromPreviousAttempt: false,
        },
      ];
    },

    async preview(draft: ProviderDraft): Promise<CanonicalPreview> {
      const privacy = draft.privacyValue ?? 'private';
      return buildPreview(draft, draft.capabilities, {
        unit: 'utf16',
        mediaLayout: 'video',
        linkRendering: 'inline_text',
        resolvesMentionsAtRender: false,
        privacyLabelKey: `connectors.youtube.privacy.${privacy}`,
        warningKeys: isUnaudited() ? ['connectors.youtube.unaudited_private_only'] : [],
      });
    },

    async publish(request: PublishRequest): Promise<PublishResult> {
      const { draft } = request;
      const { connection } = draft;
      const accessToken = await token(connection);
      const options = youTubeProviderOptionsSchema.parse(providerOptionsOf(draft));

      // The resumable upload is what creates the video. `publish` confirms it exists,
      // applies the thumbnail and posts the first comment.
      const uploaded = request.preparedMedia.find((prepared) => prepared.providerMediaId !== null);
      const resumeVideoId = undefined;
      const videoId =
        (typeof resumeVideoId === 'string' && resumeVideoId !== '' ? resumeVideoId : null) ??
        uploaded?.providerMediaId ??
        null;

      if (videoId === null) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'youtube.publish',
          remediationCode: REMEDIATION.contactSupport,
          details: { reason: 'upload_not_completed' },
        });
      }

      const lookup = await http.request({
        method: 'GET',
        url: `${API_BASE}/videos`,
        headers: bearer(accessToken),
        query: { part: YOUTUBE_VIDEO_PARTS, id: videoId },
        accept: 'json',
        provider: PROVIDER,
        operation: 'youtube.confirm_upload',
      });
      ensureOk(lookup, {
        provider: PROVIDER,
        operation: 'youtube.confirm_upload',
        response: lookup,
      });
      const list = parseProviderBody(youTubeVideoListSchema, lookup, {
        provider: PROVIDER,
        operation: 'youtube.confirm_upload',
        response: lookup,
      });
      const video = list.items[0];
      if (video === undefined) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'youtube.confirm_upload',
          remediationCode: REMEDIATION.contactSupport,
          details: { reason: 'video_not_found', videoId },
        });
      }

      const uploadStatus = video.status?.uploadStatus ?? 'uploaded';
      const processing = video.processingDetails?.processingStatus ?? 'processing';

      if (uploadStatus === 'failed' || uploadStatus === 'rejected') {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'youtube.confirm_upload',
          remediationCode: REMEDIATION.providerRejectedContent,
          details: {
            uploadStatus,
            reason: video.status?.failureReason ?? video.status?.rejectionReason ?? 'unknown',
          },
        });
      }

      if (uploadStatus !== 'processed' && processing !== 'succeeded') {
        // The bytes are uploaded but YouTube is still processing. An upload is not a
        // publication, so this is pending and the workflow polls until it is done.
        return {
          status: 'pending',
          providerJobId: videoId,
          pollAfterSeconds: 30,
          giveUpAt: new Date(clock.now().getTime() + 6 * 60 * 60 * 1000).toISOString(),
          sanitizedResponse: {
            uploadStatus,
            processing: video.processingDetails?.processingStatus ?? 'processing',
          },
          providerRequestId: null,
        };
      }

      // Apply the real snippet and privacy now that the draft is in scope.
      const update = await http.request({
        method: 'PUT',
        url: `${API_BASE}/videos`,
        headers: bearer(accessToken),
        query: { part: 'snippet,status' },
        json: {
          id: videoId,
          snippet: {
            title: draft.title ?? draft.body.slice(0, 100),
            description: draft.body,
            ...(options.categoryId === undefined ? {} : { categoryId: options.categoryId }),
            ...(options.tags === undefined ? {} : { tags: options.tags }),
            ...(options.defaultLanguage === undefined
              ? {}
              : { defaultLanguage: options.defaultLanguage }),
          },
          status: {
            privacyStatus: draft.privacyValue ?? 'private',
            selfDeclaredMadeForKids: options.madeForKids ?? false,
          },
        },
        accept: 'json',
        provider: PROVIDER,
        operation: 'youtube.update_metadata',
      });
      ensureOk(update, {
        provider: PROVIDER,
        operation: 'youtube.update_metadata',
        response: update,
      });

      if (options.thumbnailMediaId !== undefined) {
        const thumbnail = await http.request({
          method: 'POST',
          url: `${UPLOAD_BASE}/thumbnails/set`,
          headers: bearer(accessToken),
          query: { videoId },
          accept: 'json',
          provider: PROVIDER,
          operation: 'youtube.set_thumbnail',
        });
        if (!thumbnail.ok) {
          // Channel eligibility, not a publish failure. The video is already live.
          logger.warn(
            { provider: PROVIDER, status: thumbnail.status },
            'youtube thumbnail not applied',
          );
        }
      }

      const items: PublishedItem[] = [];
      const failures: FailedItem[] = [];
      for (const item of draft.threadItems) {
        // A delayed comment belongs to the thread sequence workflow.
        if (item.kind !== 'comment' || item.delaySeconds > 0) {
          continue;
        }
        const comment = await http.request({
          method: 'POST',
          url: `${API_BASE}/commentThreads`,
          headers: bearer(accessToken),
          query: { part: 'snippet' },
          json: {
            snippet: {
              videoId,
              topLevelComment: { snippet: { textOriginal: item.body } },
            },
          },
          accept: 'json',
          provider: PROVIDER,
          operation: 'youtube.create_comment',
        });
        if (comment.ok) {
          items.push({
            kind: item.kind,
            order: item.order,
            threadItemId: item.threadItemId,
            externalPostId: parseProviderBody(youTubeCommentThreadSchema, comment, {
              provider: PROVIDER,
              operation: 'youtube.create_comment',
              response: comment,
            }).id,
            permalink: null,
            publishedAt: nowIso(),
          });
        } else {
          // The video is already live, so a failed comment is a partial success.
          failures.push({
            kind: item.kind,
            order: item.order,
            threadItemId: item.threadItemId,
            error: errorSummary({
              errorClass: 'PERMANENT_PROVIDER',
              remediationCode: REMEDIATION.commentFailedRootPublished,
              messageKey: 'connectors.youtube.comment_failed',
              retryable: false,
            }),
          });
        }
      }

      const publishedAt = nowIso();
      const allItems: PublishedItem[] = [
        {
          kind: 'root',
          order: 0,
          threadItemId: null,
          externalPostId: videoId,
          permalink: watchUrl(videoId),
          publishedAt,
        },
        ...items,
      ];
      const sanitizedResponse = { videoId, itemCount: allItems.length };
      if (failures.length > 0) {
        return {
          status: 'partial',
          externalPostId: videoId,
          permalink: watchUrl(videoId),
          publishedAt,
          items: allItems,
          failures,
          sanitizedResponse,
          providerRequestId: null,
          costMinor: null,
          currency: null,
        };
      }
      return {
        status: 'published',
        externalPostId: videoId,
        permalink: watchUrl(videoId),
        publishedAt,
        items: allItems,
        sanitizedResponse,
        providerRequestId: null,
        costMinor: null,
        currency: null,
      };
    },

    async getStatus(input: StatusRequest): Promise<PublishStatus> {
      const accessToken = await token(input.connection);
      const response = await http.request({
        method: 'GET',
        url: `${API_BASE}/videos`,
        headers: bearer(accessToken),
        query: { part: YOUTUBE_VIDEO_PARTS, id: input.providerJobId ?? input.externalPostId ?? '' },
        accept: 'json',
        provider: PROVIDER,
        operation: 'youtube.get_status',
      });
      if (!response.ok) {
        return {
          state: 'unknown',
          externalPostId: null,
          permalink: null,
          publishedAt: null,
          items: [],
          error: null,
          pollAfterSeconds: 30,
          sanitizedResponse: { status: response.status },
        };
      }
      const list = parseProviderBody(youTubeVideoListSchema, response, {
        provider: PROVIDER,
        operation: 'youtube.get_status',
        response,
      });
      const video = list.items[0];
      if (video === undefined) {
        return {
          state: 'failed',
          externalPostId: null,
          permalink: null,
          publishedAt: null,
          items: [],
          error: errorSummary({
            errorClass: 'PERMANENT_PROVIDER',
            remediationCode: REMEDIATION.providerRejectedContent,
            messageKey: 'connectors.provider.publish_failed',
            retryable: false,
          }),
          pollAfterSeconds: null,
          sanitizedResponse: { reason: 'video_not_found' },
        };
      }
      const uploadStatus = video.status?.uploadStatus ?? 'uploaded';
      if (uploadStatus === 'failed' || uploadStatus === 'rejected') {
        return {
          state: 'failed',
          externalPostId: null,
          permalink: null,
          publishedAt: null,
          items: [],
          error: errorSummary({
            errorClass: 'PERMANENT_PROVIDER',
            remediationCode: REMEDIATION.providerRejectedContent,
            messageKey: 'connectors.youtube.upload_rejected',
            retryable: false,
          }),
          pollAfterSeconds: null,
          sanitizedResponse: {
            uploadStatus,
            reason: video.status?.failureReason ?? video.status?.rejectionReason ?? 'unknown',
          },
        };
      }
      if (uploadStatus !== 'processed') {
        return {
          state: 'processing',
          externalPostId: null,
          permalink: null,
          publishedAt: null,
          items: [],
          error: null,
          pollAfterSeconds: 15,
          sanitizedResponse: {
            uploadStatus,
            processing: video.processingDetails?.processingStatus ?? 'processing',
          },
        };
      }
      return {
        state: 'published',
        externalPostId: video.id,
        permalink: watchUrl(video.id),
        publishedAt: nowIso(),
        items: [],
        error: null,
        pollAfterSeconds: null,
        sanitizedResponse: { privacyStatus: video.status?.privacyStatus ?? 'private' },
      };
    },

    async deletePost(input: DeleteRequest): Promise<void> {
      const accessToken = await token(input.connection);
      const response = await http.request({
        method: 'DELETE',
        url: `${API_BASE}/videos`,
        headers: bearer(accessToken),
        query: { id: input.externalPostId },
        accept: 'none',
        provider: PROVIDER,
        operation: 'youtube.delete_video',
      });
      ensureOk(response, { provider: PROVIDER, operation: 'youtube.delete_video', response });
    },

    async fetchMetrics(input: MetricsRequest): Promise<MetricObservation[]> {
      const accessToken = await token(input.connection);
      const observedAt = nowIso();

      if (input.scope === 'account') {
        const response = await http.request({
          method: 'GET',
          url: `${API_BASE}/channels`,
          headers: bearer(accessToken),
          query: { part: 'statistics', id: input.connection.externalAccountId },
          accept: 'json',
          provider: PROVIDER,
          operation: 'youtube.channel_metrics',
        });
        if (!response.ok) {
          return mapMetrics({
            provider: PROVIDER,
            scope: 'account',
            mappings: YOUTUBE_ACCOUNT_METRICS,
            values: {},
            observedAt,
            rawPayload: { status: response.status },
            missingAvailability:
              response.status === 403 ? 'unavailable_permission' : 'unavailable_provider',
          });
        }
        const list = parseProviderBody(youTubeChannelListSchema, response, {
          provider: PROVIDER,
          operation: 'youtube.channel_metrics',
          response,
        });
        const statistics = list.items[0]?.statistics ?? {};
        const values = toNumberRecord(statistics);
        return mapMetrics({
          provider: PROVIDER,
          scope: 'account',
          mappings: YOUTUBE_ACCOUNT_METRICS,
          values,
          observedAt,
          rawPayload: { ...statistics },
        });
      }

      const externalPostId = input.externalPostId;
      if (externalPostId === undefined) {
        return mapMetrics({
          provider: PROVIDER,
          scope: 'post',
          mappings: YOUTUBE_POST_METRICS,
          values: {},
          observedAt,
          rawPayload: {},
          missingAvailability: 'unavailable_pending',
        });
      }
      const response = await http.request({
        method: 'GET',
        url: `${API_BASE}/videos`,
        headers: bearer(accessToken),
        query: { part: 'statistics', id: externalPostId ?? '' },
        accept: 'json',
        provider: PROVIDER,
        operation: 'youtube.video_metrics',
      });
      if (!response.ok) {
        return mapMetrics({
          provider: PROVIDER,
          scope: 'post',
          mappings: YOUTUBE_POST_METRICS,
          values: {},
          observedAt,
          rawPayload: { status: response.status },
          missingAvailability:
            response.status === 403 ? 'unavailable_permission' : 'unavailable_provider',
        });
      }
      const list = parseProviderBody(youTubeVideoListSchema, response, {
        provider: PROVIDER,
        operation: 'youtube.video_metrics',
        response,
      });
      const statistics = list.items[0]?.statistics ?? {};
      const values = toNumberRecord(statistics);
      // A channel that hid its like count simply does not return `likeCount`, and the
      // observation is unavailable rather than 0.
      return mapMetrics({
        provider: PROVIDER,
        scope: 'post',
        mappings: YOUTUBE_POST_METRICS,
        values,
        observedAt,
        rawPayload: values,
      });
    },

    async refreshCredential(input: RefreshRequest): Promise<CredentialResult> {
      const clientId = config.providers.google.clientId;
      const clientSecret = config.providers.google.clientSecret;
      if (clientId === undefined || clientSecret === undefined) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'youtube.refresh_credential',
          remediationCode: REMEDIATION.contactSupport,
          details: { missingConfig: 'GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET' },
        });
      }
      return refreshOAuth2Token({
        http,
        clock,
        provider: PROVIDER,
        tokenUrl: TOKEN_URL,
        clientId,
        clientSecret,
        refreshToken: await input.refreshToken.use((plaintext) => plaintext),
        basicAuth: false,
      });
    },

    async revoke(input: RevokeRequest): Promise<void> {
      const accessToken = await input.accessToken.use((plaintext) => plaintext);
      const response = await http.request({
        method: 'POST',
        url: REVOKE_URL,
        form: { token: accessToken },
        accept: 'none',
        provider: PROVIDER,
        operation: 'youtube.revoke',
      });
      if (!response.ok) {
        logger.warn(
          { provider: PROVIDER, status: response.status },
          'youtube revoke did not succeed',
        );
      }
    },
  };
}
