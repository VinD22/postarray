import { describe, expect, it } from 'vitest';

import type { ChildWorkflowDescriptor } from '../runtime/types';
import { analyticsSyncDescriptor } from '../workflows/core/analytics-sync.core';
import { automationRuleDescriptor } from '../workflows/core/automation-rule.core';
import { bulkImportDescriptor } from '../workflows/core/bulk-import.core';
import { dataDeletionDescriptor } from '../workflows/core/data-deletion.core';
import { dataExportDescriptor } from '../workflows/core/data-export.core';
import { publishPostDescriptor } from '../workflows/core/publish-post.core';
import { publishTargetDescriptor } from '../workflows/core/publish-target.core';
import { repeatPostDescriptor } from '../workflows/core/repeat-post.core';
import { rssPollDescriptor } from '../workflows/core/rss-poll.core';
import { threadSequenceDescriptor } from '../workflows/core/thread-sequence.core';
import { tokenRefreshDescriptor } from '../workflows/core/token-refresh.core';
import { webhookDeliveryDescriptor } from '../workflows/core/webhook-delivery.core';

import {
  makeAnalyticsInput,
  makeBulkImportInput,
  makeDataExportInput,
  makeDeletionInput,
  makePostInput,
  makeRepeatInput,
  makeRssInput,
  makeRuleInput,
  makeTargetInput,
  makeThreadInput,
  makeTokenInput,
  makeWebhookInput,
} from './fixtures';
import { runWorkflow, TEST_EPOCH_MS, type HarnessOptions, type HarnessRun } from './harness';
import { toIsoInstant } from '../runtime/deterministic';
import {
  activityHistory,
  containsSubsequence,
  countActivity,
  describeHistory,
  diffHistories,
} from './replay';

/**
 * Replay tests.
 *
 * Temporal replays a workflow from its own history whenever a worker picks it
 * up again, and the replay must produce byte-identical commands. The recorded
 * history here is the command stream of a first run; the replay is a second run
 * against the same recorded inputs. Any use of `Date.now`, `Math.random`, an
 * unordered collection or a latency-dependent race shows up as a diff.
 *
 * Every workflow in the app has a case. Adding a workflow without adding one
 * here is a review failure, not an oversight.
 */

/**
 * A case closes over its own descriptor and input. Holding them as a union of
 * generic pairs would lose the correlation between the two, so the case carries
 * a thunk instead.
 */
interface ReplayCase {
  readonly name: string;
  run(): Promise<HarnessRun<unknown>>;
}

function replayCase<TInput, TOutput>(
  name: string,
  descriptor: ChildWorkflowDescriptor<TInput, TOutput>,
  input: TInput,
  options: HarnessOptions,
): ReplayCase {
  return { name, run: () => runWorkflow(descriptor, input, options) };
}

