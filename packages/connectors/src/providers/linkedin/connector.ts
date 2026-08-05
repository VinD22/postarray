import {
  ConnectionActionRequiredError,
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
  refreshOAuth2Token,
  type AuthorizationDefinition,
  type CanonicalPreview,
  type ConnectorDeps,
  type CredentialResult,
  type DeleteRequest,
  type DestinationRequest,
  type ExternalAccount,
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
  const { http, vault, clock, config, logger } = deps;

  function headers(accessToken: string): Record<string, string> {
    return {
      authorization: `Bearer ${accessToken}`,
      'linkedin-version': LINKEDIN_API_VERSION,
      'x-restli-protocol-version': '2.0.0',
    };
  }

  async function token(connection: ProviderConnection): Promise<string> {
    return vault.getAccessToken(connection.credentialRef);
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
        remediationKey: REMEDIATION.contactSupport,
        details: { staleVersionHeader: LINKEDIN_API_VERSION },
      });
    }
  }

  async function uploadBinary(
    uploadUrl: string,
    media: ProviderMedia,
    accessToken: string,
    operation: string,
  ): Promise<void> {
    const download = await http.request({
      method: 'GET',
      url: media.downloadUrl,
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
      remediationKey: REMEDIATION.mediaInvalid,
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
      remediationKey: REMEDIATION.mediaInvalid,
    });
    const parsed = parseProviderBody(linkedInImageInitializeSchema, response, {
      provider: PROVIDER,
      operation: 'linkedin.image.initialize',
      response,
    });
    await uploadBinary(parsed.value.uploadUrl, media, accessToken, 'linkedin.image.upload');
    return {
      mediaId: media.mediaId,
      providerMediaId: parsed.value.image,
      providerContainerId: null,
      uploadUrl: null,
      state: 'ready',
      checksum: media.sha256,
      variant: 'linkedin:image',
      metadata: { owner: authorUrn(connection) },
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
      remediationKey: REMEDIATION.mediaInvalid,
    });
    const parsed = parseProviderBody(linkedInDocumentInitializeSchema, response, {
      provider: PROVIDER,
      operation: 'linkedin.document.initialize',
      response,
    });
    await uploadBinary(parsed.value.uploadUrl, media, accessToken, 'linkedin.document.upload');
    return {
      mediaId: media.mediaId,
      providerMediaId: parsed.value.document,
      providerContainerId: null,
      uploadUrl: null,
      state: 'ready',
      checksum: media.sha256,
      variant: 'linkedin:document',
      metadata: { owner: authorUrn(connection) },
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
      remediationKey: REMEDIATION.mediaInvalid,
    });
    const parsed = parseProviderBody(linkedInVideoInitializeSchema, response, {
      provider: PROVIDER,
      operation: 'linkedin.video.initialize',
      response,
    });

    const source = await http.request({
      method: 'GET',
      url: media.downloadUrl,
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
        remediationKey: REMEDIATION.mediaInvalid,
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
      remediationKey: REMEDIATION.mediaInvalid,
    });

    return {
      mediaId: media.mediaId,
      providerMediaId: parsed.value.video,
      providerContainerId: null,
      uploadUrl: null,
      // LinkedIn processes video after finalize. `getStatus` confirms before we publish.
      state: 'processing',
      checksum: media.sha256,
      variant: 'linkedin:video',
      metadata: { owner: authorUrn(connection), partCount: etags.length },
    };
  }

  function buildPostBody(
    request: PublishRequest,
    options: ReturnType<typeof linkedInProviderOptionsSchema.parse>,
  ): Record<string, unknown> {
    const { connection, draft } = request;
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
        docsUrl:
          'https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api',
        policyUrl: 'https://legal.linkedin.com/api-terms-of-use',
        engineeringOwner: 'Backend/Connectors 2',
        policyOwner: 'Policy Owner',
        lastPolicyReviewAt: SOURCE_VERIFIED_ON,
        contractVersion: CONNECTOR_CONTRACT_VERSION,
      };
    },

    authorization(): AuthorizationDefinition {
      return {
        flavor: 'oauth2_code',
        authorizeUrl: AUTHORIZE_URL,
        tokenUrl: TOKEN_URL,
        revokeUrl: REVOKE_URL,
        requiresPkce: false,
        // LinkedIn returns one member token. Organization posting rights come from the
        // member's Page roles, which we read after the grant.
        multiStep: true,
        redirectPath: '/oauth/linkedin/callback',
        scopes: [
          { scope: 'openid', descriptionKey: 'connectors.linkedin.scope.openid' },
          { scope: 'profile', descriptionKey: 'connectors.linkedin.scope.profile' },
          { scope: 'w_member_social', descriptionKey: 'connectors.linkedin.scope.w_member_social' },
          {
            scope: 'w_organization_social',
            descriptionKey: 'connectors.linkedin.scope.w_organization_social',
          },
          {
            scope: 'r_organization_social',
            descriptionKey: 'connectors.linkedin.scope.r_organization_social',
          },
          {
            scope: 'rw_organization_admin',
            descriptionKey: 'connectors.linkedin.scope.rw_organization_admin',
          },
        ],
        notesKey: 'connectors.linkedin.authorization_note',
      };
    },

    async discoverAccounts(grant: OAuthGrant): Promise<ExternalAccount[]> {
      const accounts: ExternalAccount[] = [];

      const me = await http.request({
        method: 'GET',
        url: USERINFO_URL,
        headers: { authorization: `Bearer ${grant.accessToken}` },
        accept: 'json',
        provider: PROVIDER,
        operation: 'linkedin.userinfo',
      });
      ensureOk(me, {
        provider: PROVIDER,
        operation: 'linkedin.userinfo',
        response: me,
        remediationKey: REMEDIATION.reconnectAccount,
      });
      const profile = parseProviderBody(linkedInUserInfoSchema, me, {
        provider: PROVIDER,
        operation: 'linkedin.userinfo',
        response: me,
      });
      accounts.push({
        externalId: profile.sub,
        accountType: 'personal_profile',
        displayName: profile.name ?? 'LinkedIn member',
        handle: null,
        avatarUrl: profile.picture ?? null,
        parentExternalId: null,
        connectable: grant.scopes.includes('w_member_social'),
        blockedReasonKey: grant.scopes.includes('w_member_social')
          ? null
          : 'connectors.linkedin.member_write_scope_missing',
        scopes: [...grant.scopes],
        metadata: { memberUrn: memberUrn(profile.sub) },
      });

      if (!grant.scopes.includes('rw_organization_admin')) {
        return accounts;
      }

      const acls = await http.request({
        method: 'GET',
        url: `${REST_BASE}/organizationAcls`,
        headers: {
          authorization: `Bearer ${grant.accessToken}`,
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
        accounts.push({
          externalId: organizationId,
          accountType: 'organization',
          displayName:
            element.organizationalTarget$?.localizedName ?? `Organization ${organizationId}`,
          handle: element.organizationalTarget$?.vanityName ?? null,
          avatarUrl: null,
          parentExternalId: profile.sub,
          connectable: eligible && grant.scopes.includes('w_organization_social'),
          blockedReasonKey: eligible ? null : 'connectors.linkedin.page_role_required',
          scopes: [...grant.scopes],
          metadata: { organizationUrn: element.organizationalTarget, role: element.role },
        });
      }
      return accounts;
    },

    async listDestinations(input: DestinationRequest): Promise<ProviderDestination[]> {
      const accessToken = await token(input.connection);
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
        remediationKey: REMEDIATION.pageRoleRequired,
      });
      const parsed = parseProviderBody(linkedInOrganizationAclsSchema, response, {
        provider: PROVIDER,
        operation: 'linkedin.list_destinations',
        response,
      });
      return parsed.elements
        .filter((element) => PUBLISHING_ROLES.has(element.role))
        .map((element) => ({
          externalId: element.organizationalTarget,
          kind: 'organization' as const,
          label:
            element.organizationalTarget$?.localizedName ??
            `Organization ${organizationIdFromUrn(element.organizationalTarget)}`,
          description: null,
          metadata: { role: element.role },
        }));
    },

    async searchMentions(input: MentionSearchRequest): Promise<MentionEntity[]> {
      const accessToken = await token(input.connection);
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
      return parsed.elements
        .filter((organization) => organization.id !== undefined)
        .map((organization) => ({
          externalId: `urn:li:organization:${String(organization.id)}`,
          displayLabel: organization.localizedName ?? String(organization.id),
          handle: organization.vanityName ?? null,
          kind: 'organization' as const,
          avatarUrl: null,
          // A resolved LinkedIn mention carries a real URN, so it is a native tag.
          resolved: true,
        }));
    },

    async getCapabilities(connection: ProviderConnection) {
      return buildLinkedInCapabilities({
        connection,
        observedAt: nowIso(),
        grantedScopes: connection.scopes,
      });
    },

    async validateDraft(draft: ProviderDraft): Promise<ValidationResult> {
      const snapshot = draft.capabilities;
      const targetId = draft.connection.connectionId;
      const options = linkedInProviderOptionsSchema.parse(draft.providerOptions);
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
        !draft.connection.scopes.includes('w_organization_social')
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

      return validationResult({ issues });
    },

    async prepareMedia(input: MediaPreparationRequest): Promise<PreparedMedia[]> {
      const accessToken = await token(input.connection);
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
      return buildPreview(draft, draft.capabilities, {
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
      });
    },

    async publish(request: PublishRequest): Promise<PublishResult> {
      const { connection } = request;
      const accessToken = await token(connection);
      const options = linkedInProviderOptionsSchema.parse(request.draft.providerOptions);

      const existing = request.resume['postUrn'];
      if (typeof existing === 'string' && existing !== '') {
        return {
          state: 'published',
          externalPostId: existing,
          permalink: postPermalink(existing),
          root: {
            kind: 'root',
            order: 0,
            threadItemId: null,
            state: 'published',
            externalPostId: existing,
            permalink: postPermalink(existing),
            errorClass: null,
            errorCode: null,
            remediationKey: null,
          },
          items: [],
          pollToken: existing,
          resume: { postUrn: existing },
          sanitizedProviderResponse: { adopted: true },
          costMinor: null,
          currency: null,
        };
      }

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
          details: { provider: PROVIDER, remediationKey: REMEDIATION.pageRoleRequired },
        });
      }
      ensureOk(response, {
        provider: PROVIDER,
        operation: 'linkedin.create_post',
        response,
      });

      // The created post URN comes back in a header, not in the body.
      const postUrn = response.headers['x-restli-id'] ?? response.headers['x-linkedin-id'] ?? null;
      if (postUrn === null) {
        throw providerFailure({
          provider: PROVIDER,
          operation: 'linkedin.create_post',
          response,
          remediationKey: REMEDIATION.contactSupport,
          details: { missing: 'x-restli-id' },
        });
      }

      const root: PublishItemResult = {
        kind: 'root',
        order: 0,
        threadItemId: null,
        state: 'published',
        externalPostId: postUrn,
        permalink: postPermalink(postUrn),
        errorClass: null,
        errorCode: null,
        remediationKey: null,
      };

      const items: PublishItemResult[] = [];
      for (const item of request.draft.threadItems) {
        if (item.kind !== 'comment' || item.delaySeconds > 0) {
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
        const comment = await http.request({
          method: 'POST',
          url: `${REST_BASE}/socialActions/${encodeURIComponent(postUrn)}/comments`,
          headers: headers(accessToken),
          json: { actor: authorUrn(connection), object: postUrn, message: { text: item.body } },
          accept: 'json',
          provider: PROVIDER,
          operation: 'linkedin.create_comment',
        });
        items.push({
          kind: item.kind,
          order: item.order,
          threadItemId: item.id,
          state: comment.ok ? 'published' : 'failed',
          externalPostId: comment.headers['x-restli-id'] ?? null,
          permalink: null,
          errorClass: null,
          errorCode: null,
          remediationKey: comment.ok ? null : REMEDIATION.commentFailedRootPublished,
        });
      }

      const anyFailed = items.some((item) => item.state === 'failed');
      const anyPending = items.some((item) => item.state === 'processing');

      return {
        state: anyFailed ? 'partially_published' : anyPending ? 'processing' : 'published',
        externalPostId: postUrn,
        permalink: postPermalink(postUrn),
        root,
        items,
        pollToken: postUrn,
        resume: { postUrn },
        sanitizedProviderResponse: { postUrn, commentCount: items.length },
        costMinor: null,
        currency: null,
      };
    },

    async getStatus(input: StatusRequest): Promise<PublishStatus> {
      const accessToken = await token(input.connection);
      const response = await http.request({
        method: 'GET',
        url: `${REST_BASE}/posts/${encodeURIComponent(input.pollToken)}`,
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
          errorClass: 'PERMANENT_PROVIDER',
          remediationKey: REMEDIATION.providerRejectedContent,
          sanitizedProviderResponse: { status: response.status },
        };
      }
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
      const parsed = parseProviderBody(linkedInPostSchema, response, {
        provider: PROVIDER,
        operation: 'linkedin.get_status',
        response,
      });
      const published = parsed.lifecycleState === undefined || parsed.lifecycleState === 'PUBLISHED';
      return {
        state: published ? 'published' : 'processing',
        externalPostId: published ? parsed.id : null,
        permalink: published ? postPermalink(parsed.id) : null,
        errorClass: null,
        remediationKey: null,
        sanitizedProviderResponse: { lifecycleState: parsed.lifecycleState ?? 'PUBLISHED' },
      };
    },

    async deletePost(input: DeleteRequest): Promise<void> {
      const accessToken = await token(input.connection);
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
      const accessToken = await token(input.connection);
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
      if (externalPostId === undefined) {
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
          remediationKey: REMEDIATION.contactSupport,
          details: { missingConfig: 'LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET' },
        });
      }
      return refreshOAuth2Token({
        http,
        clock,
        provider: PROVIDER,
        tokenUrl: TOKEN_URL,
        clientId,
        clientSecret,
        refreshToken: input.refreshToken,
        basicAuth: false,
      });
    },

    async revoke(input: RevokeRequest): Promise<void> {
      const clientId = config.providers.linkedin.clientId;
      const clientSecret = config.providers.linkedin.clientSecret;
      if (clientId === undefined || clientSecret === undefined) {
        return;
      }
      const accessToken = await token(input.connection);
      const response = await http.request({
        method: 'POST',
        url: REVOKE_URL,
        form: { token: accessToken, client_id: clientId, client_secret: clientSecret },
        accept: 'none',
        provider: PROVIDER,
        operation: 'linkedin.revoke',
      });
      if (!response.ok) {
        logger.warn(
          { provider: PROVIDER, status: response.status },
          'linkedin revoke did not succeed',
        );
      }
    },
  };
}
