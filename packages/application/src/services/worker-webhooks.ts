import { createHash } from 'node:crypto';

import {
  API_HEADERS,
  API_VERSION,
  ERROR_CODES,
  WEBHOOK_SCHEMA_VERSION,
  canonicalJson,
  type WebhookEventName,
} from '@relay/contracts';
import { safeFetch } from '@relay/connectors';
import { productMetrics } from '@relay/observability';

import type { ServiceDeps, WorkerActivityContext, WorkerWebhookService } from '../types';

import { notFound } from '../internal/errors';
import { runInWorkspace } from '../internal/runtime';
import {
  listWebhookSigningSecrets,
  requireWebhookSigningVault,
  type WebhookSigningSecretRow,
} from '../internal/webhook-signing-secret';
import { signOutboundWebhookPayload } from '../internal/outbound-webhook-signing';

const ENDPOINT_SECRET_SELECT = {
  id: true,
  workspaceId: true,
  url: true,
  state: true,
  consecutiveFailures: true,
  secretCiphertext: true,
  secretNonce: true,
  secretAuthTag: true,
  secretWrappedDataKey: true,
  keyVersion: true,
  secretAadContext: true,
  secretEnvelopeVersion: true,
  algorithm: true,
  previousSecretCiphertext: true,
  previousSecretNonce: true,
  previousSecretAuthTag: true,
  previousSecretWrappedDataKey: true,
  previousSecretKeyVersion: true,
  previousSecretAadContext: true,
  previousSecretEnvelopeVersion: true,
  previousSecretExpiresAt: true,
  createdAt: true,
} as const;

const DELIVERY_SELECT = {
  id: true,
  webhookEndpointId: true,
  eventId: true,
  eventType: true,
  state: true,
  attemptCount: true,
  payloadHash: true,
  payload: true,
  deliveredAt: true,
  createdAt: true,
} as const;

function workerContext(ctx: WorkerActivityContext) {
  return { ...ctx, scopes: [] as const };
}

function sha256PayloadHash(payload: unknown): string {
  return createHash('sha256').update(canonicalJson(payload)).digest('hex');
}

function buildTestPayload(workspaceId: string): Record<string, unknown> {
  return {
    schemaVersion: WEBHOOK_SCHEMA_VERSION,
    apiVersion: API_VERSION,
    isTest: true,
    workspaceId,
  };
}

/**
 * The bytes to sign and send.
 *
 * Deliveries store their body from migration 0079 onward, so the normal path
 * is simply to read it back: the receiver gets exactly what was recorded, and
 * a redelivery is provably the same bytes as the first attempt.
 *
 * Rows written before 0079 stored only a hash. For those, the one payload that
 * can be honestly reconstructed is the connection test, whose shape is fixed
 * and whose hash therefore identifies it. Anything else returns null and the
 * delivery fails as not implemented rather than inventing a body.
 */
function buildDeliveryPayload(input: {
  readonly workspaceId: string;
  readonly eventId: string;
  readonly eventType: string;
  readonly payloadHash: string;
  readonly payload: unknown;
}): Record<string, unknown> | null {
  if (
    typeof input.payload === 'object' &&
    input.payload !== null &&
    !Array.isArray(input.payload)
  ) {
    return input.payload as Record<string, unknown>;
  }
  const testPayload = buildTestPayload(input.workspaceId);
  const testHash = sha256PayloadHash(testPayload);
  if (input.eventType === 'connection.connected' && input.payloadHash === testHash) {
    return testPayload;
  }
  return null;
}

