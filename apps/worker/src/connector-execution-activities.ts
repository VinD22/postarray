import { parseStoredMaster, parseVariantSettings, resolveTarget } from '@relay/application';
import { capabilitySnapshotSchema, ERROR_CODES, RelayError } from '@relay/contracts';
import { z } from 'zod';
import type { RelayPrismaClient } from '@relay/database';
import type { ConnectorExecutionGateway, ConnectionDetails } from '@relay/runtime';

import type {
  ActivityContext,
  ExternalPublication,
  FetchMetricsInput,
  FetchMetricsResult,
  PublishTargetResult,
  SequenceItemResult,
  WorkerActivities,
} from './activities/types';
import { MESSAGE_KEYS } from './messages';

export type ProviderActivities = Pick<
  WorkerActivities,
  | 'publishTarget'
  | 'pollPublishStatus'
  | 'publishSequenceItem'
  | 'revalidateTarget'
  | 'refreshCredential'
  | 'revokeProviderConnection'
  | 'fetchPostMetrics'
  | 'fetchAccountMetrics'
>;

/**
 * Where a sequence item's outcome is recorded.
 *
 * Persistence stays in `@relay/application`; this bridge only knows that an
 * item landed somewhere and says so. Null until the application runtime exists.
 */
export interface WorkerSequenceStateSink {
  setSequenceItemState(input: {
    readonly ctx: ActivityContext;
    readonly targetId: string;
    readonly threadItemId: string;
    readonly state: 'published' | 'action_required' | 'failed_permanently';
    readonly externalPostId: string | null;
    readonly permalink: string | null;
    readonly publishedAt: string | null;
    readonly errorCode: ErrorCodeValue | null;
  }): Promise<void>;
}

type ErrorCodeValue = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

type OAuthClient = Parameters<ConnectorExecutionGateway['refresh']>[0]['client'];
type FetchedObservations = Awaited<
  ReturnType<ConnectorExecutionGateway['fetchMetrics']>
>['observations'];

/**
 * Where normalized readings are persisted.
 *
 * The gateway owns the provider call and the honesty rules; persistence stays
 * in `@relay/application`, so this bridge never learns what a MetricObservation
 * row looks like.
 */
export interface WorkerAnalyticsSink {
  writeObservations(input: {
    readonly ctx: ActivityContext;
    readonly connectionId: string;
    readonly receiptId: string | null;
    readonly scope: 'post' | 'account';
    readonly observations: FetchedObservations;
  }): Promise<{ readonly observedCount: number; readonly unavailableCount: number }>;
}

export interface ConnectorBridgeOptions {
  readonly prisma: RelayPrismaClient;
  readonly gateway: ConnectorExecutionGateway;
  readonly oauthClientFor?: (provider: string) => OAuthClient | null;
  /** Null until the application runtime is composed. */
  readonly analytics?: WorkerAnalyticsSink | null;
  /** Null until the application runtime is composed. */
  readonly sequenceState?: WorkerSequenceStateSink | null;
}

/**
 * The items a provider reported for one create, kept on the attempt row.
 *
 * A provider that publishes a whole thread in one call has already created
 * every part by the time it answers. Recording what it said is what lets the
 * sequence workflow adopt those parts instead of creating them a second time.
 */
const attemptItemsSchema = z
  .object({
    items: z.array(
      z
        .object({
          threadItemId: z.string().nullable(),
          kind: z.enum(['root', 'comment', 'thread']),
          order: z.number().int().nonnegative(),
          externalPostId: z.string().min(1),
          permalink: z.string().nullable(),
          publishedAt: z.string().min(1),
        })
        .loose(),
    ),
  })
  .loose();

function unavailable(reason: string): RelayError {
  return new RelayError(ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED, {
    messageKey: 'errors.capability_not_implemented',
    details: { reason },
  });
}

