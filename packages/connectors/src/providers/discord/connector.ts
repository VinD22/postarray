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
import { buildPreview } from '../shared/preview';
import { validateDraftShape } from '../shared/validate';
import { SOURCE_VERIFIED_ON } from '../shared/verification';
import { buildDiscordCapabilities } from './capabilities';
import {
  discordChannelListSchema,
  discordGuildListSchema,
  discordMessageSchema,
  discordUserSchema,
} from './schemas';

/**
 * Discord connector on the official Bot API.
 *
 * The bot token is an application credential (config). Text channels the bot can see are
 * listed as destinations; the channel id travels in the composer destination. A message
 * create returns its id synchronously, which is the external evidence, and read-back goes
 * through the channel messages endpoint.
 */

const PROVIDER = 'discord' as const;
const API_BASE = 'https://discord.com/api/v10';

function botTokenOf(deps: ConnectorDeps): string {
  const token = deps.config.providers.discord.botToken;
  if (token === undefined || token === '') {
    throw new Error('DISCORD_BOT_TOKEN_NOT_CONFIGURED');
  }
  return token;
}

function channelIdOf(draft: ProviderDraft): string | null {
  const destination = draft.destination?.externalId ?? null;
  return destination === null || destination === '' ? null : destination;
}

export function createDiscordConnector(deps: ConnectorDeps): SocialConnector {
  const { http, clock } = deps;

  function nowIso(): string {
    return clock.now().toISOString();
  }

  async function api(
    method: 'GET' | 'POST' | 'DELETE',
    path: string,
    operation: string,
    options: { readonly json?: unknown } = {},
  ) {
    const response = await http.request({
      method,
      url: `${API_BASE}${path}`,
      headers: {
        authorization: `Bot ${botTokenOf(deps)}`,
        ...(options.json === undefined ? {} : { 'content-type': 'application/json' }),
      },
      ...(options.json === undefined ? {} : { json: options.json }),
      accept: 'json',
      provider: PROVIDER,
      operation,
    });
    ensureOk(response, { provider: PROVIDER, operation, response });
    return response;
  }

  function permalinkOf(
    guildId: string | null,
    channelId: string,
    messageId: string,
  ): string | null {
    return guildId === null
      ? null
      : `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
  }

  return {
    identity(): ProviderIdentity {
      return {
        provider: PROVIDER,
        displayName: 'Discord',
        iconToken: 'provider.discord',
        accountTypes: ['community'],
        connectorVersion: '1.0.0',
        label: 'beta',
        limitationKey: 'connectors.discord.review_pending',
        officialDocsUrl: 'https://discord.com/developers/docs/resources/message',
        officialPolicyUrl: 'https://discord.com/terms',
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
          thread_parts: 'unsupported',
        },
      };
    },

    authorization(): AuthorizationDefinition {
      return {
        flavor: 'provider_specific',
        authorizeUrl: 'https://discord.com/developers/applications',
        tokenUrl: `${API_BASE}/oauth2/token`,
        revokeUrl: null,
        redirectPath: '/oauth/discord/callback',
        scopes: [
          {
            scope: 'bot',
            explanationKey: 'connectors.discord.scope.bot',
            usedBy: ['composer', 'queue', 'connections'],
            required: true,
          },
        ],
        pkceRequired: false,
        multiStep: false,
        stepDescriptionKeys: ['connectors.discord.bot_token_note'],
        supportsRefresh: false,
        refreshAtLifetimeFraction: 0.75,
        extraAuthorizeParameters: {},
      };
    },

    async discoverAccounts(grant: OAuthGrant): Promise<ExternalAccount[]> {
      void grant;
      const response = await api('GET', '/users/@me', 'discord.get_me');
      const user = parseProviderBody(discordUserSchema, response, {
        provider: PROVIDER,
        operation: 'discord.get_me',
        response,
      });
      return [
        {
          externalAccountId: user.id,
          accountType: 'community',
          displayName: user.global_name ?? user.username,
          handle: user.username,
          avatarUrl: null,
          profileUrl: null,
          parentExternalId: null,
          grantedScopes: ['bot'],
          eligible: true,
          ineligibleReasonKey: null,
          accountAccessToken: null,
          metadata: {},
        },
      ];
    },

    async listDestinations(input: DestinationRequest): Promise<ProviderDestination[]> {
      const guildsResponse = await api('GET', '/users/@me/guilds', 'discord.list_guilds');
      const guilds = parseProviderBody(discordGuildListSchema, guildsResponse, {
        provider: PROVIDER,
        operation: 'discord.list_guilds',
        response: guildsResponse,
      });
      const refreshedAt = nowIso();
      const expiresAt = new Date(clock.now().getTime() + 60 * 60 * 1000).toISOString();
      const destinations: ProviderDestination[] = [];
      for (const guild of guilds.slice(0, input.limit)) {
        const channelsResponse = await api(
          'GET',
          `/guilds/${encodeURIComponent(guild.id)}/channels`,
          'discord.list_channels',
        );
        const channels = parseProviderBody(discordChannelListSchema, channelsResponse, {
          provider: PROVIDER,
          operation: 'discord.list_channels',
          response: channelsResponse,
        });
        for (const channel of channels) {
          // Text (0) and announcement (5) channels are postable by a bot.
          if (channel.type !== 0 && channel.type !== 5) {
            continue;
          }
          destinations.push({
            externalId: channel.id,
            kind: 'channel' as const,
            displayLabel: `#${channel.name ?? channel.id}`,
            parentExternalId: null,
            canPost: true,
            refreshedAt,
            expiresAt,
            metadata: { guildId: guild.id, guildName: guild.name },
          });
        }
      }
      return destinations;
    },

    async getCapabilities(connection: ProviderConnection) {
      return buildDiscordCapabilities({ connection, observedAt: nowIso() });
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
      // File attachments are not implemented in V1; the capability snapshot says so.
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
      const channelId = channelIdOf(draft);
      if (channelId === null) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'discord.create_message',
          remediationCode: REMEDIATION.fixContent,
          details: { reason: 'CHANNEL_MISSING' },
        });
      }
      const response = await api(
        'POST',
        `/channels/${encodeURIComponent(channelId)}/messages`,
        'discord.create_message',
        {
          json: { content: draft.body },
        },
      );
      const message = parseProviderBody(discordMessageSchema, response, {
        provider: PROVIDER,
        operation: 'discord.create_message',
        response,
      });
      const publishedAt = nowIso();
      const permalink = permalinkOf(message.guild_id, message.channel_id, message.id);
      const item: PublishItemResult = {
        kind: 'root',
        order: 0,
        threadItemId: null,
        externalPostId: message.id,
        permalink,
        publishedAt,
      };
      return {
        status: 'published',
        externalPostId: message.id,
        permalink,
        publishedAt,
        items: [item],
        sanitizedResponse: { id: message.id, channelId: message.channel_id },
        providerRequestId: null,
        costMinor: null,
        currency: null,
      };
    },

    async getStatus(input: StatusRequest): Promise<PublishStatus> {
      const externalPostId = input.externalPostId ?? input.providerJobId;
      const channelId = input.connection.metadata['channelId'];
      if (externalPostId === null || typeof channelId !== 'string' || channelId === '') {
        return {
          state: 'unknown',
          externalPostId: null,
          permalink: null,
          publishedAt: null,
          items: [],
          error: null,
          pollAfterSeconds: null,
          sanitizedResponse: { reason: 'no_message_or_channel' },
        };
      }
      const response = await api(
        'GET',
        `/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(externalPostId)}`,
        'discord.get_status',
      );
      const message = parseProviderBody(discordMessageSchema, response, {
        provider: PROVIDER,
        operation: 'discord.get_status',
        response,
      });
      const publishedAt = nowIso();
      return {
        state: 'published',
        externalPostId: message.id,
        permalink: permalinkOf(message.guild_id, message.channel_id, message.id),
        publishedAt,
        items: [
          {
            kind: 'root' as const,
            order: 0,
            threadItemId: null,
            externalPostId: message.id,
            permalink: permalinkOf(message.guild_id, message.channel_id, message.id),
            publishedAt,
          },
        ],
        error: null,
        pollAfterSeconds: null,
        sanitizedResponse: { id: message.id },
      };
    },

    async deletePost(input: DeleteRequest): Promise<void> {
      const channelId = input.connection.metadata['channelId'];
      if (typeof channelId !== 'string' || channelId === '') {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'discord.delete_message',
          remediationCode: REMEDIATION.contactSupport,
          details: { reason: 'CHANNEL_MISSING' },
        });
      }
      await api(
        'DELETE',
        `/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(input.externalPostId)}`,
        'discord.delete_message',
      );
    },

    async fetchMetrics(input: MetricsRequest): Promise<MetricObservation[]> {
      void input;
      // Discord exposes no message engagement metrics through the Bot API.
      return [];
    },

    async refreshCredential(input: RefreshRequest): Promise<CredentialResult> {
      const current = await input.refreshToken.use((value) => value);
      return {
        accessToken: new SecretValue(current, 'access_token'),
        refreshToken: null,
        tokenType: 'bot',
        expiresAt: null,
        grantedScopes: [...input.grantedScopes],
        refreshTokenRotated: false,
        obtainedAt: nowIso(),
      };
    },
  };
}