export function createWorkerWebhookService(deps: ServiceDeps): WorkerWebhookService {
  return {
    async loadWebhookDelivery(input) {
      return runInWorkspace(deps, workerContext(input.ctx), async (db) => {
        const row = await db.webhookDelivery.findFirst({
          where: { id: input.deliveryId, workspaceId: input.ctx.workspaceId },
          select: {
            ...DELIVERY_SELECT,
            webhookEndpoint: { select: { state: true, consecutiveFailures: true } },
          },
        });
        if (row === null) {
          throw notFound('webhook_delivery', input.deliveryId, input.ctx.correlationId);
        }
        const endpointEnabled = row.webhookEndpoint.state === 'active';
        return {
          deliveryId: row.id,
          endpointId: row.webhookEndpointId,
          eventName: row.eventType as WebhookEventName,
          attempt: row.attemptCount,
          endpointEnabled,
          consecutiveFailures: row.webhookEndpoint.consecutiveFailures,
          alreadyDelivered: row.state === 'delivered' || row.deliveredAt !== null,
        };
      });
    },

    async deliverWebhook(input) {
      const vault = requireWebhookSigningVault(deps.credentialVault);
      return runInWorkspace(deps, workerContext(input.ctx), async (db) => {
        const delivery = await db.webhookDelivery.findFirst({
          where: { id: input.deliveryId, workspaceId: input.ctx.workspaceId },
          select: DELIVERY_SELECT,
        });
        if (delivery === null) {
          throw notFound('webhook_delivery', input.deliveryId, input.ctx.correlationId);
        }
        const endpoint = await db.webhookEndpoint.findFirst({
          where: { id: input.endpointId, workspaceId: input.ctx.workspaceId },
          select: ENDPOINT_SECRET_SELECT,
        });
        if (endpoint === null) {
          throw notFound('webhook_endpoint', input.endpointId, input.ctx.correlationId);
        }
        if (endpoint.secretEnvelopeVersion !== 1) {
          return {
            status: 'failed' as const,
            responseStatus: null,
            retryable: false,
            errorCode: ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED,
          };
        }

        const bodyPayload = buildDeliveryPayload({
          workspaceId: input.ctx.workspaceId,
          eventId: delivery.eventId,
          eventType: delivery.eventType,
          payloadHash: delivery.payloadHash,
          payload: delivery.payload,
        });
        if (bodyPayload === null) {
          return {
            status: 'failed' as const,
            responseStatus: null,
            retryable: false,
            errorCode: ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED,
          };
        }

        const envelope = endpoint as WebhookSigningSecretRow;
        const secrets = await listWebhookSigningSecrets(vault, envelope, deps.clock.now());
        const signingSecret = secrets[0];
        if (signingSecret === undefined) {
          return {
            status: 'failed' as const,
            responseStatus: null,
            retryable: false,
            errorCode: ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED,
          };
        }

        const rawBody = Buffer.from(canonicalJson(bodyPayload), 'utf8');
        const timestamp = String(Math.floor(deps.clock.now().getTime() / 1000));
        const signature = signOutboundWebhookPayload(signingSecret, timestamp, rawBody);

        let fetchResult;
        try {
          fetchResult = await safeFetch(endpoint.url, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              // The published contract is API_HEADERS. The worker used to send
              // three different names, so a receiver following our own
              // documentation could not verify a single signature.
              [API_HEADERS.webhookSignature]: `v1=${signature}`,
              [API_HEADERS.webhookTimestamp]: timestamp,
              [API_HEADERS.webhookId]: delivery.eventId,
            },
            body: rawBody,
          });
        } catch {
          return {
            status: 'failed' as const,
            responseStatus: null,
            retryable: true,
            errorCode: ERROR_CODES.PROVIDER_UNAVAILABLE,
          };
        }

        const ok = fetchResult.status >= 200 && fetchResult.status < 300;

        // How long a customer waited between the event happening and their
        // endpoint hearing about it. Recorded on every attempt, successful or
        // not, because a slow retry is exactly the case worth seeing.
        productMetrics.webhookDeliveryLagSeconds.record(
          Math.max((deps.clock.now().getTime() - delivery.createdAt.getTime()) / 1000, 0),
          { event_type: delivery.eventType, outcome: ok ? 'delivered' : 'failed' },
        );

        return {
          status: ok ? ('succeeded' as const) : ('failed' as const),
          responseStatus: fetchResult.status,
          retryable: !ok && fetchResult.status >= 500,
          errorCode: ok ? null : ERROR_CODES.PROVIDER_TRANSIENT,
        };
      });
    },

    async recordWebhookAttempt(input) {
      await runInWorkspace(deps, workerContext(input.ctx), async (db) => {
        const endedAt = deps.clock.now();
        await db.webhookDelivery.updateMany({
          where: { id: input.deliveryId, workspaceId: input.ctx.workspaceId },
          data: {
            attemptCount: input.attempt,
            responseStatus: input.responseStatus,
            nextAttemptAt: input.nextAttemptAt === null ? null : new Date(input.nextAttemptAt),
            ...(input.status === 'succeeded'
              ? { state: 'delivered', deliveredAt: endedAt }
              : input.status === 'exhausted' || input.status === 'disabled'
                ? { state: 'dead_lettered', deadLetteredAt: endedAt }
                : input.status === 'failed'
                  ? { state: 'pending' }
                  : { state: 'failed' }),
          },
        });
        if (input.status === 'succeeded') {
          await db.webhookEndpoint.updateMany({
            where: { id: input.endpointId, workspaceId: input.ctx.workspaceId },
            data: { consecutiveFailures: 0 },
          });
        } else if (input.status === 'failed') {
          await db.webhookEndpoint.updateMany({
            where: { id: input.endpointId, workspaceId: input.ctx.workspaceId },
            data: { consecutiveFailures: { increment: 1 } },
          });
        }
      });
    },

    async disableWebhookEndpoint(input) {
      await runInWorkspace(deps, workerContext(input.ctx), async (db) => {
        await db.webhookEndpoint.updateMany({
          where: { id: input.endpointId, workspaceId: input.ctx.workspaceId },
          data: {
            state: 'disabled_on_failure',
            disabledReason: input.reasonKey,
          },
        });
      });
    },

    async deadLetterWebhookDelivery(input) {
      await runInWorkspace(deps, workerContext(input.ctx), async (db) => {
        await db.webhookDelivery.updateMany({
          where: { id: input.deliveryId, workspaceId: input.ctx.workspaceId },
          data: {
            state: 'dead_lettered',
            deadLetteredAt: deps.clock.now(),
          },
        });
      });
    },
  };
}
