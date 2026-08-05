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
import { createMetaClient, metaContainerSchema, metaPublishSchema } from '../graph.js';
import { metaAuthorization, refreshMetaCredential } from '../oauth.js';
import { THREADS_CAROUSEL_MAX, THREADS_CAROUSEL_MIN, buildThreadsCapabilities } from './capabilities.js';
import { accessTokenOf, errorSummary, providerOptionsOf } from '../../shared/access.js';
import { NOT_IMPLEMENTED_FEATURES } from '../../../contract.js';
import type { FailedItem, PublishedItem } from '../../../contract.js';
import {
  THREADS_ACCOUNT_METRICS,
  THREADS_ACCOUNT_METRIC_QUERY,
  THREADS_MEDIA_FIELDS,
  THREADS_POST_METRICS,
  THREADS_POST_METRIC_QUERY,
} from './metrics.js';
import {
  threadsContainerStatusSchema,
  threadsInsightsSchema,
  threadsMediaListSchema,
  threadsMediaSchema,
  threadsProfileSchema,
  threadsProviderOptionsSchema,
  type ThreadsInsights,
} from './schemas.js';

/**
 * Threads connector (launch fallback).
 *
 * Container lifecycle, the same shape as Instagram: create a container, poll until ready,
 * publish the container, then read the permalink. Carousels create child containers first.
 * The same crash recovery rules apply: reuse the container, never create a second one, and
 * query status before publishing.
 *
 * Threads reports container progress in a `status` field rather than Instagram's
 * `status_code`, which is why the status read is local to this adapter.
 */

const PROVIDER = 'threads' as const;
const READY_STATUSES = new Set(['FINISHED', 'PUBLISHED']);
const FAILED_STATUSES = new Set(['ERROR', 'EXPIRED']);

