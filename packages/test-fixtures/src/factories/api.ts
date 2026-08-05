import {
  API_VERSION,
  DEFAULT_PAGE_SIZE,
  WEBHOOK_SCHEMA_VERSION,
  operationRefSchema,
  validationIssue,
  validationResult,
  webhookEndpointSchema,
  webhookEnvelopeSchema,
} from '@relay/contracts';
import type {
  OperationRef,
  Paginated,
  ValidationIssue,
  ValidationResult,
  WebhookEndpoint,
  WebhookEnvelope,
  WebhookEventName,
} from '@relay/contracts';

import { FIXTURE_NOW, fixtureId, fixtureUrl } from '../ids.js';

/** REST and webhook envelope fixtures. */

export function makePage<T>(items: readonly T[], limit = DEFAULT_PAGE_SIZE): Paginated<T> {
  return {
    data: [...items],
    pageInfo: { nextCursor: null, hasMore: false, limit },
  };
}

export function makePageWithMore<T>(
  items: readonly T[],
  cursor = 'fixture-cursor-2',
  limit = DEFAULT_PAGE_SIZE,
): Paginated<T> {
  return { data: [...items], pageInfo: { nextCursor: cursor, hasMore: true, limit } };
}

export function makeOperationRef(overrides: Partial<OperationRef> = {}): OperationRef {
  return operationRefSchema.parse({
    operationId: fixtureId('operation', 'fixture-operation'),
    status: 'queued',
    resourceType: null,
    resourceId: null,
    createdAt: FIXTURE_NOW,
    completedAt: null,
    error: null,
    ...overrides,
  });
}

export interface MakeWebhookEnvelopeInput extends Partial<WebhookEnvelope> {
  readonly seed?: string;
}

export function makeWebhookEnvelope(input: MakeWebhookEnvelopeInput = {}): WebhookEnvelope {
  const { seed: seedOverride, ...overrides } = input;
  const seed = seedOverride ?? 'fixture-delivery';
  return webhookEnvelopeSchema.parse({
    id: fixtureId('webhookDelivery', seed),
    type: 'post.published',
    schemaVersion: WEBHOOK_SCHEMA_VERSION,
    apiVersion: API_VERSION,
    workspaceId: overrides.workspaceId ?? fixtureId('workspace', 'fixture-workspace'),
    createdAt: FIXTURE_NOW,
    deliveryAttempt: 1,
    isRedelivery: false,
    isTest: false,
    correlationId: 'fixture-correlation-0001',
    data: { receiptId: fixtureId('receipt', 'x-receipt') },
    ...overrides,
  });
}

export function makeWebhookEndpoint(overrides: Partial<WebhookEndpoint> = {}): WebhookEndpoint {
  const events: readonly WebhookEventName[] = overrides.events ?? ['post.published', 'post.failed'];
  return webhookEndpointSchema.parse({
    id: fixtureId('webhookEndpoint', 'fixture-endpoint'),
    workspaceId: fixtureId('workspace', 'fixture-workspace'),
    url: fixtureUrl('/hooks/relay'),
    events,
    connectionIds: [],
    enabled: true,
    signingSecretVersion: 1,
    createdAt: FIXTURE_NOW,
    lastSuccessAt: null,
    lastFailureAt: null,
    consecutiveFailures: 0,
    ...overrides,
  });
}

export function makeValidationIssue(
  overrides: Partial<ValidationIssue> & { code?: string } = {},
): ValidationIssue {
  return validationIssue({
    code: overrides.code ?? 'TEXT_TOO_LONG',
    severity: overrides.severity ?? 'error',
    ...(overrides.field === undefined ? {} : { field: overrides.field }),
    ...(overrides.targetId === undefined ? {} : { targetId: overrides.targetId }),
    ...(overrides.messageKey === undefined ? {} : { messageKey: overrides.messageKey }),
    params: overrides.params ?? { limit: 280, actual: 312 },
    ...(overrides.remediationKey === undefined ? {} : { remediationKey: overrides.remediationKey }),
  });
}

/** A passing result with a cost estimate attached. */
export function makeValidationResult(
  issues: readonly ValidationIssue[] = [],
  estimatedCostMinor?: number,
): ValidationResult {
  return validationResult({
    issues,
    ...(estimatedCostMinor === undefined ? {} : { estimatedCostMinor, currency: 'USD' }),
  });
}

/** A failing result with one error and one warning, on the same target. */
export function makeFailingValidationResult(targetId?: string): ValidationResult {
  const target = targetId ?? fixtureId('postVariant', 'x-variant');
  return validationResult({
    issues: [
      makeValidationIssue({ targetId: target, field: 'body' }),
      makeValidationIssue({
        code: 'ALT_TEXT_MISSING',
        severity: 'warning',
        targetId: target,
        field: 'mediaIds.0',
        params: {},
      }),
    ],
  });
}
