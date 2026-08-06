import {
  validationResult,
  type MetricObservation,
  type ValidationIssue,
  type ValidationResult,
} from '@relay/contracts';

import {
  CONNECTOR_CONTRACT_VERSION,
  NOT_IMPLEMENTED_FEATURES,
  REMEDIATION,
  SecretValue,
  ensureOk,
  parseProviderBody,
  type AuthorizationDefinition,
  type CanonicalPreview,
  type ConnectorDeps,
  type CredentialResult,
  type DeleteRequest,
  type ExternalAccount,
  type FailedItem,
  type MediaPreparationRequest,
  type MentionEntity,
  type MentionSearchRequest,
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
  type RevokeRequest,
  type SocialConnector,
  type StatusRequest,
} from '../shared/contract-shape';
import { accessTokenOf, errorSummary, providerOptionsOf } from '../shared/access';
import { buildMultipart, fetchMediaBytes } from '../shared/multipart';
import { mapMetrics } from '../shared/metrics';
import { buildPreview } from '../shared/preview';
import { validateDraftShape } from '../shared/validate';
import { SOURCE_VERIFIED_ON } from '../shared/verification';
import { buildMastodonCapabilities } from './capabilities';
import { MASTODON_ACCOUNT_METRICS, MASTODON_POST_METRICS } from './metrics';
import {
  mastodonAccountSchema,
  mastodonMediaCreateSchema,
  mastodonProviderOptionsSchema,
  mastodonSearchSchema,
  mastodonStatusCreateSchema,
  mastodonStatusSchema,
} from './schemas';

/**
 * Mastodon connector on the Mastodon REST API.
 *
 * Per-connection authentication matches the Bluesky connector: the user creates an
 * application on their own instance, and the access token is stored as a first-class
 * secret in the vault. Any instance works because the instance URL travels in connection
 * metadata, with the configured default as a fallback for the authorization definition.
 */

const PROVIDER = 'mastodon' as const;
const DEFAULT_SERVICE = 'https://mastodon.social';
const TOKEN_DOCS = 'https://docs.joinmastodon.org/user/security/#tokens';

function serviceUrl(deps: ConnectorDeps, connection?: ProviderConnection): string {
  const fromConnection = connection?.metadata['instanceUrl'];
  if (typeof fromConnection === 'string' && fromConnection !== '') {
    return fromConnection.replace(/\/$/u, '');
  }
  return (deps.config.providers.mastodon.instanceUrl ?? DEFAULT_SERVICE).replace(/\/$/u, '');
}

