import type { ProviderId } from '@relay/contracts';

import { BaseProviderSimulator } from './engine.js';
import { RETRY_AFTER_SECONDS } from './types.js';
import type { FailureKind, SimulatedRequest, SimulatedResponse } from './types.js';

/**
 * LinkedIn.
 *
 * Mirrors the versioned REST surface: a successful `POST /rest/posts` returns
 * `201` with an empty body and the new URN in the `x-restli-id` header, which
 * is the detail a naive connector gets wrong. Errors carry `status`, `code`,
 * `message` and `serviceErrorCode`.
 */

const ORGANIZATION_URN = 'urn:li:organization:fake-linkedin-0000000001';

export class LinkedInSimulator extends BaseProviderSimulator {
  readonly provider: ProviderId = 'linkedin';
  readonly host = 'linkedin.sim.example.test';

  protected isWritePath(path: string, method: string): boolean {
    return path === '/rest/posts' && method === 'POST';
  }

  protected errorFor(kind: FailureKind, request: SimulatedRequest): SimulatedResponse {
    const error = (
      status: number,
      code: string,
      message: string,
      serviceErrorCode: number,
      headers: Record<string, string> = {},
    ): SimulatedResponse => this.json(status, { status, code, message, serviceErrorCode }, headers);

    switch (kind) {
      case 'unauthorized':
        return error(401, 'UNAUTHORIZED', 'Empty oauth2 access token.', 65600);
      case 'expired_token':
        return error(
          401,
          'EXPIRED_ACCESS_TOKEN',
          'The token used in the request has expired.',
          65601,
        );
      case 'revoked':
        return error(401, 'REVOKED_ACCESS_TOKEN', 'The member revoked the permissions.', 65602);
      case 'forbidden':
        return error(403, 'ACCESS_DENIED', 'Not enough permissions to access this resource.', 100);
      case 'rate_limited':
        return error(429, 'RATE_LIMIT_EXCEEDED', 'Request exceeded the daily call limit.', 131, {
          'retry-after': String(RETRY_AFTER_SECONDS),
        });
      case 'server_error':
        return error(500, 'INTERNAL_SERVER_ERROR', 'Internal server error.', 0);
      case 'content_invalid':
        return error(
          422,
          'INVALID_CONTENT',
          'The post commentary exceeds the allowed length.',
          1000,
        );
      case 'duplicate':
        return error(
          422,
          'DUPLICATE_POST',
          'A post with identical content was created recently.',
          1001,
        );
      case 'not_found':
        return error(404, 'NOT_FOUND', `No resource at ${request.path}.`, 404);
      case 'token_echo':
        return error(400, 'BAD_REQUEST', `Rejected request with ${this.echoedToken}.`, 400);
    }
  }

  protected async route(request: SimulatedRequest): Promise<SimulatedResponse> {
    const { method, path, mode } = request;

    if (method === 'GET' && path === '/v2/userinfo') {
      return this.json(200, {
        sub: 'fake-linkedin-member-0000000001',
        name: 'Fixture LinkedIn Member',
        email_verified: true,
      });
    }

    if (method === 'GET' && path === '/rest/organizationAcls') {
      return this.json(200, {
        elements:
          mode === 'capability_changed'
            ? // The member lost their administrator role on the page, which is
              // a real reason a previously valid plan stops being publishable.
              []
            : [
                {
                  organizationalTarget: ORGANIZATION_URN,
                  role: 'ADMINISTRATOR',
                  state: 'APPROVED',
                },
              ],
      });
    }

    if (method === 'POST' && path === '/rest/posts') {
      const body = (request.body ?? {}) as { commentary?: string; content?: unknown };
      const post = this.recordPost({
        accountId: ORGANIZATION_URN,
        text: body.commentary ?? '',
        idempotencyKey: request.headers['x-restli-request-id'] ?? null,
      });
      const urn = `urn:li:share:${post.id}`;
      // 201 with an empty body. The id is only in the header.
      return { status: 201, headers: { 'x-restli-id': urn }, body: null };
    }

    if (method === 'GET' && path.startsWith('/rest/posts/')) {
      const urn = decodeURIComponent(path.slice('/rest/posts/'.length));
      const post = this.getPost(urn.replace('urn:li:share:', ''));
      if (post === undefined) {
        return this.errorFor('not_found', request);
      }
      return this.json(200, { id: urn, commentary: post.text, lifecycleState: 'PUBLISHED' });
    }

    if (method === 'DELETE' && path.startsWith('/rest/posts/')) {
      return { status: 204, headers: {}, body: null };
    }

    if (method === 'GET' && path === '/rest/socialActions') {
      return this.json(200, {
        likesSummary: { totalLikes: 38 },
        commentsSummary: { aggregatedTotalComments: 4 },
      });
    }

    return this.errorFor('not_found', request);
  }
}
