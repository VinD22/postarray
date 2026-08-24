import { describe, expect, it } from 'vitest';

import { PROJECT_LIMIT_ENTITLEMENT_KEY } from '@relay/contracts';
import { en } from '@relay/i18n';

import { verifiedSubscriptionSchema } from './entitlements';
import type { SubscriptionSource, VerifiedSubscription } from './entitlements';
import {
  PROJECT_ALLOWANCE_ENTITLEMENT_KEY,
  buildProjectAllowanceGrant,
  projectCapacityPosture,
} from './project-allowance';

const NOW = '2026-08-10T12:00:00.000Z';

function subscription(source: SubscriptionSource, productId = 'prod_base'): VerifiedSubscription {
  return verifiedSubscriptionSchema.parse({
    subscriptionId: 'sub_01',
    workspaceId: 'ws_01',
    customerId: 'cus_01',
    productId,
    interval: 'month',
    status: 'active',
    amountMinor: 2_900,
    currency: 'USD',
    currentPeriodStart: NOW,
    currentPeriodEnd: '2026-09-10T12:00:00.000Z',
    cancelAtPeriodEnd: false,
    canceledAt: null,
    trialStart: null,
    trialEnd: null,
    endsAt: null,
    endedAt: null,
    modifiedAt: NOW,
    pastDueSince: null,
    source,
    verifiedAt: NOW,
  });
}

describe('the projects.active.max entitlement row', () => {
  it('writes the key the database capacity trigger already reads', () => {
    expect(PROJECT_ALLOWANCE_ENTITLEMENT_KEY).toBe('projects.active.max');
    expect(PROJECT_ALLOWANCE_ENTITLEMENT_KEY).toBe(PROJECT_LIMIT_ENTITLEMENT_KEY);
  });

  it('grants the base allowance from a verified webhook', () => {
    const grant = buildProjectAllowanceGrant({
      subscription: subscription('webhook'),
      effectiveFrom: NOW,
    });
    expect(grant).not.toBeNull();
    expect(grant?.key).toBe('projects.active.max');
    expect(grant?.kind).toBe('numeric_limit');
    expect(grant?.numericValue).toBe(3);
    expect(grant?.tierKey).toBe('relay_standard');
    expect(grant?.workspaceId).toBe('ws_01');
    expect(grant?.source).toBe('webhook');
  });

  it('grants from reconciliation too, because both are verified evidence', () => {
    const grant = buildProjectAllowanceGrant({
      subscription: subscription('reconciliation'),
      effectiveFrom: NOW,
    });
    expect(grant?.source).toBe('reconciliation');
    expect(grant?.numericValue).toBe(3);
  });

  it('grants nothing from a browser redirect or an unverified record', () => {
    expect(
      buildProjectAllowanceGrant({ subscription: subscription('redirect'), effectiveFrom: NOW }),
    ).toBeNull();
    expect(
      buildProjectAllowanceGrant({ subscription: subscription('unverified'), effectiveFrom: NOW }),
    ).toBeNull();
  });

  it('falls back to the base allowance for a product we cannot map', () => {
    const grant = buildProjectAllowanceGrant({
      subscription: subscription('webhook', 'prod_from_another_universe'),
      effectiveFrom: NOW,
    });
    expect(grant?.numericValue).toBe(3);
  });
});

/**
 * Downgrade. The rule the founder cares about: a workspace that ends up over
 * its allowance keeps everything it has. We never archive for them.
 */
describe('a workspace over its new allowance', () => {
  const posture = projectCapacityPosture({ activeProjects: 5, allowance: 3 });

  it('archives nothing, ever', () => {
    expect(posture.projectsArchivedByDowngrade).toBe(0);
  });

  it('keeps full read and write access to the projects it already has', () => {
    expect(posture.existingProjectsBlockedByCapacity).toBe(false);
  });

  it('cannot create another project or unarchive one', () => {
    expect(posture.overAllowance).toBe(true);
    expect(posture.canCreateProject).toBe(false);
    expect(posture.canUnarchiveProject).toBe(false);
    expect(posture.remaining).toBe(0);
  });

  it('explains the state without threatening deletion', () => {
    const catalog = en as Readonly<Record<string, string>>;
    expect(posture.noticeKey).toBe('billing.downgrade.projectsOverAllowance');
    const notice = catalog['billing.downgrade.projectsOverAllowance'] ?? '';
    expect(notice).toContain('nothing is archived');
    expect(notice).not.toContain('delete');
    expect(notice).not.toContain('—');
  });
});

describe('a workspace inside its allowance', () => {
  it('may create and unarchive up to the allowance', () => {
    const posture = projectCapacityPosture({ activeProjects: 2, allowance: 3 });
    expect(posture.canCreateProject).toBe(true);
    expect(posture.canUnarchiveProject).toBe(true);
    expect(posture.remaining).toBe(1);
    expect(posture.overAllowance).toBe(false);
    expect(posture.noticeKey).toBeNull();
    expect(posture.refusalMessageKey).toBeNull();
  });

  it('refuses the next project exactly at the allowance', () => {
    const posture = projectCapacityPosture({ activeProjects: 3, allowance: 3 });
    expect(posture.canCreateProject).toBe(false);
    expect(posture.overAllowance).toBe(false);
    expect(posture.noticeKey).toBeNull();
    expect(posture.refusalMessageKey).toBe('error.project_limit_reached.message');
  });

  it('clamps a nonsense allowance rather than trusting it', () => {
    expect(projectCapacityPosture({ activeProjects: 0, allowance: 9_000 }).allowance).toBe(25);
    expect(projectCapacityPosture({ activeProjects: 0, allowance: 0 }).allowance).toBe(1);
  });
});
