import { describe, expect, it } from 'vitest';

import {
  countExternalPublications,
  countSimilarAccounts,
  detectBulkAction,
  domainApproved,
  evaluateAgentAction,
  withinAllowedHours,
  type AgentActionRequest,
  type AgentTarget,
} from './agent-policy.js';

const NOW = new Date('2026-08-04T09:00:00.000Z');

function target(overrides: Partial<AgentTarget> = {}): AgentTarget {
  return {
    connectionId: 'conn-1',
    provider: 'linkedin',
    brandId: 'brand-1',
    locale: 'en',
    body: 'A calm update about the release we shipped this week.',
    external: true,
    ...overrides,
  };
}

function request(overrides: Partial<AgentActionRequest> = {}): AgentActionRequest {
  return {
    kind: 'schedule',
    approvalLevel: 'level_2_scheduled',
    targets: [target()],
    now: NOW,
    ...overrides,
  };
}

describe('approval levels', () => {
  it('lets level 0 read and validate but not draft', () => {
    expect(evaluateAgentAction(request({ kind: 'read', approvalLevel: 'level_0_read' })).allowed)
      .toBe(true);
    const drafting = evaluateAgentAction(
      request({ kind: 'draft', approvalLevel: 'level_0_read' }),
    );
    expect(drafting.allowed).toBe(false);
    expect(drafting.blockers[0]?.code).toBe('approval_level_too_low');
  });

  it('lets level 1 draft but not schedule', () => {
    expect(evaluateAgentAction(request({ kind: 'draft', approvalLevel: 'level_1_draft' })).allowed)
      .toBe(true);
    expect(
      evaluateAgentAction(request({ kind: 'schedule', approvalLevel: 'level_1_draft' })).allowed,
    ).toBe(false);
  });

  it('refuses immediate publishing at level 2', () => {
    const decision = evaluateAgentAction(
      request({ kind: 'publish_now', approvalLevel: 'level_2_scheduled' }),
    );
    expect(decision.allowed).toBe(false);
    expect(decision.blockers.map((blocker) => blocker.code)).toContain(
      'approval_level_too_low',
    );
  });

  it('always asks for confirmation before an immediate publish, even at level 3', () => {
    const decision = evaluateAgentAction(
      request({ kind: 'publish_now', approvalLevel: 'level_3_confirm' }),
    );
    expect(decision.allowed).toBe(true);
    expect(decision.requiresHumanConfirmation).toBe(true);
    expect(decision.escalations.map((entry) => entry.code)).toContain('immediate_publish');
  });

  it('accepts an explicit human confirmation', () => {
    const decision = evaluateAgentAction(
      request({
        kind: 'publish_now',
        approvalLevel: 'level_3_confirm',
        humanConfirmed: true,
      }),
    );
    expect(decision.allowed).toBe(true);
    expect(decision.requiresHumanConfirmation).toBe(false);
  });

  it('respects a per identity approval level cap', () => {
    const decision = evaluateAgentAction(
      request({
        kind: 'schedule',
        approvalLevel: 'level_2_scheduled',
        restrictions: { maxApprovalLevel: 'level_1_draft' },
      }),
    );
    expect(decision.allowed).toBe(false);
    expect(decision.blockers.map((entry) => entry.code)).toContain('approval_level_capped');
  });
});

