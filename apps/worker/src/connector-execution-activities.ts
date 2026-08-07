import { parseStoredMaster, parseVariantSettings, resolveTarget } from '@relay/application';
import { capabilitySnapshotSchema, ERROR_CODES, RelayError } from '@relay/contracts';
import type { RelayPrismaClient } from '@relay/database';
import type { ConnectorExecutionGateway, ConnectionDetails } from '@relay/runtime';

import type { WorkerActivities } from './activities/types';

export type ProviderActivities = Pick<
  WorkerActivities,
  'publishTarget' | 'revalidateTarget' | 'refreshCredential' | 'revokeProviderConnection'
>;

type OAuthClient = Parameters<ConnectorExecutionGateway['refresh']>[0]['client'];

export interface ConnectorBridgeOptions {
  readonly prisma: RelayPrismaClient;
  readonly gateway: ConnectorExecutionGateway;
  readonly oauthClientFor?: (provider: string) => OAuthClient | null;
}

function unavailable(reason: string): RelayError {
  return new RelayError(ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED, {
    messageKey: 'errors.capability_not_implemented',
    details: { reason },
  });
}

async function loadConnection(prisma: RelayPrismaClient, workspaceId: string, connectionId: string) {
  const row = await prisma.socialConnection.findFirst({
    where: { id: connectionId, workspaceId },
    select: {
      id: true, workspaceId: true, provider: true, accountType: true, externalAccountId: true,
      displayName: true, grantedScopes: true,
    },
  });
  if (row === null) throw new RelayError(ERROR_CODES.NOT_FOUND, { messageKey: 'error.connection_not_found.message', details: { resource: 'connection' } });
  const accountType = (
    row.accountType === 'creator_account'
      ? 'creator_profile'
      : row.accountType === 'business_account'
        ? 'business_profile'
        : row.accountType === 'personal_profile'
          ? 'personal_profile'
          : row.accountType === 'page'
            ? 'page'
            : row.accountType === 'organization'
              ? 'organization'
              : row.accountType === 'channel'
                ? 'channel'
                : row.accountType === 'group'
                  ? 'group'
                  : 'personal_profile'
  ) as ConnectionDetails['accountType'];
  return {
    connectionId: row.id,
    workspaceId: row.workspaceId,
    provider: row.provider,
    accountType,
    externalAccountId: row.externalAccountId,
    displayName: row.displayName,
    grantedScopes: [...row.grantedScopes],
    locale: 'en' as const,
    metadata: {},
  } satisfies ConnectionDetails;
}

function failed(error: { errorClass: string; remediationCode: string; messageKey: string; retryable: boolean }): Awaited<ReturnType<WorkerActivities['publishTarget']>> {
  const errorClass = error.errorClass === 'USER_ACTION_REQUIRED' ? 'user_action_required' : error.errorClass === 'TRANSIENT_PROVIDER' ? 'transient_provider' : error.errorClass === 'PERMANENT_PROVIDER' || error.errorClass === 'CONTENT_INVALID' ? 'permanent_provider' : error.errorClass === 'INTERNAL' ? 'internal' : 'unknown';
  return {
    outcome: error.errorClass === 'USER_ACTION_REQUIRED' ? 'action_required' : error.retryable ? 'transient' : 'permanent',
    publication: null,
    providerOperationId: null,
    errorClass,
    errorCode: error.errorClass === 'CONTENT_INVALID' ? ERROR_CODES.CONTENT_INVALID : error.errorClass === 'USER_ACTION_REQUIRED' ? ERROR_CODES.CONNECTION_ACTION_REQUIRED : error.retryable ? ERROR_CODES.PROVIDER_TRANSIENT : ERROR_CODES.PROVIDER_PERMANENT,
    messageKey: error.messageKey,
    retryAfterMs: null,
  };
}

