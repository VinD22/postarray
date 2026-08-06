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
} from '../shared/contract-shape';
import { providerOptionsOfConnection } from '../shared/access';
import { buildPreview } from '../shared/preview';
import { validateDraftShape } from '../shared/validate';
import { SOURCE_VERIFIED_ON } from '../shared/verification';
import { buildWordpressCapabilities } from './capabilities';
import {
  wordpressPostSchema,
  wordpressProviderOptionsSchema,
  wordpressUserSchema,
} from './schemas';

/**
 * WordPress connector on the official REST API.
 *
 * A connection is one site plus a credential: either an application password (stored as
 * a first-class secret) or an OAuth bearer token. The site URL travels in connection
 * metadata. The REST API is synchronous: a create returns the post id and link, which is
 * the external evidence.
 */

const PROVIDER = 'wordpress' as const;

function siteUrlFromMetadata(metadata: Readonly<Record<string, unknown>>): string | null {
  const value = metadata['siteUrl'];
  if (typeof value === 'string' && value !== '') {
    return value.replace(/\/$/u, '');
  }
  return null;
}

function siteUrlOf(connection: ProviderConnection): string | null {
  const metadataUrl = siteUrlFromMetadata(connection.metadata);
  if (metadataUrl !== null) {
    return metadataUrl;
  }
  const parsed = wordpressProviderOptionsSchema.safeParse(providerOptionsOfConnection(connection));
  if (parsed.success && parsed.data.siteUrl !== undefined) {
    return parsed.data.siteUrl.replace(/\/$/u, '');
  }
  return null;
}

function basicHeader(secret: string): Record<string, string> {
  return {
    authorization: `Basic ${Buffer.from(secret, 'utf8').toString('base64')}`,
    'content-type': 'application/json',
  };
}

