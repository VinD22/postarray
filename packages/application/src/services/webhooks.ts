import { createHash, randomBytes } from 'node:crypto';

import type { Prisma } from '@relay/database';

import {
  WEBHOOK_SCHEMA_VERSION,
  API_VERSION,
  canonicalJson,
  ID_PREFIXES,
  newId,
  type Paginated,
  type WebhookEventName,
} from '@relay/contracts';

import type {
  ActorContext,
  PageQuery,
  ServiceDeps,
  WebhookService,
  WorkflowActorContext,
} from '../types';
import type { WebhookDeliveryView, WebhookEndpointView } from '../views';

import { recordAudit } from '../internal/audit';
import { invalid, notFound } from '../internal/errors';
import { pageArgs, toPage } from '../internal/pagination';
import { authorized } from '../internal/runtime';
import { assertFetchable } from '../internal/url-safety';
import {
  encryptWebhookSigningSecret,
  requireWebhookSigningVault,
} from '../internal/webhook-signing-secret';
import { webhookSigningSecretEnvelopeToRow } from '../webhook-signing-secret-envelope';

/**
 * Outbound webhooks.
 *
 * The signing secret is shown exactly once, at creation or rotation. Deliveries
 * are deduplicated by event id, which is stable across retries and manual
 * redeliveries, so a receiver that stores the id can safely process at least
 * once. `emit` is the internal entry point the worker calls; it fans one event
 * out to every endpoint that subscribed to it and is in scope for the
 * connection involved.
 */

const SECRET_OVERLAP_MS = 24 * 60 * 60 * 1000;

function prismaBytes(value: Uint8Array): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(new ArrayBuffer(value.byteLength));
  bytes.set(value);
  return bytes;
}

const ENDPOINT_SELECT = {
  id: true,
  workspaceId: true,
  name: true,
  url: true,
  state: true,
  subscribedEvents: true,
  connectionScope: true,
  consecutiveFailures: true,
  createdAt: true,
} as const;

interface EndpointRow {
  id: string;
  workspaceId: string;
  name: string;
  url: string;
  state: string;
  subscribedEvents: string[];
  connectionScope: string[];
  consecutiveFailures: number;
  createdAt: Date;
}

function toEndpointView(row: EndpointRow): WebhookEndpointView {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    name: row.name,
    url: row.url,
    state: row.state as WebhookEndpointView['state'],
    subscribedEvents: row.subscribedEvents as WebhookEventName[],
    connectionScope: [...row.connectionScope],
    consecutiveFailures: row.consecutiveFailures,
    createdAt: row.createdAt.toISOString(),
  };
}

const DELIVERY_SELECT = {
  id: true,
  webhookEndpointId: true,
  eventId: true,
  eventType: true,
  state: true,
  attemptCount: true,
  responseStatus: true,
  responseSnippet: true,
  nextAttemptAt: true,
  deliveredAt: true,
  createdAt: true,
} as const;

interface DeliveryRow {
  id: string;
  webhookEndpointId: string;
  eventId: string;
  eventType: string;
  state: string;
  attemptCount: number;
  responseStatus: number | null;
  responseSnippet: string | null;
  nextAttemptAt: Date | null;
  deliveredAt: Date | null;
  createdAt: Date;
}

