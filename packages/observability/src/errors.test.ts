import { describe, expect, it } from 'vitest';

import { classifyProviderError, isRetryableErrorClass } from './errors';

describe('classifyProviderError: generic HTTP rules', () => {
  it('treats 429 as transient', () => {
    expect(classifyProviderError({ status: 429, body: { message: 'slow down' } })).toBe(
      'transient_provider',
    );
  });

  it('treats every 5xx as transient', () => {
    for (const status of [500, 502, 503, 504]) {
      expect(classifyProviderError({ status })).toBe('transient_provider');
    }
  });

  it('treats 408 and 425 as transient', () => {
    expect(classifyProviderError({ status: 408 })).toBe('transient_provider');
    expect(classifyProviderError({ status: 425 })).toBe('transient_provider');
  });

  it('treats 401 as a user action', () => {
    expect(classifyProviderError({ status: 401, body: { error: 'unauthorized' } })).toBe(
      'user_action_required',
    );
  });

  it('treats 403 as a user action by default', () => {
    expect(classifyProviderError({ status: 403, body: { message: 'missing scope' } })).toBe(
      'user_action_required',
    );
  });

  it('treats a 403 that is really a quota as transient', () => {
    expect(classifyProviderError({ status: 403, body: { message: 'Rate limit reached' } })).toBe(
      'transient_provider',
    );
  });

  it('treats a 403 for a suspended account as permanent', () => {
    expect(
      classifyProviderError({ status: 403, body: { message: 'This account is suspended' } }),
    ).toBe('permanent_provider');
  });

  it('treats 400 as invalid content', () => {
    expect(classifyProviderError({ status: 400, body: { message: 'text too long' } })).toBe(
      'content_invalid',
    );
  });

  it('treats a 400 that is really an expired grant as a user action', () => {
    expect(classifyProviderError({ status: 400, body: { error: 'invalid_grant' } })).toBe(
      'user_action_required',
    );
  });

  it('treats 413, 415 and 422 as invalid content', () => {
    for (const status of [413, 415, 422]) {
      expect(classifyProviderError({ status })).toBe('content_invalid');
    }
  });

  it('treats 404 and 410 as permanent', () => {
    expect(classifyProviderError({ status: 404 })).toBe('permanent_provider');
    expect(classifyProviderError({ status: 410 })).toBe('permanent_provider');
  });

  it('returns UNKNOWN for a shape it does not recognise', () => {
    expect(classifyProviderError({})).toBe('unknown');
    expect(classifyProviderError({ body: 'something went wrong' })).toBe('unknown');
    expect(classifyProviderError({ status: 418, body: {} })).toBe('unknown');
  });

  it('returns INTERNAL for our own mapping bugs', () => {
    expect(classifyProviderError({ body: new TypeError('x is not a function') })).toBe('internal');
  });

  it('treats a transport failure as transient', () => {
    expect(classifyProviderError({ code: 'ECONNRESET' })).toBe('transient_provider');
    expect(classifyProviderError({ code: 'UND_ERR_HEADERS_TIMEOUT' })).toBe('transient_provider');
  });
});

describe('classifyProviderError: X', () => {
  it('treats a duplicate post as invalid content, not a retryable failure', () => {
    const errorClass = classifyProviderError({
      provider: 'x',
      status: 403,
      body: { detail: 'You are not allowed to create a Tweet with duplicate content.' },
    });
    expect(errorClass).toBe('content_invalid');
    expect(isRetryableErrorClass(errorClass)).toBe(false);
  });

  it('treats an unenrolled client as a user action', () => {
    expect(
      classifyProviderError({
        provider: 'x',
        status: 403,
        body: { reason: 'client-not-enrolled' },
      }),
    ).toBe('user_action_required');
  });

  it('treats a usage cap as a user action', () => {
    expect(
      classifyProviderError({ provider: 'x', status: 402, body: { title: 'UsageCapped' } }),
    ).toBe('user_action_required');
  });
});

describe('classifyProviderError: LinkedIn', () => {
  it('treats a revoked token as a user action', () => {
    expect(
      classifyProviderError({
        provider: 'linkedin',
        status: 401,
        body: { serviceErrorCode: 65601, message: 'REVOKED_ACCESS_TOKEN' },
      }),
    ).toBe('user_action_required');
  });

  it('treats 422 as invalid content', () => {
    expect(classifyProviderError({ provider: 'linkedin', status: 422, body: {} })).toBe(
      'content_invalid',
    );
  });

  it('treats a missing organization permission as a user action', () => {
    expect(
      classifyProviderError({
        provider: 'linkedin',
        status: 403,
        body: { message: 'ACCESS_DENIED' },
      }),
    ).toBe('user_action_required');
  });
});

