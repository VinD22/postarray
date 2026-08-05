import { describe, expect, it } from 'vitest';

import {
  makeAnalyticsInput,
  makeDeletionInput,
  makeRepeatInput,
  makeRssInput,
  makeRuleInput,
  makeTokenInput,
  makeWebhookInput,
} from '../../testing/fixtures';
import { TEST_EPOCH_MS, runWorkflow } from '../../testing/harness';

import { analyticsSyncDescriptor, offsetsForProvider } from './analytics-sync.core';
import { automationRuleDescriptor } from './automation-rule.core';
import { dataDeletionDescriptor } from './data-deletion.core';
import { repeatPostDescriptor } from './repeat-post.core';
import { failureBackoffMs, rssPollDescriptor } from './rss-poll.core';
import { refreshWaitMs, tokenRefreshDescriptor } from './token-refresh.core';
import { webhookDeliveryDescriptor } from './webhook-delivery.core';

describe('repeat series', () => {
  it('creates a separate job and its own receipt for each occurrence', async () => {
    const run = await runWorkflow(repeatPostDescriptor, makeRepeatInput(), {
      workflowId: 'repeat:ws_test:series_1',
      simulatorOptions: {
        occurrenceTargets: [
          {
            targetId: 'pv_1',
            connectionId: 'conn_1',
            provider: 'fake',
            approvedCapabilityVersion: 'cap-1',
            threadItemIds: [],
          },
        ],
      },
    });

    expect(run.simulator.countOf('createOccurrenceJob')).toBe(1);
    expect(run.simulator.countOf('writeReceipt')).toBe(1);
    // The series continues rather than completing after one occurrence.
    expect(run.continuedAsNew).not.toBeNull();
  });

  it('stops when the plan says the series is over', async () => {
    const run = await runWorkflow(repeatPostDescriptor, makeRepeatInput(), {
      workflowId: 'repeat:ws_test:series_1',
      simulatorOptions: {
        repeatPlan: { shouldRun: false, reasonKey: 'repeat.series_reached_end_date' },
      },
    });

    expect(run.output?.stoppedReasonKey).toBe('repeat.series_reached_end_date');
    expect(run.simulator.countOf('createOccurrenceJob')).toBe(0);
  });

  it('stops when the occurrence count is reached', async () => {
    const run = await runWorkflow(
      repeatPostDescriptor,
      makeRepeatInput({ count: 1, occurrenceIndex: 0, completedOccurrences: 0 }),
      { workflowId: 'repeat:ws_test:series_1' },
    );

    expect(run.output?.stoppedReasonKey).toBe('repeat.series_reached_count');
    expect(run.continuedAsNew).toBeNull();
  });

  it('cancels the whole series on a cancel signal', async () => {
    const run = await runWorkflow(repeatPostDescriptor, makeRepeatInput(), {
      workflowId: 'repeat:ws_test:series_1',
      signals: [
        {
          afterMs: 0,
          apply: (inbox) => {
            inbox.onCancel({ reason: 'user', requestedAt: '2026-03-01T09:00:00.000Z' });
          },
        },
      ],
    });

    expect(run.output?.stoppedReasonKey).toBe('repeat.series_canceled');
    expect(run.simulator.countOf('planRepeatOccurrence')).toBe(0);
  });
});

