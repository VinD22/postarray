import {
  validationIssue,
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
  providerFailure,
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
} from '../shared/contract-shape.js';
import { accessTokenOf, errorSummary, mentionOffset, providerOptionsOf } from '../shared/access.js';
import { mapMetrics } from '../shared/metrics.js';
import { buildPreview } from '../shared/preview.js';
import { countGraphemes } from '../shared/text.js';
import { validateDraftShape } from '../shared/validate.js';
import { SOURCE_VERIFIED_ON } from '../shared/verification.js';
import {
  BLUESKY_MAX_BYTES,
  BLUESKY_REQUIRE_ALT_TEXT,
  buildBlueskyCapabilities,
} from './capabilities.js';
import { buildFacets, byteLength, type ResolvedMention } from './facets.js';
import { BLUESKY_ACCOUNT_METRICS, BLUESKY_POST_METRICS } from './metrics.js';
import {
  atprotoBlobSchema,
  atprotoRecordRefSchema,
  atprotoSessionSchema,
  blueskyActorSearchSchema,
  blueskyPostThreadSchema,
  blueskyProfileSchema,
  blueskyProviderOptionsSchema,
} from './schemas.js';

/**
 * Bluesky connector, on the AT Protocol.
 *
 * Posts, replies and images. Blobs are uploaded first and referenced in the post record.
 * A reply references both the root and the parent record, which is how threads are built.
 *
 * Two things are deliberate:
 *
 * 1. **Alt text is required by default.** Accessible alt text is a strong community norm on
 *    Bluesky, so a missing alt text is an error with an explicit waive action rather than a
 *    silent omission.
 * 2. **An app password is a first-class secret.** If the official OAuth path is not
 *    generally available at implementation time, the app password lives in the token vault
 *    with the same envelope encryption and handling rules as any OAuth token. We never ask
 *    for a main account password and we never treat a decentralized identity as a password
 *    export.
 */

const PROVIDER = 'bluesky' as const;
const DEFAULT_SERVICE = 'https://bsky.social';
const POST_COLLECTION = 'app.bsky.feed.post';
const APP_PASSWORD_DOCS = 'https://bsky.app/settings/app-passwords';

function serviceUrl(deps: ConnectorDeps, connection?: ProviderConnection): string {
  const fromConnection = connection?.metadata['serviceUrl'];
  if (typeof fromConnection === 'string' && fromConnection !== '') {
    return fromConnection.replace(/\/$/u, '');
  }
  return (deps.config.providers.bluesky.serviceUrl ?? DEFAULT_SERVICE).replace(/\/$/u, '');
}

/** Turn an AT URI into the public web permalink. */
export function blueskyPermalink(handle: string | null, atUri: string): string | null {
  const parts = atUri.split('/');
  const rkey = parts[parts.length - 1];
  if (rkey === undefined || rkey === '') {
    return null;
  }
  const actor = handle ?? parts[2] ?? null;
  return actor === null ? null : `https://bsky.app/profile/${actor}/post/${rkey}`;
}

