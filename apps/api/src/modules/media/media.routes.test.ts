import { API_HEADERS, NotFoundError, newIdFor } from '@relay/contracts';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  TEST_ACCEPT_LANGUAGE,
  TEST_ORIGIN,
  TEST_USER_AGENT,
  createHarness,
  seedSession,
  type Harness,
} from '../../testing/harness';

/**
 * The two local direct-transfer routes.
 *
 * `LocalFileStorage` points its upload ticket back at this API, so without
 * these routes every upload on a developer laptop and in CI PUTs into a 404.
 * The properties defended at the edge are the ones the service cannot see: the
 * scope required to reach each route, and that a malformed key or a missing
 * checksum header never reaches the service at all.
 */

let harness: Harness;
const acceptDirectUpload = vi.fn();
const readObjectForDownload = vi.fn();

const digest = 'a'.repeat(64);
const bytes = Buffer.from([137, 80, 78, 71]);

beforeEach(async () => {
  acceptDirectUpload.mockReset();
  readObjectForDownload.mockReset();
  harness = await createHarness({
    services: (base) => ({
      ...base,
      media: { ...base.media, acceptDirectUpload, readObjectForDownload },
    }),
  });
});

afterEach(async () => {
  await harness.close();
});

describe('local media upload route', () => {
  it('hands the workspace-prefixed key and both declared headers to the service', async () => {
    const session = await seedSession(harness, { scopes: ['media:write'] });
    acceptDirectUpload.mockResolvedValue({ byteSize: bytes.byteLength });

    const response = await request(harness.server)
      .put(`/v1/media/uploads/${session.workspaceId}/${digest}`)
      .set('cookie', session.cookie)
      .set(API_HEADERS.workspaceId, session.workspaceId)
      .set(API_HEADERS.csrfToken, session.csrfToken)
      .set('origin', TEST_ORIGIN)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE)
      .set('content-type', 'image/png')
      .set('x-relay-content-sha256', digest)
      .send(bytes);

    expect(response.status).toBe(200);
    expect(acceptDirectUpload).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        storageKey: `${session.workspaceId}/${digest}`,
        contentType: 'image/png',
        checksumSha256: digest,
      }),
    );
  });

  it('refuses a body with no checksum header before reading it', async () => {
    const session = await seedSession(harness, { scopes: ['media:write'] });

    const response = await request(harness.server)
      .put(`/v1/media/uploads/${session.workspaceId}/${digest}`)
      .set('cookie', session.cookie)
      .set(API_HEADERS.workspaceId, session.workspaceId)
      .set(API_HEADERS.csrfToken, session.csrfToken)
      .set('origin', TEST_ORIGIN)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE)
      .set('content-type', 'image/png')
      .send(bytes);

    expect(response.status).toBe(422);
    expect(acceptDirectUpload).not.toHaveBeenCalled();
  });

  it('refuses a content type outside the upload allowlist', async () => {
    const session = await seedSession(harness, { scopes: ['media:write'] });

    const response = await request(harness.server)
      .put(`/v1/media/uploads/${session.workspaceId}/${digest}`)
      .set('cookie', session.cookie)
      .set(API_HEADERS.workspaceId, session.workspaceId)
      .set(API_HEADERS.csrfToken, session.csrfToken)
      .set('origin', TEST_ORIGIN)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE)
      .set('content-type', 'application/x-msdownload')
      .set('x-relay-content-sha256', digest)
      .send(bytes);

    expect(response.status).toBe(422);
    expect(acceptDirectUpload).not.toHaveBeenCalled();
  });

  it('refuses a key whose digest is not a sha256 rather than passing it through', async () => {
    const session = await seedSession(harness, { scopes: ['media:write'] });

    const response = await request(harness.server)
      .put(`/v1/media/uploads/${session.workspaceId}/not-a-digest`)
      .set('cookie', session.cookie)
      .set(API_HEADERS.workspaceId, session.workspaceId)
      .set(API_HEADERS.csrfToken, session.csrfToken)
      .set('origin', TEST_ORIGIN)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE)
      .set('content-type', 'image/png')
      .set('x-relay-content-sha256', digest)
      .send(bytes);

    expect(response.status).toBe(422);
    expect(acceptDirectUpload).not.toHaveBeenCalled();
  });

  it('is not reachable with the read scope alone', async () => {
    const session = await seedSession(harness, { scopes: ['media:read'] });

    const response = await request(harness.server)
      .put(`/v1/media/uploads/${session.workspaceId}/${digest}`)
      .set('cookie', session.cookie)
      .set(API_HEADERS.workspaceId, session.workspaceId)
      .set(API_HEADERS.csrfToken, session.csrfToken)
      .set('origin', TEST_ORIGIN)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE)
      .set('content-type', 'image/png')
      .set('x-relay-content-sha256', digest)
      .send(bytes);

    expect(response.status).toBe(403);
    expect(acceptDirectUpload).not.toHaveBeenCalled();
  });
});

describe('local media download route', () => {
  it('serves the stored content type and refuses to let a browser sniff it', async () => {
    const session = await seedSession(harness, { scopes: ['media:read'] });
    readObjectForDownload.mockResolvedValue({
      bytes: new Uint8Array(bytes),
      contentType: 'image/png',
    });

    const response = await request(harness.server)
      .get(`/v1/media/objects/${session.workspaceId}/${digest}`)
      .set('cookie', session.cookie)
      .set(API_HEADERS.workspaceId, session.workspaceId)
      .set('origin', TEST_ORIGIN)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('image/png');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['cache-control']).toBe('private, no-store');
  });

  it('reports an expired or deleted object as gone, never as an empty body', async () => {
    const session = await seedSession(harness, { scopes: ['media:read'] });
    readObjectForDownload.mockRejectedValue(
      new NotFoundError({ details: { resource: 'media_asset' } }),
    );

    const response = await request(harness.server)
      .get(`/v1/media/objects/${session.workspaceId}/${digest}`)
      .set('cookie', session.cookie)
      .set(API_HEADERS.workspaceId, session.workspaceId)
      .set('origin', TEST_ORIGIN)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE);

    expect(response.status).toBe(404);
    expect(response.body).not.toEqual({});
  });

  it('refuses a malformed key before the service is reached', async () => {
    const session = await seedSession(harness, { scopes: ['media:read'] });

    const response = await request(harness.server)
      .get(`/v1/media/objects/${session.workspaceId}/${newIdFor('media')}`)
      .set('cookie', session.cookie)
      .set(API_HEADERS.workspaceId, session.workspaceId)
      .set('origin', TEST_ORIGIN)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE);

    expect(response.status).toBe(422);
    expect(readObjectForDownload).not.toHaveBeenCalled();
  });
});
