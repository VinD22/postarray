import { createAiGatewayFromConfig } from '@relay/ai';
import {
  InMemoryScheduler,
  LocalFileStorage,
  LoggingMailer,
  MemoryKeyValueStore,
  createServices,
  systemClock,
  type AiGateway,
  type BillingGateway,
  type Clock,
  type ConnectorRegistry,
  type CredentialStorePort,
  type CredentialVaultPort,
  type DataExportEncryptionPort,
  type KeyValueStore,
  type MailerPort,
  type SchedulerPort,
  type Services,
  type StoragePort,
} from '@relay/application';
import {
  ACTIVE_CHANNEL_ALLOWANCE,
  HttpPolarClient,
  MEMBER_ALLOWANCE,
  createCheckoutSession,
  isKnownPolarEventType,
  polarSubscriptionSchema,
} from '@relay/billing';
import type { RelayConfig } from '@relay/config';
import { ERROR_CODES, RelayError, providerIdSchema, type ProviderId } from '@relay/contracts';
import {
  appendAuditEvent,
  createPrismaClient,
  withRlsContext,
  withWorkspaceContext,
  type DatabaseLogger,
  type Prisma,
  type RelayPrismaClient,
} from '@relay/database';
import type { Logger } from '@relay/observability';

import { NeonObjectStorage } from './neon-storage';
import { LocalDataExportEncryption } from './data-export-encryption';
import { AwsDataExportKmsClient, KmsDataExportEncryption } from './kms-data-export-encryption';
import { ResendMailer } from './resend-mailer';
import { TemporalScheduler } from './temporal-scheduler';
import { createVerifiedConnectorRegistry } from './verified-connectors';
import { createCredentialStore } from './credential-store';
import { createConfiguredCredentialVault } from './credential-vault';

const REQUIRED_PRODUCTION_ADAPTERS = ['kv'] as const;
type RequiredProductionAdapter = (typeof REQUIRED_PRODUCTION_ADAPTERS)[number];

class DatabaseBillingGateway implements BillingGateway {
  readonly #prisma: RelayPrismaClient;
  readonly #clock: Clock;
  readonly #config: RelayConfig;

  constructor(prisma: RelayPrismaClient, clock: Clock, config: RelayConfig) {
    this.#prisma = prisma;
    this.#clock = clock;
    this.#config = config;
  }

