import {
  accountTypeSchema,
  capabilitySnapshotSchema,
  capabilitySupportSchema,
  checksumSchema,
  contentKindSchema,
  creationSurfaceSchema,
  destinationKindSchema,
  disclosureFlagsSchema,
  idempotencyKeySchema,
  isoInstantSchema,
  linkSpecSchema,
  localeSchema,
  mediaKindSchema,
  metricObservationSchema,
  normalizedMetricNameSchema,
  providerIdSchema,
  validationResultSchema,
} from '@relay/contracts';
import type {
  CapabilitySnapshot,
  CapabilitySupport,
  MetricObservation,
  ValidationResult,
} from '@relay/contracts';
import { z } from 'zod';

import { type ProviderErrorClass, type RemediationCode, providerOperationSchema } from './errors';
import type { HttpClient } from './http';
import type { Clock, ConnectorLogger } from './ports';
import { type ConnectorVault, type SecretHandle, SecretValue } from './vault';

/**
 * The versioned connector contract.
 *
 * Reproduced from `docs/research/02-development-handoff.md` section 7 and
 * `docs/planning/05-social-connectors.md` section 1. A breaking change bumps
 * `CONNECTOR_CONTRACT_VERSION` and every adapter is updated in the same pull
 * request.
 *
 * Methods marked optional are optional because some providers genuinely do not
 * offer them. An absent optional method renders as `unsupported`. A method that
 * exists and throws `CAPABILITY_NOT_IMPLEMENTED` renders as `not_implemented`.
 * Those two are different states and the registry keeps them apart.
 */
export const CONNECTOR_CONTRACT_VERSION = '1.0.0';

/* ------------------------------------------------------------------ identity */

export const CONNECTOR_LABELS = ['supported', 'beta', 'not_implemented'] as const;
export const connectorLabelSchema = z.enum(CONNECTOR_LABELS);
/** The public label. `supported` requires a signed definition of done. */
export type ConnectorLabel = z.infer<typeof connectorLabelSchema>;

/**
 * Every capability the registry reports per provider. The comment capabilities
 * are three independent features on purpose: most providers give us one or two,
 * and merging them is how a capability page starts lying.
 */
export const CONNECTOR_FEATURES = [
  'discover_accounts',
  'list_destinations',
  'search_mentions',
  'native_mentions',
  'get_capabilities',
  'validate_draft',
  'prepare_media',
  'preview',
  'publish',
  'get_status',
  'delete_post',
  'fetch_metrics',
  'refresh_credential',
  'revoke',
  'first_comment',
  'thread_parts',
  'comment_count',
  'comment_replies',
  'provider_idempotency',
  'post_analytics',
  'account_analytics',
  'privacy_controls',
  'ai_disclosure',
  'commercial_disclosure',
  'alt_text',
  'carousel',
  'video',
  'document',
  'metered_cost',
] as const;
export const connectorFeatureSchema = z.enum(CONNECTOR_FEATURES);
export type ConnectorFeature = z.infer<typeof connectorFeatureSchema>;

/**
 * Every feature declared `not_implemented`, the honest starting point for a new
 * adapter. Spread it and override only what has actually been built and tested.
 */
export const NOT_IMPLEMENTED_FEATURES: Readonly<Record<ConnectorFeature, CapabilitySupport>> =
  Object.freeze(
    Object.fromEntries(CONNECTOR_FEATURES.map((feature) => [feature, 'not_implemented'])) as Record<
      ConnectorFeature,
      CapabilitySupport
    >,
  );

/** Optional interface methods, and the feature each one backs. */
export const OPTIONAL_METHOD_FEATURES: Readonly<Record<string, ConnectorFeature>> = Object.freeze({
  listDestinations: 'list_destinations',
  searchMentions: 'search_mentions',
  deletePost: 'delete_post',
  revoke: 'revoke',
});

export const providerIdentitySchema = z
  .object({
    provider: providerIdSchema,
    displayName: z.string().min(1),
    /** Design system icon token, never an image URL. */
    iconToken: z.string().min(1),
    accountTypes: z.array(accountTypeSchema).min(1),
    contractVersion: z.string().min(1),
    connectorVersion: z.string().min(1),
    label: connectorLabelSchema,
    /** Shown before OAuth when the label is not `supported`. */
    limitationKey: z.string().min(1).nullable(),
    officialDocsUrl: z.string().min(1),
    officialPolicyUrl: z.string().min(1),
    engineeringOwner: z.string().min(1),
    policyOwner: z.string().min(1),
    lastPolicyReviewAt: isoInstantSchema,
    nextPolicyReviewAt: isoInstantSchema,
    features: z.record(connectorFeatureSchema, capabilitySupportSchema),
  })
  .strict();