describe('classifyProviderError: Meta', () => {
  it('treats code 190 as a user action on every Meta surface', () => {
    for (const provider of ['instagram', 'facebook', 'threads']) {
      expect(
        classifyProviderError({
          provider,
          status: 400,
          body: { error: { code: 190, error_subcode: 463, message: 'Session expired' } },
        }),
      ).toBe('user_action_required');
    }
  });

  it('treats the rate limit codes as transient even on a 400', () => {
    expect(
      classifyProviderError({
        provider: 'instagram',
        status: 400,
        body: { error: { code: 4, message: 'Application request limit reached' } },
      }),
    ).toBe('transient_provider');
  });

  it('honours the is_transient flag', () => {
    expect(
      classifyProviderError({
        provider: 'facebook',
        status: 500,
        body: { error: { code: 2, is_transient: true } },
      }),
    ).toBe('transient_provider');
  });

  it('treats code 100 as invalid content', () => {
    expect(
      classifyProviderError({
        provider: 'instagram',
        status: 400,
        body: { error: { code: 100, message: 'Invalid parameter' } },
      }),
    ).toBe('content_invalid');
  });

  it('treats a permission subcode of 100 as a user action', () => {
    expect(
      classifyProviderError({
        provider: 'facebook',
        status: 400,
        body: { error: { code: 100, error_subcode: 33 } },
      }),
    ).toBe('user_action_required');
  });

  it('treats a blocked action as permanent', () => {
    expect(
      classifyProviderError({
        provider: 'facebook',
        status: 403,
        body: { error: { code: 368, message: 'Action blocked' } },
      }),
    ).toBe('permanent_provider');
  });
});

describe('classifyProviderError: YouTube', () => {
  it('treats an exceeded quota as transient', () => {
    expect(
      classifyProviderError({
        provider: 'youtube',
        status: 403,
        body: {
          error: { errors: [{ reason: 'quotaExceeded' }] },
          errors: [{ reason: 'quotaExceeded' }],
        },
      }),
    ).toBe('transient_provider');
  });

  it('treats a missing channel as a user action', () => {
    expect(
      classifyProviderError({
        provider: 'youtube',
        status: 403,
        body: { errors: [{ reason: 'youtubeSignupRequired' }] },
      }),
    ).toBe('user_action_required');
  });

  it('treats invalid metadata as invalid content', () => {
    expect(
      classifyProviderError({
        provider: 'youtube',
        status: 400,
        body: { errors: [{ reason: 'invalidTitle' }] },
      }),
    ).toBe('content_invalid');
  });

  it('treats a revoked refresh token as a user action', () => {
    expect(
      classifyProviderError({
        provider: 'youtube',
        status: 400,
        body: { error: 'invalid_grant', error_description: 'Token has been expired or revoked.' },
      }),
    ).toBe('user_action_required');
  });
});

describe('classifyProviderError: TikTok', () => {
  it('treats an invalid access token as a user action', () => {
    expect(
      classifyProviderError({
        provider: 'tiktok',
        status: 401,
        body: { error: { code: 'access_token_invalid' } },
      }),
    ).toBe('user_action_required');
  });

  it('treats a spam risk as transient but a posting ban as permanent', () => {
    expect(
      classifyProviderError({
        provider: 'tiktok',
        status: 429,
        body: { error: { code: 'spam_risk_too_many_posts' } },
      }),
    ).toBe('transient_provider');
    expect(
      classifyProviderError({
        provider: 'tiktok',
        status: 403,
        body: { error: { code: 'spam_risk_user_banned_from_posting' } },
      }),
    ).toBe('permanent_provider');
  });

  it('treats a failed media check as invalid content', () => {
    expect(
      classifyProviderError({
        provider: 'tiktok',
        status: 400,
        body: { error: { code: 'duration_check_failed' } },
      }),
    ).toBe('content_invalid');
  });

  it('treats an unaudited client restriction as a user action', () => {
    expect(
      classifyProviderError({
        provider: 'tiktok',
        status: 403,
        body: { error: { code: 'unaudited_client_can_only_post_to_private_accounts' } },
      }),
    ).toBe('user_action_required');
  });
});

describe('classifyProviderError: Bluesky', () => {
  it('treats an expired token as a user action even on a 400', () => {
    expect(
      classifyProviderError({
        provider: 'bluesky',
        status: 400,
        body: { error: 'ExpiredToken', message: 'Token has expired' },
      }),
    ).toBe('user_action_required');
  });

  it('treats an upstream failure as transient', () => {
    expect(
      classifyProviderError({
        provider: 'bluesky',
        status: 502,
        body: { error: 'UpstreamFailure' },
      }),
    ).toBe('transient_provider');
  });

  it('treats an oversized blob as invalid content', () => {
    expect(
      classifyProviderError({
        provider: 'bluesky',
        status: 400,
        body: { error: 'BlobTooLarge' },
      }),
    ).toBe('content_invalid');
  });
});

describe('classifyProviderError: unknown provider', () => {
  it('falls back to the generic rules', () => {
    expect(classifyProviderError({ provider: 'mastodon', status: 429 })).toBe('transient_provider');
    expect(classifyProviderError({ provider: 'fake', status: 401 })).toBe('user_action_required');
  });
});

describe('isRetryableErrorClass', () => {
  it('only allows transient provider failures to be retried', () => {
    expect(isRetryableErrorClass('transient_provider')).toBe(true);
    expect(isRetryableErrorClass('user_action_required')).toBe(false);
    expect(isRetryableErrorClass('content_invalid')).toBe(false);
    expect(isRetryableErrorClass('permanent_provider')).toBe(false);
    expect(isRetryableErrorClass('internal')).toBe(false);
    expect(isRetryableErrorClass('unknown')).toBe(false);
  });
});