const CASES: readonly ReplayCase[] = [
  replayCase('publishPostWorkflow', publishPostDescriptor, makePostInput(), {
    workflowId: 'publish:ws_test:job_1',
  }),
  replayCase('publishTargetWorkflow', publishTargetDescriptor, makeTargetInput(), {
    workflowId: 'publish:ws_test:job_1:pv_1',
    simulatorOptions: {
      providerScript: [{ kind: 'transient' }, { kind: 'processing' }],
      pollScript: [{ kind: 'processing' }, { kind: 'publish' }],
    },
  }),
  replayCase('threadSequenceWorkflow', threadSequenceDescriptor, makeThreadInput(), {
    workflowId: 'thread:ws_test:job_1:pv_1',
  }),
  replayCase('repeatPostWorkflow', repeatPostDescriptor, makeRepeatInput(), {
    workflowId: 'repeat:ws_test:series_1',
  }),
  replayCase('analyticsSyncWorkflow', analyticsSyncDescriptor, makeAnalyticsInput(), {
    workflowId: 'analytics:ws_test:conn_1:receipt_1',
  }),
  replayCase('tokenRefreshWorkflow', tokenRefreshDescriptor, makeTokenInput(), {
    workflowId: 'token:ws_test:conn_1',
    simulatorOptions: { credential: { refreshable: false } },
  }),
  replayCase('rssPollWorkflow', rssPollDescriptor, makeRssInput(), {
    workflowId: 'rss:ws_test:rss_1',
    simulatorOptions: {
      feedScript: [
        {
          changed: false,
          etag: null,
          lastModified: null,
          items: [],
          errorCode: 'PROVIDER_UNAVAILABLE',
        },
      ],
    },
  }),
  replayCase('automationRuleWorkflow', automationRuleDescriptor, makeRuleInput(), {
    workflowId: 'rule:ws_test:rule_1:run_1',
  }),
  replayCase('webhookDeliveryWorkflow', webhookDeliveryDescriptor, makeWebhookInput(), {
    workflowId: 'whd:ws_test:whd_1',
    simulatorOptions: { webhookScript: ['failed', 'failed', 'succeeded'] },
  }),
  replayCase('dataDeletionWorkflow', dataDeletionDescriptor, makeDeletionInput({ graceMs: 0 }), {
    workflowId: 'delete:ws_test:op_delete_1',
  }),
  replayCase('dataExportWorkflow', dataExportDescriptor, makeDataExportInput(), {
    workflowId: 'export:ws_test:export_1',
  }),
  replayCase('bulkImportWorkflow', bulkImportDescriptor, makeBulkImportInput(), {
    workflowId: 'import:ws_test:import_1',
  }),
  replayCase(
    'bulkImportWorkflow applying drafts',
    bulkImportDescriptor,
    makeBulkImportInput({ applyMode: 'drafts' }),
    { workflowId: 'import:ws_test:import_2' },
  ),
  /**
   * A person pauses the campaign twenty minutes before it goes out, then
   * releases it ten minutes later. The wait loop leaves and re-enters its pause
   * branch, which is the case most likely to introduce a latency-dependent
   * race, so it earns a replay case of its own.
   */
  replayCase('publishPostWorkflow held and released', publishPostDescriptor, makePostInput(), {
    workflowId: 'publish:ws_test:job_paused_1',
    signals: [
      { afterMs: 20 * 60_000, apply: (inbox) => inbox.onPause() },
      { afterMs: 30 * 60_000, apply: (inbox) => inbox.onResume() },
    ],
  }),
  /**
   * The same hold, released onto a later instant. This is what a resume with an
   * explicit new time looks like at the workflow boundary: the reschedule lands
   * first, then the release, so the job wakes on the new instant instead of the
   * one that passed while it was held.
   */
  replayCase('publishPostWorkflow released at a new time', publishPostDescriptor, makePostInput(), {
    workflowId: 'publish:ws_test:job_paused_2',
    signals: [
      { afterMs: 10 * 60_000, apply: (inbox) => inbox.onPause() },
      {
        afterMs: 40 * 60_000,
        apply: (inbox) => {
          inbox.onReschedule({
            instant: toIsoInstant(TEST_EPOCH_MS + 7_200_000),
            ianaTimeZone: 'Europe/Berlin',
            confirmedDst: true,
          });
          inbox.onResume();
        },
      },
    ],
  }),
];

describe('replay determinism', () => {
  for (const testCase of CASES) {
    it(`${testCase.name} replays to an identical command stream`, async () => {
      const recorded = await testCase.run();
      const replayed = await testCase.run();

      const mismatches = diffHistories(recorded.commands, replayed.commands);
      expect(mismatches).toEqual([]);
      expect(describeHistory(replayed.commands).length).toBeGreaterThan(0);
    });

    it(`${testCase.name} produces the same virtual end time on replay`, async () => {
      const recorded = await testCase.run();
      const replayed = await testCase.run();
      expect(replayed.clock.now()).toBe(recorded.clock.now());
    });
  }
});

describe('recorded publish history', () => {
  it('follows the sequence the architecture document specifies', async () => {
    const run = await runWorkflow(publishTargetDescriptor, makeTargetInput(), {
      workflowId: 'publish:ws_test:job_1:pv_1',
    });

    expect(
      containsSubsequence(activityHistory(run.commands), [
        'revalidateTarget',
        'prepareTargetMedia',
        'beginPublishAttempt',
        'publishTarget',
        'writeReceipt',
        'emitEvent',
        'scheduleAnalyticsFetches',
      ]),
    ).toBe(true);
  });

  it('calls the provider create exactly once in the recorded history', async () => {
    const run = await runWorkflow(publishTargetDescriptor, makeTargetInput(), {
      workflowId: 'publish:ws_test:job_1:pv_1',
      simulatorOptions: {
        providerScript: [{ kind: 'accept_then_crash' }, { kind: 'publish' }],
      },
    });
    expect(countActivity(run.commands, 'publishTarget')).toBe(1);
  });

  it('starts one child workflow per target', async () => {
    const run = await runWorkflow(publishPostDescriptor, makePostInput(), {
      workflowId: 'publish:ws_test:job_1',
    });
    const children = run.commands.filter((command) => command.kind === 'child');
    expect(children).toHaveLength(1);
    expect(children[0]?.kind === 'child' ? children[0].name : '').toBe('publishTargetWorkflow');
  });

  /**
   * A hold does not dispatch, and a release does not dispatch early.
   *
   * The first case is the one that matters: while the pause flag is set the
   * workflow must sit in its wait loop even after the scheduled instant has
   * come and gone. If it ever leaves early, a person who paused a post would
   * watch it publish anyway, which is the failure this whole feature exists to
   * make impossible.
   */
  it('does not dispatch while it is held, even once the instant has passed', async () => {
    // The fixture is scheduled one hour out. This run is held at ten minutes
    // and released at ninety, so the scheduled instant passes while the pause
    // flag is set. Anything that publishes before the release is a bug that
    // would let a paused post go out anyway.
    const undisturbed = await runWorkflow(publishPostDescriptor, makePostInput(), {
      workflowId: 'publish:ws_test:job_reference',
    });
    const held = await runWorkflow(publishPostDescriptor, makePostInput(), {
      workflowId: 'publish:ws_test:job_held',
      signals: [
        { afterMs: 10 * 60_000, apply: (inbox) => inbox.onPause() },
        { afterMs: 90 * 60_000, apply: (inbox) => inbox.onResume() },
      ],
    });

    const scheduledInstant = TEST_EPOCH_MS + 3_600_000;
    expect(undisturbed.clock.now()).toBeGreaterThanOrEqual(scheduledInstant);
    // The held run finished strictly later, and no earlier than the release.
    expect(held.clock.now()).toBeGreaterThanOrEqual(TEST_EPOCH_MS + 90 * 60_000);
    expect(held.clock.now()).toBeGreaterThan(undisturbed.clock.now());
  });

  it('dispatches exactly once after it is released, never twice', async () => {
    const run = await runWorkflow(publishPostDescriptor, makePostInput(), {
      workflowId: 'publish:ws_test:job_held_then_released',
      signals: [
        { afterMs: 10 * 60_000, apply: (inbox) => inbox.onPause() },
        { afterMs: 90 * 60_000, apply: (inbox) => inbox.onResume() },
      ],
    });
    expect(run.commands.filter((command) => command.kind === 'child')).toHaveLength(1);
    expect(countActivity(run.commands, 'preflightCampaign')).toBe(1);
  });
});

