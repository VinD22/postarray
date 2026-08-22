import { describe, expect, it } from 'vitest';

import {
  MAX_SERVICE_ACCOUNT_LIFETIME_DAYS,
  createServiceAccountSchema,
  serviceAccountDryRunSchema,
} from './service-accounts.schemas';

/**
 * The request boundary. Everything below narrows; nothing widens.
 */

const base = { name: 'Digest agent', scopes: ['drafts:read'] };

describe('createServiceAccountSchema', () => {
  it('defaults every narrowing to "no narrowing", not to "everything"', () => {
    const parsed = createServiceAccountSchema.parse(base);
    expect(parsed.projectIds).toEqual([]);
    expect(parsed.connectionIds).toEqual([]);
    expect(parsed.maxPostsPerDay).toBeNull();
    // The lowest level that can act at all, never the highest.
    expect(parsed.approvalLevel).toBe('level_1_draft');
  });

  it('requires at least one scope', () => {
    expect(createServiceAccountSchema.safeParse({ ...base, scopes: [] }).success).toBe(false);
  });

  it('accepts a null expiry, which the application reads as the maximum', () => {
    expect(createServiceAccountSchema.parse({ ...base, expiresInDays: null }).expiresInDays).toBe(
      null,
    );
    expect(
      createServiceAccountSchema.safeParse({
        ...base,
        expiresInDays: MAX_SERVICE_ACCOUNT_LIFETIME_DAYS + 1,
      }).success,
    ).toBe(false);
  });

  it('rejects an unknown field rather than silently dropping it', () => {
    expect(createServiceAccountSchema.safeParse({ ...base, ipAllowlist: [] }).success).toBe(false);
  });

  it('rejects a malformed time of day', () => {
    expect(
      createServiceAccountSchema.safeParse({ ...base, quietHoursStart: '25:00' }).success,
    ).toBe(false);
  });
});

describe('serviceAccountDryRunSchema', () => {
  it('accepts the arguments a person is about to send, whatever they are', () => {
    const parsed = serviceAccountDryRunSchema.parse({
      tool: 'create_draft',
      args: { projectId: 'project_1', targets: ['conn_1'] },
    });
    expect(parsed.args['projectId']).toBe('project_1');
  });

  it('defaults to no arguments rather than requiring an empty object', () => {
    expect(serviceAccountDryRunSchema.parse({ tool: 'list_connections' }).args).toEqual({});
  });
});
