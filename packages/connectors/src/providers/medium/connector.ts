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
import { buildMediumCapabilities } from './capabilities';
import { mediumEnvelopeSchema, mediumPostSchema, mediumUserSchema } from './schemas';

/**
 * Medium connector on the official integration API.
 *
 * OAuth2 with PKCE against the user's Medium account. Article creation is synchronous and
 * returns the post id and canonical URL. The integration API has no read-back or delete
 * endpoints, so `getStatus` reports `unknown` honestly and deletion is `unsupported`.
 */

const PROVIDER = 'medium' as const;
const API_BASE = 'https://api.medium.com/v1';

export function createMediumConnector(deps: ConnectorDeps): SocialConnector {
  const { http, clock } = deps;

  function nowIso(): string {
    return clock.now().toISOString();
  }

  async function api(
    method: 'GET' | 'POST',
    path: string,
    accessToken: string,
    operation: string,
    options: { readonly json?: unknown } = {},
  ) {
    const response = await http.request({
      method,
      url: `${API_BASE}${path}`,
      headers: { authorization: `Bearer ${accessToken}` },
      ...(options.json === undefined ? {} : { json: options.json }),
      accept: 'json',
      provider: PROVIDER,
      operation,
    });
    ensureOk(response, { provider: PROVIDER, operation, response });
    return response;
  }

  function parseEnvelope<T>(
    schema: {
      safeParse(value: unknown): { success: true; data: T } | { success: false; error: unknown };
    },
    response: {
      status: number;
      ok: boolean;
      headers: Readonly<Record<string, string>>;
      body: unknown;
    },
    operation: string,
  ): T {
    const envelope = parseProviderBody(mediumEnvelopeSchema, response, {
      provider: PROVIDER,
      operation,
      response,
    });
    const parsed = schema.safeParse(envelope.data);
    if (parsed.success) {
      return parsed.data;
    }
    throw new Error('MEDIUM_ENVELOPE_SHAPE_UNEXPECTED');
  }

  return {
    identity(): ProviderIdentity {
      return {
        provider: PROVIDER,
        displayName: 'Medium',
        iconToken: 'provider.medium',
        accountTypes: ['publication'],
        connectorVersion: '1.0.0',
        label: 'beta',
        limitationKey: 'connectors.medium.review_pending',
        officialDocsUrl: 'https://docs.medium.com/medium-integration-api',
        officialPolicyUrl: 'https://policy.medium.com/medium-terms-of-service',
        engineeringOwner: 'Backend/Connectors 2',
        policyOwner: 'Policy Owner',
        lastPolicyReviewAt: `${SOURCE_VERIFIED_ON}T00:00:00.000Z`,
        nextPolicyReviewAt: '2027-02-04T00:00:00.000Z',
        contractVersion: CONNECTOR_CONTRACT_VERSION,
        features: {
          ...NOT_IMPLEMENTED_FEATURES,
          discover_accounts: 'supported',
          get_capabilities: 'supported',
          validate_draft: 'supported',
          preview: 'supported',
          publish: 'supported',
          get_status: 'supported',
          refresh_credential: 'supported',
          provider_idempotency: 'unsupported',
          post_analytics: 'unsupported',
          account_analytics: 'unsupported',
          alt_text: 'unsupported',
          video: 'unsupported',
          document: 'unsupported',
          carousel: 'unsupported',
        },
      };
    },

    authorization(): AuthorizationDefinition {
      return {
        flavor: 'oauth2_pkce',
        authorizeUrl: 'https://medium.com/m/oauth/authorize',
        tokenUrl: 'https://api.medium.com/v1/tokens',
        revokeUrl: null,
        redirectPath: '/oauth/medium/callback',
        scopes: [
          {
            scope: 'basicProfile',
            explanationKey: 'connectors.medium.scope.basic_profile',
            usedBy: ['connections'],
            required: true,
          },
          {
            scope: 'publishPost',
            explanationKey: 'connectors.medium.scope.publish_post',
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
      const response = await api('GET', '/me', accessToken, 'medium.get_me');
      const user = parseEnvelope(mediumUserSchema, response, 'medium.get_me');
      return [
        {
          externalAccountId: user.id,
          accountType: 'publication',
          displayName: user.name ?? user.username ?? 'Medium author',
          handle: user.username ?? null,
          avatarUrl: user.imageUrl ?? null,
          profileUrl: user.url ?? null,
          parentExternalId: null,
          grantedScopes: [...grant.grantedScopes],
          eligible: true,
          ineligibleReasonKey: null,
          accountAccessToken: null,
          metadata: {},
        },
      ];
    },

    async getCapabilities(connection: ProviderConnection) {
      return buildMediumCapabilities({ connection, observedAt: nowIso() });
    },

    async validateDraft(draft: ProviderDraft): Promise<ValidationResult> {
      const issues = validateDraftShape(draft, draft.capabilities, {
        unit: 'grapheme',
        requireAltText: false,
        allowMixedMedia: false,
      });
      if (draft.title === null || draft.title.trim() === '') {
        issues.push(
          validationIssue({
            code: 'TITLE_REQUIRED',
            severity: 'error',
            field: 'title',
            targetId: draft.connection.connectionId,
            remediationKey: REMEDIATION.fixContent,
            params: { provider: PROVIDER },
          }),
        );
      }
      return validationResult({ issues });
    },

    async prepareMedia(input: MediaPreparationRequest): Promise<PreparedMedia[]> {
      void input;
      // The integration API does not accept media attachments in V1.
      return [];
    },

    async preview(draft: ProviderDraft): Promise<CanonicalPreview> {
      return buildPreview(draft, draft.capabilities, {
        unit: 'grapheme',
        mediaLayout: 'none',
        linkRendering: 'card',
        resolvesMentionsAtRender: true,
        privacyLabelKey: null,
        warningKeys: [],
      });
    },

    async publish(request: PublishRequest): Promise<PublishResult> {
      const { draft } = request;
      const accessToken = await draft.connection.accessToken.use((value) => value);
      const response = await api(
        'POST',
        `/users/${encodeURIComponent(draft.connection.externalAccountId)}/posts`,
        accessToken,
        'medium.create_post',
        {
          json: {
            title: draft.title ?? '',
            contentFormat: 'markdown',
            content: draft.body,
            publishStatus: 'public',
            tags: [],
          },
        },
      );
      const post = parseEnvelope(mediumPostSchema, response, 'medium.create_post');
      const publishedAt = nowIso();
      const item: PublishItemResult = {
        kind: 'root',
        order: 0,
        threadItemId: null,
        externalPostId: post.id,
        permalink: post.url ?? null,
        publishedAt,
      };
      return {
        status: 'published',
        externalPostId: post.id,
        permalink: post.url ?? null,
        publishedAt,
        items: [item],
        sanitizedResponse: { id: post.id, publishStatus: post.publishStatus },
        providerRequestId: null,
        costMinor: null,
        currency: null,
      };
    },

    async getStatus(input: StatusRequest): Promise<PublishStatus> {
      // The integration API has no per post read-back, so a create's own response is the
      // evidence; a status check reports `unknown` rather than inventing a lookup.
      return {
        state: 'unknown',
        externalPostId: input.externalPostId,
        permalink: null,
        publishedAt: null,
        items: [],
        error: null,
        pollAfterSeconds: null,
        sanitizedResponse: { reason: 'no_post_read_back' },
      };
    },

    async fetchMetrics(input: MetricsRequest): Promise<MetricObservation[]> {
      void input;
      // Medium exposes no engagement metrics through the integration API.
      return [];
    },

    async refreshCredential(input: RefreshRequest): Promise<CredentialResult> {
      const clientId = deps.config.providers.medium.clientId;
      if (clientId === undefined) {
        throw new Error('MEDIUM_CLIENT_ID_NOT_CONFIGURED');
      }
      return await input.refreshToken.use(
        async (refreshToken) =>
          await refreshOAuth2Token({
            http,
            clock,
            provider: PROVIDER,
            tokenUrl: 'https://api.medium.com/v1/tokens',
            clientId,
            ...(deps.config.providers.medium.clientSecret === undefined
              ? {}
              : { clientSecret: deps.config.providers.medium.clientSecret }),
            refreshToken,
          }),
      );
    },
  };
}
