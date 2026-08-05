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
  providerFailure,
  type AuthorizationDefinition,
  type CanonicalPreview,
  type ConnectorDeps,
  type CredentialResult,
  type DeleteRequest,
  type ExternalAccount,
  type MediaPreparationRequest,
  type MetricsRequest,
  type OAuthGrant,
  type PreparedMedia,
  type ProviderConnection,
  type ProviderDraft,
  type ProviderIdentity,
  type PublishItemResult,
  type PublishRequest,
  type PublishResult,
  type PublishStatus,
  type RefreshRequest,
  type SocialConnector,
  type StatusRequest,
} from '../../shared/contract-shape.js';
import { mapMetrics } from '../../shared/metrics.js';
import { buildPreview } from '../../shared/preview.js';
import { validateDraftShape } from '../../shared/validate.js';
import { SOURCE_VERIFIED_ON } from '../../shared/verification.js';
import { canPublishToPage, createMetaClient, metaPagesResponseSchema } from '../graph.js';
import { metaAuthorization, refreshMetaCredential } from '../oauth.js';
import { buildFacebookCapabilities } from './capabilities.js';
import {
  FACEBOOK_ACCOUNT_METRICS,
  FACEBOOK_ACCOUNT_METRIC_QUERY,
  FACEBOOK_ENGAGEMENT_METRICS,
  FACEBOOK_POST_FIELDS,
  FACEBOOK_POST_METRICS,
  FACEBOOK_POST_METRIC_QUERY,
} from './metrics.js';
import {
  facebookCommentSchema,
  facebookInsightsSchema,
  facebookPostListSchema,
  facebookPostSchema,
  facebookProviderOptionsSchema,
  facebookVideoSchema,
  type FacebookInsights,
} from './schemas.js';

/**
 * Facebook Pages connector.
 *
 * Pages only. Personal profile automation is not a target and is not offered anywhere in
 * this adapter. Direct create for text and link posts; photo and video posts upload the
 * media first, and video may need a processing wait that `getStatus` polls.
 *
 * Page tokens are long lived but a Page role change revokes them, so connection health has
 * to track roles and not only expiry. `discoverAccounts` records the tasks Meta returned so
 * the application layer can detect a role that went away.
 */

const PROVIDER = 'facebook' as const;

function readInsights(payload: FacebookInsights): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const entry of payload.data) {
    const last = entry.values[entry.values.length - 1]?.value;
    if (typeof last === 'number') {
      values[entry.name] = last;
    }
  }
  return values;
}

/** Engagement summaries arrive nested on the post object, not in insights. */
function readEngagement(body: unknown): Record<string, unknown> {
  if (typeof body !== 'object' || body === null) {
    return {};
  }
  const record = body as Record<string, unknown>;
  const summaryOf = (key: string): number | undefined => {
    const node = record[key];
    if (typeof node !== 'object' || node === null) {
      return undefined;
    }
    const summary = (node as Record<string, unknown>)['summary'];
    if (typeof summary !== 'object' || summary === null) {
      return undefined;
    }
    const total = (summary as Record<string, unknown>)['total_count'];
    return typeof total === 'number' ? total : undefined;
  };
  const shares = record['shares'];
  const shareCount =
    typeof shares === 'object' && shares !== null
      ? (shares as Record<string, unknown>)['count']
      : undefined;
  return {
    like_count: summaryOf('likes'),
    comment_count: summaryOf('comments'),
    share_count: typeof shareCount === 'number' ? shareCount : undefined,
  };
}

