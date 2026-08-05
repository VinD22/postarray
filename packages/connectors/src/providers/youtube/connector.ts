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
  type PublishItemResult,
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

function toNumberRecord(source: Readonly<Record<string, string | undefined>>): Record<string, unknown> {
  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(source)) {
    if (value !== undefined) {
      output[key] = value;
    }
  }
  return output;
}

export function createYouTubeConnector(deps: ConnectorDeps): SocialConnector {
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

  /** Quota exhaustion is temporary and reschedulable, never a permanent failure. */
  function classifyQuota(status: number, body: unknown, operation: string): never {
    const reason = googleReason(body);
    throw providerFailure({
      provider: PROVIDER,
      operation,
      remediationKey:
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
        docsUrl: 'https://developers.google.com/youtube/v3/docs/videos/insert',
        policyUrl: 'https://developers.google.com/youtube/terms/api-services-terms-of-service',
        engineeringOwner: 'Backend/Connectors 2',
        policyOwner: 'Policy Owner',
        lastPolicyReviewAt: SOURCE_VERIFIED_ON,
        contractVersion: CONNECTOR_CONTRACT_VERSION,
      };
    },

    authorization(): AuthorizationDefinition {
      return {
        flavor: 'oauth2_code',
        authorizeUrl: AUTHORIZE_URL,
        tokenUrl: TOKEN_URL,
        revokeUrl: REVOKE_URL,
        requiresPkce: true,
        multiStep: false,
        redirectPath: '/oauth/youtube/callback',
        scopes: [
          {
            scope: 'https://www.googleapis.com/auth/youtube.upload',
            descriptionKey: 'connectors.youtube.scope.upload',
          },
          {
            scope: 'https://www.googleapis.com/auth/youtube.readonly',
            descriptionKey: 'connectors.youtube.scope.readonly',
          },
          {
            scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
            descriptionKey: 'connectors.youtube.scope.force_ssl',
          },
        ],
        notesKey: isUnaudited()
          ? 'connectors.youtube.unaudited_private_only'
          : 'connectors.youtube.authorization_note',
      };
    },

    async discoverAccounts(grant: OAuthGrant): Promise<ExternalAccount[]> {
      const channels = await readChannel(grant.accessToken, null);
      return channels.items.map((channel) => ({
        externalId: channel.id,
        accountType: 'channel' as const,
        displayName: channel.snippet?.title ?? `Channel ${channel.id}`,
        handle: channel.snippet?.customUrl ?? null,
        avatarUrl: channel.snippet?.thumbnails?.default?.url ?? null,
        parentExternalId: null,
        connectable: grant.scopes.some((scope) => scope.endsWith('/youtube.upload')),
        blockedReasonKey: grant.scopes.some((scope) => scope.endsWith('/youtube.upload'))
          ? null
          : 'connectors.youtube.upload_scope_missing',
        scopes: [...grant.scopes],
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
        label: channel.snippet?.title ?? `Channel ${channel.id}`,
        description: null,
        metadata: { longUploadsAllowed: channel.status?.longUploadsStatus === 'allowed' },
      }));
    },

    async getCapabilities(connection: ProviderConnection) {
      return buildYouTubeCapabilities({
        connection,
        observedAt: nowIso(),
        grantedScopes: connection.scopes,
        longUploadsAllowed: connection.metadata['longUploadsAllowed'] === true,
        customThumbnailAllowed: connection.metadata['customThumbnailAllowed'] === true,
      });
    },

    async validateDraft(draft: ProviderDraft): Promise<ValidationResult> {
      const targetId = draft.connection.connectionId;
      const options = youTubeProviderOptionsSchema.parse(draft.providerOptions);
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
      const options = youTubeProviderOptionsSchema.parse(input.draft.providerOptions);
      const media = input.media[0];
      if (media === undefined) {
        return [];
      }

      // Resume a session rather than restarting the upload.
      const storedUri = input.resume?.['sessionUri'];
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
              title: input.draft.title ?? '',
              description: input.draft.body,
              ...(options.tags === undefined ? {} : { tags: options.tags }),
              ...(options.categoryId === undefined ? {} : { categoryId: options.categoryId }),
              ...(options.defaultLanguage === undefined
                ? {}
                : { defaultLanguage: options.defaultLanguage }),
            },
            status: {
              privacyStatus: input.draft.privacyValue ?? 'private',
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
            remediationKey: REMEDIATION.contactSupport,
            details: { missing: 'location' },
          });
        }
        sessionUri = location;
      }

      const source = await http.request({
        method: 'GET',
        url: media.downloadUrl,
        accept: 'binary',
        provider: PROVIDER,
        operation: 'youtube.fetch_source',
      });
      ensureOk(source, { provider: PROVIDER, operation: 'youtube.fetch_source', response: source });
      const bytes = source.bytes;

      const storedOffset = input.resume?.['confirmedBytes'];
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
          providerContainerId: null,
          uploadUrl: null,
          // The upload is finished but YouTube still processes the video, so the state is
          // processing until `getStatus` confirms it.
          state: 'processing',
          checksum: media.sha256,
          variant: 'youtube:video',
          metadata: { sessionUri, confirmedBytes: offset, videoId },
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
      const { connection, draft } = request;
      const accessToken = await token(connection);
      const options = youTubeProviderOptionsSchema.parse(draft.providerOptions);

      // The resumable upload is what creates the video. `publish` confirms it exists,
      // applies the thumbnail and posts the first comment.
      const uploaded = request.preparedMedia.find(
        (prepared) => prepared.variant === 'youtube:video',
      );
      const resumeVideoId = request.resume['videoId'];
      const videoId =
        (typeof resumeVideoId === 'string' && resumeVideoId !== '' ? resumeVideoId : null) ??
        uploaded?.providerMediaId ??
        null;

      if (videoId === null) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'youtube.publish',
          remediationKey: REMEDIATION.contactSupport,
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
      ensureOk(lookup, { provider: PROVIDER, operation: 'youtube.confirm_upload', response: lookup });
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
          remediationKey: REMEDIATION.contactSupport,
          details: { reason: 'video_not_found', videoId },
        });
      }

      const uploadStatus = video.status?.uploadStatus ?? 'uploaded';
      const processing = video.processingDetails?.processingStatus ?? 'processing';

      if (uploadStatus === 'failed' || uploadStatus === 'rejected') {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'youtube.confirm_upload',
          remediationKey: REMEDIATION.providerRejectedContent,
          details: {
            uploadStatus,
            reason: video.status?.failureReason ?? video.status?.rejectionReason ?? 'unknown',
          },
        });
      }

      if (uploadStatus !== 'processed' && processing !== 'succeeded') {
        return {
          state: 'processing',
          externalPostId: null,
          permalink: null,
          root: {
            kind: 'root',
            order: 0,
            threadItemId: null,
            state: 'processing',
            externalPostId: null,
            permalink: null,
            errorClass: null,
            errorCode: null,
            remediationKey: null,
          },
          items: [],
          pollToken: videoId,
          resume: { videoId },
          sanitizedProviderResponse: { uploadStatus, processing },
          costMinor: null,
          currency: null,
        };
      }

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

      const items: PublishItemResult[] = [];
      for (const item of draft.threadItems) {
        if (item.kind !== 'comment' || item.delaySeconds > 0) {
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
        items.push({
          kind: item.kind,
          order: item.order,
          threadItemId: item.id,
          state: comment.ok ? 'published' : 'failed',
          externalPostId: comment.ok
            ? parseProviderBody(youTubeCommentThreadSchema, comment, {
                provider: PROVIDER,
                operation: 'youtube.create_comment',
                response: comment,
              }).id
            : null,
          permalink: null,
          errorClass: null,
          errorCode: null,
          remediationKey: comment.ok ? null : REMEDIATION.commentFailedRootPublished,
        });
      }

      const anyFailed = items.some((item) => item.state === 'failed');
      const anyPending = items.some((item) => item.state === 'processing');

      return {
        state: anyFailed ? 'partially_published' : anyPending ? 'processing' : 'published',
        externalPostId: videoId,
        permalink: watchUrl(videoId),
        root: {
          kind: 'root',
          order: 0,
          threadItemId: null,
          state: 'published',
          externalPostId: videoId,
          permalink: watchUrl(videoId),
          errorClass: null,
          errorCode: null,
          remediationKey: null,
        },
        items,
        pollToken: videoId,
        resume: { videoId },
        sanitizedProviderResponse: {
          uploadStatus,
          privacyStatus: video.status?.privacyStatus ?? 'private',
        },
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
        query: { part: YOUTUBE_VIDEO_PARTS, id: input.pollToken },
        accept: 'json',
        provider: PROVIDER,
        operation: 'youtube.get_status',
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
          errorClass: 'PERMANENT_PROVIDER',
          remediationKey: REMEDIATION.providerRejectedContent,
          sanitizedProviderResponse: { reason: 'video_not_found' },
        };
      }
      const uploadStatus = video.status?.uploadStatus ?? 'uploaded';
      if (uploadStatus === 'failed' || uploadStatus === 'rejected') {
        return {
          state: 'failed',
          externalPostId: null,
          permalink: null,
          errorClass: 'PERMANENT_PROVIDER',
          remediationKey: REMEDIATION.providerRejectedContent,
          sanitizedProviderResponse: {
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
          errorClass: null,
          remediationKey: null,
          sanitizedProviderResponse: {
            uploadStatus,
            processing: video.processingDetails?.processingStatus ?? 'processing',
          },
        };
      }
      return {
        state: 'published',
        externalPostId: video.id,
        permalink: watchUrl(video.id),
        errorClass: null,
        remediationKey: null,
        sanitizedProviderResponse: { privacyStatus: video.status?.privacyStatus ?? 'private' },
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
          rawPayload: values,
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
        query: { part: 'statistics', id: externalPostId },
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
          remediationKey: REMEDIATION.contactSupport,
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
        refreshToken: input.refreshToken,
        basicAuth: false,
      });
    },

    async revoke(input: RevokeRequest): Promise<void> {
      const accessToken = await token(input.connection);
      const response = await http.request({
        method: 'POST',
        url: REVOKE_URL,
        form: { token: accessToken },
        accept: 'none',
        provider: PROVIDER,
        operation: 'youtube.revoke',
      });
      if (!response.ok) {
        logger.warn({ provider: PROVIDER, status: response.status }, 'youtube revoke did not succeed');
      }
    },
  };
}
