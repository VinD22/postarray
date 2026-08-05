import type { ProviderId } from '@relay/contracts';

import { BaseProviderSimulator } from './engine.js';
import { RETRY_AFTER_SECONDS } from './types.js';
import type { FailureKind, SimulatedRequest, SimulatedResponse } from './types.js';

/**
 * The Graph-shaped providers: Instagram, Facebook Pages and Threads.
 *
 * They share one error envelope (`{ error: { message, type, code,
 * error_subcode, fbtrace_id } }`) and, for Instagram and Threads, the two step
 * container lifecycle: create a container, poll it until it finishes, then
 * publish it. A 2xx from the container step is emphatically not a publication,
 * which is the trap these simulators exist to keep a connector honest about.
 */

abstract class GraphSimulator extends BaseProviderSimulator {
  protected abstract readonly accountId: string;

  protected errorFor(kind: FailureKind, request: SimulatedRequest): SimulatedResponse {
    const graph = (
      status: number,
      message: string,
      type: string,
      code: number,
      subcode: number | null,
      headers: Record<string, string> = {},
    ): SimulatedResponse =>
      this.json(
        status,
        {
          error: {
            message,
            type,
            code,
            ...(subcode === null ? {} : { error_subcode: subcode }),
            fbtrace_id: 'FAKE-TRACE-0000000001',
          },
        },
        headers,
      );

    switch (kind) {
      case 'unauthorized':
        return graph(
          401,
          'An access token is required to request this resource.',
          'OAuthException',
          104,
          null,
        );
      case 'expired_token':
        return graph(
          401,
          'Error validating access token: Session has expired.',
          'OAuthException',
          190,
          463,
        );
      case 'revoked':
        return graph(
          401,
          'Error validating access token: The user has not authorized application.',
          'OAuthException',
          190,
          458,
        );
      case 'forbidden':
        return graph(
          403,
          'The user does not have a role on this page.',
          'OAuthException',
          200,
          1_349_003,
        );
      case 'rate_limited':
        return graph(429, 'Application request limit reached.', 'OAuthException', 4, null, {
          'retry-after': String(RETRY_AFTER_SECONDS),
          'x-app-usage': '{"call_count":100,"total_time":100,"total_cputime":100}',
        });
      case 'server_error':
        return graph(
          500,
          'An unexpected error has occurred. Please retry your request later.',
          'OAuthException',
          2,
          null,
        );
      case 'content_invalid':
        return graph(
          400,
          'The caption is longer than the maximum allowed.',
          'OAuthException',
          100,
          2_207_009,
        );
      case 'duplicate':
        return graph(400, 'This media was already published.', 'OAuthException', 100, 2_207_003);
      case 'not_found':
        return graph(
          404,
          `Unknown path components: ${request.path}`,
          'GraphMethodException',
          2_500,
          null,
        );
      case 'token_echo':
        return graph(
          400,
          `Rejected request with ${this.echoedToken}.`,
          'OAuthException',
          100,
          null,
        );
    }
  }
}

/** Instagram: container, poll, publish. Consumer accounts cannot publish. */
export class InstagramSimulator extends GraphSimulator {
  readonly provider: ProviderId = 'instagram';
  readonly host = 'instagram.sim.example.test';
  protected readonly accountId = 'fake-instagram-0000000001';

  protected isWritePath(path: string, method: string): boolean {
    return method === 'POST' && (path.endsWith('/media') || path.endsWith('/media_publish'));
  }

  protected async route(request: SimulatedRequest): Promise<SimulatedResponse> {
    const { method, path, mode } = request;

    if (method === 'GET' && path === `/v21.0/${this.accountId}`) {
      return this.json(200, {
        id: this.accountId,
        username: 'fixture_instagram_account',
        // A consumer account cannot publish, and the connector must say so in
        // words a person can act on rather than "authentication failed".
        account_type: mode === 'capability_changed' ? 'PERSONAL' : 'BUSINESS',
      });
    }

    if (method === 'POST' && path === `/v21.0/${this.accountId}/media`) {
      const body = (request.body ?? {}) as { caption?: string; image_url?: string };
      const container = this.createContainer({ accountId: this.accountId, mode });
      this.recordPost({
        accountId: this.accountId,
        text: body.caption ?? '',
        id: container.id,
        idempotencyKey: null,
      });
      return this.json(200, { id: container.id });
    }

    if (
      method === 'GET' &&
      path.startsWith('/v21.0/') &&
      request.query.get('fields') === 'status_code'
    ) {
      const containerId = path.slice('/v21.0/'.length);
      const container = this.pollContainer(containerId);
      if (container === undefined) {
        return this.errorFor('not_found', request);
      }
      const statusCode =
        container.state === 'finished'
          ? 'FINISHED'
          : container.state === 'error'
            ? 'ERROR'
            : 'IN_PROGRESS';
      return this.json(200, {
        id: containerId,
        status_code: statusCode,
        ...(statusCode === 'ERROR' ? { status: 'Error: media processing failed.' } : {}),
      });
    }

    if (method === 'POST' && path === `/v21.0/${this.accountId}/media_publish`) {
      const body = (request.body ?? {}) as { creation_id?: string };
      const container =
        body.creation_id === undefined ? undefined : this.getContainer(body.creation_id);
      if (container === undefined) {
        return this.errorFor('not_found', request);
      }
      if (container.state !== 'finished') {
        // Publishing an unfinished container is an error, not a silent success.
        return this.errorFor('content_invalid', request);
      }
      const published = this.recordPost({
        accountId: this.accountId,
        text: '',
        parentId: container.id,
        idempotencyKey: `publish:${container.id}`,
      });
      container.state = 'published';
      container.externalPostId = published.id;
      return this.json(200, { id: published.id });
    }

    if (method === 'GET' && path.endsWith('/insights')) {
      return this.json(200, {
        data: [
          { name: 'impressions', period: 'lifetime', values: [{ value: 1_240 }] },
          { name: 'reach', period: 'lifetime', values: [{ value: 980 }] },
        ],
      });
    }

    return this.errorFor('not_found', request);
  }
}

