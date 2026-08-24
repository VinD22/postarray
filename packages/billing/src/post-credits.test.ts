import { describe, expect, it } from 'vitest';

import { FREE_POST_CREDIT_GRANT, MAX_POST_CREDIT_BALANCE } from '@relay/contracts';

import {
  POST_CREDIT_KEY,
  buildPostCreditGrant,
  postCreditPosture,
  signupPostCreditGrant,
} from './post-credits';

/**
 * The rules that replaced the trial clock. The assertions here are the ones a
 * future edit would have to argue with rather than merely update: zero blocks
 * publishing and nothing else, a paid plan is never metered, an unreadable
 * balance fails open to the grant, and a refusal is never dressed up as a
 * payment failure.
 */
describe('postCreditPosture', () => {
  it('reads the entitlement key the publish path spends against', () => {
    expect(POST_CREDIT_KEY).toBe('publishing.credits.remaining');
  });

  it('lets a fresh workspace publish on the opening grant', () => {
    const posture = postCreditPosture({ plan: 'free', balance: FREE_POST_CREDIT_GRANT });
    expect(posture.canPublish).toBe(true);
    expect(posture.exhausted).toBe(false);
    expect(posture.remaining).toBe(FREE_POST_CREDIT_GRANT);
    expect(posture.refusalMessageKey).toBeNull();
  });

  it('refuses publishing at zero, and refuses nothing else', () => {
    const posture = postCreditPosture({ plan: 'free', balance: 0 });
    expect(posture.canPublish).toBe(false);
    expect(posture.exhausted).toBe(true);
    // Its own message. Not payment_required, not quota_exceeded: running out
    // of free posts is neither a failed charge nor an abuse limit.
    expect(posture.refusalMessageKey).toBe('error.post_credits_exhausted.message');
  });

  it('warns on the last free post, and only then', () => {
    expect(postCreditPosture({ plan: 'free', balance: 3 }).noticeKey).toBeNull();
    expect(postCreditPosture({ plan: 'free', balance: 2 }).noticeKey).toBeNull();
    expect(postCreditPosture({ plan: 'free', balance: 1 }).noticeKey).toBe(
      'billing.credits.lastFreePost',
    );
    // At zero the refusal speaks; a notice on top of it would be two banners.
    expect(postCreditPosture({ plan: 'free', balance: 0 }).noticeKey).toBeNull();
  });

  it('fails open to the grant when the balance is unreadable', () => {
    // Our failure, their first posts. An unreadable row must never refuse a
    // person who has not published anything yet.
    for (const balance of [undefined, null, Number.NaN]) {
      const posture = postCreditPosture({ plan: 'free', balance });
      expect(posture.remaining).toBe(FREE_POST_CREDIT_GRANT);
      expect(posture.canPublish).toBe(true);
    }
  });

  it('never meters a paid plan, even over a stale balance row', () => {
    const posture = postCreditPosture({ plan: 'paid', balance: 0 });
    expect(posture.canPublish).toBe(true);
    expect(posture.remaining).toBeNull();
    expect(posture.exhausted).toBe(false);
    expect(posture.noticeKey).toBeNull();
    expect(posture.refusalMessageKey).toBeNull();
  });
});

describe('buildPostCreditGrant', () => {
  it('builds a referral award with its provenance', () => {
    const grant = buildPostCreditGrant({
      workspaceId: 'ws_1',
      credits: 5,
      reason: 'referral_grant',
      actorId: 'user_op',
      note: 'Referred northbound.tools',
      currentBalance: 1,
    });
    expect(grant).toEqual({
      workspaceId: 'ws_1',
      delta: 5,
      reason: 'referral_grant',
      actorId: 'user_op',
      note: 'Referred northbound.tools',
    });
  });

  it('refuses a zero, negative or fractional-to-zero award', () => {
    for (const credits of [0, -3, 0.9, Number.NaN]) {
      expect(
        buildPostCreditGrant({ workspaceId: 'ws_1', credits, reason: 'operator_grant' }),
      ).toBeNull();
    }
  });

  it('clamps an award to the balance ceiling instead of overflowing it', () => {
    const grant = buildPostCreditGrant({
      workspaceId: 'ws_1',
      credits: 50,
      reason: 'operator_grant',
      currentBalance: MAX_POST_CREDIT_BALANCE - 10,
    });
    expect(grant?.delta).toBe(10);

    expect(
      buildPostCreditGrant({
        workspaceId: 'ws_1',
        credits: 5,
        reason: 'operator_grant',
        currentBalance: MAX_POST_CREDIT_BALANCE,
      }),
    ).toBeNull();
  });

  it('keeps the signup grant anonymous and the number in one place', () => {
    expect(signupPostCreditGrant()).toBe(FREE_POST_CREDIT_GRANT);
    const grant = buildPostCreditGrant({
      workspaceId: 'ws_1',
      credits: signupPostCreditGrant(),
      reason: 'signup_grant',
      actorId: 'user_should_be_dropped',
    });
    expect(grant?.actorId).toBeNull();
    expect(grant?.note).toBeNull();
  });
});
