import type { Logger } from '@relay/observability';

import type { PolarClient } from './client';
import { deriveEntitlement } from './entitlements';
import type { EntitlementSnapshot, EntitlementState, VerifiedSubscription } from './entitlements';
import { isFullAccess } from './entitlements';
import type { SubscriptionStore } from './inbox';
import { buildProjectAllowanceGrant } from './project-allowance';
import type { ProjectAllowanceGrant } from './project-allowance';
import { toVerifiedSubscription, workspaceIdOf } from './webhooks';
import type { Clock } from './time';
import { addDays, nowIso } from './time';

/**
 * Reconciliation.
 *
 * Webhook delivery is not the only source of truth and must never be treated as
 * such. Every fifteen minutes we re-read the subscriptions Polar has modified
 * since our cursor and repair any drift; a daily sweep compares every workspace
 * we know about. A drift that grants or removes full access alerts immediately.
 */

export const RECONCILIATION_INTERVAL_MINUTES = 15;
export const FULL_SWEEP_INTERVAL_HOURS = 24;

/** More than this many corrections in an hour pages the on-call engineer. */
export const DRIFT_PAGE_THRESHOLD_PER_HOUR = 5;

/** How far back the incremental pass looks when there is no stored cursor. */
export const INITIAL_LOOKBACK_DAYS = 2;

export const DRIFT_KINDS = [
  'status_changed',
  'entitlement_state_changed',
  'period_changed',
  'cancellation_changed',
  'missing_locally',
  'workspace_not_identified',
] as const;
export type DriftKind = (typeof DRIFT_KINDS)[number];

export interface DriftRecord {
  readonly subscriptionId: string;
  readonly workspaceId: string | null;
  readonly kinds: readonly DriftKind[];
  readonly storedStatus: string | null;
  readonly polarStatus: string;
  readonly storedEntitlement: EntitlementState | null;
  readonly repairedEntitlement: EntitlementState;
  /** True when the repair granted or removed full access. Alerts immediately. */
  readonly alert: boolean;
  readonly repaired: boolean;
  readonly detectedAt: string;
}

export interface ReconciliationReport {
  readonly startedAt: string;
  readonly finishedAt: string;
  readonly mode: 'incremental' | 'full_sweep';
  readonly checked: number;
  readonly drifts: readonly DriftRecord[];
  readonly repaired: number;
  readonly alerts: number;
  readonly shouldPage: boolean;
  /** Feed this back in as `since` on the next run. */
  readonly nextCursor: string;
}

export interface ReconcileDeps {
  readonly client: PolarClient;
  readonly subscriptions: SubscriptionStore;
  readonly clock: Clock;
  readonly logger?: Logger;
  /** Polar product id to tier key. Unmapped ids resolve to the base tier. */
  readonly productTiers?: Readonly<Record<string, string>>;
  /** Called for each repair so the caller can append an audit event. */
  readonly onDriftRepaired?: (drift: DriftRecord) => Promise<void> | void;
  /**
   * Called on every verified upsert with the numeric entitlement row migration
   * 0066 reads, so a repaired subscription repairs project capacity too.
   */
  readonly onProjectAllowance?: (grant: ProjectAllowanceGrant) => Promise<void> | void;
}

/** Emit the `projects.active.max` row for a subscription we just re-verified. */
async function publishProjectAllowance(
  deps: ReconcileDeps,
  subscription: VerifiedSubscription,
  effectiveFrom: string,
): Promise<void> {
  const grant = buildProjectAllowanceGrant({
    subscription,
    effectiveFrom,
    ...(deps.productTiers === undefined ? {} : { productTiers: deps.productTiers }),
  });
  if (grant !== null) {
    await deps.onProjectAllowance?.(grant);
  }
}

export interface ReconcileInput {
  /** Polar `modified_at` cursor from the previous run. */
  readonly since?: string;
  readonly mode?: 'incremental' | 'full_sweep';
  readonly pageLimit?: number;
  readonly maxPages?: number;
}

function classifyDrift(
  stored: VerifiedSubscription | null,
  next: VerifiedSubscription,
  storedSnapshot: EntitlementSnapshot | null,
  nextSnapshot: EntitlementSnapshot,
): DriftKind[] {
  if (stored === null) {
    return ['missing_locally'];
  }
  const kinds: DriftKind[] = [];
  if (stored.status !== next.status) {
    kinds.push('status_changed');
  }
  if (storedSnapshot !== null && storedSnapshot.state !== nextSnapshot.state) {
    kinds.push('entitlement_state_changed');
  }
  if (stored.currentPeriodEnd !== next.currentPeriodEnd) {
    kinds.push('period_changed');
  }
  if (stored.cancelAtPeriodEnd !== next.cancelAtPeriodEnd || stored.endedAt !== next.endedAt) {
    kinds.push('cancellation_changed');
  }
  return kinds;
}

/**
 * Re-read Polar and repair entitlement drift.
 *
 * Repair is the same derivation the webhook path uses, applied to the state
 * Polar reports right now, so a dropped webhook self-heals inside one cycle.
 */
