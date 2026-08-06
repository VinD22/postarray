import { validationResult, type MetricObservation, type ValidationResult } from '@relay/contracts';

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
  type FailedItem,
  type MediaPreparationRequest,
  type MentionSearchRequest,
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
import { errorSummary, providerOptionsOf, providerOptionsOfConnection } from '../shared/access';
import { buildPreview } from '../shared/preview';
import { validateDraftShape } from '../shared/validate';
import { SOURCE_VERIFIED_ON } from '../shared/verification';
import { buildTelegramCapabilities } from './capabilities';
import {
  telegramApiResponseSchema,
  telegramMessageSchema,
  telegramProviderOptionsSchema,
  telegramUserSchema,
} from './schemas';

/**
 * Telegram connector on the official Bot API.
 *
 * The bot token is an application credential (config). The chat the bot posts into is
 * per connection and travels in connection metadata or the composer destination. A
 * message create returns its `message_id` synchronously, which is the external evidence;
 * there is no read-back for an arbitrary message, so `getStatus` reports `unknown`
 * honestly when it is called.
 */

const PROVIDER = 'telegram' as const;
const API_BASE = 'https://api.telegram.org';

function botTokenOf(deps: ConnectorDeps): string {
  const token = deps.config.providers.telegram.botToken;
  if (token === undefined || token === '') {
    throw new Error('TELEGRAM_BOT_TOKEN_NOT_CONFIGURED');
  }
  return token;
}

function apiUrl(deps: ConnectorDeps, method: string): string {
  return `${API_BASE}/bot${botTokenOf(deps)}/${method}`;
}

function chatIdOf(draft: ProviderDraft, connection: ProviderConnection): string | null {
  const destination = draft.destination?.externalId ?? null;
  if (destination !== null && destination !== '') {
    return destination;
  }
  return chatIdOfConnection(connection);
}

function chatIdOfConnection(connection: ProviderConnection): string | null {
  const parsed = telegramProviderOptionsSchema.parse(providerOptionsOfConnection(connection));
  return parsed.destinationChatId ?? parsed.chatId ?? null;
}