export type ProviderIdentity = z.infer<typeof providerIdentitySchema>;

/* ------------------------------------------------------------- authorization */

export const OAUTH_FLAVORS = [
  'oauth2_pkce',
  'oauth2_client_credentials_exchange',
  'oauth1a',
  'provider_specific',
] as const;
export const oauthFlavorSchema = z.enum(OAUTH_FLAVORS);
export type OAuthFlavor = z.infer<typeof oauthFlavorSchema>;

export const scopeRequestSchema = z
  .object({
    scope: z.string().min(1),
    /** One line, rendered verbatim on the consent screen. */
    explanationKey: z.string().min(1),
    /** The shipped screen that needs it. No scope for a future feature. */
    usedBy: z.array(z.string().min(1)).min(1),
    required: z.boolean(),
  })
  .strict();
export type ScopeRequest = z.infer<typeof scopeRequestSchema>;

export const authorizationDefinitionSchema = z
  .object({
    flavor: oauthFlavorSchema,
    authorizeUrl: z.string().min(1),
    tokenUrl: z.string().min(1),
    revokeUrl: z.string().min(1).nullable(),
    /** Path only. The absolute redirect is built from `API_URL` at runtime. */
    redirectPath: z.string().min(1),
    scopes: z.array(scopeRequestSchema),
    pkceRequired: z.boolean(),
    /** Meta returns a user token from which Page tokens are exchanged. */
    multiStep: z.boolean(),
    stepDescriptionKeys: z.array(z.string().min(1)),
    supportsRefresh: z.boolean(),
    /** Refresh at this fraction of the token lifetime. Default 0.75. */
    refreshAtLifetimeFraction: z.number().positive().max(1),
    extraAuthorizeParameters: z.record(z.string(), z.string()),
  })
  .strict();
export type AuthorizationDefinition = z.infer<typeof authorizationDefinitionSchema>;

/* --------------------------------------------------------- credentials input */

const secretHandleSchema = z.custom<SecretHandle>(
  (value) =>
    typeof value === 'object' &&
    value !== null &&
    typeof (value as SecretHandle).use === 'function' &&
    typeof (value as SecretHandle).release === 'function',
  { error: 'INVALID_SECRET_HANDLE' },
);

const secretValueSchema = z.custom<SecretValue>((value) => value instanceof SecretValue, {
  error: 'INVALID_SECRET_VALUE',
});

export const oauthClientConfigSchema = z
  .object({
    clientId: z.string().min(1),
    clientSecret: secretValueSchema.nullable(),
    redirectUri: z.string().min(1),
  })
  .strict();
export type OAuthClientConfig = z.infer<typeof oauthClientConfigSchema>;

export const oauthGrantInputSchema = z
  .object({
    provider: providerIdSchema,
    workspaceId: z.string().min(1),
    accessToken: secretHandleSchema,
    refreshToken: secretHandleSchema.nullable(),
    grantedScopes: z.array(z.string().min(1)),
    obtainedAt: isoInstantSchema,
    accessTokenExpiresAt: isoInstantSchema.nullable(),
    /** Provider specific identifiers returned with the grant, already sanitized. */
    grantMetadata: z.record(z.string(), z.unknown()),
  })
  .strict();
export type OAuthGrantInput = z.infer<typeof oauthGrantInputSchema>;

export const externalAccountSchema = z
  .object({
    externalAccountId: z.string().min(1),
    accountType: accountTypeSchema,
    displayName: z.string().min(1),
    handle: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    profileUrl: z.string().nullable(),
    /** The Page an Instagram professional account hangs off, for example. */
    parentExternalId: z.string().nullable(),
    grantedScopes: z.array(z.string().min(1)),
    /** False when the account exists but cannot be published to. */
    eligible: z.boolean(),
    ineligibleReasonKey: z.string().min(1).nullable(),
    /** Per account credential, where the provider issues one. */
    accountAccessToken: secretValueSchema.nullable(),
    metadata: z.record(z.string(), z.unknown()),
  })
  .strict();
