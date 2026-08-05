import {
  validationIssue,
  validationResult,
  type MetricObservation,
  type ValidationIssue,
  type ValidationResult,
} from '@relay/contracts';

import {
  CONNECTOR_CONTRACT_VERSION,
  REMEDIATION,
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
  const { http, vault, clock, logger } = deps;

  async function token(connection: ProviderConnection): Promise<string> {
    return vault.getAccessToken(connection.credentialRef);
  }

  function nowIso(): string {
    return clock.now().toISOString();
  }

  function handleOf(connection: ProviderConnection): string | null {
    const handle = connection.metadata['handle'];
    return typeof handle === 'string' && handle !== '' ? handle : null;
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
      url: media.downloadUrl,
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
      remediationKey: REMEDIATION.mediaInvalid,
    });
    const parsed = parseProviderBody(atprotoBlobSchema, response, {
      provider: PROVIDER,
      operation: 'bluesky.upload_blob',
      response,
    });
    return {
      mediaId: media.mediaId,
      providerMediaId: parsed.blob.ref.$link,
      providerContainerId: null,
      uploadUrl: null,
      state: 'ready',
      checksum: media.sha256,
      variant: `bluesky:${media.kind}`,
      metadata: { mimeType: parsed.blob.mimeType, size: parsed.blob.size },
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
    const video = blobs.find((item) => item.variant === 'bluesky:video');
    if (video !== undefined) {
      return {
        $type: 'app.bsky.embed.video',
        video: {
          $type: 'blob',
          ref: { $link: video.providerMediaId },
          mimeType: video.metadata['mimeType'],
          size: video.metadata['size'],
        },
      };
    }
    return {
      $type: 'app.bsky.embed.images',
      images: blobs.map((blob, index) => ({
        image: {
          $type: 'blob',
          ref: { $link: blob.providerMediaId },
          mimeType: blob.metadata['mimeType'],
          size: blob.metadata['size'],
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
    const mentions: ResolvedMention[] = draft.mentions.map((mention) => ({
      did: mention.externalId,
      offset: mention.offset,
      length: mention.length,
    }));
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
        docsUrl: 'https://docs.bsky.app/docs/category/http-reference',
        policyUrl: 'https://bsky.social/about/support/tos',
        engineeringOwner: 'Backend/Connectors 2',
        policyOwner: 'Policy Owner',
        lastPolicyReviewAt: SOURCE_VERIFIED_ON,
        contractVersion: CONNECTOR_CONTRACT_VERSION,
      };
    },

    authorization(): AuthorizationDefinition {
      // Use the official OAuth path when it is generally available. Until then an app
      // password is a first-class secret in the token vault, and the connect UI explains
      // what an app password is and how to revoke it. We never ask for a main password.
      return {
        flavor: 'app_password',
        authorizeUrl: APP_PASSWORD_DOCS,
        tokenUrl: `${serviceUrl(deps)}/xrpc/com.atproto.server.createSession`,
        revokeUrl: `${serviceUrl(deps)}/xrpc/com.atproto.server.deleteSession`,
        requiresPkce: false,
        multiStep: false,
        redirectPath: '/oauth/bluesky/callback',
        scopes: [
          { scope: 'atproto:repo.write', descriptionKey: 'connectors.bluesky.scope.repo_write' },
          { scope: 'atproto:repo.read', descriptionKey: 'connectors.bluesky.scope.repo_read' },
        ],
        notesKey: 'connectors.bluesky.app_password_note',
      };
    },

    async discoverAccounts(grant: OAuthGrant): Promise<ExternalAccount[]> {
      // The AT Protocol session response is the identity: one DID, one handle.
      const response = await http.request({
        method: 'GET',
        url: `${serviceUrl(deps)}/xrpc/com.atproto.server.getSession`,
        headers: { authorization: `Bearer ${grant.accessToken}` },
        accept: 'json',
        provider: PROVIDER,
        operation: 'bluesky.get_session',
      });
      ensureOk(response, {
        provider: PROVIDER,
        operation: 'bluesky.get_session',
        response,
        remediationKey: REMEDIATION.reconnectAccount,
      });
      const session = parseProviderBody(atprotoSessionSchema.partial({ accessJwt: true, refreshJwt: true }), response, {
        provider: PROVIDER,
        operation: 'bluesky.get_session',
        response,
      });
      return [
        {
          externalId: session.did,
          accountType: 'personal_profile',
          displayName: session.handle,
          handle: session.handle,
          avatarUrl: null,
          parentExternalId: null,
          connectable: session.active !== false,
          blockedReasonKey: session.active === false ? 'connectors.bluesky.account_inactive' : null,
          scopes: [...grant.scopes],
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
        { q: query, limit: input.limit ?? 8 },
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
      return parsed.actors.map((actor) => ({
        externalId: actor.did,
        displayLabel: actor.displayName ?? actor.handle,
        handle: actor.handle,
        kind: 'person' as const,
        avatarUrl: actor.avatar ?? null,
        // A DID is a real, immutable entity id, so this is a native tag.
        resolved: true,
      }));
    },

    async getCapabilities(connection: ProviderConnection) {
      return buildBlueskyCapabilities({ connection, observedAt: nowIso() });
    },

    async validateDraft(draft: ProviderDraft): Promise<ValidationResult> {
      const targetId = draft.connection.connectionId;
      blueskyProviderOptionsSchema.parse(draft.providerOptions);
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
      const { connection, draft } = request;
      const options = blueskyProviderOptionsSchema.parse(draft.providerOptions);
      const handle = handleOf(connection);

      const resumedUri = request.resume['rootUri'];
      const resumedCid = request.resume['rootCid'];
      let rootRef =
        typeof resumedUri === 'string' && typeof resumedCid === 'string'
          ? { uri: resumedUri, cid: resumedCid }
          : null;

      if (rootRef === null) {
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
        rootRef = { uri: created.uri, cid: created.cid };
      }

      const root: PublishItemResult = {
        kind: 'root',
        order: 0,
        threadItemId: null,
        state: 'published',
        externalPostId: rootRef.uri,
        permalink: blueskyPermalink(handle, rootRef.uri),
        errorClass: null,
        errorCode: null,
        remediationKey: null,
      };

      const publishedOrders = new Set<number>(
        Array.isArray(request.resume['publishedOrders'])
          ? (request.resume['publishedOrders'] as unknown[]).filter(
              (entry): entry is number => typeof entry === 'number',
            )
          : [],
      );
      const items: PublishItemResult[] = [];
      let parent = rootRef;
      let pending = false;
      let failed = false;

      for (const item of [...draft.threadItems].sort((left, right) => left.order - right.order)) {
        if (publishedOrders.has(item.order)) {
          continue;
        }
        if (item.delaySeconds > 0 || failed) {
          // A delayed part is the worker's to schedule. The connector never sleeps.
          pending = true;
          items.push({
            kind: item.kind,
            order: item.order,
            threadItemId: item.id,
            state: 'processing',
            externalPostId: null,
            permalink: null,
            errorClass: null,
            errorCode: null,
            remediationKey: null,
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
          publishedOrders.add(item.order);
          items.push({
            kind: item.kind,
            order: item.order,
            threadItemId: item.id,
            state: 'published',
            externalPostId: created.uri,
            permalink: blueskyPermalink(handle, created.uri),
            errorClass: null,
            errorCode: null,
            remediationKey: null,
          });
        } catch {
          failed = true;
          items.push({
            kind: item.kind,
            order: item.order,
            threadItemId: item.id,
            state: 'failed',
            externalPostId: null,
            permalink: null,
            errorClass: null,
            errorCode: null,
            remediationKey: REMEDIATION.commentFailedRootPublished,
          });
        }
      }

      return {
        state: failed ? 'partially_published' : pending ? 'processing' : 'published',
        externalPostId: rootRef.uri,
        permalink: blueskyPermalink(handle, rootRef.uri),
        root,
        items,
        pollToken: rootRef.uri,
        resume: {
          rootUri: rootRef.uri,
          rootCid: rootRef.cid,
          publishedOrders: [...publishedOrders],
        },
        sanitizedProviderResponse: { rootUri: rootRef.uri, itemCount: items.length },
        costMinor: null,
        currency: null,
      };
    },

    async getStatus(input: StatusRequest): Promise<PublishStatus> {
      const response = await xrpcGet(
        input.connection,
        'app.bsky.feed.getPostThread',
        { uri: input.pollToken, depth: 0, parentHeight: 0 },
        'bluesky.get_status',
      );
      if (!response.ok) {
        return {
          state: 'unknown',
          externalPostId: null,
          permalink: null,
          errorClass: null,
          remediationKey: null,
          sanitizedProviderResponse: { status: response.status },
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
          errorClass: 'PERMANENT_PROVIDER',
          remediationKey: REMEDIATION.providerRejectedContent,
          sanitizedProviderResponse: { notFound: true },
        };
      }
      return {
        state: 'published',
        externalPostId: post.uri,
        permalink: blueskyPermalink(handleOf(input.connection), post.uri),
        errorClass: null,
        remediationKey: null,
        sanitizedProviderResponse: { indexedAt: post.indexedAt ?? null },
      };
    },

    async deletePost(input: DeleteRequest): Promise<void> {
      const accessToken = await token(input.connection);
      const rkey = input.externalPostId.split('/').pop();
      if (rkey === undefined || rkey === '') {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'bluesky.delete_post',
          remediationKey: REMEDIATION.contactSupport,
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
      if (externalPostId === undefined) {
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
        url: `${serviceUrl(deps, input.connection)}/xrpc/com.atproto.server.refreshSession`,
        headers: { authorization: `Bearer ${input.refreshToken}` },
        accept: 'json',
        provider: PROVIDER,
        operation: 'bluesky.refresh_session',
      });
      ensureOk(response, {
        provider: PROVIDER,
        operation: 'bluesky.refresh_session',
        response,
        remediationKey: REMEDIATION.reconnectAccount,
      });
      const session = parseProviderBody(atprotoSessionSchema, response, {
        provider: PROVIDER,
        operation: 'bluesky.refresh_session',
        response,
      });
      return {
        accessToken: session.accessJwt,
        refreshToken: session.refreshJwt,
        // The AT Protocol does not return an expiry; the access JWT is short lived and we
        // refresh proactively rather than guessing a lifetime.
        expiresAt: null,
        scopes: [],
      };
    },

    async revoke(input: RevokeRequest): Promise<void> {
      const accessToken = await token(input.connection);
      const response = await http.request({
        method: 'POST',
        url: `${serviceUrl(deps, input.connection)}/xrpc/com.atproto.server.deleteSession`,
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
