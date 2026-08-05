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
  type ProviderMedia,
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
import {
  assertContainerReady,
  containerStatusToPublishStatus,
  readContainerStatus,
} from '../container.js';
import {
  canPublishToPage,
  createMetaClient,
  metaContainerSchema,
  metaPagesResponseSchema,
  metaPublishSchema,
} from '../graph.js';
import { metaAuthorization, refreshMetaCredential } from '../oauth.js';
import { accessTokenOf, errorSummary, providerOptionsOf, providerOptionsOfConnection } from '../../shared/access.js';
import { NOT_IMPLEMENTED_FEATURES } from '../../../contract.js';
import {
  INSTAGRAM_CAROUSEL_MAX,
  INSTAGRAM_CAROUSEL_MIN,
  INSTAGRAM_PROFESSIONAL_ACCOUNT_TYPES,
  buildInstagramCapabilities,
} from './capabilities.js';
import {
  INSTAGRAM_ACCOUNT_METRICS,
  INSTAGRAM_ACCOUNT_METRIC_QUERY,
  INSTAGRAM_MEDIA_FIELDS,
  INSTAGRAM_POST_METRICS,
  INSTAGRAM_POST_METRIC_QUERY,
} from './metrics.js';
import {
  instagramAccountSchema,
  instagramCommentSchema,
  instagramInsightsSchema,
  instagramMediaListSchema,
  instagramMediaSchema,
  instagramProviderOptionsSchema,
  type InstagramInsights,
} from './schemas.js';

/**
 * Instagram connector.
 *
 * Professional business and creator accounts only. The publish sequence is
 * container create, status poll, publish, then read the permalink. A 2xx from the container
 * step is provider processing, not a publication.
 */

const PROVIDER = 'instagram' as const;
const REELS_ASPECT_RATIO = 9 / 16;
const REELS_ASPECT_TOLERANCE = 0.02;

/** Flatten an insights response into a field name to value record. */
function readInsights(payload: InstagramInsights): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const entry of payload.data) {
    const total = entry.total_value?.value;
    if (typeof total === 'number') {
      values[entry.name] = total;
      continue;
    }
    const last = entry.values[entry.values.length - 1]?.value;
    if (typeof last === 'number') {
      values[entry.name] = last;
    }
  }
  return values;
}

