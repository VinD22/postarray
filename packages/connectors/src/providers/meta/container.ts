import { REMEDIATION, providerFailure, type PublishStatus } from '../shared/contract-shape.js';
import { errorSummary } from '../shared/access.js';
import { metaContainerStatusSchema, type MetaClient, type MetaSurface } from './graph.js';

/**
 * The Meta container lifecycle, shared by Instagram and Threads.
 *
 * The correctness rules that this module exists to enforce:
 *
 * - A successful container creation is **not** a publish. The state at that point is
 *   provider processing and the UI says so.
 * - The publish step is the only step that produces an external post id.
 * - A retry reuses the stored container id. It never creates a second container.
 * - We never republish a container. If the worker crashed after publish, `getStatus` plus a
 *   recent media query recovers the external id.
 */

export const CONTAINER_TERMINAL_STATUSES = ['FINISHED', 'PUBLISHED'] as const;

export interface ContainerStatusResult {
  readonly ready: boolean;
  readonly failed: boolean;
  readonly statusCode: string;
  readonly errorMessage: string | null;
}

/** Read a container's status. One call, no polling loop: polling is the worker's job. */
export async function readContainerStatus(
  client: MetaClient,
  accessToken: string,
  containerId: string,
  operation: string,
): Promise<ContainerStatusResult> {
  const response = await client.get({
    path: `/${containerId}`,
    accessToken,
    query: { fields: 'id,status_code,status' },
    operation,
  });
  const parsed = client.parse(metaContainerStatusSchema, response, operation);
  const statusCode = parsed.status_code ?? 'IN_PROGRESS';
  return {
    ready: (CONTAINER_TERMINAL_STATUSES as readonly string[]).includes(statusCode),
    failed: statusCode === 'ERROR' || statusCode === 'EXPIRED',
    statusCode,
    errorMessage: parsed.error_message ?? parsed.status ?? null,
  };
}

/**
 * Translate a container status into a `PublishStatus`. A container that is still building
 * is `processing`, never `published`, because there is no external post id yet.
 */
export function containerStatusToPublishStatus(
  status: ContainerStatusResult,
  surface: MetaSurface,
): PublishStatus {
  if (status.failed) {
    const expired = status.statusCode === 'EXPIRED';
    return {
      state: 'failed',
      externalPostId: null,
      permalink: null,
      publishedAt: null,
      items: [],
      error: errorSummary({
        errorClass: expired ? 'TRANSIENT_PROVIDER' : 'PERMANENT_PROVIDER',
        remediationCode: expired
          ? REMEDIATION.providerRateLimited
          : REMEDIATION.providerRejectedContent,
        messageKey: expired
          ? 'error.provider_rate_limited.message'
          : 'error.provider_content_rejected.message',
        retryable: expired,
        providerMessage: status.errorMessage === null ? null : status.errorMessage.slice(0, 300),
      }),
      pollAfterSeconds: null,
      sanitizedResponse: {
        surface,
        statusCode: status.statusCode,
        ...(status.errorMessage === null ? {} : { providerMessage: status.errorMessage.slice(0, 300) }),
      },
    };
  }
  return {
    state: 'processing',
    externalPostId: null,
    permalink: null,
    publishedAt: null,
    items: [],
    error: null,
    pollAfterSeconds: 5,
    sanitizedResponse: { surface, statusCode: status.statusCode },
  };
}

/** Fail loudly when a container is not usable, rather than publishing something broken. */
export function assertContainerReady(
  status: ContainerStatusResult,
  surface: MetaSurface,
  operation: string,
): void {
  if (status.ready) {
    return;
  }
  throw providerFailure({
    provider: surface,
    operation,
    remediationCode: status.failed
      ? REMEDIATION.providerRejectedContent
      : REMEDIATION.providerRateLimited,
    details: {
      statusCode: status.statusCode,
      ...(status.errorMessage === null ? {} : { providerMessage: status.errorMessage.slice(0, 300) }),
    },
  });
}