export function createMastodonConnector(deps: ConnectorDeps): SocialConnector {
  const { http, clock, logger } = deps;

  function nowIso(): string {
    return clock.now().toISOString();
  }

  async function apiGet(
    connection: ProviderConnection,
    path: string,
    query: Readonly<Record<string, string | number | boolean | undefined>>,
    operation: string,
  ) {
    const accessToken = await accessTokenOf(connection);
    return http.request({
      method: 'GET',
      url: `${serviceUrl(deps, connection)}${path}`,
      headers: { authorization: `Bearer ${accessToken}` },
      query,
      accept: 'json',
      provider: PROVIDER,
      operation,
    });
  }

  async function uploadMedia(
    connection: ProviderConnection,
    media: ProviderMedia,
  ): Promise<PreparedMedia> {
    const bytes = await fetchMediaBytes(http, media, PROVIDER);
    const multipart = buildMultipart(
      [],
      [
        {
          name: 'file',
          filename: `relay-${media.mediaId}.bin`,
          contentType: media.mimeType,
          bytes,
        },
      ],
    );
    const accessToken = await accessTokenOf(connection);
    const response = await http.request({
      method: 'POST',
      url: `${serviceUrl(deps, connection)}/api/v1/media`,
      headers: { authorization: `Bearer ${accessToken}` },
      body: multipart.body,
      contentType: multipart.contentType,
      accept: 'json',
      provider: PROVIDER,
      operation: 'mastodon.upload_media',
    });
    ensureOk(response, {
      provider: PROVIDER,
      operation: 'mastodon.upload_media',
      response,
      remediationCode: REMEDIATION.mediaInvalid,
    });
    const parsed = parseProviderBody(mastodonMediaCreateSchema, response, {
      provider: PROVIDER,
      operation: 'mastodon.upload_media',
      response,
    });
    return {
      mediaId: media.mediaId,
      derivativeId: media.derivativeId,
      providerMediaId: parsed.id,
      containerId: null,
      uploadState: 'ready',
      derivativeChecksum: media.checksum,
      byteSize: media.byteSize,
      altTextApplied: media.altText !== null && media.altText !== '',
      publicUrl: parsed.url ?? null,
      expiresAt: null,
      reusedFromPreviousAttempt: false,
    };
  }

  async function createStatus(
    connection: ProviderConnection,
    input: {
      status: string;
      mediaIds?: readonly string[];
      visibility?: string;
      inReplyToId?: string | null;
      operation: string;
    },
  ) {
    const accessToken = await accessTokenOf(connection);
    const response = await http.request({
      method: 'POST',
      url: `${serviceUrl(deps, connection)}/api/v1/statuses`,
      headers: { authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' },
      json: {
        status: input.status,
        ...(input.mediaIds === undefined || input.mediaIds.length === 0
          ? {}
          : { media_ids: input.mediaIds }),
        ...(input.visibility === undefined ? {} : { visibility: input.visibility }),
        ...(input.inReplyToId === undefined || input.inReplyToId === null
          ? {}
          : { in_reply_to_id: input.inReplyToId }),
      },
      accept: 'json',
      provider: PROVIDER,
      operation: input.operation,
    });
    ensureOk(response, { provider: PROVIDER, operation: input.operation, response });
    return parseProviderBody(mastodonStatusCreateSchema, response, {
      provider: PROVIDER,
      operation: input.operation,
      response,
    });
  }

  function visibilityOf(draft: ProviderDraft): string | undefined {
    if (draft.privacyValue !== null) {
      return draft.privacyValue;
    }
    const parsed = mastodonProviderOptionsSchema.parse(providerOptionsOf(draft));
    return parsed.visibility ?? parsed.privacyValue;
  }

  return {
    identity(): ProviderIdentity {
      return {
        provider: PROVIDER,
        displayName: 'Mastodon',
        iconToken: 'provider.mastodon',
        accountTypes: ['personal_profile'],
        connectorVersion: '1.0.0',
        label: 'beta',
        limitationKey: 'connectors.mastodon.review_pending',
        officialDocsUrl: 'https://docs.joinmastodon.org/api/rest/statuses/',
        officialPolicyUrl: 'https://mastodon.social/terms',
        engineeringOwner: 'Backend/Connectors 2',
        policyOwner: 'Policy Owner',
        lastPolicyReviewAt: `${SOURCE_VERIFIED_ON}T00:00:00.000Z`,
        nextPolicyReviewAt: '2027-02-04T00:00:00.000Z',
        contractVersion: CONNECTOR_CONTRACT_VERSION,
        features: {
          ...NOT_IMPLEMENTED_FEATURES,
          discover_accounts: 'supported',
          search_mentions: 'supported',
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
          provider_idempotency: 'unsupported',
          post_analytics: 'supported',
          account_analytics: 'supported',
          privacy_controls: 'supported',
          alt_text: 'supported',
          video: 'supported',
        },
      };
    },

    authorization(): AuthorizationDefinition {
      return {
        flavor: 'provider_specific',
        authorizeUrl: TOKEN_DOCS,
        tokenUrl: `${serviceUrl(deps)}/oauth/token`,
        revokeUrl: `${serviceUrl(deps)}/oauth/revoke`,
        redirectPath: '/oauth/mastodon/callback',
        scopes: [
          {
            scope: 'read',
            explanationKey: 'connectors.mastodon.scope.read',
            usedBy: ['connections', 'analytics'],
            required: true,
          },
          {
            scope: 'write:statuses',
            explanationKey: 'connectors.mastodon.scope.write_statuses',
            usedBy: ['composer', 'queue'],
            required: true,
          },
        ],
        pkceRequired: false,
        multiStep: false,
        stepDescriptionKeys: ['connectors.mastodon.app_token_note'],
        supportsRefresh: false,
        refreshAtLifetimeFraction: 0.75,
        extraAuthorizeParameters: {},
      };
    },

    async discoverAccounts(grant: OAuthGrant): Promise<ExternalAccount[]> {
      const accessToken = await grant.accessToken.use((value) => value);
      const response = await http.request({
        method: 'GET',
        url: `${serviceUrl(deps)}/api/v1/accounts/verify_credentials`,
        headers: { authorization: `Bearer ${accessToken}` },
        accept: 'json',
        provider: PROVIDER,
        operation: 'mastodon.verify_credentials',
      });
      ensureOk(response, {
        provider: PROVIDER,
        operation: 'mastodon.verify_credentials',
        response,
        remediationCode: REMEDIATION.reconnectAccount,
      });
      const account = parseProviderBody(mastodonAccountSchema, response, {
        provider: PROVIDER,
        operation: 'mastodon.verify_credentials',
        response,
      });
      return [
        {
          externalAccountId: account.id,
          accountType: 'personal_profile',
          displayName: account.display_name ?? account.username,
          handle: account.acct,
          avatarUrl: account.avatar ?? null,
          profileUrl: account.url ?? null,
          parentExternalId: null,
          grantedScopes: [...grant.grantedScopes],
          eligible: true,
          ineligibleReasonKey: null,
          accountAccessToken: null,
          metadata: { acct: account.acct, instanceUrl: serviceUrl(deps) },
        },
      ];
    },

    async searchMentions(input: MentionSearchRequest): Promise<MentionEntity[]> {
      const query = input.query.replace(/^@/u, '').trim();
      if (query === '') {
        return [];
      }
      const response = await apiGet(
        input.connection,
        '/api/v2/search',
        { q: query, type: 'accounts', resolve: true, limit: input.limit },
        'mastodon.search_mentions',
      );
      if (!response.ok) {
        logger.warn(
          { provider: PROVIDER, status: response.status },
          'mastodon mention lookup unavailable',
        );
        return [];
      }
      const parsed = parseProviderBody(mastodonSearchSchema, response, {
        provider: PROVIDER,
        operation: 'mastodon.search_mentions',
        response,
      });
      const resolvedAt = nowIso();
      return parsed.accounts.map((account) => ({
        externalId: account.id,
        displayLabel: account.display_name ?? account.username,
        handle: account.acct,
        kind: 'person' as const,
        avatarUrl: account.avatar ?? null,
        resolvedToExternalId: false,
        resolvedAt,
      }));
    },

    async getCapabilities(connection: ProviderConnection) {
      return buildMastodonCapabilities({ connection, observedAt: nowIso() });
    },

    async validateDraft(draft: ProviderDraft): Promise<ValidationResult> {
      mastodonProviderOptionsSchema.parse(providerOptionsOf(draft));
      const issues: ValidationIssue[] = validateDraftShape(draft, draft.capabilities, {
        unit: 'grapheme',
        requireAltText: false,
        allowMixedMedia: false,
      });
      // The shared rule already enforces snapshot.text.maxLength = 500, which is the
      // value this connector declares, so no separate character check is needed here.
      return validationResult({ issues });
    },

    async prepareMedia(input: MediaPreparationRequest): Promise<PreparedMedia[]> {
      const prepared: PreparedMedia[] = [];
      for (const media of input.media) {
        prepared.push(await uploadMedia(input.connection, media));
      }
      return prepared;
    },

    async preview(draft: ProviderDraft): Promise<CanonicalPreview> {
      return buildPreview(draft, draft.capabilities, {
        unit: 'grapheme',
        mediaLayout: draft.media.some((item) => item.kind === 'video') ? 'video' : 'grid',
        linkRendering: 'inline_text',
        resolvesMentionsAtRender: true,
        privacyLabelKey: null,
        warningKeys: [],
      });
    },

    async publish(request: PublishRequest): Promise<PublishResult> {
      const { draft } = request;
      const connection = draft.connection;
      const visibility = visibilityOf(draft);
      const mediaIds = request.preparedMedia
        .filter((item) => item.providerMediaId !== null)
        .map((item) => item.providerMediaId as string);

      const root = await createStatus(connection, {
        status: draft.body,
        mediaIds,
        visibility,
        inReplyToId: null,
        operation: 'mastodon.create_post',
      });
      const publishedAt = nowIso();

      const rootItem: PublishItemResult = {
        kind: 'root',
        order: 0,
        threadItemId: null,
        externalPostId: root.id,
        permalink: root.url ?? root.uri ?? null,
        publishedAt,
      };
      const items: PublishItemResult[] = [rootItem];
      const failures: FailedItem[] = [];
      let parentId = root.id;
      let pending = false;

      for (const item of [...draft.threadItems].sort((left, right) => left.order - right.order)) {
        if (item.delaySeconds > 0) {
          pending = true;
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
          const reply = await createStatus(connection, {
            status: item.body,
            visibility,
            inReplyToId: parentId,
            operation: 'mastodon.create_reply',
          });
          parentId = reply.id;
          items.push({
            kind: item.kind,
            order: item.order,
            threadItemId: item.threadItemId,
            externalPostId: reply.id,
            permalink: reply.url ?? reply.uri ?? null,
            publishedAt,
          });
        } catch (error) {
          failures.push({
            kind: item.kind,
            order: item.order,
            threadItemId: item.threadItemId,
            error: {
              errorClass: 'TRANSIENT_PROVIDER',
              remediationCode: REMEDIATION.commentFailedRootPublished,
              messageKey: 'state.partially_published.label',
              retryable: true,
              providerMessage: error instanceof Error ? error.message : null,
            },
          });
        }
      }

      const sanitizedResponse = { rootId: root.id, itemCount: items.length, pending };
      if (failures.length > 0) {
        return {
          status: 'partial',
          externalPostId: root.id,
          permalink: root.url ?? root.uri ?? null,
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
        externalPostId: root.id,
        permalink: root.url ?? root.uri ?? null,
        publishedAt,
        items,
        sanitizedResponse,
        providerRequestId: null,
        costMinor: null,
        currency: null,
      };
    },

    async getStatus(input: StatusRequest): Promise<PublishStatus> {
      const externalPostId = input.externalPostId ?? input.providerJobId;
      if (externalPostId === null) {
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
      const response = await apiGet(
        input.connection,
        `/api/v1/statuses/${encodeURIComponent(externalPostId)}`,
        {},
        'mastodon.get_status',
      );
      if (!response.ok) {
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
      const parsed = parseProviderBody(mastodonStatusSchema, response, {
        provider: PROVIDER,
        operation: 'mastodon.get_status',
        response,
      });
      const publishedAt = parsed.created_at;
      return {
        state: 'published',
        externalPostId: parsed.id,
        permalink: parsed.url ?? parsed.uri ?? null,
        publishedAt,
        items: [
          {
            kind: 'root' as const,
            order: 0,
            threadItemId: null,
            externalPostId: parsed.id,
            permalink: parsed.url ?? parsed.uri ?? null,
            publishedAt,
          },
        ],
        error: null,
        pollAfterSeconds: null,
        sanitizedResponse: { id: parsed.id },
      };
    },

    async deletePost(input: DeleteRequest): Promise<void> {
      const accessToken = await accessTokenOf(input.connection);
      const response = await http.request({
        method: 'DELETE',
        url: `${serviceUrl(deps, input.connection)}/api/v1/statuses/${encodeURIComponent(input.externalPostId)}`,
        headers: { authorization: `Bearer ${accessToken}` },
        accept: 'json',
        provider: PROVIDER,
        operation: 'mastodon.delete_post',
      });
      ensureOk(response, {
        provider: PROVIDER,
        operation: 'mastodon.delete_post',
        response,
        remediationCode: REMEDIATION.contactSupport,
      });
    },

    async fetchMetrics(input: MetricsRequest): Promise<MetricObservation[]> {
      const observedAt = nowIso();
      if (input.scope === 'account') {
        const response = await apiGet(
          input.connection,
          `/api/v1/accounts/${encodeURIComponent(input.connection.externalAccountId)}`,
          {},
          'mastodon.account_metrics',
        );
        if (!response.ok) {
          return mapMetrics({
            provider: PROVIDER,
            scope: 'account',
            mappings: MASTODON_ACCOUNT_METRICS,
            values: {},
            observedAt,
            rawPayload: { status: response.status },
            missingAvailability:
              response.status === 401 ? 'unavailable_permission' : 'unavailable_provider',
          });
        }
        const account = parseProviderBody(mastodonAccountSchema, response, {
          provider: PROVIDER,
          operation: 'mastodon.account_metrics',
          response,
        });
        const values = {
          statuses_count: account.statuses_count,
          followers_count: account.followers_count,
          following_count: account.following_count,
        };
        return mapMetrics({
          provider: PROVIDER,
          scope: 'account',
          mappings: MASTODON_ACCOUNT_METRICS,
          values,
          observedAt,
          rawPayload: values,
        });
      }

      const externalPostId = input.externalPostId;
      if (externalPostId === null) {
        return mapMetrics({
          provider: PROVIDER,
          scope: 'post',
          mappings: MASTODON_POST_METRICS,
          values: {},
          observedAt,
          rawPayload: {},
          missingAvailability: 'unavailable_pending',
        });
      }
      const response = await apiGet(
        input.connection,
        `/api/v1/statuses/${encodeURIComponent(externalPostId)}`,
        {},
        'mastodon.post_metrics',
      );
      if (!response.ok) {
        return mapMetrics({
          provider: PROVIDER,
          scope: 'post',
          mappings: MASTODON_POST_METRICS,
          values: {},
          observedAt,
          rawPayload: { status: response.status },
          missingAvailability:
            response.status === 401 ? 'unavailable_permission' : 'unavailable_provider',
        });
      }
      const status = parseProviderBody(mastodonStatusSchema, response, {
        provider: PROVIDER,
        operation: 'mastodon.post_metrics',
        response,
      });
      const values = {
        reblogs_count: status.reblogs_count,
        favourites_count: status.favourites_count,
        replies_count: status.replies_count,
      };
      return mapMetrics({
        provider: PROVIDER,
        scope: 'post',
        mappings: MASTODON_POST_METRICS,
        values,
        observedAt,
        rawPayload: values,
      });
    },

    async refreshCredential(input: RefreshRequest): Promise<CredentialResult> {
      // Mastodon access tokens are long lived and the API does not issue refresh tokens,
      // so a refresh is a no-op that returns the same credential.
      const current = await input.refreshToken.use((value) => value);
      return {
        accessToken: new SecretValue(current, 'access_token'),
        refreshToken: null,
        tokenType: 'bearer',
        expiresAt: null,
        grantedScopes: [...input.grantedScopes],
        refreshTokenRotated: false,
        obtainedAt: nowIso(),
      };
    },

    async revoke(input: RevokeRequest): Promise<void> {
      const accessToken = await input.accessToken.use((value) => value);
      const response = await http.request({
        method: 'POST',
        url: `${serviceUrl(deps)}/oauth/revoke`,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {
          client_id: deps.config.providers.mastodon.clientId ?? '',
          client_secret: deps.config.providers.mastodon.clientSecret ?? '',
          token: accessToken,
        },
        accept: 'json',
        provider: PROVIDER,
        operation: 'mastodon.revoke',
      });
      if (!response.ok) {
        logger.warn(
          { provider: PROVIDER, status: response.status },
          'mastodon token revocation did not succeed',
        );
      }
    },
  };
}
