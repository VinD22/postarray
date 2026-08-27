import { describe, expect, it } from 'vitest';

import {
  ACTIVE_CHANNEL_LIMIT,
  BASE_PROJECT_LIMIT,
  FREE_POST_CREDIT_GRANT,
  MAX_POST_CREDIT_BALANCE,
  POST_CREDIT_ENTITLEMENT_KEY,
  normalizePostCredits,
  CHANNEL_ALLOWANCE_PER_PROJECT,
  CHANNEL_LIMIT_ENTITLEMENT_KEY,
  MAX_CHANNEL_LIMIT,
  MAX_PROJECT_LIMIT,
  channelAllowanceForProjects,
  normalizeChannelLimit,
  normalizeProjectLimit,
} from './plan-limits';

describe('project plan limits', () => {
  it('uses the three-project base allowance when no entitlement exists', () => {
    expect(normalizeProjectLimit(undefined)).toBe(BASE_PROJECT_LIMIT);
    expect(normalizeProjectLimit(null)).toBe(BASE_PROJECT_LIMIT);
  });

  it('accepts the largest tier and bounds invalid grants', () => {
    expect(MAX_PROJECT_LIMIT).toBe(25);
    expect(normalizeProjectLimit(25)).toBe(MAX_PROJECT_LIMIT);
    expect(normalizeProjectLimit(200)).toBe(MAX_PROJECT_LIMIT);
    expect(normalizeProjectLimit(0)).toBe(1);
    expect(normalizeProjectLimit(3.9)).toBe(3);
  });
});

/**
 * Channels are derived from projects, which is what keeps "a tier buys project
 * capacity and nothing else" true at ten and twenty projects. If these numbers
 * move, the doctrine moved with them.
 */
describe('channel allowance derived from project allowance', () => {
  it('writes the entitlement key the connection surfaces already read', () => {
    expect(CHANNEL_LIMIT_ENTITLEMENT_KEY).toBe('channels.active.max');
  });

  it('gives ten channels per project, one per launch platform', () => {
    expect(CHANNEL_ALLOWANCE_PER_PROJECT).toBe(10);
    expect(channelAllowanceForProjects(4)).toBe(40);
    expect(channelAllowanceForProjects(10)).toBe(100);
  });

  it('derives the three published tiers, each able to fill every platform', () => {
    expect(channelAllowanceForProjects(BASE_PROJECT_LIMIT)).toBe(30);
    expect(channelAllowanceForProjects(10)).toBe(100);
    expect(channelAllowanceForProjects(MAX_PROJECT_LIMIT)).toBe(MAX_CHANNEL_LIMIT);
    expect(MAX_CHANNEL_LIMIT).toBe(250);
  });

  it('never drops below the no-entitlement floor', () => {
    expect(channelAllowanceForProjects(1)).toBe(ACTIVE_CHANNEL_LIMIT);
    expect(channelAllowanceForProjects(0)).toBe(ACTIVE_CHANNEL_LIMIT);
    expect(channelAllowanceForProjects(-4)).toBe(ACTIVE_CHANNEL_LIMIT);
    expect(channelAllowanceForProjects(Number.NaN)).toBe(ACTIVE_CHANNEL_LIMIT);
  });

  it('saturates at the ceiling rather than scaling past it', () => {
    expect(channelAllowanceForProjects(MAX_PROJECT_LIMIT)).toBe(MAX_CHANNEL_LIMIT);
    expect(channelAllowanceForProjects(500)).toBe(MAX_CHANNEL_LIMIT);
  });

  it('falls back to the floor and bounds invalid grants, exactly like projects', () => {
    expect(normalizeChannelLimit(undefined)).toBe(ACTIVE_CHANNEL_LIMIT);
    expect(normalizeChannelLimit(null)).toBe(ACTIVE_CHANNEL_LIMIT);
    expect(normalizeChannelLimit(Number.POSITIVE_INFINITY)).toBe(ACTIVE_CHANNEL_LIMIT);
    expect(normalizeChannelLimit(50)).toBe(50);
    expect(normalizeChannelLimit(9_000)).toBe(MAX_CHANNEL_LIMIT);
    expect(normalizeChannelLimit(0)).toBe(1);
    expect(normalizeChannelLimit(15.9)).toBe(15);
  });
});


/**
 * The free plan is a balance, not a clock.
 *
 * These assertions are the ones that would have to be argued with rather than
 * merely edited: that an unreadable balance fails open to the opening grant,
 * and that a hand-typed grant is bounded like every other operator number here.
 */
describe('publishing credits', () => {
  it('writes the entitlement key the publish path reads', () => {
    expect(POST_CREDIT_ENTITLEMENT_KEY).toBe('publishing.credits.remaining');
  });

  it('opens a free workspace on the standing grant', () => {
    expect(FREE_POST_CREDIT_GRANT).toBe(3);
    expect(normalizePostCredits(undefined)).toBe(FREE_POST_CREDIT_GRANT);
    expect(normalizePostCredits(null)).toBe(FREE_POST_CREDIT_GRANT);
    expect(normalizePostCredits(Number.NaN)).toBe(FREE_POST_CREDIT_GRANT);
  });

  it('keeps a spent balance at zero rather than going negative', () => {
    expect(normalizePostCredits(0)).toBe(0);
    expect(normalizePostCredits(-5)).toBe(0);
  });

  it('bounds a hand-typed referral grant', () => {
    expect(normalizePostCredits(40)).toBe(40);
    expect(normalizePostCredits(2.9)).toBe(2);
    expect(normalizePostCredits(9_999)).toBe(MAX_POST_CREDIT_BALANCE);
  });
});