export type ExternalAccount = z.infer<typeof externalAccountSchema>;

export const connectionRefSchema = z
  .object({
    connectionId: z.string().min(1),
    workspaceId: z.string().min(1),
    provider: providerIdSchema,
    accountType: accountTypeSchema,
    externalAccountId: z.string().min(1),
    displayName: z.string().min(1),
    grantedScopes: z.array(z.string().min(1)),
    accessToken: secretHandleSchema,
    locale: localeSchema,
    metadata: z.record(z.string(), z.unknown()),
  })
  .strict();
export type ConnectionRef = z.infer<typeof connectionRefSchema>;

/* -------------------------------------------------- destinations and mentions */

export const destinationRequestSchema = z
  .object({
    connection: connectionRefSchema,
    kind: destinationKindSchema,
    query: z.string().nullable(),
    cursor: z.string().nullable(),
    limit: z.number().int().positive().max(200),
  })
  .strict();
export type DestinationRequest = z.infer<typeof destinationRequestSchema>;

export const providerDestinationSchema = z
  .object({
    externalId: z.string().min(1),
    kind: destinationKindSchema,
    displayLabel: z.string().min(1),
    parentExternalId: z.string().nullable(),
    canPost: z.boolean(),
    /** Cached in `provider_destinations`; refetched once stale. */
    refreshedAt: isoInstantSchema,
    expiresAt: isoInstantSchema,
    metadata: z.record(z.string(), z.unknown()),
  })
  .strict();
export type ProviderDestination = z.infer<typeof providerDestinationSchema>;

export const mentionSearchRequestSchema = z
  .object({
    connection: connectionRefSchema,
    query: z.string().min(1),
    limit: z.number().int().positive().max(50),
  })
  .strict();
export type MentionSearchRequest = z.infer<typeof mentionSearchRequestSchema>;

export const MENTION_KINDS = ['person', 'organization', 'page', 'community', 'unknown'] as const;
export const mentionKindSchema = z.enum(MENTION_KINDS);
export type MentionKind = z.infer<typeof mentionKindSchema>;

export const mentionEntitySchema = z
  .object({
    externalId: z.string().min(1),
    kind: mentionKindSchema,
    displayLabel: z.string().min(1),
    handle: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    /**
     * False when the provider resolves handles at render time rather than
     * returning an entity. The composer must then say the tag is plain text.
     */
    resolvedToExternalId: z.boolean(),
    resolvedAt: isoInstantSchema,
  })
  .strict();
export type MentionEntity = z.infer<typeof mentionEntitySchema>;

/* ------------------------------------------------------------ drafts and media */

export const providerMediaRefSchema = z
  .object({
    mediaId: z.string().min(1),
    derivativeId: z.string().nullable(),
    kind: mediaKindSchema,
    mimeType: z.string().min(1),
    byteSize: z.number().int().positive(),
    width: z.number().int().positive().nullable(),
    height: z.number().int().positive().nullable(),
    durationSeconds: z.number().nonnegative().nullable(),
    checksum: checksumSchema,
    altText: z.string().nullable(),
    altTextWaived: z.boolean(),
    /** Short lived signed URL, for providers that pull from a URL. */
    sourceUrl: z.string().nullable(),
    sourceUrlExpiresAt: isoInstantSchema.nullable(),
  })
  .strict();
export type ProviderMediaRef = z.infer<typeof providerMediaRefSchema>;

export const providerThreadItemSchema = z
  .object({
    threadItemId: z.string().min(1),
    kind: z.enum(['comment', 'thread']),
    order: z.number().int().nonnegative(),
    body: z.string(),
    media: z.array(providerMediaRefSchema),
    delaySeconds: z.number().int().nonnegative(),
    links: z.array(linkSpecSchema),
  })
  .strict();
export type ProviderThreadItem = z.infer<typeof providerThreadItemSchema>;

export const providerDraftSchema = z
  .object({
    connection: connectionRefSchema,
    contentItemId: z.string().min(1),
    postVariantId: z.string().min(1),
    contentKind: contentKindSchema,
    locale: localeSchema,
    title: z.string().nullable(),
    body: z.string(),
    media: z.array(providerMediaRefSchema),
    links: z.array(linkSpecSchema),
    threadItems: z.array(providerThreadItemSchema),
    destination: providerDestinationSchema.nullable(),
    mentions: z.array(mentionEntitySchema),
    /** No default is ever chosen for the user where the provider forbids one. */
    privacyValue: z.string().nullable(),
    disclosure: disclosureFlagsSchema,
    scheduledInstant: isoInstantSchema.nullable(),
    createdVia: creationSurfaceSchema,
    capabilities: capabilitySnapshotSchema,
  })
  .strict();