describe('analytics sync', () => {
  it('uses provider appropriate offsets', () => {
    expect(offsetsForProvider('youtube')[0]).toBe(3_600_000);
    expect(offsetsForProvider('fake')[0]).toBe(900_000);
  });

  it('runs one fetch per offset then stops for a post level sync', async () => {
    const run = await runWorkflow(analyticsSyncDescriptor, makeAnalyticsInput(), {
      workflowId: 'analytics:ws_test:conn_1:receipt_1',
    });

    expect(run.simulator.countOf('fetchPostMetrics')).toBe(2);
    expect(run.output?.stoppedReasonKey).toBe('analytics.history_window_exhausted');
    expect(run.output?.observedCount).toBe(6);
  });

  it('applies jitter, so two connections do not fire together', async () => {
    const first = await runWorkflow(analyticsSyncDescriptor, makeAnalyticsInput(), {
      workflowId: 'analytics:ws_test:conn_1',
    });
    const second = await runWorkflow(
      analyticsSyncDescriptor,
      makeAnalyticsInput({ connectionId: 'conn_2' }),
      { workflowId: 'analytics:ws_test:conn_2' },
    );
    expect(first.clock.now()).not.toBe(second.clock.now());
  });

  it('never reports a missing metric as zero', async () => {
    const run = await runWorkflow(analyticsSyncDescriptor, makeAnalyticsInput(), {
      workflowId: 'analytics:ws_test:conn_1:receipt_1',
      simulatorOptions: { metrics: { observedCount: 0, unavailableCount: 4 } },
    });
    expect(run.output?.observedCount).toBe(0);
    expect(run.output?.unavailableCount).toBe(8);
    // Nothing was emitted, because nothing was actually observed.
    expect(run.simulator.emittedEvents).toHaveLength(0);
  });

  it('rolls the history over for an account level sync', async () => {
    const run = await runWorkflow(
      analyticsSyncDescriptor,
      makeAnalyticsInput({ receiptId: null, publishedAt: null, pendingOffsetsMs: [] }),
      { workflowId: 'analytics:ws_test:conn_1' },
    );
    expect(run.continuedAsNew).not.toBeNull();
    expect(run.simulator.countOf('fetchAccountMetrics')).toBe(12);
  });
});

describe('token refresh', () => {
  it('refreshes at 70 percent of the credential life', () => {
    const now = TEST_EPOCH_MS;
    const lifetimeSeconds = 1_000_000;
    const expiresAt = new Date(now + lifetimeSeconds * 1_000).toISOString();
    const wait = refreshWaitMs(now, expiresAt, lifetimeSeconds);
    expect(wait).toBe(700_000_000);
  });

  it('never returns a negative wait for an already expired credential', () => {
    const expired = new Date(TEST_EPOCH_MS - 60_000).toISOString();
    expect(refreshWaitMs(TEST_EPOCH_MS, expired, 3_600)).toBeGreaterThan(0);
  });

  it('raises a connection incident when the refresh fails', async () => {
    const run = await runWorkflow(tokenRefreshDescriptor, makeTokenInput(), {
      workflowId: 'token:ws_test:conn_1',
      simulatorOptions: { refreshThrows: true },
    });

    expect(run.output?.incidentRaised).toBe(true);
    expect(run.output?.stoppedReasonKey).toBe('connection.token_refresh_failed');
    expect(run.simulator.incidents).toHaveLength(1);
    const events = run.simulator.emittedEvents.map((event) => event.event);
    expect(events).toContain('connection.action_required');
  });

  it('stops immediately when the credential is already revoked', async () => {
    const run = await runWorkflow(tokenRefreshDescriptor, makeTokenInput(), {
      workflowId: 'token:ws_test:conn_1',
      simulatorOptions: { credential: { revoked: true } },
    });

    expect(run.output?.stoppedReasonKey).toBe('connection.access_revoked');
    expect(run.simulator.countOf('refreshCredential')).toBe(0);
  });

  it('does nothing for a credential the provider never expires', async () => {
    const run = await runWorkflow(tokenRefreshDescriptor, makeTokenInput(), {
      workflowId: 'token:ws_test:conn_1',
      simulatorOptions: { credential: { refreshable: false } },
    });
    expect(run.output?.stoppedReasonKey).toBe('connection.token_refresh_not_supported');
  });
});