export async function reconcileSubscriptions(
  deps: ReconcileDeps,
  input: ReconcileInput = {},
): Promise<ReconciliationReport> {
  const startedAt = nowIso(deps.clock);
  const mode = input.mode ?? 'incremental';
  const since =
    mode === 'full_sweep' ? undefined : (input.since ?? addDays(startedAt, -INITIAL_LOOKBACK_DAYS));
  const pageLimit = input.pageLimit ?? 100;
  const maxPages = input.maxPages ?? 50;

  const drifts: DriftRecord[] = [];
  let checked = 0;
  let repaired = 0;
  let alerts = 0;
  let page = 1;
  let latestModifiedAt = since ?? startedAt;

  for (let index = 0; index < maxPages; index += 1) {
    const result = await deps.client.listSubscriptions({
      ...(since === undefined ? {} : { modifiedSince: since }),
      limit: pageLimit,
      page,
    });

    for (const subscription of result.items) {
      checked += 1;
      if (subscription.modifiedAt > latestModifiedAt) {
        latestModifiedAt = subscription.modifiedAt;
      }
      const workspaceId = workspaceIdOf(subscription);
      const stored = await deps.subscriptions.getBySubscriptionId(subscription.id);
      if (workspaceId === null && stored === null) {
        drifts.push({
          subscriptionId: subscription.id,
          workspaceId: null,
          kinds: ['workspace_not_identified'],
          storedStatus: null,
          polarStatus: subscription.status,
          storedEntitlement: null,
          repairedEntitlement: 'none',
          alert: false,
          repaired: false,
          detectedAt: startedAt,
        });
        continue;
      }

      const resolvedWorkspaceId = workspaceId ?? stored?.workspaceId;
      if (resolvedWorkspaceId === undefined) {
        continue;
      }

      const next = toVerifiedSubscription({
        subscription,
        workspaceId: resolvedWorkspaceId,
        source: 'reconciliation',
        verifiedAt: startedAt,
        previous: stored,
      });
      const derivation = {
        now: startedAt,
        ...(deps.productTiers === undefined ? {} : { productTiers: deps.productTiers }),
      };
      const storedSnapshot = stored === null ? null : deriveEntitlement(stored, derivation);
      const nextSnapshot = deriveEntitlement(next, derivation);
      const kinds = classifyDrift(stored, next, storedSnapshot, nextSnapshot);
      if (kinds.length === 0) {
        continue;
      }

      const grantedOrRemovedFull =
        storedSnapshot === null
          ? isFullAccess(nextSnapshot.state)
          : isFullAccess(storedSnapshot.state) !== isFullAccess(nextSnapshot.state);

      await deps.subscriptions.upsert(next);
      await publishProjectAllowance(deps, next, startedAt);
      repaired += 1;
      if (grantedOrRemovedFull) {
        alerts += 1;
      }
      const drift: DriftRecord = {
        subscriptionId: subscription.id,
        workspaceId: resolvedWorkspaceId,
        kinds,
        storedStatus: stored?.status ?? null,
        polarStatus: subscription.status,
        storedEntitlement: storedSnapshot?.state ?? null,
        repairedEntitlement: nextSnapshot.state,
        alert: grantedOrRemovedFull,
        repaired: true,
        detectedAt: startedAt,
      };
      drifts.push(drift);
      await deps.onDriftRepaired?.(drift);
      if (grantedOrRemovedFull) {
        deps.logger?.warn(
          {
            subscriptionId: subscription.id,
            workspaceId: resolvedWorkspaceId,
            from: storedSnapshot?.state ?? null,
            to: nextSnapshot.state,
          },
          'billing.reconcile.entitlement_drift',
        );
      }
    }

    if (result.nextPage === null) {
      break;
    }
    page = result.nextPage;
  }

  const finishedAt = nowIso(deps.clock);
  return {
    startedAt,
    finishedAt,
    mode,
    checked,
    drifts,
    repaired,
    alerts,
    shouldPage: drifts.length > DRIFT_PAGE_THRESHOLD_PER_HOUR,
    nextCursor: latestModifiedAt,
  };
}

/**
 * A single workspace, checked on demand. The checkout return page calls this
 * when the webhook has not landed within the poll window, which is what closes
 * the gap for a customer staring at a pending screen.
 */
export async function reconcileWorkspace(
  deps: ReconcileDeps,
  input: { workspaceId: string; subscriptionId?: string },
): Promise<EntitlementSnapshot> {
  const now = nowIso(deps.clock);
  const derivation = {
    now,
    ...(deps.productTiers === undefined ? {} : { productTiers: deps.productTiers }),
  };
  const stored =
    input.subscriptionId === undefined
      ? await deps.subscriptions.getByWorkspaceId(input.workspaceId)
      : await deps.subscriptions.getBySubscriptionId(input.subscriptionId);
  const subscriptionId = input.subscriptionId ?? stored?.subscriptionId;
  if (subscriptionId === undefined) {
    return deriveEntitlement(null, derivation);
  }
  const remote = await deps.client.getSubscription(subscriptionId);
  if (remote === null) {
    return deriveEntitlement(stored, derivation);
  }
  const workspaceId = workspaceIdOf(remote) ?? stored?.workspaceId ?? input.workspaceId;
  const next = toVerifiedSubscription({
    subscription: remote,
    workspaceId,
    source: 'reconciliation',
    verifiedAt: now,
    previous: stored,
  });
  await deps.subscriptions.upsert(next);
  await publishProjectAllowance(deps, next, now);
  return deriveEntitlement(next, derivation);
}
