import { describe, expect, it } from 'vitest';

import { ActivitySimulator } from '../testing/activity-simulator.js';
import { makeTarget, makeTargetInput, makePostInput } from '../testing/fixtures.js';
import { TEST_CONTEXT, TEST_EPOCH_MS, runWorkflow } from '../testing/harness.js';
import { publishPostDescriptor } from '../workflows/core/publish-post.core.js';
import { publishTargetDescriptor } from '../workflows/core/publish-target.core.js';

/**
 * The chaos suite.
 *
 * Every scenario in `AGENTS.md` under "duplicate-publication tests are
 * mandatory" has a case here, and every case asserts the same thing: the number
 * of posts that exist at the provider is exactly one.
 *
 * `simulator.provider.createCount` counts posts the provider actually created.
 * `simulator.provider.callCount` counts create calls including ones an
 * idempotency token deduplicated. Asserting on both distinguishes "we never
 * called twice" from "we called twice and got lucky".
 */

const WORKFLOW_ID = 'publish:ws_test:job_1:pv_1';

describe('chaos: worker crash immediately after the provider accepted', () => {
  it('adopts the post the dead attempt created and never creates a second', async () => {
    const run = await runWorkflow(publishTargetDescriptor, makeTargetInput(), {
      workflowId: WORKFLOW_ID,
      simulatorOptions: {
        // The provider created the post, then the worker died before the
        // response was recorded. The next attempt must find it.
        providerScript: [{ kind: 'accept_then_crash' }, { kind: 'publish' }],
      },
    });

    expect(run.simulator.provider.createCount).toBe(1);
    expect(run.output?.state).toBe('published');
    expect(run.output?.externalPostId).toBe('ext_1');
    expect(run.simulator.countOf('publishTarget')).toBe(1);
    expect(run.output?.providerCreateCalls).toBe(1);
  });

  it('adopts through the pre-create probe when the provider has no token', async () => {
    const run = await runWorkflow(publishTargetDescriptor, makeTargetInput(), {
      workflowId: WORKFLOW_ID,
      simulatorOptions: {
        supportsProviderIdempotency: false,
        recreateOnUnknown: true,
        providerScript: [{ kind: 'accept_then_crash' }, { kind: 'publish' }],
      },
    });

    expect(run.simulator.provider.createCount).toBe(1);
    expect(run.simulator.countOf('ensureNotAlreadyPublished')).toBeGreaterThanOrEqual(1);
    expect(run.output?.state).toBe('published');
  });
});

describe('chaos: provider timeout then success', () => {
  it('creates once when the first call times out after the post was made', async () => {
    const run = await runWorkflow(publishTargetDescriptor, makeTargetInput(), {
      workflowId: WORKFLOW_ID,
      simulatorOptions: {
        providerScript: [{ kind: 'accept_then_timeout' }, { kind: 'publish' }],
      },
    });

    expect(run.simulator.provider.createCount).toBe(1);
    expect(run.output?.state).toBe('published');
  });

  it('retries a genuine transient failure and still ends with one post', async () => {
    const run = await runWorkflow(publishTargetDescriptor, makeTargetInput(), {
      workflowId: WORKFLOW_ID,
      simulatorOptions: {
        providerScript: [{ kind: 'transient' }, { kind: 'transient' }, { kind: 'publish' }],
      },
    });

    expect(run.simulator.provider.createCount).toBe(1);
    expect(run.simulator.countOf('publishTarget')).toBe(3);
    expect(run.output?.state).toBe('published');
    expect(run.output?.attempts).toBe(3);
  });

  it('never creates again when the connector forbids recreating on unknown', async () => {
    const run = await runWorkflow(publishTargetDescriptor, makeTargetInput(), {
      workflowId: WORKFLOW_ID,
      simulatorOptions: {
        recreateOnUnknown: false,
        providerScript: [{ kind: 'unknown' }, { kind: 'publish' }],
        probeScript: ['indeterminate'],
      },
    });

    expect(run.simulator.provider.createCount).toBe(0);
    expect(run.simulator.countOf('publishTarget')).toBe(1);
    expect(run.output?.state).toBe('action_required');
    expect(run.output?.messageKey).toBe('publish.could_not_confirm_publication');
  });
});