export function createBlueskyConnector(deps: ConnectorDeps): SocialConnector {
  const { http, clock, logger } = deps;

  async function token(connection: ProviderConnection): Promise<string> {
    return await accessTokenOf(connection);
  }

  function nowIso(): string {
    return clock.now().toISOString();
  }

  function handleOf(connection: ProviderConnection): string | null {
    const handle = connection.metadata['handle'];
    return typeof handle === 'string' && handle !== '' ? handle : null;
  }

  function sourceUrlOf(media: ProviderMedia, operation: string): string {
    if (media.sourceUrl === null) {
      throw providerFailure({
        provider: PROVIDER,
        operation,
        remediationCode: REMEDIATION.mediaInvalid,
        details: { mediaId: media.mediaId, reason: 'MEDIA_SOURCE_URL_MISSING' },
      });
    }
    return media.sourceUrl;
  }

  async function xrpcGet(
    connection: ProviderConnection,
    method: string,
    query: Readonly<Record<string, string | number | boolean | undefined>>,
    operation: string,
  ) {
    const accessToken = await token(connection);
    return http.request({
      method: 'GET',
      url: `${serviceUrl(deps, connection)}/xrpc/${method}`,
      headers: { authorization: `Bearer ${accessToken}` },
      query,
      accept: 'json',
      provider: PROVIDER,
      operation,
    });
  }

  async function uploadBlob(
    connection: ProviderConnection,
    media: ProviderMedia,
  ): Promise<PreparedMedia> {
    const accessToken = await token(connection);
    const source = await http.request({
      method: 'GET',
      url: sourceUrlOf(media, 'bluesky.fetch_source'),
      accept: 'binary',
      provider: PROVIDER,
      operation: 'bluesky.fetch_source',
    });
    ensureOk(source, { provider: PROVIDER, operation: 'bluesky.fetch_source', response: source });

    const response = await http.request({
      method: 'POST',
      url: `${serviceUrl(deps, connection)}/xrpc/com.atproto.repo.uploadBlob`,
      headers: { authorization: `Bearer ${accessToken}`, 'content-type': media.mimeType },
      body: source.bytes,
      accept: 'json',
      provider: PROVIDER,
      operation: 'bluesky.upload_blob',
    });
    ensureOk(response, {
      provider: PROVIDER,
      operation: 'bluesky.upload_blob',
      response,
      remediationCode: REMEDIATION.mediaInvalid,
    });
    const parsed = parseProviderBody(atprotoBlobSchema, response, {
      provider: PROVIDER,
      operation: 'bluesky.upload_blob',
      response,
    });
    return {
      mediaId: media.mediaId,
      derivativeId: media.derivativeId,
      providerMediaId: parsed.blob.ref.$link,
      containerId: null,
      uploadState: 'ready',
      derivativeChecksum: media.checksum,
      byteSize: media.byteSize,
      altTextApplied: media.altText !== null && media.altText !== '',
      publicUrl: null,
      expiresAt: null,
      reusedFromPreviousAttempt: false,
    };
  }

  function buildEmbed(
    draft: ProviderDraft,
    prepared: readonly PreparedMedia[],
  ): Record<string, unknown> | null {
    const blobs = prepared.filter((item) => item.providerMediaId !== null);
    if (blobs.length === 0) {
      return null;
    }
    const video = blobs.find((item) => draft.media.find((media) => media.mediaId === item.mediaId)?.kind === 'video');
    if (video !== undefined) {
      return {
        $type: 'app.bsky.embed.video',
        video: {
          $type: 'blob',
          ref: { $link: video.providerMediaId },
          mimeType: draft.media.find((media) => media.mediaId === video.mediaId)?.mimeType,
          size: draft.media.find((media) => media.mediaId === video.mediaId)?.byteSize,
        },
      };
    }
    return {
      $type: 'app.bsky.embed.images',
      images: blobs.map((blob, index) => ({
        image: {
          $type: 'blob',
          ref: { $link: blob.providerMediaId },
          mimeType: draft.media.find((media) => media.mediaId === blob.mediaId)?.mimeType,
          size: draft.media.find((media) => media.mediaId === blob.mediaId)?.byteSize,
        },
        // Alt text is never omitted silently. An explicitly waived image sends an empty
        // string, which is the protocol's own way of saying "no description".
        alt: draft.media[index]?.altText ?? '',
      })),
    };
  }

  async function createRecord(
    connection: ProviderConnection,
    record: Record<string, unknown>,
    operation: string,
  ) {
    const accessToken = await token(connection);
    const response = await http.request({
      method: 'POST',
      url: `${serviceUrl(deps, connection)}/xrpc/com.atproto.repo.createRecord`,
      headers: { authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' },
      json: {
        repo: connection.externalAccountId,
        collection: POST_COLLECTION,
        record,
      },
      accept: 'json',
      provider: PROVIDER,
      operation,
    });
    ensureOk(response, { provider: PROVIDER, operation, response });
    return parseProviderBody(atprotoRecordRefSchema, response, {
      provider: PROVIDER,
      operation,
      response,
    });
  }

  function postRecord(
    draft: ProviderDraft,
    text: string,
    prepared: readonly PreparedMedia[],
    options: ReturnType<typeof blueskyProviderOptionsSchema.parse>,
    reply: { root: { uri: string; cid: string }; parent: { uri: string; cid: string } } | null,
  ): Record<string, unknown> {
    const mentions: ResolvedMention[] = draft.mentions.flatMap((mention) => {
      const range = mentionOffset(text, mention);
      return range === null ? [] : [{ did: mention.externalId, ...range }];
    });
    const facets = buildFacets(text, mentions);
    const embed = buildEmbed(draft, prepared);
    return {
      $type: POST_COLLECTION,
      text,
      createdAt: nowIso(),
      ...(facets.length > 0 ? { facets } : {}),
      ...(embed === null ? {} : { embed }),
      ...(options.langs === undefined ? {} : { langs: options.langs }),
      ...(options.selfLabels === undefined
        ? {}
        : {
            labels: {
              $type: 'com.atproto.label.defs#selfLabels',
              values: options.selfLabels.map((value) => ({ val: value })),
            },
          }),
      ...(reply === null ? {} : { reply }),
    };
  }

  return {
    identity(): ProviderIdentity {
      return {
        provider: PROVIDER,
        displayName: 'Bluesky',
        iconToken: 'provider.bluesky',
        accountTypes: ['personal_profile'],
        connectorVersion: '1.0.0',
        label: 'beta',
        limitationKey: 'connectors.bluesky.review_pending',
        officialDocsUrl: 'https://docs.bsky.app/docs/category/http-reference',
        officialPolicyUrl: 'https://bsky.social/about/support/tos',
        engineeringOwner: 'Backend/Connectors 2',
        policyOwner: 'Policy Owner',
        lastPolicyReviewAt: `${SOURCE_VERIFIED_ON}T00:00:00.000Z`,
        nextPolicyReviewAt: '2027-02-04T00:00:00.000Z',
        contractVersion: CONNECTOR_CONTRACT_VERSION,
        features: {
          ...NOT_IMPLEMENTED_FEATURES,
          discover_accounts: 'supported',
          search_mentions: 'supported',
          native_mentions: 'supported',
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
          alt_text: 'supported',
          carousel: 'supported',
          video: 'supported',
        },
      };
    },

    authorization(): AuthorizationDefinition {
      // Use the official OAuth path when it is generally available. Until then an app
      // password is a first-class secret in the token vault, and the connect UI explains
      // what an app password is and how to revoke it. We never ask for a main password.
      return {
        flavor: 'provider_specific',
        authorizeUrl: APP_PASSWORD_DOCS,
        tokenUrl: `${serviceUrl(deps)}/xrpc/com.atproto.server.createSession`,
        revokeUrl: `${serviceUrl(deps)}/xrpc/com.atproto.server.deleteSession`,
        redirectPath: '/oauth/bluesky/callback',
        scopes: [
          {
            scope: 'atproto:repo.write',
            explanationKey: 'connectors.bluesky.scope.repo_write',
            usedBy: ['composer', 'queue'],
            required: true,
          },
          {
            scope: 'atproto:repo.read',
            explanationKey: 'connectors.bluesky.scope.repo_read',
            usedBy: ['connections', 'analytics'],
            required: true,
          },
        ],
        pkceRequired: false,
        multiStep: false,
        stepDescriptionKeys: ['connectors.bluesky.app_password_note'],
        supportsRefresh: true,
        refreshAtLifetimeFraction: 0.75,
        extraAuthorizeParameters: {},
      };
    },

    async discoverAccounts(grant: OAuthGrant): Promise<ExternalAccount[]> {
      // The AT Protocol session response is the identity: one DID, one handle.
      const response = await http.request({
        method: 'GET',
        url: `${serviceUrl(deps)}/xrpc/com.atproto.server.getSession`,
        headers: { authorization: `Bearer ${await grant.accessToken.use((value) => value)}` },
        accept: 'json',
        provider: PROVIDER,
        operation: 'bluesky.get_session',
      });
      ensureOk(response, {
        provider: PROVIDER,
        operation: 'bluesky.get_session',
        response,
        remediationCode: REMEDIATION.reconnectAccount,
      });
      const session = parseProviderBody(atprotoSessionSchema.partial({ accessJwt: true, refreshJwt: true }), response, {
        provider: PROVIDER,
        operation: 'bluesky.get_session',
        response,
      });
      return [
        {
          externalAccountId: session.did,
          accountType: 'personal_profile',
          displayName: session.handle,
          handle: session.handle,
          avatarUrl: null,
          profileUrl: `https://bsky.app/profile/${session.handle}`,
          parentExternalId: null,
          grantedScopes: [...grant.grantedScopes],
          eligible: session.active !== false,
          ineligibleReasonKey: session.active === false ? 'connectors.bluesky.account_inactive' : null,
          accountAccessToken: null,
          metadata: { handle: session.handle, serviceUrl: serviceUrl(deps) },
        },
      ];
    },

    async searchMentions(input: MentionSearchRequest): Promise<MentionEntity[]> {
      const query = input.query.replace(/^@/u, '').trim();
      if (query === '') {
        return [];
      }
      const response = await xrpcGet(
        input.connection,
        'app.bsky.actor.searchActorsTypeahead',
        { q: query, limit: input.limit },
        'bluesky.search_mentions',
      );
      if (!response.ok) {
        logger.warn(
          { provider: PROVIDER, status: response.status },
          'bluesky mention lookup unavailable',
        );
        return [];
      }
      const parsed = parseProviderBody(blueskyActorSearchSchema, response, {
        provider: PROVIDER,
        operation: 'bluesky.search_mentions',
        response,
      });
      const resolvedAt = nowIso();
      return parsed.actors.map((actor) => ({
        externalId: actor.did,
        displayLabel: actor.displayName ?? actor.handle,
        handle: actor.handle,
        kind: 'person' as const,
        avatarUrl: actor.avatar ?? null,
        // A DID is a real, immutable entity id, so this is a native tag.
        resolvedToExternalId: true,
        resolvedAt,
      }));
    },

    async getCapabilities(connection: ProviderConnection) {
      return buildBlueskyCapabilities({ connection, observedAt: nowIso() });
    },

    async validateDraft(draft: ProviderDraft): Promise<ValidationResult> {
      const targetId = draft.connection.connectionId;
      blueskyProviderOptionsSchema.parse(providerOptionsOf(draft));
      const issues: ValidationIssue[] = [
        ...validateDraftShape(draft, draft.capabilities, {
          unit: 'grapheme',
          // The community norm, enforced rather than suggested.
          requireAltText: BLUESKY_REQUIRE_ALT_TEXT,
          allowMixedMedia: false,
        }),
      ];

      // The grapheme limit is the visible one, but a byte ceiling sits underneath it.
      const bytes = byteLength(draft.body);
      if (bytes > BLUESKY_MAX_BYTES) {
        issues.push(
          validationIssue({
            code: 'BLUESKY_BYTE_LIMIT_EXCEEDED',
            severity: 'error',
            field: 'body',
            targetId,
            remediationKey: REMEDIATION.contentTooLong,
            params: {
              provider: PROVIDER,
              bytes,
              limit: BLUESKY_MAX_BYTES,
              graphemes: countGraphemes(draft.body),
            },
          }),
        );
      }

      for (const [index, item] of draft.threadItems.entries()) {
        if (byteLength(item.body) > BLUESKY_MAX_BYTES) {
          issues.push(
            validationIssue({
              code: 'BLUESKY_BYTE_LIMIT_EXCEEDED',
              severity: 'error',
              field: `threadItems.${index}.body`,
              targetId,
              remediationKey: REMEDIATION.contentTooLong,
              params: {
                provider: PROVIDER,
                bytes: byteLength(item.body),
                limit: BLUESKY_MAX_BYTES,
              },
            }),
          );
        }
      }

      return validationResult({ issues });
    },

    async prepareMedia(input: MediaPreparationRequest): Promise<PreparedMedia[]> {
      const prepared: PreparedMedia[] = [];
      for (const media of input.media) {
        prepared.push(await uploadBlob(input.connection, media));
      }
      return prepared;
    },

    async preview(draft: ProviderDraft): Promise<CanonicalPreview> {
      return buildPreview(draft, draft.capabilities, {
        unit: 'grapheme',
        mediaLayout: draft.media.some((item) => item.kind === 'video') ? 'video' : 'grid',
        linkRendering: 'card',
        // Bluesky mentions are facets carrying a DID, so an unresolved handle is plain text
        // and the composer must label it.
        resolvesMentionsAtRender: true,
        privacyLabelKey: null,
        warningKeys: draft.media.some((item) => item.altText === null && !item.altTextWaived)
          ? ['connectors.bluesky.alt_text_expected']
          : [],
      });
    },

    async publish(request: PublishRequest): Promise<PublishResult> {
      const { draft } = request;
      const connection = draft.connection;
      const options = blueskyProviderOptionsSchema.parse(providerOptionsOf(draft));
      const handle = handleOf(connection);
      const explicitReply =
        options.replyRootUri !== undefined &&
        options.replyRootCid !== undefined &&
        options.replyParentUri !== undefined &&
        options.replyParentCid !== undefined
          ? {
              root: { uri: options.replyRootUri, cid: options.replyRootCid },
              parent: { uri: options.replyParentUri, cid: options.replyParentCid },
            }
          : null;
      const created = await createRecord(
        connection,
        postRecord(draft, draft.body, request.preparedMedia, options, explicitReply),
        'bluesky.create_post',
      );
      const rootRef = { uri: created.uri, cid: created.cid };
      const publishedAt = nowIso();

      const root: PublishItemResult = {
        kind: 'root',
        order: 0,
        threadItemId: null,
        externalPostId: rootRef.uri,
        permalink: blueskyPermalink(handle, rootRef.uri),
        publishedAt,
      };
      const items: PublishItemResult[] = [root];
      const failures: FailedItem[] = [];
      let parent = rootRef;
      let pending = false;
      let failed = false;

      for (const item of [...draft.threadItems].sort((left, right) => left.order - right.order)) {
        if (item.delaySeconds > 0 || failed) {
          // Delayed parts are handed to a later activity. If one reaches this adapter,
          // report it honestly rather than sleeping or inventing a provider job.
          pending = item.delaySeconds > 0;
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
          const created = await createRecord(
            connection,
            postRecord(
              { ...draft, media: [], mentions: [] },
              item.body,
              [],
              options,
              { root: rootRef, parent },
            ),
            'bluesky.create_reply',
          );
          parent = { uri: created.uri, cid: created.cid };
          items.push({
            kind: item.kind,
            order: item.order,
            threadItemId: item.threadItemId,
            externalPostId: created.uri,
            permalink: blueskyPermalink(handle, created.uri),
            publishedAt,
          });
        } catch (error) {
          failed = true;
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

      const sanitizedResponse = { rootUri: rootRef.uri, itemCount: items.length, pending };
      if (failures.length > 0) {
        return {
          status: 'partial',
          externalPostId: rootRef.uri,
          permalink: blueskyPermalink(handle, rootRef.uri),
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
        externalPostId: rootRef.uri,
        permalink: blueskyPermalink(handle, rootRef.uri),
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
      const response = await xrpcGet(
        input.connection,
        'app.bsky.feed.getPostThread',
        { uri: externalPostId, depth: 0, parentHeight: 0 },
        'bluesky.get_status',
      );
      if (!response.ok) {
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
      const parsed = parseProviderBody(blueskyPostThreadSchema, response, {
        provider: PROVIDER,
        operation: 'bluesky.get_status',
        response,
      });
      const post = parsed.thread.post;
      if (parsed.thread.notFound === true || post === undefined) {
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
          sanitizedResponse: { notFound: true },
        };
      }
      return {
        state: 'published',
        externalPostId: post.uri,
        permalink: blueskyPermalink(handleOf(input.connection), post.uri),
        publishedAt: post.indexedAt ?? nowIso(),
        items: [
          {
            kind: 'root',
            order: 0,
            threadItemId: null,
            externalPostId: post.uri,
            permalink: blueskyPermalink(handleOf(input.connection), post.uri),
            publishedAt: post.indexedAt ?? nowIso(),
          },
        ],
        error: null,
        pollAfterSeconds: null,
        sanitizedResponse: { indexedAt: post.indexedAt ?? null },
      };
    },

    async deletePost(input: DeleteRequest): Promise<void> {
      const accessToken = await token(input.connection);
      const rkey = input.externalPostId.split('/').pop();
      if (rkey === undefined || rkey === '') {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'bluesky.delete_post',
          remediationCode: REMEDIATION.contactSupport,
          details: { reason: 'unparsable_at_uri' },
        });
      }
      const response = await http.request({
        method: 'POST',
        url: `${serviceUrl(deps, input.connection)}/xrpc/com.atproto.repo.deleteRecord`,
        headers: { authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' },
        json: {
          repo: input.connection.externalAccountId,
          collection: POST_COLLECTION,
          rkey,
        },
        accept: 'json',
        provider: PROVIDER,
        operation: 'bluesky.delete_post',
      });
      ensureOk(response, { provider: PROVIDER, operation: 'bluesky.delete_post', response });
    },

    async fetchMetrics(input: MetricsRequest): Promise<MetricObservation[]> {
      const observedAt = nowIso();

      if (input.scope === 'account') {
        const response = await xrpcGet(
          input.connection,
          'app.bsky.actor.getProfile',
          { actor: input.connection.externalAccountId },
          'bluesky.account_metrics',
        );
        if (!response.ok) {
          return mapMetrics({
            provider: PROVIDER,
            scope: 'account',
            mappings: BLUESKY_ACCOUNT_METRICS,
            values: {},
            observedAt,
            rawPayload: { status: response.status },
            missingAvailability:
              response.status === 401 ? 'unavailable_permission' : 'unavailable_provider',
          });
        }
        const profile = parseProviderBody(blueskyProfileSchema, response, {
          provider: PROVIDER,
          operation: 'bluesky.account_metrics',
          response,
        });
        return mapMetrics({
          provider: PROVIDER,
          scope: 'account',
          mappings: BLUESKY_ACCOUNT_METRICS,
          values: { postsCount: profile.postsCount },
          observedAt,
          rawPayload: { postsCount: profile.postsCount },
        });
      }

      const externalPostId = input.externalPostId;
      if (externalPostId === null) {
        return mapMetrics({
          provider: PROVIDER,
          scope: 'post',
          mappings: BLUESKY_POST_METRICS,
          values: {},
          observedAt,
          rawPayload: {},
          missingAvailability: 'unavailable_pending',
        });
      }
      const response = await xrpcGet(
        input.connection,
        'app.bsky.feed.getPostThread',
        { uri: externalPostId, depth: 0, parentHeight: 0 },
        'bluesky.post_metrics',
      );
      if (!response.ok) {
        return mapMetrics({
          provider: PROVIDER,
          scope: 'post',
          mappings: BLUESKY_POST_METRICS,
          values: {},
          observedAt,
          rawPayload: { status: response.status },
          missingAvailability:
            response.status === 401 ? 'unavailable_permission' : 'unavailable_provider',
        });
      }
      const parsed = parseProviderBody(blueskyPostThreadSchema, response, {
        provider: PROVIDER,
        operation: 'bluesky.post_metrics',
        response,
      });
      const post = parsed.thread.post;
      const values = {
        likeCount: post?.likeCount,
        replyCount: post?.replyCount,
        repostCount: post?.repostCount,
        quoteCount: post?.quoteCount,
      };
      return mapMetrics({
        provider: PROVIDER,
        scope: 'post',
        mappings: BLUESKY_POST_METRICS,
        values,
        observedAt,
        rawPayload: values,
      });
    },

    async refreshCredential(input: RefreshRequest): Promise<CredentialResult> {
      // The AT Protocol refresh uses the refresh JWT as the bearer, not a form grant.
      const response = await http.request({
        method: 'POST',
        url: `${serviceUrl(deps)}/xrpc/com.atproto.server.refreshSession`,
        headers: { authorization: `Bearer ${await input.refreshToken.use((value) => value)}` },
        accept: 'json',
        provider: PROVIDER,
        operation: 'bluesky.refresh_session',
      });
      ensureOk(response, {
        provider: PROVIDER,
        operation: 'bluesky.refresh_session',
        response,
        remediationCode: REMEDIATION.reconnectAccount,
      });
      const session = parseProviderBody(atprotoSessionSchema, response, {
        provider: PROVIDER,
        operation: 'bluesky.refresh_session',
        response,
      });
      return {
        accessToken: new SecretValue(session.accessJwt, 'access_token'),
        refreshToken: new SecretValue(session.refreshJwt, 'refresh_token'),
        tokenType: 'bearer',
        // The AT Protocol does not return an expiry; the access JWT is short lived and we
        // refresh proactively rather than guessing a lifetime.
        expiresAt: null,
        grantedScopes: [...input.grantedScopes],
        refreshTokenRotated: true,
        obtainedAt: nowIso(),
      };
    },

    async revoke(input: RevokeRequest): Promise<void> {
      const accessToken = await input.accessToken.use((value) => value);
      const response = await http.request({
        method: 'POST',
        url: `${serviceUrl(deps)}/xrpc/com.atproto.server.deleteSession`,
        headers: { authorization: `Bearer ${accessToken}` },
        accept: 'none',
        provider: PROVIDER,
        operation: 'bluesky.delete_session',
      });
      if (!response.ok) {
        // We delete our stored credential regardless.
        logger.warn(
          { provider: PROVIDER, status: response.status },
          'bluesky session deletion did not succeed',
        );
      }
    },
  };
}