describe('rss polling', () => {
  it('backs off exponentially after consecutive failures', () => {
    expect(failureBackoffMs(60_000, 1)).toBe(60_000);
    expect(failureBackoffMs(60_000, 2)).toBe(120_000);
    expect(failureBackoffMs(60_000, 9)).toBe(480_000);
  });

  it('deduplicates items by guid, link and content fingerprint', async () => {
    const item = {
      guid: 'guid-1',
      link: 'https://example.invalid/a',
      contentFingerprint: 'f'.repeat(64),
      publishedAt: null,
    };
    const run = await runWorkflow(rssPollDescriptor, makeRssInput(), {
      workflowId: 'rss:ws_test:rss_1',
      simulatorOptions: {
        feedScript: [
          {
            changed: true,
            etag: 'W/"1"',
            lastModified: null,
            items: [item, { ...item }, { ...item, guid: 'guid-2' }],
            errorCode: null,
          },
          { changed: false, etag: 'W/"1"', lastModified: null, items: [], errorCode: null },
        ],
      },
    });

    const processed = run.simulator
      .callsNamed('processFeedItems')
      .map((call) => call.digest)
      .join('');
    expect(processed).toContain('guid-1');
    expect(processed).toContain('guid-2');
    // One call, carrying two items: the repeated entry was dropped.
    expect(run.simulator.countOf('processFeedItems')).toBe(1);
    expect(run.simulator.countOf('filterNewFeedItems')).toBe(1);
  });

  it('disables the feed after repeated failures instead of polling forever', async () => {
    const run = await runWorkflow(rssPollDescriptor, makeRssInput(), {
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
    });

    expect(run.output?.stoppedReasonKey).toBe('rss.feed_disabled_after_repeated_failures');
    expect(run.simulator.countOf('fetchFeed')).toBe(8);
  });
});

describe('automation rules', () => {
  it('reserves the execution slot before any action runs', async () => {
    const run = await runWorkflow(automationRuleDescriptor, makeRuleInput(), {
      workflowId: 'rule:ws_test:rule_1:run_1',
    });
    const names = run.simulator.calls.map((call) => call.name);
    expect(names.indexOf('reserveRuleExecution')).toBeLessThan(names.indexOf('executeRuleAction'));
    expect(run.output?.status).toBe('succeeded');
    expect(run.output?.externalActionCount).toBe(1);
  });

  it('skips the run when the cooldown is still active', async () => {
    const run = await runWorkflow(automationRuleDescriptor, makeRuleInput(), {
      workflowId: 'rule:ws_test:rule_1:run_1',
      simulatorOptions: { ruleReservation: 'cooldown' },
    });
    expect(run.output?.status).toBe('skipped');
    expect(run.output?.reasonKey).toBe('rule.cooldown_active');
    expect(run.simulator.countOf('executeRuleAction')).toBe(0);
  });

  it('runs at most once per source post', async () => {
    const first = await runWorkflow(automationRuleDescriptor, makeRuleInput(), {
      workflowId: 'rule:ws_test:rule_1:run_1',
    });
    const second = await runWorkflow(
      automationRuleDescriptor,
      makeRuleInput({ runId: 'rulerun_2' }),
      { workflowId: 'rule:ws_test:rule_1:run_2', simulator: first.simulator },
    );

    expect(first.output?.status).toBe('succeeded');
    expect(second.output?.status).toBe('skipped');
    expect(second.output?.reasonKey).toBe('rule.already_ran_for_this_source');
  });

  it('stops before acting when the kill switch is thrown', async () => {
    const run = await runWorkflow(automationRuleDescriptor, makeRuleInput(), {
      workflowId: 'rule:ws_test:rule_1:run_1',
      signals: [
        {
          afterMs: 0,
          apply: (inbox) => {
            inbox.onKillSwitch();
          },
        },
      ],
    });
    expect(run.output?.reasonKey).toBe('rule.stopped_by_kill_switch');
    expect(run.simulator.countOf('executeRuleAction')).toBe(0);
  });

  it('stops and asks for approval rather than acting without one', async () => {
    const run = await runWorkflow(automationRuleDescriptor, makeRuleInput(), {
      workflowId: 'rule:ws_test:rule_1:run_1',
      simulatorOptions: { ruleActionStatus: 'approval_required' },
    });
    expect(run.output?.status).toBe('skipped');
    expect(run.output?.externalActionCount).toBe(0);
  });

  it('records a run for every outcome', async () => {
    const run = await runWorkflow(automationRuleDescriptor, makeRuleInput(), {
      workflowId: 'rule:ws_test:rule_1:run_1',
      simulatorOptions: { ruleReservation: 'expired' },
    });
    expect(run.simulator.ruleRuns).toHaveLength(1);
    expect(run.simulator.ruleRuns[0]?.reasonKey).toBe('rule.expired');
  });
});

