import {
  ConnectionActionRequiredError,
  validationIssue,
  validationResult,
  type CapabilitySnapshot,
  type MetricObservation,
  type ValidationIssue,
  type ValidationResult,
} from '@relay/contracts';

import {
  CONNECTOR_CONTRACT_VERSION,
  NOT_IMPLEMENTED_FEATURES,
  REMEDIATION,
  ensureOk,
  parseProviderBody,
  providerFailure,
  refreshOAuth2Token,
  type AuthorizationDefinition,
  type CanonicalPreview,
  type ConnectorDeps,
  type CredentialResult,
  type DeleteRequest,
  type DestinationRequest,
  type ExternalAccount,
  type FailedItem,
  type MediaPreparationRequest,
  type MentionEntity,
  type MentionSearchRequest,
  type MetricsRequest,
  type OAuthGrant,
  type PreparedMedia,
  type ProviderConnection,
  type ProviderDestination,
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
import {
  accessTokenOf,
  errorSummary,
  providerOptionsOf,
} from '../shared/access.js';
import { mapMetrics } from '../shared/metrics.js';
import { buildPreview } from '../shared/preview.js';
import { validateDraftShape } from '../shared/validate.js';
import { SOURCE_VERIFIED_ON } from '../shared/verification.js';
import { LINKEDIN_API_VERSION, buildLinkedInCapabilities } from './capabilities.js';
import {
  LINKEDIN_ORGANIZATION_ACCOUNT_METRICS,
  LINKEDIN_ORGANIZATION_POST_METRICS,
  LINKEDIN_SOCIAL_METRICS,
} from './metrics.js';
import {
  linkedInDocumentInitializeSchema,
  linkedInFollowerStatisticsSchema,
  linkedInImageInitializeSchema,
  linkedInOrganizationAclsSchema,
  linkedInOrganizationSearchSchema,
  linkedInPostSchema,
  linkedInProviderOptionsSchema,
  linkedInShareStatisticsSchema,
  linkedInSocialActionsSchema,
  linkedInUserInfoSchema,
  linkedInVideoInitializeSchema,
} from './schemas.js';

/**
 * LinkedIn connector.
 *
 * Member and organization posts: text, image, multi image, video and document. Register
 * the upload, upload the binary, then create the post referencing the uploaded asset.
 *
 * Two things bite people here and both are handled explicitly:
 *
 * 1. **The version header.** Every request carries `LinkedIn-Version`. A stale value is a
 *    confusing failure, so it is one constant with its review date, and a rejection of the
 *    header classifies as an internal error that pages us rather than confusing the user.
 * 2. **Member post read back is restricted for new applications.** We do not promise member
 *    post analytics. Where they are unavailable the reason is stated as a LinkedIn
 *    restriction, because it is not a gap of ours.
 */

const PROVIDER = 'linkedin' as const;
const REST_BASE = 'https://api.linkedin.com/rest';
const USERINFO_URL = 'https://api.linkedin.com/v2/userinfo';
const AUTHORIZE_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const REVOKE_URL = 'https://www.linkedin.com/oauth/v2/revoke';
const VIDEO_CHUNK_HEADER = 'x-amz-server-side-encryption';
/** How long a cached organization destination stays fresh. */
const DESTINATION_TTL_MS = 24 * 60 * 60 * 1000;

/** Page roles that may publish as an organization. */
const PUBLISHING_ROLES = new Set(['ADMINISTRATOR', 'DIRECT_SPONSORED_CONTENT_POSTER']);

function memberUrn(id: string): string {
  return `urn:li:person:${id}`;
}

function authorUrn(connection: ProviderConnection): string {
  return connection.accountType === 'organization'
    ? `urn:li:organization:${connection.externalAccountId}`
    : memberUrn(connection.externalAccountId);
}

function postPermalink(postUrn: string): string {
  return `https://www.linkedin.com/feed/update/${postUrn}/`;
}

function organizationIdFromUrn(urn: string): string {
  const parts = urn.split(':');
  return parts[parts.length - 1] ?? urn;
}

export function createLinkedInConnector(deps: ConnectorDeps): SocialConnector {
  const { http, clock, config, logger } = deps;

  function headers(accessToken: string): Record<string, string> {
    return {
      authorization: `Bearer ${accessToken}`,
      'linkedin-version': LINKEDIN_API_VERSION,
      'x-restli-protocol-version': '2.0.0',
    };
  }

  function nowIso(): string {
    return clock.now().toISOString();
  }

  /**
   * A rejected version header means our constant is stale. That is our bug, not the
   * customer's, so it is surfaced as an internal failure that pages the connector owner.
   */
  function assertVersionHeaderAccepted(status: number, text: string, operation: string): void {
    if (status === 426 || (status === 400 && text.toLowerCase().includes('linkedin-version'))) {
      throw providerFailure({
        provider: PROVIDER,
        operation,
        remediationCode: REMEDIATION.contactSupport,
        details: { staleVersionHeader: LINKEDIN_API_VERSION },
      });
    }
  }

  /** The short lived signed URL the derivative can be fetched from. */
  function sourceUrlOf(media: ProviderMedia, operation: string): string {
    if (media.sourceUrl === null) {
      // Without the signed URL there are no bytes to send, and an asset with no bytes
      // would publish as a broken attachment.
      throw providerFailure({
        provider: PROVIDER,
        operation,
        remediationCode: REMEDIATION.mediaInvalid,
        details: { mediaId: media.mediaId, reason: 'MEDIA_SOURCE_URL_MISSING' },
      });
    }
    return media.sourceUrl;
  }

  async function uploadBinary(
    uploadUrl: string,
    media: ProviderMedia,
    accessToken: string,
    operation: string,
  ): Promise<void> {
    const download = await http.request({
      method: 'GET',
      url: sourceUrlOf(media, `${operation}.fetch_source`),
      accept: 'binary',
      provider: PROVIDER,
      operation: `${operation}.fetch_source`,
    });
    ensureOk(download, {
      provider: PROVIDER,
      operation: `${operation}.fetch_source`,
      response: download,
    });
    const upload = await http.request({
      method: 'PUT',
      url: uploadUrl,
      headers: { authorization: `Bearer ${accessToken}`, 'content-type': media.mimeType },
      body: download.bytes,
      accept: 'none',
      provider: PROVIDER,
      operation,
    });
    ensureOk(upload, {
      provider: PROVIDER,
      operation,
      response: upload,
      remediationCode: REMEDIATION.mediaInvalid,
    });
  }

  async function prepareImage(
    connection: ProviderConnection,
    accessToken: string,
    media: ProviderMedia,
  ): Promise<PreparedMedia> {
    const response = await http.request({
      method: 'POST',
      url: `${REST_BASE}/images`,
      headers: headers(accessToken),
      query: { action: 'initializeUpload' },
      json: { initializeUploadRequest: { owner: authorUrn(connection) } },
      accept: 'json',
      provider: PROVIDER,
      operation: 'linkedin.image.initialize',
    });
    assertVersionHeaderAccepted(response.status, response.text, 'linkedin.image.initialize');
    ensureOk(response, {
      provider: PROVIDER,
      operation: 'linkedin.image.initialize',
      response,
      remediationCode: REMEDIATION.mediaInvalid,
    });
    const parsed = parseProviderBody(linkedInImageInitializeSchema, response, {
      provider: PROVIDER,
      operation: 'linkedin.image.initialize',
      response,
    });
    await uploadBinary(parsed.value.uploadUrl, media, accessToken, 'linkedin.image.upload');
    return {
      mediaId: media.mediaId,
      derivativeId: media.derivativeId,
      providerMediaId: parsed.value.image,
      // LinkedIn images publish straight from the asset URN; there is no container.
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

  async function prepareDocument(
    connection: ProviderConnection,
    accessToken: string,
    media: ProviderMedia,
  ): Promise<PreparedMedia> {
    const response = await http.request({
      method: 'POST',
      url: `${REST_BASE}/documents`,
      headers: headers(accessToken),
      query: { action: 'initializeUpload' },
      json: { initializeUploadRequest: { owner: authorUrn(connection) } },
      accept: 'json',
      provider: PROVIDER,
      operation: 'linkedin.document.initialize',
    });
    assertVersionHeaderAccepted(response.status, response.text, 'linkedin.document.initialize');
    ensureOk(response, {
      provider: PROVIDER,
      operation: 'linkedin.document.initialize',
      response,
      remediationCode: REMEDIATION.mediaInvalid,
    });
    const parsed = parseProviderBody(linkedInDocumentInitializeSchema, response, {
      provider: PROVIDER,
      operation: 'linkedin.document.initialize',
      response,
    });
    await uploadBinary(parsed.value.uploadUrl, media, accessToken, 'linkedin.document.upload');
    return {
      mediaId: media.mediaId,
      derivativeId: media.derivativeId,
      providerMediaId: parsed.value.document,
      containerId: null,
      uploadState: 'ready',
      derivativeChecksum: media.checksum,
      byteSize: media.byteSize,
      altTextApplied: false,
      publicUrl: null,
      expiresAt: null,
      reusedFromPreviousAttempt: false,
    };
  }

  async function prepareVideo(
    connection: ProviderConnection,
    accessToken: string,
    media: ProviderMedia,
  ): Promise<PreparedMedia> {
    const response = await http.request({
      method: 'POST',
      url: `${REST_BASE}/videos`,
      headers: headers(accessToken),
      query: { action: 'initializeUpload' },
      json: {
        initializeUploadRequest: {
          owner: authorUrn(connection),
          fileSizeBytes: media.byteSize,
          uploadCaptions: false,
          uploadThumbnail: false,
        },
      },
      accept: 'json',
      provider: PROVIDER,
      operation: 'linkedin.video.initialize',
    });
    assertVersionHeaderAccepted(response.status, response.text, 'linkedin.video.initialize');
    ensureOk(response, {
      provider: PROVIDER,
      operation: 'linkedin.video.initialize',
      response,
      remediationCode: REMEDIATION.mediaInvalid,
    });
    const parsed = parseProviderBody(linkedInVideoInitializeSchema, response, {
      provider: PROVIDER,
      operation: 'linkedin.video.initialize',
      response,
    });

    const source = await http.request({
      method: 'GET',
      url: sourceUrlOf(media, 'linkedin.video.fetch_source'),
      accept: 'binary',
      provider: PROVIDER,
      operation: 'linkedin.video.fetch_source',
    });
    ensureOk(source, {
      provider: PROVIDER,
      operation: 'linkedin.video.fetch_source',
      response: source,
    });

    const etags: string[] = [];
    for (const instruction of parsed.value.uploadInstructions) {
      const chunk = source.bytes.subarray(instruction.firstByte, instruction.lastByte + 1);
      const part = await http.request({
        method: 'PUT',
        url: instruction.uploadUrl,
        headers: { 'content-type': media.mimeType },
        body: chunk,
        accept: 'none',
        provider: PROVIDER,
        operation: 'linkedin.video.upload_part',
      });
      ensureOk(part, {
        provider: PROVIDER,
        operation: 'linkedin.video.upload_part',
        response: part,
        remediationCode: REMEDIATION.mediaInvalid,
      });
      const etag = part.headers['etag'] ?? part.headers[VIDEO_CHUNK_HEADER];
      if (etag !== undefined) {
        etags.push(etag);
      }
    }

    const finalize = await http.request({
      method: 'POST',
      url: `${REST_BASE}/videos`,
      headers: headers(accessToken),
      query: { action: 'finalizeUpload' },
      json: {
        finalizeUploadRequest: {
          video: parsed.value.video,
          uploadToken: '',
          uploadedPartIds: etags,
        },
      },
      accept: 'json',
      provider: PROVIDER,
      operation: 'linkedin.video.finalize',
    });
    ensureOk(finalize, {
      provider: PROVIDER,
      operation: 'linkedin.video.finalize',
      response: finalize,
      remediationCode: REMEDIATION.mediaInvalid,
    });

    return {
      mediaId: media.mediaId,
      derivativeId: media.derivativeId,
      providerMediaId: parsed.value.video,
      containerId: null,
      // LinkedIn processes video after finalize. `getStatus` confirms before we publish.
      uploadState: 'processing',
      derivativeChecksum: media.checksum,
      byteSize: media.byteSize,
      altTextApplied: false,
      publicUrl: null,
      expiresAt: null,
      reusedFromPreviousAttempt: false,
    };
  }

  function buildPostBody(
    request: PublishRequest,
    options: ReturnType<typeof linkedInProviderOptionsSchema.parse>,
  ): Record<string, unknown> {
    const draft = request.draft;
    const connection = draft.connection;
    const assets = request.preparedMedia
      .map((prepared) => prepared.providerMediaId)
      .filter((value): value is string => value !== null);
    const visibility = draft.privacyValue ?? 'PUBLIC';

    const body: Record<string, unknown> = {
      author: authorUrn(connection),
      commentary: draft.body,
      visibility,
      distribution: {
        feedDistribution: 'MAIN_FEED',
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: options.disableReshare ?? false,
    };

    const first = assets[0];
    if (first === undefined) {
      return body;
    }
    if (draft.contentKind === 'document') {
      body['content'] = {
        media: { id: first, title: options.documentTitle ?? draft.title ?? '' },
      };
      return body;
    }
    if (draft.contentKind === 'carousel' && assets.length > 1) {
      body['content'] = {
        multiImage: {
          images: assets.map((id, index) => ({
            id,
            altText: draft.media[index]?.altText ?? '',
          })),
        },
      };
      return body;
    }
    body['content'] = {
      media: { id: first, altText: draft.media[0]?.altText ?? '' },
    };
    return body;
  }

  return {
    identity(): ProviderIdentity {
      return {
        provider: PROVIDER,
        displayName: 'LinkedIn',
        iconToken: 'provider.linkedin',
        accountTypes: ['personal_profile', 'organization'],
        contractVersion: CONNECTOR_CONTRACT_VERSION,
        connectorVersion: '1.0.0',
        label: 'beta',
        limitationKey: 'connectors.linkedin.review_pending',
        officialDocsUrl:
          'https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api',
        officialPolicyUrl: 'https://legal.linkedin.com/api-terms-of-use',
        engineeringOwner: 'Backend/Connectors 2',
        policyOwner: 'Policy Owner',
        lastPolicyReviewAt: `${SOURCE_VERIFIED_ON}T00:00:00.000Z`,
        nextPolicyReviewAt: '2027-02-04T00:00:00.000Z',
        features: {
          ...NOT_IMPLEMENTED_FEATURES,
          discover_accounts: 'supported',
          list_destinations: 'supported',
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
          // LinkedIn has no thread product: a post is a post.
          thread_parts: 'unsupported',
          comment_count: 'supported',
          comment_replies: 'not_implemented',
          provider_idempotency: 'unsupported',
          post_analytics: 'supported',
          account_analytics: 'supported',
          privacy_controls: 'supported',
          ai_disclosure: 'not_implemented',
          commercial_disclosure: 'not_implemented',
          alt_text: 'supported',
          carousel: 'supported',
          video: 'supported',
          document: 'supported',
          metered_cost: 'unsupported',
        },
      };
    },

    authorization(): AuthorizationDefinition {
      return {
        flavor: 'oauth2_pkce',
        authorizeUrl: AUTHORIZE_URL,
        tokenUrl: TOKEN_URL,
        revokeUrl: REVOKE_URL,
        redirectPath: '/oauth/linkedin/callback',
        scopes: [
          {
            scope: 'openid',
            explanationKey: 'connectors.linkedin.scope.openid',
            usedBy: ['connections'],
            required: true,
          },
          {
            scope: 'profile',
            explanationKey: 'connectors.linkedin.scope.profile',
            usedBy: ['connections', 'composer'],
            required: true,
          },
          {
            scope: 'w_member_social',
            explanationKey: 'connectors.linkedin.scope.w_member_social',
            usedBy: ['composer', 'queue'],
            required: true,
          },
          {
            scope: 'w_organization_social',
            explanationKey: 'connectors.linkedin.scope.w_organization_social',
            usedBy: ['composer', 'queue'],
            required: false,
          },
          {
            scope: 'r_organization_social',
            explanationKey: 'connectors.linkedin.scope.r_organization_social',
            usedBy: ['analytics'],
            required: false,
          },
          {
            scope: 'rw_organization_admin',
            explanationKey: 'connectors.linkedin.scope.rw_organization_admin',
            usedBy: ['connections', 'analytics'],
            required: false,
          },
        ],
        pkceRequired: true,
        // LinkedIn returns one member token. Organization posting rights come from the
        // member's Page roles, which we read after the grant.
        multiStep: true,
        stepDescriptionKeys: ['connectors.linkedin.authorization_note'],
        supportsRefresh: true,
        refreshAtLifetimeFraction: 0.75,
        extraAuthorizeParameters: {},
      };
    },

    async discoverAccounts(grant: OAuthGrant): Promise<ExternalAccount[]> {
      const accounts: ExternalAccount[] = [];

      const me = await http.request({
        method: 'GET',
        url: USERINFO_URL,
        auth: { handle: grant.accessToken },
        accept: 'json',
        provider: PROVIDER,
        operation: 'linkedin.userinfo',
      });
      ensureOk(me, {
        provider: PROVIDER,
        operation: 'linkedin.userinfo',
        response: me,
        remediationCode: REMEDIATION.reconnectAccount,
      });
      const profile = parseProviderBody(linkedInUserInfoSchema, me, {
        provider: PROVIDER,
        operation: 'linkedin.userinfo',
        response: me,
      });
      const canPostAsMember = grant.grantedScopes.includes('w_member_social');
      accounts.push({
        externalAccountId: profile.sub,
        accountType: 'personal_profile',
        displayName: profile.name ?? 'LinkedIn member',
        handle: null,
        avatarUrl: profile.picture ?? null,
        profileUrl: null,
        parentExternalId: null,
        grantedScopes: [...grant.grantedScopes],
        eligible: canPostAsMember,
        ineligibleReasonKey: canPostAsMember
          ? null
          : 'connectors.linkedin.member_write_scope_missing',
        // LinkedIn issues one member token; there is no separate per account credential.
        accountAccessToken: null,
        metadata: { memberUrn: memberUrn(profile.sub) },
      });

      if (!grant.grantedScopes.includes('rw_organization_admin')) {
        return accounts;
      }

      const acls = await http.request({
        method: 'GET',
        url: `${REST_BASE}/organizationAcls`,
        auth: { handle: grant.accessToken },
        headers: {
          'linkedin-version': LINKEDIN_API_VERSION,
          'x-restli-protocol-version': '2.0.0',
        },
        query: { q: 'roleAssignee', state: 'APPROVED', count: 100 },
        accept: 'json',
        provider: PROVIDER,
        operation: 'linkedin.organization_acls',
      });
      if (!acls.ok) {
        // Losing the organization list must not block connecting the member account.
        logger.warn(
          { provider: PROVIDER, status: acls.status },
          'linkedin organization roles unavailable',
        );
        return accounts;
      }
      const parsed = parseProviderBody(linkedInOrganizationAclsSchema, acls, {
        provider: PROVIDER,
        operation: 'linkedin.organization_acls',
        response: acls,
      });
      for (const element of parsed.elements) {
        const eligible = PUBLISHING_ROLES.has(element.role);
        const organizationId = organizationIdFromUrn(element.organizationalTarget);
        const canPostAsOrganization =
          eligible && grant.grantedScopes.includes('w_organization_social');
        accounts.push({
          externalAccountId: organizationId,
          accountType: 'organization',
          displayName:
            element.organizationalTarget$?.localizedName ?? `Organization ${organizationId}`,
          handle: element.organizationalTarget$?.vanityName ?? null,
          avatarUrl: null,
          profileUrl: `https://www.linkedin.com/company/${organizationId}/`,
          // The member whose Page role grants us the right to publish as this organization.
          parentExternalId: profile.sub,
          grantedScopes: [...grant.grantedScopes],
          eligible: canPostAsOrganization,
          ineligibleReasonKey: eligible ? null : 'connectors.linkedin.page_role_required',
          accountAccessToken: null,
          metadata: { organizationUrn: element.organizationalTarget, role: element.role },
        });
      }
      return accounts;
    },

    async listDestinations(input: DestinationRequest): Promise<ProviderDestination[]> {
      const accessToken = await accessTokenOf(input.connection);
      const response = await http.request({
        method: 'GET',
        url: `${REST_BASE}/organizationAcls`,
        headers: headers(accessToken),
        query: { q: 'roleAssignee', state: 'APPROVED', count: 100 },
        accept: 'json',
        provider: PROVIDER,
        operation: 'linkedin.list_destinations',
      });
      ensureOk(response, {
        provider: PROVIDER,
        operation: 'linkedin.list_destinations',
        response,
        remediationCode: REMEDIATION.pageRoleRequired,
      });
      const parsed = parseProviderBody(linkedInOrganizationAclsSchema, response, {
        provider: PROVIDER,
        operation: 'linkedin.list_destinations',
        response,
      });
      const refreshedAt = nowIso();
      const expiresAt = new Date(clock.now().getTime() + DESTINATION_TTL_MS).toISOString();
      return parsed.elements
        .filter((element) => PUBLISHING_ROLES.has(element.role))
        .slice(0, input.limit)
        .map((element) => ({
          externalId: element.organizationalTarget,
          kind: 'organization' as const,
          displayLabel:
            element.organizationalTarget$?.localizedName ??
            `Organization ${organizationIdFromUrn(element.organizationalTarget)}`,
          parentExternalId: null,
          canPost: true,
          refreshedAt,
          expiresAt,
          metadata: { role: element.role },
        }));
    },

    async searchMentions(input: MentionSearchRequest): Promise<MentionEntity[]> {
      const accessToken = await accessTokenOf(input.connection);
      const vanityName = input.query.replace(/^@/u, '').trim();
      if (vanityName === '') {
        return [];
      }
      const response = await http.request({
        method: 'GET',
        url: `${REST_BASE}/organizations`,
        headers: headers(accessToken),
        query: { q: 'vanityName', vanityName },
        accept: 'json',
        provider: PROVIDER,
        operation: 'linkedin.search_mentions',
      });
      if (!response.ok) {
        logger.warn(
          { provider: PROVIDER, status: response.status },
          'linkedin mention lookup unavailable',
        );
        return [];
      }
      const parsed = parseProviderBody(linkedInOrganizationSearchSchema, response, {
        provider: PROVIDER,
        operation: 'linkedin.search_mentions',
        response,
      });
      const resolvedAt = nowIso();
      return parsed.elements
        .filter((organization) => organization.id !== undefined)
        .slice(0, input.limit)
        .map((organization) => ({
          externalId: `urn:li:organization:${String(organization.id)}`,
          displayLabel: organization.localizedName ?? String(organization.id),
          handle: organization.vanityName ?? null,
          kind: 'organization' as const,
          avatarUrl: null,
          // A resolved LinkedIn mention carries a real URN, so it is a native tag.
          resolvedToExternalId: true,
          resolvedAt,
        }));
    },

    async getCapabilities(connection: ProviderConnection): Promise<CapabilitySnapshot> {
      return await Promise.resolve(
        buildLinkedInCapabilities({
          connection,
          observedAt: nowIso(),
          grantedScopes: connection.grantedScopes,
        }),
      );
    },

    async validateDraft(draft: ProviderDraft): Promise<ValidationResult> {
      const snapshot = draft.capabilities;
      const targetId = draft.connection.connectionId;
      const options = linkedInProviderOptionsSchema.parse(providerOptionsOf(draft));
      const issues: ValidationIssue[] = [
        ...validateDraftShape(draft, snapshot, { unit: 'utf16', allowMixedMedia: false }),
      ];

      if (draft.contentKind === 'document') {
        if (draft.media.length !== 1) {
          issues.push(
            validationIssue({
              code: 'DOCUMENT_REQUIRES_ONE_FILE',
              severity: 'error',
              field: 'media',
              targetId,
              remediationKey: REMEDIATION.mediaInvalid,
              params: { provider: PROVIDER, count: draft.media.length },
            }),
          );
        }
        const title = options.documentTitle ?? draft.title;
        if (title === null || title === undefined || title.trim() === '') {
          issues.push(
            validationIssue({
              code: 'DOCUMENT_TITLE_REQUIRED',
              severity: 'error',
              field: 'title',
              targetId,
              params: { provider: PROVIDER },
            }),
          );
        }
      }

      if (draft.contentKind === 'carousel' && draft.media.length < 2) {
        issues.push(
          validationIssue({
            code: 'CAROUSEL_NEEDS_TWO_IMAGES',
            severity: 'error',
            field: 'media',
            targetId,
            remediationKey: REMEDIATION.mediaInvalid,
            params: { provider: PROVIDER, count: draft.media.length },
          }),
        );
      }

      if (
        draft.connection.accountType === 'organization' &&
        !draft.connection.grantedScopes.includes('w_organization_social')
      ) {
        issues.push(
          validationIssue({
            code: 'ORGANIZATION_ROLE_REQUIRED',
            severity: 'error',
            field: 'connection',
            targetId,
            remediationKey: REMEDIATION.pageRoleRequired,
            params: { provider: PROVIDER, organization: draft.connection.displayName },
          }),
        );
      }

      return await Promise.resolve(validationResult({ issues }));
    },

    async prepareMedia(input: MediaPreparationRequest): Promise<PreparedMedia[]> {
      const accessToken = await accessTokenOf(input.connection);
      const prepared: PreparedMedia[] = [];
      for (const media of input.media) {
        if (media.kind === 'video') {
          prepared.push(await prepareVideo(input.connection, accessToken, media));
        } else if (media.kind === 'document') {
          prepared.push(await prepareDocument(input.connection, accessToken, media));
        } else {
          prepared.push(await prepareImage(input.connection, accessToken, media));
        }
      }
      return prepared;
    },

    async preview(draft: ProviderDraft): Promise<CanonicalPreview> {
      const layout =
        draft.contentKind === 'document'
          ? 'document'
          : draft.contentKind === 'carousel'
            ? 'carousel'
            : draft.media.some((item) => item.kind === 'video')
              ? 'video'
              : 'single';
      return await Promise.resolve(
        buildPreview(draft, draft.capabilities, {
        unit: 'utf16',
        mediaLayout: layout,
        linkRendering: 'card',
        resolvesMentionsAtRender: false,
        privacyLabelKey:
          draft.privacyValue === 'CONNECTIONS'
            ? 'connectors.linkedin.visibility.connections'
            : 'connectors.linkedin.visibility.public',
        warningKeys:
          draft.connection.accountType === 'personal_profile'
            ? ['connectors.linkedin.member_analytics_restricted']
            : [],
        }),
      );
    },

    async publish(request: PublishRequest): Promise<PublishResult> {
      const draft = request.draft;
      const connection = draft.connection;
      const accessToken = await accessTokenOf(connection);
      const options = linkedInProviderOptionsSchema.parse(providerOptionsOf(draft));

      const response = await http.request({
        method: 'POST',
        url: `${REST_BASE}/posts`,
        headers: {
          ...headers(accessToken),
          // LinkedIn's own idempotency control on post creation.
          'x-restli-method': 'create',
        },
        json: buildPostBody(request, options),
        accept: 'json',
        provider: PROVIDER,
        operation: 'linkedin.create_post',
      });
      assertVersionHeaderAccepted(response.status, response.text, 'linkedin.create_post');
      if (response.status === 403) {
        throw new ConnectionActionRequiredError({
          messageKey: 'connectors.linkedin.page_role_required',
          details: { provider: PROVIDER, remediationCode: REMEDIATION.pageRoleRequired },
        });
      }
      ensureOk(response, {
        provider: PROVIDER,
        operation: 'linkedin.create_post',
        response,
      });

      // The created post URN comes back in a header, not in the body. Published means an
      // external post id and nothing else, so a create with no URN is a failure.
      const postUrn = response.headers['x-restli-id'] ?? response.headers['x-linkedin-id'] ?? null;
      if (postUrn === null) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'linkedin.create_post',
          response,
          remediationCode: REMEDIATION.contactSupport,
          details: { missing: 'x-restli-id' },
        });
      }

      const publishedAt = nowIso();
      const items: PublishItemResult[] = [
        {
          kind: 'root',
          order: 0,
          threadItemId: null,
          externalPostId: postUrn,
          permalink: postPermalink(postUrn),
          publishedAt,
        },
      ];
      const failures: FailedItem[] = [];

      // LinkedIn has no thread product, so every follow up item is a comment on the root.
      // The connector never sleeps: it posts each item it was handed, in order.
      for (const item of [...draft.threadItems].sort((left, right) => left.order - right.order)) {
        const comment = await http.request({
          method: 'POST',
          url: `${REST_BASE}/socialActions/${encodeURIComponent(postUrn)}/comments`,
          headers: headers(accessToken),
          json: { actor: authorUrn(connection), object: postUrn, message: { text: item.body } },
          accept: 'json',
          provider: PROVIDER,
          operation: 'linkedin.create_comment',
        });
        const commentId = comment.headers['x-restli-id'] ?? null;
        if (!comment.ok || commentId === null) {
          // A failed comment never invalidates a root post that already exists externally.
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
        items.push({
          kind: item.kind,
          order: item.order,
          threadItemId: item.threadItemId,
          externalPostId: commentId,
          permalink: null,
          publishedAt,
        });
      }

      const sanitizedResponse = { postUrn, commentCount: items.length - 1 };
      if (failures.length > 0) {
        return {
          status: 'partial',
          externalPostId: postUrn,
          permalink: postPermalink(postUrn),
          publishedAt,
          items,
          failures,
          sanitizedResponse,
          providerRequestId: response.requestId,
          costMinor: null,
          currency: null,
        };
      }
      return {
        status: 'published',
        externalPostId: postUrn,
        permalink: postPermalink(postUrn),
        publishedAt,
        items,
        sanitizedResponse,
        providerRequestId: response.requestId,
        costMinor: null,
        currency: null,
      };
    },

    async getStatus(input: StatusRequest): Promise<PublishStatus> {
      const postUrn = input.externalPostId ?? input.providerJobId;
      if (postUrn === null) {
        // LinkedIn creates directly, so with no post URN there is nothing to poll.
        return {
          state: 'unknown',
          externalPostId: null,
          permalink: null,
          publishedAt: null,
          items: [],
          error: null,
          pollAfterSeconds: null,
          sanitizedResponse: { reason: 'no_post_urn_to_poll' },
        };
      }
      const accessToken = await accessTokenOf(input.connection);
      const response = await http.request({
        method: 'GET',
        url: `${REST_BASE}/posts/${encodeURIComponent(postUrn)}`,
        headers: headers(accessToken),
        accept: 'json',
        provider: PROVIDER,
        operation: 'linkedin.get_status',
      });
      if (response.status === 404) {
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
          sanitizedResponse: { status: response.status },
        };
      }
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
      const parsed = parseProviderBody(linkedInPostSchema, response, {
        provider: PROVIDER,
        operation: 'linkedin.get_status',
        response,
      });
      const published = parsed.lifecycleState === undefined || parsed.lifecycleState === 'PUBLISHED';
      const publishedAt = nowIso();
      return {
        state: published ? 'published' : 'processing',
        externalPostId: published ? parsed.id : null,
        permalink: published ? postPermalink(parsed.id) : null,
        publishedAt: published ? publishedAt : null,
        items: published
          ? [
              {
                kind: 'root',
                order: 0,
                threadItemId: null,
                externalPostId: parsed.id,
                permalink: postPermalink(parsed.id),
                publishedAt,
              },
            ]
          : [],
        error: null,
        pollAfterSeconds: published ? null : 10,
        sanitizedResponse: { lifecycleState: parsed.lifecycleState ?? 'PUBLISHED' },
      };
    },

    async deletePost(input: DeleteRequest): Promise<void> {
      const accessToken = await accessTokenOf(input.connection);
      const response = await http.request({
        method: 'DELETE',
        url: `${REST_BASE}/posts/${encodeURIComponent(input.externalPostId)}`,
        headers: headers(accessToken),
        accept: 'none',
        provider: PROVIDER,
        operation: 'linkedin.delete_post',
      });
      ensureOk(response, { provider: PROVIDER, operation: 'linkedin.delete_post', response });
    },

    async fetchMetrics(input: MetricsRequest): Promise<MetricObservation[]> {
      const accessToken = await accessTokenOf(input.connection);
      const observedAt = nowIso();
      const isOrganization = input.connection.accountType === 'organization';

      if (input.scope === 'account') {
        if (!isOrganization) {
          // LinkedIn does not provide member account statistics to new applications.
          return mapMetrics({
            provider: PROVIDER,
            scope: 'account',
            mappings: LINKEDIN_ORGANIZATION_ACCOUNT_METRICS,
            values: {},
            observedAt,
            rawPayload: {},
            missingAvailability: 'unavailable_permission',
          });
        }
        const response = await http.request({
          method: 'GET',
          url: `${REST_BASE}/organizationalEntityFollowerStatistics`,
          headers: headers(accessToken),
          query: {
            q: 'organizationalEntity',
            organizationalEntity: `urn:li:organization:${input.connection.externalAccountId}`,
          },
          accept: 'json',
          provider: PROVIDER,
          operation: 'linkedin.follower_statistics',
        });
        if (!response.ok) {
          return mapMetrics({
            provider: PROVIDER,
            scope: 'account',
            mappings: LINKEDIN_ORGANIZATION_ACCOUNT_METRICS,
            values: {},
            observedAt,
            rawPayload: { status: response.status },
            missingAvailability:
              response.status === 403 ? 'unavailable_permission' : 'unavailable_provider',
          });
        }
        const parsed = parseProviderBody(linkedInFollowerStatisticsSchema, response, {
          provider: PROVIDER,
          operation: 'linkedin.follower_statistics',
          response,
        });
        const gains = parsed.elements[0]?.followerGains ?? {};
        return mapMetrics({
          provider: PROVIDER,
          scope: 'account',
          mappings: LINKEDIN_ORGANIZATION_ACCOUNT_METRICS,
          values: { ...gains },
          observedAt,
          rawPayload: gains,
        });
      }

      const externalPostId = input.externalPostId;
      if (externalPostId === null) {
        return mapMetrics({
          provider: PROVIDER,
          scope: 'post',
          mappings: LINKEDIN_SOCIAL_METRICS,
          values: {},
          observedAt,
          rawPayload: {},
          missingAvailability: 'unavailable_pending',
        });
      }

      const observations: MetricObservation[] = [];

      const social = await http.request({
        method: 'GET',
        url: `${REST_BASE}/socialActions/${encodeURIComponent(externalPostId)}`,
        headers: headers(accessToken),
        accept: 'json',
        provider: PROVIDER,
        operation: 'linkedin.social_actions',
      });
      if (social.ok) {
        const parsed = parseProviderBody(linkedInSocialActionsSchema, social, {
          provider: PROVIDER,
          operation: 'linkedin.social_actions',
          response: social,
        });
        observations.push(
          ...mapMetrics({
            provider: PROVIDER,
            scope: 'post',
            mappings: LINKEDIN_SOCIAL_METRICS,
            values: {
              ...(parsed.likesSummary ?? {}),
              ...(parsed.commentsSummary ?? {}),
            },
            observedAt,
            rawPayload: parsed,
          }),
        );
      } else {
        observations.push(
          ...mapMetrics({
            provider: PROVIDER,
            scope: 'post',
            mappings: LINKEDIN_SOCIAL_METRICS,
            values: {},
            observedAt,
            rawPayload: { status: social.status },
            missingAvailability:
              social.status === 403 ? 'unavailable_permission' : 'unavailable_provider',
          }),
        );
      }

      if (!isOrganization) {
        // Impressions, clicks and shares exist only on the organization statistics
        // endpoint, and new applications do not get member post read back at all.
        return [
          ...observations,
          ...mapMetrics({
            provider: PROVIDER,
            scope: 'post',
            mappings: LINKEDIN_ORGANIZATION_POST_METRICS.filter(
              (mapping) =>
                mapping.normalizedName !== 'likes' && mapping.normalizedName !== 'comments',
            ),
            values: {},
            observedAt,
            rawPayload: {},
            missingAvailability: 'unavailable_permission',
          }),
        ];
      }

      const statistics = await http.request({
        method: 'GET',
        url: `${REST_BASE}/organizationalEntityShareStatistics`,
        headers: headers(accessToken),
        query: {
          q: 'organizationalEntity',
          organizationalEntity: `urn:li:organization:${input.connection.externalAccountId}`,
          shares: `List(${externalPostId})`,
        },
        accept: 'json',
        provider: PROVIDER,
        operation: 'linkedin.share_statistics',
      });
      if (!statistics.ok) {
        return [
          ...observations,
          ...mapMetrics({
            provider: PROVIDER,
            scope: 'post',
            mappings: LINKEDIN_ORGANIZATION_POST_METRICS,
            values: {},
            observedAt,
            rawPayload: { status: statistics.status },
            missingAvailability:
              statistics.status === 403 ? 'unavailable_permission' : 'unavailable_provider',
          }),
        ];
      }
      const parsed = parseProviderBody(linkedInShareStatisticsSchema, statistics, {
        provider: PROVIDER,
        operation: 'linkedin.share_statistics',
        response: statistics,
      });
      const totals = parsed.elements[0]?.totalShareStatistics ?? {};
      return [
        ...observations,
        ...mapMetrics({
          provider: PROVIDER,
          scope: 'post',
          mappings: LINKEDIN_ORGANIZATION_POST_METRICS,
          values: { ...totals },
          observedAt,
          rawPayload: totals,
        }),
      ];
    },

    async refreshCredential(input: RefreshRequest): Promise<CredentialResult> {
      const clientId = config.providers.linkedin.clientId;
      const clientSecret = config.providers.linkedin.clientSecret;
      if (clientId === undefined || clientSecret === undefined) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'linkedin.refresh_credential',
          remediationCode: REMEDIATION.contactSupport,
          details: { missingConfig: 'LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET' },
        });
      }
      return await input.refreshToken.use(
        async (refreshToken) =>
          await refreshOAuth2Token({
            http,
            clock,
            provider: PROVIDER,
            tokenUrl: TOKEN_URL,
            clientId,
            clientSecret,
            refreshToken,
            basicAuth: false,
          }),
      );
    },

    async revoke(input: RevokeRequest): Promise<void> {
      const clientId = config.providers.linkedin.clientId;
      const clientSecret = config.providers.linkedin.clientSecret;
      if (clientId === undefined || clientSecret === undefined) {
        return;
      }
      const response = await input.accessToken.use(
        async (accessToken) =>
          await http.request({
            method: 'POST',
            url: REVOKE_URL,
            form: { token: accessToken, client_id: clientId, client_secret: clientSecret },
            accept: 'none',
            provider: PROVIDER,
            operation: 'linkedin.revoke',
          }),
      );
      if (!response.ok) {
        logger.warn(
          { provider: PROVIDER, status: response.status },
          'linkedin revoke did not succeed',
        );
      }
    },
  };
}