/** Facebook Pages: a single step publish to the page feed. */
export class FacebookSimulator extends GraphSimulator {
  readonly provider: ProviderId = 'facebook';
  readonly host = 'facebook.sim.example.test';
  protected readonly accountId = 'fake-facebook-0000000001';

  protected isWritePath(path: string, method: string): boolean {
    return method === 'POST' && (path.endsWith('/feed') || path.endsWith('/photos'));
  }

  protected async route(request: SimulatedRequest): Promise<SimulatedResponse> {
    const { method, path, mode } = request;

    if (method === 'GET' && path === '/v21.0/me/accounts') {
      return this.json(200, {
        data:
          mode === 'capability_changed'
            ? []
            : [
                {
                  id: this.accountId,
                  name: 'Fixture Page',
                  // Deliberately not token shaped, so a secret scanner over
                  // this package never has to decide whether it is real.
                  access_token: 'fake-page-token-placeholder',
                  tasks: ['CREATE_CONTENT', 'MANAGE', 'MODERATE'],
                },
              ],
      });
    }

    if (method === 'POST' && path === `/v21.0/${this.accountId}/feed`) {
      const body = (request.body ?? {}) as { message?: string; link?: string };
      const post = this.recordPost({
        accountId: this.accountId,
        text: body.message ?? '',
        idempotencyKey: null,
      });
      return this.json(200, { id: `${this.accountId}_${post.id}` });
    }

    if (method === 'GET' && path.endsWith('/insights')) {
      return this.json(200, {
        data: [{ name: 'post_impressions', period: 'lifetime', values: [{ value: 1_240 }] }],
      });
    }

    if (method === 'DELETE' && path.startsWith('/v21.0/')) {
      return this.json(200, { success: true });
    }

    return this.errorFor('not_found', request);
  }
}

/** Threads: the same container lifecycle as Instagram, different paths. */
export class ThreadsSimulator extends GraphSimulator {
  readonly provider: ProviderId = 'threads';
  readonly host = 'threads.sim.example.test';
  protected readonly accountId = 'fake-threads-0000000001';

  protected isWritePath(path: string, method: string): boolean {
    return method === 'POST' && (path.endsWith('/threads') || path.endsWith('/threads_publish'));
  }

  protected async route(request: SimulatedRequest): Promise<SimulatedResponse> {
    const { method, path, mode } = request;

    if (method === 'GET' && path === `/v1.0/${this.accountId}`) {
      return this.json(200, {
        id: this.accountId,
        username: 'fixture_threads_account',
        threads_profile_picture_url: null,
      });
    }

    if (method === 'POST' && path === `/v1.0/${this.accountId}/threads`) {
      const body = (request.body ?? {}) as { text?: string; reply_to_id?: string };
      const container = this.createContainer({ accountId: this.accountId, mode });
      this.recordPost({
        accountId: this.accountId,
        text: body.text ?? '',
        parentId: body.reply_to_id ?? null,
        id: container.id,
        idempotencyKey: null,
      });
      return this.json(200, { id: container.id });
    }

    if (method === 'POST' && path === `/v1.0/${this.accountId}/threads_publish`) {
      const body = (request.body ?? {}) as { creation_id?: string };
      const container =
        body.creation_id === undefined ? undefined : this.getContainer(body.creation_id);
      if (container === undefined) {
        return this.errorFor('not_found', request);
      }
      const polled = this.pollContainer(container.id);
      if (polled === undefined || polled.state === 'in_progress') {
        return this.errorFor('content_invalid', request);
      }
      const published = this.recordPost({
        accountId: this.accountId,
        text: '',
        parentId: container.id,
        idempotencyKey: `publish:${container.id}`,
      });
      container.state = 'published';
      container.externalPostId = published.id;
      return this.json(200, { id: published.id });
    }

    return this.errorFor('not_found', request);
  }
}
