import { describe, expect, it } from 'vitest';

import {
  makePostInput,
  makeTarget,
  makeTargetInput,
  makeThreadInput,
} from '../../testing/fixtures.js';
import { TEST_EPOCH_MS, runWorkflow } from '../../testing/harness.js';

import { classifyThrownPublish, errorCodeOf, publishTargetDescriptor } from './publish-target.core.js';
import { publishPostDescriptor } from './publish-post.core.js';
import { threadSequenceDescriptor } from './thread-sequence.core.js';

const TARGET_WORKFLOW_ID = 'publish:ws_test:job_1:pv_1';
const CAMPAIGN_WORKFLOW_ID = 'publish:ws_test:job_1';

describe('publish target: the happy path', () => {
  it('revalidates, prepares media, publishes, writes a receipt and schedules analytics', async () => {
    const run = await runWorkflow(publishTargetDescriptor, makeTargetInput(), {
      workflowId: TARGET_WORKFLOW_ID,
    });

    expect(run.output?.state).toBe('published');
    expect(run.output?.receiptId).toBe('receipt_1');
    const names = run.simulator.calls.map((call) => call.name);
    expect(names.indexOf('revalidateTarget')).toBeLessThan(names.indexOf('prepareTargetMedia'));
    expect(names.indexOf('prepareTargetMedia')).toBeLessThan(names.indexOf('publishTarget'));
    expect(names.indexOf('publishTarget')).toBeLessThan(names.indexOf('writeReceipt'));
    expect(names).toContain('scheduleAnalyticsFetches');
  });

  it('records an attempt before the create call, never after', async () => {
    const run = await runWorkflow(publishTargetDescriptor, makeTargetInput(), {
      workflowId: TARGET_WORKFLOW_ID,
    });
    const names = run.simulator.calls.map((call) => call.name);
    expect(names.indexOf('beginPublishAttempt')).toBeLessThan(names.indexOf('publishTarget'));
  });

  it('emits post.published exactly once with a stable dedupe key', async () => {
    const run = await runWorkflow(publishTargetDescriptor, makeTargetInput(), {
      workflowId: TARGET_WORKFLOW_ID,
    });
    const published = run.simulator.emittedEvents.filter(
      (event) => event.event === 'post.published',
    );
    expect(published).toHaveLength(1);
    expect(published[0]?.dedupeKey).toBe('job_1:pv_1:published');
  });

  it('answers the status query with the current state', async () => {
    const run = await runWorkflow(publishTargetDescriptor, makeTargetInput(), {
      workflowId: TARGET_WORKFLOW_ID,
    });
    const status = run.runtime.status();
    expect(status?.state).toBe('published');
    expect(status?.targets[0]?.externalPostId).toBe('ext_1');
  });
});

describe('publish target: failure classification', () => {
  it('fails permanently when the provider refuses the content', async () => {
    const run = await runWorkflow(publishTargetDescriptor, makeTargetInput(), {
      workflowId: TARGET_WORKFLOW_ID,
      simulatorOptions: { providerScript: [{ kind: 'permanent' }] },
    });
    expect(run.output?.state).toBe('failed_permanently');
    expect(run.simulator.countOf('publishTarget')).toBe(1);
  });

  it('stops after the attempt budget rather than retrying forever', async () => {
    const run = await runWorkflow(publishTargetDescriptor, makeTargetInput(), {
      workflowId: TARGET_WORKFLOW_ID,
      simulatorOptions: { providerScript: [{ kind: 'transient' }] },
    });
    expect(run.output?.state).toBe('failed_permanently');
    expect(run.output?.attempts).toBe(4);
    expect(run.output?.messageKey).toBe('publish.attempts_exhausted');
  });

  it('goes to action_required when the provider never finishes processing', async () => {
    const run = await runWorkflow(publishTargetDescriptor, makeTargetInput(), {
      workflowId: TARGET_WORKFLOW_ID,
      simulatorOptions: {
        providerScript: [{ kind: 'processing' }],
        pollScript: [{ kind: 'processing' }],
      },
    });
    expect(run.output?.state).toBe('action_required');
    expect(run.output?.messageKey).toBe('publish.provider_still_processing');
    expect(run.simulator.provider.createCount).toBe(0);
  });
});

describe('classifyThrownPublish', () => {
  it('treats an unrecognised failure as unknown so a probe runs', () => {
    expect(classifyThrownPublish(new Error('socket hang up')).outcome).toBe('unknown');
  });

  it('treats a refused content error as permanent', () => {
    const error = Object.assign(new Error('bad'), { code: 'CONTENT_INVALID' });
    expect(classifyThrownPublish(error).outcome).toBe('permanent');
  });

  it('treats a revoked grant as user fixable', () => {
    const error = Object.assign(new Error('nope'), { type: 'CONNECTION_ACTION_REQUIRED' });
    expect(classifyThrownPublish(error).outcome).toBe('action_required');
  });

  it('reads a code carried on the cause chain', () => {
    const inner = Object.assign(new Error('inner'), { code: 'MEDIA_TOO_LARGE' });
    const outer = new Error('outer', { cause: inner });
    expect(errorCodeOf(outer)).toBe('MEDIA_TOO_LARGE');
  });

  it('returns null when nothing recognisable is present', () => {
    expect(errorCodeOf({ code: 'NOT_A_RELAY_CODE' })).toBeNull();
    expect(errorCodeOf('a string')).toBeNull();
  });
});

