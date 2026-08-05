import { publicationReceiptSchema, publishAttemptSchema, publishJobSchema } from '@relay/contracts';
import type {
  ProviderId,
  PublicationReceipt,
  PublishAttempt,
  PublishJob,
  ReceiptItem,
} from '@relay/contracts';

import { FIXTURE_NOW, fakeExternalId, fixtureChecksum, fixtureId, fixtureUrl } from '../ids.js';
import { makeCapabilitySnapshot } from './capabilities.js';
import { makeConnection } from './connection.js';

/**
 * Publish jobs, attempts and publication receipts.
 *
 * A receipt is immutable evidence that something appeared on a platform. These
 * fixtures therefore always carry an external post id, the content version
 * checksum, the capability version in force and the approval that authorised
 * it, because a receipt without those cannot prove anything.
 */

export interface MakeJobInput extends Partial<PublishJob> {
  readonly provider?: ProviderId;
  readonly seed?: string;
}

export function makeJob(input: MakeJobInput = {}): PublishJob {
  const { seed: seedOverride, provider: providerOverride, ...overrides } = input;
  const provider = providerOverride ?? 'x';
  const seed = seedOverride ?? `${provider}-job`;
  const connection = makeConnection({ provider });
  const snapshot = makeCapabilitySnapshot({ provider, connectionId: connection.id });
  const jobId = fixtureId('publishJob', seed);
  return publishJobSchema.parse({
    id: jobId,
    workspaceId: overrides.workspaceId ?? connection.workspaceId,
    contentItemId: overrides.contentItemId ?? fixtureId('contentItem', 'fixture-draft'),
    contentVersionId: overrides.contentVersionId ?? fixtureId('contentVersion', 'fixture-draft:1'),
    postVariantId: overrides.postVariantId ?? fixtureId('postVariant', `${provider}-variant`),
    connectionId: connection.id,
    provider,
    state: 'scheduled',
    scheduledInstant: '2026-08-05T09:00:00.000Z',
    scheduledLocalTime: '2026-08-05T11:00',
    ianaTimeZone: 'Europe/Berlin',
    idempotencyKey: `fixture-${seed}-0001`,
    temporalWorkflowId: `publish-${jobId}`,
    approvalRequired: false,
    approvalState: 'not_required',
    capabilityVersion: snapshot.capabilityVersion,
    createdVia: 'web',
    attemptCount: 0,
    lastErrorCode: null,
    createdAt: FIXTURE_NOW,
    updatedAt: FIXTURE_NOW,
    canceledAt: null,
    ...overrides,
  });
}

/** A job that needs an approval and has one. */
export function makeApprovedJob(input: MakeJobInput = {}): PublishJob {
  return makeJob({
    seed: 'approved-job',
    approvalRequired: true,
    approvalState: 'approved',
    state: 'approved',
    ...input,
  });
}

/** A job blocked on a human decision. It must never reach dispatch. */
export function makePendingApprovalJob(input: MakeJobInput = {}): PublishJob {
  return makeJob({
    seed: 'pending-approval-job',
    approvalRequired: true,
    approvalState: 'requested',
    state: 'approval_requested',
    ...input,
  });
}

export interface MakeAttemptInput extends Partial<PublishAttempt> {
  readonly seed?: string;
}

export function makeAttempt(input: MakeAttemptInput = {}): PublishAttempt {
  const { seed: seedOverride, ...overrides } = input;
  const seed = seedOverride ?? 'fixture-attempt';
  return publishAttemptSchema.parse({
    id: fixtureId('publishAttempt', seed),
    publishJobId: overrides.publishJobId ?? fixtureId('publishJob', 'x-job'),
    attemptNumber: 1,
    startedAt: '2026-08-05T09:00:00.000Z',
    finishedAt: '2026-08-05T09:00:02.000Z',
    resultState: 'published',
    errorClass: null,
    errorCode: null,
    retryable: false,
    nextRetryAt: null,
    providerRequestId: fakeExternalId('request', seed),
    httpStatus: 201,
    sanitizedResponse: { accepted: true },
    ...overrides,
  });
}

/** A failed attempt that will be retried, with the retry instant recorded. */
export function makeRetryableAttempt(input: MakeAttemptInput = {}): PublishAttempt {
  return makeAttempt({
    seed: 'fixture-attempt-retry',
    attemptNumber: 1,
    resultState: 'retry_scheduled',
    errorClass: 'transient_provider',
    errorCode: 'RATE_LIMITED',
    retryable: true,
    nextRetryAt: '2026-08-05T09:15:00.000Z',
    httpStatus: 429,
    sanitizedResponse: { retryAfterSeconds: 900 },
    ...input,
  });
}

