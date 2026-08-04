import { describe, expect, it } from 'vitest';

import { classifyProviderError, isRetryableErrorClass } from './errors.js';

describe('classifyProviderError: generic HTTP rules', () => {
  it('treats 429 as transient', () => {
    expect(classifyProviderError({ status: 429, body: { message: 'slow down' } })).toBe(
      'TRANSIENT_PROVIDER',
    );
  });

  it('treats every 5xx as transient', () => {
    for (const status of [500, 502, 503, 504]) {
      expect(classifyProviderError({ status })).toBe('TRANSIENT_PROVIDER');
    }
  });

  it('treats 408 and 425 as transient', () => {
    expect(classifyProviderError({ status: 408 })).toBe('TRANSIENT_PROVIDER');
    expect(classifyProviderError({ status: 425 })).toBe('TRANSIENT_PROVIDER');
  });

  it('treats 401 as a user action', () => {
    expect(classifyProviderError({ status: 401, body: { error: 'unauthorized' } })).toBe(
      'USER_ACTION_REQUIRED',
    );
  });

  it('treats 403 as a user action by default', () => {
    expect(classifyProviderError({ status: 403, body: { message: 'missing scope' } })).toBe(
      'USER_ACTION_REQUIRED',
    );
  });

  it('treats a 403 that is really a quota as transient', () => {
    expect(classifyProviderError({ status: 403, body: { message: 'Rate limit reached' } })).toBe(
      'TRANSIENT_PROVIDER',
    );
  });

  it('treats a 403 for a suspended account as permanent', () => {
    expect(
      classifyProviderError({ status: 403, body: { message: 'This account is suspended' } }),
    ).toBe('PERMANENT_PROVIDER');
  });

  it('treats 400 as invalid content', () => {
    expect(classifyProviderError({ status: 400, body: { message: 'text too long' } })).toBe(
      'CONTENT_INVALID',
    );
  });

  it('treats a 400 that is really an expired grant as a user action', () => {
    expect(classifyProviderError({ status: 400, body: { error: 'invalid_grant' } })).toBe(
      'USER_ACTION_REQUIRED',
    );
  });

  it('treats 413, 415 and 422 as invalid content', () => {
    for (const status of [413, 415, 422]) {
      expect(classifyProviderError({ status })).toBe('CONTENT_INVALID');
    }
  });

  it('treats 404 and 410 as permanent', () => {
    expect(classifyProviderError({ status: 404 })).toBe('PERMANENT_PROVIDER');
    expect(classifyProviderError({ status: 410 })).toBe('PERMANENT_PROVIDER');
  });

  it('returns UNKNOWN for a shape it does not recognise', () => {
    expect(classifyProviderError({})).toBe('UNKNOWN');
    expect(classifyProviderError({ body: 'something went wrong' })).toBe('UNKNOWN');
    expect(classifyProviderError({ status: 418, body: {} })).toBe('UNKNOWN');
  });

  it('returns INTERNAL for our own mapping bugs', () => {
    expect(classifyProviderError({ body: new TypeError('x is not a function') })).toBe('INTERNAL');
  });

  it('treats a transport failure as transient', () => {
    expect(classifyProviderError({ code: 'ECONNRESET' })).toBe('TRANSIENT_PROVIDER');
    expect(classifyProviderError({ code: 'UND_ERR_HEADERS_TIMEOUT' })).toBe('TRANSIENT_PROVIDER');
  });
});

describe('classifyProviderError: X', () => {
  it('treats a duplicate post as invalid content, not a retryable failure', () => {
    const errorClass = classifyProviderError({
      provider: 'x',
      status: 403,
      body: { detail: 'You are not allowed to create a Tweet with duplicate content.' },
    });
    expect(errorClass).toBe('CONTENT_INVALID');
    expect(isRetryableErrorClass(errorClass)).toBe(false);
  });

  it('treats an unenrolled client as a user action', () => {
    expect(
      classifyProviderError({
        provider: 'x',
        status: 403,
        body: { reason: 'client-not-enrolled' },
      }),
    ).toBe('USER_ACTION_REQUIRED');
  });

  it('treats a usage cap as a user action', () => {
    expect(
      classifyProviderError({ provider: 'x', status: 402, body: { title: 'UsageCapped' } }),
    ).toBe('USER_ACTION_REQUIRED');
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
    ).toBe('USER_ACTION_REQUIRED');
  });

  it('treats 422 as invalid content', () => {
    expect(classifyProviderError({ provider: 'linkedin', status: 422, body: {} })).toBe(
      'CONTENT_INVALID',
    );
  });

  it('treats a missing organization permission as a user action', () => {
    expect(
      classifyProviderError({
        provider: 'linkedin',
        status: 403,
        body: { message: 'ACCESS_DENIED' },
      }),
    ).toBe('USER_ACTION_REQUIRED');
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
      ).toBe('USER_ACTION_REQUIRED');
    }
  });

  it('treats the rate limit codes as transient even on a 400', () => {
    expect(
      classifyProviderError({
        provider: 'instagram',
        status: 400,
        body: { error: { code: 4, message: 'Application request limit reached' } },
      }),
    ).toBe('TRANSIENT_PROVIDER');
  });

  it('honours the is_transient flag', () => {
    expect(
      classifyProviderError({
        provider: 'facebook',
        status: 500,
        body: { error: { code: 2, is_transient: true } },
      }),
    ).toBe('TRANSIENT_PROVIDER');
  });

  it('treats code 100 as invalid content', () => {
    expect(
      classifyProviderError({
        provider: 'instagram',
        status: 400,
        body: { error: { code: 100, message: 'Invalid parameter' } },
      }),
    ).toBe('CONTENT_INVALID');
  });

  it('treats a permission subcode of 100 as a user action', () => {
    expect(
      classifyProviderError({
        provider: 'facebook',
        status: 400,
        body: { error: { code: 100, error_subcode: 33 } },
      }),
    ).toBe('USER_ACTION_REQUIRED');
  });

  it('treats a blocked action as permanent', () => {
    expect(
      classifyProviderError({
        provider: 'facebook',
        status: 403,
        body: { error: { code: 368, message: 'Action blocked' } },
      }),
    ).toBe('PERMANENT_PROVIDER');
  });
});