export type ProviderDraft = z.infer<typeof providerDraftSchema>;

export const mediaPreparationRequestSchema = z
  .object({
    connection: connectionRefSchema,
    postVariantId: z.string().min(1),
    contentKind: contentKindSchema,
    media: z.array(providerMediaRefSchema),
    /** Preparation is idempotent on (asset, connection, variant). */
    idempotencyKey: idempotencyKeySchema,
    capabilities: capabilitySnapshotSchema,
  })
  .strict();
export type MediaPreparationRequest = z.infer<typeof mediaPreparationRequestSchema>;

export const MEDIA_UPLOAD_STATES = ['ready', 'processing', 'failed'] as const;
export const mediaUploadStateSchema = z.enum(MEDIA_UPLOAD_STATES);
export type MediaUploadState = z.infer<typeof mediaUploadStateSchema>;

export const preparedMediaSchema = z
  .object({
    mediaId: z.string().min(1),
    derivativeId: z.string().nullable(),
    providerMediaId: z.string().nullable(),
    containerId: z.string().nullable(),
    uploadState: mediaUploadStateSchema,
    /** The exact bytes that were sent, so a receipt can prove what shipped. */
    derivativeChecksum: checksumSchema,
    byteSize: z.number().int().positive(),
    altTextApplied: z.boolean(),
    publicUrl: z.string().nullable(),
    expiresAt: isoInstantSchema.nullable(),
    reusedFromPreviousAttempt: z.boolean(),
  })
  .strict();
export type PreparedMedia = z.infer<typeof preparedMediaSchema>;

/* ------------------------------------------------------------------- preview */

export const PREVIEW_ENTITY_KINDS = ['mention', 'hashtag', 'link', 'cashtag'] as const;
export const previewEntityKindSchema = z.enum(PREVIEW_ENTITY_KINDS);

export const previewEntitySchema = z
  .object({
    kind: previewEntityKindSchema,
    offset: z.number().int().nonnegative(),
    length: z.number().int().positive(),
    display: z.string().min(1),
    externalId: z.string().nullable(),
    /** False for a plain-text handle the provider will render itself. */
    nativeTag: z.boolean(),
  })
  .strict();
export type PreviewEntity = z.infer<typeof previewEntitySchema>;

export const PREVIEW_MEDIA_LAYOUTS = [
  'none',
  'single',
  'grid',
  'carousel',
  'video',
  'document',
] as const;
export const previewMediaLayoutSchema = z.enum(PREVIEW_MEDIA_LAYOUTS);

export const previewMediaItemSchema = z
  .object({
    mediaId: z.string().min(1),
    kind: mediaKindSchema,
    aspectRatio: z.number().positive().nullable(),
    thumbnailUrl: z.string().nullable(),
    altText: z.string().nullable(),
  })
  .strict();

export const previewLinkCardSchema = z
  .object({
    url: z.string().min(1),
    /** Whether the provider renders a card at all for this account type. */
    rendered: z.boolean(),
    titleFrom: z.enum(['provider_unfurl', 'none']),
    consumesCharacters: z.number().int().nonnegative(),
  })
  .strict();

export const canonicalPreviewSchema = z
  .object({
    provider: providerIdSchema,
    accountType: accountTypeSchema,
    connectionId: z.string().min(1),
    authorDisplayName: z.string().min(1),
    authorHandle: z.string().nullable(),
    authorAvatarUrl: z.string().nullable(),
    renderedText: z.string(),
    entities: z.array(previewEntitySchema),
    counter: z
      .object({
        used: z.number().int().nonnegative(),
        limit: z.number().int().positive(),
        remaining: z.number().int(),
        unit: z.enum(['utf16', 'grapheme', 'weighted']),
      })
      .strict(),
    truncation: z
      .object({
        willTruncate: z.boolean(),
        atIndex: z.number().int().nonnegative().nullable(),
      })
      .strict(),
    mediaLayout: previewMediaLayoutSchema,
    mediaItems: z.array(previewMediaItemSchema),
    linkCard: previewLinkCardSchema.nullable(),
    destinationLabel: z.string().nullable(),
    privacyLabelKey: z.string().nullable(),
    disclosureLabelKeys: z.array(z.string().min(1)),
    threadItems: z.array(
      z
        .object({
          order: z.number().int().nonnegative(),
          renderedText: z.string(),
          delaySeconds: z.number().int().nonnegative(),
          mediaItems: z.array(previewMediaItemSchema),
        })
        .strict(),
    ),
    /** Message keys for anything the preview cannot show faithfully. */
    noticeKeys: z.array(z.string().min(1)),
  })
  .strict();
