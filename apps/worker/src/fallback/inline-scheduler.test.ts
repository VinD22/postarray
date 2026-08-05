import { describe, expect, it } from 'vitest';

import { ActivitySimulator } from '../testing/activity-simulator';
import { makeTargetInput } from '../testing/fixtures';
import type { WorkflowLog } from '../runtime/types';
import { publishTargetDescriptor } from '../workflows/core/publish-target.core';

import { InlineScheduler, InlineSchedulerNotPermittedError } from './inline-scheduler';

function silentLog(): WorkflowLog & { readonly lines: string[] } {
  const lines: string[] = [];
  return {
    lines,
    debug: (message: string) => {
      lines.push(message);
    },
    info: (message: string) => {
      lines.push(message);
    },
    warn: (message: string) => {
      lines.push(message);
    },
    error: (message: string) => {
      lines.push(message);
    },
  };
}

function makeScheduler(isProduction = false): {
  scheduler: InlineScheduler;
  simulator: ActivitySimulator;
  log: ReturnType<typeof silentLog>;
} {
  const simulator = new ActivitySimulator({ now: () => Date.now() });
  const log = silentLog();
  const scheduler = new InlineScheduler({
    activities: simulator,
    log,
    isProduction,
    reason: 'TEMPORAL_ADDRESS is not set',
  });
  return { scheduler, simulator, log };
}

describe('InlineScheduler', () => {
  it('refuses to exist in production', () => {
    expect(() => makeScheduler(true)).toThrow(InlineSchedulerNotPermittedError);
  });

  it('runs the same workflow body the durable worker runs', async () => {
    const { scheduler, simulator } = makeScheduler();
    scheduler.start();
    const run = scheduler.startWorkflow(
      publishTargetDescriptor,
      'publish:ws_test:job_1:pv_1',
      makeTargetInput(),
    );
    await run.result();

    expect(simulator.provider.createCount).toBe(1);
    expect(run.status()?.state).toBe('published');
    await scheduler.shutdown();
  });

  it('deduplicates by workflow id, exactly as Temporal does', async () => {
    const { scheduler, simulator } = makeScheduler();
    scheduler.start();
    const first = scheduler.startWorkflow(
      publishTargetDescriptor,
      'publish:ws_test:job_1:pv_1',
      makeTargetInput(),
    );
    const second = scheduler.startWorkflow(
      publishTargetDescriptor,
      'publish:ws_test:job_1:pv_1',
      makeTargetInput(),
    );
    await first.result();

    expect(second).toBe(first);
    expect(scheduler.acceptedWorkflowCount).toBe(1);
    expect(simulator.provider.createCount).toBe(1);
    await scheduler.shutdown();
  });

  it('reports itself as a failing health check, never a warning', () => {
    const { scheduler } = makeScheduler();
    scheduler.start();
    const check = scheduler.healthCheck();
    expect(check.status).toBe('fail');
    expect(check.name).toBe('temporal.inline_fallback');
    expect(check.detail).toContain('TEMPORAL_ADDRESS');
  });

  it('warns on start and on every workflow it accepts', async () => {
    const { scheduler, log } = makeScheduler();
    scheduler.start();
    scheduler.startWorkflow(
      publishTargetDescriptor,
      'publish:ws_test:job_1:pv_1',
      makeTargetInput(),
    );
    expect(log.lines).toContain('worker.inline_scheduler_started');
    expect(log.lines).toContain('worker.inline_workflow_accepted');
    await scheduler.shutdown();
  });

  it('routes a cancel signal to the running workflow', async () => {
    const { scheduler, simulator } = makeScheduler();
    scheduler.start();
    const workflowId = 'publish:ws_test:job_2:pv_1';
    const run = scheduler.startWorkflow(
      publishTargetDescriptor,
      workflowId,
      makeTargetInput({ publishJobId: 'job_2' }),
    );
    expect(scheduler.signal(workflowId, 'cancel', { reason: 'user_requested' })).toBe(true);
    await run.result();
    // The publish had already started, so the post stands and is reported.
    expect(simulator.provider.createCount).toBeLessThanOrEqual(1);
    await scheduler.shutdown();
  });

  it('reports an unknown workflow id rather than pretending to signal it', () => {
    const { scheduler } = makeScheduler();
    scheduler.start();
    expect(scheduler.signal('publish:ws_test:nope', 'cancel')).toBe(false);
  });

  it('stops running after shutdown', async () => {
    const { scheduler } = makeScheduler();
    scheduler.start();
    expect(scheduler.isRunning).toBe(true);
    await scheduler.shutdown();
    expect(scheduler.isRunning).toBe(false);
    expect(scheduler.list()).toHaveLength(0);
  });
});
