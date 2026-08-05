import type { ProviderId } from '@relay/contracts';

import { BaseProviderSimulator } from './engine.js';
import { RETRY_AFTER_SECONDS } from './types.js';
import type { FailureKind, SimulatedRequest, SimulatedResponse } from './types.js';

/**
 * Bluesky, over the AT Protocol XRPC surface.
 *
 * Errors are `{ error, message }` with the error name in the body rather than
 * a numeric code, and rate limits carry `ratelimit-reset` as a unix timestamp
 * instead of `retry-after` seconds, which is a real difference a connector has
 * to handle rather than assume away.
 */

const DID = 'did:plc:fakebluesky0000000001';

export class BlueskySimulator extends BaseProviderSimulator {
  readonly provider: ProviderId = 'bluesky';
  readonly host = 'bluesky.sim.example.test';

  protected isPublicPath(path: string): boolean {
    return path === '/xrpc/com.atproto.server.createSession';
  }

  protected isWritePath(path: string, method: string): boolean {
    return method === 'POST' && path === '/xrpc/com.atproto.repo.createRecord';
  }

  protected errorFor(kind: FailureKind, request: SimulatedRequest): SimulatedResponse {
    const xrpc = (
      status: number,
      error: string,
      message: string,
      headers: Record<string, string> = {},
    ): SimulatedResponse => this.json(status, { error, message }, headers);

    switch (kind) {
      case 'unauthorized':
        return xrpc(401, 'AuthMissing', 'Authentication is required.');
      case 'expired_token':
        return xrpc(400, 'ExpiredToken', 'Token has expired.');
      case 'revoked':
        return xrpc(400, 'InvalidToken', 'The app password was revoked.');
      case 'forbidden':
        return xrpc(403, 'Forbidden', 'This repository is not writable by this actor.');
      case 'rate_limited':
        return xrpc(429, 'RateLimitExceeded', 'Rate limit exceeded.', {
          'ratelimit-limit': '3000',
          'ratelimit-remaining': '0',
          'ratelimit-reset': String(Math.floor(1_785_672_000 + RETRY_AFTER_SECONDS)),
          'ratelimit-policy': '3000;w=3600',
        });
      case 'server_error':
        return xrpc(500, 'InternalServerError', 'Internal Server Error.');
      case 'content_invalid':
        return xrpc(400, 'InvalidRequest', 'Record text exceeds the graphene limit of 300.');
      case 'duplicate':
        return xrpc(400, 'InvalidRequest', 'Record already exists.');
      case 'not_found':
        return xrpc(404, 'NotFound', `No XRPC method at ${request.path}.`);
      case 'token_echo':
        return xrpc(400, 'InvalidRequest', `Rejected request with ${this.echoedToken}.`);
    }
  }

  protected async route(request: SimulatedRequest): Promise<SimulatedResponse> {
    const { method, path, mode } = request;

    if (method === 'POST' && path === '/xrpc/com.atproto.server.createSession') {
      return this.json(200, {
        did: DID,
        handle: 'fixture.bsky.example.test',
        // Session material is deliberately not token shaped in this fixture.
        accessJwt: 'fake-session-placeholder',
        refreshJwt: 'fake-refresh-placeholder',
      });
    }

    if (method === 'GET' && path === '/xrpc/app.bsky.actor.getProfile') {
      return this.json(200, {
        did: DID,
        handle: 'fixture.bsky.example.test',
        displayName: 'Fixture Bluesky Account',
        // A deactivated account cannot post, which is a real drift case.
        ...(mode === 'capability_changed' ? { deactivatedAt: '2026-08-05T00:00:00.000Z' } : {}),
      });
    }

    if (method === 'POST' && path === '/xrpc/com.atproto.repo.createRecord') {
      const body = (request.body ?? {}) as {
        record?: { text?: string; reply?: unknown };
        repo?: string;
      };
      const post = this.recordPost({
        accountId: body.repo ?? DID,
        text: body.record?.text ?? '',
        parentId: body.record?.reply === undefined ? null : 'reply',
        idempotencyKey: null,
      });
      const rkey = post.id.replace(/[^a-z0-9]/gi, '').slice(0, 13);
      return this.json(200, {
        uri: `at://${DID}/app.bsky.feed.post/${rkey}`,
        cid: `bafyfake${rkey}`,
        commit: { cid: `bafyfakecommit${rkey}`, rev: '3lfakerev' },
        validationStatus: 'valid',
      });
    }

    if (method === 'POST' && path === '/xrpc/com.atproto.repo.deleteRecord') {
      return this.json(200, {});
    }

    return this.errorFor('not_found', request);
  }
}

/**
 * The `fake` provider.
 *
 * It exists so a developer can exercise the whole compose, approve, schedule,
 * publish and receipt loop locally with no provider keys at all. It supports
 * every simulator mode and has the simplest possible surface.
 */
export class FakeProviderSimulator extends BaseProviderSimulator {
  readonly provider: ProviderId = 'fake';
  readonly host = 'fake.sim.example.test';

  protected isWritePath(path: string, method: string): boolean {
    return method === 'POST' && path === '/posts';
  }

  protected errorFor(kind: FailureKind, request: SimulatedRequest): SimulatedResponse {
    const statuses: Readonly<Record<FailureKind, number>> = {
      unauthorized: 401,
      expired_token: 401,
      revoked: 401,
      forbidden: 403,
      rate_limited: 429,
      server_error: 500,
      content_invalid: 422,
      duplicate: 409,
      not_found: 404,
      token_echo: 400,
    };
    const status = statuses[kind];
    return this.json(
      status,
      {
        error: {
          kind,
          message:
            kind === 'token_echo'
              ? `Rejected request with ${this.echoedToken}.`
              : `Fixture provider returned ${kind} for ${request.path}.`,
        },
      },
      kind === 'rate_limited' ? { 'retry-after': String(RETRY_AFTER_SECONDS) } : {},
    );
  }

  protected async route(request: SimulatedRequest): Promise<SimulatedResponse> {
    const { method, path, mode } = request;

    if (method === 'GET' && path === '/account') {
      return this.json(200, {
        id: 'fake-fake-0000000001',
        handle: 'fixture_fake_account',
        maxTextLength: mode === 'capability_changed' ? 200 : 1_000,
      });
    }

    if (method === 'POST' && path === '/posts') {
      const body = (request.body ?? {}) as { text?: string; parentId?: string };
      if (mode === 'partial_success' && body.parentId !== undefined) {
        return this.errorFor('content_invalid', request);
      }
      const post = this.recordPost({
        accountId: 'fake-fake-0000000001',
        text: body.text ?? '',
        parentId: body.parentId ?? null,
        idempotencyKey: request.headers['idempotency-key'] ?? null,
      });
      return this.json(201, {
        id: post.id,
        permalink: `${this.baseUrl}/p/${post.id}`,
        createdAt: post.createdAt,
      });
    }

    if (method === 'GET' && path.startsWith('/posts/')) {
      const post = this.getPost(path.slice('/posts/'.length));
      if (post === undefined) {
        return this.errorFor('not_found', request);
      }
      return this.json(200, {
        id: post.id,
        text: post.text,
        metrics: { impressions: 120, likes: 8, comments: 1, shares: 0 },
      });
    }

    if (method === 'DELETE' && path.startsWith('/posts/')) {
      return this.json(200, { deleted: true });
    }

    return this.errorFor('not_found', request);
  }
}