export type CanonicalPreview = z.infer<typeof canonicalPreviewSchema>;

/* ------------------------------------------------------------------ publish */

export const providerErrorSummarySchema = z
  .object({
    errorClass: z.enum([
      'USER_ACTION_REQUIRED',
      'CONTENT_INVALID',
      'TRANSIENT_PROVIDER',
      'PERMANENT_PROVIDER',
      'INTERNAL',
      'UNKNOWN',
    ]),
    remediationCode: z.string().min(1),
    messageKey: z.string().min(1),
    retryable: z.boolean(),
    providerMessage: z.string().nullable(),
  })
  .strict();
export type ProviderErrorSummary = Omit<
  z.infer<typeof providerErrorSummarySchema>,
  'errorClass' | 'remediationCode'
> & { readonly errorClass: ProviderErrorClass; readonly remediationCode: RemediationCode };

export const publishedItemSchema = z
  .object({
    kind: z.enum(['root', 'comment', 'thread']),
    order: z.number().int().nonnegative(),
    threadItemId: z.string().nullable(),
    externalPostId: z.string().min(1),
    permalink: z.string().nullable(),
    publishedAt: isoInstantSchema,
  })
  .strict();
export type PublishedItem = z.infer<typeof publishedItemSchema>;

export const failedItemSchema = z
  .object({
    kind: z.enum(['root', 'comment', 'thread']),
    order: z.number().int().nonnegative(),
    threadItemId: z.string().nullable(),
    error: providerErrorSummarySchema,
  })
  .strict();
export type FailedItem = z.infer<typeof failedItemSchema>;

export const publishRequestSchema = z
  .object({
    draft: providerDraftSchema,
    preparedMedia: z.array(preparedMediaSchema),
    contentVersionId: z.string().min(1),
    contentVersionChecksum: checksumSchema,
    capabilityVersion: z.string().min(1),
    idempotencyKey: idempotencyKeySchema,
    /** Fingerprint used to find an already created post after a timeout. */
    contentFingerprint: checksumSchema,
    dispatchedAt: isoInstantSchema,
  })
  .strict();
export type PublishRequest = z.infer<typeof publishRequestSchema>;

export const publishResultSchema = z.discriminatedUnion('status', [
  z
    .object({
      status: z.literal('published'),
      externalPostId: z.string().min(1),
      permalink: z.string().nullable(),
      publishedAt: isoInstantSchema,
      items: z.array(publishedItemSchema),
      sanitizedResponse: z.record(z.string(), z.unknown()),
      providerRequestId: z.string().nullable(),
      costMinor: z.number().int().nonnegative().nullable(),
      currency: z.string().nullable(),
    })
    .strict(),
  z
    .object({
      status: z.literal('pending'),
      /** Container or job identifier to poll with `getStatus`. */
      providerJobId: z.string().min(1),
      pollAfterSeconds: z.number().int().nonnegative(),
      giveUpAt: isoInstantSchema,
      sanitizedResponse: z.record(z.string(), z.unknown()),
      providerRequestId: z.string().nullable(),
    })
    .strict(),
  z
    .object({
      status: z.literal('partial'),
      externalPostId: z.string().min(1),
      permalink: z.string().nullable(),
      publishedAt: isoInstantSchema,
      items: z.array(publishedItemSchema),
      failures: z.array(failedItemSchema).min(1),
      sanitizedResponse: z.record(z.string(), z.unknown()),
      providerRequestId: z.string().nullable(),
      costMinor: z.number().int().nonnegative().nullable(),
      currency: z.string().nullable(),
    })
    .strict(),
  z
    .object({
      status: z.literal('failed'),
      error: providerErrorSummarySchema,
      sanitizedResponse: z.record(z.string(), z.unknown()),
      providerRequestId: z.string().nullable(),
    })
    .strict(),
]);
export type PublishResult = z.infer<typeof publishResultSchema>;