export function createFacebookConnector(deps: ConnectorDeps): SocialConnector {
  const client = createMetaClient(deps, PROVIDER);
  const { vault, clock } = deps;

  async function token(connection: ProviderConnection): Promise<string> {
    return vault.getAccessToken(connection.credentialRef);
  }

  function nowIso(): string {
    return clock.now().toISOString();
  }

  return {
    identity(): ProviderIdentity {
      return {
        provider: PROVIDER,
        displayName: 'Facebook Pages',
        iconToken: 'provider.facebook',
        // Pages only. A personal profile is never a target.
        accountTypes: ['page'],
        docsUrl: 'https://developers.facebook.com/docs/pages-api/posts',
        policyUrl: 'https://developers.facebook.com/terms',
        engineeringOwner: 'Backend/Connectors 1',
        policyOwner: 'Policy Owner',
        lastPolicyReviewAt: SOURCE_VERIFIED_ON,
        contractVersion: CONNECTOR_CONTRACT_VERSION,
      };
    },

    authorization(): AuthorizationDefinition {
      return metaAuthorization(PROVIDER);
    },

    async discoverAccounts(grant: OAuthGrant): Promise<ExternalAccount[]> {
      const response = await client.get({
        path: '/me/accounts',
        accessToken: grant.accessToken,
        query: { fields: 'id,name,access_token,tasks,category,picture{url}', limit: 100 },
        operation: 'facebook.discover_pages',
      });
      client.require(response, 'facebook.discover_pages');
      const parsed = client.parse(metaPagesResponseSchema, response, 'facebook.discover_pages');
      return parsed.data.map((page) => ({
        externalId: page.id,
        accountType: 'page' as const,
        displayName: page.name,
        handle: null,
        avatarUrl: page.picture?.data?.url ?? null,
        parentExternalId: null,
        connectable: canPublishToPage(page),
        blockedReasonKey: canPublishToPage(page) ? null : 'connectors.facebook.page_role_required',
        scopes: [...grant.scopes],
        // The tasks are recorded so a later role change is detectable, not only expiry.
        metadata: { tasks: page.tasks ?? [], category: page.category ?? null },
      }));
    },

    async getCapabilities(connection: ProviderConnection) {
      return buildFacebookCapabilities({
        connection,
        observedAt: nowIso(),
        grantedScopes: connection.scopes,
      });
    },

    async validateDraft(draft: ProviderDraft): Promise<ValidationResult> {
      const targetId = draft.connection.connectionId;
      facebookProviderOptionsSchema.parse(draft.providerOptions);
      const issues: ValidationIssue[] = [
        ...validateDraftShape(draft, draft.capabilities, { unit: 'utf16', allowMixedMedia: false }),
      ];
      if (draft.connection.accountType !== 'page') {
        issues.push(
          validationIssue({
            code: 'FACEBOOK_PAGE_REQUIRED',
            severity: 'error',
            field: 'connection',
            targetId,
            remediationKey: REMEDIATION.pageRoleRequired,
            params: { provider: PROVIDER },
          }),
        );
      }
      return validationResult({ issues });
    },

    async prepareMedia(input: MediaPreparationRequest): Promise<PreparedMedia[]> {
      const accessToken = await token(input.connection);
      const pageId = input.connection.externalAccountId;
      const prepared: PreparedMedia[] = [];

      for (const media of input.media) {
        if (media.kind === 'video') {
          // A video is created directly on the Page and referenced by its id.
          const response = await client.post({
            path: `/${pageId}/videos`,
            accessToken,
            json: {
              file_url: media.downloadUrl,
              published: false,
              ...(media.altText === null ? {} : { description: media.altText }),
            },
            operation: 'facebook.upload_video',
          });
          client.require(response, 'facebook.upload_video');
          const video = client.parse(facebookVideoSchema, response, 'facebook.upload_video');
          prepared.push({
            mediaId: media.mediaId,
            providerMediaId: video.id,
            providerContainerId: null,
            uploadUrl: null,
            state: 'processing',
            checksum: media.sha256,
            variant: 'facebook:video',
            metadata: { pageId },
          });
          continue;
        }
        // Unpublished photos are attached to the feed post so several can share one post.
        const response = await client.post({
          path: `/${pageId}/photos`,
          accessToken,
          json: {
            url: media.downloadUrl,
            published: false,
            ...(media.altText === null ? {} : { alt_text_custom: media.altText }),
          },
          operation: 'facebook.upload_photo',
        });
        client.require(response, 'facebook.upload_photo');
        const photo = client.parse(facebookPostSchema, response, 'facebook.upload_photo');
        prepared.push({
          mediaId: media.mediaId,
          providerMediaId: photo.id,
          providerContainerId: null,
          uploadUrl: null,
          state: 'ready',
          checksum: media.sha256,
          variant: 'facebook:photo',
          metadata: { pageId },
        });
      }
      return prepared;
    },

    async preview(draft: ProviderDraft): Promise<CanonicalPreview> {
      return buildPreview(draft, draft.capabilities, {
        unit: 'utf16',
        mediaLayout: draft.media.some((item) => item.kind === 'video')
          ? 'video'
          : draft.media.length > 1
            ? 'grid'
            : 'single',
        linkRendering: 'card',
        resolvesMentionsAtRender: true,
        privacyLabelKey: null,
        warningKeys: [],
      });
    },

    async publish(request: PublishRequest): Promise<PublishResult> {
      const { connection, draft } = request;
      const accessToken = await token(connection);
      const options = facebookProviderOptionsSchema.parse(draft.providerOptions);
      const pageId = connection.externalAccountId;

      const existing = request.resume['postId'];
      const adoptedId = typeof existing === 'string' && existing !== '' ? existing : null;

      let postId = adoptedId;
      if (postId === null) {
        const photoIds = request.preparedMedia
          .filter((prepared) => prepared.variant === 'facebook:photo')
          .map((prepared) => prepared.providerMediaId)
          .filter((value): value is string => value !== null);
        const videoId = request.preparedMedia.find(
          (prepared) => prepared.variant === 'facebook:video',
        )?.providerMediaId;

        if (videoId !== undefined && videoId !== null) {
          const response = await client.post({
            path: `/${videoId}`,
            accessToken,
            json: {
              published: true,
              description: draft.body,
              ...(options.videoTitle === undefined ? {} : { title: options.videoTitle }),
            },
            operation: 'facebook.publish_video',
          });
          client.require(response, 'facebook.publish_video');
          postId = videoId;
        } else {
          const response = await client.post({
            path: `/${pageId}/feed`,
            accessToken,
            json: {
              message: draft.body,
              ...(options.link === undefined ? {} : { link: options.link }),
              ...(photoIds.length > 0
                ? { attached_media: photoIds.map((id) => ({ media_fbid: id })) }
                : {}),
            },
            operation: 'facebook.create_post',
          });
          client.require(response, 'facebook.create_post');
          const created = client.parse(facebookPostSchema, response, 'facebook.create_post');
          postId = created.post_id ?? created.id;
        }
      }

      if (postId === null) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'facebook.create_post',
          remediationKey: REMEDIATION.contactSupport,
          details: { reason: 'no_post_id' },
        });
      }

      const lookup = await client.get({
        path: `/${postId}`,
        accessToken,
        query: { fields: 'id,permalink_url' },
        operation: 'facebook.read_permalink',
      });
      const permalink = lookup.ok
        ? (client.parse(facebookPostSchema, lookup, 'facebook.read_permalink').permalink_url ?? null)
        : null;

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
        const comment = await client.post({
          path: `/${postId}/comments`,
          accessToken,
          json: { message: item.body },
          operation: 'facebook.create_comment',
        });
        items.push({
          kind: item.kind,
          order: item.order,
          threadItemId: item.id,
          state: comment.ok ? 'published' : 'failed',
          externalPostId: comment.ok
            ? client.parse(facebookCommentSchema, comment, 'facebook.create_comment').id
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
        externalPostId: postId,
        permalink,
        root: {
          kind: 'root',
          order: 0,
          threadItemId: null,
          state: 'published',
          externalPostId: postId,
          permalink,
          errorClass: null,
          errorCode: null,
          remediationKey: null,
        },
        items,
        pollToken: postId,
        resume: { postId },
        sanitizedProviderResponse: { postId, adopted: adoptedId !== null },
        costMinor: null,
        currency: null,
      };
    },

    async getStatus(input: StatusRequest): Promise<PublishStatus> {
      const accessToken = await token(input.connection);
      const response = await client.get({
        path: `/${input.pollToken}`,
        accessToken,
        query: { fields: 'id,permalink_url,is_published,status' },
        operation: 'facebook.get_status',
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
      const video = facebookVideoSchema.safeParse(response.body);
      const videoStatus = video.success ? video.data.status?.video_status : undefined;
      if (videoStatus !== undefined && videoStatus !== 'ready') {
        return {
          state: 'processing',
          externalPostId: null,
          permalink: null,
          errorClass: null,
          remediationKey: null,
          sanitizedProviderResponse: { videoStatus },
        };
      }
      const parsed = client.parse(facebookPostSchema, response, 'facebook.get_status');
      return {
        state: 'published',
        externalPostId: parsed.id,
        permalink: parsed.permalink_url ?? null,
        errorClass: null,
        remediationKey: null,
        sanitizedProviderResponse: { isPublished: parsed.is_published ?? true },
      };
    },

    async deletePost(input: DeleteRequest): Promise<void> {
      const accessToken = await token(input.connection);
      const response = await client.delete({
        path: `/${input.externalPostId}`,
        accessToken,
        operation: 'facebook.delete_post',
      });
      client.require(response, 'facebook.delete_post');
    },

    async fetchMetrics(input: MetricsRequest): Promise<MetricObservation[]> {
      const accessToken = await token(input.connection);
      const observedAt = nowIso();

      if (input.scope === 'account') {
        const response = await client.get({
          path: `/${input.connection.externalAccountId}/insights`,
          accessToken,
          query: { metric: FACEBOOK_ACCOUNT_METRIC_QUERY, period: 'day' },
          operation: 'facebook.page_insights',
        });
        if (!response.ok) {
          return mapMetrics({
            provider: PROVIDER,
            scope: 'account',
            mappings: FACEBOOK_ACCOUNT_METRICS,
            values: {},
            observedAt,
            rawPayload: { status: response.status },
            missingAvailability:
              response.status === 403 ? 'unavailable_permission' : 'unavailable_provider',
          });
        }
        const parsed = client.parse(facebookInsightsSchema, response, 'facebook.page_insights');
        const values = readInsights(parsed);
        return mapMetrics({
          provider: PROVIDER,
          scope: 'account',
          mappings: FACEBOOK_ACCOUNT_METRICS,
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
          mappings: [...FACEBOOK_POST_METRICS, ...FACEBOOK_ENGAGEMENT_METRICS],
          values: {},
          observedAt,
          rawPayload: {},
          missingAvailability: 'unavailable_pending',
        });
      }

      const insights = await client.get({
        path: `/${externalPostId}/insights`,
        accessToken,
        query: { metric: FACEBOOK_POST_METRIC_QUERY },
        operation: 'facebook.post_insights',
      });
      const insightValues = insights.ok
        ? readInsights(client.parse(facebookInsightsSchema, insights, 'facebook.post_insights'))
        : {};

      const post = await client.get({
        path: `/${externalPostId}`,
        accessToken,
        query: { fields: FACEBOOK_POST_FIELDS },
        operation: 'facebook.post_engagement',
      });
      const engagementValues = post.ok ? readEngagement(post.body) : {};

      return [
        ...mapMetrics({
          provider: PROVIDER,
          scope: 'post',
          mappings: FACEBOOK_POST_METRICS,
          values: insightValues,
          observedAt,
          rawPayload: insightValues,
          missingAvailability:
            insights.status === 403 ? 'unavailable_permission' : 'unavailable_provider',
        }),
        ...mapMetrics({
          provider: PROVIDER,
          scope: 'post',
          mappings: FACEBOOK_ENGAGEMENT_METRICS,
          values: engagementValues,
          observedAt,
          rawPayload: engagementValues,
          missingAvailability:
            post.status === 403 ? 'unavailable_permission' : 'unavailable_provider',
        }),
      ];
    },

    async refreshCredential(input: RefreshRequest): Promise<CredentialResult> {
      const current = await token(input.connection);
      return refreshMetaCredential(deps, PROVIDER, current);
    },
  };
}

/** Recent Page posts, used to answer "did the post get created?" after a timeout. */
export async function findRecentFacebookPost(
  deps: ConnectorDeps,
  connection: ProviderConnection,
  message: string,
): Promise<string | null> {
  const client = createMetaClient(deps, PROVIDER);
  const accessToken = await deps.vault.getAccessToken(connection.credentialRef);
  const response = await client.get({
    path: `/${connection.externalAccountId}/feed`,
    accessToken,
    query: { fields: 'id,message,created_time', limit: 10 },
    operation: 'facebook.recent_posts',
  });
  client.require(response, 'facebook.recent_posts');
  const parsed = client.parse(facebookPostListSchema, response, 'facebook.recent_posts');
  const match = parsed.data.find((post) => (post.message ?? '') === message);
  return match === undefined ? null : (match.post_id ?? match.id);
}
