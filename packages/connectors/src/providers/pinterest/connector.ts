import {
  validationIssue,
  validationResult,
  type MetricObservation,
  type ValidationResult,
} from '@relay/contracts';

import {
  CONNECTOR_CONTRACT_VERSION,
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
  type SocialConnector,
  type StatusRequest,
} from '../shared/contract-shape';
import { refreshOAuth2Token } from '../shared/contract-shape';
import { buildPreview } from '../shared/preview';
import { validateDraftShape } from '../shared/validate';
import { SOURCE_VERIFIED_ON } from '../shared/verification';
import { buildPinterestCapabilities } from './capabilities';
import { pinterestBoardsResponseSchema, pinterestPinSchema, pinterestUserSchema } from './schemas';

/**
 * Pinterest connector on the official v5 API.
 *
 * A pin needs a board and an image. The v5 API pulls the image bytes from an HTTPS URL,
 * so `prepareMedia` passes through the verified, short-lived source URL and `publish`
 * sends it in `media_source`. Write access requires app review, which is the stated beta
 * limitation.
 */

const PROVIDER = 'pinterest' as const;
const API_LIVE = 'https://api.pinterest.com';

function boardIdOf(draft: ProviderDraft): string | null {
  const destination = draft.destination?.externalId ?? null;
  return destination === null || destination === '' ? null : destination;
}