describe('bulk action detection', () => {
  const distinct = [
    'Release notes for the August build are up.',
    'We rewrote the scheduler queue and it is faster now.',
    'A short field report from the customer workshop in Lisbon.',
    'Hiring one more platform engineer in Berlin.',
    'The capability matrix now covers every connector.',
    'Our uptime numbers for July, with the caveats spelled out.',
  ];

  it('counts external publications and ignores drafts', () => {
    const targets = [
      target({ connectionId: 'a', external: true }),
      target({ connectionId: 'b', external: true }),
      target({ connectionId: 'c', external: false }),
    ];
    expect(countExternalPublications(targets)).toBe(2);
  });

  it('escalates more than five external publications in one request', () => {
    const targets = distinct.map((body, index) =>
      target({ connectionId: `conn-${index}`, body }),
    );
    expect(detectBulkAction(targets)).toBe(true);
    const decision = evaluateAgentAction(
      request({ approvalLevel: 'level_2_scheduled', targets }),
    );
    expect(decision.requiresHumanConfirmation).toBe(true);
    expect(decision.escalations.map((entry) => entry.code)).toContain(
      'bulk_publication_count',
    );
  });

  it('does not escalate exactly five distinct publications', () => {
    const targets = distinct
      .slice(0, 5)
      .map((body, index) => target({ connectionId: `conn-${index}`, body }));
    expect(detectBulkAction(targets)).toBe(false);
    expect(evaluateAgentAction(request({ targets })).requiresHumanConfirmation).toBe(false);
  });

  it('detects substantially similar content across accounts', () => {
    const body =
      'We shipped the new scheduler today and it handles daylight saving transitions properly across every connected account.';
    const targets = [
      target({ connectionId: 'a', body }),
      target({ connectionId: 'b', body: `${body} Details.` }),
      target({ connectionId: 'c', body: `${body} Notes attached.` }),
      target({ connectionId: 'd', body: `${body} Full notes attached.` }),
    ];
    expect(countSimilarAccounts(targets)).toBe(4);
    const decision = evaluateAgentAction(request({ targets }));
    expect(decision.escalations.map((entry) => entry.code)).toContain(
      'similar_content_across_accounts',
    );
  });

  it('treats genuinely different copy per account as not similar', () => {
    const targets = distinct
      .slice(0, 4)
      .map((body, index) => target({ connectionId: `conn-${index}`, body }));
    expect(countSimilarAccounts(targets)).toBe(1);
    expect(evaluateAgentAction(request({ targets })).requiresHumanConfirmation).toBe(false);
  });
});

describe('service account restrictions', () => {
  it('refuses a connection outside the preauthorized list', () => {
    const decision = evaluateAgentAction(
      request({
        targets: [target({ connectionId: 'conn-9' })],
        restrictions: { connectionIds: ['conn-1'] },
      }),
    );
    expect(decision.allowed).toBe(false);
    expect(decision.blockers.map((entry) => entry.code)).toContain(
      'connection_not_preauthorized',
    );
  });

  it('refuses a brand, provider or locale outside the preauthorized lists', () => {
    const decision = evaluateAgentAction(
      request({
        targets: [target({ brandId: 'brand-9', provider: 'x', locale: 'de' })],
        restrictions: { brandIds: ['brand-1'], providers: ['linkedin'], locales: ['en'] },
      }),
    );
    const codes = decision.blockers.map((entry) => entry.code);
    expect(codes).toContain('brand_not_preauthorized');
    expect(codes).toContain('provider_not_preauthorized');
    expect(codes).toContain('locale_not_preauthorized');
  });

  it('enforces the daily cadence budget across the whole identity', () => {
    const decision = evaluateAgentAction(
      request({
        targets: [target({ connectionId: 'a' }), target({ connectionId: 'b' })],
        publishedTodayCount: 5,
        restrictions: { maxDailyPublishes: 6 },
      }),
    );
    expect(decision.allowed).toBe(false);
    expect(decision.blockers.map((entry) => entry.code)).toContain('daily_cadence_exceeded');
  });

  it('allows a request that exactly fills the daily budget', () => {
    const decision = evaluateAgentAction(
      request({
        targets: [target()],
        publishedTodayCount: 5,
        restrictions: { maxDailyPublishes: 6 },
      }),
    );
    expect(decision.allowed).toBe(true);
  });

  it('enforces the look ahead window', () => {
    const decision = evaluateAgentAction(
      request({
        targets: [target({ scheduledInstant: '2026-10-04T09:00:00.000Z' })],
        restrictions: { maxLookAheadDays: 30 },
      }),
    );
    expect(decision.blockers.map((entry) => entry.code)).toContain('look_ahead_exceeded');
  });

  it('enforces allowed hours in the workspace time zone', () => {
    const decision = evaluateAgentAction(
      request({
        targets: [target({ scheduledInstant: '2026-08-05T03:00:00.000Z' })],
        restrictions: {
          allowedHours: { startHour: 8, endHour: 18 },
          ianaTimeZone: 'UTC',
        },
      }),
    );
    expect(decision.blockers.map((entry) => entry.code)).toContain('outside_allowed_hours');
  });

  it('refuses a schedule in the past', () => {
    const decision = evaluateAgentAction(
      request({ targets: [target({ scheduledInstant: '2026-08-03T09:00:00.000Z' })] }),
    );
    expect(decision.blockers.map((entry) => entry.code)).toContain('schedule_in_past');
  });

  it('blocks a link domain that is not approved', () => {
    const decision = evaluateAgentAction(
      request({
        targets: [target({ linkHosts: ['pay.example.net'] })],
        restrictions: { approvedDomains: ['acme.com'] },
      }),
    );
    expect(decision.allowed).toBe(false);
    expect(decision.blockers.map((entry) => entry.code)).toContain('domain_not_approved');
  });

  it('accepts a subdomain of an approved domain', () => {
    expect(domainApproved('docs.acme.com', ['acme.com'])).toBe(true);
    expect(domainApproved('www.acme.com', ['acme.com'])).toBe(true);
    expect(domainApproved('notacme.com', ['acme.com'])).toBe(false);
  });

  it('refuses everything for a disabled service account', () => {
    const decision = evaluateAgentAction(
      request({ kind: 'read', approvalLevel: 'level_0_read', restrictions: { disabled: true } }),
    );
    expect(decision.allowed).toBe(false);
    expect(decision.blockers.map((entry) => entry.code)).toContain('service_account_disabled');
  });

  it('does not apply publishing restrictions to a read', () => {
    const decision = evaluateAgentAction(
      request({
        kind: 'read',
        approvalLevel: 'level_0_read',
        targets: [target({ connectionId: 'conn-9' })],
        restrictions: { connectionIds: ['conn-1'] },
      }),
    );
    expect(decision.allowed).toBe(true);
  });
});

