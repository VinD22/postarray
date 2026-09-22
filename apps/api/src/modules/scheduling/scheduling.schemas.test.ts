import { newIdFor } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { OPERATIONS } from '../../openapi/catalog';
import { commitPreviewSchema } from '../publishing/publishing.schemas';
import { scheduleRequestSchema } from './scheduling.schemas';

const SPEC = {
  instant: '2026-06-06T10:00:00.000Z',
  ianaTimeZone: 'Europe/London',
  repeat: null,
} as const;

describe('schedule request', () => {
  it('accepts a confirmation and a connection filter', () => {
    const parsed = scheduleRequestSchema.safeParse({
      contentItemId: newIdFor('contentItem'),
      scheduleSpec: SPEC,
      confirmation: {
        acknowledgedTargetCount: 1,
        acknowledgedVersionChecksum: 'a'.repeat(64),
        acknowledgedEscalations: ['first_use_connection'],
      },
      connectionIds: [newIdFor('connection')],
    });
    expect(parsed.success).toBe(true);
  });

  it('still accepts the original body with neither', () => {
    expect(
      scheduleRequestSchema.safeParse({
        contentItemId: newIdFor('contentItem'),
        scheduleSpec: SPEC,
      }).success,
    ).toBe(true);
  });

  it('refuses an empty connection filter rather than reading it as every target', () => {
    expect(
      scheduleRequestSchema.safeParse({
        contentItemId: newIdFor('contentItem'),
        scheduleSpec: SPEC,
        connectionIds: [],
      }).success,
    ).toBe(false);
  });
});

describe('commit preview request', () => {
  it('needs a time for a schedule preview, and not for publish now', () => {
    expect(commitPreviewSchema.safeParse({ kind: 'schedule' }).success).toBe(false);
    expect(
      commitPreviewSchema.safeParse({ kind: 'schedule', scheduledAt: SPEC.instant }).success,
    ).toBe(true);
    expect(commitPreviewSchema.safeParse({ kind: 'publish_now' }).success).toBe(true);
  });

  it('is documented in the OpenAPI catalog', () => {
    expect(
      OPERATIONS.some((operation) => operation.path === '/v1/content/{id}/commit-preview'),
    ).toBe(true);
  });
});
