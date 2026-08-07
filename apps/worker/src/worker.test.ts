import { describe, expect, it } from 'vitest';

import { workerRunFailureCheck } from './worker';

describe('worker runtime health', () => {
  it('marks an unexpected Temporal worker exit as a failing check', () => {
    expect(workerRunFailureCheck()).toMatchObject({
      name: 'temporal.worker_run',
      status: 'fail',
      detail: 'Temporal worker stopped unexpectedly',
    });
  });

  it('does not include transport or provider error details in health output', () => {
    const check = workerRunFailureCheck();

    expect(JSON.stringify(check)).not.toContain('token');
    expect(JSON.stringify(check)).not.toContain('payload');
  });
});
