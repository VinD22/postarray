import { describe, expect, it } from 'vitest';

import { makeDataExportInput } from '../../testing/fixtures';
import { runWorkflow } from '../../testing/harness';

import { dataExportDescriptor } from './data-export.core';

describe('data export workflow', () => {
  it('builds one export and publishes a completed status', async () => {
    const run = await runWorkflow(dataExportDescriptor, makeDataExportInput(), {
      workflowId: 'export:ws_test:export_1',
    });

    expect(run.output).toEqual({
      exportId: 'export_1',
      state: 'ready',
      byteSize: 128,
      checksumSha256: 'a'.repeat(64),
    });
    expect(run.simulator.countOf('buildDataExport')).toBe(1);
    expect(run.runtime.status()?.state).toBe('completed');
  });

  it('keeps a failed build explicit instead of reporting an empty archive', async () => {
    const run = await runWorkflow(dataExportDescriptor, makeDataExportInput(), {
      workflowId: 'export:ws_test:export_1',
      simulatorOptions: {
        dataExport: { state: 'failed', byteSize: null, checksumSha256: null },
      },
    });
    expect(run.output).toEqual({
      exportId: 'export_1',
      state: 'failed',
      byteSize: null,
      checksumSha256: null,
    });
    expect(run.runtime.status()?.state).toBe('failed');
  });
});