  #client(): HttpPolarClient {
    const polar = this.#config.polar;
    const configured =
      polar.checkoutEnabled &&
      polar.accessToken !== undefined &&
      polar.webhookSecret !== undefined &&
      polar.monthlyProductId !== undefined &&
      polar.annualProductId !== undefined;
    if (!configured) {
      throw new RelayError(ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED, {
        messageKey: 'billing.checkout.unavailable',
        details: { reason: 'commercial_configuration_incomplete' },
      });
    }
    if (this.#config.core.isProduction && polar.server !== 'production') {
      throw new RelayError(ERROR_CODES.INTERNAL, {
        messageKey: 'billing.checkout.unavailable',
        details: { reason: 'production_checkout_uses_sandbox' },
      });
    }
    return new HttpPolarClient({ accessToken: polar.accessToken, server: polar.server });
  }

  async checkEntitlement(input: {
    readonly workspaceId: string;
    readonly key: string;
    readonly requested?: number;
  }): Promise<{
    readonly allowed: boolean;
    readonly reasonKey: string | null;
    readonly limit: number | null;
    readonly used: number | null;
  }> {
    const entitlement = await withWorkspaceContext(
      this.#prisma,
      { workspaceId: input.workspaceId, role: 'service_role' },
      async (db) =>
        db.entitlement.findFirst({
          where: {
            key: input.key,
            effectiveFrom: { lte: this.#clock.now() },
            OR: [{ effectiveUntil: null }, { effectiveUntil: { gt: this.#clock.now() } }],
          },
          orderBy: { effectiveFrom: 'desc' },
          select: { kind: true, booleanValue: true, numericValue: true },
        }),
    );

    const enabled =
      entitlement !== null &&
      (entitlement.kind === 'boolean_flag'
        ? entitlement.booleanValue === true
        : entitlement.numericValue !== null);
    if (!enabled || entitlement === null) {
      return {
        allowed: false,
        reasonKey: 'errors.entitlement_missing',
        limit: entitlement?.numericValue ?? null,
        used: null,
      };
    }

    const limit = entitlement.numericValue;
    if (limit === null) {
      return { allowed: true, reasonKey: null, limit: null, used: null };
    }

    const periodStart = new Date(
      Date.UTC(this.#clock.now().getUTCFullYear(), this.#clock.now().getUTCMonth(), 1),
    );
    const usage = await withWorkspaceContext(
      this.#prisma,
      { workspaceId: input.workspaceId, role: 'service_role' },
      async (db) =>
        db.usageEvent.aggregate({
          where: { meterKey: input.key, occurredAt: { gte: periodStart } },
          _sum: { quantity: true },
        }),
    );
    const used = Number(usage._sum.quantity ?? 0);
    return {
      allowed: used + (input.requested ?? 1) <= limit,
      reasonKey: used + (input.requested ?? 1) <= limit ? null : 'errors.entitlement_limit',
      limit,
      used,
    };
  }

  async recordUsage(input: {
    readonly workspaceId: string;
    readonly key: string;
    readonly quantity: number;
    readonly idempotencyKey: string;
  }): Promise<void> {
    await withWorkspaceContext(
      this.#prisma,
      { workspaceId: input.workspaceId, role: 'service_role' },
      async (db) => {
        await db.usageEvent.upsert({
          where: {
            workspaceId_idempotencyKey: {
              workspaceId: input.workspaceId,
              idempotencyKey: input.idempotencyKey,
            },
          },
          create: {
            workspaceId: input.workspaceId,
            meterKey: input.key,
            quantity: input.quantity,
            unit: 'count',
            idempotencyKey: input.idempotencyKey,
            occurredAt: this.#clock.now(),
          },
          update: {},
        });
      },
    );
  }

  async getEntitlements(workspaceId: string) {
    return withWorkspaceContext(this.#prisma, { workspaceId, role: 'service_role' }, async (db) => {
      const [subscription, activeChannelCount, activeMemberCount] = await Promise.all([
        db.subscription.findFirst({
          orderBy: { updatedAt: 'desc' },
          include: { polarCustomer: { select: { portalUrl: true } } },
        }),
        db.socialConnection.count({ where: { status: { not: 'disconnected' } } }),
        db.membership.count({ where: { state: { in: ['invited', 'active'] } } }),
      ]);
      if (subscription === null) {
        return {
          status: 'none' as const,
          interval: null,
          trialEndsAt: null,
          firstChargeAt: null,
          firstChargeAmount: null,
          renewalAmount: null,
          portalUrl: null,
          activeChannelCount,
          channelLimit: ACTIVE_CHANNEL_ALLOWANCE,
          activeMemberCount,
          memberLimit: MEMBER_ALLOWANCE,
        };
      }
      const amount = { amountMinor: subscription.amountMinor, currency: subscription.currency };
      return {
        status: subscription.status,
        interval: subscription.interval === 'month' ? ('monthly' as const) : ('annual' as const),
        trialEndsAt: subscription.trialEndsAt?.toISOString() ?? null,
        firstChargeAt:
          subscription.status === 'trialing'
            ? (subscription.trialEndsAt?.toISOString() ?? null)
            : null,
        firstChargeAmount: subscription.status === 'trialing' ? amount : null,
        renewalAmount: amount,
        portalUrl: subscription.polarCustomer.portalUrl,
        activeChannelCount,
        channelLimit: ACTIVE_CHANNEL_ALLOWANCE,
        activeMemberCount,
        memberLimit: MEMBER_ALLOWANCE,
      };
    });
  }

  async getUsage(
    workspaceId: string,
    range?: { readonly from: string; readonly to: string; readonly ianaTimeZone: string },
  ) {
    const now = this.#clock.now();
    const periodStart =
      range === undefined
        ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
        : new Date(range.from);
    const periodEnd = range === undefined ? now : new Date(range.to);
    return withWorkspaceContext(this.#prisma, { workspaceId, role: 'service_role' }, async (db) => {
      const events = await db.usageEvent.findMany({
        where: { occurredAt: { gte: periodStart, lte: periodEnd } },
        orderBy: { occurredAt: 'asc' },
        select: {
          meterKey: true,
          quantity: true,
          costMinor: true,
          costCurrency: true,
          provider: true,
        },
      });
      const grouped = new Map<
        string,
        {
          provider: ProviderId | null;
          count: number;
          amountMinor: number;
          currency: string;
        }
      >();
      for (const event of events) {
        const parsedProvider = providerIdSchema.safeParse(event.provider);
        const key = `${event.provider ?? 'none'}:${event.meterKey}:${event.costCurrency ?? 'USD'}`;
        const current = grouped.get(key) ?? {
          provider: parsedProvider.success ? parsedProvider.data : null,
          count: 0,
          amountMinor: 0,
          currency: event.costCurrency ?? 'USD',
        };
        current.count += Number(event.quantity);
        current.amountMinor += event.costMinor ?? 0;
        grouped.set(key, current);
      }
      const lines = [...grouped.entries()].map(([key, value]) => {
        const operation = key.split(':')[1] ?? key;
        const unitMinor = value.count === 0 ? 0 : Math.round(value.amountMinor / value.count);
        return {
          provider: value.provider,
          operation,
          count: value.count,
          unitAmount: { amountMinor: unitMinor, currency: value.currency },
          amount: { amountMinor: value.amountMinor, currency: value.currency },
        };
      });
      return {
        periodStart: periodStart.toISOString(),
        total: {
          amountMinor: lines.reduce((sum, line) => sum + line.amount.amountMinor, 0),
          currency: 'USD',
        },
        lines,
      };
    });
  }

  async createCheckout(input: Parameters<BillingGateway['createCheckout']>[0]) {
    const customer = await withWorkspaceContext(
      this.#prisma,
      { workspaceId: input.workspaceId, role: 'service_role' },
      async (db) => {
        const [existing, actor] = await Promise.all([
          db.polarCustomer.findFirst({ select: { polarCustomerId: true } }),
          db.user.findFirst({ where: { id: input.actorId }, select: { email: true } }),
        ]);
        return { existingId: existing?.polarCustomerId, email: actor?.email };
      },
    );
    const session = await createCheckoutSession(
      { client: this.#client(), config: this.#config.polar, clock: this.#clock },
      {
        interval: input.interval === 'monthly' ? 'month' : 'year',
        workspaceId: input.workspaceId,
        actorId: input.actorId,
        successUrl: input.successUrl,
        locale: input.locale,
        idempotencyKey: input.idempotencyKey,
        ...(customer.email === undefined ? {} : { customerEmail: customer.email }),
        ...(customer.existingId === undefined ? {} : { customerId: customer.existingId }),
      },
    );
    await withRlsContext(
      this.#prisma,
      { workspaceId: input.workspaceId, role: 'service_role' },
      async (tx) => {
        await appendAuditEvent(tx, {
          workspaceId: input.workspaceId,
          actor: {
            type: input.actorType === 'oauth_app' ? 'oauth_client' : input.actorType,
            id: input.actorId,
          },
          surface: input.surface,
          action: 'billing.checkout_created',
          target: { type: 'polar_checkout' },
          metadata: {
            checkoutId: session.checkoutId,
            interval: session.interval,
            disclosureVersion: session.disclosure.version,
            disclosureChecksum: session.consent.checksum,
          },
          correlationId: input.correlationId,
        });
      },
    );
    return {
      checkoutId: session.checkoutId,
      checkoutUrl: session.checkoutUrl,
      grantsEntitlement: false as const,
    };
  }

  async createPortalLink(input: { readonly workspaceId: string; readonly returnUrl: string }) {
    const customer = await withWorkspaceContext(
      this.#prisma,
      { workspaceId: input.workspaceId, role: 'service_role' },
      async (db) => db.polarCustomer.findFirst({ select: { id: true, polarCustomerId: true } }),
    );
    if (customer === null) {
      throw new RelayError(ERROR_CODES.PAYMENT_REQUIRED, {
        messageKey: 'billing.subscription.status.none',
      });
    }
    const session = await this.#client().createCustomerPortalSession({
      customerId: customer.polarCustomerId,
    });
    await withWorkspaceContext(
      this.#prisma,
      { workspaceId: input.workspaceId, role: 'service_role' },
      async (db) => {
        await db.polarCustomer.update({
          where: { id: customer.id },
          data: { portalUrl: session.customerPortalUrl },
        });
      },
    );
    return { portalUrl: session.customerPortalUrl };
  }

  async handleProviderWebhook(input: {
    readonly eventId: string;
    readonly eventType: string;
    readonly bodyHash: string;
    readonly payload: Readonly<Record<string, unknown>>;
  }) {
    return withRlsContext(this.#prisma, { role: 'service_role' }, async (tx) => {
      const previous = await tx.billingWebhookInbox.findUnique({
        where: { provider_eventId: { provider: 'polar', eventId: input.eventId } },
        select: { id: true },
      });
      if (previous !== null) {
        return { processed: false, duplicate: true };
      }
      const inbox = await tx.billingWebhookInbox.create({
        data: {
          eventId: input.eventId,
          eventType: input.eventType,
          signatureValid: true,
          bodyHash: input.bodyHash,
          payload: toJsonValue(input.payload),
          state: 'verified',
        },
        select: { id: true },
      });

      if (!isKnownPolarEventType(input.eventType) || !input.eventType.startsWith('subscription.')) {
        await tx.billingWebhookInbox.update({
          where: { id: inbox.id },
          data: {
            state: 'processed',
            processedAt: this.#clock.now(),
            ...(!isKnownPolarEventType(input.eventType)
              ? { processingError: 'unknown_event_type' }
              : {}),
          },
        });
        return { processed: true, duplicate: false };
      }

      const parsed = polarSubscriptionSchema.safeParse(input.payload);
      const workspaceId = parsed.success ? parsed.data.metadata.workspaceId : undefined;
      if (!parsed.success || workspaceId === undefined) {
        await tx.billingWebhookInbox.update({
          where: { id: inbox.id },
          data: {
            state: 'rejected',
            processedAt: this.#clock.now(),
            processingError: parsed.success ? 'workspace_not_identified' : 'payload_invalid',
          },
        });
        return { processed: false, duplicate: false };
      }

      const subscription = parsed.data;
      const workspace = await tx.workspace.findUnique({
        where: { id: workspaceId },
        select: { ownerUserId: true },
      });
      if (workspace === null) {
        await tx.billingWebhookInbox.update({
          where: { id: inbox.id },
          data: {
            state: 'rejected',
            processedAt: this.#clock.now(),
            processingError: 'workspace_missing',
          },
        });
        return { processed: false, duplicate: false };
      }
      const owner = await tx.user.findUnique({
        where: { id: workspace.ownerUserId },
        select: { email: true },
      });
      if (owner === null) {
        await tx.billingWebhookInbox.update({
          where: { id: inbox.id },
          data: {
            state: 'rejected',
            processedAt: this.#clock.now(),
            processingError: 'owner_missing',
          },
        });
        return { processed: false, duplicate: false };
      }
      const customer = await tx.polarCustomer.upsert({
        where: { workspaceId },
        create: {
          workspaceId,
          polarCustomerId: subscription.customerId,
          billingEmail: owner.email,
        },
        update: { polarCustomerId: subscription.customerId },
        select: { id: true },
      });
      const existing = await tx.subscription.findUnique({
        where: { polarSubscriptionId: subscription.id },
        select: { pastDueSince: true, updatedAt: true },
      });
      const pastDueSince =
        subscription.status === 'past_due'
          ? (existing?.pastDueSince ?? new Date(subscription.modifiedAt))
          : null;
      const stored = await tx.subscription.upsert({
        where: { polarSubscriptionId: subscription.id },
        create: {
          workspaceId,
          polarCustomerId: customer.id,
          polarSubscriptionId: subscription.id,
          polarProductId: subscription.productId,
          status: subscription.status,
          interval: subscription.interval,
          amountMinor: subscription.amountMinor,
          currency: subscription.currency,
          trialStartsAt:
            subscription.trialStart === null ? null : new Date(subscription.trialStart),
          trialEndsAt: subscription.trialEnd === null ? null : new Date(subscription.trialEnd),
          currentPeriodStart: new Date(subscription.currentPeriodStart),
          currentPeriodEnd:
            subscription.currentPeriodEnd === null ? null : new Date(subscription.currentPeriodEnd),
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          canceledAt: subscription.canceledAt === null ? null : new Date(subscription.canceledAt),
          pastDueSince,
          lastReconciledAt: this.#clock.now(),
        },
        update: {
          polarCustomerId: customer.id,
          polarProductId: subscription.productId,
          status: subscription.status,
          interval: subscription.interval,
          amountMinor: subscription.amountMinor,
          currency: subscription.currency,
          trialStartsAt:
            subscription.trialStart === null ? null : new Date(subscription.trialStart),
          trialEndsAt: subscription.trialEnd === null ? null : new Date(subscription.trialEnd),
          currentPeriodStart: new Date(subscription.currentPeriodStart),
          currentPeriodEnd:
            subscription.currentPeriodEnd === null ? null : new Date(subscription.currentPeriodEnd),
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          canceledAt: subscription.canceledAt === null ? null : new Date(subscription.canceledAt),
          pastDueSince,
          lastReconciledAt: this.#clock.now(),
        },
        select: { id: true },
      });
      const graceEndsAt =
        pastDueSince === null ? null : new Date(pastDueSince.getTime() + 7 * 24 * 60 * 60 * 1000);
      const periodEnd =
        subscription.currentPeriodEnd === null ? null : new Date(subscription.currentPeriodEnd);
      const enabled =
        subscription.status === 'active' ||
        subscription.status === 'trialing' ||
        (subscription.status === 'past_due' &&
          graceEndsAt !== null &&
          graceEndsAt > this.#clock.now()) ||
        (subscription.status === 'canceled' && periodEnd !== null && periodEnd > this.#clock.now());
      const effectiveUntil = enabled ? null : this.#clock.now();
      const entitlements = [
        {
          key: 'channels.active.max',
          kind: 'numeric_limit' as const,
          numericValue: ACTIVE_CHANNEL_ALLOWANCE,
        },
        { key: 'team.members.max', kind: 'numeric_limit' as const, numericValue: MEMBER_ALLOWANCE },
        { key: 'publishing.enabled', kind: 'boolean_flag' as const, booleanValue: enabled },
        { key: 'api.enabled', kind: 'boolean_flag' as const, booleanValue: enabled },
        { key: 'mcp.enabled', kind: 'boolean_flag' as const, booleanValue: enabled },
        { key: 'ai.text.enabled', kind: 'boolean_flag' as const, booleanValue: enabled },
      ];
      for (const entitlement of entitlements) {
        await tx.entitlement.upsert({
          where: { workspaceId_key: { workspaceId, key: entitlement.key } },
          create: {
            workspaceId,
            subscriptionId: stored.id,
            key: entitlement.key,
            kind: entitlement.kind,
            numericValue: 'numericValue' in entitlement ? entitlement.numericValue : null,
            booleanValue: 'booleanValue' in entitlement ? entitlement.booleanValue : null,
            source: 'polar_webhook',
            effectiveUntil,
          },
          update: {
            subscriptionId: stored.id,
            kind: entitlement.kind,
            numericValue: 'numericValue' in entitlement ? entitlement.numericValue : null,
            booleanValue: 'booleanValue' in entitlement ? entitlement.booleanValue : null,
            source: 'polar_webhook',
            effectiveFrom: this.#clock.now(),
            effectiveUntil,
          },
        });
      }
      await tx.billingWebhookInbox.update({
        where: { id: inbox.id },
        data: { state: 'processed', processedAt: this.#clock.now() },
      });
      return { processed: true, duplicate: false };
    });
  }
}

function aiAdapter(config: RelayConfig, logger: Logger, clock: Clock): AiGateway {
  const gateway = createAiGatewayFromConfig({ config, logger, clock });
  return {
    isAvailable: () => gateway.status().availability === 'ready',
  };
}

function databaseLogger(logger: Logger): DatabaseLogger {
  return {
    debug: (message, fields) => logger.debug(fields, message),
    info: (message, fields) => logger.info(fields, message),
    warn: (message, fields) => logger.warn(fields, message),
    error: (message, fields) => logger.error(fields, message),
  };
}

/** Keep provider evidence JSON-safe without casting an external payload. */
function toJsonValue(value: Readonly<Record<string, unknown>>): Prisma.InputJsonObject {
  const output: Record<string, Prisma.InputJsonValue | null> = {};
  for (const [key, entry] of Object.entries(value)) {
    const normalized = toJsonEntry(entry);
    if (normalized !== undefined) {
      output[key] = normalized;
    }
  }
  return output;
}

function toJsonEntry(value: unknown): Prisma.InputJsonValue | null | undefined {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (Array.isArray(value)) {
    return value.map((entry) => toJsonEntry(entry) ?? null);
  }
  if (typeof value === 'object') {
    const output: Record<string, Prisma.InputJsonValue | null> = {};
    for (const [key, entry] of Object.entries(value)) {
      const normalized = toJsonEntry(entry);
      if (normalized !== undefined) {
        output[key] = normalized;
      }
    }
    return output;
  }
  return undefined;
}

function missingProductionAdapters(
  overrides: RuntimeAdapterOverrides,
): readonly RequiredProductionAdapter[] {
  return REQUIRED_PRODUCTION_ADAPTERS.filter((name) => overrides[name] === undefined);
}

function localStorage(config: RelayConfig, clock: Clock): StoragePort {
  const apiUrl = config.core.apiUrl;
  if (apiUrl === undefined) {
    throw new RelayError(ERROR_CODES.INTERNAL, {
      details: { reason: 'api_url_required_for_local_storage' },
    });
  }
  return new LocalFileStorage({
    rootDirectory: '.relay-media',
    uploadBaseUrl: `${apiUrl}/v1/media/uploads`,
    downloadBaseUrl: `${apiUrl}/v1/media/objects`,
    clock,
  });
}

function hasConfiguredStorage(config: RelayConfig): boolean {
  const storage = config.neon;
  return !(
    storage.storageEndpoint === undefined ||
    storage.storageAccessKeyId === undefined ||
    storage.storageSecretAccessKey === undefined
  );
}

function configuredStorage(config: RelayConfig, clock: Clock): StoragePort | null {
  const storage = config.neon;
  if (
    storage.storageEndpoint === undefined ||
    storage.storageAccessKeyId === undefined ||
    storage.storageSecretAccessKey === undefined
  ) {
    return null;
  }
  return new NeonObjectStorage({
    endpoint: storage.storageEndpoint,
    region: storage.storageRegion,
    bucket: storage.storageBucket,
    accessKeyId: storage.storageAccessKeyId,
    secretAccessKey: storage.storageSecretAccessKey,
    clock,
  });
}

function configuredDataExportEncryption(config: RelayConfig): DataExportEncryptionPort | null {
  if (config.encryption.kmsKeyId !== undefined) {
    return new KmsDataExportEncryption({
      keyId: config.encryption.kmsKeyId,
      client: new AwsDataExportKmsClient({ region: config.encryption.kmsRegion }),
    });
  }
  return config.encryption.localKey === undefined
    ? null
    : new LocalDataExportEncryption(config.encryption.localKey);
}

function hasConfiguredDataExportEncryption(config: RelayConfig): boolean {
  return config.encryption.kmsKeyId !== undefined || config.encryption.localKey !== undefined;
}

function configuredMailer(config: RelayConfig, logger: Logger): MailerPort | null {
  if (config.email.apiKey === undefined || config.email.from === undefined) {
    return null;
  }
  return new ResendMailer({
    apiUrl: config.email.apiUrl,
    apiKey: config.email.apiKey,
    from: config.email.from,
    logger,
  });
}

function configuredScheduler(
  config: RelayConfig,
  logger: Logger,
  clock: Clock,
): SchedulerPort | null {
  if (config.temporal.address === undefined) {
    return null;
  }
  return new TemporalScheduler({
    address: config.temporal.address,
    namespace: config.temporal.namespace,
    taskQueue: config.temporal.taskQueue,
    clock,
    logger,
    ...(config.temporal.apiKey === undefined ? {} : { apiKey: config.temporal.apiKey }),
  });
}

export interface RuntimeAdapterOverrides {
  readonly prisma?: RelayPrismaClient;
  readonly kv?: KeyValueStore;
  readonly connectors?: ConnectorRegistry;
  readonly credentialVault?: CredentialVaultPort;
  readonly credentialStore?: CredentialStorePort;
  readonly ai?: AiGateway;
  readonly billing?: BillingGateway;
  readonly scheduler?: SchedulerPort;
  readonly storage?: StoragePort;
  readonly exportEncryption?: DataExportEncryptionPort;
  readonly mailer?: MailerPort;
}

export interface ApplicationRuntimeOptions {
  readonly config: RelayConfig;
  readonly logger: Logger;
  readonly clock?: Clock;
  readonly adapters?: RuntimeAdapterOverrides;
}

export interface ApplicationRuntime {
  readonly services: Services;
  readonly prisma: RelayPrismaClient;
  close(): Promise<void>;
}

/** Build the canonical application graph and truthfully own its lifecycle. */
export function createApplicationRuntime(options: ApplicationRuntimeOptions): ApplicationRuntime {
  const clock = options.clock ?? systemClock;
  const adapters = options.adapters ?? {};

  if (options.config.core.isProduction) {
    const missing = missingProductionAdapters(adapters);
    const storageMissing = adapters.storage === undefined && !hasConfiguredStorage(options.config);
    const schedulerMissing =
      adapters.scheduler === undefined && options.config.temporal.address === undefined;
    const mailerMissing =
      adapters.mailer === undefined &&
      (options.config.email.apiKey === undefined || options.config.email.from === undefined);
    const exportEncryptionMissing =
      adapters.exportEncryption === undefined && !hasConfiguredDataExportEncryption(options.config);
    if (
      missing.length > 0 ||
      storageMissing ||
      schedulerMissing ||
      mailerMissing ||
      exportEncryptionMissing
    ) {
      throw new RelayError(ERROR_CODES.INTERNAL, {
        details: {
          reason: 'production_adapters_missing',
          adapters: [
            ...missing,
            ...(storageMissing ? ['storage'] : []),
            ...(schedulerMissing ? ['scheduler'] : []),
            ...(mailerMissing ? ['mailer'] : []),
            ...(exportEncryptionMissing ? ['exportEncryption'] : []),
          ],
        },
      });
    }
  }

  const ownsPrisma = adapters.prisma === undefined;
  const prisma =
    adapters.prisma ??
    createPrismaClient({
      logger: databaseLogger(options.logger),
      ...(options.config.database.url === undefined
        ? {}
        : { databaseUrl: options.config.database.url }),
    });
  const kv = adapters.kv ?? new MemoryKeyValueStore(clock);
  const scheduler =
    adapters.scheduler ??
    configuredScheduler(options.config, options.logger, clock) ??
    new InMemoryScheduler(clock);
  const storage =
    adapters.storage ??
    configuredStorage(options.config, clock) ??
    localStorage(options.config, clock);
  const exportEncryption =
    adapters.exportEncryption ?? configuredDataExportEncryption(options.config);
  const mailer =
    adapters.mailer ??
    configuredMailer(options.config, options.logger) ??
    new LoggingMailer(options.logger);
  const configuredVault =
    adapters.credentialVault === undefined
      ? createConfiguredCredentialVault({
          config: options.config,
          logger: options.logger,
          clock,
        })
      : null;
  const credentialVault = adapters.credentialVault ?? configuredVault?.vault;
  const credentialStore = adapters.credentialStore ?? createCredentialStore(prisma);

  const services = createServices({
    prisma,
    kv,
    connectors:
      adapters.connectors ??
      createVerifiedConnectorRegistry({ config: options.config, logger: options.logger, clock }),
    ...(credentialVault === undefined ? {} : { credentialVault }),
    ...(credentialStore === undefined ? {} : { credentialStore }),
    ai: adapters.ai ?? aiAdapter(options.config, options.logger, clock),
    billing: adapters.billing ?? new DatabaseBillingGateway(prisma, clock, options.config),
    scheduler,
    storage,
    exportEncryption: exportEncryption ?? undefined,
    mailer,
    logger: options.logger,
    clock,
    config: options.config,
  });

  return {
    services,
    prisma,
    async close(): Promise<void> {
      await kv.close();
      if (storage instanceof NeonObjectStorage) {
        storage.close();
      }
      if (scheduler instanceof TemporalScheduler) {
        await scheduler.close();
      }
      if (exportEncryption instanceof KmsDataExportEncryption) {
        exportEncryption.close();
      }
      configuredVault?.close();
      if (ownsPrisma) {
        await prisma.$disconnect();
      }
    },
  };
}
