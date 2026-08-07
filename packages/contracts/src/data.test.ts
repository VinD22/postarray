import { describe, expect, it } from 'vitest';

import { dataExportFormatSchema, dataExportViewSchema } from './data';

describe('data export contracts', () => {
  it('keeps V1 export format honest', () => {
    expect(dataExportFormatSchema.safeParse('json').success).toBe(true);
    expect(dataExportFormatSchema.safeParse('csv').success).toBe(false);
    expect(dataExportFormatSchema.safeParse('media').success).toBe(false);
  });

  it('requires a prefixed export id and explicit availability fields', () => {
    const result = dataExportViewSchema.safeParse({
      id: 'export_01j00000000000000000000000',
      workspaceId: 'ws_01j00000000000000000000000',
      scope: 'workspace',
      format: 'json',
      state: 'ready',
      preparedAt: '2026-08-07T00:00:00.000Z',
      expiresAt: '2026-08-14T00:00:00.000Z',
      byteSize: 42,
      checksumSha256: 'a'.repeat(64),
      downloadUrl: null,
      createdAt: '2026-08-07T00:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });
});
