import { describe, expect, it } from 'vitest';

import {
  ACTIVE_CHANNEL_LIMIT,
  BASE_PROJECT_LIMIT,
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

  it('accepts a twenty-project entitlement and bounds invalid grants', () => {
    expect(normalizeProjectLimit(20)).toBe(MAX_PROJECT_LIMIT);
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

  it('gives five channels per project', () => {
    expect(CHANNEL_ALLOWANCE_PER_PROJECT).toBe(5);
    expect(channelAllowanceForProjects(4)).toBe(20);
    expect(channelAllowanceForProjects(10)).toBe(50);
  });

  it('derives the three published tiers', () => {
    expect(channelAllowanceForProjects(BASE_PROJECT_LIMIT)).toBe(15);
    expect(channelAllowanceForProjects(10)).toBe(50);
    expect(channelAllowanceForProjects(MAX_PROJECT_LIMIT)).toBe(100);
  });

  it('never drops below the no-entitlement floor', () => {
    expect(channelAllowanceForProjects(1)).toBe(ACTIVE_CHANNEL_LIMIT);
    expect(channelAllowanceForProjects(0)).toBe(ACTIVE_CHANNEL_LIMIT);
    expect(channelAllowanceForProjects(-4)).toBe(ACTIVE_CHANNEL_LIMIT);
    expect(channelAllowanceForProjects(Number.NaN)).toBe(ACTIVE_CHANNEL_LIMIT);
  });

  it('saturates at the ceiling the largest tier already reaches', () => {
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
