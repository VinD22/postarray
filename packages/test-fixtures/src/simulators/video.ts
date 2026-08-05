import type { ProviderId } from '@relay/contracts';

import { BaseProviderSimulator } from './engine';
import { RETRY_AFTER_SECONDS } from './types';
import type { FailureKind, SimulatedRequest, SimulatedResponse } from './types';

/**
 * The video providers: YouTube and TikTok.
 *
 * Both accept an upload, then process it asynchronously, and both can report a
 * successful upload for a video that is not yet visible. A connector that
 * treats the upload response as a publication is wrong on both, which is what
 * `stuck_container` and `slow_media` exist to prove.
 */

export class YouTubeSimulator extends BaseProviderSimulator {
  readonly provider: ProviderId = 'youtube';
  readonly host = 'youtube.sim.example.test';

  private readonly channelId = 'fake-youtube-0000000001';

  protected isWritePath(path: string, method: string): boolean {
    return method === 'POST' && path.startsWith('/upload/youtube/v3/videos');
  }

  protected errorFor(kind: FailureKind, request: SimulatedRequest): SimulatedResponse {
    const google = (
      status: number,
      reason: string,
      message: string,
      headers: Record<string, string> = {},
    ): SimulatedResponse =>
      this.json(
        status,
        {
          error: {
            code: status,
            message,
            errors: [{ domain: 'youtube.video', reason, message }],
            status: status === 403 ? 'PERMISSION_DENIED' : 'FAILED_PRECONDITION',
          },
        },
        headers,
      );

    switch (kind) {
      case 'unauthorized':
        return google(401, 'authError', 'Invalid Credentials.');
      case 'expired_token':
        return google(401, 'authError', 'Request had invalid authentication credentials.');
      case 'revoked':
        return google(401, 'authError', 'Token has been expired or revoked.');
      case 'forbidden':
        return google(
          403,
          'insufficientPermissions',
          'Request had insufficient authentication scopes.',
        );
      case 'rate_limited':
        return google(
          429,
          'quotaExceeded',
          'The request cannot be completed because the quota is exhausted.',
          {
            'retry-after': String(RETRY_AFTER_SECONDS),
          },
        );
      case 'server_error':
        return google(500, 'backendError', 'Backend Error.');
      case 'content_invalid':
        return google(400, 'invalidTitle', 'The video title is invalid.');
      case 'duplicate':
        return google(400, 'duplicateVideo', 'This video was already uploaded.');
      case 'not_found':
        return google(404, 'videoNotFound', `No resource at ${request.path}.`);
      case 'token_echo':
        return google(400, 'badRequest', `Rejected request with ${this.echoedToken}.`);
    }
  }

  protected async route(request: SimulatedRequest): Promise<SimulatedResponse> {
    const { method, path, mode } = request;

    if (method === 'GET' && path === '/youtube/v3/channels') {
      return this.json(200, {
        items: [
          {
            id: this.channelId,
            snippet: { title: 'Fixture Channel' },
            status: {
              // An unverified channel cannot upload videos over 15 minutes.
              longUploadsStatus: mode === 'capability_changed' ? 'disallowed' : 'allowed',
            },
          },
        ],
      });
    }

    if (method === 'POST' && path === '/upload/youtube/v3/videos') {
      if (request.query.get('uploadType') === 'resumable') {
        const container = this.createContainer({ accountId: this.channelId, mode });
        return {
          status: 200,
          headers: {
            location: `${this.baseUrl}/upload/youtube/v3/videos/session/${container.id}`,
            'content-type': 'application/json',
          },
          body: null,
        };
      }
      return this.errorFor('content_invalid', request);
    }

    if (method === 'PUT' && path.startsWith('/upload/youtube/v3/videos/session/')) {
      const containerId = path.slice('/upload/youtube/v3/videos/session/'.length);
      const container = this.getContainer(containerId);
      if (container === undefined) {
        return this.errorFor('not_found', request);
      }
      const post = this.recordPost({
        accountId: this.channelId,
        text: '',
        id: `video-${container.id}`,
        idempotencyKey: `upload:${container.id}`,
      });
      container.externalPostId = post.id;
      // `uploaded` is not `processed`. The video is not public yet.
      return this.json(200, {
        id: post.id,
        snippet: { channelId: this.channelId, title: 'Fixture video' },
        status: { uploadStatus: 'uploaded', privacyStatus: 'private' },
      });
    }

    if (method === 'GET' && path === '/youtube/v3/videos') {
      const id = request.query.get('id') ?? '';
      const container = [...this.containers].find((entry) => entry.externalPostId === id);
      if (container === undefined) {
        return this.json(200, { items: [] });
      }
      const polled = this.pollContainer(container.id);
      const processed = polled !== undefined && polled.state !== 'in_progress';
      return this.json(200, {
        items: [
          {
            id,
            status: {
              uploadStatus: processed ? 'processed' : 'uploaded',
              privacyStatus: processed ? 'public' : 'private',
            },
            statistics: processed
              ? { viewCount: '420', likeCount: '18', commentCount: '3' }
              : undefined,
          },
        ],
      });
    }

    return this.errorFor('not_found', request);
  }
}

