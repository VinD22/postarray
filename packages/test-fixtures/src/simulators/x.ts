import type { ProviderId } from '@relay/contracts';

import { fakeHandle } from '../ids';
import { BaseProviderSimulator } from './engine';
import { DEFERRED_ID_POLLS, RETRY_AFTER_SECONDS } from './types';
import type { FailureKind, SimulatedRequest, SimulatedResponse } from './types';

/**
 * X.
 *
 * Mirrors the v2 request and response shapes we use: `POST /2/tweets` returns a
 * `data` object with the new id, errors use the problem-style envelope with
 * `title`, `detail`, `type` and `status`, and rate limits carry both
 * `retry-after` and the `x-rate-limit-*` reset headers.
 */

const ACCOUNT_ID = 'fake-x-0000000001';

export class XSimulator extends BaseProviderSimulator {
  readonly provider: ProviderId = 'x';
  readonly host = 'x.sim.example.test';

  protected isWritePath(path: string, method: string): boolean {
    return path === '/2/tweets' && method === 'POST';
  }

  protected errorFor(kind: FailureKind, request: SimulatedRequest): SimulatedResponse {
    const problem = (
      status: number,
      title: string,
      detail: string,
      headers: Record<string, string> = {},
    ): SimulatedResponse =>
      this.json(
        status,
        {
          title,
          detail,
          type: `https://api.x.example.test/2/problems/${title.toLowerCase().replace(/\s+/g, '-')}`,
          status,
        },
        headers,
      );

    switch (kind) {
      case 'unauthorized':
        return problem(401, 'Unauthorized', 'Authorization header is missing.');
      case 'expired_token':
        return problem(401, 'Unauthorized', 'The access token expired.');
      case 'revoked':
        return problem(401, 'Unauthorized', 'The user revoked access for this application.');
      case 'forbidden':
        return problem(403, 'Forbidden', 'This request requires a scope this token does not have.');
      case 'rate_limited':
        return problem(429, 'Too Many Requests', 'Rate limit exceeded.', {
          'retry-after': String(RETRY_AFTER_SECONDS),
          'x-rate-limit-limit': '300',
          'x-rate-limit-remaining': '0',
          'x-rate-limit-reset': '1785672900',
        });
      case 'server_error':
        return problem(500, 'Internal Error', 'Something went wrong on our side.');
      case 'content_invalid':
        return problem(
          400,
          'Invalid Request',
          'Your post text exceeds the limit for this account.',
        );
      case 'duplicate':
        return problem(403, 'Forbidden', 'You are not allowed to create a duplicate post.');
      case 'not_found':
        return problem(404, 'Not Found', `Could not find the resource at ${request.path}.`);
      case 'token_echo':
        // A provider that echoes the authorization header back in an error.
        // Nothing here is a credential; the sanitizer must still remove it.
        return problem(400, 'Invalid Request', `Rejected request with ${this.echoedToken}.`);
    }
  }

  protected async route(request: SimulatedRequest): Promise<SimulatedResponse> {
    const { method, path, mode } = request;

    if (method === 'GET' && path === '/2/users/me') {
      return this.json(200, {
        data: {
          id: ACCOUNT_ID,
          name: 'Fixture X Account',
          username: fakeHandle('x-primary'),
          // A `capability_changed` run reports a protected account, which is a
          // real reason a previously valid plan stops being publishable.
          protected: mode === 'capability_changed',
        },
      });
    }

    if (method === 'POST' && path === '/2/tweets') {
      const body = (request.body ?? {}) as {
        text?: string;
        media?: { media_ids?: string[] };
        reply?: { in_reply_to_tweet_id?: string };
      };
      const parentId = body.reply?.in_reply_to_tweet_id ?? null;

      if (mode === 'partial_success' && parentId !== null) {
        // The root published; the thread item is rejected.
        return this.errorFor('content_invalid', request);
      }

      const post = this.recordPost({
        accountId: ACCOUNT_ID,
        text: body.text ?? '',
        mediaIds: body.media?.media_ids ?? [],
        parentId,
        idempotencyKey: request.headers['x-idempotency-key'] ?? null,
      });

      if (mode === 'deferred_external_id') {
        // Accepted, but the id is only available on a later status poll.
        const container = this.createContainer({ accountId: ACCOUNT_ID, mode: 'happy' });
        this.deferExternalId(container);
        container.externalPostId = post.id;
        return this.json(202, {
          data: { pending_job_id: container.id, expected_polls: DEFERRED_ID_POLLS },
        });
      }

      return this.json(201, {
        data: { id: post.id, text: post.text, edit_history_tweet_ids: [post.id] },
      });
    }

    if (method === 'GET' && path.startsWith('/2/jobs/')) {
      const jobId = path.slice('/2/jobs/'.length);
      const container = this.pollContainer(jobId);
      if (container === undefined) {
        return this.errorFor('not_found', request);
      }
      if (container.state !== 'finished') {
        return this.json(200, { data: { id: jobId, state: 'pending' } });
      }
      return this.json(200, {
        data: { id: jobId, state: 'completed', tweet_id: container.externalPostId },
      });
    }

    if (method === 'GET' && path.startsWith('/2/tweets/')) {
      const id = path.slice('/2/tweets/'.length);
      const post = this.getPost(id);
      if (post === undefined) {
        return this.errorFor('not_found', request);
      }
      const wantsMetrics = (request.query.get('tweet.fields') ?? '').includes('public_metrics');
      return this.json(200, {
        data: {
          id: post.id,
          text: post.text,
          ...(wantsMetrics
            ? {
                public_metrics: {
                  impression_count: 1_240,
                  like_count: 38,
                  reply_count: 4,
                  repost_count: 6,
                  // `bookmark_count` is deliberately absent: the connector must
                  // record `saves` as unavailable rather than as zero.
                },
              }
            : {}),
        },
      });
    }

    if (method === 'DELETE' && path.startsWith('/2/tweets/')) {
      const id = path.slice('/2/tweets/'.length);
      if (this.getPost(id) === undefined) {
        return this.errorFor('not_found', request);
      }
      return this.json(200, { data: { deleted: true } });
    }

    return this.errorFor('not_found', request);
  }
}