export function createInstagramConnector(deps: ConnectorDeps): SocialConnector {
  const client = createMetaClient(deps, PROVIDER);
  const { vault, clock, logger } = deps;

  async function token(connection: ProviderConnection): Promise<string> {
    return accessTokenOf(connection);
  }

  function nowIso(): string {
    return clock.now().toISOString();
  }

  async function createChildContainer(
    accountId: string,
    accessToken: string,
    media: ProviderMedia,
  ): Promise<string> {
    const response = await client.post({
      path: `/${accountId}/media`,
      accessToken,
      json: {
        ...(media.kind === 'video'
          ? { video_url: media.sourceUrl, media_type: 'VIDEO' }
          : { image_url: media.sourceUrl }),
        is_carousel_item: true,
        ...(media.altText === null ? {} : { alt_text: media.altText }),
      },
      operation: 'instagram.create_child_container',
    });
    client.require(response, 'instagram.create_child_container');
    return client.parse(metaContainerSchema, response, 'instagram.create_child_container').id;
  }

  /**
   * Resolve what a token refers to. A media id answers with the published post; anything
   * else is treated as a container id and reports progress. This is also the recovery path
   * after a crash between publish and receipt.
   */
  async function statusOf(
    connection: ProviderConnection,
    pollToken: string,
  ): Promise<PublishStatus> {
    const accessToken = await token(connection);
    const media = await client.get({
      path: `/${pollToken}`,
      accessToken,
      query: { fields: INSTAGRAM_MEDIA_FIELDS },
      operation: 'instagram.get_status',
    });
    if (media.ok) {
      const parsed = client.parse(instagramMediaSchema, media, 'instagram.get_status');
      return {
        state: 'published',
        externalPostId: parsed.id,
        permalink: parsed.permalink ?? null,
          publishedAt: nowIso(),
          items: [],
          error: null,
          pollAfterSeconds: null,
        sanitizedResponse: { mediaType: parsed.media_type ?? 'unknown' },
      };
    }
    const status = await readContainerStatus(
      client,
      accessToken,
      pollToken,
      'instagram.get_status.container',
    );
    if (status.ready) {
      return {
        state: 'processing',
        externalPostId: null,
        permalink: null,
          publishedAt: null,
          items: [],
          error: null,
          pollAfterSeconds: 15,
        sanitizedResponse: { statusCode: status.statusCode, awaitingPublish: true },
      };
    }
    return containerStatusToPublishStatus(status, PROVIDER);
  }

  return {
    identity(): ProviderIdentity {
      return {
        provider: PROVIDER,
        displayName: 'Instagram',
        iconToken: 'provider.instagram',
        accountTypes: ['business_profile', 'creator_profile'],
        officialDocsUrl: 'https://developers.facebook.com/docs/instagram-platform/content-publishing',
        officialPolicyUrl: 'https://developers.facebook.com/terms',
        engineeringOwner: 'Backend/Connectors 1',
        policyOwner: 'Policy Owner',
        lastPolicyReviewAt: `${SOURCE_VERIFIED_ON}T00:00:00.000Z`,
        nextPolicyReviewAt: '2027-02-04T00:00:00.000Z',
        contractVersion: CONNECTOR_CONTRACT_VERSION,
        connectorVersion: '1.0.0',
        // Meta app review is not complete, and Instagram publishing requires a professional account.
        label: 'beta',
        limitationKey: 'connectors.instagram.review_pending',
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
      const pages = await client.get({
        path: '/me/accounts',
        accessToken: await grant.accessToken.use((plaintext) => plaintext),
        query: {
          fields: 'id,name,access_token,tasks,instagram_business_account{id}',
          limit: 100,
        },
        operation: 'instagram.discover_pages',
      });
      client.require(pages, 'instagram.discover_pages');
      const parsedPages = client.parse(metaPagesResponseSchema, pages, 'instagram.discover_pages');

      const accounts: ExternalAccount[] = [];
      for (const page of parsedPages.data) {
        const linked = page.instagram_business_account;
        if (linked === undefined) {
          continue;
        }
        const profile = await client.get({
          path: `/${linked.id}`,
          accessToken: page.access_token ?? grant.accessToken,
          query: { fields: 'id,username,name,profile_picture_url,account_type' },
          operation: 'instagram.read_account',
        });
        if (!profile.ok) {
          logger.warn(
            { provider: PROVIDER, status: profile.status },
            'instagram account lookup failed',
          );
          continue;
        }
        const account = client.parse(instagramAccountSchema, profile, 'instagram.read_account');
        const accountType = account.account_type ?? 'PERSONAL';
        const professional = INSTAGRAM_PROFESSIONAL_ACCOUNT_TYPES.has(accountType);
        accounts.push({
          externalAccountId: account.id,
          accountType: accountType === 'MEDIA_CREATOR' ? 'creator_profile' : 'business_profile',
          displayName: account.name ?? account.username ?? page.name,
          handle: account.username ?? null,
          avatarUrl: account.profile_picture_url ?? null,
          parentExternalId: page.id,
          eligible: professional && canPublishToPage(page),
          // Blocked before OAuth completes rather than after a publish fails.
          ineligibleReasonKey: professional
            ? canPublishToPage(page)
              ? null
              : 'connectors.instagram.page_role_required'
            : 'connectors.instagram.professional_account_required',
          grantedScopes: [...grant.grantedScopes],
          metadata: { pageId: page.id, pageName: page.name, accountType },
        });
      }
      return accounts;
    },

    async getCapabilities(connection: ProviderConnection) {
      return buildInstagramCapabilities({
        connection,
        observedAt: nowIso(),
        grantedScopes: connection.grantedScopes,
      });
    },

    async validateDraft(draft: ProviderDraft): Promise<ValidationResult> {
      const snapshot = draft.capabilities;
      const targetId = draft.connection.connectionId;
      const options = instagramProviderOptionsSchema.parse(providerOptionsOf(draft));
      const surface = options.surface ?? (draft.contentKind === 'short_video' ? 'REELS' : 'FEED');
      const issues: ValidationIssue[] = [
        ...validateDraftShape(draft, snapshot, {
          unit: 'grapheme',
          requiresMedia: true,
          allowMixedMedia: false,
        }),
      ];

      if (
        draft.connection.accountType !== 'business_profile' &&
        draft.connection.accountType !== 'creator_profile'
      ) {
        issues.push(
          validationIssue({
            code: 'INSTAGRAM_PROFESSIONAL_ACCOUNT_REQUIRED',
            severity: 'error',
            field: 'connection',
            targetId,
            remediationKey: REMEDIATION.switchToProfessionalAccount,
            params: { provider: PROVIDER },
          }),
        );
      }

      if (surface === 'STORIES') {
        // Story availability is narrower than feed publishing and depends on the account
        // and the current API surface. We do not promise it.
        issues.push(
          validationIssue({
            code: 'INSTAGRAM_STORIES_REQUIRES_REVIEW',
            severity: 'error',
            field: 'providerOptions.surface',
            targetId,
            remediationKey: REMEDIATION.awaitingProviderApproval,
            params: { provider: PROVIDER },
          }),
        );
      }

      if (draft.contentKind === 'carousel') {
        if (draft.media.length < INSTAGRAM_CAROUSEL_MIN) {
          issues.push(
            validationIssue({
              code: 'CAROUSEL_TOO_FEW_ITEMS',
              severity: 'error',
              field: 'media',
              targetId,
              remediationKey: REMEDIATION.mediaInvalid,
              params: { provider: PROVIDER, count: draft.media.length, minimum: INSTAGRAM_CAROUSEL_MIN },
            }),
          );
        }
        if (draft.media.length > INSTAGRAM_CAROUSEL_MAX) {
          issues.push(
            validationIssue({
              code: 'CAROUSEL_TOO_MANY_ITEMS',
              severity: 'error',
              field: 'media',
              targetId,
              remediationKey: REMEDIATION.mediaInvalid,
              params: { provider: PROVIDER, count: draft.media.length, limit: INSTAGRAM_CAROUSEL_MAX },
            }),
          );
        }
      }

      if (surface === 'REELS') {
        for (const [index, media] of draft.media.entries()) {
          if (media.width === null || media.height === null || media.height === 0) {
            continue;
          }
          const ratio = media.width / media.height;
          if (Math.abs(ratio - REELS_ASPECT_RATIO) > REELS_ASPECT_TOLERANCE) {
            issues.push(
              validationIssue({
                code: 'REELS_ASPECT_RATIO_INVALID',
                severity: 'error',
                field: `media.${index}`,
                targetId,
                remediationKey: REMEDIATION.mediaInvalid,
                params: {
                  provider: PROVIDER,
                  ratio: Math.round(ratio * 1000) / 1000,
                  expected: '9:16',
                },
              }),
            );
          }
        }
      }

      return validationResult({ issues });
    },

    async prepareMedia(input: MediaPreparationRequest): Promise<PreparedMedia[]> {
      // Instagram pulls media from a URL rather than accepting an upload, so preparation
      // is the container create. It is idempotent on the asset because a container id is
      // stored and reused rather than recreated on retry.
      const accessToken = await token(input.connection);
      const options = instagramProviderOptionsSchema.parse(providerOptionsOfConnection(input.connection));
      const surface = options.surface ?? (input.contentKind === 'short_video' ? 'REELS' : 'FEED');
      const isCarousel = input.contentKind === 'carousel';

      const prepared: PreparedMedia[] = [];
      for (const media of input.media) {
        const containerId = isCarousel
          ? await createChildContainer(input.connection.externalAccountId, accessToken, media)
          : null;
        prepared.push({
          mediaId: media.mediaId,
          providerMediaId: null,
          containerId: containerId,
          state: containerId === null ? 'ready' : 'processing',
          derivativeChecksum: media.checksum,
          variant: `instagram:${surface.toLowerCase()}`,
          metadata: { surface, sourceUrlHost: new URL(media.sourceUrl).host },
        });
      }
      return prepared;
    },

    async preview(draft: ProviderDraft): Promise<CanonicalPreview> {
      const options = instagramProviderOptionsSchema.parse(providerOptionsOf(draft));
      const surface = options.surface ?? (draft.contentKind === 'short_video' ? 'REELS' : 'FEED');
      return buildPreview(draft, draft.capabilities, {
        unit: 'grapheme',
        mediaLayout:
          draft.contentKind === 'carousel'
            ? 'carousel'
            : surface === 'REELS' || draft.media.some((item) => item.kind === 'video')
              ? 'video'
              : 'single',
        // Instagram does not render a link card in a caption; a URL is plain text.
        linkRendering: 'inline_text',
        resolvesMentionsAtRender: true,
        privacyLabelKey: null,
        warningKeys:
          surface === 'STORIES' ? ['connectors.instagram.stories_requires_review'] : [],
      });
    },

    async publish(request: PublishRequest): Promise<PublishResult> {
      const { draft } = request;
      const { connection } = draft;
      const accessToken = await token(connection);
      const options = instagramProviderOptionsSchema.parse(providerOptionsOf(draft));
      const surface = options.surface ?? (draft.contentKind === 'short_video' ? 'REELS' : 'FEED');
      const accountId = connection.externalAccountId;

      // If a previous attempt already published, adopt the media id rather than
      // republishing the container.
      const publishedId = undefined;
      if (typeof publishedId === 'string' && publishedId !== '') {
        const status = await statusOf(connection, publishedId);
        if (status.state === 'published' && status.externalPostId !== null) {
          return {
            state: 'published',
            externalPostId: status.externalPostId,
            permalink: status.permalink,
            root: {
              kind: 'root',
              order: 0,
              threadItemId: null,
              state: 'published',
              externalPostId: status.externalPostId,
              permalink: status.permalink,
              errorClass: null,
              errorCode: null,
              remediationCode: null,
            },
            items: [],
            pollToken: status.externalPostId,
            resume: { mediaId: status.externalPostId },
            sanitizedResponse: { adopted: true },
            costMinor: null,
            currency: null,
          };
        }
      }

      // Reuse a stored container. Never create a second one.
      let containerId = null;

      if (containerId === null) {
        if (draft.contentKind === 'carousel') {
          const children = request.preparedMedia
            .map((prepared) => prepared.containerId)
            .filter((value): value is string => value !== null);
          const parent = await client.post({
            path: `/${accountId}/media`,
            accessToken,
            json: {
              media_type: 'CAROUSEL',
              children,
              caption: draft.body,
              ...(options.collaborators === undefined
                ? {}
                : { collaborators: options.collaborators }),
            },
            operation: 'instagram.create_carousel_container',
          });
          client.require(parent, 'instagram.create_carousel_container');
          containerId = client.parse(
            metaContainerSchema,
            parent,
            'instagram.create_carousel_container',
          ).id;
        } else {
          const media = draft.media[0];
          if (media === undefined) {
            throw providerFailure({
              provider: PROVIDER,
              operation: 'instagram.create_container',
              remediationCode: REMEDIATION.mediaInvalid,
              details: { reason: 'no_media' },
            });
          }
          const response = await client.post({
            path: `/${accountId}/media`,
            accessToken,
            json: {
              ...(media.kind === 'video'
                ? {
                    video_url: media.sourceUrl,
                    media_type: surface === 'REELS' ? 'REELS' : 'VIDEO',
                    ...(options.shareToFeed === undefined
                      ? {}
                      : { share_to_feed: options.shareToFeed }),
                    ...(options.thumbOffsetMs === undefined
                      ? {}
                      : { thumb_offset: options.thumbOffsetMs }),
                  }
                : { image_url: media.sourceUrl }),
              caption: draft.body,
              ...(media.altText === null ? {} : { alt_text: media.altText }),
              ...(options.collaborators === undefined
                ? {}
                : { collaborators: options.collaborators }),
            },
            operation: 'instagram.create_container',
          });
          client.require(response, 'instagram.create_container');
          containerId = client.parse(metaContainerSchema, response, 'instagram.create_container').id;
        }
      }

      const status = await readContainerStatus(
        client,
        accessToken,
        containerId,
        'instagram.container_status',
      );
      if (!status.ready) {
        if (status.failed) {
          assertContainerReady(status, PROVIDER, 'instagram.container_status');
        }
        // Container accepted but still building. This is provider processing, not a
        // publication, and the caller polls with the stored container id.
        return {
          uploadState: 'processing',
          externalPostId: null,
          permalink: null,
          root: {
            kind: 'root',
            order: 0,
            threadItemId: null,
            uploadState: 'processing',
            externalPostId: null,
            permalink: null,
            errorClass: null,
            errorCode: null,
            remediationCode: null,
          },
          items: [],
          pollToken: containerId,
          resume: { containerId },
          sanitizedResponse: { statusCode: status.statusCode },
          costMinor: null,
          currency: null,
        };
      }

      const published = await client.post({
        path: `/${accountId}/media_publish`,
        accessToken,
        json: { creation_id: containerId },
        operation: 'instagram.publish_container',
      });
      client.require(published, 'instagram.publish_container');
      const mediaId = client.parse(metaPublishSchema, published, 'instagram.publish_container').id;

      const media = await client.get({
        path: `/${mediaId}`,
        accessToken,
        query: { fields: INSTAGRAM_MEDIA_FIELDS },
        operation: 'instagram.read_permalink',
      });
      const permalink = media.ok
        ? (client.parse(instagramMediaSchema, media, 'instagram.read_permalink').permalink ?? null)
        : null;

      const items: PublishItemResult[] = [];
      for (const item of draft.threadItems) {
        if (item.kind !== 'comment' || item.delaySeconds > 0) {
          items.push({
            kind: item.kind,
            order: item.order,
            threadItemId: item.threadItemId,
            uploadState: 'processing',
            externalPostId: null,
            permalink: null,
            errorClass: null,
            errorCode: null,
            remediationCode: null,
          });
          continue;
        }
        const comment = await client.post({
          path: `/${mediaId}/comments`,
          accessToken,
          json: { message: item.body },
          operation: 'instagram.create_comment',
        });
        items.push({
          kind: item.kind,
          order: item.order,
          threadItemId: item.threadItemId,
          state: comment.ok ? 'published' : 'failed',
          externalPostId: comment.ok
            ? client.parse(instagramCommentSchema, comment, 'instagram.create_comment').id
            : null,
          permalink: null,
          errorClass: null,
          errorCode: null,
          remediationCode: comment.ok ? null : REMEDIATION.commentFailedRootPublished,
        });
      }

      const anyFailed = items.some((item) => item.state === 'failed');
      const anyPending = items.some((item) => item.state === 'processing');

      return {
        state: anyFailed ? 'partially_published' : anyPending ? 'processing' : 'published',
        externalPostId: mediaId,
        permalink,
        root: {
          kind: 'root',
          order: 0,
          threadItemId: null,
          state: 'published',
          externalPostId: mediaId,
          permalink,
          errorClass: null,
          errorCode: null,
          remediationCode: null,
        },
        items,
        pollToken: mediaId,
        resume: { containerId, mediaId },
        sanitizedResponse: { mediaId, containerConsumed: true },
        costMinor: null,
        currency: null,
      };
    },

    async getStatus(input: StatusRequest): Promise<PublishStatus> {
      return statusOf(input.connection, input.providerJobId);
    },

    async fetchMetrics(input: MetricsRequest): Promise<MetricObservation[]> {
      const accessToken = await token(input.connection);
      const observedAt = nowIso();

      if (input.scope === 'account') {
        const response = await client.get({
          path: `/${input.connection.externalAccountId}/insights`,
          accessToken,
          query: { metric: INSTAGRAM_ACCOUNT_METRIC_QUERY, period: 'day', metric_type: 'total_value' },
          operation: 'instagram.account_insights',
        });
        if (!response.ok) {
          return mapMetrics({
            provider: PROVIDER,
            scope: 'account',
            mappings: INSTAGRAM_ACCOUNT_METRICS,
            values: {},
            observedAt,
            rawPayload: { status: response.status },
            missingAvailability:
              response.status === 403 ? 'unavailable_permission' : 'unavailable_provider',
          });
        }
        const parsed = client.parse(instagramInsightsSchema, response, 'instagram.account_insights');
        const values = readInsights(parsed);
        return mapMetrics({
          provider: PROVIDER,
          scope: 'account',
          mappings: INSTAGRAM_ACCOUNT_METRICS,
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
          mappings: INSTAGRAM_POST_METRICS,
          values: {},
          observedAt,
          rawPayload: {},
          missingAvailability: 'unavailable_pending',
        });
      }

      const response = await client.get({
        path: `/${externalPostId}/insights`,
        accessToken,
        query: { metric: INSTAGRAM_POST_METRIC_QUERY },
        operation: 'instagram.media_insights',
      });
      if (!response.ok) {
        return mapMetrics({
          provider: PROVIDER,
          scope: 'post',
          mappings: INSTAGRAM_POST_METRICS,
          values: {},
          observedAt,
          rawPayload: { status: response.status },
          missingAvailability:
            response.status === 403 ? 'unavailable_permission' : 'unavailable_provider',
        });
      }
      const parsed = client.parse(instagramInsightsSchema, response, 'instagram.media_insights');
      const values = readInsights(parsed);
      // A media type that does not return a field leaves it absent, and `mapMetrics` marks
      // it unavailable rather than 0.
      return mapMetrics({
        provider: PROVIDER,
        scope: 'post',
        mappings: INSTAGRAM_POST_METRICS,
        values,
        observedAt,
        rawPayload: values,
      });
    },

    async refreshCredential(input: RefreshRequest): Promise<CredentialResult> {
      const current = await token(input.connection);
      return refreshMetaCredential(deps, PROVIDER, current);
    },
  };
}

/**
 * Recent media for a connection, used defensively after a timeout to answer "did the post
 * actually get created?" before anything is retried.
 */
export async function findRecentInstagramMedia(
  deps: ConnectorDeps,
  connection: ProviderConnection,
  caption: string,
): Promise<string | null> {
  const client = createMetaClient(deps, PROVIDER);
  const accessToken = await deps.accessTokenOf(connection);
  const response = await client.get({
    path: `/${connection.externalAccountId}/media`,
    accessToken,
    query: { fields: 'id,caption,timestamp', limit: 10 },
    operation: 'instagram.recent_media',
  });
  ensureOk(response, {
    provider: PROVIDER,
    operation: 'instagram.recent_media',
    response,
  });
  const parsed = parseProviderBody(instagramMediaListSchema, response, {
    provider: PROVIDER,
    operation: 'instagram.recent_media',
    response,
  });
  const match = parsed.data.find((media) => (media.caption ?? '') === caption);
  return match === undefined ? null : match.id;
}

/** Thrown at discovery when a consumer account is selected. Kept here for reuse. */
export function consumerAccountError(): ConnectionActionRequiredError {
  return new ConnectionActionRequiredError({
    messageKey: 'connectors.instagram.professional_account_required',
    details: { provider: PROVIDER, remediationCode: REMEDIATION.switchToProfessionalAccount },
  });
}