export function createTelegramConnector(deps: ConnectorDeps): SocialConnector {
  const { http, clock } = deps;

  function nowIso(): string {
    return clock.now().toISOString();
  }

  async function call(
    method: string,
    payload: Record<string, unknown>,
    operation: string,
  ): Promise<unknown> {
    const response = await http.request({
      method: 'POST',
      url: apiUrl(deps, method),
      headers: { 'content-type': 'application/json' },
      json: payload,
      accept: 'json',
      provider: PROVIDER,
      operation,
    });
    ensureOk(response, { provider: PROVIDER, operation, response });
    const parsed = parseProviderBody(telegramApiResponseSchema, response, {
      provider: PROVIDER,
      operation,
      response,
    });
    if (!parsed.ok) {
      throw new Error(`TELEGRAM_API_FAILED: ${parsed.description ?? 'no description'}`);
    }
    return parsed.result;
  }

  function parseResult<T>(
    schema: {
      safeParse(value: unknown): { success: true; data: T } | { success: false; error: unknown };
    },
    value: unknown,
    operation: string,
  ): T {
    const result = schema.safeParse(value);
    if (result.success) {
      return result.data;
    }
    throw providerFailure({
      provider: PROVIDER,
      operation,
      response: {
        status: 200,
        ok: true,
        headers: {},
        body: { message: 'unexpected telegram result shape' },
      },
      remediationCode: 'escalate_unclassified',
      cause: result.error,
    });
  }

  return {
    identity(): ProviderIdentity {
      return {
        provider: PROVIDER,
        displayName: 'Telegram',
        iconToken: 'provider.telegram',
        accountTypes: ['community'],
        connectorVersion: '1.0.0',
        label: 'beta',
        limitationKey: 'connectors.telegram.review_pending',
        officialDocsUrl: 'https://core.telegram.org/bots/api',
        officialPolicyUrl: 'https://telegram.org/terms',
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
          prepare_media: 'supported',
          preview: 'supported',
          publish: 'supported',
          get_status: 'supported',
          delete_post: 'supported',
          refresh_credential: 'supported',
          thread_parts: 'supported',
          alt_text: 'unsupported',
          carousel: 'unsupported',
          video: 'unsupported',
          provider_idempotency: 'unsupported',
          post_analytics: 'unsupported',
          account_analytics: 'unsupported',
          privacy_controls: 'unsupported',
        },
      };
    },

    authorization(): AuthorizationDefinition {
      return {
        flavor: 'provider_specific',
        authorizeUrl: 'https://core.telegram.org/bots#6-botfather',
        tokenUrl: apiUrl(deps, 'getMe'),
        revokeUrl: null,
        redirectPath: '/oauth/telegram/callback',
        scopes: [
          {
            scope: 'bot',
            explanationKey: 'connectors.telegram.scope.bot',
            usedBy: ['composer', 'queue', 'connections'],
            required: true,
          },
        ],
        pkceRequired: false,
        multiStep: false,
        stepDescriptionKeys: ['connectors.telegram.bot_token_note'],
        supportsRefresh: false,
        refreshAtLifetimeFraction: 0.75,
        extraAuthorizeParameters: {},
      };
    },

    async discoverAccounts(grant: OAuthGrant): Promise<ExternalAccount[]> {
      const result = await call('getMe', {}, 'telegram.get_me');
      const user = parseResult(telegramUserSchema, result, 'telegram.get_me');
      return [
        {
          externalAccountId: String(user.id),
          accountType: 'community',
          displayName: user.first_name ?? user.username ?? `Telegram bot ${user.id}`,
          handle: user.username ?? null,
          avatarUrl: null,
          profileUrl: null,
          parentExternalId: null,
          grantedScopes: [...grant.grantedScopes],
          eligible: true,
          ineligibleReasonKey: null,
          accountAccessToken: null,
          metadata: {},
        },
      ];
    },

    async searchMentions(_input: MentionSearchRequest) {
      // Telegram resolves @mentions at render time; there is no mention search API.
      return [];
    },

    async getCapabilities(connection: ProviderConnection) {
      return buildTelegramCapabilities({ connection, observedAt: nowIso() });
    },

    async validateDraft(draft: ProviderDraft): Promise<ValidationResult> {
      telegramProviderOptionsSchema.parse(providerOptionsOf(draft));
      const issues = validateDraftShape(draft, draft.capabilities, {
        unit: 'grapheme',
        requireAltText: false,
        allowMixedMedia: false,
      });
      return validationResult({ issues });
    },

    async prepareMedia(input: MediaPreparationRequest): Promise<PreparedMedia[]> {
      // The Bot API pulls photo bytes from an HTTPS URL, so preparation is a pass through
      // that carries the verified, short-lived source URL as the public URL.
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
        linkRendering: 'inline_text',
        resolvesMentionsAtRender: true,
        privacyLabelKey: null,
        warningKeys: [],
      });
    },

    async publish(request: PublishRequest): Promise<PublishResult> {
      const { draft } = request;
      const connection = draft.connection;
      const chatId = chatIdOf(draft, connection);
      if (chatId === null) {
        throw new Error('TELEGRAM_CHAT_ID_MISSING');
      }
      const image = request.preparedMedia.find((item) => item.publicUrl !== null);
      const publishedAt = nowIso();

      const sendRoot = async (payload: Record<string, unknown>): Promise<number> => {
        const result = await call(
          image === undefined ? 'sendMessage' : 'sendPhoto',
          {
            chat_id: chatId,
            ...(image === undefined
              ? { text: draft.body }
              : { photo: image.publicUrl, caption: draft.body }),
            ...payload,
          },
          'telegram.send_message',
        );
        const message = parseResult(telegramMessageSchema, result, 'telegram.send_message');
        return message.message_id;
      };

      const rootMessageId = await sendRoot({});
      const permalink = `https://t.me/c/${chatId.replace('-100', '')}/${rootMessageId}`;

      const rootItem: PublishItemResult = {
        kind: 'root',
        order: 0,
        threadItemId: null,
        externalPostId: String(rootMessageId),
        permalink,
        publishedAt,
      };
      const items: PublishItemResult[] = [rootItem];
      const failures: FailedItem[] = [];
      let parentMessageId = rootMessageId;
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
          const messageId = await sendRoot({
            reply_to_message_id: parentMessageId,
            ...(image === undefined ? { text: item.body } : { caption: item.body }),
          });
          parentMessageId = messageId;
          items.push({
            kind: item.kind,
            order: item.order,
            threadItemId: item.threadItemId,
            externalPostId: String(messageId),
            permalink: `https://t.me/c/${chatId.replace('-100', '')}/${messageId}`,
            publishedAt,
          });
        } catch (error) {
          failures.push({
            kind: item.kind,
            order: item.order,
            threadItemId: item.threadItemId,
            error: errorSummary({
              errorClass: 'TRANSIENT_PROVIDER',
              remediationCode: REMEDIATION.commentFailedRootPublished,
              messageKey: 'state.partially_published.label',
              retryable: true,
              providerMessage: error instanceof Error ? error.message : null,
            }),
          });
        }
      }

      const sanitizedResponse = { rootMessageId, itemCount: items.length, pending };
      if (failures.length > 0) {
        return {
          status: 'partial',
          externalPostId: String(rootMessageId),
          permalink,
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
        externalPostId: String(rootMessageId),
        permalink,
        publishedAt,
        items,
        sanitizedResponse,
        providerRequestId: null,
        costMinor: null,
        currency: null,
      };
    },

    async getStatus(input: StatusRequest): Promise<PublishStatus> {
      // The Bot API offers no way to read an arbitrary message back without polling
      // `getUpdates`, which we never do. A create returns its message id synchronously, so
      // a status check without that evidence honestly reports `unknown`.
      return {
        state: 'unknown',
        externalPostId: input.externalPostId,
        permalink: null,
        publishedAt: null,
        items: [],
        error: null,
        pollAfterSeconds: null,
        sanitizedResponse: { reason: 'no_message_read_back' },
      };
    },

    async deletePost(input: DeleteRequest): Promise<void> {
      const chatId = chatIdOfConnection(input.connection);
      if (chatId === null) {
        throw new Error('TELEGRAM_CHAT_ID_MISSING');
      }
      await call(
        'deleteMessage',
        { chat_id: chatId, message_id: Number(input.externalPostId) },
        'telegram.delete_message',
      );
    },

    async fetchMetrics(input: MetricsRequest): Promise<MetricObservation[]> {
      void input;
      // Telegram exposes no post or account metrics through the Bot API.
      return [];
    },

    async refreshCredential(input: RefreshRequest): Promise<CredentialResult> {
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
