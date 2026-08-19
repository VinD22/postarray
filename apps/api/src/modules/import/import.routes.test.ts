import { API_HEADERS, newIdFor, type BulkImportReport } from '@relay/contracts';
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
 * Bulk import transport behaviour.
 *
 * The two things worth defending at the edge are that an upload creates
 * nothing, and that scheduling is not reachable from the scope that only lets a
 * caller write drafts. Both are properties of the routes rather than of the
 * service, so both are asserted here.
 */

let harness: Harness;
const upload = vi.fn();
const apply = vi.fn();
const errorReport = vi.fn();

function reportFor(workspaceId: string, projectId: string): BulkImportReport {
  return {
    job: {
      id: newIdFor('bulkImportJob'),
      workspaceId,
      projectId,
      state: 'validated',
      filename: 'posts.csv',
      manifestChecksum: 'a'.repeat(64),
      byteSize: 128,
      parserVersion: '2026-08-10.1',
      options: { allowPastSchedules: false },
      counts: { total: 2, valid: 2, invalid: 0, applied: 0, failed: 0, skipped: 0 },
      appliedMode: null,
      appliedAt: null,
      errorReportAvailable: false,
      createdAt: '2026-08-10T09:00:00.000Z',
    },
    columns: { present: [], missingRequired: [], unrecognized: [] },
    manifestIssues: [],
  };
}

beforeEach(async () => {
  upload.mockReset();
  apply.mockReset();
  errorReport.mockReset();
  harness = await createHarness({
    services: (base) => ({
      ...base,
      bulkImports: { ...base.bulkImports, upload, apply, errorReport },
    }),
  });
});

afterEach(async () => {
  await harness.close();
});

describe('bulk import routes', () => {
  it('accepts a manifest under the draft write scope and reports without applying', async () => {
    const session = await seedSession(harness, { scopes: ['drafts:write'] });
    const projectId = newIdFor('project');
    upload.mockResolvedValue(reportFor(session.workspaceId, projectId));

    const response = await request(harness.server)
      .post('/v1/imports')
      .set('cookie', session.cookie)
      .set(API_HEADERS.workspaceId, session.workspaceId)
      .set(API_HEADERS.csrfToken, session.csrfToken)
      .set(API_HEADERS.idempotencyKey, 'import_test_intent')
      .set('origin', TEST_ORIGIN)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE)
      .send({
        projectId,
        filename: 'posts.csv',
        content: 'external_row_id\nr1\n',
      });

    expect(response.status).toBe(201);
    expect(response.body.job.appliedMode).toBeNull();
    expect(response.body.job.appliedAt).toBeNull();
    expect(apply).not.toHaveBeenCalled();
    expect(upload).toHaveBeenCalledWith(
      expect.objectContaining({ idempotencyKey: 'import_test_intent' }),
      expect.objectContaining({ projectId, filename: 'posts.csv' }),
    );
  });

  it('applies as drafts and never asks the caller which mode to use', async () => {
    const session = await seedSession(harness, { scopes: ['drafts:write'] });
    const report = reportFor(session.workspaceId, newIdFor('project'));
    apply.mockResolvedValue({
      ...report,
      job: { ...report.job, state: 'applied', appliedMode: 'drafts' },
    });

    const response = await request(harness.server)
      .post(`/v1/imports/${report.job.id}/apply`)
      .set('cookie', session.cookie)
      .set(API_HEADERS.workspaceId, session.workspaceId)
      .set(API_HEADERS.csrfToken, session.csrfToken)
      .set(API_HEADERS.idempotencyKey, 'import_apply_intent')
      .set('origin', TEST_ORIGIN)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE)
      .send({ mode: 'scheduled' });

    expect(response.status).toBe(200);
    expect(apply).toHaveBeenCalledWith(expect.anything(), {
      importJobId: report.job.id,
      mode: 'drafts',
    });
  });

  it('refuses the scheduling route to a caller that may only write drafts', async () => {
    const session = await seedSession(harness, { scopes: ['drafts:write'] });
    const importJobId = newIdFor('bulkImportJob');

    const response = await request(harness.server)
      .post(`/v1/imports/${importJobId}/schedule`)
      .set('cookie', session.cookie)
      .set(API_HEADERS.workspaceId, session.workspaceId)
      .set(API_HEADERS.csrfToken, session.csrfToken)
      .set(API_HEADERS.idempotencyKey, 'import_schedule_intent')
      .set('origin', TEST_ORIGIN)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE)
      .send({});

    expect(response.status).toBe(403);
    expect(apply).not.toHaveBeenCalled();
  });

  it('serves the error report as a downloadable CSV of keys', async () => {
    const session = await seedSession(harness, { scopes: ['drafts:read'] });
    const importJobId = newIdFor('bulkImportJob');
    errorReport.mockResolvedValue({
      filename: `import-errors-${importJobId}.csv`,
      csv: 'external_row_id,line,column,error_key,error_values\r\n"r1","2","media","import.error.mediaNotFound","{}"\r\n',
    });

    const response = await request(harness.server)
      .get(`/v1/imports/${importJobId}/errors.csv`)
      .set('cookie', session.cookie)
      .set(API_HEADERS.workspaceId, session.workspaceId)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/csv');
    expect(response.headers['content-disposition']).toBe(
      `attachment; filename="import-errors-${importJobId}.csv"`,
    );
    expect(response.text).toContain('import.error.mediaNotFound');
  });
});