function readInsights(payload: ThreadsInsights): Record<string, unknown> {
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

export function createThreadsConnector(deps: ConnectorDeps): SocialConnector {
  const client = createMetaClient(deps, PROVIDER);
  const { vault, clock } = deps;

  async function token(connection: ProviderConnection): Promise<string> {
    return accessTokenOf(connection);
  }

  function nowIso(): string {
    return clock.now().toISOString();
  }

  interface ContainerState {
    readonly ready: boolean;
    readonly failed: boolean;
    readonly status: string;
    readonly errorMessage: string | null;
  }

  async function containerState(
    accessToken: string,
    containerId: string,
  ): Promise<ContainerState> {
    const response = await client.get({
      path: `/${containerId}`,
      accessToken,
      query: { fields: 'id,status,error_message' },
      operation: 'threads.container_status',
    });
    const parsed = client.parse(
      threadsContainerStatusSchema,
      response,
      'threads.container_status',
    );
    const status = parsed.status ?? 'IN_PROGRESS';
    return {
      ready: READY_STATUSES.has(status),
      failed: FAILED_STATUSES.has(status),
      status,
      errorMessage: parsed.error_message ?? null,
    };
  }

  async function createContainer(
    accessToken: string,
    userId: string,
    payload: Record<string, unknown>,
    operation: string,
  ): Promise<string> {
    const response = await client.post({
      path: `/${userId}/threads`,
      accessToken,
      json: payload,
      operation,
    });
    client.require(response, operation);
    return client.parse(metaContainerSchema, response, operation).id;
  }

  async function publishContainer(
    accessToken: string,
    userId: string,
    containerId: string,
  ): Promise<string> {
    const response = await client.post({
      path: `/${userId}/threads_publish`,
      accessToken,
      json: { creation_id: containerId },
      operation: 'threads.publish_container',
    });
    client.require(response, 'threads.publish_container');
    return client.parse(metaPublishSchema, response, 'threads.publish_container').id;
  }

  function mediaPayload(media: ProviderMedia): Record<string, unknown> {
    return media.kind === 'video'
      ? { media_type: 'VIDEO', video_url: media.sourceUrl }
      : {
          media_type: 'IMAGE',
          image_url: media.sourceUrl,
          ...(media.altText === null ? {} : { alt_text: media.altText }),
        };
  }

  async function readPermalink(accessToken: string, mediaId: string): Promise<string | null> {
    const response = await client.get({
      path: `/${mediaId}`,
      accessToken,
      query: { fields: THREADS_MEDIA_FIELDS },
      operation: 'threads.read_permalink',
    });
    if (!response.ok) {
      return null;
    }
    return client.parse(threadsMediaSchema, response, 'threads.read_permalink').permalink ?? null;
  }

  return {
    identity(): ProviderIdentity {
      return {
        provider: PROVIDER,
        displayName: 'Threads',
        iconToken: 'provider.threads',
        accountTypes: ['personal_profile', 'creator_profile', 'business_profile'],
        officialDocsUrl: 'https://developers.facebook.com/docs/threads',
        officialPolicyUrl: 'https://developers.facebook.com/terms',
        engineeringOwner: 'Backend/Connectors 1',
        policyOwner: 'Policy Owner',
        lastPolicyReviewAt: `${SOURCE_VERIFIED_ON}T00:00:00.000Z`,
        nextPolicyReviewAt: '2027-02-04T00:00:00.000Z',
        contractVersion: CONNECTOR_CONTRACT_VERSION,
        connectorVersion: '1.0.0',
        // Meta app review is not complete.
        label: 'beta',
        limitationKey: 'connectors.threads.review_pending',
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
        path: '/me',
        accessToken: await grant.accessToken.use((plaintext) => plaintext),
        query: { fields: 'id,username,name,threads_profile_picture_url' },
        operation: 'threads.discover_accounts',
      });
      client.require(response, 'threads.discover_accounts');
      const profile = client.parse(threadsProfileSchema, response, 'threads.discover_accounts');
      return [
        {
          externalAccountId: profile.id,
          accountType: 'personal_profile',
          displayName: profile.name ?? profile.username ?? 'Threads account',
          handle: profile.username ?? null,
          profileUrl:
            profile.username === undefined ? null : `https://www.threads.net/@${profile.username}`,
          accountAccessToken: null,
          avatarUrl: profile.threads_profile_picture_url ?? null,
          parentExternalId: null,
          eligible: grant.grantedScopes.includes('threads_content_publish'),
          ineligibleReasonKey: grant.grantedScopes.includes('threads_content_publish')
            ? null
            : 'connectors.threads.publish_scope_missing',
          grantedScopes: [...grant.grantedScopes],
          metadata: { username: profile.username ?? null },
        },
      ];
    },

    async getCapabilities(connection: ProviderConnection) {
      return buildThreadsCapabilities({
        connection,
        observedAt: nowIso(),
        grantedScopes: connection.grantedScopes,
      });
    },

    async validateDraft(draft: ProviderDraft): Promise<ValidationResult> {
      const targetId = draft.connection.connectionId;
      threadsProviderOptionsSchema.parse(providerOptionsOf(draft));
      const issues: ValidationIssue[] = [
        ...validateDraftShape(draft, draft.capabilities, {
          unit: 'grapheme',
          allowMixedMedia: false,
        }),
      ];
      if (draft.contentKind === 'carousel') {
        if (draft.media.length < THREADS_CAROUSEL_MIN) {
          issues.push(
            validationIssue({
              code: 'CAROUSEL_TOO_FEW_ITEMS',
              severity: 'error',
              field: 'media',
              targetId,
              remediationKey: REMEDIATION.mediaInvalid,
              params: { provider: PROVIDER, count: draft.media.length, minimum: THREADS_CAROUSEL_MIN },
            }),
          );
        }
        if (draft.media.length > THREADS_CAROUSEL_MAX) {
          issues.push(
            validationIssue({
              code: 'CAROUSEL_TOO_MANY_ITEMS',
              severity: 'error',
              field: 'media',
              targetId,
              remediationKey: REMEDIATION.mediaInvalid,
              params: { provider: PROVIDER, count: draft.media.length, limit: THREADS_CAROUSEL_MAX },
            }),
          );
        }
      }
      return validationResult({ issues });
    },

    async prepareMedia(input: MediaPreparationRequest): Promise<PreparedMedia[]> {
      const accessToken = await token(input.connection);
      const userId = input.connection.externalAccountId;
      const isCarousel = input.contentKind === 'carousel';
      const prepared: PreparedMedia[] = [];
      for (const media of input.media) {
        const containerId = isCarousel
          ? await createContainer(
              accessToken,
              userId,
              { ...mediaPayload(media), is_carousel_item: true },
              'threads.create_child_container',
            )
          : null;
        prepared.push({
          mediaId: media.mediaId,
          derivativeId: media.derivativeId,
          providerMediaId: null,
          containerId,
          uploadState: containerId === null ? 'ready' : 'processing',
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
      const options = threadsProviderOptionsSchema.parse(providerOptionsOf(draft));
      return buildPreview(draft, draft.capabilities, {
        unit: 'grapheme',
        mediaLayout:
          draft.contentKind === 'carousel'
            ? 'carousel'
            : draft.media.some((item) => item.kind === 'video')
              ? 'video'
              : 'single',
        linkRendering: 'card',
        resolvesMentionsAtRender: true,
        privacyLabelKey: `connectors.threads.reply_control.${options.replyControl ?? 'everyone'}`,
        warningKeys: [],
      });
    },

    async publish(request: PublishRequest): Promise<PublishResult> {
      const { draft } = request;
      const { connection } = draft;
      const accessToken = await token(connection);
      const options = threadsProviderOptionsSchema.parse(providerOptionsOf(draft));
      const userId = connection.externalAccountId;


      let containerId =
        null;

      if (containerId === null) {
        if (draft.contentKind === 'carousel') {
          const children = request.preparedMedia
            .map((prepared) => prepared.containerId)
            .filter((value): value is string => value !== null);
          containerId = await createContainer(
            accessToken,
            userId,
            {
              media_type: 'CAROUSEL',
              children,
              text: draft.body,
              ...(options.replyControl === undefined
                ? {}
                : { reply_control: options.replyControl }),
              ...(options.replyToId === undefined ? {} : { reply_to_id: options.replyToId }),
            },
            'threads.create_carousel_container',
          );
        } else {
          const media = draft.media[0];
          containerId = await createContainer(
            accessToken,
            userId,
            {
              ...(media === undefined ? { media_type: 'TEXT' } : mediaPayload(media)),
              text: draft.body,
              ...(options.replyControl === undefined
                ? {}
                : { reply_control: options.replyControl }),
              ...(options.replyToId === undefined ? {} : { reply_to_id: options.replyToId }),
            },
            'threads.create_container',
          );
        }
      }

      const state = await containerState(accessToken, containerId);
      if (state.failed) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'threads.container_status',
          remediationCode:
            state.status === 'EXPIRED'
              ? REMEDIATION.providerRateLimited
              : REMEDIATION.providerRejectedContent,
          details: {
            status: state.status,
            ...(state.errorMessage === null
              ? {}
              : { providerMessage: state.errorMessage.slice(0, 300) }),
          },
        });
      }
      if (!state.ready) {
        // The container exists but is still building. This is provider processing.
        return {
          status: 'pending',
          providerJobId: containerId,
          pollAfterSeconds: 15,
          giveUpAt: new Date(clock.now().getTime() + 60 * 60 * 1000).toISOString(),
          sanitizedResponse: { containerStatus: state.status },
          providerRequestId: null,
        };
      }

      const mediaId = await publishContainer(accessToken, userId, containerId);
      const permalink = await readPermalink(accessToken, mediaId);

      const publishedOrders = new Set<number>();
      const items: PublishedItem[] = [];
      const failures: FailedItem[] = [];
      let previousId = mediaId;
      let pending = false;
      let failed = false;

      for (const item of [...draft.threadItems].sort((left, right) => left.order - right.order)) {
        if (publishedOrders.has(item.order)) {
          continue;
        }
        // A delayed reply belongs to the thread sequence workflow, which gives it
        // its own receipt. Nothing is reported for it here.
        if (item.delaySeconds > 0) {
          continue;
        }
        try {
          const replyContainer = await createContainer(
            accessToken,
            userId,
            { media_type: 'TEXT', text: item.body, reply_to_id: previousId },
            'threads.create_reply_container',
          );
          const replyState = await containerState(accessToken, replyContainer);
          if (!replyState.ready) {
            failures.push({
              kind: item.kind,
              order: item.order,
              threadItemId: item.threadItemId,
              error: errorSummary({
                errorClass: 'TRANSIENT_PROVIDER',
                remediationCode: REMEDIATION.providerRejectedContent,
                messageKey: 'connectors.threads.reply_processing',
                retryable: true,
              }),
            });
            continue;
          }
          const replyId = await publishContainer(accessToken, userId, replyContainer);
          previousId = replyId;
          publishedOrders.add(item.order);
          items.push({
            kind: item.kind,
            order: item.order,
            threadItemId: item.threadItemId,
            externalPostId: replyId,
            permalink: await readPermalink(accessToken, replyId),
            publishedAt: nowIso(),
          });
        } catch {
          // A failed part never invalidates a root post that already exists externally.
          failures.push({
            kind: item.kind,
            order: item.order,
            threadItemId: item.threadItemId,
            error: errorSummary({
              errorClass: 'PERMANENT_PROVIDER',
              remediationCode: REMEDIATION.commentFailedRootPublished,
              messageKey: 'connectors.threads.reply_failed',
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
          externalPostId: mediaId,
          permalink,
          publishedAt,
        },
        ...items,
      ];
      const sanitizedResponse = { mediaId, itemCount: allItems.length };
      // The root exists externally. A failed or still building reply is a partial
      // success, never a failed publish and never a rollback.
      if (failures.length > 0) {
        return {
          status: 'partial',
          externalPostId: mediaId,
          permalink,
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
        externalPostId: mediaId,
        permalink,
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
      const media = await client.get({
        path: `/${input.providerJobId}`,
        accessToken,
        query: { fields: THREADS_MEDIA_FIELDS },
        operation: 'threads.get_status',
      });
      if (media.ok) {
        const parsed = client.parse(threadsMediaSchema, media, 'threads.get_status');
        if (parsed.permalink !== undefined) {
          return {
            state: 'published',
            externalPostId: parsed.id,
            permalink: parsed.permalink,
          publishedAt: nowIso(),
          items: [],
          error: null,
          pollAfterSeconds: null,
            sanitizedResponse: { mediaType: parsed.media_type ?? 'unknown' },
          };
        }
      }
      if (input.providerJobId === null) {
        return {
          state: 'unknown',
          externalPostId: null,
          permalink: null,
          publishedAt: null,
          items: [],
          error: null,
          pollAfterSeconds: 30,
          sanitizedResponse: { reason: 'no_container_id' },
        };
      }
      const state = await containerState(accessToken, input.providerJobId);
      if (state.failed) {
        return {
          state: 'failed',
          externalPostId: null,
          permalink: null,
          publishedAt: null,
          items: [],
          error: errorSummary({
            errorClass: 'PERMANENT_PROVIDER',
            remediationCode:
              state.status === 'EXPIRED'
                ? REMEDIATION.providerRateLimited
                : REMEDIATION.providerRejectedContent,
            messageKey: 'connectors.threads.container_failed',
            retryable: false,
          }),
          pollAfterSeconds: null,
          sanitizedResponse: { status: state.status },
        };
      }
      return {
        state: 'processing',
        externalPostId: null,
        permalink: null,
          publishedAt: null,
          items: [],
          error: null,
          pollAfterSeconds: 15,
        sanitizedResponse: { status: state.status },
      };
    },

    async fetchMetrics(input: MetricsRequest): Promise<MetricObservation[]> {
      const accessToken = await token(input.connection);
      const observedAt = nowIso();

      if (input.scope === 'account') {
        const response = await client.get({
          path: `/${input.connection.externalAccountId}/threads_insights`,
          accessToken,
          query: { metric: THREADS_ACCOUNT_METRIC_QUERY },
          operation: 'threads.account_insights',
        });
        if (!response.ok) {
          return mapMetrics({
            provider: PROVIDER,
            scope: 'account',
            mappings: THREADS_ACCOUNT_METRICS,
            values: {},
            observedAt,
            rawPayload: { status: response.status },
            missingAvailability:
              response.status === 403 ? 'unavailable_permission' : 'unavailable_provider',
          });
        }
        const parsed = client.parse(threadsInsightsSchema, response, 'threads.account_insights');
        const values = readInsights(parsed);
        return mapMetrics({
          provider: PROVIDER,
          scope: 'account',
          mappings: THREADS_ACCOUNT_METRICS,
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
          mappings: THREADS_POST_METRICS,
          values: {},
          observedAt,
          rawPayload: {},
          missingAvailability: 'unavailable_pending',
        });
      }
      const response = await client.get({
        path: `/${externalPostId}/insights`,
        accessToken,
        query: { metric: THREADS_POST_METRIC_QUERY },
        operation: 'threads.media_insights',
      });
      if (!response.ok) {
        return mapMetrics({
          provider: PROVIDER,
          scope: 'post',
          mappings: THREADS_POST_METRICS,
          values: {},
          observedAt,
          rawPayload: { status: response.status },
          missingAvailability:
            response.status === 403 ? 'unavailable_permission' : 'unavailable_provider',
        });
      }
      const parsed = client.parse(threadsInsightsSchema, response, 'threads.media_insights');
      const values = readInsights(parsed);
      return mapMetrics({
        provider: PROVIDER,
        scope: 'post',
        mappings: THREADS_POST_METRICS,
        values,
        observedAt,
        rawPayload: values,
      });
    },

    async refreshCredential(input: RefreshRequest): Promise<CredentialResult> {
      const current = await input.refreshToken.use((plaintext) => plaintext);
      return refreshMetaCredential(deps, PROVIDER, current);
    },
  };
}

/** Recent posts, used defensively after a timeout before anything is retried. */
export async function findRecentThreadsPost(
  deps: ConnectorDeps,
  connection: ProviderConnection,
  text: string,
): Promise<string | null> {
  const client = createMetaClient(deps, 'threads');
  const accessToken = await accessTokenOf(connection);
  const response = await client.get({
    path: `/${connection.externalAccountId}/threads`,
    accessToken,
    query: { fields: 'id,text,timestamp', limit: 10 },
    operation: 'threads.recent_posts',
  });
  client.require(response, 'threads.recent_posts');
  const parsed = client.parse(threadsMediaListSchema, response, 'threads.recent_posts');
  const match = parsed.data.find((post) => (post.text ?? '') === text);
  return match === undefined ? null : match.id;
}
