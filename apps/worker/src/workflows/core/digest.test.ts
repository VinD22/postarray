import { describe, expect, it } from 'vitest';

import { DIGEST_MESSAGE_KEYS, runWeeklyDigest } from './digest.core';
import type {
  BuildWeeklyDigestResult,
  DigestActivities,
  SendWeeklyDigestEmailResult,
  WeeklyDigestWorkflowInput,
} from './digest.core';
import { assertDigestActivities } from '../digest.workflow';
import type { ActivityContext } from '../../activities/types';
import type { WorkflowRuntime } from '../../runtime/types';

const CTX: ActivityContext = {
  workspaceId: 'ws_test',
  correlationId: 'corr_test',
  actorId: 'system',
  actorType: 'system',
  surface: 'api',
  approvalLevel: 'level_3_confirm',
  locale: 'en',
};

/** The two log calls the core makes. Nothing else in the runtime is touched. */
function fakeRuntime(): WorkflowRuntime {
  const noop = (): void => {};
  const log = { debug: noop, info: noop, warn: noop, error: noop };
  return { log } as unknown as WorkflowRuntime;
}

function makeInput(overrides: Partial<WeeklyDigestWorkflowInput> = {}): WeeklyDigestWorkflowInput {
  return {
    ctx: CTX,
    windowStart: '2026-08-03',
    windowEnd: '2026-08-10',
    replaceExisting: false,
    sendEmail: true,
    ...overrides,
  };
}

function makeActivities(
  built: Partial<BuildWeeklyDigestResult> = {},
  email: Partial<SendWeeklyDigestEmailResult> = {},
): { activities: DigestActivities; calls: string[] } {
  const calls: string[] = [];
  return {
    calls,
    activities: {
      async buildWeeklyDigest() {
        calls.push('buildWeeklyDigest');
        return {
          enabled: true,
          stored: true,
          rowCount: 4,
          source: 'deterministic',
          fallbackReasonKey: null,
          ...built,
        };
      },
      async sendWeeklyDigestEmail() {
        calls.push('sendWeeklyDigestEmail');
        return { sent: true, skippedReasonKey: null, ...email };
      },
    },
  };
}

describe('weekly digest workflow core', () => {
  it('builds the digest and sends the weekly email', async () => {
    const { activities, calls } = makeActivities();

    const output = await runWeeklyDigest(fakeRuntime(), activities, makeInput());

    expect(output).toMatchObject({
      stored: true,
      rowCount: 4,
      source: 'deterministic',
      emailSent: true,
    });
    expect(calls).toEqual(['buildWeeklyDigest', 'sendWeeklyDigestEmail']);
  });

  it('passes the workspace locale through to the email activity', async () => {
    const locales: string[] = [];
    const { activities } = makeActivities();
    const localizedActivities: DigestActivities = {
      ...activities,
      async sendWeeklyDigestEmail(input) {
        locales.push(input.ctx.locale);
        return { sent: true, skippedReasonKey: null };
      },
    };

    await runWeeklyDigest(
      fakeRuntime(),
      localizedActivities,
      makeInput({ ctx: { ...CTX, locale: 'es' } }),
    );

    expect(locales).toEqual(['es']);
  });

  it('does not email a workspace that switched the digest off', async () => {
    const { activities, calls } = makeActivities({ enabled: false, stored: false, rowCount: 0 });

    const output = await runWeeklyDigest(fakeRuntime(), activities, makeInput());

    expect(output.emailSent).toBe(false);
    expect(output.reasonKey).toBe(DIGEST_MESSAGE_KEYS.disabled);
    expect(calls).toEqual(['buildWeeklyDigest']);
  });

  it('still builds the digest when only the email is off', async () => {
    const { activities, calls } = makeActivities();

    const output = await runWeeklyDigest(
      fakeRuntime(),
      activities,
      makeInput({ sendEmail: false }),
    );

    expect(output.stored).toBe(true);
    expect(output.emailSent).toBe(false);
    expect(calls).toEqual(['buildWeeklyDigest']);
  });

  it('reports the fallback reason of a deterministic digest', async () => {
    const { activities } = makeActivities(
      { source: 'deterministic', fallbackReasonKey: 'digest.unavailable.aiOff' },
      { sent: true, skippedReasonKey: null },
    );

    const output = await runWeeklyDigest(fakeRuntime(), activities, makeInput());

    expect(output.reasonKey).toBe('digest.unavailable.aiOff');
  });
});

describe('assertDigestActivities', () => {
  it('fails loudly when the gateway does not implement the digest yet', () => {
    expect(() => assertDigestActivities({})).toThrowError();
  });

  it('returns the narrow slice when both activities are present', () => {
    const { activities } = makeActivities();

    expect(assertDigestActivities(activities)).toMatchObject({
      buildWeeklyDigest: expect.any(Function),
      sendWeeklyDigestEmail: expect.any(Function),
    });
  });
});