export const statusRequestSchema = z
  .object({
    connection: connectionRefSchema,
    providerJobId: z.string().nullable(),
    externalPostId: z.string().nullable(),
    idempotencyKey: idempotencyKeySchema,
    contentFingerprint: checksumSchema,
    /** The window a create could have landed in, for the duplicate query. */
    dispatchWindowFrom: isoInstantSchema,
    dispatchWindowTo: isoInstantSchema,
  })
  .strict();
export type StatusRequest = z.infer<typeof statusRequestSchema>;

export const PUBLISH_STATUS_STATES = ['processing', 'published', 'failed', 'unknown'] as const;
export const publishStatusStateSchema = z.enum(PUBLISH_STATUS_STATES);
export type PublishStatusState = z.infer<typeof publishStatusStateSchema>;

export const publishStatusSchema = z
  .object({
    state: publishStatusStateSchema,
    externalPostId: z.string().nullable(),
    permalink: z.string().nullable(),
    publishedAt: isoInstantSchema.nullable(),
    items: z.array(publishedItemSchema),
    error: providerErrorSummarySchema.nullable(),
    pollAfterSeconds: z.number().int().nonnegative().nullable(),
    sanitizedResponse: z.record(z.string(), z.unknown()),
  })
  .strict()
  .superRefine((status, ctx) => {
    // Published means external evidence, never a 2xx from a container step.
    if (status.state === 'published' && status.externalPostId === null) {
      ctx.addIssue({
        code: 'custom',
        path: ['externalPostId'],
        message: 'PUBLISHED_WITHOUT_EVIDENCE',
      });
    }
    if (status.state === 'failed' && status.error === null) {
      ctx.addIssue({ code: 'custom', path: ['error'], message: 'FAILED_WITHOUT_ERROR' });
    }
  });
export type PublishStatus = z.infer<typeof publishStatusSchema>;

export const deleteRequestSchema = z
  .object({
    connection: connectionRefSchema,
    externalPostId: z.string().min(1),
    /** Deleting in Relay never implies deleting externally. */
    confirmedByActorId: z.string().min(1),
  })
  .strict();
export type DeleteRequest = z.infer<typeof deleteRequestSchema>;

/* ---------------------------------------------------------------- analytics */

export const metricsRequestSchema = z
  .object({
    connection: connectionRefSchema,
    scope: z.enum(['post', 'account']),
    externalPostId: z.string().nullable(),
    rangeFrom: isoInstantSchema.nullable(),
    rangeTo: isoInstantSchema.nullable(),
    metrics: z.array(normalizedMetricNameSchema),
  })
  .strict()
  .superRefine((request, ctx) => {
    if (request.scope === 'post' && request.externalPostId === null) {
      ctx.addIssue({ code: 'custom', path: ['externalPostId'], message: 'POST_ID_REQUIRED' });
    }
  });
export type MetricsRequest = z.infer<typeof metricsRequestSchema>;

/* -------------------------------------------------------------- credentials */

export const refreshRequestSchema = z
  .object({
    connectionId: z.string().min(1),
    workspaceId: z.string().min(1),
    provider: providerIdSchema,
    refreshToken: secretHandleSchema,
    grantedScopes: z.array(z.string().min(1)),
    client: oauthClientConfigSchema,
  })
  .strict();
export type RefreshRequest = z.infer<typeof refreshRequestSchema>;

export const credentialResultSchema = z
  .object({
    accessToken: secretValueSchema,
    /** Present when the provider rotates. Store atomically with the access token. */
    refreshToken: secretValueSchema.nullable(),
    tokenType: z.string().min(1),
    expiresAt: isoInstantSchema.nullable(),
    grantedScopes: z.array(z.string().min(1)),
    refreshTokenRotated: z.boolean(),
    obtainedAt: isoInstantSchema,
  })
  .strict();
export type CredentialResult = z.infer<typeof credentialResultSchema>;

export const revokeRequestSchema = z
  .object({
    connectionId: z.string().min(1),
    workspaceId: z.string().min(1),
    provider: providerIdSchema,
    accessToken: secretHandleSchema,
    refreshToken: secretHandleSchema.nullable(),
    client: oauthClientConfigSchema,
  })
  .strict();
export type RevokeRequest = z.infer<typeof revokeRequestSchema>;