export class TikTokSimulator extends BaseProviderSimulator {
  readonly provider: ProviderId = 'tiktok';
  readonly host = 'tiktok.sim.example.test';

  private readonly openId = 'fake-tiktok-0000000001';

  protected isWritePath(path: string, method: string): boolean {
    return method === 'POST' && path.startsWith('/v2/post/publish/');
  }

  protected errorFor(kind: FailureKind, request: SimulatedRequest): SimulatedResponse {
    const tiktok = (
      status: number,
      code: string,
      message: string,
      headers: Record<string, string> = {},
    ): SimulatedResponse =>
      this.json(
        status,
        { data: {}, error: { code, message, log_id: 'FAKE-LOG-0000000001' } },
        headers,
      );

    switch (kind) {
      case 'unauthorized':
        return tiktok(401, 'access_token_invalid', 'The access token is invalid.');
      case 'expired_token':
        return tiktok(401, 'access_token_expired', 'The access token has expired.');
      case 'revoked':
        return tiktok(401, 'scope_not_authorized', 'The user revoked the authorization.');
      case 'forbidden':
        return tiktok(403, 'scope_permission_missing', 'The token lacks video.publish.');
      case 'rate_limited':
        return tiktok(429, 'rate_limit_exceeded', 'Daily publish limit reached.', {
          'retry-after': String(RETRY_AFTER_SECONDS),
        });
      case 'server_error':
        return tiktok(500, 'internal_error', 'Please retry later.');
      case 'content_invalid':
        return tiktok(400, 'invalid_param', 'The video title exceeds the allowed length.');
      case 'duplicate':
        return tiktok(400, 'duplicate_content', 'This video was already published.');
      case 'not_found':
        return tiktok(404, 'not_found', `No resource at ${request.path}.`);
      case 'token_echo':
        return tiktok(400, 'invalid_param', `Rejected request with ${this.echoedToken}.`);
    }
  }

  protected async route(request: SimulatedRequest): Promise<SimulatedResponse> {
    const { method, path, mode } = request;

    if (method === 'GET' && path === '/v2/user/info/') {
      return this.json(200, {
        data: { user: { open_id: this.openId, display_name: 'Fixture TikTok Account' } },
        error: { code: 'ok', message: '', log_id: 'FAKE-LOG-0000000002' },
      });
    }

    if (method === 'POST' && path === '/v2/post/publish/creator_info/query/') {
      return this.json(200, {
        data: {
          creator_username: 'fixture_tiktok_account',
          // TikTok forbids a preselected privacy value; the list is offered and
          // the user must choose one explicitly.
          privacy_level_options:
            mode === 'capability_changed'
              ? ['SELF_ONLY']
              : ['PUBLIC_TO_EVERYONE', 'MUTUAL_FOLLOW_FRIENDS', 'SELF_ONLY'],
          max_video_post_duration_sec: 600,
        },
        error: { code: 'ok', message: '', log_id: 'FAKE-LOG-0000000003' },
      });
    }

    if (method === 'POST' && path === '/v2/post/publish/video/init/') {
      const body = (request.body ?? {}) as {
        post_info?: { title?: string; privacy_level?: string };
      };
      if (body.post_info?.privacy_level === undefined) {
        return this.errorFor('content_invalid', request);
      }
      const container = this.createContainer({ accountId: this.openId, mode });
      this.recordPost({
        accountId: this.openId,
        text: body.post_info.title ?? '',
        id: container.id,
        idempotencyKey: null,
      });
      return this.json(200, {
        data: { publish_id: container.id, upload_url: `${this.baseUrl}/upload/${container.id}` },
        error: { code: 'ok', message: '', log_id: 'FAKE-LOG-0000000004' },
      });
    }

    if (method === 'POST' && path === '/v2/post/publish/status/fetch/') {
      const body = (request.body ?? {}) as { publish_id?: string };
      const container =
        body.publish_id === undefined ? undefined : this.pollContainer(body.publish_id);
      if (container === undefined) {
        return this.errorFor('not_found', request);
      }
      if (container.state === 'in_progress') {
        return this.json(200, {
          data: { status: 'PROCESSING_UPLOAD', publicaly_available_post_id: [] },
          error: { code: 'ok', message: '', log_id: 'FAKE-LOG-0000000005' },
        });
      }
      if (container.externalPostId === null) {
        const published = this.recordPost({
          accountId: this.openId,
          text: '',
          parentId: container.id,
          idempotencyKey: `publish:${container.id}`,
        });
        container.externalPostId = published.id;
        container.state = 'published';
      }
      return this.json(200, {
        data: {
          status: 'PUBLISH_COMPLETE',
          publicaly_available_post_id: [container.externalPostId],
        },
        error: { code: 'ok', message: '', log_id: 'FAKE-LOG-0000000006' },
      });
    }

    return this.errorFor('not_found', request);
  }
}
