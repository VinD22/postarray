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
  type RevokeRequest,
  type SocialConnector,
  type StatusRequest,
} from '../shared/contract-shape';
import { providerOptionsOf } from '../shared/access';
import { refreshOAuth2Token } from '../shared/contract-shape';
import { buildPreview } from '../shared/preview';
import { validateDraftShape } from '../shared/validate';
import { SOURCE_VERIFIED_ON } from '../shared/verification';
import { buildRedditCapabilities } from './capabilities';
import {
  redditListingSchema,
  redditProviderOptionsSchema,
  redditSubmitResponseSchema,
  redditUserSchema,
} from './schemas';

/**
 * Reddit connector on the official OAuth v2 API.
 *
 * Self posts and link posts into subreddits. The submit endpoint is synchronous and the
 * response carries the created id; read-back goes through `/api/info`. Reddit requires
 * its API clients to send a descriptive User-Agent, which this adapter always does.
 */

const PROVIDER = 'reddit' as const;
const API_BASE = 'https://oauth.reddit.com';
const WWW_BASE = 'https://www.reddit.com';
const USER_AGENT = 'relay-publishing/1.0 (social publishing control plane)';

function subredditOf(draft: ProviderDraft): string | null {
  const destination = draft.destination?.externalId ?? null;
  if (destination !== null && destination !== '') {
    return destination.replace(/^r\//u, '');
  }
  const parsed = redditProviderOptionsSchema.parse(providerOptionsOf(draft));
  return parsed.subreddit ?? null;
}

export function createRedditConnector(deps: ConnectorDeps): SocialConnector {
  const { http, clock } = deps;

  function nowIso(): string {
    return clock.now().toISOString();
  }

  async function api(
    method: 'GET' | 'POST',
    connection: ProviderConnection,
    path: string,
    operation: string,
    options: {
      readonly json?: unknown;
      readonly form?: Readonly<Record<string, string>>;
      readonly query?: Readonly<Record<string, string | number | boolean | undefined>>;
    } = {},
  ) {
    const accessToken = await connection.accessToken.use((value) => value);
    const response = await http.request({
      method,
      url: `${API_BASE}${path}`,
      headers: { authorization: `Bearer ${accessToken}`, 'user-agent': USER_AGENT },
      ...(options.query === undefined ? {} : { query: options.query }),
      ...(options.form === undefined ? {} : { form: options.form }),
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
        displayName: 'Reddit',
        iconToken: 'provider.reddit',
        accountTypes: ['personal_profile'],
        connectorVersion: '1.0.0',
        label: 'beta',
        limitationKey: 'connectors.reddit.review_pending',
        officialDocsUrl: 'https://github.com/reddit-archive/reddit/wiki/OAuth2',
        officialPolicyUrl: 'https://www.redditinc.com/policies/user-agreement',
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
          preview: 'supported',
          publish: 'supported',
          get_status: 'supported',
          delete_post: 'supported',
          refresh_credential: 'supported',
          revoke: 'supported',
          provider_idempotency: 'unsupported',
          post_analytics: 'unsupported',
          account_analytics: 'unsupported',
          alt_text: 'unsupported',
          video: 'not_implemented',
          document: 'unsupported',
        },
      };
    },

    authorization(): AuthorizationDefinition {
      return {
        flavor: 'oauth2_pkce',
        authorizeUrl: 'https://www.reddit.com/api/v1/authorize',
        tokenUrl: 'https://www.reddit.com/api/v1/access_token',
        revokeUrl: 'https://www.reddit.com/api/v1/revoke_token',
        redirectPath: '/oauth/reddit/callback',
        scopes: [
          {
            scope: 'identity',
            explanationKey: 'connectors.reddit.scope.identity',
            usedBy: ['connections'],
            required: true,
          },
          {
            scope: 'submit',
            explanationKey: 'connectors.reddit.scope.submit',
            usedBy: ['composer', 'queue'],
            required: true,
          },
          {
            scope: 'mysubreddits',
            explanationKey: 'connectors.reddit.scope.mysubreddits',
            usedBy: ['composer'],
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
        url: `${API_BASE}/api/v1/me`,
        headers: { authorization: `Bearer ${accessToken}`, 'user-agent': USER_AGENT },
        accept: 'json',
        provider: PROVIDER,
        operation: 'reddit.get_me',
      });
      ensureOk(response, {
        provider: PROVIDER,
        operation: 'reddit.get_me',
        response,
        remediationCode: REMEDIATION.reconnectAccount,
      });
      const user = parseProviderBody(redditUserSchema, response, {
        provider: PROVIDER,
        operation: 'reddit.get_me',
        response,
      });
      return [
        {
          externalAccountId: user.id,
          accountType: 'personal_profile',
          displayName: user.name,
          handle: user.name,
          avatarUrl: user.icon_img === '' ? null : user.icon_img,
          profileUrl: `${WWW_BASE}/user/${user.name}`,
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
      const response = await api(
        'GET',
        input.connection,
        '/subreddits/mine/submitter',
        'reddit.list_destinations',
        { query: { limit: input.limit } },
      );
      const listing = parseProviderBody(redditListingSchema, response, {
        provider: PROVIDER,
        operation: 'reddit.list_destinations',
        response,
      });
      const refreshedAt = nowIso();
      const expiresAt = new Date(clock.now().getTime() + 60 * 60 * 1000).toISOString();
      return listing.data.children
        .map((child) => child.data)
        .filter((data) => data.name !== null && data.display_name !== null)
        .map((data) => ({
          // The submit endpoint takes the display name (r/test), not the t5_ fullname.
          externalId: data.display_name as string,
          kind: 'community' as const,
          displayLabel: `r/${data.display_name as string}`,
          parentExternalId: null,
          canPost: true,
          refreshedAt,
          expiresAt,
          metadata: { fullname: data.name, url: data.url ?? null },
        }));
    },

    async getCapabilities(connection: ProviderConnection) {
      return buildRedditCapabilities({ connection, observedAt: nowIso() });
    },

    async validateDraft(draft: ProviderDraft): Promise<ValidationResult> {
      redditProviderOptionsSchema.parse(providerOptionsOf(draft));
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
      if (subredditOf(draft) === null) {
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
      void input;
      // Image and video posts are not implemented in V1; the capability snapshot says so.
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
      const subreddit = subredditOf(draft);
      if (subreddit === null) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'reddit.submit',
          remediationCode: REMEDIATION.fixContent,
          details: { reason: 'SUBREDDIT_MISSING' },
        });
      }
      const link = draft.links[0] ?? null;
      const linkUrl = link === null ? null : (link.publishedUrl ?? link.originalUrl);
      const form: Record<string, string> = {
        sr: subreddit,
        title: draft.title ?? '',
        kind: linkUrl === null ? 'self' : 'link',
        resubmit: 'true',
        raw_json: '1',
        ...(linkUrl === null ? { text: draft.body } : { url: linkUrl }),
      };
      const response = await api('POST', draft.connection, '/api/submit', 'reddit.submit', {
        form,
      });
      const parsed = parseProviderBody(redditSubmitResponseSchema, response, {
        provider: PROVIDER,
        operation: 'reddit.submit',
        response,
      });
      if (parsed.json.errors.length > 0) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'reddit.submit',
          response,
          remediationCode: REMEDIATION.providerRejectedContent,
          details: { errors: parsed.json.errors },
        });
      }
      const id = parsed.json.data?.id;
      if (id === null || id === undefined) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'reddit.submit',
          response,
          remediationCode: REMEDIATION.waitForProvider,
          details: { reason: 'SUBMIT_RETURNED_NO_ID' },
        });
      }
      const publishedAt = nowIso();
      const permalink = parsed.json.data?.url ?? null;
      const item: PublishItemResult = {
        kind: 'root',
        order: 0,
        threadItemId: null,
        externalPostId: id,
        permalink,
        publishedAt,
      };
      return {
        status: 'published',
        externalPostId: id,
        permalink,
        publishedAt,
        items: [item],
        sanitizedResponse: { id, permalink },
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
      const t3 = externalPostId.startsWith('t3_') ? externalPostId : `t3_${externalPostId}`;
      const response = await api('GET', input.connection, '/api/info', 'reddit.get_status', {
        query: { id: t3, raw_json: 1 },
      });
      const listing = parseProviderBody(redditListingSchema, response, {
        provider: PROVIDER,
        operation: 'reddit.get_status',
        response,
      });
      const post = listing.data.children[0]?.data;
      if (post === undefined || post.id === null) {
        return {
          state: 'unknown',
          externalPostId: null,
          permalink: null,
          publishedAt: null,
          items: [],
          error: null,
          pollAfterSeconds: null,
          sanitizedResponse: { reason: 'post_not_found_in_info' },
        };
      }
      const permalink = post.permalink === null ? null : `${WWW_BASE}${post.permalink}`;
      const publishedAt = nowIso();
      return {
        state: 'published',
        externalPostId: post.id,
        permalink,
        publishedAt,
        items: [
          {
            kind: 'root' as const,
            order: 0,
            threadItemId: null,
            externalPostId: post.id,
            permalink,
            publishedAt,
          },
        ],
        error: null,
        pollAfterSeconds: null,
        sanitizedResponse: { id: post.id, permalink: post.permalink },
      };
    },

    async deletePost(input: DeleteRequest): Promise<void> {
      await api('POST', input.connection, '/api/del', 'reddit.delete_post', {
        form: {
          id: input.externalPostId.startsWith('t3_')
            ? input.externalPostId
            : `t3_${input.externalPostId}`,
        },
      });
    },

    async fetchMetrics(input: MetricsRequest): Promise<MetricObservation[]> {
      void input;
      // Reddit's official API has no engagement metrics product.
      return [];
    },

    async refreshCredential(input: RefreshRequest): Promise<CredentialResult> {
      const clientId = deps.config.providers.reddit.clientId;
      if (clientId === undefined) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'reddit.refresh_credential',
          remediationCode: REMEDIATION.contactSupport,
          details: { missingConfig: 'REDDIT_CLIENT_ID' },
        });
      }
      return await input.refreshToken.use(
        async (refreshToken) =>
          await refreshOAuth2Token({
            http,
            clock,
            provider: PROVIDER,
            tokenUrl: 'https://www.reddit.com/api/v1/access_token',
            clientId,
            ...(deps.config.providers.reddit.clientSecret === undefined
              ? {}
              : { clientSecret: deps.config.providers.reddit.clientSecret }),
            refreshToken,
            basicAuth: true,
          }),
      );
    },

    async revoke(input: RevokeRequest): Promise<void> {
      const clientId = deps.config.providers.reddit.clientId;
      const clientSecret = deps.config.providers.reddit.clientSecret;
      if (clientId === undefined) {
        return;
      }
      const token = input.refreshToken ?? input.accessToken;
      await token.use(async (plaintext) => {
        const response = await http.request({
          method: 'POST',
          url: 'https://www.reddit.com/api/v1/revoke_token',
          headers: {
            authorization: `Basic ${Buffer.from(`${encodeURIComponent(clientId)}:${encodeURIComponent(clientSecret ?? '')}`, 'utf8').toString('base64')}`,
          },
          form: {
            token: plaintext,
            token_type_hint: input.refreshToken === null ? 'access_token' : 'refresh_token',
          },
          accept: 'json',
          provider: PROVIDER,
          operation: 'reddit.revoke',
        });
        if (!response.ok) {
          // The stored credential is deleted regardless of the provider call's outcome.
          return;
        }
      });
    },
  };
}
