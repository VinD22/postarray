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
  type PublishRequest,
  type PublishResult,
  type PublishStatus,
  type RefreshRequest,
  type SocialConnector,
  type StatusRequest,
} from '../../shared/contract-shape';
import { mapMetrics } from '../../shared/metrics';
import { buildPreview } from '../../shared/preview';
import { validateDraftShape } from '../../shared/validate';
import { SOURCE_VERIFIED_ON } from '../../shared/verification';
import { canPublishToPage, createMetaClient, metaPagesResponseSchema } from '../graph';
import { metaAuthorization, refreshMetaCredential } from '../oauth';
import { buildFacebookCapabilities } from './capabilities';
import { accessTokenOf, errorSummary, providerOptionsOf } from '../../shared/access';
import { NOT_IMPLEMENTED_FEATURES } from '../../../contract';
import { SecretValue } from '../../../vault';
import type { FailedItem, PublishedItem } from '../../../contract';
import {
  FACEBOOK_ACCOUNT_METRICS,
  FACEBOOK_ACCOUNT_METRIC_QUERY,
  FACEBOOK_ENGAGEMENT_METRICS,
  FACEBOOK_POST_FIELDS,
  FACEBOOK_POST_METRICS,
  FACEBOOK_POST_METRIC_QUERY,
} from './metrics';
import {
  facebookCommentSchema,
  facebookInsightsSchema,
  facebookPostListSchema,
  facebookPostSchema,
  facebookProviderOptionsSchema,
  facebookVideoSchema,
  type FacebookInsights,
} from './schemas';

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
  const { clock } = deps;

  async function token(connection: ProviderConnection): Promise<string> {
    return accessTokenOf(connection);
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
        officialDocsUrl: 'https://developers.facebook.com/docs/pages-api/posts',
        officialPolicyUrl: 'https://developers.facebook.com/terms',
        engineeringOwner: 'Backend/Connectors 1',
        policyOwner: 'Policy Owner',
        lastPolicyReviewAt: `${SOURCE_VERIFIED_ON}T00:00:00.000Z`,
        nextPolicyReviewAt: '2027-02-04T00:00:00.000Z',
        contractVersion: CONNECTOR_CONTRACT_VERSION,
        connectorVersion: '1.0.0',
        // Meta app review has not been completed, so nothing here is "supported".
        label: 'beta',
        limitationKey: 'connectors.facebook.review_pending',
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
      return metaAuthorization(PROVIDER);
    },

    async discoverAccounts(grant: OAuthGrant): Promise<ExternalAccount[]> {
      const response = await client.get({
        path: '/me/accounts',
        accessToken: await grant.accessToken.use((plaintext) => plaintext),
        query: { fields: 'id,name,access_token,tasks,category,picture{url}', limit: 100 },
        operation: 'facebook.discover_pages',
      });
      client.require(response, 'facebook.discover_pages');
      const parsed = client.parse(metaPagesResponseSchema, response, 'facebook.discover_pages');
      return parsed.data.map((page) => ({
        externalAccountId: page.id,
        accountType: 'page' as const,
        displayName: page.name,
        handle: null,
        avatarUrl: page.picture?.data?.url ?? null,
        profileUrl: `https://www.facebook.com/${page.id}`,
        parentExternalId: null,
        // A Page issues its own token; it is what every later call uses.
        accountAccessToken:
          page.access_token === undefined ? null : new SecretValue(page.access_token),
        eligible: canPublishToPage(page),
        ineligibleReasonKey: canPublishToPage(page)
          ? null
          : 'connectors.facebook.page_role_required',
        grantedScopes: [...grant.grantedScopes],
        // The tasks are recorded so a later role change is detectable, not only expiry.
        metadata: { tasks: page.tasks ?? [], category: page.category ?? null },
      }));
    },

    async getCapabilities(connection: ProviderConnection) {
      return buildFacebookCapabilities({
        connection,
        observedAt: nowIso(),
        grantedScopes: connection.grantedScopes,
      });
    },

    async validateDraft(draft: ProviderDraft): Promise<ValidationResult> {
      const targetId = draft.connection.connectionId;
      facebookProviderOptionsSchema.parse(providerOptionsOf(draft));
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
              file_url: media.sourceUrl,
              published: false,
              ...(media.altText === null ? {} : { description: media.altText }),
            },
            operation: 'facebook.upload_video',
          });
          client.require(response, 'facebook.upload_video');
          const video = client.parse(facebookVideoSchema, response, 'facebook.upload_video');
          prepared.push({
            mediaId: media.mediaId,
            derivativeId: media.derivativeId,
            providerMediaId: video.id,
            containerId: null,
            uploadState: 'processing',
            derivativeChecksum: media.checksum,
            byteSize: media.byteSize,
            altTextApplied: media.altText !== null,
            publicUrl: null,
            expiresAt: null,
            reusedFromPreviousAttempt: false,
          });
          continue;
        }
        // Unpublished photos are attached to the feed post so several can share one post.
        const response = await client.post({
          path: `/${pageId}/photos`,
          accessToken,
          json: {
            url: media.sourceUrl,
            published: false,
            ...(media.altText === null ? {} : { alt_text_custom: media.altText }),
          },
          operation: 'facebook.upload_photo',
        });
        client.require(response, 'facebook.upload_photo');
        const photo = client.parse(facebookPostSchema, response, 'facebook.upload_photo');
        prepared.push({
          mediaId: media.mediaId,
          derivativeId: media.derivativeId,
          providerMediaId: photo.id,
          containerId: null,
          uploadState: 'ready',
          derivativeChecksum: media.checksum,
          byteSize: media.byteSize,
          altTextApplied: media.altText !== null,
          publicUrl: null,
          expiresAt: null,
          reusedFromPreviousAttempt: false,
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
      const { draft } = request;
      const { connection } = draft;
      const accessToken = await token(connection);
      const options = facebookProviderOptionsSchema.parse(providerOptionsOf(draft));
      const pageId = connection.externalAccountId;

      // A create that may already have landed is reconciled by the core through
      // getStatus and the content fingerprint, so nothing is adopted here.
      const adoptedId: string | null = null;

      let postId: string | null = adoptedId;
      if (postId === null) {
        // PreparedMedia carries no free form variant, so the kind comes from the
        // draft entry the preparation was derived from.
        const kindOf = (mediaId: string): string | undefined =>
          draft.media.find((item) => item.mediaId === mediaId)?.kind;
        const photoIds = request.preparedMedia
          .filter((prepared) => kindOf(prepared.mediaId) === 'image')
          .map((prepared) => prepared.providerMediaId)
          .filter((value): value is string => value !== null);
        const videoId = request.preparedMedia.find(
          (prepared) => kindOf(prepared.mediaId) === 'video',
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
          remediationCode: REMEDIATION.contactSupport,
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
        ? (client.parse(facebookPostSchema, lookup, 'facebook.read_permalink').permalink_url ??
          null)
        : null;

      const publishedAt = nowIso();
      const items: PublishedItem[] = [
        {
          kind: 'root',
          order: 0,
          threadItemId: null,
          externalPostId: postId,
          permalink,
          publishedAt,
        },
      ];
      const failures: FailedItem[] = [];

      for (const item of draft.threadItems) {
        // A delayed comment is not this connector's job. The thread sequence
        // workflow owns it, and it gets its own receipt.
        if (item.kind !== 'comment' || item.delaySeconds > 0) {
          continue;
        }
        const comment = await client.post({
          path: `/${postId}/comments`,
          accessToken,
          json: { message: item.body },
          operation: 'facebook.create_comment',
        });
        if (comment.ok) {
          items.push({
            kind: item.kind,
            order: item.order,
            threadItemId: item.threadItemId,
            externalPostId: client.parse(facebookCommentSchema, comment, 'facebook.create_comment')
              .id,
            permalink: null,
            publishedAt: nowIso(),
          });
          continue;
        }
        // The root post already exists externally, so a failed comment is a
        // partial success. It must never be reported as a failed publish.
        failures.push({
          kind: item.kind,
          order: item.order,
          threadItemId: item.threadItemId,
          error: errorSummary({
            errorClass: 'PERMANENT_PROVIDER',
            remediationCode: REMEDIATION.commentFailedRootPublished,
            messageKey: 'connectors.facebook.comment_failed',
            retryable: false,
          }),
        });
      }

      const sanitizedResponse = { postId, adopted: adoptedId !== null };
      if (failures.length > 0) {
        return {
          status: 'partial',
          externalPostId: postId,
          permalink,
          publishedAt,
          items,
          failures,
          sanitizedResponse,
          providerRequestId: null,
          costMinor: null,
          currency: null,
        };
      }
      return {
        status: 'published',
        externalPostId: postId,
        permalink,
        publishedAt,
        items,
        sanitizedResponse,
        providerRequestId: null,
        costMinor: null,
        currency: null,
      };
    },

    async getStatus(input: StatusRequest): Promise<PublishStatus> {
      const accessToken = await token(input.connection);
      const response = await client.get({
        path: `/${input.providerJobId ?? input.externalPostId ?? ''}`,
        accessToken,
        query: { fields: 'id,permalink_url,is_published,status' },
        operation: 'facebook.get_status',
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
            messageKey: 'connectors.facebook.post_not_found',
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
          pollAfterSeconds: 30,
          sanitizedResponse: { status: response.status },
        };
      }
      const video = facebookVideoSchema.safeParse(response.body);
      const videoStatus = video.success ? video.data.status?.video_status : undefined;
      if (videoStatus !== undefined && videoStatus !== 'ready') {
        return {
          state: 'processing',
          externalPostId: null,
          permalink: null,
          publishedAt: null,
          items: [],
          error: null,
          pollAfterSeconds: 15,
          sanitizedResponse: { videoStatus },
        };
      }
      const parsed = client.parse(facebookPostSchema, response, 'facebook.get_status');
      return {
        state: 'published',
        externalPostId: parsed.id,
        permalink: parsed.permalink_url ?? null,
        publishedAt: nowIso(),
        items: [],
        error: null,
        pollAfterSeconds: null,
        sanitizedResponse: { isPublished: parsed.is_published ?? true },
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
      const current = await input.refreshToken.use((plaintext) => plaintext);
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
  const accessToken = await accessTokenOf(connection);
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
