import { API_HEADERS, newIdFor, type DataExportView } from '@relay/contracts';
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

let harness: Harness;
const requestExport = vi.fn();
const listExports = vi.fn();
const getExport = vi.fn();
const downloadExport = vi.fn();

function exportView(workspaceId: string): DataExportView {
  return {
    id: newIdFor('dataExport'),
    workspaceId,
    scope: 'workspace',
    format: 'json',
    state: 'requested',
    preparedAt: null,
    expiresAt: null,
    byteSize: null,
    checksumSha256: null,
    downloadUrl: null,
    createdAt: '2026-08-07T00:00:00.000Z',
  };
}

beforeEach(async () => {
  requestExport.mockReset();
  listExports.mockReset();
  getExport.mockReset();
  downloadExport.mockReset();
  harness = await createHarness({
    services: (base) => ({
      ...base,
      dataExports: {
        ...base.dataExports,
        request: requestExport,
        list: listExports,
        get: getExport,
        download: downloadExport,
      },
    }),
  });
});

afterEach(async () => {
  await harness.close();
});

describe('data export routes', () => {
  it('requires the analytics read scope and forwards the idempotency key', async () => {
    const session = await seedSession(harness, { scopes: ['analytics:read'] });
    const view = exportView(session.workspaceId);
    requestExport.mockResolvedValue(view);
    listExports.mockResolvedValue({
      data: [view],
      pageInfo: { nextCursor: null, hasMore: false, limit: 25 },
    });

    const created = await request(harness.server)
      .post('/v1/data/exports')
      .set('cookie', session.cookie)
      .set(API_HEADERS.workspaceId, session.workspaceId)
      .set(API_HEADERS.csrfToken, session.csrfToken)
      .set(API_HEADERS.idempotencyKey, 'export_test_intent')
      .set('origin', TEST_ORIGIN)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE)
      .send({ format: 'json', scope: 'workspace' });

    const listed = await request(harness.server)
      .get('/v1/data/exports')
      .set('cookie', session.cookie)
      .set(API_HEADERS.workspaceId, session.workspaceId)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE);

    expect(created.status).toBe(202);
    expect(created.body.id).toBe(view.id);
    expect(listed.status).toBe(200);
    expect(requestExport).toHaveBeenCalledWith(
      expect.objectContaining({ idempotencyKey: 'export_test_intent' }),
      { format: 'json', scope: 'workspace' },
    );
  });
});