/* ---------------------------------------------------------------- interface */

/**
 * The connector interface. One adapter per provider, no business logic.
 *
 * A connector never schedules, never approves, never decides cadence, never
 * retries on its own and never imports `@relay/application` or
 * `@relay/database`. It translates between our domain and one provider.
 */
export interface SocialConnector {
  identity(): ProviderIdentity;
  authorization(): AuthorizationDefinition;
  discoverAccounts(input: OAuthGrantInput): Promise<ExternalAccount[]>;
  listDestinations?(input: DestinationRequest): Promise<ProviderDestination[]>;
  searchMentions?(input: MentionSearchRequest): Promise<MentionEntity[]>;
  getCapabilities(connection: ConnectionRef): Promise<CapabilitySnapshot>;
  validateDraft(input: ProviderDraft): Promise<ValidationResult>;
  prepareMedia(input: MediaPreparationRequest): Promise<PreparedMedia[]>;
  preview(input: ProviderDraft): Promise<CanonicalPreview>;
  publish(input: PublishRequest): Promise<PublishResult>;
  getStatus(input: StatusRequest): Promise<PublishStatus>;
  deletePost?(input: DeleteRequest): Promise<void>;
  fetchMetrics(input: MetricsRequest): Promise<MetricObservation[]>;
  refreshCredential(input: RefreshRequest): Promise<CredentialResult>;
  revoke?(input: RevokeRequest): Promise<void>;
}

/** Schemas for every value that crosses the connector boundary. */
export const CONNECTOR_SCHEMAS = Object.freeze({
  providerIdentity: providerIdentitySchema,
  authorizationDefinition: authorizationDefinitionSchema,
  oauthGrantInput: oauthGrantInputSchema,
  externalAccount: externalAccountSchema,
  connectionRef: connectionRefSchema,
  destinationRequest: destinationRequestSchema,
  providerDestination: providerDestinationSchema,
  mentionSearchRequest: mentionSearchRequestSchema,
  mentionEntity: mentionEntitySchema,
  capabilitySnapshot: capabilitySnapshotSchema,
  providerDraft: providerDraftSchema,
  validationResult: validationResultSchema,
  mediaPreparationRequest: mediaPreparationRequestSchema,
  preparedMedia: preparedMediaSchema,
  canonicalPreview: canonicalPreviewSchema,
  publishRequest: publishRequestSchema,
  publishResult: publishResultSchema,
  statusRequest: statusRequestSchema,
  publishStatus: publishStatusSchema,
  deleteRequest: deleteRequestSchema,
  metricsRequest: metricsRequestSchema,
  metricObservation: metricObservationSchema,
  refreshRequest: refreshRequestSchema,
  credentialResult: credentialResultSchema,
  revokeRequest: revokeRequestSchema,
  providerOperation: providerOperationSchema,
});

export type { CapabilitySnapshot, MetricObservation, ValidationResult };

/* ------------------------------------------------- adapter facing type names */

/**
 * The ports an adapter is constructed with. Everything an adapter needs and
 * nothing it does not: no database, no application service, no scheduler.
 */
export type { Clock, ConnectorLogger } from './ports';
export type { ConnectorRegistry } from './registry';

/** The slice of `RelayConfig` a connector reads. Values may be absent. */
export interface ConnectorConfig {
  readonly providers: {
    readonly x: { readonly clientId?: string; readonly clientSecret?: string };
    readonly linkedin: { readonly clientId?: string; readonly clientSecret?: string };
    readonly meta: { readonly appId?: string; readonly appSecret?: string };
    readonly google: { readonly clientId?: string; readonly clientSecret?: string };
    readonly tiktok: { readonly clientKey?: string; readonly clientSecret?: string };
    readonly bluesky: { readonly serviceUrl?: string };
  };
}

export interface ConnectorDeps {
  readonly http: HttpClient;
  readonly vault: ConnectorVault;
  readonly logger: ConnectorLogger;
  readonly clock: Clock;
  readonly config: ConnectorConfig;
  /** The public https origin of the API, used to build an exact redirect URI. */
  readonly redirectBaseUrl: string;
}

/** Adapter facing aliases. Same types, the names the adapters were written to. */
export type OAuthScopeDefinition = ScopeRequest;
export type ProviderMedia = ProviderMediaRef;
export type PublishItemResult = PublishedItem;
export type PreviewEntityRange = PreviewEntity;