describe('classifyProviderError: YouTube', () => {
  it('treats an exceeded quota as transient', () => {
    expect(
      classifyProviderError({
        provider: 'youtube',
        status: 403,
        body: { error: { errors: [{ reason: 'quotaExceeded' }] }, errors: [{ reason: 'quotaExceeded' }] },
      }),
    ).toBe('TRANSIENT_PROVIDER');
  });

  it('treats a missing channel as a user action', () => {
    expect(
      classifyProviderError({
        provider: 'youtube',
        status: 403,
        body: { errors: [{ reason: 'youtubeSignupRequired' }] },
      }),
    ).toBe('USER_ACTION_REQUIRED');
  });

  it('treats invalid metadata as invalid content', () => {
    expect(
      classifyProviderError({
        provider: 'youtube',
        status: 400,
        body: { errors: [{ reason: 'invalidTitle' }] },
      }),
    ).toBe('CONTENT_INVALID');
  });

  it('treats a revoked refresh token as a user action', () => {
    expect(
      classifyProviderError({
        provider: 'youtube',
        status: 400,
        body: { error: 'invalid_grant', error_description: 'Token has been expired or revoked.' },
      }),
    ).toBe('USER_ACTION_REQUIRED');
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
    ).toBe('USER_ACTION_REQUIRED');
  });

  it('treats a spam risk as transient but a posting ban as permanent', () => {
    expect(
      classifyProviderError({
        provider: 'tiktok',
        status: 429,
        body: { error: { code: 'spam_risk_too_many_posts' } },
      }),
    ).toBe('TRANSIENT_PROVIDER');
    expect(
      classifyProviderError({
        provider: 'tiktok',
        status: 403,
        body: { error: { code: 'spam_risk_user_banned_from_posting' } },
      }),
    ).toBe('PERMANENT_PROVIDER');
  });

  it('treats a failed media check as invalid content', () => {
    expect(
      classifyProviderError({
        provider: 'tiktok',
        status: 400,
        body: { error: { code: 'duration_check_failed' } },
      }),
    ).toBe('CONTENT_INVALID');
  });

  it('treats an unaudited client restriction as a user action', () => {
    expect(
      classifyProviderError({
        provider: 'tiktok',
        status: 403,
        body: { error: { code: 'unaudited_client_can_only_post_to_private_accounts' } },
      }),
    ).toBe('USER_ACTION_REQUIRED');
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
    ).toBe('USER_ACTION_REQUIRED');
  });

  it('treats an upstream failure as transient', () => {
    expect(
      classifyProviderError({
        provider: 'bluesky',
        status: 502,
        body: { error: 'UpstreamFailure' },
      }),
    ).toBe('TRANSIENT_PROVIDER');
  });

  it('treats an oversized blob as invalid content', () => {
    expect(
      classifyProviderError({
        provider: 'bluesky',
        status: 400,
        body: { error: 'BlobTooLarge' },
      }),
    ).toBe('CONTENT_INVALID');
  });
});

describe('classifyProviderError: unknown provider', () => {
  it('falls back to the generic rules', () => {
    expect(classifyProviderError({ provider: 'mastodon', status: 429 })).toBe(
      'TRANSIENT_PROVIDER',
    );
    expect(classifyProviderError({ provider: 'fake', status: 401 })).toBe('USER_ACTION_REQUIRED');
  });
});

describe('isRetryableErrorClass', () => {
  it('only allows transient provider failures to be retried', () => {
    expect(isRetryableErrorClass('TRANSIENT_PROVIDER')).toBe(true);
    expect(isRetryableErrorClass('USER_ACTION_REQUIRED')).toBe(false);
    expect(isRetryableErrorClass('CONTENT_INVALID')).toBe(false);
    expect(isRetryableErrorClass('PERMANENT_PROVIDER')).toBe(false);
    expect(isRetryableErrorClass('INTERNAL')).toBe(false);
    expect(isRetryableErrorClass('UNKNOWN')).toBe(false);
  });
});
