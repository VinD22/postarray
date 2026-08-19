import { newIdFor } from '@relay/contracts';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createHarness, seedApiKey, type Harness } from '../testing/harness';

/**
 * Idempotency, over HTTP.
 *
 * The property under test is the one that stops a client timeout from becoming
 * a double publication: a retry with the same key and the same body returns the
 * first response and does not run the handler again.
 */

let harness: Harness;
let created = 0;

beforeEach(async () => {
  created = 0;
  harness = await createHarness({
    services: (base) => ({
      ...base,
      projects: {
        ...base.projects,
        create: () => {
          created += 1;
          return Promise.resolve({
            id: newIdFor('project'),
            workspaceId: newIdFor('workspace'),
            name: `Acme ${created}`,
            slug: `acme-${created}`,
            voice: null,
            audience: null,
            approvedClaims: [],
            blockedTerms: [],
            domains: [],
            defaultTimeZone: 'Europe/Berlin',
            defaultShortLinkOn: false,
            rememberTargetsEnabled: false,
            archived: false,
            connectionIds: [],
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
          });
        },
      },
    }),
  });
});

afterEach(async () => {
  await harness.close();
});

const body = { name: 'Acme', ianaTimeZone: 'Europe/Berlin' };

async function createProject(
  key: string | undefined,
  payload: Record<string, unknown>,
  secret: string,
): Promise<request.Response> {
  const call = request(harness.server).post('/v1/projects').set('authorization', `Bearer ${secret}`);
  if (key !== undefined) {
    call.set('idempotency-key', key);
  }
  return call.send(payload);
}

describe('idempotency', () => {
  it('requires an Idempotency-Key on a create', async () => {
    const key = await seedApiKey(harness, { scopes: ['accounts:write'] });

    const response = await createProject(undefined, body, key.secret);

    expect(response.status).toBe(422);
    expect(response.body.code).toBe('VALIDATION_FAILED');
    expect(response.body.detail).toMatchObject({ header: 'idempotency-key', reason: 'required' });
    expect(created).toBe(0);
  });

  it('replays the stored response and does not run the handler twice', async () => {
    const key = await seedApiKey(harness, { scopes: ['accounts:write'] });

    const first = await createProject('idem-replay-1', body, key.secret);
    const second = await createProject('idem-replay-1', body, key.secret);

    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    expect(second.body).toEqual(first.body);
    expect(second.headers['x-relay-idempotent-replay']).toBe('true');
    // The whole point: one key, one external effect.
    expect(created).toBe(1);
  });

  it('rejects the same key with a different body rather than overwriting', async () => {
    const key = await seedApiKey(harness, { scopes: ['accounts:write'] });

    await createProject('idem-mismatch-1', body, key.secret);
    const conflicting = await createProject(
      'idem-mismatch-1',
      { ...body, name: 'Something else entirely' },
      key.secret,
    );

    expect(conflicting.status).toBe(409);
    expect(conflicting.body.code).toBe('IDEMPOTENCY_MISMATCH');
    expect(created).toBe(1);
  });

  it('scopes keys to the workspace, so two tenants may use the same key', async () => {
    const first = await seedApiKey(harness, { scopes: ['accounts:write'] });
    const second = await seedApiKey(harness, { scopes: ['accounts:write'] });

    const one = await createProject('shared-key', body, first.secret);
    const two = await createProject('shared-key', body, second.secret);

    expect(one.status).toBe(201);
    expect(two.status).toBe(201);
    // Different tenants, so both requests really execute.
    expect(created).toBe(2);
  });

  it('does not reserve a key for a request that failed', async () => {
    const key = await seedApiKey(harness, { scopes: ['accounts:write'] });

    const rejected = await createProject('idem-retry-1', { name: '' }, key.secret);
    expect(rejected.status).toBe(422);

    const retried = await createProject('idem-retry-1', body, key.secret);
    expect(retried.status).toBe(201);
    expect(created).toBe(1);
  });

  it('treats the same key on a different route as a mismatch', async () => {
    const key = await seedApiKey(harness, {
      scopes: ['accounts:write', 'drafts:write'],
    });

    await createProject('idem-cross-route', body, key.secret);
    const other = await request(harness.server)
      .post('/v1/content')
      .set('authorization', `Bearer ${key.secret}`)
      .set('idempotency-key', 'idem-cross-route')
      .send({
        projectId: newIdFor('project'),
        master: {
          projectId: null,
          campaignId: null,
          title: null,
          body: 'hello',
          contentKind: 'text',
          locale: 'en',
        },
      });

    expect(other.status).toBe(409);
    expect(other.body.code).toBe('IDEMPOTENCY_MISMATCH');
  });
});