export function createConnectorExecutionActivities(options: ConnectorBridgeOptions): ProviderActivities {
  return {
    async publishTarget(input) {
      try {
        const [connection, job, version, variant, attempt] = await Promise.all([
          loadConnection(options.prisma, input.ctx.workspaceId, input.connectionId),
          options.prisma.publishJob.findFirst({ where: { id: input.publishJobId, workspaceId: input.ctx.workspaceId }, select: { scheduledFor: true, dispatchedAt: true, idempotencyKey: true } }),
          options.prisma.contentVersion.findFirst({ where: { id: input.contentVersionId, workspaceId: input.ctx.workspaceId }, select: { contentItemId: true, contentHash: true, payload: true } }),
          options.prisma.postVariant.findFirst({ where: { id: input.targetId, workspaceId: input.ctx.workspaceId, contentVersionId: input.contentVersionId, connectionId: input.connectionId }, select: { id: true, settings: true } }),
          options.prisma.publishAttempt.findFirst({ where: { id: input.attemptId, workspaceId: input.ctx.workspaceId, publishJobId: input.publishJobId }, select: { attemptNumber: true } }),
        ]);
        if (job === null || version === null || variant === null || attempt === null) throw new RelayError(ERROR_CODES.NOT_FOUND, { messageKey: 'error.not_found.message' });
        const master = parseStoredMaster(version.payload);
        const settings = parseVariantSettings(variant.settings);
        const resolved = resolveTarget(master, settings.overrides);
        const capabilities = capabilitySnapshotSchema.parse(await options.gateway.capabilitiesFor({ workspaceId: input.ctx.workspaceId, connection }));
        const dispatchedAt = (job.dispatchedAt ?? new Date()).toISOString();
        const result = await options.gateway.publish({
          workspaceId: input.ctx.workspaceId,
          connection,
          request: {
            draft: {
              contentItemId: version.contentItemId, postVariantId: variant.id,
              contentKind: resolved.values.contentKind, locale: resolved.values.locale,
              title: master.title, body: resolved.values.body, media: [], links: [...resolved.values.links],
              threadItems: resolved.values.threadItems.map((item) => ({ threadItemId: item.id, kind: item.kind, order: item.order, body: item.body, media: [], delaySeconds: item.delaySeconds, links: [...item.links] })),
              destination: null, mentions: [], privacyValue: settings.privacyValue,
              disclosure: settings.disclosure ?? master.disclosure,
              scheduledInstant: job.scheduledFor.toISOString(), createdVia: master.createdVia, capabilities,
            },
            preparedMedia: [], contentVersionId: input.contentVersionId,
            contentVersionChecksum: version.contentHash, capabilityVersion: capabilities.capabilityVersion,
            idempotencyKey: input.providerIdempotencyToken ?? job.idempotencyKey,
            contentFingerprint: version.contentHash, dispatchedAt,
          },
          attemptNumber: attempt.attemptNumber,
          dispatchWindowFrom: dispatchedAt,
          dispatchWindowTo: new Date(new Date(dispatchedAt).getTime() + 15 * 60 * 1000).toISOString(),
          capabilities,
        });
        if (result.status === 'adopted') return { outcome: 'published', publication: { externalPostId: result.externalPostId, permalink: result.permalink, publishedAt: result.publishedAt, externalAccountId: connection.externalAccountId }, providerOperationId: null, errorClass: null, errorCode: null, messageKey: null, retryAfterMs: null };
        if (result.result.status === 'published' || result.result.status === 'partial') return { outcome: 'published', publication: { externalPostId: result.result.externalPostId, permalink: result.result.permalink, publishedAt: result.result.publishedAt, externalAccountId: connection.externalAccountId }, providerOperationId: null, errorClass: null, errorCode: null, messageKey: null, retryAfterMs: null };
        if (result.result.status === 'pending') return { outcome: 'processing', publication: null, providerOperationId: result.result.providerJobId, errorClass: null, errorCode: null, messageKey: null, retryAfterMs: result.result.pollAfterSeconds * 1000 };
        return failed(result.result.error);
      } catch (error: unknown) {
        const code = error instanceof RelayError ? error.code : ERROR_CODES.UNKNOWN;
        return { outcome: code === ERROR_CODES.CONNECTION_ACTION_REQUIRED ? 'action_required' : 'unknown', publication: null, providerOperationId: null, errorClass: code === ERROR_CODES.CONNECTION_ACTION_REQUIRED ? 'user_action_required' : 'unknown', errorCode: code, messageKey: null, retryAfterMs: null };
      }
    },

    async revalidateTarget(input) {
      const connection = await loadConnection(options.prisma, input.ctx.workspaceId, input.connectionId);
      const snapshot = await options.gateway.capabilitiesFor({ workspaceId: input.ctx.workspaceId, connection });
      const drifted = snapshot.capabilityVersion !== input.approvedCapabilityVersion;
      return { verdict: drifted ? 'needs_reapproval' : 'proceed', capabilityVersion: snapshot.capabilityVersion, capabilityDrifted: drifted, messageKey: drifted ? 'error.content_changed_after_approval.message' : null, errorCode: drifted ? ERROR_CODES.APPROVAL_REQUIRED : null, supportsProviderIdempotency: false, recreateOnUnknown: false, confirmsByWebhook: false };
    },

    async refreshCredential(input) {
      const connection = await loadConnection(options.prisma, input.ctx.workspaceId, input.connectionId);
      const client = options.oauthClientFor?.(connection.provider) ?? null;
      if (client === null) throw unavailable('oauth_client_configuration_unavailable');
      return options.gateway.refresh({ workspaceId: input.ctx.workspaceId, connection, client });
    },

    async revokeProviderConnection(input) {
      const connection = await loadConnection(options.prisma, input.ctx.workspaceId, input.connectionId);
      const client = options.oauthClientFor?.(connection.provider) ?? null;
      if (client === null) throw unavailable('oauth_client_configuration_unavailable');
      await options.gateway.revoke({ workspaceId: input.ctx.workspaceId, connection, client });
    },
  };
}
