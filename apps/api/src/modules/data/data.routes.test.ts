import {
  API_HEADERS,
  newIdFor,
  type DataExportView,
  type DeletionRequestView,
} from '@relay/contracts';
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
const requestDeletion = vi.fn();
const currentDeletion = vi.fn();
const getDeletion = vi.fn();
const cancelDeletion = vi.fn();

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

function deletionView(workspaceId: string): DeletionRequestView {
  return {
    id: newIdFor('deletionRequest'),
    workspaceId,
    scope: 'workspace',
    state: 'scheduled',
    executeAfter: '2026-08-14T00:00:00.000Z',
    verifiedAt: null,
    executedAt: null,
    canceledAt: null,
    createdAt: '2026-08-07T00:00:00.000Z',
  };
}

beforeEach(async () => {
  requestExport.mockReset();
  listExports.mockReset();
  getExport.mockReset();
  downloadExport.mockReset();
  requestDeletion.mockReset();
  currentDeletion.mockReset();
  getDeletion.mockReset();
  cancelDeletion.mockReset();
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
      dataLifecycle: {
        ...base.dataLifecycle,
        request: requestDeletion,
        current: currentDeletion,
        get: getDeletion,
        cancel: cancelDeletion,
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

  it('requires step-up proof and forwards owner deletion requests', async () => {
    const session = await seedSession(harness, { mfaSatisfied: true });
    const view = deletionView(session.workspaceId);
    requestDeletion.mockResolvedValue(view);
    currentDeletion.mockResolvedValue(view);
    cancelDeletion.mockResolvedValue({ ...view, state: 'canceled', canceledAt: view.createdAt });

    const created = await request(harness.server)
      .post('/v1/data/deletion-requests')
      .set('cookie', session.cookie)
      .set(API_HEADERS.workspaceId, session.workspaceId)
      .set(API_HEADERS.csrfToken, session.csrfToken)
      .set(API_HEADERS.idempotencyKey, 'delete_test_intent')
      .set('origin', TEST_ORIGIN)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE)
      .send({ scope: 'workspace', confirmation: 'Example workspace' });

    const canceled = await request(harness.server)
      .post(`/v1/data/deletion-requests/${view.id}/cancel`)
      .set('cookie', session.cookie)
      .set(API_HEADERS.workspaceId, session.workspaceId)
      .set(API_HEADERS.csrfToken, session.csrfToken)
      .set(API_HEADERS.idempotencyKey, 'delete_cancel_intent')
      .set('origin', TEST_ORIGIN)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE);

    const current = await request(harness.server)
      .get('/v1/data/deletion-requests')
      .set('cookie', session.cookie)
      .set(API_HEADERS.workspaceId, session.workspaceId)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE);

    expect(created.status).toBe(202);
    expect(canceled.status).toBe(200);
    expect(current.status).toBe(200);
    expect(current.body.id).toBe(view.id);
    expect(requestDeletion).toHaveBeenCalledWith(
      expect.objectContaining({ idempotencyKey: 'delete_test_intent' }),
      { scope: 'workspace', confirmation: 'Example workspace' },
    );
    expect(cancelDeletion).toHaveBeenCalledWith(
      expect.objectContaining({ idempotencyKey: 'delete_cancel_intent' }),
      view.id,
    );
  });
});