function toDeliveryView(row: DeliveryRow): WebhookDeliveryView {
  return {
    id: row.id,
    endpointId: row.webhookEndpointId,
    eventId: row.eventId,
    eventType: row.eventType as WebhookEventName,
    state: row.state as WebhookDeliveryView['state'],
    attemptCount: row.attemptCount,
    responseStatus: row.responseStatus,
    responseSnippet: row.responseSnippet,
    nextAttemptAt: row.nextAttemptAt?.toISOString() ?? null,
    deliveredAt: row.deliveredAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

/**
 * How many times the delivery workflow tries before giving up. Mirrors
 * DEFAULT_MAX_ATTEMPTS in the workflow body; stated here because the caller
 * has to put a number in the workflow input.
 */
const WEBHOOK_DELIVERY_MAX_ATTEMPTS = 8;

/**
 * Delivery runs as the system: it is the product honouring a subscription the
 * workspace already consented to, not an action a person is taking now.
 */
function webhookWorkflowContext(workspaceId: string, correlationId: string): WorkflowActorContext {
  return {
    workspaceId,
    correlationId,
    actorId: 'webhook-dispatcher',
    actorType: 'system',
    surface: 'automation_rule',
    approvalLevel: 'level_3_confirm',
    locale: 'en',
  };
}

function payloadHash(payload: unknown): string {
  return createHash('sha256').update(canonicalJson(payload)).digest('hex');
}

export function createWebhookService(deps: ServiceDeps): WebhookService {
  return {
    async list(ctx: ActorContext, query: PageQuery = {}): Promise<Paginated<WebhookEndpointView>> {
      return authorized(deps, ctx, 'webhook.read', undefined, async (db) => {
        const args = pageArgs(query);
        const rows = await db.webhookEndpoint.findMany({
          where: { state: { not: 'deleted' } },
          orderBy: { id: 'asc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: ENDPOINT_SELECT,
        });
        return toPage(rows, args, (row) => row.id, toEndpointView);
      });
    },

    async create(
      ctx: ActorContext,
      input: {
        name: string;
        url: string;
        events: readonly WebhookEventName[];
        connectionScope?: readonly string[];
      },
    ): Promise<{ endpoint: WebhookEndpointView; signingSecret: string }> {
      return authorized(deps, ctx, 'webhook.write', undefined, async (db, actor) => {
        await assertFetchable(input.url);
        if (input.events.length === 0) {
          throw invalid('errors.webhook_events_required', {});
        }
        if (actor.userId === null) {
          throw invalid('errors.webhook_requires_user', {});
        }

        const vault = requireWebhookSigningVault(deps.credentialVault);
        const endpointId = newId(ID_PREFIXES.webhookEndpoint);
        const signingSecret = `whsec_${randomBytes(32).toString('base64url')}`;
        const envelope = await encryptWebhookSigningSecret(vault, {
          workspaceId: actor.workspace.id,
          endpointId,
          signingSecret,
        });
        const secretRow = webhookSigningSecretEnvelopeToRow(envelope);

        const created = await db.webhookEndpoint.create({
          data: {
            id: endpointId,
            workspaceId: actor.workspace.id,
            name: input.name,
            url: input.url,
            state: 'active',
            secretCiphertext: prismaBytes(secretRow.secretCiphertext),
            secretNonce: prismaBytes(secretRow.secretNonce),
            secretAuthTag: prismaBytes(secretRow.secretAuthTag),
            secretWrappedDataKey: prismaBytes(secretRow.secretWrappedDataKey),
            keyVersion: secretRow.keyVersion,
            secretAadContext: secretRow.secretAadContext,
            secretEnvelopeVersion: secretRow.secretEnvelopeVersion,
            algorithm: secretRow.algorithm,
            subscribedEvents: [...input.events],
            connectionScope: [...(input.connectionScope ?? [])],
            createdByUserId: actor.userId,
          },
          select: ENDPOINT_SELECT,
        });

        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'webhook_endpoint',
          targetId: created.id,
          after: { url: input.url, events: [...input.events] },
        });

        return { endpoint: toEndpointView(created), signingSecret };
      });
    },

    async update(
      ctx: ActorContext,
      endpointId: string,
      patch: {
        url?: string;
        events?: readonly WebhookEventName[];
        connectionScope?: readonly string[];
        paused?: boolean;
      },
    ): Promise<WebhookEndpointView> {
      return authorized(deps, ctx, 'webhook.write', undefined, async (db, actor) => {
        const before = await db.webhookEndpoint.findFirst({
          where: { id: endpointId },
          select: ENDPOINT_SELECT,
        });
        if (before === null) {
          throw notFound('webhook_endpoint', endpointId);
        }
        if (patch.url !== undefined) {
          await assertFetchable(patch.url);
        }
        const after = await db.webhookEndpoint.update({
          where: { id: endpointId },
          data: {
            ...(patch.url === undefined ? {} : { url: patch.url }),
            ...(patch.events === undefined ? {} : { subscribedEvents: [...patch.events] }),
            ...(patch.connectionScope === undefined
              ? {}
              : { connectionScope: [...patch.connectionScope] }),
            ...(patch.paused === undefined ? {} : { state: patch.paused ? 'paused' : 'active' }),
          },
          select: ENDPOINT_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'webhook_endpoint',
          targetId: endpointId,
          before: toEndpointView(before),
          after: toEndpointView(after),
        });
        return toEndpointView(after);
      });
    },

    async delete(ctx: ActorContext, endpointId: string): Promise<void> {
      await authorized(deps, ctx, 'webhook.write', undefined, async (db, actor) => {
        await db.webhookEndpoint.update({
          where: { id: endpointId },
          data: { state: 'deleted' },
        });
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'webhook_endpoint',
          targetId: endpointId,
          after: { state: 'deleted' },
        });
      });
    },

    async rotateSecret(
      ctx: ActorContext,
      endpointId: string,
    ): Promise<{ readonly endpoint: WebhookEndpointView; readonly signingSecret: string }> {
      return authorized(deps, ctx, 'webhook.write', undefined, async (db, actor) => {
        const vault = requireWebhookSigningVault(deps.credentialVault);
        const before = await db.webhookEndpoint.findFirst({
          where: { id: endpointId, state: { not: 'deleted' } },
          select: {
            ...ENDPOINT_SELECT,
            secretCiphertext: true,
            secretNonce: true,
            secretAuthTag: true,
            secretWrappedDataKey: true,
            keyVersion: true,
            secretAadContext: true,
            secretEnvelopeVersion: true,
            algorithm: true,
          },
        });
        if (before === null) {
          throw notFound('webhook_endpoint', endpointId);
        }
        if (before.secretEnvelopeVersion !== 1) {
          throw invalid('error.request_invalid.message', {
            reason: 'webhook_secret_legacy',
            endpointId,
          });
        }

        const signingSecret = `whsec_${randomBytes(32).toString('base64url')}`;
        const envelope = await encryptWebhookSigningSecret(vault, {
          workspaceId: before.workspaceId,
          endpointId: before.id,
          signingSecret,
        });
        const secretRow = webhookSigningSecretEnvelopeToRow(envelope);
        const overlapExpiresAt = new Date(deps.clock.now().getTime() + SECRET_OVERLAP_MS);

        const after = await db.webhookEndpoint.update({
          where: { id: endpointId },
          data: {
            secretCiphertext: prismaBytes(secretRow.secretCiphertext),
            secretNonce: prismaBytes(secretRow.secretNonce),
            secretAuthTag: prismaBytes(secretRow.secretAuthTag),
            secretWrappedDataKey: prismaBytes(secretRow.secretWrappedDataKey),
            keyVersion: secretRow.keyVersion,
            secretAadContext: secretRow.secretAadContext,
            secretEnvelopeVersion: secretRow.secretEnvelopeVersion,
            algorithm: secretRow.algorithm,
            secretRotatedAt: deps.clock.now(),
            previousSecretCiphertext: prismaBytes(before.secretCiphertext),
            previousSecretNonce: prismaBytes(before.secretNonce),
            previousSecretAuthTag:
              before.secretAuthTag === null ? null : prismaBytes(before.secretAuthTag),
            previousSecretWrappedDataKey:
              before.secretWrappedDataKey === null
                ? null
                : prismaBytes(before.secretWrappedDataKey),
            previousSecretKeyVersion: before.keyVersion,
            previousSecretAadContext:
              before.secretAadContext === null || before.secretAadContext === undefined
                ? undefined
                : (before.secretAadContext as Record<string, string>),
            previousSecretEnvelopeVersion: before.secretEnvelopeVersion,
            previousSecretExpiresAt: overlapExpiresAt,
          },
          select: ENDPOINT_SELECT,
        });

        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'webhook_endpoint',
          targetId: endpointId,
          after: { secretRotated: true },
        });

        return { endpoint: toEndpointView(after), signingSecret };
      });
    },

    /** A test send is flagged so a receiver never treats one as real traffic. */
    async testDelivery(ctx: ActorContext, endpointId: string): Promise<WebhookDeliveryView> {
      return authorized(deps, ctx, 'webhook.write', undefined, async (db, actor) => {
        const endpoint = await db.webhookEndpoint.findFirst({
          where: { id: endpointId },
          select: ENDPOINT_SELECT,
        });
        if (endpoint === null) {
          throw notFound('webhook_endpoint', endpointId);
        }
        const payload = {
          schemaVersion: WEBHOOK_SCHEMA_VERSION,
          apiVersion: API_VERSION,
          isTest: true,
          workspaceId: ctx.workspaceId,
        };
        const created = await db.webhookDelivery.create({
          data: {
            workspaceId: actor.workspace.id,
            webhookEndpointId: endpointId,
            eventId: randomUuid(),
            eventType: 'connection.connected',
            state: 'pending',
            payloadHash: payloadHash(payload),
            payload: payload as Prisma.InputJsonValue,
            nextAttemptAt: deps.clock.now(),
          },
          select: DELIVERY_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'webhook_delivery',
          targetId: created.id,
          after: { isTest: true },
        });
        return toDeliveryView(created);
      });
    },

    async listDeliveries(
      ctx: ActorContext,
      input: PageQuery & { endpointId: string },
    ): Promise<Paginated<WebhookDeliveryView>> {
      return authorized(deps, ctx, 'webhook.read', undefined, async (db) => {
        const args = pageArgs(input);
        const rows = await db.webhookDelivery.findMany({
          where: { webhookEndpointId: input.endpointId },
          orderBy: { id: 'desc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: DELIVERY_SELECT,
        });
        return toPage(rows, args, (row) => row.id, toDeliveryView);
      });
    },

    async redeliver(ctx: ActorContext, deliveryId: string): Promise<WebhookDeliveryView> {
      return authorized(deps, ctx, 'webhook.write', undefined, async (db, actor) => {
        const existing = await db.webhookDelivery.findFirst({
          where: { id: deliveryId },
          select: DELIVERY_SELECT,
        });
        if (existing === null) {
          throw notFound('webhook_delivery', deliveryId);
        }
        // The event id is unchanged, so the receiver can deduplicate.
        const updated = await db.webhookDelivery.update({
          where: { id: deliveryId },
          data: {
            state: 'pending',
            nextAttemptAt: deps.clock.now(),
            attemptCount: existing.attemptCount + 1,
          },
          select: DELIVERY_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'webhook_delivery',
          targetId: deliveryId,
          after: { redelivered: true, attempt: updated.attemptCount },
        });
        // Same reason as `emit`: marking a row pending is not sending it.
        await deps.scheduler.scheduleWebhookDelivery?.({
          workspaceId: actor.workspace.id,
          deliveryId,
          workflowInput: {
            ctx: webhookWorkflowContext(
              actor.workspace.id,
              ctx.correlationId ?? existing.eventId,
            ),
            deliveryId,
            endpointId: existing.webhookEndpointId,
            eventName: existing.eventType as WebhookEventName,
            isRedelivery: true,
            maxAttempts: WEBHOOK_DELIVERY_MAX_ATTEMPTS,
          },
        });
        return toDeliveryView(updated);
      });
    },

    async emit(
      event: WebhookEventName,
      payload: Record<string, unknown>,
      options: {
        workspaceId: string;
        connectionId?: string | null;
        correlationId?: string | null;
        isTest?: boolean;
      },
    ): Promise<readonly WebhookDeliveryView[]> {
      const endpoints = await deps.prisma.webhookEndpoint.findMany({
        where: {
          workspaceId: options.workspaceId,
          state: 'active',
          subscribedEvents: { has: event },
        },
        select: { id: true, connectionScope: true },
      });

      const eventId = randomUuid();
      const hash = payloadHash({
        schemaVersion: WEBHOOK_SCHEMA_VERSION,
        apiVersion: API_VERSION,
        type: event,
        data: payload,
      });

      const body = {
        schemaVersion: WEBHOOK_SCHEMA_VERSION,
        apiVersion: API_VERSION,
        type: event,
        data: payload,
        ...(options.isTest === true ? { isTest: true } : {}),
      };

      const created: WebhookDeliveryView[] = [];
      for (const endpoint of endpoints) {
        // An empty connection scope means every connection in the workspace.
        if (
          endpoint.connectionScope.length > 0 &&
          options.connectionId !== undefined &&
          options.connectionId !== null &&
          !endpoint.connectionScope.includes(options.connectionId)
        ) {
          continue;
        }
        // `(webhookEndpointId, eventId)` is unique, so a redispatched outbox
        // row joins the delivery that already exists rather than sending the
        // same event to the same endpoint twice.
        const row = await deps.prisma.webhookDelivery.upsert({
          where: { webhookEndpointId_eventId: { webhookEndpointId: endpoint.id, eventId } },
          create: {
            workspaceId: options.workspaceId,
            webhookEndpointId: endpoint.id,
            eventId,
            eventType: event,
            state: 'pending',
            payloadHash: hash,
            payload: body as Prisma.InputJsonValue,
            nextAttemptAt: deps.clock.now(),
          },
          update: {},
          select: DELIVERY_SELECT,
        });
        created.push(toDeliveryView(row));

        // Creating the row is not sending it. Without this the delivery sat
        // pending forever, which is how outbound webhooks came to be recorded
        // and never delivered.
        await deps.scheduler.scheduleWebhookDelivery?.({
          workspaceId: options.workspaceId,
          deliveryId: row.id,
          workflowInput: {
            ctx: webhookWorkflowContext(options.workspaceId, options.correlationId ?? eventId),
            deliveryId: row.id,
            endpointId: endpoint.id,
            eventName: event,
            isRedelivery: false,
            maxAttempts: WEBHOOK_DELIVERY_MAX_ATTEMPTS,
          },
        });
      }
      return created;
    },
  };
}

function randomUuid(): string {
  return globalThis.crypto.randomUUID();
}