describe('recorded bulk import history', () => {
  it('reads the verdict and stops there when nobody has applied', async () => {
    const run = await runWorkflow(bulkImportDescriptor, makeBulkImportInput(), {
      workflowId: 'import:ws_test:import_dryrun',
    });
    expect(activityHistory(run.commands)).toEqual(['readBulkImportVerdict']);
    expect(countActivity(run.commands, 'applyBulkImportRows')).toBe(0);
    expect(run.output).toMatchObject({ state: 'validated' });
  });

  it('applies only after an explicit mode, and only once', async () => {
    const run = await runWorkflow(
      bulkImportDescriptor,
      makeBulkImportInput({ applyMode: 'drafts' }),
      { workflowId: 'import:ws_test:import_apply' },
    );
    expect(
      containsSubsequence(activityHistory(run.commands), [
        'readBulkImportVerdict',
        'applyBulkImportRows',
      ]),
    ).toBe(true);
    expect(countActivity(run.commands, 'applyBulkImportRows')).toBe(1);
    expect(run.output).toMatchObject({ state: 'applied' });
  });
});

describe('recorded export and deletion histories', () => {
  it('runs export as a single build activity with a completed status', async () => {
    const run = await runWorkflow(dataExportDescriptor, makeDataExportInput(), {
      workflowId: 'export:ws_test:export_replay',
    });
    expect(countActivity(run.commands, 'buildDataExport')).toBe(1);
    expect(run.output).toMatchObject({ state: 'ready' });
  });

  it('walks deletion through cancel, revoke, storage and finalize', async () => {
    const run = await runWorkflow(dataDeletionDescriptor, makeDeletionInput({ graceMs: 0 }), {
      workflowId: 'delete:ws_test:op_delete_replay',
    });
    expect(
      containsSubsequence(activityHistory(run.commands), [
        'loadDeletionScope',
        'cancelScheduledJob',
        'revokeProviderConnection',
        'deleteStoredObjects',
        'tombstoneAnalytics',
        'finalizeDeletion',
      ]),
    ).toBe(true);
    expect(run.output?.status).toBe('completed');
  });
});

describe('diffHistories', () => {
  it('reports the first divergent index', () => {
    const mismatches = diffHistories(
      [
        { kind: 'activity', name: 'a', digest: '{}' },
        { kind: 'sleep', ms: 10 },
      ],
      [
        { kind: 'activity', name: 'a', digest: '{}' },
        { kind: 'sleep', ms: 20 },
      ],
    );
    expect(mismatches).toHaveLength(1);
    expect(mismatches[0]?.index).toBe(1);
    expect(mismatches[0]?.recorded).toBe('sleep:10');
    expect(mismatches[0]?.replayed).toBe('sleep:20');
  });

  it('reports a truncated replay', () => {
    const mismatches = diffHistories([{ kind: 'sleep', ms: 10 }], []);
    expect(mismatches[0]?.replayed).toBe('<end of history>');
  });
});

describe('containsSubsequence', () => {
  it('allows unrelated entries between the expected ones', () => {
    expect(containsSubsequence(['a', 'x', 'b', 'y', 'c'], ['a', 'b', 'c'])).toBe(true);
  });

  it('rejects a wrong order', () => {
    expect(containsSubsequence(['b', 'a'], ['a', 'b'])).toBe(false);
  });
});
