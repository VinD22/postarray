import {
  FREE_POST_CREDIT_GRANT,
  MAX_POST_CREDIT_BALANCE,
  POST_CREDIT_ENTITLEMENT_KEY,
  normalizePostCredits,
} from '@relay/contracts';

import { BILLING_MESSAGE_KEYS } from './messages';

/**
 * The free plan, expressed as a balance rather than a clock.
 *
 * We used to sell a seven day trial: a card up front, a countdown, a reminder
 * on day four, a summary on day six and a charge on day seven. That model asks
 * a stranger to commit a payment method before they know whether we can publish
 * to their accounts at all, and it puts the deadline on our calendar instead of
 * on their work. Somebody who posts twice a week met the charge before they met
 * the product.
 *
 * A credit balance inverts that. Signing up costs nothing and asks for no card.
 * Connecting accounts is free and unmetered, because connecting is how a person
 * finds out we can reach their accounts at all, and charging for that would be
 * charging for the answer to "does this even work for me". Composing,
 * scheduling, previewing and every platform check are free for the same reason.
 * The credit is spent at the one moment the product has demonstrably done the
 * thing it exists to do: a post actually went out, through the official API,
 * with a receipt.
 *
 * ## What zero means
 *
 * Exactly one thing: the next publish is refused. It is not a lockout. Every
 * connection stays live, every draft stays editable, every schedule stays
 * visible, and analytics keep arriving for what already went out. A workspace
 * at zero credits is a workspace that has seen the product work and is being
 * asked to pay for more of it, which is a different situation from a workspace
 * that has stopped paying (`read_only`), and the two must never be reported
 * with the same message.
 *
 * ## Where credits come from
 *
 * Three places, and the ledger records which: the opening grant every workspace
 * gets on signup, an operator grant, and a referral or affiliate award paid out
 * by hand. The last of these is why the balance is stored per workspace rather
 * than derived from `FREE_POST_CREDIT_GRANT`: someone who brings us a customer
 * can be given more posts without changing what everybody else starts with, and
 * without shipping code.
 *
 * ## What this module does not do
 *
 * It does not spend anything. The spend is a single SQL statement
 * (`app.spend_post_credit`, migration 0077) because a read-then-write in
 * TypeScript has a window in it, and the publish path is explicitly built to
 * survive a worker crash and retry. This module decides what a balance *means*
 * and what to say about it; the database decides whether the balance was there.
 */

export const POST_CREDIT_KEY = POST_CREDIT_ENTITLEMENT_KEY;

/** What a workspace is publishing under. Not a feature set: every plan has every feature. */
export type PublishingPlan = 'free' | 'paid';

export interface PostCreditPosture {
  readonly plan: PublishingPlan;
  /** Credits left. Always `null` on a paid plan, where publishing is not metered. */
  readonly remaining: number | null;
  readonly canPublish: boolean;
  /**
   * True only for a free workspace that has spent everything. A paid workspace
   * that cannot publish for a billing reason is never described this way.
   */
  readonly exhausted: boolean;
  /** Set when the balance is low enough to be worth saying so, before it bites. */
  readonly noticeKey: string | null;
  readonly refusalMessageKey: string | null;
}

/**
 * The balance at which we start saying something.
 *
 * One, not two or three. A notice on every post from the first one turns the
 * free plan into a nag, and the useful moment is the one where the next post is
 * the last: "this is your last free post" is information a person can act on,
 * "you have used one of three" is a progress bar for our benefit.
 */
export const POST_CREDIT_NOTICE_THRESHOLD = 1;

export interface PostCreditPostureInput {
  readonly plan: PublishingPlan;
  /** The stored balance. Unreadable or missing data normalizes to the grant. */
  readonly balance?: number | null;
}

/**
 * What a workspace may do at its current balance.
 *
 * A paid plan short-circuits before the balance is even looked at. Publishing on
 * a paid plan is not metered, so a paid workspace holding a stale balance row
 * from its free days must not be affected by it in any way.
 */
export function postCreditPosture(input: PostCreditPostureInput): PostCreditPosture {
  if (input.plan === 'paid') {
    return {
      plan: 'paid',
      remaining: null,
      canPublish: true,
      exhausted: false,
      noticeKey: null,
      refusalMessageKey: null,
    };
  }

  const remaining = normalizePostCredits(input.balance);
  const canPublish = remaining > 0;
  return {
    plan: 'free',
    remaining,
    canPublish,
    exhausted: !canPublish,
    noticeKey:
      canPublish && remaining <= POST_CREDIT_NOTICE_THRESHOLD
        ? 'billing.credits.lastFreePost'
        : null,
    // Not `paymentRequired`, and not `quotaExceeded`. Running out of free posts
    // is neither a failed payment nor an abuse limit, and reporting it as
    // either sends the reader to the wrong screen.
    refusalMessageKey: canPublish ? null : BILLING_MESSAGE_KEYS.postCreditsExhausted,
  };
}

export interface PostCreditGrant {
  readonly workspaceId: string;
  readonly delta: number;
  readonly reason: 'signup_grant' | 'referral_grant' | 'operator_grant';
  /** Who decided. Null only for the automatic signup grant. */
  readonly actorId: string | null;
  readonly note: string | null;
}

export interface BuildPostCreditGrantInput {
  readonly workspaceId: string;
  readonly credits: number;
  readonly reason: PostCreditGrant['reason'];
  readonly actorId?: string | null;
  readonly note?: string | null;
  readonly currentBalance?: number | null;
}

/**
 * A hand-typed award, bounded before it reaches the database.
 *
 * Returns `null` rather than throwing when the award is not a positive whole
 * number: the caller is an operator tool, and "nothing happened" is a better
 * answer to a mistyped field than a stack trace. What it cannot do is exceed
 * `MAX_POST_CREDIT_BALANCE`, which the schema also refuses, because the person
 * typing the number and the person reviewing the code are the same person on a
 * small team.
 */
export function buildPostCreditGrant(input: BuildPostCreditGrantInput): PostCreditGrant | null {
  const credits = Math.trunc(input.credits);
  if (!Number.isFinite(credits) || credits <= 0) {
    return null;
  }
  const current = normalizePostCredits(input.currentBalance ?? 0);
  const headroom = Math.max(0, MAX_POST_CREDIT_BALANCE - current);
  const delta = Math.min(credits, headroom);
  if (delta === 0) {
    return null;
  }
  if (input.reason === 'signup_grant') {
    return { workspaceId: input.workspaceId, delta, reason: 'signup_grant', actorId: null, note: null };
  }
  return {
    workspaceId: input.workspaceId,
    delta,
    reason: input.reason,
    actorId: input.actorId ?? null,
    note: input.note ?? null,
  };
}

/** The opening balance a workspace is created with. One number, one place. */
export function signupPostCreditGrant(): number {
  return FREE_POST_CREDIT_GRANT;
}