export function makeReceiptItem(overrides: Partial<ReceiptItem> = {}): ReceiptItem {
  return {
    kind: 'comment',
    order: 0,
    threadItemId: fixtureId('comment', 'thread-item-0'),
    state: 'published',
    externalPostId: fakeExternalId('x', 'comment-0'),
    permalink: fixtureUrl('/p/fixture-comment-0'),
    delaySeconds: 300,
    publishedAt: '2026-08-05T09:05:00.000Z',
    errorCode: null,
    ...overrides,
  };
}

export interface MakeReceiptInput extends Partial<PublicationReceipt> {
  readonly provider?: ProviderId;
  readonly seed?: string;
}

/** A receipt for a single successful publication. */
export function makeReceipt(input: MakeReceiptInput = {}): PublicationReceipt {
  const { seed: seedOverride, provider: providerOverride, ...overrides } = input;
  const provider = providerOverride ?? 'x';
  const seed = seedOverride ?? `${provider}-receipt`;
  const connection = makeConnection({ provider });
  const snapshot = makeCapabilitySnapshot({ provider, connectionId: connection.id });
  const externalPostId = fakeExternalId(provider, seed);
  return publicationReceiptSchema.parse({
    id: fixtureId('receipt', seed),
    workspaceId: overrides.workspaceId ?? connection.workspaceId,
    publishJobId: overrides.publishJobId ?? fixtureId('publishJob', `${provider}-job`),
    provider,
    accountType: snapshot.accountType,
    connectionId: connection.id,
    externalAccountId: connection.externalAccountId,
    externalPostId,
    permalink: fixtureUrl(`/p/${externalPostId}`),
    contentVersionId: overrides.contentVersionId ?? fixtureId('contentVersion', 'fixture-draft:1'),
    contentVersionChecksum: fixtureChecksum(`${provider}:content-version`),
    capabilityVersion: snapshot.capabilityVersion,
    scheduledLocalTime: '2026-08-05T11:00',
    ianaTimeZone: 'Europe/Berlin',
    scheduledInstant: '2026-08-05T09:00:00.000Z',
    dispatchedAt: '2026-08-05T09:00:00.500Z',
    publishedAt: '2026-08-05T09:00:02.000Z',
    creationSurface: 'web',
    approval: {
      state: 'not_required',
      approvalId: null,
      decidedBy: null,
      decidedAt: null,
      policyKey: null,
    },
    cost:
      snapshot.cost === null
        ? null
        : {
            currency: snapshot.cost.currency,
            estimatedMinor: snapshot.cost.perCreateMinor,
            actualMinor: snapshot.cost.perCreateMinor,
            reconciledAt: '2026-08-06T03:00:00.000Z',
          },
    attempts: [makeAttempt({ publishJobId: fixtureId('publishJob', `${provider}-job`) })],
    sanitizedProviderResponse: { id: externalPostId },
    root: {
      kind: 'root',
      order: 0,
      threadItemId: null,
      state: 'published',
      externalPostId,
      permalink: fixtureUrl(`/p/${externalPostId}`),
      delaySeconds: 0,
      publishedAt: '2026-08-05T09:00:02.000Z',
      errorCode: null,
    },
    items: [],
    lastAnalyticsSyncAt: null,
    createdAt: '2026-08-05T09:00:02.000Z',
    ...overrides,
  });
}

/**
 * A receipt where the root post published and the first comment did not. The
 * campaign is `partially_published`; the root is never rolled back.
 */
export function makePartialReceipt(input: MakeReceiptInput = {}): PublicationReceipt {
  return makeReceipt({
    seed: 'x-receipt-partial',
    items: [
      makeReceiptItem({
        state: 'failed_permanently',
        externalPostId: null,
        permalink: null,
        publishedAt: null,
        errorCode: 'CONTENT_INVALID',
      }),
    ],
    ...input,
  });
}

/** A receipt whose thread published in full, in order. */
export function makeThreadReceipt(input: MakeReceiptInput = {}): PublicationReceipt {
  return makeReceipt({
    seed: 'x-receipt-thread',
    items: [
      makeReceiptItem({
        kind: 'thread',
        order: 0,
        threadItemId: fixtureId('comment', 'thread-item-0'),
        externalPostId: fakeExternalId('x', 'thread-0'),
        delaySeconds: 0,
      }),
      makeReceiptItem({
        kind: 'thread',
        order: 1,
        threadItemId: fixtureId('comment', 'thread-item-1'),
        externalPostId: fakeExternalId('x', 'thread-1'),
        delaySeconds: 0,
        publishedAt: '2026-08-05T09:00:04.000Z',
      }),
    ],
    ...input,
  });
}
