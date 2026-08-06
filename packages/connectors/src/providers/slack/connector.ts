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
import { buildSlackCapabilities } from './capabilities';
import {
  slackAuthTestSchema,
  slackConversationsHistorySchema,
  slackConversationsListSchema,
  slackPostMessageSchema,
  slackResponseSchema,
} from './schemas';

/**
 * Slack connector on the official Web API.
 *
 * OAuth2 app connect. A message create returns its timestamp synchronously, which is the
 * external evidence; read-back goes through `conversations.history`. Slack answers with
 * `{ ok: false, error }` at the application level even on a 2xx transport, so every call
 * checks the envelope before trusting the payload.
 */

const PROVIDER = 'slack' as const;
const API_BASE = 'https://slack.com/api';

function channelIdOf(draft: ProviderDraft): string | null {
  const destination = draft.destination?.externalId ?? null;
  return destination === null || destination === '' ? null : destination;
}

export function createSlackConnector(deps: ConnectorDeps): SocialConnector {
  const { http, clock } = deps;

  function nowIso(): string {
    return clock.now().toISOString();
  }

  async function api(
    connection: ProviderConnection,
    method: string,
    operation: string,
    options: { readonly form?: Readonly<Record<string, string>>; readonly json?: unknown } = {},
  ) {
    const accessToken = await connection.accessToken.use((value) => value);
    const response = await http.request({
      method: 'POST',
      url: `${API_BASE}/${method}`,
      headers: { authorization: `Bearer ${accessToken}` },
      ...(options.form === undefined ? {} : { form: options.form }),
      ...(options.json === undefined ? {} : { json: options.json }),
      accept: 'json',
      provider: PROVIDER,
      operation,
    });
    ensureOk(response, { provider: PROVIDER, operation, response });
    const envelope = parseProviderBody(slackResponseSchema, response, {
      provider: PROVIDER,
      operation,
      response,
    });
    if (!envelope.ok) {
      throw providerFailure({
        provider: PROVIDER,
        operation,
        response,
        remediationCode: REMEDIATION.providerRejectedContent,
        details: { error: envelope.error },
      });
    }
    return response;
  }

  return {
    identity(): ProviderIdentity {
      return {
        provider: PROVIDER,
        displayName: 'Slack',
        iconToken: 'provider.slack',
        accountTypes: ['organization'],
        connectorVersion: '1.0.0',
        label: 'beta',
        limitationKey: 'connectors.slack.review_pending',
        officialDocsUrl: 'https://api.slack.com/methods/chat.postMessage',
        officialPolicyUrl: 'https://slack.com/terms-of-service',
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
        authorizeUrl: 'https://slack.com/oauth/v2/authorize',
        tokenUrl: 'https://slack.com/api/oauth.v2.access',
        revokeUrl: null,
        redirectPath: '/oauth/slack/callback',
        scopes: [
          {
            scope: 'users:read',
            explanationKey: 'connectors.slack.scope.users_read',
            usedBy: ['connections'],
            required: true,
          },
          {
            scope: 'channels:read',
            explanationKey: 'connectors.slack.scope.channels_read',
            usedBy: ['composer'],
            required: true,
          },
          {
            scope: 'chat:write',
            explanationKey: 'connectors.slack.scope.chat_write',
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
        method: 'POST',
        url: `${API_BASE}/auth.test`,
        headers: { authorization: `Bearer ${accessToken}` },
        accept: 'json',
        provider: PROVIDER,
        operation: 'slack.auth_test',
      });
      ensureOk(response, {
        provider: PROVIDER,
        operation: 'slack.auth_test',
        response,
        remediationCode: REMEDIATION.reconnectAccount,
      });
      const auth = parseProviderBody(slackAuthTestSchema, response, {
        provider: PROVIDER,
        operation: 'slack.auth_test',
        response,
      });
      if (!auth.ok) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'slack.auth_test',
          response,
          remediationCode: REMEDIATION.reconnectAccount,
          details: { error: auth.error },
        });
      }
      return [
        {
          externalAccountId: auth.user_id ?? auth.team_id ?? 'slack-user',
          accountType: 'organization',
          displayName: auth.team ?? auth.user ?? 'Slack workspace',
          handle: auth.user ?? null,
          avatarUrl: null,
          profileUrl: auth.url ?? null,
          parentExternalId: null,
          grantedScopes: [...grant.grantedScopes],
          eligible: true,
          ineligibleReasonKey: null,
          accountAccessToken: null,
          metadata: { teamId: auth.team_id },
        },
      ];
    },

    async listDestinations(input: DestinationRequest): Promise<ProviderDestination[]> {
      const response = await api(input.connection, 'conversations.list', 'slack.list_channels', {
        form: {
          types: 'public_channel,private_channel',
          exclude_archived: 'true',
          limit: String(Math.min(input.limit, 200)),
        },
      });
      const parsed = parseProviderBody(slackConversationsListSchema, response, {
        provider: PROVIDER,
        operation: 'slack.list_channels',
        response,
      });
      const refreshedAt = nowIso();
      const expiresAt = new Date(clock.now().getTime() + 60 * 60 * 1000).toISOString();
      return parsed.channels
        .filter((channel) => channel.is_archived !== true)
        .map((channel) => ({
          externalId: channel.id,
          kind: 'channel' as const,
          displayLabel: channel.name ?? channel.id,
          parentExternalId: null,
          canPost: true,
          refreshedAt,
          expiresAt,
          metadata: { isPrivate: channel.is_private === true },
        }));
    },

    async getCapabilities(connection: ProviderConnection) {
      return buildSlackCapabilities({ connection, observedAt: nowIso() });
    },

    async validateDraft(draft: ProviderDraft): Promise<ValidationResult> {
      const issues = validateDraftShape(draft, draft.capabilities, {
        unit: 'grapheme',
        requireAltText: false,
        allowMixedMedia: false,
      });
      if (channelIdOf(draft) === null) {
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
      // File uploads are not implemented in V1; the capability snapshot says so.
      return [];
    },

    async preview(draft: ProviderDraft): Promise<CanonicalPreview> {
      return buildPreview(draft, draft.capabilities, {
        unit: 'grapheme',
        mediaLayout: 'none',
        linkRendering: 'inline_text',
        resolvesMentionsAtRender: true,
        privacyLabelKey: null,
        warningKeys: [],
      });
    },

    async publish(request: PublishRequest): Promise<PublishResult> {
      const { draft } = request;
      const channel = channelIdOf(draft);
      if (channel === null) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'slack.post_message',
          remediationCode: REMEDIATION.fixContent,
          details: { reason: 'CHANNEL_MISSING' },
        });
      }
      const response = await api(draft.connection, 'chat.postMessage', 'slack.post_message', {
        form: { channel, text: draft.body },
      });
      const parsed = parseProviderBody(slackPostMessageSchema, response, {
        provider: PROVIDER,
        operation: 'slack.post_message',
        response,
      });
      const ts = parsed.ts;
      if (ts === null) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'slack.post_message',
          response,
          remediationCode: REMEDIATION.waitForProvider,
          details: { reason: 'NO_MESSAGE_TS' },
        });
      }
      const publishedAt = nowIso();
      const item: PublishItemResult = {
        kind: 'root',
        order: 0,
        threadItemId: null,
        externalPostId: ts,
        permalink: null,
        publishedAt,
      };
      return {
        status: 'published',
        externalPostId: ts,
        permalink: null,
        publishedAt,
        items: [item],
        sanitizedResponse: { ts, channel },
        providerRequestId: null,
        costMinor: null,
        currency: null,
      };
    },

    async getStatus(input: StatusRequest): Promise<PublishStatus> {
      const externalPostId = input.externalPostId ?? input.providerJobId;
      const channel = input.connection.metadata['channel'];
      if (externalPostId === null || typeof channel !== 'string' || channel === '') {
        return {
          state: 'unknown',
          externalPostId: null,
          permalink: null,
          publishedAt: null,
          items: [],
          error: null,
          pollAfterSeconds: null,
          sanitizedResponse: { reason: 'no_ts_or_channel' },
        };
      }
      const response = await api(
        input.connection,
        'conversations.history',
        'slack.conversation_history',
        {
          form: { channel, latest: externalPostId, limit: '1', inclusive: 'true' },
        },
      );
      const parsed = parseProviderBody(slackConversationsHistorySchema, response, {
        provider: PROVIDER,
        operation: 'slack.conversation_history',
        response,
      });
      const found = parsed.messages.some((message) => message.ts === externalPostId);
      if (!found) {
        return {
          state: 'unknown',
          externalPostId: null,
          permalink: null,
          publishedAt: null,
          items: [],
          error: null,
          pollAfterSeconds: null,
          sanitizedResponse: { reason: 'message_not_in_history' },
        };
      }
      const publishedAt = nowIso();
      return {
        state: 'published',
        externalPostId,
        permalink: null,
        publishedAt,
        items: [
          {
            kind: 'root' as const,
            order: 0,
            threadItemId: null,
            externalPostId,
            permalink: null,
            publishedAt,
          },
        ],
        error: null,
        pollAfterSeconds: null,
        sanitizedResponse: { ts: externalPostId },
      };
    },

    async deletePost(input: DeleteRequest): Promise<void> {
      const channel = input.connection.metadata['channel'];
      if (typeof channel !== 'string' || channel === '') {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'slack.delete_message',
          remediationCode: REMEDIATION.contactSupport,
          details: { reason: 'CHANNEL_MISSING' },
        });
      }
      await api(input.connection, 'chat.delete', 'slack.delete_message', {
        form: { channel, ts: input.externalPostId },
      });
    },

    async fetchMetrics(input: MetricsRequest): Promise<MetricObservation[]> {
      void input;
      // Slack exposes no message engagement metrics through the Web API.
      return [];
    },

    async refreshCredential(input: RefreshRequest): Promise<CredentialResult> {
      const clientId = deps.config.providers.slack.clientId;
      if (clientId === undefined) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'slack.refresh_credential',
          remediationCode: REMEDIATION.contactSupport,
          details: { missingConfig: 'SLACK_CLIENT_ID' },
        });
      }
      return await input.refreshToken.use(
        async (refreshToken) =>
          await refreshOAuth2Token({
            http,
            clock,
            provider: PROVIDER,
            tokenUrl: 'https://slack.com/api/oauth.v2.access',
            clientId,
            ...(deps.config.providers.slack.clientSecret === undefined
              ? {}
              : { clientSecret: deps.config.providers.slack.clientSecret }),
            refreshToken,
          }),
      );
    },
  };
}