export function createWordpressConnector(deps: ConnectorDeps): SocialConnector {
  const { http, clock } = deps;

  function nowIso(): string {
    return clock.now().toISOString();
  }

  async function wp(
    method: 'GET' | 'POST' | 'DELETE',
    connection: ProviderConnection,
    path: string,
    operation: string,
    options: {
      readonly json?: unknown;
      readonly query?: Readonly<Record<string, string | number | boolean | undefined>>;
    } = {},
  ) {
    const site = siteUrlOf(connection);
    if (site === null) {
      throw providerFailure({
        provider: PROVIDER,
        operation,
        remediationCode: REMEDIATION.reconnectAccount,
        details: { reason: 'SITE_URL_MISSING' },
      });
    }
    const accessToken = await connection.accessToken.use((value) => value);
    const response = await http.request({
      method,
      url: `${site}/wp-json/wp/v2${path}`,
      headers: basicHeader(accessToken),
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
        displayName: 'WordPress',
        iconToken: 'provider.wordpress',
        accountTypes: ['publication'],
        connectorVersion: '1.0.0',
        label: 'beta',
        limitationKey: 'connectors.wordpress.review_pending',
        officialDocsUrl: 'https://developer.wordpress.org/rest-api/reference/posts/',
        officialPolicyUrl: 'https://wordpress.org/about/privacy/',
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
          video: 'not_implemented',
          carousel: 'unsupported',
          document: 'unsupported',
        },
      };
    },

    authorization(): AuthorizationDefinition {
      return {
        flavor: 'provider_specific',
        authorizeUrl: 'https://wordpress.com/settings/security',
        tokenUrl: 'https://public-api.wordpress.com/oauth2/token',
        revokeUrl: null,
        redirectPath: '/oauth/wordpress/callback',
        scopes: [
          {
            scope: 'posts',
            explanationKey: 'connectors.wordpress.scope.posts',
            usedBy: ['composer', 'queue'],
            required: true,
          },
        ],
        pkceRequired: false,
        multiStep: false,
        stepDescriptionKeys: ['connectors.wordpress.app_password_note'],
        supportsRefresh: false,
        refreshAtLifetimeFraction: 0.75,
        extraAuthorizeParameters: {},
      };
    },

    async discoverAccounts(grant: OAuthGrant): Promise<ExternalAccount[]> {
      const site = siteUrlFromMetadata(grant.grantMetadata);
      if (site === null) {
        // Without a site the account cannot be resolved; the connect flow must supply it.
        throw providerFailure({
          provider: PROVIDER,
          operation: 'wordpress.get_me',
          remediationCode: REMEDIATION.reconnectAccount,
          details: { reason: 'SITE_URL_MISSING' },
        });
      }
      const accessToken = await grant.accessToken.use((value) => value);
      const response = await http.request({
        method: 'GET',
        url: `${site}/wp-json/wp/v2/users/me?context=edit`,
        headers: basicHeader(accessToken),
        accept: 'json',
        provider: PROVIDER,
        operation: 'wordpress.get_me',
      });
      ensureOk(response, {
        provider: PROVIDER,
        operation: 'wordpress.get_me',
        response,
        remediationCode: REMEDIATION.reconnectAccount,
      });
      const user = parseProviderBody(wordpressUserSchema, response, {
        provider: PROVIDER,
        operation: 'wordpress.get_me',
        response,
      });
      return [
        {
          externalAccountId: String(user.id),
          accountType: 'publication',
          displayName: user.name ?? user.slug ?? 'WordPress site',
          handle: user.slug ?? null,
          avatarUrl: null,
          profileUrl: user.link ?? user.url ?? null,
          parentExternalId: null,
          grantedScopes: [...grant.grantedScopes],
          eligible: true,
          ineligibleReasonKey: null,
          accountAccessToken: null,
          metadata: { siteUrl: site },
        },
      ];
    },

    async getCapabilities(connection: ProviderConnection) {
      return buildWordpressCapabilities({ connection, observedAt: nowIso() });
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
      // WordPress media upload is not implemented in V1; the capability snapshot says so.
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
      const response = await wp('POST', draft.connection, '/posts', 'wordpress.create_post', {
        json: {
          title: draft.title ?? '',
          content: draft.body,
          status: 'publish',
        },
      });
      const post = parseProviderBody(wordpressPostSchema, response, {
        provider: PROVIDER,
        operation: 'wordpress.create_post',
        response,
      });
      const publishedAt = nowIso();
      const item: PublishItemResult = {
        kind: 'root',
        order: 0,
        threadItemId: null,
        externalPostId: String(post.id),
        permalink: post.link ?? null,
        publishedAt,
      };
      return {
        status: 'published',
        externalPostId: String(post.id),
        permalink: post.link ?? null,
        publishedAt,
        items: [item],
        sanitizedResponse: { id: post.id, status: post.status },
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
      const response = await wp(
        'GET',
        input.connection,
        `/posts/${encodeURIComponent(externalPostId)}`,
        'wordpress.get_status',
      );
      const post = parseProviderBody(wordpressPostSchema, response, {
        provider: PROVIDER,
        operation: 'wordpress.get_status',
        response,
      });
      if (post.status !== 'publish') {
        return {
          state: 'processing',
          externalPostId: String(post.id),
          permalink: post.link ?? null,
          publishedAt: null,
          items: [],
          error: null,
          pollAfterSeconds: 30,
          sanitizedResponse: { status: post.status },
        };
      }
      const publishedAt = post.date ?? nowIso();
      return {
        state: 'published',
        externalPostId: String(post.id),
        permalink: post.link ?? null,
        publishedAt,
        items: [
          {
            kind: 'root' as const,
            order: 0,
            threadItemId: null,
            externalPostId: String(post.id),
            permalink: post.link ?? null,
            publishedAt,
          },
        ],
        error: null,
        pollAfterSeconds: null,
        sanitizedResponse: { status: post.status },
      };
    },

    async deletePost(input: DeleteRequest): Promise<void> {
      await wp(
        'DELETE',
        input.connection,
        `/posts/${encodeURIComponent(input.externalPostId)}`,
        'wordpress.delete_post',
        { query: { force: true } },
      );
    },

    async fetchMetrics(input: MetricsRequest): Promise<MetricObservation[]> {
      void input;
      // WordPress exposes no engagement metrics through the REST API without a plugin.
      return [];
    },

    async refreshCredential(input: RefreshRequest): Promise<CredentialResult> {
      // Application passwords and bearer tokens do not rotate here.
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
  };
}