describe('chaos: duplicated provider webhook', () => {
  it('treats a repeated confirmation as one publication', async () => {
    const confirmation = {
      targetId: 'pv_1',
      attemptId: null,
      externalPostId: 'ext_webhook_1',
      permalink: 'https://example.invalid/p/ext_webhook_1',
      observedAt: new Date(TEST_EPOCH_MS + 5_000).toISOString(),
    };

    const run = await runWorkflow(publishTargetDescriptor, makeTargetInput(), {
      workflowId: WORKFLOW_ID,
      simulatorOptions: {
        confirmsByWebhook: true,
        providerScript: [{ kind: 'processing' }],
        pollScript: [{ kind: 'processing' }],
      },
      signals: [
        {
          afterMs: 1_000,
          apply: (inbox) => {
            inbox.onProviderConfirmation(confirmation);
          },
        },
        {
          // A redelivery of the same event, in the same activation.
          afterMs: 1_000,
          apply: (inbox) => {
            inbox.onProviderConfirmation(confirmation);
          },
        },
        {
          // A different provider event for the same target. The first wins.
          afterMs: 1_000,
          apply: (inbox) => {
            inbox.onProviderConfirmation({ ...confirmation, externalPostId: 'ext_webhook_2' });
          },
        },
      ],
    });

    expect(run.output?.state).toBe('published');
    // The first evidence wins; a redelivery cannot rewrite it.
    expect(run.output?.externalPostId).toBe('ext_webhook_1');
    expect(run.simulator.provider.createCount).toBe(0);
    expect(run.simulator.countOf('publishTarget')).toBe(1);
    expect(run.simulator.countOf('writeReceipt')).toBe(1);
  });

  it('writes exactly one receipt when the write is reached twice', async () => {
    const simulator = new ActivitySimulator({});
    const base = {
      ctx: TEST_CONTEXT,
      publishJobId: 'job_1',
      targetId: 'pv_1',
      connectionId: 'conn_1',
      provider: 'fake' as const,
      contentVersionId: 'cver_1',
      contentVersionChecksum: 'c'.repeat(64),
      capabilityVersion: 'cap-1',
      scheduledInstant: new Date(TEST_EPOCH_MS).toISOString(),
      scheduledLocalTime: '2026-03-01T09:00',
      ianaTimeZone: 'UTC',
      dispatchedAt: new Date(TEST_EPOCH_MS).toISOString(),
      publication: {
        externalPostId: 'ext_1',
        permalink: null,
        publishedAt: new Date(TEST_EPOCH_MS).toISOString(),
        externalAccountId: 'acct_1',
      },
      items: [],
    };
    const first = await simulator.writeReceipt({ ...base, attemptId: 'att_1' });
    const second = await simulator.writeReceipt({ ...base, attemptId: 'att_2' });

    expect(first.created).toBe(true);
    expect(second.created).toBe(false);
    expect(second.receiptId).toBe(first.receiptId);
  });
});

describe('chaos: token revoked at execution time', () => {
  it('stops before any provider call and asks the user to reconnect', async () => {
    const run = await runWorkflow(publishTargetDescriptor, makeTargetInput(), {
      workflowId: WORKFLOW_ID,
      simulatorOptions: {
        revalidation: {
          verdict: 'action_required',
          errorCode: 'CONNECTION_ACTION_REQUIRED',
          messageKey: 'publish.connection_needs_attention',
        },
      },
    });

    expect(run.simulator.provider.createCount).toBe(0);
    expect(run.simulator.provider.callCount).toBe(0);
    expect(run.simulator.countOf('publishTarget')).toBe(0);
    expect(run.simulator.countOf('prepareTargetMedia')).toBe(0);
    expect(run.output?.state).toBe('action_required');
    expect(run.simulator.notifications[0]?.messageKey).toBe('publish.connection_needs_attention');
  });
});

describe('chaos: capability drift at execution time', () => {
  it('requires reapproval instead of publishing something different', async () => {
    const run = await runWorkflow(publishTargetDescriptor, makeTargetInput(), {
      workflowId: WORKFLOW_ID,
      simulatorOptions: {
        revalidation: { verdict: 'needs_reapproval', capabilityDrifted: true },
      },
    });

    expect(run.simulator.provider.createCount).toBe(0);
    expect(run.output?.state).toBe('validation_needed');
    expect(run.output?.messageKey).toBe('publish.capability_changed_reapproval_required');
  });
});