describe('always escalating conditions', () => {
  it('escalates a first use of a connection', () => {
    const decision = evaluateAgentAction(
      request({ firstUseConnectionIds: ['conn-1'] }),
    );
    expect(decision.escalations.map((entry) => entry.code)).toContain('first_use_connection');
  });

  it('escalates commercial, political, regulated or otherwise sensitive content', () => {
    const decision = evaluateAgentAction(request({ classification: { commercial: true } }));
    expect(decision.escalations.map((entry) => entry.code)).toContain('sensitive_content');
  });

  it('escalates a platform privacy change', () => {
    const decision = evaluateAgentAction(
      request({ targets: [target({ privacyChanged: true })] }),
    );
    expect(decision.escalations.map((entry) => entry.code)).toContain('privacy_change');
  });

  it('escalates content changed after approval', () => {
    const decision = evaluateAgentAction(request({ changedAfterApproval: true }));
    expect(decision.escalations.map((entry) => entry.code)).toContain(
      'changed_after_approval',
    );
  });

  it('escalates an estimated provider cost above the threshold', () => {
    const decision = evaluateAgentAction(
      request({ estimatedCostMinor: 250, costCurrency: 'USD' }),
    );
    expect(decision.escalations.map((entry) => entry.code)).toContain(
      'cost_threshold_exceeded',
    );
  });

  it('leaves a plain scheduled post alone', () => {
    const decision = evaluateAgentAction(request());
    expect(decision.allowed).toBe(true);
    expect(decision.requiresHumanConfirmation).toBe(false);
    expect(decision.escalations).toEqual([]);
  });
});

describe('withinAllowedHours', () => {
  it('handles a window that wraps midnight', () => {
    const window = { startHour: 22, endHour: 6 };
    expect(withinAllowedHours(new Date('2026-08-04T23:00:00Z'), window, 'UTC')).toBe(true);
    expect(withinAllowedHours(new Date('2026-08-04T03:00:00Z'), window, 'UTC')).toBe(true);
    expect(withinAllowedHours(new Date('2026-08-04T12:00:00Z'), window, 'UTC')).toBe(false);
  });

  it('respects the named zone rather than the host zone', () => {
    const window = { startHour: 8, endHour: 18 };
    const instant = new Date('2026-08-04T02:00:00Z');
    expect(withinAllowedHours(instant, window, 'UTC')).toBe(false);
    expect(withinAllowedHours(instant, window, 'Asia/Tokyo')).toBe(true);
  });
});