async function loadConnection(
  prisma: RelayPrismaClient,
  workspaceId: string,
  connectionId: string,
) {
  const row = await prisma.socialConnection.findFirst({
    where: { id: connectionId, workspaceId },
    select: {
      id: true,
      workspaceId: true,
      provider: true,
      accountType: true,
      externalAccountId: true,
      displayName: true,
      grantedScopes: true,
    },
  });
  if (row === null)
    throw new RelayError(ERROR_CODES.NOT_FOUND, {
      messageKey: 'error.connection_not_found.message',
      details: { resource: 'connection' },
    });
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

function failed(error: {
  errorClass: string;
  remediationCode: string;
  messageKey: string;
  retryable: boolean;
}): Awaited<ReturnType<WorkerActivities['publishTarget']>> {
  const errorClass =
    error.errorClass === 'USER_ACTION_REQUIRED'
      ? 'user_action_required'
      : error.errorClass === 'TRANSIENT_PROVIDER'
        ? 'transient_provider'
        : error.errorClass === 'PERMANENT_PROVIDER' || error.errorClass === 'CONTENT_INVALID'
          ? 'permanent_provider'
          : error.errorClass === 'INTERNAL'
            ? 'internal'
            : 'unknown';
  return {
    outcome:
      error.errorClass === 'USER_ACTION_REQUIRED'
        ? 'action_required'
        : error.retryable
          ? 'transient'
          : 'permanent',
    publication: null,
    providerOperationId: null,
    errorClass,
    errorCode:
      error.errorClass === 'CONTENT_INVALID'
        ? ERROR_CODES.CONTENT_INVALID
        : error.errorClass === 'USER_ACTION_REQUIRED'
          ? ERROR_CODES.CONNECTION_ACTION_REQUIRED
          : error.retryable
            ? ERROR_CODES.PROVIDER_TRANSIENT
            : ERROR_CODES.PROVIDER_PERMANENT,
    messageKey: error.messageKey,
    retryAfterMs: null,
  };
}

/**
 * Read one connection's metrics and write the readings down.
 *
 * The counts that come back are the counts that were persisted, not the counts
 * the provider happened to answer with, so a workflow that reports "12 observed,
 * 4 unavailable" is describing rows a person can actually go and look at.
 */
async function fetchMetricsFor(
  options: ConnectorBridgeOptions,
  scope: 'post' | 'account',
  input: FetchMetricsInput,
): Promise<FetchMetricsResult> {
  const sink = options.analytics ?? null;
  if (sink === null) throw unavailable('analytics_persistence_unavailable');
  const connection = await loadConnection(
    options.prisma,
    input.ctx.workspaceId,
    input.connectionId,
  );
  const receipt =
    input.receiptId === null
      ? null
      : await options.prisma.publicationReceipt.findFirst({
          where: { id: input.receiptId, workspaceId: input.ctx.workspaceId },
          select: { externalPostId: true },
        });
  if (input.receiptId !== null && receipt === null) {
    throw new RelayError(ERROR_CODES.NOT_FOUND, {
      messageKey: 'error.not_found.message',
      details: { resource: 'publication_receipt' },
    });
  }
  const result = await options.gateway.fetchMetrics({
    workspaceId: input.ctx.workspaceId,
    connection,
    scope,
    externalPostId: receipt?.externalPostId ?? null,
    rangeFrom: input.windowStart,
    rangeTo: input.windowEnd,
  });
  const written = await sink.writeObservations({
    ctx: input.ctx,
    connectionId: input.connectionId,
    receiptId: input.receiptId,
    scope,
    observations: result.observations,
  });
  return {
    observedCount: written.observedCount,
    unavailableCount: written.unavailableCount,
    // V1 reads one page per run and meters no provider cost, so both are stated
    // as absent rather than as zero.
    nextCursor: null,
    providerCostMinor: null,
  };
}


/**
 * One media reference as the provider draft describes it.
 *
 * Declared here rather than imported: `apps/worker` does not depend on
 * `@relay/connectors` and should not start to for a single type. The execution
 * gateway parses this against `providerMediaRefSchema` on the way through, so
 * the contract is still enforced, just not at this boundary.
 */
interface ProviderMediaRef {
  readonly mediaId: string;
  readonly derivativeId: string | null;
  readonly kind: 'image' | 'video' | 'gif' | 'document' | 'audio';
  readonly mimeType: string;
  readonly byteSize: number;
  readonly width: number | null;
  readonly height: number | null;
  readonly durationSeconds: number | null;
  readonly checksum: string;
  readonly altText: string | null;
  readonly altTextWaived: boolean;
  readonly sourceUrl: string | null;
  readonly sourceUrlExpiresAt: string | null;
}

/**
 * The media refs a draft carries, in the order the author chose.
 *
 * This is what an asset *is*: kind, mime type, size, dimensions, checksum and
 * alt text. Where the provider ends up putting it is `preparedMedia`, which the
 * execution gateway fills by calling the connector's own `prepareMedia` just
 * before publishing.
 *
 * A derivative wins over the original when one exists, because the derivative
 * pipeline produces the bytes a given provider actually accepts and its
 * checksum is what the receipt should record.
 *
 * `sourceUrl` is null for now. Providers that upload bytes are unaffected;
 * providers that pull from a URL need a short-lived signed link, which needs
 * the storage port threaded into the worker. It is left explicitly null rather
 * than faked, so a connector that requires one refuses honestly instead of
 * fetching nothing.
 */
async function loadProviderMedia(
  options: ConnectorBridgeOptions,
  workspaceId: string,
  mediaAssetIds: readonly string[],
): Promise<ProviderMediaRef[]> {
  if (mediaAssetIds.length === 0) return [];

  const assets = await options.prisma.mediaAsset.findMany({
    where: { id: { in: [...mediaAssetIds] }, workspaceId, scanState: 'clean' },
    select: {
      id: true,
      kind: true,
      mimeType: true,
      byteSize: true,
      width: true,
      height: true,
      durationMs: true,
      checksumSha256: true,
      altText: true,
      altTextWaivedAt: true,
    },
  });

  const derivatives = await options.prisma.mediaDerivative.findMany({
    where: { mediaAssetId: { in: assets.map((asset) => asset.id) }, workspaceId },
    select: {
      id: true,
      mediaAssetId: true,
      mimeType: true,
      byteSize: true,
      width: true,
      height: true,
      durationMs: true,
      checksumSha256: true,
    },
  });

  // The variant's order is the author's order, and for a carousel it is the
  // content. A `findMany` result order is not.
  return mediaAssetIds.flatMap((assetId) => {
    const asset = assets.find((row) => row.id === assetId);
    if (asset === undefined) return [];
    const derivative = derivatives.find((row) => row.mediaAssetId === assetId) ?? null;
    const durationMs = derivative?.durationMs ?? asset.durationMs;
    return [
      {
        mediaId: asset.id,
        derivativeId: derivative?.id ?? null,
        kind: asset.kind,
        mimeType: derivative?.mimeType ?? asset.mimeType,
        byteSize: Number(derivative?.byteSize ?? asset.byteSize),
        width: derivative?.width ?? asset.width,
        height: derivative?.height ?? asset.height,
        durationSeconds: durationMs === null ? null : durationMs / 1000,
        checksum: derivative?.checksumSha256 ?? asset.checksumSha256,
        altText: asset.altText,
        altTextWaived: asset.altTextWaivedAt !== null,
        sourceUrl: null,
        sourceUrlExpiresAt: null,
      },
    ];
  });
}

export function createConnectorExecutionActivities(
  options: ConnectorBridgeOptions,
): ProviderActivities {
  return {
    async fetchPostMetrics(input) {
      return fetchMetricsFor(options, 'post', input);
    },

    async fetchAccountMetrics(input) {
      return fetchMetricsFor(options, 'account', input);
    },

    async publishTarget(input) {
      try {
        const [connection, job, version, variant, attempt] = await Promise.all([
          loadConnection(options.prisma, input.ctx.workspaceId, input.connectionId),
          options.prisma.publishJob.findFirst({
            where: { id: input.publishJobId, workspaceId: input.ctx.workspaceId },
            select: { scheduledFor: true, dispatchedAt: true, idempotencyKey: true },
          }),
          options.prisma.contentVersion.findFirst({
            where: { id: input.contentVersionId, workspaceId: input.ctx.workspaceId },
            select: { contentItemId: true, contentHash: true, payload: true },
          }),
          options.prisma.postVariant.findFirst({
            where: {
              id: input.targetId,
              workspaceId: input.ctx.workspaceId,
              contentVersionId: input.contentVersionId,
              connectionId: input.connectionId,
            },
            select: { id: true, settings: true, mediaAssetIds: true },
          }),
          options.prisma.publishAttempt.findFirst({
            where: {
              id: input.attemptId,
              workspaceId: input.ctx.workspaceId,
              publishJobId: input.publishJobId,
            },
            select: { attemptNumber: true },
          }),
        ]);
        if (job === null || version === null || variant === null || attempt === null)
          throw new RelayError(ERROR_CODES.NOT_FOUND, { messageKey: 'error.not_found.message' });
        const master = parseStoredMaster(version.payload);
        const settings = parseVariantSettings(variant.settings);
        const resolved = resolveTarget(master, settings.overrides);
        const capabilities = capabilitySnapshotSchema.parse(
          await options.gateway.capabilitiesFor({ workspaceId: input.ctx.workspaceId, connection }),
        );
        const dispatchedAt = (job.dispatchedAt ?? new Date()).toISOString();
        // The draft used to carry `media: []` unconditionally, so an image post
        // published as text and a media-only provider failed at the provider
        // rather than here.
        const mediaRefs = await loadProviderMedia(options, input.ctx.workspaceId, variant.mediaAssetIds);
        const result = await options.gateway.publish({
          workspaceId: input.ctx.workspaceId,
          connection,
          request: {
            draft: {
              contentItemId: version.contentItemId,
              postVariantId: variant.id,
              contentKind: resolved.values.contentKind,
              locale: resolved.values.locale,
              title: master.title,
              body: resolved.values.body,
              media: mediaRefs,
              links: [...resolved.values.links],
              threadItems: resolved.values.threadItems.map((item) => ({
                threadItemId: item.id,
                kind: item.kind,
                order: item.order,
                body: item.body,
                media: [],
                delaySeconds: item.delaySeconds,
                links: [...item.links],
              })),
              destination: null,
              mentions: [],
              privacyValue: settings.privacyValue,
              disclosure: settings.disclosure ?? master.disclosure,
              scheduledInstant: job.scheduledFor.toISOString(),
              createdVia: master.createdVia,
              capabilities,
            },
            preparedMedia: [],
            contentVersionId: input.contentVersionId,
            contentVersionChecksum: version.contentHash,
            capabilityVersion: capabilities.capabilityVersion,
            idempotencyKey: input.providerIdempotencyToken ?? job.idempotencyKey,
            contentFingerprint: version.contentHash,
            dispatchedAt,
          },
          attemptNumber: attempt.attemptNumber,
          dispatchWindowFrom: dispatchedAt,
          dispatchWindowTo: new Date(
            new Date(dispatchedAt).getTime() + 15 * 60 * 1000,
          ).toISOString(),
          capabilities,
        });
        if (result.status === 'adopted')
          return {
            outcome: 'published',
            publication: {
              externalPostId: result.externalPostId,
              permalink: result.permalink,
              publishedAt: result.publishedAt,
              externalAccountId: connection.externalAccountId,
            },
            providerOperationId: null,
            errorClass: null,
            errorCode: null,
            messageKey: null,
            retryAfterMs: null,
          };
        if (result.result.status === 'published' || result.result.status === 'partial') {
          // Keep what the provider said it created. A provider that publishes a
          // whole thread in one call has already made every part, and this row
          // is how the sequence workflow finds them instead of making them again.
          await options.prisma.publishAttempt.updateMany({
            where: {
              id: input.attemptId,
              workspaceId: input.ctx.workspaceId,
              publishJobId: input.publishJobId,
            },
            data: { sanitizedResponse: { items: result.result.items } },
          });
          return {
            outcome: 'published',
            publication: {
              externalPostId: result.result.externalPostId,
              permalink: result.result.permalink,
              publishedAt: result.result.publishedAt,
              externalAccountId: connection.externalAccountId,
            },
            providerOperationId: null,
            errorClass: null,
            errorCode: null,
            messageKey: null,
            retryAfterMs: null,
          };
        }
        if (result.result.status === 'pending')
          return {
            outcome: 'processing',
            publication: null,
            providerOperationId: result.result.providerJobId,
            errorClass: null,
            errorCode: null,
            messageKey: null,
            retryAfterMs: result.result.pollAfterSeconds * 1000,
          };
        return failed(result.result.error);
      } catch (error: unknown) {
        const code = error instanceof RelayError ? error.code : ERROR_CODES.UNKNOWN;
        return {
          outcome: code === ERROR_CODES.CONNECTION_ACTION_REQUIRED ? 'action_required' : 'unknown',
          publication: null,
          providerOperationId: null,
          errorClass:
            code === ERROR_CODES.CONNECTION_ACTION_REQUIRED ? 'user_action_required' : 'unknown',
          errorCode: code,
          messageKey: null,
          retryAfterMs: null,
        };
      }
    },

    /**
     * Ask the provider what happened. Never creates.
     *
     * Two callers: a provider that accepted a container and publishes it later,
     * and the read-back after an attempt whose answer we lost. Both need the
     * same thing, which is the provider's own word, and neither may fall back
     * to a second create when it does not get one.
     */
    async pollPublishStatus(input): Promise<PublishTargetResult> {
      try {
        const [connection, job, receipt] = await Promise.all([
          loadConnection(options.prisma, input.ctx.workspaceId, input.connectionId),
          options.prisma.publishJob.findFirst({
            where: { id: input.publishJobId, workspaceId: input.ctx.workspaceId },
            select: {
              idempotencyKey: true,
              dispatchedAt: true,
              scheduledFor: true,
              contentVersion: { select: { contentHash: true } },
            },
          }),
          options.prisma.publicationReceipt.findFirst({
            where: { publishJobId: input.publishJobId, workspaceId: input.ctx.workspaceId },
            select: { externalPostId: true },
          }),
        ]);
        if (job === null)
          throw new RelayError(ERROR_CODES.NOT_FOUND, {
            messageKey: 'error.not_found.message',
            details: { resource: 'publish_job' },
          });
        const dispatchedAt = job.dispatchedAt ?? job.scheduledFor;
        const status = await options.gateway.pollStatus({
          workspaceId: input.ctx.workspaceId,
          connection,
          providerJobId: input.providerOperationId,
          externalPostId: receipt?.externalPostId ?? null,
          idempotencyKey: input.providerIdempotencyToken,
          contentFingerprint: job.contentVersion.contentHash,
          dispatchWindowFrom: dispatchedAt.toISOString(),
          dispatchWindowTo: new Date(dispatchedAt.getTime() + 15 * 60 * 1000).toISOString(),
        });
        if (
          status.state === 'published' &&
          status.externalPostId !== null &&
          status.publishedAt !== null
        ) {
          return {
            outcome: 'published',
            publication: {
              externalPostId: status.externalPostId,
              permalink: status.permalink,
              publishedAt: status.publishedAt,
              externalAccountId: connection.externalAccountId,
            },
            providerOperationId: null,
            errorClass: null,
            errorCode: null,
            messageKey: null,
            retryAfterMs: null,
          };
        }
        if (status.state === 'failed' && status.error !== null) return failed(status.error);
        if (status.state === 'processing') {
          return {
            outcome: 'processing',
            publication: null,
            providerOperationId: input.providerOperationId,
            errorClass: null,
            errorCode: null,
            messageKey: null,
            retryAfterMs: status.pollAfterSeconds === null ? null : status.pollAfterSeconds * 1000,
          };
        }
        // The provider would not say. Unknown is the honest answer and the
        // workflow already knows never to create again on it.
        return {
          outcome: 'unknown',
          publication: null,
          providerOperationId: input.providerOperationId,
          errorClass: 'unknown',
          errorCode: ERROR_CODES.UNKNOWN,
          messageKey: null,
          retryAfterMs: null,
        };
      } catch (error: unknown) {
        const code = error instanceof RelayError ? error.code : ERROR_CODES.UNKNOWN;
        return {
          outcome: code === ERROR_CODES.CONNECTION_ACTION_REQUIRED ? 'action_required' : 'unknown',
          publication: null,
          providerOperationId: input.providerOperationId,
          errorClass:
            code === ERROR_CODES.CONNECTION_ACTION_REQUIRED ? 'user_action_required' : 'unknown',
          errorCode: code,
          messageKey: null,
          retryAfterMs: null,
        };
      }
    },

    /**
     * One comment or thread part, chained onto the part before it.
     *
     * This activity adopts; it does not create. Every connector we ship builds
     * a thread inside the root `publish` call and reports each part it made, so
     * the part this workflow is asking about already exists, and creating it
     * again would put a duplicate comment under a live post. The activity
     * therefore looks the part up in what the provider itself reported, records
     * where it landed, and returns it.
     *
     * A part the provider did not create, which today means one carrying a
     * delay, comes back as `action_required` rather than as a second create.
     * The root post stays published, the campaign reads `partially_published`,
     * and the person is told which part is missing. A standalone delayed reply
     * needs reply linkage the connector contract does not carry yet; inventing
     * it here would be guessing at another post's identity.
     */
    async publishSequenceItem(input): Promise<SequenceItemResult> {
      const sink = options.sequenceState ?? null;
      const record = async (
        state: 'published' | 'action_required',
        publication: ExternalPublication | null,
        errorCode: ErrorCodeValue | null,
      ): Promise<void> => {
        await sink?.setSequenceItemState({
          ctx: input.ctx,
          targetId: input.targetId,
          threadItemId: input.threadItemId,
          state,
          externalPostId: publication?.externalPostId ?? null,
          permalink: publication?.permalink ?? null,
          publishedAt: publication?.publishedAt ?? null,
          errorCode,
        });
      };

      const [connection, attempt] = await Promise.all([
        loadConnection(options.prisma, input.ctx.workspaceId, input.connectionId),
        options.prisma.publishAttempt.findFirst({
          where: {
            id: input.attemptId,
            workspaceId: input.ctx.workspaceId,
            publishJobId: input.publishJobId,
          },
          select: { sanitizedResponse: true },
        }),
      ]);
      const reported = attemptItemsSchema.safeParse(attempt?.sanitizedResponse);
      const created = reported.success
        ? reported.data.items.find((item) => item.threadItemId === input.threadItemId)
        : undefined;
      if (created !== undefined) {
        const publication: ExternalPublication = {
          externalPostId: created.externalPostId,
          permalink: created.permalink,
          publishedAt: created.publishedAt,
          externalAccountId: connection.externalAccountId,
        };
        await record('published', publication, null);
        return { outcome: 'published', publication, errorCode: null, messageKey: null };
      }

      await record('action_required', null, ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED);
      return {
        outcome: 'action_required',
        publication: null,
        errorCode: ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED,
        messageKey: MESSAGE_KEYS.sequence.unsupported,
      };
    },

    async revalidateTarget(input) {
      const connection = await loadConnection(
        options.prisma,
        input.ctx.workspaceId,
        input.connectionId,
      );
      const snapshot = await options.gateway.capabilitiesFor({
        workspaceId: input.ctx.workspaceId,
        connection,
      });
      const drifted = snapshot.capabilityVersion !== input.approvedCapabilityVersion;
      return {
        verdict: drifted ? 'needs_reapproval' : 'proceed',
        capabilityVersion: snapshot.capabilityVersion,
        capabilityDrifted: drifted,
        messageKey: drifted ? 'error.content_changed_after_approval.message' : null,
        errorCode: drifted ? ERROR_CODES.APPROVAL_REQUIRED : null,
        supportsProviderIdempotency: false,
        recreateOnUnknown: false,
        confirmsByWebhook: false,
      };
    },

    async refreshCredential(input) {
      const connection = await loadConnection(
        options.prisma,
        input.ctx.workspaceId,
        input.connectionId,
      );
      const client = options.oauthClientFor?.(connection.provider) ?? null;
      if (client === null) throw unavailable('oauth_client_configuration_unavailable');
      return options.gateway.refresh({ workspaceId: input.ctx.workspaceId, connection, client });
    },

    async revokeProviderConnection(input) {
      const connection = await loadConnection(
        options.prisma,
        input.ctx.workspaceId,
        input.connectionId,
      );
      const client = options.oauthClientFor?.(connection.provider) ?? null;
      if (client === null) throw unavailable('oauth_client_configuration_unavailable');
      await options.gateway.revoke({ workspaceId: input.ctx.workspaceId, connection, client });
    },
  };
}
