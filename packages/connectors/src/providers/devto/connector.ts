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
  SecretValue,
  ensureOk,
  parseProviderBody,
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
} from '../shared/contract-shape';
import { buildPreview } from '../shared/preview';
import { validateDraftShape } from '../shared/validate';
import { SOURCE_VERIFIED_ON } from '../shared/verification';
import { buildDevtoCapabilities } from './capabilities';
import { devtoArticleCreateSchema, devtoArticleSchema, devtoUserSchema } from './schemas';

/**
 * Dev.to connector on the official Forem API.
 *
 * The API key is a per account application credential from config. Article creation is
 * synchronous and returns the canonical URL, which is the external evidence for a receipt.
 */

const PROVIDER = 'devto' as const;
const API_BASE = 'https://dev.to/api';

function apiKeyOf(deps: ConnectorDeps): string {
  const key = deps.config.providers.devto.apiKey;
  if (key === undefined || key === '') {
    throw new Error('DEVTO_API_KEY_NOT_CONFIGURED');
  }
  return key;
}

export function createDevtoConnector(deps: ConnectorDeps): SocialConnector {
  const { http, clock } = deps;

  function nowIso(): string {
    return clock.now().toISOString();
  }

  async function api(
    method: 'GET' | 'POST' | 'DELETE' | 'PUT',
    path: string,
    operation: string,
    options: { readonly json?: unknown } = {},
  ) {
    const response = await http.request({
      method,
      url: `${API_BASE}${path}`,
      headers: { 'api-key': apiKeyOf(deps) },
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
        displayName: 'Dev.to',
        iconToken: 'provider.devto',
        accountTypes: ['publication'],
        connectorVersion: '1.0.0',
        label: 'beta',
        limitationKey: 'connectors.devto.review_pending',
        officialDocsUrl: 'https://developers.forem.com/api/',
        officialPolicyUrl: 'https://dev.to/terms',
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
          delete_post: 'supported',
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
        flavor: 'provider_specific',
        authorizeUrl: 'https://dev.to/settings/account',
        tokenUrl: `${API_BASE}/users/me`,
        revokeUrl: null,
        redirectPath: '/oauth/devto/callback',
        scopes: [
          {
            scope: 'article',
            explanationKey: 'connectors.devto.scope.article',
            usedBy: ['composer', 'queue'],
            required: true,
          },
        ],
        pkceRequired: false,
        multiStep: false,
        stepDescriptionKeys: ['connectors.devto.api_key_note'],
        supportsRefresh: false,
        refreshAtLifetimeFraction: 0.75,
        extraAuthorizeParameters: {},
      };
    },

    async discoverAccounts(grant: OAuthGrant): Promise<ExternalAccount[]> {
      const response = await api('GET', '/users/me', 'devto.get_me');
      const user = parseProviderBody(devtoUserSchema, response, {
        provider: PROVIDER,
        operation: 'devto.get_me',
        response,
      });
      return [
        {
          externalAccountId: String(user.id),
          accountType: 'publication',
          displayName: user.name ?? user.username,
          handle: user.username,
          avatarUrl: user.profile_image ?? null,
          profileUrl: `https://dev.to/${user.username}`,
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
      return buildDevtoCapabilities({ connection, observedAt: nowIso() });
    },

    async validateDraft(draft: ProviderDraft): Promise<ValidationResult> {
      const issues = validateDraftShape(draft, draft.capabilities, {
        unit: 'grapheme',
        requireAltText: false,
        allowMixedMedia: false,
      });
      // Dev.to articles require a title. The shared validator does not know that, so this
      // adapter states it.
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
      // Dev.to articles are Markdown; images are referenced inside the body by URL and
      // are not first class attachments in V1.
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
      const response = await api('POST', '/articles', 'devto.create_article', {
        json: {
          article: {
            title: draft.title ?? '',
            body_markdown: draft.body,
            published: true,
            tags: [],
          },
        },
      });
      const article = parseProviderBody(devtoArticleCreateSchema, response, {
        provider: PROVIDER,
        operation: 'devto.create_article',
        response,
      });
      const publishedAt = nowIso();
      const item: PublishItemResult = {
        kind: 'root',
        order: 0,
        threadItemId: null,
        externalPostId: String(article.id),
        permalink: article.url ?? null,
        publishedAt,
      };
      return {
        status: 'published',
        externalPostId: String(article.id),
        permalink: article.url ?? null,
        publishedAt,
        items: [item],
        sanitizedResponse: { id: article.id, published: article.published },
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
        `/articles/${encodeURIComponent(externalPostId)}`,
        'devto.get_status',
      );
      const article = parseProviderBody(devtoArticleSchema, response, {
        provider: PROVIDER,
        operation: 'devto.get_status',
        response,
      });
      if (!article.published) {
        return {
          state: 'processing',
          externalPostId: String(article.id),
          permalink: article.url ?? null,
          publishedAt: null,
          items: [],
          error: null,
          pollAfterSeconds: 30,
          sanitizedResponse: { published: false },
        };
      }
      const publishedAt = article.published_at ?? nowIso();
      return {
        state: 'published',
        externalPostId: String(article.id),
        permalink: article.url ?? null,
        publishedAt,
        items: [
          {
            kind: 'root' as const,
            order: 0,
            threadItemId: null,
            externalPostId: String(article.id),
            permalink: article.url ?? null,
            publishedAt,
          },
        ],
        error: null,
        pollAfterSeconds: null,
        sanitizedResponse: { published: true },
      };
    },

    async deletePost(input: DeleteRequest): Promise<void> {
      await api(
        'DELETE',
        `/articles/${encodeURIComponent(input.externalPostId)}`,
        'devto.delete_article',
      );
    },

    async fetchMetrics(input: MetricsRequest): Promise<MetricObservation[]> {
      void input;
      // Dev.to exposes no post or account metrics through its API.
      return [];
    },

    async refreshCredential(input: RefreshRequest): Promise<CredentialResult> {
      // Dev.to API keys do not rotate.
      const current = await input.refreshToken.use((value) => value);
      return {
        accessToken: new SecretValue(current, 'access_token'),
        refreshToken: null,
        tokenType: 'api-key',
        expiresAt: null,
        grantedScopes: [...input.grantedScopes],
        refreshTokenRotated: false,
        obtainedAt: nowIso(),
      };
    },
  };
}