export function createPinterestConnector(deps: ConnectorDeps): SocialConnector {
  const { http, clock } = deps;

  function nowIso(): string {
    return clock.now().toISOString();
  }

  async function api(
    method: 'GET' | 'POST' | 'DELETE',
    connection: ProviderConnection,
    path: string,
    operation: string,
    options: {
      readonly json?: unknown;
      readonly query?: Readonly<Record<string, string | number | boolean | undefined>>;
    } = {},
  ) {
    const accessToken = await connection.accessToken.use((value) => value);
    const response = await http.request({
      method,
      url: `${API_LIVE}${path}`,
      headers: { authorization: `Bearer ${accessToken}` },
      ...(options.query === undefined ? {} : { query: options.query }),
      ...(options.json === undefined ? {} : { json: options.json }),
      accept: 'json',
      provider: PROVIDER,
      operation,
    });
    ensureOk(response, { provider: PROVIDER, operation, response });
    return response;
  }

  return {
    identity(): ProviderIdentity {
      return {
        provider: PROVIDER,
        displayName: 'Pinterest',
        iconToken: 'provider.pinterest',
        accountTypes: ['business_profile'],
        connectorVersion: '1.0.0',
        label: 'beta',
        limitationKey: 'connectors.pinterest.review_pending',
        officialDocsUrl: 'https://developers.pinterest.com/docs/api/v5/',
        officialPolicyUrl: 'https://policy.pinterest.com/en/terms-of-service',
        engineeringOwner: 'Backend/Connectors 2',
        policyOwner: 'Policy Owner',
        lastPolicyReviewAt: `${SOURCE_VERIFIED_ON}T00:00:00.000Z`,
        nextPolicyReviewAt: '2027-02-04T00:00:00.000Z',
        contractVersion: CONNECTOR_CONTRACT_VERSION,
        features: {
          ...NOT_IMPLEMENTED_FEATURES,
          discover_accounts: 'supported',
          list_destinations: 'supported',
          get_capabilities: 'supported',
          validate_draft: 'supported',
          prepare_media: 'supported',
          preview: 'supported',
          publish: 'supported',
          get_status: 'supported',
          delete_post: 'supported',
          refresh_credential: 'supported',
          provider_idempotency: 'unsupported',
          post_analytics: 'unsupported',
          account_analytics: 'unsupported',
          alt_text: 'unsupported',
          video: 'not_implemented',
        },
      };
    },

    authorization(): AuthorizationDefinition {
      return {
        flavor: 'oauth2_pkce',
        authorizeUrl: 'https://www.pinterest.com/oauth/',
        tokenUrl: 'https://api.pinterest.com/v5/oauth/token',
        revokeUrl: null,
        redirectPath: '/oauth/pinterest/callback',
        scopes: [
          {
            scope: 'user_accounts:read',
            explanationKey: 'connectors.pinterest.scope.user_accounts_read',
            usedBy: ['connections'],
            required: true,
          },
          {
            scope: 'boards:read',
            explanationKey: 'connectors.pinterest.scope.boards_read',
            usedBy: ['composer'],
            required: true,
          },
          {
            scope: 'pins:read',
            explanationKey: 'connectors.pinterest.scope.pins_read',
            usedBy: ['composer'],
            required: true,
          },
          {
            scope: 'pins:write',
            explanationKey: 'connectors.pinterest.scope.pins_write',
            usedBy: ['composer', 'queue'],
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
      const accessToken = await grant.accessToken.use((value) => value);
      const response = await http.request({
        method: 'GET',
        url: `${API_LIVE}/v5/user_account`,
        headers: { authorization: `Bearer ${accessToken}` },
        accept: 'json',
        provider: PROVIDER,
        operation: 'pinterest.get_me',
      });
      ensureOk(response, {
        provider: PROVIDER,
        operation: 'pinterest.get_me',
        response,
        remediationCode: REMEDIATION.reconnectAccount,
      });
      const user = parseProviderBody(pinterestUserSchema, response, {
        provider: PROVIDER,
        operation: 'pinterest.get_me',
        response,
      });
      return [
        {
          externalAccountId: user.id ?? user.username,
          accountType: 'business_profile',
          displayName: user.username,
          handle: user.username,
          avatarUrl: null,
          profileUrl: `https://www.pinterest.com/${user.username}/`,
          parentExternalId: null,
          grantedScopes: [...grant.grantedScopes],
          eligible: true,
          ineligibleReasonKey: null,
          accountAccessToken: null,
          metadata: {},
        },
      ];
    },

    async listDestinations(input: DestinationRequest): Promise<ProviderDestination[]> {
      const response = await api('GET', input.connection, '/v5/boards', 'pinterest.list_boards', {
        query: { page_size: input.limit },
      });
      const parsed = parseProviderBody(pinterestBoardsResponseSchema, response, {
        provider: PROVIDER,
        operation: 'pinterest.list_boards',
        response,
      });
      const refreshedAt = nowIso();
      const expiresAt = new Date(clock.now().getTime() + 60 * 60 * 1000).toISOString();
      return parsed.items.map((board) => ({
        externalId: board.id,
        kind: 'board' as const,
        displayLabel: board.name ?? board.id,
        parentExternalId: null,
        canPost: true,
        refreshedAt,
        expiresAt,
        metadata: { url: board.url ?? null },
      }));
    },

    async getCapabilities(connection: ProviderConnection) {
      return buildPinterestCapabilities({ connection, observedAt: nowIso() });
    },

    async validateDraft(draft: ProviderDraft): Promise<ValidationResult> {
      const issues = validateDraftShape(draft, draft.capabilities, {
        unit: 'grapheme',
        requireAltText: false,
        allowMixedMedia: false,
        requiresMedia: true,
      });
      if (boardIdOf(draft) === null) {
        issues.push(
          validationIssue({
            code: 'DESTINATION_REQUIRED',
            severity: 'error',
            field: 'destination',
            targetId: draft.connection.connectionId,
            remediationKey: REMEDIATION.fixContent,
            params: { provider: PROVIDER },
          }),
        );
      }
      return validationResult({ issues });
    },

    async prepareMedia(input: MediaPreparationRequest): Promise<PreparedMedia[]> {
      // The v5 API fetches image bytes from a URL, so preparation passes through the
      // verified, short-lived source URL.
      return input.media.map((media) => ({
        mediaId: media.mediaId,
        derivativeId: media.derivativeId,
        providerMediaId: null,
        containerId: null,
        uploadState: 'ready' as const,
        derivativeChecksum: media.checksum,
        byteSize: media.byteSize,
        altTextApplied: media.altText !== null && media.altText !== '',
        publicUrl: media.sourceUrl,
        expiresAt: media.sourceUrlExpiresAt,
        reusedFromPreviousAttempt: false,
      }));
    },

    async preview(draft: ProviderDraft): Promise<CanonicalPreview> {
      return buildPreview(draft, draft.capabilities, {
        unit: 'grapheme',
        mediaLayout: draft.media.length > 0 ? 'single' : 'none',
        linkRendering: 'card',
        resolvesMentionsAtRender: true,
        privacyLabelKey: null,
        warningKeys: [],
      });
    },

    async publish(request: PublishRequest): Promise<PublishResult> {
      const { draft } = request;
      const boardId = boardIdOf(draft);
      if (boardId === null) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'pinterest.create_pin',
          remediationCode: REMEDIATION.fixContent,
          details: { reason: 'BOARD_MISSING' },
        });
      }
      const image = request.preparedMedia.find((item) => item.publicUrl !== null);
      if (image === undefined) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'pinterest.create_pin',
          remediationCode: REMEDIATION.mediaInvalid,
          details: { reason: 'PIN_REQUIRES_IMAGE' },
        });
      }
      const response = await api('POST', draft.connection, '/v5/pins', 'pinterest.create_pin', {
        json: {
          board_id: boardId,
          title: draft.title ?? undefined,
          description: draft.body,
          media_source: { source_type: 'image_url', url: image.publicUrl },
        },
      });
      const pin = parseProviderBody(pinterestPinSchema, response, {
        provider: PROVIDER,
        operation: 'pinterest.create_pin',
        response,
      });
      const publishedAt = nowIso();
      const item: PublishItemResult = {
        kind: 'root',
        order: 0,
        threadItemId: null,
        externalPostId: pin.id,
        permalink: pin.url ?? null,
        publishedAt,
      };
      return {
        status: 'published',
        externalPostId: pin.id,
        permalink: pin.url ?? null,
        publishedAt,
        items: [item],
        sanitizedResponse: { id: pin.id },
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
      const response = await api(
        'GET',
        input.connection,
        `/v5/pins/${encodeURIComponent(externalPostId)}`,
        'pinterest.get_status',
      );
      const pin = parseProviderBody(pinterestPinSchema, response, {
        provider: PROVIDER,
        operation: 'pinterest.get_status',
        response,
      });
      const publishedAt = nowIso();
      return {
        state: 'published',
        externalPostId: pin.id,
        permalink: pin.url ?? null,
        publishedAt,
        items: [
          {
            kind: 'root' as const,
            order: 0,
            threadItemId: null,
            externalPostId: pin.id,
            permalink: pin.url ?? null,
            publishedAt,
          },
        ],
        error: null,
        pollAfterSeconds: null,
        sanitizedResponse: { id: pin.id },
      };
    },

    async deletePost(input: DeleteRequest): Promise<void> {
      await api(
        'DELETE',
        input.connection,
        `/v5/pins/${encodeURIComponent(input.externalPostId)}`,
        'pinterest.delete_pin',
      );
    },

    async fetchMetrics(input: MetricsRequest): Promise<MetricObservation[]> {
      void input;
      // Pinterest exposes no engagement metrics through the v5 API without analytics access.
      return [];
    },

    async refreshCredential(input: RefreshRequest): Promise<CredentialResult> {
      const clientId = deps.config.providers.pinterest.clientId;
      if (clientId === undefined) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'pinterest.refresh_credential',
          remediationCode: REMEDIATION.contactSupport,
          details: { missingConfig: 'PINTEREST_CLIENT_ID' },
        });
      }
      return await input.refreshToken.use(
        async (refreshToken) =>
          await refreshOAuth2Token({
            http,
            clock,
            provider: PROVIDER,
            tokenUrl: 'https://api.pinterest.com/v5/oauth/token',
            clientId,
            ...(deps.config.providers.pinterest.clientSecret === undefined
              ? {}
              : { clientSecret: deps.config.providers.pinterest.clientSecret }),
            refreshToken,
          }),
      );
    },
  };
}