describe('thread sequence', () => {
  it('publishes items in order, each after its own delay', async () => {
    const run = await runWorkflow(threadSequenceDescriptor, makeThreadInput(), {
      workflowId: 'thread:ws_test:job_1:pv_1',
    });

    expect(run.output?.failedCount).toBe(0);
    expect(run.output?.items.map((item) => item.order)).toEqual([1, 2]);
    // 60s then a further 120s of virtual time.
    expect(run.clock.now()).toBe(TEST_EPOCH_MS + 180_000);
  });

  it('chains each item onto the previous published item', async () => {
    const run = await runWorkflow(threadSequenceDescriptor, makeThreadInput(), {
      workflowId: 'thread:ws_test:job_1:pv_1',
    });
    const externalIds = run.output?.items.map((item) => item.externalPostId) ?? [];
    expect(externalIds).toEqual(['ext_1', 'ext_2']);
  });

  it('does not fail the root post when a comment fails', async () => {
    const run = await runWorkflow(threadSequenceDescriptor, makeThreadInput(), {
      workflowId: 'thread:ws_test:job_1:pv_1',
      simulatorOptions: { sequenceScript: [{ kind: 'permanent' }] },
    });

    expect(run.output?.rootExternalPostId).toBe('ext_root');
    expect(run.output?.failedCount).toBe(2);
    const events = run.simulator.emittedEvents.map((event) => event.event);
    expect(events).toContain('comment.failed');
    expect(events).not.toContain('post.failed');
  });

  it('never recreates an item whose outcome is unknown', async () => {
    const run = await runWorkflow(threadSequenceDescriptor, makeThreadInput(), {
      workflowId: 'thread:ws_test:job_1:pv_1',
      simulatorOptions: { sequenceScript: [{ kind: 'unknown' }] },
    });
    // Two items, one attempt each, no retry on an unknown outcome.
    expect(run.simulator.countOf('publishSequenceItem')).toBe(2);
    expect(run.output?.items.every((item) => item.state === 'action_required')).toBe(true);
  });
});

describe('publish target with a sequence', () => {
  it('reports partially published when the root lands and a comment does not', async () => {
    const input = makeTargetInput({
      target: makeTarget({ threadItemIds: ['cmt_1'], threadDelaysSeconds: [30] }),
    });
    const run = await runWorkflow(publishTargetDescriptor, input, {
      workflowId: TARGET_WORKFLOW_ID,
      simulatorOptions: {
        providerScript: [{ kind: 'publish' }],
        sequenceScript: [{ kind: 'permanent' }],
      },
    });

    expect(run.output?.state).toBe('partially_published');
    expect(run.output?.externalPostId).toBe('ext_1');
    expect(run.output?.failedSequenceItemIds).toEqual(['cmt_1']);
    const events = run.simulator.emittedEvents.map((event) => event.event);
    expect(events).toContain('post.partially_published');
  });
});

describe('publish campaign', () => {
  it('waits for the instant then dispatches every target', async () => {
    const input = makePostInput({
      targets: [makeTarget({ targetId: 'pv_a' }), makeTarget({ targetId: 'pv_b' })],
    });
    const run = await runWorkflow(publishPostDescriptor, input, {
      workflowId: CAMPAIGN_WORKFLOW_ID,
    });

    expect(run.output?.state).toBe('published');
    expect(run.output?.targets).toHaveLength(2);
    expect(run.simulator.provider.createCount).toBe(2);
    expect(run.clock.now()).toBeGreaterThanOrEqual(Date.parse(input.executeAt));
  });

  it('stops on a blocking preflight without starting any child', async () => {
    const run = await runWorkflow(publishPostDescriptor, makePostInput(), {
      workflowId: CAMPAIGN_WORKFLOW_ID,
      simulatorOptions: { preflight: { verdict: 'blocked' } },
    });

    expect(run.output?.state).toBe('failed_permanently');
    expect(run.simulator.countOf('revalidateTarget')).toBe(0);
    expect(run.simulator.provider.createCount).toBe(0);
  });

  it('skips a blocked target and still runs the rest', async () => {
    const input = makePostInput({
      targets: [makeTarget({ targetId: 'pv_a' }), makeTarget({ targetId: 'pv_b' })],
    });
    const run = await runWorkflow(publishPostDescriptor, input, {
      workflowId: CAMPAIGN_WORKFLOW_ID,
      simulatorOptions: { preflight: { blockedTargetIds: ['pv_b'] } },
    });

    expect(run.simulator.provider.createCount).toBe(1);
    expect(run.output?.state).toBe('partially_published');
    const blocked = run.output?.targets.find((target) => target.targetId === 'pv_b');
    expect(blocked?.state).toBe('action_required');
  });

  it('holds a paused campaign until it is resumed', async () => {
    const input = makePostInput();
    const run = await runWorkflow(publishPostDescriptor, input, {
      workflowId: CAMPAIGN_WORKFLOW_ID,
      signals: [
        { afterMs: 60_000, apply: (inbox) => { inbox.onPause(); } },
        { afterMs: 7_200_000, apply: (inbox) => { inbox.onResume(); } },
      ],
    });

    expect(run.output?.state).toBe('published');
    // The pause held it past the original instant.
    expect(run.clock.now()).toBeGreaterThanOrEqual(TEST_EPOCH_MS + 7_200_000);
  });

  it('publishes immediately when the job is a publish now', async () => {
    const run = await runWorkflow(publishPostDescriptor, makePostInput({ immediate: true }), {
      workflowId: CAMPAIGN_WORKFLOW_ID,
    });
    expect(run.output?.state).toBe('published');
    expect(run.clock.now()).toBe(TEST_EPOCH_MS);
  });
});