describe('chaos: clock and DST transition', () => {
  // Europe/Berlin moves from CET to CEST at 01:00 UTC on 29 March 2026.
  const beforeDst = Date.parse('2026-03-28T22:00:00.000Z');
  const afterDst = Date.parse('2026-03-29T08:00:00.000Z');

  it('fires at the stored UTC instant regardless of the offset change', async () => {
    const run = await runWorkflow(
      publishPostDescriptor,
      makePostInput({
        executeAt: new Date(afterDst).toISOString(),
        scheduledLocalTime: '2026-03-29T10:00',
        ianaTimeZone: 'Europe/Berlin',
      }),
      { workflowId: 'publish:ws_test:job_1', startMs: beforeDst },
    );

    expect(run.output?.state).toBe('published');
    expect(run.simulator.provider.createCount).toBe(1);
    expect(run.clock.now()).toBeGreaterThanOrEqual(afterDst);
  });

  it('creates once when a reschedule lands during the wait', async () => {
    const run = await runWorkflow(
      publishPostDescriptor,
      makePostInput({ executeAt: new Date(afterDst).toISOString() }),
      {
        workflowId: 'publish:ws_test:job_1',
        startMs: beforeDst,
        signals: [
          {
            afterMs: 60_000,
            apply: (inbox) => {
              inbox.onReschedule({
                instant: new Date(afterDst + 7_200_000).toISOString(),
                ianaTimeZone: 'Europe/Berlin',
                confirmedDst: true,
              });
            },
          },
        ],
      },
    );

    expect(run.simulator.provider.createCount).toBe(1);
    expect(run.clock.now()).toBeGreaterThanOrEqual(afterDst + 7_200_000);
  });
});

describe('chaos: cancellation racing the dispatch', () => {
  it('cancels cleanly when the cancel arrives before any provider call', async () => {
    const run = await runWorkflow(publishTargetDescriptor, makeTargetInput(), {
      workflowId: WORKFLOW_ID,
      signals: [
        {
          afterMs: 0,
          apply: (inbox) => {
            inbox.onCancel({ reason: 'user_requested', requestedAt: '2026-03-01T09:00:00.000Z' });
          },
        },
      ],
    });

    expect(run.simulator.provider.createCount).toBe(0);
    expect(run.output?.state).toBe('canceled');
  });

  it('honours the post and reports the race when the cancel loses', async () => {
    const run = await runWorkflow(publishTargetDescriptor, makeTargetInput(), {
      workflowId: WORKFLOW_ID,
      simulatorOptions: {
        providerScript: [{ kind: 'processing' }],
        pollScript: [{ kind: 'publish' }],
      },
      signals: [
        {
          afterMs: 5_000,
          apply: (inbox) => {
            inbox.onCancel({ reason: 'user_requested', requestedAt: '2026-03-01T09:00:05.000Z' });
          },
        },
      ],
    });

    expect(run.output?.state).toBe('published');
    expect(run.simulator.provider.createCount).toBe(1);
    const messages = run.simulator.notifications.map((entry) => entry.messageKey);
    expect(messages).toContain('publish.canceled_after_publication');
  });

  it('cancels the campaign before the timer fires without touching a provider', async () => {
    const run = await runWorkflow(publishPostDescriptor, makePostInput(), {
      workflowId: 'publish:ws_test:job_1',
      signals: [
        {
          afterMs: 60_000,
          apply: (inbox) => {
            inbox.onCancel({ reason: 'user_requested', requestedAt: '2026-03-01T09:01:00.000Z' });
          },
        },
      ],
    });

    expect(run.output?.state).toBe('canceled');
    expect(run.simulator.provider.createCount).toBe(0);
    expect(run.simulator.countOf('preflightCampaign')).toBe(0);
  });
});

describe('chaos: many targets, one failure', () => {
  it('keeps the successful target and reports partially published', async () => {
    const input = makePostInput({
      immediate: true,
      targets: [
        makeTarget({ targetId: 'pv_a', connectionId: 'conn_a' }),
        makeTarget({ targetId: 'pv_b', connectionId: 'conn_b' }),
      ],
    });
    const run = await runWorkflow(publishPostDescriptor, input, {
      workflowId: 'publish:ws_test:job_1',
      simulatorOptions: {
        providerScript: [{ kind: 'publish' }, { kind: 'permanent' }],
      },
    });

    expect(run.output?.state).toBe('partially_published');
    expect(run.simulator.provider.createCount).toBe(1);
    const states = run.output?.targets.map((target) => target.state) ?? [];
    expect(states).toContain('published');
    expect(states).toContain('failed_permanently');
    expect(run.simulator.targetStates.some((entry) => entry.state === 'canceled')).toBe(false);
  });
});