describe('webhook delivery', () => {
  it('delivers once and logs the attempt', async () => {
    const run = await runWorkflow(webhookDeliveryDescriptor, makeWebhookInput(), {
      workflowId: 'whd:ws_test:whd_1',
    });
    expect(run.output?.status).toBe('succeeded');
    expect(run.output?.attempts).toBe(1);
    expect(run.simulator.webhookAttempts).toHaveLength(1);
  });

  it('retries with growing backoff then dead letters', async () => {
    const run = await runWorkflow(webhookDeliveryDescriptor, makeWebhookInput(), {
      workflowId: 'whd:ws_test:whd_1',
      simulatorOptions: { webhookScript: ['failed'] },
    });

    expect(run.output?.status).toBe('exhausted');
    expect(run.output?.attempts).toBe(4);
    expect(run.output?.deadLettered).toBe(true);
    expect(run.simulator.deadLettered).toHaveLength(1);
    expect(run.clock.now()).toBeGreaterThan(TEST_EPOCH_MS);
  });

  it('disables an endpoint that has failed persistently', async () => {
    const run = await runWorkflow(webhookDeliveryDescriptor, makeWebhookInput(), {
      workflowId: 'whd:ws_test:whd_1',
      simulatorOptions: { webhookScript: ['failed'], webhookConsecutiveFailures: 19 },
    });

    expect(run.output?.endpointDisabled).toBe(true);
    expect(run.simulator.disabledEndpoints).toHaveLength(1);
  });

  it('does not deliver to a disabled endpoint', async () => {
    const run = await runWorkflow(webhookDeliveryDescriptor, makeWebhookInput(), {
      workflowId: 'whd:ws_test:whd_1',
      simulatorOptions: { webhookEndpointEnabled: false },
    });
    expect(run.output?.status).toBe('disabled');
    expect(run.simulator.countOf('deliverWebhook')).toBe(0);
  });
});

describe('data deletion', () => {
  it('cancels jobs, revokes grants, deletes objects and tombstones analytics', async () => {
    const run = await runWorkflow(dataDeletionDescriptor, makeDeletionInput({ graceMs: 0 }), {
      workflowId: 'delete:ws_test:op_delete_1',
    });

    expect(run.output?.status).toBe('completed');
    expect(run.simulator.canceledJobIds).toEqual(['job_1', 'job_2']);
    expect(run.simulator.revokedConnectionIds).toEqual(['conn_1']);
    expect(run.output?.deletedObjectCount).toBe(3);
    expect(run.output?.tombstonedReceiptCount).toBe(1);
  });

  it('cancels the jobs before revoking the grants', async () => {
    const run = await runWorkflow(dataDeletionDescriptor, makeDeletionInput({ graceMs: 0 }), {
      workflowId: 'delete:ws_test:op_delete_1',
    });
    const names = run.simulator.calls.map((call) => call.name);
    expect(names.indexOf('cancelScheduledJob')).toBeLessThan(
      names.indexOf('revokeProviderConnection'),
    );
  });

  it('aborts during the grace period and destroys nothing', async () => {
    const run = await runWorkflow(dataDeletionDescriptor, makeDeletionInput(), {
      workflowId: 'delete:ws_test:op_delete_1',
      signals: [
        {
          afterMs: 60_000,
          apply: (inbox) => {
            inbox.onCancel({ reason: 'user_changed_mind', requestedAt: '2026-03-01T09:01:00Z' });
          },
        },
      ],
    });

    expect(run.output?.status).toBe('aborted');
    expect(run.simulator.countOf('loadDeletionScope')).toBe(0);
    expect(run.simulator.countOf('deleteStoredObjects')).toBe(0);
  });
});
